import { create } from 'zustand';
import type { Bed, Perspective, Route } from '@/types';
import { BEDS, ROOMS, CORRIDOR_SEGMENTS, EXAMINATION_ROOM_POSITION, TARGET_WARDS } from '@/data/mockData';
import { CAMERA_PRESETS } from '@/utils/cameraPresets';

export interface TargetWard {
  id: string;
  name: string;
  position: { x: number; z: number };
  icon: string;
}

interface WardState {
  beds: Bed[];
  rooms: typeof ROOMS;
  corridorSegments: typeof CORRIDOR_SEGMENTS;
  targetWards: typeof TARGET_WARDS;
  selectedBedId: string | null;
  perspective: Perspective;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  activeRoute: Route | null;
  routeStartBedId: string | null;
  routeEndPosition: { x: number; z: number } | null;
  routeEndName: string | null;
  selectBed: (bedId: string | null) => void;
  setPerspective: (perspective: Perspective) => void;
  setCamera: (position: [number, number, number], target: [number, number, number]) => void;
  setRouteStart: (bedId: string | null) => void;
  setRouteEnd: (pos: { x: number; z: number } | null, name?: string) => void;
  calculateRoute: () => void;
  clearRoute: () => void;
  startRouteToExamination: (bedId: string) => void;
  startRouteToTargetWard: (bedId: string, targetWardId: string) => void;
}

export const useWardStore = create<WardState>((set, get) => ({
  beds: BEDS,
  rooms: ROOMS,
  corridorSegments: CORRIDOR_SEGMENTS,
  targetWards: TARGET_WARDS,
  selectedBedId: null,
  perspective: 'global',
  cameraPosition: CAMERA_PRESETS.global.position,
  cameraTarget: CAMERA_PRESETS.global.target,
  activeRoute: null,
  routeStartBedId: null,
  routeEndPosition: null,
  routeEndName: null,

  selectBed: (bedId) => set({ selectedBedId: bedId }),

  setPerspective: (perspective) => {
    const preset = CAMERA_PRESETS[perspective];
    set({
      perspective,
      cameraPosition: preset.position,
      cameraTarget: preset.target,
    });
  },

  setCamera: (position, target) => set({ cameraPosition: position, cameraTarget: target }),

  setRouteStart: (bedId) => set({ routeStartBedId: bedId }),
  setRouteEnd: (pos, name) => set({ routeEndPosition: pos, routeEndName: name || null }),

  calculateRoute: () => {
    const { routeStartBedId, routeEndPosition, beds } = get();
    if (!routeStartBedId || !routeEndPosition) return;

    const startBed = beds.find((b) => b.id === routeStartBedId);
    if (!startBed) return;

    const startX = startBed.position.x;
    const startZ = startBed.position.z;
    const endX = routeEndPosition.x;
    const endZ = routeEndPosition.z;

    const startCorridorX = Math.sign(startX) * 5;
    const endCorridorX = endX > 5 ? 5 : endX < -5 ? -5 : 0;

    const waypoints: { x: number; z: number }[] = [];

    if (Math.abs(startX) > 5.5) {
      waypoints.push({ x: startCorridorX, z: startZ });
    }

    if (Math.abs(endX) > 5.5 && startCorridorX !== endCorridorX) {
      const midZ = (startZ + endZ) / 2;
      waypoints.push({ x: startCorridorX, z: midZ });
      waypoints.push({ x: endCorridorX, z: midZ });
    } else if (Math.abs(endX) > 5.5) {
      waypoints.push({ x: endCorridorX, z: startZ });
    } else {
      waypoints.push({ x: startCorridorX, z: endZ });
    }

    if (Math.abs(endX) > 5.5) {
      waypoints.push({ x: endCorridorX, z: endZ });
    }

    const distance = Math.abs(startX - endX) + Math.abs(startZ - endZ);
    const estimatedMinutes = Math.max(2, Math.ceil(distance / 4));

    set({
      activeRoute: {
        from: { x: startX, z: startZ },
        to: { x: endX, z: endZ },
        waypoints,
        estimatedMinutes,
      },
    });
  },

  clearRoute: () => set({
    activeRoute: null,
    routeStartBedId: null,
    routeEndPosition: null,
    routeEndName: null,
  }),

  startRouteToExamination: (bedId) => {
    set({
      selectedBedId: bedId,
      routeStartBedId: bedId,
      routeEndPosition: EXAMINATION_ROOM_POSITION,
      routeEndName: '检查室',
      perspective: 'transporter',
      cameraPosition: CAMERA_PRESETS.transporter.position,
      cameraTarget: CAMERA_PRESETS.transporter.target,
    });
    setTimeout(() => get().calculateRoute(), 100);
  },

  startRouteToTargetWard: (bedId, targetWardId) => {
    const targetWard = get().targetWards.find((w) => w.id === targetWardId);
    if (!targetWard) return;

    set({
      selectedBedId: bedId,
      routeStartBedId: bedId,
      routeEndPosition: targetWard.position,
      routeEndName: targetWard.name,
      perspective: 'transporter',
      cameraPosition: CAMERA_PRESETS.transporter.position,
      cameraTarget: CAMERA_PRESETS.transporter.target,
    });
    setTimeout(() => get().calculateRoute(), 100);
  },
}));
