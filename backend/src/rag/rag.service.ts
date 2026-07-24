import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ChromaClient, Collection } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';

@Injectable()
export class RagService {
    private embedder = new DefaultEmbeddingFunction();

    private client = new ChromaClient({
        ssl: false,
        host: process.env.CHROMA_URL,
        port: Number(process.env.CHROMA_PORT),
    });
    private collection: Collection;
    private async getCollection(): Promise<Collection> {
        if (!this.collection) {
            this.collection = await this.client.getOrCreateCollection({
                name: 'procedures',
                embeddingFunction: this.embedder
            });
        }
        return this.collection;
    }
    async getEmbedding(text: string): Promise<number[]> {
        const res = await axios.post(`${process.env.OLLAMA_URL}/api/embeddings`, {
            model: process.env.EMBED_MODEL,
            prompt: text,
        });
        return res.data.embedding;
    }
    chunkText(text: string, maxChunkSize = 1500, overlapSize = 300): string[] {
        // Clean up PDF artifacts: replace single newlines with spaces, but keep double newlines (paragraphs)
        const cleanedText = text
            .replace(/\r\n/g, '\n')
            .replace(/(?<!\n)\n(?!\n)/g, ' ') // replace single newlines with space
            .replace(/\n{3,}/g, '\n\n') // normalize multiple newlines to double
            .trim();

        const chunks: string[] = [];
        const separators = ['\n\n', '. ', ', ', ' '];

        function splitRecursive(textToSplit: string) {
            if (textToSplit.length <= maxChunkSize) {
                if (textToSplit.trim().length > 0) chunks.push(textToSplit.trim());
                return;
            }

            let splitIndex = -1;
            // Try to find the best separator within the maxChunkSize
            for (const sep of separators) {
                const lastIdx = textToSplit.lastIndexOf(sep, maxChunkSize);
                if (lastIdx > 0) {
                    splitIndex = lastIdx + sep.length;
                    break;
                }
            }

            // Fallback if no separator found
            if (splitIndex === -1) {
                splitIndex = maxChunkSize;
            }

            const chunk = textToSplit.substring(0, splitIndex).trim();
            if (chunk.length > 0) {
                chunks.push(chunk);
            }

            // Slide window back by overlapSize for the next chunk to preserve context.
            // MUST ensure nextStartIndex > 0 to avoid infinite recursion!
            let nextStartIndex = splitIndex - overlapSize;
            if (nextStartIndex <= 0) {
                nextStartIndex = splitIndex; // If chunk was very small, don't overlap to avoid getting stuck
            }

            splitRecursive(textToSplit.substring(nextStartIndex));
        }

        splitRecursive(cleanedText);
        return chunks;
    }
    async addDocument(docId: string, text: string, source: string) {
        const collection = await this.getCollection();
        const chunks = this.chunkText(text);
        const batchSize = 5;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            await Promise.all(batch.map(async (chunk, idx) => {
                const globalIdx = i + idx;
                const embedding = await this.getEmbedding(chunk);
                await collection.add({
                    ids: [`${docId}-${globalIdx}`],
                    embeddings: [embedding],
                    documents: [chunk],
                    metadatas: [{ source }],
                });
            }));
        }
    }
    async retrieveContext(query: string, topK = 4): Promise<{ chunks: string[], sources: string[] }> {
        const collection = await this.getCollection();
        const queryEmbedding = await this.getEmbedding(query);
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: topK,
        });

        const docs = results.documents?.[0] ?? [];
        const metas = results.metadatas?.[0] ?? [];

        const chunks = docs.filter(doc => doc !== null) as string[];
        const rawSources = metas.map(meta => meta ? meta.source as string : 'Unknown Source');
        const sources = Array.from(new Set(rawSources));

        return { chunks, sources };
    }
}