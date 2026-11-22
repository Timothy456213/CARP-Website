import { NextRequest, NextResponse } from "next/server";
import { getSnapshot } from "@/lib/erlc";

export const dynamic = "force-dynamic";
const hits = new Map<string, { n: number; t: number }>();

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anon";
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) hits.set(ip, { n: 1, t: now });
  else if (++h.n > 30) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  if (hits.size > 5000) hits.clear();
  const snap = await getSnapshot();
  return NextResponse.json(snap, { headers: { "Cache-Control": "no-store" } });
}
