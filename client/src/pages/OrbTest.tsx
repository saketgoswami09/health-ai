import { Orb } from "orb-ui";

export default function OrbTest() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <h1>Orb Test</h1>

      <Orb
        theme="cloud"
        state="speaking"
        volume={0.8}
        size={300}
        interactive={false}
        aria-label="Orb test"
      />

      <p>If you can see the orb, orb-ui works.</p>
    </div>
  );
}