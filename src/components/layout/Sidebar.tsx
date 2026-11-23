import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  PlusCircle,
  Search,
  Layers,
  FileText,
  AlertTriangle,
  Users,
  Settings,
  Building2,
  Sliders,
  History,
  LogOut,
  QrCode,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenQR?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile, onOpenQR }) => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinks = () => {
    switch (role) {
      case 'officer':
        return [
          { name: 'Officer Overview', to: '/officer', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'Department Queue', to: '/officer?tab=all', icon: <FileText className="w-4 h-4" /> },
          { name: 'Assigned to Me', to: '/officer?tab=assigned', icon: <Shield className="w-4 h-4" /> },
          { name: 'Escalation Watch', to: '/officer?tab=escalated', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
          { name: 'Campus Hotspots', to: '/#heatmap', icon: <Layers className="w-4 h-4" /> },
        ];
      case 'committee':
        return [
          { name: 'Committee Desk', to: '/committee', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'Sensitive Cases', to: '/committee?tab=sensitive', icon: <Lock className="w-4 h-4 text-rose-500" /> },
          { name: 'Escalated Queue', to: '/committee?tab=escalated', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
          { name: 'Case Hearings', to: '/committee?tab=hearings', icon: <FileText className="w-4 h-4" /> },
        ];
      case 'admin':
        return [
          { name: 'Admin Dashboard', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'Grievance Central', to: '/admin?tab=complaints', icon: <FileText className="w-4 h-4" /> },
          { name: 'Departments & Staff', to: '/admin?tab=departments', icon: <Building2 className="w-4 h-4" /> },
          { name: 'Routing & Rules', to: '/admin?tab=routing', icon: <Sliders className="w-4 h-4" /> },
          { name: 'Escalation Deadlines', to: '/admin?tab=escalation', icon: <AlertTriangle className="w-4 h-4" /> },
          { name: 'Security Audit Log', to: '/admin?tab=audit', icon: <History className="w-4 h-4" /> },
        ];
      case 'student':
      default:
        return [
          { name: 'Student Portal', to: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
          { name: 'Submit Grievance', to: '/submit', icon: <PlusCircle className="w-4 h-4 text-royal-600" /> },
          { name: 'Track Grievance', to: '/track', icon: <Search className="w-4 h-4" /> },
          { name: 'My Submissions', to: '/student?tab=my', icon: <FileText className="w-4 h-4" /> },
          { name: 'Campus Heatmap', to: '/#heatmap', icon: <Layers className="w-4 h-4" /> },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-900 dark:bg-royal-600 text-white flex items-center justify-center shadow">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-navy-900 dark:text-white">
                Campus<span className="text-royal-600">Care</span>
              </span>
              <span className="block text-[10px] text-slate-400 capitalize -mt-0.5">
                {role} Console
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Role Switcher Banner */}
        <div className="p-3 mx-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Role Switcher
            </span>
            <span className="text-[10px] bg-royal-100 dark:bg-royal-950 text-royal-700 dark:text-royal-300 font-semibold px-1.5 py-0.2 rounded">
              Demo
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            {(['student', 'officer', 'committee', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  switchRole(r);
                  navigate(
                    r === 'student'
                      ? '/student'
                      : r === 'officer'
                      ? '/officer'
                      : r === 'committee'
                      ? '/committee'
                      : '/admin'
                  );
                }}
                className={cn(
                  'px-2 py-1 rounded capitalize font-medium transition-colors text-left truncate',
                  role === r
                    ? 'bg-navy-900 text-white dark:bg-royal-600 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-navy-900 text-white dark:bg-royal-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                )
              }
            >
              {link.icon}
              <span className="truncate">{link.name}</span>
            </NavLink>
          ))}

          {/* QR Generator Link */}
          {onOpenQR && (
            <button
              onClick={() => {
                onCloseMobile();
                onOpenQR();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Campus QR Beacons</span>
            </button>
          )}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                }
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                  {user?.name || 'Authorized Member'}
                </span>
                <span className="text-[10px] text-slate-400 capitalize truncate block">
                  {user?.badge || `${role} account`}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
