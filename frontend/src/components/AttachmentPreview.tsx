import type { FC } from 'react'

interface AttachmentPreviewProps {
  files: File[]
  onClear: () => void
}

export const AttachmentPreview: FC<AttachmentPreviewProps> = ({ files, onClear }) => {
  if (files.length === 0) return null

  return (
    <div className="absolute -top-12 left-0 left-auto flex gap-2 animate-[popIn_0.3s_ease_forwards]">
      {files.map((file, i) => (
        <div 
          key={i} 
          className="bg-white/80 backdrop-blur-md border border-white/50 text-[10px] px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2"
        >
          <span className="font-bold text-[#E23B4E]">Attached:</span> {file.name}
          <button 
            onClick={onClear} 
            className="hover:text-red-500 ml-1 cursor-pointer"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}