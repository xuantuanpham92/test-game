import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        options: true,
        orderIndex: true,
      },
    });

    const parsed = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { success: false, error: "获取题目失败" },
      { status: 500 }
    );
  }
}
