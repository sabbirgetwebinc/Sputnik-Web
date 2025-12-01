import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';

interface AnalysisPanelProps {
  result: AnalysisResult;
  onAnalyze: () => void;
  hasArtifact: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ result, onAnalyze, hasArtifact }) => {
  if (!hasArtifact) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 p-8 border border-slate-800 rounded-xl bg-slate-900/50">
        <p>Enter an artifact to enable AI analysis.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
        <h2 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Gemini Analyst
        </h2>
        <button
          onClick={onAnalyze}
          disabled={result.loading}
          className="px-3 py-1 text-sm bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 border border-cyan-800/50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {result.loading ? 'Analyzing...' : result.markdown ? 'Re-Analyze' : 'Run Analysis'}
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto flex-grow prose prose-invert prose-sm max-w-none scroll-smooth">
        {result.loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            <div className="h-32 bg-slate-800 rounded w-full mt-4"></div>
          </div>
        ) : result.markdown ? (
          <ReactMarkdown>{result.markdown}</ReactMarkdown>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400 mb-4">
              Get an AI-powered assessment of this artifact's structure and investigation strategy.
            </p>
            <button
              onClick={onAnalyze}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-900/20"
            >
              Start Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;