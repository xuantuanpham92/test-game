import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            grade: true,
            weakSubject: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "报告不存在" },
        { status: 404 }
      );
    }

    // Look up personality details
    const primaryPersonality = await prisma.personalityType.findUnique({
      where: { typeKey: report.primaryType },
      select: {
        typeKey: true,
        name: true,
        slogan: true,
        illustrationUrl: true,
        themeColor: true,
        shortDescription: true,
        longDescription: true,
        typicalBehaviors: true,
        advice: true,
        dimensionKey: true,
      },
    });

    let secondaryName: string | null = null;
    let hiddenRiskName: string | null = null;

    if (report.secondaryType) {
      const secondary = await prisma.personalityType.findUnique({
        where: { typeKey: report.secondaryType },
        select: { name: true },
      });
      secondaryName = secondary?.name || null;
    }

    if (report.hiddenRiskType) {
      const hiddenRisk = await prisma.personalityType.findUnique({
        where: { typeKey: report.hiddenRiskType },
        select: { name: true },
      });
      hiddenRiskName = hiddenRisk?.name || null;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: report.id,
        sessionId: report.sessionId,
        user: report.user,
        primaryType: primaryPersonality
          ? {
              key: primaryPersonality.typeKey,
              name: primaryPersonality.name,
              slogan: primaryPersonality.slogan,
              illustrationUrl: primaryPersonality.illustrationUrl,
              themeColor: primaryPersonality.themeColor,
              shortDescription: primaryPersonality.shortDescription,
              longDescription: primaryPersonality.longDescription,
              typicalBehaviors: (() => {
                try { return JSON.parse(primaryPersonality.typicalBehaviors); } catch { return []; }
              })(),
              advice: (() => {
                try { return JSON.parse(primaryPersonality.advice); } catch { return []; }
              })(),
              dimensionKey: primaryPersonality.dimensionKey,
            }
          : null,
        secondaryType: report.secondaryType
          ? { key: report.secondaryType, name: secondaryName || report.secondaryType }
          : null,
        hiddenRiskType: report.hiddenRiskType
          ? { key: report.hiddenRiskType, name: hiddenRiskName || report.hiddenRiskType }
          : null,
        strengthDimension: report.strengthDimension,
        dimensionScores: JSON.parse(report.dimensionScores),
        summaryText: report.summaryText,
        sevenDayPlan: JSON.parse(report.sevenDayPlan),
        trainingAdvice: JSON.parse(report.trainingAdvice),
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Get report error:", error);
    return NextResponse.json(
      { success: false, error: "获取报告失败" },
      { status: 500 }
    );
  }
}
