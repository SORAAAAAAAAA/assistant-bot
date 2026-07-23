import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({ label, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full flex items-center justify-center rounded-xl bg-white border border-transparent py-3.5 text-sm font-bold text-slate-900 shadow-sm transition-all duration-300 hover:bg-[#d6d6d6] hover:text-slate-900 hover:shadow-md active:bg-[#57595B] ${className}`}
    >
      {label}
    </button>
  );
}