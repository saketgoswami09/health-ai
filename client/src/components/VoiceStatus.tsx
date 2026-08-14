import React from 'react';
import type { VoiceCallState } from '../types';

interface Props {
  state: VoiceCallState;
  isAiSpeaking: boolean;
  isAiThinking?: boolean;
}

export const VoiceStatus: React.FC<Props> = ({ state, isAiSpeaking, isAiThinking }) => {
  let orbState = 'idle';
  let statusText = 'Ready to start';

  if (state === 'connecting') {
    orbState = 'connecting';
    statusText = 'Connecting to AI...';
  } else if (state === 'active') {
    if (isAiSpeaking) {
      orbState = 'speaking';
      statusText = 'AI is speaking...';
    } else if (isAiThinking) {
      orbState = 'thinking';
      statusText = 'AI is thinking...';
    } else {
      orbState = 'listening';
      statusText = 'Listening...';
    }
  } else if (state === 'completed') {
    orbState = 'idle';
    statusText = 'Assessment complete';
  } else if (state === 'error') {
    orbState = 'idle';
    statusText = 'Connection error';
  }

  return (
    <div className="flex flex-col items-center gap-6 my-8">
      <div className="orb-container">
        <div className="orb" data-state={orbState}></div>
      </div>
      <div className="text-lg font-medium text-gray-700">
        {statusText}
      </div>
    </div>
  );
};
