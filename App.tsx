import React, { useState, useEffect, useCallback } from 'react';
import { ArtifactType, AnalysisResult } from './types';
import { sanitizeArtifact, detectArtifactType, getArtifactLabel } from './utils/artifactUtils';
import { analyzeArtifactWithGemini } from './services/geminiService';
import ServiceGrid from './components/ServiceGrid';
import AnalysisPanel from './components/AnalysisPanel';

function App() {
  const [input, setInput] = useState('');
  const [artifact, setArtifact] = useState('');
  const [type, setType] = useState<ArtifactType>(ArtifactType.UNKNOWN);
  const [analysis, setAnalysis] = useState<AnalysisResult>({ markdown: '', loading: false });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setInput(rawVal);
    
    const cleanVal = sanitizeArtifact(rawVal);
    const detectedType = detectArtifactType(cleanVal);
    
    setArtifact(cleanVal);
    setType(detectedType);
    
    // Clear analysis when artifact changes significantly
    if (cleanVal !== artifact) {
        setAnalysis({ markdown: '', loading: false });
    }
  };

  const handleRunAnalysis = useCallback(async () => {
    if (!artifact) return;

    setAnalysis(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      const result = await analyzeArtifactWithGemini(artifact, type);
      setAnalysis({ markdown: result, loading: false });
    } catch (err) {
      setAnalysis({ 
        markdown: '', 
        loading: false, 
        error: 'Analysis failed.' 
      });
    }
  }, [artifact, type]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">Sputnik <span className="text-cyan-500 font-light">Web</span></h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            OSINT DASHBOARD v1.24
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input and Services */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Input Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl shadow-black/50">
              <label htmlFor="artifact-input" className="block text-sm font-medium text-slate-400 mb-2">
                Target Artifact
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="artifact-input"
                  className="block w-full rounded-lg border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:ring-cyan-500 sm:text-lg p-4 font-mono shadow-inner"
                  placeholder="IP, Domain, Hash (MD5/SHA), or URL..."
                  value={input}
                  onChange={handleInputChange}
                  autoComplete="off"
                  autoFocus
                />
                {type !== ArtifactType.UNKNOWN && (
                  <div className="absolute right-3 top-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      type === ArtifactType.UNKNOWN 
                        ? 'bg-slate-800 text-slate-400 border-slate-700' 
                        : 'bg-cyan-900/30 text-cyan-400 border-cyan-800/50'
                    }`}>
                      {getArtifactLabel(type)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span>Auto-sanitization active (defanged URLs supported)</span>
                {artifact && <span className="font-mono text-cyan-600/70">{artifact}</span>}
              </div>
            </div>

            {/* Services Grid */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
              <ServiceGrid artifact={artifact} type={type} />
            </div>

          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:col-span-5 h-full min-h-[500px]">
            <AnalysisPanel 
              result={analysis} 
              onAnalyze={handleRunAnalysis} 
              hasArtifact={!!artifact} 
            />
          </div>
        </div>
      </main>

       {/* Footer */}
       <footer className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Sputnik Web. Use responsibly for authorized security research only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;