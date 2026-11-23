import React from 'react';
import { Shield, Phone, Mail, ExternalLink, Heart, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-royal-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">
                Campus<span className="text-royal-400">Care</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Institutional anonymous grievance redressal, UGC anti-ragging compliance, and transparent campus dispute resolution engine.
            </p>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              256-Bit Encrypted Anonymous Communication Channel
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Redressal Portals
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/submit" className="hover:text-white transition-colors">
                  Submit Anonymous Complaint
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Grievance with Reference ID
                </Link>
              </li>
              <li>
                <Link to="/#heatmap" className="hover:text-white transition-colors">
                  Campus Safety Heatmap
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-white transition-colors">
                  Officer & Committee Sign-In
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Regulations */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Compliance & Safety
            </h5>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>UGC Grievance Redressal Regulations (2023)</li>
              <li>Supreme Court Anti-Ragging Guidelines</li>
              <li>Internal Complaints Committee (ICC / POSH)</li>
              <li>Zero Tolerance Whistleblower Protection</li>
            </ul>
          </div>

          {/* Col 4: Campus Helplines */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Emergency & Helplines
            </h5>
            <div className="space-y-2 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Anti-Ragging 24/7 Helpline: <strong>1800-180-5522</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Campus Proctor Desk: <strong>+91 (011) 2659-1000</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Email: <strong>grievance@campus.edu</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusCare Institutional Redressal System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Student Rights Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
