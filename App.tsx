
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ColorInfo, HistoryItem, PaletteResult } from './types';
import { analyzeImageColors } from './services/geminiService';
import PaletteDisplay from './components/PaletteDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [image, setImage] = useState<string | null>(null);
  const [moodTitle, setMoodTitle] = useState<string>('');
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('chromastack_history_v2');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((newItem: HistoryItem) => {
    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 15);
      localStorage.setItem('chromastack_history_v2', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(AppState.LOADING);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setImage(base64);

      try {
        const result: PaletteResult = await analyzeImageColors(base64);
        setColors(result.colors);
        setMoodTitle(result.moodTitle);
        setStatus(AppState.RESULT);
        
        saveToHistory({
          id: Date.now().toString(),
          image: base64,
          moodTitle: result.moodTitle,
          colors: result.colors,
          timestamp: Date.now()
        });
      } catch (err) {
        console.error(err);
        setError("Our aesthetic engine encountered an issue. Please try another image.");
        setStatus(AppState.ERROR);
      }
    };
    reader.readAsDataURL(file);
  }, [saveToHistory]);

  const handleReset = () => {
    setStatus(AppState.IDLE);
    setImage(null);
    setColors([]);
    setMoodTitle('');
    setError(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setImage(item.image);
    setColors(item.colors);
    setMoodTitle(item.moodTitle);
    setStatus(AppState.RESULT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('chromastack_history_v2');
  };

  return (
    <div className="min-h-screen selection:bg-black selection:text-white bg-[#FDFDFD] text-[#1A1A1A]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-50 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-50 blur-[150px] rounded-full" />
      </div>

      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-white/40 backdrop-blur-2xl border-b border-black/[0.03]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white font-serif italic text-sm transition-transform group-hover:rotate-[15deg]">C</div>
          <div className="text-lg font-serif italic tracking-tighter">ChromaStack</div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[7px] font-black tracking-[0.4em] uppercase opacity-20">Artisan Color Extraction</span>
          </div>
          {history.length > 0 && (
            <button 
              onClick={() => document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-1.5 rounded-full border border-black/10 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
            >
              Archive
            </button>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-20">
        {status === AppState.IDLE && (
          <div className="w-full max-w-4xl mx-auto px-6 mt-12 md:mt-24 text-center space-y-16">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <h1 className="text-7xl md:text-[8rem] font-serif leading-[0.9] tracking-tight">
                Pure <br />
                <span className="italic text-gray-200">Spectral</span> <br />
                Essence
              </h1>
              <p className="text-xs md:text-sm text-gray-400 font-medium tracking-wide max-w-sm mx-auto leading-relaxed italic opacity-80">
                Transforming digital vision into high-fidelity color systems with surgical precision.
              </p>
            </div>

            <div className="relative group max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <label className="block w-full cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <div className="relative overflow-hidden aspect-[2/1] rounded-3xl border border-black/[0.05] bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] transition-all group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-1">
                   <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-105 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-inner border border-black/5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-30 block mb-1">Import Reference</span>
                        <span className="text-[10px] italic text-gray-300">JPG / PNG / WEBP</span>
                      </div>
                   </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {status === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center py-40 space-y-10">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-[0.5px] border-black/10 rounded-full" />
              <div className="absolute inset-0 border-t-2 border-black rounded-full animate-spin" />
              <div className="absolute inset-2 border border-dashed border-gray-100 rounded-full animate-[spin_15s_linear_infinite]" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif italic text-gray-800">Reading Palette...</h2>
              <p className="text-[9px] tracking-[0.4em] uppercase opacity-20 font-black">Spectral deconstruction in progress</p>
            </div>
          </div>
        )}

        {status === AppState.ERROR && (
          <div className="max-w-md mx-auto py-40 text-center space-y-6 animate-in fade-in scale-95">
             <div className="inline-flex p-5 rounded-2xl bg-red-50 text-red-400 border border-red-100/50">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
             <div className="space-y-1">
               <h3 className="text-xl font-serif italic">{error}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">Engine Disruption</p>
             </div>
             <button onClick={handleReset} className="px-10 py-3 bg-black text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
               Retry Sequence
             </button>
          </div>
        )}

        {status === AppState.RESULT && image && (
          <PaletteDisplay image={image} moodTitle={moodTitle} colors={colors} onReset={handleReset} />
        )}

        {/* Gallery Archive */}
        {history.length > 0 && (
          <section id="archive" className="mt-20 max-w-6xl mx-auto px-6 pt-20 border-t border-black/[0.04] animate-in fade-in duration-1000">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-1">
                <p className="text-[8px] tracking-[0.5em] uppercase opacity-30 font-black">History</p>
                <h3 className="text-3xl font-serif italic">Archive Gallery</h3>
              </div>
              <button 
                onClick={clearHistory}
                className="text-[8px] uppercase tracking-[0.2em] font-black opacity-20 hover:opacity-100 transition-opacity border-b border-black/10"
              >
                Clear Data
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="group flex flex-col text-left space-y-4 focus:outline-none"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-white shadow-sm border border-black/[0.02] transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                    <img src={item.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="Archive" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-1 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/40 backdrop-blur-md">
                      {item.colors.slice(0, 5).map((c, i) => (
                        <div key={i} className="h-2 flex-1 rounded-full" style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                  </div>
                  <div className="px-1 space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-black/20">
                      {new Date(item.timestamp).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
                    </p>
                    <p className="text-xs font-serif italic text-gray-700 truncate">{item.moodTitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="p-16 text-center opacity-10 hover:opacity-30 transition-opacity border-t border-black/[0.02] mt-10">
        <p className="text-[8px] tracking-[0.6em] font-black uppercase">Studio Built • ChromaStack Logic</p>
      </footer>
    </div>
  );
};

export default App;
