import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatMessageList } from '@/features/chat/ChatMessageList';
import { MessageComposer } from '@/features/chat/MessageComposer';
import type { Message } from '@/types';
import { chatService, getChatHistoryById } from '@/services/chatService';
import type { ChatRequest } from '@ai-assistant/shared';
import { getRandomGreeting } from '@/features/chat/chatGreetings';
import { getLocalUserProfile } from '@/lib/userUtils';


export default function ChatInterface() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const userProfile = getLocalUserProfile();
    const greetingName = userProfile.firstName;
    const [greeting] = useState(() => getRandomGreeting(greetingName));

    const scrollRef = useRef<HTMLDivElement>(null);
    const composerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleReset = () => {
            if (id) navigate('/chat');
            else setMessages([]);
        };
        window.addEventListener('reset-chat', handleReset);
        return () => window.removeEventListener('reset-chat', handleReset);
    }, [id, navigate]);

    // Fetch history item by ID from URL
    useEffect(() => {
        if (id) {
            getChatHistoryById(Number(id))
                .then(session => {
                    if (session && session.messages) {
                        setMessages(session.messages.map(m => ({
                            id: m.id,
                            role: m.role as 'user' | 'assistant',
                            content: m.content,
                            sources: m.sources
                        })));
                    }
                })
                .catch(err => {
                    console.error("Failed to load chat", err);
                    navigate('/chat', { replace: true });
                });
        } else {
            setMessages([]);
        }
    }, [id, navigate]);

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

        const chatRequest: ChatRequest = {
            message: input,
            ...(id ? { sessionId: Number(id) } : {})
        }

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setIsThinking(true);

        let fullContent = '';
        let sources: string[] = [];
        let isFirstChunk = true;

        try {
            await chatService(chatRequest, (chunkRes) => {
                if (chunkRes.answer) {
                    fullContent += chunkRes.answer;
                }
                if (chunkRes.sources && chunkRes.sources.length > 0) {
                    sources = chunkRes.sources;
                }
                
                // If this is a new chat and we receive the newly created database ID,
                // quietly update the URL without remounting the component
                const newId = chunkRes.sessionId || chunkRes.chatId;
                if (newId && !id) {
                    navigate(`/chat/${newId}`, { replace: true });
                }

                if (fullContent.length > 0) {
                    if (isFirstChunk) {
                        setIsThinking(false);
                        setMessages(prev => [...prev, {
                            id: aId, role: 'assistant',
                            content: fullContent,
                            sources: []
                        }]);
                        isFirstChunk = false;
                    } else {
                        setMessages(prev => prev.map(msg =>
                            msg.id === aId ? { ...msg, content: fullContent, sources: [] } : msg
                        ));
                    }
                }
            });

            setIsTyping(false);

            if (sources.length > 0) {
                setMessages(prev => prev.map(msg =>
                    msg.id === aId ? { ...msg, content: fullContent, sources: sources } : msg
                ));
            }

        } catch (error) {
            console.error('Error:', error);
            setIsTyping(false);
            setIsThinking(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#E5E7EB] fixed top-0 left-0 overflow-hidden font-['Inter',system-ui,sans-serif]">
            {/* Base Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] opacity-50" />

            {/* Ambient Red Glow Layers - Only shown before chat starts */}
            {messages.length === 0 && (
                <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-[#800000] blur-[120px] rounded-full pointer-events-none animate-pulse transition-opacity duration-500 opacity-70" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-[#5c0000] blur-[70px] rounded-full pointer-events-none transition-opacity duration-500 opacity-80" />
                </>
            )}

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
        body { margin: 0; padding: 0; overflow: hidden; }
        @keyframes popIn { 0% { opacity: 0; transform: translateY(8px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes blinkRed { 0%, 100% { color: #5c0000; } 50% { color: #E23B4E; } }
        @keyframes glowRed {
          0% { box-shadow: 0 0 0 0 rgba(135, 0, 13, 0.4); border-color: rgba(135, 0, 13, 0.2); }
          50% { box-shadow: 0 0 15px 4px rgba(135, 0, 13, 0.5); border-color: rgba(135, 0, 13, 0.8); }
          100% { box-shadow: 0 0 0 0 rgba(135, 0, 13, 0.4); border-color: rgba(135, 0, 13, 0.2); }
        }
      `}</style>

            {/* Main Container - single column, full-height chat feed */}
            <div className="flex flex-col h-full w-full max-w-[790px] mx-auto px-6 pt-8 pb-8 relative z-[1] box-border">

                {/* SCROLLABLE MESSAGE FEED */}
                <div className={`flex flex-col transition-all duration-700 ease-in-out ${messages.length === 0 ? 'flex-1 min-h-0' : 'flex-1 min-h-0'}`}>
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center mb-3 justify-end animate-[popIn_0.6s_ease-out_forwards]">
                            <p className="text-[35px] font-black text-[#1A1C1E] mt-3 tracking-tighter uppercase">{greeting}</p>
                        </div>
                    ) : (
                        <>
                            <ChatMessageList messages={messages} onJump={jumpToResponse} scrollRef={scrollRef} isThinking={isThinking} />

                        </>
                    )}
                </div>

                <div className="w-full shrink-0 transition-all duration-700 ease-in-out mt-4 relative z-10">
                    <MessageComposer input={input} isTyping={isTyping} onSend={handleSend} onInputChange={setInput} inputRef={composerInputRef} />
                </div>

                {/* BOTTOM SPACER - pushes composer to middle initially */}
                <div className={`transition-all duration-700 ease-in-out ${messages.length === 0 ? 'flex-1' : 'flex-none h-0'}`} />
            </div>
        </div>
    )
}