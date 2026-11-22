// Server-side only. The ER:LC key is read from the environment and never sent to the browser.
export type ErlcState = "ok" | "not_configured" | "bad_key" | "unavailable";
export type ErlcPlayer = { name: string; permission: string; team: string; callsign?: string };
export type ErlcSnapshot = {
  state: ErlcState;
  message?: string;
  fetchedAt: number;
  server?: { name?: string; currentPlayers?: number; maxPlayers?: number; joinKey?: string };
  players?: ErlcPlayer[];
  queue?: number;
};

const BASE = "https://api.policeroleplay.community/v1/server";
const TTL = 10_000; // all visitors share one API call every 10 seconds
let cache: ErlcSnapshot | null = null;
let inflight: Promise<ErlcSnapshot> | null = null;

const get = (path: string, key: string) =>
  fetch(`${BASE}${path}`, { headers: { "Server-Key": key }, cache: "no-store", signal: AbortSignal.timeout(6000) });

async function load(): Promise<ErlcSnapshot> {
  const key = process.env.ERLC_SERVER_KEY;
  const now = Date.now();
  if (!key) return { state: "not_configured", message: "The ER:LC server key has not been added yet.", fetchedAt: now };
  try {
    const [s, p, q] = await Promise.all([get("", key), get("/players", key), get("/queue", key)]);
    if (s.status === 401 || s.status === 403) return { state: "bad_key", message: "The ER:LC API rejected the server key.", fetchedAt: now };
    if (!s.ok) return { state: "unavailable", message: `The ER:LC API returned status ${s.status}.`, fetchedAt: now };
    const sj = await s.json();
    const pj = p.ok ? await p.json() : null;
    const qj = q.ok ? await q.json() : null;
    return {
      state: "ok", fetchedAt: now,
      server: { name: sj.Name, currentPlayers: sj.CurrentPlayers, maxPlayers: sj.MaxPlayers, joinKey: sj.JoinKey },
      players: Array.isArray(pj)
        ? pj.map((x: { Player?: string; Permission?: string; Team?: string; Callsign?: string }) => ({
            name: String(x.Player ?? "Unknown").split(":")[0], permission: x.Permission ?? "Normal",
            team: x.Team ?? "-", callsign: x.Callsign || undefined,
          }))
        : undefined,
      queue: Array.isArray(qj) ? qj.length : undefined,
    };
  } catch {
    return { state: "unavailable", message: "Could not reach the ER:LC API (timeout or network error).", fetchedAt: now };
  }
}

export async function getSnapshot(): Promise<ErlcSnapshot> {
  if (cache && Date.now() - cache.fetchedAt < TTL) return cache;
  if (!inflight) inflight = load().then((s) => { cache = s; inflight = null; return s; });
  return inflight;
}
