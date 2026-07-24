import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatHistory } from '@/services/chatService';
import type { ChatHistoryEntry } from '@ai-assistant/shared';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChatHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortKey, setSortKey] = useState<'Newest' | 'Oldest' | 'Name'>('Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getChatHistory();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const processedData = useMemo(() => {
    let data = [...items];
    if (searchQuery) data = data.filter(item => item.message.toLowerCase().includes(searchQuery.toLowerCase()));

    return data.sort((a, b) => {
      if (sortKey === 'Name') return a.message.localeCompare(b.message);

      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();

      if (sortKey === 'Oldest') return timeA - timeB;
      return timeB - timeA;
    });
  }, [sortKey, searchQuery, items]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full w-full bg-[#E5E7EB] overflow-hidden font-['Inter',system-ui,sans-serif] select-text">

      {/* ── BACKGROUND LAYERS ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] opacity-40" />
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@700;800&family=Inter:wght@400;600&family=JetBrains+Mono:wght@700&display=swap');
        
        .blob-1 { animation: drift 20s infinite alternate ease-in-out; }
        .blob-2 { animation: drift 25s infinite alternate-reverse ease-in-out; }
        .blob-3 { animation: drift 15s infinite alternate ease-in-out; }

        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10vw, 15vh) scale(1.1); }
          100% { transform: translate(-5vw, -10vh) scale(0.95); }
        }

        @keyframes popIn { 0% { opacity: 0; transform: translateY(8px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        
        .history-main-title { 
          font-family: 'Hanken Grotesk', sans-serif; 
          font-weight: 800; font-size: 2.8rem; color: #E23B4E; 
          text-transform: uppercase; letter-spacing: -0.05em; line-height: 1; 
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .dropdown-glass { 
          background: rgba(255, 255, 255, 0.96); 
          backdrop-filter: blur(60px) saturate(180%); 
          border: 1.5px solid white; 
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); 
        }
      `}</style>

      {/* ── MAIN CONTAINER (Centered & Scaled to 1000px) ── */}
      <div className="max-w-[1000px] mx-auto relative z-10 h-full flex flex-col pt-8 px-8 items-center">

        {/* HEADER */}
        <header className={`w-full flex justify-between items-end mb-10 px-8 animate-[popIn_0.4s_ease-out_forwards] relative ${isSortOpen ? 'z-[200]' : 'z-[100]'}`}>
          <div className="history-main-title">History</div>

          <div className="flex items-center gap-3 mb-1">
            <div className="relative" ref={sortRef}>
              <button onClick={() => setIsSortOpen(!isSortOpen)} className={`group flex items-center gap-2 bg-white/40 backdrop-blur-xl border border-white/60 px-4 py-2 rounded-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md cursor-pointer ${isSortOpen ? 'shadow-lg border-[#E23B4E] bg-white/60 -translate-y-1 scale-[1.03]' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40"><path d="M3 6h18M7 12h10M10 18h4" /></svg>
                <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#1A1C1E] uppercase tracking-wider">Sort: {sortKey}</span>
              </button>
              {isSortOpen && (
                <div className="dropdown-glass absolute top-full right-0 mt-2 w-44 rounded-2xl py-2 z-[210] animate-[popIn_0.2s_ease-out_forwards] overflow-hidden">
                  {(['Newest', 'Oldest', 'Name'] as const).map((key) => (
                    <button key={key} onClick={() => { setSortKey(key); setIsSortOpen(false); }} className={`w-full text-left px-5 py-2 text-[10px] font-bold font-['JetBrains_Mono',monospace] uppercase tracking-wider transition-colors cursor-pointer flex justify-between items-center ${sortKey === key ? 'text-[#E23B4E] bg-white/50' : 'text-[#1A1C1E] hover:bg-white/40'}`}>
                      {key}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-64">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#1A1C1E] opacity-30"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg></div>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search history..." className="w-full bg-white/40 backdrop-blur-xl border border-white/60 px-10 py-2 rounded-xl outline-none focus:ring-2 ring-[#E23B4E]/10 transition-all text-[#1A1C1E] font-['JetBrains_Mono',monospace] text-[10px] tracking-wider placeholder:text-black/20" />
            </div>
          </div>
        </header>

        {/* TABLE LIST - Extra padding zone for scale/shadows */}
        <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-40 px-16 -mx-16">
          {processedData.length > 0 && (
            <div className="grid grid-cols-[1fr_180px_40px] px-8 mb-5 items-center opacity-60">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.25em] font-['JetBrains_Mono',monospace] text-left">Inquiry Name</span>
              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.25em] font-['JetBrains_Mono',monospace] text-right pr-4">Last Updated</span>
              <span />
            </div>
          )}

          <div className="space-y-3 flex flex-col w-full items-center">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.5s_ease-out_forwards] py-20">
                <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/60 mb-6 shadow-sm">
                  <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E23B4E" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="30 100" /></svg>
                </div>
              </div>
            ) : processedData.length > 0 ? (
              processedData.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/chat', { state: { historyItem: item } })}
                  className={`w-full group grid grid-cols-[1fr_180px_40px] items-center px-8 py-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] transition-all duration-500 cubic-bezier(0.34,1.56,0.64,1) cursor-pointer relative animate-[popIn_0.4s_ease-out_forwards] shadow-[0_4px_20px_rgba(0,0,0,0.02)] z-10 hover:z-[40] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl hover:bg-white/60 hover:border-white/90`}
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {/* Field Info */}
                  <div className="flex items-center gap-5 overflow-visible pointer-events-none min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/60 flex items-center justify-center border border-white shadow-sm relative overflow-visible transition-transform duration-500 group-hover:scale-105">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E23B4E" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    {/* Text Container */}
                    <div className="flex flex-col min-w-0 items-start">
                      <h3 className="w-full text-[14px] font-bold transition-colors leading-tight truncate text-[#1A1C1E] group-hover:text-[#E23B4E]">
                        {item.message}
                      </h3>
                      <p className="text-[8px] text-[#6B7280] font-bold mt-1 uppercase tracking-widest font-['JetBrains_Mono',monospace] opacity-50 text-left">
                        CREATED BY USER
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-bold text-[#6B7280] font-['JetBrains_Mono',monospace] pr-4 pointer-events-none">
                    {formatDate(item.createdAt).toUpperCase()}
                  </div>

                  {/* Empty spacer where the menu used to be */}
                  <div className="flex justify-end relative">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-10 group-hover:opacity-40"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.5s_ease-out_forwards] py-20">
                <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/60 mb-6 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" opacity="0.4"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
<<<<<<< HEAD
                <h2 className="font-['JetBrains_Mono',monospace] !text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.4em]">
                  Nothing found
                </h2>
=======
              <h2 className="font-['JetBrains_Mono',monospace] !text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.4em]">
                  Nothing found
              </h2>
>>>>>>> main
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}