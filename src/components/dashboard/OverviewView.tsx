import React from 'react';
import { 
  BarChart3, 
  Target, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Clock,
  BookOpen
} from 'lucide-react';
import { ActiveTab, AnalysisResult, HistoryItem } from '../../types';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../../data/sampleData';

interface OverviewViewProps {
  onTabChange: (tab: ActiveTab) => void;
  onSelectSampleAndAnalyze: (resumeId: string, jdId: string) => void;
  history: HistoryItem[];
  activeAnalysis: AnalysisResult | null;
  onViewAnalysis: (analysisId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onTabChange,
  onSelectSampleAndAnalyze,
  history,
  activeAnalysis,
  onViewAnalysis,
}) => {
  // Compute aggregated stats
  const totalCount = history.length;
  const avgCosine = totalCount > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.cosineSimilarity, 0) / totalCount) 
    : 78;
  const avgOverall = totalCount > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.overallScore, 0) / totalCount) 
    : 81;
  const topMissing = history.length > 0 ? history[0].topMissingSkill : 'AWS';

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#3A506B] rounded-2xl p-8 text-white shadow-sm border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3 text-xs text-indigo-300 font-medium">
            <span>Academic Final Year Project</span>
            <span aria-hidden="true">·</span>
            <span>Local Explainable NLP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            AI ResumeMatch Analyzer
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Compare candidate resumes with target job requisitions using scikit-learn TF-IDF, Cosine Similarity, and 6-domain skill gap extraction. No third-party AI APIs or external keys required.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onTabChange('analyze')}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Launch Match Studio</span>
            </button>
            <button
              onClick={() => onTabChange('backend-guide')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10"
            >
              <Cpu className="w-4 h-4 text-indigo-300" />
              <span>Flask & SQLite Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Analyzed</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mb-1">
            {totalCount}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Logged comparisons</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg Cosine Match</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 mb-1">
            {avgCosine}%
          </div>
          <div className="text-xs text-slate-500">
            <span>Vector semantic overlap</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Avg Overall Score</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-600 mb-1">
            {avgOverall}%
          </div>
          <div className="text-xs text-slate-500">
            <span>Weighted ATS qualification</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Top Missing Skill</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 truncate mb-1">
            {topMissing}
          </div>
          <div className="text-xs text-slate-500">
            <span>Most frequent role vacancy</span>
          </div>
        </div>
      </div>

      {/* 1-Click Benchmark Match Presets */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Instant Benchmark Comparisons
            </h2>
            <p className="text-xs text-slate-500">
              Test the explainable TF-IDF algorithm instantly with pre-loaded candidate profiles and industry job requisitions.
            </p>
          </div>
          <button
            onClick={() => onTabChange('analyze')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0"
          >
            <span>Custom Upload / Paste</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-indigo-600 mb-1">Pairing 01 · Full Stack</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Alex Chen ↔ Acme SaaS Inc.</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                React, Node.js, TypeScript graduate tested against Mid-Level Full Stack role with PostgreSQL and Docker.
              </p>
            </div>
            <button
              onClick={() => onSelectSampleAndAnalyze('resume-fullstack', 'jd-fullstack')}
              className="w-full py-2 px-3 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
            >
              Analyze Full Stack Pair
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-indigo-600 mb-1">Pairing 02 · Data & ML</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Priya Sharma ↔ Cognitive Insights</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                M.S. Data Science researcher tested against Junior ML Engineer role requiring Scikit-Learn, PyTorch, and SQL.
              </p>
            </div>
            <button
              onClick={() => onSelectSampleAndAnalyze('resume-data-ml', 'jd-data-ml')}
              className="w-full py-2 px-3 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
            >
              Analyze ML / Data Pair
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-indigo-600 mb-1">Pairing 03 · DevOps & Cloud</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Marcus Vance ↔ Nexlify Cloud</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                AWS, Kubernetes & Terraform specialist tested against Cloud Infrastructure position with Python scripting.
              </p>
            </div>
            <button
              onClick={() => onSelectSampleAndAnalyze('resume-devops', 'jd-devops')}
              className="w-full py-2 px-3 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center"
            >
              Analyze Cloud / DevOps Pair
            </button>
          </div>
        </div>
      </div>

      {/* Recent Analyses and Methodology Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Analyses List */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Comparison Analyses</h2>
              <p className="text-xs text-slate-500">Stored locally and synced with SQLite database.</p>
            </div>
            <button
              onClick={() => onTabChange('history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View All History
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onViewAnalysis(item.id)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {item.resumeTitle}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="truncate">{item.jobTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                      {item.overallScore}%
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.matchedSkillCount} skills matched
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable Methodology Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-indigo-600">
              <BookOpen className="w-4 h-4" />
              <span>Explainable Methodology</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Why TF-IDF & Cosine Similarity?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Unlike black-box generative models that hallucinate scores, Term Frequency-Inverse Document Frequency (TF-IDF) mathematically calculates the contextual importance of each technical skill and keyword in your resume against the requisition.
            </p>
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-bold">1.</span>
                <span>Sublinear TF prevents keyword stuffing abuse.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-bold">2.</span>
                <span>Cosine angle measures true semantic direction.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-indigo-600 font-bold">3.</span>
                <span>Taxonomy extraction isolates missing skills by domain.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onTabChange('backend-guide')}
              className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              Inspect Python Algorithm Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
