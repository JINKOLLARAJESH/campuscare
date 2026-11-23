import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { AIAnalysisBadge } from '../components/complaints/AIAnalysisBadge';
import { classifyComplaint, AIClassificationResult } from '../lib/aiClassifier';
import { INITIAL_LOCATIONS } from '../lib/mockData';
import { ComplaintCategory, ComplaintPriority, Complaint } from '../types';
import {
  Shield,
  UserCheck,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Paperclip,
  Calendar,
  Building2,
  AlertTriangle,
  UploadCloud,
  FileCheck2,
  Lock,
  ArrowRight,
  HelpCircle,
  EyeOff,
  Flame,
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SubmitComplaintPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { submitComplaint } = useComplaints();
  const { user } = useAuth();
  const { success, warning } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);

  // Form Fields
  const [category, setCategory] = useState<ComplaintCategory>('Hostel');
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(
    searchParams.get('location') || INITIAL_LOCATIONS[0].name
  );
  const [incidentDate, setIncidentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [reportingMode, setReportingMode] = useState<'anonymous' | 'identified'>('anonymous');
  const [attachments, setAttachments] = useState<
    { name: string; size: string; type: string; url: string }[]
  >([]);

  // Submission Result State
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Auto-fill location if query param exists
  useEffect(() => {
    const locParam = searchParams.get('location');
    if (locParam) {
      setLocation(locParam);
    }
  }, [searchParams]);

  const categoriesList: {
    category: ComplaintCategory;
    icon: string;
    description: string;
    sensitive?: boolean;
  }[] = [
    { category: 'Hostel', icon: '🛏️', description: 'Rooms, water supply, washrooms, wardens, cleanliness' },
    { category: 'Mess', icon: '🍲', description: 'Food hygiene, catering quality, dining facilities' },
    { category: 'Academics', icon: '📚', description: 'Exam schedule clashes, labs, attendance, syllabus' },
    { category: 'Faculty', icon: '👨‍🏫', description: 'Evaluation bias, conduct, viva issues (Restricted)', sensitive: true },
    { category: 'Infrastructure', icon: '🏢', description: 'Classroom AV, power cuts, AC, plumbing, civil repairs' },
    { category: 'Harassment and Safety', icon: '🛡️', description: 'Anti-ragging, campus lighting, safety (Confidential)', sensitive: true },
    { category: 'Administration', icon: '📄', description: 'Transcripts, bonafide delay, scholarships, certificates' },
    { category: 'Other', icon: '💬', description: 'General student welfare and miscellaneous concerns' },
  ];

  // AI Classification Trigger
  const handleAutoClassify = async () => {
    if (!description.trim()) {
      warning('Description Required', 'Please enter a detailed description first for AI classification.');
      return;
    }
    setIsClassifying(true);
    try {
      const result = await classifyComplaint(description, title);
      setAiResult(result);
      success('AI Grievance Analysis Completed', `Detected: ${result.category} (${result.priority} Urgency)`);
    } catch {
      // Fallback
    } finally {
      setIsClassifying(false);
    }
  };

  const applyAISuggestions = () => {
    if (!aiResult) return;
    setCategory(aiResult.category);
    setSubcategory(aiResult.subcategory);
    setPriority(aiResult.priority);
    success('Applied AI Recommendations', `Category set to ${aiResult.category}`);
  };

  const handleSimulateAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newAtts = Array.from(files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.type || 'image/jpeg',
        url: URL.createObjectURL(f),
      }));
      setAttachments([...attachments, ...newAtts]);
    }
  };

  const handleFinalSubmit = () => {
    if (!title.trim() || !description.trim()) {
      warning('Required Fields', 'Please complete title and description.');
      return;
    }

    const complaint = submitComplaint({
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory.trim() || 'General Issue',
      location,
      incidentDate,
      priority,
      reportingMode,
      attachments,
      aiClassified: aiResult
        ? {
            suggestedCategory: aiResult.category,
            suggestedSubcategory: aiResult.subcategory,
            suggestedPriority: aiResult.priority,
            suggestedDepartment: aiResult.department,
            confidence: aiResult.confidence,
            keywords: aiResult.keywords,
          }
        : undefined,
    });

    setCreatedComplaint(complaint);
    setCurrentStep(5); // Success step

    // Launch celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col transition-colors duration-150">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Step Indicator Progress Bar */}
        {currentStep <= 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span className={cn(currentStep >= 1 && 'text-navy-900 dark:text-royal-400')}>
                1. Category
              </span>
              <span className={cn(currentStep >= 2 && 'text-navy-900 dark:text-royal-400')}>
                2. Details
              </span>
              <span className={cn(currentStep >= 3 && 'text-navy-900 dark:text-royal-400')}>
                3. Privacy Mode
              </span>
              <span className={cn(currentStep >= 4 && 'text-navy-900 dark:text-royal-400')}>
                4. Review & Submit
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-royal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Choose Complaint Category */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">
                Step 1: Choose Grievance Category
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Select the area of campus operations that best matches your grievance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {categoriesList.map((c) => {
                const isSelected = category === c.category;
                return (
                  <div
                    key={c.category}
                    onClick={() => setCategory(c.category)}
                    className={cn(
                      'p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3',
                      isSelected
                        ? 'border-royal-600 bg-blue-50/60 dark:bg-royal-950/40 ring-2 ring-royal-600/30'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    )}
                  >
                    <span className="text-2xl p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0">
                      {c.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {c.category}
                        </h4>
                        {c.sensitive && (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                            Confidential
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(2)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Enter Information & AI Classifier */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">
                Step 2: Grievance Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Provide comprehensive details to help the department take precise action.
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <Input
                label="Complaint Title"
                placeholder="e.g. Disrupted water supply on 3rd floor of Hostel Block A"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Detailed Grievance Description
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoClassify}
                    isLoading={isClassifying}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-royal-600" />}
                    className="text-xs py-1"
                  >
                    AI Auto-Classify
                  </Button>
                </div>
                <Textarea
                  placeholder="Describe exactly what occurred, when it started, how many students are affected, and what oral or written requests were made..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* AI Classification Insights Card */}
              {aiResult && (
                <AIAnalysisBadge analysis={aiResult} onApply={applyAISuggestions} />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Subcategory / Issue Tag"
                  placeholder="e.g. Water Supply, Lab Probes, Dining Hall"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />

                <Select
                  label="Campus Location / Facility"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {INITIAL_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.building})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Date of Incident / Occurrence"
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />

                <Select
                  label="Suggested Urgency / Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                >
                  <option value="Low">Low — Routine maintenance or non-urgent</option>
                  <option value="Medium">Medium — Affects multiple students</option>
                  <option value="High">High — Immediate disruption to classes/living</option>
                  <option value="Critical">Critical — Severe safety or health hazard</option>
                </Select>
              </div>

              {/* File Attachment Upload */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Attach Evidence (Photos / Documents / Audio)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleSimulateAttachment}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-royal-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Click to browse or drop files here
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    PNG, JPG, PDF, MP3 up to 15MB
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachments.map((a, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{a.name}</span>
                        <span className="text-[10px] text-slate-400">({a.size})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (!title.trim() || !description.trim()) {
                    warning('Incomplete Information', 'Please provide a title and detailed description.');
                    return;
                  }
                  setCurrentStep(3);
                }}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Continue to Privacy Mode
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Reporting Mode (Anonymous vs Identified) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">
                Step 3: Choose Reporting Mode
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                You decide how you wish to communicate with the grievance committee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option 1: Anonymous */}
              <div
                onClick={() => setReportingMode('anonymous')}
                className={cn(
                  'p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between',
                  reportingMode === 'anonymous'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                )}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Anonymous Grievance
                      </h3>
                      {reportingMode === 'anonymous' && (
                        <Check className="w-5 h-5 text-emerald-600 font-bold" />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      Identity Completely Shielded
                    </span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/50">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Zero student identifiers recorded in database.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Generates private Tracking Token for you alone.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      Allows 2-way anonymous follow-up chat with officers.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Option 2: Identified */}
              <div
                onClick={() => setReportingMode('identified')}
                className={cn(
                  'p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between',
                  reportingMode === 'identified'
                    ? 'border-royal-600 bg-blue-50/50 dark:bg-royal-950/30 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                )}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-royal-950 text-royal-600 dark:text-royal-400 flex items-center justify-center">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Identified Grievance
                      </h3>
                      {reportingMode === 'identified' && (
                        <Check className="w-5 h-5 text-royal-600 font-bold" />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-royal-600 dark:text-royal-400 block mt-0.5">
                      Attached Authenticated Student Profile
                    </span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-blue-100 dark:border-royal-900/50">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-royal-500 shrink-0" />
                      Links your name ({user?.name || 'Current Student'}) & Roll No.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-royal-500 shrink-0" />
                      Authorized officer can contact you directly.
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-royal-500 shrink-0" />
                      Identity is protected under statutory privacy laws.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(2)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep(4)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Review Grievance File
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white">
                Step 4: Final Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Inspect your grievance record before official dispatch to campus administration.
              </p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Case Submission Summary
                </span>
                <span
                  className={cn(
                    'text-xs font-bold px-2.5 py-0.5 rounded-full border',
                    reportingMode === 'anonymous'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400'
                  )}
                >
                  {reportingMode === 'anonymous' ? '🛡️ Anonymous Mode' : '👤 Identified Mode'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Category & Facility</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {category} • {location}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Grievance Title</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {title}
                </h4>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Description</span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 whitespace-pre-line">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Incident Date</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{incidentDate}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Urgency</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{priority}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Evidence Files</span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {attachments.length} Attached
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(3)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="success"
                size="lg"
                onClick={handleFinalSubmit}
                leftIcon={<FileCheck2 className="w-5 h-5" />}
                className="font-bold shadow-lg"
              >
                Confirm and Lodge Grievance
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: Success & Unique Tracking Credentials Screen */}
        {currentStep === 5 && createdComplaint && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-center sm:text-left">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
                  Grievance Successfully Registered
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your case has been sealed and auto-routed to the <strong>{createdComplaint.assignedDepartment}</strong>.
                </p>
              </div>

              {/* Reference ID and Secret Credentials Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                {/* Reference ID */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Case Reference ID
                    </span>
                    <span className="font-mono text-xl font-extrabold text-navy-900 dark:text-royal-300">
                      {createdComplaint.referenceId}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(createdComplaint.referenceId);
                      setCopiedRef(true);
                      setTimeout(() => setCopiedRef(false), 2000);
                    }}
                    leftIcon={copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedRef ? 'Copied' : 'Copy ID'}
                  </Button>
                </div>

                {/* Tracking Secret Token (if anonymous) */}
                {createdComplaint.reportingMode === 'anonymous' && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                        Private Tracking Secret Token (Save This!)
                      </span>
                      <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                        {createdComplaint.trackingSecret}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(createdComplaint.trackingSecret);
                        setCopiedSecret(true);
                        setTimeout(() => setCopiedSecret(false), 2000);
                      }}
                      leftIcon={copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copiedSecret ? 'Copied' : 'Copy Token'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                Save both your Reference ID and Secret Token. You can use them to look up live status updates, inspection notes, and exchange replies anonymously without needing an account.
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() =>
                    navigate(
                      `/track?ref=${createdComplaint.referenceId}&secret=${createdComplaint.trackingSecret}`
                    )
                  }
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Track This Case Now
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setCurrentStep(1);
                    setTitle('');
                    setDescription('');
                    setAttachments([]);
                    setCreatedComplaint(null);
                  }}
                  className="w-full sm:w-auto"
                >
                  Submit Another Grievance
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
