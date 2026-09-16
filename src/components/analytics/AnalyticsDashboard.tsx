import React from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { UserProfile, QuizResult, StudyPlan } from "../../types";

interface AnalyticsDashboardProps {
  user: UserProfile;
  quizResults: QuizResult[];
  studyPlan: StudyPlan;
}

const SUBJECT_HOURS_DATA = [
  { subject: "Data Struct.", hours: 16.5 },
  { subject: "Operating Sys.", hours: 14.0 },
  { subject: "Linear Algebra", hours: 9.5 },
  { subject: "Networks", hours: 8.5 },
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  user,
  quizResults,
  studyPlan,
}) => {
  const safeQuizResults = Array.isArray(quizResults) ? quizResults : [];
  const quizTrendData = safeQuizResults.map((q, idx) => ({
    name: `Quiz ${idx + 1}`,
    score: q.percentage,
    subject: q.subject,
  })).reverse();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Academic Analytics & Mastery Metrics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Quantitative trends across study hours, test recall accuracy, and subject distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hours by Subject */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Cumulative Hours by Subject</h3>
          <p className="text-xs text-slate-500 mb-4">Total time invested across major curriculum areas</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUBJECT_HOURS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} Hours`, "Logged Time"]}
                />
                <Bar dataKey="hours" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Progression */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Diagnostic Quiz Accuracy Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Percentage scores achieved across recent exams</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizTrendData.length ? quizTrendData : [{ name: "Q1", score: 80, subject: "Diagnostic" }, { name: "Q2", score: 100, subject: "Practice" }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val}%`, "Score"]}
                />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strengths & AI Diagnostic Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>High Retention & Strengths</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">AVL & Red-Black Balancing</strong>
              High accuracy in tree rotations and pointer manipulations.
            </li>
            <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Semaphore Primitives</strong>
              Solid conceptual grasp of binary vs. counting semaphores and mutexes.
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>AI Revision Recommendations</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">TCP Fast Retransmit Mechanics</strong>
              Spend 30 minutes tracing triple duplicate ACKs before your next networks quiz.
            </li>
            <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Negative Weight Cycle Edge Cases</strong>
              Review Bellman-Ford vs. Floyd-Warshall runtimes for dense vs. sparse graphs.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
