import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { StudyPlan, QuizResult, ResearchReport, UserProfile } from "../types";

export const firestoreSync = {
  getUid(): string | null {
    return auth.currentUser ? auth.currentUser.uid : null;
  },

  async syncUserDataFromCloud(uid: string): Promise<{
    studyPlan?: StudyPlan;
    quizResults?: QuizResult[];
    researchReports?: ResearchReport[];
  }> {
    try {
      const results: {
        studyPlan?: StudyPlan;
        quizResults?: QuizResult[];
        researchReports?: ResearchReport[];
      } = {};

      // 1. Study Plan
      const plansSnap = await getDocs(
        query(collection(db, "users", uid, "studyPlans"), orderBy("createdAt", "desc"), limit(1))
      );
      if (!plansSnap.empty) {
        const rawPlan = plansSnap.docs[0].data() as any;
        if (rawPlan && typeof rawPlan === "object") {
          results.studyPlan = {
            ...rawPlan,
            priorityTasks: Array.isArray(rawPlan.priorityTasks) ? rawPlan.priorityTasks : [],
            dailyBreakdown: Array.isArray(rawPlan.dailyBreakdown) ? rawPlan.dailyBreakdown : [],
            revisionSchedule: Array.isArray(rawPlan.revisionSchedule) ? rawPlan.revisionSchedule : [],
            breakRecommendations: Array.isArray(rawPlan.breakRecommendations) ? rawPlan.breakRecommendations : [],
          } as StudyPlan;
        }
      }

      // 2. Quiz Results
      const quizzesSnap = await getDocs(
        query(collection(db, "users", uid, "quizResults"), orderBy("date", "desc"), limit(20))
      );
      if (!quizzesSnap.empty) {
        results.quizResults = quizzesSnap.docs
          .map((d) => d.data() as QuizResult)
          .filter((q) => q && typeof q === "object");
      }

      // 3. Research Reports
      const reportsSnap = await getDocs(
        query(collection(db, "users", uid, "researchReports"), orderBy("createdAt", "desc"), limit(20))
      );
      if (!reportsSnap.empty) {
        results.researchReports = reportsSnap.docs
          .map((d) => d.data() as ResearchReport)
          .filter((r) => r && typeof r === "object");
      }

      return results;
    } catch (err) {
      console.warn("Firestore data sync warning:", err);
      return {};
    }
  },

  async saveStudyPlan(plan: StudyPlan): Promise<void> {
    const uid = this.getUid();
    if (!uid) return;
    try {
      await setDoc(doc(db, "users", uid, "studyPlans", plan.id || "current-plan"), {
        ...plan,
        userId: uid,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Could not sync study plan to Firestore:", err);
    }
  },

  async saveQuizResult(result: QuizResult): Promise<void> {
    const uid = this.getUid();
    if (!uid) return;
    try {
      await setDoc(doc(db, "users", uid, "quizResults", result.id), {
        ...result,
        userId: uid,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Could not sync quiz result to Firestore:", err);
    }
  },

  async saveResearchReport(report: ResearchReport): Promise<void> {
    const uid = this.getUid();
    if (!uid) return;
    try {
      await setDoc(doc(db, "users", uid, "researchReports", report.id), {
        ...report,
        userId: uid,
      });
    } catch (err) {
      console.warn("Could not sync research report to Firestore:", err);
    }
  },

  async deleteResearchReport(reportId: string): Promise<void> {
    const uid = this.getUid();
    if (!uid) return;
    try {
      await deleteDoc(doc(db, "users", uid, "researchReports", reportId));
    } catch (err) {
      console.warn("Could not delete report from Firestore:", err);
    }
  },
};
