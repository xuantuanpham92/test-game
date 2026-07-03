import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidthClasses: Record<
  NonNullable<PageContainerProps["maxWidth"]>,
  string
> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1920px]",
  full: "max-w-full",
};

export default function PageContainer({
  children,
  className = "",
  maxWidth = "lg",
}: PageContainerProps) {
  return (
    <div
      className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
    >
      {children}
    </div>
  );
}
