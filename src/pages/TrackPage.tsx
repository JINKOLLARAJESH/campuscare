import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/ui/Badge';
import { StatusTimeline } from '../components/complaints/StatusTimeline';
import { AnonymousChatBox } from '../components/complaints/AnonymousChatBox';
import { ReopenModal } from '../components/complaints/ReopenModal';
import { QRCodeModal } from '../components/qr/QRCodeModal';
import { formatDate, formatShortDate } from '../lib/utils';
import {
  Search,
  Shield,
  Key,
  Calendar,
  Building2,
  Clock,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const TrackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { complaints, getComplaintByReference, updateStatus, sendMessage, reopenComplaint } = useComplaints();
  const { user, role } = useAuth();

  const [refInput, setRefInput] = useState(searchParams.get('ref') || '');
  const [secretInput, setSecretInput] = useState(searchParams.get('secret') || '');
  const [activeComplaint, setActiveComplaint] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'messages'>('timeline');

  // If URL params are present on load, auto-lookup
  useEffect(() => {
    const urlRef = searchParams.get('ref');
    const urlSec = searchParams.get('secret');
    if (urlRef) {
      setRefInput(urlRef);
      if (urlSec) setSecretInput(urlSec);
      performLookup(urlRef, urlSec || undefined);
    }
  }, [searchParams]);

  const performLookup = (refId: string, secret?: string) => {
    if (!refId.trim()) {
      setErrorMsg('Please enter a valid Reference ID.');
      setActiveComplaint(null);
      return;
    }

    const result = getComplaintByReference(refId.trim(), secret?.trim());
    if (result.error) {
      setErrorMsg(result.error);
      setActiveComplaint(null);
    } else {
      setErrorMsg('');
      setActiveComplaint(result.complaint);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(refInput, secretInput);
  };

  // Quick 1-click test cases
  const sampleCases = [
    {
      title: 'Hostel Water Outage (Anonymous)',
      ref: 'CC-2026-00821',
      secret: 'SEC-W7K9P2X4',
      status: 'Under Investigation',
    },
    {
      title: 'Food Hygiene (Identified)',
      ref: 'CC-2026-00822',
      secret: 'SEC-M3T8V1Z9',
      status: 'Action Taken',
    },
    {
      title: 'Projector Defect (Resolved)',
      ref: 'CC-2026-00823',
      secret: 'SEC-P4N2J8Y3',
      status: 'Resolved',
    },
    {
      title: 'Anti-Ragging Alert (Critical)',
      ref: 'CC-2026-00828',
      secret: 'SEC-H1Z8C4V9',
      status: 'Under Investigation',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col transition-colors duration-150">
      <Navbar onOpenQR={() => setQrModalOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-royal-950/60 text-royal-700 dark:text-royal-400 text-xs font-semibold border border-blue-200 dark:border-royal-800">
            <Search className="w-3.5 h-3.5" />
            <span>Real-Time Case Tracking & Redressal Timeline</span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            Track Grievance Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your unique Reference ID and Tracking Secret (for anonymous reports) to view status updates, official action notes, and live officer messages.
          </p>
        </div>

        {/* Lookup Card */}
        <Card className="p-6 shadow-md border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Complaint Reference ID"
                placeholder="e.g. CC-2026-00821"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Tracking Secret Token (if anonymous)"
                placeholder="e.g. SEC-W7K9P2X4"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                leftIcon={<Key className="w-4 h-4 text-slate-400" />}
                helperText="Generated upon submitting anonymous reports to protect your privacy."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                Lost your secret token? Contact the campus proctor office with your date & location.
              </div>
              <Button type="submit" variant="primary" leftIcon={<Search className="w-4 h-4" />}>
                Lookup Grievance File
              </Button>
            </div>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
                {errorMsg}
              </div>
            </div>
          )}

          {/* 1-Click Quick Demo Cases */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Or Test Instant Sample Grievances (1-Click Fill)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {sampleCases.map((s) => (
                <button
                  key={s.ref}
                  type="button"
                  onClick={() => {
                    setRefInput(s.ref);
                    setSecretInput(s.secret);
                    performLookup(s.ref, s.secret);
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left hover:border-royal-600 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-navy-900 dark:text-royal-300 block">
                    {s.ref}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 block truncate">
                    {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {s.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Display Active Complaint Results */}
        {activeComplaint && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Case Overview Card */}
            <Card className="p-6 border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base font-extrabold text-navy-900 dark:text-white">
                    {activeComplaint.referenceId}
                  </span>
                  <StatusBadge status={activeComplaint.status} size="md" />
                  <PriorityBadge priority={activeComplaint.priority} size="md" />
                  <CategoryBadge category={activeComplaint.category} size="md" />
                  {activeComplaint.reportingMode === 'anonymous' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                      <Shield className="w-3.5 h-3.5" /> Anonymous Mode
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full">
                      <User className="w-3.5 h-3.5" /> Identified Student
                    </span>
                  )}
                </div>

                {activeComplaint.status === 'Resolved' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsReopenOpen(true)}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Reopen Grievance
                  </Button>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeComplaint.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Assigned Unit
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {activeComplaint.assignedDepartment}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Campus Facility
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {activeComplaint.location}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Logged On
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    {formatShortDate(activeComplaint.createdAt)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Target SLA
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 block">
                    {formatShortDate(activeComplaint.escalationDeadline)}
                  </span>
                </div>
              </div>

              {/* Reopen notice if reopened */}
              {activeComplaint.reopenReason && (
                <div className="mt-4 p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs">
                  <span className="font-bold text-orange-900 dark:text-orange-300 block mb-1">
                    Previous Reopen Justification:
                  </span>
                  <p className="text-orange-800 dark:text-orange-200">
                    "{activeComplaint.reopenReason}"
                  </p>
                </div>
              )}
            </Card>

            {/* Tabs for Timeline and Messaging */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Timeline Column */}
              <div className="lg:col-span-7">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-royal-600" />
                      Status Milestones ({activeComplaint.timeline.length})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Immutable Audit Trail
                    </span>
                  </div>
                  <StatusTimeline
                    timeline={activeComplaint.timeline}
                    currentStatus={activeComplaint.status}
                  />
                </Card>
              </div>

              {/* Secure Anonymous Messaging Column */}
              <div className="lg:col-span-5">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-royal-600" />
                      Two-Way Redressal Channel
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Anonymous
                    </span>
                  </div>
                  <AnonymousChatBox
                    messages={activeComplaint.messages}
                    onSendMessage={(content) => {
                      sendMessage(activeComplaint.id, content);
                      // Update active complaint locally
                      setActiveComplaint((prev: any) => ({
                        ...prev,
                        messages: [
                          ...prev.messages,
                          {
                            id: `m-${Date.now()}`,
                            complaintId: prev.id,
                            senderRole: 'student',
                            senderName: prev.reportingMode === 'anonymous' ? 'Anonymous Student' : (user?.name || 'Student'),
                            content,
                            timestamp: new Date().toISOString(),
                            isAnonymous: prev.reportingMode === 'anonymous',
                          },
                        ],
                      }));
                    }}
                    currentUserRole="student"
                    isAnonymousComplaint={activeComplaint.reportingMode === 'anonymous'}
                    referenceId={activeComplaint.referenceId}
                  />
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reopen Modal */}
      {activeComplaint && (
        <ReopenModal
          isOpen={isReopenOpen}
          onClose={() => setIsReopenOpen(false)}
          referenceId={activeComplaint.referenceId}
          onConfirmReopen={(reason) => {
            reopenComplaint(activeComplaint.id, reason);
            setActiveComplaint((prev: any) => ({
              ...prev,
              status: 'Reopened',
              reopenReason: reason,
              timeline: [
                ...prev.timeline,
                {
                  id: `t-${Date.now()}`,
                  status: 'Reopened',
                  title: 'Grievance Reopened by Complainant',
                  description: `Justification: "${reason}"`,
                  timestamp: new Date().toISOString(),
                  actorName: prev.reportingMode === 'anonymous' ? 'Anonymous Student' : (user?.name || 'Student'),
                  actorRole: 'student',
                },
              ],
            }));
          }}
        />
      )}

      {/* QR Modal */}
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

      <Footer />
    </div>
  );
};
