import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitAnswerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = submitAnswerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { sessionId, questionId, selectedOption } = parsed.data;

    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "会话不存在" },
        { status: 404 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json(
        { success: false, error: "题目不存在" },
        { status: 404 }
      );
    }

    const selectedOptionStr = Array.isArray(selectedOption)
      ? JSON.stringify(selectedOption)
      : selectedOption;

    await prisma.answer.upsert({
      where: {
        sessionId_questionId: { sessionId, questionId },
      },
      update: {
        selectedOption: selectedOptionStr,
      },
      create: {
        sessionId,
        questionId,
        selectedOption: selectedOptionStr,
      },
    });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Submit answer error:", error);
    return NextResponse.json(
      { success: false, error: "提交答案失败" },
      { status: 500 }
    );
  }
}
