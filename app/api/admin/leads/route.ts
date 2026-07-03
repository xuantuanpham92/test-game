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
    const status = searchParams.get("status") || undefined;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { nickname: true },
          },
          report: {
            select: { primaryType: true },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    // Enrich with names
    const personalityTypes = await prisma.personalityType.findMany({
      select: { typeKey: true, name: true },
    });
    const typeNameMap: Record<string, string> = {};
    for (const pt of personalityTypes) {
      typeNameMap[pt.typeKey] = pt.name;
    }

    const enriched = items.map((lead) => ({
      id: lead.id,
      userId: lead.userId,
      reportId: lead.reportId,
      phone: lead.phone,
      wechat: lead.wechat,
      grade: lead.grade,
      weakSubject: lead.weakSubject,
      status: lead.status,
      note: lead.note,
      assignedTo: lead.assignedTo,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      userNickname: lead.user?.nickname || null,
      primaryType: lead.report?.primaryType || null,
      primaryTypeName: lead.report?.primaryType
        ? typeNameMap[lead.report.primaryType] || lead.report.primaryType
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: { items: enriched, total, page, pageSize },
    });
  } catch (error) {
    console.error("Admin leads error:", error);
    return NextResponse.json(
      { success: false, error: "获取线索列表失败" },
      { status: 500 }
    );
  }
}
