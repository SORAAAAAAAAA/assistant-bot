import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { RagService } from '../rag/rag.service';
import { IntentRouterService } from '../intent/intent.service';
import { ChatHistoryEntry } from '@ai-assistant/shared';
import { SystemPrompt } from "@/chat/chat.prompt";
@Injectable()
export class ChatService {
    constructor(
        private rag: RagService,
        private intentRouter: IntentRouterService,
        private prisma: PrismaService,
    ) { }
    async askStream(userId: number, message: string, res: any): Promise<void> {
        let contextText = '';
        let sourceNames: string[] = [];

        // Short-circuit RAG if this is just simple chitchat/greeting
        if (!this.intentRouter.isChitChat(message)) {
            const { chunks, sources } = await this.rag.retrieveContext(message);
            contextText = chunks.join('\n\n');
            sourceNames = sources;
        }

        const prompt = `${SystemPrompt}\n\n<context>\n${contextText}\n</context>\n\nEmployee question: ${message}`;

        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
            // Send the initial chunk with the sources right away
            res.write(JSON.stringify({ answer: '', sources: sourceNames }) + '\n');

            const ollamaRes = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                model: process.env.CHAT_MODEL ?? 'qwen2.5:3b',
                prompt,
                stream: true,
                options: {
                    num_predict: 2048,
                    temperature: 0.0, // 0.0 forces the AI to be completely deterministic, stopping hallucinations
                    top_k: 10,        // Limits word choices to the 10 most likely words
                    top_p: 0.5,       // Discards weird/creative word choices
                }
            }, {
                responseType: 'stream'
            });

            let fullAnswer = '';
            let buffer = '';

            ollamaRes.data.on('data', (chunk: Buffer) => {
                buffer += chunk.toString('utf8');
                const lines = buffer.split('\n');

                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim() === '') continue;
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.response) {
                            res.write(JSON.stringify({ answer: parsed.response, sources: [] }) + '\n');
                            fullAnswer += parsed.response;
                        }
                    } catch (e) {
                        // Ignore partial or malformed lines
                    }
                }
            });

            ollamaRes.data.on('end', async () => {
                if (buffer.trim() !== '') {
                    try {
                        const parsed = JSON.parse(buffer);
                        if (parsed.response) {
                            res.write(JSON.stringify({ answer: parsed.response, sources: [] }) + '\n');
                            fullAnswer += parsed.response;
                        }
                    } catch (e) { }
                }

                try {
                    await this.prisma.chatHistory.create({
                        data: {
                            userId,
                            message,
                            answer: fullAnswer,
                            sources: sourceNames,
                        },
                    });
                } catch (dbError) {
                    console.error('Failed to save chat history', dbError);
                } finally {
                    res.end();
                }
            });

            ollamaRes.data.on('error', (err: any) => {
                console.error('Ollama stream error', err);
                res.end();
            });

        } catch (error) {
            console.error('Error connecting to Ollama', error);
            res.status(500).end('Internal Server Error');
        }
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
