// ── Message Type ────────────────────────────────────────────────────────

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  files?: string[];
  relatedId?: number;
}