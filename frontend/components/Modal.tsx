import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#F8F9FA] px-4 font-sans">
      
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* --- SHARP RED BACKGROUND SHAPES --- */}
      <div className="pointer-events-none absolute -bottom-[15%] -left-[5%] z-0 h-[70vh] w-[60vw] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] bg-gradient-to-tr from-red-900 via-red-600 to-rose-500 opacity-90"></div>
      <div className="pointer-events-none absolute -right-[5%] -top-[10%] z-0 h-[50vh] w-[45vw] rounded-[50%_40%_60%_50%/40%_50%_50%_60%] bg-gradient-to-bl from-rose-700 via-red-600 to-red-900 opacity-90"></div>

      {/* --- REALISTIC GLASS OVERLAY --- */}
      <div 
        className="relative z-10 w-full max-w-[400px] rounded-[32px] border border-white/60 bg-white/40 p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-2xl sm:px-8 sm:py-7"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/70 bg-gradient-to-b from-white/60 via-transparent to-transparent opacity-80" />
        
        <div className="relative z-20 w-full text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;