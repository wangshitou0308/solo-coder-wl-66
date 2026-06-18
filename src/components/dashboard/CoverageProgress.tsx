
import ProgressRing from '@/components/ui/ProgressRing';
import Card from '@/components/ui/Card';
import { CLOUD_GENERA } from '@/data/cloudGenera';
import type { GenusCoverage } from '@/types';
import { Eye, CheckCircle2 } from 'lucide-react';

export default function CoverageProgress({ data }: { data: GenusCoverage[] }) {
  const discoveredCount = data.filter((d) => d.count > 0).length;
  const percentage = Math.round((discoveredCount / CLOUD_GENERA.length) * 100);

  return (
    <Card animate delay={300} className="!p-6 sm:!p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
            <Eye size={22} className="text-blue-500" />
            云属收集进度
          </h3>
          <p className="text-sm text-slate-500 mt-1">WMO国际云图十属云分类</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50">
          <CheckCircle2 size={16} className="text-blue-600" />
          <span className="text-sm font-bold text-blue-700">{discoveredCount}/10</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <div className="shrink-0">
          <ProgressRing
            percent={percentage}
            size={200}
            stroke={16}
            label={`${percentage}%`}
            sublabel="收集完成度"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {CLOUD_GENERA.map((g) => {
              const cov = data.find((d) => d.genusId === g.id);
              const discovered = (cov?.count || 0) > 0;
              return (
                <div
                  key={g.id}
                  className={`relative rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 ${
                    discovered
                      ? 'shadow-lg scale-100 hover:scale-105'
                      : 'bg-slate-50/80 border border-dashed border-slate-200 opacity-60'
                  }`}
                  style={
                    discovered
                      ? { background: `linear-gradient(135deg, ${g.color}15, ${g.color}08)`, border: `2px solid ${g.color}40` }
                      : undefined
                  }
                >
                  <div
                    className="text-3xl sm:text-4xl mb-2"
                    style={{ filter: discovered ? 'none' : 'grayscale(1)' }}
                  >
                    {g.emoji}
                  </div>
                  <p
                    className="text-xs sm:text-sm font-bold mb-0.5"
                    style={{ color: discovered ? g.color : '#94A3B8' }}
                  >
                    {g.abbreviation}
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-600 truncate">
                    {g.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    {discovered ? `${cov?.count}次` : '待发现'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
