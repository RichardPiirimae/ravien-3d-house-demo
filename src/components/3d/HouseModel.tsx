"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Colour palette for the building materials.
// Revit FBX exports rarely have realistic PBR materials, so we remap by name.
const PALETTE: Array<{
  match: string[];
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
}> = [
  {
    // Curtain wall glass panels — System_Panel_Klaas (Klaas = glass in Estonian)
    match: ["system_panel_klaas", "klaas", "glass", "glazing", "curtain_panel"],
    color: "#3d6b62",
    roughness: 0.05,
    metalness: 0.15,
    opacity: 0.38,
    transparent: true,
  },
  {
    // Curtain wall mullions — Rectangular_Mullion — near-black aluminium
    match: ["rectangular_mullion"],
    color: "#1c1c1a",
    roughness: 0.2,
    metalness: 0.9,
    opacity: 1,
    transparent: false,
  },
  {
    // Railings — Railing_Parapetto — near-black metal
    match: ["railing"],
    color: "#1a1a18",
    roughness: 0.25,
    metalness: 0.85,
    opacity: 1,
    transparent: false,
  },
  {
    // Roof — Basic_Roof_Lamekatus / Floor_katus — near-black membrane
    match: ["basic_roof", "lamekatus", "floor_katus"],
    color: "#1a1816",
    roughness: 0.92,
    metalness: 0,
    opacity: 1,
    transparent: false,
  },
  {
    // Timber columns & balcony posts — M_Wood_Timber_Column, Timber_8x8 — honey/blonde wood
    match: ["m_wood_timber_column", "timber_8x8", "timber"],
    color: "#c8a060",
    roughness: 0.6,
    metalness: 0,
    opacity: 1,
    transparent: false,
  },
  {
    // Interior walls & ceilings — Sisesein, Kipslagi (plasterboard ceiling) — off-white
    match: ["sisesein", "kipslagi", "compound_ceiling", "waaaaaalllll", "walllll"],
    color: "#e8e4dc",
    roughness: 0.85,
    metalness: 0,
    opacity: 1,
    transparent: false,
  },
  {
    // Exterior walls — Välissein (Poorbetoon / RB / krohv) — dark warm wood brown
    match: ["välissein", "poorbetoon"],
    color: "#6b4e35",
    roughness: 0.82,
    metalness: 0,
    opacity: 1,
    transparent: false,
  },
  {
    // Ground floor slab — Floor_Põrand — dark warm wood
    match: ["floor_põrand", "põrand_pinnasel", "põrand"],
    color: "#4a2e14",
    roughness: 0.55,
    metalness: 0,
    opacity: 1,
    transparent: false,
  },
  {
    // Structural floor/ceiling slabs, stairs — Floor_Vahelagi, Precast_Stair — concrete grey
    match: ["floor_vahelagi", "vahelagi", "precast_stair", "stair", "terasprofiil"],
    color: "#7a7874",
    roughness: 0.9,
    metalness: 0,
    opacity: 1,
    transparent: false,
  },
  {
    // Doors — dark charcoal (door frames match windows)
    match: ["door", "est_su", "extdbl", "concept_extsgl"],
    color: "#2a2826",
    roughness: 0.4,
    metalness: 0.3,
    opacity: 1,
    transparent: false,
  },
];

const DEFAULT_MATERIAL = {
  // Furniture, fixtures, appliances — warm neutral grey
  color: "#b0a090",
  roughness: 0.75,
  metalness: 0,
  opacity: 1,
  transparent: false,
};

function buildMaterial(
  original: THREE.Material,
  preset: typeof DEFAULT_MATERIAL
): THREE.MeshStandardMaterial {
  const isGlass = preset.transparent && preset.opacity < 0.85;
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(preset.color),
    roughness: preset.roughness,
    metalness: preset.metalness,
    opacity: preset.opacity,
    transparent: preset.transparent,
    // DoubleSide is essential — without it, walls are invisible when the
    // camera is inside the building (back-faces are culled).
    side: THREE.DoubleSide,
    // Glass: pick up environment reflections
    ...(isGlass ? { envMapIntensity: 1.2 } : {}),
  });
  mat.name = original.name;

  return mat;
}

// meshName is the Revit node/object name — much more reliable than material name
function pickPreset(meshName: string, matName: string, isTransparent: boolean) {
  if (isTransparent) return PALETTE[0]; // glass
  const lower = (meshName + " " + matName).toLowerCase();
  for (const entry of PALETTE) {
    if (entry.match.some((kw) => lower.includes(kw))) return entry;
  }
  return DEFAULT_MATERIAL;
}

interface Props {
  hideRoof: boolean;
  hideSecondFloor?: boolean;
  onLoaded: () => void;
}

