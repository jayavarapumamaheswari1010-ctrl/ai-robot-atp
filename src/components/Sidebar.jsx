import React from 'react';
import { Home, FileText, Activity, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, onNavigate }) => {
  const tabs = [
    { id: 'DASHBOARD', icon: Home, label: 'హోమ్ (Dashboard)' },
    { id: 'WELCOME', icon: FileText, label: 'కొత్త ఫిర్యాదు నమోదు (New Complaint)' },
    { id: 'STATUS', icon: Activity, label: 'స్టేటస్ (Status)' },
    { id: 'EMERGENCY', icon: AlertOctagon, label: 'అత్యవసరం (Emergency)' },
  ];

  const isNewFirActive = ['WELCOME', 'QUESTION', 'ANALYZING', 'PREVIEW'].includes(activeTab);

  return (
    <div className="w-64 lg:w-72 h-full bg-brand-bg border-r border-slate-800 flex flex-col items-center py-6 shrink-0 z-20 overflow-y-auto">
      {/* Top Card Section */}
      <div className="w-[90%] bg-[#0f2130] border border-[#1a3147] rounded-3xl p-3 lg:p-4 flex items-center gap-3 lg:gap-4 shadow-xl mb-8 lg:mb-12">
        <div className="relative shrink-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#0d6e85] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-6 lg:h-6 text-[#05111d]">
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a5 5 0 015 5v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a5 5 0 015-5h1V5.73A2 2 0 019 4a2 2 0 013-2zm0 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2 11h2v5H2v-5zm18 0h2v5h-2v-5z" />
            </svg>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-[#0f2130]" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-sm lg:text-[15px] font-bold font-telugu text-white tracking-wide leading-tight truncate">స్మార్ట్ అసిస్టెంట్</h2>
          <p className="text-slate-300 font-telugu text-[11px] lg:text-[13px] tracking-wide mt-0.5 truncate">వింటున్నాను...</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="w-full flex flex-col gap-2 px-4">
        {tabs.map((item) => {
          const isActive = item.id === 'WELCOME' ? isNewFirActive : activeTab === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => onNavigate && onNavigate(item.id)}
              className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl transition-all w-full ${
                isActive 
                  ? 'bg-brand-cyan text-brand-bg font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm lg:text-[15px] font-bold font-telugu tracking-wide truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
