
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenusById } from '@/data/cloudGenera';
import { WEATHER_OPTIONS } from '@/data/constants';
import type { ObservationRecord } from '@/types';
import { formatDateTime, getRelativeTime } from '@/utils/dateUtils';
import { formatTemperature, formatHumidity, getCloudCoverLevel, formatAltitude, getWindName, getWindEmoji } from '@/utils/weatherUtils';
import { formatCoordinates } from '@/utils/geoUtils';
import { MapPin, Thermometer, Droplets, Wind, Mountain, Calendar, X, Trash2, Edit } from 'lucide-react';
import { useCloudStore } from '@/store/useCloudStore';

interface Props {
  record: ObservationRecord;
}

export default function RecordCard({ record }: Props) {
  const navigate = useNavigate();
  const deleteRecord = useCloudStore((s) => s.deleteRecord);
  const [showDetail, setShowDetail] = useState(false);
  const genus = getGenusById(record.genusId);
  const weather = WEATHER_OPTIONS.find((w) => w.id === record.weather);
  const coverLevel = getCloudCoverLevel(record.cloudCover);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条观察记录吗？')) {
      deleteRecord(record.id);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="glass-card !rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group animate-fade-in"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100">
          {record.photo ? (
            <img
              src={record.photo}
              alt={genus?.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${genus?.color}30, ${genus?.color}05)` }}
            >
              <span className="text-7xl opacity-60 animate-float">{genus?.emoji}</span>
            </div>
          )}
          <div
            className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-white font-bold text-xs"
            style={{ background: genus?.color || '#64748B' }}
          >
            <span className="text-base">{genus?.emoji}</span>
            <span>{genus?.name}</span>
            <span className="opacity-70 font-mono">{genus?.abbreviation}</span>
          </div>
          {weather && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg text-white"
              style={{ background: weather.color }}
            >
              <span>{weather.emoji}</span>
              <span>{weather.name}</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 p-3 text-white" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)' }}>
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] opacity-80 flex items-center gap-1 mb-0.5">
                  <Calendar size={11} />
                  {getRelativeTime(record.observedAt)}
                </p>
                <p className="text-xs font-mono opacity-90">{formatDateTime(record.observedAt)}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                云量 {record.cloudCover}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {(record.species || record.variety) && (
            <div className="flex flex-wrap gap-1.5">
              {record.species && (
                <span className="tag !text-[11px] bg-violet-50 text-violet-700">
                  {genus?.species.find((s) => s.id === record.species)?.name}
                </span>
              )}
              {record.variety && (
                <span className="tag !text-[11px] bg-cyan-50 text-cyan-700">
                  {genus?.varieties.find((v) => v.id === record.variety)?.name}
                </span>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Thermometer size={13} className="text-orange-500 shrink-0" />
              <span className="font-mono font-bold">{formatTemperature(record.temperature)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Droplets size={13} className="text-blue-500 shrink-0" />
              <span className="font-mono font-bold">{formatHumidity(record.humidity)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Mountain size={13} className="text-indigo-500 shrink-0" />
              <span className="font-mono font-bold">云底 {formatAltitude(record.cloudBaseHeight)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Wind size={13} className="text-teal-500 shrink-0" />
              <span className="font-mono font-bold truncate">
                {getWindEmoji(record.windSpeed)} {getWindName(record.windDirection)}{record.windSpeed}级
              </span>
            </div>
          </div>
          {record.locationName && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <MapPin size={12} className="text-rose-500 shrink-0" />
              <span className="truncate font-medium">{record.locationName}</span>
            </div>
          )}
        </div>
      </div>

      {showDetail && (
        <div className="modal-backdrop" onClick={() => setShowDetail(false)}>
          <div
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto glass-card !rounded-3xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative sticky top-0 z-10">
              <div className="aspect-video bg-slate-200 overflow-hidden">
                {record.photo ? (
                  <img src={record.photo} alt={genus?.name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${genus?.color}40, ${genus?.color}10)` }}
                  >
                    <span className="text-9xl opacity-70">{genus?.emoji}</span>
                  </div>
                )}
              </div>
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                onClick={() => setShowDetail(false)}
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.75))' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-3xl flex items-center gap-3">
                      <span className="text-4xl">{genus?.emoji}</span>
                      <span style={{ color: genus?.color }}>{genus?.name}</span>
                    </h3>
                    <p className="text-sm opacity-80 mt-1 font-mono">{genus?.latinName} · {genus?.abbreviation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <Edit size={17} />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-rose-500/80 hover:bg-rose-500 backdrop-blur-sm flex items-center justify-center"
                      onClick={handleDelete}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-6">
              {(record.species || record.variety) && (
                <div className="flex flex-wrap gap-2">
                  {record.species && (
                    <div className="px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100">
                      <span className="text-[11px] text-violet-500 font-bold block">种类</span>
                      <span className="text-sm font-bold text-violet-700">
                        {genus?.species.find((s) => s.id === record.species)?.name}
                      </span>
                    </div>
                  )}
                  {record.variety && (
                    <div className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-100">
                      <span className="text-[11px] text-cyan-500 font-bold block">变种</span>
                      <span className="text-sm font-bold text-cyan-700">
                        {genus?.varieties.find((v) => v.id === record.variety)?.name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Thermometer, label: '温度', value: formatTemperature(record.temperature), color: '#F97316' },
                  { icon: Droplets, label: '湿度', value: formatHumidity(record.humidity), color: '#3B82F6' },
                  { icon: Mountain, label: '云底高度', value: formatAltitude(record.cloudBaseHeight), color: '#6366F1' },
                  { icon: Wind, label: '风向风力', value: `${getWindName(record.windDirection)}风 ${record.windSpeed}级`, color: '#14B8A6' },
                  { icon: MapPin, label: '位置', value: record.locationName || formatCoordinates(record.latitude, record.longitude) || '未知', color: '#F43F5E' },
                  { icon: Calendar, label: '观察时间', value: formatDateTime(record.observedAt), color: '#8B5CF6' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15` }}
                    >
                      <item.icon size={17} style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800 font-mono break-words">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {record.notes && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-xs text-amber-600 font-bold mb-2">📝 观察备注</p>
                  <p className="text-sm text-amber-900 leading-relaxed">{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
