# SPEC 文档：扶摇弱科人格画像测试网站

## 1. 项目名称

**扶摇弱科人格画像测试网站**

英文代号：

```text
fuyao-weakness-personality-test
```

产品定位：

> 一个面向初高中学生的弱科人格画像测试网站，通过问卷、场景题和评分规则，生成学生的学习失分人格画像，并引导用户领取个性化学习计划。

---

# 2. 项目目标

本项目需要开发一个可上线的 Web 应用，包含完整前端、后端、数据库和管理后台。

核心能力：

1. 用户可以访问首页；
2. 用户可以填写基础信息；
3. 用户可以完成弱科人格测评；
4. 系统可以根据答案计算能力分；
5. 系统可以生成主弱科人格、副人格和隐藏风险；
6. 用户可以查看完整结果页；
7. 用户可以保存/分享结果；
8. 用户可以提交联系方式领取详细学习计划；
9. 管理员可以在后台查看用户、测试结果和线索；
10. 管理员可以管理题目、人格式文案和报告模板；
11. 项目可以部署到线上环境。

---

# 3. 技术栈

## 3.1 前端技术栈

使用：

```text
Next.js 14+
React 18+
TypeScript
Tailwind CSS
Framer Motion
Recharts
html-to-image
React Hook Form
Zod
```

用途说明：

| 技术              | 用途                   |
| --------------- | -------------------- |
| Next.js         | 全栈框架、页面路由、API Routes |
| React           | 前端组件开发               |
| TypeScript      | 类型安全                 |
| Tailwind CSS    | 快速完成 UI 样式           |
| Framer Motion   | 页面过渡、按钮反馈、生成页动画      |
| Recharts        | 能力雷达图                |
| html-to-image   | 生成可分享报告图片            |
| React Hook Form | 表单处理                 |
| Zod             | 表单校验和 API 参数校验       |

---

## 3.2 后端技术栈

MVP 推荐：

```text
Next.js API Routes
Prisma ORM
PostgreSQL
JWT / Cookie Session
bcryptjs
```

用途说明：

| 技术                   | 用途      |
| -------------------- | ------- |
| Next.js API Routes   | 后端接口    |
| Prisma               | 数据库 ORM |
| PostgreSQL           | 数据持久化   |
| JWT / Cookie Session | 管理员登录态  |
| bcryptjs             | 管理员密码加密 |

---

## 3.3 部署技术栈

推荐：

```text
Vercel
Neon / Supabase PostgreSQL
Cloudflare DNS
Supabase Storage / S3-compatible Storage
```

MVP 最简部署方案：

```text
Vercel + Neon PostgreSQL
```

---

# 4. 项目目录结构

建议目录结构：

```text
fuyao-weakness-personality-test/
├── app/
│   ├── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── test/
│   │   └── page.tsx
│   ├── generating/
│   │   └── page.tsx
│   ├── result/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── share/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── claim/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── leads/
│   │   │   └── page.tsx
│   │   ├── questions/
│   │   │   └── page.tsx
│   │   ├── personalities/
│   │   │   └── page.tsx
│   │   └── report-templates/
│   │       └── page.tsx
│   ├── api/
│   │   ├── users/
│   │   │   └── route.ts
│   │   ├── questions/
│   │   │   └── route.ts
│   │   ├── test-sessions/
│   │   │   └── route.ts
│   │   ├── answers/
│   │   │   └── route.ts
│   │   ├── reports/
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── leads/
│   │   │   └── route.ts
│   │   └── admin/
│   │       ├── login/
│   │       │   └── route.ts
│   │       ├── logout/
│   │       │   └── route.ts
│   │       ├── users/
│   │       │   └── route.ts
│   │       ├── leads/
│   │       │   └── route.ts
│   │       ├── questions/
│   │       │   └── route.ts
│   │       ├── personalities/
│   │       │   └── route.ts
│   │       └── dashboard/
│   │           └── route.ts
├── components/
│   ├── common/
│   ├── home/
│   ├── test/
│   ├── result/
│   ├── admin/
│   └── charts/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── scoring.ts
│   ├── report.ts
│   ├── validators.ts
│   └── constants.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   └── personalities/
├── styles/
├── middleware.ts
├── package.json
├── .env.example
└── README.md
```

---

# 5. 核心页面

## 5.1 用户端页面

### 5.1.1 首页 `/`

目标：

> 让用户理解产品，并点击开始测试。

页面模块：

1. 顶部导航；
2. Hero 区域；
3. 产品主标题；
4. 产品副标题；
5. 开始测试按钮；
6. 人格卡片预览；
7. 测试流程说明；
8. 示例报告展示；
9. 家长信任模块；
10. 底部 CTA。

首页主文案：

```text
测出你的弱科人格画像
```

副文案：

```text
你不是简单"数学差"，而是有一个具体的失分机制正在拖慢你。
```

主要按钮：

```text
开始测试
```

---

### 5.1.2 基础信息页 `/profile`

目标：

> 收集用户基础信息，创建用户记录。

字段：

