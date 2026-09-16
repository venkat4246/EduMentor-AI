import React, { useState } from "react";
import {
  History,
  SearchCode,
  Calendar,
  ExternalLink,
  Trash2,
  Download,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ResearchReport, ActiveView } from "../../types";
import { storage } from "../../services/storage";

interface ResearchHistoryProps {
  onSelectReport: (report: ResearchReport) => void;
  setActiveView: (view: ActiveView) => void;
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

export const ResearchHistory: React.FC<ResearchHistoryProps> = ({
  onSelectReport,
  setActiveView,
  onNotify,
}) => {
  const [reports, setReports] = useState<ResearchReport[]>(() => storage.getResearchReports());
  const [search, setSearch] = useState("");

  const handleDelete = (id: string) => {
    storage.deleteResearchReport(id);
    const updated = storage.getResearchReports();
    setReports(updated);
    onNotify("info", "Research report deleted");
  };

  const filtered = (reports || []).filter(
    (r) =>
      (r?.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (r?.domain || "").toLowerCase().includes(search.toLowerCase()) ||
      (r?.summary || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Academic Research Archives
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Browse, re-open, and export previously generated collegiate syntheses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView("research")}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <SearchCode className="w-4 h-4 text-blue-400" />
          <span>New Deep Research</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search research reports by title, topic, or domain..."
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-blue-600 border border-slate-200">
                    {report.domain}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onSelectReport(report);
                    setActiveView("research");
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Open Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-200">
            <History className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No matching research reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
