import React, { useState } from "react";
import {
  SearchCode,
  Sparkles,
  BookmarkPlus,
  Download,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Share2,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { ResearchReport } from "../../types";
import { api } from "../../services/api";
import { storage } from "../../services/storage";

interface DeepResearchProps {
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
  onOpenHistory?: () => void;
}

const DOMAINS = [
  "Computer Science & Algorithms",
  "Distributed Systems & Cloud",
  "Machine Learning & Data Science",
  "Operating Systems & Architecture",
  "Mathematics & Calculus",
  "Software Engineering Design",
];

export const DeepResearch: React.FC<DeepResearchProps> = ({ onNotify, onOpenHistory }) => {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [depth, setDepth] = useState<"standard" | "comprehensive">("comprehensive");
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>("");
  const [activeReport, setActiveReport] = useState<ResearchReport | null>(() => {
    const existing = storage.getResearchReports();
    return existing[0] || null;
  });

  const handleStartResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setProgressStep("Formulating academic query & analyzing domain bounds...");

    const stepTimer1 = setTimeout(() => {
      setProgressStep("Retrieving authoritative peer-reviewed principles & benchmarks...");
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setProgressStep("Synthesizing structural findings, key bottlenecks, and code examples...");
    }, 2800);

    try {
      const report = await api.runDeepResearch(query, domain, depth);
      const fullReport: ResearchReport = {
        ...report,
        id: "rep-" + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setActiveReport(fullReport);
      storage.saveResearchReport(fullReport);
      onNotify("success", "Research synthesis complete", "Report added to your Research History.");
    } catch (err: any) {
      console.error(err);
      onNotify("error", "Research failed", err.message || "Failed to complete research synthesis");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setProgressStep("");
    }
  };

  const handleExportMarkdown = () => {
    if (!activeReport) return;
    const content = `# ${activeReport.title}
**Domain:** ${activeReport.domain}
**Date:** ${new Date(activeReport.createdAt).toLocaleDateString()}

## Executive Summary
${activeReport.summary}

## Key Findings
${(activeReport.keyFindings || []).map((f) => `- ${f}`).join("\n")}

## Detailed Analysis
${activeReport.detailedAnalysis}

## Authoritative Sources
${(activeReport.sources || []).map((s) => `- [${s.title}](${s.url}): ${s.snippet}`).join("\n")}

---
*Report synthesized with EduMentor AI Deep Research Engine*
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeReport.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify("success", "Markdown report exported");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <SearchCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Collegiate Deep Research Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Conduct rigorous academic syntheses with verifiable citations and zero hallucinations.
            </p>
          </div>
        </div>

        {activeReport && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Markdown</span>
            </button>
          </div>
        )}
      </div>

      {/* Query Bar Form */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleStartResearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a research topic (e.g. 'Raft vs Paxos consensus mechanics in distributed key-value stores')..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-40 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{loading ? "Researching..." : "Start Deep Research"}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Domain:</span>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-slate-900 shadow-xs"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="depth"
                  checked={depth === "comprehensive"}
                  onChange={() => setDepth("comprehensive")}
                  className="accent-slate-900"
                />
                <span>Exhaustive Synthesis</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="depth"
                  checked={depth === "standard"}
                  onChange={() => setDepth("standard")}
                  className="accent-slate-900"
                />
                <span>Concise Brief</span>
              </label>
            </div>
          </div>
        </form>

        {/* Progress Display */}
        {loading && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
            <span className="text-xs font-medium text-blue-700">{progressStep}</span>
          </div>
        )}
      </div>

      {/* Active Report Display */}
      {activeReport ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  {activeReport.domain}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 font-['Outfit'] mt-1">
                  {activeReport.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(activeReport.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Executive Synthesis
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeReport.summary}
              </p>
            </div>

            {/* Key Findings Grid */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Key Core Findings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeReport.keyFindings || []).map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-800 leading-relaxed">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deep Technical Analysis */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Full Academic Breakdown & Methodologies</span>
            </h3>
            <div className="prose max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {activeReport.detailedAnalysis}
            </div>
          </div>

          {/* Verified Academic Sources */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Authoritative Literature & Official Documentation</span>
              </h3>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Zero Hallucination Grounding</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(activeReport.sources || []).map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {src.title}
                      </h4>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {src.snippet}
                    </p>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono mt-3 truncate block">
                    {src.url.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              ))}
            </div>

            {activeReport.searchProviderNote && (
              <p className="text-[11px] text-slate-500 mt-4 text-center">
                {activeReport.searchProviderNote}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200">
          <SearchCode className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Research Report Generated Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Type any collegiate research topic or assignment prompt above to synthesize an in-depth academic report.
          </p>
        </div>
      )}
    </div>
  );
};
