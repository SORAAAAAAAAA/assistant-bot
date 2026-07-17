import type { FC } from 'react'
import type { Message } from './types'
import { SwirlBorder } from './SwirlBorder'

interface MessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  highlighted?: boolean
  onJump?: (relatedId?: number) => void
}

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
          className="bg-[#E23B4E] text-white px-6 py-5 rounded-[24px_24px_4px_24px] text-[15px] shadow-[0_4px_15px_rgba(226,59,78,0.15)] leading-[1.4] cursor-pointer relative will-change-transform transition-[transform_0.5s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease] hover:-translate-y-[10px] hover:scale-[1.03] hover:shadow-[0_25px_45px_rgba(0,0,0,0.12)] hover:z-50 active:!translate-y-[-4px] active:!scale-[0.96] active:!duration-100 active:!ease-linear"
          onClick={() => onJump?.(message.relatedId)}
        >
          {message.content}
          {message.files && message.files.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-col gap-1">
              {message.files.map((name, i) => (
                <div key={i} className="text-[11px] bg-white/20 px-2 py-1 rounded flex items-center gap-2">
                  <span>📄</span> {name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-right text-[11px] text-[#6B7280] mt-3 font-semibold font-['JetBrains_Mono',monospace]">{message.time}</div>
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
        className={`bg-white/45 backdrop-blur-[24px] p-7 rounded-[24px_24px_24px_4px] text-[15px] text-[#1A1C1E] shadow-[0_8px_32px_rgba(0,0,0,0.05)] leading-[1.6] relative border will-change-transform transition-[transform_0.5s_cubic-bezier(0.34,1.56,0.64,1),box-shadow_0.4s_ease] hover:-translate-y-[10px] hover:scale-[1.03] hover:shadow-[0_25px_45px_rgba(0,0,0,0.12)] hover:z-50 active:!translate-y-[-4px] active:!scale-[0.96] active:!duration-100 active:!ease-linear ${
          highlighted ? 'border-transparent' : 'border-white/50'
        }`}
      >
        <SwirlBorder active={highlighted} radius={24} />
        {message.content}
      </div>
      <div className="text-[11px] text-[#6B7280] mt-3 font-semibold font-['JetBrains_Mono',monospace]">{message.time}</div>
    </div>
  )
}
