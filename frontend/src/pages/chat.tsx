import { useState, useRef, useEffect } from 'react';

// ── Types ────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'user' | 'assistant';
  time: string;
  content: string;
  files?: string[]; // Added to store attached filenames
  relatedId?: number;
}

// ── SVG Swirl Border Component ───────────────────────────────────
const SwirlBorder = ({ active, radius = 20 }: { active: boolean; radius?: number }) => {
  const [rectSize, setRectSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setRectSize({
        w: containerRef.current.offsetWidth,
        h: containerRef.current.offsetHeight
      });
    }
  }, [active]);

  const perimeter = (rectSize.w + rectSize.h) * 2;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-400 ease-in-out ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {rectSize.w > 0 && (
        <svg width="100%" height="100%" className="overflow-visible">
          <rect
            x="0"
            y="0"
            width={rectSize.w}
            height={rectSize.h}
            fill="none"
            stroke="#B31922"
            strokeWidth="3"
            rx={radius}
            ry={radius}
            strokeDasharray={perimeter}
            strokeDashoffset={active ? 0 : perimeter}
            className="[transition:stroke-dashoffset_0.8s_cubic-bezier(0.4,_0,_0.2,_1)]"
          />
        </svg>
      )}
    </div>
  );
};

// ── Main Chat UI ─────────────────────────────────────────────────

export default function LogisticsChat() {
  const [input, setInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // NEW: State to hold selected files
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
    // Send if there is text OR if there are files
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
        content: "I received your message."
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedFiles(Array.from(files)); // Store files in state
    }
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
        {/* LEFT COLUMN */}
        <div className="flex flex-col min-h-0">
          <header className="pb-6 shrink-0 text-center">
            <h1 className="text-[32px] font-extrabold m-0 font-['Hanken_Grotesk',system-ui,sans-serif]" style={{ color: '#E23B4E' }}>Your Inquiries</h1>
            <p className="text-[#6B7280] text-[15px] mt-1">Track and manage your questions.</p>
          </header>

          <div
            ref={userScrollRef}
            className="no-scrollbar flex-1 overflow-y-auto flex flex-col gap-10 items-end px-8 py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {messages.filter(m => m.role === 'user').map(msg => (
              <div key={msg.id} className="w-[85%] shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
                <div
                  className="bg-[#E23B4E] text-white px-6 py-5 rounded-[24px_24px_4px_24px] text-[15px] shadow-[0_4px_15px_rgba(226,59,78,0.15)] leading-[1.4] cursor-pointer relative will-change-transform transition-[transform_0.5s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease] hover:-translate-y-[10px] hover:scale-[1.03] hover:shadow-[0_25px_45px_rgba(0,0,0,0.12)] hover:z-50 active:!translate-y-[-4px] active:!scale-[0.96] active:!duration-100 active:!ease-linear"
                  onClick={() => jumpToResponse(msg.relatedId)}
                >
                  {msg.content}
                  {/* NEW: Display file attachments in the bubble */}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20 flex flex-col gap-1">
                      {msg.files.map((name, i) => (
                        <div key={i} className="text-[11px] bg-white/20 px-2 py-1 rounded flex items-center gap-2">
                          <span>📄</span> {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right text-[11px] text-[#6B7280] mt-3 font-semibold font-['JetBrains_Mono',monospace]">{msg.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col min-h-0">
          <header className="pb-6 shrink-0 text-center">
            <h1 className="text-[32px] font-extrabold m-0 font-['Hanken_Grotesk',system-ui,sans-serif]" style={{ color: '#1A1C1E' }}>AI Assistant</h1>
            <p className="text-[#6B7280] text-[15px] mt-1">Intelligent logistics support.</p>
          </header>

          <div ref={aiScrollRef} className="flex-1 overflow-y-auto flex flex-col gap-10 px-8 py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {messages.filter(m => m.role === 'assistant').map(msg => (
              <div key={msg.id} id={`msg-${msg.id}`} className="w-[90%] shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
                <div
                  className={`bg-white/45 backdrop-blur-[24px] p-7 rounded-[24px_24px_24px_4px] text-[15px] text-[#1A1C1E] shadow-[0_8px_32px_rgba(0,0,0,0.05)] leading-[1.6] relative border will-change-transform transition-[transform_0.5s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease] hover:-translate-y-[10px] hover:scale-[1.03] hover:shadow-[0_25px_45px_rgba(0,0,0,0.12)] hover:z-50 active:!translate-y-[-4px] active:!scale-[0.96] active:!duration-100 active:!ease-linear ${
                    highlightedId === msg.id ? 'border-transparent' : 'border-white/50'
                  }`}
                >
                  <SwirlBorder active={highlightedId === msg.id} radius={24} />
                  {msg.content}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-3 font-semibold font-['JetBrains_Mono',monospace]">{msg.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="text-xs text-[#6B7280] pl-2.5 font-semibold font-['JetBrains_Mono',monospace]">SYS_ANALYZING...</div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Glass Composer */}
      <div className="group absolute bottom-[50px] left-1/2 -translate-x-1/2 w-3/5 max-w-[900px] z-[100]">
        
        {/* NEW: Attachment Preview above the input bar */}
        {attachedFiles.length > 0 && (
          <div className="absolute -top-12 left-0 flex gap-2 animate-[popIn_0.3s_ease_forwards]">
            {attachedFiles.map((file, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md border border-white/50 text-[10px] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                <span className="font-bold text-[#E23B4E]">Attached:</span> {file.name}
                <button onClick={() => setAttachedFiles([])} className="hover:text-red-500 ml-1">×</button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`relative bg-white/50 backdrop-blur-[30px] px-10 py-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center border cursor-text will-change-transform transition-[transform_0.4s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease,background_0.3s_ease] group-hover:-translate-y-[3px] group-hover:scale-[1.008] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] group-active:!translate-y-[-1px] group-active:!scale-[0.995] group-active:!duration-100 group-active:!ease-linear group-focus-within:-translate-y-[3px] group-focus-within:scale-[1.008] group-focus-within:shadow-[0_15px_35px_rgba(226,59,78,0.12)] ${
            isTyping ? 'border-transparent' : 'border-white/60'
          }`}
          onClick={() => composerInputRef.current?.focus()}
        >
          <SwirlBorder active={isTyping} radius={16} />
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          
          <span 
            className={`text-xl mr-[18px] transition-all duration-300 ${attachedFiles.length > 0 ? 'text-[#E23B4E] opacity-100' : 'opacity-50'} cursor-pointer hover:scale-125`}
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            📎
          </span>

          <input
            ref={composerInputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={attachedFiles.length > 0 ? "Press Enter to send document..." : "ENTER QUERY..."}
            disabled={isTyping}
            className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-wide"
          />
        </div>
      </div>
    </div>
  );
}