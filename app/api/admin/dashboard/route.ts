import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json(
      { success: false, error: "未授权" },
      { status: 401 }
    );
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalSessions = await prisma.testSession.count();
    const completedSessions = await prisma.testSession.count({
      where: { status: "COMPLETED" },
    });
    const completionRate =
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;
    const totalLeads = await prisma.lead.count();
    const leadRate =
      totalUsers > 0
        ? Math.round((totalLeads / totalUsers) * 100)
        : 0;

    // Personality distribution
    const reports = await prisma.report.findMany({
      select: { primaryType: true },
    });
    const personalityCounts: Record<string, number> = {};
    for (const r of reports) {
      personalityCounts[r.primaryType] =
        (personalityCounts[r.primaryType] || 0) + 1;
    }
    const personalityTypes = await prisma.personalityType.findMany({
      select: { typeKey: true, name: true },
    });
    const typeNameMap: Record<string, string> = {};
    for (const pt of personalityTypes) {
      typeNameMap[pt.typeKey] = pt.name;
    }
    const personalityDistribution = Object.entries(personalityCounts).map(
      ([typeKey, count]) => ({
        typeKey,
        name: typeNameMap[typeKey] || typeKey,
        count,
      })
    );

    // Grade distribution
    const users = await prisma.user.findMany({
      select: { grade: true },
    });
    const gradeCounts: Record<string, number> = {};
    for (const u of users) {
      gradeCounts[u.grade] = (gradeCounts[u.grade] || 0) + 1;
    }
    const gradeDistribution = Object.entries(gradeCounts).map(
      ([grade, count]) => ({ grade, count })
    );

    // Subject distribution
    const usersWithSubject = await prisma.user.findMany({
      select: { weakSubject: true },
    });
    const weakSubjectCounts: Record<string, number> = {};
    for (const u of usersWithSubject) {
      weakSubjectCounts[u.weakSubject] =
        (weakSubjectCounts[u.weakSubject] || 0) + 1;
    }
    const subjectDistribution = Object.entries(weakSubjectCounts).map(
      ([subject, count]) => ({ subject, count })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalSessions,
        completedSessions,
        completionRate,
        totalLeads,
        leadRate,
        personalityDistribution,
        gradeDistribution,
        subjectDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "获取仪表盘数据失败" },
      { status: 500 }
    );
  }
}
