import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReportSchema } from "@/lib/validators";
import { calculateScores } from "@/lib/scoring";
import {
  generateSummaryText,
  generateSevenDayPlan,
  generateTrainingAdvice,
} from "@/lib/report";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { sessionId } = parsed.data;

    const session = await prisma.testSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      return NextResponse.json(
        { success: false, error: "会话不存在" },
        { status: 404 }
      );
    }

    // If session already has a report, return it
    const existingReport = await prisma.report.findUnique({
      where: { sessionId },
    });
    if (existingReport) {
      let existingScores = {};
      try { existingScores = JSON.parse(existingReport.dimensionScores); } catch {}
      return NextResponse.json({
        success: true,
        data: {
          reportId: existingReport.id,
          primaryType: existingReport.primaryType,
          secondaryType: existingReport.secondaryType,
          hiddenRiskType: existingReport.hiddenRiskType,
          dimensionScores: existingScores,
        },
      });
    }

    const answers = await prisma.answer.findMany({
      where: { sessionId },
    });
    const questions = await prisma.question.findMany({
      select: { id: true, dimensionMapping: true },
    });

    // Calculate scores
    const answerRecords = answers.map((a) => ({
      questionId: a.questionId,
      selectedOption: a.selectedOption,
    }));
    const questionRecords = questions.map((q) => ({
      id: q.id,
      dimensionMapping: q.dimensionMapping,
    }));
    const scoringResult = calculateScores(answerRecords, questionRecords);

    // Look up personality types
    const primaryPersonality = await prisma.personalityType.findUnique({
      where: { typeKey: scoringResult.primaryType },
    });
    const secondaryPersonality = await prisma.personalityType.findUnique({
      where: { typeKey: scoringResult.secondaryType },
    });
    const hiddenRiskPersonality = scoringResult.hiddenRiskType
      ? await prisma.personalityType.findUnique({
          where: { typeKey: scoringResult.hiddenRiskType },
        })
      : null;

    if (!primaryPersonality) {
      return NextResponse.json(
        { success: false, error: "人格类型数据缺失" },
        { status: 500 }
      );
    }

    // Build personality data for report generation
    const buildPersonalityData = (p: typeof primaryPersonality) => ({
      typeKey: p.typeKey,
      name: p.name,
      slogan: p.slogan,
      shortDescription: p.shortDescription,
      longDescription: p.longDescription,
      typicalBehaviors: (() => {
        try {
          return JSON.parse(p.typicalBehaviors);
        } catch {
          return [];
        }
      })(),
      advice: (() => {
        try {
          return JSON.parse(p.advice);
        } catch {
          return [];
        }
      })(),
      themeColor: p.themeColor || "",
    });

    const primaryData = buildPersonalityData(primaryPersonality);
    const secondaryData = secondaryPersonality
      ? buildPersonalityData(secondaryPersonality)
      : null;

    const summaryText = generateSummaryText(
      primaryData,
      secondaryData,
      scoringResult.dimensionScores
    );
    const sevenDayPlan = generateSevenDayPlan(primaryData);
    const trainingAdvice = generateTrainingAdvice(primaryData, secondaryData);

    const report = await prisma.report.create({
      data: {
        userId: session.userId,
        sessionId,
        primaryType: scoringResult.primaryType,
        secondaryType: scoringResult.secondaryType,
        hiddenRiskType: scoringResult.hiddenRiskType,
        strengthDimension: scoringResult.strengthDimension,
        dimensionScores: JSON.stringify(scoringResult.dimensionScores),
        summaryText,
        sevenDayPlan: JSON.stringify(sevenDayPlan),
        trainingAdvice: JSON.stringify(trainingAdvice),
      },
    });

    // Update session status
    await prisma.testSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: {
        reportId: report.id,
        primaryType: report.primaryType,
        secondaryType: report.secondaryType,
        hiddenRiskType: report.hiddenRiskType,
        dimensionScores: scoringResult.dimensionScores,
      },
    });
  } catch (error) {
    console.error("Generate report error:", error);
    return NextResponse.json(
      { success: false, error: "生成报告失败" },
      { status: 500 }
    );
  }
}
