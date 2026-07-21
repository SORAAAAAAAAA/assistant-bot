import type { ChatRequest, ChatResponse } from "@ai-assistant/shared";
import { fetchWithAuth } from "@/lib/fetchClient";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function chatService(message: ChatRequest): Promise<ChatResponse> {

    const chatResponse = await fetchWithAuth(baseURL + '/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    const data = await chatResponse.json();

    if (!chatResponse.ok) {
        throw new Error(data.message);
    }

    return data;
}
