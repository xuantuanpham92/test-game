"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SectionTitle from "@/components/common/SectionTitle";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/common/Badge";
import { useToast } from "@/components/common/Toast";
import { DIMENSIONS, type DimensionKey } from "@/lib/constants";

// ── Types ───────────────────────────────────────────────────────────────────

interface PersonalityInfo {
  typeKey: string;
  name: string;
  slogan: string;
  illustrationUrl: string | null;
  themeColor: string;
  shortDescription: string;
  longDescription: string;
  typicalBehaviors: string[];
  advice: string[];
  dimensionKey: string;
}

interface ReportData {
  id: string;
  user: {
    id: string;
    nickname: string | null;
    grade: string | null;
    weakSubject: string | null;
  };
  primaryType: PersonalityInfo | null;
  secondaryType: { key: string; name: string } | null;
  hiddenRiskType: { key: string; name: string } | null;
  strengthDimension: string;
  dimensionScores: Record<DimensionKey, number>;
  summaryText: string;
  sevenDayPlan: string[];
  trainingAdvice: string[];
  createdAt: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

const PERSONALITY_EMOJIS: Record<string, string> = {
  condition_leaker: "\u{1F573}️", // 🕳️
  formula_sleeper: "\u{1F4A4}", // 💤
  variant_lost: "\u{1F300}", // 🌀
  calculation_crasher: "\u{1F697}", // 🚗
  review_disconnected: "\u{1F4E1}", // 📡
  expression_offline: "\u{1F4DD}", // 📝
  final_boss_lost: "\u{1F3D4}️", // 🏔️
  time_blackhole: "⏰", // ⏰
};

const RADAR_LABELS: Record<DimensionKey, string> = {
  condition: "条件识别力",
  formula: "公式唤醒力",
  transfer: "题型迁移力",
  calculation: "计算稳定性",
  review: "复盘转化力",
  expression: "表达规范性",
  complex: "压轴拆解力",
  time: "时间控制力",
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function getDimensionName(key: string): string {
  return (
    RADAR_LABELS[key as DimensionKey] ||
    DIMENSIONS[key as DimensionKey] ||
    key
  );
}

// ── Animations ──────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Sub-components ──────────────────────────────────────────────────────────

/** Skeleton placeholder while loading */
function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="h-[90vh] bg-gray-200 animate-pulse flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-300" />
        <div className="h-8 w-64 rounded-lg bg-gray-300" />
        <div className="h-5 w-48 rounded bg-gray-300" />
      </div>
      {/* Content skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

/** Hero section with personality reveal */
function HeroSection({
  report,
  onSave,
  onShare,
}: {
  report: ReportData;
  onSave: () => void;
  onShare: () => void;
}) {
  const personality = report.primaryType;
  const typeKey = personality?.typeKey || "";
  const emoji = PERSONALITY_EMOJIS[typeKey] || "\u{1F9E0}";
  const themeColor = personality?.themeColor || "#6366F1";

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}08 40%, #1e1b4b 100%)`,
        }}
      />
      {/* Radial accent */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${themeColor}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Emoji */}
        <motion.div
          className="text-7xl md:text-8xl mb-6"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          {emoji}
        </motion.div>

        {/* Label */}
        <motion.p
          className="text-sm md:text-base font-medium tracking-widest text-gray-400 uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          你的弱科人格
        </motion.p>

