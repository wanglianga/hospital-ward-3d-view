import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWardStore } from '@/store/useWardStore';
import { PRESSURE_COLORS } from '@/utils/colors';

function Particle({ baseX, baseZ, speed }: { baseX: number; baseZ: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const offset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed + offset.current;
      ref.current.position.x = baseX + Math.sin(t) * 3;
      ref.current.position.z = baseZ + (t * 0.5) % 8 - 4;
      ref.current.position.y = 0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#1E88E5" transparent opacity={0.7} />
    </mesh>
  );
}

export function CorridorHeatmap() {
  const segments = useWardStore((s) => s.corridorSegments);
  const perspective = useWardStore((s) => s.perspective);

  const particles = useMemo(() => {
    const result: { baseX: number; baseZ: number; speed: number; key: string }[] = [];
    segments.forEach((seg, idx) => {
      for (let i = 0; i < seg.pressureLevel * 3; i++) {
        result.push({
          baseX: seg.position.x + (Math.random() - 0.5) * seg.size.width * 0.6,
          baseZ: seg.position.z + (Math.random() - 0.5) * seg.size.depth,
          speed: 0.3 + seg.pressureLevel * 0.15,
          key: `p-${idx}-${i}`,
        });
      }
    });
    return result;
  }, [segments]);

  return (
    <group>
      {segments.map((seg) => (
        <mesh
          key={seg.id}
          position={[seg.position.x, 0.02, seg.position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[seg.size.width, seg.size.depth]} />
          <meshBasicMaterial
            color={PRESSURE_COLORS[seg.pressureLevel]}
            transparent
            opacity={perspective === 'transporter' ? 0.35 : 0.18}
          />
        </mesh>
      ))}
      {particles.map((p) => (
        <Particle key={p.key} baseX={p.baseX} baseZ={p.baseZ} speed={p.speed} />
      ))}
    </group>
  );
}
