
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, Filter, Building2, ArrowLeft, Bookmark, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  matchScore: number;
  logoColor: string;
  tags: string[];
}

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 1,
    title: "Frontend Engineering Intern",
    company: "TechFlow Solutions",
    location: "Remote",
    type: "Full-time",
    duration: "3 months",
    matchScore: 98,
    logoColor: "bg-blue-500",
    tags: ["React", "TypeScript", "UI/UX"]
  },
  {
    id: 2,
    title: "Product Design Intern",
    company: "Creative Cloud",
    location: "New York, NY",
    type: "Part-time",
    duration: "6 months",
    matchScore: 92,
    logoColor: "bg-purple-500",
    tags: ["Figma", "User Research", "Prototyping"]
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "Global Systems",
    location: "Austin, TX",
    type: "Full-time",
    duration: "Summer 2025",
    matchScore: 88,
    logoColor: "bg-green-500",
    tags: ["Java", "Python", "Backend"]
  },
  {
    id: 4,
    title: "Data Science Intern",
    company: "DataMinds",
    location: "San Francisco, CA",
    type: "Full-time",
    duration: "12 weeks",
    matchScore: 85,
    logoColor: "bg-red-500",
    tags: ["Python", "SQL", "Machine Learning"]
  },
  {
    id: 5,
    title: "Marketing Associate Intern",
    company: "Growth Inc.",
    location: "Chicago, IL",
    type: "Hybrid",
    duration: "Spring 2025",
    matchScore: 75,
    logoColor: "bg-orange-500",
    tags: ["Social Media", "Content", "SEO"]
  }
];

export const Internships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minMatchScore, setMinMatchScore] = useState(0);
  
  // Mock state for user interactions
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  const toggleJobType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = (id: number) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(prev => prev.filter(jobId => jobId !== id));
      toast.success('Removed from saved jobs');
    } else {
      setSavedJobs(prev => [...prev, id]);
      toast.success('Job saved!');
    }
  };

  const handleApply = (id: number) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs(prev => [...prev, id]);
      toast.success('Application submitted successfully!');
    }
  };

  const filteredInternships = MOCK_INTERNSHIPS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(job.type) || 
                        (selectedTypes.includes('Remote') && job.location === 'Remote');
    const matchesScore = job.matchScore >= minMatchScore;

    return matchesSearch && matchesType && matchesScore;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" />
      {/* Navbar Lite */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Internship Matcher</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Found <span className="font-bold text-slate-900">{filteredInternships.length}</span> matches for you
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Filters</h2>
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Job Type</label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Remote', 'Hybrid'].map(type => (
                      <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-teal-600 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleJobType(type)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" 
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">
                     Match Score ({minMatchScore}%+)
                   </label>
                   <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={minMatchScore}
                    onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                   />
                   <div className="flex justify-between text-xs text-slate-500 mt-1">
                     <span>0%</span>
                     <span>100%</span>
                   </div>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <button 
                  onClick={() => {setSelectedTypes([]); setMinMatchScore(0); setSearchTerm('');}}
                  className="w-full py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Main List */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by role, company, or keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-lg"
              />
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredInternships.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No matches found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                filteredInternships.map((job) => {
                  const isSaved = savedJobs.includes(job.id);
                  const isApplied = appliedJobs.includes(job.id);
                  
                  return (
                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-teal-100 transition-all duration-200 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                      {/* Match Badge */}
                      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold text-white ${job.matchScore >= 90 ? 'bg-teal-500' : job.matchScore >= 80 ? 'bg-blue-500' : 'bg-slate-500'}`}>
                        {job.matchScore}% Match
                      </div>

                      {/* Logo */}
                      <div className={`w-16 h-16 ${job.logoColor} rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-sm transform group-hover:scale-105 transition-transform`}>
                        {job.company.charAt(0)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-slate-600 font-medium mb-3">
                          <Building2 className="w-4 h-4" /> {job.company}
                        </div>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                            <Briefcase className="w-3 h-3" /> {job.type}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" /> {job.duration}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-100 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col justify-center gap-2 shrink-0">
                        {isApplied ? (
                           <button disabled className="px-6 py-2.5 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-default">
                             <CheckCircle className="w-4 h-4" /> Applied
                           </button>
                        ) : (
                          <button 
                            onClick={() => handleApply(job.id)}
                            className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm hover:shadow active:scale-95"
                          >
                            Apply Now
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleSave(job.id)}
                          className={`px-6 py-2.5 border font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 ${
                            isSaved 
                              ? 'border-teal-200 bg-teal-50 text-teal-700' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
