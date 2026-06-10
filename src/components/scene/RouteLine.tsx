import { useMemo, useRef } from 'react';
import { useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { useWardStore } from '@/store/useWardStore';

export function RouteLine() {
  const activeRoute = useWardStore((s) => s.activeRoute);
  const clearRoute = useWardStore((s) => s.clearRoute);
  const lineRef = useRef<THREE.Line>(null);
  const dashRef = useRef(0);

  const linePoints = useMemo(() => {
    if (!activeRoute) return null;
    const points: [number, number, number][] = [];
    points.push([activeRoute.from.x, 0.25, activeRoute.from.z]);
    activeRoute.waypoints.forEach((wp) => {
      points.push([wp.x, 0.25, wp.z]);
    });
    points.push([activeRoute.to.x, 0.25, activeRoute.to.z]);
    return points;
  }, [activeRoute]);

  useFrame((_, delta) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineDashedMaterial;
      if (mat && 'dashOffset' in mat) {
        dashRef.current += delta * 2;
        (mat as any).dashOffset = -dashRef.current;
      }
    }
  });

  if (!activeRoute || !linePoints) return null;

  const midIdx = Math.floor(linePoints.length / 2);
  const midPoint = { x: linePoints[midIdx][0], z: linePoints[midIdx][2] };

  return (
    <group>
      <Line
        ref={lineRef as any}
        points={linePoints}
        color="#2196F3"
        lineWidth={3}
        dashed
        dashSize={0.5}
        gapSize={0.3}
        transparent
        opacity={0.9}
      />
      <mesh position={[activeRoute.from.x, 0.3, activeRoute.from.z]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
      <mesh position={[activeRoute.to.x, 0.3, activeRoute.to.z]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#F44336" />
      </mesh>
      <Html
        position={[midPoint.x, 1.5, midPoint.z]}
        center
        distanceFactor={10}
      >
        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs shadow-lg whitespace-nowrap flex items-center gap-2">
          <span>预计转运时间</span>
          <span className="font-bold text-sm">{activeRoute.estimatedMinutes} 分钟</span>
          <button
            onClick={clearRoute}
            className="ml-1 bg-blue-700 hover:bg-blue-800 px-2 py-0.5 rounded transition-colors"
          >
            清除
          </button>
        </div>
      </Html>
    </group>
  );
}
