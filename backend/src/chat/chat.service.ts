import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '@/prisma/prisma.service';
import { OllamaService } from '@/llm/ollama.service';
import { RagService } from '@/rag/rag.service';
import { IntentRouterService } from '@/intent/intent.service';
import { ChatHistoryEntry } from '@ai-assistant/shared';
import { ChitChatSystemPrompt, RagSystemPrompt } from "@/chat/chat.prompt";
@Injectable()
export class ChatService {
    constructor(
        private rag: RagService,
        private intentRouter: IntentRouterService,
        private prisma: PrismaService,
        private llm: OllamaService,
    ) { }
    async askStream(
        userId: number,
        message: string,
        sessionId: number | undefined,
        onMessage: (data: any) => void,
        onComplete: () => void,
        onError: (err: any) => void
    ): Promise<void> {
        let chunks: string[] = [];
        let sources: string[] = [];

        const isChitChat = this.intentRouter.isChitChat(message);
        if (!isChitChat) {
            const result = await this.rag.retrieveContext(message);
            chunks = result.chunks;
            sources = result.sources;
        }
        // --- Context Budget Guard ---
        // Prevents context window overflow by trimming chunks that won't fit.
        const NUM_CTX = 8192;
        const NUM_PREDICT = 2048;
        const CHARS_PER_TOKEN = 4;
        const INPUT_BUDGET = NUM_CTX - NUM_PREDICT;
        const systemTokens = Math.ceil(RagSystemPrompt.length / CHARS_PER_TOKEN);
        const userWrapperTokens = Math.ceil((message.length + 120) / CHARS_PER_TOKEN);
        
        // Let's fetch history if sessionId exists
        let historyMessages: any[] = [];
        if (sessionId) {
            const previousMessages = await this.prisma.chatMessage.findMany({
                where: { sessionId },
                orderBy: { createdAt: 'asc' },
                take: 10, // Take the last 10 messages to limit context
            });
            historyMessages = previousMessages.map(m => ({ role: m.role, content: m.content }));
        }

        const historyTokens = historyMessages.reduce((acc, m) => acc + Math.ceil(m.content.length / CHARS_PER_TOKEN), 0);
        
        const reservedTokens = systemTokens + userWrapperTokens + historyTokens;
        const chunkBudget = INPUT_BUDGET - reservedTokens;

        let usedTokens = 0;
        const budgetedChunks: string[] = [];
        if (chunkBudget > 0) {
            for (const chunk of chunks) {
                const chunkTokens = Math.ceil(chunk.length / CHARS_PER_TOKEN);
                if (usedTokens + chunkTokens > chunkBudget) {
                    console.log(`[Budget Guard] Dropping chunk (${chunkTokens} tokens) — would exceed budget (${usedTokens}/${chunkBudget} used)`);
                    continue;
                }
                budgetedChunks.push(chunk);
                usedTokens += chunkTokens;
            }
        }
        console.log(`[Budget Guard] Using ${budgetedChunks.length}/${chunks.length} chunks (${usedTokens}/${chunkBudget} token budget)`);

        const contextText = budgetedChunks.join('\n\n');
        
        const userContent = isChitChat
            ? `<employee_inquiry>\n${message}\n</employee_inquiry>`
            : `Here are the standard operating procedures:\n<standard_operating_procedures>\n${contextText}\n</standard_operating_procedures>\n\nBased ONLY on the procedures above, please answer the following inquiry:\n<employee_inquiry>\n${message}\n</employee_inquiry>\n\nIMPORTANT: You MUST start your response with <think> to show your reasoning process!`;

        const systemPromptToUse = isChitChat ? ChitChatSystemPrompt : RagSystemPrompt;

        const messages = [
            { role: 'system', content: systemPromptToUse },
            ...historyMessages,
            { role: 'user', content: userContent }
        ];

        onMessage({ answer: '', sources: sources });
        await this.llm.generateStream(messages,
            (chunk) => onMessage({ answer: chunk, sources: [] }),
            async (fullAnswer) => {
                try {
                    let currentSessionId = sessionId;
                    if (!currentSessionId) {
                        const newSession = await this.prisma.chatSession.create({
                            data: {
                                userId,
                                title: message.substring(0, 30) + (message.length > 30 ? '...' : '')
                            }
                        });
                        currentSessionId = newSession.id;
                    }

                    // Save user message
                    await this.prisma.chatMessage.create({
                        data: {
                            sessionId: currentSessionId,
                            role: 'user',
                            content: message,
                            sources: []
                        }
                    });

                    // Save assistant message
                    await this.prisma.chatMessage.create({
                        data: {
                            sessionId: currentSessionId,
                            role: 'assistant',
                            content: fullAnswer,
                            sources: sources
                        }
                    });

                    onMessage({ sessionId: currentSessionId, chatId: currentSessionId });
                } catch (dbError) {
                    console.error('Failed to save chat history', dbError);
                }
                onComplete();
            },
            (err) => onError(err)
        );
    }
    async getHistory(userId: number) {
        const rows = await this.prisma.chatSession.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        return rows.map((row) => ({
            id: row.id,
            title: row.title,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
        }));
    }

    async getHistoryById(userId: number, id: number) {
        const row = await this.prisma.chatSession.findFirst({
            where: { id, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        if (!row) return null;
        return {
            id: row.id,
            title: row.title,
            messages: row.messages.map(m => ({
                id: m.id,
                sessionId: m.sessionId,
                role: m.role,
                content: m.content,
                sources: m.sources,
                createdAt: m.createdAt.toISOString()
            })),
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
        };
    }
}
