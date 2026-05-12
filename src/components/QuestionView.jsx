import React, { useState, useEffect, useRef } from 'react';
import { Mic, Box, UserMinus, User, MoreHorizontal, ChevronLeft, ArrowRight, Keyboard, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const categoryQuestionsMap = {
  'దొంగతనం': [
    { id: 'location', type: 'text', title: 'దొంగతనం ఎక్కడ జరిగింది?', placeholder: 'స్థలాన్ని నమోదు చేయండి...' },
    { id: 'time', type: 'text', title: 'దొంగతనం ఏ సమయంలో జరిగింది?', placeholder: 'సమయం నమోదు చేయండి...' },
    { id: 'stolenItems', type: 'text', title: 'ఏమి దొంగిలించబడ్డాయి?', placeholder: 'వస్తువుల వివరాలు...' },
    { id: 'lossValue', type: 'text', title: 'నష్టం విలువ సుమారుగా ఎంత ఉంటుంది?', placeholder: 'అంచనా విలువ...' },
    { id: 'suspects', type: 'text', title: 'ఎవరైనా అనుమానితులు ఉన్నారా?', placeholder: 'అనుమానితుల వివరాలు...' }
  ],
  'దాడి': [
    { id: 'location', type: 'text', title: 'దాడి ఎక్కడ జరిగింది?', placeholder: 'స్థలాన్ని నమోదు చేయండి...' },
    { id: 'time', type: 'text', title: 'దాడి ఎప్పుడు జరిగింది?', placeholder: 'సమయం నమోదు చేయండి...' },
    { id: 'injuries', type: 'text', title: 'ఎవరికైనా గాయాలు అయ్యాయా? వివరాలు చెప్పండి.', placeholder: 'గాయాల వివరాలు...' },
    { id: 'weapons', type: 'text', title: 'ఏదైనా ఆయుధాలు వాడారా?', placeholder: 'ఆయుధాల వివరాలు...' },
    { id: 'attackers', type: 'text', title: 'దాడి చేసిన వారి వివరాలు తెలుసా?', placeholder: 'దాడి చేసిన వారి వివరాలు...' }
  ],
  'తప్పిపోయిన వ్యక్తి': [
    { id: 'location', type: 'text', title: 'చివరిగా ఎక్కడ చూశారు?', placeholder: 'స్థలాన్ని నమోదు చేయండి...' },
    { id: 'time', type: 'text', title: 'ఏ సమయం నుండి కనిపించడం లేదు?', placeholder: 'సమయం నమోదు చేయండి...' },
    { id: 'personDetails', type: 'text', title: 'తప్పిపోయిన వ్యక్తి వయస్సు, ఎత్తు, మరియు దుస్తుల వివరాలు చెప్పండి.', placeholder: 'వయస్సు, ఎత్తు, దుస్తులు...' },
    { id: 'relation', type: 'text', title: 'తప్పిపోయిన వ్యక్తితో మీకు గల సంబంధం ఏమిటి?', placeholder: 'సంబంధం...' }
  ],
  'లైంగిక దాడి / అత్యాచారం': [
    { id: 'location', type: 'text', title: 'సంఘటన ఎక్కడ జరిగింది?', placeholder: 'స్థలాన్ని నమోదు చేయండి...' },
    { id: 'time', type: 'text', title: 'సంఘటన ఎప్పుడు జరిగింది?', placeholder: 'సమయం నమోదు చేయండి...' },
    { id: 'accusedDetails', type: 'text', title: 'నిందితుడు మీకు ముందుగానే తెలుసా? తెలిస్తే వివరాలు చెప్పండి.', placeholder: 'నిందితుడి వివరాలు...' },
    { id: 'medicalHelp', type: 'text', title: 'మీకు వైద్య సహాయం ఏమైనా అవసరమా?', placeholder: 'వైద్య సహాయం...' }
  ],
  'ఇతరములు': [
    { id: 'location', type: 'text', title: 'సంఘటన ఎక్కడ జరిగింది?', placeholder: 'స్థలాన్ని నమోదు చేయండి...' },
    { id: 'time', type: 'text', title: 'సంఘటన ఎప్పుడు జరిగింది?', placeholder: 'సమయం నమోదు చేయండి...' },
    { id: 'incidentDetails', type: 'text', title: 'సంఘటనకు సంబంధించిన ముఖ్యమైన వివరాలు చెప్పండి.', placeholder: 'ముఖ్య వివరాలు...' }
  ]
};

const commonFinalQuestions = [
  { id: 'description', type: 'text', title: 'దయచేసి జరిగిన సంఘటన గురించి కనీసం రెండు నిమిషాల పాటు వివరంగా చెప్పండి.', placeholder: 'సంఘటన గురించి పూర్తిగా వివరించండి...' },
  { id: 'personalInfo', type: 'text', title: 'మీ పేరు మరియు ఫోన్ నంబర్ ఏమిటి?', placeholder: 'పేరు, ఫోన్ నంబర్...' }
];

const initialQuestion = { id: 'category', type: 'options', title: 'జరిగిన సంఘటన ఏమిటి?' };

const QuestionView = ({ onNext, onBack }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([initialQuestion]);

  const currentQ = questions[currentQIndex];

  // Speak the question whenever it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if ('speechSynthesis' in window && currentQ) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentQ.title);
        utterance.lang = 'te-IN';
        utterance.rate = 0.9;
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [currentQIndex, currentQ]);

  // Setup Real Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'te-IN'; // Telugu speech recognition

      rec.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputValue((prev) => prev ? prev + ' ' + finalTranscript : finalTranscript);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputValue(''); // Clear previous input when starting fresh recording
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch(e) {
        console.error("Speech recognition error:", e);
      }
    }
  };

  const handleOptionSelect = (optTitle) => {
    const newAnswers = { ...answers, category: optTitle };
    setAnswers(newAnswers);
    
    // Build dynamic questions array based on selection
    const dynamicQuestions = categoryQuestionsMap[optTitle] || categoryQuestionsMap['ఇతరములు'];
    setQuestions([initialQuestion, ...dynamicQuestions, ...commonFinalQuestions]);
    
    goToNext(newAnswers, [initialQuestion, ...dynamicQuestions, ...commonFinalQuestions]);
  };

  const handleTextNext = () => {
    if (inputValue.trim() === '') return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    const updatedAnswers = { ...answers, [currentQ.id]: inputValue };
    
    // Store question titles mapping so we can display them easily in the PreviewView
    const finalAnswers = {
      ...updatedAnswers,
      _questionTitles: {
        ...(answers._questionTitles || {}),
        [currentQ.id]: currentQ.title
      }
    };
    
    setAnswers(finalAnswers);
    goToNext(finalAnswers, questions);
  };

  const goToNext = (currentAnswers, currentQuestions) => {
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setInputValue('');
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      onNext(currentAnswers);
    }
  };

  const handleBackClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
      setInputValue(answers[questions[currentQIndex - 1].id] || '');
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      onBack();
    }
  };

  const options = [
    { id: 'theft', icon: Box, title: 'దొంగతనం' },
    { id: 'assault', icon: User, title: 'దాడి' },
    { id: 'missing', icon: UserMinus, title: 'తప్పిపోయిన వ్యక్తి' },
    { id: 'sexual_assault', icon: UserMinus, title: 'లైంగిక దాడి / అత్యాచారం' },
    { id: 'others', icon: MoreHorizontal, title: 'ఇతరములు' }
  ];

  if (!currentQ) return null;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 relative h-full w-full overflow-hidden">
      
      <div className="flex flex-col lg:flex-row h-full gap-8 lg:gap-12 mt-4 lg:items-stretch">
        
        {/* Left Side Robot Box */}
        <div className="w-full lg:w-[360px] h-48 lg:h-[460px] bg-[#061423] rounded-[2rem] lg:rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden flex flex-col items-center shrink-0">
          <div className={`relative w-full flex-1 flex items-center justify-center transition-transform duration-300 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
              alt="Robot"
              className="w-full h-full object-cover mix-blend-luminosity opacity-80"
            />
            <div className="absolute inset-0 bg-brand-cyan/10 mix-blend-overlay"></div>
            
            {/* Lip Sync / Speaking Visualizer */}
            {isSpeaking && (
              <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {[1,2,3,4,5].map((i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: ['10px', '40px', '10px'] }}
                    transition={{ duration: 0.3 + (Math.random() * 0.2), repeat: Infinity, delay: Math.random() * 0.2 }}
                    className="w-2.5 bg-brand-cyan rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex flex-col justify-end">
            <h2 className="text-xl lg:text-[1.5rem] font-bold font-telugu text-white leading-tight mb-4 text-center">
              దయచేసి అడిగిన వివరాలను స్పష్టంగా తెలపండి.
            </h2>
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-3 bg-[#081826]/80 backdrop-blur-sm border border-brand-cyan/40 px-6 py-2 rounded-full ${isSpeaking ? 'animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.2)]' : ''}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-brand-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'bg-slate-500'}`} />
                <span className={`font-bold font-telugu text-sm tracking-widest ${isSpeaking ? 'text-brand-cyan' : 'text-slate-400'}`}>
                  {isSpeaking ? 'మాట్లాడుతున్నది...' : 'సిద్ధంగా ఉంది'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex-1 flex flex-col pt-2 lg:pt-4 relative">
          <p className="text-brand-cyan font-bold tracking-[0.15em] mb-2 lg:mb-4 text-xs lg:text-sm">ప్రశ్న {currentQIndex + 1} / {questions.length}</p>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl lg:text-[2.8rem] font-bold font-telugu text-white mb-8 lg:mb-10 leading-[1.2]">
                {currentQ.title}
              </h2>

              {currentQ.type === 'options' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 max-w-2xl">
                  {options.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleOptionSelect(opt.title)}
                      className="bg-[#0b1b2a] border border-slate-700/60 rounded-[1.5rem] lg:rounded-[2rem] p-4 lg:p-6 flex items-center gap-4 lg:gap-5 hover:border-brand-cyan hover:bg-slate-800 transition-all text-left shadow-lg w-full group"
                    >
                      <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-[1rem] lg:rounded-[1.2rem] bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-brand-cyan/50">
                        <opt.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-[1.4rem] font-bold font-telugu text-white mb-0">{opt.title}</h3>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentQ.type === 'text' && (
                <div className="max-w-2xl flex flex-col gap-6 flex-1">
                  
                  <div className="relative flex-1 max-h-[40vh]">
                    <textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={currentQ.placeholder}
                      className="w-full h-full min-h-[150px] bg-[#0b1b2a] border-2 border-slate-700/60 focus:border-brand-cyan rounded-[1.5rem] lg:rounded-[2rem] px-6 lg:px-8 py-5 lg:py-6 text-xl lg:text-2xl font-telugu text-white placeholder:text-slate-500 shadow-lg outline-none transition-all pr-12 resize-none"
                      autoFocus
                    />
                    <div className="absolute right-4 top-6 text-slate-500">
                      <Keyboard className="w-6 h-6 opacity-50" />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4 pb-4">
                    <button 
                      onClick={toggleListening}
                      className={`flex-1 flex items-center justify-center gap-4 rounded-3xl py-5 lg:py-6 border-2 transition-all shadow-lg ${
                        isListening 
                          ? 'bg-red-500/20 border-red-500 text-red-500' 
                          : 'bg-[#0a2530] border-[#0d6e85] text-brand-cyan hover:bg-[#0d6e85]/30'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <Square className="w-8 h-8 fill-current" />
                          <span className="font-bold font-telugu text-xl lg:text-2xl">ఆపండి (Stop)</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-8 h-8" />
                          <span className="font-bold font-telugu text-xl lg:text-2xl">వాయిస్ ద్వారా చెప్పండి</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handleTextNext}
                      disabled={inputValue.trim() === ''}
                      className={`flex items-center justify-center gap-3 rounded-3xl py-5 lg:py-6 px-10 transition-all ${
                        inputValue.trim() === ''
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-2 border-slate-700/50'
                          : 'bg-brand-cyan hover:bg-[#00cce6] text-[#05111d] shadow-[0_0_30px_rgba(0,229,255,0.3)]'
                      }`}
                    >
                      <span className="font-bold font-telugu text-xl lg:text-2xl">తదుపరి</span>
                      <ArrowRight className="w-7 h-7" strokeWidth={3} />
                    </button>
                  </div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Bottom Area */}
      <div className="w-full flex flex-col items-center mt-8 lg:mt-auto pb-4 gap-4 lg:absolute lg:bottom-8 lg:left-0 lg:right-0 lg:flex-row lg:justify-between lg:px-10 lg:pb-0 pointer-events-none">
        
        <div className="hidden lg:flex flex-col items-center absolute left-1/2 -translate-x-1/2 -bottom-2 opacity-50">
          <div className="w-[5.5rem] h-[5.5rem] rounded-full bg-slate-800 flex items-center justify-center">
            <Mic className="w-8 h-8 text-slate-600" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-col items-center lg:items-end gap-3 lg:ml-auto w-full lg:w-auto mt-4 lg:mt-0 pointer-events-auto">
          <div className="bg-[#081826] border border-slate-700/80 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full flex items-center gap-2 lg:gap-3">
            <div className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-slate-300 font-bold font-telugu text-[11px] lg:text-[13px] tracking-wide">
              {isListening ? 'ఏఐ వింటున్నది...' : 'ఏఐ సిద్ధంగా ఉంది'}
            </span>
          </div>
          <button 
            onClick={handleBackClick}
            className="w-full lg:w-auto justify-center bg-[#0b1b2a]/80 border border-slate-700/80 px-6 py-3 lg:px-8 lg:py-3.5 rounded-[1.5rem] lg:rounded-[2rem] text-white font-telugu text-lg lg:text-[1.15rem] font-bold hover:bg-slate-800 flex items-center gap-2 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={3} />
            వెనక్కి
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;
