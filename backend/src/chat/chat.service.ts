import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { RagService } from '../rag/rag.service';
import { ChatResponse, ChatHistoryEntry } from '@ai-assistant/shared';
import { SystemPrompt } from "@/chat/chat.prompt";
@Injectable()
export class ChatService {
    constructor(
        private rag: RagService,
        private prisma: PrismaService,
    ) { }
    async ask(userId: number, message: string): Promise<ChatResponse> {
        const contextChunks = await this.rag.retrieveContext(message);
        const contextText = contextChunks.join('\n\n');
        const prompt = `${SystemPrompt} \n\n Procedure excerpts: \n\n${contextText} \n\n Employee question: ${message}`;
        const res = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
            model: process.env.CHAT_MODEL ?? 'qwen2.5:7b',
            prompt,
            stream: false,
        });
        const answer: string = res.data.response;
        // Persist this exchange, tied to the employee who asked it
        await this.prisma.chatHistory.create({
            data: {
                userId,
                message,
                answer,
                sources: contextChunks,
            },
        });
        return { answer, sources: contextChunks };
    }
    async getHistory(userId: number, limit = 50): Promise<ChatHistoryEntry[]> {
        const rows = await this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: limit,
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
