import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, UploadCloud, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const FirForm = ({ module, onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({});

  const questions = [
    { id: 'name', title: 'మీ పేరు మరియు ఆధార్ నంబర్ చెప్పండి', subtitle: 'Name & Aadhaar' },
    { id: 'datetime', title: 'సంఘటన ఎప్పుడు జరిగింది?', subtitle: 'Date & Time of Incident' },
    { id: 'location', title: 'ఎక్కడ జరిగింది? ప్రదేశం చెప్పండి', subtitle: 'Location of Incident' },
    { id: 'details', title: 'సరిగ్గా ఏమి జరిగిందో చెప్పండి', subtitle: 'Detailed Description' },
    { id: 'evidence', title: 'ఏవైనా ఫోటోలు లేదా ఆధారాలు ఉంటే అప్‌లోడ్ చేయండి', subtitle: 'Upload Evidence (Optional)', type: 'upload' }
  ];

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{module.title}</h2>
          <p className="text-xl text-blue-300">FIR Registration Process</p>
        </div>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-600 hover:bg-slate-700 font-bold"
        >
          వెనక్కి (Back)
        </button>
      </div>

      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* Timeline/Progress */}
        <div className="w-1/3 border-r border-slate-700 pr-4 overflow-y-auto">
          {questions.map((q, idx) => (
            <div 
              key={q.id} 
              className={`flex gap-4 mb-8 ${idx > currentQuestion ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  idx < currentQuestion ? 'bg-green-500 text-white' : 
                  idx === currentQuestion ? 'bg-blue-500 text-white border-4 border-blue-900/50' : 
                  'bg-slate-800 text-slate-500 border border-slate-600'
                }`}>
                  {idx < currentQuestion ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < questions.length - 1 && (
                  <div className={`w-1 h-full min-h-[40px] my-2 rounded-full ${
                    idx < currentQuestion ? 'bg-green-500' : 'bg-slate-800'
                  }`} />
                )}
              </div>
              <div className="pt-1">
                <p className="text-lg font-bold text-white leading-tight">{q.title}</p>
                <p className="text-sm text-slate-400">{q.subtitle}</p>
                {idx < currentQuestion && (
                  <p className="mt-2 text-green-400 text-sm font-medium bg-green-500/10 p-2 rounded">
                    నమోదు చేయబడింది (Recorded)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Current Question View */}
        <div className="w-2/3 flex flex-col justify-center items-center p-8 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
              {questions[currentQuestion].type === 'upload' ? <UploadCloud className="w-10 h-10" /> : <FileText className="w-10 h-10" />}
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4 leading-relaxed">
              {questions[currentQuestion].title}
            </h3>
            
            {questions[currentQuestion].type === 'upload' ? (
              <div className="w-full mt-6 p-8 border-2 border-dashed border-slate-600 rounded-xl bg-slate-800/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 hover:border-blue-500 transition-all">
                <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-lg text-slate-300">ఆధారాలు అప్‌లోడ్ చేయడానికి ఇక్కడ తాకండి</p>
                <p className="text-sm text-slate-500 mt-2">Tap here to upload (Images/PDF/Video)</p>
              </div>
            ) : (
              <div className="w-full mt-6 bg-slate-900/50 p-6 rounded-xl border border-blue-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                <p className="text-xl text-blue-200 relative z-10 flex flex-col items-center gap-3">
                  <span className="animate-bounce">🎤</span>
                  సమాధానం చెప్పడానికి మైక్ వాడండి...
                  <span className="text-sm text-slate-400">(Please use the microphone to answer)</span>
                </p>
              </div>
            )}

            <button 
              onClick={handleNext}
              className="mt-12 w-full max-w-md bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform active:scale-95"
            >
              {currentQuestion === questions.length - 1 ? 'పూర్తి చేయండి (Submit)' : 'తర్వాత (Next)'}
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FirForm;
