export interface ParsedMessage {
  reasoningLines: string[];
  answerLines: string[];
  hasAnswer: boolean;
}

export type LineType = 'heading' | 'bullet' | 'numbered' | 'text' | 'empty';

export interface ParsedLine {
  type: LineType;
  content: string;
  level?: number;
  indent?: number;
  prefix?: string;
}

export const parseMessageContent = (content: string): ParsedMessage => {
  const lines = content.split('\n');
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

  return {
    reasoningLines,
    answerLines,
    hasAnswer: answerLines.some((l) => l.trim() !== ''),
  };
};

export const parseLine = (line: string): ParsedLine => {
  if (line.trim() === '') return { type: 'empty', content: '' };

  const isHeading = /^(\s*)(#{1,6})\s+(.*)/.exec(line);
  if (isHeading) {
    return {
      type: 'heading',
      level: isHeading[2].length,
      content: isHeading[3],
    };
  }

  const isBullet = /^(\s*)([-*•])\s+(.*)/.exec(line);
  if (isBullet) {
    return {
      type: 'bullet',
      indent: isBullet[1].length * 6 + 8,
      prefix: '•',
      content: isBullet[3],
    };
  }

  const isNumbered = /^(\s*)(\d+\.)\s+(.*)/.exec(line);
  if (isNumbered) {
    return {
      type: 'numbered',
      indent: isNumbered[1].length * 6 + 8,
      prefix: isNumbered[2],
      content: isNumbered[3],
    };
  }

  return { type: 'text', content: line };
};

export const parseBoldText = (text: string) => {
  const parts: { text: string; isBold: boolean }[] = [];
  const split = text.split(/(\*\*.*?\*\*)/g);
  
  for (const part of split) {
    if (part.startsWith('**') && part.endsWith('**')) {
      parts.push({ text: part.slice(2, -2), isBold: true });
    } else if (part) {
      parts.push({ text: part, isBold: false });
    }
  }
  return parts;
};