// ── Message Type ────────────────────────────────────────────────────────

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  time: string;
  content: string;
  files?: string[];
  relatedId?: number;
}