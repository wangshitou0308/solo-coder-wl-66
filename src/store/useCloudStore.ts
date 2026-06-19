
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ObservationRecord, Statistics, MonthlyData, GenusCoverage, RecordFilters, SortField, SortOrder } from '@/types';
import { CLOUD_GENERA, getGenusById } from '@/data/cloudGenera';
import { SEED_RECORDS } from '@/data/seedRecords';
import { WEATHER_OPTIONS } from '@/data/constants';
import { generateId, formatMonth, getStreakDays } from '@/utils/dateUtils';

interface CloudState {
  records: ObservationRecord[];
  filters: RecordFilters;
  seedLoaded: boolean;
  addRecord: (r: Omit<ObservationRecord, 'id' | 'createdAt' | 'updatedAt' | 'tags' | 'isFavorite'> & { tags?: string[]; isFavorite?: boolean }) => void;
  updateRecord: (id: string, updates: Partial<ObservationRecord>) => void;
  deleteRecord: (id: string) => void;
  deleteRecords: (ids: string[]) => void;
  setFilters: (f: Partial<RecordFilters>) => void;
  resetFilters: () => void;
  initSeed: () => void;
  getStatistics: () => Statistics;
  getFilteredRecords: () => ObservationRecord[];
  toggleFavorite: (id: string) => void;
  addTagsToRecord: (id: string, tags: string[]) => void;
  removeTagFromRecord: (id: string, tag: string) => void;
  addTagsToRecords: (ids: string[], tags: string[]) => void;
  exportRecords: (ids: string[]) => string;
  getRecordById: (id: string) => ObservationRecord | undefined;
  getAllTags: () => string[];
  setSort: (field: SortField, order: SortOrder) => void;
}

const buildMonthlyDistribution = (records: ObservationRecord[]): MonthlyData[] => {
  const map = new Map<string, MonthlyData>();
  const year = new Date().getFullYear();
  for (let i = 0; i < 12; i++) {
    const m = `${year}-${String(i + 1).padStart(2, '0')}`;
    map.set(m, { month: m, total: 0, byGenus: {} });
  }
  for (const r of records) {
    const key = formatMonth(r.observedAt);
    if (!map.has(key)) map.set(key, { month: key, total: 0, byGenus: {} });
    const entry = map.get(key)!;
    entry.total++;
    entry.byGenus[r.genusId] = (entry.byGenus[r.genusId] || 0) + 1;
  }
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
};

const buildGenusCoverage = (records: ObservationRecord[]): GenusCoverage[] => {
  return CLOUD_GENERA.map((g) => {
    const count = records.filter((r) => r.genusId === g.id).length;
    return {
      genusId: g.id,
      count,
      percentage: records.length === 0 ? 0 : (count / records.length) * 100,
    };
  });
};

export const exportToJSON = (records: ObservationRecord[]): string => {
  return JSON.stringify(records, null, 2);
};

