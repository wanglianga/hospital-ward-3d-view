import { create } from 'zustand';
import type { Bed, Perspective, Route } from '@/types';
import { BEDS, ROOMS, CORRIDOR_SEGMENTS, EXAMINATION_ROOM_POSITION } from '@/data/mockData';
import { CAMERA_PRESETS } from '@/utils/cameraPresets';

interface WardState {
  beds: Bed[];
  rooms: typeof ROOMS;
  corridorSegments: typeof CORRIDOR_SEGMENTS;
  selectedBedId: string | null;
  perspective: Perspective;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  activeRoute: Route | null;
  routeStartBedId: string | null;
  routeEndPosition: { x: number; z: number } | null;
  selectBed: (bedId: string | null) => void;
  setPerspective: (perspective: Perspective) => void;
  setCamera: (position: [number, number, number], target: [number, number, number]) => void;
  setRouteStart: (bedId: string | null) => void;
  setRouteEnd: (pos: { x: number; z: number } | null) => void;
  calculateRoute: () => void;
  clearRoute: () => void;
  startRouteToExamination: (bedId: string) => void;
}

export const useWardStore = create<WardState>((set, get) => ({
  beds: BEDS,
  rooms: ROOMS,
  corridorSegments: CORRIDOR_SEGMENTS,
  selectedBedId: null,
  perspective: 'global',
  cameraPosition: CAMERA_PRESETS.global.position,
  cameraTarget: CAMERA_PRESETS.global.target,
  activeRoute: null,
  routeStartBedId: null,
  routeEndPosition: null,

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
  setRouteEnd: (pos) => set({ routeEndPosition: pos }),

  calculateRoute: () => {
    const { routeStartBedId, routeEndPosition, beds } = get();
    if (!routeStartBedId || !routeEndPosition) return;

    const startBed = beds.find((b) => b.id === routeStartBedId);
    if (!startBed) return;

    const startX = startBed.position.x;
    const startZ = startBed.position.z;
    const endX = routeEndPosition.x;
    const endZ = routeEndPosition.z;

    const waypoints = [
      { x: Math.sign(startX) * 5, z: startZ },
      { x: Math.sign(startX) * 5, z: (startZ + endZ) / 2 },
      { x: endX > 0 ? 5 : endX < 0 ? -5 : 0, z: (startZ + endZ) / 2 },
      { x: endX > 0 ? 5 : endX < 0 ? -5 : 0, z: endZ },
    ];

    const distance = Math.abs(startX - endX) + Math.abs(startZ - endZ);
    const estimatedMinutes = Math.ceil(distance / 5);

    set({
      activeRoute: {
        from: { x: startX, z: startZ },
        to: { x: endX, z: endZ },
        waypoints,
        estimatedMinutes,
      },
    });
  },

  clearRoute: () => set({ activeRoute: null, routeStartBedId: null, routeEndPosition: null }),

  startRouteToExamination: (bedId) => {
    set({
      routeStartBedId: bedId,
      routeEndPosition: EXAMINATION_ROOM_POSITION,
      perspective: 'transporter',
      cameraPosition: CAMERA_PRESETS.transporter.position,
      cameraTarget: CAMERA_PRESETS.transporter.target,
    });
    setTimeout(() => get().calculateRoute(), 100);
  },
}));
