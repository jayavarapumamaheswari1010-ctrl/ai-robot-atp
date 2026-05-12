import React, { useEffect, useState } from 'react';
import { Shield, Database, MapPin, Brain, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyzingView = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 h-full w-full overflow-y-auto">
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full w-full">
        
        {/* Left Panel: Robot Image and Progress */}
        <div className="lg:w-[45%] bg-[#0f2130] rounded-3xl border border-slate-700/50 p-6 flex flex-col h-full shadow-xl">
          <div className="flex-1 rounded-2xl overflow-hidden relative mb-6 border border-slate-700/50 bg-[#061423]">
            {/* Replace this src with the exact local image path from the user */}
            <img 
              src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
              alt="AI Analyzing Robot" 
              className="w-full h-full object-cover mix-blend-luminosity opacity-80 scale-105"
            />
            {/* Scanning line animation */}
            <motion.div 
              animate={{ y: ['-10%', '110%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-2 bg-brand-cyan/40 shadow-[0_0_20px_rgba(0,229,255,0.8)]"
            />
          </div>

          <div className="bg-[#061423] rounded-2xl p-5 border border-slate-700/50 flex items-center gap-4">
            <Brain className="w-6 h-6 text-brand-cyan shrink-0" />
            <div className="flex-1 h-1.5 bg-[#0f2130] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-cyan relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, #000 5px, #000 10px)`
                }}></div>
              </motion.div>
            </div>
            <span className="text-brand-cyan font-bold font-mono text-lg">{progress}%</span>
          </div>
        </div>

        {/* Right Panel: Analysis Details */}
        <div className="flex-1 flex flex-col gap-6 lg:gap-8 h-full">
          
          {/* Top Card: Status */}
          <div className="bg-[#0f2130] rounded-3xl border border-slate-700/50 p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/5 to-transparent"></div>
            
            <div className="w-20 h-20 rounded-full border-2 border-brand-cyan/30 flex items-center justify-center relative mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-4px] rounded-full border-t-2 border-brand-cyan"
              />
              <Shield className="w-8 h-8 text-brand-cyan" />
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold font-telugu text-white mb-8 text-center leading-tight relative z-10">
              సమాచారాన్ని<br/>విశ్లేషిస్తున్నాము...
            </h2>

            <div className="grid grid-cols-2 gap-4 w-full relative z-10">
              <div className="bg-[#061423] border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-[10px] lg:text-xs text-slate-400 font-bold font-telugu tracking-wider mb-0.5">డేటా తనిఖీ</p>
                  <p className="text-sm lg:text-base text-brand-cyan font-bold font-telugu">ధృవీకరించబడింది</p>
                </div>
              </div>
              <div className="bg-[#061423] border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <p className="text-[10px] lg:text-xs text-slate-400 font-bold font-telugu tracking-wider mb-0.5">అధికార పరిధి</p>
                  <p className="text-sm lg:text-base text-brand-cyan font-bold font-telugu">గుర్తించబడింది</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Live Feed */}
          <div className="bg-[#0f2130] rounded-3xl border border-slate-700/50 p-6 lg:p-8 flex-1 flex flex-col shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 bg-brand-cyan rounded-full animate-pulse" />
              <h3 className="text-sm font-bold font-telugu tracking-widest text-slate-300">ప్రత్యక్ష ప్రాసెసింగ్ ఫీడ్</h3>
            </div>

            <div className="flex flex-col gap-5 flex-1 relative z-10">
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                <p className="text-slate-300 font-telugu text-sm lg:text-base">చట్టపరమైన నిబంధనలను సరిపోలుస్తోంది...</p>
                <span className="text-[#00cce6] text-xs lg:text-sm font-bold font-telugu tracking-wider">పూర్తయింది</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                <p className="text-slate-300 font-telugu text-sm lg:text-base">వ్యక్తుల సంబంధాలను గుర్తిస్తోంది...</p>
                <span className="text-[#00cce6] text-xs lg:text-sm font-bold font-telugu tracking-wider animate-pulse">పురోగతిలో ఉంది</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
                <p className="text-slate-400 font-telugu text-sm lg:text-base">కేసు సారాంశాన్ని రూపొందిస్తోంది...</p>
                <span className="text-slate-500 text-xs lg:text-sm font-bold font-telugu tracking-wider italic">వేచి ఉంది</span>
              </div>
            </div>

            <div className="mt-auto flex justify-end pt-4">
              <button className="bg-[#b3d4ff]/10 hover:bg-[#b3d4ff]/20 border border-[#b3d4ff]/20 text-[#b3d4ff] px-6 py-2.5 rounded-full flex items-center gap-3 transition-colors">
                <span className="font-bold font-telugu text-xs lg:text-sm tracking-wider">విశ్లేషణను ఆపండి</span>
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalyzingView;
