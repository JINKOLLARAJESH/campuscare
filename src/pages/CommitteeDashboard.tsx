import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { ComplaintDetailModal } from '../components/complaints/ComplaintDetailModal';
import { Complaint } from '../types';
import {
  Lock,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Users,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
} from 'lucide-react';

export const CommitteeDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    complaints,
    updateStatus,
    sendMessage,
    escalateComplaint,
  } = useComplaints();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'sensitive' | 'escalated' | 'critical' | 'hearings'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Committee members have access to:
  // 1. All Sensitive complaints (Anti-ragging, sexual harassment, faculty misconduct)
  // 2. All Escalated complaints (Levels 2, 3, 4)
  // 3. High/Critical priority complaints
  const committeeComplaints = complaints.filter(
    (c) => c.isSensitive || c.isEscalated || c.priority === 'Critical' || c.priority === 'High'
  );

  const sensitiveCount = committeeComplaints.filter((c) => c.isSensitive).length;
  const escalatedCount = committeeComplaints.filter((c) => c.isEscalated).length;
  const criticalCount = committeeComplaints.filter((c) => c.priority === 'Critical').length;
  const resolvedCount = committeeComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  const filteredList = committeeComplaints.filter((c) => {
    if (filterTab === 'sensitive' && !c.isSensitive) return false;
    if (filterTab === 'escalated' && !c.isEscalated) return false;
    if (filterTab === 'critical' && c.priority !== 'Critical') return false;
    if (filterTab === 'hearings' && c.status !== 'Under Investigation') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.referenceId.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Committee Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Statutory Ombudsman Desk
              </span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-semibold">
                Classified Vault
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Grievance Redressal Committee
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Presiding Officer: <strong>{user?.name || 'Prof. Sunita Nair'}</strong> • Anti-Ragging Cell & Internal Complaints Committee (ICC).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 max-w-xs">
            <strong className="text-white block mb-0.5">Statutory Confidentiality</strong>
            Student identities in sensitive harassment and ragging cases are strictly firewalled.
          </div>
        </div>

        {/* Committee Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Classified Sensitive"
            value={sensitiveCount}
            subtitle="ICC & Anti-Ragging"
            icon={<Lock className="w-5 h-5" />}
            iconColor="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          />
          <StatCard
            title="Escalated to Level 2/3"
            value={escalatedCount}
            subtitle="Authority intervention"
            icon={<AlertTriangle className="w-5 h-5" />}
            iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />
          <StatCard
            title="Critical Urgency"
            value={criticalCount}
            subtitle="24h response required"
            icon={<ShieldAlert className="w-5 h-5" />}
            iconColor="bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400"
          />
          <StatCard
            title="Resolved with Review"
            value={resolvedCount}
            subtitle="Formal findings filed"
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        {/* Main Committee Worklist */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Scale className="w-4 h-4 text-royal-600" />
                Confidential Case Dossier ({filteredList.length})
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sensitive allegations requiring independent faculty hearings, UGC statutory notices, and proctorial orders.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <Input
                placeholder="Search Dossiers, IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                className="text-xs py-1.5"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'all'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Committee Cases ({committeeComplaints.length})
            </button>
            <button
              onClick={() => setFilterTab('sensitive')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'sensitive'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              🔒 Sensitive Queue ({sensitiveCount})
            </button>
            <button
              onClick={() => setFilterTab('escalated')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'escalated'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Escalated Cases ({escalatedCount})
            </button>
            <button
              onClick={() => setFilterTab('hearings')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'hearings'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Hearings in Progress
            </button>
          </div>

          {/* Complaints Stream */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredList.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                onSelect={(item) => setSelectedComplaint(item)}
                showStudentDetails={true}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Case Review Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        currentUserRole="committee"
        onUpdateStatus={updateStatus}
        onSendMessage={sendMessage}
        onEscalateComplaint={escalateComplaint}
      />
    </AppLayout>
  );
};
