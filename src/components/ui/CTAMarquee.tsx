"use client";

import { useEffect, useRef, ReactNode } from "react";

const MARQUEE_ITEMS = [
  "Architecture Studios",
  "Real Estate Developers",
  "Interior Designers",
  "Property Marketers",
  "Design Agencies",
  "Construction Firms",
  "Hospitality Brands",
  "Urban Planners",
];

function VerticalMarquee({ children, speed = 22 }: { children: ReactNode; speed?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <div style={{
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        animation: `marquee-vertical ${speed}s linear infinite`,
        willChange: "transform",
      }}>
        {children}
      </div>
      {/* Duplicate for seamless loop */}
      <div
        aria-hidden
        style={{
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          animation: `marquee-vertical ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function CTAMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Opacity fade — only runs while the marquee is in the viewport
  useEffect(() => {
    const container = marqueeRef.current;
    if (!container) return;
    let frame: number;
    let visible = false;

    const update = () => {
      if (!visible) return;
      const items = container.querySelectorAll<HTMLElement>(".mq-item");
      const rect = container.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      items.forEach((item) => {
        const ir = item.getBoundingClientRect();
        const dist = Math.abs(centerY - (ir.top + ir.height / 2));
        const opacity = Math.max(0.07, 1 - (dist / (rect.height / 2)) * 0.88);
        item.style.opacity = String(opacity);
        const scale = 0.88 + (1 - dist / (rect.height / 2)) * 0.12;
        item.style.transform = `scaleX(${Math.max(0.88, scale)})`;
      });
      frame = requestAnimationFrame(update);
    };

    const obs = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) frame = requestAnimationFrame(update);
      else cancelAnimationFrame(frame);
    }, { threshold: 0 });

    obs.observe(container);
    return () => { obs.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <section style={{
      background: "var(--dark)",
      borderTop: "1px solid rgba(200,169,110,0.07)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6rem",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Dot grid */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <defs>
          <pattern id="cta-dots" x={0} y={0} width={28} height={28} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={1} fill="rgba(200,169,110,0.08)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-dots)" />
      </svg>

      {/* Radial glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "35%",
        transform: "translate(-50%, -50%)",
        width: "700px", height: "500px",
        background: "radial-gradient(ellipse, rgba(200,169,110,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "1200px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "6rem",
        alignItems: "center",
      }}>

        {/* ── Left: CTA copy ── */}
        <div style={{ animation: "fade-in-up 0.9s 0.1s both" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "2.5rem",
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "rgba(200,169,110,0.8)",
              boxShadow: "0 0 8px rgba(200,169,110,0.5)",
              animation: "blink 2.5s infinite",
            }} />
            <span style={{
              fontFamily: "var(--font-chakra), monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(200,169,110,0.45)",
            }}>
              commission.inquiry
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "#f0ead8",
            marginBottom: "1.8rem",
          }}>
            Let's build<br />something{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              extraordinary.
            </em>
          </h2>

          <p style={{
            fontFamily: "var(--font-chakra), monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.06em",
            color: "rgba(240,234,216,0.3)",
            lineHeight: 2.1,
            marginBottom: "3.5rem",
            maxWidth: "420px",
          }}>
            We partner with studios, developers, and brands to build
            bespoke 3D web experiences. Every project is custom-engineered
            from your actual architectural files.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="mailto:ravienaisolutions@gmail.com"
              style={{
                position: "relative",
                display: "inline-block",
                padding: "0.95rem 2.8rem",
                fontFamily: "var(--font-chakra), monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "#0f0d0b",
                background: "rgba(200,169,110,0.9)",
                textDecoration: "none",
                overflow: "hidden",
                transition: "background 0.25s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(200,169,110,1)";
                const shine = e.currentTarget.querySelector(".shine") as HTMLElement;
                if (shine) shine.style.transform = "translateX(200%)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(200,169,110,0.9)";
                const shine = e.currentTarget.querySelector(".shine") as HTMLElement;
                if (shine) shine.style.transform = "translateX(-200%)";
              }}
            >
              <span className="shine" style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                transform: "translateX(-200%)",
                transition: "transform 0.6s",
                pointerEvents: "none",
              }} />
              Get in touch
            </a>

            <a
              href="#floor-plans"
              style={{
                display: "inline-block",
                padding: "0.95rem 2.8rem",
                fontFamily: "var(--font-chakra), monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(200,169,110,0.65)",
                border: "1px solid rgba(200,169,110,0.2)",
                textDecoration: "none",
                transition: "border-color 0.25s, color 0.25s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(200,169,110,0.55)";
                el.style.color = "rgba(200,169,110,0.95)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(200,169,110,0.2)";
                el.style.color = "rgba(200,169,110,0.65)";
              }}
            >
              View the model
            </a>
          </div>
        </div>

        {/* ── Right: Vertical marquee ── */}
        <div
          ref={marqueeRef}
          style={{
            position: "relative",
            height: "620px",
            overflow: "hidden",
            animation: "fade-in-up 0.9s 0.3s both",
          }}
        >
          <VerticalMarquee speed={24}>
            {MARQUEE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="mq-item"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  color: "#f0ead8",
                  padding: "1.2rem 0",
                  lineHeight: 1.15,
                  transformOrigin: "left center",
                  willChange: "opacity, transform",
                  transition: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </div>
            ))}
          </VerticalMarquee>

          {/* Top vignette */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "220px",
            background: "linear-gradient(to bottom, var(--dark) 20%, transparent)",
            pointerEvents: "none", zIndex: 2,
          }} />
          {/* Bottom vignette */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "220px",
            background: "linear-gradient(to top, var(--dark) 20%, transparent)",
            pointerEvents: "none", zIndex: 2,
          }} />
        </div>
      </div>

      {/* Footer strip */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "1.5rem 6rem",
        borderTop: "1px solid rgba(200,169,110,0.07)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "rgba(200,169,110,0.6)",
            animation: "blink 3s infinite",
          }} />
          <span style={{
            fontFamily: "var(--font-chakra), monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(200,169,110,0.35)",
          }}>
            Ravien Studio · 3D Experiences
          </span>
        </div>
        <span style={{
          fontFamily: "var(--font-chakra), monospace",
          fontSize: "0.44rem",
          letterSpacing: "0.2em",
          color: "rgba(200,169,110,0.22)",
        }}>
          © 2026
        </span>
      </div>
    </section>
  );
}
