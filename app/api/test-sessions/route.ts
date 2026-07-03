import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, sourceChannel } = parsed.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    const session = await prisma.testSession.create({
      data: {
        userId,
        status: "STARTED",
        sourceChannel: sourceChannel || null,
      },
    });

    return NextResponse.json(
      { success: true, data: { sessionId: session.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create session error:", error);
    return NextResponse.json(
      { success: false, error: "创建测试会话失败" },
      { status: 500 }
    );
  }
}
