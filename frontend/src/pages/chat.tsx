import { useState, useRef, useEffect } from 'react';
import { MessageList } from '../components/MessageList';
import { MessageComposer } from '../components/MessageComposer';
import type { Message } from '../components/types';

export default function LogisticsChat() {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // Handles file state
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const userScrollRef = useRef<HTMLDivElement>(null);
  const aiScrollRef = useRef<HTMLDivElement>(null);
  const composerInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

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
      files: attachedFiles.map(f => f.name), // Save file names to message
      relatedId: aId 
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]); // Clear files after sending
    setIsTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: aId,
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: "I have received your message."
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
    <div className="h-screen w-screen bg-white fixed top-0 left-0 overflow-hidden font-['Inter',system-ui,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
        body { margin: 0; padding: 0; }
        @keyframes popIn { 0% { opacity: 0; transform: translateY(8px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes letterJump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes blinkRed { 0%, 100% { color: #6B7280; } 50% { color: #E23B4E; } }
        @keyframes glowRed {
          0% { box-shadow: 0 0 0 0 rgba(226, 59, 78, 0.4); border-color: rgba(226, 59, 78, 0.2); }
          50% { box-shadow: 0 0 15px 4px rgba(226, 59, 78, 0.5); border-color: rgba(226, 59, 78, 0.8); }
          100% { box-shadow: 0 0 0 0 rgba(226, 59, 78, 0.4); border-color: rgba(226, 59, 78, 0.2); }
        }
      `}</style>

      <div className="grid grid-cols-2 h-full w-full max-w-[1000px] mx-auto px-10 pt-6 gap-10 relative z-[1] box-border">
        <div className="absolute top-2.5 bottom-8 w-px bg-gray-200 -translate-x-1/2" style={{ left: 'calc(50% - 20px)' }} />

        {/* LEFT COLUMN - User Messages */}
                <div className="flex flex-col min-h-0 pb-4 overflow-hidden px-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.6s_ease-out_forwards]">
            {/* Strong Red Status */}
            <p className="text-[10px] font-bold text-[#E23B4E] uppercase tracking-[0.4em] font-['JetBrains_Mono',monospace]">
              Ready
            </p>
            
            <p className="text-[24px] font-black text-[#1A1C1E] mt-3 tracking-tighter uppercase">
              Start Chatting
            </p>
            
            {/* Readable Description */}
            <p className="text-[11px] text-[#4B5563] pt-2 mt-2 font-medium text-center max-w-[220px] leading-relaxed">
              Input a query or attach documents to begin analysis.
            </p>
          </div>
        ) : (
          <MessageList messages={messages.filter(m => m.role === 'user')} variant="user" onJump={jumpToResponse} scrollRef={userScrollRef} />
        )}
                  
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

        {/* RIGHT COLUMN - Assistant Messages */}
        <div className="flex flex-col min-h-0 overflow-hidden px-3">
          {messages.length === 0 ? (
            /* SYMMETRICAL EMPTY STATE FOR AI COLUMN */
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <div className="w-12 h-px bg-gray-200" />
            </div>
          ) : (
            <MessageList 
              messages={messages.filter(m => m.role === 'assistant')} 
              variant="assistant" 
              highlightedId={highlightedId} 
              scrollRef={aiScrollRef} 
            />
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
  );
}