| 字段                 | 必填 | 类型     |
| ------------------ | -- | ------ |
| nickname           | 否  | string |
| phone              | 否  | string |
| wechat             | 否  | string |
| grade              | 是  | enum   |
| weak_subject       | 是  | enum   |
| latest_score_range | 否  | enum   |
| target_score       | 否  | string |
| source_channel     | 否  | string |

年级选项：

```text
初一、初二、初三、高一、高二、高三
```

薄弱科目选项：

```text
数学、语文、英语、物理、化学、生物、历史、政治、地理
```

提交后：

1. 调用 `POST /api/users`；
2. 创建用户；
3. 创建测试 session；
4. 跳转到 `/test?sessionId=xxx`。

---

### 5.1.3 测评页 `/test`

目标：

> 让用户完成测评题，记录答案。

页面要求：

1. 有进度条；
2. 每页展示一道题；
3. 选项为大卡片；
4. 支持上一题；
5. 支持下一题；
6. 完成后跳转生成页；
7. 移动端体验优先。

题目类型：

```text
single_choice
multiple_choice
scale
scenario
```

MVP 第一版可以只实现：

```text
single_choice
scale
scenario
```

答题逻辑：

1. 页面加载时调用 `GET /api/questions`；
2. 用户选择答案；
3. 点击下一题时调用 `POST /api/answers`；
4. 最后一题完成后调用 `POST /api/reports/generate`；
5. 跳转 `/generating?reportId=xxx`。

---

### 5.1.4 生成页 `/generating`

目标：

> 增强报告生成的价值感。

页面展示时间：

```text
3-6 秒
```

文案轮播：

```text
正在分析你的失分模式...
正在匹配弱科人格...
正在生成能力画像...
正在定位最该优先提升的能力...
正在生成你的专属学习建议...
```

动画要求：

1. 圆环加载；
2. 卡片扫描效果；
3. 人格卡片翻转；
4. 结束后自动跳转结果页。

跳转逻辑：

```text
/generating?reportId=xxx
等待 3-6 秒
跳转 /result/xxx
```

---

### 5.1.5 结果页 `/result/[id]`

目标：

> 展示完整弱科人格画像，促成分享和留资。

页面模块：

1. 人格标题；
2. 人格插画；
3. 一句话诊断；
4. 主人格；
5. 副人格；
6. 隐藏风险；
7. 优势能力；
8. 能力雷达图；
9. 主要失分机制；
10. 典型表现；
11. 七天提升建议；
12. 推荐训练方向；
13. 保存报告；
14. 分享按钮；
15. 领取完整学习计划 CTA。

首屏文案示例：

```text
你的弱科人格：条件漏网型
你的问题不是不会算，而是题目里的"隐形条件"经常从你眼前溜走。
```

结果页必须调用：

```text
GET /api/reports/:id
```

---

### 5.1.6 分享页 `/share/[id]`

目标：

> 展示适合分享的轻量版报告。

内容：

1. 人格名称；
2. 人格插画；
3. 一句话文案；
4. 能力短板；
5. 二维码或测试入口；
6. 品牌露出。

支持：

1. 保存为图片；
2. 微信内长按保存；
3. 复制链接。

---

### 5.1.7 领取计划页 `/claim`

目标：

> 让用户提交联系方式，形成销售线索。

字段：

| 字段           | 必填          |
| ------------ | ----------- |
| phone        | 手机号和微信至少填一个 |
| wechat       | 手机号和微信至少填一个 |
| grade        | 是           |
| weak_subject | 是           |
| report_id    | 是           |

提交后调用：

```text
POST /api/leads
```

提交成功文案：

```text
已收到你的信息，我们会根据你的弱科人格画像生成更详细的学习建议。
```

---

# 6. 管理后台页面

## 6.1 后台登录 `/admin/login`

功能：

1. 管理员输入用户名和密码；
2. 调用 `POST /api/admin/login`；
3. 登录成功后写入 HTTP-only Cookie；
4. 跳转 `/admin/dashboard`。

---

## 6.2 数据看板 `/admin/dashboard`

展示指标：

| 指标     | 说明                         |
| ------ | -------------------------- |
| 总访问数   | 可先用测试 session 数替代          |
| 测试开始人数 | 创建 session 的人数             |
| 测试完成人数 | completed session          |
| 测试完成率  | 完成人数 / 开始人数                |
| 留资人数   | leads 数                    |
| 留资率    | leads / completed sessions |
| 各人格分布  | reports 按 primary_type 统计  |
| 各年级分布  | users 按 grade 统计           |
| 各学科分布  | users 按 weak_subject 统计    |

---

## 6.3 用户管理 `/admin/users`

功能：

1. 查看用户列表；
2. 搜索手机号、微信、昵称；
3. 按年级筛选；
4. 按薄弱科目筛选；
5. 查看用户测试记录；
6. 查看用户报告；
7. 导出 CSV。

---

## 6.4 线索管理 `/admin/leads`

功能：

1. 查看线索；
2. 按跟进状态筛选；
3. 标记跟进状态；
4. 添加备注；
5. 分配负责人；
6. 导出 CSV。

