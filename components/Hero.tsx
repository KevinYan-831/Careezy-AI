import React from 'react';
import { ArrowRight, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Subtitle with features */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-500 mb-6">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-600" /> ATS-friendly templates</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Real-time preview</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-600" /> AI insights</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-600" /> Export to PDF</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Your Career Journey <br />
              <span className="relative inline-block">
                Starts Here
                {/* Underline decoration */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-teal-500" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C58.5002 6.99997 145.501 4.99997 198 2.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              Build professional resumes, discover internships, and get AI-powered career guidance all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-royal-600 rounded-full shadow-lg hover:bg-royal-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-600"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all">
                View Templates
              </button>
            </div>
          </div>

          {/* Right Content - Visual Representation */}
          <div className="relative lg:ml-10">
            <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Mock Resume Header */}
              <div className="flex gap-6 mb-8 border-b border-slate-100 pb-6">
                <div className="w-20 h-20 bg-slate-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-teal-600 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
              
              {/* Mock Content Lines */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Badge - AI Analysis */}
              <div className="absolute -right-6 top-10 bg-white p-4 rounded-xl shadow-xl border border-teal-100 animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume Score</div>
                    <div className="text-xl font-bold text-slate-900">94/100</div>
                  </div>
                </div>
              </div>

               {/* Floating Badge - ATS */}
               <div className="absolute -left-6 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Format</div>
                    <div className="text-sm font-bold text-slate-900">ATS Optimized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};