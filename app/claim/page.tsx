"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SectionTitle from "@/components/common/SectionTitle";
import { useToast } from "@/components/common/Toast";
import { GRADE_OPTIONS, SUBJECT_OPTIONS } from "@/lib/constants";

// ── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  phone: string;
  wechat: string;
  grade: string;
  weakSubject: string;
}

interface FormErrors {
  phone?: string;
  wechat?: string;
  grade?: string;
  weakSubject?: string;
  general?: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  "基于你的人格类型的深度分析报告",
  "详细的八维学习能力解读",
  "个性化的每日训练计划",
  "薄弱环节专项突破方案",
  "学习习惯培养建议",
];

// ── Main ────────────────────────────────────────────────────────────────────

function ClaimPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId") || "";
  const { showToast } = useToast();

  const [form, setForm] = useState<FormData>({
    phone: "",
    wechat: "",
    grade: "",
    weakSubject: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Validation ──
  function validate(): boolean {
    const errs: FormErrors = {};

    // Phone validation
    if (form.phone.trim()) {
      if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
        errs.phone = "请输入正确的11位手机号";
      }
    }

    // At least one of phone or wechat
    if (!form.phone.trim() && !form.wechat.trim()) {
      errs.general = "请至少填写手机号或微信号";
    }

    // Grade required
    if (!form.grade) {
      errs.grade = "请选择年级";
    }

    // Weak subject required
    if (!form.weakSubject) {
      errs.weakSubject = "请选择薄弱科目";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ──
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors({});

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone.trim() || undefined,
          wechat: form.wechat.trim() || undefined,
          grade: form.grade,
          weakSubject: form.weakSubject,
          reportId: reportId || undefined,
          note: `来自报告 ${reportId} 的计划领取`,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "提交失败，请稍后重试");
      }

      setSuccess(true);
      showToast("信息已提交成功", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "提交失败，请稍后重试";
      setErrors({ general: message });
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Update field ──
  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  // ── States ──

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-full max-w-md"
        >
          <Card padding="lg" className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              已收到你的信息
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              我们会根据你的弱科人格画像生成更详细的学习建议，请留意后续的联系。
            </p>

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  if (reportId) {
                    router.push(`/result/${reportId}`);
                  } else {
                    router.push("/");
                  }
                }}
              >
                {reportId ? "返回报告" : "返回首页"}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionTitle
            title="领取你的完整弱科提升计划"
            subtitle="填写信息，获取基于你弱科人格画像的详细学习方案"
            centered
            className="mb-2"
          />

          {/* Value props */}
          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {VALUE_PROPS.map((prop, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 text-xs text-gray-600 shadow-sm"
              >
                <span className="w-1 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                {prop}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* General error */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {errors.general}
                </div>
              )}

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  手机号
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="请输入手机号"
                  maxLength={11}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 ${
                    errors.phone
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Wechat */}
              <div>
                <label
                  htmlFor="wechat"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  微信号
                </label>
                <input
                  id="wechat"
                  type="text"
                  value={form.wechat}
                  onChange={(e) => updateField("wechat", e.target.value)}
                  placeholder="请输入微信号"
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 ${
                    errors.wechat
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                />
                {errors.wechat && (
                  <p className="mt-1 text-xs text-red-500">{errors.wechat}</p>
                )}
              </div>

              {/* Grade */}
              <div>
                <label
                  htmlFor="grade"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  年级 <span className="text-red-400">*</span>
                </label>
                <select
                  id="grade"
                  value={form.grade}
                  onChange={(e) => updateField("grade", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 appearance-none bg-no-repeat ${
                    errors.grade
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="" disabled>
                    请选择年级
                  </option>
                  {GRADE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="mt-1 text-xs text-red-500">{errors.grade}</p>
                )}
              </div>

              {/* Weak Subject */}
              <div>
                <label
                  htmlFor="weakSubject"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  薄弱科目 <span className="text-red-400">*</span>
                </label>
                <select
                  id="weakSubject"
                  value={form.weakSubject}
                  onChange={(e) => updateField("weakSubject", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 appearance-none bg-no-repeat ${
                    errors.weakSubject
                      ? "border-red-300 bg-red-50/30"
                      : "border-gray-200 bg-white"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  <option value="" disabled>
                    请选择薄弱科目
                  </option>
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.weakSubject && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.weakSubject}
                  </p>
                )}
              </div>

              {/* Hidden reportId */}
              {reportId && (
                <input type="hidden" name="reportId" value={reportId} />
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={submitting}
              >
                提交信息，获取完整计划
              </Button>

              {/* Privacy note */}
              <p className="text-xs text-gray-400 text-center mt-3">
                你的信息仅用于生成个性化学习建议，不会被用于其他用途
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">加载中...</div></div>}>
      <ClaimPageContent />
    </Suspense>
  );
}
