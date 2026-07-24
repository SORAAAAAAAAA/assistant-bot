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
        const CHARS_PER_TOKEN = 4;  // conservative estimate for English text
        const INPUT_BUDGET = NUM_CTX - NUM_PREDICT; // tokens available for the entire input
        const systemTokens = Math.ceil(RagSystemPrompt.length / CHARS_PER_TOKEN);
        const userWrapperTokens = Math.ceil((message.length + 120) / CHARS_PER_TOKEN); // 120 chars for XML tags + wrapper text
        const reservedTokens = systemTokens + userWrapperTokens;
        const chunkBudget = INPUT_BUDGET - reservedTokens;

        let usedTokens = 0;
        const budgetedChunks: string[] = [];
        for (const chunk of chunks) {
            const chunkTokens = Math.ceil(chunk.length / CHARS_PER_TOKEN);
            if (usedTokens + chunkTokens > chunkBudget) {
                console.log(`[Budget Guard] Dropping chunk (${chunkTokens} tokens) — would exceed budget (${usedTokens}/${chunkBudget} used)`);
                continue;
            }
            budgetedChunks.push(chunk);
            usedTokens += chunkTokens;
        }
        console.log(`[Budget Guard] Using ${budgetedChunks.length}/${chunks.length} chunks (${usedTokens}/${chunkBudget} token budget)`);

        const contextText = budgetedChunks.join('\n\n');
        console.log('--- RETRIEVED CHUNKS ---');
        console.log(contextText);
        console.log('------------------------');
        
        const userContent = isChitChat
            ? `<employee_inquiry>\n${message}\n</employee_inquiry>`
            : `Here are the standard operating procedures:\n<standard_operating_procedures>\n${contextText}\n</standard_operating_procedures>\n\nBased ONLY on the procedures above, please answer the following inquiry:\n<employee_inquiry>\n${message}\n</employee_inquiry>\n\nIMPORTANT: You MUST start your response with <think> to show your reasoning process!`;

        const systemPromptToUse = isChitChat ? ChitChatSystemPrompt : RagSystemPrompt;

        const messages = [
            { role: 'system', content: systemPromptToUse },
            { role: 'user', content: userContent }
        ];
        onMessage({ answer: '', sources: sources });
        await this.llm.generateStream(messages,
            (chunk) => onMessage({ answer: chunk, sources: [] }),
            async (fullAnswer) => {
                try {
                    await this.prisma.chatHistory.create({
                        data: { userId, message, answer: fullAnswer, sources: sources },
                    });
                } catch (dbError) {
                    console.error('Failed to save chat history', dbError);
                }
                onComplete();
            },
            (err) => onError(err)
        );
    }
    async getHistory(userId: number): Promise<ChatHistoryEntry[]> {
        const rows = await this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => ({
            id: row.id,
            message: row.message,
            answer: row.answer,
            sources: row.sources,
            createdAt: row.createdAt.toISOString(),
        }));
    }
}
