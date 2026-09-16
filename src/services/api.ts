import {
  ChatMessage,
  ResearchReport,
  StudyPlan,
  QuizQuestion,
  CareerPlanData,
  LearningResourceItem,
} from "../types";

function extractErrorMessage(errPayload: any, status: number): string {
  let raw = errPayload?.error || `Request failed with status ${status}`;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    } catch {
      // not json
    }
  }
  return String(raw);
}

export const api = {
  async sendMessage(messages: { role: string; content: string }[], subject?: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, subject }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<{ reply: string }>;
  },

  async runDeepResearch(query: string, domain?: string, depth?: string) {
    const res = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, domain, depth }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<ResearchReport>;
  },

  async analyzePdf(payload: { fileName: string; pdfBase64?: string; textContent?: string }) {
    const res = await fetch("/api/pdf/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<{
      fileName: string;
      summary: string;
      keyPoints: string[];
      importantTopics: string[];
      studyNotes: string;
      estimatedReadingTime: string;
    }>;
  },

  async askPdfQuestion(payload: {
    question: string;
    fileName: string;
    pdfBase64?: string;
    textContent?: string;
    history?: { role: string; content: string }[];
  }) {
    const res = await fetch("/api/pdf/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<{ reply: string }>;
  },

  async generateStudyPlan(params: {
    subjects: string[];
    examDate: string;
    dailyHours: number;
    difficulty: string;
    learningGoals: string;
    availability: string;
  }) {
    const res = await fetch("/api/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<StudyPlan>;
  },

  async generateCareerGuidance(params: {
    education: string;
    interests: string[];
    skills: string[];
    preferredDomain: string;
    careerGoal: string;
  }) {
    const res = await fetch("/api/career", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<CareerPlanData>;
  },

  async generateQuiz(params: {
    topic: string;
    subject: string;
    difficulty: string;
    numQuestions: number;
  }) {
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<{
      quizTitle: string;
      subject: string;
      difficulty: "Beginner" | "Intermediate" | "Advanced";
      totalQuestions: number;
      questions: QuizQuestion[];
    }>;
  },

  async getResources(query?: string, category?: string, level?: string) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category) params.set("category", category);
    if (level) params.set("level", level);

    const res = await fetch(`/api/resources?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(extractErrorMessage(err, res.status));
    }
    return res.json() as Promise<{
      total: number;
      resources: LearningResourceItem[];
      categories: string[];
      providerStatus: { youtubeApiIntegrated: boolean; note: string };
    }>;
  },
};
