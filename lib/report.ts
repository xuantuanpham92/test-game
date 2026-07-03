import { DIMENSIONS } from "./constants";
import type { DimensionKey } from "./constants";

interface PersonalityData {
  typeKey: string;
  name: string;
  slogan: string;
  shortDescription: string;
  longDescription: string;
  typicalBehaviors: string[];
  advice: string[];
  themeColor: string;
}

interface DimensionScores {
  condition: number;
  formula: number;
  transfer: number;
  calculation: number;
  review: number;
  expression: number;
  complex: number;
  time: number;
}

export function generateSummaryText(
  primaryPersonality: PersonalityData,
  secondaryPersonality: PersonalityData | null,
  scores: DimensionScores
): string {
  const primaryName = primaryPersonality.name;
  const secondaryName = secondaryPersonality?.name || "";

  const lowDimensions = (Object.entries(scores) as [DimensionKey, number][])
    .filter(([, v]) => v < 60)
    .map(([k]) => DIMENSIONS[k])
    .join("、");

  let text = `从你的测评结果看，你的主要弱科人格类型是"${primaryName}"`;
  if (secondaryName) {
    text += `，次要倾向为"${secondaryName}"`;
  }
  text += "。";

  if (lowDimensions) {
    text += `在八项核心学习能力中，你在${lowDimensions}方面存在明显短板，这可能是你当前成绩提升困难的主要根源。`;
    text += `\n\n你并不是"学不会"，而是在学习过程中的关键环节存在可被精确定位的技能缺口。`;
    text += `这些技能缺口完全可以通过针对性的训练得到改善。`;
  }

  text += `\n\n请仔细阅读下方的详细分析，了解你的失分机制和具体提升建议。`;

  return text;
}

export function generateSevenDayPlan(personality: PersonalityData): string[] {
  const defaultPlan = [
    "第1天：整理最近10道错题，按错因分类标注",
    "第2天：针对最主要的能力短板，做3道专项诊断题",
    "第3天：回顾错题本，提炼易错规律",
    "第4天：做一套限时练习，观察薄弱环节触发场景",
    "第5天：针对副人格短板，做3道专项练习",
    "第6天：完整模拟测试，检验本周改进效果",
    "第7天：总结本周进步点，制定下周重点方向",
  ];

  if (personality.advice && personality.advice.length > 0) {
    const tips = personality.advice.slice(0, 4);
    return [
      `第1天：${tips[0] || defaultPlan[0]}`,
      `第2天：${tips[1] || defaultPlan[1]}`,
      `第3天：整理近两周所有错题，标出最能体现你${personality.name}特征的3道`,
      `第4天：${tips[2] || defaultPlan[3]}`,
      `第5天：${tips[3] || defaultPlan[4]}`,
      `第6天：做一套完整限时练习，重点感受你${personality.name}的改善情况`,
      `第7天：总结本周训练效果，记录仍存在的问题点`,
    ];
  }

  return defaultPlan;
}

export function generateTrainingAdvice(
  primaryPersonality: PersonalityData,
  secondaryPersonality: PersonalityData | null
): string[] {
  const advice: string[] = [];

  advice.push(`【针对${primaryPersonality.name}】`);
  if (primaryPersonality.advice && primaryPersonality.advice.length > 0) {
    advice.push(...primaryPersonality.advice.map((a) => `• ${a}`));
  } else {
    advice.push(`• 每日做题前先明确今天要训练的核心能力`);
    advice.push(`• 做题后记录自己在该能力上的表现`);
  }

  if (secondaryPersonality) {
    advice.push("");
    advice.push(`【同时留意：${secondaryPersonality.name}】`);
    if (secondaryPersonality.advice && secondaryPersonality.advice.length > 0) {
      advice.push(...secondaryPersonality.advice.slice(0, 2).map((a) => `• ${a}`));
    } else {
      advice.push(`• 适当关注该方面的训练，避免短板效应`);
    }
  }

  advice.push("");
  advice.push("【通用建议】");
  advice.push("• 每周固定时间复盘本周错题，保持训练连续性");
  advice.push("• 找到你的优势能力作为突破口，用强项带动弱项");
  advice.push("• 定期重新测试，观察能力维度的变化趋势");

  return advice;
}
