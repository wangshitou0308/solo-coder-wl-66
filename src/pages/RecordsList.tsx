
import { useState, useMemo } from 'react';
import { useCloudStore } from '@/store/useCloudStore';
import { CLOUD_GENERA } from '@/data/cloudGenera';
import { WEATHER_OPTIONS } from '@/data/constants';
import type { WeatherType, SortField, SortOrder } from '@/types';
import Card from '@/components/ui/Card';
import RecordCard from '@/components/record/RecordCard';
import {
  Search,
  Filter,
  X,
  CalendarCheck,
  CloudRain,
  Sparkles,
  RotateCcw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  Square,
  Trash2,
  Tag,
  Download,
  Star,
  Plus,
  ListChecks,
  XCircle,
} from 'lucide-react';

const SORT_OPTIONS: { key: SortField; label: string }[] = [
  { key: 'observedAt', label: '观察时间' },
  { key: 'cloudBaseHeight', label: '云底高度' },
  { key: 'cloudCover', label: '云量' },
  { key: 'temperature', label: '温度' },
  { key: 'createdAt', label: '创建时间' },
];

export default function RecordsList() {
  const {
    records,
    filters,
    setFilters,
    resetFilters,
    getFilteredRecords,
    getAllTags,
    deleteRecords,
    addTagsToRecords,
    exportRecords,
  } = useCloudStore();

  const [showFilters, setShowFilters] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBatchTagModal, setShowBatchTagModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchTagInput, setBatchTagInput] = useState('');

  const filtered = getFilteredRecords();
  const allTags = getAllTags();

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
  const toggleTag = (tag: string) => {
    const current = filters.tags || [];
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    setFilters({ tags: next });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchQuery: e.target.value || undefined });
  };

  const handleSort = (field: SortField) => {
    const currentField = filters.sortField || 'observedAt';
    const currentOrder = filters.sortOrder || 'desc';
    if (currentField === field) {
      setFilters({ sortOrder: currentOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ sortField: field, sortOrder: 'desc' });
    }
  };

  const toggleSortOrder = () => {
    const current = filters.sortOrder || 'desc';
    setFilters({ sortOrder: current === 'asc' ? 'desc' : 'asc' });
  };

  const toggleFavoriteOnly = () => {
    setFilters({ favoriteOnly: !filters.favoriteOnly });
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    deleteRecords(Array.from(selectedIds));
    setShowDeleteConfirm(false);
    exitSelectMode();
  };

  const handleBatchAddTags = () => {
    const tags = batchTagInput
      .split(/[,，;；\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 0) {
      addTagsToRecords(Array.from(selectedIds), tags);
    }
    setShowBatchTagModal(false);
    setBatchTagInput('');
  };

  const handleExport = () => {
    const ids = selectMode ? Array.from(selectedIds) : [];
    const csv = exportRecords(ids);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `观云记录_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasFilters =
    (filters.genera && filters.genera.length > 0) ||
    (filters.weather && filters.weather.length > 0) ||
    (filters.tags && filters.tags.length > 0) ||
    filters.startDate ||
    filters.endDate ||
    filters.searchQuery ||
    filters.favoriteOnly;

  const sortField = filters.sortField || 'observedAt';
  const sortOrder = filters.sortOrder || 'desc';

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.genera?.length) count += filters.genera.length;
    if (filters.weather?.length) count += filters.weather.length;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.searchQuery) count++;
    if (filters.favoriteOnly) count++;
    return count;
  }, [filters]);

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
            {selectMode && (
              <span> · 已选 <span className="font-bold text-violet-600">{selectedIds.size}</span> 条</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectMode ? (
            <>
              <button className="chip" onClick={selectAll}>
                {selectedIds.size === filtered.length && filtered.length > 0 ? (
                  <CheckSquare size={15} className="text-blue-600" />
                ) : (
                  <Square size={15} />
                )}
                {selectedIds.size === filtered.length && filtered.length > 0 ? '取消全选' : '全选'}
              </button>
              <button className="chip" onClick={handleExport}>
                <Download size={15} />
                导出选中
              </button>
              <button
                className="chip"
                onClick={() => setShowBatchTagModal(true)}
                disabled={selectedIds.size === 0}
              >
                <Tag size={15} />
                批量加标签
              </button>
              <button
                className="chip !border-rose-200 !text-rose-600 hover:!bg-rose-50"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={selectedIds.size === 0}
              >
                <Trash2 size={15} />
                批量删除
              </button>
              <button className="chip !border-slate-300 !text-slate-600" onClick={exitSelectMode}>
                <XCircle size={15} />
                退出多选
              </button>
            </>
          ) : (
            <>
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="input-field !pl-10 !py-2 !w-56"
                  placeholder="搜索地点、备注、云属..."
                  value={filters.searchQuery || ''}
                  onChange={handleSearch}
                />
                {filters.searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setFilters({ searchQuery: undefined })}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                className={`chip ${filters.favoriteOnly ? 'selected' : ''}`}
                onClick={toggleFavoriteOnly}
                style={filters.favoriteOnly ? { background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' } : undefined}
              >
                <Star size={15} fill={filters.favoriteOnly ? 'white' : 'none'} />
                仅看收藏
              </button>
              <button
                className={`chip ${showFilters ? 'selected' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={15} />
                筛选条件
                {activeFilterCount > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button className="chip" onClick={() => setSelectMode(true)}>
                <ListChecks size={15} />
                多选
              </button>
              {hasFilters && (
                <button className="chip" onClick={resetFilters}>
                  <RotateCcw size={15} />
                  重置
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!selectMode && (
        <div className="flex items-center gap-3 flex-wrap animate-fade-in">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500 font-medium">排序:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`chip !py-1 !px-2.5 !text-xs ${sortField === opt.key ? 'selected' : ''}`}
                  onClick={() => handleSort(opt.key)}
                >
                  {opt.label}
                  {sortField === opt.key && (
                    sortOrder === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="h-5 w-px bg-slate-200" />
          <button className="chip !py-1 !px-2.5 !text-xs" onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {sortOrder === 'asc' ? '升序' : '降序'}
          </button>
        </div>
      )}

      {!selectMode && allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap animate-fade-in">
          <Tag size={14} className="text-rose-500" />
          <span className="text-xs text-slate-500 font-medium">标签筛选:</span>
          {allTags.map((tag) => {
            const active = (filters.tags || []).includes(tag);
            return (
              <button
                key={tag}
                className={`chip !py-1 !px-2.5 !text-xs ${active ? 'selected' : ''}`}
                style={active ? { background: 'linear-gradient(135deg, #F43F5E, #FB7185)' } : undefined}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

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
                      style={active ? { background: `linear-gradient(135deg, ${w.color}, ${w.color}cc)`, borderColor: 'transparent' } : undefined}
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
              <RecordCard
                record={r}
                selectMode={selectMode}
                isSelected={selectedIds.has(r.id)}
                onSelect={toggleSelect}
              />
            </div>
          ))}
        </div>
      )}

      {showBatchTagModal && (
        <div className="modal-backdrop" onClick={() => setShowBatchTagModal(false)}>
          <div
            className="max-w-md w-full glass-card !rounded-3xl !p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-xl text-slate-800 mb-2 flex items-center gap-2">
              <Tag size={22} className="text-rose-500" />
              批量添加标签
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              为选中的 <b className="text-violet-600">{selectedIds.size}</b> 条记录添加标签，多个标签用逗号或空格分隔
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="input-field !pl-10"
                  placeholder="如: 日落, 航拍, 北京"
                  value={batchTagInput}
                  onChange={(e) => setBatchTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleBatchAddTags();
                  }}
                  autoFocus
                />
              </div>
              <button className="btn-primary" onClick={handleBatchAddTags}>
                <Plus size={16} />
                添加
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-slate-400">推荐标签:</span>
              {['日落', '航拍', '暴雨前', '旅行', '城市观察'].map((tag) => (
                <button
                  key={tag}
                  className="chip !py-0.5 !px-2 !text-xs"
                  onClick={() => setBatchTagInput((prev) => (prev ? `${prev}, ${tag}` : tag))}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="max-w-md w-full glass-card !rounded-3xl !p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <Trash2 size={32} className="text-rose-500" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-2">
                确认删除 {selectedIds.size} 条记录？
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                删除后无法恢复，这些记录的所有信息（包括照片、标签、备注）都将被永久移除。
              </p>
              <div className="flex items-center gap-3">
                <button className="btn-ghost flex-1" onClick={() => setShowDeleteConfirm(false)}>
                  取消
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}
                  onClick={handleBatchDelete}
                >
                  <Trash2 size={16} />
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
