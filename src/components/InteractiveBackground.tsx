import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

type InteractiveBackgroundProps = {
  activity: number;
  mouse: { x: number; y: number };
  focus: string;
  scroll: number;
};

function BackgroundScene({ activity, mouse, focus, scroll }: InteractiveBackgroundProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const formRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.04 + (focus === 'services' ? 0.015 : 0), 0.02);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.03 + (focus === 'process' ? 0.01 : 0), 0.02);
      groupRef.current.position.y = Math.sin(time * 0.08 + scroll * 0.0004) * 0.03;
    }

    if (sphereRef.current) {
      sphereRef.current.position.x = -2.2 + mouse.x * 0.18;
      sphereRef.current.position.y = 1.05 + Math.sin(time * 0.35 + scroll * 0.0002) * 0.09 - mouse.y * 0.06;
      sphereRef.current.scale.setScalar(1 + activity * 0.015);
    }

    if (ringRef.current) {
      ringRef.current.position.x = 2.0 + mouse.x * 0.12;
      ringRef.current.position.y = -0.35 + Math.cos(time * 0.28 + scroll * 0.00015) * 0.08 + mouse.y * 0.04;
      ringRef.current.rotation.z = time * 0.08;
    }

    if (formRef.current) {
      formRef.current.position.x = -0.2 + mouse.x * 0.08;
      formRef.current.position.y = -1.2 + Math.sin(time * 0.24 + scroll * 0.00012) * 0.08;
      formRef.current.rotation.y = time * 0.1;
      formRef.current.rotation.z = 0.25 + mouse.y * 0.02;
    }
  });

  return (
    <>
      <color attach="background" args={["#020305"]} />
      <fog attach="fog" args={["#020305", 9, 22]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[3, 2, 5]} intensity={0.28} color="#e8efff" />
      <spotLight position={[-2.5, 1.5, 4.5]} intensity={0.16} color="#8ebabd" angle={0.36} penumbra={0.28} />

      <group ref={groupRef}>
        <Float speed={0.2} rotationIntensity={0.03} floatIntensity={0.12}>
          <mesh ref={sphereRef} position={[-2.2, 1.05, -1.4]}>
            <sphereGeometry args={[0.7, 48, 48]} />
            <meshPhysicalMaterial color="#f8fbff" roughness={0.14} metalness={0.12} transmission={0.9} thickness={0.4} transparent opacity={0.55} />
          </mesh>
        </Float>

        <Float speed={0.18} rotationIntensity={0.02} floatIntensity={0.1}>
          <mesh ref={ringRef} position={[2.0, -0.35, -1.35]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.8, 0.09, 20, 90]} />
            <meshStandardMaterial color="#f2f7ff" metalness={0.7} roughness={0.2} emissive="#8eb2ff" emissiveIntensity={0.05} />
          </mesh>
        </Float>

        <Float speed={0.22} rotationIntensity={0.03} floatIntensity={0.11}>
          <mesh ref={formRef} position={[-0.2, -1.2, -1.8]} rotation={[0.22, 0.45, 0.18]}>
            <torusKnotGeometry args={[0.5, 0.12, 96, 12]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.17} metalness={0.55} transmission={0.58} thickness={0.2} transparent opacity={0.5} />
          </mesh>
        </Float>
      </group>

      <mesh position={[0, 0, -4.2]}>
        <planeGeometry args={[24, 16]} />
        <meshBasicMaterial color="#020305" transparent opacity={0.12} />
      </mesh>
    </>
  );
}

export default function InteractiveBackground(props: InteractiveBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 48 }} dpr={[1, 2]}>
        <BackgroundScene {...props} />
      </Canvas>
    </div>
  );
}
