import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  Database, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Sparkles,
  ArrowRight,
  Code2,
  FileText
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface AboutViewProps {
  onTabChange: (tab: ActiveTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onTabChange }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why use TF-IDF and Cosine Similarity instead of an LLM or ChatGPT API?',
      a: 'In academic software engineering and enterprise HR compliance, explainability and determinism are paramount. LLMs are non-deterministic, cost money per API token, hallucinate metrics, and violate candidate data privacy by sending private resumes to 3rd-party cloud providers. TF-IDF and Cosine Similarity provide 100% mathematically reproducible, local, explainable results with zero privacy leaks.'
    },
    {
      q: 'How does sublinear term frequency prevent keyword stuffing?',
      a: 'Standard term frequency counts raw word occurrences. A fraudulent candidate could repeat "Python" 100 times in tiny white font to trick an ATS. With sublinear scaling (tf = 1 + ln(count)), additional repetitions produce diminishing returns, preventing keyword manipulation while preserving genuine vocabulary alignment.'
    },
    {
      q: 'Why is the similarity score separate from the ATS compatibility score?',
      a: 'They measure two fundamentally different dimensions. Cosine Similarity measures semantic and vocabulary alignment (content relevance). The ATS score measures document parsability, standard section hierarchy, and contact discoverability (formatting readability). A resume could be 95% relevant but formatted in an unparsable complex table.'
    },
    {
      q: 'How does the system protect students with no formal employment history?',
      a: 'The ATS check has built-in student tolerance logic. If a candidate lacks formal Work Experience but provides robust Projects and Education sections, the system labels it "Alternative Present" and awards full points, recognizing project-based software engineering competence.'
    },
    {
      q: 'What are the technical limitations of plain text stream parsers?',
      a: 'Plain text extractors (such as pdfjs and PyMuPDF stream extractors) discard 2D pixel coordinates. Consequently, visual multi-column layouts, floating graphic text boxes, and images containing text cannot be verified without full optical character recognition (OCR) rendering.'
    }
  ];

  const demoSteps = [
    {
      step: '1. Launch Match Studio',
      action: 'Click "Launch Match Studio" or choose a benchmark preset (e.g. Alex Chen ↔ Acme SaaS Inc.).',
      tip: 'Explain to examiners that presets allow instant testing, but real PDF and DOCX files can also be dropped directly.'
    },
    {
      step: '2. Inspect the Real-Time Parser',
      action: 'Drag and drop a PDF or DOCX file to show live word extraction and instant character validation.',
      tip: 'Highlight that the document is processed 100% locally on the client or via local Python PyMuPDF without sending data to external APIs.'
    },
    {
      step: '3. Run Explainable Match Analysis',
      action: 'Click "Run Explainable Match Analysis" to trigger multi-step tokenization, TF-IDF vectorization, and dot product cosine calculation.',
      tip: 'Point out the animated progress steps explaining each phase of the pipeline.'
    },
    {
      step: '4. Demonstrate the Cosine Similarity & TF-IDF Bar Chart',
      action: 'Navigate to the Match Results tab to review the Recharts bar chart showing candidate vs. requisition term weights.',
      tip: 'Show the mathematical formula cos(θ) = (u · v) / (||u||₂ × ||v||₂) and explain how L2 normalization works.'
    },
    {
      step: '5. Demonstrate the ATS Compatibility Checker',
      action: 'Open the "ATS Compatibility" tab to showcase the 4-pillar rubric, student protection logic, and verification taxonomy.',
      tip: 'Emphasize honesty: explain that the app clearly distinguishes between verified checks and unverified visual layout limitations.'
    },
    {
      step: '6. Showcase the 7-Domain Skills Dictionary',
      action: 'Navigate to the "Skills Dictionary" tab to show that custom skills can be added dynamically and persisted.',
      tip: 'Demonstrate adding a specialized skill (e.g., "Snowflake" or "Solidity") and watching it update the matching taxonomy.'
    },
    {
      step: '7. Download the Formal Analysis Report',
      action: 'Click "Download Report (PDF/HTML)" to show the formal printable evaluation document.',
      tip: 'Examiners appreciate ready-to-print academic deliverables with complete disclaimer banners.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>BS Computer Science Final Year Project (FYP)</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI ResumeMatch — Project Architecture & Viva Defense Guide
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Smart Resume & Job Description Analyzer with Explainable NLP and ATS Compatibility Verification.
            </p>
          </div>

          <button
            onClick={() => onTabChange('analyze')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Match Studio</span>
          </button>
        </div>
      </div>

      {/* Abstract & Academic Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Problem Statement & Abstract</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Over 75% of job applications are filtered out by automated Applicant Tracking Systems (ATS) before human review. Students and entry-level applicants often fail screening due to semantic phrasing gaps, unparsable multi-column formats, or missing keyword nomenclature.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>AI ResumeMatch</strong> solves this by providing a local, explainable NLP analyzer that computes mathematical TF-IDF cosine similarity, conducts 7-domain skill gap analysis, and audits document parsability without black-box generative AI hallucinations or privacy violations.
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Core Project Objectives</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">•</span>
              <span><strong>Explainable Vector Matching:</strong> scikit-learn TF-IDF with sublinear scaling and L2-normalized cosine distance.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">•</span>
              <span><strong>7-Domain Taxonomy:</strong> Automated extraction covering programming, databases, web development, project management, marketing, communication, and cloud.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">•</span>
              <span><strong>Responsible ATS Auditing:</strong> Transparent distinction between verified checks, approximate heuristics, and visual limitations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">•</span>
              <span><strong>Student Protection:</strong> Entry-level tolerance that validates project portfolios in lieu of corporate tenure.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Step-by-Step Viva Presentation Demo Guide */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-600">
          <GraduationCap className="w-4 h-4" />
          <span>Examiner Presentation Script</span>
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-2">
          Step-by-Step Viva Demonstration Checklist
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Follow this structured sequence when presenting your project to your supervisor and external examiners:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoSteps.map((d, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-900 mb-1">{d.step}</div>
              <p className="text-slate-700 font-medium mb-1.5">{d.action}</p>
              <div className="text-[11px] text-indigo-700 bg-white p-2 rounded border border-slate-200">
                <span className="font-bold">Viva Defense Tip: </span>
                {d.tip}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examiner FAQ (Viva Defense Questions) */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Common Examiner & Viva Questions (FAQs)</span>
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Authoritative answers to technical architectural questions during your defense:
        </p>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-xs text-slate-900 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-indigo-600 font-bold ml-2">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="p-4 text-xs text-slate-600 bg-white leading-relaxed border-t border-slate-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
