import { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  MapPin,
  Stethoscope,
  Building2,
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
  const startRouteToTargetWard = useWardStore((s) => s.startRouteToTargetWard);
  const targetWards = useWardStore((s) => s.targetWards);
  const perspective = useWardStore((s) => s.perspective);
  const activeRoute = useWardStore((s) => s.activeRoute);
  const routeEndName = useWardStore((s) => s.routeEndName);
  const routeStartBedId = useWardStore((s) => s.routeStartBedId);
  const getCleaningRemainingMinutes = useWardStore((s) => s.getCleaningRemainingMinutes);
  const getCleaningProgress = useWardStore((s) => s.getCleaningProgress);
  const storeNow = useWardStore((s) => s.now);
  const isIsolationBed = useWardStore((s) => s.isIsolationBed);

  const [showTargetWards, setShowTargetWards] = useState(false);

  const bed = beds.find((b) => b.id === selectedBedId);

  if (!bed) return null;

  const statusColor = BED_STATUS_COLORS[bed.status];
  const isWillRelease = bed.willReleaseAt && bed.willReleaseAt - storeNow < 7200000;
  const minutesToRelease = bed.willReleaseAt
    ? Math.max(0, Math.ceil((bed.willReleaseAt - storeNow) / 60000))
    : 0;

  const cleaningRemaining = getCleaningRemainingMinutes(bed.id);
  const cleaningProgress = getCleaningProgress(bed.id);
  const bedIsIsolation = isIsolationBed(bed.id);

  const formatCleaningTime = (minutes: number): string => {
    if (minutes >= 60) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hrs}小时${mins}分钟` : `${hrs}小时`;
    }
    return `${minutes}分钟`;
  };

  const showRouteSection =
    (perspective === 'transporter' || perspective === 'global') &&
    bed.status !== 'empty' &&
    bed.status !== 'emergency';

  const isCurrentRouteBed = !!(activeRoute && bed.id === routeStartBedId);

  return (
    <div className="fixed top-20 right-4 z-30 w-80 animate-[slideIn_0.3s_ease-out] max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${statusColor}, ${statusColor}99)` }}
        />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-xl font-bold text-slate-800">{bed.number}</h2>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: statusColor }}
                >
                  {BED_STATUS_LABELS[bed.status]}
                </span>
              </div>
              {isWillRelease && (
                <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg w-fit mt-1.5">
                  <Clock size={12} />
                  <span>预计 {minutesToRelease} 分钟后释放</span>
                </div>
              )}
              {bed.cleaningPriority && (
                <div className="flex items-center gap-1 text-xs mt-1.5">
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
              {bed.status === 'cleaning' && cleaningRemaining !== null && (
                <div className="mt-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-orange-700">
                      <Clock size={14} />
                      <span className="text-xs font-medium">清洁倒计时</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">
                      {cleaningRemaining > 0 ? formatCleaningTime(cleaningRemaining) : '即将完成'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cleaningProgress >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : cleaningProgress >= 50
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-orange-400 to-red-500'
                      }`}
                      style={{ width: `${cleaningProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-500">{Math.round(cleaningProgress)}% 完成</span>
                    <span className="text-[10px] text-slate-500">
                      {cleaningRemaining > 0
                        ? `预计 ${formatCleaningTime(cleaningRemaining)} 后可接收新患者`
                        : '可接收新患者'}
                    </span>
                  </div>
                </div>
              )}
              {bedIsIsolation && (
                <div className="flex items-center gap-1.5 text-xs mt-1.5 text-purple-600 bg-purple-50 px-2 py-1 rounded-lg w-fit">
                  <ShieldAlert size={12} />
                  <span className="font-medium">隔离患者 · 使用专用路线转运</span>
                </div>
              )}
              {isCurrentRouteBed && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit mt-1.5 animate-pulse">
                  <Navigation size={12} />
                  <span>前往{routeEndName || '目的地'}路线中</span>
                </div>
              )}
            </div>
            <button
              onClick={() => selectBed(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {bed.patient ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                  <User className="text-white" size={22} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{bed.patient.name}</div>
                  <div className="text-xs text-slate-500">在床患者</div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Heart size={16} className="text-rose-500 flex-shrink-0" />
                      <span className="text-sm">照护强度</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`w-2.5 h-6 rounded-full transition-all ${
                            level <= bed.patient!.careLevel
                              ? 'bg-gradient-to-t from-rose-500 to-rose-400 shadow-sm shadow-rose-200'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 ml-2 mt-1">
                    {CARE_LEVEL_LABELS[bed.patient.careLevel]}
                  </div>
                </div>

                {bed.patient.isolationMark && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 text-red-700">
                      <ShieldAlert size={16} className="flex-shrink-0" />
                      <span className="text-sm font-medium">隔离标记</span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-lg font-medium">
                      {bed.patient.isolationMark}
                    </span>
                  </div>
                )}

                {bed.patient.estimatedTransferTime && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock size={16} className="flex-shrink-0" />
                      <span className="text-sm">预计转运</span>
                    </div>
                    <span className="text-sm font-medium text-blue-700">
                      {bed.patient.estimatedTransferTime}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} className="text-indigo-500 flex-shrink-0" />
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

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Sparkles size={16} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm">清洁状态</span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      CLEANING_STATUS_LABELS[bed.patient.cleaningStatus || 'clean'].color
                    }`}
                  >
                    {CLEANING_STATUS_LABELS[bed.patient.cleaningStatus || 'clean'].label}
                  </span>
                </div>
              </div>

              {showRouteSection && (
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5">
                    <Navigation size={14} className="text-blue-500" />
                    转运路线规划
                  </div>

                  <button
                    onClick={() => startRouteToExamination(bed.id)}
                    className={`w-full mb-2 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] ${
                      isCurrentRouteBed && routeEndName === '检查室'
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                    }`}
                  >
                    <Stethoscope size={16} />
                    {isCurrentRouteBed && routeEndName === '检查室' ? '✓ 前往检查室' : '规划到检查室路线'}
                  </button>

                  <button
                    onClick={() => setShowTargetWards(!showTargetWards)}
                    className="w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-all bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <Building2 size={15} />
                    选择目标病区
                    {showTargetWards ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {showTargetWards && (
                    <div className="mt-2 grid grid-cols-2 gap-2 animate-[fadeIn_0.2s_ease-out]">
                      {targetWards.map((ward) => (
                        <button
                          key={ward.id}
                          onClick={() => {
                            startRouteToTargetWard(bed.id, ward.id);
                            setShowTargetWards(false);
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all border ${
                            isCurrentRouteBed && routeEndName === ward.name
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-white hover:bg-indigo-50 border-slate-200 hover:border-indigo-200 text-slate-700'
                          }`}
                        >
                          <div className="text-lg mb-0.5">{ward.icon}</div>
                          <div className="text-xs font-medium">{ward.name}</div>
                          <div className="flex items-center gap-0.5 text-[10px] text-slate-400 mt-0.5">
                            <MapPin size={9} />
                            病区入口
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
