import type { Metadata } from "next";
import { rules } from "@/lib/config";
export const metadata: Metadata = { title: "Rules & Regulations" };

export default function Rules() {
  return (
    <section className="wrap">
      <h1>Rules &amp; Regulations</h1>
      <ol className="rules">
        {rules.map(([t, d], i) => (
          <li key={t} className="card">
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <div><h3>{t}</h3><p>{d}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
