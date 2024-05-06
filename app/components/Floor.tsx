import { MeshReflectorMaterial } from "@react-three/drei";

export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <MeshReflectorMaterial
        mirror={0.5}
        attach="material"
        color="#ffffff"
        metalness={0.6}
        roughness={0.1}
        reflectorOffset={0.5}
      />
    </mesh>
  );
}
