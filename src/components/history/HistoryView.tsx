import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  ArrowRight, 
  FileText, 
  Calendar, 
  Sparkles,
  Target,
  ShieldCheck,
  Check
} from 'lucide-react';
import { HistoryItem, ActiveTab } from '../../types';
import { exportHistoryAsJson, getAnalysisById } from '../../services/storage';
import { downloadHtmlReport } from '../../services/reportGenerator';

interface HistoryViewProps {
  history: HistoryItem[];
  onViewAnalysis: (id: string) => void;
  onDeleteHistoryItem: (id: string) => void;
  onGoToAnalyze: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onViewAnalysis,
  onDeleteHistoryItem,
  onGoToAnalyze,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.resumeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.companyName && item.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (scoreFilter === 'high') return item.overallScore >= 75;
    if (scoreFilter === 'medium') return item.overallScore >= 50 && item.overallScore < 75;
    if (scoreFilter === 'low') return item.overallScore < 50;

    return true;
  });

  const handleExportJson = () => {
    const jsonStr = exportHistoryAsJson();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `ai-resumematch-history.json`);
    dlAnchorElem.click();
  };

  const handleDownloadSingleReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const record = getAnalysisById(id);
    if (record) {
      downloadHtmlReport(record);
      setDownloadSuccessId(id);
      setTimeout(() => setDownloadSuccessId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>SQLite & Local Historical Record Store</span>
            <span aria-hidden="true">·</span>
            <span>{history.length} Saved Comparisons</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Analysis History & Past Candidate Comparisons
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Export complete comparison history as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All JSON</span>
            </button>
          )}
          <button
            onClick={onGoToAnalyze}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Match</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resume title, role, company..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs self-start md:self-auto">
          <button
            onClick={() => setScoreFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${scoreFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setScoreFilter('high')}
            className={`px-3 py-1 rounded-md transition-colors ${scoreFilter === 'high' ? 'bg-white font-semibold text-emerald-700 shadow-xs' : 'text-slate-600'}`}
          >
            Strong Match (≥75%)
          </button>
          <button
            onClick={() => setScoreFilter('medium')}
            className={`px-3 py-1 rounded-md transition-colors ${scoreFilter === 'medium' ? 'bg-white font-semibold text-blue-700 shadow-xs' : 'text-slate-600'}`}
          >
            Moderate (50-74%)
          </button>
          <button
            onClick={() => setScoreFilter('low')}
            className={`px-3 py-1 rounded-md transition-colors ${scoreFilter === 'low' ? 'bg-white font-semibold text-rose-700 shadow-xs' : 'text-slate-600'}`}
          >
            Needs Work (&lt;50%)
          </button>
        </div>
      </div>

      {/* History Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Candidate Resume</th>
                <th className="px-5 py-3.5">Target Position</th>
                <th className="px-5 py-3.5 text-right">Cosine Sim</th>
                <th className="px-5 py-3.5 text-right">Overall Match</th>
                <th className="px-5 py-3.5 text-right">ATS Score</th>
                <th className="px-5 py-3.5">Skills Overlap</th>
                <th className="px-5 py-3.5">Top Skill Gap</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHistory.map((item) => {
                const isHigh = item.overallScore >= 75;
                const isMed = item.overallScore >= 50 && item.overallScore < 75;
                const atsScore = item.atsScore || 80;

                return (
                  <tr 
                    key={item.id} 
                    onClick={() => onViewAnalysis(item.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <div className="font-semibold truncate max-w-xs">{item.resumeTitle}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.timestamp}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="truncate max-w-xs text-slate-900">{item.jobTitle}</div>
                      {item.companyName && (
                        <div className="text-[11px] text-slate-500">{item.companyName}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-semibold tabular-nums text-slate-800">
                      {item.cosineSimilarity}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded text-xs ${
                        isHigh ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : isMed ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.overallScore}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-mono font-semibold tabular-nums px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {atsScore}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-emerald-700 font-semibold">{item.matchedSkillCount}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="font-mono text-rose-600 font-semibold">{item.missingSkillCount} missing</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {item.topMissingSkill}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleDownloadSingleReport(item.id, e)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors inline-flex items-center"
                        title="Download Analysis Report (PDF/HTML)"
                      >
                        {downloadSuccessId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onViewAnalysis(item.id)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Full Dashboard Analysis"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete record from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-xs text-slate-400">
                    No matching records found in analysis history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
