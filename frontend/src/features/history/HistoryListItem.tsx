import type { FC } from 'react';

interface HistoryListItemProps {
  item: { id: number; message: string; createdAt: string };
  index: number;
  onClick: () => void;
  formatDate: (dateString: string) => string;
}

export const HistoryListItem: FC<HistoryListItemProps> = ({ item, index, onClick, formatDate }) => {
  return (
    <div
      key={item.id}
      onClick={onClick}
      className={`w-full group flex flex-col sm:grid sm:grid-cols-[1fr_180px_40px] items-start sm:items-center gap-4 sm:gap-0 px-6 sm:px-8 py-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[24px] transition-all duration-500 cubic-bezier(0.34,1.56,0.64,1) cursor-pointer relative animate-[popIn_0.4s_ease-out_forwards] shadow-[0_4px_20px_rgba(0,0,0,0.02)] z-10 hover:z-[40] hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl hover:bg-white/60 hover:border-white/90`}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Field Info */}
      <div className="flex items-center gap-5 overflow-visible pointer-events-none min-w-0">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white/60 flex items-center justify-center border border-white shadow-sm relative overflow-visible transition-transform duration-500 group-hover:scale-105">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E23B4E" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
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

      <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center sm:contents text-[10px] font-bold text-[#6B7280] font-['JetBrains_Mono',monospace]">
        <span className="sm:text-right sm:pr-4 pointer-events-none">
          {formatDate(item.createdAt).toUpperCase()}
        </span>
        
        {/* Empty spacer where the menu used to be */}
        <div className="flex justify-end relative sm:static">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-10 group-hover:opacity-40">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};