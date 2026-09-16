import React, { useState } from "react";
import {
  Briefcase,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
  Code2,
  Terminal,
  FolderGit2,
  FileBadge,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { CareerPlanData } from "../../types";
import { api } from "../../services/api";

interface CareerGuidanceProps {
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

const ROLES = [
  "Full-Stack Software Engineer",
  "Backend Systems Engineer",
  "AI / Machine Learning Engineer",
  "Data Scientist & Analytics",
  "Cloud & DevOps Engineer",
  "Cybersecurity Engineer",
];

const EXPERIENCE_LEVELS = [
  "Freshman / 1st Year",
  "Sophomore / 2nd Year",
  "Junior / 3rd Year",
  "Senior / Final Year",
  "Graduate / Master's Student",
];

export const CareerGuidance: React.FC<CareerGuidanceProps> = ({ onNotify }) => {
  const [role, setRole] = useState(ROLES[0]);
  const [level, setLevel] = useState(EXPERIENCE_LEVELS[2]);
  const [skills, setSkills] = useState("Python, JavaScript, React, SQL, Git, Basic Data Structures");
  const [interests, setInterests] = useState("Distributed systems, high-scale web platforms, developer tools");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<CareerPlanData | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentSkillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await api.generateCareerGuidance({
        education: level,
        interests: [interests],
        skills: currentSkillsArray,
        preferredDomain: role,
        careerGoal: role,
      });
      setPlan(res);
      onNotify("success", "Career roadmap generated", `Tailored blueprint for ${role} ready.`);
    } catch (err: any) {
      onNotify("error", "Roadmap generation failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Collegiate Tech Career Navigator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Bridge your academic coursework to competitive internships and full-time engineering offers.
            </p>
          </div>
        </div>
      </div>

      {/* Target Role & Skills Input Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Engineering Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Collegiate Standing
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              >
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Technical Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, Java, Git, React, Docker..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Specific Tech Interests / Focus Areas
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Cloud architecture, ML inference, low-latency APIs..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{loading ? "Analyzing Industry Requisites..." : "Generate Career Roadmap"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Roadmap Display */}
      {plan ? (
        <div className="space-y-6">
          {/* Target Role & Market Overview */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-blue-600 border border-slate-200">
                Industry Assessment
              </span>
              <span className="text-xs text-slate-500">Internship & New Grad Calibrated</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit'] mb-2">
              {plan.primaryRole} Blueprint
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {plan.overview}
            </p>
          </div>

          {/* Skill Gap Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Required Core Competencies</span>
              </h3>
              <div className="space-y-2">
                {(plan.requiredSkills || []).map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>High-Priority Skills Gaps to Bridge</span>
              </h3>
              <div className="space-y-2">
                {(plan.skillGaps || []).map((gap, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-600" />
                      <span className="font-semibold">{gap.skill}</span>
                      <span className="text-[10px] text-slate-500">({gap.importance})</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono">
                      ~{gap.estimatedWeeksToMaster} wks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-Step Learning Stages */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Multi-Stage Progression Roadmap</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(plan.learningRoadmap || []).map((stage, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 mb-2 inline-block">
                      {stage.phase}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">{stage.description}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {stage.deliverable}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standout Portfolio Projects */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-600" />
              <span>Standout Portfolio Projects (Recruiter Magnets)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(plan.projectIdeas || []).map((proj, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{proj.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{proj.impact}</p>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Recommended Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.techStack || []).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-white text-slate-700 border border-slate-200 font-mono shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interview Strategy & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interview Prep */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Technical & Behavioral Interview Prep</span>
              </h3>
              <div className="space-y-2">
                {(plan.interviewPrep || []).map((tip, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Courses */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-blue-600" />
                <span>Recommended Industry Certifications</span>
              </h3>
              <div className="space-y-2.5">
                {(plan.recommendedCertifications || []).map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-slate-800 font-semibold block">{cert.name}</span>
                      <span className="text-[10px] text-slate-500">{cert.provider}</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {cert.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Career Roadmap Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Choose your target tech engineering role and collegiate standing above to produce an industry-calibrated career guide.
          </p>
        </div>
      )}
    </div>
  );
};
