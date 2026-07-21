import type { FC, RefObject } from 'react'
import { AttachmentPreview } from './AttachmentPreview'

interface MessageComposerProps {
  input: string
  attachedFiles: File[]
  isTyping: boolean
  onSend: () => void
  onFileSelect: (files: File[]) => void
  onInputChange: (value: string) => void
  fileInputRef: RefObject<HTMLInputElement | null>
  inputRef: RefObject<HTMLInputElement | null>
}

export const MessageComposer: FC<MessageComposerProps> = ({
  input,
  attachedFiles,
  isTyping,
  onSend,
  onFileSelect,
  onInputChange,
  fileInputRef,
  inputRef
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      onFileSelect(Array.from(files))
    }
  }

  return (
    <div className="group w-[85%] relative mt-3 ml-auto px-4">
      <AttachmentPreview 
        files={attachedFiles} 
        onClear={() => onFileSelect([])} 
      />

      <div
        className={`relative bg-white/50 backdrop-blur-[20px] px-6 py-3 rounded-xl overflow-hidden shadow-[0_6px_25px_rgba(0,0,0,0.05)] flex items-center border cursor-text transition-all duration-300 ${
          /* 
             GLOW RESTORED: 
             - When typing: transparent border + red pulse animation
             - When idle: standard semi-transparent black border
          */
          isTyping 
            ? 'border-transparent animate-[glowRed_0.8s_ease-in-out_infinite]' 
            : 'border-black/60'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
        />
        
        <button 
          type="button"
          className={`mr-3 transition-all duration-300 cursor-pointer outline-none ${
            attachedFiles.length > 0 ? 'text-[#E23B4E] opacity-100' : 'text-[#1A1C1E] opacity-40'
          } hover:scale-110 active:scale-95`}
          onClick={(e) => { 
            e.stopPropagation() 
            fileInputRef.current?.click() 
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={attachedFiles.length > 0 ? "Send documents..." : "Enter Query..."}
          disabled={isTyping}
          className="flex-1 border-none bg-transparent outline-none text-[11px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-tight"
        />
      </div>
    </div>
  )
}