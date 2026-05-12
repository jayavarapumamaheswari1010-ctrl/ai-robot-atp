import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROBOT_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const CAT_QUESTIONS_MAP = {
  'దొంగతనం': [
    { id: 'location', q: 'దొంగతనం ఎక్కడ జరిగింది?' },
    { id: 'time', q: 'ఏ సమయంలో దొంగతనం జరిగింది?' },
    { id: 'items', q: 'దొంగిలించబడిన వస్తువులు ఏమిటి?' },
    { id: 'value', q: 'దొంగిలించబడిన వస్తువుల అంచనా విలువ ఎంత?' },
    { id: 'suspects', q: 'దొంగతనం చేసిన వారిని మీరు చూశారా? వారి వివరాలు చెప్పండి.' },
    { id: 'cctv', q: 'సంఘటన జరిగిన ప్రదేశంలో సీసీటీవీ కెమెరాలు ఉన్నాయా?' },
  ],
  'దాడి': [
    { id: 'location', q: 'దాడి ఎక్కడ మరియు ఎప్పుడు జరిగింది?' },
    { id: 'attackers', q: 'మీపై దాడి చేసిన వారి పేర్లు లేదా గుర్తులు తెలుసా?' },
    { id: 'reason', q: 'దాడికి గల కారణాలు ఏమైనా ఉన్నాయా?' },
    { id: 'weapons', q: 'ఎలాంటి ఆయుధాలతో దాడి చేశారు?' },
    { id: 'injuries', q: 'మీకు తగిలిన గాయాల వివరాలు చెప్పండి.' },
    { id: 'witnesses', q: 'సంఘటన సమయంలో అక్కడ ఎవరైనా సాక్షులు ఉన్నారా?' },
  ],
  'తప్పిపోయిన వ్యక్తి': [
    { id: 'name_age', q: 'తప్పిపోయిన వ్యక్తి పేరు మరియు వయస్సు ఎంత?' },
    { id: 'location', q: 'మీరు వారిని చివరిగా ఎక్కడ మరియు ఏ సమయంలో చూశారు?' },
    { id: 'clothing', q: 'వారు చివరిగా ఎలాంటి దుస్తులు ధరించారు?' },
    { id: 'physical', q: 'వారి శారీరక గుర్తులు (ఎత్తు, రంగు) వివరించండి.' },
    { id: 'medical', q: 'వారికి ఏమైనా అనారోగ్య సమస్యలు ఉన్నాయా?' },
    { id: 'suspects', q: 'ఈ విషయంలో ఎవరిపైనైనా అనుమానం ఉందా?' },
  ],
  'లైంగిక దాడి లేదా అత్యాచారం': [
    { id: 'location', q: 'ఈ దురదృష్టకర సంఘటన ఎక్కడ మరియు ఎప్పుడు జరిగింది?' },
    { id: 'accused', q: 'నిందితుడిని మీరు గుర్తించగలరా? వారి వివరాలు చెప్పండి.' },
    { id: 'known_prior', q: 'నిందితుడు మీకు ముందుగా తెలుసా?' },
    { id: 'medical_help', q: 'మీకు గాయాలు ఏమైనా అయ్యాయా? వైద్య సహాయం తీసుకున్నారా?' },
    { id: 'first_informed', q: 'సంఘటన గురించి మీరు మొదట ఎవరికి చెప్పారు?' },
  ],
  'ఇతరములు': [
    { id: 'problem', q: 'దయచేసి సమస్య ఏమిటో స్పష్టంగా వివరించండి.' },
    { id: 'location', q: 'ఈ సంఘటన ఎక్కడ మరియు ఎప్పుడు జరిగింది?' },
    { id: 'suspects', q: 'ఈ సంఘటనకు సంబంధించి ఎవరిపైనైనా అనుమానం ఉందా?' },
    { id: 'evidence', q: 'దీనికి సంబంధించి మీ వద్ద ఏమైనా ఆధారాలు ఉన్నాయా?' },
  ],
};

const FINAL_QS = [
  { id: 'fullDescription', q: 'సంఘటన గురించి పూర్తిగా వివరించండి.' },
  { id: 'personalInfo', q: 'మీ పేరు మరియు ఫోన్ నంబర్ చెప్పండి.' },
];

