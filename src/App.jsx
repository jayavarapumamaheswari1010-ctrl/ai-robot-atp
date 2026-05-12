import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import KioskWelcome from './components/KioskWelcome';
import KioskListening from './components/KioskListening';
import KioskQuestions from './components/KioskQuestions';
import KioskPreview from './components/KioskPreview';
import PoliceDashboard from './components/PoliceDashboard';
import './index.css';

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  in:      { opacity: 1, scale: 1 },
  out:     { opacity: 0, scale: 1.02 },
};
const pageTransition = { duration: 0.45, ease: 'easeInOut' };

function App() {
  const [step, setStep] = useState('WELCOME');
  const [listeningData, setListeningData] = useState({});
  const [firData, setFirData] = useState({});

  const handleLaunchKiosk = () => setStep('WELCOME');
  const handleLaunchDashboard = () => setStep('POLICE_DASHBOARD');
  const handleStart = () => setStep('LISTENING');

  const handleListeningContinue = (data) => {
    setListeningData(data);
    setStep('QUESTIONS');
  };

  const handleListeningRetry = () => setStep('LISTENING');

  const handleQuestionsComplete = (answers) => {
    setFirData({ ...listeningData, ...answers });
    setStep('PREVIEW');
  };

  const handleEdit = () => setStep('QUESTIONS');

  const handleConfirm = () => {
    setFirData({});
    setListeningData({});
    setStep('WELCOME');
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#040d1a] select-none">
      <AnimatePresence mode="wait">
        {step === 'POLICE_DASHBOARD' && (
          <motion.div key="dashboard" className="absolute inset-0"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}>
            <PoliceDashboard onLaunchKiosk={handleLaunchKiosk} />
          </motion.div>
        )}
        {step === 'WELCOME' && (
          <motion.div key="welcome" className="absolute inset-0"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}>
            <KioskWelcome onStart={handleStart} onLaunchDashboard={handleLaunchDashboard} />
          </motion.div>
        )}
        {step === 'LISTENING' && (
          <motion.div key="listening" className="absolute inset-0"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}>
            <KioskListening
              onContinue={handleListeningContinue}
              onRetry={handleListeningRetry}
            />
          </motion.div>
        )}
        {step === 'QUESTIONS' && (
          <motion.div key="questions" className="absolute inset-0"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}>
            <KioskQuestions
              category={listeningData.category}
              initialTranscript={listeningData.transcript}
              onComplete={handleQuestionsComplete}
              onBack={() => setStep('LISTENING')}
            />
          </motion.div>
        )}
        {step === 'PREVIEW' && (
          <motion.div key="preview" className="absolute inset-0"
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}>
            <KioskPreview
              firData={firData}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
