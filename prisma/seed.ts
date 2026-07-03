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

  // 3. Create 24 questions
  const questions = [
    // ===== 条件识别力 (3 questions) =====
    {
      type: "SCENARIO",
      title: "做综合题时，你通常第一步会做什么？",
      description: "选择最符合你真实情况的选项。",
      options: JSON.stringify([
        { key: "A", text: "直接开始计算，边做边看条件" },
        { key: "B", text: "先圈出题目里的范围、单位、限制词" },
        { key: "C", text: "先看自己会不会套公式" },
        { key: "D", text: "不太固定，看题目难不难" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { condition: -10 },
        B: { condition: 8 },
        C: { formula: -3, condition: -4 },
        D: { condition: -5 },
      }),
      orderIndex: 1,
    },
    {
      type: "SINGLE_CHOICE",
      title: "你是否经常漏掉题目中的 x>0、a≠0、整数 等限制条件？",
      description: "回顾你最近的考试和作业情况。",
      options: JSON.stringify([
        { key: "A", text: "经常漏，导致整道题做错" },
        { key: "B", text: "偶尔会漏，但一般后面能发现" },
        { key: "C", text: "很少漏，我会刻意关注这些条件" },
        { key: "D", text: "基本不错这类问题" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { condition: -12 },
        B: { condition: -6 },
        C: { condition: 5 },
        D: { condition: 8 },
      }),
      orderIndex: 2,
    },
    {
      type: "SCENARIO",
      title: "题目中出现「至少」「不超过」「最小值」这类词时，你的第一反应是？",
      description: "选择最接近你真实反应的选项。",
      options: JSON.stringify([
        { key: "A", text: "直接忽略，先算再说" },
        { key: "B", text: "圈出来，作为最后检查的依据" },
        { key: "C", text: "先换算成数学表达式（不等式、区间等）" },
        { key: "D", text: "注意到了但经常忘记在答案中体现" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { condition: -10 },
        B: { condition: 5 },
        C: { condition: 8 },
        D: { condition: -5, expression: -3 },
      }),
      orderIndex: 3,
    },
    // ===== 公式唤醒力 (3 questions) =====
    {
      type: "SINGLE_CHOICE",
      title: "你是否经常出现「看答案觉得会，但自己做时想不起用哪个公式」的情况？",
      description: "选择最符合你真实情况的选项。",
      options: JSON.stringify([
        { key: "A", text: "经常" },
        { key: "B", text: "偶尔" },
        { key: "C", text: "很少" },
        { key: "D", text: "几乎没有" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { formula: -12 },
        B: { formula: -6 },
        C: { formula: 4 },
        D: { formula: 8 },
      }),
      orderIndex: 4,
    },
    {
      type: "SCENARIO",
      title: "看到一道题时，你能多快判断出它考察的是哪个知识点？",
      description: "以你最有把握的学科为例。",
      options: JSON.stringify([
        { key: "A", text: "几乎能立刻判断" },
        { key: "B", text: "需要先读两遍题才能确定" },
        { key: "C", text: "经常判断错，或者不确定" },
        { key: "D", text: "得先看看答案才能确认" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { formula: 8 },
        B: { formula: -3 },
        C: { formula: -10, transfer: -5 },
        D: { formula: -12 },
      }),
      orderIndex: 5,
    },
    {
      type: "SINGLE_CHOICE",
      title: "老师提示用某个公式后，你能立刻把题做出来吗？",
      description: "回想你被点拨后的反应。",
      options: JSON.stringify([
        { key: "A", text: "能，而且会觉得刚才怎么没想到" },
        { key: "B", text: "大部分时候能" },
        { key: "C", text: "有时能，有时还是不会用" },
        { key: "D", text: "就算知道了公式也不太会用" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { formula: -8 },
        B: { formula: -4 },
        C: { formula: 3 },
        D: { formula: 8, transfer: -5 },
      }),
      orderIndex: 6,
    },
    // ===== 题型迁移力 (3 questions) =====
    {
      type: "SCENARIO",
      title: "老师讲过一道题后，换一个问法或换一个背景，你通常会怎样？",
      description: "选择最接近你真实情况的选项。",
      options: JSON.stringify([
        { key: "A", text: "还能认出是同一类题" },
        { key: "B", text: "需要想很久才能反应过来" },
        { key: "C", text: "经常感觉像一道新题" },
        { key: "D", text: "只要数字变了我就容易卡住" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { transfer: 8 },
        B: { transfer: -5 },
        C: { transfer: -12 },
        D: { transfer: -8 },
      }),
      orderIndex: 7,
    },
    {
      type: "SINGLE_CHOICE",
      title: "你觉得举一反三对你来说容易吗？",
      description: "以数学或物理为例。",
      options: JSON.stringify([
        { key: "A", text: "比较容易，我擅长找规律" },
        { key: "B", text: "一般，需要多练几道同类题才行" },
        { key: "C", text: "比较难，需要老师带着做变式" },
        { key: "D", text: "很难，我基本只能做原题" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { transfer: 8 },
        B: { transfer: -3 },
        C: { transfer: -8 },
        D: { transfer: -12 },
      }),
      orderIndex: 8,
    },
    {
      type: "SCENARIO",
      title: "考试中遇到一道看似陌生的题，你最常怎么做？",
      description: "选择最接近你真实反应的选项。",
      options: JSON.stringify([
        { key: "A", text: "冷静分析，尝试匹配熟悉的题型结构" },
        { key: "B", text: "先跳过，做后面的题" },
        { key: "C", text: "有点慌，尝试用最可能的方法硬做" },
        { key: "D", text: "直接放弃或随便写几步" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { transfer: 8, condition: 3 },
        B: { transfer: -3, time: 5 },
        C: { transfer: -8, formula: -3 },
        D: { transfer: -12, complex: -5 },
      }),
      orderIndex: 9,
    },
    // ===== 计算稳定性 (3 questions) =====
    {
      type: "SINGLE_CHOICE",
      title: "考试后你是否经常发现：思路是对的，但中间算错了？",
      description: "选择最符合你真实情况的选项。",
      options: JSON.stringify([
        { key: "A", text: "经常，非常影响分数" },
        { key: "B", text: "偶尔会有" },
        { key: "C", text: "很少" },
        { key: "D", text: "基本不会" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { calculation: -12 },
        B: { calculation: -5 },
        C: { calculation: 4 },
        D: { calculation: 8 },
      }),
      orderIndex: 10,
    },
    {
      type: "SCENARIO",
      title: "你在草稿纸上的计算过程是怎样的？",
      description: "选择最接近你实际情况的选项。",
      options: JSON.stringify([
        { key: "A", text: "很乱，自己有时都找不到" },
        { key: "B", text: "大体有序，但偶尔会很乱" },
        { key: "C", text: "比较整齐，每步都写清楚" },
        { key: "D", text: "非常整洁，像答题过程一样" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { calculation: -10, expression: -5 },
        B: { calculation: -3 },
        C: { calculation: 6 },
        D: { calculation: 8, time: -3 },
      }),
      orderIndex: 11,
    },
    {
      type: "SINGLE_CHOICE",
      title: "你是否经常犯符号错误（正负号、大于小于号等）？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "经常，是最让我头疼的问题之一" },
        { key: "B", text: "偶尔会犯" },
        { key: "C", text: "很少，我会特别注意" },
        { key: "D", text: "基本不会" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { calculation: -10 },
        B: { calculation: -4 },
        C: { calculation: 5 },
        D: { calculation: 8 },
      }),
      orderIndex: 12,
    },
    // ===== 复盘转化力 (3 questions) =====
    {
      type: "SINGLE_CHOICE",
      title: "你做完错题订正后，同类题还会再错吗？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "经常再错，感觉订正没用" },
        { key: "B", text: "有时再错" },
        { key: "C", text: "很少再错" },
        { key: "D", text: "基本不会，订正后就真会了" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { review: -12 },
        B: { review: -6 },
        C: { review: 5 },
        D: { review: 8 },
      }),
      orderIndex: 13,
    },
    {
      type: "SINGLE_CHOICE",
      title: "你有错题本吗？如果有，你是怎么用的？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "有，但基本不翻看" },
        { key: "B", text: "有，考前会翻一遍" },
        { key: "C", text: "有，会定期重做错题" },
        { key: "D", text: "有，会分类整理并总结错因规律" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { review: -10 },
        B: { review: -3 },
        C: { review: 6 },
        D: { review: 8, transfer: 3 },
      }),
      orderIndex: 14,
    },
    {
      type: "SCENARIO",
      title: "你订正错题时，通常怎么做？",
      description: "选择最接近你实际情况的选项。",
      options: JSON.stringify([
        { key: "A", text: "抄一遍正确答案就完了" },
        { key: "B", text: "看懂答案，写出正确过程" },
        { key: "C", text: "重做一遍，确保自己能独立做对" },
        { key: "D", text: "重做+标注错因+一周后再做一次" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { review: -12 },
        B: { review: -5 },
        C: { review: 5 },
        D: { review: 8 },
      }),
      orderIndex: 15,
    },
    // ===== 表达规范性 (3 questions) =====
    {
      type: "SINGLE_CHOICE",
      title: "你是否有会做但步骤分拿不满的情况？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "经常，每次考试都有这类丢分" },
        { key: "B", text: "偶尔会有" },
        { key: "C", text: "很少，我知道怎么写过程" },
        { key: "D", text: "基本不会" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { expression: -12 },
        B: { expression: -5 },
        C: { expression: 5 },
        D: { expression: 8 },
      }),
      orderIndex: 16,
    },
    {
      type: "SCENARIO",
      title: "做一道大题时，你的书写过程通常是？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "跳步较多，只写关键算式" },
        { key: "B", text: "有过程但不规范，想到哪写到哪" },
        { key: "C", text: "按步骤写，但偶尔遗漏中间过程" },
        { key: "D", text: "完整规范，按条件-公式-代入-结论结构写" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { expression: -10 },
        B: { expression: -6 },
        C: { expression: 3 },
        D: { expression: 8 },
      }),
      orderIndex: 17,
    },
    {
      type: "SINGLE_CHOICE",
      title: "对照标准答案时，你发现自己的过程差异主要在？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "关键步骤缺失，逻辑链不完整" },
        { key: "B", text: "表达方式不标准，但意思差不多" },
        { key: "C", text: "偶尔漏写理由或推导过程" },
        { key: "D", text: "差别不大，基本都写全了" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { expression: -10, review: -3 },
        B: { expression: -6 },
        C: { expression: 3 },
        D: { expression: 8 },
      }),
      orderIndex: 18,
    },
    // ===== 压轴拆解力 (3 questions) =====
    {
      type: "SINGLE_CHOICE",
      title: "看到一道综合大题（最后两题级别），你的第一反应是什么？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "先读题，尝试拆成几个小问题" },
        { key: "B", text: "能做多少算多少" },
        { key: "C", text: "有点紧张，需要读好几遍" },
        { key: "D", text: "看完觉得太难，先跳过" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { complex: 8 },
        B: { complex: -3 },
        C: { complex: -6, time: -3 },
        D: { complex: -12, time: 5 },
      }),
      orderIndex: 19,
    },
    {
      type: "SCENARIO",
      title: "对于压轴题中的第(1)小题和第(3)小题，你的表现通常是？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "第(1)小题会做，(2)(3)直接空着" },
        { key: "B", text: "第(1)(2)能做，(3)看情况" },
        { key: "C", text: "基本都能完成" },
        { key: "D", text: "连第(1)小题都经常做不对" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { complex: -8 },
        B: { complex: -3 },
        C: { complex: 8 },
        D: { complex: -12, condition: -5 },
      }),
      orderIndex: 20,
    },
    {
      type: "SCENARIO",
      title: "面对一道需要多步推理的复杂题，你通常会？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "先画图或列条件，梳理清楚再开始" },
        { key: "B", text: "直接开始做第一步，走一步看一步" },
        { key: "C", text: "容易在中途迷失方向" },
        { key: "D", text: "经常不知道第一步该做什么" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { complex: 8, condition: 3 },
        B: { complex: -4 },
        C: { complex: -8, time: -3 },
        D: { complex: -12, formula: -3 },
      }),
      orderIndex: 21,
    },
    // ===== 时间控制力 (3 questions) =====
    {
      type: "SINGLE_CHOICE",
      title: "考试时，你是否经常时间不够用？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "几乎每次都这样" },
        { key: "B", text: "经常这样" },
        { key: "C", text: "偶尔会" },
        { key: "D", text: "基本够用" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { time: -12 },
        B: { time: -7 },
        C: { time: 3 },
        D: { time: 8 },
      }),
      orderIndex: 22,
    },
    {
      type: "SCENARIO",
      title: "遇到一道有点难但又不是完全不会的题，你通常会花多长时间？",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "很容易超过10分钟，不做好不罢休" },
        { key: "B", text: "5-8分钟，还没思路就跳过" },
        { key: "C", text: "3-5分钟，严格控制" },
        { key: "D", text: "看心情，没有固定策略" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { time: -10 },
        B: { time: 5 },
        C: { time: 8 },
        D: { time: -6 },
      }),
      orderIndex: 23,
    },
    {
      type: "SINGLE_CHOICE",
      title: "你有考试时间分配策略吗？（比如每个模块分配多少分钟）",
      description: "",
      options: JSON.stringify([
        { key: "A", text: "有明确策略，考前就规划好" },
        { key: "B", text: "大概有个感觉" },
        { key: "C", text: "没有刻意规划" },
        { key: "D", text: "考试时全凭感觉，经常失控" },
      ]),
      dimensionMapping: JSON.stringify({
        A: { time: 8 },
        B: { time: 3 },
        C: { time: -5 },
        D: { time: -12 },
      }),
      orderIndex: 24,
    },
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
