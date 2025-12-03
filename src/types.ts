export interface MirrorConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface Session {
  id: string;
  model: string;
  title: string;
  created_at: string;
  [key: string]: any;
}

export interface ChatResponse {
  type: 'assistant' | 'error';
  content: string;
}
