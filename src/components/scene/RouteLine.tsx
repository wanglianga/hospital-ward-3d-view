import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { useWardStore } from '@/store/useWardStore';
import { X, MapPin, Navigation } from 'lucide-react';

export function RouteLine() {
  const activeRoute = useWardStore((s) => s.activeRoute);
  const clearRoute = useWardStore((s) => s.clearRoute);
  const routeEndName = useWardStore((s) => s.routeEndName);
  const beds = useWardStore((s) => s.beds);
  const routeStartBedId = useWardStore((s) => s.routeStartBedId);
  const lineRef = useRef<any>(null);

  const linePoints = useMemo(() => {
    if (!activeRoute) return null;
    const points: [number, number, number][] = [];
    points.push([activeRoute.from.x, 0.35, activeRoute.from.z]);
    activeRoute.waypoints.forEach((wp) => {
      points.push([wp.x, 0.35, wp.z]);
    });
    points.push([activeRoute.to.x, 0.35, activeRoute.to.z]);
    return points;
  }, [activeRoute]);

  const startBedNumber = useMemo(() => {
    const bed = beds.find((b) => b.id === routeStartBedId);
    return bed?.number || '起点';
  }, [beds, routeStartBedId]);

  useFrame(() => {
    // Line 组件已自动处理虚线动画，这里保留空函数便于扩展
  });

  if (!activeRoute || !linePoints) return null;

  const midX = (activeRoute.from.x + activeRoute.to.x) / 2;
  const midZ = (activeRoute.from.z + activeRoute.to.z) / 2;

  return (
    <group>
      <Line
        ref={lineRef}
        points={linePoints}
        color="#2196F3"
        lineWidth={4}
      />

      <Line
        points={linePoints}
        color="#64B5F6"
        lineWidth={1.5}
        transparent
        opacity={0.6}
      />

      <group position={[activeRoute.from.x, 0.4, activeRoute.from.z]}>
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.45, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
        <Html
          position={[0, 0.9, 0]}
          center
          distanceFactor={10}
          zIndexRange={[20, 0]}
        >
          <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 border border-emerald-400/30">
            <Navigation size={8} />
            {startBedNumber}
          </div>
        </Html>
      </group>

      <group position={[activeRoute.to.x, 0.4, activeRoute.to.z]}>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color="#F44336"
            emissive="#F44336"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.55, 32]} />
          <meshBasicMaterial color="#F44336" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
        <Html
          position={[0, 1, 0]}
          center
          distanceFactor={10}
          zIndexRange={[20, 0]}
        >
          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 border border-red-400/30">
            <MapPin size={8} />
            {routeEndName || '目的地'}
          </div>
        </Html>
      </group>

      {activeRoute.waypoints.map((wp, idx) => (
        <mesh key={idx} position={[wp.x, 0.3, wp.z]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#64B5F6"
            emissive="#64B5F6"
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      <Html
        position={[midX, 1.6, midZ]}
        center
        distanceFactor={12}
        zIndexRange={[30, 0]}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-xl shadow-2xl shadow-blue-500/40 whitespace-nowrap border border-blue-400/30">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg p-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-blue-100/90">预计转运</div>
              <div className="font-bold text-sm leading-tight">
                {activeRoute.estimatedMinutes} 分钟
              </div>
            </div>
            <button
              onClick={clearRoute}
              className="ml-1.5 bg-white/20 hover:bg-white/30 p-1 rounded-lg transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}
