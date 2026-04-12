"use client";

interface Props {
  area: string;
  type: string;
  visible: boolean;
}

export default function InfoPanel({ area, type, visible }: Props) {
  return (
    <div
      className="absolute right-8 pointer-events-none select-none transition-opacity duration-500"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        width: "200px",
        opacity: visible ? 1 : 0,
        fontFamily: "var(--font-chakra), monospace",
      }}
    >
      {/* Decorative divider line */}
      <div
        style={{
          width: "30px",
          height: "1px",
          background: "var(--accent)",
          opacity: 0.6,
          marginBottom: "1rem",
        }}
      />

      <p
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "0.3rem",
        }}
      >
        Area
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.4rem",
          fontWeight: 300,
          color: "var(--cream)",
          lineHeight: 1.1,
          marginBottom: "1.25rem",
        }}
      >
        {area}
      </p>

      <p
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: "0.3rem",
        }}
      >
        Type
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.4rem",
          fontWeight: 300,
          color: "var(--cream)",
          lineHeight: 1.1,
        }}
      >
        {type}
      </p>
    </div>
  );
}
