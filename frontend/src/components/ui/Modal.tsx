import React, { useEffect, useRef } from 'react';
import logo from '@/assets/logoseiwa.png'; 

/* --- EXTERNAL BACKGROUND COMPONENT --- */
const BouncingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const getScale = (width: number) => {
      return Math.max(0.35, Math.min(width / 1200, 1.0));
    };

    const getRandomPos = (radius: number, max: number) => {
      return Math.random() * (max - radius * 2) + radius;
    };

  
    const circleData = [
      { vx: 0.5, vy: 0.4, baseRadius: 130, color: '#87000d' }, // Maroon
      { vx: -0.4, vy: 0.6, baseRadius: 110, color: '#4a0005' }, // Super Dark Red
      { vx: 0.7, vy: -0.5, baseRadius: 95, color: '#de0018' },  // Vibrant Red
      { vx: -0.6, vy: -0.4, baseRadius: 120, color: '#680009' }, // Dark Red
      { vx: 0.4, vy: -0.6, baseRadius: 100, color: '#3f0004' }, // Deepest Burgundy
      { vx: -0.5, vy: 0.5, baseRadius: 115, color: '#9e000f' }, // Crimson Red
      { vx: 0.6, vy: 0.5, baseRadius: 90, color: '#590008' },  // Dark Maroon
    ];

    const circles: Array<{ x: number; y: number; vx: number; vy: number; baseRadius: number; color: string }> = [];
    const initialScale = getScale(canvas.width);

    circleData.forEach((c) => {
      let placed = false;
      let attempts = 0;
      let x = 0;
      let y = 0;

      while (!placed && attempts < 500) {
        const scaledRadius = c.baseRadius * initialScale;
        x = getRandomPos(scaledRadius, canvas.width);
        y = getRandomPos(scaledRadius, canvas.height);
        let hasOverlap = false;

        for (const existing of circles) {
          const existingScaledRadius = existing.baseRadius * initialScale;
          const dx = x - existing.x;
          const dy = y - existing.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < scaledRadius + existingScaledRadius + (120 * initialScale)) {
            hasOverlap = true;
            break;
          }
        }

        if (!hasOverlap) {
          placed = true;
        }
        attempts++;
      }

      circles.push({ ...c, x, y });
    });

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentScale = getScale(canvas.width);

      for (let i = 0; i < circles.length; i++) {
        const c1 = circles[i];
        
        const r1 = c1.baseRadius * currentScale;
        const currentVx = c1.vx * currentScale;
        const currentVy = c1.vy * currentScale;

        c1.x += currentVx;
        c1.y += currentVy;

        if (c1.x < -r1) {
          c1.x = canvas.width + r1;
        } else if (c1.x > canvas.width + r1) {
          c1.x = -r1;
        }

        if (c1.y < -r1) {
          c1.y = canvas.height + r1;
        } else if (c1.y > canvas.height + r1) {
          c1.y = -r1;
        }

        for (let j = i + 1; j < circles.length; j++) {
          const c2 = circles[j];
          const r2 = c2.baseRadius * currentScale;
          
          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const minDistance = r1 + r2;

          if (distance < minDistance) {
            const overlap = minDistance - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            c1.x -= nx * (overlap / 2);
            c1.y -= ny * (overlap / 2);
            c2.x += nx * (overlap / 2);
            c2.y += ny * (overlap / 2);

            const kx = c1.vx - c2.vx;
            const ky = c1.vy - c2.vy;
            const p = (2.0 * (nx * kx + ny * ky)) / 2;

            c1.vx -= p * nx;
            c1.vy -= p * ny;
            c2.vx += p * nx;
            c2.vy += p * ny;
          }
        }

        ctx.beginPath();
        ctx.arc(c1.x, c1.y, r1, 0, Math.PI * 2);
        ctx.fillStyle = c1.color;
        // Clean minimalist look with subtle professional shadow transparency
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.closePath();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-white" />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 h-full w-full opacity-35"
      />
    </>
  );
};

/* --- MAIN MODAL COMPONENT --- */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4 font-sans">
      
      {/* External Background (Pure white base with organized, non-pastel red/maroon floating circles) */}
      <BouncingBackground />

      {/* Invisible overlay to close modal on click */}
      <div 
        className="absolute inset-0 z-10" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Modal Card */}
      <div 
        className="relative z-20 w-full max-w-[460px] rounded-[32px] border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden sm:px-8 sm:py-7"
      >
        {/* Custom CSS Animation for the moving, beating radial effect */}
        <style>{`
          @keyframes wandering-beat {
            0% { background-position: 0% 0%; background-size: 200% 200%; }
            25% { background-position: 100% 0%; background-size: 250% 250%; }
            50% { background-position: 100% 100%; background-size: 200% 200%; }
            75% { background-position: 0% 100%; background-size: 250% 250%; }
            100% { background-position: 0% 0%; background-size: 200% 200%; }
          }
          .animate-wandering-beat {
            background-image: radial-gradient(circle at center, #de0018 0%, #87000d 50%, #4a0005 100%);
            animation: wandering-beat 6s ease-in-out infinite;
          }
        `}</style>

        {/* The moving, beating background overlay */}
        <div className="absolute inset-0 z-0 animate-wandering-beat opacity-100" />
        
        <div className="relative z-30 w-full text-white">
          
          <div className="flex flex-col items-center justify-center gap-2 drop-shadow-sm">
            {/* Logo without box container, scaled up to match text width */}
            <img 
              src={logo} 
              alt="SKPI Logo" 
              className="h-12 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" 
              style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(94%) saturate(6015%) hue-rotate(345deg) brightness(92%) contrast(105%)' }}
            />
            <span 
              className="text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'Cambria, Georgia, serif' }}
            >
              SKPI Chatbot
            </span>
          </div>

          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {children}
          
        </div>
      </div>
    </div>
  );
};

export default Modal;