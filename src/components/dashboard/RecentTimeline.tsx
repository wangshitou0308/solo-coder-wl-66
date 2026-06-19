
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { getGenusById } from '@/data/cloudGenera';
import { WEATHER_OPTIONS } from '@/data/constants';
import type { ObservationRecord } from '@/types';
import { formatDateTime, getRelativeTime } from '@/utils/dateUtils';
import { formatAltitude, formatTemperature, formatHumidity } from '@/utils/weatherUtils';
import { formatCoordinates } from '@/utils/geoUtils';
import { MapPin, Thermometer, Droplets, Wind, Clock } from 'lucide-react';

export default function RecentTimeline({ records }: { records: ObservationRecord[] }) {
  const navigate = useNavigate();
  const recent = records.slice(0, 5);

  if (recent.length === 0) {
    return (
      <Card animate delay={500}>
        <div className="text-center py-10">
          <div className="text-6xl mb-3 opacity-40">☁️</div>
          <p className="text-slate-500 font-medium">暂无观察记录</p>
          <p className="text-sm text-slate-400 mt-1">点击右上角开始你的第一次观云记录～</p>
        </div>
      </Card>
    );
  }

  return (
    <Card animate delay={500} className="!p-6 sm:!p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
            <Clock size={22} className="text-violet-500" />
            最近观察
          </h3>
          <p className="text-sm text-slate-500 mt-1">最新的5条观云记录</p>
        </div>
        <button
          className="btn-ghost text-sm"
          onClick={() => navigate('/records')}
        >
          查看全部 →
        </button>
      </div>

      <div className="relative">
        <div
          className="absolute left-6 sm:left-8 top-2 bottom-2 w-0.5"
          style={{
            background: 'linear-gradient(180deg, #3B82F6, #A78BFA, #F97316)',
          }}
        />
        <div className="space-y-4">
          {recent.map((r, i) => {
            const genus = getGenusById(r.genusId);
            const weather = WEATHER_OPTIONS.find((w) => w.id === r.weather);
            return (
              <div
                key={r.id}
                className="relative pl-14 sm:pl-20 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => navigate(`/record/${r.id}`)}
              >
                <div
                  className="absolute left-3 sm:left-5 top-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-base sm:text-lg shadow-lg border-2 border-white z-10 transition-transform group-hover:scale-110"
                  style={{ background: genus?.color || '#64748B' }}
                >
                  {genus?.emoji}
                </div>
                <div
                  className="glass-card !p-4 sm:!p-5 hover:!shadow-xl transition-all duration-300 group-hover:-translate-y-0.5"
                  style={{ borderLeft: `3px solid ${genus?.color || '#64748B'}` }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-display font-bold text-lg"
                          style={{ color: genus?.color }}
                        >
                          {genus?.name}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{genus?.abbreviation}</span>
                        {weather && (
                          <span
                            className="tag !text-xs"
                            style={{ background: `${weather.color}15`, color: weather.color }}
                          >
                            {weather.emoji} {weather.name}
                          </span>
                        )}
                      </div>
                      {r.species && (
                        <p className="text-xs text-slate-500 mt-1">
                          {genus?.species.find((s) => s.id === r.species)?.name}
                          {r.variety ? ` · ${genus?.varieties.find((v) => v.id === r.variety)?.name}` : ''}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {getRelativeTime(r.observedAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Thermometer size={14} className="text-orange-500" />
                      <span className="font-mono font-medium">{formatTemperature(r.temperature)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Droplets size={14} className="text-blue-500" />
                      <span className="font-mono font-medium">{formatHumidity(r.humidity)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Wind size={14} className="text-cyan-600" />
                      <span className="font-mono font-medium">云底 {formatAltitude(r.cloudBaseHeight)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 truncate">
                      <MapPin size={14} className="text-rose-500" />
                      <span className="truncate text-xs">{r.locationName || formatCoordinates(r.latitude, r.longitude)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 font-medium">
                    📅 {formatDateTime(r.observedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
