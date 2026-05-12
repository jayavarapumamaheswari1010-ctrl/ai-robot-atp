import React from 'react';
import { Printer, CheckCircle2, FileEdit } from 'lucide-react';
import AnantapurLogo from './AnantapurLogo';

const PreviewView = ({ firData, onConfirm, onEdit }) => {
  const category = firData?.category || 'పేర్కొనబడలేదు';
  const description = firData?.description || 'వివరణ నమోదు కాలేదు. దయచేసి వెనక్కి వెళ్లి వివరంగా చెప్పండి.';
  
  // Get dynamic fields (excluding description, category, and metadata)
  const dynamicFields = Object.keys(firData || {}).filter(
    key => key !== 'category' && key !== 'description' && key !== '_questionTitles'
  );

  const firId = `AP-ANT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Get today's date formatted nicely
  const today = new Date();
  const currentDate = today.toLocaleDateString('te-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 h-full w-full overflow-y-auto">
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full w-full">
        
        {/* Left Panel: Robot Image and Status (Hidden during print) */}
        <div className="lg:w-[35%] bg-[#0f2130] rounded-3xl border border-slate-700/50 p-6 flex flex-col items-center justify-between shadow-xl relative overflow-hidden shrink-0 print:hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#061423] via-transparent to-transparent opacity-80 z-10 pointer-events-none"></div>
          
          <div className="w-full h-[60%] lg:h-[65%] rounded-2xl overflow-hidden relative mb-6 border border-slate-700/50 bg-black">
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3" 
              alt="AI Review Robot" 
              className="w-full h-full object-cover mix-blend-luminosity opacity-90 scale-105"
            />
            <div className="absolute inset-0 bg-brand-cyan/10 mix-blend-overlay"></div>
          </div>

          <div className="relative z-20 text-center w-full mt-auto mb-8">
            <h2 className="text-3xl font-bold font-telugu text-brand-cyan mb-3">సమీక్ష సిద్ధంగా ఉంది</h2>
            <p className="text-slate-300 font-telugu text-sm leading-relaxed px-4">
              దయచేసి మీరు అందించిన ఫిర్యాదు (Complaint) వివరాలను కుడి వైపున సరిచూసుకోండి.
            </p>
          </div>

          <div className="relative z-20 bg-[#061423] border border-slate-700/80 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="w-2.5 h-2.5 bg-brand-cyan rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
            <span className="text-brand-cyan font-bold font-telugu text-xs tracking-wider">ఏఐ డాక్యుమెంట్ విశ్లేషణ పూర్తయింది</span>
          </div>
        </div>

        {/* Right Panel: FIR Details Document (Tabular Format as requested) */}
        <div className="flex-1 bg-white text-black rounded-3xl p-8 lg:p-12 flex flex-col h-full shadow-2xl overflow-y-auto relative printable-fir border-2 border-gray-200">
          
          {/* Action Buttons (Top Right - Hidden on Print) */}
          <div className="absolute top-6 right-6 flex gap-3 print:hidden z-50">
            <button 
              onClick={onEdit} 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
              title="సవరించండి (Edit)"
            >
              <FileEdit className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              onClick={() => window.print()} 
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
              title="ప్రింట్ చేయండి (Print)"
            >
              <Printer className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* FIR Document Content */}
          <div className="max-w-3xl w-full mx-auto font-telugu relative z-10">
            
            {/* Header / Logos */}
            <div className="flex flex-col items-center mb-8 text-center border-b-2 border-black pb-6">
              <AnantapurLogo className="w-20 h-24 lg:w-28 lg:h-32 mb-4 drop-shadow-xl" />
              <h1 className="text-xl lg:text-2xl font-bold underline underline-offset-4 mb-2 tracking-wide uppercase">
                ప్రథమ సమాచార నివేదిక (F.I.R)
              </h1>
              <h2 className="text-sm lg:text-base font-bold uppercase mb-1">ఆంధ్రప్రదేశ్ పోలీస్</h2>
              <h3 className="text-xs lg:text-sm font-semibold text-gray-700">పోలీస్ స్టేషన్: అనంతపూర్ టౌన్, జిల్లా: అనంతపూర్.</h3>
            </div>

            {/* FIR Table Info */}
            <table className="w-full border-collapse border border-black text-sm lg:text-[15px] mb-8">
              <tbody>
                <tr>
                  <td className="border border-black p-3 font-bold w-1/3 lg:w-1/4 bg-gray-50">జిల్లా</td>
                  <td className="border border-black p-3 font-medium">అనంతపూర్</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">పోలీస్ స్టేషన్</td>
                  <td className="border border-black p-3 font-medium">అనంతపూర్ టౌన్</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">ఫిర్యాదు / DD నంబర్</td>
                  <td className="border border-black p-3 font-bold">{firId}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">చట్టం / సెక్షన్లు</td>
                  <td className="border border-black p-3 font-medium">
                    {category === 'దొంగతనం' ? 'సెక్షన్ 379 IPC (దొంగతనం)' : 
                     category === 'దాడి' ? 'సెక్షన్ 323 IPC (గాయపరచడం)' : 
                     category === 'లైంగిక దాడి / అత్యాచారం' ? 'సెక్షన్ 376 IPC (అత్యాచారం)' : 'విచారణకు లోబడి ఉంది'}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">ఫిర్యాదు తేదీ</td>
                  <td className="border border-black p-3 font-medium">{currentDate}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50">విచారణ అధికారి</td>
                  <td className="border border-black p-3 font-medium">శ్రీ. M. మురళి, సబ్-ఇన్స్పెక్టర్ ఆఫ్ పోలీస్</td>
                </tr>
                
                {/* Dynamically insert the user's answers into the table */}
                <tr>
                  <td className="border border-black p-3 font-bold bg-gray-50 text-blue-900">సంఘటన కేటగిరీ</td>
                  <td className="border border-black p-3 font-bold text-blue-900 uppercase">{category}</td>
                </tr>
                
                {dynamicFields.map(key => (
                  <tr key={key}>
                    <td className="border border-black p-3 font-bold bg-gray-50">
                      {firData._questionTitles?.[key] || key}
                    </td>
                    <td className="border border-black p-3 font-medium whitespace-pre-wrap">
                      {firData[key] || 'నమోదు కాలేదు'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Brief Facts / Description */}
            <div className="mb-12">
              <h3 className="font-bold text-base lg:text-lg mb-3 underline underline-offset-4 uppercase">
                సంక్షిప్త వివరాలు (BRIEF FACTS):
              </h3>
              <p className="text-justify text-sm lg:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                {description}
              </p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-300">
              <div className="text-center">
                <div className="border-b border-black w-32 mb-2 mx-auto"></div>
                <p className="font-bold text-sm">ఫిర్యాదుదారుని సంతకం</p>
              </div>
              <div className="text-center">
                <div className="border-b border-black w-40 mb-2 mx-auto"></div>
                <p className="font-bold text-sm">సబ్-ఇన్స్పెక్టర్ ఆఫ్ పోలీస్</p>
                <p className="text-xs font-semibold mt-1">అనంతపూర్ P.S.</p>
              </div>
            </div>

          </div>

          {/* Confirm Action Button (Bottom - Hidden on Print) */}
          <div className="mt-12 flex justify-center print:hidden shrink-0">
            <button 
              onClick={onConfirm}
              className="bg-brand-cyan hover:bg-[#00cce6] text-[#05111d] rounded-2xl px-12 py-4 flex items-center justify-center gap-3 transition-all shadow-lg hover:scale-105"
            >
              <span className="font-bold font-telugu text-lg lg:text-xl">పూర్తి చేసి సమర్పించండి (Submit)</span>
              <CheckCircle2 className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreviewView;
