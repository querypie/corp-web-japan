import type { Metadata } from "next";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/shared/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Querypie - AI 기반 SNS 콘텐츠 제작 플랫폼",
  description:
    "AI로 콘텐츠를 기획하고, 카드뉴스를 만들고, SNS에 예약 발행하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
