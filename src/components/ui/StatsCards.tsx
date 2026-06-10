import { useWardStore } from '@/store/useWardStore';
import { BED_STATUS_COLORS, BED_STATUS_LABELS } from '@/utils/colors';
import type { BedStatus } from '@/types';

const STATUS_ORDER: BedStatus[] = ['empty', 'occupied', 'cleaning', 'isolated', 'transfer', 'emergency'];

export function StatsCards() {
  const beds = useWardStore((s) => s.beds);

  const counts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = beds.filter((b) => b.status === status).length;
    return acc;
  }, {} as Record<BedStatus, number>);

  return (
    <div className="fixed top-4 left-4 z-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4">
        <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          床位状态统计
        </div>
        <div className="grid grid-cols-3 gap-2">
          {STATUS_ORDER.map((status) => (
            <div
              key={status}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50/80 hover:scale-105 transition-transform cursor-default"
            >
              <div
                className="w-6 h-6 rounded-lg shadow-inner mb-1.5"
                style={{ backgroundColor: BED_STATUS_COLORS[status] }}
              />
              <div className="text-lg font-bold text-slate-800">{counts[status]}</div>
              <div className="text-[10px] text-slate-500">{BED_STATUS_LABELS[status]}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">总床位</span>
          <span className="text-sm font-bold text-slate-800">{beds.length} 张</span>
        </div>
      </div>
    </div>
  );
}
