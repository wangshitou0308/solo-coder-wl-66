
import { useMemo } from 'react';
import { getGenusById } from '@/data/cloudGenera';
import { WEATHER_OPTIONS, WIND_DIRECTIONS, WIND_SCALE_DESCRIPTIONS, CLOUD_COVER_LEVELS } from '@/data/constants';
import type { WeatherType, WindDirection } from '@/types';
import { getCloudCoverLevel } from '@/utils/weatherUtils';
import { Thermometer, Droplets, Wind, Cloud, Eye, Mountain } from 'lucide-react';

interface Props {
  genusId: string;
  species: string;
  variety: string;
  cloudBaseHeight: number;
  cloudCover: number;
  weather: WeatherType;
  temperature: number;
  humidity: number;
  windDirection: WindDirection;
  windSpeed: number;
  onChange: (field: string, value: any) => void;
}

export default function WeatherForm(props: Props) {
  const genus = useMemo(() => getGenusById(props.genusId), [props.genusId]);
  const coverLevel = getCloudCoverLevel(props.cloudCover);
  const coverRange = CLOUD_COVER_LEVELS.find(
    (l) => props.cloudCover >= l.range[0] && props.cloudCover < l.range[1]
  );

  return (
    <div className="space-y-6">
      {genus && (genus.species.length > 0 || genus.varieties.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {genus.species.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Cloud size={16} className="text-sky-500" />
                细分种类 (Species)
              </label>
              <select
                className="input-field"
                value={props.species}
                onChange={(e) => props.onChange('species', e.target.value)}
              >
                <option value="">— 请选择种类（可选） —</option>
                {genus.species.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.description}
                  </option>
                ))}
              </select>
              {props.species && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed bg-sky-50/50 rounded-lg p-2.5 border border-sky-100">
                  💡 {genus.species.find((s) => s.id === props.species)?.description}
                </p>
              )}
            </div>
          )}
          {genus.varieties.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Eye size={16} className="text-violet-500" />
                变种 (Variety)
              </label>
              <select
                className="input-field"
                value={props.variety}
                onChange={(e) => props.onChange('variety', e.target.value)}
              >
                <option value="">— 请选择变种（可选） —</option>
                {genus.varieties.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.description}
                  </option>
                ))}
              </select>
              {props.variety && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed bg-violet-50/50 rounded-lg p-2.5 border border-violet-100">
                  💡 {genus.varieties.find((v) => v.id === props.variety)?.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Mountain size={16} className="text-indigo-500" />
            云底高度估算
            <span className="ml-auto font-mono text-indigo-600">
              {props.cloudBaseHeight >= 1000
                ? `${(props.cloudBaseHeight / 1000).toFixed(1)} km`
                : `${props.cloudBaseHeight} m`}
            </span>
          </label>
          <input
            type="range"
            className="range-slider"
            min={50}
            max={18000}
            step={50}
            value={props.cloudBaseHeight}
            onChange={(e) => props.onChange('cloudBaseHeight', Number(e.target.value))}
          />
          {genus && (
            <p className="text-xs text-slate-500 mt-2">
              📐 {genus.name}典型范围: {genus.altitudeMin / 1000}–{genus.altitudeMax / 1000}km
              {props.cloudBaseHeight < genus.altitudeMin && (
                <span className="text-amber-600 font-medium"> · ⚠️ 低于典型范围</span>
              )}
              {props.cloudBaseHeight > genus.altitudeMax && (
                <span className="text-amber-600 font-medium"> · ⚠️ 高于典型范围</span>
              )}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Cloud size={16} className="text-cyan-500" />
            云量占比
            <span className="ml-auto font-mono text-cyan-600">
              {props.cloudCover}% · {coverRange?.name || coverLevel.name}
            </span>
          </label>
          <input
            type="range"
            className="range-slider"
            min={0}
            max={100}
            step={5}
            value={props.cloudCover}
            onChange={(e) => props.onChange('cloudCover', Number(e.target.value))}
          />
          <div className="mt-2 h-2 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${props.cloudCover}%`,
                background: 'linear-gradient(90deg, #60A5FA, #06B6D4, #8B5CF6)',
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{coverLevel.desc}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3">☀️ 天气现象</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {WEATHER_OPTIONS.map((w) => (
            <button
              key={w.id}
              onClick={() => props.onChange('weather', w.id)}
              className={`chip !flex-col !py-3 !gap-1 ${props.weather === w.id ? 'selected' : ''}`}
              style={
                props.weather === w.id
                  ? { background: `linear-gradient(135deg, ${w.color}, ${w.color}cc)` }
                  : undefined
              }
            >
              <span className="text-2xl">{w.emoji}</span>
              <span className="font-bold">{w.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Thermometer size={16} className="text-orange-500" />
            温度 (°C)
          </label>
          <div className="relative">
            <input
              type="number"
              className="input-field !pr-12"
              step="0.1"
              value={props.temperature}
              onChange={(e) => props.onChange('temperature', Number(e.target.value))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 font-bold">°C</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Droplets size={16} className="text-blue-500" />
            相对湿度 (%)
          </label>
          <div className="relative">
            <input
              type="number"
              className="input-field !pr-12"
              min={0}
              max={100}
              value={props.humidity}
              onChange={(e) => props.onChange('humidity', Number(e.target.value))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-slate-400 font-bold">%</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Wind size={16} className="text-teal-500" />
            风向
          </label>
          <select
            className="input-field"
            value={props.windDirection}
            onChange={(e) => props.onChange('windDirection', e.target.value as WindDirection)}
          >
            {WIND_DIRECTIONS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}风 ({w.id}, {w.degree}°)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <Wind size={16} className="text-emerald-500" />
            风力等级 (0–12)
            <span className="ml-auto font-mono text-emerald-600">{props.windSpeed}级</span>
          </label>
          <input
            type="range"
            className="range-slider"
            min={0}
            max={12}
            value={props.windSpeed}
            onChange={(e) => props.onChange('windSpeed', Number(e.target.value))}
          />
          <p className="text-xs text-slate-500 mt-2">
            💨 {WIND_SCALE_DESCRIPTIONS[props.windSpeed]}
          </p>
        </div>
      </div>
    </div>
  );
}
