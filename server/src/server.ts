import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

app.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port}`);
  logger.info(`ElevenLabs token endpoint: http://localhost:${env.port}/api/elevenlabs/conversation-token`);
});
