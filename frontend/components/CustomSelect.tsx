import React, { useState, useRef, useEffect } from 'react';

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
        className="flex w-full items-center justify-between rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2.5 text-sm outline-none transition-all hover:bg-white focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
      >
        <span className={value ? 'text-slate-900' : 'text-slate-500'}>
          {value || placeholder}
        </span>
        
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-900/10 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-900/10 py-0 scrollbar-thin scrollbar-thumb-slate-900/20">
          
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`cursor-pointer border-b border-slate-900/10 px-4 py-3 text-sm text-slate-700 transition-colors last:border-none hover:bg-slate-900/5 ${
                value === option ? 'bg-slate-900/10 font-bold text-slate-900' : ''
              }`}
            >
              {option}
            </li>
          ))}
          
        </ul>
      )}
    </div>
  );
}