跟进状态：

```text
new
contacted
interested
converted
invalid
```

---

## 6.5 题目管理 `/admin/questions`

功能：

1. 创建题目；
2. 编辑题目；
3. 删除题目；
4. 设置选项；
5. 设置维度分数；
6. 设置排序；
7. 上架/下架。

---

## 6.6 人格管理 `/admin/personalities`

功能：

1. 创建人格；
2. 编辑人格名称；
3. 编辑一句话文案；
4. 编辑详细描述；
5. 编辑典型表现；
6. 编辑提升建议；
7. 上传或填写插画 URL；
8. 配置对应能力维度。

---

# 7. 数据库设计

使用 PostgreSQL + Prisma。

## 7.1 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Grade {
  JUNIOR_1
  JUNIOR_2
  JUNIOR_3
  SENIOR_1
  SENIOR_2
  SENIOR_3
}

enum Subject {
  MATH
  CHINESE
  ENGLISH
  PHYSICS
  CHEMISTRY
  BIOLOGY
  HISTORY
  POLITICS
  GEOGRAPHY
}

enum QuestionType {
  SINGLE_CHOICE
  MULTIPLE_CHOICE
  SCALE
  SCENARIO
}

enum SessionStatus {
  STARTED
  COMPLETED
  ABANDONED
}

enum LeadStatus {
  NEW
  CONTACTED
  INTERESTED
  CONVERTED
  INVALID
}

enum AdminRole {
  SUPER_ADMIN
  OPERATOR
}

model User {
  id                String        @id @default(cuid())
  nickname          String?
  phone             String?
  wechat            String?
  grade             Grade
  weakSubject       Subject
  latestScoreRange  String?
  targetScore       String?
  sourceChannel     String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  sessions          TestSession[]
  reports           Report[]
  leads             Lead[]
}

model Question {
  id                String        @id @default(cuid())
  type              QuestionType
  title             String
  description       String?
  options           Json
  dimensionMapping  Json
  orderIndex        Int
  isActive          Boolean       @default(true)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  answers           Answer[]
}

model TestSession {
  id                String        @id @default(cuid())
  userId            String
  status            SessionStatus @default(STARTED)
  startedAt         DateTime      @default(now())
  completedAt       DateTime?
  sourceChannel     String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user              User          @relation(fields: [userId], references: [id])
  answers           Answer[]
  report            Report?
}

model Answer {
  id                String        @id @default(cuid())
  sessionId         String
  questionId        String
  selectedOption    Json
  scoreMapping      Json?
  createdAt         DateTime      @default(now())

  session           TestSession   @relation(fields: [sessionId], references: [id])
  question          Question      @relation(fields: [questionId], references: [id])

  @@unique([sessionId, questionId])
}

