"use client";

import { useEffect, useState } from "react";
import Card from "@/components/common/Card";
import SectionTitle from "@/components/common/SectionTitle";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface DashboardData {
  totalUsers: number;
  totalSessions: number;
  completionRate: number;
  totalLeads: number;
  leadRate: number;
  personalityDistribution: { typeKey: string; name: string; count: number }[];
  gradeDistribution: { grade: string; count: number }[];
  subjectDistribution: { subject: string; count: number }[];
}

interface MetricCardProps {
  label: string;
  value: number | string;
  accent: string;
  suffix?: string;
}

function MetricCard({ label, value, accent, suffix }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <div className="pt-2">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {value}
          {suffix && (
            <span className="text-lg font-normal text-gray-400 ml-0.5">
              {suffix}
            </span>
          )}
        </p>
      </div>
    </Card>
  );
}

function DistributionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm text-gray-600 truncate" title={label}>
        {label}
      </span>
      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm text-gray-500">{count}</span>
    </div>
  );
}

const SUBJECT_LABELS: Record<string, string> = {
  math: "数学",
  chinese: "语文",
  english: "英语",
  physics: "物理",
  chemistry: "化学",
  biology: "生物",
  history: "历史",
  geography: "地理",
  politics: "政治",
};

const BAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-sky-500",
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (!json.success) {
          setError(json.error || "获取仪表盘数据失败");
          return;
        }
        setData(json.data);
      } catch {
        setError("网络错误，请稍后重试");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="加载仪表盘数据..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-primary-500 hover:underline"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxPersonality = Math.max(
    ...data.personalityDistribution.map((d) => d.count),
    1,
  );
  const maxGrade = Math.max(
    ...data.gradeDistribution.map((d) => d.count),
    1,
  );
  const maxSubject = Math.max(
    ...data.subjectDistribution.map((d) => d.count),
    1,
  );

  return (
    <div className="p-8">
      <SectionTitle
        title="数据看板"
        subtitle="系统核心指标概览"
        className="mb-8"
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard
          label="用户总数"
          value={data.totalUsers.toLocaleString()}
          accent="from-indigo-400 to-indigo-600"
        />
        <MetricCard
          label="测试次数"
          value={data.totalSessions.toLocaleString()}
          accent="from-violet-400 to-violet-600"
        />
        <MetricCard
          label="完成率"
          value={data.completionRate}
          suffix="%"
          accent="from-emerald-400 to-emerald-600"
        />
        <MetricCard
          label="留资数"
          value={data.totalLeads.toLocaleString()}
          accent="from-amber-400 to-amber-600"
        />
        <MetricCard
          label="留资率"
          value={data.leadRate}
          suffix="%"
          accent="from-rose-400 to-rose-600"
        />
      </div>

      {/* Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personality distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            人格分布
          </h3>
          {data.personalityDistribution.length === 0 ? (
            <p className="text-sm text-gray-400">暂无数据</p>
          ) : (
            <div className="space-y-3">
              {data.personalityDistribution.map((item, i) => (
                <DistributionBar
                  key={item.typeKey}
                  label={item.name}
                  count={item.count}
                  total={maxPersonality}
                  color={BAR_COLORS[i % BAR_COLORS.length]}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Grade distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            年级分布
          </h3>
          {data.gradeDistribution.length === 0 ? (
            <p className="text-sm text-gray-400">暂无数据</p>
          ) : (
            <div className="space-y-3">
              {data.gradeDistribution.map((item, i) => (
                <DistributionBar
                  key={item.grade}
                  label={item.grade}
                  count={item.count}
                  total={maxGrade}
                  color={BAR_COLORS[(i + 3) % BAR_COLORS.length]}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Subject distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            薄弱科目分布
          </h3>
          {data.subjectDistribution.length === 0 ? (
            <p className="text-sm text-gray-400">暂无数据</p>
          ) : (
            <div className="space-y-3">
              {data.subjectDistribution.map((item, i) => (
                <DistributionBar
                  key={item.subject}
                  label={SUBJECT_LABELS[item.subject] || item.subject}
                  count={item.count}
                  total={maxSubject}
                  color={BAR_COLORS[(i + 6) % BAR_COLORS.length]}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
