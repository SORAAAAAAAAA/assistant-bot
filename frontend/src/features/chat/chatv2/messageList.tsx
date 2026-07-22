import type { FC, RefObject } from 'react'
import type { Message } from '@/types'
import { ChatMessageBubble } from './bubbles'

interface ChatMessageListProps {
  messages: Message[]
  onJump?: (relatedId?: number) => void
  scrollRef?: RefObject<HTMLDivElement | null>
}

export const ChatMessageList: FC<ChatMessageListProps> = ({ messages, onJump, scrollRef }) => {
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
    </div>
  )
}