import { useState, useRef, useEffect } from 'react';
import { ChatMessageList } from '@/features/chat/chatv2/messageList';
import { MessageComposer } from '@/features/chat/MessageComposer';
import type { Message } from '@/types';
// import { chatService } from '@/services/chatService';
import type { ChatRequest, ChatResponse } from '@ai-assistant/shared';
import { formatAiResponse } from "@/lib/aiFormatter"

// TEMP MOCK — remove once backend is live, swap back to chatService import above
const mockChatService = async (message: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 700));
    return `Sure — I can help draft an AI response for a procedural inquiry. Since you didn’t provide the specific procedure or situation, here is a general professional template you can adapt:

Thank you for your inquiry.

Regarding the procedure you asked about, please follow the steps outlined below:

• Review the applicable requirements and ensure that all necessary documents or information are prepared.
• Submit the required materials through the designated channel or office.
• Allow the appropriate processing period for review and verification.
• You will be notified of the outcome or any additional actions required.

If you need further clarification or assistance with any step of the process, please provide the relevant details of your request, and we will be glad to assist you.

If you share the specific procedure (e.g., HR request, legal process, government application, academic inquiry, customer support issue), I can tailor the response to that context.`;
};

export default function UIApp() {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const composerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const jumpToResponse = (relatedId?: number) => {
        if (!relatedId) return;

        const container = scrollRef.current;
        const element = document.getElementById(`msg-${relatedId}`);

        if (element && container) {
            const elementRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top;

            const targetScroll = container.scrollTop + relativeTop - (container.clientHeight / 2) + (element.clientHeight / 2);

            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const uId = Date.now();
        const aId = uId + 1;

        const userMsg: Message = {
            id: uId, role: 'user', content: input,
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            // MOCK — replace with real call once backend is ready:
            // const response = await chatService({ message: input } as ChatRequest);
            // const reply: Message = { id: aId, role: 'assistant', content: formatAiResponse(response) };
            const mockText = await mockChatService(input);
            const reply: Message = {
                id: aId, role: 'assistant',
                content: mockText
            };
            setMessages(prev => [...prev, reply]);
            setIsTyping(false);

        } catch (error) {
            console.error('Error:', error);
            setIsTyping(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#E5E7EB] fixed top-0 left-0 overflow-hidden font-['Inter',system-ui,sans-serif]">
            {/* Base Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] opacity-50" />
            
            {/* Ambient Red Glow Layers - Only shown before chat starts */}
            {messages.length === 0 && (
                <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-red-600/40 blur-[120px] rounded-full pointer-events-none animate-pulse transition-opacity duration-500" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-red-500/50 blur-[70px] rounded-full pointer-events-none transition-opacity duration-500" />
                </>
            )}
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
        body { margin: 0; padding: 0; overflow: hidden; }
        @keyframes popIn { 0% { opacity: 0; transform: translateY(8px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes blinkRed { 0%, 100% { color: #6B7280; } 50% { color: #E23B4E; } }
        @keyframes glowRed {
          0% { box-shadow: 0 0 0 0 rgba(226, 59, 78, 0.4); border-color: rgba(226, 59, 78, 0.2); }
          50% { box-shadow: 0 0 15px 4px rgba(226, 59, 78, 0.5); border-color: rgba(226, 59, 78, 0.8); }
          100% { box-shadow: 0 0 0 0 rgba(226, 59, 78, 0.4); border-color: rgba(226, 59, 78, 0.2); }
        }
      `}</style>

            {/* Main Container - single column, full-height chat feed */}
            <div className="flex flex-col h-full w-full max-w-[790px] mx-auto px-6 pt-8 pb-8 gap-4 relative z-[1] box-border">

                {/* SCROLLABLE MESSAGE FEED */}
                <div className="flex-1 min-h-0 flex flex-col">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.6s_ease-out_forwards]">
                            <p className="text-[10px] font-bold text-[#E23B4E] uppercase tracking-[0.4em] font-['JetBrains_Mono',monospace]">Ready</p>
                            <p className="text-[24px] font-black text-[#1A1C1E] mt-3 tracking-tighter uppercase">Start Chatting</p>
                        </div>
                    ) : (
                        <ChatMessageList messages={messages} onJump={jumpToResponse} scrollRef={scrollRef} />
                    )}

                    {isTyping && (
                        <div className="flex gap-[1px] text-[10px] justify-start py-3 pl-1 font-semibold font-['JetBrains_Mono',monospace]">
                            {"THINKING...".split("").map((char, i) => (
                                <span key={i} className="inline-block animate-[blinkRed_1.5s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* COMPOSER - anchored to bottom, full width */}
                <MessageComposer input={input} isTyping={isTyping} onSend={handleSend} onInputChange={setInput} inputRef={composerInputRef} />
            </div>
        </div>
    )
}