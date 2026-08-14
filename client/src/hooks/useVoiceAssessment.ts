import { useRef, useState } from "react";

import { VoiceService } from "../services/voiceService";
import { generateHealthReport } from "../services/api";

import type {
  VoiceCallState,
  ConversationMessage,
  HealthReport,
} from "../types";

interface UseVoiceAssessmentOptions {
  onGeneratingReport?: () => void;
  onReportReady?: () => void;
  onReset?: () => void;
}

export function useVoiceAssessment({
  onGeneratingReport,
  onReportReady,
  onReset,
}: UseVoiceAssessmentOptions = {}) {
  /* --------------------------------
     State
  -------------------------------- */

  const [callState, setCallState] =
    useState<VoiceCallState>("idle");

  const [isAiSpeaking, setIsAiSpeaking] =
    useState(false);

  const [isAiThinking, setIsAiThinking] =
    useState(false);

  const [messages, setMessages] =
    useState<ConversationMessage[]>([]);

  const [report, setReport] =
    useState<HealthReport | null>(null);

  /* --------------------------------
     Refs
  -------------------------------- */

  const voiceServiceRef =
    useRef<VoiceService | null>(null);

  const sessionIdRef =
    useRef<string | null>(null);

  // Keeps the latest transcript available
  // to async functions such as endCall().
  const messagesRef =
    useRef<ConversationMessage[]>([]);

  /* --------------------------------
     Transcript helper
  -------------------------------- */

  const updateMessages = (
    updater: (
      previous: ConversationMessage[]
    ) => ConversationMessage[]
  ) => {
    setMessages((previous) => {
      const next = updater(previous);

      messagesRef.current = next;

      return next;
    });
  };

  const handleTranscript = (
    role: ConversationMessage["role"],
    text: string
  ) => {
    updateMessages((previous) => {
      const next = [...previous];

      const lastMessage =
        next[next.length - 1];

      /*
       * ElevenLabs can send multiple transcript
       * updates for the same speaker.
       *
       * Update the existing message instead of
       * creating a new bubble every time.
       */
      if (
        lastMessage &&
        lastMessage.role === role
      ) {
        next[next.length - 1] = {
          ...lastMessage,
          content: text,
        };
      } else {
        next.push({
          id: `${Date.now()}-${Math.random()}`,
          role,
          content: text,
          timestamp: new Date(),
        });
      }

      return next;
    });
  };

  /* --------------------------------
     Start assessment
  -------------------------------- */

  const startCall = () => {
    // Clear previous assessment
    setMessages([]);
    messagesRef.current = [];

    setReport(null);

    setIsAiSpeaking(false);
    setIsAiThinking(false);

    // Create a fresh session
    sessionIdRef.current =
      crypto.randomUUID();

    setCallState("connecting");

    const service = new VoiceService({
      onStateChange: (state) => {
        setCallState(state);
      },

      onSpeechStarted: () => {
        setIsAiSpeaking(true);
        setIsAiThinking(false);
      },

      onSpeechStopped: () => {
        setIsAiSpeaking(false);
      },

      onTranscriptDelta: (
        role,
        text
      ) => {
        handleTranscript(role, text);
      },

      onTranscriptDone: (
        role,
        text
      ) => {
        handleTranscript(role, text);
      },

      onError: (error) => {
        console.error(
          "Voice Error:",
          error
        );

        setCallState("error");
      },
    });

    voiceServiceRef.current = service;

    service.startCall();
  };

  /* --------------------------------
     End assessment
  -------------------------------- */

  const endCall = async () => {
    try {
      /*
       * Stop ElevenLabs session first.
       */
      if (voiceServiceRef.current) {
        await voiceServiceRef.current.endCall();

        voiceServiceRef.current = null;
      }

      setIsAiSpeaking(false);
      setIsAiThinking(false);

      setCallState("completed");

      /*
       * Tell App.tsx that we're generating
       * the report.
       */
      onGeneratingReport?.();

      /*
       * Use the ref because it contains the
       * latest transcript.
       */
      const generatedReport =
        await generateHealthReport({
          sessionId:
            sessionIdRef.current ??
            crypto.randomUUID(),

          conversationData:
            messagesRef.current,
        });

      setReport(generatedReport);

      /*
       * Tell App.tsx to show the report.
       */
      onReportReady?.();

    } catch (error) {
      console.error(
        "Failed to end assessment:",
        error
      );

      /*
       * If report generation fails, return
       * the user to the home screen.
       */
      setCallState("idle");

      onReset?.();
    }
  };

  /* --------------------------------
     Reset assessment
  -------------------------------- */

  const resetAssessment = async () => {
    /*
     * If the user clicks the logo while a call
     * is still active, make sure the ElevenLabs
     * session is properly closed.
     */
    if (voiceServiceRef.current) {
      try {
        await voiceServiceRef.current.endCall();
      } catch (error) {
        console.error(
          "Failed to close voice session:",
          error
        );
      }

      voiceServiceRef.current = null;
    }

    // Clear session
    sessionIdRef.current = null;

    // Clear transcript
    messagesRef.current = [];

    // Reset state
    setCallState("idle");
    setIsAiSpeaking(false);
    setIsAiThinking(false);
    setMessages([]);
    setReport(null);

    // Tell App.tsx to return home
    onReset?.();
  };

  /* --------------------------------
     Public API
  -------------------------------- */

  return {
    callState,
    isAiSpeaking,
    isAiThinking,
    messages,
    report,

    startCall,
    endCall,
    resetAssessment,
  };
}