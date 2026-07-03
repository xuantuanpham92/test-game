"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import SectionTitle from "@/components/common/SectionTitle";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

interface PersonalityItem {
  id: string;
  typeKey: string;
  name: string;
  dimensionKey: string;
  slogan: string;
  shortDescription: string;
  longDescription: string;
  typicalBehaviors: string[];
  advice: string[];
  iconUrl: string | null;
  illustrationUrl: string | null;
  themeColor: string;
  createdAt: string;
}

interface EditForm {
  name: string;
  slogan: string;
  shortDescription: string;
  longDescription: string;
  typicalBehaviors: string;
  advice: string;
  themeColor: string;
}

export default function AdminPersonalitiesPage() {
  const [personalities, setPersonalities] = useState<PersonalityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PersonalityItem | null>(null);
  const [form, setForm] = useState<EditForm>({
    name: "",
    slogan: "",
    shortDescription: "",
    longDescription: "",
    typicalBehaviors: "",
    advice: "",
    themeColor: "#6366F1",
  });
  const [saving, setSaving] = useState(false);

  const fetchPersonalities = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/personalities");
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "获取人格类型列表失败");
        return;
      }
      setPersonalities(json.data);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonalities();
  }, [fetchPersonalities]);

  function openEdit(p: PersonalityItem) {
    setSelected(p);
    setForm({
      name: p.name,
      slogan: p.slogan,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      typicalBehaviors: Array.isArray(p.typicalBehaviors)
        ? p.typicalBehaviors.join("\n")
        : "",
      advice: Array.isArray(p.advice) ? p.advice.join("\n") : "",
      themeColor: p.themeColor || "#6366F1",
    });
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);

    const payload = {
      name: form.name,
      slogan: form.slogan,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      typicalBehaviors: form.typicalBehaviors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      advice: form.advice
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      themeColor: form.themeColor,
    };

    try {
      const res = await fetch(`/api/admin/personalities/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "保存失败");
        return;
      }
      setSelected(null);
      fetchPersonalities();
    } catch {
      alert("网络错误，请稍后重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <SectionTitle
        title="人格管理"
        subtitle={`共 ${personalities.length} 种人格类型`}
        className="mb-8"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" text="加载人格类型..." />
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchPersonalities}
            >
              重试
            </Button>
          </div>
        </Card>
      ) : personalities.length === 0 ? (
        <Card>
          <EmptyState
            title="暂无人格类型"
            description="数据库中还没有人格类型数据，请先通过数据库初始化"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personalities.map((p) => (
            <Card
              key={p.id}
              hover
              onClick={() => openEdit(p)}
              className="relative overflow-hidden cursor-pointer"
            >
              {/* Colored top border */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: p.themeColor || "#6366F1" }}
              />

              <div className="pt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      backgroundColor: p.themeColor || "#6366F1",
                    }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {p.typeKey}
                    </p>
                  </div>
                </div>

                {p.slogan && (
                  <p className="text-sm text-gray-600 italic mb-2">
                    &ldquo;{p.slogan}&rdquo;
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {p.dimensionKey}
                  </span>
                </div>

                {p.shortDescription && (
                  <p className="mt-3 text-xs text-gray-500 line-clamp-2">
                    {p.shortDescription}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`编辑人格 - ${selected?.name || ""}`}
      >
        {selected && (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                名称
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                口号
              </label>
              <input
                type="text"
                value={form.slogan}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                简短描述
              </label>
              <textarea
                value={form.shortDescription}
                onChange={(e) =>
                  setForm({ ...form, shortDescription: e.target.value })
                }
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                详细描述
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) =>
                  setForm({ ...form, longDescription: e.target.value })
                }
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                典型行为（每行一个）
              </label>
              <textarea
                value={form.typicalBehaviors}
                onChange={(e) =>
                  setForm({ ...form, typicalBehaviors: e.target.value })
                }
                rows={4}
                placeholder="行为1&#10;行为2&#10;行为3"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                建议（每行一个）
              </label>
              <textarea
                value={form.advice}
                onChange={(e) => setForm({ ...form, advice: e.target.value })}
                rows={4}
                placeholder="建议1&#10;建议2&#10;建议3"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                主题色
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={form.themeColor}
                  onChange={(e) =>
                    setForm({ ...form, themeColor: e.target.value })
                  }
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={form.themeColor}
                  onChange={(e) =>
                    setForm({ ...form, themeColor: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected(null)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={saving}
                onClick={handleSave}
              >
                保存修改
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
