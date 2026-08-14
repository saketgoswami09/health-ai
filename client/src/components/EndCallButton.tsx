import React from 'react';
import { PhoneOff } from 'lucide-react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const EndCallButton: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-all ${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
      }`}
    >
      <PhoneOff size={20} />
      <span>End Call</span>
    </button>
  );
};
