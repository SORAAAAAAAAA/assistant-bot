import type { FC, RefObject } from 'react'
import { AttachmentPreview } from './AttachmentPreview'
import { SwirlBorder } from './SwirlBorder'

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
    <div className="group absolute bottom-[50px] left-1/2 -translate-x-1/2 w-3/5 max-w-[900px] z-[100]">
      <AttachmentPreview 
        files={attachedFiles} 
        onClear={() => onFileSelect([])} 
      />

      <div
        className={`relative bg-white/50 backdrop-blur-[30px] px-10 py-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center border cursor-text will-change-transform transition-[transform_0.4s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease,background_0.3s_ease] group-hover:-translate-y-[3px] group-hover:scale-[1.008] group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] group-active:!translate-y-[-1px] group-active:!scale-[0.995] group-active:!duration-100 group-active:!ease-linear group-focus-within:-translate-y-[3px] group-focus-within:scale-[1.008] group-focus-within:shadow-[0_15px_35px_rgba(226,59,78,0.12)] ${
          isTyping ? 'border-transparent' : 'border-white/60'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <SwirlBorder active={isTyping} radius={16} />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
        />
        
        <span 
          className={`text-xl mr-[18px] transition-all duration-300 ${attachedFiles.length > 0 ? 'text-[#E23B4E] opacity-100' : 'opacity-50'} cursor-pointer hover:scale-125`}
          onClick={(e) => { 
            e.stopPropagation() 
            fileInputRef.current?.click() 
          }}
        >
          📎
        </span>

        <input
          ref={inputRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={attachedFiles.length > 0 ? "Press Enter to send document..." : "ENTER QUERY..."}
          disabled={isTyping}
          className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-wide"
        />
      </div>
    </div>
  )
}
