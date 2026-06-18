
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCloudStore } from '@/store/useCloudStore';
import StatCard from '@/components/dashboard/StatCard';
import CoverageProgress from '@/components/dashboard/CoverageProgress';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import RecentTimeline from '@/components/dashboard/RecentTimeline';
import { Calendar, Cloud, Flame, Sparkles } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { initSeed, records, getStatistics } = useCloudStore();

  useEffect(() => {
    initSeed();
  }, [initSeed]);

  const stats = getStatistics();
  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[today.getDay()];

  return (
    <div className="space-y-6">
      <div className="animate-slide-up overflow-hidden relative glass-card-dark !rounded-3xl p-8 sm:p-10">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-400/30 blur-3xl" />
        <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="text-sky-200/90 text-sm font-medium flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-yellow-300" />
              {dateStr} · {weekday} · {formatDate(today)}
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl mb-4">
              <span className="bg-gradient-to-r from-sky-200 via-white to-amber-200 bg-clip-text text-transparent">
                今日观云
              </span>
            </h1>
            <p className="text-sky-100/80 max-w-xl text-base leading-relaxed">
              记录每一朵云的形态，追寻天气的足迹。依据 WMO 国际云图分类体系，
              系统化观察和收藏你眼中的天空。
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <button className="btn-sunset !w-full md:!w-auto" onClick={() => navigate('/record/new')}>
              <Sparkles size={20} />
              立即记录观云
            </button>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-2xl font-display font-bold text-white">{stats.totalRecords}</p>
                <p className="text-xs text-sky-200/70 mt-0.5">总记录</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-2xl font-display font-bold text-white">{stats.uniqueGenusCount}</p>
                <p className="text-xs text-sky-200/70 mt-0.5">云属</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-2xl font-display font-bold text-white">{stats.streakDays}</p>
                <p className="text-xs text-sky-200/70 mt-0.5">连续天</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          icon={Cloud}
          label="观察记录总数"
          value={stats.totalRecords}
          suffix="次"
          accent="#3B82F6"
          delay={100}
        />
        <StatCard
          icon={Sparkles}
          label="已发现云属"
          value={`${stats.uniqueGenusCount}/10`}
          accent="#8B5CF6"
          trend={`${Math.round((stats.uniqueGenusCount / 10) * 100)}% 完成`}
          delay={150}
        />
        <StatCard
          icon={Calendar}
          label="本月观察"
          value={stats.thisMonthRecords}
          suffix="次"
          accent="#10B981"
          delay={200}
        />
        <StatCard
          icon={Flame}
          label="连续观察"
          value={stats.streakDays}
          suffix="天"
          accent="#F97316"
          delay={250}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <CoverageProgress data={stats.genusCoverage} />
        <MonthlyChart data={stats.monthlyDistribution} />
      </div>

      <RecentTimeline records={records} />
    </div>
  );
}
