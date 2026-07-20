import React, { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ type, message, isVisible, onClose }: ToastProps) {
  // Automatically close the toast after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-toast-slide-in font-sans">
      <div 
        className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 pr-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all ${
          isSuccess 
            ? 'border-green-500/30 bg-white/80 text-slate-900' 
            : 'border-red-500/30 bg-white/80 text-slate-900'
        }`}
      >
        {/* Left Accent Line */}
        <div className={`absolute left-0 top-0 h-full w-1.5 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />

        {/* Dynamic Icon */}
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isSuccess ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <h4 className="text-sm font-bold tracking-wide">{isSuccess ? 'Success' : 'Error'}</h4>
          <p className="text-xs font-medium text-slate-600">{message}</p>
        </div>

        {/* Manual Close Button */}
        <button 
          onClick={onClose}
          className="ml-4 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-900/10 hover:text-slate-700 focus:outline-none"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}