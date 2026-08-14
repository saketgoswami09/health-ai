import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  elevenLabsApiKey: required("ELEVENLABS_API_KEY"),
  elevenLabsAgentId: required("ELEVENLABS_AGENT_ID"),
  // Retained temporarily for the unused OpenAI service while the project is
  // migrated to ElevenLabs. It is no longer required to run the server.
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  realtimeModel: process.env.OPENAI_REALTIME_MODEL ?? "gpt-4o-realtime-preview-2024-12-17",
  reportModel: process.env.OPENAI_REPORT_MODEL ?? "gpt-4o",
};
