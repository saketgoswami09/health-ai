import WebSocket from "ws";
import { EventEmitter } from "events";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import type {
  OpenAIRealtimeClientEvent,
  OpenAIRealtimeServerEvent,
  TranscriptTurn,
} from "../types/realtime.types";

const OPENAI_REALTIME_URL = "wss://api.openai.com/v1/realtime";

// Health-screening system prompt. Keep this out of the frontend entirely —
// it's the one thing that must never be client-editable.
const SYSTEM_INSTRUCTIONS = `
You are a calm, empathetic AI health-screening assistant conducting a brief
voice intake conversation. Ask focused, one-at-a-time questions about the
user's current symptoms, duration, severity, and relevant history. Do not
diagnose or prescribe treatment. Keep responses short and conversational,
as this is a live voice call. If the user describes a medical emergency,
tell them clearly to contact emergency services immediately.
`.trim();

export interface RealtimeServiceEvents {
  ready: () => void;
  "audio.delta": (chunk: Buffer) => void;
  "speech.started": () => void;
  "speech.stopped": () => void;
  "transcript.delta": (turn: TranscriptTurn) => void;
  "transcript.done": (turn: TranscriptTurn) => void;
  error: (err: Error) => void;
  closed: () => void;
}

/**
 * RealtimeService owns a single upstream connection to OpenAI's Realtime API
 * for the lifetime of one call. One instance is created per client WebSocket
 * connection (see websocket/realtimeGateway.ts) and torn down when the call ends.
 */
export class RealtimeService extends EventEmitter {
  private upstream: WebSocket | null = null;
  private ready = false;
  private readonly transcript: TranscriptTurn[] = [];

  // Accumulate streaming transcript deltas until a "done" event arrives.
  private currentAssistantText = "";
  private currentUserText = "";

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${OPENAI_REALTIME_URL}?model=${encodeURIComponent(env.realtimeModel)}`;

      this.upstream = new WebSocket(url, {
        headers: {
          Authorization: `Bearer ${env.openaiApiKey}`,
          "OpenAI-Beta": "realtime=v1",
        },
      });

      this.upstream.once("open", () => {
        logger.info("Connected to OpenAI Realtime API");
        this.configureSession();
        resolve();
      });

      this.upstream.once("error", (err) => {
        logger.error("OpenAI Realtime connection error", { err: err.message });
        reject(err);
      });

      this.upstream.on("message", (data, isBinary) => {
        // OpenAI Realtime always sends JSON text frames (audio is base64-encoded
        // inside them), so isBinary should be false — guard anyway.
        if (isBinary) return;
        this.handleUpstreamMessage(data.toString());
      });

      this.upstream.on("close", (code, reason) => {
        logger.info("OpenAI Realtime connection closed", { code, reason: reason.toString() });
        this.ready = false;
        this.emit("closed");
      });
    });
  }

  /** Configure the session: voice, turn detection, transcription, system prompt. */
  private configureSession(): void {
    this.sendUpstream({
      type: "session.update",
      session: {
        modalities: ["audio", "text"],
        instructions: SYSTEM_INSTRUCTIONS,
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        // Server-side VAD lets OpenAI detect turn-taking itself, so we don't
        // need to implement silence detection on our end.
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      },
    });
  }

  private handleUpstreamMessage(raw: string): void {
    let event: OpenAIRealtimeServerEvent;
    try {
      event = JSON.parse(raw);
    } catch {
      logger.warn("Received non-JSON frame from OpenAI Realtime API");
      return;
    }

    switch (event.type) {
      case "session.created":
      case "session.updated":
        if (!this.ready) {
          this.ready = true;
          this.emit("ready");
        }
        break;

      case "input_audio_buffer.speech_started":
        this.emit("speech.started");
        break;

      case "input_audio_buffer.speech_stopped":
        this.emit("speech.stopped");
        break;

      case "conversation.item.input_audio_transcription.completed": {
        const turn: TranscriptTurn = { role: "user", text: event.transcript };
        this.transcript.push(turn);
        this.emit("transcript.done", turn);
        break;
      }

      case "response.audio.delta": {
        const chunk = Buffer.from(event.delta, "base64");
        this.emit("audio.delta", chunk);
        break;
      }

      case "response.audio_transcript.delta":
        this.currentAssistantText += event.delta;
        this.emit("transcript.delta", { role: "assistant", text: this.currentAssistantText });
        break;

      case "response.audio_transcript.done": {
        const turn: TranscriptTurn = { role: "assistant", text: event.transcript };
        this.transcript.push(turn);
        this.currentAssistantText = "";
        this.emit("transcript.done", turn);
        break;
      }

      case "response.done":
      case "response.audio.done":
        // No-op for now; hook here if you need per-response bookkeeping.
        break;

      case "error":
        logger.error("OpenAI Realtime API error event", { error: event.error });
        this.emit("error", new Error(event.error.message));
        break;

      default:
        // Unhandled event types are safe to ignore for this feature set.
        break;
    }
  }

  /** Forward a chunk of raw PCM16 audio captured from the browser mic. */
  sendAudio(chunk: Buffer): void {
    if (!this.ready) return; // drop audio until the session is configured
    this.sendUpstream({
      type: "input_audio_buffer.append",
      audio: chunk.toString("base64"),
    });
  }

  private sendUpstream(event: OpenAIRealtimeClientEvent): void {
    if (this.upstream && this.upstream.readyState === WebSocket.OPEN) {
      this.upstream.send(JSON.stringify(event));
    }
  }

  /** Full accumulated transcript for this call, for the post-call report step. */
  getTranscript(): TranscriptTurn[] {
    return [...this.transcript];
  }

  close(): void {
    if (this.upstream) {
      this.upstream.removeAllListeners();
      if (this.upstream.readyState === WebSocket.OPEN || this.upstream.readyState === WebSocket.CONNECTING) {
        this.upstream.close();
      }
      this.upstream = null;
    }
    this.ready = false;
  }
}

// Strongly-typed EventEmitter overrides (optional but keeps call sites honest).
export declare interface RealtimeService {
  on<E extends keyof RealtimeServiceEvents>(event: E, listener: RealtimeServiceEvents[E]): this;
  emit<E extends keyof RealtimeServiceEvents>(
    event: E,
    ...args: Parameters<RealtimeServiceEvents[E]>
  ): boolean;
}
