import React from 'react';
import { TimelineEntry, ComplaintStatus } from '../../types';
import { formatDate } from '../../lib/utils';
import { CheckCircle2, Circle, AlertCircle, Clock, ShieldCheck, UserCheck, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StatusTimelineProps {
  timeline: TimelineEntry[];
  currentStatus: ComplaintStatus;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ timeline, currentStatus }) => {
  const getIconForStatus = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Escalated':
        return <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'Reopened':
        return <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'Under Investigation':
      case 'Action Taken':
        return <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Assigned':
        return <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Acknowledged':
        return <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
      case 'Escalated':
        return 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
      case 'Reopened':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/40';
      case 'Under Investigation':
      case 'Action Taken':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/40';
      default:
        return 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
      {timeline.map((entry, idx) => {
        const isLatest = idx === timeline.length - 1;
        return (
          <div key={entry.id || idx} className="relative group">
            {/* Timeline Dot */}
            <div
              className={cn(
                'absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm transition-transform group-hover:scale-110',
                getBorderColor(entry.status)
              )}
            >
              {getIconForStatus(entry.status)}
            </div>

            {/* Entry Content */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-800 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {entry.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {formatDate(entry.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {entry.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  {entry.actorName} ({entry.actorRole})
                </span>
                {isLatest && (
                  <span className="text-[10px] font-bold text-royal-600 dark:text-royal-400 uppercase tracking-widest animate-pulse">
                    Current Milestone
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
