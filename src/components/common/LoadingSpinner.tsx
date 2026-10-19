import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, FileText, Cpu, BarChart2 } from 'lucide-react';

interface LoadingSpinnerProps {
  onComplete?: () => void;
  message?: string;
}

const STEPS = [
  { label: 'Normalizing and tokenizing document texts...', icon: FileText },
  { label: 'Extracting technical & domain skills across 6 categories...', icon: Cpu },
  { label: 'Building TF-IDF sublinear vocabulary vectors...', icon: BarChart2 },
  { label: 'Computing dot product Cosine Similarity & ATS metrics...', icon: CheckCircle2 }
];

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl shadow-xs max-w-md mx-auto text-center">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 mb-1">
        {message || 'Analyzing Resume & Job Requisition'}
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Running deterministic NLP matching and TF-IDF vectorization
      </p>

      <div className="w-full space-y-2.5 text-left border-t border-slate-100 pt-4">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const Icon = step.icon;

          return (
            <div 
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                isDone ? 'text-emerald-600 font-medium' : isCurrent ? 'text-indigo-600 font-semibold' : 'text-slate-400'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
                )}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
