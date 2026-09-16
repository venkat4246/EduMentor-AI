import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase";
import { UserProfile } from "../types";
import { storage } from "./storage";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  university: string; // College / University
  major: string;      // Course / Branch
  year: string;       // Year of Study
}

export function getFriendlyAuthError(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error.code || "";
  const msg = error.message || String(error);

  switch (code) {
    case "auth/user-not-found":
      return "No account exists with this email address. Please register first.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please double-check your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please log in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters with letters and numbers.";
    case "auth/invalid-email":
      return "Please provide a valid email address (e.g. name@university.edu).";
    case "auth/popup-closed-by-user":
      return "Google Sign-In was closed before completion. Please try again.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/too-many-requests":
      return "Access temporarily blocked due to multiple failed login attempts. Please reset your password or wait a few minutes.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    default:
      if (msg.includes("passwords do not match")) {
        return "Passwords do not match. Please verify both password fields.";
      }
      return msg.replace(/^Firebase:\s*/, "");
  }
}

export const authService = {
  getCurrentUser(): UserProfile {
    return storage.getUser();
  },

  loginAsGuest(): UserProfile {
    const guestUser: UserProfile = {
      id: "usr-guest-" + Math.random().toString(36).substring(2, 7),
      name: "Guest Scholar",
      email: "guest@edumentor.ai",
      isGuest: true,
      university: "Explore University",
      college: "Explore University",
      major: "Computer Science & Engineering",
      course: "Computer Science & Engineering",
      year: "Guest Explorer",
      yearOfStudy: "Guest Explorer",
      targetRole: "Software Engineer",
      studyStreakDays: 1,
      totalStudyHours: 0,
      completedTasksCount: 0,
      averageQuizScore: 0,
      joinedDate: "Today",
      theme: (localStorage.getItem("edumentor_theme") as "dark" | "light") || "light",
    };
    storage.saveUser(guestUser);
    return guestUser;
  },

  async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = credential.user;

    // Fetch profile from Firestore
    let profile = await this.fetchFirestoreProfile(fbUser.uid);

    if (!profile) {
      // Fallback if firestore document was not initialized
      profile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || email.split("@")[0],
        email: fbUser.email || email,
        isGuest: false,
        university: "College of Science & Engineering",
        college: "College of Science & Engineering",
        major: "Computer Science",
        course: "Computer Science",
        year: "3rd Year",
        yearOfStudy: "3rd Year",
        targetRole: "Software Engineer",
        studyStreakDays: 1,
        totalStudyHours: 0,
        completedTasksCount: 0,
        averageQuizScore: 0,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        theme: "light",
      };
      await this.saveFirestoreProfile(profile);
    }

    storage.saveUser(profile);
    return profile;
  },

  async register(data: RegisterPayload): Promise<UserProfile> {
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      throw new Error("passwords do not match");
    }
    if (data.password.length < 6) {
      const err: any = new Error("Password must be at least 6 characters long.");
      err.code = "auth/weak-password";
      throw err;
    }

    const credential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
    const fbUser = credential.user;

    // Update Firebase Auth profile display name
    try {
      await updateFirebaseProfile(fbUser, {
        displayName: data.name.trim(),
      });
    } catch {
      // Non-blocking
    }

    const newProfile: UserProfile = {
      id: fbUser.uid,
      uid: fbUser.uid,
      name: data.name.trim(),
      email: data.email.trim(),
      isGuest: false,
      university: data.university.trim() || "University Campus",
      college: data.university.trim() || "University Campus",
      major: data.major.trim() || "Computer Science & Engineering",
      course: data.major.trim() || "Computer Science & Engineering",
      year: data.year.trim() || "1st Year",
      yearOfStudy: data.year.trim() || "1st Year",
      targetRole: "Software Engineer",
      studyStreakDays: 1,
      totalStudyHours: 0,
      completedTasksCount: 0,
      averageQuizScore: 0,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      theme: (localStorage.getItem("edumentor_theme") as "dark" | "light") || "light",
    };

    // Store in Firestore
    await this.saveFirestoreProfile(newProfile);
    storage.saveUser(newProfile);
    return newProfile;
  },

  async signInWithGoogle(): Promise<UserProfile> {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    let profile = await this.fetchFirestoreProfile(fbUser.uid);

    if (!profile) {
      profile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student Scholar",
        email: fbUser.email || "",
        avatarUrl: fbUser.photoURL || undefined,
        isGuest: false,
        university: "University Campus",
        college: "University Campus",
        major: "Computer Science & Engineering",
        course: "Computer Science & Engineering",
        year: "Undergraduate",
        yearOfStudy: "Undergraduate",
        targetRole: "Software Engineer",
        studyStreakDays: 1,
        totalStudyHours: 0,
        completedTasksCount: 0,
        averageQuizScore: 0,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        theme: (localStorage.getItem("edumentor_theme") as "dark" | "light") || "light",
      };
      await this.saveFirestoreProfile(profile);
    }

    storage.saveUser(profile);
    return profile;
  },

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("SignOut warning:", err);
    }

    const resetGuest: UserProfile = {
      id: "usr-guest-anon",
      name: "Guest Scholar",
      email: "guest@edumentor.ai",
      isGuest: true,
      university: "Explore University",
      college: "Explore University",
      major: "Computer Science",
      course: "Computer Science",
      year: "Guest Explorer",
      yearOfStudy: "Guest Explorer",
      targetRole: "Software Engineer",
      studyStreakDays: 1,
      totalStudyHours: 0,
      completedTasksCount: 0,
      averageQuizScore: 0,
      joinedDate: "Today",
      theme: (localStorage.getItem("edumentor_theme") as "dark" | "light") || "light",
    };
    storage.saveUser(resetGuest);
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = storage.getUser();
    const updated: UserProfile = {
      ...current,
      ...updates,
      college: updates.university || updates.college || current.college || current.university,
      course: updates.major || updates.course || current.course || current.major,
      yearOfStudy: updates.year || updates.yearOfStudy || current.yearOfStudy || current.year,
    };

    storage.saveUser(updated);

    if (auth.currentUser && !updated.isGuest) {
      try {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Could not sync profile to Firestore:", err);
      }
    }

    return updated;
  },

  async fetchFirestoreProfile(uid: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: uid,
          uid: uid,
          name: data.name || "Student Scholar",
          email: data.email || "",
          isGuest: false,
          university: data.university || data.college || "University Campus",
          college: data.college || data.university || "University Campus",
          major: data.major || data.course || "Computer Science",
          course: data.course || data.major || "Computer Science",
          year: data.year || data.yearOfStudy || "1st Year",
          yearOfStudy: data.yearOfStudy || data.year || "1st Year",
          targetRole: data.targetRole || "Software Engineer",
          studyStreakDays: data.studyStreakDays || 1,
          totalStudyHours: data.totalStudyHours || 0,
          completedTasksCount: data.completedTasksCount || 0,
          averageQuizScore: data.averageQuizScore || 0,
          joinedDate: data.joinedDate || "Recent",
          avatarUrl: data.avatarUrl || undefined,
          theme: data.theme || "light",
        };
      }
    } catch (err) {
      console.warn("Error reading profile from Firestore:", err);
    }
    return null;
  },

  async saveFirestoreProfile(profile: UserProfile): Promise<void> {
    try {
      const uid = profile.uid || profile.id;
      if (!uid || profile.isGuest) return;

      await setDoc(
        doc(db, "users", uid),
        {
          id: uid,
          uid: uid,
          name: profile.name,
          email: profile.email,
          university: profile.university,
          college: profile.college || profile.university,
          major: profile.major,
          course: profile.course || profile.major,
          year: profile.year,
          yearOfStudy: profile.yearOfStudy || profile.year,
          targetRole: profile.targetRole,
          studyStreakDays: profile.studyStreakDays,
          totalStudyHours: profile.totalStudyHours,
          completedTasksCount: profile.completedTasksCount,
          averageQuizScore: profile.averageQuizScore,
          joinedDate: profile.joinedDate,
          theme: profile.theme,
          avatarUrl: profile.avatarUrl || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Error saving profile to Firestore:", err);
    }
  },

  onAuthStateSubscription(callback: (user: UserProfile | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let profile = await this.fetchFirestoreProfile(fbUser.uid);
        if (!profile) {
          profile = {
            id: fbUser.uid,
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "Student Scholar",
            email: fbUser.email || "",
            isGuest: false,
            university: "University Scholar",
            college: "University Scholar",
            major: "Computer Science",
            course: "Computer Science",
            year: "Undergraduate",
            yearOfStudy: "Undergraduate",
            targetRole: "Software Engineer",
            studyStreakDays: 1,
            totalStudyHours: 0,
            completedTasksCount: 0,
            averageQuizScore: 0,
            joinedDate: "Today",
            theme: (localStorage.getItem("edumentor_theme") as "dark" | "light") || "light",
            avatarUrl: fbUser.photoURL || undefined,
          };
          await this.saveFirestoreProfile(profile);
        }
        storage.saveUser(profile);
        callback(profile);
      } else {
        const stored = storage.getUser();
        if (stored.isGuest) {
          callback(stored);
        } else {
          callback(null);
        }
      }
    });
  },
};
