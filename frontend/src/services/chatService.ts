import type { ChatRequest, ChatResponse } from "@ai-assistant/shared";
import { fetchWithAuth } from "@/lib/fetchClient";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function chatService(message: ChatRequest, onChunk: (chunk: ChatResponse) => void): Promise<void> {

    const chatResponse = await fetchWithAuth(baseURL + '/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    if (!chatResponse.ok) {
        const errorData = await chatResponse.json().catch(() => ({ message: 'Network response was not ok' }));
        throw new Error(errorData.message || 'Error connecting to chat service');
    }

    if (!chatResponse.body) {
        throw new Error('ReadableStream not supported by the browser.');
    }

    const reader = chatResponse.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const parsed = JSON.parse(line) as ChatResponse;
                        onChunk(parsed);
                    } catch (e) {
                        console.error('Failed to parse chunk line', line);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

export async function getChatHistory() {
    const response = await fetchWithAuth(`${baseURL}/chat/history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch chat history');
    }

    return response.json();
}

export async function getChatHistoryById(id: number) {
    const response = await fetchWithAuth(`${baseURL}/chat/history/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch chat history by id');
    }

    return response.json();
}

