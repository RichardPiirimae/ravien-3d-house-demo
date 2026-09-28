"use client";

import { useProgress } from "@react-three/drei";

export default function LoadingScreen({ loaded }: { loaded: boolean }) {
  const { progress } = useProgress();
  const p = loaded ? 100 : Math.min(99, Math.round(progress));
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-bg transition-[opacity,visibility] duration-700"
      style={{ opacity: loaded ? 0 : 1, visibility: loaded ? "hidden" : "visible" }}
      role="status"
      aria-live="polite"
    >
      <div className="w-[min(320px,80vw)]">
        <div className="display text-[28px]">3D House Demo</div>
        <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-line">
          <div className="h-full origin-left rounded-full bg-accent transition-transform duration-300" style={{ transform: `scaleX(${p / 100})` }} />
        </div>
        <div className="mt-3 flex justify-between text-[14px] text-muted">
          <span>Loading the model</span>
          <span className="tabular-nums">{p}%</span>
        </div>
      </div>
    </div>
  );
}
