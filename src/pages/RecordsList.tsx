
import { useState } from 'react';
import { useCloudStore } from '@/store/useCloudStore';
import { CLOUD_GENERA } from '@/data/cloudGenera';
import { WEATHER_OPTIONS } from '@/data/constants';
import type { WeatherType } from '@/types';
import Card from '@/components/ui/Card';
import RecordCard from '@/components/record/RecordCard';
import { Search, Filter, X, CalendarCheck, CloudRain, Sparkles, RotateCcw } from 'lucide-react';

export default function RecordsList() {
  const { records, filters, setFilters, resetFilters, getFilteredRecords } = useCloudStore();
  const [showFilters, setShowFilters] = useState(false);
  const filtered = getFilteredRecords();

  const toggleGenus = (id: string) => {
    const current = filters.genera || [];
    const next = current.includes(id) ? current.filter((g) => g !== id) : [...current, id];
    setFilters({ genera: next });
  };
  const toggleWeather = (id: WeatherType) => {
    const current = filters.weather || [];
    const next = current.includes(id) ? current.filter((w) => w !== id) : [...current, id];
    setFilters({ weather: next });
  };

  const hasFilters =
    (filters.genera && filters.genera.length > 0) ||
    (filters.weather && filters.weather.length > 0) ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-gradient-sky">
            历史观察记录
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            共 <span className="font-bold text-slate-700">{records.length}</span> 条记录
            {hasFilters && (
              <span> · 筛选后 <span className="font-bold text-blue-600">{filtered.length}</span> 条</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className={`chip ${showFilters ? 'selected' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={15} />
            筛选条件
          </button>
          {hasFilters && (
            <button className="chip" onClick={resetFilters}>
              <RotateCcw size={15} />
              重置筛选
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card animate className="!p-5 sm:!p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <CalendarCheck size={16} className="text-blue-500" />
                日期范围
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">开始日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={filters.startDate || ''}
                    onChange={(e) => setFilters({ startDate: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">结束日期</label>
                  <input
                    type="date"
                    className="input-field"
                    value={filters.endDate || ''}
                    onChange={(e) => setFilters({ endDate: e.target.value || undefined })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-violet-500" />
                云属多选
                {filters.genera && filters.genera.length > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">
                    已选 {filters.genera.length}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {CLOUD_GENERA.map((g) => {
                  const active = (filters.genera || []).includes(g.id);
                  return (
                    <button
                      key={g.id}
                      className={`chip !py-1.5 !px-3 !text-xs ${active ? 'selected' : ''}`}
                      style={active ? { background: g.color, borderColor: 'transparent' } : undefined}
                      onClick={() => toggleGenus(g.id)}
                    >
                      <span>{g.emoji}</span>
                      <span>{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <CloudRain size={16} className="text-cyan-500" />
                天气现象
              </label>
              <div className="flex flex-wrap gap-3">
                {WEATHER_OPTIONS.map((w) => {
                  const active = (filters.weather || []).includes(w.id);
                  return (
                    <button
                      key={w.id}
                      className={`chip !py-2 !px-4 ${active ? 'selected' : ''}`}
                      style={active ? { background: w.color, borderColor: 'transparent' } : undefined}
                      onClick={() => toggleWeather(w.id)}
                    >
                      <span className="text-lg">{w.emoji}</span>
                      <span className="font-bold">{w.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card animate>
          <div className="text-center py-16">
            <div className="text-7xl mb-4 opacity-40">🔍</div>
            <h3 className="font-display font-bold text-xl text-slate-700 mb-2">没有找到匹配的记录</h3>
            <p className="text-slate-500">
              {hasFilters ? '尝试调整或清除筛选条件' : '开始创建你的第一条观云记录吧'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((r, i) => (
            <div key={r.id} style={{ animationDelay: `${i * 40}ms` }}>
              <RecordCard record={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
