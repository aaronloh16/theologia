import { NextRequest, NextResponse } from "next/server";
import { getAllTermIds } from "@/lib/terms";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const ids = getAllTermIds();
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${baseUrl}/terms/${randomId}`, {
    status: 307,
  });
}
