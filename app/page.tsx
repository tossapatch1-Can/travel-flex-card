"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEMO_PROFILES } from "@/lib/demo";
import { COUNTRIES, byCode, computeBadges, percentile, type Country } from "@/lib/countries";
import { loadProfile, saveProfile, visitedCodes, emptyProfile, type Profile, type Trip } from "@/lib/store";
import { renderCard } from "@/lib/card";
import { AuthButton } from "@/components/Auth";
import { TripWorkspace } from "@/components/TripWorkspace";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function Home() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [tab, setTab] = useState<"profile" | "trips" | "card">("profile");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setReady(true);
  }, []);

  const update = (p: Profile) => {
    setProfile(p);
    saveProfile(p);
  };

  const visited = useMemo(() => visitedCodes(profile), [profile]);
  const badges = useMemo(() => computeBadges(visited), [visited]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-[#0f2027] text-[#f4ecd9]">
      <div className="mx-auto max-w-xl px-4 pb-28 pt-8">
        <header className="mb-6 text-center">
          <p className="text-sm tracking-[0.3em] text-[#d9b26a]">MY TRAVEL PASSPORT</p>
          <h1 className="mt-1 text-3xl font-bold">{profile.name || "นักเดินทาง"}</h1>
          {profile.bio && <p className="mt-1 text-sm opacity-70">{profile.bio}</p>}
          <div className="mt-3 flex justify-center">
            <AuthButton />
          </div>
        </header>

        {tab === "profile" && <ProfileTab profile={profile} update={update} visited={visited} badges={badges} />}
        {tab === "trips" && <TripsTab profile={profile} update={update} />}
        {tab === "card" && <CardTab profile={profile} visited={visited} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0b181e]/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl">
          {(
            [
              ["profile", "🌏", "โปรไฟล์"],
              ["trips", "🧳", "ทริปของฉัน"],
              ["card", "🎴", "Flex Card"],
            ] as const
          ).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-center text-sm ${tab === key ? "text-[#d9b26a]" : "opacity-60"}`}
            >
              <div className="text-xl">{icon}</div>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ---------- โปรไฟล์ ---------- */
function ProfileTab({ profile, update, visited, badges }: {
  profile: Profile; update: (p: Profile) => void; visited: string[]; badges: ReturnType<typeof computeBadges>;
}) {
  const [picking, setPicking] = useState(false);
  const pct = percentile(visited.length);
  const upcoming = profile.trips.filter((t) => t.kind === "upcoming");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat n={visited.length} label="ประเทศ" />
        <Stat n={profile.trips.filter((t) => t.kind === "past").length} label="ทริป" />
        <Stat n={badges.length} label="Badge" />
      </div>

      {pct > 0 && (
        <div className="rounded-full border border-[#d9b26a]/40 bg-[#d9b26a]/10 py-2 text-center text-sm text-[#d9b26a]">
          ✨ คุณเที่ยวมากกว่า {pct}% ของคนไทย (ค่าประมาณ)
        </div>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">ประเทศที่พิชิตแล้ว</h2>
          <button onClick={() => setPicking(true)} className="rounded-full bg-[#d9b26a] px-4 py-1.5 text-sm font-semibold text-[#0f2027]">
            + เพิ่มประเทศ
          </button>
        </div>
        {visited.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm opacity-60">
            ยังไม่มีประเทศเลย — กด &quot;+ เพิ่มประเทศ&quot; แล้วเริ่มโชว์ได้เลย
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visited.map((c) => (
              <span key={c} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                {byCode[c]?.flag} {byCode[c]?.th}
              </span>
            ))}
          </div>
        )}
      </section>

      {badges.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Achievements</h2>
          <div className="space-y-2">
            {badges.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <p className="font-semibold text-[#d9b26a]">{b.name}</p>
                  <p className="text-xs opacity-70">{b.desc}</p>
                </div>
                <span className="ml-auto text-xs uppercase opacity-50">{b.tier}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">🗓️ ทริปที่กำลังจะไป</h2>
          <div className="space-y-2">
            {upcoming.map((t) => (
              <div key={t.id} className="rounded-xl bg-white/5 p-3 text-sm">
                <p className="font-semibold">
                  {t.countryCodes.map((c) => byCode[c]?.flag).join(" ")} {t.title || t.countryCodes.map((c) => byCode[c]?.th).join(", ")}
                </p>
                <p className="opacity-70">
                  {fmtRange(t.startDate, t.endDate)}
                  {t.companions.length > 0 && ` · ไปกับ ${t.companions.join(", ")}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3 rounded-xl bg-white/5 p-4">
        <h2 className="font-semibold">ข้อมูลของฉัน</h2>
        <input
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40"
          placeholder="ชื่อที่จะโชว์บนการ์ด"
          value={profile.name}
          onChange={(e) => update({ ...profile, name: e.target.value })}
        />
        <input
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40"
          placeholder="คำอธิบายสั้น ๆ เช่น สายภูเขา ล่าแสงเหนือ"
          value={profile.bio}
          onChange={(e) => update({ ...profile, bio: e.target.value })}
        />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">👀 ส่องโปรไฟล์เพื่อนนักเดินทาง</h2>
        <div className="space-y-2">
          {DEMO_PROFILES.map((p) => (
            <Link key={p.handle} href={`/u/${p.handle}`} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <span className="text-2xl">{p.countries.length >= 9 ? "🌌" : p.countries.length >= 8 ? "🧳" : "🥾"}</span>
              <div className="min-w-0">
                <p className="font-semibold text-[#d9b26a]">
                  {p.name} <span className="text-xs font-normal opacity-60">@{p.handle}</span>
                </p>
                <p className="truncate text-xs opacity-70">{p.bio}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs opacity-50">{p.countries.length} ประเทศ →</span>
            </Link>
          ))}
        </div>
      </section>

      {picking && (
        <CountryPicker
          selected={visited}
          onClose={() => setPicking(false)}
          onToggle={(code) => {
            const inTrip = profile.trips.some((t) => t.kind === "past" && t.countryCodes.includes(code));
            if (inTrip) return; // country comes from a trip — remove the trip instead
            const extra = profile.extraCountries.includes(code)
              ? profile.extraCountries.filter((c) => c !== code)
              : [...profile.extraCountries, code];
            update({ ...profile, extraCountries: extra });
          }}
        />
      )}
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/5 py-3">
      <p className="text-2xl font-bold text-[#d9b26a]">{n}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}

/* ---------- ทริป ---------- */
function TripsTab({ profile, update }: { profile: Profile; update: (p: Profile) => void }) {
  const [editing, setEditing] = useState<Trip | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const past = profile.trips.filter((t) => t.kind === "past");
  const upcoming = profile.trips.filter((t) => t.kind === "upcoming");

  const save = (t: Trip) => {
    const others = profile.trips.filter((x) => x.id !== t.id);
    update({ ...profile, trips: [...others, t] });
    setEditing(null);
  };
  const remove = (id: string) => update({ ...profile, trips: profile.trips.filter((t) => t.id !== id) });
  const openTrip = profile.trips.find((t) => t.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setEditing({ id: uid(), kind: "past", countryCodes: [], title: "", startDate: "", endDate: "", companions: [], memory: "" })}
          className="flex-1 rounded-xl bg-[#d9b26a] py-3 font-semibold text-[#0f2027]"
        >
          + ทริปที่เคยไป
        </button>
        <button
          onClick={() => setEditing({ id: uid(), kind: "upcoming", countryCodes: [], title: "", startDate: "", endDate: "", companions: [], memory: "" })}
          className="flex-1 rounded-xl border border-[#d9b26a] py-3 font-semibold text-[#d9b26a]"
        >
          + ทริปที่จะไป
        </button>
      </div>

      <TripList title="🗓️ กำลังจะไป" trips={upcoming} onEdit={setEditing} onRemove={remove} onOpen={setOpenId} empty="ยังไม่มีแผน — เพิ่มทริปที่จะไปได้เลย" />
      <TripList title="📸 ความทรงจำที่ผ่านมา" trips={past} onEdit={setEditing} onRemove={remove} onOpen={setOpenId} empty="ยังไม่มีทริปเก่า — เพิ่มทริปแรกของคุณเลย" />

      {editing && <TripEditor trip={editing} onSave={save} onClose={() => setEditing(null)} />}
      {openTrip && <TripWorkspace trip={openTrip} onChange={save} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function TripList({ title, trips, onEdit, onRemove, onOpen, empty }: {
  title: string; trips: Trip[]; onEdit: (t: Trip) => void; onRemove: (id: string) => void;
  onOpen: (id: string) => void; empty: string;
}) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">{title}</h2>
      {trips.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/20 p-4 text-center text-sm opacity-60">{empty}</p>
      ) : (
        <div className="space-y-2">
          {trips
            .slice()
            .sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""))
            .map((t) => (
              <div key={t.id} className="rounded-xl bg-white/5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {t.countryCodes.map((c) => byCode[c]?.flag).join(" ")}{" "}
                      {t.title || t.countryCodes.map((c) => byCode[c]?.en).join(" · ")}
                    </p>
                    <p className="text-xs opacity-70">{fmtRange(t.startDate, t.endDate)}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => onEdit(t)} className="rounded-full bg-white/10 px-3 py-1">แก้ไข</button>
                    <button onClick={() => onRemove(t.id)} className="rounded-full bg-white/10 px-3 py-1 opacity-60">ลบ</button>
                  </div>
                </div>
                <button
                  onClick={() => onOpen(t.id)}
                  className="mt-3 w-full rounded-lg border border-[#d9b26a]/50 py-2 text-xs font-semibold text-[#d9b26a]"
                >
                  📅 Itinerary · 💰 Expenses · 🗺️ Maps — เปิดทริป
                </button>
                {t.companions.length > 0 && (
                  <p className="mt-2 text-sm">
                    👥 {t.kind === "upcoming" ? "ไปด้วยกัน: " : "ไปกับ: "}
                    <span className="opacity-80">{t.companions.join(", ")}</span>
                  </p>
                )}
                {t.memory && <p className="mt-1 whitespace-pre-wrap text-sm italic opacity-80">“{t.memory}”</p>}
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

function TripEditor({ trip, onSave, onClose }: { trip: Trip; onSave: (t: Trip) => void; onClose: () => void }) {
  const [t, setT] = useState<Trip>(trip);
  const [picking, setPicking] = useState(false);
  const [companion, setCompanion] = useState("");

  const addCompanion = () => {
    const name = companion.trim();
    if (!name) return;
    setT({ ...t, companions: [...t.companions, name] });
    setCompanion("");
  };

  return (
    <Modal onClose={onClose} title={t.kind === "past" ? "ทริปที่เคยไป" : "ทริปที่จะไป"}>
      <div className="space-y-3">
        <button onClick={() => setPicking(true)} className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm">
          {t.countryCodes.length
            ? t.countryCodes.map((c) => `${byCode[c]?.flag} ${byCode[c]?.th}`).join(", ")
            : "🌍 เลือกประเทศ (เลือกได้หลายประเทศ)"}
        </button>
        <input
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40"
          placeholder="ชื่อทริป เช่น ล่าแสงเหนือกับแก๊งค์"
          value={t.title}
          onChange={(e) => setT({ ...t, title: e.target.value })}
        />
        <div className="flex gap-2">
          <label className="flex-1 text-xs opacity-70">
            เริ่ม
            <input type="date" className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none" value={t.startDate}
              onChange={(e) => setT({ ...t, startDate: e.target.value })} />
          </label>
          <label className="flex-1 text-xs opacity-70">
            ถึง
            <input type="date" className="mt-1 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none" value={t.endDate}
              onChange={(e) => setT({ ...t, endDate: e.target.value })} />
          </label>
        </div>
        <div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40"
              placeholder={t.kind === "past" ? "ไปกับใคร (พิมพ์ชื่อแล้วกดเพิ่ม)" : "ใครไปบ้างแล้ว (พิมพ์ชื่อแล้วกดเพิ่ม)"}
              value={companion}
              onChange={(e) => setCompanion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCompanion()}
            />
            <button onClick={addCompanion} className="rounded-lg bg-white/10 px-4 text-sm">เพิ่ม</button>
          </div>
          {t.companions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {t.companions.map((c, i) => (
                <span key={i} className="rounded-full bg-[#d9b26a]/20 px-3 py-1 text-xs text-[#d9b26a]">
                  {c}{" "}
                  <button onClick={() => setT({ ...t, companions: t.companions.filter((_, j) => j !== i) })}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
        <textarea
          className="h-24 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40"
          placeholder={t.kind === "past" ? "ความทรงจำดี ๆ จากทริปนี้..." : "โน้ต/แผนคร่าว ๆ..."}
          value={t.memory}
          onChange={(e) => setT({ ...t, memory: e.target.value })}
        />
        <button
          onClick={() => t.countryCodes.length && onSave(t)}
          disabled={!t.countryCodes.length}
          className="w-full rounded-xl bg-[#d9b26a] py-3 font-semibold text-[#0f2027] disabled:opacity-40"
        >
          บันทึกทริป
        </button>
      </div>
      {picking && (
        <CountryPicker
          selected={t.countryCodes}
          onClose={() => setPicking(false)}
          onToggle={(code) =>
            setT({
              ...t,
              countryCodes: t.countryCodes.includes(code)
                ? t.countryCodes.filter((c) => c !== code)
                : [...t.countryCodes, code],
            })
          }
        />
      )}
    </Modal>
  );
}

/* ---------- การ์ด ---------- */
function CardTab({ profile, visited }: { profile: Profile; visited: string[] }) {
  const [img, setImg] = useState<string>("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (visited.length) setImg(renderCard(profile.name, visited));
  }, [profile.name, visited]);

  if (!visited.length)
    return <p className="rounded-xl border border-dashed border-white/20 p-8 text-center text-sm opacity-60">เพิ่มประเทศก่อน แล้วกลับมาสร้างการ์ดสวย ๆ ที่นี่ 🎴</p>;

  const download = () => {
    const a = linkRef.current!;
    a.href = img;
    a.download = `flexcard-${profile.name || "me"}.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="Flex Card" className="mx-auto w-64 rounded-2xl shadow-2xl shadow-black/50" />
      )}
      <button onClick={download} className="w-full rounded-xl bg-[#d9b26a] py-3 font-semibold text-[#0f2027]">
        ⬇️ เซฟการ์ดลงเครื่อง (ขนาด IG Story)
      </button>
      <p className="text-center text-xs opacity-50">เซฟแล้วเอาไปลง Story / TikTok ได้เลย</p>
      <a ref={linkRef} className="hidden" />
    </div>
  );
}

/* ---------- shared ---------- */
function CountryPicker({ selected, onToggle, onClose }: {
  selected: string[]; onToggle: (code: string) => void; onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const list = COUNTRIES.filter(
    (c: Country) => !q || c.th.includes(q) || c.en.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <Modal onClose={onClose} title="เลือกประเทศ">
      <input
        autoFocus
        className="mb-3 w-full rounded-lg bg-white/10 px-3 py-2 text-sm outline-none placeholder:opacity-40"
        placeholder="ค้นหา เช่น ญี่ปุ่น, Iceland"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto pb-2">
        {list.map((c) => {
          const on = selected.includes(c.code);
          return (
            <button
              key={c.code}
              onClick={() => onToggle(c.code)}
              className={`rounded-lg px-3 py-2 text-left text-sm ${on ? "bg-[#d9b26a] font-semibold text-[#0f2027]" : "bg-white/10"}`}
            >
              {c.flag} {c.th}
            </button>
          );
        })}
      </div>
      <button onClick={onClose} className="mt-3 w-full rounded-xl bg-white/10 py-3 text-sm">เสร็จแล้ว</button>
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-[#14262e] p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="opacity-60">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function fmtRange(a: string, b: string) {
  if (!a && !b) return "ไม่ระบุวันที่";
  const f = (d: string) => (d ? new Date(d + "T00:00:00").toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "?");
  return b && b !== a ? `${f(a)} – ${f(b)}` : f(a);
}
