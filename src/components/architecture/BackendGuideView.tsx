import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Server, 
  Layers, 
  Code2, 
  RefreshCw,
  FolderTree
} from 'lucide-react';
import { checkFlaskHealth, getFlaskUrl, setFlaskUrl, getEngineMode, setEngineMode } from '../../services/api';

export const BackendGuideView: React.FC = () => {
  const [flaskUrl, setFlaskUrlState] = useState(getFlaskUrl());
  const [engineMode, setEngineModeState] = useState<'browser' | 'flask'>(getEngineMode());
  const [healthStatus, setHealthStatus] = useState<{
    checking: boolean;
    connected: boolean;
    version?: string;
    error?: string;
  }>({
    checking: false,
    connected: false
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const checkConnection = async () => {
    setHealthStatus(prev => ({ ...prev, checking: true }));
    const result = await checkFlaskHealth();
    setHealthStatus({
      checking: false,
      connected: result.connected,
      version: result.version,
      error: result.error
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFlaskUrlState(val);
    setFlaskUrl(val);
  };

  const handleToggleMode = (mode: 'browser' | 'flask') => {
    setEngineModeState(mode);
    setEngineMode(mode);
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const setupCommands = [
    { title: '1. Create Python Virtual Environment', code: 'cd backend\npython3 -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate' },
    { title: '2. Install Required NLP & Parsing Packages', code: 'pip install -r requirements.txt' },
    { title: '3. Initialize & Seed SQLite Database', code: 'python seed_data.py' },
    { title: '4. Start Python Flask API Server', code: 'python app.py' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
              <Terminal className="w-4 h-4" />
              <span>Full-Stack Architecture</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Python Flask, scikit-learn & SQLite System Architecture
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete dual-engine implementation: run the explainable NLP engine directly in the browser or connect to the local Python Flask service.
            </p>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs shrink-0">
            <button
              onClick={() => handleToggleMode('browser')}
              className={`px-3 py-1.5 rounded-md transition-colors ${engineMode === 'browser' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Browser NLP
            </button>
            <button
              onClick={() => handleToggleMode('flask')}
              className={`px-3 py-1.5 rounded-md transition-colors ${engineMode === 'flask' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Flask API
            </button>
          </div>
        </div>
      </div>

      {/* Live Server Connection Card */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Flask API Server Connection
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {healthStatus.checking ? (
              <span className="text-xs text-slate-400">Testing connection...</span>
            ) : healthStatus.connected ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected (v{healthStatus.version})</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Local Flask Server Offline</span>
              </span>
            )}
            <button
              onClick={checkConnection}
              disabled={healthStatus.checking}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
              title="Ping server"
            >
              <RefreshCw className={`w-4 h-4 ${healthStatus.checking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Flask Backend Endpoint URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={flaskUrl}
                onChange={handleUrlChange}
                placeholder="http://localhost:5000"
                className="w-full px-3 py-2 font-mono text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
              <button
                onClick={checkConnection}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Test Endpoint
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="font-semibold text-slate-800 mb-1">Zero-Disruption Fallback</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When Flask is offline, AI ResumeMatch seamlessly switches to our in-browser mathematical TF-IDF & Cosine Similarity engine so all features work immediately!
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4">
          End-to-End System Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 font-bold text-indigo-700">
              <Code2 className="w-4 h-4" />
              <span>1. Client / React</span>
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>• React 19 + Tailwind CSS</li>
              <li>• Multi-format document upload</li>
              <li>• Recharts TF-IDF visualization</li>
              <li>• Instant state transitions</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 font-bold text-purple-700">
              <Server className="w-4 h-4" />
              <span>2. Flask REST API</span>
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>• Python 3.10 + Flask 3.0</li>
              <li>• CORS enabled for port 3000</li>
              <li>• PyMuPDF (PDF) & python-docx</li>
              <li>• JSON payload sanitization</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 font-bold text-blue-700">
              <Cpu className="w-4 h-4" />
              <span>3. scikit-learn NLP</span>
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>• TfidfVectorizer (sublinear_tf)</li>
              <li>• (1, 2) n-gram tokenization</li>
              <li>• Cosine Similarity calculation</li>
              <li>• 6-domain skill categorization</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 font-bold text-emerald-700">
              <Database className="w-4 h-4" />
              <span>4. SQLite Database</span>
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>• `resumematch.db` local file</li>
              <li>• `analyses` primary table</li>
              <li>• `skills_cache` indexed store</li>
              <li>• Full ACID persistence</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step-by-Step Local Setup Guide */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-2">
          How to Run the Python Flask Backend Locally
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          All Python files have been generated inside the <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">backend/</code> directory. Follow these steps in your local terminal:
        </p>

        <div className="space-y-4">
          {setupCommands.map((cmd, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-800">
                <span>{cmd.title}</span>
                <button
                  onClick={() => copyCode(cmd.code, idx)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0B132B] text-slate-200 font-mono text-xs overflow-x-auto">
                <code>{cmd.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Structure & File Inventory */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <FolderTree className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Backend File Inventory
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-indigo-600 block mb-0.5">backend/app.py</span>
            <span className="text-slate-500 text-[11px]">Flask web application, route handlers, CORS, REST endpoints.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-indigo-600 block mb-0.5">backend/nlp_engine.py</span>
            <span className="text-slate-500 text-[11px]">scikit-learn TfidfVectorizer, cosine_similarity, skill gap matrix.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-indigo-600 block mb-0.5">backend/parser.py</span>
            <span className="text-slate-500 text-[11px]">PyMuPDF (fitz) PDF parser and python-docx document extractor.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-indigo-600 block mb-0.5">backend/database.py</span>
            <span className="text-slate-500 text-[11px]">SQLite database connection, schema migration, and CRUD functions.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-indigo-600 block mb-0.5">backend/schema.sql</span>
            <span className="text-slate-500 text-[11px]">Database schema for analyses, skills cache, and indexes.</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-mono font-bold text-indigo-600 block mb-0.5">backend/requirements.txt</span>
            <span className="text-slate-500 text-[11px]">Flask, flask-cors, scikit-learn, numpy, PyMuPDF, python-docx.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
