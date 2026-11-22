import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { areas, can } from "@/lib/roles";
import AccessDenied from "@/components/AccessDenied";

export const dynamic = "force-dynamic";

export default function Area({ params }: { params: { area: string } }) {
  const a = Object.prototype.hasOwnProperty.call(areas, params.area) ? areas[params.area] : null;
  if (!a) notFound();
  const s = getSession();
  if (!s) redirect("/dashboard");
  if (!s.inGuild || !can(s.roles, a.allow)) return <AccessDenied need={a.title} />;
  return (
    <section className="wrap"><h1>{a.title}</h1>
      <div className="card"><h3>Access confirmed</h3><p>Your Discord roles were checked on the server. The tools below are planned for phases 4 and 5 and are not built yet.</p></div>
      <div className="grid">{a.plan.map((p) => <div key={p} className="card"><p>{p}</p></div>)}</div>
    </section>
  );
}
