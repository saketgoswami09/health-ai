import { Router } from "express";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const router = Router();

/** Issues a short-lived token; the ElevenLabs API key never reaches the browser. */
router.get("/conversation-token", async (_req, res) => {
  try {
    const url = new URL("https://api.elevenlabs.io/v1/convai/conversation/token");
    url.searchParams.set("agent_id", env.elevenLabsAgentId);

    const response = await fetch(url, {
      headers: { "xi-api-key": env.elevenLabsApiKey },
    });

    if (!response.ok) {
      const detail = await response.text();
      logger.error("ElevenLabs token request failed", { status: response.status, detail });
      res.status(502).json({ message: "Unable to start a voice conversation." });
      return;
    }

    const body = (await response.json()) as { token?: string };
    if (!body.token) throw new Error("ElevenLabs returned no conversation token");
    res.json({ conversationToken: body.token });
  } catch (error) {
    logger.error("Unable to create ElevenLabs conversation token", {
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(502).json({ message: "Unable to start a voice conversation." });
  }
});

export default router;
