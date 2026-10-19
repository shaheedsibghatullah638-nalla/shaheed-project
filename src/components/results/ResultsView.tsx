import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  Copy, 
  Share2, 
  TrendingUp, 
  FileText, 
  Target, 
  Info,
  Check,
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AnalysisResult, ActiveTab } from '../../types';
import { 
  downloadHtmlReport, 
  downloadMarkdownReport, 
  openPrintReport 
} from '../../services/reportGenerator';

interface ResultsViewProps {
  analysis: AnalysisResult;
  onTabChange: (tab: ActiveTab) => void;
  onNewAnalysis: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  analysis,
  onTabChange,
  onNewAnalysis,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTermFilter, setSelectedTermFilter] = useState<'all' | 'skills' | 'keywords'>('all');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const filteredTermWeights = analysis.topTermWeights.filter(t => {
    if (selectedTermFilter === 'skills') return t.isSkill;
    if (selectedTermFilter === 'keywords') return !t.isSkill;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBadgeBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (score >= 40) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const copyReportSummary = () => {
    const text = `AI ResumeMatch Analysis Report
--------------------------------------
Resume: ${analysis.resumeTitle}
Target Role: ${analysis.jobTitle}
Overall Textual Score: ${analysis.overallScore}%
TF-IDF Cosine Similarity: ${analysis.cosineSimilarity}%
Skill Coverage: ${analysis.skillMatchScore}%
ATS Readability: ${analysis.atsReadabilityScore}%

Matched Skills (${analysis.matchedSkills.length}):
${analysis.matchedSkills.map(s => `• ${s.name} (${s.category})`).join('\n')}

Missing Skills (${analysis.missingSkills.length}):
${analysis.missingSkills.map(s => `• ${s.name} [${s.importance}] (${s.category})`).join('\n')}

Key Suggested Improvements:
${analysis.recommendations.map(r => `• [${r.type.toUpperCase()}] ${r.title}\n  Action: ${r.suggestedAction}`).join('\n')}

Notice: The similarity score measures textual relevance and vocabulary overlap, not the probability of getting hired.
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `ai-resumematch-${analysis.id}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-8">
      {/* Top Bar Banner with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-mono">{analysis.timestamp}</span>
            <span aria-hidden="true">·</span>
            <span>Local scikit-learn TF-IDF Match</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {analysis.resumeTitle} ↔ {analysis.jobTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => downloadHtmlReport(analysis)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
            title="Download formatted HTML / Printable PDF report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (PDF/HTML)</span>
          </button>
          <button
            onClick={() => downloadMarkdownReport(analysis)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Download structured Markdown report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>
          <button
            onClick={copyReportSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={downloadReportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <span>JSON</span>
          </button>
          <button
            onClick={onNewAnalysis}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span>New Match</span>
          </button>
        </div>
      </div>

      {/* Mandatory Objective Disclaimer Notice */}
      <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Understanding Your Similarity Score: </span>
          The similarity score measures <span className="font-semibold underline">textual relevance and vocabulary overlap</span>, not the probability of getting hired. It demonstrates how closely your resume aligns with automated applicant tracking systems (ATS) keyword queries.
        </div>
      </div>

      {/* Primary KPI Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Composite Match
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getScoreBadgeBg(analysis.overallScore)}`}>
                {analysis.overallScore >= 75 ? 'ATS Strong' : analysis.overallScore >= 55 ? 'Moderate' : 'Needs Optimization'}
              </span>
            </div>
            <div className={`text-4xl font-extrabold font-mono tabular-nums ${getScoreColor(analysis.overallScore)} mb-1`}>
              {analysis.overallScore}%
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Composite score combining cosine angle, skill coverage, keyword density, and ATS readability.
            </p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${analysis.overallScore}%` }} 
            />
          </div>
        </div>

        {/* Cosine Similarity */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cosine Similarity
              </span>
              <button 
                onClick={() => setShowFormulaModal(!showFormulaModal)}
                className="text-[11px] font-mono text-indigo-600 hover:underline flex items-center gap-0.5"
              >
                <span>cos(θ)</span>
                <HelpCircle className="w-3 h-3" />
              </button>
            </div>
            <div className="text-4xl font-extrabold font-mono tabular-nums text-slate-900 mb-1">
              {analysis.cosineSimilarity}%
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              scikit-learn vector dot product between normalized TF-IDF term frequencies.
            </p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${analysis.cosineSimilarity}%` }} 
            />
          </div>
        </div>

        {/* Skill Overlap Rate */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Skill Match Rate
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {analysis.matchedSkills.length}/{analysis.matchedSkills.length + analysis.missingSkills.length}
              </span>
            </div>
            <div className="text-4xl font-extrabold font-mono tabular-nums text-indigo-600 mb-1">
              {analysis.skillMatchScore}%
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Identified {analysis.matchedSkills.length} required competencies; {analysis.missingSkills.length} skills absent.
            </p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${analysis.skillMatchScore}%` }} 
            />
          </div>
        </div>

        {/* ATS Compatibility */}
        <div 
          onClick={() => onTabChange('ats-checker')}
          className="p-6 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-xs flex flex-col justify-between cursor-pointer transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-indigo-600 transition-colors">
                ATS Compatibility
              </span>
              <span className="text-[11px] font-mono text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
                <span>Audit</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-4xl font-extrabold font-mono tabular-nums text-slate-900 mb-1">
              {analysis.atsReadabilityScore}%
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Contact discoverability, student section hierarchy, and formatting risk audit.
            </p>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${analysis.atsReadabilityScore}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Formula Explanation Accordion */}
      {showFormulaModal && (
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Mathematical Score Calculation Explanation</span>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>1. Sublinear TF-IDF:</strong> Each token in document d has term frequency weighted by tf(t, d) = 1 + ln(frequency) to avoid giving disproportionate weight to repeated words.
            </p>
            <p>
              <strong>2. Inverse Document Frequency:</strong> Rare, discriminative keywords have higher IDF weights: idf(t) = ln((1 + N)/(1 + df)) + 1.
            </p>
            <p>
              <strong>3. Cosine Similarity:</strong> cos(θ) = (u · v) / (||u||₂ × ||v||₂). When term vectors point in the identical semantic direction in hyperspace, the score is 100%.
            </p>
            <p>
              <strong>4. Composite Metric:</strong> <code>Score = (Cosine × 0.40) + (Skills × 0.35) + (Keywords × 0.15) + (ATS × 0.10)</code>.
            </p>
          </div>
        </div>
      )}

      {/* Category Breakdown Progress Bars */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Category-Level Skill Breakdown</h2>
            <p className="text-xs text-slate-500">Performance across all requested domains in the job requisition.</p>
          </div>
          <button
            onClick={() => onTabChange('skills')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            <span>Detailed Gap Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.categoryGaps.map((cat) => (
            <div key={cat.category} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">{cat.category}</span>
                <span className="text-xs font-mono font-bold text-slate-700">{cat.matchPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${
                    cat.matchPercentage >= 75 ? 'bg-emerald-500' : cat.matchPercentage >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.matchPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Matched: {cat.matchedSkills.join(', ') || 'None'}</span>
                {cat.missingSkills.length > 0 && (
                  <span className="text-rose-600 font-medium">Missing: {cat.missingSkills.slice(0, 2).join(', ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TF-IDF Top Term Weights Comparison Chart */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              TF-IDF Term Weight Distribution (Resume vs Job Description)
            </h2>
            <p className="text-xs text-slate-500">
              Visualizes normalized L2 term frequencies for the highest-weighted keywords in both documents.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedTermFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${selectedTermFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              All Terms
            </button>
            <button
              onClick={() => setSelectedTermFilter('skills')}
              className={`px-3 py-1 rounded-md transition-colors ${selectedTermFilter === 'skills' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Skills
            </button>
            <button
              onClick={() => setSelectedTermFilter('keywords')}
              className={`px-3 py-1 rounded-md transition-colors ${selectedTermFilter === 'keywords' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Keywords
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredTermWeights.slice(0, 10)}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <XAxis 
                dataKey="term" 
                tick={{ fontSize: 11, fill: '#64748B' }} 
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0B132B', 
                  borderColor: '#1C2541', 
                  borderRadius: '8px', 
                  color: '#FFFFFF',
                  fontSize: '12px' 
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="resumeWeight" name="Resume TF-IDF Weight" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="jobWeight" name="Job Requisition Weight" fill="#9333EA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actionable Recommendations Section */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Explainable Resume Optimization Suggestions
            </h2>
            <p className="text-xs text-slate-500">
              Practical, deterministic improvements based on the actual resume analysis (no invented experience).
            </p>
          </div>
          <button
            onClick={() => onTabChange('skills')}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View Full Skill Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {analysis.recommendations.map((rec) => {
            const isCritical = rec.type === 'critical';
            const isStrength = rec.type === 'strength';

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical 
                    ? 'bg-rose-50/40 border-rose-200' 
                    : isStrength 
                    ? 'bg-emerald-50/40 border-emerald-200' 
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : isStrength ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                    <h3 className="text-xs font-bold text-slate-900">{rec.title}</h3>
                  </div>

                  <span className="text-[10px] font-mono font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    Target: {rec.targetSection}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  {rec.description}
                </p>

                <div className="text-xs font-medium text-slate-800 bg-white/80 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">Action:</span>
                  <span>{rec.suggestedAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matched vs Missing Skills Quick Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Matched Skills ({analysis.matchedSkills.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Found in resume</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {analysis.matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded px-2.5 py-1"
              >
                {skill.name}
              </span>
            ))}
            {analysis.matchedSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic">No skills matched directly.</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Missing Skills ({analysis.missingSkills.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Required by job</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {analysis.missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200/60 rounded px-2.5 py-1"
              >
                {skill.name}
              </span>
            ))}
            {analysis.missingSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic">All requested skills are present!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
