"use client";
import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Group } from "three";
import { Porsche } from "./Car";
import HandTracker from "./HandTracker";

const ModelViewer: React.FC = () => {
  const [rotation, setRotation] = useState<[number, number]>([0, 0]);
  const [reset, setReset] = useState(false);

  const handleHandMove = (rotation: [number, number]) => {
    setRotation(rotation);
  };

  const handleReset = () => {
    setReset(true);
    setTimeout(() => setReset(false), 100);
  };

  return (
    <>
      <Canvas frameloop="demand">
        <ambientLight intensity={1} />
        <spotLight
          position={[0, 20, 10]}
          angle={0.4}
          penumbra={1}
          castShadow
          intensity={10}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-10, 10, -10]} intensity={5} />
        <directionalLight position={[10, 10, 0]} intensity={4} />
        <Suspense fallback={null}>
          <RotatingModel rotation={rotation} />
          <Environment preset="night" />
        </Suspense>
        <PerspectiveCamera makeDefault position={[0, 1, 7]} />
        <OrbitControls />
      </Canvas>
      <HandTracker onHandMove={handleHandMove} />
    </>
  );
};

const RotatingModel: React.FC<{
  rotation: [number, number];
}> = ({ rotation }) => {
  const groupRef = useRef<Group>(null);
  const prevHand = useRef<[number, number] | null>(null);
  const currentRotationY = useRef(0);
  const currentRotationX = useRef(0);

  useFrame(() => {
    const [handX, handY] = rotation;
    const rotationFactorX = 0.18;
    const rotationFactorY = 0.028;
    const smoothing = 0.05;

    if (prevHand.current && groupRef.current) {
      const [prevX, prevY] = prevHand.current;
      const deltaX = handX - prevX;
      const deltaY = handY - prevY;

      const targetRotationY =
        currentRotationY.current + deltaX * rotationFactorX;
      const targetRotationX =
        currentRotationX.current - deltaY * rotationFactorY;

      currentRotationY.current +=
        (targetRotationY - currentRotationY.current) * smoothing;
      currentRotationX.current +=
        (targetRotationX - currentRotationX.current) * smoothing;

      groupRef.current.rotation.y = currentRotationY.current;
      groupRef.current.rotation.x = currentRotationX.current;
    }

    prevHand.current = [handX, handY];
  });

  return (
    <group ref={groupRef}>
      <Porsche />
    </group>
  );
};

export default ModelViewer;
