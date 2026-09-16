import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  ExternalLink,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";
import { LearningResourceItem } from "../../types";
import { storage } from "../../services/storage";
import { api } from "../../services/api";

interface LearningResourcesProps {
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
}

const DEFAULT_RESOURCES: LearningResourceItem[] = [
  {
    id: "res-1",
    title: "MIT 6.006: Introduction to Algorithms",
    category: "Course",
    provider: "MIT OpenCourseWare",
    description: "Classic MIT foundational curriculum covering asymptotic analysis, hashing, heaps, AVL trees, and dynamic programming.",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    topics: ["Data Structures", "Algorithms", "Complexity"],
    level: "Intermediate",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-2",
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    category: "Book",
    provider: "University of Wisconsin-Madison",
    description: "Canonical free university textbook covering Virtualization (CPU/Memory), Concurrency (Threads/Locks), and Persistence (File Systems).",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    topics: ["Operating Systems", "Concurrency", "Virtual Memory"],
    level: "Intermediate",
    free: true,
    rating: 4.95,
  },
  {
    id: "res-3",
    title: "3Blue1Brown: Essence of Linear Algebra",
    category: "YouTube",
    provider: "Grant Sanderson",
    description: "Visually geometric explorations of matrix transformations, eigenvectors, determinants, and dot/cross products.",
    url: "https://www.3blue1brown.com/topics/linear-algebra",
    topics: ["Linear Algebra", "Mathematics", "Geometry"],
    level: "All Levels",
    free: true,
    rating: 5.0,
  },
  {
    id: "res-4",
    title: "The System Design Primer",
    category: "Documentation",
    provider: "GitHub / Donne Martin",
    description: "Industry-standard open-source guide to scaling web architectures, microservices, caches, and high availability.",
    url: "https://github.com/donnemartin/system-design-primer",
    topics: ["System Design", "Scalability", "Databases"],
    level: "Advanced",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-5",
    title: "CS50's Introduction to Computer Science",
    category: "Course",
    provider: "Harvard University",
    description: "Harvard University's flagship introductory computing course covering C, memory, data structures, and Python.",
    url: "https://cs50.harvard.edu/x/",
    topics: ["Computer Science", "C", "Algorithms"],
    level: "Beginner",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-6",
    title: "NeetCode: 150 Core DSA Patterns",
    category: "Interactive Tutorial",
    provider: "NeetCode.io",
    description: "Structured categorization of coding interview problems across Sliding Window, Two Pointers, Trees, Graphs, and DP.",
    url: "https://neetcode.io/",
    topics: ["LeetCode", "Interview Prep", "Algorithms"],
    level: "Intermediate",
    free: true,
    rating: 4.85,
  },
];

const CATEGORIES = [
  "All",
  "Course",
  "Book",
  "YouTube",
  "Documentation",
  "Interactive Tutorial",
];

export const LearningResources: React.FC<LearningResourcesProps> = ({ onNotify }) => {
  const [resources, setResources] = useState<LearningResourceItem[]>(DEFAULT_RESOURCES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>(() => storage.getSavedResources());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try fetching from backend API
    const loadFromApi = async () => {
      setLoading(true);
      try {
        const res = await api.getResources();
        if (res.resources && res.resources.length > 0) {
          setResources(res.resources);
        }
      } catch {
        // Fallback to DEFAULT_RESOURCES
      } finally {
        setLoading(false);
      }
    };
    loadFromApi();
  }, []);

  const handleToggleSave = (id: string) => {
    const isSaved = storage.toggleSaveResource(id);
    setSavedIds(storage.getSavedResources());
    onNotify(
      isSaved ? "success" : "info",
      isSaved ? "Resource bookmarked" : "Resource removed from bookmarks"
    );
  };

  const filteredResources = (resources || []).filter((r) => {
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    const matchesSearch =
      (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.provider || "").toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              Curated Collegiate Learning Resources
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Gold-standard academic syllabi, canonical textbooks, and interview roadmaps.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search textbooks, courses, topics..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const isSaved = savedIds.includes(res.id);
          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {res.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-slate-600 px-1.5 py-0.5 rounded bg-slate-100">
                      {res.level}
                    </span>
                    <button
                      onClick={() => handleToggleSave(res.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        isSaved
                          ? "text-blue-600 hover:text-blue-700"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                  {res.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mb-2">{res.provider}</p>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {res.description}
                </p>

                {Array.isArray(res.topics) && res.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {res.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-900 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{res.rating}</span>
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
