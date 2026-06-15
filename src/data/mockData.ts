import type { Bed, Room, CorridorSegment } from '@/types';

const now = Date.now();

export const ROOMS: Room[] = [
  {
    id: 'ward-101',
    name: '101病房',
    type: 'ward',
    position: { x: -18, y: 0, z: -8 },
    size: { width: 8, height: 5, depth: 6 },
  },
  {
    id: 'ward-102',
    name: '102病房',
    type: 'ward',
    position: { x: -18, y: 0, z: 2 },
    size: { width: 8, height: 5, depth: 6 },
  },
  {
    id: 'ward-103',
    name: '103病房',
    type: 'ward',
    position: { x: -18, y: 0, z: 12 },
    size: { width: 8, height: 5, depth: 6 },
  },
  {
    id: 'ward-201',
    name: '201病房',
    type: 'ward',
    position: { x: 18, y: 0, z: -8 },
    size: { width: 8, height: 5, depth: 6 },
  },
  {
    id: 'ward-202',
    name: '202病房',
    type: 'ward',
    position: { x: 18, y: 0, z: 2 },
    size: { width: 8, height: 5, depth: 6 },
  },
  {
    id: 'iso-1',
    name: '隔离病房1',
    type: 'isolation',
    position: { x: 18, y: 0, z: 12 },
    size: { width: 8, height: 5, depth: 6 },
  },
  {
    id: 'iso-2',
    name: '隔离病房2',
    type: 'isolation',
    position: { x: 0, y: 0, z: 18 },
    size: { width: 8, height: 5, depth: 5 },
  },
  {
    id: 'emergency',
    name: '抢救室',
    type: 'emergency',
    position: { x: 0, y: 0, z: -18 },
    size: { width: 10, height: 5, depth: 5 },
  },
  {
    id: 'nurse-station',
    name: '护士站',
    type: 'nurse_station',
    position: { x: -8, y: 0, z: -18 },
    size: { width: 6, height: 3, depth: 5 },
  },
  {
    id: 'elevator',
    name: '普通电梯',
    type: 'elevator',
    position: { x: 8, y: 0, z: -18 },
    size: { width: 4, height: 5, depth: 5 },
  },
  {
    id: 'isolation-elevator',
    name: '隔离专用电梯',
    type: 'isolation_elevator',
    position: { x: -3, y: 0, z: 18 },
    size: { width: 4, height: 5, depth: 4 },
  },
  {
    id: 'cleaning',
    name: '清洁间',
    type: 'cleaning_room',
    position: { x: -18, y: 0, z: -18 },
    size: { width: 4, height: 5, depth: 5 },
  },
  {
    id: 'examination',
    name: '检查室',
    type: 'examination',
    position: { x: 18, y: 0, z: -18 },
    size: { width: 6, height: 5, depth: 5 },
  },
  {
    id: 'corridor',
    name: '走廊',
    type: 'corridor',
    position: { x: 0, y: 0, z: 0 },
    size: { width: 10, height: 0.1, depth: 38 },
  },
];

