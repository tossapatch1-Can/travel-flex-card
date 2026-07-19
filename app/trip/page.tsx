"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { byCode } from "@/lib/countries";
import { decodeShared, type SharedTrip } from "@/lib/share";

export default function SharedTripPage() {
  const [shared, setShared] = useState<SharedTrip | null | "loading">("loading");
  useEffect(() => {
    setShared(decodeShared(window.location.hash));
  }, []);

  if (shared === "loading") return null;
  if (!shared)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f2027] text-[#f4ecd9]">
        <div className="text-center">
          <p className="text-lg">ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ 😢</p>
          <Link href="/" className="mt-3 inline-block text-sm text-[#d9b26a] underline">กลับหน้าแรก</Link>
        </div>
      </div>
    );

  const { name, trip } = shared;
  return (
    <div className="min-h-screen bg-[#0f2027] text-[#f4ecd9]">
      <div className="mx-auto max-w-xl px-4 pb-16 pt-8">
        <header className="mb-6 text-center">
          <p className="text-sm tracking-[0.3em] text-[#d9b26a]">SHARED TRIP</p>
          <h1 className="mt-1 text-2xl font-bold">
            {trip.countryCodes.map((c) => byCode[c]?.flag).join(" ")}{" "}
            {trip.title || trip.countryCodes.map((c) => byCode[c]?.th).join(", ")}
          </h1>
          {name && <p className="text-sm text-[#d9b26a]/80">ทริปของ {name}</p>}
          {(trip.startDate || trip.companions.length > 0) && (
            <p className="mt-1 text-xs opacity-60">
              {trip.startDate && `${trip.startDate}${trip.endDate ? ` → ${trip.endDate}` : ""}`}
              {trip.startDate && trip.companions.length > 0 && " · "}
              {trip.companions.length > 0 && `👥 ${trip.companions.join(" · ")}`}
            </p>
          )}
          {trip.memory && <p className="mt-2 text-sm opacity-70">“{trip.memory}”</p>}
        </header>

        <Itinerary trip={shared.trip} />
        <Expenses trip={shared.trip} companions={trip.companions} ownerName={name} />
        <Maps trip={shared.trip} />

        <div className="mt-10 rounded-2xl bg-[#d9b26a]/10 p-5 text-center">
          <p className="text-sm">อยากมี Travel Passport ของตัวเองบ้าง?</p>
          <Link href="/" className="mt-3 inline-block rounded-xl bg-[#d9b26a] px-5 py-2.5 text-sm font-semibold text-[#0f2027]">
            สร้างฟรี ไม่ต้องสมัคร →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-[#d9b26a]">{title}</h2>
      {children}
    </section>
  );
}

function Itinerary({ trip }: { trip: SharedTrip["trip"] }) {
  const items = trip.itinerary ?? [];
  const days = [...new Set(items.map((i) => i.day))].sort((a, b) => a - b);
  if (days.length === 0) return null;
  return (
    <Section title="📅 แผนเที่ยวรายวัน">
      <div className="space-y-4">
        {days.map((d) => (
          <div key={d}>
            <h4 className="mb-1.5 text-xs font-semibold opacity-70">Day {d}</h4>
            <div className="space-y-1.5">
              {items
                .filter((i) => i.day === d)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((i) => (
                  <div key={i.id} className="flex items-start gap-3 rounded-lg bg-white/5 p-3 text-sm">
                    <span className="w-12 shrink-0 text-xs opacity-60">{i.time || "—"}</span>
                    <div className="min-w-0">
                      <p className="font-medium">{i.place}</p>
                      {i.note && <p className="text-xs opacity-60">{i.note}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Expenses({ trip, companions, ownerName }: { trip: SharedTrip["trip"]; companions: string[]; ownerName: string }) {
  const expenses = trip.expenses ?? [];
  const people = useMemo(() => [ownerName || "ฉัน", ...companions], [ownerName, companions]);
  // trip data stores the owner as "ฉัน" — relabel for viewers
  const label = (p: string) => (p === "ฉัน" ? ownerName || "เจ้าของทริป" : p);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const balances = useMemo(() => {
    const b: Record<string, number> = {};
    for (const e of expenses) {
      const share = e.amount / e.splitWith.length;
      b[e.paidBy] = (b[e.paidBy] ?? 0) + e.amount;
      e.splitWith.forEach((p) => (b[p] = (b[p] ?? 0) - share));
    }
    return b;
  }, [expenses]);
  if (expenses.length === 0) return null;
  return (
    <Section title="💰 ค่าใช้จ่าย">
      <div className="mb-3 rounded-xl bg-[#d9b26a]/10 p-3 text-center">
        <p className="text-xs text-[#d9b26a]/80">ค่าใช้จ่ายรวม</p>
        <p className="text-2xl font-bold text-[#d9b26a]">฿{total.toLocaleString()}</p>
        <p className="text-xs opacity-60">เฉลี่ย ฿{Math.round(total / Math.max(1, people.length)).toLocaleString()} / คน</p>
      </div>
      <div className="mb-3 space-y-1.5">
        {Object.entries(balances).map(([p, v]) => {
          const b = Math.round(v);
          return (
            <div key={p} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
              <span>{label(p)}</span>
              <span className={b > 0 ? "text-emerald-300" : b < 0 ? "text-red-300" : "opacity-60"}>
                {b > 0 ? `รับคืน ฿${b.toLocaleString()}` : b < 0 ? `ต้องจ่ายเพิ่ม ฿${(-b).toLocaleString()}` : "พอดี ✓"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="space-y-1.5">
        {expenses.map((e) => (
          <div key={e.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm">
            <div className="min-w-0">
              <p className="font-medium">{e.title}</p>
              <p className="text-xs opacity-60">{label(e.paidBy)} จ่าย · หาร {e.splitWith.length} คน</p>
            </div>
            <span className="ml-auto shrink-0 font-semibold">฿{e.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Maps({ trip }: { trip: SharedTrip["trip"] }) {
  const places = [...new Set((trip.itinerary ?? []).map((i) => i.place))];
  const [active, setActive] = useState(0);
  if (places.length === 0) return null;
  const q = encodeURIComponent(places[Math.min(active, places.length - 1)]);
  return (
    <Section title="🗺️ แผนที่">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {places.map((p, i) => (
          <button key={p} onClick={() => setActive(i)}
            className={`rounded-full px-3 py-1.5 text-xs ${i === active ? "bg-[#d9b26a] font-semibold text-[#0f2027]" : "bg-white/10"}`}>
            📍 {p}
          </button>
        ))}
      </div>
      <iframe key={q} title="map" src={`https://maps.google.com/maps?q=${q}&z=12&output=embed`}
        className="h-72 w-full rounded-xl border-0" loading="lazy" />
    </Section>
  );
}
