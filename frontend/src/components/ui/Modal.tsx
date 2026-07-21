import React, { useEffect, useRef } from 'react';
import logo from '@/assets/logoseiwa.png'; 

/* --- BACKGROUND COMPONENT --- */
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
      { vx: 0.8, vy: 0.6, baseRadius: 100, color: '#FCA5A5' }, 
      { vx: -0.5, vy: 0.9, baseRadius: 80, color: '#F87171' },  
      { vx: 1.0, vy: -0.7, baseRadius: 115, color: '#EF4444' }, 
      { vx: -0.9, vy: -0.5, baseRadius: 95, color: '#DC2626' }, 
      { vx: 0.6, vy: -0.8, baseRadius: 105, color: '#B91C1C' }, 
      { vx: -0.7, vy: 1.0, baseRadius: 70, color: '#991B1B' },  
      { vx: -0.6, vy: 0.7, baseRadius: 85, color: '#EF4444' },  
      { vx: 0.7, vy: -0.6, baseRadius: 110, color: '#FCA5A5' }, 
      { vx: -0.8, vy: -0.6, baseRadius: 100, color: '#B91C1C' },
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
          
          if (distance < scaledRadius + existingScaledRadius + (100 * initialScale)) {
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
        className="absolute inset-0 z-0 h-full w-full"
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
      
      <BouncingBackground />

      <div 
        className="absolute inset-0 z-10" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* REVERTED WIDTH: max-w-[460px] so it is not overly wide */}
      <div 
        className="relative z-20 w-full max-w-[460px] rounded-[32px] border border-white/60 bg-white/30 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-3xl sm:px-8 sm:py-7"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/80 bg-gradient-to-b from-white/60 via-white/20 to-transparent opacity-80" />
        
        <div className="relative z-30 w-full text-slate-900">
          
          <div className="flex flex-col items-center justify-center gap-1.5 drop-shadow-sm">
            <img 
              src={logo} 
              alt="SKPI Logo" 
              className="h-9 w-auto object-contain" 
            />
            <span 
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: 'Cambria, Georgia, serif' }}
            >
              <span className="text-red-600">SKPI</span> <span className="text-slate-900">Chatbot</span>
            </span>
          </div>

          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-slate-900/15 to-transparent" />

          {children}
          
        </div>
      </div>
    </div>
  );
};

export default Modal;