import React from 'react';
import { 
  AlertTriangle, 
  UserX, 
  HeartCrack, 
  CarFront, 
  MonitorX, 
  Wallet, 
  Home, 
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

const modules = [
  { id: 'quarrels', title: 'చిన్న గొడవలు', subtitle: 'Petty Quarrels', icon: AlertTriangle, color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
  { id: 'missing', title: 'తప్పిపోయిన వ్యక్తి', subtitle: 'Missing Person', icon: UserX, color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
  { id: 'dowry', title: 'వరకట్న వేధింపులు', subtitle: 'Dowry Harassment', icon: HeartCrack, color: 'bg-pink-500/20 text-pink-400 border-pink-500/50' },
  { id: 'accident', title: 'రోడ్డు ప్రమాదం', subtitle: 'Road Accident', icon: CarFront, color: 'bg-red-500/20 text-red-400 border-red-500/50' },
  { id: 'cyber', title: 'సైబర్ నేరం', subtitle: 'Cybercrime', icon: MonitorX, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' },
  { id: 'theft', title: 'దొంగతనం', subtitle: 'Theft', icon: Wallet, color: 'bg-purple-500/20 text-purple-400 border-purple-500/50' },
  { id: 'land', title: 'ఆస్తి వివాదాలు', subtitle: 'Land & Property Disputes', icon: Home, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
  { id: 'modesty', title: 'మహిళలపై దాడి', subtitle: 'Outrage of Modesty', icon: ShieldAlert, color: 'bg-rose-500/20 text-rose-400 border-rose-500/50' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ModuleGrid = ({ onSelect }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">సమస్యను ఎంచుకోండి</h2>
        <p className="text-xl text-blue-300">Select your complaint category (లేదా మైక్ నొక్కి చెప్పండి)</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
      >
        {modules.map((mod) => (
          <motion.button
            key={mod.id}
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mod)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 backdrop-blur-sm transition-all shadow-lg ${mod.color} hover:bg-opacity-40 hover:shadow-xl`}
          >
            <mod.icon className="w-16 h-16 mb-4" />
            <span className="text-2xl font-bold text-center leading-tight mb-2 text-white">{mod.title}</span>
            <span className="text-sm font-medium opacity-80 text-center">{mod.subtitle}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ModuleGrid;
