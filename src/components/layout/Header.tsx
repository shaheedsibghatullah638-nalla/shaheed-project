import React from 'react';
import { ActiveTab } from '../../types';
import { Sparkles, Terminal, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  engineMode: 'browser' | 'flask';
  onToggleEngineMode: (mode: 'browser' | 'flask') => void;
  hasActiveAnalysis: boolean;
  onNewAnalysis: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; breadcrumb: string }> = {
  'dashboard': { title: 'Dashboard Overview', breadcrumb: 'Workspace / Overview' },
  'analyze': { title: 'Resume & Job Analyzer', breadcrumb: 'Workspace / Match Studio' },
  'results': { title: 'Match Results & Metrics', breadcrumb: 'Workspace / Analysis Report' },
  'skills': { title: 'Skill Gap Breakdown', breadcrumb: 'Workspace / Skill Taxonomy' },
  'ats-checker': { title: 'ATS Compatibility Audit', breadcrumb: 'Workspace / ATS Checker' },
  'dictionary': { title: 'Skills & Keyword Dictionary', breadcrumb: 'Workspace / Taxonomy Editor' },
  'history': { title: 'Analysis History', breadcrumb: 'Workspace / Past Analyses' },
  'backend-guide': { title: 'Flask Backend & Architecture', breadcrumb: 'System / Python & SQLite' },
  'about': { title: 'Project Overview & Viva Guide', breadcrumb: 'Academic / FYP Guide' },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  engineMode,
  onToggleEngineMode,
  hasActiveAnalysis,
  onNewAnalysis,
}) => {
  const current = TAB_TITLES[activeTab] || { title: 'Workspace', breadcrumb: 'AI ResumeMatch' };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Breadcrumb trail */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 whitespace-nowrap">
          <span>AI ResumeMatch</span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">{current.breadcrumb}</span>
        </div>
      </div>

      {/* Zone 2: Engine Selector & Quick Status */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => onToggleEngineMode('browser')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs ${
              engineMode === 'browser'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Browser NLP Engine
          </button>
          <button
            onClick={() => onToggleEngineMode('flask')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs flex items-center gap-1.5 ${
              engineMode === 'flask'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Flask API (Port 5000)</span>
          </button>
        </div>

        {hasActiveAnalysis && activeTab !== 'results' && (
          <button
            onClick={() => onTabChange('results')}
            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap shrink-0 font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>View Latest Results</span>
          </button>
        )}
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-xs whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Comparison</span>
        </button>
      </div>
    </header>
  );
};
