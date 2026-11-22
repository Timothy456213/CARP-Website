import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookieOpts, siteOrigin } from "@/lib/session";

export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET || !process.env.DISCORD_GUILD_ID || !process.env.SESSION_SECRET) {
    return new NextResponse("Discord login is not configured yet. Add the environment variables in Vercel.", { status: 503 });
  }
  const origin = siteOrigin(req.url);
  const state = crypto.randomBytes(16).toString("hex");
  const u = new URL("https://discord.com/oauth2/authorize");
  u.search = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID, response_type: "code",
    redirect_uri: `${origin}/api/auth/callback`, scope: "identify guilds.members.read", state, prompt: "none",
  }).toString();
  const res = NextResponse.redirect(u);
  res.cookies.set("carp_state", state, cookieOpts(600));
  return res;
}
