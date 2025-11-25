import React from 'react';
import { Navbar } from '../components/Navbar';
import { LayoutTemplate, Briefcase, MessageSquare, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: LayoutTemplate,
      title: "Smart Resume Builder",
      description: "Create professional, ATS-friendly resumes in minutes. Our AI analyzes your content and suggests improvements to increase your chances of getting hired."
    },
    {
      icon: Briefcase,
      title: "Internship Matching",
      description: "Stop searching endlessly. We match you with internships that fit your skills, major, and career goals using data from top job boards."
    },
    {
      icon: MessageSquare,
      title: "AI Career Coach",
      description: "Get 24/7 career advice. Practice for interviews, get salary negotiation tips, and ask any career-related questions to your personal AI coach."
    },
    {
      icon: ShieldCheck,
      title: "ATS Optimization",
      description: "Ensure your resume gets past the Applicant Tracking Systems used by 99% of Fortune 500 companies."
    },
    {
      icon: Zap,
      title: "Real-time Feedback",
      description: "Get instant feedback on your resume content as you type, with suggestions for stronger action verbs and quantifiable achievements."
    },
    {
      icon: Sparkles,
      title: "Cover Letter Generator",
      description: "Generate tailored cover letters for each job application in seconds, highlighting why you're the perfect fit."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Everything you need to succeed
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful tools to help you navigate your career journey with confidence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
