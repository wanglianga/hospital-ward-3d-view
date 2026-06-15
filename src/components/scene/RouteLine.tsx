import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Line, Text } from '@react-three/drei';
import { useWardStore } from '@/store/useWardStore';
import { X, MapPin, Navigation, ShieldAlert, AlertTriangle, Droplets, ChevronsUpDown } from 'lucide-react';
import { ROUTE_COLORS, ISOLATION_ZONE_COLORS } from '@/utils/colors';
import { ROOMS } from '@/data/mockData';

export function RouteLine() {
  const activeRoute = useWardStore((s) => s.activeRoute);
  const clearRoute = useWardStore((s) => s.clearRoute);
  const routeEndName = useWardStore((s) => s.routeEndName);
  const beds = useWardStore((s) => s.beds);
  const routeStartBedId = useWardStore((s) => s.routeStartBedId);
  const now = useWardStore((s) => s.now);
  const lineRef = useRef<any>(null);

  const routeColors = useMemo(() => {
    if (!activeRoute) return ROUTE_COLORS.normal;
    return ROUTE_COLORS[activeRoute.type] || ROUTE_COLORS.normal;
  }, [activeRoute]);

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

  const designatedElevator = useMemo(() => {
    if (!activeRoute?.designatedElevatorId) return null;
    return ROOMS.find((r) => r.id === activeRoute.designatedElevatorId);
  }, [activeRoute]);

  useFrame(() => {
  });

  if (!activeRoute || !linePoints) return null;

  const midX = (activeRoute.from.x + activeRoute.to.x) / 2;
  const midZ = (activeRoute.from.z + activeRoute.to.z) / 2;
  const isIsolation = activeRoute.type === 'isolation';

  return (
    <group>
      {activeRoute.avoidZones?.map((zone, idx) => (
        <group key={`avoid-${idx}`}>
          <mesh position={[zone.x, 0.05, zone.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[zone.width, zone.depth]} />
            <meshBasicMaterial
              color={ISOLATION_ZONE_COLORS.avoid}
              transparent
              opacity={0.15 + Math.sin(now * 0.003) * 0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[zone.x, 0.08, zone.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.min(zone.width, zone.depth) * 0.3, Math.min(zone.width, zone.depth) * 0.45, 48]} />
            <meshBasicMaterial
              color={ISOLATION_ZONE_COLORS.avoid}
              transparent
              opacity={0.4 + Math.sin(now * 0.004) * 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Html
            position={[zone.x, 1.2, zone.z]}
            center
            distanceFactor={12}
            zIndexRange={[5, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1 border border-red-400/50 animate-pulse">
              <AlertTriangle size={10} />
              隔离患者避开此区域
            </div>
          </Html>
        </group>
      ))}

      {activeRoute.disinfectionZones?.map((zone, idx) => (
        <group key={`disinfect-${idx}`}>
          <mesh position={[zone.x, 0.06, zone.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[zone.width, zone.depth]} />
            <meshBasicMaterial
              color={ISOLATION_ZONE_COLORS.disinfection}
              transparent
              opacity={0.2 + Math.sin(now * 0.0025 + idx) * 0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={`drop-${i}`}
              position={[
                zone.x + (i - 3) * 1.2,
                0.15 + Math.sin(now * 0.003 + i) * 0.1,
                zone.z + Math.cos(now * 0.002 + i) * 1.5,
              ]}
            >
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color={ISOLATION_ZONE_COLORS.disinfection}
                transparent
                opacity={0.7}
                emissive={ISOLATION_ZONE_COLORS.disinfection}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
          <Html
            position={[zone.x, 1.2, zone.z]}
            center
            distanceFactor={12}
            zIndexRange={[5, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-orange-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1 border border-orange-400/50">
              <Droplets size={10} />
              转运后需消杀
            </div>
          </Html>
        </group>
      ))}

      {designatedElevator && (
        <group position={[designatedElevator.position.x, 0, designatedElevator.position.z]}>
          <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.8, 48]} />
            <meshBasicMaterial
              color={ISOLATION_ZONE_COLORS.isolationCorridor}
              transparent
              opacity={0.4 + Math.sin(now * 0.004) * 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <Html
            position={[0, 2.2, 0]}
            center
            distanceFactor={10}
            zIndexRange={[15, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-purple-600/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-1.5 border border-purple-400/50">
              <ChevronsUpDown size={12} />
              隔离专用电梯
            </div>
          </Html>
        </group>
      )}

      <Line
        ref={lineRef}
        points={linePoints}
        color={routeColors.main}
        lineWidth={isIsolation ? 6 : 4}
      />

      <Line
        points={linePoints}
        color={routeColors.accent}
        lineWidth={isIsolation ? 2.5 : 1.5}
        transparent
        opacity={0.6}
      />

      <group position={[activeRoute.from.x, 0.4, activeRoute.from.z]}>
        <mesh>
          <sphereGeometry args={[isIsolation ? 0.32 : 0.28, 24, 24]} />
          <meshStandardMaterial
            color={isIsolation ? ISOLATION_ZONE_COLORS.isolationCorridor : '#4CAF50'}
            emissive={isIsolation ? ISOLATION_ZONE_COLORS.isolationCorridor : '#4CAF50'}
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[isIsolation ? 0.35 : 0.3, isIsolation ? 0.55 : 0.45, 32]} />
          <meshBasicMaterial
            color={isIsolation ? ISOLATION_ZONE_COLORS.isolationCorridor : '#4CAF50'}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        <Html
          position={[0, 0.9, 0]}
          center
          distanceFactor={10}
          zIndexRange={[20, 0]}
        >
          <div
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 border ${
              isIsolation
                ? 'bg-purple-600 text-white border-purple-400/30'
                : 'bg-emerald-500 text-white border-emerald-400/30'
            }`}
          >
            <Navigation size={8} />
            {startBedNumber}
            {isIsolation && (
              <span className="ml-0.5 bg-white/20 px-1 rounded">隔离</span>
            )}
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
          <sphereGeometry args={[isIsolation ? 0.13 : 0.1, 12, 12]} />
          <meshStandardMaterial
            color={routeColors.accent}
            emissive={routeColors.accent}
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      <Html
        position={[midX, 1.8, midZ]}
        center
        distanceFactor={12}
        zIndexRange={[30, 0]}
      >
        <div
          className={`px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap border ${
            isIsolation
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-400/30 shadow-purple-500/40'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-400/30 shadow-blue-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg p-1.5">
              {isIsolation ? (
                <ShieldAlert width="14" height="14" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              )}
            </div>
            <div>
              <div className={`text-[10px] ${isIsolation ? 'text-purple-100/90' : 'text-blue-100/90'}`}>
                {isIsolation ? '隔离转运路线' : '预计转运'}
              </div>
              <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                {activeRoute.estimatedMinutes} 分钟
                {isIsolation && (
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">含消杀时间</span>
                )}
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
