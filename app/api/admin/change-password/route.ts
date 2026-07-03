import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z.object({
  action: z.enum(["change_password", "change_username"]),
  currentPassword: z.string().min(1, "请输入当前密码"),
  // for change_password
  newPassword: z.string().min(6, "新密码至少6位").max(100).optional(),
  // for change_username
  newUsername: z.string().min(2, "用户名至少2位").max(50).optional(),
});

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { action, currentPassword } = parsed.data;

    // Verify current password first
    const adminRecord = await prisma.admin.findUnique({
      where: { id: admin.adminId },
    });
    if (!adminRecord) {
      return NextResponse.json(
        { success: false, error: "管理员不存在" },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(currentPassword, adminRecord.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "当前密码错误" },
        { status: 400 }
      );
    }

    if (action === "change_password") {
      const { newPassword } = parsed.data;
      if (!newPassword) {
        return NextResponse.json(
          { success: false, error: "请输入新密码" },
          { status: 400 }
        );
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      await prisma.admin.update({
        where: { id: admin.adminId },
        data: { passwordHash: newHash },
      });
      return NextResponse.json({ success: true, message: "密码修改成功" });
    }

    if (action === "change_username") {
      const { newUsername } = parsed.data;
      if (!newUsername) {
        return NextResponse.json(
          { success: false, error: "请输入新用户名" },
          { status: 400 }
        );
      }
      // Check if username is already taken
      const existing = await prisma.admin.findUnique({
        where: { username: newUsername },
      });
      if (existing && existing.id !== admin.adminId) {
        return NextResponse.json(
          { success: false, error: "该用户名已被使用" },
          { status: 400 }
        );
      }
      await prisma.admin.update({
        where: { id: admin.adminId },
        data: { username: newUsername },
      });
      return NextResponse.json({ success: true, message: "用户名修改成功" });
    }

    return NextResponse.json(
      { success: false, error: "未知操作" },
      { status: 400 }
    );
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: "未授权" },
        { status: 401 }
      );
    }
    console.error("Account settings error:", error);
    return NextResponse.json(
      { success: false, error: "操作失败" },
      { status: 500 }
    );
  }
}
