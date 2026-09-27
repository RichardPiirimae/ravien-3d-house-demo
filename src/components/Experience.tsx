"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./ui/LoadingScreen";
import Header, { MAILTO, type SectionId } from "./ui/Header";
import Compass from "./ui/Compass";
import Schedule from "./ui/Schedule";
import { Contact, Method } from "./ui/Sheets";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { RoomDef } from "./3d/rooms";
import type { Display } from "./3d/HouseModel";
import type { Inset, OrbitApi, ViewId } from "./3d/SceneCore";

const SceneCore = dynamic(() => import("./3d/SceneCore"), { ssr: false });

const HEADER = 64;
// Height reserved for the toolbar on phones.
const MOBILE_BAR = 104;

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "aerial", label: "Aerial" },
  { id: "street", label: "Street" },
  { id: "plan", label: "Plan" },
];
const DISPLAYS: { id: Display; label: string }[] = [
  { id: "render", label: "Render" },
  { id: "white", label: "White" },
  { id: "lines", label: "Lines" },
];

export default function Experience() {
  const isMobile = useIsMobile(899);
  const [loaded, setLoaded] = useState(false);
  const [display, setDisplay] = useState<Display>("render");
  const [view, setView] = useState<ViewId>("aerial");
  const [explode, setExplode] = useState(0);
  const [room, setRoom] = useState<RoomDef | null>(null);
  const [roomView, setRoomView] = useState(0);
  const [section, setSection] = useState<SectionId>("model");
  const [stageVisible, setStageVisible] = useState(true);
  const [vp, setVp] = useState({ w: 1440, h: 800 });
  const stageRef = useRef<HTMLElement>(null);
  const bearingRef = useRef<SVGGElement>(null);
  const orbitApi = useRef<OrbitApi | null>(null);

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Which section is on screen: drives the nav, the camera and the cut.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-section]");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.getAttribute("data-section") as SectionId);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setStageVisible(e.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const inApartments = section === "apartments";
  const stageH = vp.h - HEADER;

  const inset: Inset = useMemo(() => {
    if (isMobile) {
      return inApartments
        ? { top: 16, right: 0, bottom: Math.round(stageH * 0.5) + MOBILE_BAR, left: 0 }
        : { top: 16, right: 0, bottom: Math.round(stageH * 0.3) + MOBILE_BAR, left: 0 };
    }
    // Desktop hero: the headline owns the left, the model the rest.
    return inApartments
      ? { top: 24, right: 0, bottom: 110, left: 520 }
      : { top: 24, right: 0, bottom: 110, left: Math.round(vp.w * 0.4) };
  }, [isMobile, inApartments, stageH, vp.w]);

  const selectRoom = useCallback((r: RoomDef | null) => {
    setRoom(r);
    setRoomView(0);
    if (r) setExplode(0);
  }, []);

  // Leaving the apartments returns the camera to the whole building.
  const activeRoom = inApartments ? room : null;

  const handleLoaded = useCallback(() => setLoaded(true), []);

  const modelLeft = isMobile ? 0 : inset.left;

  return (
    <>
      <LoadingScreen loaded={loaded} />
      <Header active={section} />

      <main className="pt-16">
        <section id="model" ref={stageRef} className="relative">
          {/* The model stays on screen while the intro and the apartments scroll over it */}
          <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
            <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
              <SceneCore
                display={display}
                view={view}
                explode={explode}
                room={activeRoom}
                roomView={roomView}
                cutaway={inApartments}
                inset={inset}
                isMobile={isMobile}
                frameloop={stageVisible ? "always" : "never"}
                onLoaded={handleLoaded}
                bearingRef={bearingRef}
                apiRef={orbitApi}
              />
            </div>

            <div
              className="pointer-events-none absolute z-20 flex justify-center transition-[left] duration-500"
              style={isMobile ? { left: 12, right: 12, bottom: inset.bottom - MOBILE_BAR + 16 } : { left: modelLeft, right: 0, bottom: 28 }}
            >
              <div className={`pointer-events-auto flex flex-wrap items-center justify-center gap-2 ${isMobile ? "max-w-[366px]" : ""}`} role="toolbar" aria-label="Model controls">
                {/* Phones get one pill for view + finish, so the bar stays two rows */}
                <div className={`toolbar ${isMobile ? "compact" : ""}`} role="group" aria-label="View">
                  {VIEWS.map((v) => (
                    <button key={v.id} aria-pressed={!activeRoom && view === v.id} onClick={() => { setRoom(null); setView(v.id); }}>
                      {v.label}
                    </button>
                  ))}
                  {isMobile && <span className="sep" aria-hidden />}
                  {isMobile && DISPLAYS.map((d) => (
                    <button key={d.id} aria-pressed={display === d.id} onClick={() => setDisplay(d.id)}>
                      {d.label}
                    </button>
                  ))}
                </div>
                {!isMobile && (
                  <div className="toolbar" role="group" aria-label="Finish">
                    {DISPLAYS.map((d) => (
                      <button key={d.id} aria-pressed={display === d.id} onClick={() => setDisplay(d.id)}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
                <label className="toolbar pl-4 pr-3">
                  <span className="text-[14px] font-medium text-muted">Explode</span>
                  <input
                    type="range" min={0} max={1} step={0.01} value={explode}
                    onChange={(e) => { setRoom(null); setExplode(+e.target.value); }}
                    className="pull" aria-label="Explode floors"
                  />
                </label>
              </div>
            </div>

            <div className="absolute z-20" style={isMobile ? { right: 12, top: 12 } : { right: 32, bottom: 28 }}>
              <Compass gRef={bearingRef} apiRef={orbitApi} small={isMobile} />
            </div>
          </div>

          <div className="pointer-events-none relative z-10 -mt-[calc(100svh-4rem)]">
            {/* Intro */}
            <div data-section="model" className="flex h-[calc(100svh-4rem)] flex-col justify-end px-5 pb-8 md:px-10 min-[900px]:pb-32">
              <h1 className="display max-w-[11ch] text-[clamp(2.1rem,5.2vw,4.8rem)] leading-[0.98]">
                Your building, live on the web.
              </h1>
              <p className="mt-3 text-[16px] leading-snug text-muted min-[900px]:hidden">
                Ravien turns Revit and FBX drawings into live 3D websites.
              </p>
              <p className="mt-5 max-w-[40ch] text-[17px] leading-relaxed text-muted max-[899px]:!hidden">
                Ravien turns Revit and FBX drawings into interactive 3D websites. This house is one: five apartments over two floors, running live in your browser.
              </p>
              <div className="pointer-events-auto mt-5 flex flex-wrap gap-3 md:mt-7">
                <a href={MAILTO} className="btn btn-primary">Start a project</a>
                <a href="#apartments" className="btn btn-ghost max-[899px]:!hidden">Explore the apartments</a>
              </div>
            </div>

            {/* Apartments */}
            <div id="apartments" data-section="apartments" className="relative h-[calc(100svh-4rem)]">
              <div
                className={`pointer-events-auto absolute bg-bg ${
                  isMobile
                    ? "inset-x-0 bottom-0 h-[calc((100svh-4rem)*0.5)] overflow-y-auto border-t border-line px-5 pb-10 pt-6"
                    : "inset-y-0 left-0 w-[520px] overflow-y-auto border-r border-line px-10 pb-8 pt-10"
                }`}
              >
                <Schedule room={activeRoom} roomView={roomView} onSelect={selectRoom} onView={setRoomView} />
              </div>
            </div>
          </div>
        </section>

        <Method />
        <Contact />
      </main>
    </>
  );
}
