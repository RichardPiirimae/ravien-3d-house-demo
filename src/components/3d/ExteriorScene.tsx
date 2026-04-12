"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import HouseModel from "./HouseModel";

interface Props {
  onLoaded: () => void;
}

export default function ExteriorScene({ onLoaded }: Props) {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      shadows={THREE.PCFShadowMap}
      camera={{ fov: 42, near: 0.1, far: 1000, position: [65, 28, 85] }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.75;
      }}
    >
      <color attach="background" args={["#0f0d0b"]} />
      <fog attach="fog" args={["#0f0d0b", 220, 650]} />

      <ambientLight color="#fff8e7" intensity={0.4} />
      <directionalLight
        color="#ffe8c0" intensity={1.4}
        position={[50, 80, 30]} castShadow
        shadow-mapSize={[2048, 2048]}
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
        <HouseModel hideRoof={false} onLoaded={onLoaded} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 5, 0]}
      />
    </Canvas>
  );
}
