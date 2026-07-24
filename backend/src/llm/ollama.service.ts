import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ILlmProvider } from '@/interfaces';
import { XmlStreamParser } from './xml-stream-parser';

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
                        num_predict: 2048,
                        temperature: 0.0,
                        top_k: 10,
                        top_p: 0.5,
                    }
                }, { responseType: 'stream' });

                const parser = new XmlStreamParser(onMessage);
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
                                parser.processChunk(parsed.message.content);
                            }
                        } catch (e) { }
                    }
                });

                ollamaRes.data.on('end', () => {
                    if (buffer.trim() !== '') {
                        try {
                            const parsed = JSON.parse(buffer);
                            if (parsed.message && parsed.message.content) {
                                parser.processChunk(parsed.message.content);
                            }
                        } catch (e) { }
                    }

                    const cleanEmitted = parser.getCleanEmitted();
                    const rawOutput = parser.getRawOutput();

                    // Fallback: If the model failed to output <response> tags entirely
                    if (cleanEmitted.length === 0 && rawOutput.trim().length > 0) {
                        // Strip scratchpad if it exists, otherwise dump the raw output
                        const fallbackText = rawOutput.replace(/<scratchpad>[\s\S]*?<\/scratchpad>/, '').trim();
                        if (fallbackText) {
                            onMessage(fallbackText);
                        }
                        onComplete(fallbackText);
                    } else {
                        // Ensure the database only saves the clean, extracted answer
                        onComplete(cleanEmitted);
                    }
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