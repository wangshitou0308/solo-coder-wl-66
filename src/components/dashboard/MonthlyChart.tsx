
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import Card from '@/components/ui/Card';
import { CLOUD_GENERA, getGenusById } from '@/data/cloudGenera';
import type { MonthlyData } from '@/types';
import { getMonthLabel } from '@/utils/dateUtils';
import { TrendingUp } from 'lucide-react';

export default function MonthlyChart({ data }: { data: MonthlyData[] }) {
  const chartData = data.slice(-12).map((m) => ({
    month: getMonthLabel(m.month),
    total: m.total,
    ...Object.fromEntries(
      CLOUD_GENERA.map((g) => [g.id, m.byGenus[g.id] || 0])
    ),
  }));

  const genusColors = Object.fromEntries(CLOUD_GENERA.map((g) => [g.id, g.color]));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const items = payload.filter((p: any) => p.value > 0 && p.dataKey !== 'total');
    if (items.length === 0) return null;
    return (
      <div className="glass-card !p-4 shadow-xl !rounded-2xl min-w-[200px]">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1.5">
          {items.map((p: any) => {
            const g = getGenusById(p.dataKey);
            return (
              <div key={p.dataKey} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2">
                  <span>{g?.emoji}</span>
                  <span className="text-slate-600">{g?.name}</span>
                </span>
                <span className="font-bold" style={{ color: p.fill }}>
                  {p.value}次
                </span>
              </div>
            );
          })}
        </div>
        <div className="divider my-2" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">合计</span>
          <span className="font-bold text-slate-800">
            {payload.find((p: any) => p.dataKey === 'total')?.value || 0}次
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card animate delay={400} className="!p-5 sm:!p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
            <TrendingUp size={22} className="text-orange-500" />
            月度观云分布
          </h3>
          <p className="text-sm text-slate-500 mt-1">按云属颜色堆叠展示全年观察记录</p>
        </div>
      </div>
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap="18%">
            <defs>
              {CLOUD_GENERA.map((g) => (
                <linearGradient key={g.id} id={`grad-${g.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={g.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={g.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              formatter={(value: string) => {
                const g = getGenusById(value);
                return (
                  <span className="text-xs font-medium text-slate-600">
                    {g?.emoji} {g?.name}
                  </span>
                );
              }}
            />
            <Bar dataKey="total" stackId="a" barSize={28} radius={[8, 8, 0, 0]}>
              {chartData.map((_, idx) => (
                <Cell key={idx} fill="#3B82F6" />
              ))}
            </Bar>
            {CLOUD_GENERA.map((g) => (
              <Bar
                key={g.id}
                dataKey={g.id}
                stackId="a"
                hide
                fill={`url(#grad-${g.id})`}
              />
            ))}
            <Bar dataKey="placeholder" stackId="hidden" hide>
              {chartData.map((row, i) => {
                const entries = Object.entries(row).filter(
                  ([k, v]) => k !== 'month' && k !== 'total' && k !== 'placeholder' && (v as number) > 0
                );
                return <Cell key={i} fill={entries.length ? (genusColors[entries[0][0]] as string) : '#93C5FD'} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
