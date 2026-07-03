"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import SectionTitle from "@/components/common/SectionTitle";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

interface LeadItem {
  id: string;
  userId: string;
  reportId: string | null;
  phone: string;
  wechat: string | null;
  grade: string;
  weakSubject: string;
  status: "NEW" | "CONTACTED" | "INTERESTED" | "CONVERTED" | "INVALID";
  note: string | null;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  userNickname: string | null;
  primaryType: string | null;
  primaryTypeName: string | null;
}

interface LeadsResponse {
  items: LeadItem[];
  total: number;
  page: number;
  pageSize: number;
}

type LeadStatus = LeadItem["status"];

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "", label: "全部" },
  { key: "NEW", label: "新线索" },
  { key: "CONTACTED", label: "已联系" },
  { key: "INTERESTED", label: "有兴趣" },
  { key: "CONVERTED", label: "已转化" },
  { key: "INVALID", label: "无效" },
];

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "新线索" },
  { value: "CONTACTED", label: "已联系" },
  { value: "INTERESTED", label: "有兴趣" },
  { value: "CONVERTED", label: "已转化" },
  { value: "INVALID", label: "无效" },
];

const STATUS_VARIANT: Record<LeadStatus, "info" | "warning" | "default" | "success" | "danger"> = {
  NEW: "info",
  CONTACTED: "warning",
  INTERESTED: "default",
  CONVERTED: "success",
  INVALID: "danger",
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "新线索",
  CONTACTED: "已联系",
  INTERESTED: "有兴趣",
  CONVERTED: "已转化",
  INVALID: "无效",
};

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

function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone || "-";
  return phone.slice(0, 3) + "****" + phone.slice(-4);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("NEW");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [editStatus, setEditStatus] = useState<LeadStatus>("NEW");
  const [editNote, setEditNote] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("pageSize", "20");
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "获取线索列表失败");
        return;
      }
      setData(json.data);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function openDetail(lead: LeadItem) {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditNote(lead.note || "");
  }

  async function handleSave() {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, note: editNote }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "更新失败");
        return;
      }
      setSelectedLead(null);
      fetchLeads();
    } catch {
      alert("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  function exportCSV() {
    if (!data?.items.length) return;
    const headers = [
      "联系人",
      "手机号",
      "微信",
      "年级",
      "薄弱科目",
      "人格类型",
      "状态",
      "备注",
      "创建时间",
    ];
    const rows = data.items.map((l) => [
      l.userNickname || "-",
      l.phone,
      l.wechat || "",
      l.grade,
      SUBJECT_LABELS[l.weakSubject] || l.weakSubject,
      l.primaryTypeName || "-",
      STATUS_LABEL[l.status],
      l.note || "",
      formatDate(l.createdAt),
    ]);
    const csv =
      "﻿" +
      [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `线索列表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title="线索管理" subtitle={`共 ${data?.total ?? 0} 条线索`} />
        <Button variant="outline" size="sm" onClick={exportCSV}>
          导出 CSV
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-200 shadow-sm overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setStatusFilter(tab.key);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === tab.key
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" text="加载线索..." />
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={fetchLeads}>
              重试
            </Button>
          </div>
        </Card>
      ) : !data?.items.length ? (
        <Card>
          <EmptyState
            title="暂无线索"
            description="当前筛选条件下没有线索数据"
          />
        </Card>
      ) : (
        <>
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">联系人</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">手机号</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">微信</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">年级</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">薄弱科目</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">人格类型</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">状态</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => openDetail(lead)}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {lead.userNickname || lead.phone}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono">
                        {maskPhone(lead.phone)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lead.wechat || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.grade}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {SUBJECT_LABELS[lead.weakSubject] || lead.weakSubject}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lead.primaryTypeName || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[lead.status]} size="sm">
                          {STATUS_LABEL[lead.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
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

      {/* Detail/Edit Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="线索详情"
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">联系人：</span>
                <span className="text-gray-900 font-medium">
                  {selectedLead.userNickname || selectedLead.phone}
                </span>
              </div>
              <div>
                <span className="text-gray-500">手机号：</span>
                <span className="text-gray-900">{selectedLead.phone}</span>
              </div>
              <div>
                <span className="text-gray-500">微信：</span>
                <span className="text-gray-900">
                  {selectedLead.wechat || "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">年级：</span>
                <span className="text-gray-900">{selectedLead.grade}</span>
              </div>
              <div>
                <span className="text-gray-500">薄弱科目：</span>
                <span className="text-gray-900">
                  {SUBJECT_LABELS[selectedLead.weakSubject] ||
                    selectedLead.weakSubject}
                </span>
              </div>
              <div>
                <span className="text-gray-500">人格类型：</span>
                <span className="text-gray-900">
                  {selectedLead.primaryTypeName || "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">创建时间：</span>
                <span className="text-gray-900">
                  {formatDate(selectedLead.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">更新时间：</span>
                <span className="text-gray-900">
                  {formatDate(selectedLead.updatedAt)}
                </span>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                线索状态
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all bg-white"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                备注
              </label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={4}
                placeholder="添加跟进备注..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLead(null)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={saving}
                onClick={handleSave}
              >
                保存
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
