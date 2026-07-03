"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
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

const SCALE_LEVELS = [
  { key: "1", label: "非常符合" },
  { key: "2", label: "比较符合" },
  { key: "3", label: "一般" },
  { key: "4", label: "不太符合" },
  { key: "5", label: "非常不符合" },
];

function ScaleSelector({
  selectedKey,
  onSelect,
  disabled,
}: {
  selectedKey: string | null;
  onSelect: (key: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-3">
      {/* Horizontal scale — desktop */}
      <div className="hidden sm:flex items-end justify-between gap-2">
        {SCALE_LEVELS.map((level) => {
          const isSelected = selectedKey === level.key;
          return (
            <button
              key={level.key}
              type="button"
              onClick={() => onSelect(level.key)}
              disabled={disabled}
              className={`flex flex-col items-center gap-2 flex-1 rounded-2xl py-4 px-2 transition-all duration-200 cursor-pointer border-2 ${
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10 scale-105"
                  : "border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/20"
              } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${
                  isSelected
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {level.key}
              </span>
              <span
                className={`text-xs font-medium transition-colors ${
                  isSelected ? "text-primary-600" : "text-gray-500"
                }`}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vertical scale — mobile */}
      <div className="sm:hidden space-y-2">
        {SCALE_LEVELS.map((level) => {
          const isSelected = selectedKey === level.key;
          return (
            <button
              key={level.key}
              type="button"
              onClick={() => onSelect(level.key)}
              disabled={disabled}
              className={`w-full flex items-center gap-4 rounded-xl py-3 px-4 transition-all duration-200 cursor-pointer border-2 ${
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10"
                  : "border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/20"
              } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <span
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base font-bold transition-colors ${
                  isSelected
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {level.key}
              </span>
              <span
                className={`text-sm font-medium transition-colors ${
                  isSelected ? "text-primary-600" : "text-gray-600"
                }`}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
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
  const [failedSaves, setFailedSaves] = useState<Set<string>>(new Set());

  /* ---- Abort controller for cancelling in-flight save requests ---- */
  const saveAbortRef = useRef<AbortController | null>(null);

  /* ---- Brief lock after jumping to prevent accidental clicks ---- */
  const [jumpLock, setJumpLock] = useState(false);

  /* ---- Submitting state ---- */
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

  /* ---- Save answer to server (fire-and-forget except for last question) ---- */
  const saveAnswer = useCallback(
    async (questionId: string, selectedOption: string, signal?: AbortSignal) => {
      if (!sessionId) return false;
      try {
        const res = await fetch("/api/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, questionId, selectedOption }),
          signal,
        });
        const json = await res.json();
        if (!json.success) {
          setFailedSaves((prev) => new Set(prev).add(questionId));
          return false;
        }
        setSavedAnswers((prev) => new Set(prev).add(questionId));
        setFailedSaves((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
        return true;
      } catch (e: any) {
        if (e?.name === "AbortError") return false;
        setFailedSaves((prev) => new Set(prev).add(questionId));
        return false;
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

  /* ---- Check if all questions are answered ---- */
  const allAnswered = answeredCount >= totalQuestions;
  const hasFailedSaves = failedSaves.size > 0;

  /* ---- Retry failed saves ---- */
  async function retryFailedSaves() {
    const toRetry = [...failedSaves];
    for (const qId of toRetry) {
      const answer = answers[qId];
      if (answer) await saveAnswer(qId, answer);
    }
  }

  /* ---- Select an option — optimistic: jump immediately, save in background ---- */
  async function handleSelectOption(optionKey: string) {
    if (!currentQuestion || isGeneratingReport || jumpLock) return;

    // Cancel previous in-flight save
    saveAbortRef.current?.abort();

    // Update local state immediately
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionKey }));

    const isLastQuestion = currentIndex >= totalQuestions - 1;
    const qId = currentQuestion.id;

    if (isLastQuestion) {
      // Last question: synchronous save — must confirm before showing submit
      const ok = await saveAnswer(qId, optionKey);
      if (!ok) {
        setSubmitError("答案保存失败，请重试");
        return;
      }
      setSubmitError(null);
    } else {
      // Non-last: background save, jump immediately
      const controller = new AbortController();
      saveAbortRef.current = controller;
      saveAnswer(qId, optionKey, controller.signal);

      setCurrentIndex([currentIndex + 1, 1]);
      setSubmitError(null);

      // Brief lock to prevent accidental rapid clicks on next question
      setJumpLock(true);
      setTimeout(() => setJumpLock(false), 200);
    }
  }

  /* ---- Navigate to next question (or finish) — also called by prev/next buttons ---- */
  async function handleNext() {
    if (!currentQuestion) return;

    const currentAnswer = answers[currentQuestion.id];

    // Must answer current question before proceeding
    if (!currentAnswer) {
      setSubmitError("请先回答本题再继续");
      return;
    }

    // Save answer if not yet saved (synchronous, user explicitly clicked "next")
    if (!savedAnswers.has(currentQuestion.id)) {
      const ok = await saveAnswer(currentQuestion.id, currentAnswer);
      if (!ok) {
        setSubmitError("保存失败，请重试");
        return;
      }
    }

    if (currentIndex >= totalQuestions - 1) {
      // On last question — check if all answered before submitting
      if (!allAnswered) {
        setSubmitError(`还有 ${totalQuestions - answeredCount} 道题未作答，请完成全部题目后提交`);
        return;
      }
      if (hasFailedSaves) {
        setSubmitError("有答案尚未保存成功，请点击重试按钮");
        return;
      }
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
          <div className="mb-6">
            <p className="text-sm font-semibold text-primary-500">
              第 {currentIndex + 1} / {totalQuestions} 题
            </p>
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
                    {/* Title — 场景陈述 */}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-snug">
                      {currentQuestion.title}
                    </h2>

                    {/* Description */}
                    {currentQuestion.description && (
                      <p className="text-sm text-gray-500 mb-5">
                        {currentQuestion.description}
                      </p>
                    )}

                    {/* Hint */}
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-6 inline-flex items-center gap-1.5">
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
                      请根据你的真实情况选择符合程度，不是选&ldquo;正确答案&rdquo;。
                    </p>

                    {/* 5-level scale selector */}
                    <ScaleSelector
                      selectedKey={answers[currentQuestion.id] ?? null}
                      onSelect={handleSelectOption}
                      disabled={jumpLock || isGeneratingReport}
                    />
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Failed saves banner */}
          {hasFailedSaves && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700 flex items-center justify-between"
            >
              <span>
                ⚠️ {failedSaves.size} 道题的答案保存失败，网络恢复后点击重试
              </span>
              <button
                onClick={retryFailedSaves}
                className="ml-3 shrink-0 rounded-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors"
              >
                重试
              </button>
            </motion.div>
          )}

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
              disabled={
                jumpLock ||
                isGeneratingReport ||
                (currentIndex >= totalQuestions - 1 && !allAnswered)
              }
              title={
                currentIndex >= totalQuestions - 1 && !allAnswered
                  ? `还有 ${totalQuestions - answeredCount} 题未作答`
                  : ""
              }
            >
              {isGeneratingReport
                ? "正在生成报告..."
                : currentIndex >= totalQuestions - 1
                ? `完成测试 · 查看结果${!allAnswered ? ` (${totalQuestions - answeredCount}题未答)` : ""}`
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
