"use client";
import { useEffect, useState } from "react";
import type { ErlcSnapshot } from "@/lib/erlc";

export default function LiveStatus() {
  const [d, setD] = useState<ErlcSnapshot | null>(null);
  const [lastOk, setLastOk] = useState<number | null>(null);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/erlc/status", { cache: "no-store" });
        if (!r.ok) throw new Error();
        const j: ErlcSnapshot = await r.json();
        if (!alive) return;
        setD(j); setLost(false);
        if (j.state === "ok") setLastOk(j.fetchedAt);
      } catch { if (alive) setLost(true); }
    };
    load();
    const id = setInterval(load, 15000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  if (!d) return <div className="card"><p>{lost ? "Could not load the status. Retrying..." : "Connecting to the ER:LC API..."}</p></div>;
  const ok = d.state === "ok";
  return (
    <>
      {lost && <div className="card err">Connection problem. Retrying automatically.</div>}
      <div className="card">
        <span className="chip"><span className={ok ? "dot on" : "dot off"} />{ok ? "Online" : "Unavailable"}</span>
        <h3>{ok ? d.server?.name || "ER:LC server" : "Status unavailable"}</h3>
        {!ok && <p>{d.message}</p>}
        {ok && (
          <div className="stats">
            <div><b>{d.server?.currentPlayers ?? d.players?.length ?? "-"}{d.server?.maxPlayers ? ` / ${d.server.maxPlayers}` : ""}</b>Players</div>
            <div><b>{d.queue ?? "-"}</b>In queue</div>
            {d.server?.joinKey && <div><b>{d.server.joinKey}</b>Join code</div>}
          </div>
        )}
        <p className="muted">Last successful update: {lastOk ? new Date(lastOk).toLocaleTimeString() : "none yet"}. Refreshes every 15 seconds.</p>
      </div>
      {ok && d.players && (
        <div className="card tablewrap">
          <h3>Players in server</h3>
          {d.players.length === 0 ? <p>Nobody is in the server right now.</p> : (
            <table><thead><tr><th>Name</th><th>Team</th><th>Callsign</th><th>Role</th></tr></thead>
              <tbody>{d.players.map((p) => <tr key={p.name}><td>{p.name}</td><td>{p.team}</td><td>{p.callsign || "-"}</td><td>{p.permission}</td></tr>)}</tbody></table>
          )}
        </div>
      )}
    </>
  );
}
