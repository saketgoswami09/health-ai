import React from 'react';
import { Mic } from 'lucide-react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const StartCallButton: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all ${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
      }`}
    >
      <Mic size={20} />
      <span>Start Health Assessment</span>
    </button>
  );
};
