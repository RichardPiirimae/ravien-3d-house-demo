"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { RoomDef } from "./rooms";

interface Props {
  room: RoomDef;
}

export default function CameraRig({ room }: Props) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(...room.camLook));

  // Snap camera to start position immediately on mount
  useEffect(() => {
    camera.position.set(...room.camPos);
    lookAt.current.set(...room.camLook);
    camera.lookAt(lookAt.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    const [tx, ty, tz] = room.camPos;
    const [lx, ly, lz] = room.camLook;
    const k = 0.05;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;
    lookAt.current.x += (lx - lookAt.current.x) * k;
    lookAt.current.y += (ly - lookAt.current.y) * k;
    lookAt.current.z += (lz - lookAt.current.z) * k;
    camera.lookAt(lookAt.current);
  });

  return null;
}
