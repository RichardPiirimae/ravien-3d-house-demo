"use client";

interface Props {
  label: string;
  floor: string;
  progress: number;
}

const HUD_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-chakra), monospace",
  fontSize: "0.6rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(200,169,110,0.5)",
};

export default function HUD({ label, floor, progress }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top-left: studio name */}
      <div className="absolute top-8 left-8" style={HUD_STYLE}>
        Design Studio
        <br />
        3D Experience
      </div>

      {/* Top-right: current view label */}
      <div className="absolute top-8 right-8 text-right" style={HUD_STYLE}>
        View: {label}
      </div>

      {/* Bottom-left: scroll progress bar */}
      <div className="absolute bottom-8 left-8">
        <div
          style={{
            width: "120px",
            height: "1px",
            background: "rgba(200,169,110,0.15)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress * 100}%`,
              background: "var(--accent)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      {/* Bottom-right: current floor */}
      <div className="absolute bottom-8 right-8 text-right" style={HUD_STYLE}>
        Floor: {floor}
      </div>
    </div>
  );
}
