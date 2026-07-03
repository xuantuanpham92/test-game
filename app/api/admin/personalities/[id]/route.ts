import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "未授权" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    const personality = await prisma.personalityType.findUnique({
      where: { id },
    });
    if (!personality) {
      return NextResponse.json(
        { success: false, error: "人格类型不存在" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    const allowedFields = [
      "typeKey",
      "name",
      "dimensionKey",
      "slogan",
      "shortDescription",
      "longDescription",
      "typicalBehaviors",
      "advice",
      "iconUrl",
      "illustrationUrl",
      "themeColor",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "没有要更新的字段" },
        { status: 400 }
      );
    }

    const updated = await prisma.personalityType.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update personality error:", error);
    return NextResponse.json(
      { success: false, error: "更新人格类型失败" },
      { status: 500 }
    );
  }
}
