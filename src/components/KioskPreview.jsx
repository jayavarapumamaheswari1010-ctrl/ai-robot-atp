import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const KioskPreview = ({ firData, onConfirm, onEdit }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [firId, setFirId] = useState('');

  useEffect(() => {
    if (!submitted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance('నమోదు చేయడానికి ముందు దయచేసి వివరాలన్నీ తనిఖీ చేయండి.');
        u.lang = 'te-IN'; u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }
    }
    return () => window.speechSynthesis?.cancel();
  }, [submitted]);

  useEffect(() => {
    if (submitted && firId) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Spelled out character by character if it's an alphanumeric ID or just let TTS handle it
        const u = new SpeechSynthesisUtterance(`మీ కంప్లైంట్ విజయవంతంగా నమోదు చేయబడింది. కంప్లైంట్ నంబర్ పక్కన గమనించగలరు.`);
        u.lang = 'te-IN'; u.rate = 0.9;
        window.speechSynthesis.speak(u);
      }
    }
  }, [submitted, firId]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const ref = collection(db, 'fir_reports');
      const doc = await addDoc(ref, {
        ...firData,
        createdAt: serverTimestamp(),
        status: 'Pending',
      });
      setFirId(doc.id.slice(0, 8).toUpperCase());
      setSubmitted(true);
      setTimeout(() => onConfirm && onConfirm(doc.id), 2800);
    } catch (e) {
      console.error(e);
      alert('తప్పు జరిగింది. మళ్లీ ప్రయత్నించండి.');
      setSubmitting(false);
    }
  };

  const labelMap = {
    category: 'విభాగం',
    location: 'స్థలం',
    time: 'సమయం',
    items: 'దొంగిలించిన వస్తువులు',
    value: 'నష్టం విలువ',
    suspects: 'అనుమానితులు',
    injuries: 'గాయాలు',
    attackers: 'దాడి చేసిన వారు',
    description: 'చివరిగా చూసిన స్థలం',
    fullDescription: 'సంఘటన వివరణ',
    personalInfo: 'వ్యక్తిగత సమాచారం',
    details: 'వివరాలు',
    accused: 'నిందితుడు',
    relation: 'సంబంధం',
  };

  const skipKeys = ['_questionTitles'];
  const entries = Object.entries(firData || {}).filter(([k]) => !skipKeys.includes(k) && firData[k]);

  if (submitted) {
    const today = new Date().toLocaleDateString('te-IN');
    const time = new Date().toLocaleTimeString('te-IN');

    return (
      <div className="kiosk-bg relative w-full h-full flex items-center justify-center p-8 overflow-hidden select-text">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          className="bg-white text-black w-full max-w-4xl h-full rounded-sm shadow-2xl p-10 overflow-y-auto relative border border-slate-300">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-telugu text-2xl font-black underline mb-1">కంప్లైంట్ నమోదు పత్రం</h2>
            <h3 className="font-telugu text-xl font-bold">పోలీస్ స్టేషన్: అనంతపురం ప్రధాన కార్యాలయం</h3>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-black text-left mb-8 font-telugu text-lg">
            <tbody>
              <tr>
                <td className="border border-black p-3 font-bold w-1/3">జిల్లా</td>
                <td className="border border-black p-3">అనంతపురం</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold">పోలీస్ స్టేషన్</td>
                <td className="border border-black p-3">అనంతపురం</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold">కంప్లైంట్ నంబర్</td>
                <td className="border border-black p-3 font-bold text-lg">{firId}</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold">తేదీ మరియు సమయం</td>
                <td className="border border-black p-3">{today} {time}</td>
              </tr>
              <tr>
                <td className="border border-black p-3 font-bold">విభాగం</td>
                <td className="border border-black p-3">{firData.category || 'ఇతరములు'}</td>
              </tr>
              {firData.personalInfo && (
                <tr>
                  <td className="border border-black p-3 font-bold">ఫిర్యాదుదారు వివరాలు</td>
                  <td className="border border-black p-3">{firData.personalInfo}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Brief Facts */}
          <div className="mb-20">
            <h3 className="font-bold font-telugu text-xl underline mb-3">సంఘటన వివరాలు :</h3>
            <p className="font-telugu text-lg leading-relaxed text-justify">
              ఈ రోజు అనగా <strong>{today}</strong> నాడు ఆన్‌లైన్ AI కియోస్క్ ద్వారా ఒక ఫిర్యాదు నమోదు చేయబడినది. ఫిర్యాదుదారు తెలిపిన వివరాల ప్రకారం:
              {Object.entries(firData)
                .filter(([k]) => k !== 'category' && k !== 'personalInfo')
                .map(([k, v]) => ` ${v}.`)
                .join(' ')}
              పై వివరాల ఆధారంగా తదుపరి చర్యలు తీసుకోవాలని కోరడమైనది.
            </p>
          </div>

          {/* Signatures */}
          <div className="absolute bottom-10 right-10 text-center">
            <p className="font-bold font-telugu text-lg">సబ్ ఇన్స్పెక్టర్ ఆఫ్ పోలీస్</p>
            <p className="font-telugu text-lg">అనంతపురం పి.ఎస్.</p>
          </div>

          {/* Print / Done buttons */}
          <div className="fixed bottom-10 left-10 flex gap-4 print:hidden">
            <button onClick={() => window.print()} className="bg-slate-800 text-white px-6 py-3 rounded-full font-telugu shadow-lg border border-slate-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z"/></svg>
              ప్రింట్ చేయండి
            </button>
            <button onClick={() => { if(onConfirm) onConfirm(firId); }} className="bg-brand-cyan text-[#040d1a] font-bold px-8 py-3 rounded-full font-telugu shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              పూర్తి చేయండి
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="kiosk-bg kiosk-glow-bg relative w-full h-full flex flex-col px-16 py-10 overflow-hidden">
      <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent pointer-events-none z-50" />

      {/* Header */}
      <div className="mb-8 shrink-0">
        <p className="font-telugu text-brand-cyan text-xl font-semibold mb-2">ఆంధ్రప్రదేశ్ పోలీస్ శాఖ</p>
        <h1 className="font-telugu text-5xl font-black text-white">కంప్లైంట్ వివరాలు సమీక్షించండి</h1>
        <p className="font-telugu text-xl text-slate-400 mt-2">నమోదు చేయడానికి ముందు దయచేసి అన్ని వివరాలు తనిఖీ చేయండి.</p>
      </div>

      {/* Details grid */}
      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-5 content-start">
        {entries.map(([key, val]) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#071528] border border-slate-700/50 rounded-2xl px-7 py-5">
            <p className="font-telugu text-slate-400 text-base mb-1">{labelMap[key] || key}</p>
            <p className="font-telugu text-xl text-white font-semibold leading-relaxed">{String(val)}</p>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-6 mt-8 shrink-0">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onEdit}
          className="flex-1 bg-[#071528] border-2 border-slate-600 text-white font-telugu text-3xl font-black rounded-3xl py-6 hover:border-slate-400 transition-colors flex items-center justify-center gap-4">
          <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          సవరించండి
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleConfirm} disabled={submitting}
          className={`flex-1 font-telugu text-3xl font-black rounded-3xl py-6 flex items-center justify-center gap-4 transition-all ${submitting ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-gradient-to-r from-[#00cce6] to-[#00b4d8] text-[#040d1a] shadow-[0_0_40px_rgba(0,229,255,0.35)]'}`}>
          {submitting ? (
            <><svg className="w-9 h-9 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>నమోదు అవుతున్నది...</>
          ) : (
            <><svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>ధృవీకరించి నమోదు చేయండి</>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default KioskPreview;
