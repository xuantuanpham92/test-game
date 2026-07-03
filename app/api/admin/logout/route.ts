import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { success: false, error: "退出登录失败" },
      { status: 500 }
    );
  }
}
