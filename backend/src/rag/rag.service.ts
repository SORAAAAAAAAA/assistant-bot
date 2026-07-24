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
    chunkText(text: string, maxChunkSize = 1500): string[] {
        const chunks: string[] = [];

        function splitRecursive(textToSplit: string) {
            if (textToSplit.length <= maxChunkSize) {
                chunks.push(textToSplit);
                return;
            }
            const separators = ['\n\n', '\n', '. ', ' '];
            let splitPoints: string[] = [];
            for (const sep of separators) {
                const parts = textToSplit.split(sep);
                if (parts.length > 1) {
                    splitPoints = parts.map((p, i) => i === parts.length - 1 ? p : p + sep);
                    break;
                }
            }
            if (splitPoints.length === 0) {
                chunks.push(textToSplit.substring(0, maxChunkSize));
                splitRecursive(textToSplit.substring(maxChunkSize));
                return;
            }

            let currentChunk = '';
            for (const part of splitPoints) {
                if ((currentChunk.length + part.length) > maxChunkSize && currentChunk.length > 0) {
                    chunks.push(currentChunk.trim());
                    currentChunk = part;
                } else {
                    currentChunk += part;
                }
            }
            if (currentChunk.trim().length > 0) {
                chunks.push(currentChunk.trim());
            }
        }

        splitRecursive(text);
        return chunks.filter(c => c.length > 0);
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
    async retrieveContext(query: string, topK = 5): Promise<{ chunks: string[], sources: string[] }> {
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