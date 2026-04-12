"use client";

interface Props {
  loaded: boolean;
}

export default function LoadingScreen({ loaded }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-[opacity,visibility] duration-700"
      style={{
        background: "var(--dark)",
        opacity: loaded ? 0 : 1,
        visibility: loaded ? "hidden" : "visible",
        pointerEvents: loaded ? "none" : "auto",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.5rem",
          fontWeight: 300,
          letterSpacing: "0.2em",
          color: "var(--accent)",
          marginBottom: "2rem",
        }}
      >
        Loading model
      </p>

      <div
        className="relative overflow-hidden"
        style={{ width: "180px", height: "1px", background: "rgba(200,169,110,0.15)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "var(--accent)",
            animation: "load-sweep 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
