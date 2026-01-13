import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Gamepad2, BookOpen, Music, Video, Globe, Users, Settings, Wrench, RefreshCw, AlertCircle } from 'lucide-react';

const Launcher = () => {
  const [countdown, setCountdown] = useState(3);
  const [status, setStatus] = useState('ready'); // ready, launching, failed, success
  const [errorMessage, setErrorMessage] = useState('');

  const openNexus = () => {
    setStatus('launching');
    setErrorMessage('');

    try {
      // Open the main app in a new window
      const nexusWindow = window.open('/', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');

      if (nexusWindow) {
        // Check if the window loaded successfully
        const checkWindow = setTimeout(() => {
          try {
            // Try to access the window - if it fails, window was blocked
            if (nexusWindow.closed) {
              setStatus('failed');
              setErrorMessage('Popup was closed or blocked. Please allow popups and try again.');
            } else {
              setStatus('success');
              // Close the launcher window after a short delay
              setTimeout(() => {
                window.close();
              }, 1000);
            }
          } catch (e) {
            setStatus('failed');
            setErrorMessage('Failed to launch Nexus. Please check your browser settings.');
          }
        }, 2000);

        // Listen for window load events
        nexusWindow.addEventListener('load', () => {
          clearTimeout(checkWindow);
          setStatus('success');
          setTimeout(() => {
            window.close();
          }, 1000);
        });

        nexusWindow.addEventListener('error', () => {
          clearTimeout(checkWindow);
          setStatus('failed');
          setErrorMessage('Failed to load Nexus. The server may not be running.');
        });

      } else {
        setStatus('failed');
        setErrorMessage('Popup blocked! Please allow popups for this site and try again.');
      }
    } catch (error) {
      setStatus('failed');
      setErrorMessage('Error launching Nexus: ' + error.message);
    }
  };

  const restartLauncher = () => {
    setStatus('ready');
    setCountdown(3);
    setErrorMessage('');
  };

  useEffect(() => {
    if (status === 'ready' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'ready' && countdown === 0) {
      openNexus();
    }
  }, [countdown, status]);

  useEffect(() => {
    // Listen for 'C' key press
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'c' && status === 'ready') {
        event.preventDefault();
        openNexus();
      } else if (event.key.toLowerCase() === 'r' && status === 'failed') {
        event.preventDefault();
        restartLauncher();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [status]);

  const features = [
    { icon: Shield, text: "Privacy-First", color: "text-blue-400" },
    { icon: Gamepad2, text: "Games Platform", color: "text-purple-400" },
    { icon: BookOpen, text: "Study Tools", color: "text-green-400" },
    { icon: Music, text: "Music Player", color: "text-pink-400" },
    { icon: Video, text: "Video Library", color: "text-red-400" },
    { icon: Globe, text: "Web Browser", color: "text-cyan-400" },
    { icon: Users, text: "Social Hub", color: "text-yellow-400" },
    { icon: Settings, text: "Settings", color: "text-gray-400" },
    { icon: Wrench, text: "Utilities", color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <Zap className={`w-16 h-16 mx-auto ${status === 'failed' ? 'text-red-400' : 'text-cyan-400'}`} />
              <div className={`absolute inset-0 rounded-full blur-xl ${status === 'failed' ? 'bg-red-400/20' : 'bg-cyan-400/20'}`}></div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
          >
            NEXUS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-8"
          >
            {status === 'failed' ? 'Launch Failed' : 'Privacy-First Student Hub'}
          </motion.p>

          {/* Status Messages */}
          {status === 'ready' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-lg font-semibold text-cyan-400">
                  Auto-launching in {countdown}...
                </span>
              </div>
            </motion.div>
          )}

          {status === 'launching' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
                <RefreshCw className="w-5 h-5 animate-spin inline mr-2" />
                <span className="text-lg font-semibold text-yellow-400">
                  Launching Nexus...
                </span>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              <div className="inline-block bg-green-500/20 backdrop-blur-sm rounded-full px-6 py-2 border border-green-500/30">
                <span className="text-lg font-semibold text-green-400">
                  ✓ Nexus Launched Successfully!
                </span>
              </div>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              <div className="inline-block bg-red-500/20 backdrop-blur-sm rounded-full px-6 py-2 border border-red-500/30">
                <AlertCircle className="w-5 h-5 inline mr-2 text-red-400" />
                <span className="text-lg font-semibold text-red-400">
                  Launch Failed
                </span>
              </div>
              {errorMessage && (
                <p className="text-sm text-red-300 mt-2 max-w-md mx-auto">
                  {errorMessage}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10 hover:bg-white/10 transition-colors"
            >
              <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
              <p className="text-sm text-gray-300">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-y-4"
        >
          {status === 'ready' && (
            <>
              <button
                onClick={openNexus}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Launch Nexus</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              <p className="text-sm text-gray-400">
                Auto-launching in {countdown} seconds... or press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">C</kbd> to launch now
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              <button
                onClick={restartLauncher}
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                <span className="relative z-10">Retry Launch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              <p className="text-sm text-gray-400">
                Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">R</kbd> to retry
              </p>
            </>
          )}

          {status === 'launching' && (
            <div className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-full">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8 text-xs text-gray-500"
        >
          <p>Local • Private • No Downloads Required</p>
          <p className="mt-1">Press F5 to refresh if issues persist</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Launcher;