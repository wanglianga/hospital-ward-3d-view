import { useWardStore } from '@/store/useWardStore';
import { BED_STATUS_COLORS, BED_STATUS_LABELS, PRESSURE_COLORS, ROUTE_COLORS, ISOLATION_ZONE_COLORS } from '@/utils/colors';
import type { BedStatus } from '@/types';

const STATUS_ORDER: BedStatus[] = ['empty', 'occupied', 'cleaning', 'isolated', 'transfer', 'emergency'];

export function Legend() {
  const perspective = useWardStore((s) => s.perspective);
  const activeRoute = useWardStore((s) => s.activeRoute);

  return (
    <div className="fixed bottom-4 left-4 z-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4 min-w-[200px]">
        <div className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          状态图例
        </div>
        <div className="space-y-2">
          {STATUS_ORDER.map((status) => (
            <div key={status} className="flex items-center gap-2.5">
              <div
                className="w-3.5 h-3.5 rounded-md shadow-sm flex-shrink-0"
                style={{ backgroundColor: BED_STATUS_COLORS[status] }}
              />
              <span className="text-sm text-slate-600">{BED_STATUS_LABELS[status]}</span>
            </div>
          ))}
        </div>

        {perspective === 'transporter' && (
          <>
            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="text-xs font-semibold text-slate-600 mb-2">走廊转运压力</div>
              <div className="space-y-1.5">
                {[1, 2, 3].map((level) => (
                  <div key={level} className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: PRESSURE_COLORS[level] }}
                    />
                    <span className="text-xs text-slate-500">
                      {level === 1 ? '低压' : level === 2 ? '中压' : '高压'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="text-xs font-semibold text-slate-600 mb-2">转运路线</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ROUTE_COLORS.normal.main }}
                  />
                  <span className="text-xs text-slate-500">普通患者路线</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ROUTE_COLORS.isolation.main }}
                  />
                  <span className="text-xs text-slate-500">隔离患者专用路线</span>
                </div>
              </div>
            </div>

            {activeRoute?.type === 'isolation' && (
              <div className="mt-4 pt-3 border-t border-slate-200/60">
                <div className="text-xs font-semibold text-slate-600 mb-2">隔离路线标识</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: ISOLATION_ZONE_COLORS.disinfection, opacity: 0.6 }}
                    />
                    <span className="text-xs text-slate-500">需消杀区域</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: ISOLATION_ZONE_COLORS.avoid, opacity: 0.5 }}
                    />
                    <span className="text-xs text-slate-500">隔离患者避开</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: ISOLATION_ZONE_COLORS.isolationCorridor, opacity: 0.6 }}
                    />
                    <span className="text-xs text-slate-500">隔离专用电梯</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {perspective === 'cleaner' && (
          <>
            <div className="mt-4 pt-3 border-t border-slate-200/60">
              <div className="text-xs font-semibold text-slate-600 mb-2">清洁优先级</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((p) => (
                  <div
                    key={p}
                    className="flex-1 h-2 rounded-sm"
                    style={{
                      backgroundColor: `hsl(${30 - p * 5}, 90%, ${65 - p * 5}%)`,
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-400">低</span>
                <span className="text-[10px] text-slate-400">高</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <div className="text-xs font-semibold text-slate-600 mb-2">清洁倒计时</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-2 rounded-sm bg-red-500 flex-shrink-0" />
                  <span className="text-xs text-slate-500">即将完成 (≤5分钟)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-2 rounded-sm bg-orange-500 flex-shrink-0" />
                  <span className="text-xs text-slate-500">清洁中 (≤15分钟)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-2 rounded-sm bg-green-500 flex-shrink-0" />
                  <span className="text-xs text-slate-500">即将可接收 (≥80%)</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
