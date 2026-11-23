import React from 'react';
import { Decision } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface DecisionBadgeProps {
  decision: Decision;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({
  decision,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const configs = {
    ALLOW: {
      label: 'ALLOW',
      colorClasses: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dotColor: 'bg-emerald-400',
      icon: CheckCircle2,
      glow: 'shadow-emerald-500/10',
    },
    ASK_CUSTOMER: {
      label: 'ASK CUSTOMER',
      colorClasses: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotColor: 'bg-amber-400',
      icon: AlertTriangle,
      glow: 'shadow-amber-500/10',
    },
    BLOCK: {
      label: 'BLOCK',
      colorClasses: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dotColor: 'bg-rose-400',
      icon: XCircle,
      glow: 'shadow-rose-500/10',
    },
  };

  const current = configs[decision] || configs.BLOCK;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm transition-all duration-150 ${current.colorClasses} ${current.glow} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span className="tracking-wide">{current.label}</span>
    </span>
  );
};
