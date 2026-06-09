import type { Metadata } from "next";
import localFont from "next/font/local";
import { preload } from "react-dom";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { getRequestDeployedSiteUrl } from "@/lib/site-url.server";

const monaSansFont = localFont({
  src: "../assets/fonts/Mona-Sans.woff2",
  display: "swap",
  variable: "--font-mona-sans",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: await getRequestDeployedSiteUrl(),
    title: "QueryPie AI Japan Website",
    description: "QueryPie AIの日本向けエンタープライズAIソリューションサイトです。",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preload("/fonts/PretendardJPSubset-600.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html lang="ja" className={monaSansFont.variable}>
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
