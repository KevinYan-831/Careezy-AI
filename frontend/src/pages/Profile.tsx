import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { GraduationCap, Briefcase, User, Calendar, ArrowRight, Save, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { updateProfile, user, profile } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        university: '',
        major: '',
        graduation_year: '',
        target_role: '',
        bio: ''
    });
    const [initialData, setInitialData] = useState({
        university: '',
        major: '',
        graduation_year: '',
        target_role: '',
        bio: ''
    });

    useEffect(() => {
        if (profile) {
            const data = {
                university: profile.university || '',
                major: profile.major || '',
                graduation_year: profile.graduation_year || '',
                target_role: profile.target_role || '',
                bio: profile.bio || ''
            };
            setFormData(data);
            setInitialData(data);
        }
    }, [profile]);

    useEffect(() => {
        // Check if form data has changed
        const changed = JSON.stringify(formData) !== JSON.stringify(initialData);
        setHasChanges(changed);
    }, [formData, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSaveSuccess(false);

        try {
            await updateProfile(formData);
            setInitialData(formData); // Update initial data to reflect saved state
            setHasChanges(false);
            setSaveSuccess(true);
            toast.success('Profile updated successfully!', {
                icon: '✅',
                duration: 3000,
            });

            // Clear success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error: any) {
            console.error('Error updating profile:', error);

            let errorMessage = 'Failed to update profile. Please try again.';
            if (error.message?.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message?.includes('401')) {
                errorMessage = 'Your session has expired. Please log in again.';
            }

            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 4000,
                icon: '⚠️',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500">Please sign in to continue.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in relative">
                <Link to="/dashboard" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                        saveSuccess ? 'bg-green-100' : 'bg-teal-100'
                    }`}>
                        {saveSuccess ? (
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        ) : (
                            <User className="w-8 h-8 text-teal-600" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
                    <p className="text-slate-500 mt-2">
                        {saveSuccess ? 'Profile saved successfully!' : 'Update your personal information.'}
                    </p>
                    {hasChanges && !saveSuccess && (
                        <div className="mt-3 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>You have unsaved changes</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> University / School
                        </label>
                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            placeholder="e.g. Northwestern University"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Major
                        </label>
                        <input
                            type="text"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Graduation Year
                        </label>
                        <input
                            type="text"
                            name="graduation_year"
                            value={formData.graduation_year}
                            onChange={handleChange}
                            placeholder="e.g. 2025"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" /> Target Role
                        </label>
                        <input
                            type="text"
                            name="target_role"
                            value={formData.target_role}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a little about your career goals..."
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">Error saving profile</p>
                                <p className="text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !hasChanges}
                        className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                            saveSuccess
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-teal-600 hover:bg-teal-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={!hasChanges ? 'No changes to save' : ''}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : saveSuccess ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
