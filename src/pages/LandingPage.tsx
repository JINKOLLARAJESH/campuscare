import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CampusHeatmap } from '../components/heatmap/CampusHeatmap';
import { QRCodeModal } from '../components/qr/QRCodeModal';
import {
  Shield,
  Search,
  PlusCircle,
  Lock,
  Cpu,
  Clock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Users,
  EyeOff,
  Scale,
  FileCheck,
} from 'lucide-react';
import { cn } from '../lib/utils';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can campus authorities identify me if I submit an Anonymous complaint?',
      a: 'No. Anonymous submissions are cryptographically stripped of all personal identifiers before being saved in the database. Neither IP addresses, email addresses, nor device footprints are linked to the case. You receive a unique Tracking Token that only you hold.',
    },
    {
      q: 'What happens if a department officer ignores my grievance?',
      a: 'CampusCare features an automated 4-level escalation engine. If a complaint is not acknowledged or acted upon within the strict deadline (48-72 hours), the system automatically promotes the case to the Head of Department, then to the Institutional Grievance Committee, and finally to the Director Office.',
    },
    {
      q: 'How does the AI classification assist in complaint routing?',
      a: 'Our built-in natural language engine evaluates complaint descriptions in real time, detecting urgency levels, facilities involved, and relevant keywords to route the case directly to the responsible team (e.g., Hostel Admin or Mess Committee). Sensitive cases involving ragging or harassment bypass standard departmental queues straight to the Confidential Grievance Committee.',
    },
    {
      q: 'Can I communicate with the investigating officer without revealing who I am?',
      a: 'Yes! The case file includes an encrypted two-way anonymous messaging channel where you can clarify details, submit additional photos or receipts, and receive direct updates while your identity remains shielded as "Anonymous Student".',
    },
    {
      q: 'What should I do if an issue is marked resolved but wasn’t actually fixed?',
      a: 'Students hold final closure authority. If a problem persists, you can click "Reopen Issue" on your tracking page with an explanation. This triggers an immediate alert to supervisory nodal authorities.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col transition-colors duration-150">
      <Navbar onOpenQR={() => setQrModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-200/80 dark:border-slate-800">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-royal-950/60 border border-blue-200 dark:border-royal-800 text-royal-700 dark:text-royal-300 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero-Retaliation • 100% Anonymous Redressal Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 dark:text-white tracking-tight leading-[1.12]">
                Your Voice Matters. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-600 via-blue-600 to-indigo-600 dark:from-royal-400 dark:to-indigo-400">
                  Your Campus Cares.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A modern campus grievance platform empowering students to report hostel, mess, academic, or safety concerns anonymously or identified. Track real-time progress, exchange secure messages, and enforce institutional accountability.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/submit')}
                  leftIcon={<PlusCircle className="w-5 h-5 text-white" />}
                  className="w-full sm:w-auto shadow-lg shadow-navy-900/20 dark:shadow-royal-600/30 text-base"
                >
                  Submit a Complaint
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/track')}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="w-full sm:w-auto text-base"
                >
                  Track by Reference ID
                </Button>

                <button
                  onClick={() => setQrModalOpen(true)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-royal-600 dark:hover:text-royal-400 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Scan Campus QR
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No Login Needed for Anonymous</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>UGC & Anti-Ragging Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Automated 4-Tier Escalation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-royal-600 to-indigo-600 opacity-20 blur-xl" />

                <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        CASE: CC-2026-00821
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                      Under Investigation
                    </span>
                  </div>

                  {/* Title & Preview details */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Hostel Administration • Wing C
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Disrupted water supply on 3rd & 4th floors of Hostel Block A
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      Over 60 students affected. Pump capacitor failure identified; replacement scheduled by 5 PM.
                    </p>
                  </div>

                  {/* Progress Milestone Line */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">Resolution Progress</span>
                      <span className="text-royal-600 dark:text-royal-400">Stage 3 of 5</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-royal-600 to-emerald-500 h-full w-[65%] rounded-full transition-all" />
                    </div>
                  </div>

                  {/* Two-Way Anonymous Chat Preview */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Confidential Officer Message</span>
                      <span>2h ago</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">
                      "Dear student, replacement capacitor has been dispatched. Emergency water tanker was positioned on ground floor. Thank you for reporting."
                    </p>
                  </div>

                  {/* Interactive Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => navigate('/track?ref=CC-2026-00821')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Experience Live Tracking Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white">
                98.4%
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resolution Rate
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-royal-600 dark:text-royal-400">
                2.1 Days
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Average Turnaround
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white">
                100%
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Identity Shielded
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                2,480+
              </span>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resolved Campus Cases
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nine Core Features Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-royal-600 dark:text-royal-400">
            Institutional Integrity Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            Engineered for Student Protection & Transparent Redressal
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every feature is designed to bridge the trust gap between students and campus administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card hover className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-royal-950/60 text-royal-600 dark:text-royal-400 flex items-center justify-center">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              True Anonymous Submissions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit reports without logging in or revealing your identity. A secure cryptographic token allows you alone to track progress and follow up.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card hover className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Automated 4-Tier Escalation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If an assigned officer does not take action within configured SLA hours, the grievance is automatically escalated up to the Proctor and Director Office.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card hover className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI NLP Grievance Triage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Semantic analysis auto-detects urgency, identifies facility keywords, and routes complaints to the exact department desk instantly.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card hover className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Restricted Committee Vault
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Harassment, ragging, and faculty ethics complaints are sealed and routed exclusively to statutory Ombudsman and Grievance Committee members.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card hover className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Location-Tagged QR Beacons
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              QR codes stationed at hostels, canteens, washrooms, and labs allow students to launch immediate pre-filled incident reports in seconds.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card hover className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Student Reopen Mandate
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Officers cannot arbitrarily close grievances. Students hold confirmation rights and can reopen unresolved cases with mandatory explanation.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-royal-600 dark:text-royal-400">
              Simple 4-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              How Redressal Works in CampusCare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="space-y-3 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-royal-600 text-white font-bold flex items-center justify-center text-sm shadow">
                01
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Submit Report
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose Anonymous or Identified mode. Provide description, location, and optional photo or document attachments.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-royal-600 text-white font-bold flex items-center justify-center text-sm shadow">
                02
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Get Reference Key
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive a Reference ID (e.g., CC-2026-00821) and a private Tracking Secret Token for your records.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-royal-600 text-white font-bold flex items-center justify-center text-sm shadow">
                03
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Action & Chat
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The authorized department officer inspects the issue. Exchange questions and answers via the private message box.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 text-center sm:text-left relative">
              <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-royal-600 text-white font-bold flex items-center justify-center text-sm shadow">
                04
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Resolution & Closure
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Review verified resolution notes. Confirm satisfaction, rate the response, or reopen the case if incomplete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Heatmap Section */}
      <section id="heatmap" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CampusHeatmap />
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-royal-600 dark:text-royal-400">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Privacy, Security, and Redressal Guarantees
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white hover:text-royal-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4',
                        isOpen && 'rotate-180 text-royal-600'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} />

      <Footer />
    </div>
  );
};
