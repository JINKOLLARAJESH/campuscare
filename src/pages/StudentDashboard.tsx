import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { ComplaintDetailModal } from '../components/complaints/ComplaintDetailModal';
import { Complaint, ComplaintStatus } from '../types';
import {
  PlusCircle,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building2,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    complaints,
    updateStatus,
    sendMessage,
    reopenComplaint,
    escalateComplaint,
    notifications,
  } = useComplaints();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackRefInput, setTrackRefInput] = useState('');

  // Filter complaints relevant to student:
  // Identified complaints matching studentId OR anonymous complaints stored in student session
  const studentComplaints = complaints.filter(
    (c) => c.studentId === user?.id || c.reportingMode === 'anonymous' || c.studentRollNumber === user?.rollNumber
  );

  const totalCount = studentComplaints.length;
  const pendingCount = studentComplaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Acknowledged'
  ).length;
  const inProgressCount = studentComplaints.filter(
    (c) => c.status === 'Under Investigation' || c.status === 'Action Taken' || c.status === 'Assigned'
  ).length;
  const resolvedCount = studentComplaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;

  // Pie chart data
  const statusPieData = [
    { name: 'Pending', value: pendingCount || 1, color: '#F59E0B' },
    { name: 'In Progress', value: inProgressCount || 2, color: '#3B82F6' },
    { name: 'Resolved', value: resolvedCount || 2, color: '#10B981' },
  ];

  // Bar chart by category
  const categoryCounts: Record<string, number> = {};
  studentComplaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const barChartData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat,
    count,
  }));

  // Filtered complaints list
  const filteredComplaints = studentComplaints.filter((c) => {
    if (filterStatus === 'pending') {
      if (c.status !== 'Submitted' && c.status !== 'Acknowledged') return false;
    } else if (filterStatus === 'active') {
      if (c.status !== 'Under Investigation' && c.status !== 'Action Taken' && c.status !== 'Assigned') return false;
    } else if (filterStatus === 'resolved') {
      if (c.status !== 'Resolved' && c.status !== 'Closed') return false;
    } else if (filterStatus === 'reopened') {
      if (c.status !== 'Reopened' && !c.isEscalated) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.referenceId.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-royal-800 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-200">
              Student Grievance Central
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Roll No: <span className="font-mono font-bold text-white">{user?.rollNumber || '2024CS1042'}</span> • You have{' '}
              <strong>{inProgressCount} active</strong> grievance investigations underway.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/submit')}
              leftIcon={<PlusCircle className="w-4 h-4 text-white" />}
              className="font-bold shadow-md"
            >
              New Grievance
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/track')}
              leftIcon={<Search className="w-4 h-4" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Track by Ref ID
            </Button>
          </div>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Submitted"
            value={totalCount}
            subtitle="Campus records"
            icon={<FileText className="w-5 h-5" />}
            iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          />
          <StatCard
            title="Pending Review"
            value={pendingCount}
            subtitle="Awaiting dispatch"
            icon={<Clock className="w-5 h-5" />}
            iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />
          <StatCard
            title="In Investigation"
            value={inProgressCount}
            subtitle="Action underway"
            icon={<AlertCircle className="w-5 h-5" />}
            iconColor="bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400"
          />
          <StatCard
            title="Resolved Cases"
            value={resolvedCount}
            subtitle="Confirmed fixes"
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        {/* Charts & Quick Track Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Status Breakdown Donut */}
          <div className="lg:col-span-5">
            <Card className="p-5 h-full flex flex-col justify-between">
              <CardHeader className="p-0 pb-3 border-none">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Grievance Status Breakdown</span>
                  <span className="text-[11px] font-normal text-slate-400">Real-Time</span>
                </CardTitle>
              </CardHeader>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-300">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-600 dark:text-slate-300">Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Resolved</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Track & Notifications Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Quick Track Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-royal-600" />
                  Fast Grievance Lookup
                </span>
                <span className="text-[11px] text-royal-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/track')}>
                  Open Full Tracker →
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Reference ID (e.g. CC-2026-00821)"
                  value={trackRefInput}
                  onChange={(e) => setTrackRefInput(e.target.value)}
                  className="text-xs"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (trackRefInput.trim()) {
                      navigate(`/track?ref=${trackRefInput.trim()}`);
                    }
                  }}
                  className="shrink-0"
                >
                  Lookup
                </Button>
              </div>
            </Card>

            {/* Category Breakdown Bar Chart */}
            <Card className="p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Reports by Operational Department
              </span>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* Complaints Stream Section */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-bold">
                My Grievance Activity Log ({filteredComplaints.length})
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any case to inspect official investigation notes, timelines, or send anonymous replies.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search cases, IDs, tags..."
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
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Cases ({studentComplaints.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'active'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Active Investigations ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'resolved'
                  ? 'bg-navy-900 text-white dark:bg-royal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No complaints found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing search filters or lodge a new grievance.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredComplaints.map((c) => (
                <ComplaintCard
                  key={c.id}
                  complaint={c}
                  onSelect={(item) => setSelectedComplaint(item)}
                  showStudentDetails={false}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        currentUserRole="student"
        onSendMessage={sendMessage}
        onReopenComplaint={reopenComplaint}
      />
    </AppLayout>
  );
};
