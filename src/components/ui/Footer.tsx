"use client";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-chakra), monospace",
};

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer style={{
      background: "var(--dark)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Seamless blend from section above — gradient top */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "120px",
        background: "linear-gradient(to bottom, rgba(200,169,110,0.03), transparent)",
        pointerEvents: "none",
      }} />

      {/* Dot grid */}
      <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <defs>
          <pattern id="footer-dots" x={0} y={0} width={28} height={28} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={1} fill="rgba(200,169,110,0.055)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-dots)" />
      </svg>

      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "5rem 4rem 3.5rem",
        gap: "0",
      }}>

        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Ravien"
          style={{ height: "40px", marginBottom: "1.8rem", display: "block" }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        {/* Wordmark fallback — hidden once logo loads */}
        <div style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.6rem",
          fontWeight: 300,
          letterSpacing: "0.12em",
          color: "#f0ead8",
          marginBottom: "1.2rem",
          textAlign: "center",
        }}>
          Ravien
        </div>

        <p style={{
          ...MONO,
          fontSize: "0.54rem",
          letterSpacing: "0.08em",
          color: "rgba(240,234,216,0.25)",
          lineHeight: 1.9,
          textAlign: "center",
          maxWidth: "340px",
          marginBottom: "2.8rem",
        }}>
          Bespoke 3D web experiences for architecture,
          real estate, and design.
        </p>

        {/* Social icons */}
        <div style={{ display: "flex", gap: "1.8rem", marginBottom: "3.5rem" }}>
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/company/raviensolutions/", icon: <LinkedInIcon /> },
            { label: "Instagram", href: "https://www.instagram.com/ravien.eu/", icon: <InstagramIcon /> },
          ].map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40, height: 40,
                border: "1px solid rgba(200,169,110,0.15)",
                color: "rgba(200,169,110,0.45)",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(200,169,110,0.55)";
                el.style.color = "rgba(200,169,110,0.95)";
                el.style.background = "rgba(200,169,110,0.04)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(200,169,110,0.15)";
                el.style.color = "rgba(200,169,110,0.45)";
                el.style.background = "transparent";
              }}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          width: "100%",
          maxWidth: "500px",
          height: "1px",
          background: "rgba(200,169,110,0.07)",
          marginBottom: "1.8rem",
        }} />

        {/* Bottom copyright */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
        }}>
          <div style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "rgba(200,169,110,0.4)",
            animation: "blink 3s infinite",
          }} />
          <span style={{
            ...MONO,
            fontSize: "0.42rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(200,169,110,0.25)",
          }}>
            © 2026 Ravien. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
}
