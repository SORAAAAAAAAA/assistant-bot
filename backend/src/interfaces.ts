export interface RAGDocument {
    docId: string;
    text: string;
    source: string;
}

export interface RAGQuery {
    query: string;
    topK?: number;
}
