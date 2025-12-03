import axios, { AxiosInstance } from 'axios';
import { MirrorConfig, Session, ChatResponse } from './types';

export class MirrorClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(config: MirrorConfig) {
    this.baseUrl = (config.baseUrl || 'http://localhost:807').replace(/\/$/, '');
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * Create a new chat session.
   * @param model The model ID to use (default: "mirror_general").
   */
  async createSession(model: string = 'mirror_general'): Promise<Session> {
    try {
      const params = new URLSearchParams();
      params.append('model', model);

      const response = await this.client.post('/api-chat/create_session', params);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  /**
   * Send a message to the chat session and stream the response.
   * @param sessionId The ID of the active session.
   * @param prompt The user's message.
   * @param model The model ID to use.
   */
  async *chat(sessionId: string, prompt: string, model: string = 'mirror_general'): AsyncGenerator<string> {
    try {
      const params = new URLSearchParams();
      params.append('session_id', sessionId);
      params.append('prompt', prompt);
      params.append('model', model);

      const response = await this.client.post('/api-chat/stream', params, {
        responseType: 'stream',
      });

      const stream = response.data;

      for await (const chunk of stream) {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const json: ChatResponse = JSON.parse(line);
            if (json.type === 'assistant') {
              yield json.content;
            } else if (json.type === 'error') {
              throw new Error(`API Error: ${json.content}`);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    } catch (error: any) {
      throw new Error(`Chat request failed: ${error.message}`);
    }
  }
}
