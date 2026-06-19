
import { useNavigate } from 'react-router-dom';
import { getGenusById } from '@/data/cloudGenera';
import { WEATHER_OPTIONS } from '@/data/constants';
import type { ObservationRecord } from '@/types';
import { formatDateTime, getRelativeTime } from '@/utils/dateUtils';
import { formatTemperature, formatHumidity, getCloudCoverLevel, formatAltitude, getWindName, getWindEmoji } from '@/utils/weatherUtils';
import { formatCoordinates } from '@/utils/geoUtils';
import { MapPin, Thermometer, Droplets, Wind, Mountain, Calendar, Star, CheckSquare, Square, Tag } from 'lucide-react';
import { useCloudStore } from '@/store/useCloudStore';

interface Props {
  record: ObservationRecord;
  selectMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function RecordCard({ record, selectMode = false, isSelected = false, onSelect }: Props) {
  const navigate = useNavigate();
  const toggleFavorite = useCloudStore((s) => s.toggleFavorite);
  const genus = getGenusById(record.genusId);
  const weather = WEATHER_OPTIONS.find((w) => w.id === record.weather);
  const coverLevel = getCloudCoverLevel(record.cloudCover);

  const handleClick = () => {
    if (selectMode && onSelect) {
      onSelect(record.id);
    } else {
      navigate(`/record/${record.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(record.id);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(record.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`glass-card !rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group animate-fade-in relative ${
        isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      {selectMode && (
        <button
          className="absolute top-3 left-3 z-20 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          onClick={handleSelectClick}
        >
          {isSelected ? (
            <CheckSquare size={20} className="text-blue-600" />
          ) : (
            <Square size={20} className="text-slate-400" />
          )}
        </button>
      )}

      <button
        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        onClick={handleFavoriteClick}
      >
        <Star
          size={18}
          fill={record.isFavorite ? '#F59E0B' : 'none'}
          color={record.isFavorite ? '#F59E0B' : '#94A3B8'}
        />
      </button>

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
          className={`absolute flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-white font-bold text-xs ${
            selectMode ? 'top-3 left-14' : 'top-3 left-3'
          }`}
          style={{ background: genus?.color || '#64748B' }}
        >
          <span className="text-base">{genus?.emoji}</span>
          <span>{genus?.name}</span>
          <span className="opacity-70 font-mono">{genus?.abbreviation}</span>
        </div>
        {weather && (
          <div
            className="absolute flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg text-white"
            style={{ background: weather.color, bottom: selectMode ? '48px' : '48px', right: '3px', marginTop: '50px' }}
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
        {(record.species || record.variety || (record.tags && record.tags.length > 0)) && (
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
            {record.tags && record.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag !text-[11px] bg-rose-50 text-rose-600 flex items-center gap-1">
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {record.tags && record.tags.length > 3 && (
              <span className="tag !text-[11px] bg-slate-100 text-slate-500">
                +{record.tags.length - 3}
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
  );
}
