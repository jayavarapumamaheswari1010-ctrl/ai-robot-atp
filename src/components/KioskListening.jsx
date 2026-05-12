import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROBOT_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const CATEGORIES = ['దొంగతనం', 'దాడి', 'తప్పిపోయిన వ్యక్తి', 'లైంగిక దాడి లేదా అత్యాచారం', 'ఇతరములు'];
const CAT_KEYWORDS = {
  'దొంగతనం': ['దొంగ', 'దొంగిలి', 'దొంగతనం', 'బైక్', 'కారు', 'ఫోన్', 'డబ్బు', 'వస్తువు'],
  'దాడి': ['దాడి', 'కొట్టారు', 'గాయం', 'హత్య', 'కత్తి', 'నొప్పి'],
  'తప్పిపోయిన వ్యక్తి': ['తప్పిపో', 'కనిపించడం లేదు', 'గల్లంతు'],
  'లైంగిక దాడి లేదా అత్యాచారం': ['లైంగిక', 'అత్యాచారం', 'వేధింపు'],
  'ఇతరములు': [],
};

function detectCategory(text) {
  for (const [cat, kws] of Object.entries(CAT_KEYWORDS)) {
    if (kws.some(k => text.includes(k))) return cat;
  }
  return null;
}

const KioskListening = ({ onContinue, onRetry }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [detectedCat, setDetectedCat] = useState(null);
  const [waveHeights, setWaveHeights] = useState(Array(20).fill(6));
  const recRef = useRef(null);
  const waveRef = useRef(null);

  // Animate waveform
  useEffect(() => {
    if (isListening) {
      waveRef.current = setInterval(() => {
        setWaveHeights(Array(20).fill(0).map(() => Math.random() * 70 + 6));
      }, 120);
    } else {
      clearInterval(waveRef.current);
      setWaveHeights(Array(20).fill(6));
    }
    return () => clearInterval(waveRef.current);
  }, [isListening]);

  // Detect category from transcript
  useEffect(() => {
    if (transcript.length > 5) {
      const cat = detectCategory(transcript);
      if (cat) setDetectedCat(cat);
    }
  }, [transcript]);

  // Auto-advance on silence when category is detected
  useEffect(() => {
    if (detectedCat && transcript.length > 5) {
      const timer = setTimeout(() => {
        handleContinue(detectedCat);
      }, 4000); // 4 seconds of silence after category detected
      return () => clearTimeout(timer);
    }
  }, [transcript, detectedCat]);

  // Setup speech recognition
  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'te-IN';
    rec.onresult = (e) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) setTranscript(p => (p ? p + ' ' + final : final));
    };
    rec.onend = () => setIsListening(false);
    recRef.current = rec;

    // Speak first, then start listening
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance('జరిగిన సంఘటన ఏమిటి? దయచేసి వివరంగా మాట్లాడండి లేదా కింద ఉన్న ఆప్షన్లలో ఒకటి ఎంచుకోండి.');
      u.lang = 'te-IN'; u.rate = 0.9;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => {
        setIsSpeaking(false);
        try { rec.start(); setIsListening(true); } catch (e) {}
      };
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => {
        try { rec.start(); setIsListening(true); } catch (e) {}
      }, 600);
    }

    return () => { window.speechSynthesis?.cancel(); try { rec.stop(); } catch (e) {} };
  }, []);

  const handleRetry = () => {
    setTranscript('');
    setDetectedCat(null);
    try {
      recRef.current?.stop();
      setTimeout(() => { try { recRef.current?.start(); setIsListening(true); } catch (e) {} }, 400);
    } catch (e) {}
    if (onRetry) onRetry();
  };

  const handleContinue = (selectedCat) => {
    const finalCat = typeof selectedCat === 'string' ? selectedCat : (detectedCat || 'ఇతరములు');
    try { recRef.current?.stop(); } catch (e) {}
    onContinue({ transcript, category: finalCat });
  };

  return (
    <div className="kiosk-bg kiosk-glow-bg relative w-full h-full flex overflow-hidden">
      <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent pointer-events-none z-50" />

      {/* ══ LEFT – Robot ══ */}
      <div className="relative flex flex-col items-center justify-center w-[40%] shrink-0 px-10">
        {/* Pulse rings */}
        {(isListening || isSpeaking) && (
          <>
            <div className="pulse-ring absolute w-[380px] h-[380px] rounded-full border-2 border-brand-cyan/40" />
            <div className="pulse-ring-2 absolute w-[380px] h-[380px] rounded-full border-2 border-brand-cyan/25" />
            <div className="pulse-ring-3 absolute w-[380px] h-[380px] rounded-full border border-brand-cyan/15" />
          </>
        )}

        <div className="robot-float relative z-10">
          {/* Robot image */}
          <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden border-4 shadow-[0_0_80px_rgba(0,229,255,0.35)]"
            style={{ borderColor: isSpeaking ? 'rgba(0,229,255,0.8)' : isListening ? 'rgba(0,229,255,0.5)' : 'rgba(0,229,255,0.3)' }}>
            <img src={ROBOT_URL} alt="AI Robot" className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.6) hue-rotate(160deg) brightness(0.8)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a]/70 via-transparent to-transparent" />
            {/* Glowing eye dots */}
            <div className="absolute top-[34%] left-[32%] flex gap-8">
              <div className="eye-glow w-5 h-5 rounded-full bg-brand-cyan" />
              <div className="eye-glow w-5 h-5 rounded-full bg-brand-cyan" style={{ animationDelay: '0.15s' }} />
            </div>
          </div>

          {/* Waveform below robot */}
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-end gap-1 h-16">
            {waveHeights.map((h, i) => (
              <motion.div key={i} className="w-2 rounded-full bg-brand-cyan"
                animate={{ height: h }}
                transition={{ duration: 0.12, ease: 'easeInOut' }}
                style={{ minHeight: 6, opacity: isListening ? 1 : 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div className={`mt-20 flex items-center gap-3 px-7 py-3 rounded-full border-2 transition-all duration-500 ${isSpeaking ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_25px_rgba(234,179,8,0.3)]' : isListening ? 'border-brand-cyan bg-brand-cyan/10 shadow-[0_0_25px_rgba(0,229,255,0.3)]' : 'border-slate-700 bg-[#071528]'}`}>
          <div className={`w-4 h-4 rounded-full animate-pulse ${isSpeaking ? 'bg-yellow-400 shadow-[0_0_12px_#eab308]' : isListening ? 'bg-brand-cyan shadow-[0_0_12px_#00e5ff]' : 'bg-slate-500'}`} />
          <span className={`font-telugu text-xl font-bold ${isSpeaking ? 'text-yellow-400' : isListening ? 'text-brand-cyan' : 'text-slate-300'}`}>
            {isSpeaking ? 'మాట్లాడుతున్నది...' : isListening ? 'వింటున్నాను...' : 'సిద్ధంగా ఉంది'}
          </span>
        </div>
      </div>

      {/* ══ RIGHT – Panel ══ */}
      <div className="flex-1 flex flex-col justify-center pr-14 pl-6 gap-6 overflow-y-auto">

        {/* Title */}
        <div>
          <p className="font-telugu text-brand-cyan text-lg font-semibold tracking-widest">ఆంధ్రప్రదేశ్ పోలీస్ శాఖ</p>
          <h1 className="font-telugu text-5xl font-black text-white leading-tight mt-1">AI కంప్లైంట్ నమోదు వ్యవస్థ</h1>
        </div>

        {/* Question & Options */}
        <div className="mt-2">
          <h2 className="font-telugu text-3xl font-black text-white mb-5">జరిగిన సంఘటన ఏమిటి?</h2>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleContinue(cat)}
                className={`flex items-center justify-between px-6 py-5 rounded-2xl border-2 transition-all ${detectedCat === cat ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'bg-[#071528] border-slate-700 hover:border-brand-cyan/50 text-white'}`}
              >
                <span className="font-telugu text-xl font-bold">{cat}</span>
                {detectedCat === cat && (
                  <div className="w-3 h-3 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_10px_#00e5ff]" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mic + Transcription */}
        <div className="relative bg-[#071528] border border-slate-700/60 rounded-3xl p-6 flex flex-col gap-4 overflow-hidden mt-2">
          {isListening && <div className="absolute inset-0 rounded-3xl ring-2 ring-brand-cyan/30 animate-pulse pointer-events-none" />}
          
          <div className="flex items-center gap-4">
            <div className={`relative flex items-center justify-center w-14 h-14 rounded-full shrink-0 ${isListening ? 'mic-pulse bg-brand-cyan/20 border-2 border-brand-cyan' : 'bg-[#0a1f38] border-2 border-slate-700'}`}>
              <svg className={`w-7 h-7 ${isListening ? 'text-brand-cyan' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="flex-1 bg-[#040d1a] border border-slate-700/50 rounded-xl px-5 py-4 relative min-h-[60px] flex items-center">
              <p className="font-telugu text-xl text-white leading-relaxed">
                {transcript || (
                  <span className="text-slate-500">మీరు మాట్లాడటం ప్రారంభించండి...</span>
                )}
                {isListening && <span className="blink-cursor inline-block w-0.5 h-6 bg-brand-cyan ml-1 align-middle" />}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-5 mt-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleContinue(detectedCat)}
            className="flex-1 bg-gradient-to-r from-[#00cce6] to-[#00b4d8] text-[#040d1a] font-telugu text-3xl font-black rounded-3xl py-6 shadow-[0_0_40px_rgba(0,229,255,0.35)] flex items-center justify-center gap-4">
            కొనసాగించండి
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleRetry}
            className="flex-1 bg-[#071528] border-2 border-slate-600 text-white font-telugu text-3xl font-black rounded-3xl py-6 hover:border-brand-cyan/50 transition-colors flex items-center justify-center gap-4">
            <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            మళ్లీ మాట్లాడండి
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default KioskListening;