const KioskQuestions = ({ category, initialTranscript, onComplete, onBack }) => {
  const cat = category || 'ఇతరములు';
  const allQuestions = [...(CAT_QUESTIONS_MAP[cat] || CAT_QUESTIONS_MAP['ఇతరములు']), ...FINAL_QS];

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [waveH, setWaveH] = useState(Array(14).fill(6));
  const recRef = useRef(null);
  const waveInterval = useRef(null);

  const currentQ = allQuestions[qIndex];

  // Wave animation
  useEffect(() => {
    if (isListening) {
      waveInterval.current = setInterval(() => setWaveH(Array(14).fill(0).map(() => Math.random() * 55 + 6)), 130);
    } else {
      clearInterval(waveInterval.current);
      setWaveH(Array(14).fill(6));
    }
    return () => clearInterval(waveInterval.current);
  }, [isListening]);

  // Speak question
  useEffect(() => {
    const t = setTimeout(() => {
      if ('speechSynthesis' in window && currentQ) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(currentQ.q);
        u.lang = 'te-IN'; u.rate = 0.9;
        u.onstart = () => setIsSpeaking(true);
        u.onend = () => {
          setIsSpeaking(false);
          if (!isListening) {
             try { recRef.current?.start(); setIsListening(true); } catch(e){}
          }
        };
        u.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(u);
      }
    }, 400);
    return () => { clearTimeout(t); window.speechSynthesis?.cancel(); setIsSpeaking(false); };
  }, [qIndex]);

  // Auto-advance on silence
  useEffect(() => {
    if (inputVal.trim().length > 3) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000); // 5 seconds of silence
      return () => clearTimeout(timer);
    }
  }, [inputVal]);

  // Setup recognition
  useEffect(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'te-IN';
    rec.onresult = (e) => {
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) setInputVal(p => p ? p + ' ' + final : final);
    };
    rec.onend = () => setIsListening(false);
    recRef.current = rec;
    return () => { try { rec.stop(); } catch (e) {} };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      try { recRef.current?.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      setInputVal('');
      try { recRef.current?.start(); setIsListening(true); } catch (e) {}
    }
  };

  const handleNext = () => {
    if (!inputVal.trim()) return;
    try { recRef.current?.stop(); } catch (e) {}
    const newAnswers = { ...answers, [currentQ.id]: inputVal, category: cat };
    setAnswers(newAnswers);
    if (qIndex < allQuestions.length - 1) {
      setQIndex(qIndex + 1);
      setInputVal('');
      setIsListening(false);
    } else {
      window.speechSynthesis?.cancel();
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (qIndex > 0) { setQIndex(qIndex - 1); setInputVal(answers[allQuestions[qIndex - 1].id] || ''); }
    else { window.speechSynthesis?.cancel(); onBack(); }
  };

  const progress = Math.round(((qIndex + 1) / allQuestions.length) * 100);

  return (
    <div className="kiosk-bg kiosk-glow-bg relative w-full h-full flex overflow-hidden">
      <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent pointer-events-none z-50" />

      {/* LEFT – Robot */}
      <div className="relative flex flex-col items-center justify-center w-[35%] shrink-0 px-10">
        {(isSpeaking || isListening) && (
          <>
            <div className="pulse-ring absolute w-[340px] h-[340px] rounded-full border-2 border-brand-cyan/30" />
            <div className="pulse-ring-2 absolute w-[340px] h-[340px] rounded-full border border-brand-cyan/20" />
          </>
        )}
        <div className="robot-float relative z-10">
          <div className="w-[260px] h-[260px] rounded-full overflow-hidden border-4 shadow-[0_0_60px_rgba(0,229,255,0.3)]"
            style={{ borderColor: isSpeaking ? 'rgba(0,229,255,0.7)' : 'rgba(0,229,255,0.35)' }}>
            <img src={ROBOT_URL} alt="AI" className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.6) hue-rotate(160deg) brightness(0.8)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040d1a]/60 via-transparent to-transparent" />
          </div>
          {/* Waveform */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-end gap-1 h-14">
            {waveH.map((h, i) => (
              <motion.div key={i} className="w-2 rounded-full bg-brand-cyan"
                animate={{ height: h }} transition={{ duration: 0.13 }}
                style={{ minHeight: 6, opacity: isListening ? 0.9 : 0.15 }} />
            ))}
          </div>
        </div>
        {/* Question box on robot side */}
        <div className="mt-20 w-full bg-[#071528] border border-slate-700/60 rounded-2xl p-5">
          <p className="font-telugu text-slate-400 text-sm mb-2">ప్రస్తుత ప్రశ్న</p>
          <p className="font-telugu text-xl text-white font-semibold leading-snug">{currentQ?.q}</p>
        </div>
        {/* Status dot */}
        <div className={`mt-4 flex items-center gap-2 px-5 py-2 rounded-full border ${isListening ? 'border-brand-cyan/50 bg-brand-cyan/10' : isSpeaking ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-slate-700 bg-[#071528]'}`}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${isListening ? 'bg-brand-cyan' : isSpeaking ? 'bg-yellow-400' : 'bg-slate-500'}`} />
          <span className={`font-telugu text-base ${isListening ? 'text-brand-cyan' : isSpeaking ? 'text-yellow-300' : 'text-slate-400'}`}>
            {isListening ? 'వింటున్నాను...' : isSpeaking ? 'మాట్లాడుతున్నది...' : 'సిద్ధంగా ఉంది'}
          </span>
        </div>
      </div>

      {/* RIGHT – Q&A Panel */}
      <div className="flex-1 flex flex-col justify-between py-10 pr-14 pl-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-telugu text-brand-cyan text-lg font-semibold">ప్రశ్న {qIndex + 1} / {allQuestions.length}</p>
            <span className="font-telugu text-sm text-slate-400 bg-[#071528] border border-slate-700 px-4 py-1.5 rounded-full">{cat}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8">
            <motion.div className="h-full bg-gradient-to-r from-brand-cyan to-brand-teal rounded-full"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        {/* Question title */}
        <AnimatePresence mode="wait">
          <motion.h2 key={qIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="font-telugu text-4xl font-black text-white leading-tight mb-8">
            {currentQ?.q}
          </motion.h2>
        </AnimatePresence>

        {/* Text area */}
        <div className="relative flex-1 mb-6">
          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="మీ సమాధానం ఇక్కడ మాట్లాడండి లేదా టైప్ చేయండి..."
            className="w-full h-full min-h-[160px] bg-[#071528] border-2 border-slate-700/60 focus:border-brand-cyan rounded-3xl px-8 py-6 font-telugu text-2xl text-white placeholder:text-slate-600 outline-none resize-none transition-colors"
            style={{ lineHeight: 1.6 }}
          />
          {isListening && <div className="absolute inset-0 rounded-3xl ring-2 ring-brand-cyan/40 pointer-events-none animate-pulse" />}
        </div>

        {/* Action row */}
        <div className="flex gap-5">
          <button onClick={handleBack}
            className="flex items-center gap-3 px-8 py-5 bg-[#071528] border-2 border-slate-700 text-white font-telugu text-2xl font-bold rounded-3xl hover:border-slate-500 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            వెనక్కి
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={toggleListening}
            className={`flex-1 flex items-center justify-center gap-4 font-telugu text-2xl font-black rounded-3xl py-5 border-2 transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-[#0a1f38] border-brand-teal/60 text-brand-cyan hover:bg-brand-teal/10'}`}>
            <svg className="w-8 h-8" fill={isListening ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            {isListening ? 'వినడం ఆపండి' : 'వాయిస్ ద్వారా చెప్పండి'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleNext}
            disabled={!inputVal.trim()}
            className={`flex-1 flex items-center justify-center gap-4 font-telugu text-2xl font-black rounded-3xl py-5 transition-all ${inputVal.trim() ? 'bg-gradient-to-r from-[#00cce6] to-[#00b4d8] text-[#040d1a] shadow-[0_0_30px_rgba(0,229,255,0.3)]' : 'bg-slate-800 text-slate-600 cursor-not-allowed border-2 border-slate-700'}`}>
            {qIndex < allQuestions.length - 1 ? 'తదుపరి' : 'పూర్తి చేయండి'}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default KioskQuestions;
