export interface ParsedMessage {
    reasoningLines: string[];
    answerLines: string[];
    hasAnswer: boolean;
    isCurrentlyThinking: boolean;
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
    let inThinkTag = false;
    let hasSeenThinkStart = false;
    let hasSeenThinkEnd = false;

    for (let line of lines) {
        if (line.includes('<think>')) {
            hasSeenThinkStart = true;
            inThinkTag = true;
            isReasoningPhase = true;
            const parts = line.split('<think>');
            if (parts[0].trim()) answerLines.push(parts[0]);
            line = parts.slice(1).join('<think>');
        }

        if (line.includes('</think>')) {
            hasSeenThinkEnd = true;
            inThinkTag = false;
            isReasoningPhase = false;
            const parts = line.split('</think>');
            if (parts[0].trim()) reasoningLines.push(parts[0]);
            line = parts.slice(1).join('</think>');

            if (!line.trim()) continue;
        }

        if (inThinkTag) {
            reasoningLines.push(line);
            continue;
        }

        const isQuote = /^(\s*)>\s*(.*)/.exec(line);
        if (isQuote) {
            isReasoningPhase = true;
            reasoningLines.push(isQuote[2]);
            continue;
        } else {
            const cleanLine = line.trim().toLowerCase();
            if (cleanLine !== '' && !cleanLine.startsWith('thinking process') && !cleanLine.startsWith('here is the thought') && !cleanLine.startsWith('okay') && !cleanLine.startsWith('let me')) {
                isReasoningPhase = false;
            }
            answerLines.push(line);
        }
    }

    // It is currently thinking if we've seen a <think> tag but haven't seen a </think> tag yet.
    // If it's using old blockquotes (>), we consider it thinking as long as it hasn't produced an answer.
    const isCurrentlyThinking = hasSeenThinkStart 
        ? !hasSeenThinkEnd 
        : (reasoningLines.length > 0 && answerLines.every(l => l.trim() === ''));

    return {
        reasoningLines,
        answerLines,
        hasAnswer: answerLines.some((l) => l.trim() !== ''),
        isCurrentlyThinking
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