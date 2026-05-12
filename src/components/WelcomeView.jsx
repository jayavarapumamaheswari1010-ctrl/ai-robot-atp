import React, { useEffect, useState } from 'react';
import { Mic, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeView = ({ onStart }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Add a slight delay to ensure the browser has loaded the voices
    const timer = setTimeout(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Clear queue
        const text = "నమస్కారం! అనంతపూర్ పోలీస్ స్టేషన్ కు స్వాగతం.";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'te-IN'; // Telugu locale
        utterance.rate = 0.9;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    }, 800);
    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 relative h-full w-full overflow-y-auto">
      
      <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-8 lg:gap-16">
        
        {/* Left Robot Graphic */}
        <div className="relative flex flex-col items-center shrink-0 mt-4 lg:mt-0">
          <div className={`w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full border border-slate-700 p-2 shadow-[0_0_50px_rgba(0,229,255,0.1)] relative transition-transform duration-300 ${isSpeaking ? 'scale-[1.02]' : 'scale-100'}`}>
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-800 relative z-10 bg-brand-sidebar">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
                alt="Robot Assistant" 
                className="w-full h-full object-cover mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-brand-cyan/20 mix-blend-color"></div>

              {/* Lip Sync / Speaking Visualizer */}
              {isSpeaking && (
                <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  {[1,2,3,4,5,6,7].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['15px', '50px', '15px'] }}
                      transition={{ duration: 0.3 + (Math.random() * 0.2), repeat: Infinity, delay: Math.random() * 0.2 }}
                      className="w-2.5 lg:w-3 bg-brand-cyan rounded-full shadow-[0_0_15px_rgba(0,229,255,1)]"
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Glowing ring behind */}
            <div className={`absolute inset-0 rounded-full border-[6px] border-brand-cyan/20 -z-10 blur-sm transition-all duration-300 ${isSpeaking ? 'scale-110 border-brand-cyan/40' : 'scale-[1.02]'}`} />
          </div>

          <div className="absolute -bottom-4 lg:-bottom-6 bg-slate-900 border border-brand-cyan/40 px-6 py-2 lg:px-8 lg:py-3 rounded-full flex items-center gap-3 z-20 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${isSpeaking ? 'bg-brand-cyan animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'bg-slate-500'}`} />
            <span className={`font-bold font-telugu text-xs lg:text-sm tracking-widest ${isSpeaking ? 'text-brand-cyan' : 'text-white'}`}>
              {isSpeaking ? 'మాట్లాడుతున్నది...' : 'వింటున్నాను...'}
            </span>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col max-w-xl w-full relative z-10">
          
          <div className="relative z-10 mb-6 lg:mb-8 text-center lg:text-left">
            <h1 className="text-3xl lg:text-5xl font-bold font-telugu text-white mb-3 lg:mb-4 leading-tight">
              అనంతపూర్ పోలీస్ డిజిటల్<br className="hidden lg:block"/>సహాయక్ కు స్వాగతం
            </h1>
            <p className="text-lg lg:text-xl font-telugu text-slate-300 leading-relaxed">
              మీ ఫిర్యాదులను నమోదు చేయడానికి లేదా ఇతర పోలీస్ సేవలను పొందడానికి దయచేసి ప్రారంభించండి.
            </p>
          </div>

          {/* Tap to Start Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full bg-gradient-to-r from-[#00cce6] to-[#0099b3] text-brand-bg rounded-2xl lg:rounded-3xl p-6 lg:p-8 flex items-center justify-between shadow-[0_0_40px_rgba(0,229,255,0.3)] mb-4 lg:mb-6 group"
          >
            <div className="flex flex-col text-left">
              <span className="text-2xl lg:text-4xl font-bold font-telugu mb-1 text-black">ప్రారంభించండి</span>
            </div>
            <ArrowRight className="w-8 h-8 lg:w-12 lg:h-12 text-black transition-transform group-hover:translate-x-2" strokeWidth={3} />
          </motion.button>

          {/* Speak directly card */}
          <div className="w-full bg-brand-sidebar border border-slate-700/50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex items-center gap-4 lg:gap-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-cyan" />
            
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#0a2530] rounded-full flex items-center justify-center shrink-0 ml-2">
              <Mic className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-bold font-telugu text-white mb-1">నేరుగా మాట్లాడండి</h3>
              <p className="text-slate-400 text-sm lg:text-base font-telugu">"హలో సహాయక్" అని చెప్పి మీ సమస్యను వివరించండి</p>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Elements */}
      <div className="w-full flex flex-col items-center mt-6 lg:mt-auto pb-4 gap-4 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:flex-row lg:items-end lg:gap-12">
        {/* Floating Mic */}
        <button className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-brand-cyan flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)] transform hover:scale-105 transition-all shrink-0">
          <Mic className="w-6 h-6 lg:w-8 lg:h-8 text-brand-bg mb-1" />
          <span className="text-brand-bg font-bold font-telugu text-[10px] lg:text-xs">ఏఐ వాయిస్</span>
        </button>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          <div className="px-4 py-2 lg:px-6 lg:py-2.5 rounded-full bg-slate-800/50 border border-slate-700 text-white font-telugu text-xs lg:text-sm hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap">
            #ఫిర్యాదు నమోదు
          </div>
          <div className="px-4 py-2 lg:px-6 lg:py-2.5 rounded-full bg-slate-800/50 border border-slate-700 text-white font-telugu text-xs lg:text-sm hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap">
            #స్టేటస్ చెక్
          </div>
          <div className="px-4 py-2 lg:px-6 lg:py-2.5 rounded-full bg-slate-800/50 border border-slate-700 text-white font-telugu text-xs lg:text-sm hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap">
            #అత్యవసర సహాయం
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default WelcomeView;
