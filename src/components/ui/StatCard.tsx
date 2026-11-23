import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  trend,
  onClick,
  className,
}) => {
  return (
    <Card
      hover={Boolean(onClick)}
      onClick={onClick}
      className={cn('p-5 flex flex-col justify-between cursor-default', onClick && 'cursor-pointer', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl flex items-center justify-center', iconColor)}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h4>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded',
                trend.isPositive
                  ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                  : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
