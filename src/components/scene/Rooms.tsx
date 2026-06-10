import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import type { Room } from '@/types';
import { ROOM_TYPE_COLORS } from '@/utils/colors';
import { useWardStore } from '@/store/useWardStore';

function RoomMesh({ room }: { room: Room }) {
  const isCorridor = room.type === 'corridor';
  const isNurseStation = room.type === 'nurse_station';

  const wallOpacity = isCorridor ? 0 : 0.15;
  const floorColor = ROOM_TYPE_COLORS[room.type] || '#F5F5F5';
  const wallColor = '#B0BEC5';

  const { width, depth, height } = room.size;
  const { x, y, z } = room.position;

  const labelY = isCorridor ? 0.2 : height + 0.3;
  const labelFontSize = isNurseStation ? 0.6 : 0.4;

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
          color="#37474F"
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

      {room.type === 'elevator' && (
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 16]} />
          <meshStandardMaterial color="#78909C" metalness={0.8} roughness={0.2} />
        </mesh>
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