model PersonalityType {
  id                String        @id @default(cuid())
  typeKey           String        @unique
  name              String
  dimensionKey      String
  slogan            String
  shortDescription  String
  longDescription   String
  typicalBehaviors  Json
  advice            Json
  iconUrl           String?
  illustrationUrl   String?
  themeColor        String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

model Report {
  id                String        @id @default(cuid())
  userId            String
  sessionId         String        @unique
  primaryType       String
  secondaryType     String?
  hiddenRiskType    String?
  strengthDimension String?
  dimensionScores   Json
  summaryText       String
  sevenDayPlan      Json
  trainingAdvice    Json
  shareImageUrl     String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user              User          @relation(fields: [userId], references: [id])
  session           TestSession   @relation(fields: [sessionId], references: [id])
  leads             Lead[]
}

model Lead {
  id                String        @id @default(cuid())
  userId            String?
  reportId          String?
  phone             String?
  wechat            String?
  grade             Grade?
  weakSubject       Subject?
  status            LeadStatus    @default(NEW)
  note              String?
  assignedTo        String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user              User?         @relation(fields: [userId], references: [id])
  report            Report?       @relation(fields: [reportId], references: [id])
}

model Admin {
  id                String        @id @default(cuid())
  username          String        @unique
  passwordHash      String
  role              AdminRole     @default(OPERATOR)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}
```

---

# 8. 能力维度定义

系统内部统一使用以下维度 key：

```ts
export const DIMENSIONS = {
  condition: "条件识别力",
  formula: "公式唤醒力",
  transfer: "题型迁移力",
  calculation: "计算稳定性",
  review: "复盘转化力",
  expression: "表达规范性",
  complex: "压轴拆解力",
  time: "时间控制力",
} as const;
```

每个维度满分：

```text
100
```

每个维度初始分：

```text
70
```

题目选项可以对不同维度加减分。

示例：

```json
{
  "A": {
    "condition": -10,
    "formula": 0,
    "transfer": 0,
    "calculation": 0,
    "review": 0,
    "expression": 0,
    "complex": 0,
    "time": 0
  },
  "B": {
    "condition": 8
  },
  "C": {
    "formula": -8
  },
  "D": {
    "transfer": -6
  }
}
```

最后分数需要限制在：

```text
0 到 100
```

---

# 9. 人格映射规则

## 9.1 维度到人格映射

```ts
export const PERSONALITY_BY_DIMENSION = {
  condition: "condition_leaker",
  formula: "formula_sleeper",
  transfer: "variant_lost",
  calculation: "calculation_crasher",
  review: "review_disconnected",
  expression: "expression_offline",
  complex: "final_boss_lost",
  time: "time_blackhole",
} as const;
```

---

## 9.2 人格类型

### condition_leaker

名称：

```text
条件漏网型
```

对应维度：

```text
condition
```

一句话：

```text
你的问题不是不会算，而是题目里的"隐形条件"经常从你眼前溜走。
```

---

### formula_sleeper

名称：

```text
公式沉睡型
```

对应维度：

```text
formula
```

一句话：

```text
你的知识不是没有，而是还没有在题目中被快速唤醒。
```

---

### variant_lost

名称：

```text
变式迷路型
```

对应维度：

```text
transfer
```

一句话：

```text
你掌握的是"这道题"，还没有掌握"这一类题"。
```

---

### calculation_crasher

名称：

```text
计算翻车型
```

对应维度：

```text
calculation
```

一句话：

```text
你的方向感不错，但执行链条容易在细节处断开。
```

---

### review_disconnected

名称：

```text
复盘失联型
```

对应维度：

```text
review
```

一句话：

```text
错题没有真正进入记忆系统，所以相似问题会反复出现。
```

---

### expression_offline

名称：

```text
表达掉线型
```

对应维度：

```text
expression
```

一句话：

```text
你的脑子里有答案，但卷面没有把它完整表达出来。
```

---

### final_boss_lost

名称：

```text
压轴迷路型
```

对应维度：

```text
complex
```

一句话：

```text
你不是完全不会压轴题，而是还不会把复杂问题拆成能下手的小任务。
```

---

### time_blackhole

名称：

```text
时间黑洞型
```

对应维度：

```text
time
```

一句话：

```text
你的时间被少数题悄悄吞掉了，导致会做的题也来不及做。
```

---

# 10. 评分算法

## 10.1 输入

输入数据：

```ts
type AnswerInput = {
  questionId: string;
  selectedOption: string | string[];
};
```

题目数据中包含：

```ts
type DimensionScoreMap = {
  condition?: number;
  formula?: number;
  transfer?: number;
  calculation?: number;
  review?: number;
  expression?: number;
  complex?: number;
  time?: number;
};
```

---

## 10.2 输出

输出数据：

```ts
type ScoringResult = {
  dimensionScores: {
    condition: number;
    formula: number;
    transfer: number;
    calculation: number;
    review: number;
    expression: number;
    complex: number;
    time: number;
  };
  primaryType: string;
  secondaryType: string;
  hiddenRiskType: string;
  strengthDimension: string;
};
```

---

## 10.3 算法逻辑

步骤：

1. 初始化所有维度为 70 分；
2. 遍历用户每道题答案；
3. 根据该选项的 scoreMapping 修改对应维度；
4. 将每个维度分数限制在 0-100；
5. 按分数从低到高排序；
6. 最低分维度对应主型；
7. 第二低分维度对应副型；
8. 第三低分维度对应隐藏风险；
9. 最高分维度为优势能力；
10. 生成报告文案。

---

## 10.4 评分伪代码

```ts
import { DIMENSIONS, PERSONALITY_BY_DIMENSION } from "@/lib/constants";

const DEFAULT_SCORE = 70;

export function calculateScores(answers, questions) {
  const scores = {
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
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    const mapping = question.dimensionMapping;
    const selected = answer.selectedOption;

    if (Array.isArray(selected)) {
      for (const option of selected) {
        applyScore(scores, mapping[option]);
      }
    } else {
      applyScore(scores, mapping[selected]);
    }
  }

  for (const key of Object.keys(scores)) {
    scores[key] = Math.max(0, Math.min(100, scores[key]));
  }

  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);

  const primaryDimension = sorted[0][0];
  const secondaryDimension = sorted[1][0];
  const hiddenRiskDimension = sorted[2][0];

  const strengthDimension = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  return {
    dimensionScores: scores,
    primaryType: PERSONALITY_BY_DIMENSION[primaryDimension],
    secondaryType: PERSONALITY_BY_DIMENSION[secondaryDimension],
    hiddenRiskType: PERSONALITY_BY_DIMENSION[hiddenRiskDimension],
    strengthDimension,
  };
}

