import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createQuestionSchema } from "@/lib/validators";

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
    const questions = await prisma.question.findMany({
      orderBy: { orderIndex: "asc" },
    });

    const parsed = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
      dimensionMapping: JSON.parse(q.dimensionMapping),
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Admin questions GET error:", error);
    return NextResponse.json(
      { success: false, error: "获取题目列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "未授权" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = createQuestionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const question = await prisma.question.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description || null,
        options: data.options,
        dimensionMapping: data.dimensionMapping,
        orderIndex: data.orderIndex,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(
      { success: true, data: question },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin questions POST error:", error);
    return NextResponse.json(
      { success: false, error: "创建题目失败" },
      { status: 500 }
    );
  }
}
