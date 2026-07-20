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
    <div className="group w-[85%] relative mt-4 ml-auto px-8">
      <AttachmentPreview 
        files={attachedFiles} 
        onClear={() => onFileSelect([])} 
      />

      <div
        className={`relative bg-white/50 backdrop-blur-[30px] px-10 py-5 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center border cursor-text will-change-transform transition-[transform_0.4s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease,background_0.3s_ease] group-hover:-translate-y-[3px] group-hover:scale-[1.008] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] group-active:!translate-y-[-1px] group-active:!scale-[0.995] group-active:!duration-100 group-active:!ease-linear group-focus-within:-translate-y-[3px] group-focus-within:scale-[1.008] group-focus-within:shadow-[0_15px_35px_rgba(226,59,78,0.12)] ${
          isTyping ? 'border-transparent' : 'border-black/60'
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
          className={`mr-[18px] transition-all duration-300 cursor-pointer outline-none ${
            attachedFiles.length > 0 ? 'text-[#E23B4E] opacity-100' : 'text-[#1A1C1E] opacity-40'
          } hover:scale-125 active:scale-95`}
          onClick={(e) => { 
            e.stopPropagation() 
            fileInputRef.current?.click() 
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="22" 
            height="22" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={attachedFiles.length > 0 ? "Press Enter to send document..." : "Enter Query..."}
          disabled={isTyping}
          className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-wide"
        />
      </div>
    </div>
  )
}