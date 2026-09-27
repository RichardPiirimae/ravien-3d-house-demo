"use client";
/* eslint-disable react-hooks/immutability -- three.js objects are mutated per frame by design */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type Display = "render" | "white" | "lines";

// Revit exports carry one grey material, so surfaces are re-dressed by the Revit
// element name. `color` is the realistic finish; `card` the white-model tone.
export const PALETTE = [
  { id: "glass", label: "Glazing", match: ["system_panel_klaas", "klaas", "glass", "glazing", "curtain_panel"], color: "#a9bfc2", card: "#c9d3d8", roughness: 0.04, metalness: 0.2, glass: true },
  { id: "mullion", label: "Aluminium frames", match: ["rectangular_mullion"], color: "#2b2d2f", card: "#a7a9ab", roughness: 0.4, metalness: 0.6 },
  { id: "railing", label: "Steel railings", match: ["railing"], color: "#2b2d2f", card: "#a7a9ab", roughness: 0.45, metalness: 0.6 },
  { id: "roof", label: "Roof membrane", match: ["basic_roof", "lamekatus", "floor_katus"], color: "#9a9c9e", card: "#dadad6", roughness: 0.9, metalness: 0 },
  { id: "timber", label: "Timber columns", match: ["m_wood_timber_column", "timber_8x8", "timber"], color: "#b88a5a", card: "#ecebe6", roughness: 0.65, metalness: 0 },
  { id: "plaster", label: "Plaster walls", match: ["sisesein", "kipslagi", "compound_ceiling", "waaaaaalllll", "walllll"], color: "#f1efea", card: "#f7f7f5", roughness: 0.9, metalness: 0 },
  { id: "facade", label: "Rendered façade", match: ["välissein", "poorbetoon"], color: "#e7e3da", card: "#f4f4f2", roughness: 0.92, metalness: 0 },
  { id: "floor", label: "Oak floors", match: ["floor_põrand", "põrand_pinnasel", "põrand", "floor_vahelagi", "vahelagi"], color: "#b99670", card: "#e8e8e4", roughness: 0.6, metalness: 0 },
  { id: "concrete", label: "Concrete slabs, stairs", match: ["precast_stair", "stair", "terasprofiil"], color: "#b3b1ac", card: "#e3e3df", roughness: 0.9, metalness: 0 },
  { id: "door", label: "Doors", match: ["door", "est_su", "extdbl", "concept_extsgl"], color: "#d6cfc4", card: "#dcdcd8", roughness: 0.55, metalness: 0 },
  { id: "fitout", label: "Furniture, fit-out", match: [], color: "#dcd6cd", card: "#efefec", roughness: 0.8, metalness: 0 },
] as const;
type Preset = (typeof PALETTE)[number];

// Solid categories get poché: where the section cut opens them, their inside shows as solid ink.
const POCHE = new Set(["roof", "timber", "plaster", "facade", "floor", "concrete"]);

function pickPreset(name: string): Preset {
  const lower = name.toLowerCase();
  return PALETTE.find((p) => p.match.some((kw) => lower.includes(kw))) ?? PALETTE[PALETTE.length - 1];
}

// Clip planes shared by every material (a plane keeps n·p + c ≥ 0):
// the plot reveal rises through the surfaces on load; the section cut takes
// everything above a floor's cut height; the box isolates one apartment.
export const revealPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
const cutPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4);
const boxPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 1e4),
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1e4),
  new THREE.Plane(new THREE.Vector3(0, 0, 1), 1e4),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 1e4),
];
const SURFACE_CLIP = [revealPlane, cutPlane, ...boxPlanes];
const EDGE_CLIP = [cutPlane, ...boxPlanes];

const INK = "#26282b";
const PAPER = "#ffffff";

// Back faces of solids are only ever seen through a cut: fill them solid, as section drawings do.
function withPoche<T extends THREE.Material>(m: T): T {
  m.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      "#include <dithering_fragment>\n  if (!gl_FrontFacing) gl_FragColor = vec4(0.13, 0.135, 0.145, 1.0);"
    );
  };
  m.customProgramCacheKey = () => "poche";
  return m;
}

