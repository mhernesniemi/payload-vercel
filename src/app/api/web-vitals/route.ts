import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const vitalsData = await request.json();

    // Log web vitals in structured format for Better Stack/Vercel logs
    console.log(
      JSON.stringify({
        type: "web-vitals-server",
        ...vitalsData,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to log web vitals:", error);
    return NextResponse.json({ error: "Failed to log web vitals" }, { status: 500 });
  }
}
