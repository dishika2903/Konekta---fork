
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles() {
  const points = useRef();
  const { viewport } = useThree();
  
  const particles = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [viewport]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.05;
      points.current.rotation.y += delta * 0.03;
      points.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff007a"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function AnimatedOrbs() {
  const group = useRef();
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
      group.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.2;
        child.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        child.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      });
    }
  });

  return (
    <group ref={group}>
      <mesh position={[3, 1, -5]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.08} />
      </mesh>
      <mesh position={[-3, -1, -6]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#a200ff" transparent opacity={0.06} />
      </mesh>
      <mesh position={[2, -2, -4]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#e900b5" transparent opacity={0.05} />
      </mesh>
      <mesh position={[-2, 2, -7]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#ff007a" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#ff007a" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#00f5ff" />
      <FloatingParticles />
      <AnimatedOrbs />
    </>
  );
}
