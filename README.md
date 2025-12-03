# Mirror Node.js SDK

The official Node.js SDK for the Mirror Chat API. Easily integrate your Mirror agents into any Node.js application.

## Features

- **Session Management**: Create and manage chat sessions with your agents.
- **Streaming Chat**: Real-time streaming responses using Async Iterators.
- **TypeScript Support**: Fully typed for a great development experience.

## Installation

```bash
npm install mirrorsdk
```

## Quick Start

```javascript
const { MirrorClient } = require('mirrorsdk');

// 1. Initialize the client
const client = new MirrorClient({
  apiKey: 'your_api_key_here',
  baseUrl: 'http://localhost:807'
});

async function main() {
  // 2. Create a session
  const session = await client.createSession('mirror_general');
  console.log(`Created session: ${session.id}`);

  // 3. Chat with your agent
  const prompt = "Hello! Tell me a fun fact.";
  console.log(`User: ${prompt}`);
  process.stdout.write("Assistant: ");

  // Responses are streamed
  for await (const chunk of client.chat(session.id, prompt)) {
    process.stdout.write(chunk);
  }
}

main();
```

## API Reference

### `MirrorClient`

#### `constructor(config: MirrorConfig)`

- `config.apiKey` (string): Your secret API key.
- `config.baseUrl` (string): The base URL of your Mirror API server (default: `http://localhost:807`).

#### `createSession(model?: string): Promise<Session>`

Creates a new chat session.

- `model` (string): The model ID to use (default: `mirror_general`).

#### `chat(sessionId: string, prompt: string, model?: string): AsyncGenerator<string>`

Sends a message and streams the response.

- `sessionId` (string): The ID of the active session.
- `prompt` (string): The user's message.
- `model` (string): The model ID to use.

## License

ISC