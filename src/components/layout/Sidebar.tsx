import React from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  CheckCircle2, 
  Target, 
  ShieldCheck,
  History, 
  Terminal, 
  Sparkles,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedCount: number;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  isOpenMobile,
  onToggleMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'analyze' as ActiveTab, label: 'Resume Analyzer', icon: FileSearch },
    { id: 'results' as ActiveTab, label: 'Match Results', icon: CheckCircle2 },
    { id: 'ats-checker' as ActiveTab, label: 'ATS Compatibility', icon: ShieldCheck },
    { id: 'skills' as ActiveTab, label: 'Skill Gap Analysis', icon: Target },
    { id: 'dictionary' as ActiveTab, label: 'Skills Dictionary', icon: BookOpen },
    { id: 'history' as ActiveTab, label: 'Analysis History', icon: History, count: savedCount },
    { id: 'backend-guide' as ActiveTab, label: 'Flask Backend & DB', icon: Terminal },
    { id: 'about' as ActiveTab, label: 'About & FYP Guide', icon: GraduationCap },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    if (isOpenMobile) {
      onToggleMobile();
    }
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onToggleMobile} 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0B132B] border-r border-[#1C2541] text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C2541]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                AI ResumeMatch
              </span>
              <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">
                Explainable NLP Suite
              </span>
            </div>
          </div>
          <button 
            onClick={onToggleMobile} 
            className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-[#1C2541]/70 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined ? (
                  <span className="text-[11px] tabular-nums font-mono text-slate-400 px-1.5 py-0.5 bg-[#1C2541] rounded">
                    {item.count}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explainability Badge Footer */}
        <div className="p-4 mx-3 mb-4 rounded-xl bg-[#1C2541]/70 border border-slate-700/40">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-200">Local NLP Algorithm</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            TF-IDF Vectorizer & Cosine Similarity. No external AI APIs or keys required.
          </p>
        </div>

        {/* User / Meta Footer */}
        <div className="px-5 py-3 border-t border-[#1C2541] flex items-center justify-between text-xs text-slate-400">
          <span>Final Year Project</span>
          <span className="font-mono text-[11px] text-indigo-400">Phase 2</span>
        </div>
      </aside>
    </>
  );
};
