import type { FC } from 'react'
import type { Message } from '@/types'

interface ChatMessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  onJump?: (relatedId?: number) => void
}

const GLASS_STYLE = "backdrop-blur-xl border border-white/20 ring-1 ring-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"

export const ChatMessageBubble: FC<ChatMessageBubbleProps> = ({ message, variant, onJump }) => {
  const isUser = variant === 'user'

  if (isUser) {
    return (
      <div className="w-fit max-w-[85%] ml-auto shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div
          className={`
            ${GLASS_STYLE} 
            bg-white/20
            px-4 py-3
            rounded-3xl
            relative 
            will-change-transform transition-all duration-300 
            active:scale-95 break-words whitespace-normal text-left
          `}
          onClick={() => onJump?.(message.relatedId)}
        >
          <div className="text-[11px] text-[#1A1C1E] leading-[1.4] font-medium">
            {message.content}
          </div>

          {message.files && message.files.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/30 flex flex-col gap-1">
              {message.files.map((name, i) => (
                <div key={i} className="text-[9px] bg-white/30 px-2 py-0.5 rounded flex items-center overflow-hidden gap-1.5 border border-white/20">
                  <span className="text-[#E23B4E]">📄</span> {name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Assistant variant — left-aligned, plain text spanning full width
  return (
    <div id={`msg-${message.id}`} className="w-full shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
      <div className="text-[11px] text-[#1A1C1E] leading-[1.6] font-medium break-words whitespace-pre-wrap text-left">
        {message.content}
      </div>
    </div>
  )
}