import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROBOT_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';

const KioskWelcome = ({ onStart, onLaunchDashboard }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!hasInteracted) return;
    const t1 = setTimeout(() => setShowContent(true), 300);
    const t2 = setTimeout(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('నమస్కారం! ఆంధ్రప్రదేశ్ పోలీస్ శాఖ AI ఫిర్యాదు వ్యవస్థకు స్వాగతం.');
        u.lang = 'te-IN'; u.rate = 0.85;
        u.onstart = () => setIsSpeaking(true);
        u.onend = () => setIsSpeaking(false);
        u.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(u);
      }
    }, 800);
    return () => { clearTimeout(t1); clearTimeout(t2); window.speechSynthesis?.cancel(); };
  }, [hasInteracted]);

  if (!hasInteracted) {
    return (
      <div 
        className="kiosk-bg absolute inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setHasInteracted(true)}
      >
        <div className="w-40 h-40 rounded-full bg-white/5 border border-brand-cyan/20 flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(0,229,255,0.1)]">
           <svg className="w-16 h-16 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
        </div>
        <h1 className="font-telugu text-5xl text-white font-bold mb-6">ప్రారంభించడానికి ఇక్కడ నొక్కండి</h1>
        <p className="font-sans text-2xl text-slate-400 tracking-wider">TAP ANYWHERE TO WAKE UP SYSTEM</p>
      </div>
    );
  }

  return (
    <div className="kiosk-bg kiosk-glow-bg relative w-full h-full flex overflow-hidden">
      <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent pointer-events-none z-50" />

      {/* Top Header & Dashboard Access */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-50">
        <div className="flex items-center gap-4 pl-6">
          <div className="w-16 h-16 rounded-full bg-white/10 p-2 flex items-center justify-center border border-slate-700/50 shadow-lg backdrop-blur-md">
            <img src="/anantapur_police_logo.jpg" alt="AP Police Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <p className="font-telugu text-brand-cyan text-sm font-bold tracking-widest uppercase mb-1">అనంతపూర్ పోలీస్</p>
            <h2 className="font-telugu text-xl font-black text-white">AI కంప్లైంట్ సహాయక్</h2>
          </div>
        </div>
        
        {/* Police Dashboard Access Button */}
        <button onClick={onLaunchDashboard} className="mt-2 mr-6 p-3 bg-[#071528]/80 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-500 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all shadow-lg" title="Police Dashboard">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
        </button>
      </div>

      {/* LEFT - Robot */}
      <div className="relative flex flex-col items-center justify-center w-[45%] h-full shrink-0 px-12">
        {isSpeaking && (
          <>
            <div className="pulse-ring absolute w-[420px] h-[420px] rounded-full border-2 border-brand-cyan/30" />
            <div className="pulse-ring-2 absolute w-[420px] h-[420px] rounded-full border-2 border-brand-cyan/20" />
            <div className="pulse-ring-3 absolute w-[420px] h-[420px] rounded-full border border-brand-cyan/10" />
          </>
        )}
        <div className="robot-float relative z-10">
          <div className="w-[340px] h-[340px] rounded-full overflow-hidden border-4 shadow-[0_0_60px_rgba(0,229,255,0.25)]" style={{ borderColor: 'rgba(0,229,255,0.4)' }}>
            <img src={ROBOT_URL} alt="AI Robot" className="w-full h-full object-cover" style={{ filter: 'saturate(0.7) hue-rotate(160deg) brightness(0.85)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a]/60 via-transparent to-transparent" />
          </div>
          {isSpeaking && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-1.5">
              {[40, 55, 70, 80, 65, 75, 55, 40, 60, 70, 50, 40].map((h, i) => (
                <div key={i} className="wave-bar w-2.5 bg-brand-cyan rounded-full" style={{ '--wave-h': `${h}px`, '--wave-dur': `${0.5 + (i % 4) * 0.12}s`, '--wave-delay': `${i * 0.06}s`, minHeight: '6px' }} />
              ))}
            </div>
          )}
        </div>
        <div className={`mt-14 flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all duration-500 ${isSpeaking ? 'border-brand-cyan/60 bg-brand-cyan/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'border-slate-700 bg-[#071528]/80'}`}>
          <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-brand-cyan shadow-[0_0_10px_#00e5ff] animate-pulse' : 'bg-slate-500'}`} />
          <span className={`font-telugu text-lg font-semibold ${isSpeaking ? 'text-brand-cyan' : 'text-slate-300'}`}>{isSpeaking ? 'మాట్లాడుతున్నది...' : 'వింటున్నాను...'}</span>
        </div>
      </div>

      {/* RIGHT - Content */}
      <div className="flex-1 flex flex-col justify-center pr-16 pl-8 gap-10">
        <AnimatePresence>
          {showContent && (
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex flex-col gap-10">
              <div>
                <p className="font-telugu text-brand-cyan text-xl font-semibold tracking-widest mb-2">ఆంధ్రప్రదేశ్ పోలీస్ శాఖ</p>
                <h1 className="font-telugu text-6xl font-black text-white leading-tight">
                  అనంతపూర్ పోలీస్ <span className="shimmer-text">డిజిటల్</span><br />సహాయక్ కు స్వాగతం
                </h1>
                <p className="font-telugu text-2xl text-slate-300 mt-5 leading-relaxed font-medium">
                  మీ ఫిర్యాదులను నమోదు చేయడానికి లేదా ఇతర పోలీస్<br />సేవలను పొందడానికి దయచేసి ప్రారంభించండి.
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onStart}
                className="flex items-center justify-between bg-gradient-to-r from-[#00cce6] to-[#00b4d8] rounded-3xl px-10 py-7 shadow-[0_0_50px_rgba(0,229,255,0.4)] group max-w-2xl">
                <span className="font-telugu text-4xl font-black text-[#040d1a]">ప్రారంభించండి</span>
                <svg className="w-12 h-12 text-[#040d1a] group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
              <div className="relative flex items-center gap-6 bg-[#0a1f38] border border-slate-700/60 rounded-3xl px-8 py-6 max-w-2xl overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-cyan rounded-l-3xl" />
                <div className="w-16 h-16 rounded-2xl bg-[#071528] flex items-center justify-center border border-slate-700 ml-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-telugu text-2xl font-bold text-white mb-1">నేరుగా మాట్లాడండి</h3>
                  <p className="font-telugu text-lg text-slate-400">"హలో సహాయక్" అని చెప్పి మీ సమస్యను వివరించండి</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom tags */}
      <div className="absolute bottom-8 left-[45%] flex items-center gap-4 pl-8">
        {['#ఫిర్యాదు నమోదు', '#స్టేటస్ చెక్', '#అత్యవసర సహాయం'].map((tag) => (
          <div key={tag} className="font-telugu text-base text-slate-300 border border-slate-700 bg-slate-800/50 px-5 py-2 rounded-full hover:border-brand-cyan/50 hover:text-brand-cyan transition-colors cursor-pointer">{tag}</div>
        ))}
      </div>
    </div>
  );
};

export default KioskWelcome;
