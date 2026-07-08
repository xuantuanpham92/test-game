import { NextResponse } from "next/server";
import { prisma, withDatabaseRetry } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const user = await withDatabaseRetry(() =>
      prisma.user.create({
        data: {
          nickname: data.nickname || null,
          phone: data.phone === "" ? null : data.phone || null,
          wechat: data.wechat || null,
          grade: data.grade,
          weakSubject: data.weakSubject,
          latestScoreRange: data.latestScoreRange || null,
          targetScore: data.targetScore || null,
          sourceChannel: data.sourceChannel || null,
        },
      })
    );

    return NextResponse.json(
      { success: true, data: { userId: user.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, error: "创建用户失败" },
      { status: 500 }
    );
  }
}
