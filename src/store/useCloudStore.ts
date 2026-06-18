
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ObservationRecord, Statistics, MonthlyData, GenusCoverage, RecordFilters } from '@/types';
import { CLOUD_GENERA } from '@/data/cloudGenera';
import { SEED_RECORDS } from '@/data/seedRecords';
import { generateId, formatMonth, getStreakDays } from '@/utils/dateUtils';

interface CloudState {
  records: ObservationRecord[];
  filters: RecordFilters;
  seedLoaded: boolean;
  addRecord: (r: Omit<ObservationRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, updates: Partial<ObservationRecord>) => void;
  deleteRecord: (id: string) => void;
  setFilters: (f: Partial<RecordFilters>) => void;
  resetFilters: () => void;
  initSeed: () => void;
  getStatistics: () => Statistics;
  getFilteredRecords: () => ObservationRecord[];
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

export const useCloudStore = create<CloudState>()(
  persist(
    (set, get) => ({
      records: [],
      filters: {},
      seedLoaded: false,
      addRecord: (r) => {
        const now = new Date().toISOString();
        const rec: ObservationRecord = { ...r, id: generateId(), createdAt: now, updatedAt: now };
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
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: {} }),
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
        return records.filter((r) => {
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
          return true;
        });
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
