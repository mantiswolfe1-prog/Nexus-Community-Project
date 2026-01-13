import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './PagesDisplay/Landing';
import Consent from './PagesDisplay/Consent';
import Auth from './PagesDisplay/Auth';
import RegularDashboard from './PagesDisplay/RegularDashboard';
import AdminDashboard from './PagesDisplay/AdminDashboard';
import Settings from './PagesDisplay/Settings';
import Games from './PagesDisplay/Games';
import StudyTools from './PagesDisplay/StudyTools';
import Music from './PagesDisplay/Music';
import Videos from './PagesDisplay/Videos';
import Browser from './PagesDisplay/Browser';
import Social from './PagesDisplay/Social';
import Utilities from './PagesDisplay/Utilities';
import Backgrounds from './PagesDisplay/Backgrounds';
import Privacy from './PagesDisplay/Privacy';
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