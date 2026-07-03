import { DEFAULT_SCORE, PERSONALITY_BY_DIMENSION, type DimensionKey } from "./constants";

interface AnswerRecord {
  questionId: string;
  selectedOption: string;
}

interface QuestionRecord {
  id: string;
  dimensionMapping: string;
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

interface ScoringResult {
  dimensionScores: DimensionScores;
  primaryType: string;
  secondaryType: string;
  hiddenRiskType: string;
  strengthDimension: string;
}

function applyScore(scores: DimensionScores, deltaMap: Record<string, number> | null): void {
  if (!deltaMap) return;
  for (const [dimension, delta] of Object.entries(deltaMap)) {
    if (dimension in scores) {
      scores[dimension as DimensionKey] += Number(delta);
    }
  }
}

export function calculateScores(
  answers: AnswerRecord[],
  questions: QuestionRecord[]
): ScoringResult {
  const scores: DimensionScores = {
    condition: DEFAULT_SCORE,
    formula: DEFAULT_SCORE,
    transfer: DEFAULT_SCORE,
    calculation: DEFAULT_SCORE,
    review: DEFAULT_SCORE,
    expression: DEFAULT_SCORE,
    complex: DEFAULT_SCORE,
    time: DEFAULT_SCORE,
  };

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    let mapping: Record<string, Record<string, number>>;
    try {
      mapping = JSON.parse(question.dimensionMapping);
    } catch {
      continue;
    }

    let selected: string[];
    try {
      const parsed = JSON.parse(answer.selectedOption);
      selected = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      selected = [answer.selectedOption];
    }

    for (const option of selected) {
      if (mapping[option]) {
        applyScore(scores, mapping[option]);
      }
    }
  }

  for (const key of Object.keys(scores) as DimensionKey[]) {
    scores[key] = Math.max(0, Math.min(100, scores[key]));
  }

  const sorted = (Object.entries(scores) as [DimensionKey, number][]).sort(
    (a, b) => a[1] - b[1]
  );

  const primaryDimension = sorted[0][0];
  const secondaryDimension = sorted[1][0];
  const hiddenRiskDimension = sorted[2][0];
  const strengthDimension = (Object.entries(scores) as [DimensionKey, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    dimensionScores: scores,
    primaryType: PERSONALITY_BY_DIMENSION[primaryDimension],
    secondaryType: PERSONALITY_BY_DIMENSION[secondaryDimension],
    hiddenRiskType: PERSONALITY_BY_DIMENSION[hiddenRiskDimension],
    strengthDimension,
  };
}
