import type { ChatRequest, ChatResponse } from "@ai-assistant/shared";

const baseURL = process.env.VITE_BASE_URL;

export async function chatService(formData: ChatRequest): Promise<ChatResponse> {

    const chatResponse = await fetch(baseURL + '/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await chatResponse.json();

    if (!chatResponse.ok) {
        throw new Error(data.message);
    }

    return data;
}
