import { DepartmentType } from "@ai-assistant/shared";

export interface RAGDocument {
    docId: string;
    text: string;
    source: string;
}

export interface RAGQuery {
    query: string;
    topK?: number;
}

export interface ILlmProvider {
    generateStream(
        messages: { role: string, content: string }[],
        onMessage: (chunk: string) => void,
        onComplete: (fullAnswer: string) => void,
        onError: (err: any) => void,
    ): Promise<void>;
}