"use client";
/* eslint-disable react-hooks/immutability -- three.js objects are mutated per frame by design */

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, N8AO, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import HouseModel, { type Display, type ModelInfo, type Section } from "./HouseModel";
import type { RoomDef } from "./rooms";

export type ViewId = "aerial" | "street" | "plan";
/** Lets the compass dial turn the camera around its target. */
export type OrbitApi = { setAzimuth: (rad: number) => void; rotateBy: (rad: number) => void };
export type Inset = { top: number; right: number; bottom: number; left: number };

/** A camera shot: look at `look`, from direction `dir`, far enough to fit a sphere of `radius`. */
interface Shot { look: THREE.Vector3; dir: THREE.Vector3; radius: number; fov: number; pad: number; mobilePad?: number }

// Plan shots tilt ~2° off vertical along +z so the drawing's top (−z) stays up on screen.
// One perspective camera tweened between shots; a narrow FOV from far away
// flattens the plan shot toward an orthographic drawing.
const BUILDING_SHOTS: Record<ViewId, { dir: [number, number, number]; fov: number; pad: number; mobilePad?: number }> = {
  aerial: { dir: [1, 0.75, 1.2], fov: 24, pad: 0.9 },
  // Street's long, low view needs more room on a portrait screen.
  street: { dir: [1.3, 0.16, 1.45], fov: 40, pad: 0.8, mobilePad: 1.15 },
  plan: { dir: [0, 1, 0.03], fov: 14, pad: 0.95 },
};

// Plan cut: 62% of the storey height, high enough to read the rooms, low enough to see in.
const cutFor = (info: ModelInfo, floor: "ground" | "second") => {
  const { ground, groundCeil, upper, upperCeil } = info.levels;
  return floor === "ground" ? ground + (groundCeil - ground) * 0.62 : upper + (upperCeil - upper) * 0.62;
};

// The apartment's footprint in model coordinates, from its region on the plan.
function roomBox(info: ModelInfo, r: RoomDef) {
  const { min, max } = info.box;
  const m = 1.2; // wide enough to keep party walls whole instead of slicing them
  return {
    x0: min.x + r.region.u0 * (max.x - min.x) - m,
    x1: min.x + r.region.u1 * (max.x - min.x) + m,
    z0: min.z + r.region.v0 * (max.z - min.z) - m,
    z1: min.z + r.region.v1 * (max.z - min.z) + m,
  };
}

function roomShot(info: ModelInfo, r: RoomDef, view: number): Shot {
  const b = roomBox(info, r);
  const floorY = r.floor === "ground" ? info.levels.ground : info.levels.upper;
  const h = cutFor(info, r.floor) - floorY;
  const cx = (b.x0 + b.x1) / 2;
  const cz = (b.z0 + b.z1) / 2;
  const radius = 0.5 * Math.hypot(b.x1 - b.x0, b.z1 - b.z0, h);
  const look = new THREE.Vector3(cx, floorY + h * 0.25, cz);
  // Look in from the building's outside end, three-quarter on.
  const out = new THREE.Vector2(Math.abs(cx) > 2 ? Math.sign(cx) : 0.75, Math.sign(cz) || 1).normalize();
  if (view === 1) return { look, dir: new THREE.Vector3(0, 1, 0.03), radius, fov: 18, pad: 1.05 };
  if (view === 2) return { look, dir: new THREE.Vector3(-out.x, 0.85, -out.y), radius, fov: 30, pad: 1.0 };
  return { look, dir: new THREE.Vector3(out.x, 1.25, out.y), radius, fov: 30, pad: 1.0 };
}

interface RigProps {
  shot: Shot | null;
  inset: Inset;
  isMobile: boolean;
  bearingRef?: React.RefObject<SVGGElement | null>;
  apiRef?: React.RefObject<OrbitApi | null>;
  /** Bounding sphere of the model, for tight near/far planes. */
  bounds: THREE.Sphere | null;
}

