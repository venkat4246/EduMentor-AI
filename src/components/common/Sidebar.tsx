import React from "react";
import {
  LayoutDashboard,
  BotMessageSquare,
  SearchCode,
  FileText,
  Compass,
  CalendarCheck2,
  Briefcase,
  GraduationCap,
  TrendingUp,
  BarChart3,
  History,
  Settings,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  X,
  Clock,
  User,
} from "lucide-react";
import { ActiveView, UserProfile } from "../../types";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  user: UserProfile;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  user,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "chat", label: "AI Assistant", icon: BotMessageSquare, badge: "Gemini 3.8" },
    { id: "research", label: "Deep Research", icon: SearchCode, badge: "Pro" },
    { id: "pdf", label: "PDF Analyzer", icon: FileText },
    { id: "resources", label: "Learning Resources", icon: BookOpen },
    { id: "planner", label: "Study Planner", icon: CalendarCheck2 },
    { id: "career", label: "Career Guidance", icon: Briefcase },
    { id: "quiz", label: "Quiz Generator", icon: GraduationCap },
    { id: "progress", label: "Progress Tracker", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "history", label: "Research History", icon: History },
    { id: "profile", label: "Academic Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 select-none">
      {/* Sidebar Header & Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Workspace
              </span>
              <p className="text-[11px] text-slate-600 font-medium truncate max-w-[140px]">
                {user.university}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto p-1.5 rounded-lg bg-slate-100 text-blue-600 border border-slate-200">
            <Sparkles className="w-4 h-4" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Streak & Hours Mini-Card (when expanded) */}
      {!isCollapsed && (
        <div className="p-3 mx-3 my-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700">
                {user.studyStreakDays} Day Streak
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{user.totalStudyHours}h studied</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (user.studyStreakDays / 30) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-900"
                }`}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Pill */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <button
              id="sidebar-profile-btn"
              type="button"
              onClick={() => handleNavClick("profile")}
              className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </button>
            <button
              onClick={() => handleNavClick("settings")}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => handleNavClick("profile")}
              className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform shadow-sm"
              title={user.name}
            >
              {user.name.charAt(0)}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 shrink-0 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{content}</div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
