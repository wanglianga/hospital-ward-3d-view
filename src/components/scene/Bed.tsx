import { useState, useRef, useMemo, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
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

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetY = hovered || isSelected ? 0.2 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        delta * 5
      );
      if (showHighlight) {
        const scale = 1 + Math.sin(now * 0.003) * 0.08;
        groupRef.current.scale.setScalar(scale);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 5);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectBed(bed.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  };

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const showRouteButton =
    (perspective === 'transporter' || perspective === 'global') &&
    bed.status !== 'empty' &&
    bed.status !== 'emergency';

  return (
    <group position={[bed.position.x, bed.position.y, bed.position.z]}>
      <group
        ref={groupRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow>
          <boxGeometry args={[2, 0.4, 1]} />
          <meshStandardMaterial
            color={hovered ? '#F5F5F5' : '#ECEFF1'}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 0.9]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 0.45 : 0.18}
          />
        </mesh>
        <mesh position={[0.9, 0.4, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.95]} />
          <meshStandardMaterial color={hovered ? '#78909C' : '#90A4AE'} />
        </mesh>
        <mesh position={[-0.9, 0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.95]} />
          <meshStandardMaterial color={hovered ? '#78909C' : '#90A4AE'} />
        </mesh>

        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[2.1, 0.05, 1.1]} />
          <meshStandardMaterial color="#CFD8DC" />
        </mesh>
        <mesh position={[-0.95, -0.32, -0.45]}>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <meshStandardMaterial color="#B0BEC5" />
        </mesh>
        <mesh position={[0.95, -0.32, -0.45]}>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <meshStandardMaterial color="#B0BEC5" />
        </mesh>
        <mesh position={[-0.95, -0.32, 0.45]}>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <meshStandardMaterial color="#B0BEC5" />
        </mesh>
        <mesh position={[0.95, -0.32, 0.45]}>
          <boxGeometry args={[0.08, 0.25, 0.08]} />
          <meshStandardMaterial color="#B0BEC5" />
        </mesh>

        {(isCleaningHighPriority || showHighlight || isSelected) && (
          <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.1, 48]} />
            <meshBasicMaterial
              color={isSelected ? '#1E88E5' : color}
              transparent
              opacity={0.55 + Math.sin(now * 0.006) * 0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {hovered && (
        <Html
          position={[0, 1.8, 0]}
          center
          distanceFactor={10}
          zIndexRange={[10, 0]}
        >
          <div
            className="bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl text-xs whitespace-nowrap shadow-2xl border border-slate-600/50 backdrop-blur-sm"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="font-bold text-sm flex items-center gap-2 pb-1.5 border-b border-slate-700/50 mb-1.5">
              <span>{bed.number}</span>
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-300 font-medium">
                {BED_STATUS_LABELS[bed.status]}
              </span>
            </div>
            {bed.patient?.name && (
              <div className="text-slate-300 flex items-center gap-1.5">
                <span className="text-slate-500">患者</span>
                <span className="text-white">{bed.patient.name}</span>
              </div>
            )}
            {showRouteButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRouteToExamination(bed.id);
                  selectBed(bed.id);
                }}
                onPointerOver={(e) => e.stopPropagation()}
                onPointerOut={(e) => e.stopPropagation()}
                className="mt-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white text-xs font-medium py-1.5 px-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                规划到检查室路线
              </button>
            )}
            <div className="text-[10px] text-slate-500 mt-2 text-center pt-1 border-t border-slate-700/30">
              点击查看详细信息
            </div>
          </div>
        </Html>
      )}

      <Html
        position={[0, 0.95, 0]}
        center
        distanceFactor={16}
        zIndexRange={[5, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-md transition-all ${
            isSelected
              ? 'bg-blue-600 text-white scale-110'
              : hovered
                ? 'bg-white text-slate-800 scale-105'
                : 'bg-white/85 text-slate-700'
          }`}
          style={{ cursor: 'pointer' }}
        >
          {bed.number}
        </div>
      </Html>
    </group>
  );
}
