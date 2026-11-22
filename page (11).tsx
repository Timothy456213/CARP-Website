import type { Metadata } from "next";
import LiveStatus from "@/components/LiveStatus";
export const metadata: Metadata = { title: "Live Server Status" };

export default function ServerStatus() {
  return (
    <section className="wrap">
      <h1>Live Server Status</h1>
      <LiveStatus />
    </section>
  );
}
