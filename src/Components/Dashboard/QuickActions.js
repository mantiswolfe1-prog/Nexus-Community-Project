import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, Settings, Moon, Sun } from 'lucide-react';
import NeonButton from '../UI/NeonButton.js';

export default function QuickActions({ 
  accentColor = '#00f0ff',
  panicMode,
  setPanicMode,
  lowEndMode,
  setLowEndMode,
  onSettingsClick
}) {
  const handlePanicMode = () => {
    setPanicMode(true);
    // Navigate to a "safe" looking page
    window.location.href = 'https://www.google.com/search?q=math+homework+help';
  };

  return (
    <div className="flex flex-wrap gap-3">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <NeonButton
          onClick={handlePanicMode}
          variant="danger"
          className="gap-2"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Panic Mode</span>
        </NeonButton>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <NeonButton
          onClick={() => setLowEndMode(!lowEndMode)}
          variant={lowEndMode ? 'primary' : 'default'}
          className="gap-2"
          style={lowEndMode ? { borderColor: accentColor + '50' } : {}}
        >
          <Cpu className="w-4 h-4" />
          <span className="hidden sm:inline">{lowEndMode ? 'Low-End On' : 'Optimize'}</span>
        </NeonButton>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <NeonButton
          onClick={onSettingsClick}
          variant="ghost"
          size="icon"
        >
          <Settings className="w-4 h-4" />
        </NeonButton>
      </motion.div>
    </div>
  );
}
