// API authentication route
import { NextResponse } from "next/server";

export async function GET() {
  const status = process.env.NODE_ENV === "production" ? 404 : 501;
  return NextResponse.json(
    { error: "not_implemented", code: "AUTH_NOT_IMPLEMENTED" },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
