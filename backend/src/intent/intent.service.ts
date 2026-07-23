import { Injectable } from '@nestjs/common';

@Injectable()
export class IntentRouterService {
    // A regular expression to match common greetings, pleasantries, and simple chitchat.
    // We anchor it to ensure the WHOLE message is essentially just a greeting,
    // avoiding false positives if they ask "hi, what is the procedure for X?"
    // However, if they just say "hi" or "thank you so much", this catches it.
    private chitChatRegex = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|thanks|thank you|who are you|what can you do|how are you|bye|goodbye)[\s!?.]*$/i;

    /**
     * Determines if the user's message is simple chitchat that does not require RAG context.
     * @param message The raw user input message.
     * @returns boolean True if it's chitchat, False if it needs RAG.
     */
    isChitChat(message: string): boolean {
        if (!message) return false;
        
        const normalized = message.trim().toLowerCase();
        
        // Exact match or strong regex match
        return this.chitChatRegex.test(normalized);
    }
}
