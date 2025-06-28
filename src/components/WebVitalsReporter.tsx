"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals(async (metric) => {
    // Only report in production to avoid development noise
    if (process.env.NODE_ENV === "production") {
      const vitalsData = {
        type: "web-vitals",
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        userAgent: navigator.userAgent,
        // Additional context for Better Stack filtering
        level:
          metric.rating === "good"
            ? "info"
            : metric.rating === "needs-improvement"
              ? "warn"
              : "error",
        tags: ["web-vitals", "frontend-performance", metric.name.toLowerCase()],
      };

      // Send to server API for logging in Vercel logs
      try {
        await fetch("/api/web-vitals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vitalsData),
        });
      } catch (error) {
        console.error("Failed to send web vitals to server:", error);
      }

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
