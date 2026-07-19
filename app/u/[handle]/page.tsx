import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_PROFILES, demoByHandle } from "@/lib/demo";
import { byCode, computeBadges, percentile } from "@/lib/countries";

export function generateStaticParams() {
  return DEMO_PROFILES.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = demoByHandle[handle];
  return p
    ? { title: `${p.name} (@${p.handle}) — Travel Flex Card`, description: p.bio }
    : {};
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = demoByHandle[handle];
  if (!p) notFound();

  const badges = computeBadges(p.countries);
  const pct = percentile(p.countries.length);
  const upcoming = p.trips.filter((t) => t.kind === "upcoming");
  const past = p.trips.filter((t) => t.kind === "past");

  return (
    <div className="min-h-screen bg-[#0f2027] text-[#f4ecd9]">
      <div className="mx-auto max-w-xl px-4 pb-16 pt-8">
        <header className="mb-6 text-center">
          <p className="text-sm tracking-[0.3em] text-[#d9b26a]">MY TRAVEL PASSPORT</p>
          <h1 className="mt-1 text-3xl font-bold">{p.name}</h1>
          <p className="text-sm text-[#d9b26a]/80">@{p.handle}</p>
          <p className="mt-1 text-sm opacity-70">{p.bio}</p>
        </header>

        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/5 py-3">
            <p className="text-2xl font-bold text-[#d9b26a]">{p.countries.length}</p>
            <p className="text-xs opacity-70">ประเทศ</p>
          </div>
          <div className="rounded-xl bg-white/5 py-3">
            <p className="text-2xl font-bold text-[#d9b26a]">{past.length}</p>
            <p className="text-xs opacity-70">ทริป</p>
          </div>
          <div className="rounded-xl bg-white/5 py-3">
            <p className="text-2xl font-bold text-[#d9b26a]">{badges.length}</p>
            <p className="text-xs opacity-70">Badge</p>
          </div>
        </div>

        {pct > 0 && (
          <div className="mb-6 rounded-full border border-[#d9b26a]/40 bg-[#d9b26a]/10 py-2 text-center text-sm text-[#d9b26a]">
            ✨ เที่ยวมากกว่า {pct}% ของคนไทย (ค่าประมาณ)
          </div>
        )}

        <section className="mb-6">
          <h2 className="mb-2 font-semibold">ประเทศที่พิชิตแล้ว</h2>
          <div className="flex flex-wrap gap-2">
            {p.countries.map((c) => (
              <span key={c} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                {byCode[c]?.flag} {byCode[c]?.th}
              </span>
            ))}
          </div>
        </section>

        {badges.length > 0 && (
          <section className="mb-6">
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
          <section className="mb-6">
            <h2 className="mb-2 font-semibold">🗓️ ทริปที่กำลังจะไป</h2>
            <div className="space-y-2">
              {upcoming.map((t, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-4 text-sm">
                  <p className="font-semibold">
                    {t.countryCodes.map((c) => byCode[c]?.flag).join(" ")} {t.title}
                  </p>
                  <p className="opacity-70">
                    {t.dateLabel}
                    {t.companions.length > 0 && ` · ไปด้วยกัน: ${t.companions.join(", ")}`}
                  </p>
                  {t.memory && <p className="mt-1 italic opacity-80">{t.memory}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="mb-2 font-semibold">📸 ความทรงจำที่ผ่านมา</h2>
          <div className="space-y-4">
            {past.map((t, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white/5">
                {t.photos.length > 0 && (
                  <div className={`grid gap-0.5 ${t.photos.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                    {t.photos.map((ph) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={ph.src} src={ph.src} alt={ph.caption} className="aspect-square w-full object-cover" />
                    ))}
                  </div>
                )}
                <div className="p-4">
                  <p className="font-semibold">
                    {t.countryCodes.map((c) => byCode[c]?.flag).join(" ")} {t.title}
                  </p>
                  <p className="text-xs opacity-70">{t.dateLabel}</p>
                  {t.companions.length > 0 && (
                    <p className="mt-2 text-sm">
                      👥 ไปกับ: <span className="opacity-80">{t.companions.join(", ")}</span>
                    </p>
                  )}
                  <p className="mt-1 text-sm italic opacity-80">“{t.memory}”</p>
                  {t.photos.length > 0 && (
                    <p className="mt-2 text-[10px] opacity-40">
                      {t.photos.map((ph) => ph.caption).join(" · ")} — photos: Wikimedia Commons
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/"
          className="block w-full rounded-xl bg-[#d9b26a] py-3 text-center font-semibold text-[#0f2027]"
        >
          🎴 สร้าง Travel Passport ของฉันบ้าง
        </Link>
      </div>
    </div>
  );
}
