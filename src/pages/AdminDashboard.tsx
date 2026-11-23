import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { AppLayout } from '../components/layout/AppLayout';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { ComplaintDetailModal } from '../components/complaints/ComplaintDetailModal';
import { Complaint, AuditLog, Department, RoutingRule } from '../types';
import { formatDate, formatShortDate } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Sliders,
  History,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, availableUsers } = useAuth();
  const {
    complaints,
    departments,
    auditLogs,
    updateStatus,
    sendMessage,
    escalateComplaint,
  } = useComplaints();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'complaints' | 'users' | 'departments' | 'routing' | 'audit'
  >('analytics');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [auditSearch, setAuditSearch] = useState('');
  const [complaintSearch, setComplaintSearch] = useState('');

  // Top Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Acknowledged'
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const escalatedCount = complaints.filter((c) => c.isEscalated).length;
  const avgResolutionDays = 2.3;

  // Chart 1: Category Distribution
  const categoryCountMap: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCountMap[c.category] = (categoryCountMap[c.category] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryCountMap).map(([category, count]) => ({
    category,
    count,
  }));

  // Chart 2: Monthly Trend (Simulated 6-month historical curve)
  const monthlyTrendData = [
    { month: 'Jun', total: 18, resolved: 16 },
    { month: 'Jul', total: 24, resolved: 22 },
    { month: 'Aug', total: 32, resolved: 29 },
    { month: 'Sep', total: 28, resolved: 25 },
    { month: 'Oct', total: 35, resolved: 31 },
    { month: 'Nov', total: totalCount, resolved: resolvedCount },
  ];

  // Chart 3: Department Performance
  const deptPerformanceData = departments.map((d) => ({
    name: d.code,
    fullName: d.name,
    total: d.totalComplaints,
    resolved: d.resolvedComplaints,
    rate: Math.round((d.resolvedComplaints / d.totalComplaints) * 100),
  }));

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      'Reference ID',
      'Title',
      'Category',
      'Subcategory',
      'Department',
      'Priority',
      'Status',
      'Reporting Mode',
      'Location',
      'Incident Date',
      'Escalated',
      'Created At',
    ];

    const rows = complaints.map((c) => [
      c.referenceId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      `"${c.subcategory}"`,
      `"${c.assignedDepartment}"`,
      c.priority,
      c.status,
      c.reportingMode,
      `"${c.location}"`,
      c.incidentDate,
      c.isEscalated ? 'Yes' : 'No',
      c.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campuscare_grievances_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('CSV Report Exported', `Generated comprehensive log of ${complaints.length} records.`);
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      log.actorName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.targetId.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-royal-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-royal-300">
                Central Campus Governance
              </span>
              <span className="text-[10px] bg-royal-600/40 text-royal-200 border border-royal-500 px-2 py-0.5 rounded-full font-semibold">
                Super Admin Access
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Redressal Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Chief Proctor: <strong>{user?.name || 'Dr. Vikramaditya Rao'}</strong> • Direct oversight across 6 campus operating departments.
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
            className="font-bold shrink-0 shadow-lg"
          >
            Export All Records (.CSV)
          </Button>
        </div>

        {/* Top 5 Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <StatCard
            title="Total Complaints"
            value={totalCount}
            subtitle="Campus cumulative"
            icon={<FileText className="w-5 h-5" />}
            iconColor="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
          />
          <StatCard
            title="Pending Review"
            value={pendingCount}
            subtitle="Triage required"
            icon={<Clock className="w-5 h-5" />}
            iconColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />
          <StatCard
            title="Resolved Cases"
            value={resolvedCount}
            subtitle="Closed satisfactorily"
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
          <StatCard
            title="Escalated (L2-L4)"
            value={escalatedCount}
            subtitle="Council intervention"
            icon={<AlertTriangle className="w-5 h-5" />}
            iconColor="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          />
          <StatCard
            title="Avg Turnaround"
            value={`${avgResolutionDays} Days`}
            subtitle="SLA benchmark"
            icon={<History className="w-5 h-5" />}
            iconColor="bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400"
          />
        </div>

        {/* Administration Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-navy-900 text-white dark:bg-royal-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Executive Analytics
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'complaints'
                ? 'bg-navy-900 text-white dark:bg-royal-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            All Grievances ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'departments'
                ? 'bg-navy-900 text-white dark:bg-royal-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'users'
                ? 'bg-navy-900 text-white dark:bg-royal-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            User Roles & Staff
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'audit'
                ? 'bg-navy-900 text-white dark:bg-royal-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            Security Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Grievance Trends */}
              <Card className="p-5">
                <CardHeader className="p-0 pb-3 border-none flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">
                    Monthly Grievance Inflow & Resolution
                  </CardTitle>
                  <span className="text-[11px] text-slate-400">Past 6 Months</span>
                </CardHeader>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="resolvedColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#totalColor)" name="Total Lodged" />
                      <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#resolvedColor)" name="Resolved" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Department Resolution Performance */}
              <Card className="p-5">
                <CardHeader className="p-0 pb-3 border-none flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">
                    Department Resolution Rate (%)
                  </CardTitle>
                  <span className="text-[11px] text-emerald-600 font-semibold">Average: 86.8%</span>
                </CardHeader>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deptPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#142B4A" radius={[4, 4, 0, 0]} name="Resolution %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Category Distribution Bar Chart */}
            <Card className="p-5">
              <CardHeader className="p-0 pb-3 border-none flex items-center justify-between">
                <CardTitle className="text-sm font-bold">
                  Complaint Distribution by Operational Category
                </CardTitle>
                <span className="text-[11px] text-slate-400">Total Active + Resolved</span>
              </CardHeader>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Complaints" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2: ALL COMPLAINTS */}
        {activeTab === 'complaints' && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="text-base font-bold">
                  Institutional Master Grievance Roster ({complaints.length})
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete central view across identified and anonymous complaints.
                </p>
              </div>
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Filter cases, Ref IDs..."
                  value={complaintSearch}
                  onChange={(e) => setComplaintSearch(e.target.value)}
                  leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                  className="text-xs py-1.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {complaints
                .filter((c) => {
                  if (!complaintSearch.trim()) return true;
                  const q = complaintSearch.toLowerCase();
                  return (
                    c.title.toLowerCase().includes(q) ||
                    c.referenceId.toLowerCase().includes(q) ||
                    c.assignedDepartment.toLowerCase().includes(q)
                  );
                })
                .map((c) => (
                  <ComplaintCard
                    key={c.id}
                    complaint={c}
                    onSelect={(item) => setSelectedComplaint(item)}
                    showStudentDetails={true}
                  />
                ))}
            </div>
          </Card>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-royal-600 dark:text-royal-400">
                      {dept.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      {Math.round((dept.resolvedComplaints / dept.totalComplaints) * 100)}% Resolved
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {dept.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Department Head:</span>
                      <span className="font-semibold">{dept.headName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Official Contact:</span>
                      <span className="font-mono">{dept.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Avg Resolution:</span>
                      <span>{dept.avgResolutionDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{dept.totalComplaints} Total Cases</span>
                  <span className="font-semibold text-emerald-600">
                    {dept.resolvedComplaints} Resolved
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB 4: USER ROLES */}
        {activeTab === 'users' && (
          <Card className="p-6">
            <CardTitle className="text-base font-bold mb-4">
              Registered System Personnel & Student Profiles ({availableUsers.length})
            </CardTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Department / Roll</th>
                    <th className="p-3">Contact Email</th>
                    <th className="p-3 text-right">Access Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {availableUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3 flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded capitalize font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        {u.department || u.rollNumber || 'General'}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {u.email}
                      </td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <History className="w-4 h-4 text-royal-600" />
                  Tamper-Evident Security Audit Log ({auditLogs.length})
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Every status transition, message dispatch, anonymous credential verification, and escalation trigger is permanently logged.
                </p>
              </div>

              <div className="w-full sm:w-64">
                <Input
                  placeholder="Search actions, actors..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                  className="text-xs py-1.5"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action Type</th>
                    <th className="p-3">Target ID</th>
                    <th className="p-3">Operation Details</th>
                    <th className="p-3">Client Host</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {log.actorName} ({log.actorRole})
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-semibold text-royal-600 dark:text-royal-400">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                        {log.targetId}
                      </td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="p-3 text-slate-400 text-[10px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        currentUserRole="admin"
        onUpdateStatus={updateStatus}
        onSendMessage={sendMessage}
        onEscalateComplaint={escalateComplaint}
      />
    </AppLayout>
  );
};