export default function HouseModel({ hideRoof, hideSecondFloor = false, onLoaded }: Props) {
  const { scene: model } = useGLTF("/hoone.glb");
  const initialized = useRef(false);
  const roofMeshes = useRef<THREE.Mesh[]>([]);
  const secondFloorMeshes = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (initialized.current || !model) return;
    initialized.current = true;

    // ── 1. Fix orientation — Revit FBX is Z-up, Three.js is Y-up ──
    model.rotation.x = -Math.PI / 2;
    model.updateMatrixWorld(true);

    // ── 2. Centre & ground ──────────────────────────────────────────
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    model.position.set(-center.x, -box.min.y, -center.z);

    // Re-compute after repositioning for accurate roof threshold
    model.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(model);
    const size2 = new THREE.Vector3();
    box2.getSize(size2);

    // ── 3. Replace materials & enable shadows ──────────────────────
    // Log unique mesh names — Revit encodes category in the node name
    const meshNames = new Set<string>();
    model.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      meshNames.add(child.name || "(unnamed)");
    });
    console.log("Mesh names:", Array.from(meshNames).sort());

    const matCache = new Map<string, THREE.MeshStandardMaterial>();

    model.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (!mesh.material) return;

      const mats = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      const newMats = mats.map((original, matIdx) => {
        if (!original) return new THREE.MeshStandardMaterial({ color: "#d0cbbe", side: THREE.DoubleSide });
        // Key by mesh name + slot index so shared materials (GLB deduplication)
        // don't cause every mesh to receive the first mesh's colour.
        const key = `${mesh.name}__${matIdx}`;
        if (matCache.has(key)) return matCache.get(key)!;

        const isTransparent = !!(original.transparent && (original as THREE.MeshStandardMaterial).opacity < 0.85);
        const preset = pickPreset(mesh.name || "", original.name || "", isTransparent);
        const newMat = buildMaterial(original, preset);
        matCache.set(key, newMat);
        return newMat;
      });

      mesh.material = newMats.length === 1 ? newMats[0] : newMats;
    });

    // ── 4. Tag roof + second-floor meshes for toggling ────────────
    const topThreshold = box2.min.y + size2.y * 0.72;
    // Use the midpoint of each mesh to decide which floor it belongs to.
    // 0.58 sits above the centre of any ground-floor-only or full-span wall
    // (~25–45%) but below the centre of second-floor elements (~65–75%).
    const secondFloorThreshold = box2.min.y + size2.y * 0.58;

    model.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const name = mesh.name.toLowerCase();
      const meshBox = new THREE.Box3().setFromObject(mesh);
      const meshH = meshBox.max.y - meshBox.min.y;
      const meshCenterY = (meshBox.min.y + meshBox.max.y) / 2;
      const isAtTop = meshBox.min.y > topThreshold;
      const isThin = meshH < size2.y * 0.1;
      // Primary check: mesh centre above 58% → clearly second-floor element
      // Secondary check: mesh bottom above 46% AND short → second-floor
      // furniture/fixtures whose centre barely clears the floor boundary
      const floorBoundary = box2.min.y + size2.y * 0.46;
      const isAboveSecondFloor =
        meshCenterY > secondFloorThreshold ||
        (meshBox.min.y > floorBoundary && meshH < size2.y * 0.35);

      // Meshes hidden whenever second floor is hidden (tagged by exact Revit ID)
      const SECOND_FLOOR_IDS = [
        "Basic_Roof_Lamekatus_Kandev_terasprofiil_355(153+100+100)_822002",
        "Floor_Vahelagi_Rb_412(200+30+100+12)_849469",
        "Basic_Wall_Välissein_Poorbetoon_375_838156", // pillar intruding into Apt III
      ];
      const isInterFloorSlab =
        name.includes("vahelagi") ||
        SECOND_FLOOR_IDS.includes(mesh.name);

      if (
        name.includes("basic_roof") ||
        name.includes("lamekatus") ||
        name.includes("roof") ||
        name.includes("katus") ||
        (isAtTop && isThin)
      ) {
        roofMeshes.current.push(mesh);
      } else if (isAboveSecondFloor || isInterFloorSlab) {
        secondFloorMeshes.current.push(mesh);
      }
    });

    onLoaded();
  }, [model, onLoaded]);

  useEffect(() => {
    // Roof: hidden in any room mode, or when second floor is hidden
    roofMeshes.current.forEach((m) => (m.visible = !hideRoof && !hideSecondFloor));
    // Second floor: hidden only when viewing a ground floor apartment
    secondFloorMeshes.current.forEach((m) => (m.visible = !hideSecondFloor));
  }, [hideRoof, hideSecondFloor]);

  return <primitive object={model} />;
}

useGLTF.preload("/hoone.glb");
