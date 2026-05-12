import React, { useState, useEffect } from 'react';
import { Globe, HelpCircle, Settings, Clock } from 'lucide-react';
import AnantapurLogo from './AnantapurLogo';

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full h-20 flex items-center justify-between px-6 lg:px-8 border-b border-slate-800 shrink-0 bg-brand-bg/95 backdrop-blur-sm z-50">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="flex items-center justify-center shrink-0">
          <AnantapurLogo className="w-14 h-16 lg:w-16 lg:h-20" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl lg:text-3xl font-bold font-telugu text-white tracking-wide truncate">అనంతపూర్ పోలీస్ ఏఐ కియోస్క్</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <button className="flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-2.5 rounded-full border border-slate-700/50 text-slate-300 hover:bg-slate-800 transition-colors">
          <Globe className="w-4 h-4" />
          <span className="text-xs lg:text-[13px] font-bold font-telugu tracking-wide">తెలుగు</span>
        </button>
        <button className="text-slate-300 hover:text-white transition-colors ml-1 lg:ml-2">
          <Settings className="w-5 h-5" strokeWidth={2} />
        </button>
        <button className="text-slate-300 hover:text-white transition-colors ml-1 lg:ml-2">
          <HelpCircle className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="ml-2 lg:ml-4 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-brand-cyan flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.2)] shrink-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(255,215,0,0.8)] invert" alt="Emblem" style={{ filter: 'brightness(0) saturate(100%) invert(75%) sepia(48%) saturate(1458%) hue-rotate(3deg) brightness(108%) contrast(106%)' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
