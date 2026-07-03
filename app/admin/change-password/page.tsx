"use client";

import { useState } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import SectionTitle from "@/components/common/SectionTitle";

export default function AccountSettingsPage() {
  // ---- Password change state ----
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ---- Username change state ----
  const [unCurrent, setUnCurrent] = useState("");
  const [unNew, setUnNew] = useState("");
  const [unLoading, setUnLoading] = useState(false);
  const [unMessage, setUnMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ---- Password change handler ----
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage(null);

    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwMessage({ type: "error", text: "请填写所有字段" });
      return;
    }
    if (pwNew.length < 6) {
      setPwMessage({ type: "error", text: "新密码至少6位" });
      return;
    }
    if (pwNew !== pwConfirm) {
      setPwMessage({ type: "error", text: "两次输入的新密码不一致" });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword: pwCurrent,
          newPassword: pwNew,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setPwMessage({ type: "success", text: json.message || "密码修改成功！" });
        setPwCurrent("");
        setPwNew("");
        setPwConfirm("");
      } else {
        setPwMessage({ type: "error", text: json.error || "修改失败" });
      }
    } catch {
      setPwMessage({ type: "error", text: "网络错误，请稍后重试" });
    } finally {
      setPwLoading(false);
    }
  }

  // ---- Username change handler ----
  async function handleChangeUsername(e: React.FormEvent) {
    e.preventDefault();
    setUnMessage(null);

    if (!unCurrent || !unNew) {
      setUnMessage({ type: "error", text: "请填写所有字段" });
      return;
    }
    if (unNew.length < 2) {
      setUnMessage({ type: "error", text: "用户名至少2位" });
      return;
    }

    setUnLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_username",
          currentPassword: unCurrent,
          newUsername: unNew,
        }),
      });
      const json = await res.json();

      if (json.success) {
        setUnMessage({
          type: "success",
          text: json.message || "用户名修改成功！下次登录请使用新用户名。",
        });
        setUnCurrent("");
        setUnNew("");
      } else {
        setUnMessage({ type: "error", text: json.error || "修改失败" });
      }
    } catch {
      setUnMessage({ type: "error", text: "网络错误，请稍后重试" });
    } finally {
      setUnLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-lg space-y-8">
      <SectionTitle
        title="账号设置"
        subtitle="修改用户名和登录密码"
        className="mb-0"
      />

      {/* ---- Change Username ---- */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          ✏️ 修改用户名
        </h3>
        <form onSubmit={handleChangeUsername} className="space-y-4">
          {unMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                unMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {unMessage.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              当前密码
            </label>
            <input
              type="password"
              value={unCurrent}
              onChange={(e) => setUnCurrent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              autoComplete="current-password"
              placeholder="输入密码以确认身份"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              新用户名
            </label>
            <input
              type="text"
              value={unNew}
              onChange={(e) => setUnNew(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="2-50位"
            />
          </div>

          <Button type="submit" disabled={unLoading} variant="outline" className="w-full">
            {unLoading ? "修改中..." : "修改用户名"}
          </Button>
        </form>
      </Card>

      {/* ---- Change Password ---- */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          🔒 修改密码
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {pwMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                pwMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {pwMessage.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              当前密码
            </label>
            <input
              type="password"
              value={pwCurrent}
              onChange={(e) => setPwCurrent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              新密码
            </label>
            <input
              type="password"
              value={pwNew}
              onChange={(e) => setPwNew(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              autoComplete="new-password"
              placeholder="至少6位"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              确认新密码
            </label>
            <input
              type="password"
              value={pwConfirm}
              onChange={(e) => setPwConfirm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" disabled={pwLoading} className="w-full">
            {pwLoading ? "修改中..." : "修改密码"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
