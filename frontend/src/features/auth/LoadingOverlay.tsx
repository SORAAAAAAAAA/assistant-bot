export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] border border-white/40 bg-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]">
        {/* Glossy inner overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/70 bg-gradient-to-b from-white/60 via-transparent to-transparent opacity-80" />
        
        {/* CSS Spinner */}
        <div className="relative z-10 h-10 w-10 animate-spin rounded-full border-4 border-red-500/20 border-t-red-600"></div>
      </div>
    </div>
  );
}
