export type ActiveView =
  | "landing"
  | "login"
  | "register"
  | "forgot-password"
  | "profile"
  | "dashboard"
  | "chat"
  | "research"
  | "pdf"
  | "resources"
  | "planner"
  | "career"
  | "quiz"
  | "progress"
  | "analytics"
  | "history"
  | "settings";

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  email: string;
  isGuest: boolean;
  university: string;
  college?: string;
  major: string;
  course?: string;
  year: string;
  yearOfStudy?: string;
  targetRole: string;
  studyStreakDays: number;
  totalStudyHours: number;
  completedTasksCount: number;
  averageQuizScore: number;
  joinedDate: string;
  avatarUrl?: string;
  theme: "dark" | "light";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  subject?: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  verified: boolean;
}

export interface ResearchReport {
  id: string;
  title: string;
  query: string;
  domain: string;
  summary: string;
  keyFindings: string[];
  detailedAnalysis: string;
  sources: ResearchSource[];
  createdAt: string;
  searchProviderNote?: string;
}

export interface StudyTask {
  id: string;
  day: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  tips?: string;
}

export interface DailyBreakdown {
  day: string;
  focus: string;
  plannedHours: number;
}

export interface StudyPlan {
  id: string;
  planTitle: string;
  overview: string;
  weeklyHours: number;
  priorityTasks: StudyTask[];
  dailyBreakdown: DailyBreakdown[];
  revisionSchedule: string[];
  breakRecommendations: string[];
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptTag?: string;
}

export interface QuizResult {
  id: string;
  quizTitle: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  userAnswers: { questionId: number; selectedIndex: number; isCorrect: boolean }[];
  questions: QuizQuestion[];
}

export interface LearningResourceItem {
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
  saved?: boolean;
}

export interface CareerPlanData {
  primaryRole: string;
  overview: string;
  targetRoles: { title: string; matchRate: string; avgSalaryRange: string }[];
  requiredSkills: string[];
  skillGaps: { skill: string; importance: string; estimatedWeeksToMaster: number }[];
  learningRoadmap: { phase: string; description: string; deliverable: string }[];
  recommendedCertifications: { name: string; provider: string; value: string }[];
  projectIdeas: { title: string; techStack: string[]; impact: string }[];
  internshipPrep: string[];
  interviewPrep: string[];
  resumeGuidance: string[];
}
