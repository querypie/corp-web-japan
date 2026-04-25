import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const monaSansFont = localFont({
  src: "../assets/fonts/Mona-Sans.woff2",
  display: "swap",
  variable: "--font-mona-sans",
  weight: "100 900",
});

const pretendardJPFont = localFont({
  src: "../assets/fonts/PretendardJPVariable.woff2",
  display: "swap",
  variable: "--font-pretendard-jp",
  weight: "45 920",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "QueryPie AI Japan Website",
  description: "QueryPie AIの日本向けエンタープライズAIソリューションサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      style={{
        fontFamily:
          "var(--font-mona-sans), var(--font-pretendard-jp), 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <body className={`${monaSansFont.variable} ${pretendardJPFont.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
