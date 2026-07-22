import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

export default function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] text-white outline-none backdrop-blur-md transition-all hover:bg-white/20 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
      >
        <span className={value ? 'text-white truncate' : 'text-white/60 truncate'}>
          {value || placeholder}
        </span>

        <svg
          className={`h-4 w-4 shrink-0 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-white/20 bg-[#4a0005]/95 backdrop-blur-xl shadow-xl shadow-black/50">
          <ul className="max-h-52 w-full overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-white/20">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`cursor-pointer rounded-lg px-3 py-2 text-[13px] text-white/90 transition-colors hover:bg-white/15 ${value === option ? 'bg-white/25 font-bold text-white' : ''}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}