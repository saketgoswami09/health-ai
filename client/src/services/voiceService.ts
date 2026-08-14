import { Conversation, type VoiceConversation } from "@elevenlabs/client";
import type { ConversationMessage, VoiceCallState } from "../types";

export interface VoiceServiceCallbacks {
  onStateChange: (state: VoiceCallState) => void;
  onSpeechStarted: () => void;
  onSpeechStopped: () => void;
  onTranscriptDelta: (role: ConversationMessage["role"], text: string) => void;
  onTranscriptDone: (role: ConversationMessage["role"], text: string) => void;
  onError: (error: string) => void;
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/** Browser-side ElevenLabs Agent client. Audio capture and playback are SDK-managed. */
export class VoiceService {
  private conversation: VoiceConversation | null = null;
  private readonly callbacks: VoiceServiceCallbacks;

  constructor(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;
  }

  async startCall(): Promise<void> {
    this.callbacks.onStateChange("connecting");

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch(
        `${apiBaseUrl}/elevenlabs/conversation-token`,
      );
      if (!response.ok)
        throw new Error("Could not create an ElevenLabs conversation.");

      const { conversationToken } = (await response.json()) as {
        conversationToken?: string;
      };
      if (!conversationToken)
        throw new Error("The server returned no conversation token.");

      const conversation = await Conversation.startSession({
        conversationToken,
        onConnect: () => {
  console.log("🟢 ELEVENLABS CONNECTED");
  this.callbacks.onStateChange("active");
},
        onDisconnect: () => {
          console.log("🔥 ELEVENLABS DISCONNECTED");
          this.conversation = null;
          this.callbacks.onStateChange("completed");
        },
        onModeChange: ({ mode }) => {
          if (mode === "speaking") this.callbacks.onSpeechStarted();
          else this.callbacks.onSpeechStopped();
        },
        onMessage: ({ role, message }) => {
          const mappedRole: ConversationMessage["role"] =
            role === "agent" ? "assistant" : "user";
          this.callbacks.onTranscriptDone(mappedRole, message);
        },
        onError: (message) => {
          this.callbacks.onError(message);
          this.callbacks.onStateChange("error");
        },
      });

      this.conversation = conversation as VoiceConversation;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start the voice call.";
      this.callbacks.onError(message);
      this.callbacks.onStateChange("error");
    }
  }

  async endCall(): Promise<void> {
    const conversation = this.conversation;
    this.conversation = null;
    if (conversation) await conversation.endSession();
    this.callbacks.onStateChange("completed");
  }
}
