import express from "express";
import cors from "cors";
import { env } from "./config/env";
import elevenLabsRouter from "./routes/elevenLabsRoutes";
import healthRouter from "./routes/healthRoutes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());
app.use("/api/elevenlabs", elevenLabsRouter);
app.use("/api", healthRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use(errorHandler);
