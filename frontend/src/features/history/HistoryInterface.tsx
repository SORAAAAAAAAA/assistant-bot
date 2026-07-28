import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatHistory } from '@/services/chatService';
import { HistoryListItem } from '@/features/history/HistoryListItem';
import { HistorySortDropdown } from '@/features/history/HistorySortDropdown';
import { HistorySearchInput } from '@/features/history/HistorySearchInput';

export default function HistoryInterface() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
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
    if (searchQuery) data = data.filter(item => item.message?.toLowerCase().includes(searchQuery.toLowerCase()));

    return data.sort((a, b) => {
      if (sortKey === 'Name') return (a.message || '').localeCompare(b.message || '');

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
        <header className={`w-full flex flex-col sm:flex-row justify-between sm:items-end gap-6 sm:gap-0 mb-10 px-4 sm:px-8 animate-[popIn_0.4s_ease-out_forwards] relative ${isSortOpen ? 'z-[200]' : 'z-[100]'}`}>
          <div className="history-main-title self-start sm:self-auto">History</div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-1 w-full sm:w-auto">
            <HistorySortDropdown
              isOpen={isSortOpen}
              sortKey={sortKey}
              onSelect={setSortKey}
              onToggle={() => setIsSortOpen(!isSortOpen)}
              sortRef={sortRef}
            />
            <HistorySearchInput
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </header>

        {/* TABLE LIST - Extra padding zone for scale/shadows */}
        <div className="w-full flex-1 overflow-y-auto no-scrollbar pb-40 px-4 sm:px-16 sm:-mx-16">
          {processedData.length > 0 && (
            <div className="hidden sm:grid grid-cols-[1fr_180px_40px] px-8 mb-5 items-center opacity-60">
              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.25em] font-['JetBrains_Mono',monospace] text-left">Inquiry Name</span>
              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.25em] font-['JetBrains_Mono',monospace] text-right pr-4">Last Updated</span>
              <span />
            </div>
          )}

          <div className="space-y-3 flex flex-col w-full items-center">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.5s_ease-out_forwards] py-20">
                <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/60 mb-6 shadow-sm">
                  <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E23B4E" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeDasharray="30 100" />
                  </svg>
                </div>
              </div>
            ) : processedData.length > 0 ? (
              processedData.map((item, index) => (
                <HistoryListItem
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={() => navigate(`/chat/${item.id}`)}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center animate-[popIn_0.5s_ease-out_forwards] py-20">
                <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/60 mb-6 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" opacity="0.4">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h2 className="font-['JetBrains_Mono',monospace] !text-[#6B7280] text-[10px] font-bold uppercase tracking-[0.4em]">
                  Nothing found
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}