"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "正在分析你的失分模式...",
  "正在匹配弱科人格...",
  "正在生成能力画像...",
  "正在定位最该优先提升的能力...",
  "正在生成你的专属学习建议...",
];

const MESSAGE_INTERVAL = 1500;
const REDIRECT_DELAY = 5000;

function GeneratingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");

  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, MESSAGE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const start = Date.now();
    const duration = REDIRECT_DELAY;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 95);
      setProgress(pct);
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  // Redirect after delay
  useEffect(() => {
    if (!reportId) return;
    const timeout = setTimeout(() => {
      router.push(`/result/${reportId}`);
    }, REDIRECT_DELAY);
    return () => clearTimeout(timeout);
  }, [reportId, router]);

  // Ring particles
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        angle: (i / 12) * 360,
        delay: i * 0.15,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main spinner ring */}
      <div className="relative mb-12">
        {/* Outer rotating ring */}
        <motion.div
          className="w-32 h-32 rounded-full border-[3px] border-transparent"
          style={{
            borderTopColor: "#6366F1",
            borderRightColor: "#8B5CF6",
            borderBottomColor: "rgba(99,102,241,0.3)",
            borderLeftColor: "rgba(139,92,246,0.3)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />

        {/* Middle ring - counter-rotating */}
        <motion.div
          className="absolute inset-2 rounded-full border-[2px] border-transparent"
          style={{
            borderTopColor: "rgba(236,72,153,0.6)",
            borderRightColor: "rgba(139,92,246,0.4)",
            borderBottomColor: "rgba(99,102,241,0.2)",
            borderLeftColor: "rgba(236,72,153,0.3)",
          }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />

        {/* Inner pulsing core */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/40" />
        </motion.div>

        {/* Orbiting particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              background:
                p.id % 3 === 0
                  ? "#6366F1"
                  : p.id % 3 === 1
                    ? "#8B5CF6"
                    : "#EC4899",
              boxShadow:
                p.id % 3 === 0
                  ? "0 0 6px #6366F1"
                  : p.id % 3 === 1
                    ? "0 0 6px #8B5CF6"
                    : "0 0 6px #EC4899",
            }}
            animate={{
              x: [
                Math.cos((p.angle * Math.PI) / 180) * 70,
                Math.cos(((p.angle + 360) * Math.PI) / 180) * 70,
              ],
              y: [
                Math.sin((p.angle * Math.PI) / 180) * 70,
                Math.sin(((p.angle + 360) * Math.PI) / 180) * 70,
              ],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Rotating text messages */}
      <div className="relative h-10 flex items-center justify-center mb-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-lg md:text-xl text-gray-300 font-medium tracking-wide whitespace-nowrap"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-gray-700/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Scanning line effect card */}
      <motion.div
        className="absolute bottom-20 w-72 h-32 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Fake content lines */}
        <div className="p-5 space-y-3">
          <div className="h-3 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/5" />
          <div className="h-3 w-2/3 rounded bg-white/8" />
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-primary-500/50" />
            <div className="h-2 w-2 rounded-full bg-accent-500/40" />
            <div className="h-2 w-2 rounded-full bg-pink-500/30" />
          </div>
        </div>

        {/* Scanning line */}
        <motion.div
          className="absolute inset-x-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.6), transparent)",
            boxShadow: "0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(139,92,246,0.3)",
          }}
          animate={{ top: ["-2px", "calc(100% + 2px)"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </motion.div>

      {/* Branding watermark */}
      <motion.p
        className="absolute bottom-8 text-sm text-gray-600 tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        扶摇弱科人格画像
      </motion.p>
    </div>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-gray-900 flex items-center justify-center"><div className="text-white text-lg">加载中...</div></div>}>
      <GeneratingPageContent />
    </Suspense>
  );
}
