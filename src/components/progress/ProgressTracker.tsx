import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
  Target,
} from "lucide-react";
import { UserProfile, StudyPlan, QuizResult } from "../../types";
import { storage } from "../../services/storage";

interface ProgressTrackerProps {
  user: UserProfile;
  studyPlan: StudyPlan;
  quizResults: QuizResult[];
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
  onUpdateUser: (u: UserProfile) => void;
}

const BADGES = [
  { id: "b1", title: "14-Day Streak", desc: "Studied consistently for two weeks", unlocked: true, icon: Flame },
  { id: "b2", title: "Algo Apprentice", desc: "Completed 20+ algorithm tasks", unlocked: true, icon: Zap },
  { id: "b3", title: "Deep Researcher", desc: "Synthesized academic research report", unlocked: true, icon: Sparkles },
  { id: "b4", title: "Quiz Master", desc: "Scored 100% on Advanced Quiz", unlocked: true, icon: Trophy },
  { id: "b5", title: "Century Club", desc: "Accumulate 100 study hours", unlocked: false, icon: Target },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  user,
  studyPlan,
  quizResults,
  onNotify,
  onUpdateUser,
}) => {
  // Focus Pomodoro Timer State (25 minutes = 1500 seconds)
  const [timerSeconds, setTimerSeconds] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      onNotify("success", "Focus Session Completed! 🎉", "25 minutes logged to your study hours.");
      // Add 0.4 hours
      const updated = storage.getUser();
      updated.totalStudyHours = Math.round((updated.totalStudyHours + 0.4) * 10) / 10;
      storage.saveUser(updated);
      onUpdateUser(updated);
      setTimerSeconds(1500);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, onNotify, onUpdateUser]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const subjectProgress = [
    { name: "Data Structures & Algorithms", pct: 85, color: "bg-slate-900" },
    { name: "Operating Systems & Concurrency", pct: 78, color: "bg-blue-600" },
    { name: "Computer Networks & Protocols", pct: 60, color: "bg-slate-700" },
    { name: "Linear Algebra & Discrete Math", pct: 70, color: "bg-slate-800" },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Collegiate Progress & Study Habits
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Real-time accountability metrics, active Pomodoro timer, and academic achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Focus Timer & Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Focus Station */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-blue-600">
              Focus Station
            </span>
            <span>25 / 5 Pomodoro</span>
          </div>

          <div className="my-4">
            <div className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight">
              {formatTime(timerSeconds)}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {timerActive ? "Deep work in session — eliminate distractions." : "Ready for next study sprint"}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xs">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                timerActive
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-slate-900 hover:bg-black text-white"
              }`}
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{timerActive ? "Pause Sprint" : "Start Sprint"}</span>
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                setTimerSeconds(1500);
              }}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subject Mastery Progress Bars */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Core Curriculum Mastery Breakdown</span>
          </h3>

          <div className="space-y-4">
            {subjectProgress.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{sub.name}</span>
                  <span className="font-mono text-slate-500">{sub.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div
                    className={`${sub.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${sub.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Milestone Badges */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-blue-600" />
          <span>Academic Milestones & Badges</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                  b.unlocked
                    ? "bg-slate-50/70 border-slate-200 shadow-xs"
                    : "bg-slate-50/30 border-slate-100 opacity-40 grayscale"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${
                    b.unlocked
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{b.title}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{b.desc}</p>
                <span className={`text-[10px] font-bold mt-2 ${b.unlocked ? "text-blue-600" : "text-slate-400"}`}>
                  {b.unlocked ? "✓ Unlocked" : "In Progress"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
