import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Staff Japan Website",
  description: "AI Staffの日本向けランディングサイトです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
