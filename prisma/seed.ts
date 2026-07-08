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
    // ──────────── 条件漏网型 ────────────
    {
      typeKey: "condition_leaker",
      name: "条件漏网型",
      dimensionKey: "condition",
      slogan: "你的问题不是不会算，而是题目里的「隐形条件」经常从你眼前溜走。",
      shortDescription: "会做基础题，但综合题容易漏定义域、参数范围、隐藏条件。",
      longDescription: `【核心诊断】
你的失分根源不在解题能力，而在审题阶段。你的数学思维没有问题，列式、计算、推理这些环节都可以正常完成，但问题出在最前面——条件识别。

【失分机制】
当题目只给出一两个条件时，你能处理得很好。但综合题往往同时涉及三到五个条件，其中有明面上的（如"已知x=3"），也有隐性的（如"x>0""a是整数""不考虑空气阻力"）。这些隐性条件像一道筛网——其他学生可能在读题2-3遍后自动捕捉到它们，而你往往在第一遍快速浏览后就跳入了计算阶段。

【为什么你没发现】
这不是"马虎"，而是一种注意力的选择性分配。你的大脑在扫描题目时，会优先抓取数字和关键词，但对于"取值范围""单位""实际意义"这类限制性词汇，你的视觉跳过率远高于正常水平。这是可以训练的。

【典型考试场景】
一道12分的综合题，你的思路框架值10分，但因为漏了一个"a≠0"的条件，第一问就错了方向，最后只拿到2-3分的过程分。考后看到答案时你恍然大悟——"原来有这个条件！"——但已经晚了。

【预测与发展】
如果不干预，随着年级升高和题目复杂度增加，你的条件遗漏率会进一步上升。好消息是：条件识别力的训练效果通常很快，2-3周的刻意练习就能看到明显改善。`,
      typicalBehaviors: JSON.stringify([
        "看到题目中有数字就开始算，很少先完整读一遍",
        "做综合题时很少在纸面上圈画限制条件",
        "考后看到正确答案时才发现自己漏了一个关键条件",
        "对于x>0、a≠0、整数、正数等限制词敏感度低",
        "分类讨论题经常漏掉其中一种情况",
        "老师提醒'再读一遍题'后，往往能自己发现问题",
      ]),
      advice: JSON.stringify([
        "建立三步审题法：①圈出所有数字 ②用下划线标出所有限制词 ③在草稿纸上列出已知条件清单",
        "每道综合题在动笔前，强制停顿15秒做条件扫描",
        "专门做条件识别训练题：只读题、列条件，不计算结果",
        "用荧光笔标注法：不同条件类型用不同颜色标记（范围=黄，单位=绿，特殊值=粉）",
        "和同学互查：交换审题笔记，看对方漏了哪些条件",
        "建立个人遗漏检查清单模板，考试时逐项核对",
      ]),
      themeColor: "#6366F1",
    },
    // ──────────── 公式沉睡型 ────────────
    {
      typeKey: "formula_sleeper",
      name: "公式沉睡型",
      dimensionKey: "formula",
      slogan: "你的知识不是没有，而是还没有在题目中被快速唤醒。",
      shortDescription: "知识点学过，但做题时想不起来用哪个。",
      longDescription: `【核心诊断】
你的问题不是知识储备不足，而是知识检索失灵。公式和概念都存储在大脑里，但在面对具体题目时，提取通道卡住了——你不知道这道题应该调用哪个工具。

【失分机制】
学习过程中，你接收知识点时通常是按章节顺序的：第一章学函数，第二章学数列，第三章学三角。但考试是混合出题的，题目不会提前告诉你自己要用的公式在哪一章。你的问题就出在这个"匹配环节"——题目信号→知识点检索→公式调用的链路断了。

【为什么会出现这种情况】
原因通常有两个：一是学公式时只记形式没记用途场景，比如只记了sin²θ+cos²θ=1，但不清楚什么题型下需要用它；二是刷题量和题型覆盖面不够，知识点的"使用信号"没有建立足够的神经连接。

【典型考试场景】
碰到一道中等难度的题，你花了3-5分钟尝试了两种方法都不对，最后放弃。考后翻开答案，看到解题第一步用的公式——"哦！这个我知道！"但考试时就是没想起来。这类丢分往往占你失分总量的30%-40%。

【预测与发展】
这是八种失分人格中改善空间最大的一类。因为知识已经在脑子里了，只要建立高效的提取机制，成绩可以很快提升。关键是：不要以为自己"会了"就跳过专项训练，真正掌握 = 看到题目标题就能立即反应出可能要用到的公式。`,
      typicalBehaviors: JSON.stringify([
        "看到答案后经常说'原来是用这个公式，我明明知道的'",
        "独立做题时遇到卡壳，老师一提醒公式就能立刻做出来",
        "同章节的练习题完成度好，但综合卷或模拟考表现明显下降",
        "做题时经常需要翻课本或笔记确认公式",
        "对于题目中的'信号词'（如极大值→求导、切线→斜率→求导）反应不够快",
        "学完一个知识点后很少主动去想'它可能在什么题型里出现'",
      ]),
      advice: JSON.stringify([
        "为每个核心公式建立题型标签卡：正面写公式，背面写3种常见题型和使用信号",
        "训练关键词反射：看到题目中的特定词汇，立刻说出可能涉及的公式（不计算）",
        "每周做一次公式快速匹配训练：随机看10道题，每题10秒内说出要用哪几个公式",
        "建立知识点网络图：把公式之间的关系用连线画出来，理解它们的内在关联",
        "做题时强迫自己先列出可能需要用到的公式清单，再开始解题",
        "不要按章节刷题，主动做综合练习，让大脑习惯混合检索",
      ]),
      themeColor: "#8B5CF6",
    },
    // ──────────── 变式迷路型 ────────────
    {
      typeKey: "variant_lost",
      name: "变式迷路型",
      dimensionKey: "transfer",
      slogan: "你掌握的是「这道题」，还没有掌握「这一类题」。",
      shortDescription: "老师讲过会，换个问法就不会。",
      longDescription: `【核心诊断】
你的学习停留在"题型记忆"层面，还没达到"模式识别"层面。你能精准复现老师讲过的解题步骤，但当题目换了一个面貌出现时，你的识别系统就失灵了。

【失分机制】
学习数学需要两种能力：一是记忆解题步骤，二是抽象出题目的核心结构。前者让你能做出原题，后者让你能应对变式。你目前两种能力明显不均衡——记忆能力远强于抽象总结能力。所以你记住了一道题的"外貌特征"（数字的位置、图形的样子、问题的句式），但没有抓住它的"遗传基因"（核心数学模型和逻辑结构）。

【为什么会出现这种情况】
很多学生都有这个阶段。这是从"模仿学习"过渡到"理解学习"的自然瓶颈。你习惯的做题模式是"这道题我见过→知道怎么做"或"这道题我没见过→不知道怎么做"。真正高效的模式应该是"这道题虽然没见过，但我能看出它本质上是一个______问题"。

【典型考试场景】
期中考试有一道题和作业第三题很像，只是把"三角形ABC"换成了"四边形ABCD"，把"求最大值"改成了"求最小值"。你在考场上犹豫了很久，觉得"好像做过类似的但又不太一样"。最终要么做错了方向，要么直接空着。考后发现，解题思路完全一样。

【预测与发展】
题型迁移力是初高中衔接和高年级数学学习的核心能力。如果不改善，随着数学概念的抽象程度增加，你会越来越吃力。但一旦突破了"模式识别"这道门槛，你会发现自己突然"开窍"了，很多以前觉得无关的题型之间都有了联系。`,
      typicalBehaviors: JSON.stringify([
        "老师讲例题时觉得简单，但作业换成不同数字和背景就卡住了",
        "同一类题连做三道会了，但隔几天再遇到（换了表述方式）又不会了",
        "习惯性地把题目和某个见过的题比较，不一样就觉得是新题型",
        "很少主动思考'这道题和昨天那道的本质区别是什么'",
        "复习时倾向于重做原题而非找变式题练习",
        "看到陌生题目的第一反应是紧张而不是分析结构",
      ]),
      advice: JSON.stringify([
        "每做完一道题，用一句话写出这道题的'核心结构'——去掉数字后的骨架",
        "主动做变式对比训练：找原题和变式题各一道，放在一起对比分析异同",
        "建立题型思维导图：把同类型的题归到一个节点下，用关键词标注识别特征",
        "训练题眼提取：拿到题目后先不计算，只用30秒判断'这本质上是什么类型的题'",
        "每周做一次陌生题型模拟：专门找没见过的题练习拆解能力",
        "错题本不仅要记录怎么做，更要记录'我当时为什么没认出它'",
      ]),
      themeColor: "#EC4899",
    },
    // ──────────── 计算翻车型 ────────────
    {
      typeKey: "calculation_crasher",
      name: "计算翻车型",
      dimensionKey: "calculation",
      slogan: "你的方向感不错，但执行链条容易在细节处断开。",
      shortDescription: "思路对，但中间计算失误多。",
      longDescription: `【核心诊断】
你的数学方向感良好——知道该用哪个公式、走哪条路，但在从A点到B点的执行过程中，容易因为细节问题翻车。这就像一个导航很准的人，但走路时经常被小石头绊倒。

【失分机制】
计算错误的本质不是"算错了"这么简单，而是你的大脑在执行计算动作时，分配给计算的注意力不足。当你解一道大题时，你的注意力在多个任务间切换：理解题意→选择方法→书写过程→中间计算→验证检查。你的脑力资源主要分配给了"理解题意"和"选择方法"这类高阶任务，留给"中间计算"和"验证检查"的注意力就非常有限了。

【为什么总是符号错】
正负号、大于小于号、移项变号——这些是最高频的计算翻车点。这些符号的识别在大脑中由同一个微小区域处理，当你的注意力被分配到其他任务时，这个区域的信号处理就容易出错。换句话说，不是你不会加减小数，而是你在大脑负荷不平衡的情况下做这些事。

【典型考试场景】
一道大题你写了15行过程，思路优美，方法正确。但翻到答案页时傻眼了——第3行的移项把负号漏了，导致后面12行全是基于错误数据做的，整道题12分全扣。更气人的是，如果让你在草稿纸上单独算那个移项，你绝对不会错。

【预测与发展】
计算稳定性是所有数学能力的"地基"。如果这个问题不解决，你的实际得分将永远低于你的真实能力。好消息是这个问题完全可以通过改善计算习惯来克服，不需要额外的知识学习。`,
      typicalBehaviors: JSON.stringify([
        "会列式、会分析，但经常在符号、移项、分数运算上出错",
        "考试后看到答案经常懊恼：方向是对的，中间一个小步骤算错了",
        "草稿纸上的字迹和布局比较乱，有时回头检查找不到关键步骤",
        "一道题反复算两三遍，但每次都犯不同的计算错误",
        "对大题的中间结果很少单独验证",
        "心算依赖度高，宁可心算也不愿在草稿纸上多写一步",
      ]),
      advice: JSON.stringify([
        "草稿纸分区域使用：每道题画一个方框，计算过程整齐写在框内，方便回溯",
        "强制两步一回头：每写完两行就回看符号和数字是否正确（形成肌肉记忆）",
        "建立高频错误清单：把最近10次考试中的计算错误类型整理出来贴在桌前",
        "大幅降低心算比例：能写下来的计算全部写下来，不要图省事",
        "做专门的计算稳定训练：每天10道纯计算题，目标是零错误率而非速度",
        "使用心算验算法：每得到一个中间结果，用另一种方式（如估算、代入）快速验证",
      ]),
      themeColor: "#F59E0B",
    },
    // ──────────── 复盘失联型 ────────────
    {
      typeKey: "review_disconnected",
      name: "复盘失联型",
      dimensionKey: "review",
      slogan: "错题没有真正进入记忆系统，所以相似问题会反复出现。",
      shortDescription: "错题改了，但下次还错同类题。",
      longDescription: `【核心诊断】
你的错题订正行为是"抄写行为"而非"学习行为"。你完成了订正这个动作，但这个过程中你的大脑没有真正参与到错误原因的分析和记忆中。错题本成了一个整理工作的成果展示，而不是学习工具。

【失分机制】
真正有效的错题复盘需要三个层次：①知道正确答案是什么（信息层）；②理解自己的错误思维路径是什么（认知层）；③在类似场景下能自动调用正确思维路径（自动化层）。你目前停留在了第一层——你知道答案了，就以为掌握了。但你没有分析自己为什么在那一刻选择了错误的路径，也没有通过刻意重复将正确路径写入长期记忆。

【为什么订正了还会错】
因为第一次错误在你的大脑中留下了一条思维通路，订正过程只是在旁边写了一条正确路径的说明。下次遇到类似题目时，大脑优先检索到的是那条已经自动化了的错误通路——因为正确通路还没有被重复到自动化的程度。

【典型考试场景】
期中考试错了一道函数单调性判定题，你在错题本上工工整整地把正确答案抄了一遍，并且批注了"求导后忘记判断f'(x)的正负"。期末考试出现了一道极其类似的题，你的出错的步骤一模一样——还是在求导后直接写结果，没有分区间判断正负。

【预测与发展】
如果不改变复盘的方式，你会在同一类错误上反复踩坑。你的错题本会越来越厚，但考试分数不会因此提高。改善的关键不是"花更多时间在错题上"，而是"换一种方式对待错题"。`,
      typicalBehaviors: JSON.stringify([
        "错题本整理得很认真，但同类题仍然反复错",
        "订正完错题就觉得任务完成了，很少二刷三刷",
        "订正时只写正确答案，不记录'当时为什么会选错'",
        "错题本按时间顺序记录而不是按错因分类",
        "考前一天翻错题本，但只是浏览而不是重做",
        "很少主动总结'我主要的几种错误类型是什么'",
      ]),
      advice: JSON.stringify([
        "改为三栏错题格式：原题/我的错解｜正确答案｜当时为什么错+今后怎么避免",
        "错题二刷制度：每道错题必在一周后重做一遍，做对了才能标记为已解决",
        "建立错因标签系统：计算错误/条件遗漏/公式混淆/思路偏差——每次订正先贴标签",
        "每周分析错因分布：哪种标签最多？针对性做3道该类型练习",
        "同伴互讲法：订正后和同学口头讲一遍'这道题我错在哪、应该怎么做'",
        "考试前不浏览错题本，而是抽5道近期错题重做一轮",
      ]),
      themeColor: "#3B82F6",
    },
    // ──────────── 表达掉线型 ────────────
    {
      typeKey: "expression_offline",
      name: "表达掉线型",
      dimensionKey: "expression",
      slogan: "你的脑子里有答案，但卷面没有把它完整表达出来。",
      shortDescription: "会做，但写不完整，考试步骤分拿不满。",
      longDescription: `【核心诊断】
你能在脑子里完成解题的全过程，但从思维到书写的转化效率偏低。你的脑内推理是快速跳跃式的，但卷面呈现需要逻辑清晰、步骤完整——这个"翻译"过程中有大量信息被省略了。

【失分机制】
数学解答题的评分标准是按步骤给分的。一道12分的题，可能分为：正确审题(2分)→选择正确方法(2分)→列式正确(3分)→计算过程完整(3分)→结论规范(2分)。你能拿到前面的步骤分，但后面的步骤因为你"跳步"而白丢了。老师改卷时看到你的答案会说"思路对的，但过程太简略"——这就是表达掉线的典型特征。

【为什么你会跳步】
可能有几个原因：一是你的思维速度快于书写速度，大脑觉得"这一步太显然了不用写"，但没有意识到评卷人只看你写了什么；二是你平时练习时没有严格按照考试规范要求自己，养成了简写习惯；三是你不太清楚每类题型在考试中的标准答题结构。

【典型考试场景】
一道函数大题你做对了，但只得了8分（满分12分）。扣分项包括：定义域讨论只写了一半、单调性判定没有写出完整的f'(x)正负分析、结论没有回到题目做的最后一步总结。而这些问题你都能在口头上清晰地说出来。

【预测与发展】
这个问题在高一高二可能只扣3-5分，但到了高三综合题和高考试卷中，因为答题规范性差导致的失分可能达到10-15分。好消息是规范的表达是可以模仿和训练的，而且见效很快。`,
      typicalBehaviors: JSON.stringify([
        "做大题时书写过程跳跃，跳过了不少中间推导步骤",
        "口头讲题时很清晰，但落到纸面上就变得简略",
        "经常被评语'过程太简略'或'规范性不够'扣分",
        "不太清楚标准答案的表达结构是什么样的",
        "平时做作业懒得写完整过程，考试时也改不掉",
        "最终答案算对了但过程分其实没拿全",
      ]),
      advice: JSON.stringify([
        "学习标准答案的表达范式：找到5道满分的标准答案，分析它们的书写结构",
        "按答题模板练习：每道解答题按审题→设变量→列方程→计算→结论的结构写",
        "强制补全过程：每次做题后对照评分标准检查自己少了哪些步骤",
        "整理题型答题模板：为不同题型建立参考答案级别的书写模板",
        "做跳步算分训练：拿一道做对的题，逐行标注这一行值几分，理解评分逻辑",
        "每周做一次过程完整度自检：抽查两道近期做的大题，看过程是否完整",
      ]),
      themeColor: "#10B981",
    },
    // ──────────── 压轴迷路型 ────────────
    {
      typeKey: "final_boss_lost",
      name: "压轴迷路型",
      dimensionKey: "complex",
      slogan: "你不是完全不会压轴题，而是还不会把复杂问题拆成能下手的小任务。",
      shortDescription: "前面小题还行，一到综合大题后半段就失去方向。",
      longDescription: `【核心诊断】
你的基础题和中档题的正确率不错，但面对综合大题时缺乏"分解思维"。压轴题本质上是由多个简单步骤串联而成的，但你在看到它时，大脑把它当作一个巨大的整体来面对——于是产生了畏难情绪和方向迷失。

【失分机制】
压轴题通常包含3个小题，设计逻辑是递进式的：(1)引入问题，建立模型；(2)在模型基础上做分析或计算；(3)综合运用或用前两问的结果做延伸。你能稳定拿到(1)的分数，但到(2)和(3)时遇到困难。这通常不是因为(2)(3)需要的知识你不会，而是因为你没有充分利用(1)已经建立的模型和结论。

【你的思维模式有什么特点】
面对复杂问题时，你的注意力会分散到"这个题好难""我可能做不出来""花了15分钟才做了一小问"这些评价性想法上。而高效解题者会把注意力集中在"这道题现有条件有哪些""上一问的结果能帮我做什么""接下来最少的一步是什么"。这是可以被训练的思维习惯。

【典型考试场景】
压轴题12分，你做了第一问（4分），然后看着第二问的题干发呆，感觉无从下手。其实第二问只需要把第一问的结果代入一个公式算一下，但你在心理上已经把它定义为"我做不出来的难题"。

【预测与发展】
随着学业深入，综合题的比例会越来越高。如果现在不训练拆解能力，后面会越来越吃力。压轴拆解力的提升是一个阶梯式的过程——一旦你突破了几道综合大题，建立了信心和方法，这个能力就会快速提升。`,
      typicalBehaviors: JSON.stringify([
        "压轴题的第一小问基本能做，后面的就卡住了",
        "看到长题干或者三小问的大题容易慌",
        "做(2)(3)小问时不习惯利用(1)的结论",
        "对陌生背景或跨章节的综合题有畏难心理",
        "做不出来时不知道如何缩小问题范围找突破口",
        "倾向于一次性想完所有步骤，而不是走一步看一步",
      ]),
      advice: JSON.stringify([
        "拆解训练：每道压轴题先不计算，而是在纸上列出已知条件→目标→可能用到的中间量",
        "强制利用前提：做(2)之前规定自己必须先用(1)的结论，养成这个习惯",
        "从最后一问倒推法：从答案往回推'在这一步之前我需要知道什么'",
        "做分解式练习：找5道压轴题，每道只做拆解分析，不完整计算，训练结构识别",
        "20分钟止损规则：一道压轴题卡了超过20分钟，看答案并分析自己卡在哪一步",
        "逐步扩展舒适区：先从'能做(1)(2)'开始，不追求一次就做到(3)",
      ]),
      themeColor: "#EF4444",
    },
    // ──────────── 时间黑洞型 ────────────
    {
      typeKey: "time_blackhole",
      name: "时间黑洞型",
      dimensionKey: "time",
      slogan: "你的时间被少数题悄悄吞掉了，导致会做的题也来不及做。",
      shortDescription: "简单题耗时过长，导致后面会做的题没时间。",
      longDescription: `【核心诊断】
你的考试策略存在明显问题——在单个题目上的时间分配是失衡的。你可能没有意识到，时间管理和解题能力一样重要。把所有能力都发挥出来需要有合理的时间框架做支撑。

【失分机制】
考试时间是确定的，每道题分配的时间应该与其分值和你的能力匹配。你的问题在于：容易在某个具体题目上过度投入，而忽视了全局的时间约束。一道选择题做了5分钟（正常应该1-2分钟），表面上看是多花了3分钟，但后面可能因此丢了一道你会做的大题的12分——这是严重的资源错配。

【为什么总是超时】
两个原因叠加：一是你缺乏"止损意识"，碰到一道有点难但又觉得应该有希望做出来的题时，你不愿意放手；二是你在简单题上花的时间其实也不少——做完后反复检查确认，拖延了进度。这两类行为都是"过度在某一道题上追求完美"的表现，而考试的全局目标是在有限时间内拿到最高分。

【典型考试场景】
考试前30分钟你在前面选择题部分花了太多时间，特别是第6题，反复算了3次，花了8分钟。等做到最后一道大题时只剩5分钟了——这道题你会做，思路很清楚，但因为时间太少只写了前半部分。考试结束你非常后悔：怎么又在前面磨蹭了。

【预测与发展】
时间管理是一种元技能，它不会随着你的数学水平提高而自动改善。你需要刻意训练考试的时间感和节奏感。好在一旦建立了时间策略习惯，它会在所有科目的考试中都发挥作用。`,
      typicalBehaviors: JSON.stringify([
        "考试经常出现'前面的题检查太久，后面的题来不及做'的情况",
        "遇到一道不太会但又觉得可能有希望的题，容易死磕不放",
        "简单题做完后反复检查，担心自己不小心犯错",
        "考试前没有明确的每部分时间分配计划",
        "考试后半段经常处在赶时间或紧张的状态",
        "老师提醒时间时才发现自己在某道题上花了远超预期的时间",
      ]),
      advice: JSON.stringify([
        "制定时间预算表：考前根据分值计算每个模块的时限，写在试卷首页上",
        "严格执行跳过机制：任何一道题卡了超过规定时间的1.5倍，立即标记后跳过",
        "简单题只检查一遍：做完即过，不要反复检查——把时间留给大题",
        "做限时套卷训练：每周一次完整的限时模拟，严格按时间表执行",
        "倒计时提醒法：在草稿纸边缘写下每道大题的预计完成时间点",
        "建立跳题信念：记住跳过不是放弃，是为了在有限时间内拿到更多分数",
      ]),
      themeColor: "#6366F1",
    },
    // ──────────── 全能均衡型 ────────────
    {
      typeKey: "perfect",
      name: "全能均衡型",
      dimensionKey: "all",
      slogan: "你在八个维度上都表现出色，已经形成了完整的学习能力体系。",
      shortDescription: "八项核心能力均衡发展，没有明显短板，学习状态处于高位平衡。",
      longDescription: `【核心诊断】
你的测评结果显示：八项核心学习能力维度均在优秀线以上，没有出现任何显著的能力短板。这是一个非常珍贵的状态——你不仅知道怎么学，而且在整个学习链条的每一个环节都保持了高水平。

【这意味着什么】
如果说其他七种人格类型是"在某一个环节上卡住了"，那么你的情况是"所有环节都运转良好"。条件识别、公式唤醒、题型迁移、计算执行、复盘转换、表达规范、压轴拆解和时间控制——这八个环节构成了从"看到题目"到"拿到满分"的完整链路。你的链路是全通的。

【你的隐藏优势】
在这种状态下，你最大的资产不是某一个单项能力，而是各个环节之间的协同效应。当条件识别精准时，公式唤醒就更快；当计算稳定性高时，你有更多时间攻克压轴题；当复盘转化高效时，每一道错题都会变成下一次的得分。这种正向循环让你的学习效率远超同龄人。

【需要注意的隐忧】
全能均衡型最大的风险不是能力退化，而是"温水效应"。当一切看起来都很好的时候，人容易失去继续突破的动力。你需要警惕的是：在保持当前水平的同时，有没有在某个维度上悄悄松懈？有没有被同质化的学习圈子拉低了标准？真正的卓越不是维持平衡，而是让平衡不断向上跃迁。

【从优秀到卓越】
你的下一步不是"补短板"，而是"铸长板"。在所有维度都不错的基础上，找到你最有热情、最能与未来方向结合的那个维度，把它从80分推到95分、从优秀推到卓越。一个维度的质变，会带着其他维度一起向上移动。`,
      typicalBehaviors: JSON.stringify([
        "在做题时能自然地完成从审题到检查的完整流程，不需要刻意提醒自己",
        "考试后很少出现'我明明会但做错了'之类的情况",
        "对不同类型的题目能灵活切换解题策略，不局限于单一方法",
        "有稳定的学习节奏，不需要考前突击来维持成绩",
        "能够清晰地说出自己的学习方法和思维路径",
        "对于未知题型保持好奇而非恐惧，愿意尝试拆解",
      ]),
      advice: JSON.stringify([
        "选择你最有热情的一个维度，设定从优秀到卓越的突破目标",
        "开始尝试竞赛级别的难题，把能力边界不断向外扩展",
        "培养输出能力——试着把你的学习方法教给同学，在教授中深化理解",
        "建立跨学科的思维连接，将数学的拆解思维迁移到物理、化学",
        "保持谦虚和好奇，记住'卓越不是一个成就，而是一个过程'",
        "如果能找到志同道合的学伴，你们的碰撞会激发彼此进入更高层次",
      ]),
      themeColor: "#14B8A6",
    },
  ];

  for (const p of personalities) {
    await prisma.personalityType.upsert({
      where: { typeKey: p.typeKey },
      update: {
        name: p.name,
        dimensionKey: p.dimensionKey,
        slogan: p.slogan,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        typicalBehaviors: p.typicalBehaviors,
        advice: p.advice,
        themeColor: p.themeColor,
      },
      create: p,
    });
  }
  console.log("9 personality types created (含全能均衡型)");

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

