
import { useState } from 'react';
import { CLOUD_GENERA, getGenusById } from '@/data/cloudGenera';
import { FAMILY_NAMES } from '@/data/constants';
import type { CloudGenus, CloudFamily } from '@/types';
import { Check } from 'lucide-react';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function GenusSelector({ value, onChange }: Props) {
  const [family, setFamily] = useState<CloudFamily | 'all'>('all');
  const selected = getGenusById(value);
  const families: { key: CloudFamily | 'all'; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'high', label: FAMILY_NAMES.high + ' (5km+)' },
    { key: 'middle', label: FAMILY_NAMES.middle + ' (2-7km)' },
    { key: 'low', label: FAMILY_NAMES.low + ' (0-3km)' },
  ];

  const list = family === 'all' ? CLOUD_GENERA : CLOUD_GENERA.filter((g) => g.family === family);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {families.map((f) => (
          <button
            key={f.key}
            className={`chip ${family === f.key ? 'selected' : ''}`}
            onClick={() => setFamily(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {list.map((g) => {
          const active = value === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onChange(g.id)}
              className={`relative group rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 border-2 ${
                active
                  ? 'scale-105 shadow-2xl z-10'
                  : 'hover:-translate-y-1 hover:shadow-lg bg-white/50 border-transparent'
              }`}
              style={{
                background: active
                  ? `linear-gradient(135deg, ${g.color}22, white)`
                  : undefined,
                borderColor: active ? g.color : undefined,
              }}
            >
              {active && (
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg animate-float"
                  style={{ background: g.color }}
                >
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
              <div
                className="text-4xl sm:text-5xl mb-2 transition-transform duration-300"
                style={{ filter: active ? 'none' : 'saturate(0.7)' }}
              >
                {g.emoji}
              </div>
              <p
                className="font-display font-bold text-base sm:text-lg mb-0.5"
                style={{ color: active ? g.color : '#1E3A5F' }}
              >
                {g.name}
              </p>
              <p className="text-[11px] text-slate-500 font-mono font-medium">
                {g.abbreviation} · {g.latinName}
              </p>
              <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                {g.altitudeMin / 1000}–{g.altitudeMax / 1000}km
              </p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="glass-card !p-4 sm:!p-5 mt-4"
          style={{ borderLeft: `4px solid ${selected.color}` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 text-4xl sm:text-5xl shadow-lg"
              style={{ background: `linear-gradient(135deg, ${selected.color}30, ${selected.color}10)` }}
            >
              {selected.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-lg sm:text-xl mb-1" style={{ color: selected.color }}>
                {selected.name} <span className="text-xs text-slate-400 font-mono font-normal ml-1">{selected.abbreviation}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                {selected.description}
              </p>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                📏 云底高度 {selected.altitudeMin / 1000}–{selected.altitudeMax / 1000}km
                · ☔ {selected.precipitation.slice(0, 30)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
