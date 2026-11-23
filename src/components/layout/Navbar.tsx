import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import {
  Shield,
  Search,
  PlusCircle,
  Sun,
  Moon,
  Menu,
  X,
  User,
  QrCode,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenQR?: () => void }> = ({ onOpenQR }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, switchRole, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Demo Helper Bar */}
      <div className="bg-navy-950 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">CampusCare Demo Environment</span>
          <span className="hidden sm:inline text-slate-400">• Institutional Grievance & Anti-Ragging Redressal Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Quick Test Role:</span>
          {(['student', 'officer', 'committee', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                switchRole(r);
                navigate(r === 'student' ? '/student' : r === 'officer' ? '/officer' : r === 'committee' ? '/committee' : '/admin');
              }}
              className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                role === r
                  ? 'bg-royal-600 text-white font-bold ring-1 ring-white/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-royal-600 flex items-center justify-center text-white shadow-md shadow-royal-600/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-navy-900 dark:text-white tracking-tight">
                Campus<span className="text-royal-600">Care</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-royal-100 dark:bg-royal-950 text-royal-700 dark:text-royal-300">
                Secure
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
              Confidential Campus Grievance System
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link to="/#features" className="hover:text-royal-600 dark:hover:text-royal-400 transition-colors">
            Features
          </Link>
          <Link to="/#how-it-works" className="hover:text-royal-600 dark:hover:text-royal-400 transition-colors">
            How It Works
          </Link>
          <Link to="/track" className="hover:text-royal-600 dark:hover:text-royal-400 transition-colors flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Track Case
          </Link>
          <Link to="/#heatmap" className="hover:text-royal-600 dark:hover:text-royal-400 transition-colors flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Campus Heatmap
          </Link>
          {onOpenQR && (
            <button
              onClick={onOpenQR}
              className="hover:text-royal-600 dark:hover:text-royal-400 transition-colors flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" /> QR Beacons
            </button>
          )}
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Track Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/track')}
            className="hidden sm:inline-flex"
            leftIcon={<Search className="w-3.5 h-3.5" />}
          >
            Track Grievance
          </Button>

          {/* Primary Submit Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/submit')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Submit Grievance
          </Button>

          {/* Portal / Login Button */}
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                navigate(
                  role === 'student'
                    ? '/student'
                    : role === 'officer'
                    ? '/officer'
                    : role === 'committee'
                    ? '/committee'
                    : '/admin'
                );
              }}
              leftIcon={<User className="w-3.5 h-3.5" />}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <Link
            to="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            Features
          </Link>
          <Link
            to="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            How It Works
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200 py-1"
          >
            Track Grievance
          </Link>
          <Link
            to="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-royal-600 dark:text-royal-400 py-1"
          >
            + Submit New Grievance
          </Link>
        </div>
      )}
    </header>
  );
};
