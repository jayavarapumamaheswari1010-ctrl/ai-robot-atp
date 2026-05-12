import React from 'react';
import { Mic, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ListeningView = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 relative h-full w-full">
      
      <div className="flex w-full h-full items-center justify-center gap-12 mt-4">
        
        {/* Left Scanner Graphic */}
        <div className="w-[360px] h-[360px] relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-sidebar to-[#05111d] rounded-[2.5rem] border border-slate-800 shadow-[0_0_50px_rgba(0,229,255,0.05)]"></div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-brand-cyan/20"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[3.5rem] rounded-full border-2 border-brand-cyan/40"
          />
          <div className="absolute inset-[5rem] rounded-full border border-brand-cyan/20" />
          
          {/* Inner Robot Head Icon */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center text-slate-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#b0c4de]">
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a5 5 0 015 5v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a5 5 0 015-5h1V5.73A2 2 0 019 4a2 2 0 013-2zm0 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2 11h2v5H2v-5zm18 0h2v5h-2v-5z" />
            </svg>
          </div>
        </div>

        {/* Right Side Text & Visualizer */}
        <div className="flex flex-col gap-8 w-[400px]">
          <div>
            <h2 className="text-6xl font-bold font-telugu text-white mb-2 leading-[1.1]">నేను<br/>వింటున్నాను.</h2>
            <p className="text-2xl font-telugu text-white/90 font-bold tracking-wide mt-4">దయచేసి మాట్లాడండి</p>
          </div>

          <div className="bg-brand-sidebar/80 border border-slate-800 rounded-3xl p-6 w-full shadow-lg">
            <div className="flex items-center gap-2 h-14 mb-6 mt-2 justify-center">
              {[...Array(14)].map((_, i) => {
                const isCenter = i > 4 && i < 9;
                return (
                  <motion.div
                    key={i}
                    animate={{ height: isCenter ? ['40%', '100%', '40%'] : ['20%', '70%', '20%'] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.8, 
                      delay: i * 0.05,
                      ease: "easeInOut"
                    }}
                    className={`w-[5px] bg-brand-cyan rounded-full shadow-[0_0_12px_rgba(0,229,255,0.8)]`}
                  />
                );
              })}
            </div>
            
            <div className="border-t border-slate-700/50 pt-5 flex justify-between items-center px-2">
              <p className="text-slate-300 font-bold tracking-[0.2em] text-xs">VOLUME<br/>LEVEL</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className={`w-2 h-2 rounded-full ${level <= 3 ? 'bg-brand-cyan shadow-[0_0_8px_rgba(0,229,255,1)]' : 'bg-slate-700'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="w-full flex items-end justify-between px-8 mb-2 mt-auto relative">
        <div className="flex flex-col items-center ml-12">
          <div className="bg-brand-cyan text-brand-bg font-bold px-5 py-1.5 rounded-full mb-3 tracking-[0.1em] text-xs shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            AI ACTIVE
          </div>
          <p className="text-slate-300 text-xs w-60 text-center leading-relaxed">
            The AI is processing your environment and waiting for your command.
          </p>
        </div>

        {/* Center Mic Button */}
        <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 bg-brand-cyan/20 rounded-full blur-2xl scale-125" />
            <button className="w-20 h-20 rounded-full bg-gradient-to-b from-[#0e5c70] to-[#06242c] flex flex-col items-center justify-center relative z-10 border border-brand-cyan/30 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
              <Mic className="w-8 h-8 text-brand-bg fill-brand-bg stroke-2 mb-1" />
            </button>
            <span className="text-[#0d6e85] font-bold tracking-widest text-[10px] mt-2 relative z-10">Listening</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-700/50 bg-brand-sidebar hover:bg-slate-800 shadow-lg">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-300">
                <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">Detecting</p>
              <p className="text-slate-300 text-sm">Telugu...</p>
            </div>
          </button>
          <button className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-700/50 bg-brand-sidebar hover:bg-slate-800 shadow-lg">
            <div className="w-6 h-6 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-slate-300" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">System</p>
              <p className="text-slate-300 text-sm">Secure</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListeningView;
