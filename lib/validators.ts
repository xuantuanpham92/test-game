import { z } from "zod";

export const createUserSchema = z.object({
  nickname: z.string().optional(),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "请输入正确的手机号")
    .optional()
    .or(z.literal("")),
  wechat: z.string().optional(),
  grade: z.enum([
    "JUNIOR_1",
    "JUNIOR_2",
    "JUNIOR_3",
    "SENIOR_1",
    "SENIOR_2",
    "SENIOR_3",
  ]),
  weakSubject: z.enum([
    "MATH",
    "CHINESE",
    "ENGLISH",
    "PHYSICS",
    "CHEMISTRY",
    "BIOLOGY",
    "HISTORY",
    "POLITICS",
    "GEOGRAPHY",
  ]),
  latestScoreRange: z.string().optional(),
  targetScore: z.string().optional(),
  sourceChannel: z.string().optional(),
});

export const createSessionSchema = z.object({
  userId: z.string().min(1),
  sourceChannel: z.string().optional(),
});

export const submitAnswerSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  selectedOption: z.union([z.string(), z.array(z.string())]),
});

export const generateReportSchema = z.object({
  sessionId: z.string().min(1),
});

export const createLeadSchema = z.object({
  userId: z.string().optional(),
  reportId: z.string().optional(),
  phone: z.string().optional(),
  wechat: z.string().optional(),
  grade: z.string().optional(),
  weakSubject: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => data.phone || data.wechat, {
  message: "手机号和微信至少填写一个",
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
});

export const createQuestionSchema = z.object({
  type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE", "SCALE", "SCENARIO"]),
  title: z.string().min(1),
  description: z.string().optional(),
  options: z.string(),
  dimensionMapping: z.string(),
  orderIndex: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const createPersonalitySchema = z.object({
  typeKey: z.string().min(1),
  name: z.string().min(1),
  dimensionKey: z.string().min(1),
  slogan: z.string().min(1),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  typicalBehaviors: z.string().optional(),
  advice: z.string().optional(),
  iconUrl: z.string().optional(),
  illustrationUrl: z.string().optional(),
  themeColor: z.string().optional(),
});
