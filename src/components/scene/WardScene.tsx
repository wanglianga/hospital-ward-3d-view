import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useWardStore } from '@/store/useWardStore';
import { Rooms } from './Rooms';
import { Beds } from './Beds';
import { CorridorHeatmap } from './CorridorHeatmap';
import { RouteLine } from './RouteLine';

function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const cameraPosition = useWardStore((s) => s.cameraPosition);
  const cameraTarget = useWardStore((s) => s.cameraTarget);
  const setCamera = useWardStore((s) => s.setCamera);

  useEffect(() => {
    const startPos = camera.position.clone();
    const startTarget = controlsRef.current?.target?.clone() || new THREE.Vector3();
    const endPos = new THREE.Vector3(...cameraPosition);
    const endTarget = new THREE.Vector3(...cameraTarget);

    let progress = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = () => {
      progress = Math.min((performance.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      camera.position.lerpVectors(startPos, endPos, eased);
      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(startTarget, endTarget, eased);
        controlsRef.current.update();
      }
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [cameraPosition, cameraTarget, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={5}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.2}
      onEnd={() => {
        if (controlsRef.current) {
          setCamera(
            [camera.position.x, camera.position.y, camera.position.z],
            [controlsRef.current.target.x, controlsRef.current.target.y, controlsRef.current.target.z]
          );
        }
      }}
    />
  );
}

function SceneContent() {
  const selectBed = useWardStore((s) => s.selectBed);

  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[20, 30, 20]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 15, -10]} intensity={0.3} />

      <Rooms />
      <Beds />
      <CorridorHeatmap />
      <RouteLine />

      <mesh
        position={[0, -5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => selectBed(null)}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export function WardScene() {
  const cameraPosition = useWardStore((s) => s.cameraPosition);

  return (
    <Canvas
      shadows
      camera={{
        position: cameraPosition,
        fov: 50,
        near: 0.1,
        far: 200,
      }}
      gl={{ antialias: true }}
      style={{ background: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)' }}
    >
      <CameraController />
      <SceneContent />
    </Canvas>
  );
}
