import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useWardStore } from '@/store/useWardStore';
import type { TargetWard } from '@/store/useWardStore';

function TargetMarker({ ward, isActive }: { ward: TargetWard; isActive: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    if (ringRef.current) {
      pulseRef.current += delta * (isActive ? 3 : 1.2);
      const scale = 1 + Math.sin(pulseRef.current) * 0.15;
      ringRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[ward.position.x, 0, ward.position.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.2, 1.6, 48]} />
        <meshBasicMaterial
          color={isActive ? '#2196F3' : '#78909C'}
          transparent
          opacity={isActive ? 0.6 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 48]} />
        <meshStandardMaterial
          color={isActive ? '#E3F2FD' : '#F5F5F5'}
          transparent
          opacity={isActive ? 0.85 : 0.7}
        />
      </mesh>

      <Billboard position={[0, 2.2, 0]}>
        <div
          className={`px-3 py-2 rounded-2xl shadow-xl text-center transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/40 scale-110'
              : 'bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200 hover:scale-105'
          }`}
        >
          <div className="text-2xl mb-0.5">{ward.icon}</div>
          <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
            {ward.name}
          </div>
          <div className={`text-[9px] mt-0.5 ${isActive ? 'text-blue-100/90' : 'text-slate-400'}`}>
            病区入口
          </div>
        </div>
      </Billboard>

      {isActive && (
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.3, 0.8, 4]} />
          <meshStandardMaterial
            color="#2196F3"
            emissive="#2196F3"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}
    </group>
  );
}

export function TargetWardMarkers() {
  const targetWards = useWardStore((s) => s.targetWards);
  const routeEndPosition = useWardStore((s) => s.routeEndPosition);
  const activeRoute = useWardStore((s) => s.activeRoute);
  const perspective = useWardStore((s) => s.perspective);

  if (!activeRoute && perspective !== 'transporter') return null;

  return (
    <group>
      {targetWards.map((ward) => (
        <TargetMarker
          key={ward.id}
          ward={ward}
          isActive={
            !!routeEndPosition &&
            Math.abs(routeEndPosition.x - ward.position.x) < 1 &&
            Math.abs(routeEndPosition.z - ward.position.z) < 1
          }
        />
      ))}
    </group>
  );
}
