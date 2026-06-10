import type { CameraPreset, Perspective } from '@/types';

export const CAMERA_PRESETS: Record<Perspective, CameraPreset> = {
  global: {
    position: [35, 30, 35],
    target: [0, 0, 0],
  },
  nurse: {
    position: [0, 12, 25],
    target: [0, 0, 5],
  },
  transporter: {
    position: [20, 10, 5],
    target: [0, 0, 0],
  },
  cleaner: {
    position: [-20, 10, 5],
    target: [0, 0, 0],
  },
};
