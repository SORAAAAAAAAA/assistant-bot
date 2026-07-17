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
    // 1. Pure white background wrapping the entire screen
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white px-4 font-sans">
      
      {/* 2. Invisible backdrop overlay to handle clicking outside to close */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* --- BACKGROUND BLOBS --- */}
      
      {/* Bottom Left - Yellow/Orange Blob */}
      <div 
        className="pointer-events-none absolute -left-[10%] bottom-[-5%] z-0 h-[70vh] w-[60vw] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300"
      ></div>

      {/* Bottom Left - Intense Red/Orange Overlay Blob */}
      <div 
        className="pointer-events-none absolute -left-[5%] bottom-[-15%] z-0 h-[65vh] w-[55vw] rounded-[50%_40%_60%_50%/40%_50%_50%_60%] bg-gradient-to-tr from-red-600 to-orange-500 opacity-90"
      ></div>

      {/* Top Right - Deep Red/Purple Blob */}
      <div 
        className="pointer-events-none absolute -right-[5%] -top-[10%] z-0 h-[55vh] w-[45vw] rounded-[45%_55%_40%_60%/55%_45%_60%_40%] bg-gradient-to-bl from-red-700 via-purple-700 to-orange-600 opacity-95"
      ></div>


      {/* --- APPLE-STYLE SLEEK GLASSMORPHISM CARD --- */}
      
      <div 
        // Changed to max-w-md for a small, compact form container.
        // Removed the noise, thickened the blur (3xl), and added a clean, sharp white border.
        className="relative z-10 w-full max-w-md rounded-[32px] border-[1px] border-white/60 bg-white/40 p-8 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-3xl sm:p-10"
      >
        
        {/* Subtle inner glare for the Apple glass rim lighting effect */}
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/30 to-transparent" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full text-2xl text-gray-500 transition-all hover:bg-white/50 hover:text-gray-900"
          aria-label="Close modal"
        >
          &times;
        </button>
        
        {/* Modal Content / Form Container */}
        <div className="relative z-20 w-full">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;