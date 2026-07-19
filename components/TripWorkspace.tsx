"use client";
import { useMemo, useState } from "react";
import type { Expense, ItineraryItem, Trip } from "@/lib/store";
import { byCode } from "@/lib/countries";
import { loadProfile } from "@/lib/store";
import { shareUrl } from "@/lib/share";

const uid = () => Math.random().toString(36).slice(2, 10);
const ME = "ฉัน";

export function TripWorkspace({ trip, onChange, onClose }: {
  trip: Trip;
  onChange: (t: Trip) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"itinerary" | "expenses" | "map">("itinerary");
  const [copied, setCopied] = useState(false);
  const people = [ME, ...trip.companions];

  const share = async () => {
    const url = shareUrl({ name: loadProfile().name, trip });
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      prompt("คัดลอกลิงก์นี้ส่งให้เพื่อน:", url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div
        className="flex h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-[#14262e] sm:h-[85vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <h3 className="font-semibold">
              {trip.countryCodes.map((c) => byCode[c]?.flag).join(" ")}{" "}
              {trip.title || trip.countryCodes.map((c) => byCode[c]?.th).join(", ")}
            </h3>
            {trip.companions.length > 0 && (
              <p className="text-xs opacity-60">👥 {[ME, ...trip.companions].join(" · ")}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button onClick={share}
              className="rounded-lg bg-[#d9b26a]/20 px-3 py-1.5 text-xs font-semibold text-[#d9b26a]">
              {copied ? "คัดลอกแล้ว ✓" : "🔗 แชร์ทริป"}
            </button>
            <button onClick={onClose} className="opacity-60">✕</button>
          </div>
        </div>

        <div className="flex border-b border-white/10 px-5">
          {(
            [
              ["itinerary", "📅 Itinerary"],
              ["expenses", "💰 Expenses"],
              ["map", "🗺️ Maps"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 pb-2 text-sm ${tab === key ? "border-b-2 border-[#d9b26a] font-semibold text-[#d9b26a]" : "opacity-60"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "itinerary" && <ItineraryTab trip={trip} onChange={onChange} />}
          {tab === "expenses" && <ExpensesTab trip={trip} onChange={onChange} people={people} />}
          {tab === "map" && <MapTab trip={trip} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- 📅 Itinerary ---------- */
function ItineraryTab({ trip, onChange }: { trip: Trip; onChange: (t: Trip) => void }) {
  const items = trip.itinerary ?? [];
  const [day, setDay] = useState(1);
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");

  const nDays = useMemo(() => {
    if (trip.startDate && trip.endDate) {
      const d = (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000;
      if (d >= 0 && d < 60) return d + 1;
    }
    return Math.max(7, ...items.map((i) => i.day));
  }, [trip.startDate, trip.endDate, items]);

  const add = () => {
    if (!place.trim()) return;
    const item: ItineraryItem = { id: uid(), day, time, place: place.trim(), note: note.trim() };
    onChange({ ...trip, itinerary: [...items, item] });
    setPlace("");
    setNote("");
    setTime("");
  };
  const remove = (id: string) => onChange({ ...trip, itinerary: items.filter((i) => i.id !== id) });

  const days = [...new Set(items.map((i) => i.day))].sort((a, b) => a - b);

  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-xl bg-white/5 p-3">
        <div className="flex gap-2">
          <select value={day} onChange={(e) => setDay(Number(e.target.value))}
            className="rounded-lg bg-white/10 px-2 py-2 text-sm outline-none">
            {Array.from({ length: nDays }, (_, i) => (
              <option key={i} value={i + 1} className="bg-[#14262e]">Day {i + 1}</option>
            ))}
          </select>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="rounded-lg bg-white/10 px-2 py-2 text-sm outline-none" />
          <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="สถานที่ เช่น Kirkjufell"
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40" />
        </div>
        <div className="flex gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="โน้ต (ไม่บังคับ)"
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40" />
          <button onClick={add} className="rounded-lg bg-[#d9b26a] px-4 text-sm font-semibold text-[#0f2027]">เพิ่ม</button>
        </div>
      </div>

      {days.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm opacity-60">
          ยังไม่มีแผน — เพิ่มกิจกรรมแรกของทริปเลย
        </p>
      )}
      {days.map((d) => (
        <div key={d}>
          <h4 className="mb-2 text-sm font-semibold text-[#d9b26a]">Day {d}</h4>
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
                  <button onClick={() => remove(i.id)} className="ml-auto text-xs opacity-40">ลบ</button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 💰 Expenses ---------- */
function ExpensesTab({ trip, onChange, people }: { trip: Trip; onChange: (t: Trip) => void; people: string[] }) {
  const expenses = trip.expenses ?? [];
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(people[0]);
  const [splitWith, setSplitWith] = useState<string[]>(people);

  const add = () => {
    const amt = Number(amount);
    if (!title.trim() || !amt || amt <= 0 || splitWith.length === 0) return;
    const e: Expense = { id: uid(), title: title.trim(), amount: amt, paidBy, splitWith };
    onChange({ ...trip, expenses: [...expenses, e] });
    setTitle("");
    setAmount("");
  };
  const remove = (id: string) => onChange({ ...trip, expenses: expenses.filter((e) => e.id !== id) });

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  // net balance per person: + = should receive, - = owes
  const balances = useMemo(() => {
    const b: Record<string, number> = {};
    people.forEach((p) => (b[p] = 0));
    for (const e of expenses) {
      const share = e.amount / e.splitWith.length;
      b[e.paidBy] = (b[e.paidBy] ?? 0) + e.amount;
      e.splitWith.forEach((p) => (b[p] = (b[p] ?? 0) - share));
    }
    return b;
  }, [expenses, people]);

  const toggleSplit = (p: string) =>
    setSplitWith((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-xl bg-white/5 p-3">
        <div className="flex gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ค่าอะไร เช่น ค่าเช่ารถ"
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40" />
          <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} placeholder="บาท"
            inputMode="decimal" className="w-24 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="opacity-60">จ่ายโดย</span>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}
            className="rounded-lg bg-white/10 px-2 py-1.5 outline-none">
            {people.map((p) => <option key={p} className="bg-[#14262e]">{p}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="opacity-60">หารกับ:</span>
          {people.map((p) => (
            <button key={p} onClick={() => toggleSplit(p)}
              className={`rounded-full px-2.5 py-1 ${splitWith.includes(p) ? "bg-[#d9b26a] font-semibold text-[#0f2027]" : "bg-white/10 opacity-60"}`}>
              {p}
            </button>
          ))}
          <button onClick={add} className="ml-auto rounded-lg bg-[#d9b26a] px-4 py-1.5 font-semibold text-[#0f2027]">เพิ่ม</button>
        </div>
      </div>

      {expenses.length > 0 && (
        <>
          <div className="rounded-xl bg-[#d9b26a]/10 p-3 text-center">
            <p className="text-xs text-[#d9b26a]/80">ค่าใช้จ่ายรวม</p>
            <p className="text-2xl font-bold text-[#d9b26a]">฿{total.toLocaleString()}</p>
            <p className="text-xs opacity-60">เฉลี่ย ฿{Math.round(total / people.length).toLocaleString()} / คน</p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">ยอดสุทธิแต่ละคน</h4>
            <div className="space-y-1.5">
              {people.map((p) => {
                const b = Math.round(balances[p] ?? 0);
                return (
                  <div key={p} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                    <span>{p}</span>
                    <span className={b > 0 ? "text-emerald-300" : b < 0 ? "text-red-300" : "opacity-60"}>
                      {b > 0 ? `รับคืน ฿${b.toLocaleString()}` : b < 0 ? `ต้องจ่ายเพิ่ม ฿${(-b).toLocaleString()}` : "พอดี ✓"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">รายการทั้งหมด</h4>
            <div className="space-y-1.5">
              {expenses.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs opacity-60">{e.paidBy} จ่าย · หาร {e.splitWith.length} คน</p>
                  </div>
                  <span className="ml-auto shrink-0 font-semibold">฿{e.amount.toLocaleString()}</span>
                  <button onClick={() => remove(e.id)} className="text-xs opacity-40">ลบ</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {expenses.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm opacity-60">
          ยังไม่มีรายการ — บันทึกค่าใช้จ่ายแรกแล้วให้ระบบหารให้อัตโนมัติ
        </p>
      )}
    </div>
  );
}

/* ---------- 🗺️ Maps ---------- */
function MapTab({ trip }: { trip: Trip }) {
  const places = [...new Set((trip.itinerary ?? []).map((i) => i.place))];
  const [active, setActive] = useState(0);

  if (places.length === 0)
    return (
      <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm opacity-60">
        เพิ่มสถานที่ในแท็บ Itinerary ก่อน แล้วแผนที่จะขึ้นที่นี่อัตโนมัติ 🗺️
      </p>
    );

  const q = encodeURIComponent(places[active]);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {places.map((p, i) => (
          <button key={p} onClick={() => setActive(i)}
            className={`rounded-full px-3 py-1.5 text-xs ${i === active ? "bg-[#d9b26a] font-semibold text-[#0f2027]" : "bg-white/10"}`}>
            📍 {p}
          </button>
        ))}
      </div>
      <iframe
        key={q}
        title="map"
        src={`https://maps.google.com/maps?q=${q}&z=12&output=embed`}
        className="h-72 w-full rounded-xl border-0"
        loading="lazy"
      />
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${q}`}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-xl bg-white/10 py-2.5 text-center text-sm"
      >
        เปิด {places[active]} ใน Google Maps ↗
      </a>
    </div>
  );
}
