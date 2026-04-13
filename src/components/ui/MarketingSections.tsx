"use client";

import { useState, useEffect, useRef } from "react";
import DotPattern from "./DotPattern";
import CTAMarquee from "./CTAMarquee";
import { useIsMobile } from "@/hooks/useIsMobile";

// ── Hooks ──────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);
  return val;
}

// ── Data ───────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    num: "01",
    title: "Real-time 3D Visualization",
    tag: "WebGL · React Three Fiber",
    short: "Architectural models rendered at 60fps in the browser. No plugins.",
    long: "We ingest Revit FBX exports, GLB/GLTF files and optimize them for WebGL via React Three Fiber. Your model streams directly into the browser at cinematic frame rates — no downloads, no plugins, no Unity.",
  },
  {
    num: "02",
    title: "100% Custom Code",
    tag: "No Templates · No Compromises",
    short: "Every line written for your project. Your vision, executed exactly.",
    long: "Nothing is off-the-shelf. Every interaction, every transition, every camera angle is written from scratch to match your brief precisely. No WordPress, no page builders, no template constraints — just clean, purposeful code built entirely around your vision.",
  },
  {
    num: "03",
    title: "Interactive Floor Plans",
    tag: "Hotspots · Camera Presets",
    short: "Hotspot overlays linked to live 3D camera positions.",
    long: "Each space gets calibrated camera presets. Clicking a hotspot on the floor plan instantly transports the viewer into that exact vantage point inside the 3D model — smooth, instant, zero loading.",
  },
  {
    num: "04",
    title: "PBR Material Systems",
    tag: "Physically Based · Custom Palettes",
    short: "Custom PBR materials with cinematic tone mapping.",
    long: "Revit exports are uniform grey by default. We remap every surface by category — exterior walls, glazing, timber, concrete, steel — assigning physically-based values matched precisely to your design intent.",
  },
  {
    num: "05",
    title: "Contextual Mesh Visibility",
    tag: "Selective Rendering · Zero Duplication",
    short: "Roofs, floors, and structure toggled per context.",
    long: "The same 3D model serves every view. Entering a ground-floor apartment hides the second floor and roof. Returning to exterior shows the full building. Zero asset duplication. Zero re-loading.",
  },
  {
    num: "06",
    title: "Performance-First Architecture",
    tag: "Next.js · Static Deploy · Single Canvas",
    short: "Single canvas. Asset preloading. Ships fast on every device.",
    long: "One persistent WebGL canvas shared across all modes. The FBX loads once and is never re-instantiated. DPR is clamped for consistent performance. The entire experience compiles to a static Next.js deployment.",
  },
];

const STATS = [
  { value: 489, suffix: "",    label: "Architectural\nelements" },
  { value: 60,  suffix: "fps", label: "Real-time\nrender target" },
  { value: 5,   suffix: "",    label: "Bespoke\napartments" },
  { value: 24,  suffix: "MB",  label: "Asset loaded\nonce" },
];

const PROCESS = [
  {
    num: "01",
    title: "Model Preparation",
    body: "We receive your Revit, Rhino, FBX, or GLTF files and audit for web viability — mesh count, texture atlasing, material structure. Geometry is optimized for real-time streaming without losing design fidelity.",
  },
  {
    num: "02",
    title: "Scene & Material Design",
    body: "Custom material palettes are built from your reference images and brand guidelines. Lighting rigs, tone mapping, and HDR environments are calibrated in live sessions until the render matches your vision exactly.",
  },
  {
    num: "03",
    title: "Interactive Layer",
    body: "Floor plans get hotspot overlays. Camera positions for every room are calibrated live. UI — navigation, carousels, overlays — is built and integrated into a deployable Next.js application with your branding.",
  },
];

// ── Shared styles ──────────────────────────────────────────────────────────

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-chakra), monospace",
};

const TAG: React.CSSProperties = {
  ...MONO,
  fontSize: "0.48rem",
  letterSpacing: "0.35em",
  textTransform: "uppercase" as const,
  color: "rgba(200,169,110,0.45)",
};

