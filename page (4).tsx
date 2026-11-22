import type { Metadata } from "next";
import { site } from "@/lib/config";
export const metadata: Metadata = { title: "Server Information" };

export default function ServerInfo() {
  return (
    <section className="wrap">
      <h1>Server Information</h1>
      <div className="grid">
        <div className="card"><span className="chip">ERLC</span><h3>Join code</h3><p className="big">{site.erlc.code}</p><p className="muted">Owner: {site.erlc.owner}</p></div>
        <div className="card"><span className="chip">Discord</span><h3>Community</h3><p>Join the Discord first, read the rules, then follow the steps in the welcome channel.</p><a className="btn" href={site.discord} target="_blank" rel="noopener">Join our Discord</a></div>
        <div className="card"><span className="chip">TikTok</span><h3>Follow us</h3><p>News and clips from the community.</p><a className="btn ghost" href={site.tiktok} target="_blank" rel="noopener">@carp_456</a></div>
      </div>
      <p className="muted">For the live player count and server status, open the <a href="/server-status"><u>Live Status</u></a> page.</p>
    </section>
  );
}
