import { useState, useRef, useEffect } from 'react';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageComposer } from '../components/MessageComposer';
import type { Message } from '../components/types';

// ── Main Chat UI ─────────────────────────────────────────────────

export default function LogisticsChat() {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const userScrollRef = useRef<HTMLDivElement>(null);
  const aiScrollRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userScrollRef.current) userScrollRef.current.scrollTop = userScrollRef.current.scrollHeight;
    if (aiScrollRef.current) aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if ((!input.trim() && attachedFiles.length === 0) || isTyping) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const uId = Date.now();
    const aId = uId + 1;

    const userMsg: Message = { 
      id: uId, 
      role: 'user', 
      time: userTime, 
      content: input, 
      files: attachedFiles.map(f => f.name),
      relatedId: aId 
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: aId,
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: "I received your message."
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  const jumpToResponse = (relatedId?: number) => {
    if (!relatedId) return;
    const element = document.getElementById(`msg-${relatedId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(relatedId);
      setTimeout(() => setHighlightedId(null), 3000);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F8F7F4] fixed top-0 left-0 overflow-hidden font-['Inter',system-ui,sans-serif]">
      <div className="absolute -top-[10%] left-[5%] w-[50vw] h-[50vw] bg-[#E23B4E]/[0.12] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[5%] right-0 w-[40vw] h-[40vw] bg-[#E08A1E]/[0.15] blur-[120px] rounded-full pointer-events-none" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
        body { margin: 0; padding: 0; }
        @keyframes popIn { 0% { opacity: 0; transform: translateY(12px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="grid grid-cols-2 h-full w-full max-w-[1440px] mx-auto px-[60px] pt-10 pb-[160px] gap-[60px] relative z-[1] box-border">
        {/* LEFT COLUMN - User Messages */}
        <div className="flex flex-col min-h-0">
          <ChatHeader 
            title="Your Inquiries" 
            subtitle="Track and manage your questions." 
          />
          <MessageList
            messages={messages.filter(m => m.role === 'user')}
            variant="user"
            onJump={jumpToResponse}
            scrollRef={userScrollRef}
          />
        </div>

        {/* RIGHT COLUMN - Assistant Messages */}
        <div className="flex flex-col min-h-0">
          <ChatHeader 
            title="AI Assistant" 
            subtitle="Intelligent logistics support." 
            color="#1A1C1E"
          />
          <MessageList
            messages={messages.filter(m => m.role === 'assistant')}
            variant="assistant"
            highlightedId={highlightedId}
            scrollRef={aiScrollRef}
          />
          {isTyping && (
            <div className="text-xs text-[#6B7280] pl-2.5 font-semibold font-['JetBrains_Mono',monospace]">SYS_ANALYZING...</div>
          )}
        </div>
      </div>

      <MessageComposer
        input={input}
        attachedFiles={attachedFiles}
        isTyping={isTyping}
        onSend={handleSend}
        onFileSelect={setAttachedFiles}
        onInputChange={setInput}
        fileInputRef={fileInputRef}
        inputRef={composerInputRef}
      />
    </div>
  );
}