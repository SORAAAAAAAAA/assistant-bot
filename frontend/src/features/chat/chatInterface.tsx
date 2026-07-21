import { useState, useRef, useEffect } from 'react';
import { MessageList } from '@/features/chat/MessageList';
import { MessageComposer } from '@/features/chat/MessageComposer';
import type { Message } from '@/types';
import { chatService } from '@/services/chatService';
import type { ChatRequest } from '@ai-assistant/shared';
import { formatAiResponse } from "@/lib/aiFormatter"

export default function ChatInterface() {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    const userScrollRef = useRef<HTMLDivElement>(null);
    const aiScrollRef = useRef<HTMLDivElement>(null);
    const composerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userScrollRef.current) userScrollRef.current.scrollTop = userScrollRef.current.scrollHeight;
        if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    // FIX: Manual scroll calculation prevents the "Large Footer" layout shift
    const jumpToResponse = (relatedId?: number) => {
        if (!relatedId) return;

        const container = aiScrollRef.current;
        const element = document.getElementById(`msg-${relatedId}`);

        if (element && container) {
            // Calculate position relative to the container, not the screen
            const elementRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top;

            const targetScroll = container.scrollTop + relativeTop - (container.clientHeight / 2) + (element.clientHeight / 2);

            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });

            setHighlightedId(relatedId);
            setTimeout(() => setHighlightedId(null), 3000);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const uId = Date.now();
        const aId = uId + 1;

        const userMsg: Message = {
            id: uId, role: 'user', content: input,
        };

        const chatRequest: ChatRequest = {
            message: input
        }
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        try {
            const response = await chatService(chatRequest)

            const reply: Message = {
                id: aId, role: 'assistant',
                content: formatAiResponse(response)
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] opacity-50" />
            <div className="absolute -top-[10%] left-[10%] w-[70vw] h-[70vw] bg-[#E23B4E]/[0.08] blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
        body { margin: 0; padding: 0; overflow: hidden; }
        @keyframes popIn { 0% { opacity: 0; transform: translateY(8px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes letterJump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes blinkRed { 0%, 100% { color: #6B7280; } 50% { color: #E23B4E; } }
        @keyframes glowRed {
          0% { box-shadow: 0 0 0 0 rgba(226, 59, 78, 0.4); border-color: rgba(226, 59, 78, 0.2); }
          50% { box-shadow: 0 0 15px 4px rgba(226, 59, 78, 0.5); border-color: rgba(226, 59, 78, 0.8); }
          100% { box-shadow: 0 0 0 0 rgba(226, 59, 78, 0.4); border-color: rgba(226, 59, 78, 0.2); }
        }
      `}</style>

            {/* Main Container - Controlled paddings to keep layout tight */}
            <div className="grid grid-cols-2 h-full w-full max-w-[1000px] mx-auto px-6 pt-8 pb-8 gap-8 relative z-[1] box-border">
                {/* DIVIDER LINE */}
                <div className="absolute top-4 bottom-8 w-px bg-gray-400/40 -translate-x-1/2" style={{ left: 'calc(50% - 0px)' }} />

                {/* LEFT COLUMN */}
                <div className="flex flex-col min-h-0 relative">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.6s_ease-out_forwards]">
                            <p className="text-[10px] font-bold text-[#E23B4E] uppercase tracking-[0.4em] font-['JetBrains_Mono',monospace]">Ready</p>
                            <p className="text-[24px] font-black text-[#1A1C1E] mt-3 tracking-tighter uppercase">Start Chatting</p>
                            <p className="text-[11px] text-[#4B5563] pt-2 mt-2 font-medium text-center max-w-[220px] leading-relaxed">Input a query or attach documents to begin analysis.</p>
                        </div>
                    ) : (
                        <MessageList messages={messages.filter(m => m.role === 'user')} variant="user" onJump={jumpToResponse} scrollRef={userScrollRef} />
                    )}
                    <MessageComposer input={input} isTyping={isTyping} onSend={handleSend} onInputChange={setInput} inputRef={composerInputRef} />
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col min-h-0 overflow-hidden">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                            <div className="w-12 h-px bg-gray-500" />
                        </div>
                    ) : (
                        <MessageList messages={messages.filter(m => m.role === 'assistant')} variant="assistant" highlightedId={highlightedId} scrollRef={aiScrollRef} />
                    )}
                    {isTyping && (
                        <div className="flex gap-[1px] text-[10px] justify-center py-3 font-semibold font-['JetBrains_Mono',monospace]">
                            {"THINKING...".split("").map((char, i) => (
                                <span key={i} className="inline-block animate-[letterJump_1s_infinite_ease-in-out,blinkRed_1.5s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}