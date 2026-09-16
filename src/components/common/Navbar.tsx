import React from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Menu,
  GraduationCap,
  User,
  ShieldCheck,
  LogIn,
  BookOpen,
} from "lucide-react";
import { UserProfile, ActiveView } from "../../types";
import { LogOut } from "lucide-react";

interface NavbarProps {
  user: UserProfile;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onToggleMobileMenu: () => void;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  setActiveView,
  onToggleMobileMenu,
  onOpenAuthModal,
  onLogout,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {activeView !== "landing" && (
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setActiveView(activeView === "landing" ? "dashboard" : "landing")}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white shadow-sm transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                <Sparkles className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 font-['Outfit']">
                  EduMentor<span className="text-blue-600"> AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Personal AI Learning & Career Assistant
              </p>
            </div>
          </button>
        </div>

        {/* Center: Quick navigation links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "dashboard"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("chat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "chat"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveView("research")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "research"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            Deep Research
          </button>
          <button
            onClick={() => setActiveView("pdf")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "pdf"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            PDF Analyzer
          </button>
          <button
            onClick={() => setActiveView("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === "quiz"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            Quiz Generator
          </button>
        </div>

        {/* Right Actions: Theme, Guest Status, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Guest / Account Pill */}
          {user.isGuest ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Guest Mode
              </span>
              <button
                id="navbar-signin-btn"
                onClick={() => setActiveView("login")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black shadow-sm transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                id="navbar-register-btn"
                onClick={() => setActiveView("register")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-all active:scale-95 shadow-sm"
              >
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="navbar-profile-btn"
                onClick={() => setActiveView("profile")}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left group"
                title="View Academic Profile"
              >
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-black transition-colors leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">
                    {user.course || user.major}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </button>
              {onLogout && (
                <button
                  id="navbar-logout-btn"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
