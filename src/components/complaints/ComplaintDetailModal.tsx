import React, { useState } from 'react';
import { Complaint, ComplaintStatus, UserRole } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../ui/Badge';
import { StatusTimeline } from './StatusTimeline';
import { AnonymousChatBox } from './AnonymousChatBox';
import { ReopenModal } from './ReopenModal';
import { AIAnalysisBadge } from './AIAnalysisBadge';
import { formatDate, formatShortDate } from '../../lib/utils';
import {
  Shield,
  UserCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Clock,
  Paperclip,
  CheckCircle,
  RotateCcw,
  Send,
  Lock,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
} from 'lucide-react';

export interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onUpdateStatus?: (
    complaintId: string,
    newStatus: ComplaintStatus,
    note: string
  ) => void;
  onSendMessage?: (complaintId: string, content: string) => void;
  onReopenComplaint?: (complaintId: string, reason: string) => void;
  onEscalateComplaint?: (complaintId: string) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  currentUserRole,
  onUpdateStatus,
  onSendMessage,
  onReopenComplaint,
  onEscalateComplaint,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'messages'>('details');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('Under Investigation');
  const [statusNote, setStatusNote] = useState('');
  const [isReopenOpen, setIsReopenOpen] = useState(false);

  if (!complaint) return null;

  const handleStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateStatus) return;
    onUpdateStatus(
      complaint.id,
      selectedStatus,
      statusNote.trim() || `Status updated to ${selectedStatus}`
    );
    setStatusNote('');
  };

  const isOfficerOrAdmin = currentUserRole === 'officer' || currentUserRole === 'admin' || currentUserRole === 'committee';

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Grievance Case: ${complaint.referenceId}`}
        description={`Submitted ${formatDate(complaint.createdAt)} • ${complaint.assignedDepartment}`}
        size="2xl"
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'details'
                ? 'bg-navy-900 text-white dark:bg-royal-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Case Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'timeline'
                ? 'bg-navy-900 text-white dark:bg-royal-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Milestones & Timeline ({complaint.timeline.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'messages'
                ? 'bg-navy-900 text-white dark:bg-royal-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Secure Messaging ({complaint.messages.length})
          </button>
        </div>

        {/* Tab 1: Case Overview */}
        {activeTab === 'details' && (
          <div className="space-y-5">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={complaint.status} size="md" />
                <PriorityBadge priority={complaint.priority} size="md" />
                <CategoryBadge category={complaint.category} size="md" />
                {complaint.reportingMode === 'anonymous' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                    <Shield className="w-3.5 h-3.5" /> Anonymous
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                    <UserCheck className="w-3.5 h-3.5" /> Identified
                  </span>
                )}
              </div>

              {complaint.isEscalated && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-2.5 py-1 rounded-md">
                  <AlertTriangle className="w-4 h-4" /> Escalation Level {complaint.escalationLevel} Active
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {complaint.title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                {complaint.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Campus Location
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {complaint.location}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Incident Date
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatShortDate(complaint.incidentDate)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Resolution Deadline
                </span>
                <span className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {formatShortDate(complaint.escalationDeadline)}
                </span>
              </div>
            </div>

            {/* Complainant Identity Section */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                Student Verification Status
              </span>
              {complaint.reportingMode === 'anonymous' ? (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Strict Anonymous Submission
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Zero personal identifiers recorded. Student communicates securely via Reference ID and Private Token.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        {complaint.studentName || 'Identified Student'}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Roll: {complaint.studentRollNumber || 'N/A'} • Email: {complaint.studentEmail || 'Protected'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 font-semibold border border-blue-200 dark:border-blue-800">
                    Verified Enrollment
                  </span>
                </div>
              )}
            </div>

            {/* AI Analysis Insight if available */}
            {complaint.aiClassified && (
              <AIAnalysisBadge
                analysis={{
                  category: complaint.aiClassified.suggestedCategory,
                  subcategory: complaint.aiClassified.suggestedSubcategory,
                  department: complaint.aiClassified.suggestedDepartment,
                  priority: complaint.aiClassified.suggestedPriority,
                  confidence: complaint.aiClassified.confidence,
                  keywords: complaint.aiClassified.keywords,
                  isSensitive: complaint.isSensitive,
                  reasoning: 'Auto-routed using semantic intent heuristics.',
                }}
              />
            )}

            {/* Attachments Section */}
            {complaint.attachments.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                  Supporting Evidence ({complaint.attachments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {complaint.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {att.name}
                        </span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-royal-600 dark:text-royal-400 hover:underline flex items-center gap-1 text-[11px] font-semibold shrink-0"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Officer Actions: Update Status & Escalation */}
            {isOfficerOrAdmin && onUpdateStatus && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Authorized Redressal Controls
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                      Advance Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900"
                    >
                      <option value="Acknowledged">Acknowledged</option>
                      <option value="Assigned">Assigned to Officer</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Action Taken">Action Taken</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Escalated">Escalate to Committee</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase text-slate-500 block mb-1">
                      Action Note / Investigation Remarks
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Plumber dispatched, vendor fined..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {onEscalateComplaint && !complaint.isEscalated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEscalateComplaint(complaint.id)}
                      leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                    >
                      Trigger Escalation
                    </Button>
                  )}
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleStatusChange}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                    >
                      Apply Status Update
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Student Action: Reopen if resolved or dissatisfied */}
            {currentUserRole === 'student' && complaint.status === 'Resolved' && (
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Is this grievance satisfactorily resolved?
                  </h5>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    If the problem persists or was not addressed properly, you can reopen it.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsReopenOpen(true)}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reopen Issue
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Milestones & Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Official Redressal Audit Trail
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {complaint.timeline.length} Recorded Steps
              </span>
            </div>
            <StatusTimeline
              timeline={complaint.timeline}
              currentStatus={complaint.status}
            />
          </div>
        )}

        {/* Tab 3: Secure Messaging */}
        {activeTab === 'messages' && (
          <div>
            <AnonymousChatBox
              messages={complaint.messages}
              onSendMessage={(content) => {
                if (onSendMessage) {
                  onSendMessage(complaint.id, content);
                }
              }}
              currentUserRole={currentUserRole}
              isAnonymousComplaint={complaint.reportingMode === 'anonymous'}
              referenceId={complaint.referenceId}
            />
          </div>
        )}
      </Modal>

      {/* Reopen Modal */}
      <ReopenModal
        isOpen={isReopenOpen}
        onClose={() => setIsReopenOpen(false)}
        referenceId={complaint.referenceId}
        onConfirmReopen={(reason) => {
          if (onReopenComplaint) {
            onReopenComplaint(complaint.id, reason);
          }
        }}
      />
    </>
  );
};
