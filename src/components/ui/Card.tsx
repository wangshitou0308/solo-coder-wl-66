
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  dark?: boolean;
  animate?: boolean;
  delay?: number;
}

export default function Card({ children, className = '', onClick, dark = false, animate = false, delay = 0 }: Props) {
  return (
    <div
      className={`${dark ? 'glass-card-dark' : 'glass-card'} p-5 sm:p-6 ${animate ? 'animate-slide-up' : ''} ${className}`}
      onClick={onClick}
      style={{
        ...(onClick ? { cursor: 'pointer' } : undefined),
        ...(animate && delay > 0 ? { animationDelay: `${delay}ms` } : undefined),
      }}
    >
      {children}
    </div>
  );
}
