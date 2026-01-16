import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Sparkles, Palette, Lock, Activity, Upload } from 'lucide-react';
import NeonButton from './NeonButton.js';
import { Input } from './input.js';

const COLOR_PRESETS = [
  { id: 'default', name: 'Nexus Cyan', background: '#0a0a0f', accent: '#00f0ff', text: '#ffffff' },
  { id: 'purple', name: 'Purple Dream', background: '#0f0a14', accent: '#a855f7', text: '#ffffff' },
  { id: 'green', name: 'Matrix Green', background: '#0a0f0a', accent: '#00ff41', text: '#ffffff' },
  { id: 'blue', name: 'Ocean Blue', background: '#0a0e14', accent: '#3b82f6', text: '#ffffff' },
  { id: 'red', name: 'Fire Red', background: '#140a0a', accent: '#ef4444', text: '#ffffff' },
  { id: 'orange', name: 'Sunset Orange', background: '#14100a', accent: '#f97316', text: '#ffffff' },
];

export default function FirstTimeSetup({ onComplete, username: initialUsername, accessCode }) {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({
    showFPS: false,
    username: initialUsername || '',
    password: accessCode || '',
    confirmPassword: accessCode || '',
    colorPreset: 'default',
    aiPersonality: 'adaptive',
  });

  const totalSteps = 4;

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (step === 2) {
      return settings.username.trim().length >= 3 && 
             settings.password.length >= 5 && 
             settings.password === settings.confirmPassword;
    }
    return true;
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target.result);
          
          if (!importData.settings) {
            alert('Invalid settings file format.');
            return;
          }

          // Apply imported settings to wizard
          if (importData.settings.performance?.showFPS !== undefined) {
            updateSetting('showFPS', importData.settings.performance.showFPS);
          }
          if (importData.settings.theme?.accent) {
            const preset = COLOR_PRESETS.find(p => p.accent === importData.settings.theme.accent);
            if (preset) {
              updateSetting('colorPreset', preset.id);
            }
          }
          if (importData.settings.aiTools?.personality) {
            updateSetting('aiPersonality', importData.settings.aiTools.personality);
          }

          alert('Settings imported! Review and proceed through setup.');
        } catch (err) {
          console.error('Failed to parse settings file:', err);
          alert('Invalid settings file. Please check the file and try again.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete setup
      const finalSettings = {
        performance: { showFPS: settings.showFPS },
        username: settings.username,
        password: settings.password,
        theme: COLOR_PRESETS.find(p => p.id === settings.colorPreset) || COLOR_PRESETS[0],
        aiTools: { personality: settings.aiPersonality },
      };
      onComplete(finalSettings);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Activity className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Performance Monitoring</h2>
              <p className="text-white/60">Track your app's performance</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => updateSetting('showFPS', !settings.showFPS)}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  settings.showFPS
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="text-white font-medium text-lg">Show FPS Counter</h3>
                    <p className="text-white/60 text-sm">Display frame rate in real-time</p>
                  </div>
                  {settings.showFPS && <Check className="w-6 h-6 text-cyan-400" />}
                </div>
              </button>
              
              <p className="text-white/40 text-sm text-center">
                {settings.showFPS 
                  ? 'FPS counter will be visible in the corner' 
                  : 'You can enable this later in Settings'}
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Account Setup</h2>
              <p className="text-white/60">Customize your username and password</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Username</label>
                <Input
                  type="text"
                  value={settings.username}
                  onChange={(e) => updateSetting('username', e.target.value)}
                  placeholder="Enter username (min 3 chars)"
                  className="bg-white/5 border-white/10 text-white"
                />
                {settings.username.length > 0 && settings.username.length < 3 && (
                  <p className="text-red-400 text-xs mt-1">Username must be at least 3 characters</p>
                )}
              </div>
              
              <div>
                <label className="text-white/70 text-sm mb-2 block">Password</label>
                <Input
                  type="password"
                  value={settings.password}
                  onChange={(e) => updateSetting('password', e.target.value)}
                  placeholder="Enter password (min 5 chars)"
                  className="bg-white/5 border-white/10 text-white"
                />
                {settings.password.length > 0 && settings.password.length < 5 && (
                  <p className="text-red-400 text-xs mt-1">Password must be at least 5 characters</p>
                )}
              </div>
              
              <div>
                <label className="text-white/70 text-sm mb-2 block">Confirm Password</label>
                <Input
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => updateSetting('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className="bg-white/5 border-white/10 text-white"
                />
                {settings.confirmPassword && settings.password !== settings.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Palette className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white mb-2">Dashboard Colors</h2>
              <p className="text-white/60">Choose your favorite color theme</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => updateSetting('colorPreset', preset.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.colorPreset === preset.id
                      ? 'border-cyan-400 ring-2 ring-cyan-400/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ background: preset.background }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{preset.name}</span>
                    {settings.colorPreset === preset.id && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ background: preset.accent }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ background: preset.text }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white mb-2">AI Settings</h2>
              <p className="text-white/60">How should your AI assistant communicate?</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'adaptive', label: '🔄 Adaptive', desc: 'Mirrors your style' },
                { value: 'kind', label: '💚 Kind', desc: 'Always encouraging' },
                { value: 'moody', label: '😏 Moody', desc: 'Witty and sarcastic' },
                { value: 'professional', label: '💼 Professional', desc: 'Direct and efficient' },
                { value: 'mentor', label: '🎓 Mentor', desc: 'Educational & detailed' },
                { value: 'chill', label: '😎 Chill', desc: 'Relaxed and friendly' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSetting('aiPersonality', option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    settings.aiPersonality === option.value
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{option.label}</h3>
                      <p className="text-white/60 text-sm">{option.desc}</p>
                    </div>
                    {settings.aiPersonality === option.value && (
                      <Check className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-4"
      >
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to Nexus</h1>
            <p className="text-white/60">Let's customize your experience</p>
            
            {/* Progress Bar */}
            <div className="mt-4 flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    i < step ? 'bg-cyan-400' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-white/40 text-sm">
                Step {step} of {totalSteps}
              </div>
              <button
                onClick={handleImportSettings}
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors"
                title="Import settings from backup"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
            <NeonButton
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[120px]"
            >
              {step === totalSteps ? 'Get Started' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </NeonButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
