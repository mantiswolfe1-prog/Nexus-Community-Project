import { useState, useEffect } from 'react';
import { storage } from '../Components/Storage/clientStorage.js';
import { settingsEmitter } from '../utils/settingsEmitter.js';

const DEFAULT_SETTINGS = {
  theme: { background: '#0a0a0f', accent: '#00f0ff', text: '#ffffff' },
  background: { type: 'soft-particle-drift', particleCount: 50, speed: 0.5, opacity: 0.4, blur: 2 },
  performance: { targetFPS: 60, ramLimit: 1024, animationScale: 1, widgetLimit: 3, adaptivePerf: true, showFPS: false },
  games: { fullscreenOnLaunch: true, escToClose: true, lazyLoadStrength: 'medium' },
  widgets: { enabled: true, spotify: true, youtube: true, tiktok: false, autoDisable: true, dockInSidebar: true },
  aiTools: { enabled: false, autoSuggest: true, personality: 'adaptive' },
  browser: { openLinksIn: 'nexus', searchEngine: 'startpage' },
  lowEndMode: false
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings on mount
    const loadSettings = async () => {
      try {
        await storage.init();
        const saved = await storage.loadSettings();
        if (saved) {
          setSettings(prev => ({ ...prev, ...saved }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // Subscribe to settings changes
    const unsubscribe = settingsEmitter.subscribe((newSettings) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
    });

    return unsubscribe;
  }, []);

  return { settings, loading };
}
