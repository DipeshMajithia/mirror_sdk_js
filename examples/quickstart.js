const { MirrorClient } = require('../dist');

// Configuration
const API_KEY = "iufvqK9h90yW9YtrZW_Wr_wcfzQ7d_iYCdlvLTYC84M";
const BASE_URL = "http://localhost:807";

async function main() {
  console.log("Initializing Mirror Client...");
  const client = new MirrorClient({
    apiKey: API_KEY,
    baseUrl: BASE_URL
  });

  try {
    // 1. Create Session
    console.log("Creating session...");
    const session = await client.createSession();
    console.log(`Session created: ${session.id}`);

    // 2. Chat
    const prompt = "Hello from Node.js! Tell me a one-liner joke.";
    console.log(`\nUser: ${prompt}`);
    process.stdout.write("Assistant: ");

    for await (const chunk of client.chat(session.id, prompt)) {
      process.stdout.write(chunk);
    }
    
    console.log("\n\nDone!");

  } catch (error) {
    console.error("\nError:", error.message);
  }
}

main();
