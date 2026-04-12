"use client";

import { Html } from "@react-three/drei";
import { ROOMS, type RoomDef } from "./rooms";

interface Props {
  onSelect: (room: RoomDef) => void;
}

export default function RoomLabels({ onSelect }: Props) {
  return (
    <>
      {ROOMS.map((room) => (
        <Html
          key={room.id}
          position={room.worldPos}
          center
          distanceFactor={22}
        >
          <div
            onClick={() => onSelect(room)}
            style={{
              cursor: "pointer",
              background: "rgba(12,10,8,0.88)",
              border: "1px solid rgba(200,169,110,0.35)",
              padding: "0.75rem 1.2rem",
              minWidth: "120px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              userSelect: "none",
              whiteSpace: "nowrap",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(200,169,110,0.9)";
              el.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(200,169,110,0.35)";
              el.style.transform = "translateY(0)";
            }}
          >
            <p style={{
              fontFamily: "var(--font-chakra), 'Courier New', monospace",
              fontSize: "0.42rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(200,169,110,0.75)",
              margin: "0 0 0.2rem",
            }}>
              Apt {room.apt} · {room.floor}
            </p>
            <p style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "1.4rem",
              fontWeight: 300,
              color: "#f0ead8",
              lineHeight: 1,
              margin: "0 0 0.15rem",
            }}>
              {room.area}
            </p>
            <p style={{
              fontFamily: "var(--font-chakra), 'Courier New', monospace",
              fontSize: "0.38rem",
              letterSpacing: "0.08em",
              color: "rgba(240,234,216,0.35)",
              margin: 0,
            }}>
              {room.desc}
            </p>
            <p style={{
              fontFamily: "var(--font-chakra), 'Courier New', monospace",
              fontSize: "0.4rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(200,169,110,0.6)",
              margin: "0.45rem 0 0",
            }}>
              Enter →
            </p>
          </div>
        </Html>
      ))}
    </>
  );
}