// ── Corner bracket decoration ──────────────────────────────────────────────

function Corners({ size = 10, color = "rgba(200,169,110,0.3)" }: { size?: number; color?: string }) {
  const s = { position: "absolute" as const, width: size, height: size };
  const b = `1px solid ${color}`;
  return (
    <>
      <span style={{ ...s, top: 0, left: 0, borderTop: b, borderLeft: b }} />
      <span style={{ ...s, top: 0, right: 0, borderTop: b, borderRight: b }} />
      <span style={{ ...s, bottom: 0, left: 0, borderBottom: b, borderLeft: b }} />
      <span style={{ ...s, bottom: 0, right: 0, borderBottom: b, borderRight: b }} />
    </>
  );
}

// ── Glowing horizontal rule ────────────────────────────────────────────────

function GlowRule({ mt = "0", mb = "0" }: { mt?: string; mb?: string }) {
  return (
    <div style={{
      marginTop: mt, marginBottom: mb,
      position: "relative", height: "1px",
      background: "rgba(200,169,110,0.08)",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: "-100%",
        width: "60%", height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(200,169,110,0.6), transparent)",
        animation: "glowSweep 4s ease-in-out infinite",
      }} />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────

function StatCard({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const count = useCounter(value, active);
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 180px",
        padding: "3rem 2rem",
        position: "relative",
        transition: "background 0.3s",
        background: hovered ? "rgba(200,169,110,0.025)" : "transparent",
        cursor: "default",
      }}
    >
      <Corners color={hovered ? "rgba(200,169,110,0.5)" : "rgba(200,169,110,0.15)"} size={8} />
      <div style={{
        ...MONO,
        fontSize: "0.38rem",
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: "rgba(200,169,110,0.35)",
        marginBottom: "1rem",
      }}>
        sys.metric
      </div>
      <div style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: "clamp(3rem, 4.5vw, 5rem)",
        fontWeight: 300,
        lineHeight: 1,
        color: "#f0ead8",
        letterSpacing: "-0.02em",
      }}>
        {count}{suffix}
      </div>
      <div style={{
        ...MONO,
        fontSize: "0.48rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(200,169,110,0.5)",
        marginTop: "0.8rem",
        lineHeight: 1.8,
        whiteSpace: "pre-line",
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Capability row ────────────────────────────────────────────────────────

function CapRow({ cap, index, visible }: { cap: typeof CAPABILITIES[0]; index: number; visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity 0.6s ${index * 0.07}s, transform 0.6s ${index * 0.07}s`,
      }}
    >
      <GlowRule />
      <div
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1.6rem 0",
          cursor: "pointer",
          gap: "2rem",
          transition: "background 0.2s",
        }}
      >
        <span style={{ ...TAG, minWidth: "2rem", opacity: 0.5 }}>{cap.num}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(1.1rem, 2vw, 1.65rem)",
            fontWeight: 300,
            color: hovered || open ? "#f0ead8" : "rgba(240,234,216,0.82)",
            lineHeight: 1.2,
            transition: "color 0.2s",
          }}>
            {cap.title}
          </div>
          <div style={{
            ...MONO,
            fontSize: "0.44rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(200,169,110,0.4)",
            marginTop: "0.3rem",
          }}>
            {cap.tag}
          </div>
        </div>
        {!open && (
          <div style={{
            ...MONO,
            fontSize: "0.48rem",
            letterSpacing: "0.12em",
            color: "rgba(200,169,110,0.3)",
            maxWidth: "300px",
            display: "none",
          }}>
            {cap.short}
          </div>
        )}
        <div style={{
          width: 28, height: 28,
          border: `1px solid ${open ? "rgba(200,169,110,0.6)" : "rgba(200,169,110,0.2)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          transition: "border-color 0.2s",
        }}>
          <span style={{
            ...MONO,
            fontSize: "0.85rem",
            color: "rgba(200,169,110,0.7)",
            lineHeight: 1,
            display: "block",
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "none",
          }}>+</span>
        </div>
      </div>
      {open && (
        <div style={{
          paddingLeft: "4rem",
          paddingBottom: "1.8rem",
          display: "flex",
          gap: "4rem",
          alignItems: "flex-start",
        }}>
          <p style={{
            ...MONO,
            fontSize: "0.6rem",
            letterSpacing: "0.06em",
            lineHeight: 2.1,
            color: "rgba(240,234,216,0.4)",
            margin: 0,
            maxWidth: "560px",
          }}>
            {cap.long}
          </p>
          <div style={{
            ...MONO,
            fontSize: "0.38rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(200,169,110,0.25)",
            whiteSpace: "nowrap",
            paddingTop: "0.3rem",
          }}>
            capability.{cap.num}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export default function MarketingSections() {
  const { ref: stRef, inView: stInView } = useInView();
  const { ref: capRef, inView: capInView } = useInView();
  const { ref: statsRef, inView: statsInView } = useInView();
  const { ref: procRef, inView: procInView } = useInView();
  const isMobile = useIsMobile();
  const px = isMobile ? "1.5rem" : "6rem";
  const [openStep, setOpenStep] = useState<string>("01");

  return (
    <>
      {/* ── Global glow sweep animation ───────────────────────────── */}
      <style>{`
        @keyframes glowSweep {
          0%   { left: -60%; }
          50%  { left: 120%; }
          100% { left: 120%; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* ── 1. Statement ─────────────────────────────────────────────────── */}
      <section
        ref={stRef}
        style={{
          background: "var(--dark)",
          padding: `${isMobile ? "5rem 1.5rem" : "11rem 6rem 10rem"}`,
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(200,169,110,0.07)",
        }}
      >
        <DotPattern gap={28} cr={1} color="rgba(200,169,110,0.1)" />

        {/* Vertical grid lines */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${25 + i * 25}%`,
            width: "1px",
            background: "rgba(200,169,110,0.04)",
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", maxWidth: "960px" }}>
          {/* System label */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "3rem",
            opacity: stInView ? 1 : 0,
            transition: "opacity 0.8s",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "rgba(200,169,110,0.8)",
              boxShadow: "0 0 8px rgba(200,169,110,0.6)",
              animation: "blink 2.5s infinite",
            }} />
            <span style={{ ...TAG }}>sys.online — design studio 3d</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "#f0ead8",
            opacity: stInView ? 1 : 0,
            transform: stInView ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.9s 0.1s, transform 0.9s 0.1s",
            marginBottom: "2.5rem",
          }}>
            We build digital environments<br />
            that transform architectural vision<br />
            into{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              immersive interactive experiences.
            </em>
          </h2>

          <div style={{
            display: "flex", gap: "4rem", flexWrap: "wrap",
            opacity: stInView ? 1 : 0,
            transform: stInView ? "none" : "translateY(14px)",
            transition: "opacity 0.9s 0.3s, transform 0.9s 0.3s",
          }}>
            {[
              "Custom 3D web experiences",
              "Architecture & real estate",
              "Portfolio & product demos",
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.7rem",
              }}>
                <div style={{
                  width: 4, height: 4,
                  background: "rgba(200,169,110,0.6)",
                  transform: "rotate(45deg)",
                  flexShrink: 0,
                }} />
                <span style={{ ...MONO, fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(240,234,216,0.35)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Capabilities ──────────────────────────────────────────────── */}
      <section
        ref={capRef}
        style={{
          background: "var(--dark)",
          padding: `3rem ${px}`,
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(200,169,110,0.07)",
        }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <div>
            <div style={{ ...TAG, marginBottom: "0.8rem" }}>capabilities.list</div>
            <h3 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 300,
              color: "#f0ead8",
              margin: 0,
            }}>
              What we engineer
            </h3>
          </div>
          <div style={{ ...MONO, fontSize: "0.44rem", letterSpacing: "0.2em", color: "rgba(200,169,110,0.25)" }}>
            {CAPABILITIES.length.toString().padStart(2, "0")} modules available
          </div>
        </div>

        <div>
          {CAPABILITIES.map((cap, i) => (
            <CapRow key={cap.num} cap={cap} index={i} visible={capInView} />
          ))}
          <GlowRule />
        </div>
      </section>

      {/* ── 3. Stats ─────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        style={{
          background: "var(--dark)",
          position: "relative",
          overflow: "hidden",
          borderTop: "1px solid rgba(200,169,110,0.07)",
          borderBottom: "1px solid rgba(200,169,110,0.07)",
        }}
      >
        <DotPattern gap={20} cr={0.8} color="rgba(200,169,110,0.07)" />

        {/* scanline effect */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
          zIndex: 0,
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0,
            height: "120px",
            background: "linear-gradient(to bottom, transparent, rgba(200,169,110,0.03), transparent)",
            animation: "scanline 8s linear infinite",
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} active={statsInView} />
          ))}
        </div>
      </section>

      {/* ── 4. Process ───────────────────────────────────────────────────── */}
      <section
        ref={procRef}
        style={{
          background: "var(--dark)",
          padding: `${isMobile ? "4rem 1.5rem" : "8rem 6rem"}`,
          borderTop: "1px solid rgba(200,169,110,0.07)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem",
            opacity: procInView ? 1 : 0,
            transition: "opacity 0.8s",
          }}>
            <div>
              <div style={{ ...TAG, marginBottom: "0.8rem" }}>process.flow</div>
              <h3 style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                fontWeight: 300,
                color: "#f0ead8",
                margin: 0,
              }}>
                How we work
              </h3>
            </div>
          </div>

          {PROCESS.map((step, i) => {
            const isOpen = openStep === step.num;
            return (
              <div
                key={step.num}
                style={{
                  opacity: procInView ? 1 : 0,
                  transform: procInView ? "none" : "translateY(20px)",
                  transition: `opacity 0.7s ${i * 0.12}s, transform 0.7s ${i * 0.12}s`,
                }}
              >
                <GlowRule />
                <div
                  onClick={() => setOpenStep(isOpen ? "" : step.num)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "2rem 0",
                    cursor: "pointer",
                    gap: "2rem",
                  }}
                >
                  <div style={{
                    position: "relative",
                    width: 36, height: 36,
                    border: `1px solid ${isOpen ? "rgba(200,169,110,0.5)" : "rgba(200,169,110,0.15)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "border-color 0.3s",
                  }}>
                    {isOpen && (
                      <div style={{
                        position: "absolute", inset: 3,
                        background: "rgba(200,169,110,0.08)",
                      }} />
                    )}
                    <span style={{ ...MONO, fontSize: "0.42rem", letterSpacing: "0.15em", color: "rgba(200,169,110,0.7)", position: "relative" }}>
                      {step.num}
                    </span>
                  </div>
                  <h4 style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)",
                    fontWeight: 300,
                    color: "#f0ead8",
                    margin: 0,
                    flex: 1,
                  }}>
                    {step.title}
                  </h4>
                  <span style={{
                    ...MONO,
                    fontSize: "1rem",
                    color: "rgba(200,169,110,0.3)",
                    transition: "transform 0.3s",
                    transform: isOpen ? "rotate(45deg)" : "none",
                    flexShrink: 0,
                  }}>+</span>
                </div>
                {isOpen && (
                  <p style={{
                    ...MONO,
                    fontSize: "0.6rem",
                    letterSpacing: "0.06em",
                    lineHeight: 2.1,
                    color: "rgba(240,234,216,0.38)",
                    paddingLeft: "5.5rem",
                    paddingBottom: "2rem",
                    margin: 0,
                    maxWidth: "600px",
                  }}>
                    {step.body}
                  </p>
                )}
              </div>
            );
          })}
          <GlowRule />
        </div>
      </section>

      {/* ── 5. CTA with vertical marquee ─────────────────────────────────── */}
      <CTAMarquee />
    </>
  );
}
