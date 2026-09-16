import React from "react";
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  BotMessageSquare,
  SearchCode,
  FileText,
  CalendarCheck2,
  TrendingUp,
  Award,
  BookOpen,
  ArrowUpRight,
  Play,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { UserProfile, ActiveView, StudyPlan, QuizResult } from "../../types";

interface DashboardOverviewProps {
  user: UserProfile;
  studyPlan: StudyPlan;
  quizResults: QuizResult[];
  setActiveView: (view: ActiveView) => void;
  onQuickQuiz: () => void;
}

const WEEKLY_STUDY_DATA = [
  { day: "Mon", hours: 4.2 },
  { day: "Tue", hours: 5.0 },
  { day: "Wed", hours: 3.8 },
  { day: "Thu", hours: 6.1 },
  { day: "Fri", hours: 4.5 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 3.2 },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  studyPlan,
  quizResults,
  setActiveView,
  onQuickQuiz,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const priorityTasksList = Array.isArray(studyPlan?.priorityTasks) ? studyPlan.priorityTasks : [];
  const pendingTasks = priorityTasksList.filter((t) => !t.completed);

  const userName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner with Personalized Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Collegiate Semester Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit'] tracking-tight">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              You are currently on a <strong className="text-slate-900 font-bold">{user.studyStreakDays}-day streak</strong>! You have {pendingTasks.length} priority study items scheduled for today.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView("chat")}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={onQuickQuiz}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs transition-all flex items-center gap-2 active:scale-95 shadow-sm"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Start Quick Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Study Streak</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
            {user.studyStreakDays} <span className="text-sm font-medium text-slate-500">Days</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>Top 5% of active scholars</span>
          </div>
        </div>

        {/* Study Hours */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Study Hours</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
            {user.totalStudyHours} <span className="text-sm font-medium text-slate-500">Hours</span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            +4.5 hrs this week
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quiz Accuracy</span>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
              <Award className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
            {user.averageQuizScore}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {quizResults.length} quizzes completed
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Milestones Done</span>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
            {user.completedTasksCount} <span className="text-sm font-medium text-slate-500">Tasks</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            On track for finals
          </div>
        </div>
      </div>

      {/* Main Grid: Weekly Chart + Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Activity Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Weekly Focus Hours</h3>
              <p className="text-xs text-slate-500">Daily logged academic study & research time</p>
            </div>
            <button
              onClick={() => setActiveView("analytics")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_STUDY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(val: any) => [`${val} Hours`, "Studied"]}
                />
                <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Study Tasks */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">Upcoming Schedule</h3>
              <p className="text-xs text-slate-500">From your personalized study plan</p>
            </div>
            <button
              onClick={() => setActiveView("planner")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-56">
            {priorityTasksList.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  task.completed
                    ? "bg-slate-50/60 border-slate-200 opacity-60"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                    {task.subject}
                  </span>
                  <span className="text-[11px] text-slate-500">{task.durationMinutes}m</span>
                </div>
                <h4 className={`text-xs font-semibold ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {task.topic}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Feature Bento */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 font-['Outfit']">Quick Workspaces</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveView("chat")}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all text-left group hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              AI Tutor Chat
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ask coding, math, and STEM questions with instant code execution tips.
            </p>
          </button>

          <button
            onClick={() => setActiveView("research")}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all text-left group hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
              <SearchCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Deep Research
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Conduct verified academic syntheses with cited literature.
            </p>
          </button>

          <button
            onClick={() => setActiveView("pdf")}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all text-left group hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              PDF Analyzer
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload textbook chapters or lecture slides and chat with your document.
            </p>
          </button>

          <button
            onClick={() => setActiveView("career")}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all text-left group hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Career Guidance
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tailored roadmaps to top tech internships, project ideas, and resume tips.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