export const BEDS: Bed[] = [
  { id: 'bed-101-1', roomId: 'ward-101', number: '101-1', status: 'occupied', position: { x: -21, y: 0.6, z: -10 }, patient: { name: '张某某', careLevel: 2, hasCompanion: true, cleaningStatus: 'clean' }, willReleaseAt: now + 3600000 },
  { id: 'bed-101-2', roomId: 'ward-101', number: '101-2', status: 'empty', position: { x: -15, y: 0.6, z: -10 } },
  { id: 'bed-101-3', roomId: 'ward-101', number: '101-3', status: 'occupied', position: { x: -21, y: 0.6, z: -6 }, patient: { name: '李某某', careLevel: 1, hasCompanion: false, cleaningStatus: 'clean' } },
  { id: 'bed-101-4', roomId: 'ward-101', number: '101-4', status: 'cleaning', position: { x: -15, y: 0.6, z: -6 }, cleaningPriority: 3, cleaningStartTime: now - 900000, cleaningDurationMinutes: 30 },

  { id: 'bed-102-1', roomId: 'ward-102', number: '102-1', status: 'occupied', position: { x: -21, y: 0.6, z: 0 }, patient: { name: '王某某', careLevel: 3, hasCompanion: true, cleaningStatus: 'clean' } },
  { id: 'bed-102-2', roomId: 'ward-102', number: '102-2', status: 'transfer', position: { x: -15, y: 0.6, z: 0 }, patient: { name: '赵某某', careLevel: 2, hasCompanion: false, estimatedTransferTime: '30分钟后', cleaningStatus: 'clean' }, willReleaseAt: now + 1800000 },
  { id: 'bed-102-3', roomId: 'ward-102', number: '102-3', status: 'empty', position: { x: -21, y: 0.6, z: 4 } },
  { id: 'bed-102-4', roomId: 'ward-102', number: '102-4', status: 'occupied', position: { x: -15, y: 0.6, z: 4 }, patient: { name: '刘某某', careLevel: 1, hasCompanion: true, cleaningStatus: 'clean' } },

  { id: 'bed-103-1', roomId: 'ward-103', number: '103-1', status: 'occupied', position: { x: -21, y: 0.6, z: 10 }, patient: { name: '陈某某', careLevel: 2, hasCompanion: false, cleaningStatus: 'clean' } },
  { id: 'bed-103-2', roomId: 'ward-103', number: '103-2', status: 'cleaning', position: { x: -15, y: 0.6, z: 10 }, cleaningPriority: 1, cleaningStartTime: now - 2400000, cleaningDurationMinutes: 45 },
  { id: 'bed-103-3', roomId: 'ward-103', number: '103-3', status: 'occupied', position: { x: -21, y: 0.6, z: 14 }, patient: { name: '杨某某', careLevel: 1, hasCompanion: true, cleaningStatus: 'clean' } },
  { id: 'bed-103-4', roomId: 'ward-103', number: '103-4', status: 'cleaning', position: { x: -15, y: 0.6, z: 14 }, cleaningPriority: 5, cleaningStartTime: now - 300000, cleaningDurationMinutes: 20 },

  { id: 'bed-201-1', roomId: 'ward-201', number: '201-1', status: 'occupied', position: { x: 15, y: 0.6, z: -10 }, patient: { name: '黄某某', careLevel: 3, hasCompanion: true, cleaningStatus: 'clean' } },
  { id: 'bed-201-2', roomId: 'ward-201', number: '201-2', status: 'empty', position: { x: 21, y: 0.6, z: -10 } },
  { id: 'bed-201-3', roomId: 'ward-201', number: '201-3', status: 'occupied', position: { x: 15, y: 0.6, z: -6 }, patient: { name: '周某某', careLevel: 2, hasCompanion: false, cleaningStatus: 'clean' } },
  { id: 'bed-201-4', roomId: 'ward-201', number: '201-4', status: 'transfer', position: { x: 21, y: 0.6, z: -6 }, patient: { name: '吴某某', careLevel: 1, hasCompanion: false, estimatedTransferTime: '1小时后', cleaningStatus: 'clean' } },

  { id: 'bed-202-1', roomId: 'ward-202', number: '202-1', status: 'empty', position: { x: 15, y: 0.6, z: 0 } },
  { id: 'bed-202-2', roomId: 'ward-202', number: '202-2', status: 'occupied', position: { x: 21, y: 0.6, z: 0 }, patient: { name: '徐某某', careLevel: 2, hasCompanion: true, cleaningStatus: 'clean' }, willReleaseAt: now + 7200000 },
  { id: 'bed-202-3', roomId: 'ward-202', number: '202-3', status: 'occupied', position: { x: 15, y: 0.6, z: 4 }, patient: { name: '孙某某', careLevel: 1, hasCompanion: false, cleaningStatus: 'clean' } },
  { id: 'bed-202-4', roomId: 'ward-202', number: '202-4', status: 'cleaning', position: { x: 21, y: 0.6, z: 4 }, cleaningPriority: 2, cleaningStartTime: now - 1500000, cleaningDurationMinutes: 35 },

  { id: 'bed-iso-1-1', roomId: 'iso-1', number: 'ISO-1', status: 'isolated', position: { x: 15, y: 0.6, z: 10 }, patient: { name: '胡某某', careLevel: 3, isolationMark: '呼吸道隔离', hasCompanion: false, cleaningStatus: 'dirty' } },
  { id: 'bed-iso-1-2', roomId: 'iso-1', number: 'ISO-2', status: 'isolated', position: { x: 21, y: 0.6, z: 10 }, patient: { name: '朱某某', careLevel: 2, isolationMark: '接触隔离', hasCompanion: false, cleaningStatus: 'clean' } },
  { id: 'bed-iso-2-1', roomId: 'iso-2', number: 'ISO-3', status: 'empty', position: { x: -3, y: 0.6, z: 18 } },
  { id: 'bed-iso-2-2', roomId: 'iso-2', number: 'ISO-4', status: 'isolated', position: { x: 3, y: 0.6, z: 18 }, patient: { name: '林某某', careLevel: 3, isolationMark: '飞沫隔离', hasCompanion: false, cleaningStatus: 'in_progress' } },

  { id: 'bed-em-1', roomId: 'emergency', number: 'EM-1', status: 'emergency', position: { x: -3, y: 0.6, z: -18 } },
  { id: 'bed-em-2', roomId: 'emergency', number: 'EM-2', status: 'occupied', position: { x: 3, y: 0.6, z: -18 }, patient: { name: '高某某', careLevel: 3, hasCompanion: true, cleaningStatus: 'clean' } },
];

export const CORRIDOR_SEGMENTS: CorridorSegment[] = [
  { id: 'cor-1', position: { x: 0, z: -14 }, size: { width: 10, depth: 8 }, pressureLevel: 3, isAvoidForIsolation: true },
  { id: 'cor-2', position: { x: 0, z: -5 }, size: { width: 10, depth: 10 }, pressureLevel: 2, needsDisinfection: true },
  { id: 'cor-3', position: { x: 0, z: 5 }, size: { width: 10, depth: 10 }, pressureLevel: 1, needsDisinfection: true },
  { id: 'cor-4', position: { x: 0, z: 15 }, size: { width: 10, depth: 8 }, pressureLevel: 2, isIsolationOnly: true },
];

export const ISOLATION_ELEVATOR_POSITION = { x: -3, z: 18 };
export const NORMAL_ELEVATOR_POSITION = { x: 8, z: -18 };

export const EXAMINATION_ROOM_POSITION = { x: 18, z: -18 };

export const TARGET_WARDS = [
  { id: 'surgery', name: '外科病区', position: { x: 28, z: -18 }, icon: '🏥' },
  { id: 'internal', name: '内科病区', position: { x: 28, z: 10 }, icon: '🩺' },
  { id: 'icu', name: 'ICU 病区', position: { x: -28, z: 18 }, icon: '💊' },
  { id: 'rehab', name: '康复病区', position: { x: -28, z: -10 }, icon: '🧘' },
];

