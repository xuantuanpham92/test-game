"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { GRADE_OPTIONS, SUBJECT_OPTIONS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SCORE_RANGES = [
  { value: "", label: "不填" },
  { value: "0-30", label: "0-30分" },
  { value: "30-60", label: "30-60分" },
  { value: "60-80", label: "60-80分" },
  { value: "80-100", label: "80-100分" },
  { value: "100-120", label: "100-120分" },
  { value: "120-150", label: "120-150分" },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

interface SelectFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  error?: string;
}

function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  error,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-pink-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-gray-900 appearance-none cursor-pointer transition-colors outline-none focus:ring-4 focus:ring-primary-500/10 ${
          error
            ? "border-pink-400 focus:border-pink-500"
            : "border-gray-200 hover:border-primary-300 focus:border-primary-500"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
          paddingRight: "2.5rem",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-pink-500 mt-1">{error}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
}

function TextField({
  label,
  required,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: TextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-pink-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors outline-none focus:ring-4 focus:ring-primary-500/10 ${
          error
            ? "border-pink-400 focus:border-pink-500"
            : "border-gray-200 hover:border-primary-300 focus:border-primary-500"
        }`}
      />
      {error && <p className="text-xs text-pink-500 mt-1">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [grade, setGrade] = useState("");
  const [weakSubject, setWeakSubject] = useState("");
  const [scoreRange, setScoreRange] = useState("");
  const [targetScore, setTargetScore] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!grade) next.grade = "请选择年级";
    if (!weakSubject) next.weakSubject = "请选择薄弱科目";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      /* ---- Step 1: Create user ---- */
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname || undefined,
          grade,
          weakSubject,
          latestScoreRange: scoreRange || undefined,
          targetScore: targetScore || undefined,
        }),
      });

      const userJson = await userRes.json();

      if (!userJson.success) {
        setSubmitError(userJson.error || "提交失败，请重试");
        setIsSubmitting(false);
        return;
      }

      const userId = userJson.data.userId as string;

      /* ---- Step 2: Create test session ---- */
      const sessionRes = await fetch("/api/test-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const sessionJson = await sessionRes.json();

      if (!sessionJson.success) {
        setSubmitError(sessionJson.error || "创建测试会话失败，请重试");
        setIsSubmitting(false);
        return;
      }

      const sessionId = sessionJson.data.sessionId as string;

      /* ---- Step 3: Redirect to test ---- */
      router.push(`/test?sessionId=${sessionId}`);
    } catch {
      setSubmitError("网络错误，请检查网络后重试");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-primary-50/40 to-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-500 transition-colors mb-6"
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
          返回首页
        </Link>

        <Card padding="lg" className="shadow-lg border-primary-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl mb-4 shadow-sm">
              📋
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              开始测试前，先告诉我们你的基本情况
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              这将帮助我们生成更准确的弱科人格画像
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <TextField
              label="昵称"
              value={nickname}
              onChange={setNickname}
              placeholder="选填，可用于后续查看报告"
            />

            <SelectField
              label="年级"
              required
              value={grade}
              onChange={setGrade}
              options={GRADE_OPTIONS}
              placeholder="请选择你的年级"
              error={errors.grade}
            />

            <SelectField
              label="薄弱科目"
              required
              value={weakSubject}
              onChange={setWeakSubject}
              options={SUBJECT_OPTIONS}
              placeholder="请选择你最想提升的科目"
              error={errors.weakSubject}
            />

            <SelectField
              label="最近分数区间"
              value={scoreRange}
              onChange={setScoreRange}
              options={SCORE_RANGES}
              placeholder="选填，参考即可"
            />

            <TextField
              label="目标分数"
              value={targetScore}
              onChange={setTargetScore}
              placeholder="选填，你的期待分数"
            />

            {/* Submit error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
              >
                {submitError}
              </motion.div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "正在准备测试..." : "开始测评"}
              {!isSubmitting && (
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </Button>
          </form>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          测评大约需要 3 分钟，请根据自己的真实情况作答
        </p>
      </motion.div>
    </div>
  );
}
