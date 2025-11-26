
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Sparkles, Plus, Trash2, Save, Briefcase, GraduationCap, Check } from 'lucide-react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../services/api';
import { JakeTemplate } from '../components/resume-templates/JakeTemplate';

// Types for our resume data
interface Experience {
  id: number;
  role: string;
  company: string;
  date: string;
  description: string;
}

interface Education {
  id: number;
  degree: string;
  school: string;
  date: string;
  description: string;
}

export const ResumeBuilder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams(); // Get ID from URL if present
  const navigate = useNavigate();
  const templateId = searchParams.get('template');
  const [activeSection, setActiveSection] = useState('personal');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(id || null);

  const [resumeData, setResumeData] = useState({
    fullName: 'Alex Student',
    title: 'Aspiring Software Engineer',
    email: 'alex@university.edu',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Passionate computer science student with a strong foundation in web development technologies. Eager to launch a career as a Junior Software Engineer.',
    experience: [
      { id: 1, role: 'Frontend Intern', company: 'TechStart Inc.', date: 'Jun 2024 - Aug 2024', description: 'Implemented responsive UI components using React and Tailwind CSS. Improved page load speed by 20%.' }
    ] as Experience[],
    education: [
      { id: 1, degree: 'B.S. Computer Science', school: 'State University', date: '2022 - 2026', description: 'GPA: 3.8/4.0. Dean\'s List.' }
    ] as Education[],
    projects: [
      { id: 1, name: 'Project Name', technologies: 'React, Node.js', date: 'Jan 2024', description: 'Description of the project.' }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'TailwindCSS', 'Git']
  });

  // Fetch resume if editing
  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          const data = await api.resumes.get(id);
          // Assuming data.content holds the resume fields
          if (data && data.content) {
            setResumeData(data.content);
          }
        } catch (error) {
          console.error('Error fetching resume:', error);
          toast.error('Failed to load resume');
        }
      };
      fetchResume();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setResumeData({ ...resumeData, [field]: e.target.value });
  };

  // Experience Handlers
  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      role: 'New Role',
      company: 'Company Name',
      date: 'Date Range',
      description: 'Description of your responsibilities and achievements.'
    };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] });
    toast.success('New experience added');
  };

  const updateExperience = (id: number, field: keyof Experience, value: string) => {
    const updatedExp = resumeData.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setResumeData({ ...resumeData, experience: updatedExp });
  };

  const removeExperience = (id: number) => {
    setResumeData({ ...resumeData, experience: resumeData.experience.filter(exp => exp.id !== id) });
    toast.success('Experience removed');
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: 'Degree / Major',
      school: 'University Name',
      date: 'Year',
      description: 'GPA, Honors, etc.'
    };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] });
    toast.success('Education added');
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    const updatedEdu = resumeData.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setResumeData({ ...resumeData, education: updatedEdu });
  };

  const removeEducation = (id: number) => {
    setResumeData({ ...resumeData, education: resumeData.education.filter(edu => edu.id !== id) });
    toast.success('Education removed');
  };

  // Projects Handlers
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: 'Project Name',
      technologies: 'Tech Stack',
      date: 'Date',
      description: 'Description'
    };
    setResumeData({ ...resumeData, projects: [...resumeData.projects, newProject] });
    toast.success('Project added');
  };

  const updateProject = (id: number, field: string, value: string) => {
    const updatedProjects = resumeData.projects.map(proj =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    setResumeData({ ...resumeData, projects: updatedProjects });
  };

  const removeProject = (id: number) => {
    setResumeData({ ...resumeData, projects: resumeData.projects.filter(proj => proj.id !== id) });
    toast.success('Project removed');
  };

  // Skills Handlers
  const updateSkills = (value: string) => {
    setResumeData({ ...resumeData, skills: value.split(',').map(s => s.trim()) });
  };

  // AI Features
  const handleAiImprove = async () => {
    setIsAiLoading(true);
    try {
      const resumeContent = `
        Name: ${resumeData.fullName}
        Title: ${resumeData.title}
        Summary: ${resumeData.summary}
        Experience: ${resumeData.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n')}
        Education: ${resumeData.education.map(e => `${e.degree} at ${e.school}: ${e.description}`).join('\n')}
        Projects: ${resumeData.projects.map(p => `${p.name} (${p.technologies}): ${p.description}`).join('\n')}
        Skills: ${resumeData.skills.join(', ')}
      `;

      const { suggestions } = await api.resumes.getSuggestions(resumeContent);

      if (typeof suggestions === 'string') {
        setResumeData(prev => ({
          ...prev,
          summary: suggestions
        }));
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
            <Sparkles className="w-4 h-4" />
            <span>AI enhanced your summary!</span>
          </div>
        ), { duration: 3000 });
      } else {
        toast.success("AI suggestions received (check console)");
        console.log(suggestions);
      }
    } catch (error: any) {
      console.error('AI Improve Error:', error);

      let errorMessage = 'Failed to get AI suggestions';
      if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message?.includes('401')) {
        errorMessage = 'Session expired - please log in again';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Server error - please try again later';
      }

      toast.error(errorMessage, {
        duration: 4000,
        icon: '⚠️',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = async () => {
    const loadingToast = toast.loading('Saving resume...');
    try {
      if (currentResumeId) {
        console.log('Updating resume:', currentResumeId);
        const response = await api.resumes.update(currentResumeId, resumeData);
        console.log('Update response:', response);
        toast.success('Resume updated successfully!', { id: loadingToast, icon: '✅', duration: 3000 });
      } else {
        console.log('Creating new resume');
        const response = await api.resumes.create(resumeData);
        console.log('Create response:', response);
        if (response && response.resume && response.resume.id) {
          setCurrentResumeId(response.resume.id);
          toast.success('Resume created successfully!', { id: loadingToast, icon: '✅', duration: 3000 });
        } else {
          toast.success('Resume saved!', { id: loadingToast, icon: '✅', duration: 3000 });
        }
      }
    } catch (error: any) {
      console.error('Save Resume Error:', error);

      let errorMessage = 'Failed to save resume';
      if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message?.includes('401') || error.message?.includes('update resume') || error.message?.includes('create resume')) {
        errorMessage = 'Please log in to save your resume';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Server error - please try again later';
      }

      toast.dismiss(loadingToast);
      toast.error(errorMessage, { icon: '⚠️', duration: 4000 });
    }
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col h-screen overflow-hidden">
      <Toaster position="bottom-center" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center z-20 shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <input
              type="text"
              defaultValue="Software Engineering Resume"
              className="font-semibold text-slate-700 bg-transparent border-none focus:ring-0 hover:bg-slate-50 px-2 py-1 rounded cursor-pointer"
            />
          </div>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-medium">Draft</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAiImprove}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isAiLoading ? 'AI is analyzing your resume...' : 'Use AI to improve your resume'}
          >
            {isAiLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-teal-700 border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI Improve</span>
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-1/2 bg-white border-r border-slate-200 flex flex-col print:hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
            {['personal', 'experience', 'education', 'projects', 'skills'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${activeSection === tab
                  ? 'border-teal-600 text-teal-600 bg-teal-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {activeSection === 'personal' && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Personal Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.fullName}
                        onChange={(e) => handleInputChange(e, 'fullName')}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Job Title</label>
                      <input
                        type="text"
                        value={resumeData.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                      <input
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                      <input
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => handleInputChange(e, 'phone')}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Location</label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={(e) => handleInputChange(e, 'location')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Professional Summary</label>
                    <textarea
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => handleInputChange(e, 'summary')}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                    <div className="flex justify-between text-xs text-slate-400 pt-1">
                      <span>Write 2-4 sentences highlighting your key achievements.</span>
                      <button onClick={handleAiImprove} className="text-teal-600 font-medium hover:underline flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Generate with AI
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'experience' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-slate-900">Work Experience</h2>
                    <button
                      onClick={addExperience}
                      className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Position
                    </button>
                  </div>

                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Role</label>
                          <input
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            className="w-full font-semibold bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Company</label>
                          <input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date Range</label>
                        <input
                          value={exp.date}
                          onChange={(e) => updateExperience(exp.id, 'date', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  {resumeData.experience.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                      No experience added yet.
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'education' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-slate-900">Education</h2>
                    <button
                      onClick={addEducation}
                      className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Education
                    </button>
                  </div>

                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Degree</label>
                          <input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="w-full font-semibold bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">School</label>
                          <input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date Range</label>
                        <input
                          value={edu.date}
                          onChange={(e) => updateEducation(edu.id, 'date', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Details (GPA, Honors)</label>
                        <textarea
                          value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'projects' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-slate-900">Projects</h2>
                    <button
                      onClick={addProject}
                      className="text-sm font-medium text-teal-600 hover:bg-teal-50 px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  </div>

                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Project Name</label>
                          <input
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            className="w-full font-semibold bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Technologies</label>
                          <input
                            value={proj.technologies}
                            onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                        <input
                          value={proj.date}
                          onChange={(e) => updateProject(proj.id, 'date', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                        <textarea
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="space-y-4 animate-fade-in">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Skills</h2>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Skills (Comma separated)</label>
                    <textarea
                      rows={4}
                      value={resumeData.skills.join(', ')}
                      onChange={(e) => updateSkills(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-slate-400">
                      Example: React, TypeScript, Project Management, Public Speaking
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {resumeData.skills.map((skill, i) => (
                      skill.trim() && (
                        <span key={i} className="text-sm font-medium bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
                          {skill}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-full md:w-1/2 bg-slate-200/50 overflow-y-auto flex justify-center p-8 print:w-full print:p-0 print:bg-white">
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none transition-all transform origin-top scale-[0.8] sm:scale-90 md:scale-95 lg:scale-100 print:scale-100 print:m-0">
            {templateId === 'jake' ? (
              <JakeTemplate
                data={{
                  personalInfo: {
                    fullName: resumeData.fullName,
                    email: resumeData.email,
                    phone: resumeData.phone,
                    linkedin: 'linkedin.com/in/alex', // Placeholder or add field
                    github: 'github.com/alex', // Placeholder or add field
                    website: 'alex.com' // Placeholder or add field
                  },
                  education: resumeData.education.map(edu => ({
                    school: edu.school,
                    degree: edu.degree,
                    location: 'Location', // Placeholder or add field
                    date: edu.date
                  })),
                  experience: resumeData.experience.map(exp => ({
                    company: exp.company,
                    title: exp.role,
                    location: 'Location', // Placeholder or add field
                    date: exp.date,
                    description: exp.description.split('. ').filter(Boolean).map(d => d.endsWith('.') ? d : d + '.')
                  })),
                  projects: resumeData.projects.map(proj => ({
                    name: proj.name,
                    technologies: proj.technologies,
                    date: proj.date,
                    description: proj.description.split('. ').filter(Boolean).map(d => d.endsWith('.') ? d : d + '.')
                  })),
                  skills: {
                    languages: resumeData.skills.join(', '),
                    frameworks: '',
                    tools: '',
                  }
                }}
              />
            ) : (
              <div className="p-12 h-full flex flex-col text-slate-800">
                {/* Resume Header */}
                <div className="border-b-2 border-slate-800 pb-6 mb-6">
                  <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900 mb-2">{resumeData.fullName}</h1>
                  <p className="text-xl text-slate-600 font-medium mb-4">{resumeData.title}</p>
                  <div className="flex gap-4 text-sm text-slate-500 flex-wrap">
                    <span>{resumeData.email}</span>
                    {resumeData.email && <span>•</span>}
                    <span>{resumeData.phone}</span>
                    {resumeData.phone && <span>•</span>}
                    <span>{resumeData.location}</span>
                  </div>
                </div>

                {/* Resume Content */}
                <div className="space-y-6">
                  {/* Summary */}
                  {resumeData.summary && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Professional Summary</h3>
                      <p className="text-sm leading-relaxed text-slate-700">{resumeData.summary}</p>
                    </section>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Experience</h3>
                      <div className="space-y-4">
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-bold text-slate-800">{exp.role}</h4>
                              <span className="text-xs text-slate-500 font-medium">{exp.date}</span>
                            </div>
                            <div className="text-sm text-teal-700 font-medium mb-1">{exp.company}</div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Education</h3>
                      <div className="space-y-4">
                        {resumeData.education.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                              <span className="text-xs text-slate-500 font-medium">{edu.date}</span>
                            </div>
                            <div className="text-sm text-slate-700 mb-1">{edu.school}</div>
                            <p className="text-sm text-slate-600">{edu.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {resumeData.projects.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Projects</h3>
                      <div className="space-y-4">
                        {resumeData.projects.map((proj) => (
                          <div key={proj.id}>
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-bold text-slate-800">{proj.name}</h4>
                              <span className="text-xs text-slate-500 font-medium">{proj.date}</span>
                            </div>
                            <div className="text-sm text-teal-700 font-medium mb-1">{proj.technologies}</div>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && resumeData.skills[0] !== "" && (
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, i) => (
                          skill.trim() && (
                            <span key={i} className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded print:border print:border-slate-200">
                              {skill}
                            </span>
                          )
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
