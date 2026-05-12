import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const DashboardView = () => {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFirId, setExpandedFirId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'fir_reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firData = [];
      snapshot.forEach((doc) => {
        firData.push({ id: doc.id, ...doc.data() });
      });
      setFirs(firData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateRiskLevel = async (id, riskLevel) => {
    try {
      const firRef = doc(db, 'fir_reports', id);
      await updateDoc(firRef, { riskLevel });
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update risk level.");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 relative h-full w-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold font-telugu text-white mb-2">పోలీస్ డ్యాష్‌బోర్డ్ (Police Dashboard)</h1>
        <p className="text-slate-400 font-telugu">మొత్తం నమోదైన ఫిర్యాదులు (Total Complaints filed): <span className="text-brand-cyan font-bold text-xl">{firs.length}</span></p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {firs.map((fir) => {
            const isExpanded = expandedFirId === fir.id;
            return (
              <div key={fir.id} className="bg-brand-sidebar border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                  fir.riskLevel === 'emergency' ? 'bg-red-500' : 
                  fir.riskLevel === 'medium' ? 'bg-yellow-500' : 
                  fir.riskLevel === 'not_risk' ? 'bg-green-500' : 'bg-slate-500'
                }`} />
                
                <div className="flex flex-col lg:flex-row justify-between gap-6 ml-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full font-mono">
                        ID: {fir.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {fir.createdAt ? new Date(fir.createdAt.toDate()).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <p className="text-white"><strong className="text-brand-cyan">ఫిర్యాదుదారుడు (Complainant):</strong> {fir['ఫిర్యాదుదారుని పేరు'] || fir.name || 'N/A'}</p>
                      <p className="text-white"><strong className="text-brand-cyan">సంఘటన (Incident):</strong> {fir['సంఘటన ఏమిటి'] || fir.incident || 'N/A'}</p>
                      
                      {!isExpanded && (
                        <p className="text-slate-300 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-800 mt-2 line-clamp-2">
                          {fir.transcription || 'No description provided.'}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => setExpandedFirId(isExpanded ? null : fir.id)}
                      className="mt-4 flex items-center gap-2 text-brand-cyan hover:text-white transition-colors text-sm font-bold"
                    >
                      <FileText className="w-4 h-4" /> 
                      {isExpanded ? 'పూర్తి వివరాలు దాచండి (Hide Full Report)' : 'పూర్తి నివేదిక చూడండి (View Full Report)'}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3 bg-slate-900/30 p-4 rounded-xl">
                        <h4 className="text-brand-cyan font-bold mb-3 border-b border-slate-700 pb-2">పూర్తి వివరాలు (Full Details):</h4>
                        {Object.entries(fir).map(([key, value]) => {
                          if (['id', 'createdAt', 'riskLevel', 'status'].includes(key)) return null;
                          return (
                            <div key={key} className="flex flex-col sm:flex-row sm:gap-2 text-sm border-b border-slate-800/50 pb-2 last:border-0">
                              <span className="text-slate-400 min-w-[200px] font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="text-white flex-1">{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48 shrink-0">
                    <p className="text-sm font-bold text-slate-400 mb-1">వర్గీకరించండి (Categorize):</p>
                    <button 
                      onClick={() => updateRiskLevel(fir.id, 'emergency')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${fir.riskLevel === 'emergency' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      <AlertCircle className="w-4 h-4" /> Emergency
                    </button>
                    <button 
                      onClick={() => updateRiskLevel(fir.id, 'medium')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${fir.riskLevel === 'medium' ? 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      <AlertTriangle className="w-4 h-4" /> Medium
                    </button>
                    <button 
                      onClick={() => updateRiskLevel(fir.id, 'not_risk')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${fir.riskLevel === 'not_risk' ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                    >
                      <CheckCircle className="w-4 h-4" /> Not Risk
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {firs.length === 0 && (
             <div className="text-center py-12 text-slate-400 font-telugu">
               ఎటువంటి ఫిర్యాదులు కనుగొనబడలేదు. (No Complaints found.)
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardView;
