import React from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const RobotAssistant = ({ isListening, onMicClick, speechText, currentStep }) => {
  const getAiMessage = () => {
    if (currentStep === 'modules') {
      return "నమస్కారం! నేను మీ ఏఐ పోలీస్ అసిస్టెంట్. దయచేసి మీ సమస్యను ఎంచుకోండి లేదా నాతో మాట్లాడండి.";
    } else if (currentStep === 'form') {
      return "దయచేసి మీ వివరాలను స్పష్టంగా చెప్పండి. నేను ఆటోమేటిక్‌గా ఫారమ్‌ను పూరిస్తాను.";
    } else if (currentStep === 'success') {
      return "మీ ఎఫ్ఐఆర్ విజయవంతంగా నమోదు చేయబడింది. దయచేసి ప్రింట్ లేదా పీడీఎఫ్ డౌన్‌లోడ్ చేసుకోండి.";
    }
  };

  return (
    <div className="glass-panel rounded-3xl h-full flex flex-col items-center p-8 justify-between relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

      {/* AI Speech Bubble */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-800/80 border border-blue-500/30 p-6 rounded-2xl relative z-10"
      >
        <p className="text-xl leading-relaxed text-blue-100 text-center font-medium">
          {getAiMessage()}
        </p>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800/80 border-b border-r border-blue-500/30 transform rotate-45" />
      </motion.div>

      {/* Robot Face/Avatar */}
      <div className="relative z-10 my-8">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="w-48 h-48 rounded-full border-4 border-blue-400 bg-slate-800 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center overflow-hidden">
            {/* Robot Eyes */}
            <div className="flex gap-6 mb-4">
              <motion.div 
                animate={isListening ? { scaleY: [1, 0.2, 1], transition: { repeat: Infinity, duration: 0.5 } } : {}}
                className="w-8 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" 
              />
              <motion.div 
                animate={isListening ? { scaleY: [1, 0.2, 1], transition: { repeat: Infinity, duration: 0.5, delay: 0.2 } } : {}}
                className="w-8 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" 
              />
            </div>
            {/* Voice Wave */}
            {isListening ? (
              <div className="flex items-center gap-1 h-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-2 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            ) : (
              <div className="w-16 h-2 bg-blue-500/50 rounded-full mt-4" />
            )}
          </div>
          
          {/* Decorative Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] border border-blue-500/20 rounded-full border-dashed"
          />
        </motion.div>
      </div>

      {/* Active Speech Text */}
      <div className="h-16 w-full flex items-center justify-center z-10">
        {speechText && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-cyan-300 font-medium text-center"
          >
            {speechText}
          </motion.p>
        )}
      </div>

      {/* Huge Mic Button */}
      <button
        onClick={onMicClick}
        className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
          isListening 
            ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] scale-110' 
            : 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105'
        }`}
      >
        {isListening ? (
          <MicOff className="w-12 h-12 text-white animate-pulse" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}
        
        {/* Radar Effect when listening */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-red-500 opacity-0 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
        )}
      </button>

      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wide">
        {isListening ? 'మాట్లాడటం ఆపడానికి నొక్కండి' : 'మాట్లాడటానికి నొక్కండి'}
      </p>
    </div>
  );
};

export default RobotAssistant;
