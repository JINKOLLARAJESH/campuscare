import React from 'react';
import { Sparkles, ShieldAlert, Cpu } from 'lucide-react';
import { AIClassificationResult } from '../../lib/aiClassifier';

export interface AIAnalysisBadgeProps {
  analysis: AIClassificationResult;
  onApply?: () => void;
}

export const AIAnalysisBadge: React.FC<AIAnalysisBadgeProps> = ({ analysis, onApply }) => {
  return (
    <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              AI Grievance Insights
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-semibold">
                {Math.round(analysis.confidence * 100)}% Match
              </span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Automated routing analysis and risk assessment
            </p>
          </div>
        </div>

        {analysis.isSensitive && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5" />
            Sensitive Case Flag
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-900/40 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Category</span>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{analysis.category}</div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Subcategory</span>
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{analysis.subcategory}</div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Urgency</span>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{analysis.priority}</div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-400">Target Unit</span>
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{analysis.department}</div>
        </div>
      </div>

      {analysis.keywords && analysis.keywords.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 font-medium">Keywords:</span>
          {analysis.keywords.map((kw, i) => (
            <span
              key={i}
              className="text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300"
            >
              #{kw}
            </span>
          ))}
        </div>
      )}

      {onApply && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onApply}
            className="text-xs font-semibold text-royal-600 dark:text-royal-400 hover:underline flex items-center gap-1"
          >
            <Cpu className="w-3.5 h-3.5" />
            Apply AI Suggested Fields
          </button>
        </div>
      )}
    </div>
  );
};
