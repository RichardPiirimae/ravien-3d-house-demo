# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Architecture studios, real-estate developers, interior designers and property marketers evaluating whether to commission a bespoke interactive 3D website for a project.

## Product Purpose
Showcase site for Ravien, a studio that builds custom real-time 3D web experiences from architectural source files. A real building model (a 5-apartment, 2-floor house, `public/hoone.glb`) is the live proof. Success = a qualified visitor explores the model and sends an inquiry.

## Positioning
The page is the product demo: the visitor is not shown screenshots of 3D work, they operate it — orbit the building, drop into apartments — in the browser, from actual Revit/FBX geometry, with custom code rather than templates or plugins.

## Capabilities and Constraints
- Next.js 16 + React Three Fiber, single persistent WebGL canvas, Draco GLB (~2.2 MB).
- Model supports hiding roof / second floor to look into apartments; per-apartment camera views exist in `src/components/3d/rooms.ts`.
- Must run on phones (touch orbit vs. page scroll conflict is a known concern).
- Floor-plan JPGs, apartment copy and marketing copy are not binding; may be reworked without adding new factual claims.

## Brand Commitments
- Name: Ravien (Ravien Studio).
- Contact: ravienaisolutions@gmail.com; LinkedIn https://www.linkedin.com/company/raviensolutions/; Instagram https://www.instagram.com/ravien.eu/.

## Evidence on Hand
- The model itself, floor plans (`public/floorplan-*.jpg`).
- Model facts measured from `public/hoone.glb`: 347 meshes, 589,419 vertices; slab levels in feet (ground 1.23, mid slab 9.65–11.07, roof 20.35). 24 MB FBX → 2.2 MB Draco GLB per commit 6a02dfa.
- Location 59°26′N 24°45′E and "5 apartments · 2 floors · 12 × 24 m" come from the original site copy (commit 830948e).
- No testimonials, client list, pricing or case studies exist — do not fabricate them.

## Product Principles
1. The model is the pitch: it leads the first viewport and stays interactive.
2. Show, don't claim: every capability statement should be demonstrable on the page.
3. Fast on every device; the demo must never feel heavy.
