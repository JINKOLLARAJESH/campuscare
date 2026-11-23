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
import { Complaint, ComplaintStatus, ComplaintPriority } from '../types';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  UserCheck,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    complaints,
    updateStatus,
    sendMessage,
    escalateComplaint,
  } = useComplaints();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'assigned' | 'new' | 'overdue' | 'escalated' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter complaints: Department officers only see non-sensitive complaints assigned to their department
  // or assigned directly to them (unless they have admin/committee roles)
  const officerDepartment = user?.department || 'Hostel Administration';

  const deptComplaints = complaints.filter((c) => {
    // If sensitive, only Grievance Committee can see it
    if (c.isSensitive && user?.role !== 'committee' && user?.role !== 'admin') {
      return false;
    }
    // Match department or assigned officer
    return (
      c.assignedDepartment === officerDepartment ||
      c.assignedOfficerId === user?.id ||
      user?.role === 'admin'
    );
  });

  const now = new Date().getTime();

  // Metric counts
  const totalDept = deptComplaints.length;
  const newCases = deptComplaints.filter((c) => c.status === 'Submitted').length;
  const inProgressCases = deptComplaints.filter(
    (c) => c.status === 'Under Investigation' || c.status === 'Action Taken' || c.status === 'Assigned'
  ).length;
  const overdueCases = deptComplaints.filter((c) => {
    const deadline = new Date(c.escalationDeadline).getTime();
    return deadline < now && c.status !== 'Resolved' && c.status !== 'Closed';
  }).length;
  const escalatedCases = deptComplaints.filter((c) => c.isEscalated).length;
  const resolvedCases = deptComplaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;

  // Filtered List
  const filteredList = deptComplaints.filter((c) => {
    if (filterTab === 'assigned' && c.assignedOfficerId !== user?.id) return false;
    if (filterTab === 'new' && c.status !== 'Submitted') return false;
    if (filterTab === 'escalated' && !c.isEscalated) return false;
    if (filterTab === 'resolved' && c.status !== 'Resolved' && c.status !== 'Closed') return false;
    if (filterTab === 'overdue') {
      const deadline = new Date(c.escalationDeadline).getTime();
      if (deadline >= now || c.status === 'Resolved' || c.status === 'Closed') return false;
    }

    if (selectedPriority !== 'All' && c.priority !== selectedPriority) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.referenceId.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Officer Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-royal-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-royal-300">
                Department Redressal Desk
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                {officerDepartment}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Officer Console: {user?.name || 'Department Officer'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Assigned Unit: <strong>{officerDepartment}</strong> • {inProgressCases} active investigations under your charge.
            </p>
          </div>

          {overdueCases > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong>{overdueCases} Overdue Case(s)</strong>
                <p className="text-[11px] text-rose-300">Approaching Level 2 auto-escalation.</p>
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="Total Assigned"
            value={totalDept}
            subtitle="Unit queue"
            icon={<FileText className="w-5 h-5" />}
            iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          />
          <StatCard
            title="New Submissions"
            value={newCases}
            subtitle="Require triage"
            icon={<Clock className="w-5 h-5" />}
            iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />
          <StatCard
            title="Under Investigation"
            value={inProgressCases}
            subtitle="Field work"
            icon={<Shield className="w-5 h-5" />}
            iconColor="bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400"
          />
          <StatCard
            title="Overdue SLA"
            value={overdueCases}
            subtitle="Critical alert"
            icon={<AlertTriangle className="w-5 h-5" />}
            iconColor="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          />
          <StatCard
            title="Resolved"
            value={resolvedCases}
            subtitle="Closed cases"
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        {/* Complaints Table / List with Search & Filters */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold">
                {officerDepartment} Grievance Queue ({filteredList.length})
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authorized complaints assigned for physical inspection, vendor repair, and official redressal notes.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search Title, Ref ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                className="w-full sm:w-56 text-xs"
              />
              <Select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="text-xs py-2 w-32"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'all'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Unit Cases ({deptComplaints.length})
            </button>
            <button
              onClick={() => setFilterTab('assigned')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'assigned'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Assigned to Me
            </button>
            <button
              onClick={() => setFilterTab('new')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'new'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              New Submissions ({newCases})
            </button>
            <button
              onClick={() => setFilterTab('overdue')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'overdue'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Overdue Escalations ({overdueCases})
            </button>
            <button
              onClick={() => setFilterTab('resolved')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterTab === 'resolved'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Resolved ({resolvedCases})
            </button>
          </div>

          {/* Complaints Stream */}
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Shield className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No complaints found for current criteria</p>
            </div>
          ) : (
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
          )}
        </Card>
      </div>

      {/* Case Inspector Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        currentUserRole="officer"
        onUpdateStatus={updateStatus}
        onSendMessage={sendMessage}
        onEscalateComplaint={escalateComplaint}
      />
    </AppLayout>
  );
};
