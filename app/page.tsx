"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import SectionTitle from "@/components/common/SectionTitle";
import PageContainer from "@/components/common/PageContainer";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PROBLEM_CARDS = [
  {
    icon: "📚",
    question: "为什么补了课还是没提升？",
    answer:
      "因为补课只补知识点，但没有诊断出你具体是哪个失分环节出了问题。条件漏看、公式忘用、计算翻车……每种人格的补救方法完全不同。",
  },
  {
    icon: "🔄",
    question: "为什么错题改了下次还错？",
    answer:
      "你改的只是「这道题」，而不是「这类错」。缺少对自己失分人格的认知，就永远在同一个坑里反复摔跤。",
  },
  {
    icon: "❓",
    question: "为什么明明思路对但总扣分？",
    answer:
      "跳步、书写不规范、单位忘写、没有回看检查……这些失分习惯构成了你的「弱科人格」，它们藏在暗处，让你每次考完都意难平。",
  },
];

const PERSONALITY_PREVIEWS = [
  {
    emoji: "🕳️",
    name: "条件漏网型",
    key: "condition_leaker",
    description:
      "题目条件明明写在纸上，你却总能精准地忽略那个关键数字或限定词，导致整道题跑偏。",
  },
  {
    emoji: "💤",
    name: "公式沉睡型",
    key: "formula_sleeper",
    description:
      "公式背得滚瓜烂熟，一到考场就「叫不醒」——不知道该用哪个、什么时候用、怎么组合用。",
  },
  {
    emoji: "🌀",
    name: "变式迷路型",
    key: "variant_lost",
    description:
      "原题会做，换个说法、调个顺序就懵了。题型一变，你的解题思路就像进了迷宫，找不到出口。",
  },
  {
    emoji: "🚗",
    name: "计算翻车型",
    key: "calculation_crasher",
    description:
      "思路全对，但抄错数字、算错符号—最后一步翻车。这种「冤案」每次考试都在上演。",
  },
  {
    emoji: "📡",
    name: "复盘失联型",
    key: "review_disconnected",
    description:
      "订正完错题就觉得完事了，从不追问「为什么错」、「怎么避免」。下次同类错误照样找上门。",
  },
];

const STEPS = [
  {
    number: "01",
    icon: "✏️",
    title: "填信息",
    description: "告诉我们你的年级和薄弱科目",
  },
  {
    number: "02",
    icon: "📝",
    title: "做测评",
    description: "3分钟完成精心设计的诊断题目",
  },
  {
    number: "03",
    icon: "🔍",
    title: "看画像",
    description: "查看你专属的弱科人格画像报告",
  },
  {
    number: "04",
    icon: "🎯",
    title: "领计划",
    description: "获取量身定制的7天提升计划",
  },
];

