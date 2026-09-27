"use client";

export const EMAIL = "ravienaisolutions@gmail.com";
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("New project — drawings attached")}`;

export const NAV = [
  { id: "model", label: "Model" },
  { id: "apartments", label: "Apartments" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
] as const;
export type SectionId = (typeof NAV)[number]["id"];

export default function Header({ active }: { active: SectionId }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-5 md:px-10">
        <a href="#model" className="display text-[22px] tracking-[-0.02em] text-ink no-underline">
          Ravien
        </a>
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex gap-7">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={n.id === active ? "true" : undefined}
                  className={`text-[15px] no-underline transition-colors ${n.id === active ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={MAILTO} className="btn btn-primary ml-auto !h-10 !px-5 !text-[14px]">
Start a project
        </a>
      </div>
    </header>
  );
}
