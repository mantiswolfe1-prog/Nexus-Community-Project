import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { createPageUrl } from 'utils';
import { session, storage } from './Components/Storage/clientStorage.js';
import KeyboardHandler from './Components/UI/KeyboardHandler.js';
import WidgetsOverlay from './Components/Widgets/WidgetsOverlay.js';
import Sidebar from './Components/UI/Sidebar.js';

export default function Layout({ children, currentPageName }) {
  const [searchInput, setSearchInput] = useState('');
  const [searchMode, setSearchMode] = useState('browser'); // 'browser' or 'ai'
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(72);
  const [sessionId] = useState(() => {
    // Generate unique session ID
    const existing = sessionStorage.getItem('nexus_session_id');
    if (existing) return existing;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('nexus_session_id', newId);
    return newId;
  });
  
  // Monitor for admin kicks
  useEffect(() => {
    // Track user activity
    const handleActivity = () => {
      setLastActivity(Date.now());
    };
    
    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    const checkKickStatus = () => {
      try {
        const kickList = JSON.parse(localStorage.getItem('nexus_kick_list') || '[]');
        const kicked = kickList.find(k => k.sessionId === sessionId);
        
        if (kicked) {
          // User has been kicked - crash the page
          localStorage.removeItem('nexus_kick_list');
          sessionStorage.clear();
          // Force crash by throwing error and redirecting
          setTimeout(() => {
            throw new Error('Session terminated by administrator');
          }, 100);
          window.location.href = 'about:blank';
        }
      } catch (err) {
        console.error('Kick check failed:', err);
      }
    };
    
    const checkBanStatus = () => {
      try {
        const accessCode = session.getAccessCode();
        if (!accessCode) return;
        
        // Check if user got banned during their session
        if (storage.isBanned(accessCode)) {
          const banInfo = storage.getBanInfo(accessCode);
          let message = 'Your account has been banned.';
          if (banInfo && !banInfo.isPermanent) {
            const minutesLeft = Math.ceil(banInfo.timeRemaining / 60000);
            message = `Your account has been temporarily banned. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`;
          }
          
          alert(message);
          session.clear();
          sessionStorage.clear();
          window.location.href = createPageUrl('Landing');
        }
      } catch (err) {
        console.error('Ban check failed:', err);
      }
    };

    // Update heartbeat for active sessions tracking
    const updateHeartbeat = () => {
      try {
        const sessions = JSON.parse(localStorage.getItem('nexus_active_sessions') || '[]');
        const email = localStorage.getItem('nexus_user_email') || sessionStorage.getItem('nexus_user_email') || 'Anonymous';
        const role = sessionStorage.getItem('nexus_role') || 'guest';
        
        // Remove old session entries for this sessionId
        const filtered = sessions.filter(s => s.sessionId !== sessionId);
        
        // Add current session with role
        filtered.push({
          sessionId,
          email,
          role,
          lastSeen: Date.now()
        });
        
        // Keep only last 50 sessions
        const recent = filtered.slice(-50);
        localStorage.setItem('nexus_active_sessions', JSON.stringify(recent));
      } catch (err) {
        console.error('Heartbeat failed:', err);
      }
    };

    // Check for session timeout (30 minutes of inactivity)
    const checkTimeout = () => {
      const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
      const inactive = Date.now() - lastActivity;
      
      if (inactive > TIMEOUT_DURATION) {
        alert('Your session has expired due to inactivity. Please login again.');
        session.clear();
        sessionStorage.clear();
        navigate(createPageUrl('Landing'));
      }
    };

    // Check for kicks every second
    const kickInterval = setInterval(checkKickStatus, 1000);
    
    // Check for bans every 5 seconds
    const banInterval = setInterval(checkBanStatus, 5000);
    
    // Check for timeout every 60 seconds
    const timeoutInterval = setInterval(checkTimeout, 60000);
    
    // Update heartbeat every 10 seconds
    updateHeartbeat();
    const heartbeatInterval = setInterval(updateHeartbeat, 10000);
    
    return () => {
      clearInterval(kickInterval);
      clearInterval(banInterval);
      clearInterval(timeoutInterval);
      clearInterval(heartbeatInterval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [sessionId, lastActivity, navigate]);
  
  // Don't show search bar on Browser or StudyTools page
  const isBrowserPage = location.pathname.includes('/browser');
  const isStudyToolsPage = location.pathname.includes('/study');
  const isLandingPage = location.pathname.includes('/landing') || location.pathname === '/';
  const isAuthPage = location.pathname.includes('/auth');
  const isConsentPage = location.pathname.includes('/consent');
  const shouldHideUI = isLandingPage || isAuthPage || isConsentPage;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (searchMode === 'browser') {
        navigate(createPageUrl('Browser'), { state: { url: searchInput.trim() } });
      } else {
        // Navigate to StudyTools with AI query
        navigate(createPageUrl('StudyTools'), { state: { aiQuery: searchInput.trim() } });
      }
      setSearchInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" style={{ paddingLeft: shouldHideUI ? 0 : sidebarWidth }}>
      {/* Global Keyboard Shortcuts Handler */}
      {!shouldHideUI && <KeyboardHandler />}
      {/* Opera-style Sidebar */}
      {!shouldHideUI && <Sidebar onWidthChange={setSidebarWidth} />}
      {/* Sidebar Widgets Overlay (only when not docked) */}
      {!shouldHideUI && <WidgetsOverlay />}
      
      {/* Universal Search Bar */}
      {!shouldHideUI && !isBrowserPage && !isStudyToolsPage && (
        <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex items-center gap-2">
              {/* Mode Toggle */}
              <button
                type="button"
                onClick={() => setSearchMode(searchMode === 'browser' ? 'ai' : 'browser')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  searchMode === 'ai' 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}
                title={`Switch to ${searchMode === 'browser' ? 'AI' : 'Browser'} mode`}
              >
                {searchMode === 'browser' ? (
                  <Search className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span className="text-sm font-medium hidden sm:inline">
                  {searchMode === 'browser' ? 'Browser' : 'AI'}
                </span>
              </button>
              
              {/* Search Input */}
              <div className="relative flex-1">
                {searchMode === 'browser' ? (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/50" />
                ) : (
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
                )}
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    searchMode === 'browser' 
                      ? "Search or enter URL..." 
                      : "Ask AI anything..."
                  }
                  className={`w-full pl-10 pr-4 py-2 bg-white/5 border rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    searchMode === 'ai'
                      ? 'border-purple-500/30 focus:ring-purple-500/50'
                      : 'border-cyan-500/30 focus:ring-cyan-500/50'
                  }`}
                />
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        :root {
          --background: 0 0% 3.9%;
          --foreground: 0 0% 98%;
          --card: 0 0% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 0 0% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 0 0% 98%;
          --primary-foreground: 0 0% 9%;
          --secondary: 0 0% 14.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 0 0% 14.9%;
          --muted-foreground: 0 0% 63.9%;
          --accent: 0 0% 14.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 14.9%;
          --input: 0 0% 14.9%;
          --ring: 0 0% 83.1%;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }

        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        body {
          background: #0a0a0f;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      {children}
    </div>
  );
}