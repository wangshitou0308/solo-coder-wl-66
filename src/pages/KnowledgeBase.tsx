
import { useState } from 'react';
import { CLOUD_GENERA, getGeneraByFamily } from '@/data/cloudGenera';
import { FAMILY_NAMES } from '@/data/constants';
import type { CloudGenus, CloudFamily } from '@/types';
import { useCloudStore } from '@/store/useCloudStore';
import Card from '@/components/ui/Card';
import { BookOpen, CloudRain, Plane, Tag, CheckCircle2, Mountain, Info } from 'lucide-react';

type FamilyKey = CloudFamily | 'all';

export default function KnowledgeBase() {
  const [activeFamily, setActiveFamily] = useState<FamilyKey>('all');
  const [activeGenusId, setActiveGenusId] = useState<string>(CLOUD_GENERA[0].id);
  const records = useCloudStore((s) => s.records);

  const families: { key: FamilyKey; label: string; count: number }[] = [
    { key: 'all', label: '全部十属云', count: CLOUD_GENERA.length },
    { key: 'high', label: `高云族 · ${FAMILY_NAMES.high}`, count: getGeneraByFamily('high').length },
    { key: 'middle', label: `中云族 · ${FAMILY_NAMES.middle}`, count: getGeneraByFamily('middle').length },
    { key: 'low', label: `低云族 · ${FAMILY_NAMES.low}`, count: getGeneraByFamily('low').length },
  ];

  const visibleGenera = activeFamily === 'all' ? CLOUD_GENERA : getGeneraByFamily(activeFamily);
  const active: CloudGenus = CLOUD_GENERA.find((g) => g.id === activeGenusId) || CLOUD_GENERA[0];
  const recordCount = records.filter((r) => r.genusId === active.id).length;
  const discovered = recordCount > 0;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gradient-sky flex items-center gap-3">
          <BookOpen size={34} className="text-blue-500" />
          云图知识库
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          依据 WMO 国际云图（International Cloud Atlas）标准，系统化学习十属云分类知识
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 glass-card !p-3 animate-fade-in">
        {families.map((f) => (
          <button
            key={f.key}
            className={`nav-tab ${activeFamily === f.key ? 'active' : ''}`}
            onClick={() => {
              setActiveFamily(f.key);
              const first = f.key === 'all' ? CLOUD_GENERA[0] : getGeneraByFamily(f.key)[0];
              if (first) setActiveGenusId(first.id);
            }}
          >
            {f.label}
            <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 ml-1">
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-5">
        <div className="glass-card !p-3 sm:!p-4 h-fit lg:sticky lg:top-24 space-y-2 animate-fade-in">
          <p className="text-xs font-bold text-slate-500 px-2 py-1 mb-2 tracking-wide">云属速览</p>
          {visibleGenera.map((g) => {
            const count = records.filter((r) => r.genusId === g.id).length;
            const active = activeGenusId === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGenusId(g.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  active
                    ? 'text-white shadow-lg scale-[1.02]'
                    : 'hover:bg-white/80'
                }`}
                style={active ? { background: `linear-gradient(135deg, ${g.color}, ${g.color}cc)` } : undefined}
              >
                <span className="text-2xl">{g.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${active ? '' : 'text-slate-700'}`}>
                    {g.name}
                    <span className={`text-[10px] font-mono ml-1 ${active ? 'text-white/70' : 'text-slate-400'}`}>
                      {g.abbreviation}
                    </span>
                  </p>
                  <p className={`text-[11px] ${active ? 'text-white/80' : 'text-slate-400'}`}>
                    {g.altitudeMin / 1000}–{g.altitudeMax / 1000}km
                  </p>
                </div>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/25 text-white' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {count}次
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          <Card animate className="!p-6 sm:!p-8 overflow-hidden relative">
            <div
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: active.color }}
            />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8 mb-7">
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center shadow-2xl shrink-0 animate-float"
                  style={{
                    background: `linear-gradient(135deg, ${active.color}40, ${active.color}05)`,
                    border: `3px solid ${active.color}30`,
                  }}
                >
                  <span className="text-7xl sm:text-8xl">{active.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div>
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: active.color }}>
                        {FAMILY_NAMES[active.family]} · Family {active.family}
                      </p>
                      <h2 className="font-display font-bold text-4xl sm:text-5xl mt-1" style={{ color: active.color }}>
                        {active.name}
                      </h2>
                      <p className="font-mono text-sm text-slate-500 mt-1">
                        {active.latinName} <span className="font-bold text-slate-700">{active.abbreviation}</span>
                      </p>
                    </div>
                    {discovered ? (
                      <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">
                          已观察 {recordCount}次
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-2 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center gap-2">
                        <Info size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">待发现</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                      <Mountain size={14} style={{ color: active.color }} />
                      云底 {active.altitudeMin / 1000}–{active.altitudeMax / 1000} km
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5 sm:p-6 border-2" style={{ background: `${active.color}08`, borderColor: `${active.color}15` }}>
                <h3 className="font-display font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                  📖 标准描述
                </h3>
                <p className="text-slate-700 leading-[1.9] text-base">{active.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <CloudRain size={18} className="text-blue-600" />
                    ☔ 降水指示
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{active.precipitation}</p>
                </div>
                <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                  <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Plane size={18} className="text-indigo-600" />
                    ✈️ 航空气象意义
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{active.aviation}</p>
                </div>
              </div>
            </div>
          </Card>

          {active.species.length > 0 && (
            <Card animate delay={100}>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-5 flex items-center gap-2">
                <Tag size={20} className="text-violet-500" />
                细分种类 (Species) · {active.species.length}种
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {active.species.map((s, i) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 hover:shadow-md transition-shadow"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <p className="font-bold text-violet-800 mb-1 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-mono">
                        {i + 1}
                      </span>
                      {s.name}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed ml-8">{s.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {active.varieties.length > 0 && (
            <Card animate delay={200}>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-5 flex items-center gap-2">
                <SparklesIcon size={20} className="text-cyan-500" />
                变种类型 (Varieties) · {active.varieties.length}种
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {active.varieties.map((v) => (
                  <div
                    key={v.id}
                    className="group relative"
                  >
                    <div
                      className="px-4 py-2.5 rounded-xl border-2 font-bold text-sm cursor-help transition-all hover:scale-105 hover:shadow-lg"
                      style={{
                        background: `${active.color}08`,
                        borderColor: `${active.color}40`,
                        color: active.color,
                      }}
                    >
                      ✨ {v.name}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-xl glass-card text-xs text-slate-700 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all z-50 shadow-2xl">
                      {v.description}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}
