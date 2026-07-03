"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import LoadingSpinner from "@/components/common/LoadingSpinner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Option {
  key: string;
  text: string;
}

interface Question {
  id: string;
  type: string;
  title: string;
  description: string | null;
  options: Option[];
  orderIndex: number;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function QuestionTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    SINGLE_CHOICE: "单选",
    MULTIPLE_CHOICE: "多选",
    SCALE: "量表",
    SCENARIO: "情景",
  };
  return (
    <span className="inline-flex rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-600">
      {labels[type] || type}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  /* ---- Fetch questions ---- */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  /* ---- Current question index & direction ---- */
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  /* ---- Answers state: questionId -> selected key(s) ---- */
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Set<string>>(new Set());

  /* ---- Submitting state ---- */
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ---- Derived ---- */
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] ?? null;
  const answeredCount = Object.keys(answers).length;

  /* ---- Fetch questions on mount ---- */
  useEffect(() => {
    if (!sessionId) {
      setQuestionsError("缺少测试会话ID，请从首页重新开始。");
      setIsLoadingQuestions(false);
      return;
    }

    async function loadQuestions() {
      try {
        const res = await fetch("/api/questions");
        const json = await res.json();
        if (!json.success) {
          setQuestionsError(json.error || "加载题目失败");
        } else {
          const sorted = (json.data as Question[]).sort(
            (a, b) => a.orderIndex - b.orderIndex
          );
          setQuestions(sorted);
        }
      } catch {
        setQuestionsError("网络错误，请检查网络后重试");
      } finally {
        setIsLoadingQuestions(false);
      }
    }

    loadQuestions();
  }, [sessionId]);

  /* ---- Save answer to server ---- */
  const saveAnswer = useCallback(
    async (questionId: string, selectedOption: string) => {
      if (!sessionId) return;
      setIsSubmittingAnswer(true);
      setSubmitError(null);
      try {
        const res = await fetch("/api/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, questionId, selectedOption }),
        });
        const json = await res.json();
        if (!json.success) {
          setSubmitError(json.error || "保存答案失败");
          return false;
        }
        setSavedAnswers((prev) => new Set(prev).add(questionId));
        return true;
      } catch {
        setSubmitError("网络错误，保存答案失败");
        return false;
      } finally {
        setIsSubmittingAnswer(false);
      }
    },
    [sessionId]
  );

  /* ---- Generate report and redirect ---- */
  const generateReport = useCallback(async () => {
    if (!sessionId) return;
    setIsGeneratingReport(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const json = await res.json();
      if (!json.success) {
        setSubmitError(json.error || "生成报告失败");
        setIsGeneratingReport(false);
        return;
      }
      router.push(`/generating?reportId=${json.data.reportId}`);
    } catch {
      setSubmitError("网络错误，生成报告失败");
      setIsGeneratingReport(false);
    }
  }, [sessionId, router]);

  /* ---- Select an option (single choice) — auto-advance to next question ---- */
  async function handleSelectOption(optionKey: string) {
    if (!currentQuestion || isSubmittingAnswer || isGeneratingReport) return;

    // Update local state immediately
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionKey }));

    // Save to server
    const ok = await saveAnswer(currentQuestion.id, optionKey);
    if (!ok) return;

    // Auto-advance after a short pause so the user can see their selection
    await new Promise((r) => setTimeout(r, 400));

    if (currentIndex >= totalQuestions - 1) {
      // Last question — generate report
      await generateReport();
    } else {
      setCurrentIndex([currentIndex + 1, 1]);
      setSubmitError(null);
    }
  }

  /* ---- Navigate to next question (or finish) — also called by prev/next buttons ---- */
  async function handleNext() {
    if (!currentQuestion) return;

    const currentAnswer = answers[currentQuestion.id];

    // Save answer if not yet saved
    if (currentAnswer && !savedAnswers.has(currentQuestion.id)) {
      const ok = await saveAnswer(currentQuestion.id, currentAnswer);
      if (!ok) return;
    }

    if (currentIndex >= totalQuestions - 1) {
      await generateReport();
    } else {
      setCurrentIndex([currentIndex + 1, 1]);
      setSubmitError(null);
    }
  }

  /* ---- Go to previous question ---- */
  function handlePrev() {
    if (currentIndex <= 0) return;
    setCurrentIndex([currentIndex - 1, -1]);
    setSubmitError(null);
  }

  /* ---- Jump to question by index ---- */
  function handleJumpToIndex(index: number) {
    setCurrentIndex([index, index > currentIndex ? 1 : -1]);
    setSubmitError(null);
  }

  /* ================================================================ */
  /*  Render: Loading / Error / Empty states                          */
  /* ================================================================ */

  if (!sessionId) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <Card padding="lg" className="max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">缺少会话信息</h2>
          <p className="text-sm text-gray-500 mb-6">
            请从首页重新开始测试。
          </p>
          <Link href="/">
            <Button variant="secondary">返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoadingQuestions) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <LoadingSpinner size="lg" text="正在加载测试题目..." />
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <Card padding="lg" className="max-w-md text-center">
          <div className="text-4xl mb-4">😞</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">加载失败</h2>
          <p className="text-sm text-gray-500 mb-6">{questionsError}</p>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            重新加载
          </Button>
        </Card>
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <Card padding="lg" className="max-w-md text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">暂无题目</h2>
          <p className="text-sm text-gray-500 mb-6">
            当前没有可用的测试题目，请联系管理员。
          </p>
          <Link href="/">
            <Button variant="secondary">返回首页</Button>
          </Link>
        </Card>
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: Question flow                                           */
  /* ================================================================ */

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col bg-gradient-to-b from-primary-50/30 to-white">
      {/* ---- Top bar ---- */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary-500 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              退出测试
            </Link>
            <span className="text-xs text-gray-400">
              已答 {answeredCount}/{totalQuestions} 题
            </span>
          </div>
          <ProgressBar
            current={currentIndex + 1}
            total={totalQuestions}
            showLabel={false}
          />
        </div>
      </div>

      {/* ---- Question area ---- */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-2xl">
          {/* Question counter */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-primary-500">
              第 {currentIndex + 1} / {totalQuestions} 题
            </p>
            {currentQuestion && (
              <QuestionTypeBadge type={currentQuestion.type} />
            )}
          </div>

          {/* Question card with slide animation */}
          <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion?.id ?? "empty"}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentQuestion && (
                  <Card padding="lg" className="shadow-md border-primary-100">
                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-snug">
                      {currentQuestion.title}
                    </h2>

                    {/* Description */}
                    {currentQuestion.description && (
                      <p className="text-sm text-gray-500 mb-6">
                        {currentQuestion.description}
                      </p>
                    )}

                    {/* Hint */}
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-5 inline-flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      不用选&ldquo;正确答案&rdquo;，选最像你的真实情况。
                    </p>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const isSelected =
                          answers[currentQuestion.id] === option.key;
                        return (
                          <motion.button
                            key={option.key}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectOption(option.key)}
                            disabled={isSubmittingAnswer || isGeneratingReport}
                            className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10 scale-[1.01]"
                                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30"
                            } ${
                              isSubmittingAnswer || isGeneratingReport
                                ? "opacity-60 pointer-events-none"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                                  isSelected
                                    ? "bg-primary-500 text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {option.key}
                              </span>
                              <span className="text-sm sm:text-base text-gray-800 leading-relaxed pt-0.5">
                                {option.text}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Submit error */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center"
            >
              {submitError}
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isGeneratingReport}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              上一题
            </Button>

            <Button
              onClick={handleNext}
              isLoading={isGeneratingReport}
              disabled={isSubmittingAnswer}
            >
              {isGeneratingReport
                ? "正在生成报告..."
                : currentIndex >= totalQuestions - 1
                ? "完成测试 · 查看结果"
                : "下一题"}
              {!isGeneratingReport && currentIndex < totalQuestions - 1 && (
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </Button>
          </div>

          {/* Question navigator dots */}
          <div className="mt-8 flex flex-wrap justify-center gap-1.5">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleJumpToIndex(idx)}
                  disabled={isGeneratingReport}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? "bg-primary-500 w-5"
                      : isAnswered
                      ? "bg-accent-400"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  title={`第 ${idx + 1} 题${isAnswered ? " (已答)" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">加载中...</div></div>}>
      <TestPageContent />
    </Suspense>
  );
}
