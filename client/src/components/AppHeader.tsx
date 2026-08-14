import React from "react";
import { Orb } from "orb-ui";

interface Props {
  onHome: () => void;
}

export const AppHeader: React.FC<Props> = ({ onHome }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16  items-center justify-between px-5 sm:px-6">

        {/* Brand */}
        <button
          onClick={onHome}
          className="group flex items-center gap-2.5"
          aria-label="Go to home"
        >
          {/* Mini Radha Orb */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              transition-transform
              duration-200
              group-hover:scale-105
              
            "
            
          >
            <Orb
              theme="cloud"
              state="idle"
              size={32}
              interactive={false}
              aria-hidden="true"
            />
          </div>

          {/* Brand name */}
          <span
            className="
              text-[17px]
              font-semibold
              tracking-tight
              text-slate-900
            "
          >
            Health AI
          </span>
        </button>

      </div>
    </header>
  );
};