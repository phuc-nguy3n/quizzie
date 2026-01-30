// API authentication route
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Authentication endpoint not implemented" },
    { status: 501 },
  );
}
