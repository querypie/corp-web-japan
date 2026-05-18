import { Suspense } from "react";
import Script from "next/script";
import isProduction from "@/lib/is-production";
import { GoogleAnalyticsPageViewTracker } from "./google-analytics-page-view-tracker";

const GA_MEASUREMENT_ID = "G-DGKPWV2DP2";

export function GoogleAnalytics() {
  if (!isProduction()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsPageViewTracker measurementId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
}
