import React from "react";
import { VoiceStatus } from "../components/VoiceStatus";
import { CallTimer } from "../components/CallTimer";
import { EndCallButton } from "../components/EndCallButton";
import { ConversationPanel } from "../components/ConversationPanel";
import type {
  ConversationMessage,
  VoiceCallState,
} from "../types";

interface Props {
  state: VoiceCallState;
  isAiSpeaking: boolean;
  isAiThinking?: boolean;
  messages: ConversationMessage[];
  onEndCall: () => void;
}

export const VoiceCall: React.FC<Props> = ({
  state,
  isAiSpeaking,
  isAiThinking,
  messages,
  onEndCall,
}) => {
  const isCallActive =
    state === "active" || state === "connecting";

  const isCompleted = state === "completed";

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#f8fafc]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-8">
        
        {/* Top status bar */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isCallActive
                  ? "bg-red-500 animate-pulse"
                  : isCompleted
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />

            <span className="text-sm font-medium text-gray-700">
              {isCompleted
                ? "Assessment complete"
                : isCallActive
                ? "Live conversation"
                : "Ready"}
            </span>
          </div>

          <CallTimer isActive={isCallActive} />
        </div>

        {/* Main voice experience */}
        <div className="mt-10 flex w-full flex-col items-center">
          <VoiceStatus
            state={state}
            isAiSpeaking={isAiSpeaking}
            isAiThinking={isAiThinking}
          />

          {/* End call */}
          <div className="mt-7">
            <EndCallButton
              onClick={onEndCall}
              disabled={
                state === "idle" ||
                state === "completed"
              }
            />
          </div>
        </div>

        {/* Conversation */}
        <div className="mt-8 w-full">
          <ConversationPanel messages={messages} />
        </div>
      </div>
    </div>
  );
};