import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ComplaintPriority, ComplaintStatus, ComplaintCategory } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReferenceId(): string {
  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `CC-${currentYear}-${randomNum}`;
}

export function generateTrackingSecret(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'SEC-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatShortDate(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatShortDate(isoString);
}

export function getPriorityStyles(priority: ComplaintPriority): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (priority) {
    case 'Critical':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
      };
    case 'High':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
    case 'Medium':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800/40',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusStyles(status: ComplaintStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };
    case 'Escalated':
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        dot: 'bg-purple-500',
      };
    case 'Reopened':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/40',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-800',
        dot: 'bg-orange-500',
      };
    case 'Under Investigation':
    case 'Action Taken':
      return {
        bg: 'bg-cyan-50 dark:bg-cyan-950/40',
        text: 'text-cyan-700 dark:text-cyan-400',
        border: 'border-cyan-200 dark:border-cyan-800',
        dot: 'bg-cyan-500',
      };
    case 'Assigned':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        dot: 'bg-indigo-500',
      };
    case 'Acknowledged':
      return {
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        text: 'text-sky-700 dark:text-sky-400',
        border: 'border-sky-200 dark:border-sky-800',
        dot: 'bg-sky-500',
      };
    case 'Closed':
      return {
        bg: 'bg-zinc-100 dark:bg-zinc-800/60',
        text: 'text-zinc-600 dark:text-zinc-400',
        border: 'border-zinc-200 dark:border-zinc-700',
        dot: 'bg-zinc-400',
      };
    case 'Submitted':
    default:
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
  }
}

export function getCategoryBadge(category: ComplaintCategory): {
  color: string;
} {
  switch (category) {
    case 'Harassment and Safety':
      return { color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900' };
    case 'Faculty':
      return { color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900' };
    case 'Hostel':
      return { color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900' };
    case 'Mess':
      return { color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900' };
    case 'Infrastructure':
      return { color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900' };
    case 'Academics':
      return { color: 'text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-900' };
    case 'Administration':
      return { color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900' };
    default:
      return { color: 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
  }
}
