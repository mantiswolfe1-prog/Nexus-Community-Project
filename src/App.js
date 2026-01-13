import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './PagesDisplay/Landing.js';
import Consent from './PagesDisplay/Consent.js';
import Auth from './PagesDisplay/Auth.js';
import RegularDashboard from './PagesDisplay/RegularDashboard.js';
import AdminDashboard from './PagesDisplay/AdminDashboard.js';
import Settings from './PagesDisplay/Settings.js';
import Games from './PagesDisplay/Games.js';
import StudyTools from './PagesDisplay/StudyTools.js';
import Music from './PagesDisplay/Music.js';
import Videos from './PagesDisplay/Videos.js';
import Browser from './PagesDisplay/Browser.js';
import Social from './PagesDisplay/Social.js';
import Utilities from './PagesDisplay/Utilities.js';
import Backgrounds from './PagesDisplay/Backgrounds.js';
import Privacy from './PagesDisplay/Privacy.js';
import Launcher from './PagesDisplay/Launcher';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/launcher" element={<Launcher />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<RegularDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/games" element={<Games />} />
          <Route path="/studytools" element={<StudyTools />} />
          <Route path="/music" element={<Music />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/browser" element={<Browser />} />
          <Route path="/social" element={<Social />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/backgrounds" element={<Backgrounds />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;