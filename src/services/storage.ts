import {
  UserProfile,
  ChatMessage,
  ResearchReport,
  StudyPlan,
  QuizResult,
  LearningResourceItem,
  StudyTask,
} from "../types";
import { firestoreSync } from "./firestoreSync";

const KEYS = {
  USER: "edumentor_user_profile",
  CHAT_MESSAGES: "edumentor_chat_messages",
  RESEARCH_REPORTS: "edumentor_research_reports",
  STUDY_PLAN: "edumentor_study_plan",
  QUIZ_RESULTS: "edumentor_quiz_results",
  SAVED_RESOURCES: "edumentor_saved_resources",
  THEME: "edumentor_theme",
};

const DEFAULT_USER: UserProfile = {
  id: "usr-guest-01",
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  isGuest: false,
  university: "California Institute of Technology",
  major: "Computer Science & Engineering",
  year: "3rd Year (Junior)",
  targetRole: "Full-Stack Software Engineer",
  studyStreakDays: 14,
  totalStudyHours: 48.5,
  completedTasksCount: 32,
  averageQuizScore: 88,
  joinedDate: "Fall Semester",
  theme: "light",
};

const INITIAL_RESEARCH: ResearchReport[] = [
  {
    id: "rep-1",
    title: "Comparative Concurrency Models: Go Goroutines vs. Java Virtual Threads",
    query: "Compare Go Goroutines and Java 21 Virtual Threads for high-throughput I/O bound microservices",
    domain: "Distributed Systems & Concurrency",
    summary: "An in-depth empirical comparison analyzing memory footprint per thread, M:N cooperative scheduling mechanics in the Go runtime versus Project Loom's ForkJoinPool carrier thread architecture in JVM 21.",
    keyFindings: [
      "Go goroutines start at ~2KB initial stack size with dynamic contiguous reallocation.",
      "Java Virtual Threads allocate ~1KB metadata on heap and pin carrier threads on native blocking calls.",
      "Both mechanisms achieve sub-millisecond context switching for 100,000+ concurrent network connections."
    ],
    detailedAnalysis: "### Executive Summary\nModern backend architectures require scaling concurrent network sockets to hundreds of thousands without exhausting kernel stack frames.\n\n### Go Runtime M:N Scheduler\nGo maps M goroutines onto N OS threads across P logical processors using work-stealing queues.\n\n### JVM Project Loom\nVirtual Threads mount onto Platform carrier threads, yielding automatically during standard `java.net` socket reads.",
    sources: [
      {
        title: "Go Source Documentation: The Go Runtime Scheduler",
        url: "https://go.dev/src/runtime/proc.go",
        snippet: "Canonical implementation of work-stealing runtime scheduler.",
        verified: true,
      },
      {
        title: "OpenJDK JEP 444: Virtual Threads",
        url: "https://openjdk.org/jeps/444",
        snippet: "Official specification for Java virtual threads and carrier thread scheduling.",
        verified: true,
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    searchProviderNote: "Curated research report verified against OpenJDK and Go runtime specifications.",
  }
];

const INITIAL_STUDY_PLAN: StudyPlan = {
  id: "plan-default",
  planTitle: "Core Finals Sprint: Data Structures & Operating Systems",
  overview: "Targeted 4-hour daily study schedule balancing algorithmic derivations with hands-on systems debugging.",
  weeklyHours: 24,
  priorityTasks: [
    {
      id: "tsk-1",
      day: "Today",
      subject: "Data Structures",
      topic: "Red-Black Tree Insertion & Rotation Properties",
      durationMinutes: 75,
      priority: "High",
      completed: true,
      tips: "Remember: root is black, red nodes cannot have red children.",
    },
    {
      id: "tsk-2",
      day: "Today",
      subject: "Operating Systems",
      topic: "Dining Philosophers & Resource Allocation Graphs",
      durationMinutes: 60,
      priority: "High",
      completed: false,
      tips: "Apply asymmetric philosopher strategy to break circular wait.",
    },
    {
      id: "tsk-3",
      day: "Tomorrow",
      subject: "Computer Networks",
      topic: "TCP Congestion Control (Tahoe vs. Reno Fast Recovery)",
      durationMinutes: 90,
      priority: "Medium",
      completed: false,
      tips: "Trace congestion window cwnd progression through Slow Start and Congestion Avoidance.",
    },
    {
      id: "tsk-4",
      day: "Wednesday",
      subject: "Data Structures",
      topic: "B-Trees & Multiway Search for Database Indexing",
      durationMinutes: 80,
      priority: "High",
      completed: false,
      tips: "Calculate minimum keys $(t-1)$ and maximum keys $(2t-1)$ per node.",
    },
    {
      id: "tsk-5",
      day: "Thursday",
      subject: "Algorithms",
      topic: "Bellman-Ford & Negative Cycle Detection in Graphs",
      durationMinutes: 90,
      priority: "Medium",
      completed: false,
      tips: "Relax all edges $V-1$ times and check for further decrease on $V$-th pass.",
    }
  ],
  dailyBreakdown: [
    { day: "Monday", focus: "Self-Balancing Trees & Trees Complexity", plannedHours: 4 },
    { day: "Tuesday", focus: "Deadlock Detection & Concurrency Primitives", plannedHours: 4 },
    { day: "Wednesday", focus: "Transport Layer Protocols & B-Tree Disk I/O", plannedHours: 4 },
    { day: "Thursday", focus: "Shortest Path & Network Flow Algorithms", plannedHours: 4 },
    { day: "Friday", focus: "Full Mock Exam & Synthesis", plannedHours: 5 },
    { day: "Saturday", focus: "Review Incorrect Questions & Flashcards", plannedHours: 3 },
  ],
  revisionSchedule: [
    "Day 2: 15-minute quick trace of Red-Black rotations.",
    "Day 5: Re-derive Bellman-Ford without looking at textbook.",
    "Exam Eve: Formula sheet review and 8-hour sleep requirement."
  ],
  breakRecommendations: [
    "50/10 Pomodoro: 50 min deep study, 10 min hydration & physical stretch.",
    "Avoid screen consumption during short breaks.",
    "Brief 15-minute walk outside after lunch."
  ],
  createdAt: new Date().toISOString(),
};

const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: "qz-1",
    quizTitle: "Intermediate Quiz: Tree Data Structures",
    subject: "Computer Science",
    difficulty: "Intermediate",
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    date: new Date(Date.now() - 86400000).toLocaleDateString(),
    userAnswers: [],
    questions: [],
  },
  {
    id: "qz-2",
    quizTitle: "Advanced Quiz: Concurrency & Semaphores",
    subject: "Operating Systems",
    difficulty: "Advanced",
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
    userAnswers: [],
    questions: [],
  }
];

