import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "未授权" },
      { status: 401 }
    );
  }

  try {
    const personalities = await prisma.personalityType.findMany({
      orderBy: { createdAt: "asc" },
    });

    const parsed = personalities.map((p) => ({
      ...p,
      typicalBehaviors: (() => {
        try {
          return JSON.parse(p.typicalBehaviors);
        } catch {
          return [];
        }
      })(),
      advice: (() => {
        try {
          return JSON.parse(p.advice);
        } catch {
          return [];
        }
      })(),
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Admin personalities GET error:", error);
    return NextResponse.json(
      { success: false, error: "获取人格类型列表失败" },
      { status: 500 }
    );
  }
}
