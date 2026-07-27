interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Logging in...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col gap-4 items-center justify-center bg-slate-900/40 backdrop-blur-md transition-all duration-300">
      {/* CSS Spinner */}
      <div className="relative z-10 h-12 w-12 animate-spin rounded-full border-4 border-red-500/20 border-t-red-600"></div>
      
      {/* Text label */}
      <p className="text-white text-[15px] font-bold tracking-wide drop-shadow-md animate-pulse">
        {message}
      </p>
    </div>
  );
}
