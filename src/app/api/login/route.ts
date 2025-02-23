import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const payload = await getPayload({ config });
    const result = await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    if (!result.user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Asetetaan Payloadin token evästeeseen
    const response = NextResponse.json(result);

    if (result.token) {
      response.cookies.set("payload-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