function applyScore(scores, deltaMap) {
  if (!deltaMap) return;

  for (const [dimension, delta] of Object.entries(deltaMap)) {
    if (scores[dimension] === undefined) continue;
    scores[dimension] += Number(delta);
  }
}
```

---

# 11. API 设计

## 11.1 创建用户

```http
POST /api/users
```

请求：

```json
{
  "nickname": "张同学",
  "phone": "13800000000",
  "wechat": "student123",
  "grade": "SENIOR_1",
  "weakSubject": "MATH",
  "latestScoreRange": "80-100",
  "targetScore": "120",
  "sourceChannel": "offline_qr"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "userId": "clx_user_id"
  }
}
```

校验规则：

1. grade 必填；
2. weakSubject 必填；
3. phone 和 wechat 可选；
4. 如果填写 phone，必须符合手机号格式；
5. targetScore 可为空。

---

## 11.2 获取题目列表

```http
GET /api/questions
```

返回：

```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "q1",
        "type": "SINGLE_CHOICE",
        "title": "你做综合题时，通常第一步会做什么？",
        "description": "选择最符合你真实情况的选项。",
        "options": [
          {
            "key": "A",
            "text": "直接开始计算"
          },
          {
            "key": "B",
            "text": "先圈出条件和限制"
          }
        ],
        "orderIndex": 1
      }
    ]
  }
}
```

注意：

> 前端不应该拿到完整 dimensionMapping，避免用户端暴露评分规则。
> 评分应在后端完成。

---

## 11.3 创建测试会话

```http
POST /api/test-sessions
```

请求：

```json
{
  "userId": "clx_user_id",
  "sourceChannel": "offline_qr"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "sessionId": "clx_session_id"
  }
}
```

---

## 11.4 提交答案

```http
POST /api/answers
```

请求：

```json
{
  "sessionId": "clx_session_id",
  "questionId": "clx_question_id",
  "selectedOption": "A"
}
```

返回：

```json
{
  "success": true
}
```

要求：

1. 同一个 session 下，同一道题只能有一条答案；
2. 如果用户修改答案，则 upsert；
3. selectedOption 可以是 string 或 string[]；
4. 必须校验 questionId 是否存在；
5. 必须校验 session 是否存在。

---

## 11.5 生成报告

```http
POST /api/reports/generate
```

请求：

```json
{
  "sessionId": "clx_session_id"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "reportId": "clx_report_id",
    "primaryType": "condition_leaker",
    "secondaryType": "formula_sleeper",
    "hiddenRiskType": "final_boss_lost",
    "dimensionScores": {
      "condition": 42,
      "formula": 58,
      "transfer": 66,
      "calculation": 72,
      "review": 61,
      "expression": 70,
      "complex": 55,
      "time": 68
    }
  }
}
```

后端逻辑：

1. 根据 sessionId 查询 answers；
2. 查询对应 questions；
3. 调用 scoring 函数；
4. 生成人格结果；
5. 生成 summaryText；
6. 生成 sevenDayPlan；
7. 写入 reports 表；
8. 将 test_sessions.status 更新为 COMPLETED；
9. 返回 reportId。

如果同一个 session 已经生成过报告：

> 直接返回已有 report，不重复生成。

---

## 11.6 获取报告

```http
GET /api/reports/:id
```

返回：

```json
{
  "success": true,
  "data": {
    "id": "report_id",
    "primaryType": {
      "key": "condition_leaker",
      "name": "条件漏网型",
      "slogan": "你的问题不是不会算，而是题目里的"隐形条件"经常从你眼前溜走。",
      "illustrationUrl": "/personalities/condition-leaker.png"
    },
    "secondaryType": {
      "key": "formula_sleeper",
      "name": "公式沉睡型"
    },
    "hiddenRiskType": {
      "key": "final_boss_lost",
      "name": "压轴迷路型"
    },
    "strengthDimension": "calculation",
    "dimensionScores": {
      "condition": 42,
      "formula": 58,
      "transfer": 66,
      "calculation": 72,
      "review": 61,
      "expression": 70,
      "complex": 55,
      "time": 68
    },
    "summaryText": "从你的测评结果看，你在基础计算方面并不是完全薄弱...",
    "sevenDayPlan": [],
    "trainingAdvice": []
  }
}
```

---

## 11.7 提交线索

```http
POST /api/leads
```

请求：

```json
{
  "userId": "clx_user_id",
  "reportId": "clx_report_id",
  "phone": "13800000000",
  "wechat": "student123",
  "grade": "SENIOR_1",
  "weakSubject": "MATH",
  "note": "想领取详细学习计划"
}
```

返回：

```json
{
  "success": true,
  "data": {
    "leadId": "clx_lead_id"
  }
}
```

校验：

1. phone 和 wechat 至少填一个；
2. reportId 如果存在，需要校验报告存在；
3. lead 默认状态为 NEW。

---

# 12. 管理员 API

## 12.1 登录

```http
POST /api/admin/login
```

请求：

```json
{
  "username": "admin",
  "password": "admin_password"
}
```

返回：

```json
{
  "success": true
}
```

逻辑：

1. 查询 admin；
2. bcrypt 校验密码；
3. 写入 HTTP-only Cookie；
4. Cookie 有效期 7 天。

---

## 12.2 登出

```http
POST /api/admin/logout
```

返回：

```json
{
  "success": true
}
```

---

## 12.3 获取用户列表

```http
GET /api/admin/users?page=1&pageSize=20&grade=SENIOR_1&weakSubject=MATH
```

返回：

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

---

## 12.4 获取线索列表

```http
GET /api/admin/leads?page=1&pageSize=20&status=NEW
```

---

## 12.5 更新线索状态

```http
PATCH /api/admin/leads/:id
```

请求：

```json
{
  "status": "CONTACTED",
  "note": "已添加微信，等待沟通"
}
```

---

## 12.6 获取后台看板

```http
GET /api/admin/dashboard
```

返回：

```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalSessions": 120,
    "completedSessions": 80,
    "completionRate": 0.67,
    "totalLeads": 30,
    "leadRate": 0.38,
    "personalityDistribution": [],
    "gradeDistribution": [],
    "subjectDistribution": []
  }
}
```

---

# 13. 种子数据

项目必须提供 `prisma/seed.ts`，用于初始化：

1. 管理员账号；
2. 八种人格；
3. 初始测试题。

---

## 13.1 默认管理员

```text
username: admin
password: ChangeMe123!
```

注意：

> 首次上线后必须修改默认密码。

---

## 13.2 默认人格数据

必须初始化八种人格：

```text
condition_leaker
formula_sleeper
variant_lost
calculation_crasher
review_disconnected
expression_offline
final_boss_lost
time_blackhole
```

---

## 13.3 初始题目数量

MVP 至少需要：

```text
24 道题
```

题目分布：

| 维度    | 题目数 |
| ----- | --- |
| 条件识别力 | 3   |
| 公式唤醒力 | 3   |
| 题型迁移力 | 3   |
| 计算稳定性 | 3   |
| 复盘转化力 | 3   |
| 表达规范性 | 3   |
| 压轴拆解力 | 3   |
| 时间控制力 | 3   |

---

# 14. 初始测试题示例

## 14.1 条件识别力题目

题目：

```text
做综合题时，你通常第一步会做什么？
```

选项：

```json
[
  {
    "key": "A",
    "text": "直接开始计算，边做边看条件"
  },
  {
    "key": "B",
    "text": "先圈出题目里的范围、单位、限制词"
  },
  {
    "key": "C",
    "text": "先看自己会不会套公式"
  },
  {
    "key": "D",
    "text": "不太固定，看题目难不难"
  }
]
```

评分：

```json
{
  "A": {
    "condition": -10
  },
  "B": {
    "condition": 8
  },
  "C": {
    "formula": -3,
    "condition": -4
  },
  "D": {
    "condition": -5
  }
}
```

---

## 14.2 公式唤醒力题目

题目：

```text
你是否经常出现"看答案觉得会，但自己做时想不起用哪个公式"的情况？
```

选项：

```json
[
  {
    "key": "A",
    "text": "经常"
  },
  {
    "key": "B",
    "text": "偶尔"
  },
  {
    "key": "C",
    "text": "很少"
  },
  {
    "key": "D",
    "text": "几乎没有"
  }
]
```

评分：

```json
{
  "A": {
    "formula": -12
  },
  "B": {
    "formula": -6
  },
  "C": {
    "formula": 4
  },
  "D": {
    "formula": 8
  }
}
```

---

## 14.3 题型迁移力题目

题目：

```text
老师讲过一道题后，换一个问法或换一个背景，你通常会怎样？
```

选项：

```json
[
  {
    "key": "A",
    "text": "还能认出是同一类题"
  },
  {
    "key": "B",
    "text": "需要想很久才能反应过来"
  },
  {
    "key": "C",
    "text": "经常感觉像一道新题"
  },
  {
    "key": "D",
    "text": "只要数字变了我就容易卡住"
  }
]
```

评分：

```json
{
  "A": {
    "transfer": 8
  },
  "B": {
    "transfer": -5
  },
  "C": {
    "transfer": -12
  },
  "D": {
    "transfer": -8
  }
}
```

---

## 14.4 计算稳定性题目

题目：

```text
考试后你是否经常发现：思路是对的，但中间算错了？
```

选项：

```json
[
  {
    "key": "A",
    "text": "经常，非常影响分数"
  },
  {
    "key": "B",
    "text": "偶尔会有"
  },
  {
    "key": "C",
    "text": "很少"
  },
  {
    "key": "D",
    "text": "基本不会"
  }
]
```

评分：

```json
{
  "A": {
    "calculation": -12
  },
  "B": {
    "calculation": -5
  },
  "C": {
    "calculation": 4
  },
  "D": {
    "calculation": 8
  }
}
```

---

# 15. 前端组件设计

## 15.1 通用组件

```text
Button
Card
Input
Select
ProgressBar
Badge
Modal
LoadingRing
PageContainer
SectionTitle
```

---

## 15.2 首页组件

```text
HeroSection
PersonalityPreviewCards
HowItWorks
SampleReportPreview
ParentTrustSection
HomeCTA
```

---

## 15.3 测评组件

```text
TestProgress
QuestionCard
OptionCard
TestNavigation
QuestionTransition
```

---

## 15.4 结果页组件

```text
PersonalityHero
PersonalityIllustration
DimensionRadarChart
DimensionScoreList
DiagnosisSummary
WeaknessMechanismCard
TypicalBehaviorList
SevenDayPlan
TrainingAdvice
ShareReportButton
ClaimPlanCTA
```

---

## 15.5 后台组件

```text
AdminLayout
AdminSidebar
AdminHeader
DataTable
SearchFilter
StatusBadge
DashboardMetricCard
PersonalityForm
QuestionForm
LeadStatusSelect
```

---

# 16. UI 设计规范

## 16.1 整体风格

关键词：

```text
年轻、专业、有趣、科技感、轻游戏化、适合学生、家长也可信
```

---

## 16.2 颜色建议

主色：

```text
蓝紫渐变
```

建议色值：

```text
#6366F1
#8B5CF6
#EC4899
```

背景色：

```text
#F8FAFC
#EEF2FF
```

文字色：

```text
#111827
#374151
#6B7280
```

状态色：

```text
成功：#10B981
警告：#F59E0B
危险：#EF4444
信息：#3B82F6
```

---

## 16.3 字体

中文优先：

```text
system-ui
PingFang SC
Microsoft YaHei
Noto Sans SC
```

---

## 16.4 交互要求

1. 所有按钮 hover 有反馈；
2. 移动端按钮高度不低于 44px；
3. 选项卡片点击后有选中状态；
4. 生成页必须有动画；
5. 结果页首屏必须有视觉冲击；
6. 页面切换不应突兀；
7. 表单错误提示要清晰。

---

# 17. 环境变量

`.env.example`：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

ADMIN_JWT_SECRET="replace-this-with-a-strong-secret"

NODE_ENV="development"
```

