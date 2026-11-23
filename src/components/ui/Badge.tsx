import React from 'react';
import { cn, getPriorityStyles, getStatusStyles, getCategoryBadge } from '../../lib/utils';
import { ComplaintPriority, ComplaintStatus, ComplaintCategory } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    neutral: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border leading-none tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  const styles = getStatusStyles(status);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium rounded-full',
        styles.bg,
        styles.text,
        styles.border,
        size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse-subtle', styles.dot)} />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ComplaintPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm',
}) => {
  const styles = getPriorityStyles(priority);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-medium rounded-md',
        styles.bg,
        styles.text,
        styles.border,
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
      {priority}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: ComplaintCategory; size?: 'sm' | 'md' }> = ({
  category,
  size = 'sm',
}) => {
  const { color } = getCategoryBadge(category);
  return (
    <span
      className={cn(
        'inline-flex items-center border font-medium rounded-md',
        color,
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      {category}
    </span>
  );
};
