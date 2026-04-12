"use client";

import dynamic from "next/dynamic";

// ssr: false is only valid inside a Client Component (Next.js 16 breaking change)
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export default function ClientExperience() {
  return <Experience />;
}
