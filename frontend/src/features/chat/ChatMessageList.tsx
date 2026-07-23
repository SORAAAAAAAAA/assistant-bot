import type { FC, RefObject } from 'react'
import type { Message } from '@/types'
import { ChatMessageBubble } from './ChatBubbles'

interface ChatMessageListProps {
  messages: Message[]
  onJump?: (relatedId?: number) => void
  scrollRef?: RefObject<HTMLDivElement | null>
  isThinking?: boolean
}

export const ChatMessageList: FC<ChatMessageListProps> = ({ messages, onJump, scrollRef, isThinking }) => {
  return (
    <div
      ref={scrollRef}
      className="no-scrollbar flex-1 overflow-y-auto flex flex-col gap-6 px-5 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {messages.map(msg => {
        const isUser = msg.role === 'user'
        return (
          <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-center'}`}>
            <ChatMessageBubble
              message={msg}
              variant={isUser ? 'user' : 'assistant'}
              onJump={onJump}
            />
          </div>
        )
      })}
      {isThinking && (
        <div className="flex gap-[1px] text-[10px] justify-start py-3 px-5 font-semibold font-['JetBrains_Mono',monospace]">
          {"THINKING...".split("").map((char, i) => (
            <span key={i} className="inline-block animate-[blinkRed_1.5s_infinite_ease-in-out]" style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
          ))}
        </div>
      )}
    </div>
  )
}