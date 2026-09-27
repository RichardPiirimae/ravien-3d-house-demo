---
name: Ravien
description: Your building, live on the web. A calm construction-company site where a realistically rendered model does the talking.
colors:
  accent: "#1f4d3a"
  accent-hover: "#173c2c"
  accent-tint: "#eaf0ec"
  bg: "#f5f5f3"
  surface: "#ffffff"
  ink: "#151617"
  muted: "#5b5f64"
  line: "#e2e2de"
  line-strong: "#c9cac5"
  poche: "#222326"
  ghost-line: "#8a8d91"
  ground: "#e7e7e2"
  mat-glazing: "#a9bfc2"
  mat-metal: "#2b2d2f"
  mat-roof: "#9a9c9e"
  mat-timber: "#b88a5a"
  mat-plaster: "#f1efea"
  mat-facade: "#e7e3da"
  mat-oak: "#b99670"
  mat-concrete: "#b3b1ac"
  mat-door: "#d6cfc4"
  mat-fitout: "#dcd6cd"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 5.2vw, 4.8rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 4.6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "'tnum' 1"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  pill: "999px"
  focus: "4px"
spacing:
  bar-gap: "4px"
  control-gap: "12px"
  gutter-mobile: "20px"
  gutter-desktop: "40px"
  section-mobile: "96px"
  section-desktop: "128px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  button-inverse:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "48px"
  toolbar-segment:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  toolbar-segment-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
  list-row-selected:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent}"
  header:
    backgroundColor: "{colors.bg}"
    height: "64px"
---

# Design System: Ravien

## Overview

**Creative North Star: "The Finished Building"**

The site presents like a serious construction or development company: the building is finished, photographed in good daylight, and handed over. A realistic render of the model is the default state and leads the first viewport; everything else steps back so it can be seen. The page is warm off-white with near-black type, one quiet forest green for commitment, and a great deal of air. Lines are rare and hairline; controls are few, grouped, and pill-shaped.

The model is lit as architecture, not as a product shot: a warm sun with soft shadows, a hemisphere sky, ambient occlusion in the corners, and neutral tone mapping so materials read at their true colour. The horizon and ground are tuned to the page background, so the canvas has no edge: the building sits on the page itself. Drawing conventions survive only where they carry information: solid charcoal poché where a section cut opens a wall, and faint grey ghost lines for the parts of the building lifted away.

The previous "construction drawing set" world (blue diazo ink, vellum, grid bubbles, title blocks, condensed caps) is retired and must not return.

