import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QuizQuestion, QuizResult } from "../../types";
import { api } from "../../services/api";
import { storage } from "../../services/storage";

interface QuizGeneratorProps {
  onNotify: (type: "success" | "error" | "info" | "warning", title: string, desc?: string) => void;
  onQuizCompleted?: (result: QuizResult) => void;
}

const TOPICS = [
  "Binary Search Trees & AVL Rotations",
  "Graph Algorithms: Dijkstra & Bellman-Ford",
  "Operating Systems: Concurrency & Semaphores",
  "Relational Databases: Indexing & Normalization",
  "Computer Networks: TCP/IP & Congestion Control",
  "Dynamic Programming & Memoization",
];

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  onNotify,
  onQuizCompleted,
}) => {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [subject, setSubject] = useState("Computer Science");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate"
  );
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  // Active Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setQuestions([]);
    setUserAnswers({});
    setSubmitted(false);
    setCurrentIdx(0);
    setActiveResult(null);

    try {
      const generated = await api.generateQuiz({
        topic,
        subject,
        difficulty,
        numQuestions: count,
      });
      setQuestions(generated.questions);
      onNotify("success", "Quiz generated", `${generated.questions.length} questions prepared.`);
    } catch (err: any) {
      onNotify("error", "Quiz generation failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (submitted || !questions.length) return;

    let score = 0;
    const answeredMap: Array<{ questionId: number; selectedIndex: number; isCorrect: boolean }> =
      [];

    questions.forEach((q, idx) => {
      const selected = userAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) score += 1;
      answeredMap.push({
        questionId: q.id,
        selectedIndex: selected,
        isCorrect,
      });
    });

    const percentage = Math.round((score / questions.length) * 100);

    const result: QuizResult = {
      id: "qz-" + Date.now(),
      quizTitle: `${difficulty} Quiz: ${topic}`,
      subject,
      difficulty,
      score,
      totalQuestions: questions.length,
      percentage,
      date: new Date().toLocaleDateString(),
      userAnswers: answeredMap,
      questions,
    };

    setSubmitted(true);
    setActiveResult(result);
    storage.saveQuizResult(result);
    onQuizCompleted?.(result);

    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      onNotify("success", `Outstanding Score! ${score}/${questions.length}`, `You scored ${percentage}%!`);
    } else {
      onNotify("info", `Quiz Complete: ${score}/${questions.length}`, `Score: ${percentage}%. Review diagnostic explanations below.`);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setSubmitted(false);
    setCurrentIdx(0);
    setActiveResult(null);
  };

  const q = questions[currentIdx];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
              AI Diagnostic Quiz Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Active recall practice exams with deep theoretical misconception analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Topic / Concept to Test
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Red-Black Tree Rotations, Page Replacement Algorithms"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Academic Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 font-medium">Difficulty:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        difficulty === lvl
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 font-medium">Questions:</span>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs shadow-xs"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{loading ? "Synthesizing Questions..." : "Generate Practice Exam"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Question Runner */}
      {questions.length > 0 && !submitted && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-blue-600 border border-slate-200">
              {difficulty}
            </span>
          </div>

          {/* Question Text */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {q.questionText}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(q?.options || []).map((option, optIdx) => {
              const isSelected = userAnswers[currentIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentIdx, optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-600 text-slate-900 font-semibold ring-1 ring-blue-600"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation & Submit Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-sm"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submitted Review Mode */}
      {submitted && activeResult && (
        <div className="space-y-6">
          {/* Result Score Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-blue-600 border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              Score: {activeResult.score} / {activeResult.totalQuestions} ({activeResult.percentage}%)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              {activeResult.percentage >= 80
                ? "Brilliant mastery! You have demonstrated exceptional conceptual command."
                : "Good effort! Review the diagnostic feedback below to fortify weak areas before the final."}
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => handleGenerateQuiz()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-sm"
              >
                Generate Fresh Quiz
              </button>
            </div>
          </div>

          {/* Diagnostic Explanations per question */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Question-by-Question Diagnostic Review
            </h3>
            {(questions || []).map((q, idx) => {
              const selectedOpt = userAnswers[idx];
              const isCorrect = selectedOpt === q.correctAnswerIndex;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {idx + 1}. {q.questionText}
                    </h4>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 shrink-0">
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>

                  {/* Options display */}
                  <div className="space-y-1.5 my-3">
                    {(q?.options || []).map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = q.correctAnswerIndex === optIdx;
                      let style = "bg-slate-50 text-slate-600 border-slate-200";
                      if (isThisCorrect) style = "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold";
                      else if (isThisSelected) style = "bg-rose-50 text-rose-800 border-rose-300";

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          {isThisCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-600">
                              Correct Answer
                            </span>
                          )}
                          {!isThisCorrect && isThisSelected && (
                            <span className="text-[10px] uppercase font-bold text-rose-600">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Pedagogical Explanation */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-blue-700 font-bold block mb-1">
                      💡 Deep Pedagogical Explanation:
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
