import React, { useState } from "react";
import {
  CalendarCheck2,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Download,
  AlertTriangle,
  Coffee,
  Repeat,
  Layers,
} from "lucide-react";
import { StudyPlan, StudyTask } from "../../types";
import { api } from "../../services/api";
import { storage } from "../../services/storage";

interface StudyPlannerProps {
  studyPlan: StudyPlan;
  onUpdatePlan: (plan: StudyPlan) => void;
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  studyPlan,
  onUpdatePlan,
  onNotify,
}) => {
  const [goals, setGoals] = useState("Score an A in Operating Systems and Data Structures finals");
  const [subjects, setSubjects] = useState("Data Structures, Operating Systems, Computer Networks");
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(false);

  // New task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskSubject, setNewTaskSubject] = useState("Computer Science");
  const [newTaskTopic, setNewTaskTopic] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  const [newTaskDay, setNewTaskDay] = useState("Today");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("High");

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const subjectArray = subjects.split(",").map((s) => s.trim()).filter(Boolean);
      const generated = await api.generateStudyPlan({
        subjects: subjectArray,
        examDate: "Upcoming Midterms / Finals",
        dailyHours: Math.max(1, Math.round(hours / 7)),
        difficulty: "Intermediate",
        learningGoals: goals,
        availability: "Evenings and weekend mornings",
      });
      const newPlan: StudyPlan = {
        ...generated,
        id: "plan-" + Date.now(),
        createdAt: new Date().toISOString(),
      };
      storage.saveStudyPlan(newPlan);
      onUpdatePlan(newPlan);
      onNotify("success", "Personalized study plan created", "Schedule optimized for retention.");
    } catch (err: any) {
      onNotify("error", "Plan generation failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (task: StudyTask) => {
    const updated = !task.completed;
    storage.updateTask(task.id, { completed: updated });
    const plan = storage.getStudyPlan();
    onUpdatePlan(plan);

    // Update user completed task counter
    const user = storage.getUser();
    user.completedTasksCount += updated ? 1 : -1;
    if (user.completedTasksCount < 0) user.completedTasksCount = 0;
    storage.saveUser(user);

    onNotify(updated ? "success" : "info", updated ? "Task marked completed! 🎉" : "Task reopened");
  };

  const handleDeleteTask = (taskId: string) => {
    storage.deleteTask(taskId);
    const plan = storage.getStudyPlan();
    onUpdatePlan(plan);
    onNotify("info", "Task removed");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTopic.trim()) return;

    const newTask: StudyTask = {
      id: "tsk-" + Date.now(),
      day: newTaskDay,
      subject: newTaskSubject,
      topic: newTaskTopic.trim(),
      durationMinutes: newTaskDuration,
      priority: newTaskPriority,
      completed: false,
    };

    storage.addTask(newTask);
    const plan = storage.getStudyPlan();
    onUpdatePlan(plan);
    setShowAddModal(false);
    setNewTaskTopic("");
    onNotify("success", "Custom study task added");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              AI Collegiate Study Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Balanced academic scheduling with spaced repetition and active recall blocks.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Generator Configuration Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Calibrate Your Study Engine</span>
        </h3>

        <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Goals</label>
            <input
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g. Master dynamic programming, score 90% in OS"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subjects (comma-separated)</label>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Algorithms, Operating Systems, Linear Algebra"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              required
            />
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hours / Week</label>
              <input
                type="number"
                min={5}
                max={80}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{loading ? "Optimizing..." : "Re-generate Plan"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Current Plan Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">{studyPlan.planTitle}</h2>
            <p className="text-xs text-slate-600 mt-0.5">{studyPlan.overview}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-blue-600 border border-slate-200">
            {studyPlan.weeklyHours}h / week allocated
          </span>
        </div>

        {/* Priority Action Tasks */}
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Priority Tasks & Action Items</span>
        </h3>

        <div className="space-y-2.5">
          {(studyPlan?.priorityTasks || []).map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                task.completed
                  ? "bg-slate-50/50 border-slate-200 opacity-60"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => handleToggleTask(task)}
                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-600/10" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {task.day}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-blue-600 border border-slate-200">
                      {task.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        task.priority === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {task.durationMinutes} min
                    </span>
                  </div>
                  <h4
                    className={`text-sm font-semibold ${
                      task.completed ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {task.topic}
                  </h4>
                  {task.tips && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">💡 {task.tips}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Breakdown & Spaced Repetition Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Weekly Target Schedule</span>
          </h3>
          <div className="space-y-2">
            {(studyPlan?.dailyBreakdown || []).map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-slate-800 w-24">{item.day}</span>
                <span className="text-slate-600 flex-1 truncate px-2">{item.focus}</span>
                <span className="font-mono text-blue-600 font-semibold">
                  {item.plannedHours} hrs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spaced Repetition & Health Breaks */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              <span>Spaced Repetition & Revision Rules</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {(studyPlan?.revisionSchedule || []).map((rev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{rev}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Cognitive Recharge Recommendations</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {(studyPlan?.breakRecommendations || []).map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Custom Study Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Objective</label>
                <input
                  type="text"
                  value={newTaskTopic}
                  onChange={(e) => setNewTaskTopic(e.target.value)}
                  placeholder="e.g. Implement Trie prefix tree in Python"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Day</label>
                  <select
                    value={newTaskDay}
                    onChange={(e) => setNewTaskDay(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="number"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
