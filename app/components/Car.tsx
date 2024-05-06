"use client";
import { useGLTF } from "@react-three/drei";

export function Porsche(): JSX.Element {
  const gltf = useGLTF("/911-transformed.glb");
  const { scene } = gltf;

  return <primitive object={scene} />;
}
