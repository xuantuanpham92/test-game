import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "未授权" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20"))
    );
    const search = searchParams.get("search") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { nickname: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          reports: {
            select: {
              id: true,
              primaryType: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: { sessions: true, leads: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Enrich with primary personality name
    const personalityTypes = await prisma.personalityType.findMany({
      select: { typeKey: true, name: true },
    });
    const typeNameMap: Record<string, string> = {};
    for (const pt of personalityTypes) {
      typeNameMap[pt.typeKey] = pt.name;
    }

    const enriched = items.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      phone: user.phone,
      wechat: user.wechat,
      grade: user.grade,
      weakSubject: user.weakSubject,
      latestScoreRange: user.latestScoreRange,
      targetScore: user.targetScore,
      sourceChannel: user.sourceChannel,
      createdAt: user.createdAt,
      sessionCount: user._count.sessions,
      leadCount: user._count.leads,
      latestReport: user.reports[0]
        ? {
            id: user.reports[0].id,
            primaryType: user.reports[0].primaryType,
            primaryTypeName:
              typeNameMap[user.reports[0].primaryType] ||
              user.reports[0].primaryType,
            createdAt: user.reports[0].createdAt,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: { items: enriched, total, page, pageSize },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { success: false, error: "获取用户列表失败" },
      { status: 500 }
    );
  }
}
