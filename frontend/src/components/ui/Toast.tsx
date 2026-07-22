import { useEffect } from 'react';

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
        className="relative flex items-center gap-4 rounded-[24px] border border-white/60 bg-white/40 p-4 pr-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-all text-slate-900"
      >
        {/* --- REALISTIC GLASS OVERLAY (Matching Modal) --- */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/70 bg-gradient-to-b from-white/60 via-transparent to-transparent opacity-80" />

        {/* Dynamic Icon */}
        <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${isSuccess ? 'bg-green-100/80 text-green-600' : 'bg-red-100/80 text-red-600'}`}>
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
        <div className="relative z-10 flex flex-col">
          <h4 className="text-sm font-bold tracking-wide">{isSuccess ? 'Success' : 'Error'}</h4>
          <p className="text-xs font-medium text-slate-800">{message}</p>
        </div>

        {/* Manual Close Button */}
        <button
          onClick={onClose}
          className="relative z-10 ml-4 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-900/10 hover:text-slate-900 focus:outline-none"
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