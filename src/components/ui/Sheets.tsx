"use client";

import { PALETTE } from "../3d/HouseModel";
import { EMAIL, MAILTO } from "./Header";

const STEPS = [
  {
    title: "Your drawings",
    body: "Send the Revit, FBX or glTF export. We use the architect's own geometry, so the site stays true to the drawings.",
  },
  {
    title: "Materials and light",
    body: "Revit exports every surface in the same grey. We re-dress each element by its Revit category: glazing, render, timber, oak, steel.",
  },
  {
    title: "A live site",
    body: "Views, sections and apartments are built around your project and your brand, and it runs on any phone.",
  },
];

const SPECS: [string, string][] = [
  ["Source", "Revit export, FBX, 24 MB"],
  ["Delivered", "Draco-compressed glTF, 2.2 MB"],
  ["Geometry", "347 meshes, 589,419 vertices"],
  ["Sections", "Cut at 62% of each storey, from the Revit slabs"],
  ["Runs in", "One WebGL canvas, loaded once"],
];

export function Method() {
  return (
    <section id="process" data-section="process" className="bg-bg px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="display max-w-[18ch] text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02]">From drawings to a live site.</h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-ink pt-5">
              <h3 className="text-[22px] font-medium"><span className="tabular-nums text-muted">{i + 1}.</span> {s.title}</h3>
              <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-[22px] font-medium">This model, by the numbers</h3>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-4 py-3.5 text-[16px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-[22px] font-medium">Material palette</h3>
            <p className="mt-2 max-w-[48ch] text-[16px] leading-relaxed text-muted">
              Mapped from the Revit element names, e.g. <em className="not-italic text-ink">klaas</em> becomes glass and <em className="not-italic text-ink">välissein</em> the rendered façade.
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {PALETTE.map((p) => (
                <li key={p.id} className="flex items-center gap-3 text-[15px]">
                  <span className="h-7 w-7 shrink-0 rounded-full ring-1 ring-black/10" style={{ backgroundColor: p.color }} aria-hidden />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" data-section="contact" className="bg-ink px-5 pb-10 pt-24 text-white md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="display max-w-[14ch] text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1]">Send us your drawings.</h2>
        <p className="mt-6 max-w-[52ch] text-[18px] leading-relaxed text-white/70">
          Revit, FBX or glTF. You get back a site like this one, built around your project and your brand.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={MAILTO} className="btn bg-white text-ink hover:bg-white/90">Start a project</a>
          <a href={MAILTO} className="break-all text-[17px] text-white underline decoration-white/40 hover:decoration-white">{EMAIL}</a>
        </div>

        <footer className="mt-28 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-[14px] text-white/60">
          <span>
            © 2026 3D House Demo, 59°26′N 24°45′E
            <span className="ml-3">Built by <a href="https://ravien.eu" target="_blank" rel="noopener" className="text-white underline decoration-white/40 hover:decoration-white">Ravien</a></span>
          </span>
          <span className="flex gap-6">
            <a href="https://www.linkedin.com/company/raviensolutions/" target="_blank" rel="noopener noreferrer" className="text-white/80 no-underline hover:text-white">LinkedIn</a>
            <a href="https://www.instagram.com/ravien.eu/" target="_blank" rel="noopener noreferrer" className="text-white/80 no-underline hover:text-white">Instagram</a>
          </span>
        </footer>
      </div>
    </section>
  );
}
