import React, { useState, useEffect } from 'react';
import { CheckCircle, FileDown, Printer, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessScreen = ({ onReset }) => {
  const [stage, setStage] = useState('otp'); // 'otp', 'processing', 'success'
  const [firNumber, setFirNumber] = useState('');

  useEffect(() => {
    if (stage === 'otp') {
      setTimeout(() => setStage('processing'), 3000);
    } else if (stage === 'processing') {
      setTimeout(() => {
        setFirNumber(`AP-FIR-${Math.floor(100000 + Math.random() * 900000)}`);
        setStage('success');
      }, 2000);
    }
  }, [stage]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {stage === 'otp' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">ఆధార్ ఓటీపీ ధృవీకరణ</h2>
          <p className="text-xl text-blue-300 mb-8">Aadhaar OTP Verification in progress...</p>
          
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                className="w-12 h-14 bg-slate-800 rounded-lg border-2 border-blue-500/50 flex items-center justify-center text-2xl font-bold text-white"
              >
                *
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {stage === 'processing' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">ఎఫ్ఐఆర్ రూపొందించబడుతోంది...</h2>
          <p className="text-xl text-blue-300">Generating AI FIR Document in Telugu...</p>
        </motion.div>
      )}

      {stage === 'success' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-2xl"
        >
          <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-2">ఎఫ్ఐఆర్ విజయవంతంగా నమోదు చేయబడింది</h2>
          <p className="text-2xl text-green-400 font-mono mb-8 font-bold">FIR No: {firNumber}</p>

          <div className="w-full bg-slate-800/60 border border-slate-600 rounded-2xl p-6 mb-10 text-left">
            <p className="text-slate-300 text-lg mb-2">✓ మీ ఫిర్యాదు పోలీస్ స్టేషన్‌కు పంపబడింది.</p>
            <p className="text-slate-300 text-lg mb-2">✓ దర్యాప్తు అధికారి (IO) మిమ్మల్ని త్వరలో సంప్రదిస్తారు.</p>
            <p className="text-slate-300 text-lg">✓ అదనపు సమాచారం కోసం మీ మొబైల్ కు SMS పంపబడింది.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full mb-8">
            <button className="flex flex-col items-center justify-center p-6 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Printer className="w-10 h-10 text-white mb-3" />
              <span className="text-xl font-bold text-white">రసీదు ప్రింట్ చేయండి</span>
              <span className="text-sm text-blue-200 mt-1">(Thermal Print)</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-2xl transition-all">
              <FileDown className="w-10 h-10 text-white mb-3" />
              <span className="text-xl font-bold text-white">పీడీఎఫ్ డౌన్‌లోడ్</span>
              <span className="text-sm text-slate-300 mt-1">(PDF Download)</span>
            </button>
          </div>

          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-slate-600 hover:border-slate-400 text-slate-300 rounded-full font-bold text-lg transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            కొత్త ఫిర్యాదు (New Complaint)
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SuccessScreen;
