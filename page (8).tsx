import type { Metadata } from "next";
import { departments } from "@/lib/config";
export const metadata: Metadata = { title: "Departments" };

export default function Departments() {
  return (
    <section className="wrap">
      <h1>Departments</h1>
      <div className="grid">
        {departments.map((d) => (
          <article key={d.slug} className="card" id={d.slug}>
            <span className="chip">{d.short}</span>
            <h3>{d.name}</h3>
            <p>{d.text}</p>
          </article>
        ))}
      </div>
      <p className="muted">Department pages with leadership, divisions and applications arrive with the database in a later phase.</p>
    </section>
  );
}
