import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create admin
  const passwordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin created (admin / ChangeMe123!)");

  // 2. Create 8 personality types
  const personalities = [
    {
      typeKey: "condition_leaker",
      name: "条件漏网型",
      dimensionKey: "condition",
      slogan: "你的问题不是不会算，而是题目里的「隐形条件」经常从你眼前溜走。",
      shortDescription: "会做基础题，但综合题容易漏定义域、参数范围、隐藏条件。",
      longDescription: "你在看到题目后容易直接进入计算，但没有先整理定义域、参数范围、限制条件和特殊情况。这导致你明明思路接近正确，却在最后答案、范围或分类讨论上丢分。你的根本问题在于读题到条件整理的第一步不够稳定。",
      typicalBehaviors: JSON.stringify(["看到题就开始算", "很少圈画关键词", "忽略正数、整数、范围等限制词", "综合题最后答案经常不符合题意"]),
      advice: JSON.stringify(["做题前先做条件扫描，不急于计算", "用笔圈出所有限制词和关键条件", "建立定义域、参数范围、单位、特殊值检查清单", "每道综合题先写已知条件列表再解题"]),
      themeColor: "#6366F1",
    },
    {
      typeKey: "formula_sleeper",
      name: "公式沉睡型",
      dimensionKey: "formula",
      slogan: "你的知识不是没有，而是还没有在题目中被快速唤醒。",
      shortDescription: "知识点学过，但做题时想不起来用哪个。",
      longDescription: "你的知识储备并不弱，但知识点和题目信号之间缺乏快速连接。当你看到题目时，相关公式和知识点无法被有效唤醒，导致你独立做题时不知道从哪里下手。一旦有人提醒，你往往能立刻反应过来。",
      typicalBehaviors: JSON.stringify(["看答案觉得自己会", "老师一提醒公式就能做", "独立做题时不知道从哪里下手", "知识点和题目信号没有建立连接"]),
      advice: JSON.stringify(["建立题目信号词到公式的映射表", "每学一个公式配三类典型题", "训练看到条件就反射出对应知识点", "做错题时记录为什么没想到这个公式"]),
      themeColor: "#8B5CF6",
    },
    {
      typeKey: "variant_lost",
      name: "变式迷路型",
      dimensionKey: "transfer",
      slogan: "你掌握的是「这道题」，还没有掌握「这一类题」。",
      shortDescription: "老师讲过会，换个问法就不会。",
      longDescription: "你对原题的掌握很扎实，但面对变式题时缺乏模式识别能力。你记住的是具体步骤而非题型结构，所以当题目背景、问法或数据变化时，你就无法识别出这其实是同一类题。",
      typicalBehaviors: JSON.stringify(["原题会做，换问法就不会", "换数字会做，换背景就不会", "无法识别同一结构的不同变体", "死记步骤而非理解原理"]),
      advice: JSON.stringify(["每道错题都总结题型结构而非只记步骤", "提炼题眼，找到每类题的核心特征", "同一题型至少做三道变式题", "比较原题和变式题之间的不变部分"]),
      themeColor: "#EC4899",
    },
    {
      typeKey: "calculation_crasher",
      name: "计算翻车型",
      dimensionKey: "calculation",
      slogan: "你的方向感不错，但执行链条容易在细节处断开。",
      shortDescription: "思路对，但中间计算失误多。",
      longDescription: "你分析问题的能力并不差，能正确列式、确定解题方向。但你的问题出在执行层面——符号、移项、代入、化简等计算环节容易出错。这导致考后你常常懊恼其实都会，但分数已经被扣掉了。",
      typicalBehaviors: JSON.stringify(["会列式会分析", "符号错、移项错、代入错、化简错", "考后发现其实都会", "执行链条在细节处容易断"]),
      advice: JSON.stringify(["每一步计算都保留中间过程", "训练符号、单位、括号专项检查", "大题每两步做一次回看", "建立易错计算动作清单"]),
      themeColor: "#F59E0B",
    },
    {
      typeKey: "review_disconnected",
      name: "复盘失联型",
      dimensionKey: "review",
      slogan: "错题没有真正进入记忆系统，所以相似问题会反复出现。",
      shortDescription: "错题改了，但下次还错同类题。",
      longDescription: "你的错题本可能很厚，订正也很认真，但问题在于你只改了答案而没有改变思维路径。错题的教训没有真正进入你的长期记忆系统，所以当类似题目再次出现时，你仍然会犯同样的错误。",
      typicalBehaviors: JSON.stringify(["错题本很多但效果不佳", "订正认真但同类问题反复错", "只改答案不改思维路径", "不总结错因模式"]),
      advice: JSON.stringify(["错题必须二刷，隔一周重做一次", "错题记录要写错因标签", "每周整理高频错因", "对同一错因做专项训练"]),
      themeColor: "#3B82F6",
    },
    {
      typeKey: "expression_offline",
      name: "表达掉线型",
      dimensionKey: "expression",
      slogan: "你的脑子里有答案，但卷面没有把它完整表达出来。",
      shortDescription: "会做，但写不完整，考试步骤分拿不满。",
      longDescription: "你能在脑海中形成解题思路，甚至口头能讲清楚，但落到纸面上时过程跳跃、关键步骤缺失、格式不规范。这导致你经常被扣格式分、逻辑分、理由分——这些本不该丢的分。",
      typicalBehaviors: JSON.stringify(["口头能讲清楚", "过程写得跳跃", "关键步骤缺失", "容易被扣格式分和逻辑分"]),
      advice: JSON.stringify(["学标准答案的表达结构", "大题按条件-公式-代入-结论的结构写", "训练每一步都有依据", "做题后对照评分标准补步骤"]),
      themeColor: "#10B981",
    },
    {
      typeKey: "final_boss_lost",
      name: "压轴迷路型",
      dimensionKey: "complex",
      slogan: "你不是完全不会压轴题，而是还不会把复杂问题拆成能下手的小任务。",
      shortDescription: "前面小题还行，一到综合大题后半段就失去方向。",
      longDescription: "你在简单题和中等题上表现稳定，但面对综合大题时缺乏拆解能力。第一问通常能做，但到第二、三问时就迷失方向，看到长题干容易产生畏难情绪。问题在于你还没有掌握把大问题拆成小任务的思维方法。",
      typicalBehaviors: JSON.stringify(["第一问会做，第二问勉强，第三问空着", "看到长题干容易慌", "不会利用前一问的结论", "对综合题有畏难心理"]),
      advice: JSON.stringify(["先找能做的局部突破口", "把题目拆成条件、目标、中间量", "学会利用前一问结论", "压轴题不追求一步到位，先建立第一步"]),
      themeColor: "#EF4444",
    },
    {
      typeKey: "time_blackhole",
      name: "时间黑洞型",
      dimensionKey: "time",
      slogan: "你的时间被少数题悄悄吞掉了，导致会做的题也来不及做。",
      shortDescription: "简单题耗时过长，导致后面会做的题没时间。",
      longDescription: "你的问题不是能力不够，而是考试时间分配出了问题。你容易在某道题上反复纠结、过度检查、不舍得放手，导致后面明明会做的题却没有时间完成。考试策略和节奏感是你最需要训练的能力。",
      typicalBehaviors: JSON.stringify(["考试总觉得时间不够", "喜欢死磕一道题", "简单题检查过度", "后面大题来不及做"]),
      advice: JSON.stringify(["设置单题时间上限", "遇到卡题先跳过，做完再回头", "训练限时完成套题", "考试前规划每个模块用时"]),
      themeColor: "#6366F1",
    },
  ];

  for (const p of personalities) {
    await prisma.personalityType.upsert({
      where: { typeKey: p.typeKey },
      update: {},
      create: p,
    });
  }
  console.log("8 personality types created");

  // 3. Create 24 questions (场景陈述 + 5级符合度量表)
  const SCALE_OPTIONS = JSON.stringify([
    { key: "1", text: "非常符合" },
    { key: "2", text: "比较符合" },
    { key: "3", text: "一般" },
    { key: "4", text: "不太符合" },
    { key: "5", text: "非常不符合" },
  ]);

  // 评分: level 1(非常符合)扣12, 2(比较符合)扣6, 3(一般)不变, 4(不太符合)+5, 5(非常不符合)+8
  function dimScore(d: string) {
    return { "1": { [d]: -12 }, "2": { [d]: -6 }, "3": { [d]: 0 }, "4": { [d]: 5 }, "5": { [d]: 8 } };
  }
  function dualScore(d1: string, d2: string) {
    return { "1": { [d1]: -10, [d2]: -10 }, "2": { [d1]: -5, [d2]: -5 }, "3": { [d1]: 0, [d2]: 0 }, "4": { [d1]: 4, [d2]: 4 }, "5": { [d1]: 7, [d2]: 7 } };
  }

  const questions = [
    // ========== 条件识别力 ==========
    { type: "SCALE", title: "做综合题时，我不会先整理题目条件，而是直接开始计算。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("condition")), orderIndex: 1 },
    { type: "SCALE", title: "我经常漏掉题目中的关键限制条件，比如 x>0、a≠0、整数等。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("condition")), orderIndex: 2 },
    { type: "SCALE", title: "题目中出现「至少」「不超过」「最小值」这类词时，我经常忽略它们或不知道该怎么处理。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("condition")), orderIndex: 3 },
    // ========== 公式唤醒力 ==========
    { type: "SCALE", title: "看到题目时，我经常想不起来应该用哪个公式或知识点。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("formula")), orderIndex: 4 },
    { type: "SCALE", title: "需要老师或同学提示一下公式，我才能把题做出来。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("formula")), orderIndex: 5 },
    { type: "SCALE", title: "我不能快速判断出一道题考察的是哪个知识点，需要反复读题才能确定。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("formula")), orderIndex: 6 },
    // ========== 题型迁移力 ==========
    { type: "SCALE", title: "老师讲过的题，换个问法或换个背景，我就认不出来了。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("transfer")), orderIndex: 7 },
    { type: "SCALE", title: "举一反三对我来说很难，我需要做大量同类题才能掌握。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("transfer")), orderIndex: 8 },
    { type: "SCALE", title: "考试中遇到一道看似陌生的题，我会感到慌张，不知道怎么下手。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dualScore("transfer", "complex")), orderIndex: 9 },
    // ========== 计算稳定性 ==========
    { type: "SCALE", title: "考试后我经常懊恼地发现：思路是对的，但中间算错了。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("calculation")), orderIndex: 10 },
    { type: "SCALE", title: "我的草稿纸很乱，写完后自己都找不到计算过程在哪。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dualScore("calculation", "expression")), orderIndex: 11 },
    { type: "SCALE", title: "我经常犯符号错误，比如正负号写反、大于小于号搞混。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("calculation")), orderIndex: 12 },
    // ========== 复盘转化力 ==========
    { type: "SCALE", title: "错题订正之后，下次遇到同类题我还是会犯同样的错误。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("review")), orderIndex: 13 },
    { type: "SCALE", title: "我有错题本，但基本不翻看，订正完就觉得完事了。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("review")), orderIndex: 14 },
    { type: "SCALE", title: "我订正错题时只是把正确答案抄一遍，不会去分析自己为什么错。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dualScore("review", "transfer")), orderIndex: 15 },
    // ========== 表达规范性 ==========
    { type: "SCALE", title: "我会做的题，经常因为解题步骤写不完整被扣分。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("expression")), orderIndex: 16 },
    { type: "SCALE", title: "做解答题时，我习惯跳步书写，只写关键算式，很少写推导过程。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("expression")), orderIndex: 17 },
    { type: "SCALE", title: "对照标准答案时，我发现自己的解题过程经常缺少关键步骤。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dualScore("expression", "review")), orderIndex: 18 },
    // ========== 压轴拆解力 ==========
    { type: "SCALE", title: "面对综合大题的最后几问，我经常不知道从哪里下手。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("complex")), orderIndex: 19 },
    { type: "SCALE", title: "压轴题我只能做出第(1)小题，后面的就基本放弃了。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("complex")), orderIndex: 20 },
    { type: "SCALE", title: "需要多步推理的复杂题目，我容易在中途迷失方向，忘了下一步该做什么。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dualScore("complex", "condition")), orderIndex: 21 },
    // ========== 时间控制力 ==========
    { type: "SCALE", title: "考试时我经常时间不够用，后面明明会做的题也来不及写。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("time")), orderIndex: 22 },
    { type: "SCALE", title: "遇到有点难但又不是完全不会的题，我容易死磕超过10分钟。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dimScore("time")), orderIndex: 23 },
    { type: "SCALE", title: "考试时我没有时间分配策略，做到哪算哪，经常出现时间失控。", description: "", options: SCALE_OPTIONS, dimensionMapping: JSON.stringify(dualScore("time", "complex")), orderIndex: 24 },
  ];

  // Clean existing questions before seeding to avoid duplicates
  await prisma.answer.deleteMany();
  await prisma.report.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.testSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.question.deleteMany();

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log(questions.length + " questions created");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