**Key Characteristics:**
- Realistic render by default; White and Lines are alternative finishes, not the identity.
- Warm off-white page (#f5f5f3) continuous with the 3D horizon.
- One accent, forest green, reserved for commitment and selection.
- Wide-axis Archivo display, sentence case, tight tracking; plain Archivo for everything else.
- Pills for every control; hairlines for structure; almost no boxes.

## Colors

A warm-neutral page, near-black ink, and a single deep green; the colour richness lives in the model's materials, not the interface.

### Primary
- **Forest Green** (accent): the primary button, the loading bar, the selected apartment's name and key-plan marker, the compass view cone, focus rings and text selection. Hover deepens to **Deep Forest** (accent-hover). A pale **Green Wash** (accent-tint) fills the selected row in a list.

### Neutral
- **Warm Paper** (bg): the page, the header, side panels, the loading screen, and the 3D horizon and fog. Also the browser theme colour.
- **White** (surface): ghost buttons, floating toolbars, the compass dial, row hover.
- **Near Black** (ink): all headings and primary text, the active toolbar segment, and the contact section's full-bleed ground.
- **Slate Grey** (muted): body copy, secondary nav, captions, inactive toolbar labels.
- **Hairline** (line): 1px dividers, header rule, slider track, list borders.
- **Stone** (line-strong): ghost button hover border, slider thumb border, compass minor ticks.
- **Ground Plane** (ground): the circular ground the building stands on, a step below the page so shadows land softly.

### Model materials
The render palette is realistic and mapped from Revit element names: **Glazing** (mat-glazing, 38% opacity), **Dark Aluminium** (mat-metal, mullions and railings), **Roof Membrane** (mat-roof), **Timber** (mat-timber), **Plaster** (mat-plaster), **Rendered Façade** (mat-facade), **Oak** (mat-oak), **Concrete** (mat-concrete), **Doors** (mat-door), **Fit-out** (mat-fitout). The same list appears on the page as round swatches. **Poché Charcoal** (poche) fills every solid element opened by a section cut; **Ghost Grey** (ghost-line) draws lifted-away geometry at 22% opacity.

### Named Rules
**The One Green Rule.** Forest green marks commitment (Start a project) and the current selection. It never decorates, never fills a section, never appears twice as a competing call to action on one screen region.

**The No Edge Rule.** The 3D horizon, fog and page background are the same Warm Paper. The canvas never gets a frame, border or contrasting backdrop.

**The Materials Carry Colour Rule.** Interface colour stays neutral so the timber, oak and glazing of the render are the only warm, saturated things on screen.

## Typography

**Display Font:** Archivo, variable width axis at 112% (with system-ui, sans-serif)
**Body Font:** Archivo at normal width

**Character:** One family, two widths. The widened, semibold display reads as confident and engineered, like signage on a hoarding; the normal-width body stays plain and quiet. Tabular figures are on globally so areas and specs align.

### Hierarchy
- **Display** (600, clamp(2.1rem, 5.2vw, 4.8rem), 0.98, wdth 112): the hero line only, max about 11ch.
- **Headline** (600, clamp(2.2rem, 4.6vw, 4rem); panel and contact variants range 2rem to 4.8rem, 1–1.02, wdth 112): one per section ("Walk into any apartment.", "From drawings to a live site.", "Send us your drawings."), sentence case ending with a full stop, 14–18ch.
- **Title** (500, 22px): sub-heads inside a section (step titles, "Material palette"). Apartment names use 17px/500.
- **Body** (400, 16–18px, relaxed ~1.625): muted grey, 40–52ch measure.
- **Label** (500, 14–15px): buttons, nav (15px), toolbar segments (14px), captions (12–13px muted).

### Named Rules
**The Two Widths Rule.** Only headings use the widened display cut. Everything else is normal-width Archivo. No second family, no uppercase tracking labels.

**The Sentence Case Rule.** Headings, buttons, nav and toolbar labels are sentence case. Nothing is set in all caps.

## Layout

A fixed 64px header over a single sticky stage: the model occupies the full viewport below the header while the intro and then the apartment panel scroll over it. On desktop the hero copy owns the left ~40% and the model is framed into the remaining width via a camera inset; in the apartments section a 520px panel docks left with a hairline right border. On phones (below 900px) the model takes the top half and content takes the bottom half; the view and finish controls merge into one compact pill.

Content sections (Process, Contact) use a 1240px container (header 1440px) with 20px / 40px gutters and generous vertical padding (96px mobile, 128px desktop). Step lists are three equal columns; specs and palette split 1:1. Controls sit at the bottom of the stage (28px from the edge), the compass at bottom right on desktop and top right on phones.

**The Air Rule.** When in doubt, add space rather than a line or a box. Sections are separated by padding and a colour change, not rules.

## Elevation & Depth

The interface is flat. Depth belongs to the 3D scene: directional sun shadows (PCF, warm #fff3e2 key light), hemisphere fill, N8AO ambient occlusion tinted near-black, and a light city environment map. Only elements floating over the live model are lifted, with one soft two-layer shadow.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 1px 2px rgba(21,22,23,0.06), 0 8px 24px -8px rgba(21,22,23,0.18)`): toolbars and the compass dial over the canvas. When a toolbar sits on a flat panel instead, the shadow is replaced by a 1px Hairline ring.
- **Pin** (`box-shadow: 0 1px 3px rgba(0,0,0,0.2)`): apartment markers on the key plan and the slider thumb.

### Named Rules
**The Only Over The Model Rule.** A shadow means "this floats above the live building." Page content never casts one.

## Shapes

Two shapes only: full pills (999px) for every interactive control, and square-cornered everything else (sections, panels, list rows, the key plan). Circles for swatches, map pins and the compass. Structure comes from 1px hairlines: the header rule, list dividers, the panel edge, and one full-ink 1px rule above each process step.

## Components

### Buttons
Calm and solid; a slight 1px press on active.
- **Shape:** full pill (999px), 48px tall, 22px side padding, 15px/500 label. Header variant is 40px tall, 14px.
- **Primary:** Forest Green with white text. Hover to Deep Forest (180ms).
- **Ghost:** white with ink text and a 1px Hairline border; hover strengthens the border to Stone.
- **Inverse:** on the Near Black contact section, white with ink text; hover to 90% white.
- **Focus:** 2px Forest Green outline, 3px offset.

### Toolbar (segmented pills)
The model's controls. A white 92% pill with 4px padding holding 36px pill segments (14px/500, muted). Active segment inverts to Near Black with white text (aria-pressed). Groups: View (Aerial / Street / Plan), Finish (Render / White / Lines), Explode (label plus a hairline range slider with a white round thumb). A 1px Hairline separator splits groups when merged on phones.

### Lists / Schedules
Rows between hairlines, no card. Apartment rows: 17px/500 name over a 14px muted meta line, area right-aligned in tabular figures; hover to white, selected to Green Wash with green name. Spec lists use a 140px muted term column.

### Navigation
Wordmark "Ravien" in display width at 22px, section links at 15px muted, current link ink. Desktop only; on phones the header keeps the wordmark and a compact "Contact" primary button.

### Compass
A white circular dial (84px, 60px on phones) with 36 tick marks (major every 90° in Slate, minor in Stone), the building's footprint in near-white with an ink outline at the centre, and a translucent Forest Green view cone with a green dot for the camera. Draggable and arrow-key operable; "Drag to turn" caption below on desktop.

### Section cut and isolation
Choosing an apartment cuts the model at 62% of the storey height and clips a box around that unit. Cut solids show Poché Charcoal; the rest of the building fades to Ghost Grey lines. Plan view uses the same cut for the whole upper floor.

### Loading screen
Warm Paper field, display wordmark at 28px, a 3px Hairline track with a Forest Green fill, "Loading the model" and a tabular percentage in muted 14px.

## Do's and Don'ts

### Do:
- **Do** open on the Render finish from the Aerial shot; the realistic building is the first impression.
- **Do** keep the 3D horizon, fog and page background identical (#f5f5f3) so the canvas has no edge.
- **Do** use Forest Green only for the primary action, selection and focus.
- **Do** make every control a pill and every surface square; float only what sits over the model.
- **Do** keep copy sentence case, headings ending in a full stop, body in muted grey at 40–52ch.
- **Do** show section cuts with solid charcoal poché and lifted parts as faint grey ghost lines.

### Don't:
- **Don't** bring back the drawing-set world: no blue ink, vellum, grid bubbles, title blocks, sheet numbers or condensed uppercase labels.
- **Don't** add a second accent colour to the interface; saturated colour belongs to the materials.
- **Don't** frame the canvas with borders, grids or cards.
- **Don't** add small uppercase labels above headings.
- **Don't** add shadows to page content, panels or list rows.
