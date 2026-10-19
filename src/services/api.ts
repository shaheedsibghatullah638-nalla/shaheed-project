import { AnalysisResult } from '../types';
import { analyzeResumeAndJob } from './nlpEngine';

export interface BackendStatus {
  connected: boolean;
  endpoint: string;
  version?: string;
  mode: 'browser' | 'flask';
}

const FLASK_URL_KEY = 'ai_resumematch_flask_url';
const MODE_KEY = 'ai_resumematch_engine_mode';

export function getEngineMode(): 'browser' | 'flask' {
  return (localStorage.getItem(MODE_KEY) as 'browser' | 'flask') || 'browser';
}

export function setEngineMode(mode: 'browser' | 'flask') {
  localStorage.setItem(MODE_KEY, mode);
}

export function getFlaskUrl(): string {
  return localStorage.getItem(FLASK_URL_KEY) || 'http://localhost:5000';
}

export function setFlaskUrl(url: string) {
  localStorage.setItem(FLASK_URL_KEY, url);
}

export async function checkFlaskHealth(): Promise<{ connected: boolean; version?: string; error?: string }> {
  const url = getFlaskUrl();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${url}/api/health`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      return { connected: true, version: data.version || '1.0.0' };
    }
    return { connected: false, error: `HTTP ${res.status}` };
  } catch (err: any) {
    return { connected: false, error: err.message || 'Cannot reach Flask server' };
  }
}

/**
 * Executes resume analysis, routing to Flask if mode is 'flask' and connected,
 * otherwise executing our local explainable NLP math engine.
 */
export async function runAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  resumeTitle: string = 'Uploaded Resume',
  jobTitle: string = 'Target Position'
): Promise<{ result: AnalysisResult; source: 'flask' | 'browser' }> {
  const mode = getEngineMode();
  const flaskUrl = getFlaskUrl();

  if (mode === 'flask') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${flaskUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescriptionText,
          resume_title: resumeTitle,
          job_title: jobTitle
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        // Convert Flask payload snake_case to AnalysisResult format
        const result: AnalysisResult = {
          id: data.id || `analysis-${Date.now()}`,
          timestamp: data.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 16),
          resumeTitle: data.resume_title || resumeTitle,
          jobTitle: data.job_title || jobTitle,
          cosineSimilarity: data.cosine_similarity,
          skillMatchScore: data.skill_match_score,
          keywordDensityScore: data.keyword_density_score || 80,
          atsReadabilityScore: data.ats_readability_score || 85,
          overallScore: data.overall_score,
          wordCountResume: data.word_count_resume,
          wordCountJD: data.word_count_jd,
          matchedSkills: data.matched_skills || [],
          missingSkills: data.missing_skills || [],
          categoryGaps: data.category_gaps || [],
          topTermWeights: data.top_term_weights || [],
          recommendations: data.recommendations || [],
          atsCompatibilityReport: data.ats_compatibility_report,
          resumeText,
          jobDescriptionText
        };
        return { result, source: 'flask' };
      }
    } catch (err) {
      console.warn('Flask server unavailable or timed out, falling back to local NLP engine', err);
    }
  }

  // Fallback to local explainable NLP Engine
  const result = analyzeResumeAndJob(resumeText, jobDescriptionText, resumeTitle, jobTitle);
  return { result, source: 'browser' };
}
