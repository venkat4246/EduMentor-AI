import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  BotMessageSquare,
  SearchCode,
  FileText,
  CalendarCheck2,
  Briefcase,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Star,
  Users,
  Clock,
  Layers,
  Award,
} from "lucide-react";
import { ActiveView } from "../../types";

interface LandingPageProps {
  onGetStarted: () => void;
  onTryAsGuest: () => void;
  onSelectFeature: (view: ActiveView) => void;
  onLogin?: () => void;
  onRegister?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onTryAsGuest,
  onSelectFeature,
  onLogin,
  onRegister,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { value: "98.4%", label: "Exam Readiness Score", change: "+32% vs traditional notes" },
    { value: "4.8x", label: "Faster Research Synthesis", change: "Verified academic sources" },
    { value: "15,000+", label: "STEM Concepts Mastered", change: "Algorithms, math, systems" },
    { value: "85%", label: "Internship Placement Rate", change: "Tailored career blueprints" },
  ];

  const features = [
    {
      icon: BotMessageSquare,
      title: "Collegiate AI Assistant",
      desc: "Deep pedagogical explanations with syntax-highlighted code, algorithmic proofs, and step-by-step problem breakdown.",
      view: "chat" as ActiveView,
      color: "from-blue-500 to-indigo-600",
      pill: "Gemini 3.8 Flash",
    },
    {
      icon: SearchCode,
      title: "Deep Research Workspace",
      desc: "Conduct structured, hallucination-resistant academic research with key findings, verified citations, and instant report exports.",
      view: "research" as ActiveView,
      color: "from-indigo-500 to-purple-600",
      pill: "Academic Engine",
    },
    {
      icon: FileText,
      title: "Intelligent PDF Analyzer",
      desc: "Upload syllabi, lecture slides, and textbook chapters. Extract study notes, generate summaries, and chat directly with your document.",
      view: "pdf" as ActiveView,
      color: "from-purple-500 to-pink-600",
      pill: "Document Q&A",
    },
    {
      icon: CalendarCheck2,
      title: "AI Study Planner",
      desc: "Automatically balance multiple subject exams, daily study hours, Pomodoro intervals, and spaced repetition revision blocks.",
      view: "planner" as ActiveView,
      color: "from-emerald-500 to-teal-600",
      pill: "Schedule Optimizer",
    },
    {
      icon: Briefcase,
      title: "Career & Internship Navigator",
      desc: "Bridge your collegiate coursework to industry roles. Get personalized skill-gap roadmaps, standout project ideas, and interview guides.",
      view: "career" as ActiveView,
      color: "from-amber-500 to-orange-600",
      pill: "Industry Ready",
    },
    {
      icon: GraduationCap,
      title: "AI Quiz Generator",
      desc: "Create dynamic multiple-choice practice exams calibrated by subject and difficulty, complete with deep diagnostic explanations.",
      view: "quiz" as ActiveView,
      color: "from-rose-500 to-red-600",
      pill: "Active Recall",
    },
  ];

  const faqs = [
    {
      q: "How does EduMentor AI differ from standard ChatGPT?",
      a: "EduMentor AI is specifically architected as a collegiate learning operating system. Rather than just generic text answers, it provides structured study schedules, PDF multi-modal comprehension, real-time quiz generation with misconception analysis, and tech career milestone roadmaps.",
    },
    {
      q: "Can I use EduMentor AI without creating an account?",
      a: "Yes! With our 1-click Guest Mode, you can immediately test all core features, conduct research, generate quizzes, and explore study roadmaps without registration.",
    },
    {
      q: "How does the PDF Analyzer work?",
      a: "You can drag and drop lecture slides, papers, or textbook chapters. Our backend processes the document and feeds it to Gemini 3.8 Flash, allowing you to ask specific questions, extract study notes, and generate quick revision summaries.",
    },
    {
      q: "Are the research citations real?",
      a: "Yes. Our Deep Research module is explicitly instructed to never hallucinate citations. It structures findings using canonical documentation, peer-reviewed indices (ACM, IEEE, arXiv), and academic standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Built for Modern College Students & STEM Scholars</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] font-['Outfit']">
            Learn Smarter. Plan Better. <br className="hidden sm:inline" />
            <span className="text-blue-600">
              Build Your Future.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 leading-relaxed">
            EduMentor AI is your personal collegiate AI learning and career assistant. Master complex
            programming, analyze study materials, run deep research, build optimized study plans, and
            land top-tier tech internships.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <button
              onClick={onRegister || onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onLogin || onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
            >
              <span>Sign In</span>
            </button>

            <button
              onClick={onTryAsGuest}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Explore as Guest</span>
            </button>
          </div>

          {/* Interactive Hero Visual Preview */}
          <div className="relative max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-xl p-4 sm:p-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-500 font-mono ml-2">EduMentor AI Collegiate Engine v2.5</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                Live Server Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 text-xs font-bold mb-2">
                  <BotMessageSquare className="w-4 h-4 text-blue-600" />
                  <span>AI Tutor Prompt</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  "Explain AVL Tree rotations with ASCII balance factors and C++ implementation."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 text-xs font-bold mb-2">
                  <SearchCode className="w-4 h-4 text-blue-600" />
                  <span>Deep Research</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  "Synthesize Java 21 Project Loom vs. Go Goroutines concurrency metrics."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 text-xs font-bold mb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Career Roadmap</span>
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  "Targeting Tier-1 Backend SWE: Docker, Redis cache, and Distributed Systems."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-['Outfit']">
            Everything College Students Need in One Platform
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Replace ten disconnected tools with one cohesive, academically tailored AI workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                onClick={() => onSelectFeature(feat.view)}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center border border-slate-200 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {feat.pill}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700 pt-3 border-t border-slate-100">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 font-['Outfit']">
              How EduMentor AI Accelerates Your Semester
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Three seamless steps to transform high stress into academic mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Upload or Ask Anything</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Provide lecture slides, coding questions, syllabus dates, or your career dreams. EduMentor structures and contextualizes your material instantly.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Learn with AI Precision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Experience high-yield concept breakdowns, active recall practice quizzes, and an automated weekly study planner that respects your schedule.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ace Exams & Land Offers</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Track your study streak, review performance analytics, bridge your skill gaps, and follow tailored roadmaps to top tech internships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about EduMentor AI's collegiate tools.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm text-slate-800 hover:text-slate-950"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 font-['Outfit']">
            Ready to Supercharge Your Academic Journey?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join thousands of college scholars leveraging EduMentor AI to study smarter, eliminate cramming, and step confidently into tech careers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTryAsGuest}
              className="px-8 py-3.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 font-semibold text-sm transition-all"
            >
              <span>Explore as Guest</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-['Outfit']">EduMentor AI</span>
            <span>— Your Personal AI Learning & Career Assistant</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>•</span>
            <span>Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
