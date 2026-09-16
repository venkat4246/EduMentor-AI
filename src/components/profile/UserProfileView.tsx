import React, { useState } from "react";
import {
  User,
  Building,
  GraduationCap,
  Calendar,
  Mail,
  Briefcase,
  Flame,
  Clock,
  CheckCircle2,
  Trophy,
  Save,
  LogOut,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { UserProfile } from "../../types";
import { authService, getFriendlyAuthError } from "../../services/auth";

interface UserProfileViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onOpenAuth,
  onNotify,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [university, setUniversity] = useState(user.college || user.university);
  const [major, setMajor] = useState(user.course || user.major);
  const [year, setYear] = useState(user.yearOfStudy || user.year);
  const [targetRole, setTargetRole] = useState(user.targetRole);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.isGuest) {
      onNotify("warning", "Guest Mode", "Please sign in or register to save custom profile updates to the cloud.");
      onOpenAuth();
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updated = await authService.updateProfile({
        name: name.trim(),
        university: university.trim(),
        college: university.trim(),
        major: major.trim(),
        course: major.trim(),
        year: year.trim(),
        yearOfStudy: year.trim(),
        targetRole: targetRole.trim(),
      });
      onUpdateUser(updated);
      setIsEditing(false);
      onNotify("success", "Profile Updated", "Your academic profile changes have been saved to Firestore.");
    } catch (err: any) {
      setError(getFriendlyAuthError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 font-['Outfit']">
            <User className="w-8 h-8 text-slate-900" />
            <span>Academic Profile</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your collegiate credentials, academic standing, and study progress metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.isGuest ? (
            <button
              id="profile-signin-btn"
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-medium shadow-xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          ) : (
            <button
              id="profile-logout-btn"
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Mode Banner if applicable */}
      {user.isGuest && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                You are currently exploring in Guest Mode
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Create a free student account to persistently save your study plans, quiz history, and research reports in Firestore across devices.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAuth}
            className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition"
          >
            Create Free Account
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold shadow-xs">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                {user.isGuest ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    Guest Mode
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Student
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            id="toggle-edit-profile-btn"
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition"
          >
            {isEditing ? "Cancel" : "Edit Academic Details"}
          </button>
        </div>

        {/* Academic Details Form / Display */}
        {isEditing ? (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Career Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="profile-target-role-input"
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  College / University
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="profile-college-input"
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Course / Branch
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="profile-course-input"
                    type="text"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Year of Study
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    id="profile-year-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-slate-400 cursor-pointer"
                  >
                    <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                    <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                    <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                    <option value="4th Year / Final Year (Senior)">4th Year / Final Year (Senior)</option>
                    <option value="Master's / Postgraduate">Master's / Postgraduate</option>
                    <option value="PhD / Doctoral Researcher">PhD / Doctoral Researcher</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-medium shadow-xs transition disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                College / University
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-700" />
                <span>{user.college || user.university}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Course / Branch
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-700" />
                <span>{user.course || user.major}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Year of Study
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-700" />
                <span>{user.yearOfStudy || user.year}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Target Role
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-700" />
                <span>{user.targetRole}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Member Since
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <span>{user.joinedDate}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cloud Sync Status
              </span>
              <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-2">
                {user.isGuest ? (
                  <span className="text-amber-600">Local Only (Guest)</span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Firestore Synchronized
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Academic Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Study Streak</span>
            <p className="text-2xl font-bold text-slate-900">{user.studyStreakDays} Days</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Hours Logged</span>
            <p className="text-2xl font-bold text-slate-900">{user.totalStudyHours} hrs</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Tasks Completed</span>
            <p className="text-2xl font-bold text-slate-900">{user.completedTasksCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Quiz Average</span>
            <p className="text-2xl font-bold text-slate-900">{user.averageQuizScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
