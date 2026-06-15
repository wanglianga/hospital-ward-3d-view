import { useEffect } from 'react';
import { WardScene } from '@/components/scene/WardScene';
import { PerspectiveSwitcher } from '@/components/ui/PerspectiveSwitcher';
import { StatsCards } from '@/components/ui/StatsCards';
import { Legend } from '@/components/ui/Legend';
import { BedDetailPanel } from '@/components/ui/BedDetailPanel';
import { useWardStore } from '@/store/useWardStore';
import { Activity, Info } from 'lucide-react';

export default function Home() {
  const activeRoute = useWardStore((s) => s.activeRoute);
  const perspective = useWardStore((s) => s.perspective);
  const tick = useWardStore((s) => s.tick);

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const perspectiveDescriptions: Record<string, string> = {
    global: '查看病区整体布局和所有床位状态',
    nurse: '高亮显示 2 小时内即将释放的床位',
    transporter: '走廊转运压力热力图 + 床位悬停可规划转运路线',
    cleaner: '待清洁床位按优先级高亮排序显示',
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full h-full">
        <WardScene />
      </div>

      <PerspectiveSwitcher />
      <StatsCards />
      <Legend />
      <BedDetailPanel />

      <div className="fixed bottom-4 right-4 z-20 max-w-xs">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-700">当前视角</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {perspectiveDescriptions[perspective]}
          </p>
          {activeRoute && (
            <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
              <Activity size={14} className="text-blue-500 animate-pulse" />
              <span className="text-xs text-blue-600 font-medium">
                转运路线规划中 · 预计 {activeRoute.estimatedMinutes} 分钟
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="fixed top-4 right-4 z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">医院病区三维视图</div>
            <div className="text-[10px] text-slate-500">Ward 3D Visualization</div>
          </div>
        </div>
      </div>
    </div>
  );
}
