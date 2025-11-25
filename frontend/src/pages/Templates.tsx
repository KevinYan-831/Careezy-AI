import React from 'react';
import { Navbar } from '../components/Navbar';
import { FileText, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const templates = [
  {
    id: 'jake',
    name: "Jake's Resume",
    description: 'A clean, ATS-friendly LaTeX-style template perfect for software engineers and technical roles.',
    image: '/images/jake-resume.png', // Using the local image
    features: ['ATS-Optimized', 'LaTeX Style', 'Clean Layout']
  }
];

export const Templates: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose from our collection of ATS-optimized templates designed to get you hired.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                  <Link
                    to={`/resume/new?template=${template.id}`}
                    className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-teal-50 transition-colors"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{template.description}</p>
                <div className="space-y-2">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-500">
                      <Check className="w-4 h-4 text-teal-600 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Link
                    to={`/resume/new?template=${template.id}`}
                    className="flex items-center justify-center w-full text-teal-600 font-semibold hover:text-teal-700 group-hover:gap-2 transition-all"
                  >
                    Create Resume <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">More Templates Coming Soon</h3>
            <p className="text-slate-500 max-w-xs">
              We are working on adding more professional templates. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
