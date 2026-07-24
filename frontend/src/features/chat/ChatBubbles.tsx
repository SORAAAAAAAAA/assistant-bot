import { type FC, useState, useEffect } from 'react'
import type { Message } from '@/types'

interface ChatMessageBubbleProps {
  message: Message
  variant: 'user' | 'assistant'
  onJump?: (relatedId?: number) => void
}

const GLASS_STYLE = "backdrop-blur-xl border border-white/20 ring-1 ring-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"

export const ChatMessageBubble: FC<ChatMessageBubbleProps> = ({ message, variant, onJump }) => {
  const isUser = variant === 'user'

  // Pre-parse reasoning and answer lines
  const lines = message.content.split('\n');
  const reasoningLines: string[] = [];
  const answerLines: string[] = [];
  let isReasoningPhase = true;

  for (const line of lines) {
    const isQuote = /^(\s*)>\s*(.*)/.exec(line);
    if (isQuote && isReasoningPhase) {
      reasoningLines.push(isQuote[2]);
    } else {
      if (line.trim() !== '') {
        isReasoningPhase = false;
      }
      answerLines.push(line);
    }
  }

  const hasAnswer = answerLines.some(l => l.trim() !== '');
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse when the final answer starts appearing
  useEffect(() => {
    if (hasAnswer) {
      setIsExpanded(false);
    }
  }, [hasAnswer]);

  const renderBold = (text: string) => text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });

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
          <div className="text-[14px] text-[#1A1C1E] leading-[1.4] font-medium">
            {message.content}
          </div>

          {message.files && message.files.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/30 flex flex-col gap-1">
              {message.files.map((name, i) => (
                <div key={i} className="text-[9px] bg-white/30 px-2 py-0.5 rounded flex items-center overflow-hidden gap-1.5 border border-white/20">
                  <span className="text-[#de0018]">📄</span> {name}
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
    <div id={`msg-${message.id}`} className="w-full shrink-0 relative animate-[popIn_0.35s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
      <div className="text-[14px] text-[#1A1C1E] leading-[1.6] font-medium break-words text-left flex flex-col gap-1">

        {/* Reasoning Accordion */}
        {reasoningLines.length > 0 && (
          <div className="mb-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium select-none transition-colors"
            >
              <span className={`transform transition-transform text-[9px] ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
              Thought process
            </button>
            {isExpanded && (
              <div className="mt-2 pl-3 border-l-2 border-gray-300 text-gray-500 italic text-[13px] flex flex-col gap-1 animate-[popIn_0.2s_ease-out_forwards]">
                {reasoningLines.map((line, i) => (
                  <div key={i}>{renderBold(line)}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Final Answer */}
        {answerLines.map((line, lineIdx) => {
          const isBullet = /^(\s*)([-*•])\s+(.*)/.exec(line);
          const isNumbered = /^(\s*)(\d+\.)\s+(.*)/.exec(line);

          let prefix = '';
          let content = line;
          let indent = 0;

          if (isBullet) {
            indent = isBullet[1].length * 6 + 8;
            prefix = '•';
            content = isBullet[3];
          } else if (isNumbered) {
            indent = isNumbered[1].length * 6 + 8;
            prefix = isNumbered[2];
            content = isNumbered[3];
          }

          if (line.trim() === '') {
            return <div key={lineIdx} className="h-1.5" />;
          }

          if (isBullet || isNumbered) {
            return (
              <div key={lineIdx} className="flex gap-2" style={{ paddingLeft: `${indent}px` }}>
                <span className="shrink-0 text-black/60 font-bold min-w-[14px] text-right">{prefix}</span>
                <span className="flex-1">{renderBold(content)}</span>
              </div>
            );
          }

          return (
            <div key={lineIdx}>
              {renderBold(line)}
            </div>
          );
        })}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-300/60 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sources</span>
          <div className="flex flex-wrap gap-2">
            {message.sources.map((src, i) => (
              <div key={i} className="text-[10px] bg-white/70 px-2.5 py-1 rounded-md shadow-sm border border-gray-200/50 flex items-center gap-1.5 text-gray-700 font-medium">
                <span className="text-[#de0018]">-</span> {src}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}