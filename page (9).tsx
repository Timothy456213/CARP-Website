import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { areas, can, groups, groupsOf } from "@/lib/roles";
import { site } from "@/lib/config";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default function Dashboard({ searchParams }: { searchParams: { error?: string } }) {
  const s = getSession();
  const err = searchParams.error ? <div className="card err">{searchParams.error.slice(0, 200)}</div> : null;
  if (!s) {
    return (
      <section className="wrap"><h1>Sign in</h1>{err}
        <div className="card"><p>Sign in with Discord to see the dashboards your roles can open.</p>
          <a className="btn" href="/api/auth/login">Login with Discord</a></div></section>
    );
  }
  if (!s.inGuild) {
    return (
      <section className="wrap"><h1>Join our Discord</h1>
        <div className="card"><p>You are signed in as {s.name}, but you are not in the {site.short} Discord server yet.</p>
          <a className="btn" href={site.discord} target="_blank" rel="noopener">Join our Discord</a></div></section>
    );
  }
  const mine = groupsOf(s.roles);
  const open = Object.entries(areas).filter(([, a]) => can(s.roles, a.allow));
  return (
    <section className="wrap"><h1>Welcome, {s.name}</h1>{err}
      <div className="card"><h3>Your groups</h3>
        <p>{mine.length ? mine.map((k) => groups[k].label).join(", ") : "No website groups assigned yet."}</p></div>
      <h2 style={{ marginTop: 28 }}>Your dashboards</h2>
      <div className="grid">
        {open.length ? open.map(([k, a]) => (
          <Link key={k} href={`/dashboard/${k}`} className="card hover"><h3>{a.title}</h3><p>Open dashboard</p></Link>
        )) : <div className="card"><p>Your roles do not open any dashboards.</p></div>}
      </div>
    </section>
  );
}
