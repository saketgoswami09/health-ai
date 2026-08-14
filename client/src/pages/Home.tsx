import React from "react";
import { Mic } from "lucide-react";

import { VoiceOrb } from "../components/VoiceOrb";
import { EndCallButton } from "../components/EndCallButton";
import { ConversationPanel } from "../components/ConversationPanel";

import type { ConversationMessage, VoiceCallState } from "../types";

interface Props {
  state: VoiceCallState;
  isAiSpeaking: boolean;
  isAiThinking?: boolean;
  messages: ConversationMessage[];
  onStartCall: () => void;
  onEndCall: () => void;
}

export const Home: React.FC<Props> = ({
  state,
  isAiSpeaking,
  isAiThinking,
  messages,
  onStartCall,
  onEndCall,
}) => {
  const started = state !== "idle";

  const isCallActive = state === "connecting" || state === "active";

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f8fafc]">
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-200/20
          blur-[100px]
        "
      />

      {/* Main stage */}
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-64px)]
          max-w-5xl
          flex-col
          items-center
        "
      >
        {/* =========================
            INTRO
        ========================== */}

        <div
          className={`
            absolute
            top-[9%]
            z-10
            text-center
            transition-all
            duration-700
            ease-out

            ${
              started
                ? "-translate-y-12 opacity-0"
                : "translate-y-0 opacity-100"
            }
          `}
        >
          <h1
            className="
            text-4xl
            font-semibold
            tracking-tight
            text-slate-900
            sm:text-5xl
          "
          >
            Hi, I'm Radha.
          </h1>

          <p
            className="
            mt-4
            text-base
            leading-7
            text-slate-500
            sm:text-lg
          "
          >
            Your AI health companion.
            <br />
            Talk naturally about how you're feeling and I'll listen.
          </p>
        </div>

        {/* =========================
            ORB
        ========================== */}

        <div
          className={`
            absolute
            left-1/2
            top-[48%]
            z-20
            -translate-x-1/2
            -translate-y-1/2

            transition-all
            duration-700
            ease-out

            ${started ? "scale-110" : "scale-100"}
          `}
        >
          <VoiceOrb
            state={
              !started
                ? "speaking"
                : isAiSpeaking
                  ? "speaking"
                  : isAiThinking
                    ? "thinking"
                    : state === "connecting"
                      ? "connecting"
                      : "listening"
            }
          />
        </div>

        {/* =========================
            START BUTTON
        ========================== */}

        <div
          className={`
            absolute
            left-1/2
            top-[73%]
            z-30
            -translate-x-1/2

            flex
            flex-col
            items-center

            transition-all
            duration-700

            ${
              started
                ? "pointer-events-none translate-y-8 opacity-0"
                : "translate-y-0 opacity-100"
            }
          `}
        >
          <button
            onClick={onStartCall}
            className="
              group
              flex
              items-center
              gap-3
              rounded-full
              bg-blue-600
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition-all
              duration-200

              hover:-translate-y-0.5
              hover:bg-blue-700
              hover:shadow-xl

              active:scale-95
            "
          >
            <Mic
              size={18}
              className="transition-transform group-hover:scale-110"
            />
            Talk to Radha
          </button>

          <p
            className="
            mt-4
            text-xs
            text-slate-400
          "
          >
            Voice conversation · Takes only a few minutes
          </p>
        </div>

        {/* =========================
            ACTIVE CALL CONTROLS
        ========================== */}

        <div
          className={`
    absolute
    left-1/2
    top-[63%]
    z-30
    -translate-x-1/2

    flex
    flex-col
    items-center
    gap-4

    transition-all
    duration-700

    ${
      started
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-8 opacity-0"
    }
  `}
        >
          <p className="text-sm font-medium text-slate-500">
            {state === "connecting"
              ? "Connecting to Radha..."
              : isAiSpeaking
                ? "Radha is speaking..."
                : isAiThinking
                  ? "Radha is thinking..."
                  : "I'm listening..."}
          </p>

          <EndCallButton onClick={onEndCall} disabled={!isCallActive} />
        </div>
        {/* =========================
            CONVERSATION
        ========================== */}

        <div
          className={`
    absolute
    left-1/2
    top-[74%]
    z-20
    w-full
    max-w-xl
    -translate-x-1/2
    px-6
    transition-all
    duration-700

    ${
      started && messages.length > 0
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-6 opacity-0"
    }
  `}
        >
          <ConversationPanel messages={messages} />
        </div>
      </div>
    </main>
  );
};

export default Home;
