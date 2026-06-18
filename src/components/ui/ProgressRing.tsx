
interface Props {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  percent,
  size = 180,
  stroke = 14,
  color = '#3B82F6',
  bgColor = 'rgba(148, 163, 184, 0.2)',
  label,
  sublabel,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const id = `ring-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="font-display font-bold text-3xl sm:text-4xl text-gradient-sky">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
