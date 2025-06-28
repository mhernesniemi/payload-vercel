import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get additional request context
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ip =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const country = request.headers.get("x-vercel-ip-country") || "unknown";
    const region = request.headers.get("x-vercel-ip-country-region") || "unknown";

    // Enhanced logging with request context
    const logData = {
      ...data,
      timestamp: new Date().toISOString(),
      serverContext: {
        ip: ip,
        country: country,
        region: region,
        userAgent: userAgent,
      },
    };

    if (data.type === "page-view") {
      console.log(
        JSON.stringify({
          type: "page-view-server",
          ...logData,
          message: `Page view: ${data.pathname} by ${data.visitorId}`,
        }),
      );
    } else if (data.type === "web-vitals") {
      console.log(
        JSON.stringify({
          type: "web-vitals-server",
          ...logData,
          message: `Web Vital ${data.name}: ${data.value}ms (${data.rating}) for ${data.pathname}`,
        }),
      );
    } else {
      console.log(
        JSON.stringify({
          type: "performance-data-server",
          ...logData,
        }),
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log performance data:", error);
    return NextResponse.json(
      {
        error: "Failed to log performance data",
      },
      { status: 500 },
    );
  }
}
