/**
 * Types for the client <-> backend <-> OpenAI Realtime API pipeline.
 */

/** Messages the browser client sends to our backend over its own WebSocket. */
export type ClientToServerEvent =
  | { type: "audio"; data: ArrayBuffer } // handled as raw binary frames, not JSON — see gateway
  | { type: "call.end" };

/** Messages our backend sends back to the browser client. */
export type ServerToClientEvent =
  | { type: "session.ready" }
  | { type: "ai.speech.started" }
  | { type: "ai.speech.stopped" }
  | { type: "transcript.delta"; role: "user" | "assistant"; text: string }
  | { type: "transcript.done"; role: "user" | "assistant"; text: string }
  | { type: "error"; message: string };

/**
 * Minimal shape of the OpenAI Realtime API server events we actually consume.
 * (The full event set is much larger — extend as needed.)
 * https://platform.openai.com/docs/guides/realtime
 */
export type OpenAIRealtimeServerEvent =
  | { type: "session.created"; session: Record<string, unknown> }
  | { type: "session.updated"; session: Record<string, unknown> }
  | { type: "input_audio_buffer.speech_started" }
  | { type: "input_audio_buffer.speech_stopped" }
  | { type: "conversation.item.input_audio_transcription.completed"; transcript: string }
  | { type: "response.audio.delta"; delta: string } // base64 PCM16
  | { type: "response.audio.done" }
  | { type: "response.audio_transcript.delta"; delta: string }
  | { type: "response.audio_transcript.done"; transcript: string }
  | { type: "response.done" }
  | { type: "error"; error: { message: string; code?: string } };

export type OpenAIRealtimeClientEvent =
  | { type: "session.update"; session: Record<string, unknown> }
  | { type: "input_audio_buffer.append"; audio: string } // base64 PCM16
  | { type: "input_audio_buffer.commit" }
  | { type: "response.create" };

/** A single turn accumulated for the post-call health report. */
export interface TranscriptTurn {
  role: "user" | "assistant";
  text: string;
}
