import React, { useEffect, useState } from 'react';
import { CareezyLogo } from '../components/CareezyLogo';
import { FileText, Search, Bot, ArrowRight, Bell, User, Settings, LogOut, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { getSupabaseClient } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

const DashboardCard = ({ title, description, icon: Icon, colorClass, bgClass, to }: any) => (
  <Link to={to} className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
    <div className={`absolute top-0 right-0 w-32 h-32 ${bgClass} rounded-bl-full -mr-8 -mt-8 opacity-20 transition-transform duration-500 group-hover:scale-110`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 ${bgClass} ${colorClass} rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 line-clamp-2">{description}</p>
      <div className={`inline-flex items-center font-semibold ${colorClass}`}>
        Open Tool <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

export const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  // Calculate profile strength
  const calculateStrength = () => {
    if (!profile) return 0;
    let score = 20; // Base score for account
    if (profile.university) score += 20;
    if (profile.major) score += 20;
    if (profile.target_role) score += 20;
    if (profile.bio) score += 20;
    return score;
  };

  const strength = calculateStrength();
  const strengthLabel = strength >= 80 ? 'All-Star' : strength >= 60 ? 'Advanced' : strength >= 40 ? 'Intermediate' : 'Beginner';
  const strengthColor = strength >= 80 ? 'bg-green-100 text-green-700' : strength >= 60 ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';
  const strengthBarColor = strength >= 80 ? 'from-green-500 to-green-400' : strength >= 60 ? 'from-teal-500 to-teal-400' : 'from-amber-500 to-amber-400';

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return;
      try {
        const { data, error } = await getSupabaseClient()
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setResumes(data || []);
      } catch (err) {
        console.error('Error fetching resumes:', err);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <CareezyLogo className="h-8" />
          </Link>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-teal-600 transition-colors hover:bg-slate-50 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white shadow-sm"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900">{fullName}</div>
                <div className="text-xs text-slate-500">
                  {profile?.university ? `${profile.university}` : 'Free Plan'}
                </div>
              </div>
              <div className="relative group cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center text-teal-700 font-bold border border-teal-200 shadow-sm group-hover:shadow-md transition-all">
                  {initials}
                </div>
                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-50">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-fade-in">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">Edit Profile</Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">Settings</Link>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {fullName.split(' ')[0]}! 👋</h1>
          <p className="text-slate-600 mt-2 text-lg">Ready to take the next step in your career journey?</p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <DashboardCard
            to="/templates"
            title="Resume Builder"
            description="Create ATS-friendly resumes with professional templates and AI suggestions."
            icon={FileText}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
          />
          <DashboardCard
            to="/internships"
            title="Internship Matcher"
            description="Find the perfect role based on your major, skills, and interests."
            icon={Search}
            colorClass="text-teal-600"
            bgClass="bg-teal-50"
          />
          <DashboardCard
            to="/coach"
            title="AI Career Coach"
            description="Chat with our AI to prep for interviews and plan your career path."
            icon={Bot}
            colorClass="text-purple-600"
            bgClass="bg-purple-50"
          />
        </div>

        {/* Recent Activity / Quick Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-900">Recent Documents</h3>
              <Link to="/templates" className="text-sm text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors">Create New</Link>
            </div>
            <div className="space-y-4">
              {loadingResumes ? (
                <div className="text-center py-8 text-slate-400">Loading resumes...</div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p>No resumes yet.</p>
                  <Link to="/templates" className="text-teal-600 font-semibold hover:underline mt-2 inline-block">Create your first resume</Link>
                </div>
              ) : (
                resumes.map((resume) => (
                  <Link key={resume.id} to={`/resume/${resume.id}`} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-400 group-hover:text-teal-600 group-hover:border-teal-200 transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">{resume.title || 'Untitled Resume'}</div>
                        <div className="text-sm text-slate-500">Edited {formatDistanceToNow(new Date(resume.updated_at))} ago</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 text-slate-600">
                      Draft
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit sticky top-24">
            <h3 className="font-bold text-lg text-slate-900 mb-6">Profile Strength</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${strengthColor}`}>
                    {strengthLabel}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold inline-block text-teal-600">
                    {strength}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100">
                <div style={{ width: `${strength}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${strengthBarColor} rounded-full transition-all duration-500`}></div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {strength < 100
                ? "Complete your profile to unlock better internship matches and AI recommendations."
                : "Great job! Your profile is complete."}
            </p>
            <Link to="/profile" className="block w-full text-center py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-200">
              {strength < 100 ? "Complete Profile" : "Edit Profile"}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