export const exportToCSV = (records: ObservationRecord[]): string => {
  const headers = [
    'ID', '观察时间', '云属', '云属(拉丁)', '种类', '变种',
    '云底高度(m)', '云量(%)', '天气', '温度(°C)', '湿度(%)',
    '风向', '风力(级)', '位置', '纬度', '经度', '标签', '收藏', '备注'
  ];
  const rows = records.map((r) => {
    const genus = getGenusById(r.genusId);
    const species = genus?.species.find((s) => s.id === r.species)?.name || '';
    const variety = genus?.varieties.find((v) => v.id === r.variety)?.name || '';
    const weather = WEATHER_OPTIONS.find((w) => w.id === r.weather)?.name || r.weather;
    return [
      r.id,
      r.observedAt,
      genus?.name || r.genusId,
      genus?.latinName || '',
      species,
      variety,
      r.cloudBaseHeight,
      r.cloudCover,
      weather,
      r.temperature,
      r.humidity,
      r.windDirection,
      r.windSpeed,
      r.locationName || '',
      r.latitude ?? '',
      r.longitude ?? '',
      (r.tags || []).join(';'),
      r.isFavorite ? '是' : '否',
      (r.notes || '').replace(/\n/g, ' '),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
};

export const useCloudStore = create<CloudState>()(
  persist(
    (set, get) => ({
      records: [],
      filters: { sortField: 'observedAt', sortOrder: 'desc' },
      seedLoaded: false,
      addRecord: (r) => {
        const now = new Date().toISOString();
        const rec: ObservationRecord = {
          ...r,
          tags: r.tags || [],
          isFavorite: r.isFavorite || false,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ records: [rec, ...s.records] }));
      },
      updateRecord: (id, updates) => {
        const now = new Date().toISOString();
        set((s) => ({
          records: s.records.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: now } : r
          ),
        }));
      },
      deleteRecord: (id) => {
        set((s) => ({ records: s.records.filter((r) => r.id !== id) }));
      },
      deleteRecords: (ids) => {
        const idSet = new Set(ids);
        set((s) => ({ records: s.records.filter((r) => !idSet.has(r.id)) }));
      },
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: { sortField: 'observedAt', sortOrder: 'desc' } }),
      initSeed: () => {
        if (get().seedLoaded) return;
        set({ records: SEED_RECORDS, seedLoaded: true });
      },
      getStatistics: () => {
        const { records } = get();
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const thisMonthRecords = records.filter((r) => formatMonth(r.observedAt) === currentMonth).length;
        const uniqueGenusCount = new Set(records.map((r) => r.genusId)).size;
        const streakDays = getStreakDays(records.map((r) => r.observedAt));
        return {
          totalRecords: records.length,
          uniqueGenusCount,
          thisMonthRecords,
          streakDays,
          genusCoverage: buildGenusCoverage(records),
          monthlyDistribution: buildMonthlyDistribution(records),
        };
      },
      getFilteredRecords: () => {
        const { records, filters } = get();
        let result = records.filter((r) => {
          const obs = new Date(r.observedAt);
          if (filters.startDate) {
            const s = new Date(filters.startDate);
            if (obs < s) return false;
          }
          if (filters.endDate) {
            const e = new Date(filters.endDate);
            e.setHours(23, 59, 59);
            if (obs > e) return false;
          }
          if (filters.genera && filters.genera.length > 0 && !filters.genera.includes(r.genusId)) return false;
          if (filters.weather && filters.weather.length > 0 && !filters.weather.includes(r.weather)) return false;
          if (filters.tags && filters.tags.length > 0) {
            const recordTags = r.tags || [];
            const hasAllTags = filters.tags.every((t) => recordTags.includes(t));
            if (!hasAllTags) return false;
          }
          if (filters.favoriteOnly && !r.isFavorite) return false;
          if (filters.searchQuery && filters.searchQuery.trim()) {
            const q = filters.searchQuery.toLowerCase().trim();
            const genus = getGenusById(r.genusId);
            const speciesName = genus?.species.find((s) => s.id === r.species)?.name || '';
            const varietyName = genus?.varieties.find((v) => v.id === r.variety)?.name || '';
            const weatherName = WEATHER_OPTIONS.find((w) => w.id === r.weather)?.name || '';
            const searchable = [
              r.locationName || '',
              r.notes || '',
              genus?.name || '',
              genus?.latinName || '',
              genus?.abbreviation || '',
              speciesName,
              varietyName,
              weatherName,
              ...(r.tags || []),
            ].join(' ').toLowerCase();
            if (!searchable.includes(q)) return false;
          }
          return true;
        });
        const sortField = filters.sortField || 'observedAt';
        const sortOrder = filters.sortOrder || 'desc';
        result = [...result].sort((a, b) => {
          let va: number | string = 0;
          let vb: number | string = 0;
          switch (sortField) {
            case 'observedAt':
              va = new Date(a.observedAt).getTime();
              vb = new Date(b.observedAt).getTime();
              break;
            case 'cloudBaseHeight':
              va = a.cloudBaseHeight;
              vb = b.cloudBaseHeight;
              break;
            case 'cloudCover':
              va = a.cloudCover;
              vb = b.cloudCover;
              break;
            case 'temperature':
              va = a.temperature;
              vb = b.temperature;
              break;
            case 'createdAt':
              va = new Date(a.createdAt).getTime();
              vb = new Date(b.createdAt).getTime();
              break;
          }
          if (va < vb) return sortOrder === 'asc' ? -1 : 1;
          if (va > vb) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
        return result;
      },
      toggleFavorite: (id) => {
        set((s) => ({
          records: s.records.map((r) =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },
      addTagsToRecord: (id, tags) => {
        set((s) => ({
          records: s.records.map((r) => {
            if (r.id !== id) return r;
            const existing = new Set(r.tags || []);
            tags.forEach((t) => existing.add(t));
            return { ...r, tags: Array.from(existing), updatedAt: new Date().toISOString() };
          }),
        }));
      },
      removeTagFromRecord: (id, tag) => {
        set((s) => ({
          records: s.records.map((r) =>
            r.id === id ? { ...r, tags: (r.tags || []).filter((t) => t !== tag), updatedAt: new Date().toISOString() } : r
          ),
        }));
      },
      addTagsToRecords: (ids, tags) => {
        const idSet = new Set(ids);
        set((s) => ({
          records: s.records.map((r) => {
            if (!idSet.has(r.id)) return r;
            const existing = new Set(r.tags || []);
            tags.forEach((t) => existing.add(t));
            return { ...r, tags: Array.from(existing), updatedAt: new Date().toISOString() };
          }),
        }));
      },
      exportRecords: (ids) => {
        const idSet = new Set(ids);
        const toExport = ids.length > 0 ? get().records.filter((r) => idSet.has(r.id)) : get().records;
        return exportToCSV(toExport);
      },
      getRecordById: (id) => get().records.find((r) => r.id === id),
      getAllTags: () => {
        const tagSet = new Set<string>();
        get().records.forEach((r) => (r.tags || []).forEach((t) => tagSet.add(t)));
        return Array.from(tagSet).sort();
      },
      setSort: (field, order) => {
        set((s) => ({ filters: { ...s.filters, sortField: field, sortOrder: order } }));
      },
    }),
    {
      name: 'cloud-observation-store',
      partialize: (state) => ({
        records: state.records,
        seedLoaded: state.seedLoaded,
      }),
    }
  )
);
