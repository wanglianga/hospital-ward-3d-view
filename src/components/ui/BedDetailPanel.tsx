import {
  X,
  User,
  Heart,
  ShieldAlert,
  Clock,
  Users,
  Sparkles,
  AlertCircle,
  Navigation,
  Star,
} from 'lucide-react';
import { useWardStore } from '@/store/useWardStore';
import { BED_STATUS_COLORS, BED_STATUS_LABELS, CARE_LEVEL_LABELS } from '@/utils/colors';

const CLEANING_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  clean: { label: '已清洁', color: 'text-emerald-600 bg-emerald-50' },
  dirty: { label: '待清洁', color: 'text-orange-600 bg-orange-50' },
  in_progress: { label: '清洁中', color: 'text-blue-600 bg-blue-50' },
};

export function BedDetailPanel() {
  const selectedBedId = useWardStore((s) => s.selectedBedId);
  const beds = useWardStore((s) => s.beds);
  const selectBed = useWardStore((s) => s.selectBed);
  const startRouteToExamination = useWardStore((s) => s.startRouteToExamination);
  const perspective = useWardStore((s) => s.perspective);

  const bed = beds.find((b) => b.id === selectedBedId);

  if (!bed) return null;

  const statusColor = BED_STATUS_COLORS[bed.status];
  const now = Date.now();
  const isWillRelease = bed.willReleaseAt && bed.willReleaseAt - now < 7200000;
  const minutesToRelease = bed.willReleaseAt
    ? Math.max(0, Math.ceil((bed.willReleaseAt - now) / 60000))
    : 0;

  return (
    <div className="fixed top-20 right-4 z-30 w-80 animate-[slideIn_0.3s_ease-out]">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${statusColor}, ${statusColor}99)` }}
        />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-800">{bed.number}</h2>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: statusColor }}
                >
                  {BED_STATUS_LABELS[bed.status]}
                </span>
              </div>
              {isWillRelease && (
                <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-fit">
                  <Clock size={12} />
                  <span>预计 {minutesToRelease} 分钟后释放</span>
                </div>
              )}
              {bed.cleaningPriority && (
                <div className="flex items-center gap-1 text-xs mt-1">
                  <span className="text-slate-500">清洁优先级：</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((p) => (
                      <Star
                        key={p}
                        size={12}
                        className={
                          p <= (bed.cleaningPriority || 0)
                            ? 'fill-orange-400 text-orange-400'
                            : 'text-slate-200'
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => selectBed(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {bed.patient ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <User className="text-white" size={22} />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{bed.patient.name}</div>
                  <div className="text-xs text-slate-500">在床患者</div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Heart size={16} className="text-rose-500" />
                    <span className="text-sm">照护强度</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`w-2.5 h-6 rounded-full ${
                          level <= bed.patient!.careLevel
                            ? 'bg-gradient-to-t from-rose-500 to-rose-400'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-400 ml-2 -mt-1.5">
                  {CARE_LEVEL_LABELS[bed.patient.careLevel]}
                </div>

                {bed.patient.isolationMark && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 text-red-700">
                      <ShieldAlert size={16} />
                      <span className="text-sm font-medium">隔离标记</span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-lg font-medium">
                      {bed.patient.isolationMark}
                    </span>
                  </div>
                )}

                {bed.patient.estimatedTransferTime && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock size={16} />
                      <span className="text-sm">预计转运</span>
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      {bed.patient.estimatedTransferTime}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} className="text-indigo-500" />
                    <span className="text-sm">陪护情况</span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      bed.patient.hasCompanion
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {bed.patient.hasCompanion ? '有陪护' : '无陪护'}
                  </span>
                </div>

                {bed.patient.cleaningStatus && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Sparkles size={16} className="text-amber-500" />
                      <span className="text-sm">清洁状态</span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        CLEANING_STATUS_LABELS[bed.patient.cleaningStatus].color
                      }`}
                    >
                      {CLEANING_STATUS_LABELS[bed.patient.cleaningStatus].label}
                    </span>
                  </div>
                )}
              </div>

              {(perspective === 'transporter' || perspective === 'global') &&
                bed.status !== 'empty' &&
                bed.status !== 'emergency' && (
                  <button
                    onClick={() => startRouteToExamination(bed.id)}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Navigation size={18} />
                    规划到检查室的转运路线
                  </button>
                )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <AlertCircle className="text-slate-400" size={28} />
              </div>
              <p className="text-slate-500 text-sm">该床位暂无患者信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
