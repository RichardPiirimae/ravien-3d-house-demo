"use client";

import React, { useRef } from "react";
import type { OrbitApi } from "../3d/SceneCore";

// Plan-view dial: the building's footprint at the centre, and a view cone that
// shows where the camera stands. Drag the dial (or use the arrow keys) to walk
// the camera around the building. Plan-up is the drawings' top edge.
export default function Compass({ gRef, apiRef, small }: { gRef: React.RefObject<SVGGElement | null>; apiRef: React.RefObject<OrbitApi | null>; small?: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const aim = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    apiRef.current?.setAzimuth(Math.atan2(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)));
  };

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-1.5">
      <svg
        ref={svg}
        viewBox="0 0 64 64"
        className={`${small ? "h-[60px] w-[60px]" : "h-[84px] w-[84px]"} cursor-grab touch-none rounded-full bg-white shadow-[0_1px_2px_rgba(21,22,23,0.06),0_8px_24px_-8px_rgba(21,22,23,0.18)] active:cursor-grabbing`}
        role="slider"
        aria-label="Camera direction. Use the arrow keys to walk around the building."
        aria-valuetext="Camera bearing"
        tabIndex={0}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); aim(e); }}
        onPointerMove={(e) => { if (dragging.current) aim(e); }}
        onPointerUp={() => { dragging.current = false; }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); apiRef.current?.rotateBy(-Math.PI / 12); }
          if (e.key === "ArrowRight") { e.preventDefault(); apiRef.current?.rotateBy(Math.PI / 12); }
        }}
      >
        {Array.from({ length: 36 }, (_, i) => (
          <line
            key={i}
            x1="32" y1="3.5" x2="32" y2={i % 9 === 0 ? 7.5 : 5.5}
            stroke={i % 9 === 0 ? "#5b5f64" : "#c9cac5"} strokeWidth={i % 9 === 0 ? 1 : 0.6}
            transform={`rotate(${i * 10} 32 32)`}
          />
        ))}
        <g ref={gRef}>
          <path d="M32 32 L19 58 A28 28 0 0 0 45 58 Z" fill="#1f4d3a" opacity="0.32" />
          <circle cx="32" cy="57" r="3.4" fill="#1f4d3a" stroke="#fff" strokeWidth="1.2" />
        </g>
        {/* 12 × 24 m footprint (to scale) with the waist at the stair core */}
        <path
          d="M23 18 Q23 12 29 12 L35 12 Q41 12 41 18 L41 26 Q38.5 32 41 38 L41 46 Q41 52 35 52 L29 52 Q23 52 23 46 L23 38 Q25.5 32 23 26 Z"
          fill="#e9e9e5" stroke="#151617" strokeWidth="1.4"
        />
      </svg>
      {!small && <span className="text-[12px] text-muted">Drag to turn</span>}
    </div>
  );
}
