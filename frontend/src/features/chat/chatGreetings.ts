export const AI_GREETINGS: ((name?: string) => string)[] = [
    (name) => name ? `Hello ${name}, let's start` : "Start Chatting",
    (name) => name ? `How can I help, ${name}?` : "How can I help?",
    (name) => name ? `Ask me anything, ${name}` : "Ask me anything",
    (name) => name ? `${name}, ready to assist` : "Ready to assist",
    (name) => name ? `What's on your mind, ${name}?` : "What's on your mind?",
    (name) => name ? `Need assistance, ${name}?` : "Need assistance?",
    (name) => name ? `Let's get started, ${name}` : "Let's get started",
    (name) => name ? `How can I support you, ${name}?` : "How can I support you?",
    (name) => name ? `${name}, ask about procedures` : "Ask about procedures",
    (name) => name ? `Here to help, ${name}` : "Here to help"
];

/**
 * Returns a randomly selected greeting from the AI_GREETINGS list.
 * Follows the Single Responsibility Principle by encapsulating 
 * greeting generation logic away from the UI components.
 */
export function getRandomGreeting(name?: string): string {
    if (AI_GREETINGS.length === 0) return name ? `Hello ${name}` : "Start Chatting";
    const randomIndex = Math.floor(Math.random() * AI_GREETINGS.length);
    return AI_GREETINGS[randomIndex](name);
}
