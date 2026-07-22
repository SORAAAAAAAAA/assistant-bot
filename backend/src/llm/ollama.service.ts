import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ILlmProvider } from '@/interfaces';

@Injectable()
export class OllamaService implements ILlmProvider {
    async generateStream(
        prompt: string,
        onMessage: (chunk: string) => void,
        onComplete: (fullAnswer: string) => void,
        onError: (err: any) => void
    ): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const ollamaRes = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                    model: process.env.CHAT_MODEL ?? 'qwen2.5:3b',
                    prompt,
                    stream: true,
                    options: {
                        num_predict: 2048,
                        temperature: 0.0,
                        top_k: 10,
                        top_p: 0.5,
                    }
                }, { responseType: 'stream' });

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
                                onMessage(parsed.response);
                                fullAnswer += parsed.response;
                            }
                        } catch (e) { }
                    }
                });

                ollamaRes.data.on('end', () => {
                    if (buffer.trim() !== '') {
                        try {
                            const parsed = JSON.parse(buffer);
                            if (parsed.response) {
                                onMessage(parsed.response);
                                fullAnswer += parsed.response;
                            }
                        } catch (e) { }
                    }
                    onComplete(fullAnswer);
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
