import type { FC } from 'react'

interface AttachmentPreviewProps {
  files: File[]
  onClear: () => void
}

export const AttachmentPreview: FC<AttachmentPreviewProps> = ({ files, onClear }) => {
  if (files.length === 0) return null

  return (
    <div className="absolute -top-12 left-10 right-10 flex flex-wrap gap-2 animate-[popIn_0.3s_ease_forwards] z-20">
      {files.map((file, i) => (
        <div 
          key={i} 
          className="bg-white/90 backdrop-blur-md border border-white/50 text-[10px] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2 max-w-full overflow-hidden"
        >
          <span className="font-bold text-[#E23B4E] shrink-0 tracking-tighter">Attached:</span> 
          <span className="truncate break-all text-[#1A1C1E] font-medium">
            {file.name}
          </span>

          <button 
            onClick={onClear} 
            className="hover:text-[#E23B4E] ml-1 cursor-pointer shrink-0 text-sm transition-colors"
            title="Remove file"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}