"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import HouseModel from "./HouseModel";
import CameraRig from "./CameraRig";
import type { RoomDef } from "./rooms";

interface Props {
  room: RoomDef;
  onLoaded: () => void;
}

export default function RoomScene({ room, onLoaded }: Props) {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      shadows={THREE.PCFShadowMap}
      camera={{ fov: 55, near: 0.1, far: 500, position: room.camPos }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.85;
      }}
    >
      <color attach="background" args={["#0f0d0b"]} />

      <ambientLight color="#fff8e7" intensity={0.6} />
      <directionalLight color="#ffe8c0" intensity={1.4} position={[50, 80, 30]} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1} shadow-camera-far={400}
        shadow-camera-left={-80} shadow-camera-right={80}
        shadow-camera-top={80} shadow-camera-bottom={-80}
      />
      <directionalLight color="#8ab4d4" intensity={0.5} position={[-40, 30, -40]} />
      <directionalLight color="#c8a96e" intensity={0.3} position={[0, -10, -60]} />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[800, 800]} />
        <meshStandardMaterial color="#0d0b09" roughness={1} metalness={0} />
      </mesh>

      <Environment preset="sunset" environmentIntensity={0.45} />

      <Suspense fallback={null}>
        <HouseModel hideRoof onLoaded={onLoaded} />
      </Suspense>

      <CameraRig room={room} />
    </Canvas>
  );
}
