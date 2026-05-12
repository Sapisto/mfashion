import { NextResponse } from "next/server";

// Disabled — admin account already created. Re-enable by restoring the original logic if needed.
export async function POST() {
  return NextResponse.json({ error: "This endpoint is disabled" }, { status: 410 });
}
