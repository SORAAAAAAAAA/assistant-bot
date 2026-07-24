import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ILlmProvider } from '@/interfaces';

@Injectable()
export class OllamaService implements ILlmProvider {
    async generateStream(
        messages: { role: string, content: string }[],
        onMessage: (chunk: string) => void,
        onComplete: (fullAnswer: string) => void,
        onError: (err: any) => void
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const ollamaRes = await axios.post(`${process.env.OLLAMA_URL}/api/chat`, {
                    model: process.env.CHAT_MODEL ?? 'qwen2.5:7b',
                    messages: messages,
                    stream: true,
                    options: {
                        num_ctx: 4096,
                        num_predict: 512,
                        temperature: 0.0,
                        top_k: 10,
                        top_p: 0.5,
                    }
                }, { responseType: 'stream' });

                let fullText = '';
                let buffer = '';

                ollamaRes.data.on('data', (chunk: Buffer) => {
                    buffer += chunk.toString('utf8');
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim() === '') continue;
                        try {
                            const parsed = JSON.parse(line);
                            if (parsed.message && parsed.message.content) {
                                fullText += parsed.message.content;
                                onMessage(parsed.message.content);
                            }
                        } catch (e) { }
                    }
                });

                ollamaRes.data.on('end', () => {
                    if (buffer.trim() !== '') {
                        try {
                            const parsed = JSON.parse(buffer);
                            if (parsed.message && parsed.message.content) {
                                fullText += parsed.message.content;
                                onMessage(parsed.message.content);
                            }
                        } catch (e) { }
                    }
                    onComplete(fullText.trim());
                    resolve();
                });

                ollamaRes.data.on('error', (err: any) => {
                    onError(err);
                    reject(err);
                });
            } catch (error) {
                onError(error);
                reject(error);
            }
        });
    }
}