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
    // 1. Base wrapper: Changed from bg-white to a dark neutral so the white text is readable.
    // If you plan to use an image background like the reference, you would set it here.
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-neutral-950 px-4 font-sans">
      
      {/* 2. Invisible backdrop overlay to handle clicking outside to close */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* --- BACKGROUND --- */}
      {/* 
        Note: The image you provided uses a photograph. 
        I've darkened your blobs to match the moody, low-light aesthetic of the reference image. 
        If you want the exact look, replace these blobs with an <img /> tag of your background.
      */}
      <div className="pointer-events-none absolute -left-[10%] bottom-[-5%] z-0 h-[70vh] w-[60vw] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] bg-gradient-to-tr from-amber-600 via-orange-700 to-yellow-600 opacity-30"></div>
      <div className="pointer-events-none absolute -left-[5%] bottom-[-15%] z-0 h-[65vh] w-[55vw] rounded-[50%_40%_60%_50%/40%_50%_50%_60%] bg-gradient-to-tr from-red-800 to-orange-700 opacity-40"></div>
      <div className="pointer-events-none absolute -right-[5%] -top-[10%] z-0 h-[55vh] w-[45vw] rounded-[45%_55%_40%_60%/55%_45%_60%_40%] bg-gradient-to-bl from-green-900 via-emerald-900 to-stone-800 opacity-40"></div>

      {/* --- REALISTIC GLASSMORPHISM CARD --- */}
      <div 
        className="relative z-10 w-full max-w-md rounded-[32px] border border-white/20 bg-white/10 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-10"
      >
        
        {/* Subtle inner edge highlight (Rim light effect seen in real glass) */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/5 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
        
        {/* Modal Content / Form Container */}
        <div className="relative z-20 w-full">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;