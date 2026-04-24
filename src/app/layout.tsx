import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const querypieSans = localFont({
  src: [
    {
      path: "../assets/fonts/Mona-Sans.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../assets/fonts/PretendardJPVariable.woff2",
      style: "normal",
      weight: "45 920",
    },
  ],
  display: "swap",
  variable: "--font-querypie-sans",
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
    <html lang="ja">
      <body className={`${querypieSans.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
