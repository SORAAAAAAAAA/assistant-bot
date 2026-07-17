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

  // Close the dropdown if the user clicks outside of it
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
      {/* Trigger Button - Matches the other form inputs exactly */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl bg-white/20 px-4 py-2.5 text-sm outline-none transition-colors hover:bg-white/30 focus:bg-white/30"
      >
        <span className={value ? 'text-white' : 'text-white/70'}>
          {value || placeholder}
        </span>
        
        {/* Chevron Icon */}
        <svg
          className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 
        Solid Grey Container Menu 
        - bg-[#4A4A4A]: A solid, premium grey that mimics standard UI containers. It is 100% opaque to block out background text.
        - border-white/20: Keeps the outline consistent with your glassmorphism theme.
      */}
      {isOpen && (
        <ul className="absolute z-50 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-white/20 bg-[#4A4A4A] shadow-xl shadow-black/30">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`cursor-pointer px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/10 ${
                value === option ? 'bg-white/20 font-semibold' : ''
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