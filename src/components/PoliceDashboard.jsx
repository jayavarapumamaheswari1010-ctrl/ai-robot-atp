import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const PoliceDashboard = ({ onLaunchKiosk }) => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState('COMPLAINTS');

  useEffect(() => {
    const q = query(collection(db, 'fir_reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(data);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateRisk = async (id, risk) => {
    try {
      await updateDoc(doc(db, 'fir_reports', id), { risk });
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint(prev => ({ ...prev, risk }));
      }
    } catch (e) {
      console.error('Error updating risk:', e);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'Critical') return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (risk === 'Medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (risk === 'Low') return 'bg-green-500/20 text-green-400 border-green-500/50';
    return 'bg-slate-700/50 text-slate-300 border-slate-600';
  };

  const getRiskLabel = (risk) => {
    if (risk === 'Critical') return 'అత్యంత ప్రమాదకరం (Critical)';
    if (risk === 'Medium') return 'మధ్యస్థం (Medium)';
    if (risk === 'Low') return 'తక్కువ (Low)';
    return 'నిర్ణయించలేదు';
  };

  return (
    <div className="flex h-screen w-full bg-[#040d1a] text-white font-telugu overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-72 bg-[#071528] border-r border-slate-700/60 flex flex-col">
        <div className="p-6 border-b border-slate-700/60 flex flex-col items-center justify-center gap-3">
          <div className="w-20 h-20 bg-white/10 p-2 rounded-full border border-slate-600 shadow-lg">
             <img src="/anantapur_police_logo.jpg" alt="AP Police Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-brand-cyan tracking-wide">అనంతపూర్ పోలీస్</h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-sans">Control Panel</p>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <button onClick={() => setActiveTab('COMPLAINTS')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'COMPLAINTS' ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            కంప్లైంట్స్ (కేసులు)
          </button>
          <button onClick={onLaunchKiosk} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-transparent mt-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            కియోస్క్ మోడ్ ప్రారంభించండి
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-8 border-b border-slate-700/60 bg-[#071528]/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-black text-white">కంప్లైంట్స్ డాష్‌బోర్డ్</h2>
            <p className="text-slate-400 mt-2">నమోదైన అన్ని కేసులను సమీక్షించండి మరియు రిస్క్ స్థాయిని నిర్ణయించండి.</p>
          </div>
          <div className="bg-[#0a1f38] border border-brand-cyan/30 text-brand-cyan px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,229,255,0.1)]">
            మొత్తం కేసులు: {complaints.length}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {complaints.map(comp => (
              <motion.div key={comp.id} whileHover={{ y: -4 }} onClick={() => setSelectedComplaint(comp)}
                className="bg-[#071528] border border-slate-700/60 hover:border-brand-cyan/50 rounded-2xl p-6 cursor-pointer transition-all shadow-lg flex flex-col group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-sans font-black text-xl text-white tracking-wider">{comp.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold ${getRiskColor(comp.risk)}`}>
                    {comp.risk ? getRiskLabel(comp.risk) : 'కొత్తది (New)'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-brand-cyan mb-2">{comp.category || 'ఇతరములు'}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                  {comp.fullDescription || comp.details || 'వివరాలు అందుబాటులో లేవు.'}
                </p>
                <div className="flex items-center justify-between text-slate-500 text-sm mt-auto pt-4 border-t border-slate-700/50">
                  <span>{comp.createdAt?.toDate ? comp.createdAt.toDate().toLocaleDateString('te-IN') : 'N/A'}</span>
                  <span className="group-hover:text-brand-cyan transition-colors">వివరాలు చూడండి &rarr;</span>
                </div>
              </motion.div>
            ))}
            {complaints.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500 text-xl">
                ప్రస్తుతం ఎలాంటి కంప్లైంట్స్ లేవు.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#040d1a]/80 backdrop-blur-sm flex justify-end">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-2xl bg-[#071528] border-l border-slate-700 shadow-2xl h-full flex flex-col">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-[#0a1f38]">
                <div>
                  <p className="text-brand-cyan text-sm font-bold mb-1">కంప్లైంట్ నంబర్</p>
                  <h2 className="text-3xl font-sans font-black text-white tracking-widest">{selectedComplaint.id.slice(0, 8).toUpperCase()}</h2>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                
                {/* Risk Assignment */}
                <div className="bg-[#040d1a] border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">రిస్క్ స్థాయి (Risk Level)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <button onClick={() => handleUpdateRisk(selectedComplaint.id, 'Critical')}
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${selectedComplaint.risk === 'Critical' ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-red-500/50'}`}>
                      Critical
                    </button>
                    <button onClick={() => handleUpdateRisk(selectedComplaint.id, 'Medium')}
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${selectedComplaint.risk === 'Medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-yellow-500/50'}`}>
                      Medium
                    </button>
                    <button onClick={() => handleUpdateRisk(selectedComplaint.id, 'Low')}
                      className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${selectedComplaint.risk === 'Low' ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-green-500/50'}`}>
                      Low
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-brand-cyan text-lg font-bold mb-4 border-b border-slate-700 pb-2">కేసు వివరాలు</h3>
                  <div className="space-y-6">
                    {Object.entries(selectedComplaint).map(([key, val]) => {
                      if (['id', 'createdAt', 'status', 'risk', '_questionTitles'].includes(key)) return null;
                      const labelMap = { category: 'విభాగం', location: 'స్థలం', time: 'సమయం', items: 'దొంగిలించిన వస్తువులు', value: 'నష్టం విలువ', suspects: 'అనుమానితులు', injuries: 'గాయాలు', attackers: 'దాడి చేసిన వారు', description: 'చివరిగా చూసిన స్థలం', fullDescription: 'సంఘటన వివరణ', personalInfo: 'వ్యక్తిగత సమాచారం', details: 'వివరాలు', accused: 'నిందితుడు', relation: 'సంబంధం' };
                      return (
                        <div key={key}>
                          <p className="text-slate-400 text-sm mb-1">{labelMap[key] || key}</p>
                          <p className="text-white text-lg leading-relaxed bg-[#040d1a] p-4 rounded-xl border border-slate-700/50">{String(val)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PoliceDashboard;
