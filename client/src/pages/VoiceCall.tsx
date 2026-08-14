import React from 'react';
import { VoiceStatus } from '../components/VoiceStatus';
import { CallTimer } from '../components/CallTimer';
import { EndCallButton } from '../components/EndCallButton';
import { ConversationPanel } from '../components/ConversationPanel';
import type { ConversationMessage, VoiceCallState } from '../types';

interface Props {
  state: VoiceCallState;
  isAiSpeaking: boolean;
  isAiThinking?: boolean;
  messages: ConversationMessage[];
  onEndCall: () => void;
}

export const VoiceCall: React.FC<Props> = ({ state, isAiSpeaking, isAiThinking, messages, onEndCall }) => {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full px-4 py-8">
      
      <div className="flex justify-between w-full items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-gray-700">Live Assessment</span>
        </div>
        <CallTimer isActive={state === 'active' || state === 'connecting'} />
      </div>

      <VoiceStatus state={state} isAiSpeaking={isAiSpeaking} isAiThinking={isAiThinking} />

      <div className="mt-8 mb-12">
        <EndCallButton onClick={onEndCall} disabled={state === 'idle' || state === 'completed'} />
      </div>

      <div className="w-full">
        <ConversationPanel messages={messages} />
      </div>

    </div>
  );
};