如果后续使用对象存储：

```env
STORAGE_ENDPOINT=""
STORAGE_ACCESS_KEY=""
STORAGE_SECRET_KEY=""
STORAGE_BUCKET=""
```

---

# 18. 安全要求

## 18.1 管理后台安全

1. 后台必须登录；
2. 管理员密码使用 bcrypt hash；
3. 登录态使用 HTTP-only Cookie；
4. 后台 API 必须校验管理员身份；
5. 非管理员访问 `/admin/*` 时跳转登录页。

---

## 18.2 用户数据安全

1. 手机号和微信号不在公开页面展示；
2. 结果页通过 reportId 访问；
3. reportId 使用 cuid，不使用自增 ID；
4. API 返回数据时避免泄露内部评分规则；
5. 前端获取 questions 时不得返回 dimensionMapping。

---

## 18.3 防刷要求

MVP 简单实现：

1. 对提交答案接口做基础频率限制；
2. 同一 session 同一题使用 upsert；
3. 生成报告接口防止重复生成；
4. 无 sessionId 不允许提交答案。

---

# 19. 边界条件

## 19.1 用户端边界

| 场景           | 处理方式                         |
| ------------ | ---------------------------- |
| 用户未填写必填项     | 阻止提交，显示错误                    |
| 用户刷新测评页      | 根据 sessionId 恢复题目状态，MVP 可重新答 |
| 用户重复提交答案     | upsert 覆盖旧答案                 |
| 用户完成题目不足     | 不允许生成报告                      |
| reportId 不存在 | 显示 404 或报告不存在                |
| 手机号格式错误      | 提示重新输入                       |
| 用户不留资        | 仍可查看基础报告                     |

