import { useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Bed as BedType } from '@/types';
import { BED_STATUS_COLORS, BED_STATUS_LABELS } from '@/utils/colors';
import { useWardStore } from '@/store/useWardStore';

interface BedProps {
  bed: BedType;
}

export function Bed({ bed }: BedProps) {
  const [hovered, setHovered] = useState(false);
  const selectBed = useWardStore((s) => s.selectBed);
  const selectedBedId = useWardStore((s) => s.selectedBedId);
  const perspective = useWardStore((s) => s.perspective);
  const startRouteToExamination = useWardStore((s) => s.startRouteToExamination);

  const isSelected = selectedBedId === bed.id;
  const color = BED_STATUS_COLORS[bed.status];
  const now = Date.now();
  const isWillRelease = bed.willReleaseAt && bed.willReleaseAt - now < 7200000;
  const isCleaningHighPriority = bed.status === 'cleaning' && (bed.cleaningPriority || 0) >= 4;

  const showHighlight = useMemo(() => {
    if (perspective === 'nurse' && isWillRelease) return true;
    if (perspective === 'cleaner' && bed.status === 'cleaning') return true;
    if (perspective === 'transporter' && bed.status === 'transfer') return true;
    return false;
  }, [perspective, isWillRelease, bed.status]);

  const meshRef = useMemo(() => ({ current: null as THREE.Mesh | null }), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetY = hovered || isSelected ? 0.2 : 0;
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        delta * 5
      );
      if (showHighlight) {
        const scale = 1 + Math.sin(Date.now() * 0.003) * 0.08;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectBed(bed.id);
  };

  return (
    <group position={[bed.position.x, bed.position.y, bed.position.z]}>
      <group ref={meshRef as unknown as React.RefObject<THREE.Group>}>
        <mesh castShadow>
          <boxGeometry args={[2, 0.4, 1]} />
          <meshStandardMaterial color="#ECEFF1" />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 0.9]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered || isSelected ? 0.4 : 0.15} />
        </mesh>
        <mesh position={[0.9, 0.4, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.95]} />
          <meshStandardMaterial color="#90A4AE" />
        </mesh>
        <mesh position={[-0.9, 0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.95]} />
          <meshStandardMaterial color="#90A4AE" />
        </mesh>

        {(isCleaningHighPriority || showHighlight) && (
          <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5 + Math.sin(Date.now() * 0.005) * 0.3} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {hovered && (
        <Html
          position={[0, 1.5, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-slate-900/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg border border-slate-700">
            <div className="font-semibold">{bed.number}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span>{BED_STATUS_LABELS[bed.status]}</span>
            </div>
            {bed.patient?.name && (
              <div className="text-slate-300 mt-0.5">{bed.patient.name}</div>
            )}
            {perspective === 'transporter' && bed.status !== 'empty' && bed.status !== 'emergency' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRouteToExamination(bed.id);
                }}
                className="mt-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded transition-colors pointer-events-auto"
              >
                规划转运路线
              </button>
            )}
          </div>
        </Html>
      )}

      <Html
        position={[0, 0.8, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none' }}
      >
        <div
          onClick={handleClick}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="text-[10px] font-bold text-slate-700 bg-white/80 px-1.5 py-0.5 rounded shadow"
          style={{ cursor: 'pointer' }}
        >
          {bed.number}
        </div>
      </Html>
    </group>
  );
}
