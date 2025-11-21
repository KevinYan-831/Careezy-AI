import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { LayoutTemplate, Briefcase, MessageSquare, ShieldCheck } from 'lucide-react';

const FeaturesSection = () => (
  <div className="bg-slate-50 py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to launch your career</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          From building the perfect resume to acing the interview, Careezy provides the AI-powered tools to help you succeed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: LayoutTemplate,
            title: "Smart Resume Builder",
            desc: "Choose from ATS-friendly templates and get AI suggestions to improve your content instantly."
          },
          {
            icon: Briefcase,
            title: "Internship Matching",
            desc: "Get personalized recommendations based on your skills, major, and career interests."
          },
          {
            icon: MessageSquare,
            title: "AI Career Coach",
            desc: "24/7 access to career advice, interview prep, and salary negotiation strategies."
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturesSection />
      
      {/* Footer Simple */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2025 Careezy Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-teal-600">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600">Terms of Service</a>
            <a href="#" className="hover:text-teal-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};