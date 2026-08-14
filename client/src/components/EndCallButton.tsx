import React from "react";
import { PhoneOff } from "lucide-react";

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export const EndCallButton: React.FC<Props> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="End conversation"
      className={`
        group
        inline-flex items-center justify-center
        gap-2.5
        rounded-full
        px-5 py-2.5

        text-sm font-medium

        border
        transition-all duration-200

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-red-400
        focus-visible:ring-offset-2

        ${
          disabled
            ? `
              cursor-not-allowed
              border-gray-200
              bg-gray-100
              text-gray-400
            `
            : `
              border-gray-200
              bg-white
              text-gray-600

              shadow-sm

              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              hover:shadow-md

              active:scale-[0.97]
            `
        }
      `}
    >
      <span
        className={`
          flex h-7 w-7
          items-center justify-center
          rounded-full
          transition-colors duration-200

          ${
            disabled
              ? "bg-gray-200"
              : `
                bg-gray-100
                group-hover:bg-red-100
              `
          }
        `}
      >
        <PhoneOff size={15} strokeWidth={2} />
      </span>

      <span>End conversation</span>
    </button>
  );
};