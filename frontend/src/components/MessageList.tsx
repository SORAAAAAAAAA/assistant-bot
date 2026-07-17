import type { FC, RefObject } from 'react'
import type { Message } from './types'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: Message[]
  variant: 'user' | 'assistant'
  highlightedId?: number | null
  onJump?: (relatedId?: number) => void
  scrollRef?: RefObject<HTMLDivElement | null>
}

export const MessageList: FC<MessageListProps> = ({ 
  messages, 
  variant, 
  highlightedId,
  onJump,
  scrollRef 
}) => {
  return (
    <div
      ref={scrollRef}
      className={`no-scrollbar flex-1 overflow-y-auto flex flex-col gap-10 ${
        variant === 'user' ? 'items-end px-8 py-5' : 'px-8 py-5'
      } [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
    >
      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          message={msg}
          variant={variant}
          highlighted={highlightedId === msg.id}
          onJump={onJump}
        />
      ))}
    </div>
  )
}