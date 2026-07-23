import type { FC, RefObject } from 'react'
import { SwirlBorder } from './SwirlBorder'

interface MessageComposerProps {
  input: string
  isTyping: boolean
  onSend: () => void
  onInputChange: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}

export const MessageComposer: FC<MessageComposerProps> = ({
  input,
  isTyping,
  onSend,
  onInputChange,
  inputRef
}) => {
  const canSend = input.trim().length > 0 && !isTyping

  return (
    <div className="group w-full max-w-[85%] relative mt-3 mx-auto px-4">
      <div
        className={`relative bg-white/10 backdrop-blur-[20px] pl-6 pr-2 py-2 rounded-xl overflow-hidden shadow-[0_6px_25px_rgba(0,0,0,0.05)] flex items-center border transition-all duration-300 cursor-text ${
          isTyping ? 'border-transparent' : 'border-black/60 focus-within:border-[#E23B4E]'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        <SwirlBorder active={isTyping} radii={[12, 12, 12, 12]} />

        <input
          ref={inputRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={isTyping ? "" : "Enter Query..."}
          disabled={isTyping}
          className="flex-1 border-none bg-transparent outline-none text-[11px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-tight placeholder:text-gray-500 z-10"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (canSend) onSend()
          }}
          disabled={!canSend}
          aria-label="Send message"
          className={`flex items-center justify-center w-8 h-8 rounded-lg bg-[#E23B4E] text-white font-bold text-sm leading-none transition-all duration-200 z-10 shrink-0 ${
            canSend
              ? 'hover:bg-[#C82D3F] hover:scale-105 active:scale-95 cursor-pointer opacity-100 shadow-md'
              : 'opacity-40 cursor-not-allowed'
          }`}
        >
          ↑
        </button>
      </div>
    </div>
  )
}