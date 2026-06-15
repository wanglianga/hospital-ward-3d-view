import type { BedStatus } from '@/types';

export const BED_STATUS_COLORS: Record<BedStatus, string> = {
  empty: '#4CAF50',
  occupied: '#F44336',
  cleaning: '#FF9800',
  isolated: '#9C27B0',
  transfer: '#2196F3',
  emergency: '#FFEB3B',
};

export const BED_STATUS_LABELS: Record<BedStatus, string> = {
  empty: '空床',
  occupied: '占用',
  cleaning: '待清洁',
  isolated: '隔离',
  transfer: '转科待转',
  emergency: '抢救备用',
};

export const ROOM_TYPE_COLORS: Record<string, string> = {
  ward: '#E3F2FD',
  nurse_station: '#1E88E5',
  elevator: '#78909C',
  isolation_elevator: '#9C27B0',
  isolation: '#F3E5F5',
  emergency: '#FFEBEE',
  cleaning_room: '#FFF3E0',
  examination: '#E8F5E9',
  corridor: '#F5F5F5',
};

export const ROUTE_COLORS: Record<string, { main: string; accent: string; label: string }> = {
  normal: { main: '#2196F3', accent: '#64B5F6', label: '普通路线' },
  isolation: { main: '#9C27B0', accent: '#CE93D8', label: '隔离专用路线' },
};

export const ISOLATION_ZONE_COLORS = {
  disinfection: '#FF5722',
  avoid: '#F44336',
  isolationCorridor: '#9C27B0',
};

export const CARE_LEVEL_LABELS: Record<number, string> = {
  1: '轻度照护',
  2: '中度照护',
  3: '重度照护',
};

export const PRESSURE_COLORS: Record<number, string> = {
  1: '#4CAF50',
  2: '#FF9800',
  3: '#F44336',
};
