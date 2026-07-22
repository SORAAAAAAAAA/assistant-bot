import type { FC } from 'react'
import type { Message } from '../../types'
import { SwirlBorder } from './SwirlBorder'

interface MessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  highlighted?: boolean
  onJump?: (relatedId?: number) => void
}

const GLASS_STYLE = "backdrop-blur-xl border border-white/60 ring-1 ring-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"

export const MessageBubble: FC<MessageBubbleProps> = ({ message, variant, highlighted = false, onJump }) => {
  const isUser = variant === 'user'

  if (isUser) {
    return (
      <div className="w-[85%] shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div
          className={`
            ${GLASS_STYLE} 
            bg-white/40 
            px-4 py-3 
            rounded-[16px_16px_3px_16px] 
            cursor-pointer relative 
            will-change-transform transition-all duration-300 
            hover:-translate-y-1 hover:shadow-lg hover:bg-white/50 
            active:scale-95 break-words whitespace-normal
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

  // Assistant variant
  return (
    <div id={`msg-${message.id}`} className="w-[90%] shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
      <div
        className={`
          ${GLASS_STYLE} 
          bg-white/60 
          p-5 
          rounded-[16px_16px_16px_3px] 
          relative 
          will-change-transform transition-all duration-300 
          hover:-translate-y-1 hover:shadow-lg 
          break-words whitespace-normal
          ${highlighted ? 'ring-2 ring-[#E23B4E]/40 border-transparent shadow-[0_0_20px_rgba(226,59,78,0.15)]' : ''}
        `}
      >
        <SwirlBorder active={highlighted} radii={[16, 16, 16, 3]} />
        <div className="text-[11px] text-[#1A1C1E] leading-[1.6] font-medium">
          {message.content}
        </div>
      </div>
    </div>
  )
}