function Rig({ shot, inset, isMobile, bearingRef, apiRef, bounds }: RigProps) {
  const { camera, size: vp, gl } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const controls = useRef<OrbitControlsImpl>(null);
  const goal = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3(), fov: 38 });
  const off = useRef({ x: 0, y: 0 });
  const userHasControl = useRef(false);
  const first = useRef(true);

  // Fit the shot's sphere into the part of the canvas the UI leaves free.
  useEffect(() => {
    if (!shot) return;
    const g = goal.current;
    const availW = Math.max(1, vp.width - inset.left - inset.right);
    const availH = Math.max(1, vp.height - inset.top - inset.bottom);
    const t = Math.tan(THREE.MathUtils.degToRad(shot.fov / 2));
    const fitTan = Math.min(t * (availH / vp.height), t * (vp.width / vp.height) * (availW / vp.width));
    // Portrait screens frame by width, where the conservative sphere fit runs tight.
    const dist = (shot.radius / Math.sin(Math.atan(fitTan))) * (isMobile ? shot.mobilePad ?? shot.pad * 1.08 : shot.pad);
    g.look.copy(shot.look);
    g.pos.copy(shot.dir).normalize().multiplyScalar(dist).add(shot.look);
    g.fov = shot.fov;
    userHasControl.current = false;

    if (first.current) {
      first.current = false;
      cam.position.copy(g.pos).multiplyScalar(1.35);
      cam.fov = g.fov;
    }
  }, [shot, inset, vp.width, vp.height, isMobile, cam]);

  useFrame((_, rawDt) => {
    const c = controls.current;
    if (!c || !shot) return;
    const dt = Math.min(rawDt, 0.1);
    const k = 1 - Math.exp(-dt * 3.2);
    const g = goal.current;

    if (!userHasControl.current) {
      cam.position.lerp(g.pos, k);
      c.target.lerp(g.look, k);
    }
    cam.fov += (g.fov - cam.fov) * k;
    // Shift the projection so the subject centres in the space the UI leaves free.
    const tx = -(inset.left - inset.right) / 2;
    const ty = (inset.bottom - inset.top) / 2;
    off.current.x += (tx - off.current.x) * k;
    off.current.y += (ty - off.current.y) * k;
    cam.setViewOffset(vp.width, vp.height, off.current.x, off.current.y, vp.width, vp.height);
    // Hug the model with the depth range: a 0.5 ft near plane at 400 ft away
    // leaves no depth precision, and coplanar Revit faces z-fight (flicker).
    if (bounds) {
      const d = cam.position.distanceTo(bounds.center);
      cam.near = Math.max(0.5, d - bounds.radius * 1.6);
      cam.far = d + bounds.radius * 2.5;
    }
    cam.updateProjectionMatrix();

    // Let the page scroll vertically over the canvas; horizontal drags orbit.
    if (gl.domElement.style.touchAction !== "pan-y") gl.domElement.style.touchAction = "pan-y";

    const b = bearingRef?.current;
    if (b) {
      const az = Math.atan2(cam.position.x - c.target.x, cam.position.z - c.target.z);
      b.setAttribute("transform", `rotate(${(-az * 180) / Math.PI} 32 32)`);
    }
  });

  const onStart = useCallback(() => { userHasControl.current = true; }, []);

  useEffect(() => {
    if (!apiRef) return;
    const turn = (f: (theta: number) => number) => {
      const c = controls.current;
      if (!c) return;
      userHasControl.current = true;
      const offset = cam.position.clone().sub(c.target);
      const sph = new THREE.Spherical().setFromVector3(offset);
      sph.theta = f(sph.theta);
      cam.position.copy(c.target).add(offset.setFromSpherical(sph));
      c.update();
    };
    apiRef.current = { setAzimuth: (rad) => turn(() => rad), rotateBy: (rad) => turn((t) => t + rad) };
  }, [apiRef, cam]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      enableZoom={false}
      rotateSpeed={0.6}
      maxPolarAngle={Math.PI * 0.495}
      onStart={onStart}
    />
  );
}

interface Props {
  display: Display;
  view: ViewId;
  explode: number;
  room: RoomDef | null;
  roomView: number;
  cutaway: boolean;
  inset: Inset;
  isMobile: boolean;
  frameloop: "always" | "never";
  onLoaded: () => void;
  bearingRef?: React.RefObject<SVGGElement | null>;
  apiRef?: React.RefObject<OrbitApi | null>;
}

// Linear, above 1 on purpose: neutral tone mapping compresses near-white, and this
// is the input measured (Playwright pixel sample) to come out as the page's #f5f5f3.
const BACKDROP: [number, number, number] = [1.2, 1.2, 1.18];

export default function SceneCore({ display, view, explode, room, roomView, cutaway, inset, isMobile, frameloop, onLoaded, bearingRef, apiRef }: Props) {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const handleLoaded = useCallback((i: ModelInfo) => {
    setInfo(i);
    onLoaded();
  }, [onLoaded]);

  const section: Section = useMemo(() => {
    if (!info || explode > 0.01) return { cutY: null, box: null };
    if (room) return { cutY: cutFor(info, room.floor), box: roomBox(info, room) };
    if (cutaway || view === "plan") return { cutY: cutFor(info, "second"), box: null };
    return { cutY: null, box: null };
  }, [info, room, cutaway, view, explode]);

  const shot: Shot | null = useMemo(() => {
    if (!info) return null;
    if (room) return roomShot(info, room, roomView);
    const s = BUILDING_SHOTS[view];
    const look = new THREE.Vector3(0, view === "plan" ? 0 : info.size.y * 0.38, 0);
    return { look, dir: new THREE.Vector3(...s.dir), radius: info.size.length() / 2, fov: s.fov, pad: s.pad, mobilePad: s.mobilePad };
  }, [info, room, roomView, view]);

  const span = info ? Math.max(info.size.x, info.size.z) : 40;
  const bounds = useMemo(() => (info ? info.box.getBoundingSphere(new THREE.Sphere()) : null), [info]);

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, isMobile ? 1.5 : 1.75]}
      frameloop={frameloop}
      camera={{ fov: 38, near: 0.5, far: 2000, position: [200, 160, 240] }}
      gl={{ antialias: false, powerPreference: "high-performance", localClippingEnabled: true }}
      aria-label="Interactive 3D model of a five-apartment house"
    >
      <color attach="background" args={BACKDROP} />

      <hemisphereLight args={["#f3f6f9", "#d9d4ca", 1.0]} />
      <directionalLight
        color="#fff3e2"
        intensity={2.6}
        position={[span * 0.9, span * 1.2, span * 0.5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.08}
        shadow-camera-left={-span}
        shadow-camera-right={span}
        shadow-camera-top={span}
        shadow-camera-bottom={-span}
        shadow-camera-far={span * 5}
      />

      <mesh rotation-x={-Math.PI / 2} position-y={-0.02} receiveShadow>
        <planeGeometry args={[span * 12, span * 12]} />
        <shadowMaterial transparent opacity={0.2} color="#151617" />
      </mesh>

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={display === "render" ? 0.55 : 0.3} />
        <HouseModel display={display} explode={explode} section={section} onLoaded={handleLoaded} />
      </Suspense>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <N8AO aoRadius={5} distanceFalloff={1.2} intensity={2.2} halfRes={isMobile} color="#1a1b1d" />
        <SMAA />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>

      <Rig shot={shot} inset={inset} isMobile={isMobile} bearingRef={bearingRef} apiRef={apiRef} bounds={bounds} />
    </Canvas>
  );
}
