import { WebSocketServer, WebSocket } from "ws";
import type { Server as HttpServer } from "http";
import { RealtimeService } from "../services/realtimeService";
import { logger } from "../utils/logger";
import type { ServerToClientEvent, TranscriptTurn } from "../types/realtime.types";

/**
 * Mounts a WebSocket server at /realtime on the existing HTTP server and
 * bridges each connected browser client to its own OpenAI RealtimeService.
 *
 * Wire format with the browser client:
 *  - Binary frames = raw PCM16 audio, both directions.
 *  - Text frames    = JSON control/transcript events (ServerToClientEvent).
 *
 * On call end, the accumulated transcript is handed to onCallEnd so it can
 * be fed into reportService for the post-call health report.
 */
export function mountRealtimeGateway(
  httpServer: HttpServer,
  onCallEnd?: (transcript: TranscriptTurn[]) => void
): void {
  const wss = new WebSocketServer({ server: httpServer, path: "/realtime" });

  wss.on("connection", (clientSocket: WebSocket) => {
    logger.info("Client connected to /realtime");
    handleClientConnection(clientSocket, onCallEnd);
  });

  logger.info("Realtime WebSocket gateway mounted at /realtime");
}

async function handleClientConnection(
  clientSocket: WebSocket,
  onCallEnd?: (transcript: TranscriptTurn[]) => void
): Promise<void> {
  const realtime = new RealtimeService();

  const send = (event: ServerToClientEvent) => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify(event));
    }
  };

  // -- Wire RealtimeService -> client -----------------------------------------

  realtime.on("ready", () => send({ type: "session.ready" }));

  realtime.on("speech.started", () => send({ type: "ai.speech.started" }));
  realtime.on("speech.stopped", () => send({ type: "ai.speech.stopped" }));

  realtime.on("audio.delta", (chunk) => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(chunk, { binary: true });
    }
  });

  realtime.on("transcript.delta", (turn) => {
    send({ type: "transcript.delta", role: turn.role, text: turn.text });
  });

  realtime.on("transcript.done", (turn) => {
    send({ type: "transcript.done", role: turn.role, text: turn.text });
  });

  realtime.on("error", (err) => {
    send({ type: "error", message: err.message });
  });

  realtime.on("closed", () => {
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.close();
    }
  });

  // -- Wire client -> RealtimeService -------------------------------------------

  clientSocket.on("message", (data, isBinary) => {
    if (isBinary) {
      // Raw PCM16 audio chunk captured from the mic — forward as-is.
      realtime.sendAudio(Buffer.isBuffer(data) ? data : Buffer.from(data as ArrayBuffer));
      return;
    }

    // Text frame from client — currently only "call.end" is expected.
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed?.type === "call.end") {
        clientSocket.close();
      }
    } catch {
      logger.warn("Received unparseable text frame from client");
    }
  });

  clientSocket.on("close", () => {
    logger.info("Client disconnected from /realtime");
    const transcript = realtime.getTranscript();
    realtime.close();
    onCallEnd?.(transcript);
  });

  clientSocket.on("error", (err) => {
    logger.error("Client socket error", { err: err.message });
  });

  // -- Establish the upstream connection ----------------------------------------

  try {
    await realtime.connect();
  } catch (err) {
    logger.error("Failed to establish OpenAI Realtime connection", {
      err: err instanceof Error ? err.message : String(err),
    });
    send({ type: "error", message: "Failed to start AI session. Please try again." });
    clientSocket.close();
  }
}
