import { useMemo, useRef } from 'react';
import { Text, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Room } from '@/types';
import { ROOM_TYPE_COLORS } from '@/utils/colors';
import { useWardStore } from '@/store/useWardStore';
import { ShieldAlert } from 'lucide-react';

function RoomMesh({ room }: { room: Room }) {
  const isCorridor = room.type === 'corridor';
  const isNurseStation = room.type === 'nurse_station';
  const isIsolationElevator = room.type === 'isolation_elevator';
  const isElevator = room.type === 'elevator' || isIsolationElevator;
  const ringRef = useRef<any>(null);
  const now = useWardStore((s) => s.now);

  const wallOpacity = isCorridor ? 0 : 0.15;
  const floorColor = ROOM_TYPE_COLORS[room.type] || '#F5F5F5';
  const wallColor = '#B0BEC5';

  const { width, depth, height } = room.size;
  const { x, y, z } = room.position;

  const labelY = isCorridor ? 0.2 : height + 0.3;
  const labelFontSize = isNurseStation ? 0.6 : 0.4;

  useFrame(() => {
  });

  return (
    <group position={[x, y, z]}>
      {!isCorridor && (
        <>
          <mesh position={[0, height / 2, depth / 2]}>
            <boxGeometry args={[width, height, 0.1]} />
            <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
          </mesh>
          <mesh position={[0, height / 2, -depth / 2]}>
            <boxGeometry args={[width, height, 0.1]} />
            <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
          </mesh>
          <mesh position={[-width / 2, height / 2, 0]}>
            <boxGeometry args={[0.1, height, depth]} />
            <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
          </mesh>
          <mesh position={[width / 2, height / 2, 0]}>
            <boxGeometry args={[0.1, height, depth]} />
            <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
          </mesh>
        </>
      )}

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={floorColor}
          transparent
          opacity={isCorridor ? 0.8 : 1}
        />
      </mesh>

      {!isCorridor && (
        <Text
          position={[0, labelY, 0]}
          fontSize={labelFontSize}
          color={isIsolationElevator ? '#7B1FA2' : '#37474F'}
          anchorX="center"
          anchorY="middle"
        >
          {room.name}
        </Text>
      )}

      {isNurseStation && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[width - 0.5, 1, depth - 0.5]} />
          <meshStandardMaterial color="#1E88E5" />
        </mesh>
      )}

      {isElevator && (
        <>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
            <meshStandardMaterial
              color={isIsolationElevator ? '#9C27B0' : '#78909C'}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[width * 0.6, 0.02, depth * 0.6]} />
            <meshStandardMaterial
              color={isIsolationElevator ? '#CE93D8' : '#90A4AE'}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        </>
      )}

      {isIsolationElevator && (
        <>
          <mesh ref={ringRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.min(width, depth) * 0.6, Math.min(width, depth) * 0.8, 48]} />
            <meshBasicMaterial
              color="#9C27B0"
              transparent
              opacity={0.35 + Math.sin(now * 0.004) * 0.2}
              side={2}
            />
          </mesh>
          <Html
            position={[0, height + 0.8, 0]}
            center
            distanceFactor={10}
            zIndexRange={[8, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="bg-purple-600/95 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1 border border-purple-400/50">
              <ShieldAlert size={10} />
              隔离专用
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

export function Rooms() {
  const rooms = useWardStore((s) => s.rooms);

  const roomMeshes = useMemo(
    () => rooms.map((room) => <RoomMesh key={room.id} room={room} />),
    [rooms]
  );

  return (
    <group>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#ECEFF1" />
      </mesh>
      {roomMeshes}
    </group>
  );
}