const TRUST_ITEMS = [
  {
    icon: "🎓",
    label: "专业诊断维度",
    desc: "8大认知+行为诊断维度",
  },
  {
    icon: "📋",
    label: "真实题目支撑",
    desc: "基于真实学科失分场景设计",
  },
  {
    icon: "💡",
    label: "个性化提升建议",
    desc: "一份画像 = 一份专属行动计划",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation Helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/* ------------------------------------------------------------------ */
/*  Floating decoration elements                                       */
/* ------------------------------------------------------------------ */

const FLOATING_ELEMENTS = [
  { emoji: "📐", size: "text-3xl", x: "5%", y: "15%", delay: 0 },
  { emoji: "🧮", size: "text-2xl", x: "88%", y: "20%", delay: 0.4 },
  { emoji: "📏", size: "text-4xl", x: "12%", y: "70%", delay: 0.8 },
  { emoji: "✖️", size: "text-xl", x: "80%", y: "65%", delay: 1.0 },
  { emoji: "🔢", size: "text-2xl", x: "92%", y: "55%", delay: 0.6 },
  { emoji: "📊", size: "text-3xl", x: "3%", y: "45%", delay: 1.2 },
];

function FloatingElement({
  emoji,
  size,
  x,
  y,
  delay,
}: {
  emoji: string;
  size: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute ${size} select-none pointer-events-none`}
      style={{ left: x, top: y }}
      animate={{ y: ["-12px", "12px", "-12px"] }}
      transition={{
        repeat: Infinity,
        duration: 3 + delay,
        delay,
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5 + delay,
          delay: delay + 0.2,
          ease: "easeInOut",
        }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ProblemCards() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 md:grid-cols-3"
    >
      {PROBLEM_CARDS.map((item) => (
        <motion.div key={item.question} variants={fadeInUp}>
          <Card hover padding="lg" className="h-full">
            <div className="flex flex-col items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-snug">
                {item.question}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function PersonalityGrid() {
  const borderColors = [
    "border-t-primary-500",
    "border-t-accent-500",
    "border-t-pink-500",
    "border-t-amber-400",
    "border-t-blue-500",
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {PERSONALITY_PREVIEWS.map((p, i) => (
        <motion.div key={p.key} variants={fadeInUp}>
          <div
            className={`rounded-2xl bg-white border border-gray-100 border-t-4 ${borderColors[i % borderColors.length]} p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col gap-3`}
          >
            <span className="text-3xl">{p.emoji}</span>
            <h4 className="text-lg font-bold text-gray-900">{p.name}</h4>
            <p className="text-xs text-gray-500 leading-relaxed flex-1">
              {p.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function StepsSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((step, i) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="relative flex flex-col items-center text-center gap-3"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xl shadow-lg shadow-primary-500/20">
            {step.icon}
          </div>
          <span className="text-xs font-bold tracking-widest text-primary-400 uppercase">
            STEP {step.number}
          </span>
          <h4 className="text-base font-bold text-gray-900">{step.title}</h4>
          <p className="text-sm text-gray-500 max-w-[180px]">
            {step.description}
          </p>
          {i < STEPS.length - 1 && (
            <div className="hidden lg:block absolute top-8 left-[calc(50%+56px)] w-[calc(100%-112px)] h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function TrustSection() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-3"
    >
      {TRUST_ITEMS.map((item) => (
        <motion.div
          key={item.label}
          variants={fadeInUp}
          className="flex flex-col items-center text-center gap-3 rounded-2xl bg-white/80 backdrop-blur border border-primary-100 p-6"
        >
          <span className="text-3xl">{item.icon}</span>
          <h4 className="font-bold text-gray-900">{item.label}</h4>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <>
      {/* ============================================================ */}
      {/*  Hero                                                         */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-accent-50"
      >
        {/* Floating decorations */}
        {FLOATING_ELEMENTS.map((el) => (
          <FloatingElement key={el.emoji + el.x} {...el} />
        ))}

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <PageContainer className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur border border-primary-200 px-4 py-1.5 text-sm font-medium text-primary-600 shadow-sm mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500" />
                </span>
                扶摇学习诊断 · AI驱动
              </motion.span>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
                <span className="text-gradient">测出你的弱科人格画像</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                你不是简单&ldquo;数学差&rdquo;，而是有一个
                <span className="font-semibold text-gray-800">
                  具体的失分机制
                </span>
                正在拖慢你。
                <br className="hidden sm:block" />
                3分钟，看清你自己都不知道的丢分习惯。
              </p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/profile">
                  <Button size="lg">
                    开始测试 · 免费生成画像
                    <svg
                      className="w-5 h-5 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  已有 10,000+ 学生完成测评
                </span>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
              >
                {[
                  { value: "8", label: "弱科人格类型" },
                  { value: "3min", label: "快速完成测评" },
                  { value: "8", label: "认知诊断维度" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl font-extrabold text-gradient">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </PageContainer>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Problem section                                              */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28">
        <PageContainer>
          <SectionTitle
            title="什么是弱科人格？"
            subtitle={"它不是「偏科」这么简单——而是一套隐藏在你学习习惯中的失分行为模式。"}
            centered
            className="mb-12"
          />
          <ProblemCards />
        </PageContainer>
      </section>

      {/* ============================================================ */}
      {/*  Personality types preview                                    */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-primary-50/40">
        <PageContainer>
          <SectionTitle
            title="8种弱科人格"
            subtitle="每一种人格背后，都有一套独特的失分机制。找到它，才能精准补救。"
            centered
            className="mb-12"
          />
          <PersonalityGrid />
        </PageContainer>
      </section>

      {/* ============================================================ */}
      {/*  How it works                                                 */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28">
        <PageContainer>
          <SectionTitle
            title="如何测试？"
            subtitle="四个简单步骤，开启你的学力诊断之旅。"
            centered
            className="mb-14"
          />
          <StepsSection />
        </PageContainer>
      </section>

      {/* ============================================================ */}
      {/*  Trust / Parent section                                       */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-primary-500 via-accent-500 to-pink-500">
        <PageContainer>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              家长信赖的科学诊断
            </h2>
            <p className="mt-3 text-primary-100 max-w-xl mx-auto">
              不是凭感觉说"孩子粗心"，而是用数据定位真实的失分环节。
            </p>
          </div>
          <TrustSection />
        </PageContainer>
      </section>

      {/* ============================================================ */}
      {/*  Final CTA                                                    */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-accent-500 to-pink-500 p-10 sm:p-16 text-center shadow-2xl shadow-primary-500/20"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-pink-400 blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
                3分钟，发现你的弱科失分人格
              </h2>
              <p className="text-primary-100 text-base sm:text-lg mb-8 max-w-lg mx-auto">
                不需要注册，不需要付费。马上开始，看清你自己的学习盲区。
              </p>
              <Link href="/profile">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg hover:shadow-xl"
                >
                  开始测试
                  <svg
                    className="w-5 h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      {/* ============================================================ */}
      {/*  Footer                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <PageContainer>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-gradient">扶摇</span>
              <span>弱科人格画像</span>
            </div>
            <div className="flex items-center gap-6">
              <span>扶摇 · 让每一次努力都算数</span>
            </div>
            <span>© 2024 扶摇弱科人格画像</span>
          </div>
        </PageContainer>
      </footer>
    </>
  );
}
