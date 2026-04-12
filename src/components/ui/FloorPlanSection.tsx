"use client";

import { useState } from "react";
import type { RoomDef } from "../3d/rooms";
import { GROUND_ROOMS, SECOND_ROOMS } from "../3d/rooms";

interface Props {
  onEnterRoom: (room: RoomDef) => void;
}

function PlanTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? "1px solid rgba(200,169,110,0.9)" : "1px solid rgba(200,169,110,0.12)",
        padding: "0.5rem 1.5rem",
        fontFamily: "var(--font-chakra), monospace",
        fontSize: "0.52rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: active ? "rgba(200,169,110,0.95)" : "rgba(200,169,110,0.3)",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {label}
    </button>
  );
}

function Hotspot({ room, onEnter }: { room: RoomDef; onEnter: (r: RoomDef) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onEnter(room)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: `${room.hotspot.x}%`,
        top: `${room.hotspot.y}%`,
        transform: hovered ? "translate(-50%, -50%) scale(1.08)" : "translate(-50%, -50%)",
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.3rem",
        transition: "transform 0.2s",
      }}
    >
      <div style={{ position: "relative", width: 32, height: 32 }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(200,169,110,0.5)",
          animation: hovered ? "none" : "ping 2.2s cubic-bezier(0,0,0.2,1) infinite",
          background: hovered ? "rgba(200,169,110,0.12)" : "transparent",
        }} />
        <div style={{
          position: "absolute", inset: 7,
          borderRadius: "50%",
          background: hovered ? "rgba(200,169,110,1)" : "rgba(200,169,110,0.55)",
          transition: "background 0.2s",
        }} />
      </div>
      <div style={{
        background: "rgba(10,8,6,0.92)",
        border: `1px solid ${hovered ? "rgba(200,169,110,0.7)" : "rgba(200,169,110,0.2)"}`,
        padding: "0.4rem 0.7rem",
        textAlign: "center",
        backdropFilter: "blur(10px)",
        whiteSpace: "nowrap",
        transition: "border-color 0.2s",
      }}>
        <p style={{
          fontFamily: "var(--font-chakra), monospace",
          fontSize: "0.36rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(200,169,110,0.65)",
          margin: "0 0 0.12rem",
        }}>
          Apt {room.apt}
        </p>
        <p style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "1rem",
          fontWeight: 300,
          color: "#f0ead8",
          lineHeight: 1,
          margin: "0 0 0.1rem",
        }}>
          {room.area}
        </p>
        <p style={{
          fontFamily: "var(--font-chakra), monospace",
          fontSize: "0.33rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(200,169,110,0.5)",
          margin: 0,
        }}>
          Explore →
        </p>
      </div>
    </div>
  );
}

export default function FloorPlanSection({ onEnterRoom }: Props) {
  const [activeFloor, setActiveFloor] = useState<"ground" | "second">("second");
  const rooms  = activeFloor === "ground" ? GROUND_ROOMS : SECOND_ROOMS;
  const imgSrc = activeFloor === "ground" ? "/floorplan-ground.jpg" : "/floorplan-2nd.jpg";

  return (
    <section id="floor-plans" style={{ background: "var(--dark)", padding: "7rem 0 6rem", borderTop: "1px solid rgba(200,169,110,0.07)" }}>

      <div style={{ padding: "0 6rem", marginBottom: "3rem" }}>
        <p style={{
          fontFamily: "var(--font-chakra), monospace",
          fontSize: "0.48rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(200,169,110,0.4)",
          marginBottom: "0.8rem",
        }}>
          floor.plans
        </p>
        <h2 style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 300,
          lineHeight: 1.1,
          marginBottom: "2.2rem",
        }}>
          Select an apartment<br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>to explore in 3D</em>
        </h2>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(200,169,110,0.08)" }}>
          <PlanTab label="2nd Floor"    active={activeFloor === "second"} onClick={() => setActiveFloor("second")} />
          <PlanTab label="Ground Floor" active={activeFloor === "ground"} onClick={() => setActiveFloor("ground")} />
        </div>
      </div>

      <div style={{ position: "relative", maxWidth: "480px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ position: "relative" }}>
          <img
            src={imgSrc}
            alt={`${activeFloor === "ground" ? "Ground" : "2nd"} floor plan`}
            style={{ width: "100%", display: "block", filter: "brightness(0.92) contrast(1.05)" }}
          />
          {rooms.map((room) => (
            <Hotspot key={room.id} room={room} onEnter={onEnterRoom} />
          ))}
        </div>
        <p style={{
          fontFamily: "var(--font-chakra), monospace",
          fontSize: "0.44rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(200,169,110,0.25)",
          textAlign: "center",
          marginTop: "1.5rem",
        }}>
          Click a hotspot to enter in 3D
        </p>
      </div>
    </section>
  );
}
