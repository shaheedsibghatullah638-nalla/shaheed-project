import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle, 
  Trash2, 
  Sliders, 
  Info,
  Layers,
  ArrowRight,
  AlertCircle,
  Loader2,
  FileCheck
} from 'lucide-react';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../../data/sampleData';
import { parseDocumentFile } from '../../services/documentParser';

interface AnalyzeViewProps {
  onRunAnalysis: (
    resumeText: string, 
    jdText: string, 
    resumeTitle: string, 
    jobTitle: string
  ) => void;
  isLoading: boolean;
  initialResumeText?: string;
  initialJdText?: string;
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onRunAnalysis,
  isLoading,
  initialResumeText = '',
  initialJdText = ''
}) => {
  const [resumeText, setResumeText] = useState(initialResumeText || SAMPLE_RESUMES[0].text);
  const [resumeTitle, setResumeTitle] = useState('Alex Chen — Full Stack Software Engineer');
  const [jobDescriptionText, setJobDescriptionText] = useState(initialJdText || SAMPLE_JOB_DESCRIPTIONS[0].text);
  const [jobTitle, setJobTitle] = useState('Senior / Mid-Level Full Stack Engineer');
  const [companyName, setCompanyName] = useState('Acme SaaS Inc.');
  const [isDragOver, setIsDragOver] = useState(false);
  
  // File upload state & feedback
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Advanced Algorithm Tuning Settings
  const [includeBigrams, setIncludeBigrams] = useState(true);
  const [filterStopwords, setFilterStopwords] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumeWordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const jdWordCount = jobDescriptionText.trim().split(/\s+/).filter(Boolean).length;

  const handleSelectSampleResume = (id: string) => {
    const sample = SAMPLE_RESUMES.find(r => r.id === id);
    if (sample) {
      setResumeText(sample.text);
      setResumeTitle(sample.title);
      setUploadFeedback({ message: `Loaded sample: ${sample.title}`, type: 'info' });
      setValidationError(null);
    }
  };

  const handleSelectSampleJd = (id: string) => {
    const sample = SAMPLE_JOB_DESCRIPTIONS.find(j => j.id === id);
    if (sample) {
      setJobDescriptionText(sample.text);
      setJobTitle(sample.title);
      setCompanyName(sample.subtitle.split('—')[0].trim());
      setValidationError(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadFeedback(null);
    setValidationError(null);
    setIsParsingFile(true);

    try {
      const result = await parseDocumentFile(file);

      if (result.error) {
        setUploadFeedback({
          message: result.error,
          type: 'error'
        });
      } else if (result.text) {
        setResumeText(result.text);
        const autoTitle = file.name.replace(/\.[^/.]+$/, '');
        setResumeTitle(autoTitle);
        setUploadFeedback({
          message: `Successfully parsed "${file.name}" (${result.wordCount} words extracted)`,
          type: 'success'
        });
      }
    } catch (err: any) {
      setUploadFeedback({
        message: err.message || 'An error occurred while reading the document.',
        type: 'error'
      });
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    const resWords = resumeText.trim().split(/\s+/).filter(Boolean).length;
    const jdWords = jobDescriptionText.trim().split(/\s+/).filter(Boolean).length;

    if (!resumeText.trim()) {
      setValidationError('Resume text is required. Please upload a PDF/DOCX or paste your resume text.');
      return;
    }
    if (resWords < 15) {
      setValidationError('Resume content is too short. Please provide a full resume with skills and experience sections.');
      return;
    }
    if (!jobDescriptionText.trim()) {
      setValidationError('Job description is required. Please paste the job posting requirements.');
      return;
    }
    if (jdWords < 15) {
      setValidationError('Job description is too short. Please paste the full job posting specifications.');
      return;
    }

    onRunAnalysis(resumeText, jobDescriptionText, resumeTitle, jobTitle);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Resume & Job Requisition Match Studio
          </h1>
          <p className="text-xs text-slate-500">
            Upload PDF/DOCX resumes or paste text manually to compute local scikit-learn TF-IDF similarity and skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showOptions 
                ? 'bg-slate-100 text-slate-900 border-slate-300' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Algorithm Parameters</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">Input Validation Warning</span>
            <span>{validationError}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setValidationError(null)} 
            className="text-rose-900 hover:text-black font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Algorithm Tuning Options Accordion */}
      {showOptions && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>scikit-learn TfidfVectorizer Configuration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeBigrams}
                onChange={(e) => setIncludeBigrams(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Extract Unigrams + Bigrams (`ngram_range=(1, 2)`)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={filterStopwords}
                onChange={(e) => setFilterStopwords(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Filter English Stopwords (`stop_words='english'`)</span>
            </label>
          </div>
        </div>
      )}

      {/* Main Two-Column Input Workspace */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Candidate Resume Column */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Candidate Resume</h2>
                    <span className="text-[11px] text-slate-500">PDF, DOCX, TXT, or Manual Paste</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono tabular-nums text-slate-500">
                  {resumeWordCount} words
                </div>
              </div>

              {/* Title & Preset Bar */}
              <div className="space-y-3 mb-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">
                    Resume Document Label
                  </label>
                  <input
                    type="text"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder="Candidate Name or Resume Title"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  />
                </div>

                {/* Sample Selector */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">Quick Presets:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SAMPLE_RESUMES.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => handleSelectSampleResume(res.id)}
                        className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                      >
                        {res.role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* File Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer mb-3 transition-colors ${
                  isDragOver 
                    ? 'border-indigo-500 bg-indigo-50/50' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  {isParsingFile ? (
                    <>
                      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                      <span>Extracting text from document...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Drop PDF/DOCX (max 10MB) or <span className="font-semibold text-indigo-600">Browse Files</span></span>
                    </>
                  )}
                </div>
              </div>

              {uploadFeedback && (
                <div className={`mb-3 px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                  uploadFeedback.type === 'error' 
                    ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                    : uploadFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {uploadFeedback.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : uploadFeedback.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                    )}
                    <span>{uploadFeedback.message}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setUploadFeedback(null)} 
                    className="font-bold ml-2 text-slate-500 hover:text-black"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Text Area */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Resume Content (Full Text)
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={14}
                  placeholder="Paste complete resume text here (Skills, Experience, Education, Projects)..."
                  className="w-full p-3 font-mono text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 leading-relaxed resize-none"
                  required
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Text is cleaned and tokenized locally</span>
              <button
                type="button"
                onClick={() => setResumeText('')}
                className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Job Description Column */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Job Requisition</h2>
                    <span className="text-[11px] text-slate-500">Posting Specifications & Requirements</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono tabular-nums text-slate-500">
                  {jdWordCount} words
                </div>
              </div>

              {/* Job Title & Preset Bar */}
              <div className="space-y-3 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Job Position Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Full Stack Engineer"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Sample Selector */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">Quick Presets:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SAMPLE_JOB_DESCRIPTIONS.map((jd) => (
                      <button
                        key={jd.id}
                        type="button"
                        onClick={() => handleSelectSampleJd(jd.id)}
                        className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                      >
                        {jd.role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Job Description Content
                </label>
                <textarea
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                  rows={17}
                  placeholder="Paste the job posting here (Role overview, required qualifications, tech stack, responsibilities)..."
                  className="w-full p-3 font-mono text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800 leading-relaxed resize-none"
                  required
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Evaluated against maintainable 7-domain skills taxonomy</span>
              <button
                type="button"
                onClick={() => setJobDescriptionText('')}
                className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Scores measure textual relevance and ATS alignment, not hiring probability.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isLoading || isParsingFile}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{isLoading ? 'Computing TF-IDF & Cosine Similarity...' : 'Run Explainable Match Analysis'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
