import type { Metadata } from "next";
import Providers from "@/components/common/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "扶摇弱科人格画像 | 测出你的学习失分人格",
  description:
    "扶摇弱科人格画像是一款智能学习诊断工具，通过科学的测评体系帮你精准定位学科薄弱点，生成专属的学习失分人格画像，让学习提升更有方向。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <footer className="py-6 text-center text-sm text-gray-400">
              © 2026 扶摇弱科人格画像
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