---

## 19.2 后台边界

| 场景          | 处理方式                    |
| ----------- | ----------------------- |
| 未登录访问后台     | 跳转登录                    |
| 登录密码错误      | 显示错误                    |
| 删除正在使用的人格   | 禁止删除，允许停用               |
| 删除已有答案关联的题目 | 不物理删除，改为 isActive=false |
| 导出无数据       | 导出空 CSV 或提示无数据          |

---

# 20. 验证命令

开发完成后必须通过以下命令。

## 20.1 安装依赖

```bash
npm install
```

---

## 20.2 类型检查

```bash
npm run typecheck
```

如果 package 中没有该命令，需要添加：

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 20.3 代码检查

```bash
npm run lint
```

---

## 20.4 数据库迁移

```bash
npx prisma migrate dev
```

---

## 20.5 生成 Prisma Client

```bash
npx prisma generate
```

---

## 20.6 初始化种子数据

```bash
npx prisma db seed
```

---

## 20.7 本地启动

```bash
npm run dev
```

本地访问：

```text
http://localhost:3000
```

---

## 20.8 生产构建

```bash
npm run build
```

必须保证：

```text
build 成功，无 TypeScript 错误，无关键 lint 错误
```

---

# 21. package.json 脚本要求

需要包含：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "prisma db seed"
  }
}
```

---

# 22. 迭代策略

## 22.1 第一阶段：可跑通 MVP

目标：

> 完成从首页到测试、结果、留资、后台查看的完整闭环。

必须完成：

1. 首页；
2. 基础信息页；
3. 测评页；
4. 报告生成；
5. 结果页；
6. 留资；
7. 后台登录；
8. 用户/线索查看；
9. 数据库存储；
10. 本地和线上可运行。

---

## 22.2 第二阶段：增强后台配置能力

新增：

1. 题目管理；
2. 人格管理；
3. 报告模板管理；
4. 数据看板；
5. CSV 导出；
6. 渠道来源统计。

---

## 22.3 第三阶段：增强传播和商业化

新增：

1. 分享卡片生成；
2. 微信分享优化；
3. 付费报告；
4. AI 生成学习计划；
5. 多次测试对比；
6. 学生历史报告；
7. 地推渠道二维码。

---

# 23. 阻塞停止条件

开发过程中遇到以下情况，需要停止当前实现并修正：

## 23.1 技术阻塞

1. 数据库 schema 无法迁移；
2. 评分算法结果不稳定；
3. 报告无法被重复访问；
4. 用户答案无法正确保存；
5. 后台权限无法保护；
6. 构建无法通过。

---

## 23.2 产品阻塞

1. 用户完成测试后无法看到结果；
2. 结果页没有主型、副型、分数和建议；
3. 后台看不到用户和线索；
4. 题目没有明确评分映射；
5. 结果看起来像随机生成；
6. 移动端无法正常使用。

---

## 23.3 上线阻塞

1. `npm run build` 失败；
2. 环境变量缺失；
3. 数据库无法连接；
4. 生产环境无法生成报告；
5. 后台无需登录即可访问；
6. 用户隐私信息公开暴露；
7. 主要页面在手机端错位严重。

---

# 24. 最终验收标准

## 24.1 用户完整流程验收

测试流程：

1. 打开首页；
2. 点击开始测试；
3. 填写基础信息；
4. 进入测评页；
5. 完成所有题目；
6. 进入生成页；
7. 自动跳转结果页；
8. 查看人格画像；
9. 查看能力雷达图；
10. 点击领取学习计划；
11. 填写联系方式；
12. 后台可以看到该线索。

以上流程必须完整可用。

---

## 24.2 后台完整流程验收

管理员流程：

1. 打开 `/admin/login`；
2. 输入管理员账号密码；
3. 登录后台；
4. 查看 dashboard；
5. 查看用户列表；
6. 查看线索列表；
7. 修改线索跟进状态；
8. 查看测试结果；
9. 管理题目；
10. 管理人格文案。

以上流程必须完整可用。

---

## 24.3 数据正确性验收

必须满足：

1. 用户信息写入 users 表；
2. 测试 session 写入 test_sessions 表；
3. 答案写入 answers 表；
4. 报告写入 reports 表；
5. 线索写入 leads 表；
6. 人格计算结果符合规则；
7. reportId 可以重复访问对应报告；
8. 后台数据统计与数据库一致。

---

## 24.4 UI 验收

必须满足：

1. 首页不像默认模板；
2. 测评页有进度和交互反馈；
3. 结果页有完整视觉设计；
4. 人格卡片美观；
5. 雷达图正常展示；
6. 移动端无明显错位；
7. 生成页有动画；
8. 按钮、卡片、字体、间距统一；
9. 家长看起来可信；
10. 学生看起来有趣。

---

# 25. 交付物

开发完成后需要交付：

1. GitHub 仓库；
2. README；
3. `.env.example`；
4. Prisma schema；
5. Seed 数据；
6. 前端页面；
7. API 接口；
8. 管理后台；
9. 部署地址；
10. 测试账号；
11. 管理员账号；
12. 本地启动说明；
13. 线上部署说明。

---

# 26. README 必须包含

README 需要包含：

```text
项目介绍
技术栈
本地启动步骤
环境变量说明
数据库迁移步骤
种子数据初始化
管理员账号说明
主要页面路由
主要 API
部署方式
常见问题
```

---

# 27. 成功标准

项目完成后，应达到以下状态：

1. 非技术人员可以打开网站完成测试；
2. 学生能获得一个明确、有趣的弱科人格结果；
3. 家长能看懂孩子的问题在哪里；
4. 地推人员可以用这个网站收集线索；
5. 管理员可以查看用户和线索；
6. 系统数据可以持续沉淀；
7. 网站可以在线上稳定访问；
8. 后续可以扩展付费报告、AI 学习计划和错题分析。

---

# 28. 开发执行优先级

## P0

必须优先完成：

```text
数据库 schema
seed 数据
首页
基础信息页
测评页
评分算法
报告生成接口
结果页
线索提交
后台登录
后台用户/线索列表
部署上线
```

---

## P1

随后完成：

```text
雷达图
分享卡片
题目管理
人格管理
数据看板
CSV 导出
移动端细节优化
```

---

## P2

最后完成：

```text
AI 报告
付费解锁
微信分享优化
渠道二维码
历史测试记录
多次测试对比
学习计划自动生成
```

---

# 29. 重要开发原则

1. 不要先做复杂 AI，先把规则引擎跑通；
2. 不要先做登录注册，MVP 用 session + reportId 即可；
3. 不要把评分规则暴露给前端；
4. 不要让结果页像随机文案生成器；
5. 不要过度娱乐化，家长必须觉得可信；
6. 移动端优先，因为地推和微信传播主要在手机上；
7. 后台必须能导出线索，否则地推价值不足；
8. 所有人格、题目、报告模板尽量可配置，避免写死；
9. 第一版目标是跑通商业闭环，不是做完美学习系统；
10. 最小闭环是：测试 → 结果 → 留资 → 后台跟进。
