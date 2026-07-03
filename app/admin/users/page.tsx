"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import SectionTitle from "@/components/common/SectionTitle";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

interface UserItem {
  id: string;
  nickname: string;
  phone: string;
  wechat: string | null;
  grade: string;
  weakSubject: string;
  latestScoreRange: string | null;
  targetScore: string | null;
  sourceChannel: string | null;
  createdAt: string;
  sessionCount: number;
  leadCount: number;
  latestReport: {
    id: string;
    primaryType: string;
    primaryTypeName: string;
    createdAt: string;
  } | null;
}

interface UsersResponse {
  items: UserItem[];
  total: number;
  page: number;
  pageSize: number;
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

const GRADE_OPTIONS = [
  "",
  "小学一年级",
  "小学二年级",
  "小学三年级",
  "小学四年级",
  "小学五年级",
  "小学六年级",
  "初一",
  "初二",
  "初三",
  "高一",
  "高二",
  "高三",
];

function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone || "-";
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "20");
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "获取用户列表失败");
        return;
      }
      // Apply client-side grade filter since the API doesn't filter by grade
      let result = json.data as UsersResponse;
      if (gradeFilter) {
        result = {
          ...result,
          items: result.items.filter((u) => u.grade === gradeFilter),
          total: result.items.filter((u) => u.grade === gradeFilter).length,
        };
      }
      setData(result);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [page, search, gradeFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleSearch() {
    setPage(1);
    fetchUsers();
  }

  function exportCSV() {
    if (!data?.items.length) return;
    const headers = [
      "昵称",
      "年级",
      "薄弱科目",
      "手机号",
      "微信",
      "测试次数",
      "人格结果",
      "创建时间",
    ];
    const rows = data.items.map((u) => [
      u.nickname,
      u.grade,
      SUBJECT_LABELS[u.weakSubject] || u.weakSubject,
      u.phone,
      u.wechat || "",
      String(u.sessionCount),
      u.latestReport?.primaryTypeName || "未测试",
      formatDate(u.createdAt),
    ]);
    const csv =
      "﻿" +
      [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `用户列表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title="用户管理" subtitle={`共 ${data?.total ?? 0} 位用户`} />
        <Button variant="outline" size="sm" onClick={exportCSV}>
          导出 CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1">搜索</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="昵称或手机号..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs text-gray-500 mb-1">年级</label>
            <select
              value={gradeFilter}
              onChange={(e) => {
                setGradeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all bg-white"
            >
              <option value="">全部年级</option>
              {GRADE_OPTIONS.filter(Boolean).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={handleSearch}>
            搜索
          </Button>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" text="加载中..." />
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchUsers}
            >
              重试
            </Button>
          </div>
        </Card>
      ) : !data?.items.length ? (
        <Card>
          <EmptyState
            title="暂无用户数据"
            description="还没有用户注册，用户数据将显示在这里"
          />
        </Card>
      ) : (
        <>
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      昵称
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      年级
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      薄弱科目
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      手机号
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      测试状态
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      人格结果
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      创建时间
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((user) => (
                    <>
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() =>
                          setExpandedId(
                            expandedId === user.id ? null : user.id,
                          )
                        }
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {user.nickname}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {user.grade}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {SUBJECT_LABELS[user.weakSubject] || user.weakSubject}
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono">
                          {maskPhone(user.phone)}
                        </td>
                        <td className="px-4 py-3">
                          {user.sessionCount > 0 ? (
                            <Badge variant="success" size="sm">
                              已测试({user.sessionCount})
                            </Badge>
                          ) : (
                            <Badge variant="default" size="sm">
                              未测试
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {user.latestReport?.primaryTypeName || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                      {expandedId === user.id && (
                        <tr key={`${user.id}-detail`} className="bg-indigo-50/50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">微信：</span>
                                <span className="text-gray-900">
                                  {user.wechat || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">当前分数段：</span>
                                <span className="text-gray-900">
                                  {user.latestScoreRange || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">目标分数：</span>
                                <span className="text-gray-900">
                                  {user.targetScore || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">渠道来源：</span>
                                <span className="text-gray-900">
                                  {user.sourceChannel || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">留资次数：</span>
                                <span className="text-gray-900">
                                  {user.leadCount}
                                </span>
                              </div>
                              {user.latestReport && (
                                <div>
                                  <span className="text-gray-500">
                                    最新报告时间：
                                  </span>
                                  <span className="text-gray-900">
                                    {formatDate(user.latestReport.createdAt)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                第 {data.page} / {totalPages} 页，共 {data.total} 条
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
