import React from "react";
import type { VoiceCallState } from "../types";
import { VoiceOrb } from "./VoiceOrb";

interface Props {
  state: VoiceCallState;
  isAiSpeaking: boolean;
  isAiThinking?: boolean;
}

export const VoiceStatus: React.FC<Props> = ({
  state,
  isAiSpeaking,
  isAiThinking,
}) => {
  let orbState:
    | "idle"
    | "connecting"
    | "listening"
    | "thinking"
    | "speaking"
    | "error" = "idle";

  if (state === "connecting") {
    orbState = "connecting";
  } else if (state === "active") {
    if (isAiSpeaking) {
      orbState = "speaking";
    } else if (isAiThinking) {
      orbState = "thinking";
    } else {
      orbState = "listening";
    }
  } else if (state === "error") {
    orbState = "error";
  }

  return (
    <div className="flex flex-col items-center">
      <VoiceOrb state={orbState} />

      {/* Only show status AFTER call starts */}
      {state !== "idle" && (
        <div className="mt-5 text-sm font-medium text-slate-500">
          {state === "connecting"
            ? "Connecting to Radha..."
            : isAiSpeaking
            ? "Radha is speaking..."
            : isAiThinking
            ? "Radha is thinking..."
            : state === "error"
            ? "Something went wrong"
            : "Listening..."}
        </div>
      )}
    </div>
  );
};