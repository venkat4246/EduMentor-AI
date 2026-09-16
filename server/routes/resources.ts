import { Request, Response } from "express";

export interface LearningResource {
  id: string;
  title: string;
  category: "YouTube" | "Course" | "Documentation" | "Interactive Tutorial" | "Book";
  provider: string;
  url: string;
  description: string;
  topics: string[];
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  free: boolean;
  rating: number;
}

const CURATED_RESOURCES: LearningResource[] = [
  {
    id: "res-1",
    title: "MIT OpenCourseWare: Introduction to Algorithms (6.006)",
    category: "Course",
    provider: "MIT OCW",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    description: "World-renowned lectures by Prof. Erik Demaine covering data structures, sorting, trees, hashing, and graph algorithms.",
    topics: ["Data Structures", "Algorithms", "Graph Theory", "Dynamic Programming"],
    level: "Intermediate",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-2",
    title: "Stanford CS106B: Programming Abstractions",
    category: "Course",
    provider: "Stanford University",
    url: "https://web.stanford.edu/class/cs106b/",
    description: "Fundamental C++ programming, recursion, memory management, and algorithmic thinking taught at Stanford.",
    topics: ["C++", "Recursion", "Memory Management", "Pointers"],
    level: "Beginner",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-3",
    title: "3Blue1Brown: Essence of Linear Algebra",
    category: "YouTube",
    provider: "3Blue1Brown (Grant Sanderson)",
    url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    description: "Visual geometric intuition for vectors, matrices, dot products, eigenvalues, eigenvectors, and transformations.",
    topics: ["Mathematics", "Linear Algebra", "Calculus", "Machine Learning Math"],
    level: "All Levels",
    free: true,
    rating: 5.0,
  },
  {
    id: "res-4",
    title: "NeetCode: Complete Data Structures & Algorithms Roadmap",
    category: "Interactive Tutorial",
    provider: "NeetCode.io",
    url: "https://neetcode.io/roadmap",
    description: "Systematic coding interview preparation roadmap with clear video breakdowns and code explanations in multiple languages.",
    topics: ["LeetCode", "Interview Prep", "Data Structures", "Python", "Java"],
    level: "Intermediate",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-5",
    title: "Harvard CS50: Introduction to Computer Science",
    category: "Course",
    provider: "Harvard University / edX",
    url: "https://cs50.harvard.edu/x/",
    description: "The gold standard introduction to computer science and programming in C, Python, SQL, and Web fundamentals.",
    topics: ["Computer Science", "C", "Python", "SQL", "Web Dev"],
    level: "Beginner",
    free: true,
    rating: 5.0,
  },
  {
    id: "res-6",
    title: "Full Stack Open: Deep Dive Into Modern Web Development",
    category: "Course",
    provider: "University of Helsinki",
    url: "https://fullstackopen.com/en/",
    description: "Hands-on, rigorous university course on modern React, Node.js, Express, TypeScript, GraphQL, and CI/CD.",
    topics: ["React", "TypeScript", "Node.js", "Express", "REST APIs"],
    level: "Intermediate",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-7",
    title: "MDN Web Docs: Web Technologies Reference",
    category: "Documentation",
    provider: "Mozilla",
    url: "https://developer.mozilla.org/",
    description: "The authoritative, definitive documentation for modern JavaScript, HTML5, CSS3, Web APIs, and browser architecture.",
    topics: ["JavaScript", "Web APIs", "HTML/CSS", "Async JS"],
    level: "All Levels",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-8",
    title: "Operating Systems: Three Easy Pieces (OSTEP)",
    category: "Book",
    provider: "Remzi & Andrea Arpaci-Dusseau (UW Madison)",
    url: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    description: "The definitive free modern textbook on Virtualization, Concurrency, and Persistence for university students.",
    topics: ["Operating Systems", "Concurrency", "Paging", "File Systems"],
    level: "Intermediate",
    free: true,
    rating: 5.0,
  },
  {
    id: "res-9",
    title: "StatQuest with Josh Starmer: Machine Learning & Statistics",
    category: "YouTube",
    provider: "StatQuest",
    url: "https://www.youtube.com/c/joshstarmer",
    description: "Clear, step-by-step visual explanations of regression, classification, neural networks, PCA, and transformers.",
    topics: ["Machine Learning", "Statistics", "Data Science", "Neural Networks"],
    level: "Intermediate",
    free: true,
    rating: 4.9,
  },
  {
    id: "res-10",
    title: "SQLZoo: Interactive SQL Tutorials & Quizzes",
    category: "Interactive Tutorial",
    provider: "SQLZoo",
    url: "https://sqlzoo.net/",
    description: "Interactive browser queries for SELECT, JOIN, GROUP BY, window functions, and nested subqueries.",
    topics: ["SQL", "Databases", "PostgreSQL", "Data Analysis"],
    level: "Beginner",
    free: true,
    rating: 4.7,
  }
];

export async function handleGetResources(req: Request, res: Response) {
  try {
    const { query = "", category = "All", level = "All" } = req.query;

    let filtered = [...CURATED_RESOURCES];

    if (category && category !== "All") {
      filtered = filtered.filter((r) => r.category.toLowerCase() === String(category).toLowerCase());
    }

    if (level && level !== "All") {
      filtered = filtered.filter((r) => r.level.toLowerCase() === String(level).toLowerCase() || r.level === "All Levels");
    }

    if (query && typeof query === "string" && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q)) ||
          r.provider.toLowerCase().includes(q)
      );
    }

    return res.json({
      total: filtered.length,
      resources: filtered,
      categories: ["All", "YouTube", "Course", "Interactive Tutorial", "Documentation", "Book"],
      providerStatus: {
        youtubeApiIntegrated: false,
        note: "Curated university and authoritative documentation provider active. YouTube Data API v3 provider abstraction available for production webhook enrichment."
      }
    });
  } catch (error: any) {
    console.error("Resources error:", error);
    return res.status(500).json({ error: "Failed to fetch learning resources." });
  }
}
