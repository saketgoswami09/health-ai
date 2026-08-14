import React from "react";
import { Orb } from "orb-ui";

export type OrbState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

interface VoiceOrbProps {
  state: OrbState;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ state }) => {
  return (
    <div
      style={{
        width: "280px",
        height: "280px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Orb
        theme="cloud"
        state={state}
        volume={state === "speaking" ? 0.8 : 0}
        size={280}
        interactive={false}
        aria-label="Radha voice assistant"
      />
    </div>
  );
};

export default VoiceOrb;
