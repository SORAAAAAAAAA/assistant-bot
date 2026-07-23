import type { FC, RefObject } from 'react'

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
        className={`relative bg-gray-200 pl-6 pr-2 py-4 rounded-3xl overflow-hidden shadow-[0_6px_25px_rgba(0,0,0,0.05)] flex items-center border cursor-text transition-all duration-300 border-white/50 focus-within:border-[#87000d]'}`}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={isTyping ? "" : "Ask about Procedures"}
          disabled={isTyping}
          className="flex-1 border-none bg-transparent outline-none text-[13px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-tight placeholder:text-gray-500"
        />

        {/* Red Send Button with Arrow Glyph */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            if (canSend) onSend()
          }}
          disabled={!canSend}
          aria-label="Send message"
          className={`flex items-center justify-center w-6 h-6 rounded-3xl bg-[#87000d] text-white font-bold text-sm leading-none transition-all duration-200 ${canSend
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