
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Layout } from 'lucide-react';

interface Template {
  id: number;
  name: string;
  category: string;
  color: string;
  image: string; // In a real app, these would be actual images
}

const TEMPLATES: Template[] = [
  { id: 1, name: "The Professional", category: "Traditional", color: "bg-slate-200", image: "Simple layout with header and columns" },
  { id: 2, name: "Modern Creative", category: "Creative", color: "bg-teal-100", image: "Bold header with sidebar" },
  { id: 3, name: "Tech Minimalist", category: "Tech", color: "bg-blue-100", image: "Monospace font accents" },
  { id: 4, name: "Executive", category: "Traditional", color: "bg-slate-300", image: "Dense information layout" },
  { id: 5, name: "Designer Portfolio", category: "Creative", color: "bg-purple-100", image: "Gallery style sections" },
  { id: 6, name: "Start-Up Ready", category: "Tech", color: "bg-green-100", image: "Clean and punchy" },
];

const CATEGORIES = ["All", "Traditional", "Creative", "Tech"];

export const Templates: React.FC = () => {
  const [filter, setFilter] = useState("All");

  const filteredTemplates = filter === "All" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === filter);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="bg-slate-50 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose your winning look</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Professionally designed, ATS-friendly templates that help you stand out from the pile.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, i) => (
            <div 
              key={template.id} 
              className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Mockup Preview */}
              <div className={`h-80 ${template.color} relative flex items-center justify-center p-8`}>
                <div className="w-full h-full bg-white shadow-sm rounded border border-slate-100/50 flex flex-col p-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {/* Skeleton Resume UI */}
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-300 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="mt-6 h-2 bg-teal-500/20 rounded w-1/3 mb-2"></div>
                  <div className="space-y-2">
                     <div className="h-1.5 bg-slate-200 rounded w-full"></div>
                     <div className="h-1.5 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
                
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                  <Link 
                    to="/resume" 
                    className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full transform scale-90 group-hover:scale-100 transition-all duration-200 shadow-lg"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{template.name}</h3>
                    <p className="text-sm text-slate-500">{template.category}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors">
                    <Layout className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
