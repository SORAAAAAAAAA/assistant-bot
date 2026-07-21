import type { FC } from 'react'
import type { Message } from './types'

interface MessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  highlighted?: boolean
  onJump?: (relatedId?: number) => void
}

const TIME_STAMP_CLASSES = "text-right text-[8.5px] text-[#6B7280] mt-1.5 font-semibold font-['JetBrains_Mono',monospace] uppercase tracking-wider"

const GLASS_STYLE = "backdrop-blur-xl border border-white/60 ring-1 ring-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"

export const MessageBubble: FC<MessageBubbleProps> = ({ message, variant, highlighted = false, onJump }) => {
  const isUser = variant === 'user'
  
  const userRadius = "rounded-[20px_20px_4px_20px]";
  const aiRadius = "rounded-[20px_20px_20px_4px]";

  if (isUser) {
    return (
      <div className="w-[85%] shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div
          className={`
            ${GLASS_STYLE} 
            bg-white/40 
            px-4 py-3 
            ${userRadius} 
            cursor-pointer relative 
            transition-all duration-300 
            hover:-translate-y-1 hover:shadow-lg hover:bg-white/50 
            active:scale-95 break-words whitespace-normal
          `}
          onClick={() => onJump?.(message.relatedId)}
        >
          <div className="text-[11px] text-[#1A1C1E] leading-[1.5] font-semibold tracking-tight">
            {message.content}
          </div>
          {/* File attachments logic remains the same... */}
        </div>
        <div className={TIME_STAMP_CLASSES}>{message.time}</div>
      </div>
    )
  }

  // Assistant variant
  return (
    <div id={`msg-${message.id}`} className="w-[90%] shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
      <div
        className={`
          ${GLASS_STYLE} 
          bg-white/60 
          p-5 
          ${aiRadius} 
          relative 
          transition-all duration-300 
          hover:-translate-y-1 hover:shadow-lg 
          break-words whitespace-normal
          ${highlighted ? 'animate-[glowRed_0.8s_ease-in-out_infinite] border-transparent' : ''}
        `}
      >
        <div className="text-[11px] text-[#1A1C1E] leading-[1.6] font-semibold tracking-tight">
          {message.content}
        </div>
      </div>
      <div className={TIME_STAMP_CLASSES}>{message.time}</div>
    </div>
  )
}