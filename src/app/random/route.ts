import { NextResponse } from "next/server";
import { getAllTermIds } from "@/lib/terms";

export const dynamic = "force-dynamic";

export function GET() {
  const ids = getAllTermIds();
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  return NextResponse.redirect(new URL(`/terms/${randomId}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), {
    status: 307,
  });
}
