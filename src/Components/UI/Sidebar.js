import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from 'utils';
import { useSettings } from '../../hooks/useSettings.js';
import { Home, Globe, Gamepad2, Brain, Settings as Cog, ChevronsLeft, ChevronsRight } from 'lucide-react';
import SpotifyWidget from '../Widgets/SpotifyWidget.js';
import YouTubeWidget from '../Widgets/YouTubeWidget.js';

export default function Sidebar({ onWidthChange }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [expanded, setExpanded] = useState(true);

  const width = expanded ? 260 : 72;

  useEffect(() => {
    onWidthChange?.(width);
  }, [width, onWidthChange]);

  const navItems = useMemo(() => ([
    { key: 'dashboard', label: 'Dashboard', icon: Home, to: 'Dashboard' },
    { key: 'browser', label: 'Browser', icon: Globe, to: 'Browser' },
    { key: 'games', label: 'Games', icon: Gamepad2, to: 'Games' },
    { key: 'study', label: 'Study Tools', icon: Brain, to: 'StudyTools' },
    { key: 'settings', label: 'Settings', icon: Cog, to: 'Settings' },
  ]), []);

  const showWidgets = settings.widgets?.enabled && settings.widgets?.dockInSidebar;

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 border-r border-white/10 bg-black/40 backdrop-blur-md"
      style={{ width }}
    >
      <div className="h-full flex flex-col">
        {/* Header / Toggle */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/10" />
            {expanded && <span className="text-white/70 text-sm">Nexus</span>}
          </div>
          <button
            className="p-2 rounded-lg hover:bg-white/10 text-white/70"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronsLeft className="w-5 h-5"/> : <ChevronsRight className="w-5 h-5"/>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-2">
          {navItems.map(({ key, label, icon: Icon, to }) => (
            <button
              key={key}
              onClick={() => navigate(createPageUrl(to))}
              className={`w-full flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center'} py-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors`}
            >
              <Icon className="w-5 h-5" />
              {expanded && <span className="text-sm">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Widgets */}
        {showWidgets && (
          <div className="mt-2 border-t border-white/10">
            <div className={`${expanded ? 'px-3' : 'px-2'} py-2 text-white/50 text-xs uppercase tracking-wide`}>Widgets</div>
            <div className={`${expanded ? 'px-3' : 'px-2'} space-y-3 pb-3`}>
              {settings.widgets.spotify && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  {expanded ? (
                    <SpotifyWidget />
                  ) : (
                    <div className="flex items-center justify-center text-green-400">
                      Spotify
                    </div>
                  )}
                </div>
              )}
              {settings.widgets.youtube && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  {expanded ? (
                    <YouTubeWidget />
                  ) : (
                    <div className="flex items-center justify-center text-red-400">
                      YouTube
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto p-3 text-white/40 text-xs">
          {expanded ? 'Opera-style sidebar • Always available' : 'Sidebar'}
        </div>
      </div>
    </aside>
  );
}
