import Link from "next/link";
import { departments, site } from "@/lib/config";

export default function Home() {
  return (
    <>
      <section className="hero">
        <img src="/logo.png" alt={`${site.name} logo`} className="logo" />
        <h1>{site.name}</h1>
        <p className="tag">{site.tagline}</p>
        <p className="lead">A serious Emergency Response: Liberty County community based in Los Angeles, California.</p>
        <div className="row">
          <a className="btn" href={site.discord} target="_blank" rel="noopener">Join our Discord</a>
          <Link className="btn ghost" href="/server-info">How to join the server</Link>
        </div>
      </section>
      <section className="wrap">
        <h2>Departments</h2>
        <div className="grid">
          {departments.map((d) => (
            <Link key={d.slug} href="/departments" className="card hover">
              <span className="chip">{d.short}</span>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
