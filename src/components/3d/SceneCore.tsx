"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import HouseModel from "./HouseModel";
import type { RoomDef } from "./rooms";

// Resets camera to exterior position when returning from room mode
const ORBIT_TARGET = new THREE.Vector3(0, 5, 0);

function ExteriorCamera({ active, touchDeltaRef }: { active: boolean; touchDeltaRef?: React.RefObject<number> }) {
  const { camera } = useThree();
  const wasActive = useRef(false);
  const orbitRef = useRef<any>(null);

  useEffect(() => {
    if (active && !wasActive.current) {
      camera.position.set(65, 28, 85);
      if (orbitRef.current) {
        orbitRef.current.target.copy(ORBIT_TARGET);
        orbitRef.current.update();
      }
    }
    wasActive.current = active;
  }, [active, camera]);

  useFrame(() => {
    if (!touchDeltaRef || touchDeltaRef.current === 0) return;
    const dx = touchDeltaRef.current;
    touchDeltaRef.current = 0;
    const offset = camera.position.clone().sub(ORBIT_TARGET);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= dx * 0.007;
    offset.setFromSpherical(spherical);
    camera.position.copy(ORBIT_TARGET).add(offset);
    camera.lookAt(ORBIT_TARGET);
    orbitRef.current?.update();
  });

  if (!active) return null;

  return (
    <OrbitControls
      ref={orbitRef}
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.4}
      target={[0, 5, 0]}
    />
  );
}

// ── Room explorer — free orbit + position reporting ────────────
function RoomExplorer({
  room,
  viewIndex,
  onPosUpdate,
}: {
  room: RoomDef;
  viewIndex: number;
  onPosUpdate?: (pos: THREE.Vector3, target: THREE.Vector3) => void;
}) {
  const { camera } = useThree();
  const orbitRef = useRef<any>(null);
  const initialized = useRef(false);
  const view = room.views[viewIndex] ?? room.views[0];

  useEffect(() => {
    initialized.current = false;
  }, [room, viewIndex]);

  useFrame(() => {
    if (!initialized.current) {
      camera.position.set(...view.camPos);
      if (orbitRef.current) {
        orbitRef.current.target.set(...view.camLook);
        orbitRef.current.update();
      }
      initialized.current = true;
    }
    if (onPosUpdate && orbitRef.current) {
      onPosUpdate(camera.position, orbitRef.current.target);
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      enableZoom
      enablePan
      enableRotate
      target={view.camLook as [number, number, number]}
    />
  );
}

// ── Main scene — single Canvas shared across all modes ─────────
interface Props {
  mode: "exterior" | "room";
  room: RoomDef | null;
  viewIndex?: number;
  onLoaded: () => void;
  onPosUpdate?: (pos: THREE.Vector3, target: THREE.Vector3) => void;
  eventSource?: React.RefObject<HTMLDivElement | null>;
  frameloop?: "always" | "demand" | "never";
  touchDeltaRef?: React.RefObject<number>;
  isMobile?: boolean;
}

function MobileFOV({ fov }: { fov: number }) {
  const { camera } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = fov;
    cam.updateProjectionMatrix();
  }, [camera, fov]);
  return null;
}

export default function SceneCore({ mode, room, viewIndex = 0, onLoaded, onPosUpdate, eventSource, frameloop = "always", touchDeltaRef, isMobile }: Props) {
  const hideRoof = mode === "room";
  const hideSecondFloor = mode === "room" && room?.floor === "ground";

  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      shadows="soft"
      camera={{ fov: 42, near: 0.1, far: 1000, position: [65, 28, 85] }}
      dpr={[1, 1.5]}
      frameloop={frameloop}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      eventSource={eventSource?.current ?? undefined}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.75;
      }}
    >
      {isMobile && <MobileFOV fov={62} />}
      <color attach="background" args={["#0f0d0b"]} />
      <fog attach="fog" args={["#0f0d0b", 220, 650]} />

      <ambientLight color="#fff8e7" intensity={0.5} />
      <directionalLight
        color="#ffe8c0" intensity={1.4}
        position={[50, 80, 30]} castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1} shadow-camera-far={500}
        shadow-camera-left={-120} shadow-camera-right={120}
        shadow-camera-top={120} shadow-camera-bottom={-120}
      />
      <directionalLight color="#8ab4d4" intensity={0.5} position={[-40, 30, -40]} />
      <directionalLight color="#c8a96e" intensity={0.25} position={[0, -10, -60]} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[800, 800]} />
        <meshStandardMaterial color="#0d0b09" roughness={1} metalness={0} />
      </mesh>

      <Environment preset="sunset" environmentIntensity={0.45} />

      <Suspense fallback={null}>
        <HouseModel hideRoof={hideRoof} hideSecondFloor={hideSecondFloor} onLoaded={onLoaded} />
      </Suspense>

      <ExteriorCamera active={mode === "exterior"} touchDeltaRef={touchDeltaRef} />

      {mode === "room" && room && (
        <RoomExplorer room={room} viewIndex={viewIndex} onPosUpdate={onPosUpdate} />
      )}
    </Canvas>
  );
}
