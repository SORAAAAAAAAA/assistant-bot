import type { FC } from 'react';

interface HistorySearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const HistorySearchInput: FC<HistorySearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:w-64">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#1A1C1E] opacity-30">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search history..."
        className="w-full bg-white/40 backdrop-blur-xl border border-white/60 px-10 py-2 rounded-xl outline-none focus:ring-2 ring-[#E23B4E]/10 transition-all text-[#1A1C1E] font-['JetBrains_Mono',monospace] text-[10px] tracking-wider placeholder:text-black/20"
      />
    </div>
  );
};