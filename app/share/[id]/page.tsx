"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { toPng } from "html-to-image";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { useToast } from "@/components/common/Toast";
import type { DimensionKey } from "@/lib/constants";

// ── Types ───────────────────────────────────────────────────────────────────

interface ReportData {
  id: string;
  primaryType: {
    key: string;
    name: string;
    slogan: string;
    themeColor: string;
  } | null;
  dimensionScores: Record<DimensionKey, number>;
}

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

const PERSONALITY_EMOJIS: Record<string, string> = {
  condition_leaker: "\u{1F573}️",
  formula_sleeper: "\u{1F4A4}",
  variant_lost: "\u{1F300}",
  calculation_crasher: "\u{1F697}",
  review_disconnected: "\u{1F4E1}",
  expression_offline: "\u{1F4DD}",
  final_boss_lost: "\u{1F3D4}️",
  time_blackhole: "⏰",
};

// ── Main ────────────────────────────────────────────────────────────────────

export default function SharePage() {
  const params = useParams<{ id: string }>();
  const reportId = params.id;
  const { showToast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      setError(
        err instanceof Error ? err.message : "获取报告时发生未知错误",
      );
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (reportId) fetchReport();
  }, [reportId, fetchReport]);

  // ── Save as image ──
  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      setSaving(true);
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Download
      const link = document.createElement("a");
      link.download = `扶摇弱科人格画像_${reportId}.png`;
      link.href = dataUrl;
      link.click();

      showToast("图片已保存", "success");
    } catch {
      showToast("保存图片失败，请重试", "error");
    } finally {
      setSaving(false);
    }
  }, [cardRef, reportId, showToast]);

  // ── Copy link ──
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("链接已复制到剪贴板", "success");
    });
  }, [showToast]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" text="加载分享卡片..." />
      </div>
    );
  }

  // ── Error ──
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <EmptyState
          title="报告不存在"
          description="无法找到该报告，请检查链接是否正确。"
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
        />
      </div>
    );
  }

  // ── Data ──
  const personality = data.primaryType;
  const personalityName = personality?.name || "未知";
  const slogan = personality?.slogan || "";
  const emoji = PERSONALITY_EMOJIS[personality?.key || ""] || "🧠";
  const themeColor = personality?.themeColor || "#6366F1";

  const radarData = (Object.entries(data.dimensionScores) as [DimensionKey, number][]).map(
    ([key, value]) => ({
      dimension: RADAR_LABELS[key] || key,
      score: value,
      fullMark: 100,
    }),
  );

  const scores = data.dimensionScores;
  const bestEntry = (Object.entries(scores) as [DimensionKey, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 gap-6">
      {/* ── Share card ── */}
      <motion.div
        ref={cardRef}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Gradient top bar */}
        <div
          className="h-3"
          style={{
            background: `linear-gradient(90deg, ${themeColor}, #8B5CF6, #EC4899)`,
          }}
        />

        <div className="p-8 flex flex-col items-center text-center">
          {/* Brand */}
          <p className="text-xs font-medium tracking-[0.2em] text-gray-400 uppercase mb-4">
            扶摇弱科人格画像
          </p>

          {/* Emoji */}
          <div className="text-6xl mb-4">{emoji}</div>

          {/* Personality name */}
          <h2
            className="text-3xl font-extrabold mb-2"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, #8B5CF6, #EC4899)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {personalityName}
          </h2>

          {/* Slogan */}
          <p className="text-sm text-gray-500 mb-6 max-w-xs">{slogan}</p>

          {/* Mini radar chart */}
          <div className="w-full h-52 mb-4">
            <ResponsiveContainer>
              <RadarChart data={radarData} cx="50%" cy="50%">
                <PolarGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="score"
                  stroke={themeColor}
                  strokeWidth={2}
                  fill={themeColor}
                  fillOpacity={0.2}
                  dot={false}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key stat */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-6">
            <span className="text-xs text-gray-400">最佳能力</span>
            <span className="text-sm font-bold text-gray-800">
              {RADAR_LABELS[bestEntry[0]] || bestEntry[0]}
            </span>
            <span className="text-lg font-extrabold text-primary-500">
              {bestEntry[1]}
            </span>
            <span className="text-xs text-gray-400">分</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

          {/* Bottom call to action */}
          <p className="text-sm text-gray-500 mb-2">
            扫码测试你的弱科人格
          </p>
          <p className="text-xs text-gray-400">
            发现你的学习失分模式，获得专属提升方案
          </p>
        </div>
      </motion.div>

      {/* ── Action buttons ── */}
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button
          variant="primary"
          onClick={handleSaveImage}
          isLoading={saving}
        >
          保存图片
        </Button>
        <Button variant="outline" onClick={handleCopyLink}>
          复制链接
        </Button>
      </motion.div>
    </div>
  );
}
