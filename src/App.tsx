import React, { useState, useEffect } from "react";
import { ActiveView, UserProfile, StudyPlan, QuizResult, ResearchReport } from "./types";
import { storage } from "./services/storage";
import { authService } from "./services/auth";
import { firestoreSync } from "./services/firestoreSync";
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { ToastContainer, ToastMessage } from "./components/common/Toast";
import { AuthModal } from "./components/common/AuthModal";
import { ProtectedGate } from "./components/common/ProtectedGate";

// Views
import { LandingPage } from "./components/landing/LandingPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { UserProfileView } from "./components/profile/UserProfileView";
import { DashboardOverview } from "./components/dashboard/DashboardOverview";
import { AIAssistant } from "./components/chat/AIAssistant";
import { DeepResearch } from "./components/research/DeepResearch";
import { PDFAnalyzer } from "./components/pdf/PDFAnalyzer";
import { StudyPlanner } from "./components/planner/StudyPlanner";
import { CareerGuidance } from "./components/career/CareerGuidance";
import { QuizGenerator } from "./components/quiz/QuizGenerator";
import { LearningResources } from "./components/resources/LearningResources";
import { ProgressTracker } from "./components/progress/ProgressTracker";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { ResearchHistory } from "./components/history/ResearchHistory";
import { SettingsView } from "./components/settings/SettingsView";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("landing");
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => storage.getStudyPlan());
  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => storage.getQuizResults());
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync theme with document element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateSubscription(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (!firebaseUser.isGuest) {
          const cloudData = await firestoreSync.syncUserDataFromCloud(firebaseUser.id);
          if (cloudData.studyPlan) {
            setStudyPlan((prev) => ({
              ...prev,
              ...cloudData.studyPlan,
              priorityTasks: Array.isArray(cloudData.studyPlan?.priorityTasks)
                ? cloudData.studyPlan.priorityTasks
                : prev.priorityTasks || [],
              dailyBreakdown: Array.isArray(cloudData.studyPlan?.dailyBreakdown)
                ? cloudData.studyPlan.dailyBreakdown
                : prev.dailyBreakdown || [],
              revisionSchedule: Array.isArray(cloudData.studyPlan?.revisionSchedule)
                ? cloudData.studyPlan.revisionSchedule
                : prev.revisionSchedule || [],
              breakRecommendations: Array.isArray(cloudData.studyPlan?.breakRecommendations)
                ? cloudData.studyPlan.breakRecommendations
                : prev.breakRecommendations || [],
            }));
          }
          if (cloudData.quizResults && Array.isArray(cloudData.quizResults)) {
            setQuizResults(cloudData.quizResults);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addToast = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description?: string
  ) => {
    const id = "toast-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    storage.saveUser({ ...user, theme: nextTheme });
    addToast("info", `${nextTheme === "dark" ? "Dark" : "Light"} mode activated`);
  };

  const handleAuthSuccess = (authUser: UserProfile) => {
    setUser(authUser);
    addToast(
      "success",
      `Welcome, ${authUser.name}!`,
      authUser.isGuest ? "You are browsing in Guest Mode." : "Signed in successfully. Personal progress is cloud-synced."
    );
    // After successful login, redirect the user to the EduMentor AI Dashboard
    setActiveView("dashboard");
  };

  const handleLogout = async () => {
    await authService.logout();
    const guestUser = authService.getCurrentUser();
    setUser(guestUser);
    addToast("info", "Logged Out", "You are now in Guest Mode. Personal history will not sync.");
    setActiveView("landing");
  };

  const handleSelectReportFromHistory = (report: ResearchReport) => {
    storage.saveResearchReport(report);
    setActiveView("research");
  };

  const handleQuickQuiz = () => {
    setActiveView("quiz");
  };

  // Dedicated Auth Pages (Login, Register, Forgot Password)
  const isAuthPage =
    activeView === "login" ||
    activeView === "register" ||
    activeView === "forgot-password";

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } font-sans antialiased`}
    >
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Auth Modal (for modal popups anywhere in app) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* View Router */}
      {activeView === "landing" ? (
        <LandingPage
          onGetStarted={() => setActiveView("dashboard")}
          onTryAsGuest={() => {
            const guest = authService.loginAsGuest();
            setUser(guest);
            setActiveView("dashboard");
            addToast("success", "Guest Session Started", "Explore all features without signing up!");
          }}
          onSelectFeature={(view) => setActiveView(view)}
          onLogin={() => setActiveView("login")}
          onRegister={() => setActiveView("register")}
        />
      ) : isAuthPage ? (
        <div className="py-6 px-4">
          {activeView === "login" && (
            <LoginPage
              onSuccess={handleAuthSuccess}
              onNavigateRegister={() => setActiveView("register")}
              onNavigateForgotPassword={() => setActiveView("forgot-password")}
              onContinueAsGuest={() => {
                const guest = authService.loginAsGuest();
                setUser(guest);
                setActiveView("dashboard");
                addToast("info", "Guest Mode", "Exploring without an account.");
              }}
            />
          )}

          {activeView === "register" && (
            <RegisterPage
              onSuccess={handleAuthSuccess}
              onNavigateLogin={() => setActiveView("login")}
              onContinueAsGuest={() => {
                const guest = authService.loginAsGuest();
                setUser(guest);
                setActiveView("dashboard");
                addToast("info", "Guest Mode", "Exploring without an account.");
              }}
            />
          )}

          {activeView === "forgot-password" && (
            <ForgotPasswordPage onNavigateLogin={() => setActiveView("login")} />
          )}
        </div>
      ) : (
        /* Workspace Shell (Sidebar + Main View) */
        <div className="flex">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            user={user}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {/* Dashboard Overview */}
            {activeView === "dashboard" && (
              <DashboardOverview
                user={user}
                studyPlan={studyPlan}
                quizResults={quizResults}
                setActiveView={setActiveView}
                onQuickQuiz={handleQuickQuiz}
              />
            )}

            {/* AI Assistant */}
            {activeView === "chat" && <AIAssistant onNotify={addToast} />}

            {/* Deep Research */}
            {activeView === "research" && (
              <DeepResearch
                onNotify={addToast}
                onOpenHistory={() => setActiveView("history")}
              />
            )}

            {/* PDF Analyzer */}
            {activeView === "pdf" && <PDFAnalyzer onNotify={addToast} />}

            {/* Study Planner */}
            {activeView === "planner" && (
              <StudyPlanner
                studyPlan={studyPlan}
                onUpdatePlan={(newPlan) => setStudyPlan(newPlan)}
                onNotify={addToast}
              />
            )}

            {/* Career Guidance */}
            {activeView === "career" && <CareerGuidance onNotify={addToast} />}

            {/* Quiz Generator */}
            {activeView === "quiz" && (
              <QuizGenerator
                onNotify={addToast}
                onQuizCompleted={(res) => {
                  setQuizResults(storage.getQuizResults());
                  setUser(storage.getUser());
                }}
              />
            )}

            {/* Learning Resources */}
            {activeView === "resources" && <LearningResources onNotify={addToast} />}

            {/* Protected Route: Progress Tracker */}
            {activeView === "progress" && (
              user.isGuest ? (
                <ProtectedGate
                  featureName="Personal Progress Tracker"
                  description="Track your academic streaks, study milestones, task completions, and subject masteries securely in Firestore."
                  onNavigateLogin={() => setActiveView("login")}
                  onNavigateRegister={() => setActiveView("register")}
                  allowPreview={true}
                >
                  <ProgressTracker
                    user={user}
                    studyPlan={studyPlan}
                    quizResults={quizResults}
                    onNotify={addToast}
                    onUpdateUser={(u) => setUser(u)}
                  />
                </ProtectedGate>
              ) : (
                <ProgressTracker
                  user={user}
                  studyPlan={studyPlan}
                  quizResults={quizResults}
                  onNotify={addToast}
                  onUpdateUser={(u) => setUser(u)}
                />
              )
            )}

            {/* Analytics Dashboard */}
            {activeView === "analytics" && (
              <AnalyticsDashboard
                user={user}
                quizResults={quizResults}
                studyPlan={studyPlan}
              />
            )}

            {/* Protected Route: Research History */}
            {activeView === "history" && (
              user.isGuest ? (
                <ProtectedGate
                  featureName="Research History"
                  description="Your generated academic research reports, key findings, and canonical citations are securely archived in Firestore."
                  onNavigateLogin={() => setActiveView("login")}
                  onNavigateRegister={() => setActiveView("register")}
                  allowPreview={true}
                >
                  <ResearchHistory
                    onSelectReport={handleSelectReportFromHistory}
                    setActiveView={setActiveView}
                    onNotify={addToast}
                  />
                </ProtectedGate>
              ) : (
                <ResearchHistory
                  onSelectReport={handleSelectReportFromHistory}
                  setActiveView={setActiveView}
                  onNotify={addToast}
                />
              )
            )}

            {/* User Profile View */}
            {activeView === "profile" && (
              <UserProfileView
                user={user}
                onUpdateUser={(u) => setUser(u)}
                onLogout={handleLogout}
                onOpenAuth={() => setActiveView("login")}
                onNotify={addToast}
              />
            )}

            {/* Settings View */}
            {activeView === "settings" && (
              <SettingsView
                user={user}
                onUpdateUser={(u) => setUser(u)}
                onNotify={addToast}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
