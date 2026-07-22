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


  return (
    <div className="group w-[85%] relative mt-3 ml-auto px-4">

      <div
        className={`relative bg-white/10 backdrop-blur-[20px] px-6 py-3 rounded-xl overflow-hidden shadow-[0_6px_25px_rgba(0,0,0,0.05)] flex items-center border cursor-text transition-all duration-300 ${isTyping
          ? 'border-transparent animate-[glowRed_0.8s_ease-in-out_infinite]'
          : 'border-black/60'
          }`}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={"Enter Query..."}
          disabled={isTyping}
          className="flex-1 border-none bg-transparent outline-none text-[11px] text-[#1A1C1E] font-['JetBrains_Mono',monospace] tracking-tight"
        />
      </div>
    </div>
  )
}