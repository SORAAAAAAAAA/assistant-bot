import type { FC } from 'react'
import type { Message } from '../../types'
import { SwirlBorder } from './SwirlBorder'

interface MessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  highlighted?: boolean
  onJump?: (relatedId?: number) => void
}

const GLASS_STYLE = "backdrop-blur-xl border border-black/10 ring-1 ring-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"

export const MessageBubble: FC<MessageBubbleProps> = ({ message, variant, highlighted = false, onJump }) => {
  const isUser = variant === 'user'

  if (isUser) {
    return (
      <div className="w-[85%] shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div
          className={`
            ${GLASS_STYLE} 
            bg-red-500/10
            border border-red-300/30
            px-4 py-3
            rounded-3xl
            cursor-pointer relative 
            will-change-transform transition-all duration-300 
            hover:-translate-y-1 hover:shadow-lg hover:bg-red-500/20
            active:scale-95 break-words whitespace-normal
          `}
          onClick={() => onJump?.(message.relatedId)}
        >
          <div className="text-[11px] text-[#1A1C1E] leading-[1.4] font-medium">
            {message.content}
          </div>
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
          bg-white/20
          px-4 py-3
          rounded-3xl
          relative 
          will-change-transform transition-all duration-300 
          hover:-translate-y-1 hover:shadow-lg 
          break-words whitespace-pre-wrap
          ${highlighted ? 'ring-2 ring-[#E23B4E]/40 border-transparent shadow-[0_0_20px_rgba(226,59,78,0.15)]' : ''}
        `}
      >
        <SwirlBorder active={highlighted} radii={[16, 16, 16, 3]} />
        <div className="text-[12px] text-[#1A1C1E] leading-[1.6] font-medium">
          {/* Format AI Output to BOLD */}
          {message.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </div>

        {/* Distinct Sources Rendering */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-300/60 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sources</span>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((src, i) => (
                <div key={i} className="text-[10px] bg-white/70 px-2.5 py-1 rounded-md shadow-sm border border-gray-200/50 flex items-center gap-1.5 text-gray-700 font-medium">
                  <span className="text-[#E23B4E]">-</span> {src}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}