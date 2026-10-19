import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ArrowRight, 
  Layers, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AnalysisResult, SkillCategory, SkillItem } from '../../types';

interface SkillGapViewProps {
  analysis: AnalysisResult | null;
  onGoToAnalyze: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  analysis,
  onGoToAnalyze,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'missing' | 'matched'>('all');

  if (!analysis) {
    return (
      <div className="p-12 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
        <Target className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 mb-1">No Active Skill Gap Report</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Run an analysis in the Match Studio or select a sample resume to inspect the 6-domain skill gap breakdown.
        </p>
        <button
          onClick={onGoToAnalyze}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
        >
          Go to Match Studio
        </button>
      </div>
    );
  }

  const allSkills: SkillItem[] = [
    ...analysis.matchedSkills,
    ...analysis.missingSkills
  ];

  const filteredSkills = allSkills.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesStatus = 
      filterType === 'all' ? true :
      filterType === 'missing' ? !skill.foundInResume :
      skill.foundInResume;
    return matchesCategory && matchesStatus;
  });

  const categories = ['All', ...analysis.categoryGaps.map(c => c.category)];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Skill Taxonomy Engine</span>
            <span aria-hidden="true">·</span>
            <span>{allSkills.length} Total Evaluated Skills</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            6-Domain Skill Gap & Coverage Analysis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Skill Coverage</div>
            <div className="text-lg font-bold font-mono tabular-nums text-indigo-600">
              {analysis.skillMatchScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Category Progress Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysis.categoryGaps.map((gap) => {
          const isHigh = gap.matchPercentage >= 75;
          const isMedium = gap.matchPercentage >= 50 && gap.matchPercentage < 75;

          return (
            <div
              key={gap.category}
              onClick={() => setSelectedCategory(gap.category)}
              className={`p-5 bg-white border rounded-xl shadow-xs cursor-pointer transition-all ${
                selectedCategory === gap.category 
                  ? 'border-indigo-600 ring-2 ring-indigo-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{gap.category}</span>
                <span className="text-xs font-mono font-bold tabular-nums text-slate-700">
                  {gap.matchPercentage}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isHigh ? 'bg-emerald-500' : isMedium ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${gap.matchPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-700 font-medium">
                  {gap.matchedCount} matched
                </span>
                <span className="text-rose-700 font-medium">
                  {gap.missingCount} missing
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Filter & Listing Section */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs self-start md:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-colors ${filterType === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              All ({allSkills.length})
            </button>
            <button
              onClick={() => setFilterType('missing')}
              className={`px-3 py-1 rounded-md transition-colors ${filterType === 'missing' ? 'bg-white font-semibold text-rose-700 shadow-xs' : 'text-slate-600'}`}
            >
              Missing ({analysis.missingSkills.length})
            </button>
            <button
              onClick={() => setFilterType('matched')}
              className={`px-3 py-1 rounded-md transition-colors ${filterType === 'matched' ? 'bg-white font-semibold text-emerald-700 shadow-xs' : 'text-slate-600'}`}
            >
              Matched ({analysis.matchedSkills.length})
            </button>
          </div>
        </div>

        {/* Skills Detailed Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSkills.map((skill, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
                skill.foundInResume
                  ? 'bg-emerald-50/20 border-emerald-200/80'
                  : 'bg-rose-50/20 border-rose-200/80'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {skill.foundInResume ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-900">{skill.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                    {skill.category}
                  </span>
                </div>

                {skill.foundInResume ? (
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Found in resume text (Matches job requirements)
                  </p>
                ) : (
                  <p className="text-[11px] text-rose-700 mt-1">
                    Requested in job description ({skill.frequencyInJD} {skill.frequencyInJD === 1 ? 'mention' : 'mentions'}) · Not found in resume
                  </p>
                )}
              </div>

              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${
                skill.importance === 'Required' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {skill.importance}
              </span>
            </div>
          ))}

          {filteredSkills.length === 0 && (
            <div className="col-span-2 py-8 text-center text-xs text-slate-400">
              No skills match the selected filter combination.
            </div>
          )}
        </div>
      </div>

      {/* Learning & Resume Integration Plan */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-600">
          <BookOpen className="w-4 h-4" />
          <span>Strategic Resume Enhancement Roadmap</span>
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-2">
          How to Bridge Missing Skills for Candidates
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          When a resume lacks key required skills, candidates can adopt these three industry-standard strategies to legitimately pass automated screening:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-indigo-600 block mb-1">1. Academic & Coursework Proof</span>
            <p className="text-slate-600 leading-relaxed">
              If you studied missing technologies (e.g. SQL, Docker, Scikit-Learn) during university courses or lab projects, explicitly list the course and relevant assignments under your Education section.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-indigo-600 block mb-1">2. Dedicated Projects Section</span>
            <p className="text-slate-600 leading-relaxed">
              Build a focused capstone or open-source repo integrating the missing tools. Mention the GitHub repository link and measurable outcomes (e.g., containerized deployment with Docker).
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="font-bold text-indigo-600 block mb-1">3. Vocabulary Alignment</span>
            <p className="text-slate-600 leading-relaxed">
              Ensure you do not use synonyms that ATS engines miss. If the job requests "PostgreSQL", do not just write "RDBMS"; use the exact standard nomenclature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
