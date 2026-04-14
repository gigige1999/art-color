
import React from 'react';
import { ColorInfo } from '../types';

interface PaletteDisplayProps {
  image: string;
  moodTitle: string;
  colors: ColorInfo[];
  onReset: () => void;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ image, moodTitle, colors, onReset }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
        
        {/* Left: The Visual Frame - Smaller and more focused */}
        <div className="w-full md:w-5/12 sticky top-28">
          <div className="relative group bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <img 
                src={image} 
                alt="Reference" 
                className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="mt-6 px-3 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif italic text-gray-900 tracking-tight leading-none">
                    {moodTitle}
                  </h2>
                  <p className="text-[9px] tracking-[0.3em] uppercase font-black text-gray-300">Chromatic Specimen No. 882</p>
                </div>
                <div className="text-[8px] font-mono text-gray-400 border border-gray-100 px-2 py-1 rounded">
                  ISO: 100/A
                </div>
              </div>
              <div className="flex gap-1.5 opacity-60">
                {colors.map((c, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center md:justify-start">
             <button
              onClick={onReset}
              className="group flex items-center gap-3 px-6 py-2 border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              New Analysis
            </button>
          </div>
        </div>

        {/* Right: The Designer Color Deck - More creative cards */}
        <div className="w-full md:w-7/12 space-y-4">
          <header className="mb-8 border-l-2 border-black pl-4">
             <span className="text-[10px] tracking-[0.5em] uppercase font-black text-gray-300 block">Deconstructed</span>
             <h3 className="text-xl font-serif italic text-gray-800">Spectral Components</h3>
          </header>

          <div className="grid grid-cols-1 gap-3">
            {colors.map((color, index) => (
              <div 
                key={index} 
                className="group flex bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-black/10 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Large Color Anchor */}
                <div 
                  className="w-24 md:w-32 h-24 transition-all duration-500 group-hover:w-36 flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-2 left-3 text-[9px] font-mono text-white mix-blend-difference opacity-50">
                    {index + 1}
                  </span>
                </div>

                {/* Data Panel */}
                <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-serif font-semibold text-gray-900 truncate pr-4">
                      {color.name}
                    </h4>
                    <button 
                      onClick={() => copyToClipboard(color.hex)}
                      className="text-[10px] font-mono text-gray-300 hover:text-black transition-colors"
                    >
                      {color.hex.toUpperCase()}
                    </button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      <div>
                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-300">RGB System</p>
                        <p className="text-[10px] font-mono text-gray-500">{color.rgb}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-300">Press CMYK</p>
                        <p className="text-[10px] font-mono text-gray-500">{color.cmyk}</p>
                      </div>
                    </div>
                    
                    {/* Visual bar */}
                    <div className="h-6 w-[2px] bg-black/10 hidden sm:block"></div>
                    
                    <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Validated</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-between opacity-30 px-2">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-black"></div>
              <p className="text-[8px] tracking-[0.3em] font-bold uppercase">Archive Ref 2025-CHROMA</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="text-[9px] font-black uppercase tracking-widest hover:opacity-100 border-b border-black/20"
            >
              Master PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaletteDisplay;
