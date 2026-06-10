export type BedStatus = 'empty' | 'occupied' | 'cleaning' | 'isolated' | 'transfer' | 'emergency';

export type RoomType = 'ward' | 'nurse_station' | 'elevator' | 'isolation' | 'emergency' | 'cleaning_room' | 'examination' | 'corridor';

export type Perspective = 'global' | 'nurse' | 'transporter' | 'cleaner';

export type CleaningStatus = 'clean' | 'dirty' | 'in_progress';

export interface PatientInfo {
  name: string;
  careLevel: 1 | 2 | 3;
  isolationMark?: string;
  estimatedTransferTime?: string;
  hasCompanion: boolean;
  cleaningStatus?: CleaningStatus;
}

export interface Bed {
  id: string;
  roomId: string;
  number: string;
  status: BedStatus;
  position: { x: number; y: number; z: number };
  patient?: PatientInfo;
  willReleaseAt?: number;
  cleaningPriority?: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  color?: string;
}

export interface Route {
  from: { x: number; z: number };
  to: { x: number; z: number };
  waypoints: { x: number; z: number }[];
  estimatedMinutes: number;
}

export interface CorridorSegment {
  id: string;
  position: { x: number; z: number };
  size: { width: number; depth: number };
  pressureLevel: 1 | 2 | 3;
}

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}
