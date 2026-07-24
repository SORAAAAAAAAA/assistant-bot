import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '@/prisma/prisma.service';
import { OllamaService } from '@/llm/ollama.service';
import { RagService } from '@/rag/rag.service';
import { IntentRouterService } from '@/intent/intent.service';
import { ChatHistoryEntry } from '@ai-assistant/shared';
import { SystemPrompt } from "@/chat/chat.prompt";
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

        if (!this.intentRouter.isChitChat(message)) {
            const result = await this.rag.retrieveContext(message);
            chunks = result.chunks;
            sources = result.sources;
        }
        const contextText = chunks.join('\n\n');
        const prompt = `${SystemPrompt}\n\n<context>\n${contextText}\n</context>\n\nEmployee question: ${message}`;
        onMessage({ answer: '', sources: sources });
        await this.llm.generateStream(prompt,
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
