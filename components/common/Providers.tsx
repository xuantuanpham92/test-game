"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/components/common/Toast";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
