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
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    // Allowed fields for update
    const allowedFields = [
      "type",
      "title",
      "description",
      "options",
      "dimensionMapping",
      "orderIndex",
      "isActive",
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

    const question = await prisma.question.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { success: false, error: "更新题目失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Soft delete: set isActive to false
    await prisma.question.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { success: false, error: "删除题目失败" },
      { status: 500 }
    );
  }
}
