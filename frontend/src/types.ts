// ── Message Type ────────────────────────────────────────────────────────

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  files?: string[];
  sources?: string[];
  relatedId?: number;
}