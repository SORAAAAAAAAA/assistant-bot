import type { ChatResponse } from "@ai-assistant/shared";

export const formatAiResponse = (res: ChatResponse) => {
    let text = res.answer;
    if (res.sources && res.sources.length > 0) {
        text += '\n\nSources:\n' + res.sources.map(s => `• ${s}`).join('\n');
    }
    return text;
};