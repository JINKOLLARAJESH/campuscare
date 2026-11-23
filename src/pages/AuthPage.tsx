import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserRole } from '../types';
import {
  Shield,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, switchRole } = useAuth();
  const { success, error, info } = useToast();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Missing credentials', 'Please enter both your email address and password.');
      return;
    }
    const ok = login(email, selectedRole);
    if (ok) {
      success('Authentication Successful', `Welcome back to CampusCare.`);
      navigate(
        selectedRole === 'student'
          ? '/student'
          : selectedRole === 'officer'
          ? '/officer'
          : selectedRole === 'committee'
          ? '/committee'
          : '/admin'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      error('Incomplete Registration', 'Please fill in all mandatory fields.');
      return;
    }
    const ok = register(name, email, rollNumber);
    if (ok) {
      success('Account Created', 'Welcome to CampusCare! Redirecting to student portal.');
      navigate('/student');
    }
  };

  // Demo 1-click accounts
  const demoAccounts = [
    {
      role: 'student' as UserRole,
      title: 'Student Account',
      name: 'Priya Sharma (Roll: 2024CS1042)',
      email: 'priya.sharma@campus.edu',
      desc: 'Submit anonymous & identified grievances, track status, chat with wardens.',
      route: '/student',
      badge: 'B.Tech Student',
    },
    {
      role: 'officer' as UserRole,
      title: 'Hostel Department Officer',
      name: 'Dr. Arvind Menon (Chief Warden)',
      email: 'arvind.menon@campus.edu',
      desc: 'Inspect assigned hostel plumbing, mess issues, update status, send replies.',
      route: '/officer',
      badge: 'Hostel Administration',
    },
    {
      role: 'committee' as UserRole,
      title: 'Grievance Committee Chair',
      name: 'Prof. Sunita Nair (Ombudsman)',
      email: 'sunita.nair@campus.edu',
      desc: 'Restricted vault for anti-ragging, faculty ethics, and escalated inquiries.',
      route: '/committee',
      badge: 'Ombudsman & ICC',
    },
    {
      role: 'admin' as UserRole,
      title: 'Chief Proctor & Super Admin',
      name: 'Dr. Vikramaditya Rao',
      email: 'admin.rao@campus.edu',
      desc: 'Institution-wide metrics, SLA escalation rules, user directory, audit trail.',
      route: '/admin',
      badge: 'System Admin',
    },
  ];

  const handleQuickDemoLogin = (acc: typeof demoAccounts[0]) => {
    switchRole(acc.role);
    login(acc.email, acc.role);
    success(`Signed in as ${acc.title}`, `Welcome ${acc.name}`);
    navigate(acc.route);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick 1-Click Demo Accounts */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-900 to-royal-800 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  Instant Demo Access
                </span>
              </div>
              <h3 className="text-lg font-extrabold tracking-tight">
                One-Click Role Switcher
              </h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Click any persona below to immediately log into their authentic dashboard with realistic grievance data, permissions, and audit logs.
              </p>
            </div>

            <div className="space-y-2.5">
              {demoAccounts.map((acc) => (
                <div
                  key={acc.role}
                  onClick={() => handleQuickDemoLogin(acc)}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-royal-600 dark:hover:border-royal-500 shadow-sm hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-royal-600 transition-colors">
                          {acc.title}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                          {acc.badge}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mt-0.5">
                        {acc.name}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] py-1 px-2.5 shrink-0"
                    >
                      Login →
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {acc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Standard Auth Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 shadow-xl border-slate-200/80 dark:border-slate-800">
              {/* Tab Selector */}
              <div className="flex items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 pb-2 text-sm font-bold text-center border-b-2 transition-colors ${
                    authMode === 'login'
                      ? 'border-royal-600 text-royal-600 dark:text-royal-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In to Account
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 pb-2 text-sm font-bold text-center border-b-2 transition-colors ${
                    authMode === 'register'
                      ? 'border-royal-600 text-royal-600 dark:text-royal-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Register as Student
                </button>
              </div>

              {/* Login Form */}
              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                      Select Target Role
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['student', 'officer', 'committee', 'admin'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setSelectedRole(r);
                            const match = demoAccounts.find((d) => d.role === r);
                            if (match) {
                              setEmail(match.email);
                              setPassword('Campus@2026!');
                            }
                          }}
                          className={`p-2 rounded-lg text-xs font-semibold capitalize border transition-all text-center ${
                            selectedRole === r
                              ? 'bg-navy-900 text-white dark:bg-royal-600 border-transparent shadow'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Campus Institutional Email"
                    type="email"
                    placeholder="e.g. yourname@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    required
                  />

                  <div className="space-y-1">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      required
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-xs font-semibold text-royal-600 dark:text-royal-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full text-sm font-bold shadow"
                    leftIcon={<LogIn className="w-4 h-4" />}
                  >
                    Authenticate and Access Console
                  </Button>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Arjun Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User className="w-4 h-4 text-slate-400" />}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Institutional Email"
                      type="email"
                      placeholder="e.g. arjun.patel@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                      required
                    />

                    <Input
                      label="Student Roll / Enrollment No."
                      placeholder="e.g. 2025EE1099"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      leftIcon={<GraduationCap className="w-4 h-4 text-slate-400" />}
                      required
                    />
                  </div>

                  <Input
                    label="Choose Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />

                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed border border-blue-200 dark:border-blue-900">
                    <strong>Note:</strong> Registration is for identified student records. You can still choose to submit completely anonymous complaints at any time without linking your identity.
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full text-sm font-bold shadow"
                    leftIcon={<UserPlus className="w-4 h-4" />}
                  >
                    Create Enrolled Account
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-royal-600" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Password
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your registered campus email. A password reset link will be dispatched to your university inbox.
            </p>
            <Input
              label="Campus Email"
              type="email"
              placeholder="e.g. student@campus.edu"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForgotPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  info('Reset Link Dispatched', `Password recovery sent to ${resetEmail || 'your email'}.`);
                  setForgotPasswordOpen(false);
                }}
              >
                Send Reset Link
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
