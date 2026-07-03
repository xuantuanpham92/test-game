"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingClasses: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={cardVariants}
      whileHover={
        hover || onClick
          ? { y: -4, transition: { duration: 0.2 } }
          : undefined
      }
      className={`rounded-2xl bg-white border border-gray-100 shadow-sm ${
        hover || onClick
          ? "hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
          : ""
      } ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
