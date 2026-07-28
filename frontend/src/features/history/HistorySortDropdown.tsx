import type { FC, RefObject } from 'react';

interface HistorySortDropdownProps {
  isOpen: boolean;
  sortKey: 'Newest' | 'Oldest' | 'Name';
  onSelect: (key: 'Newest' | 'Oldest' | 'Name') => void;
  onToggle: () => void;
  sortRef: RefObject<HTMLDivElement | null>;
}

export const HistorySortDropdown: FC<HistorySortDropdownProps> = ({ isOpen, sortKey, onSelect, onToggle, sortRef }) => {
  return (
    <div className="relative" ref={sortRef}>
      <button
        onClick={onToggle}
        className={`group flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto bg-white/40 backdrop-blur-xl border border-white/60 px-4 py-2 rounded-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-md cursor-pointer ${isOpen ? 'shadow-lg border-[#E23B4E] bg-white/60 -translate-y-1 scale-[1.03]' : ''}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-40">
          <path d="M3 6h18M7 12h10M10 18h4" />
        </svg>
        <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#1A1C1E] uppercase tracking-wider">Sort: {sortKey}</span>
      </button>
      {isOpen && (
        <div className="dropdown-glass absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-44 rounded-2xl py-2 z-[210] animate-[popIn_0.2s_ease-out_forwards] overflow-hidden">
          {(['Newest', 'Oldest', 'Name'] as const).map((key) => (
            <button
              key={key}
              onClick={() => { onSelect(key); onToggle(); }}
              className={`w-full text-left px-5 py-2 text-[10px] font-bold font-['JetBrains_Mono',monospace] uppercase tracking-wider transition-colors cursor-pointer flex justify-between items-center ${sortKey === key ? 'text-[#E23B4E] bg-white/50' : 'text-[#1A1C1E] hover:bg-white/40'}`}
            >
              {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};