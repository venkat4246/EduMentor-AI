import React, { useState } from "react";
import {
  Settings,
  User,
  Building,
  GraduationCap,
  Briefcase,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Server,
} from "lucide-react";
import { UserProfile } from "../../types";
import { storage } from "../../services/storage";
import { authService } from "../../services/auth";

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
  onOpenAuthModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onNotify,
  onOpenAuthModal,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [university, setUniversity] = useState(user.university);
  const [major, setMajor] = useState(user.major);
  const [year, setYear] = useState(user.year);
  const [targetRole, setTargetRole] = useState(user.targetRole);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateProfile({
      name,
      email,
      university,
      major,
      year,
      targetRole,
    });
    onUpdateUser(updated);
    onNotify("success", "Profile updated successfully");
  };

  const handleExportData = () => {
    const data = storage.exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `edumentor-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("success", "Complete data backup downloaded");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset your local study data? This will restore factory defaults.")) {
      storage.resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Workspace & Scholar Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage collegiate credentials, academic profile, data persistence, and system connections.
            </p>
          </div>
        </div>

        {user.isGuest && (
          <button
            onClick={onOpenAuthModal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            Create Permanent Account
          </button>
        )}
      </div>

      {/* Profile Editor Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Academic Profile & Collegiate Information</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Major / Degree Track</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              >
                <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                <option value="4th Year (Senior)">4th Year (Senior)</option>
                <option value="Graduate / Master's">Graduate / Master's</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Tech Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* System Status & AI Engine */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          <span>AI Engine & Backend Runtime Architecture</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Gemini AI Model:</span>
            <span className="text-blue-600 font-bold font-mono">gemini-2.5-flash</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">API Key Security:</span>
            <span className="text-slate-900 font-bold">100% Server-Side Proxy</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Target Cloud Infrastructure:</span>
            <span className="text-slate-900 font-bold">Google Cloud Run</span>
          </div>
        </div>
      </div>

      {/* Data Backup & Reset */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Data Persistence & Backups</h3>
        <p className="text-xs text-slate-600 mb-4">
          Export your complete study plans, chat sessions, quiz scores, and research reports into an open JSON file.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export All Study Data (JSON)</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Reset Workspace to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
