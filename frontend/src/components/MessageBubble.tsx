import type { FC } from 'react'
import type { Message } from './types'
import { SwirlBorder } from './SwirlBorder'

interface MessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  highlighted?: boolean
  onJump?: (relatedId?: number) => void
}

const TIME_STAMP_CLASSES = "text-right text-[8.5px] text-[#6B7280] mt-1.5 font-semibold font-['JetBrains_Mono',monospace] uppercase tracking-wider"

export const MessageBubble: FC<MessageBubbleProps> = ({ message, variant, highlighted = false, onJump }) => {
  const isUser = variant === 'user'
  const borderRadius = "rounded-[16px_16px_3px_16px]"; // Scaled down from 24/4

  if (isUser) {
    return (
      <div className="w-[85%] shrink-0 animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
        <div
          className={`bg-white text-[#1A1C1E] border border-gray-200 px-4 py-3 ${borderRadius} text-[11px] shadow-sm leading-[1.4] cursor-pointer relative will-change-transform transition-all hover:-translate-y-1 hover:shadow-md active:scale-95 break-words whitespace-normal`}
          onClick={() => onJump?.(message.relatedId)}
        >
          {message.content}
          {message.files && message.files.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-col gap-1">
              {message.files.map((name, i) => (
                <div key={i} className="text-[9px] bg-gray-50 px-2 py-0.5 rounded flex items-center overflow-hidden gap-1.5 border border-gray-100">
                  <span className="text-[#E23B4E]">📄</span> {name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={TIME_STAMP_CLASSES}>{message.time}</div>
      </div>
    )
  }

  return (
    <div id={`msg-${message.id}`} className="w-[90%] shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
      <div
        className={`bg-white p-5 rounded-[16px_16px_16px_3px] text-[11px] text-[#1A1C1E] shadow-sm leading-[1.6] relative border transition-all duration-300 hover:-translate-y-1 hover:shadow-md break-words whitespace-normal ${
          highlighted ? 'border-[#E23B4E] ring-1 ring-[#E23B4E]/10' : 'border-gray-200'
        }`}
      >
        <SwirlBorder active={highlighted} />
        {message.content}
      </div>
      <div className={TIME_STAMP_CLASSES}>{message.time}</div>
    </div>
  )
}