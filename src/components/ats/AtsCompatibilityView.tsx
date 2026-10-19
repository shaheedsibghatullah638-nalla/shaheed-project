import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle, 
  Info, 
  FileText, 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Layers, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Check,
  XCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { AnalysisResult, ActiveTab } from '../../types';

interface AtsCompatibilityViewProps {
  analysis: AnalysisResult | null;
  onGoToAnalyze: () => void;
  onTabChange: (tab: ActiveTab) => void;
}

export const AtsCompatibilityView: React.FC<AtsCompatibilityViewProps> = ({
  analysis,
  onGoToAnalyze,
  onTabChange,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showScoringDetails, setShowScoringDetails] = useState(false);

  if (!analysis) {
    return (
      <div className="p-12 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
        <ShieldCheck className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 mb-1">No Active ATS Audit Report</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Upload or paste your resume in the Match Studio to generate an ATS compatibility diagnostic audit.
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

  const report = analysis.atsCompatibilityReport;

  // Fallback if report hasn't been generated
  if (!report) {
    return (
      <div className="p-12 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
        <ShieldCheck className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 mb-1">Generating ATS Compatibility Diagnostics...</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Please run a fresh analysis in Match Studio to populate the complete ATS audit.
        </p>
        <button
          onClick={onGoToAnalyze}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
        >
          Run Analysis
        </button>
      </div>
    );
  }

  const filteredChecks = report.checks.filter((c) => {
    if (activeCategoryFilter === 'all') return true;
    return c.category === activeCategoryFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-indigo-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'High ATS Compatibility', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 70) return { label: 'Good Parsability', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (score >= 50) return { label: 'Moderate Formatting Risks', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'High Parsing Risk', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const scoreBadge = getScoreBadge(report.atsScore);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Applicant Tracking System (ATS) Diagnostic</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            ATS Compatibility Checker & Parsability Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluates document extractability, contact discoverability, section standard headers, and layout risks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('results')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Similarity Results</span>
          </button>
        </div>
      </div>

      {/* Official Disclaimer Banner */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">ATS Vendor Notice: </span>
          {report.disclaimer} This metric is calculated entirely locally and is maintained separately from your job similarity match score.
        </div>
      </div>

      {/* Hero Scorecard & Scoring Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main ATS Compatibility Scorecard */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ATS Compatibility Score
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${scoreBadge.bg}`}>
                {scoreBadge.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-5xl font-extrabold font-mono tabular-nums ${getScoreColor(report.atsScore)}`}>
                {report.atsScore}
              </span>
              <span className="text-slate-400 text-sm font-semibold">/ 100</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Measures text extraction cleanliness, contact detection, recognized section hierarchy, and formatting simplicity.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>Audit Summary:</span>
              <span className="font-mono text-[11px]">
                <strong className="text-emerald-600">{report.passedChecks} passed</strong> ·{' '}
                <strong className="text-amber-600">{report.warningChecks} warnings</strong> ·{' '}
                <strong className="text-slate-500">{report.unverifiedChecks} unverified</strong>
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${(report.passedChecks / report.totalChecks) * 100}%` }} 
              />
              <div 
                className="bg-amber-400 h-full transition-all duration-500" 
                style={{ width: `${(report.warningChecks / report.totalChecks) * 100}%` }} 
              />
              <div 
                className="bg-rose-500 h-full transition-all duration-500" 
                style={{ width: `${(report.failedChecks / report.totalChecks) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Scoring Breakdown Criteria */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Scoring Methodology & Point Allocation
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">100-Point Algorithmic Rubric</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">1. Contact Information</span>
                  <span className="font-mono font-bold text-indigo-600">{report.scoringBreakdown.contactScore} / 20 pts</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Email (10 pts), Phone number (7 pts), LinkedIn / portfolio URL (3 pts).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">2. Section Hierarchy</span>
                  <span className="font-mono font-bold text-indigo-600">{report.scoringBreakdown.sectionsScore} / 30 pts</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard headings: Skills, Experience, Education, Projects. Protected for students.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">3. Text & Layout Risk</span>
                  <span className="font-mono font-bold text-indigo-600">{report.scoringBreakdown.formattingScore} / 25 pts</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Deducts for short unreadable text, broken line ordering, and non-standard symbols.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">4. Requisition Keyword Density</span>
                  <span className="font-mono font-bold text-indigo-600">{report.scoringBreakdown.keywordScore} / 25 pts</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Measures presence of required technical and domain competencies from job description.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Score is isolated from job description text similarity score ({analysis.cosineSimilarity}% Cosine).</span>
            <button
              onClick={() => onTabChange('results')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Compare with Cosine Match
            </button>
          </div>
        </div>
      </div>

      {/* Verification Level Legend Banner (Critical per instructions) */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-900">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Verification Level Transparency</span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          To maintain honesty and technical rigor, each ATS check explicitly displays its verification capability:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
            <span className="font-bold text-emerald-800 block mb-0.5">● Verified Automatically</span>
            <p className="text-[11px] text-emerald-700">
              Deterministic regex and token validation (e.g. email, phone, word count, character encodings).
            </p>
          </div>
          <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50">
            <span className="font-bold text-amber-800 block mb-0.5">▲ Approximate Heuristic</span>
            <p className="text-[11px] text-amber-700">
              Statistical inference (e.g. line fragmentation, alternative student headings, heading aliases).
            </p>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-100/70">
            <span className="font-bold text-slate-800 block mb-0.5">■ Unverified / Limitation</span>
            <p className="text-[11px] text-slate-600">
              Visual styling, multi-column bounding boxes, and images containing text cannot be verified without 2D rendering OCR.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Details & Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Audit Card */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Contact Discoverability Audit</span>
            </h2>
            <span className="text-[11px] text-slate-400">Verified Regex</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Email */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 block">Email Address</span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {report.contactDetails.emailFound ? report.contactDetails.emailAddress : 'No email detected'}
                  </span>
                </div>
              </div>
              {report.contactDetails.emailFound ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                  Detected
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-200">
                  Missing
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 block">Phone Number</span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {report.contactDetails.phoneFound ? report.contactDetails.phoneNumber : 'No phone number detected'}
                  </span>
                </div>
              </div>
              {report.contactDetails.phoneFound ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                  Detected
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-200">
                  Missing
                </span>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <Linkedin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 block">LinkedIn Profile</span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {report.contactDetails.linkedinFound ? (report.contactDetails.linkedinUrl || 'LinkedIn Link Found') : 'No profile link identified'}
                  </span>
                </div>
              </div>
              {report.contactDetails.linkedinFound ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                  Detected
                </span>
              ) : (
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                  Optional
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Standard Sections Audit Card (With Student Protection) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Standard Section Headings</span>
            </h2>
            <span className="text-[11px] text-slate-400">Student Protected</span>
          </div>

          <div className="space-y-2 text-xs">
            {report.sectionsDetected.map((sec, idx) => {
              const isPresent = sec.status === 'present';
              const isAlternative = sec.status === 'alternative_present';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{sec.sectionName}</span>
                    {isAlternative && (
                      <span className="text-[10px] text-indigo-600 block">
                        Student-friendly: Covered via Projects & Education
                      </span>
                    )}
                  </div>

                  {isPresent ? (
                    <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Detected</span>
                    </span>
                  ) : isAlternative ? (
                    <span className="flex items-center gap-1 text-indigo-700 text-[11px] font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Covered (Projects)</span>
                    </span>
                  ) : sec.isOptionalForStudents ? (
                    <span className="text-slate-400 text-[11px]">Optional</span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-700 text-[11px] font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Not Found</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comprehensive Checklist Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Detailed Diagnostic Verification Log
            </h2>
            <p className="text-xs text-slate-500">
              Complete results across all automated parsability and layout risk tests.
            </p>
          </div>

          {/* Filter categories */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${activeCategoryFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategoryFilter('text_extraction')}
              className={`px-2.5 py-1 rounded transition-colors ${activeCategoryFilter === 'text_extraction' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Extraction
            </button>
            <button
              onClick={() => setActiveCategoryFilter('contact_info')}
              className={`px-2.5 py-1 rounded transition-colors ${activeCategoryFilter === 'contact_info' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveCategoryFilter('sections')}
              className={`px-2.5 py-1 rounded transition-colors ${activeCategoryFilter === 'sections' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveCategoryFilter('formatting_risk')}
              className={`px-2.5 py-1 rounded transition-colors ${activeCategoryFilter === 'formatting_risk' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Formatting
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredChecks.map((chk) => {
            const isPass = chk.status === 'pass';
            const isWarning = chk.status === 'warning';
            const isFail = chk.status === 'fail';
            const isUnverified = chk.status === 'unverified';

            return (
              <div key={chk.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {isFail && <XCircle className="w-4 h-4 text-rose-600" />}
                    {isUnverified && <QuestionIcon className="w-4 h-4 text-slate-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900">{chk.title}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        chk.verificationLevel === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : chk.verificationLevel === 'approximate'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {chk.verificationLevel.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-1">
                      {chk.message}
                    </p>

                    {chk.details && (
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {chk.details}
                      </span>
                    )}

                    {chk.recommendation && (
                      <div className="mt-1.5 text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-md border border-indigo-100">
                        <span className="font-semibold">Recommended Fix: </span>
                        {chk.recommendation}
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded self-start shrink-0 ${
                  isPass ? 'bg-emerald-50 text-emerald-700' :
                  isWarning ? 'bg-amber-50 text-amber-700' :
                  isFail ? 'bg-rose-50 text-rose-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {chk.status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prioritized Actionable Recommendations */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-2">
          Prioritized ATS Optimization Actions
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Concrete steps to maximize machine parsability without stuffing keywords or fabricating credentials.
        </p>

        <div className="space-y-3">
          {report.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs ${
                rec.priority === 'high' 
                  ? 'bg-rose-50/40 border-rose-200' 
                  : rec.priority === 'medium'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900">{rec.issue}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  rec.priority === 'high' ? 'bg-rose-600 text-white' :
                  rec.priority === 'medium' ? 'bg-amber-500 text-white' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>
              <p className="text-slate-700 font-medium mb-1">
                <span className="text-indigo-600 font-bold">Action: </span>
                {rec.fix}
              </p>
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold">Reason: </span>
                {rec.reason}
              </p>
            </div>
          ))}

          {report.recommendations.length === 0 && (
            <div className="p-6 text-center text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
              <span>Great job! No critical ATS parsability issues were detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