/** Floor levels read off the model's own slabs, in model units (feet). */
export interface Levels { ground: number; groundCeil: number; upper: number; upperCeil: number }
export interface ModelInfo { size: THREE.Vector3; box: THREE.Box3; levels: Levels }
export interface Section { cutY: number | null; box: { x0: number; x1: number; z0: number; z1: number } | null }

interface Built extends ModelInfo {
  root: THREE.Group;
  upper: THREE.Group;
  roof: THREE.Group;
  surfaces: { mesh: THREE.Mesh; mats: Record<Display, THREE.Material> }[];
  edgeMat: THREE.LineBasicMaterial;
  fitEdgeMat: THREE.LineBasicMaterial;
  edges: THREE.LineSegments[];
}

// useGLTF caches the scene, and StrictMode runs memos twice — build once per scene.
const builtCache = new WeakMap<THREE.Object3D, Built>();

function build(model: THREE.Object3D): Built {
  const cached = builtCache.get(model);
  if (cached) return cached;

  // Revit is Z-up; centre on the origin and stand it on y = 0.
  model.rotation.x = -Math.PI / 2;
  model.updateMatrixWorld(true);
  const box0 = new THREE.Box3().setFromObject(model);
  const center = box0.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box0.min.y, -center.z);
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());

  const meshes: THREE.Mesh[] = [];
  model.traverse((c) => { if ((c as THREE.Mesh).isMesh) meshes.push(c as THREE.Mesh); });
  const boxes = new Map(meshes.map((m) => [m, new THREE.Box3().setFromObject(m)]));

  const slab = (kw: string) => meshes.find((m) => m.name.toLowerCase().includes(kw));
  const H = size.y;
  const ground = slab("floor_põrand");
  const mid = slab("floor_vahelagi");
  const roofSlab = slab("basic_roof");
  const levels: Levels = {
    ground: ground ? boxes.get(ground)!.max.y : 0,
    groundCeil: mid ? boxes.get(mid)!.min.y : H * 0.43,
    upper: mid ? boxes.get(mid)!.max.y : H * 0.49,
    upperCeil: roofSlab ? boxes.get(roofSlab)!.min.y : H * 0.9,
  };

  const root = new THREE.Group();
  const lower = new THREE.Group();
  const upper = new THREE.Group();
  const roof = new THREE.Group();
  root.add(lower, upper, roof);

  const edgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.5, clippingPlanes: EDGE_CLIP });
  const fitEdgeMat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.2, clippingPlanes: EDGE_CLIP });

  const common = { side: THREE.DoubleSide, clippingPlanes: SURFACE_CLIP, clipShadows: true, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
  const lineSolid = new THREE.MeshBasicMaterial({ ...common, color: PAPER });
  const lineSolidPoche = withPoche(new THREE.MeshBasicMaterial({ ...common, color: PAPER }));
  const lineGlass = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });

  const shared = new Map<string, Record<Display, THREE.Material>>();
  const matsFor = (p: Preset, poche: boolean) => {
    const key = `${p.id}${poche ? "+p" : ""}`;
    let m = shared.get(key);
    if (m) return m;
    const glass = "glass" in p && p.glass;
    const wrap = <T extends THREE.Material>(x: T) => (poche ? withPoche(x) : x);
    m = {
      render: wrap(new THREE.MeshStandardMaterial({
        ...common, color: p.color, roughness: p.roughness, metalness: p.metalness,
        ...(glass ? { transparent: true, opacity: 0.38, envMapIntensity: 1.6, depthWrite: false } : {}),
      })),
      white: wrap(new THREE.MeshStandardMaterial({
        ...common, color: p.card, roughness: 0.9, metalness: 0, envMapIntensity: 0.4,
        ...(glass ? { transparent: true, opacity: 0.35, depthWrite: false } : {}),
      })),
      lines: glass ? lineGlass : poche ? lineSolidPoche : lineSolid,
    };
    shared.set(key, m);
    return m;
  };

  const edgeGeoCache = new Map<string, THREE.EdgesGeometry>();
  const surfaces: Built["surfaces"] = [];
  const edges: THREE.LineSegments[] = [];

  for (const mesh of meshes) {
    // Explode layers by the slab levels: anything starting at or above a slab rides with it.
    const mb = boxes.get(mesh)!;
    const layer = mb.min.y >= levels.upperCeil - 0.3 ? roof : mb.min.y >= levels.groundCeil - 0.3 ? upper : lower;
    layer.attach(mesh);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const preset = pickPreset(mesh.name);
    const poche = POCHE.has(preset.id) || mesh.name.toLowerCase().includes("basic_wall");
    const mats = matsFor(preset, poche);
    mesh.material = mats.render;
    surfaces.push({ mesh, mats });

    let eg = edgeGeoCache.get(mesh.geometry.uuid);
    if (!eg) {
      eg = new THREE.EdgesGeometry(mesh.geometry, 35);
      edgeGeoCache.set(mesh.geometry.uuid, eg);
    }
    const fit = preset.id === "fitout";
    const line = new THREE.LineSegments(eg, fit ? fitEdgeMat : edgeMat);
    line.raycast = () => {};
    mesh.add(line);
    edges.push(line);
  }

  const built: Built = { root, upper, roof, size, box, levels, surfaces, edgeMat, fitEdgeMat, edges };
  builtCache.set(model, built);
  return built;
}

