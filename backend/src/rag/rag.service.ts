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
    chunkText(text: string, chunkSize = 250, overlap = 50): string[] {
        const words = text.split(/\s+/);
        const chunks: string[] = [];
        let i = 0;
        while (i < words.length) {
            chunks.push(words.slice(i, i + chunkSize).join(' '));
            i += chunkSize - overlap;
        }
        return chunks;
    }
    async addDocument(docId: string, text: string, source: string) {
        const collection = await this.getCollection();
        const chunks = this.chunkText(text);
        for (let idx = 0; idx < chunks.length; idx++) {
            const embedding = await this.getEmbedding(chunks[idx]);
            await collection.add({
                ids: [`${docId}-${idx}`],
                embeddings: [embedding],
                documents: [chunks[idx]],
                metadatas: [{ source }],
            });
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

        const chunks = docs.filter((doc): doc is string => doc !== null);

        // Extract the filename/source from metadata and remove duplicates
        const rawSources = metas.map(m => m ? m.source as string : 'Unknown Source');
        const sources = Array.from(new Set(rawSources));

        return { chunks, sources };
    }
}