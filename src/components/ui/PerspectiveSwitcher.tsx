import { Globe, Stethoscope, Truck, Sparkles } from 'lucide-react';
import { useWardStore } from '@/store/useWardStore';
import type { Perspective } from '@/types';

const PERSPECTIVES: { key: Perspective; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'global', label: '全局视角', icon: <Globe size={18} />, description: '总览病区布局' },
  { key: 'nurse', label: '护士站视角', icon: <Stethoscope size={18} />, description: '即将释放床位' },
  { key: 'transporter', label: '转运员视角', icon: <Truck size={18} />, description: '转运路线规划' },
  { key: 'cleaner', label: '保洁视角', icon: <Sparkles size={18} />, description: '待清洁优先级' },
];

export function PerspectiveSwitcher() {
  const perspective = useWardStore((s) => s.perspective);
  const setPerspective = useWardStore((s) => s.setPerspective);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 px-2 py-2 flex gap-1">
        {PERSPECTIVES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPerspective(p.key)}
            className={`px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 group relative ${
              perspective === p.key
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                : 'text-slate-600 hover:bg-slate-100/80'
            }`}
          >
            {p.icon}
            <span className="text-sm font-medium">{p.label}</span>
            {perspective !== p.key && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {p.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
