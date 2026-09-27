"use client";

import { ROOMS, ROOM_VIEWS, type RoomDef } from "../3d/rooms";

interface Props {
  room: RoomDef | null;
  roomView: number;
  onSelect: (r: RoomDef | null) => void;
  onView: (i: number) => void;
}

const floorName = (f: RoomDef["floor"]) => (f === "ground" ? "Ground floor" : "Second floor");

export default function Schedule({ room, roomView, onSelect, onView }: Props) {
  const floor = room?.floor ?? "second";
  // Each plan is cropped at `keep` of its width to drop its colour legend.
  const plan = floor === "ground"
    ? { src: "/floorplan-ground.jpg", w: 1083, h: 1165, keep: 0.72 }
    : { src: "/floorplan-2nd.jpg", w: 1190, h: 1173, keep: 0.7 };
  const onPlan = ROOMS.filter((r) => r.floor === floor);

  return (
    <div className="flex flex-col min-[900px]:h-full">
      <h2 className="display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.02]">Walk into any apartment.</h2>
      <p className="mt-3 max-w-[44ch] text-[16px] leading-relaxed text-muted">
        Pick one and the model is cut open at that floor. The apartment is lifted out of the building so you can see every room.
      </p>

      <ul className="mt-7 divide-y divide-line border-y border-line" aria-label="Apartments">
        {ROOMS.map((r) => {
          const on = room?.id === r.id;
          return (
            <li key={r.id}>
              <button
                onClick={() => onSelect(on ? null : r)}
                aria-pressed={on}
                className={`group grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-4 px-3 py-3 text-left transition-colors ${
                  on ? "bg-[#eaf0ec]" : "hover:bg-white"
                }`}
              >
                <span>
                  <span className={`block text-[17px] font-medium ${on ? "text-accent" : "text-ink"}`}>{r.label}</span>
                  <span className="mt-0.5 block text-[14px] text-muted">
                    {floorName(r.floor)} · {r.beds} {r.beds === 1 ? "bedroom" : "bedrooms"}{r.balcony ? ` · ${r.balcony} balcony` : ""}
                  </span>
                </span>
                <span className="text-[17px] font-medium tabular-nums">{r.area}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex min-h-[44px] flex-wrap items-center gap-3" aria-live="polite">
        {room ? (
          <>
            <div className="toolbar !shadow-none ring-1 ring-line" role="group" aria-label="Apartment view">
              {ROOM_VIEWS.map((v, i) => (
                <button key={v} aria-pressed={i === roomView} onClick={() => onView(i)}>
                  {v}
                </button>
              ))}
            </div>
            <button onClick={() => onSelect(null)} className="ml-auto cursor-pointer text-[14px] text-muted underline hover:text-ink">
              Whole building
            </button>
          </>
        ) : (
          <span className="text-[14px] text-muted">Drag the model to look around. Nothing here is pre-rendered.</span>
        )}
      </div>

      {/* Key plan: the architect's floor plan, with the apartments on it */}
      <figure className="relative mt-5 flex h-[300px] flex-col min-[900px]:h-auto min-[900px]:min-h-[320px] min-[900px]:flex-1">
        <div
          className="relative mx-auto h-full min-h-0 max-w-full overflow-hidden"
          style={{ aspectRatio: `${plan.w * plan.keep} / ${plan.h}` }}
        >
          <img
            src={plan.src}
            alt={`${floorName(floor)} plan`}
            className="absolute left-0 top-0 h-full max-w-none mix-blend-multiply"
            style={{ width: `${100 / plan.keep}%` }}
          />
          {onPlan.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              aria-label={r.label}
              className={`absolute grid h-7 min-w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full px-1.5 text-[12px] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-colors ${
                room?.id === r.id ? "bg-accent text-white" : "bg-white text-ink hover:bg-ink hover:text-white"
              }`}
              style={{ left: `${r.hotspot.x / plan.keep}%`, top: `${r.hotspot.y}%` }}
            >
              {r.apt}
            </button>
          ))}
        </div>
        <figcaption className="mt-2 text-center text-[13px] text-muted">{floorName(floor)} plan</figcaption>
      </figure>
    </div>
  );
}
