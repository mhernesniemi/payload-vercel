"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Only report in production to avoid development noise
    if (process.env.NODE_ENV === "production") {
      // Log web vitals metrics in structured format for Better Stack
      console.log(
        JSON.stringify({
          type: "web-vitals",
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          // Additional context for Better Stack filtering
          level:
            metric.rating === "good"
              ? "info"
              : metric.rating === "needs-improvement"
                ? "warn"
                : "error",
          tags: ["web-vitals", "frontend-performance", metric.name.toLowerCase()],
        }),
      );

      // Also send to Vercel Analytics if available
      if (window.va) {
        window.va("event", {
          name: "Web Vital",
          data: {
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
          },
        });
      }
    }
  });

  return null;
}