        {/* Personality name */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500 bg-clip-text text-transparent">
            {personality?.name || typeKey}
          </span>
        </motion.h1>

        {/* Slogan */}
        <motion.p
          className="text-lg md:text-xl text-gray-500 mb-10 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {personality?.slogan || ""}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex gap-3 flex-wrap justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button variant="outline" onClick={onSave}>
            保存报告
          </Button>
          <Button variant="primary" onClick={onShare}>
            分享报告
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

/** Three personality type cards: primary, secondary, hiddenRisk */
function PersonalityCards({ report }: { report: ReportData }) {
  const primary = report.primaryType;
  const primaryKey = primary?.typeKey || "";
  const emoji = PERSONALITY_EMOJIS[primaryKey] || "\u{1F9E0}";
  const themeColor = primary?.themeColor || "#6366F1";

  const cards = [
    {
      label: "主人格",
      name: primary?.name || primaryKey,
      desc: primary?.shortDescription || "这是你最主要的弱科人格类型",
      emoji,
      highlighted: true,
      color: themeColor,
    },
    {
      label: "副人格",
      name: report.secondaryType?.name || "暂无",
      desc: report.secondaryType
        ? "次要的人格倾向，与主人格相互作用"
        : "未检测到明显的副人格倾向",
      emoji: report.secondaryType
        ? PERSONALITY_EMOJIS[report.secondaryType?.key || ""] || "\u{1F9E0}"
        : "✨",
      highlighted: false,
      color: "#8B5CF6",
    },
    {
      label: "隐藏风险",
      name: report.hiddenRiskType?.name || "暂无",
      desc: report.hiddenRiskType
        ? "需要特别关注，避免在压力下暴露短板"
        : "暂无明显隐藏风险",
      emoji: report.hiddenRiskType
        ? PERSONALITY_EMOJIS[report.hiddenRiskType?.key || ""] || "⚠️"
        : "✅",
      highlighted: false,
      color: "#F59E0B",
    },
  ];

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <SectionTitle title="人格类型分析" centered className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            custom={i}
            className={`relative rounded-2xl p-6 ${
              card.highlighted
                ? "md:col-span-1 md:row-span-1"
                : ""
            }`}
            style={{
              background: card.highlighted
                ? `linear-gradient(135deg, ${card.color}10, ${card.color}05)`
                : "white",
              border: card.highlighted
                ? `2px solid ${card.color}40`
                : "1px solid #f3f4f6",
              boxShadow: card.highlighted
                ? `0 8px 32px ${card.color}15`
                : "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Highlight badge */}
            {card.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" size="sm">
                  {card.label}
                </Badge>
              </div>
            )}

            {!card.highlighted && (
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                {card.label}
              </p>
            )}

            <div className="flex items-center gap-3 mb-3 mt-1">
              <span className="text-3xl">{card.emoji}</span>
              <h3
                className={`font-bold ${
                  card.highlighted ? "text-xl" : "text-lg"
                } text-gray-900`}
              >
                {card.name}
              </h3>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/** Radar chart section */
function RadarSection({ report }: { report: ReportData }) {
  const scores = report.dimensionScores;
  const radarData = (Object.entries(scores) as [DimensionKey, number][]).map(
    ([key, value]) => ({
      dimension: RADAR_LABELS[key] || key,
      score: value,
      fullMark: 100,
    }),
  );

  // Find strength and weakest
  const entries = Object.entries(scores) as [DimensionKey, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <SectionTitle
          title="八维学习能力画像"
          subtitle="基于你的答题表现生成的多维度能力分析"
          centered
          className="mb-8"
        />
      </motion.div>

      {/* Chart */}
      <motion.div variants={fadeUp} custom={1}>
        <Card padding="lg">
          <ResponsiveContainer width="100%" height={420}>
            <RadarChart data={radarData} cx="50%" cy="50%">
              <PolarGrid stroke="#e5e7eb" strokeDasharray="4 4" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fontSize: 13, fill: "#6b7280", fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickCount={5}
                axisLine={false}
              />
              <Radar
                name="你的得分"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="#6366F1"
                fillOpacity={0.25}
                dot={{ fill: "#6366F1", r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{
                  fill: "#8B5CF6",
                  r: 6,
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Score grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6"
        variants={stagger}
      >
        {sorted.map(([key, score], i) => (
          <motion.div key={key} variants={fadeUp} custom={i}>
            <Card padding="sm" className="text-center">
              <p className="text-xs text-gray-400 mb-1">
                {RADAR_LABELS[key] || key}
              </p>
              <p
                className={`text-2xl font-extrabold ${
                  score >= 80
                    ? "text-green-500"
                    : score >= 60
                      ? "text-primary-500"
                      : score >= 40
                        ? "text-amber-500"
                        : "text-red-500"
                }`}
              >
                {score}
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      score >= 80
                        ? "#10b981"
                        : score >= 60
                          ? "linear-gradient(90deg, #6366F1, #8B5CF6)"
                          : score >= 40
                            ? "#f59e0b"
                            : "#ef4444",
                    width: `${score}%`,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Strength/weakest summary */}
      <motion.div
        className="flex gap-3 mt-4 text-sm text-gray-500 justify-center flex-wrap"
        variants={fadeUp}
        custom={8}
      >
        <span>
          最强维度：
          <strong className="text-green-600">
            {getDimensionName(strongest[0])}
          </strong>{" "}
          ({strongest[1]}分)
        </span>
        <span className="text-gray-300">|</span>
        <span>
          最需提升：
          <strong className="text-red-500">
            {getDimensionName(weakest[0])}
          </strong>{" "}
          ({weakest[1]}分)
        </span>
      </motion.div>
    </motion.section>
  );
}

/** Diagnosis summary */
function DiagnosisSection({ report }: { report: ReportData }) {
  const personality = report.primaryType;
  const themeColor = personality?.themeColor || "#6366F1";

  // Parse longDescription into sections by 【headers】
  const longDesc = personality?.longDescription || "";
  const sections = longDesc
    .split(/【(.+?)】/)
    .filter((s) => s.trim().length > 0);

  // Parse summary text paragraphs
  const summaryParagraphs = report.summaryText
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  const behaviors: string[] = personality?.typicalBehaviors || [];

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <SectionTitle title="综合诊断分析" centered className="mb-8" />
      </motion.div>

      <div className="space-y-6">
        {/* Summary intro */}
        <motion.div variants={fadeUp} custom={1}>
          <Card padding="lg" className="bg-gradient-to-br from-white to-primary-50/30">
            <div className="space-y-3">
              {summaryParagraphs.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed text-base">
                  {p}
                </p>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Detailed analysis from longDescription */}
        {sections.length > 0 && (
          <motion.div variants={fadeUp} custom={2}>
            <Card padding="lg">
              <div className="space-y-6">
                {sections.map((section, i) => {
                  // Odd indices after split are section headers
                  const isHeader = i % 2 === 0 && i < sections.length - 1;
                  if (isHeader) {
                    return (
                      <div key={i}>
                        <h3
                          className="text-lg font-bold mb-2"
                          style={{ color: themeColor }}
                        >
                          【{section}】
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                          {sections[i + 1]?.trim() || ""}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Typical behaviors */}
        {behaviors.length > 0 && (
          <motion.div variants={fadeUp} custom={3}>
            <Card padding="lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                典型行为表现
              </h3>
              <ul className="space-y-2">
                {behaviors.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                      style={{ backgroundColor: themeColor }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

/** Strength & Risk two-column section */
function StrengthRiskSection({ report }: { report: ReportData }) {
  const strengthName = getDimensionName(report.strengthDimension);
  const riskName = report.hiddenRiskType?.name || "无显著隐藏风险";

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <SectionTitle title="你的优势与风险" centered className="mb-8" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strength card */}
        <motion.div variants={fadeUp} custom={0}>
          <Card
            padding="lg"
            className="border-l-4 border-l-green-400 bg-gradient-to-br from-green-50/50 to-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{String.fromCodePoint(0x1F331)}</span>
              <h3 className="text-lg font-bold text-green-700">你的优势能力</h3>
            </div>
            <p className="text-2xl font-extrabold text-green-600 mb-2">
              {strengthName}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              这是你在八项能力中最突出的维度，建议以此为锚点，用强项带动弱项，建立学习信心。
            </p>
          </Card>
        </motion.div>

        {/* Risk card */}
        <motion.div variants={fadeUp} custom={1}>
          <Card
            padding="lg"
            className="border-l-4 border-l-amber-400 bg-gradient-to-br from-amber-50/50 to-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{String.fromCodePoint(0x26A0, 0xFE0F)}</span>
              <h3 className="text-lg font-bold text-amber-700">需要注意</h3>
            </div>
            <p className="text-2xl font-extrabold text-amber-600 mb-2">
              {riskName}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              这可能是你在考试压力下容易暴露的隐藏短板，提前识别能帮你规避失分风险。
            </p>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}

/** 7-day plan section */
function SevenDayPlanSection({ report }: { report: ReportData }) {
  const plan = report.sevenDayPlan || [];

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <SectionTitle
          title="七天提升计划"
          subtitle="每天一个小目标，逐步改善弱科现状"
          centered
          className="mb-8"
        />
      </motion.div>

      <div className="relative max-w-2xl mx-auto">
        {/* Vertical connecting line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-accent-300 to-pink-300 hidden md:block" />

        <div className="space-y-4">
          {plan.map((task, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="relative flex gap-6 items-start"
            >
              {/* Day number circle */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <div className="text-center">
                  <p className="text-white text-lg font-extrabold leading-none">
                    {i + 1}
                  </p>
                  <p className="text-white/70 text-[10px] leading-tight">Day</p>
                </div>
              </div>

              {/* Task card */}
              <Card padding="md" className="flex-1">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {task}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/** Training advice section */
function TrainingAdviceSection({ report }: { report: ReportData }) {
  const advice = report.trainingAdvice || [];

  // Group by 【category】 headers
  const groups: { category: string; items: string[] }[] = [];
  let currentGroup: { category: string; items: string[] } | null = null;

  for (const line of advice) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^【(.+)】$/);
    if (headerMatch) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { category: headerMatch[1], items: [] };
    } else if (currentGroup) {
      currentGroup.items.push(trimmed.replace(/^[•\-\s]+/, ""));
    } else {
      // Lines before any header
      if (!currentGroup) {
        currentGroup = { category: "学习建议", items: [] };
      }
      currentGroup.items.push(trimmed.replace(/^[•\-\s]+/, ""));
    }
  }
  if (currentGroup) groups.push(currentGroup);

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <SectionTitle
          title="专项训练建议"
          subtitle="针对性提升方案，根据你的弱科人格定制"
          centered
          className="mb-8"
        />
      </motion.div>

      <div className="space-y-6 max-w-3xl mx-auto">
        {groups.map((group, gi) => (
          <motion.div key={gi} variants={fadeUp} custom={gi}>
            <Card padding="lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-primary-500 to-accent-500 inline-block" />
                {group.category}
              </h3>
              <ul className="space-y-3">
                {group.items.map((item, ii) => (
                  <li
                    key={ii}
                    className="flex gap-3 text-gray-600 text-sm md:text-base leading-relaxed"
                  >
                    <span className="text-primary-400 flex-shrink-0 mt-0.5">
                      {String.fromCodePoint(0x25B8)}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/** Bottom CTA */
function BottomCTA({ reportId }: { reportId: string }) {
  const router = useRouter();

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <Card
          padding="lg"
          className="text-center relative overflow-hidden"
          hover
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 rounded-2xl opacity-10"
            style={{
              background:
                "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
            }}
          />

          <div className="relative z-10 py-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
              想获得完整的个性化学习计划？
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              留下联系方式，我们会根据你的弱科人格画像生成更详细、更具操作性的专属提升方案。
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push(`/claim?reportId=${reportId}`)}
              >
                领取完整学习计划
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "扶摇弱科人格画像",
                      text: "测测你的学习失分人格！",
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                分享给朋友
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.section>
  );
}

// ── Main page component ─────────────────────────────────────────────────────

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const reportId = params.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/reports/${reportId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "获取报告失败");
      }

      setData(json.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "获取报告时发生未知错误";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [reportId, showToast]);

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId, fetchReport]);

  // ── Loading ──
  if (loading) {
    return <ResultSkeleton />;
  }

  // ── Error / Not found ──
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <EmptyState
          title="报告未找到"
          description={
            error || "无法获取该报告，请检查链接是否正确或重新生成报告。"
          }
          icon={
            <svg
              className="w-16 h-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          action={
            <Button variant="primary" onClick={() => router.push("/")}>
              返回首页
            </Button>
          }
        />
      </div>
    );
  }

  // ── Data loaded ──
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection
        report={data}
        onSave={() => {
          window.print();
          showToast("报告已保存", "success");
        }}
        onShare={() => {
          const url = `${window.location.origin}/share/${reportId}`;
          if (navigator.share) {
            navigator
              .share({
                title: "我的弱科人格画像",
                text: `我的弱科人格是：${data.primaryType?.name || "未知"}，来看看你的是什么？`,
                url,
              })
              .catch(() => {});
          } else {
            navigator.clipboard.writeText(url).then(() => {
              showToast("分享链接已复制到剪贴板", "success");
            });
          }
        }}
      />

      <PersonalityCards report={data} />
      <RadarSection report={data} />
      <DiagnosisSection report={data} />
      <StrengthRiskSection report={data} />
      <SevenDayPlanSection report={data} />
      <TrainingAdviceSection report={data} />
      <BottomCTA reportId={reportId} />
    </div>
  );
}