interface Props {
  display: Display;
  explode: number;
  section: Section;
  onLoaded: (info: ModelInfo) => void;
}

export default function HouseModel({ display, explode, section, onLoaded }: Props) {
  const { scene } = useGLTF("/hoone.glb");
  const gl = useThree((s) => s.gl);
  const built = useMemo(() => build(scene), [scene]);
  const ex = useRef(0);
  const reveal = useRef(-1);
  // Animated section state: cut height and isolation box (x0, x1, z0, z1).
  const cur = useRef<number[] | null>(null);

  useEffect(() => {
    onLoaded({ size: built.size, box: built.box, levels: built.levels });
  }, [built, onLoaded]);

  useEffect(() => {
    for (const s of built.surfaces) s.mesh.material = s.mats[display];
    const showEdges = display !== "render";
    for (const e of built.edges) e.visible = showEdges;
    built.edgeMat.opacity = display === "lines" ? 0.85 : 0.22;
    built.fitEdgeMat.opacity = display === "lines" ? 0.4 : 0.1;
  }, [built, display]);

  // The sun never moves, so the shadow map only re-renders when geometry does.
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
  }, [gl, built]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const k = 1 - Math.exp(-dt * 4);
    const { box, levels } = built;
    let moving = false;

    if (Math.abs(explode - ex.current) > 1e-4) moving = true;
    ex.current += (explode - ex.current) * k;
    built.upper.position.y = ex.current * (levels.upperCeil - levels.ground) * 0.9;
    built.roof.position.y = ex.current * (levels.upperCeil - levels.ground) * 2;

    const pad = 30;
    const b = section.box;
    const goal = [
      section.cutY ?? box.max.y + pad,
      b ? b.x0 : box.min.x - pad, b ? b.x1 : box.max.x + pad,
      b ? b.z0 : box.min.z - pad, b ? b.z1 : box.max.z + pad,
    ];
    if (!cur.current) cur.current = [...goal];
    const c = cur.current;
    for (let i = 0; i < 5; i++) {
      const d = goal[i] - c[i];
      if (Math.abs(d) > 1e-3) { c[i] += d * k; moving = true; } else c[i] = goal[i];
    }
    cutPlane.constant = c[0];
    boxPlanes[0].constant = -c[1];
    boxPlanes[1].constant = c[2];
    boxPlanes[2].constant = -c[3];
    boxPlanes[3].constant = c[4];

    if (moving) gl.shadowMap.needsUpdate = true;

    // Plot reveal: ~1.8 s bottom to top after the first frame.
    const top = box.max.y * 3 + 1;
    if (reveal.current < top) {
      reveal.current = Math.min(top, reveal.current + dt * box.max.y * 1.4);
      revealPlane.constant = reveal.current;
    }
  });

  return <primitive object={built.root} />;
}

useGLTF.preload("/hoone.glb");
