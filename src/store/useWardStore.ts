import { create } from 'zustand';
import type { Bed, Perspective, Route, RouteType } from '@/types';
import { BEDS, ROOMS, CORRIDOR_SEGMENTS, EXAMINATION_ROOM_POSITION, TARGET_WARDS, ISOLATION_ELEVATOR_POSITION, NORMAL_ELEVATOR_POSITION } from '@/data/mockData';
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
  now: number;
  selectBed: (bedId: string | null) => void;
  setPerspective: (perspective: Perspective) => void;
  setCamera: (position: [number, number, number], target: [number, number, number]) => void;
  setRouteStart: (bedId: string | null) => void;
  setRouteEnd: (pos: { x: number; z: number } | null, name?: string) => void;
  calculateRoute: () => void;
  clearRoute: () => void;
  startRouteToExamination: (bedId: string) => void;
  startRouteToTargetWard: (bedId: string, targetWardId: string) => void;
  getCleaningRemainingMinutes: (bedId: string) => number | null;
  getCleaningProgress: (bedId: string) => number;
  tick: () => void;
  isIsolationBed: (bedId: string) => boolean;
}

function determineRouteType(bed: Bed | undefined): RouteType {
  if (!bed) return 'normal';
  if (bed.status === 'isolated') return 'isolation';
  if (bed.patient?.isolationMark) return 'isolation';
  return 'normal';
}

function calculateIsolationRoute(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number
): { waypoints: { x: number; z: number }[]; disinfectionZones: { x: number; z: number; width: number; depth: number }[]; avoidZones: { x: number; z: number; width: number; depth: number }[]; designatedElevatorId: string } {
  const waypoints: { x: number; z: number }[] = [];
  const disinfectionZones: { x: number; z: number; width: number; depth: number }[] = [];
  const avoidZones: { x: number; z: number; width: number; depth: number }[] = [];

  const startCorridorX = startX > 0 ? 3 : startX < 0 ? -3 : 0;
  const endCorridorX = endX > 5 ? 3 : endX < -5 ? -3 : 0;

  if (Math.abs(startX) > 5.5) {
    waypoints.push({ x: startCorridorX, z: startZ });
  }

  const isoElevX = ISOLATION_ELEVATOR_POSITION.x;
  const isoElevZ = ISOLATION_ELEVATOR_POSITION.z;

  if (Math.abs(endX) > 5.5) {
    if (startCorridorX !== endCorridorX) {
      waypoints.push({ x: startCorridorX, z: isoElevZ });
      waypoints.push({ x: isoElevX, z: isoElevZ });
      waypoints.push({ x: endCorridorX, z: isoElevZ });
    }
    waypoints.push({ x: endCorridorX, z: endZ });
  } else {
    if (startCorridorX !== endCorridorX) {
      waypoints.push({ x: startCorridorX, z: isoElevZ });
      waypoints.push({ x: isoElevX, z: isoElevZ });
    }
    waypoints.push({ x: endCorridorX || 0, z: endZ });
  }

  CORRIDOR_SEGMENTS.forEach((seg) => {
    if (seg.needsDisinfection) {
      disinfectionZones.push({
        x: seg.position.x,
        z: seg.position.z,
        width: seg.size.width,
        depth: seg.size.depth,
      });
    }
    if (seg.isAvoidForIsolation) {
      avoidZones.push({
        x: seg.position.x,
        z: seg.position.z,
        width: seg.size.width,
        depth: seg.size.depth,
      });
    }
  });

  return {
    waypoints,
    disinfectionZones,
    avoidZones,
    designatedElevatorId: 'isolation-elevator',
  };
}

function calculateNormalRoute(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number
): { waypoints: { x: number; z: number }[] } {
  const waypoints: { x: number; z: number }[] = [];

  const startCorridorX = Math.sign(startX) * 5;
  const endCorridorX = endX > 5 ? 5 : endX < -5 ? -5 : 0;

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

  return { waypoints };
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
  now: Date.now(),

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

    const routeType = determineRouteType(startBed);

    let waypoints: { x: number; z: number }[] = [];
    let disinfectionZones: { x: number; z: number; width: number; depth: number }[] | undefined;
    let avoidZones: { x: number; z: number; width: number; depth: number }[] | undefined;
    let designatedElevatorId: string | undefined;

    if (routeType === 'isolation') {
      const result = calculateIsolationRoute(startX, startZ, endX, endZ);
      waypoints = result.waypoints;
      disinfectionZones = result.disinfectionZones;
      avoidZones = result.avoidZones;
      designatedElevatorId = result.designatedElevatorId;
    } else {
      const result = calculateNormalRoute(startX, startZ, endX, endZ);
      waypoints = result.waypoints;
    }

    const distance = Math.abs(startX - endX) + Math.abs(startZ - endZ);
    const estimatedMinutes = Math.max(2, Math.ceil(distance / 4)) + (routeType === 'isolation' ? 3 : 0);

    set({
      activeRoute: {
        from: { x: startX, z: startZ },
        to: { x: endX, z: endZ },
        waypoints,
        estimatedMinutes,
        type: routeType,
        disinfectionZones,
        avoidZones,
        designatedElevatorId,
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

  getCleaningRemainingMinutes: (bedId) => {
    const { beds, now } = get();
    const bed = beds.find((b) => b.id === bedId);
    if (!bed || bed.status !== 'cleaning' || !bed.cleaningStartTime || !bed.cleaningDurationMinutes) {
      return null;
    }
    const elapsedMs = now - bed.cleaningStartTime;
    const totalMs = bed.cleaningDurationMinutes * 60 * 1000;
    const remainingMs = Math.max(0, totalMs - elapsedMs);
    return Math.ceil(remainingMs / 60000);
  },

  getCleaningProgress: (bedId) => {
    const { beds, now } = get();
    const bed = beds.find((b) => b.id === bedId);
    if (!bed || bed.status !== 'cleaning' || !bed.cleaningStartTime || !bed.cleaningDurationMinutes) {
      return 0;
    }
    const elapsedMs = now - bed.cleaningStartTime;
    const totalMs = bed.cleaningDurationMinutes * 60 * 1000;
    return Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
  },

  tick: () => set({ now: Date.now() }),

  isIsolationBed: (bedId) => {
    const bed = get().beds.find((b) => b.id === bedId);
    if (!bed) return false;
    return bed.status === 'isolated' || !!bed.patient?.isolationMark;
  },
}));
