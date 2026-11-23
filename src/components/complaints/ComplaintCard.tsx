import React from 'react';
import { Complaint } from '../../types';
import { Card } from '../ui/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../ui/Badge';
import { formatShortDate, formatRelativeTime } from '../../lib/utils';
import {
  Shield,
  UserCheck,
  Building2,
  Clock,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  Paperclip,
  Copy,
  Check,
} from 'lucide-react';

export interface ComplaintCardProps {
  complaint: Complaint;
  onSelect: (complaint: Complaint) => void;
  showStudentDetails?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onSelect,
  showStudentDetails = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(complaint.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      hover
      onClick={() => onSelect(complaint)}
      className="p-5 cursor-pointer relative overflow-hidden transition-all duration-200 border-l-4 border-l-transparent hover:border-l-royal-600"
    >
      {/* Top row: Reference ID, Copy, Reporting Mode, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {complaint.referenceId}
          </span>
          <button
            onClick={handleCopyRef}
            title="Copy Reference ID"
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {complaint.reportingMode === 'anonymous' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> Anonymous
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
              <UserCheck className="w-3 h-3" /> Identified
            </span>
          )}

          {complaint.isEscalated && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full animate-pulse-subtle">
              <AlertTriangle className="w-3 h-3" /> Escalated (L{complaint.escalationLevel})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Middle row: Title & snippet */}
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-royal-600 transition-colors">
          {complaint.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>
      </div>

      {/* Tags and Location */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
        <CategoryBadge category={complaint.category} />
        {complaint.subcategory && (
          <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
            {complaint.subcategory}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <Building2 className="w-3 h-3 text-slate-400" />
          {complaint.location}
        </span>
      </div>

      {/* Bottom row: Student info (if identified & authorized), messages count, date */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {showStudentDetails && complaint.reportingMode === 'identified' && complaint.studentName && (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              By: {complaint.studentName} ({complaint.studentRollNumber || 'Student'})
            </span>
          )}
          {complaint.assignedDepartment && (
            <span className="truncate max-w-[160px] text-[11px]">
              Dept: <span className="text-slate-700 dark:text-slate-300 font-medium">{complaint.assignedDepartment}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {complaint.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Paperclip className="w-3 h-3" />
              {complaint.attachments.length}
            </span>
          )}
          {complaint.messages.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <MessageSquare className="w-3 h-3" />
              {complaint.messages.length}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(complaint.createdAt)}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </Card>
  );
};
