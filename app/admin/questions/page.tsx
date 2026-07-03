"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import Modal from "@/components/common/Modal";
import SectionTitle from "@/components/common/SectionTitle";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

interface QuestionItem {
  id: string;
  type: "SINGLE_CHOICE" | "SCALE" | "SCENARIO" | "MULTIPLE_CHOICE";
  title: string;
  description: string | null;
  options: unknown;
  dimensionMapping: unknown;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

const TYPE_LABELS: Record<QuestionItem["type"], string> = {
  SINGLE_CHOICE: "单选",
  SCALE: "量表",
  SCENARIO: "场景题",
  MULTIPLE_CHOICE: "多选",
};

const TYPE_OPTIONS: { value: QuestionItem["type"]; label: string }[] = [
  { value: "SINGLE_CHOICE", label: "单选 (SINGLE_CHOICE)" },
  { value: "SCALE", label: "量表 (SCALE)" },
  { value: "SCENARIO", label: "场景题 (SCENARIO)" },
  { value: "MULTIPLE_CHOICE", label: "多选 (MULTIPLE_CHOICE)" },
];

const OPTIONS_TEMPLATES: Record<QuestionItem["type"], string> = {
  SINGLE_CHOICE: JSON.stringify(
    [
      { id: "A", text: "选项A", score: { dimensionA: 1 } },
      { id: "B", text: "选项B", score: { dimensionA: 2 } },
    ],
    null,
    2,
  ),
  SCALE: JSON.stringify(
    { min: 1, max: 5, minLabel: "非常不同意", maxLabel: "非常同意" },
    null,
    2,
  ),
  SCENARIO: JSON.stringify(
    [
      { id: "A", text: "场景选项A", feedback: "选择A的反馈说明" },
      { id: "B", text: "场景选项B", feedback: "选择B的反馈说明" },
    ],
    null,
    2,
  ),
  MULTIPLE_CHOICE: JSON.stringify(
    [
      { id: "A", text: "选项A", score: { dimensionA: 1 } },
      { id: "B", text: "选项B", score: { dimensionB: 1 } },
    ],
    null,
    2,
  ),
};

const DIMENSION_TEMPLATE = JSON.stringify(
  { dimensionA: 1, dimensionB: 0 },
  null,
  2,
);

const EMPTY_FORM = {
  type: "SINGLE_CHOICE" as QuestionItem["type"],
  title: "",
  description: "",
  options: OPTIONS_TEMPLATES.SINGLE_CHOICE,
  dimensionMapping: DIMENSION_TEMPLATE,
  orderIndex: 0,
  isActive: true,
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [jsonError, setJsonError] = useState("");

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/questions");
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "获取题目列表失败");
        return;
      }
      setQuestions(json.data);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setJsonError("");
    setModalOpen(true);
  }

  function openEdit(q: QuestionItem) {
    setEditingId(q.id);
    setForm({
      type: q.type,
      title: q.title,
      description: q.description || "",
      options: JSON.stringify(q.options, null, 2),
      dimensionMapping: JSON.stringify(q.dimensionMapping, null, 2),
      orderIndex: q.orderIndex,
      isActive: q.isActive,
    });
    setJsonError("");
    setModalOpen(true);
  }

  function handleTypeChange(type: QuestionItem["type"]) {
    setForm((prev) => ({
      ...prev,
      type,
      options: OPTIONS_TEMPLATES[type],
    }));
  }

  async function handleSave() {
    // Validate JSON
    try {
      JSON.parse(form.options);
    } catch {
      setJsonError("选项 JSON 格式错误，请检查");
      return;
    }
    try {
      JSON.parse(form.dimensionMapping);
    } catch {
      setJsonError("维度映射 JSON 格式错误，请检查");
      return;
    }

    setJsonError("");
    setSaving(true);

    const payload = {
      type: form.type,
      title: form.title,
      description: form.description || null,
      options: form.options,
      dimensionMapping: form.dimensionMapping,
      orderIndex: form.orderIndex,
      isActive: form.isActive,
    };

    try {
      const url = editingId
        ? `/api/admin/questions/${editingId}`
        : "/api/admin/questions";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "保存失败");
        return;
      }
      setModalOpen(false);
      fetchQuestions();
    } catch {
      alert("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要禁用这道题目吗？")) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: false }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "操作失败");
        return;
      }
      fetchQuestions();
    } catch {
      alert("网络错误，请稍后重试");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <SectionTitle title="题目管理" subtitle={`共 ${questions.length} 道题目`} />
        <Button variant="primary" size="sm" onClick={openCreate}>
          新增题目
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" text="加载题目..." />
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={fetchQuestions}>
              重试
            </Button>
          </div>
        </Card>
      ) : questions.length === 0 ? (
        <Card>
          <EmptyState
            title="暂无题目"
            description="还没有创建题目，点击上方按钮新增"
            action={
              <Button variant="primary" size="sm" onClick={openCreate}>
                新增题目
              </Button>
            }
          />
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">
                    序号
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    题目
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                    类型
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">
                    状态
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr
                    key={q.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-900 max-w-md truncate">
                      {q.title}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          q.type === "SCENARIO"
                            ? "default"
                            : q.type === "SCALE"
                              ? "info"
                              : "warning"
                        }
                        size="sm"
                      >
                        {TYPE_LABELS[q.type]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {q.isActive ? (
                        <Badge variant="success" size="sm">
                          启用
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          禁用
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(q);
                          }}
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                          编辑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(q.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          禁用
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "编辑题目" : "新增题目"}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              题型
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                handleTypeChange(e.target.value as QuestionItem["type"])
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all bg-white"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              题目
            </label>
            <textarea
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              rows={2}
              placeholder="请输入题目内容..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              描述
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="可选描述..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              选项 (JSON)
            </label>
            <textarea
              value={form.options}
              onChange={(e) => {
                setForm({ ...form, options: e.target.value });
                setJsonError("");
              }}
              rows={8}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              维度映射 (JSON)
            </label>
            <textarea
              value={form.dimensionMapping}
              onChange={(e) => {
                setForm({ ...form, dimensionMapping: e.target.value });
                setJsonError("");
              }}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                排序
              </label>
              <input
                type="number"
                value={form.orderIndex}
                onChange={(e) =>
                  setForm({ ...form, orderIndex: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">启用</span>
              </label>
            </div>
          </div>

          {jsonError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg p-2">
              {jsonError}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={saving}
              onClick={handleSave}
            >
              {editingId ? "保存修改" : "创建题目"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
