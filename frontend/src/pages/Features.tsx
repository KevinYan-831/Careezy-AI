
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, Search, Bot, Layout, ShieldCheck, Zap, Globe } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-slate-50 pt-20 pb-16 text-center px-4">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Everything you need to build your <span className="text-teal-600">dream career</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Careezy isn't just a resume builder. It's a comprehensive career toolkit designed to take you from application to offer letter.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-24">
          
          {/* Resume Builder Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in-up delay-100">
            <div className="order-2 lg:order-1">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">AI-Powered Resume Builder</h2>
              <p className="text-lg text-slate-600 mb-6">
                Stop struggling with formatting. Our builder handles the design while AI helps you write compelling content.
              </p>
              <ul className="space-y-4">
                {[
                  "ATS-friendly templates approved by recruiters",
                  "Real-time content scoring and improvements",
                  "One-click PDF export",
                  "Drag-and-drop section reordering"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 bg-blue-50 rounded-2xl p-8 border border-blue-100 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-xl shadow-sm p-6 h-80 flex items-center justify-center text-slate-400">
                Interactive Resume Preview Mockup
              </div>
            </div>
          </div>

          {/* Job Matching Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in-up delay-200">
            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100 shadow-lg -rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="bg-white rounded-xl shadow-sm p-6 h-80 flex items-center justify-center text-slate-400">
                Job Matching Dashboard Mockup
              </div>
            </div>
            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Intelligent Job Matching</h2>
              <p className="text-lg text-slate-600 mb-6">
                Don't apply blindly. We analyze your profile against thousands of internships to find your perfect fit.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized match scores for every role",
                  "Filter by skills, location, and culture fit",
                  "Track applications and save favorites",
                  "Direct application links to company portals"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Career Coach Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in-up delay-300">
             <div className="order-2 lg:order-1">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">24/7 AI Career Coach</h2>
              <p className="text-lg text-slate-600 mb-6">
                Get instant answers to your career questions, prepare for interviews, and negotiate your salary.
              </p>
              <ul className="space-y-4">
                {[
                  "Mock interviews with real-time feedback",
                  "Salary negotiation scripts and data",
                  "Cover letter generation assistance",
                  "Career path planning based on market trends"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div className="order-1 lg:order-2 bg-purple-50 rounded-2xl p-8 border border-purple-100 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-xl shadow-sm p-6 h-80 flex items-center justify-center text-slate-400">
                Chat Interface Mockup
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 py-20 text-center px-4">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to accelerate your career?</h2>
          <p className="text-slate-400 text-lg mb-10">Join thousands of students and professionals who found their dream jobs using Careezy.</p>
          <Link 
            to="/dashboard"
            className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-full transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-teal-500/25"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </div>
  );
};
