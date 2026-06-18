
import type { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  accent?: string;
  trend?: string;
  children?: ReactNode;
  delay?: number;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent = '#3B82F6',
  trend,
  children,
  delay = 0,
}: Props) {
  return (
    <div
      className="glass-card p-5 sm:p-6 animate-slide-up overflow-hidden relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ background: accent }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 4px 14px ${accent}40` }}
          >
            <Icon size={22} className="text-white" strokeWidth={2.2} />
          </div>
          {trend && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
              {trend}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 font-medium mb-1.5">{label}</p>
        <div className="flex items-baseline gap-1">
          <span
            className="font-display font-bold text-3xl sm:text-4xl leading-none"
            style={{ color: accent }}
          >
            {value}
          </span>
          {suffix && <span className="text-sm font-medium text-slate-500">{suffix}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}
