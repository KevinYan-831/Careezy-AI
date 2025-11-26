
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Clock, Filter, Building2, ArrowLeft, Bookmark, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface Internship {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  created: string;
  category: { label: string };
  contract_time?: string; // full_time, part_time
}

export const Internships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('New York');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Mock state for user interactions
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: internships, isLoading, error } = useQuery({
    queryKey: ['internships', debouncedSearch, location],
    queryFn: async () => {
      // Default to "intern" if no search term
      const query = debouncedSearch || 'intern';
      const results = await api.internships.search(query, location);
      return results;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const toggleJobType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(prev => prev.filter(jobId => jobId !== id));
      toast.success('Removed from saved jobs');
    } else {
      setSavedJobs(prev => [...prev, id]);
      toast.success('Job saved!');
    }
  };

  const handleApply = (url: string) => {
    window.open(url, '_blank');
    toast.success('Redirecting to application...');
  };

  // Client-side filtering for job types
  const allInternships = internships?.results || [];
  
  const filteredInternships = selectedTypes.length > 0
    ? allInternships.filter((job: Internship) => {
        const contractType = job.contract_time?.toLowerCase().replace('_', '-') || '';
        return selectedTypes.some(type => {
          const typeLC = type.toLowerCase();
          if (typeLC === 'full-time') return contractType.includes('full');
          if (typeLC === 'part-time') return contractType.includes('part');
          if (typeLC === 'contract') return contractType.includes('contract');
          if (typeLC === 'permanent') return contractType.includes('permanent');
          return false;
        });
      })
    : allInternships;

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
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <>Found <span className="font-bold text-slate-900">{filteredInternships.length}</span> matches for you</>
            )}
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
                    {['Full-time', 'Part-time', 'Contract', 'Permanent'].map(type => (
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
                <button
                  onClick={() => { setSelectedTypes([]); setSearchTerm(''); }}
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
            <div className="space-y-3">
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
              <div className="relative group">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Location (e.g., New York, San Francisco)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <p className="text-red-500">Failed to load internships. Please try again.</p>
                </div>
              ) : filteredInternships.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No matches found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                filteredInternships.map((job: Internship) => {
                  const isSaved = savedJobs.includes(job.id);

                  return (
                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-teal-100 transition-all duration-200 flex flex-col md:flex-row gap-6 relative overflow-hidden group">

                      {/* Logo Placeholder */}
                      <div className={`w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-2xl shrink-0 shadow-sm transform group-hover:scale-105 transition-transform`}>
                        <Building2 className="w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-slate-600 font-medium mb-3">
                          <Building2 className="w-4 h-4" /> {job.company.display_name}
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                            <MapPin className="w-3 h-3" /> {job.location.display_name}
                          </span>
                          {job.contract_time && (
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                              <Briefcase className="w-3 h-3" /> {job.contract_time.replace('_', '-')}
                            </span>
                          )}
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" /> {new Date(job.created).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                          {job.description.replace(/<[^>]*>?/gm, '')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col justify-center gap-2 shrink-0">
                        <button
                          onClick={() => handleApply(job.redirect_url)}
                          className="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm hover:shadow active:scale-95"
                        >
                          Apply Now
                        </button>

                        <button
                          onClick={() => handleSave(job.id)}
                          className={`px-6 py-2.5 border font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 ${isSaved
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
