import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  RotateCcw,
  Shield,
  CheckCircle,
  AlertTriangle,
  User,
  X,
  ExternalLink,
} from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user, role, switchRole } = useAuth();
  const { notifications, unreadCount, markNotificationRead, resetDemoData } = useComplaints();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile sidebar trigger & Role title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Workspace:
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-navy-50 text-navy-900 dark:bg-slate-800 dark:text-royal-300 border border-navy-200/50 dark:border-slate-700 capitalize">
            {role} Portal
          </span>
          {user?.department && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({user.department})
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all demo complaints and logs to initial state?')) {
              resetDemoData();
            }
          }}
          title="Reset Demo Data"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Notifications ({unreadCount} new)
                </span>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No new alerts
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.referenceId) {
                          navigate(`/track?ref=${n.referenceId}`);
                        }
                        setNotifOpen(false);
                      }}
                      className={cn(
                        'p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs',
                        !n.read && 'bg-blue-50/40 dark:bg-blue-950/20'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatRelativeTime(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            }
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
          />
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
              {user?.name}
            </span>
            <span className="text-[10px] text-slate-400 capitalize block leading-tight">
              {role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