export const storage = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER;
  },

  saveUser(user: UserProfile) {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  },

  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(KEYS.CHAT_MESSAGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        content: `### Welcome to EduMentor AI! 🎓\n\nI am your collegiate academic mentor and coding partner. I can help you with:\n- **Programming & Algorithms**: Python, Java, C++, SQL, Graph Traversals, Dynamic Programming\n- **STEM & Mathematics**: Multivariable Calculus, Linear Algebra, Probability & Statistics\n- **Systems & Engineering**: Operating Systems, Computer Architecture, Distributed Systems\n- **Exam Prep & Assignments**: Step-by-step problem breakdown, debugging, and concept revision\n\nWhat would you like to master today? Try typing a question below or click one of the suggested prompts!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        subject: "General",
      }
    ];
  },

  saveChatMessages(messages: ChatMessage[]) {
    try {
      localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  },

  clearChatMessages() {
    try {
      localStorage.removeItem(KEYS.CHAT_MESSAGES);
    } catch (e) {
      console.error(e);
    }
  },

  getResearchReports(): ResearchReport[] {
    try {
      const data = localStorage.getItem(KEYS.RESEARCH_REPORTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RESEARCH;
  },

  saveResearchReport(report: ResearchReport) {
    try {
      const reports = this.getResearchReports();
      const exists = reports.findIndex((r) => r.id === report.id);
      if (exists >= 0) {
        reports[exists] = report;
      } else {
        reports.unshift(report);
      }
      localStorage.setItem(KEYS.RESEARCH_REPORTS, JSON.stringify(reports));
      firestoreSync.saveResearchReport(report).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  },

  deleteResearchReport(id: string) {
    try {
      const reports = this.getResearchReports().filter((r) => r.id !== id);
      localStorage.setItem(KEYS.RESEARCH_REPORTS, JSON.stringify(reports));
      firestoreSync.deleteResearchReport(id).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  },

  getStudyPlan(): StudyPlan {
    try {
      const data = localStorage.getItem(KEYS.STUDY_PLAN);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          return {
            ...INITIAL_STUDY_PLAN,
            ...parsed,
            priorityTasks: Array.isArray(parsed.priorityTasks)
              ? parsed.priorityTasks
              : INITIAL_STUDY_PLAN.priorityTasks,
            dailyBreakdown: Array.isArray(parsed.dailyBreakdown)
              ? parsed.dailyBreakdown
              : INITIAL_STUDY_PLAN.dailyBreakdown,
            revisionSchedule: Array.isArray(parsed.revisionSchedule)
              ? parsed.revisionSchedule
              : INITIAL_STUDY_PLAN.revisionSchedule,
            breakRecommendations: Array.isArray(parsed.breakRecommendations)
              ? parsed.breakRecommendations
              : INITIAL_STUDY_PLAN.breakRecommendations,
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDY_PLAN;
  },

  saveStudyPlan(plan: StudyPlan) {
    try {
      localStorage.setItem(KEYS.STUDY_PLAN, JSON.stringify(plan));
      firestoreSync.saveStudyPlan(plan).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  },

  updateTask(taskId: string, updates: Partial<StudyTask>) {
    const plan = this.getStudyPlan();
    const taskIndex = plan.priorityTasks.findIndex((t) => t.id === taskId);
    if (taskIndex >= 0) {
      plan.priorityTasks[taskIndex] = { ...plan.priorityTasks[taskIndex], ...updates };
      this.saveStudyPlan(plan);
    }
  },

  deleteTask(taskId: string) {
    const plan = this.getStudyPlan();
    plan.priorityTasks = plan.priorityTasks.filter((t) => t.id !== taskId);
    this.saveStudyPlan(plan);
  },

  addTask(task: StudyTask) {
    const plan = this.getStudyPlan();
    plan.priorityTasks.push(task);
    this.saveStudyPlan(plan);
  },

  getQuizResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(KEYS.QUIZ_RESULTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_QUIZ_RESULTS;
  },

  saveQuizResult(result: QuizResult) {
    try {
      const results = this.getQuizResults();
      results.unshift(result);
      localStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(results));
      firestoreSync.saveQuizResult(result).catch(() => {});
      
      // Also update user profile average score and study hours
      const user = this.getUser();
      const totalScore = results.reduce((acc, curr) => acc + curr.percentage, 0);
      user.averageQuizScore = Math.round(totalScore / results.length);
      user.totalStudyHours = Math.round((user.totalStudyHours + 0.3) * 10) / 10;
      this.saveUser(user);
    } catch (e) {
      console.error(e);
    }
  },

  getSavedResources(): string[] {
    try {
      const data = localStorage.getItem(KEYS.SAVED_RESOURCES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return ["res-1", "res-3", "res-8"];
  },

  toggleSaveResource(resourceId: string): boolean {
    try {
      const saved = this.getSavedResources();
      const idx = saved.indexOf(resourceId);
      let isSaved = false;
      if (idx >= 0) {
        saved.splice(idx, 1);
      } else {
        saved.push(resourceId);
        isSaved = true;
      }
      localStorage.setItem(KEYS.SAVED_RESOURCES, JSON.stringify(saved));
      return isSaved;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  exportAllData(): string {
    const backup = {
      user: this.getUser(),
      researchReports: this.getResearchReports(),
      studyPlan: this.getStudyPlan(),
      quizResults: this.getQuizResults(),
      savedResources: this.getSavedResources(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  resetAllData() {
    localStorage.clear();
  }
};
