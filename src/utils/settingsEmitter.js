// Simple event emitter for settings changes
class SettingsEmitter {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(settings) {
    this.listeners.forEach(callback => {
      try {
        callback(settings);
      } catch (err) {
        console.error('Settings listener error:', err);
      }
    });
  }
}

export const settingsEmitter = new SettingsEmitter();
