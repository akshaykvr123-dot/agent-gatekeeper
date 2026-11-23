import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'allow' | 'ask' | 'block' | 'primary';
  badge?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  badge,
  onClick,
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-800 hover:border-slate-700',
      iconBg: 'bg-slate-800 text-slate-300',
      valueColor: 'text-white',
    },
    primary: {
      border: 'border-blue-900/40 hover:border-blue-700/60',
      iconBg: 'bg-blue-500/10 text-blue-400',
      valueColor: 'text-white',
    },
    allow: {
      border: 'border-emerald-900/30 hover:border-emerald-600/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    ask: {
      border: 'border-amber-900/30 hover:border-amber-600/50',
      iconBg: 'bg-amber-500/10 text-amber-400',
      valueColor: 'text-amber-400',
    },
    block: {
      border: 'border-rose-900/30 hover:border-rose-600/50',
      iconBg: 'bg-rose-500/10 text-rose-400',
      valueColor: 'text-rose-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-[#111827]/80 backdrop-blur-sm border p-5 transition-all duration-200 ${
        style.border
      } ${onClick ? 'cursor-pointer hover:bg-[#151f33]' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <div className={`rounded-lg p-2 ${style.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className={`text-2xl font-bold tracking-tight font-mono ${style.valueColor}`}>
          {value}
        </div>
        {badge && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 truncate">{subtitle}</p>
      )}
    </div>
  );
};
