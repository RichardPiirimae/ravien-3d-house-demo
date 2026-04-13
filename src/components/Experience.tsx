"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import LoadingScreen from "./ui/LoadingScreen";
import FloorPlanSection from "./ui/FloorPlanSection";
import MarketingSections from "./ui/MarketingSections";
import Footer from "./ui/Footer";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { RoomDef } from "./3d/rooms";

const SceneCore = dynamic(() => import("./3d/SceneCore"), { ssr: false });

const navBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(200,169,110,0.35)",
  color: "rgba(200,169,110,0.8)",
  fontFamily: "monospace",
  fontSize: "1rem",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "border-color 0.2s",
};

export default function Experience() {
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<"exterior" | "room">("exterior");
  const [selectedRoom, setSelectedRoom] = useState<RoomDef | null>(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [camPos, setCamPos] = useState<[number, number, number]>([0, 0, 0]);
  const [camTarget, setCamTarget] = useState<[number, number, number]>([0, 0, 0]);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleLoaded = useCallback(() => setLoaded(true), []);

  const handleEnterRoom = useCallback((room: RoomDef) => {
    setSelectedRoom(room);
    setViewIndex(0);
    setMode("room");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToPlans = useCallback(() => {
    setMode("exterior");
    setSelectedRoom(null);
    setTimeout(() => {
      document.getElementById("floor-plans")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  const handlePosUpdate = useCallback((pos: THREE.Vector3, target: THREE.Vector3) => {
    const r = (n: number) => Math.round(n * 10) / 10;
    setCamPos([r(pos.x), r(pos.y), r(pos.z)]);
    setCamTarget([r(target.x), r(target.y), r(target.z)]);
  }, []);

  const pad = isMobile ? "1.25rem" : "2.5rem";

  return (
    <>
      <LoadingScreen loaded={loaded} />

      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <SceneCore
          mode={mode}
          room={selectedRoom}
          viewIndex={viewIndex}
          onLoaded={handleLoaded}
          onPosUpdate={mode === "room" ? handlePosUpdate : undefined}
          eventSource={heroRef}
          frameloop={mode === "room" || heroVisible ? "always" : "never"}
        />
      </div>

      {/* ── Room overlay ── */}
      {mode === "room" && selectedRoom && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
          padding: pad,
        }}>
          <button
            onClick={handleBackToPlans}
            style={{
              pointerEvents: "all",
              cursor: "pointer",
              background: "rgba(10,8,6,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(200,169,110,0.35)",
              padding: "0.5rem 1.2rem",
              fontFamily: "var(--font-chakra), monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(200,169,110,0.7)",
              marginBottom: "1rem",
              display: "block",
              transition: "border-color 0.2s",
            }}
          >
            ← Floor Plan
          </button>

          <p style={{
            fontFamily: "var(--font-chakra), monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(200,169,110,0.7)",
            marginBottom: "0.3rem",
          }}>
            {selectedRoom.floor === "ground" ? "Ground Floor" : "2nd Floor"}
          </p>
          <h2 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: isMobile ? "clamp(1.8rem, 8vw, 2.8rem)" : "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 300,
            lineHeight: 1,
            color: "#f0ead8",
            marginBottom: "0.2rem",
          }}>
            {selectedRoom.label}
          </h2>
          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: isMobile ? "1.1rem" : "clamp(1.2rem, 2vw, 1.8rem)",
            fontWeight: 300,
            color: "var(--accent)",
          }}>
            {selectedRoom.area}
          </p>
          {!isMobile && (
            <p style={{
              fontFamily: "var(--font-chakra), monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: "rgba(240,234,216,0.4)",
              marginTop: "0.3rem",
            }}>
              {selectedRoom.desc}
            </p>
          )}

          {/* Carousel */}
          {selectedRoom.views.length > 1 && (
            <div style={{
              position: "absolute",
              bottom: pad,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              pointerEvents: "all",
            }}>
              <button onClick={() => setViewIndex(i => (i - 1 + selectedRoom.views.length) % selectedRoom.views.length)} style={navBtnStyle}>←</button>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                {selectedRoom.views.map((v, i) => (
                  <button key={i} onClick={() => setViewIndex(i)} style={{
                    width: i === viewIndex ? "20px" : "5px",
                    height: "5px",
                    borderRadius: "3px",
                    background: i === viewIndex ? "rgba(200,169,110,0.9)" : "rgba(200,169,110,0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }} />
                ))}
              </div>
              <button onClick={() => setViewIndex(i => (i + 1) % selectedRoom.views.length)} style={navBtnStyle}>→</button>
              {selectedRoom.views[viewIndex]?.label && (
                <div style={{
                  position: "absolute",
                  bottom: "2.2rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-chakra), monospace",
                  fontSize: "0.45rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(200,169,110,0.55)",
                  whiteSpace: "nowrap",
                }}>
                  {selectedRoom.views[viewIndex].label}
                </div>
              )}
            </div>
          )}

          {/* Debug readout — desktop only */}
          {!isMobile && (
            <div style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              fontFamily: "monospace",
              fontSize: "0.55rem",
              lineHeight: 1.6,
              color: "rgba(200,169,110,0.5)",
              background: "rgba(0,0,0,0.55)",
              padding: "0.4rem 0.65rem",
              pointerEvents: "none",
            }}>
              <div>pos:  [{camPos[0]}, {camPos[1]}, {camPos[2]}]</div>
              <div>look: [{camTarget[0]}, {camTarget[1]}, {camTarget[2]}]</div>
            </div>
          )}
        </div>
      )}

      {/* ── Scrollable content ── */}
      <div style={{ position: "relative", zIndex: 10 }}>

        {/* Hero */}
        <div ref={heroRef} style={{ height: "100vh", position: "relative", cursor: "grab" }}>
          <div
            className="absolute inset-0 select-none flex flex-col justify-end"
            style={{
              padding: isMobile ? "2rem" : "4rem",
              pointerEvents: "none",
              opacity: mode === "room" ? 0 : 1,
              transition: "opacity 0.4s",
            }}
          >
            {/* Top-left label */}
            <div className="absolute top-6 left-6" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "rgba(200,169,110,0.8)",
                boxShadow: "0 0 8px rgba(200,169,110,0.5)",
                animation: "blink 2.5s infinite",
              }} />
              <span style={{
                fontFamily: "var(--font-chakra), monospace",
                fontSize: "0.45rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(200,169,110,0.5)",
              }}>
                Ravien Studio · 3D Experience
              </span>
            </div>

            {/* Top-right coords — desktop only */}
            {!isMobile && mode === "exterior" && (
              <div className="absolute top-8 right-8" style={{
                fontFamily: "var(--font-chakra), monospace",
                fontSize: "0.42rem",
                letterSpacing: "0.15em",
                color: "rgba(200,169,110,0.2)",
                textAlign: "right",
                lineHeight: 1.8,
              }}>
                <div>59°26′N 24°45′E</div>
                <div>5 APT · 2 FL · 12×24M</div>
              </div>
            )}

            <p style={{
              fontFamily: "var(--font-chakra), monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.8rem",
              opacity: 0,
              animation: "fade-up 1s 0.3s forwards",
            }}>
              Studio Project
            </p>
            <h1 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: isMobile ? "clamp(2.8rem, 12vw, 5rem)" : "clamp(3rem, 7vw, 6rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              opacity: 0,
              animation: "fade-up 1s 0.5s forwards",
            }}>
              Organic<br />
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Architecture</em>
            </h1>
            <p style={{
              marginTop: "1.2rem",
              fontFamily: "var(--font-chakra), monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              color: "rgba(240,234,216,0.35)",
              opacity: 0,
              animation: "fade-up 1s 0.7s forwards",
            }}>
              5 apartments · 2 floors · 12 × 24 m
            </p>
            <p style={{
              marginTop: "0.6rem",
              fontFamily: "var(--font-chakra), monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              color: "rgba(240,234,216,0.2)",
              opacity: 0,
              animation: "fade-up 1s 0.9s forwards",
            }}>
              {isMobile ? "Touch to rotate · Scroll to explore" : "Drag to rotate · Scroll to explore"}
            </p>

            <div className="absolute flex flex-col items-center gap-2" style={{
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: 0,
              animation: "fade-up 1s 1.4s forwards",
            }}>
              <div style={{
                fontFamily: "var(--font-chakra), monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(200,169,110,0.4)",
              }}>
                Scroll
              </div>
              <div style={{
                width: "1px", height: "32px",
                background: "linear-gradient(to bottom, rgba(200,169,110,0.4), transparent)",
                animation: "scroll-pulse 2s 1.5s infinite",
              }} />
            </div>
          </div>
        </div>

        <FloorPlanSection onEnterRoom={handleEnterRoom} />
        <MarketingSections />
        <Footer />
      </div>
    </>
  );
}
