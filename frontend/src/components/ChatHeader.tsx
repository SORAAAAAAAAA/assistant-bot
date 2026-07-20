import type { FC } from 'react'

interface ChatHeaderProps {
  title: string
  subtitle: string
  color?: string
}

export const ChatHeader: FC<ChatHeaderProps> = ({ 
  title, 
  subtitle, 
  color = '#E23B4E' 
}) => {
  return (
    <header className="pb-6 shrink-0 text-center">
      <h1 
        className="text-[32px] font-extrabold m-0 font-['Hanken_Grotesk',system-ui,sans-serif]" 
        style={{ color }}
      >
        {title}
      </h1>
      <p className="text-[#6B7280] text-[15px] mt-1">{subtitle}</p>
    </header>
  )
}