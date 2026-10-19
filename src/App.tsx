import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/dashboard/OverviewView';
import { AnalyzeView } from './components/analyze/AnalyzeView';
import { ResultsView } from './components/results/ResultsView';
import { SkillGapView } from './components/skills/SkillGapView';
import { AtsCompatibilityView } from './components/ats/AtsCompatibilityView';
import { DictionaryView } from './components/dictionary/DictionaryView';
import { HistoryView } from './components/history/HistoryView';
import { BackendGuideView } from './components/architecture/BackendGuideView';
import { AboutView } from './components/about/AboutView';
import { LoadingSpinner } from './components/common/LoadingSpinner';

import { ActiveTab, AnalysisResult, HistoryItem } from './types';
import { 
  getStoredHistory, 
  saveAnalysisToHistory, 
  deleteHistoryItem, 
  getActiveAnalysis, 
  getAnalysisById 
} from './services/storage';
import { runAnalysis, getEngineMode, setEngineMode } from './services/api';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from './data/sampleData';
import { analyzeResumeAndJob } from './services/nlpEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [engineMode, setEngineModeState] = useState<'browser' | 'flask'>('browser');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Initial load
  useEffect(() => {
    const storedHistory = getStoredHistory();
    setHistory(storedHistory);

    const mode = getEngineMode();
    setEngineModeState(mode);

    const existing = getActiveAnalysis();
    if (existing) {
      setActiveAnalysis(existing);
    } else {
      // Pre-seed an initial benchmark analysis so all views are populated immediately
      const initial = analyzeResumeAndJob(
        SAMPLE_RESUMES[0].text,
        SAMPLE_JOB_DESCRIPTIONS[0].text,
        SAMPLE_RESUMES[0].title,
        SAMPLE_JOB_DESCRIPTIONS[0].title
      );
      initial.id = 'hist-1';
      initial.timestamp = '2026-10-18 14:32';
      setActiveAnalysis(initial);
    }
  }, []);

  const handleToggleEngineMode = (mode: 'browser' | 'flask') => {
    setEngineModeState(mode);
    setEngineMode(mode);
  };

  const handleRunAnalysis = async (
    resumeText: string,
    jdText: string,
    resumeTitle: string,
    jobTitle: string
  ) => {
    setIsLoading(true);

    try {
      // Step-by-step loading experience
      await new Promise(resolve => setTimeout(resolve, 1400));
      const { result } = await runAnalysis(resumeText, jdText, resumeTitle, jobTitle);

      const savedItem = saveAnalysisToHistory(result);
      setHistory(prev => [savedItem, ...prev.filter(h => h.id !== savedItem.id)]);
      setActiveAnalysis(result);
      setIsLoading(false);
      setActiveTab('results');

      // Trigger celebratory confetti for strong matches
      if (result.overallScore >= 75) {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error('Analysis failed', err);
      setIsLoading(false);
    }
  };

  const handleSelectSampleAndAnalyze = (resumeId: string, jdId: string) => {
    const resume = SAMPLE_RESUMES.find(r => r.id === resumeId);
    const jd = SAMPLE_JOB_DESCRIPTIONS.find(j => j.id === jdId);

    if (resume && jd) {
      handleRunAnalysis(resume.text, jd.text, resume.title, jd.title);
    }
  };

  const handleViewAnalysis = (id: string) => {
    const record = getAnalysisById(id);
    if (record) {
      setActiveAnalysis(record);
      setActiveTab('results');
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    if (activeAnalysis && activeAnalysis.id === id) {
      if (updated.length > 0) {
        const next = getAnalysisById(updated[0].id);
        setActiveAnalysis(next);
      } else {
        setActiveAnalysis(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row antialiased font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={history.length}
        isOpenMobile={isMobileNavOpen}
        onToggleMobile={() => setIsMobileNavOpen(!isMobileNavOpen)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          engineMode={engineMode}
          onToggleEngineMode={handleToggleEngineMode}
          hasActiveAnalysis={!!activeAnalysis}
          onNewAnalysis={() => setActiveTab('analyze')}
        />

        {/* Dynamic Main Workspace Canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <LoadingSpinner message="Calculating Sublinear TF-IDF & Cosine Similarity..." />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <OverviewView
                  onTabChange={setActiveTab}
                  onSelectSampleAndAnalyze={handleSelectSampleAndAnalyze}
                  history={history}
                  activeAnalysis={activeAnalysis}
                  onViewAnalysis={handleViewAnalysis}
                />
              )}

              {activeTab === 'analyze' && (
                <AnalyzeView
                  onRunAnalysis={handleRunAnalysis}
                  isLoading={isLoading}
                  initialResumeText={activeAnalysis?.resumeText}
                  initialJdText={activeAnalysis?.jobDescriptionText}
                />
              )}

              {activeTab === 'results' && activeAnalysis && (
                <ResultsView
                  analysis={activeAnalysis}
                  onTabChange={setActiveTab}
                  onNewAnalysis={() => setActiveTab('analyze')}
                />
              )}

              {activeTab === 'results' && !activeAnalysis && (
                <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No Analysis Computed Yet</h3>
                  <p className="text-xs text-slate-500 mb-4">Run your first comparison in the Resume Analyzer.</p>
                  <button
                    onClick={() => setActiveTab('analyze')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                  >
                    Go to Match Studio
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <SkillGapView
                  analysis={activeAnalysis}
                  onGoToAnalyze={() => setActiveTab('analyze')}
                />
              )}

              {activeTab === 'ats-checker' && (
                <AtsCompatibilityView
                  analysis={activeAnalysis}
                  onGoToAnalyze={() => setActiveTab('analyze')}
                  onTabChange={setActiveTab}
                />
              )}

              {activeTab === 'dictionary' && (
                <DictionaryView />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  history={history}
                  onViewAnalysis={handleViewAnalysis}
                  onDeleteHistoryItem={handleDeleteHistoryItem}
                  onGoToAnalyze={() => setActiveTab('analyze')}
                />
              )}

              {activeTab === 'backend-guide' && (
                <BackendGuideView />
              )}

              {activeTab === 'about' && (
                <AboutView onTabChange={setActiveTab} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
