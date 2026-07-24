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
    async retrieveContext(query: string, topK = 7, finalK = 2): Promise<{ chunks: string[], sources: string[] }> {
        const collection = await this.getCollection();
        const queryEmbedding = await this.getEmbedding(query);
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: topK,
        });

        const docs = results.documents?.[0] ?? [];
        const metas = results.metadatas?.[0] ?? [];

        // Stage 2: Lexical Re-ranking
        // Extract meaningful keywords from the query (ignore punctuation and small words)
        const queryTerms = query.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(t => t.length > 2);

        const scoredDocs = docs.map((doc, index) => {
            if (!doc) return { doc: '', meta: null, score: -999 };
            const docLower = doc.toLowerCase();
            let overlapScore = 0;
            
            for (const term of queryTerms) {
                if (docLower.includes(term)) {
                    // Boost score for exact term match
                    overlapScore += 1;
                }
            }
            
            // Combine with Chroma's original semantic rank.
            // Since index 0 is the best semantic match, we subtract a small penalty for lower ranks.
            // This ensures that if overlap is equal, the better semantic match wins.
            const finalScore = overlapScore - (index * 0.1);
            
            return { doc, meta: metas[index], score: finalScore };
        }).filter(d => d.doc !== '');

        // Sort by highest score first
        scoredDocs.sort((a, b) => b.score - a.score);

        // Stage 3: Payload Reduction
        const topDocs = scoredDocs.slice(0, finalK);

        const chunks = topDocs.map(d => d.doc);
        const rawSources = topDocs.map(d => d.meta ? d.meta.source as string : 'Unknown Source');
        const sources = Array.from(new Set(rawSources));

        return { chunks, sources };
    }
}