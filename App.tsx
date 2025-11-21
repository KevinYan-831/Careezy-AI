
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { Internships } from './pages/Internships';
import { CareerCoach } from './pages/CareerCoach';
import { Features } from './pages/Features';
import { Templates } from './pages/Templates';
import { Pricing } from './pages/Pricing';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/coach" element={<CareerCoach />} />
      </Routes>
    </Router>
  );
}