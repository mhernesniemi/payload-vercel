"use client";

import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect, useRef } from "react";

// Type definitions for Network Information API
interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

// Generate unique session ID
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique visitor ID (persisted in sessionStorage)
const getVisitorId = () => {
  if (typeof window === "undefined") return "server";

  let visitorId = sessionStorage.getItem("visitor-id");
  if (!visitorId) {
    visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("visitor-id", visitorId);
  }
  return visitorId;
};

export function WebVitalsReporter() {
  const pathname = usePathname();
  const sessionIdRef = useRef(generateSessionId());
  const pageLoadTimeRef = useRef(Date.now());

  // Track page views for SPA navigation
  useEffect(() => {
    // Generate new session ID for each page navigation
    sessionIdRef.current = generateSessionId();
    pageLoadTimeRef.current = Date.now();

    // Track page view
    if (process.env.NODE_ENV === "production") {
      const pageViewData = {
        type: "page-view",
        url: window.location.href,
        pathname,
        referrer: document.referrer,
        visitorId: getVisitorId(),
        sessionId: sessionIdRef.current,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        loadTime: pageLoadTimeRef.current,
      };

      fetch("/api/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageViewData),
      }).catch((error) => {
        console.error("Failed to send page view data:", error);
      });
    }
  }, [pathname]);

  useReportWebVitals(async (metric) => {
    // Report web vitals for every page visit in production
    if (process.env.NODE_ENV === "production") {
      const navigatorWithConnection = navigator as NavigatorWithConnection;

      const vitalsData = {
        type: "web-vitals",
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        pathname,
        userAgent: navigator.userAgent,
        visitorId: getVisitorId(),
        sessionId: sessionIdRef.current,
        pageLoadTime: pageLoadTimeRef.current,
        metricTime: Date.now(),
        // Additional context for Better Stack filtering
        level:
          metric.rating === "good"
            ? "info"
            : metric.rating === "needs-improvement"
              ? "warn"
              : "error",
        tags: ["web-vitals", "frontend-performance", metric.name.toLowerCase()],
        // Add browser and device info
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        connection: navigatorWithConnection.connection
          ? {
              effectiveType: navigatorWithConnection.connection.effectiveType,
              downlink: navigatorWithConnection.connection.downlink,
            }
          : null,
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
            visitorId: getVisitorId(),
            sessionId: sessionIdRef.current,
          },
        });
      }
    }
  });

  return null;
}
