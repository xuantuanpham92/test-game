"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
import { parseDescriptionSections } from "@/lib/description";
import { getPersonalityCardLine } from "@/lib/personality-card-copy";

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
  perfect: "\u{1F48E}", // 💎
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

  const sections = parseDescriptionSections(personality?.longDescription || "");

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
                {sections.map((section, i) => (
                  <div key={`${section.title}-${i}`}>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: themeColor }}
                    >
                      【{section.title}】
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                      {section.body}
                    </p>
                  </div>
                ))}
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
/** Slogan banner */
function SloganBanner() {
  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-accent-500 to-pink-500 px-8 py-10 text-center shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <p className="relative z-10 text-white/80 text-sm font-medium tracking-widest uppercase mb-2">
            FUYAO EDUCATION
          </p>
          <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white">
            扶摇——用科技助力教育，让学习变得简单
          </h2>
        </div>
      </motion.div>
    </motion.section>
  );
}

/** Partners showcase section */
function PartnersSection() {
  const partners = [
    { name: "教育创新伙伴", label: "EDUCATION INNOVATION", icon: "spark" },
    { name: "学习成长伙伴", label: "LEARNING & GROWTH", icon: "orbit" },
    { name: "技术共创伙伴", label: "TECHNOLOGY CO-CREATION", icon: "grid" },
  ] as const;

  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#17134a] via-[#30246d] to-[#6b2d72] px-5 py-10 shadow-2xl shadow-indigo-950/20 sm:px-10"
      >
        <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.65)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute -bottom-36 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-[50%] border border-white/15" />
        <div className="pointer-events-none absolute -bottom-28 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-[50%] border border-white/10" />

        <div className="relative z-10 text-center">
          <motion.div variants={fadeUp} custom={1}>
            <p className="text-xs font-bold tracking-[0.28em] text-violet-200">
              PARTNERS
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-white md:text-3xl">
              与优秀伙伴，共赴成长
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-100/80">
              连接教育、学习与技术的创新力量，为每一位学生创造更好的成长体验。
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                variants={fadeUp}
                custom={index + 2}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 text-left shadow-lg shadow-indigo-950/10 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-inner shadow-white/10">
                    {partner.icon === "spark" && (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                        <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                      </svg>
                    )}
                    {partner.icon === "orbit" && (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                        <ellipse cx="12" cy="12" rx="9" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(-30 12 12)" />
                        <ellipse cx="12" cy="12" rx="9" ry="4.5" stroke="currentColor" strokeWidth="1.5" transform="rotate(30 12 12)" />
                      </svg>
                    )}
                    {partner.icon === "grid" && (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                        <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M15 17h5M17.5 14.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{partner.name}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-indigo-100/65">
                      {partner.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

/** Contact / QR code section */
function ContactSection() {
  return (
    <motion.section
      className="max-w-5xl mx-auto px-4 py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <SectionTitle
          title="了解我们？"
          subtitle="扫码体验，获取更多学习产品和活动信息"
          centered
          className="mb-8"
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
        {/* WeChat QR code */}
        <motion.div variants={fadeUp} custom={0}>
          <Card padding="lg" className="text-center">
            <div className="w-44 h-64 mx-auto mb-4 rounded-lg bg-white border border-gray-100 overflow-hidden">
              <Image
                src="/contact/fuyao-wechat-assistant.jpg"
                alt="扶摇微信小助手二维码"
                width={840}
                height={1178}
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">扶摇微信小助手</h4>
            <p className="text-xs text-gray-500 mt-1">微信号将在此展示</p>
          </Card>
        </motion.div>

        {/* QQ QR code */}
        <motion.div variants={fadeUp} custom={1}>
          <Card padding="lg" className="text-center">
            <div className="w-44 h-64 mx-auto mb-4 rounded-lg bg-white border border-gray-100 overflow-hidden flex items-center justify-center">
              <Image
                src="/contact/fuyao-qq-assistant.jpg"
                alt="扶摇QQ小助手二维码"
                width={1044}
                height={1839}
                className="w-full h-full object-contain object-center"
              />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">扶摇QQ小助手</h4>
            <p className="text-xs text-gray-500 mt-1">QQ 号将在此展示</p>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}

function PersonalityCardSection({
  report,
}: {
  report: ReportData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const personality = report.primaryType;
  const typeKey = personality?.typeKey || "";
  const emoji = PERSONALITY_EMOJIS[typeKey] || "\u{1F9E0}";
  const themeColor = personality?.themeColor || "#6366F1";
  const cardLine = getPersonalityCardLine(typeKey, personality?.shortDescription);

  return (
    <>
      <motion.section
        className="max-w-5xl mx-auto px-4 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp}>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative w-full overflow-hidden rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-100"
          >
            <div
              className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-15"
              style={{
                background:
                  "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-5 py-3">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg"
                style={{ backgroundColor: `${themeColor}18` }}
              >
                {emoji}
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                查看我的人格卡片
              </h3>
              <span className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-[1.03]">
                打开卡片
              </span>
            </div>
          </button>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/55 px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 48, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="relative overflow-hidden rounded-[28px] bg-white p-8 shadow-2xl"
                style={{
                  background: `linear-gradient(160deg, #ffffff 0%, ${themeColor}10 58%, #fdf2f8 100%)`,
                }}
              >
                <div className="relative z-10 flex min-h-[480px] flex-col items-center justify-between text-center">
                  <div className="w-full">
                    <div
                      className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] text-6xl shadow-lg"
                      style={{ backgroundColor: `${themeColor}18` }}
                    >
                      {emoji}
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-950">
                      {personality?.name || "我的弱科人格"}
                    </h2>
                    <div
                      className="mx-auto my-7 h-1 w-14 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    />
                    <p className="text-base leading-8 text-gray-600">
                      {cardLine}
                    </p>
                  </div>

                  <div className="w-full border-t border-gray-200 pt-5">
                    <p className="text-lg font-extrabold text-gray-950">扶摇</p>
                    <p className="mt-1 text-[11px] font-semibold tracking-[0.24em] text-gray-400">
                      FUYAO EDUCATION
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-white"
                >
                  关闭
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
      <SloganBanner />

      {/* About us intro */}
      <motion.section
        className="max-w-5xl mx-auto px-4 py-4 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto"
        >
          我们是扶摇初创团队，专注于做出对学生真正有帮助的产品。
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-3 text-gray-500 text-sm leading-relaxed max-w-md mx-auto"
        >
          <span className="inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 font-extrabold text-amber-700 ring-1 ring-amber-200">
            自研 AI 错题本工具
          </span>
          即将上线--助力暑期高效学习。
          <br />
          （基于全球首款扶摇AI记忆系统，现开放少量免费体验名额）
        </motion.p>
      </motion.section>

      <PartnersSection />
      <ContactSection />
      <PersonalityCardSection report={data} />
    </div>
  );
}
