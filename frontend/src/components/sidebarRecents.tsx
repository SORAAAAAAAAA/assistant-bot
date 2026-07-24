import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatHistory } from '@/services/chatService';
import type { ChatSessionDto } from '@ai-assistant/shared';

interface SidebarRecentsProps {
    isOpen: boolean;
}

export function SidebarRecents({ isOpen }: SidebarRecentsProps) {
    const [recentChats, setRecentChats] = useState<ChatSessionDto[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getChatHistory();
                const sorted = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                setRecentChats(sorted.slice(0, 20));
            } catch (err) {
                console.error("Failed to fetch recent chats", err);
            }
        };

        fetchHistory();

        window.addEventListener('reset-chat', fetchHistory);
        return () => window.removeEventListener('reset-chat', fetchHistory);
    }, []);

    if (recentChats.length === 0) return null;

    return (
        <div className={`transition-all duration-300 flex flex-col min-h-0 ${isOpen ? 'opacity-100 flex-1 pt-8 pb-1' : 'opacity-0 h-0 py-0 overflow-hidden'}`}>
            <div className="px-3 mb-2 text-xs font-semibold text-white/50 tracking-wider shrink-0">
                Recents
            </div>
            <div className="space-y-0.5 overflow-y-auto flex-1 no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {recentChats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => navigate(`/chat/${chat.id}`)}
                        className="w-full flex items-center rounded-full transition-all duration-200 group py-1 px-2.5 text-red-100 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 cursor-pointer"
                        title={chat.title}
                    >
                        <div className="overflow-hidden flex items-center flex-1">
                            <span className="whitespace-nowrap font-medium text-[13px] leading-none tracking-wide truncate w-full text-left">
                                {chat.title}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
