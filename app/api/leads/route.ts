import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createLeadSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        userId: data.userId || null,
        reportId: data.reportId || null,
        phone: data.phone || null,
        wechat: data.wechat || null,
        grade: data.grade || null,
        weakSubject: data.weakSubject || null,
        note: data.note || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, data: { leadId: lead.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { success: false, error: "创建线索失败" },
      { status: 500 }
    );
  }
}
