import type { FC } from 'react'
import type { Message } from './types'
import { SwirlBorder } from './SwirlBorder'

interface MessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  highlighted?: boolean
  onJump?: (relatedId?: number) => void
}

const TIME_STAMP_CLASSES = "text-right text-[11px] text-[#6B7280] mt-2.5 font-semibold font-['JetBrains_Mono',monospace] uppercase tracking-wider"

export const MessageBubble: FC<MessageBubbleProps> = ({ 
  message, 
  variant, 
  highlighted = false,
  onJump 
}) => {
  const isUser = variant === 'user'

  if (isUser) {
    return (
      <div className="w-[85%] shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div
          className="bg-[#E23B4E] text-white px-6 py-5 rounded-[24px_24px_4px_24px] text-[15px] shadow-[0_4px_15px_rgba(226,59,78,0.15)] leading-[1.4] cursor-pointer relative bill-change-transform transition-[transform_0.5s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease] hover:-translate-y-[10px] hover:scale-[1.03] hover:shadow-[0_25px_45px_rgba(0,0,0,0.12)] hover:z-50 active:!translate-y-[-4px] active:!scale-[0.96] active:!duration-100 active:!ease-linear break-words whitespace-normal"
          onClick={() => onJump?.(message.relatedId)}
        >
          {message.content}
          {message.files && message.files.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-col gap-1">
              {message.files.map((name, i) => (
                <div key={i} className="text-[11px] bg-white/20 px-2 py-1 rounded flex items-center overflow-hidden gap-2">
                  <span>📄</span> {name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={TIME_STAMP_CLASSES}>
          {message.time}
        </div>
      </div>
    )
  }

  // Assistant variant
return (
  <div 
    id={`msg-${message.id}`} 
    className="w-[90%] shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
  >
    <div
      className={`
        /* Glassmorphism Material */
        bg-white/10 
        backdrop-blur-xl 
        border border-white/20 
        ring-1 ring-black/5
        shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]
        
        /* Layout & Text */
        p-7 
        rounded-[24px_24px_4px_24px] 
        text-[15px] 
        text-[#1A1C1E] 
        leading-[1.6] 
        relative 
        break-words 
        whitespace-normal

        /* Interaction States */
        will-change-transform 
        transition-[transform_0.5s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease,border_0.3s_ease] 
        hover:-translate-y-[10px] 
        hover:scale-[1.03] 
        hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] 
        hover:z-50 
        active:!translate-y-[-4px] 
        active:!scale-[0.96] 
        active:!duration-100 
        active:!ease-linear

        /* Dynamic Highlight */
        ${highlighted ? 'border-transparent ring-0' : 'border-white/20'}
      `}
    >
      <SwirlBorder active={highlighted} />
      {message.content}
    </div>
    <div className={TIME_STAMP_CLASSES}>
      {message.time}
    </div>
  </div>
)}