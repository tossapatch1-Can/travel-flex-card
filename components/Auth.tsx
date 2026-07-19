"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sb = supabase();
    sb.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setOpen(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (user) {
    const label = user.email || user.phone || "บัญชีของฉัน";
    return (
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="max-w-[180px] truncate rounded-full bg-[#d9b26a]/15 px-3 py-1 text-[#d9b26a]">
          ✓ {label}
        </span>
        <button onClick={() => supabase().auth.signOut()} className="rounded-full bg-white/10 px-3 py-1 opacity-70">
          ออกจากระบบ
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-[#d9b26a] px-4 py-1.5 text-sm font-semibold text-[#d9b26a]"
      >
        เข้าสู่ระบบ
      </button>
      {open && <LoginModal onClose={() => setOpen(false)} />}
    </>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"menu" | "email" | "phone" | "sent" | "otp">("menu");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const oauth = async (provider: "google" | "github") => {
    setErr("");
    const label = provider === "google" ? "Google" : "GitHub";
    // check the provider is actually enabled before redirecting,
    // otherwise the user lands on a raw JSON 400 page
    try {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const res = await fetch(`${base}/auth/v1/settings`, {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "" },
      });
      const settings = await res.json();
      if (!settings?.external?.[provider]) {
        setErr(`เข้าสู่ระบบด้วย ${label} ยังไม่เปิดใช้งาน — ใช้อีเมลไปก่อนได้เลยครับ ✉️`);
        return;
      }
    } catch {
      /* settings unreachable — fall through and try anyway */
    }
    const { error } = await supabase().auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/" },
    });
    if (error) setErr(`เข้าสู่ระบบด้วย ${label} ยังไม่พร้อมใช้งาน`);
  };

  const sendEmail = async () => {
    if (!email.includes("@")) return setErr("กรอกอีเมลให้ถูกต้อง");
    setBusy(true);
    setErr("");
    const { error } = await supabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/" },
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setMode("sent");
  };

  const sendPhone = async () => {
    const p = phone.replace(/[\s-]/g, "").replace(/^0/, "+66");
    if (p.length < 10) return setErr("กรอกเบอร์โทรให้ถูกต้อง");
    setBusy(true);
    setErr("");
    const { error } = await supabase().auth.signInWithOtp({ phone: p });
    setBusy(false);
    if (error) setErr("เข้าสู่ระบบด้วยเบอร์โทรยังไม่พร้อมใช้งาน — ใช้อีเมลไปก่อนได้เลย");
    else setMode("otp");
  };

  const verifyPhone = async () => {
    const p = phone.replace(/[\s-]/g, "").replace(/^0/, "+66");
    setBusy(true);
    setErr("");
    const { error } = await supabase().auth.verifyOtp({ phone: p, token: code, type: "sms" });
    setBusy(false);
    if (error) setErr("รหัสไม่ถูกต้อง ลองใหม่อีกครั้ง");
  };

  const input = "w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm outline-none placeholder:opacity-40";
  const primary = "w-full rounded-xl bg-[#d9b26a] py-3 font-semibold text-[#0f2027] disabled:opacity-40";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-t-2xl bg-[#14262e] p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">เข้าสู่ระบบ / สมัครสมาชิก</h3>
          <button onClick={onClose} className="opacity-60">✕</button>
        </div>

        {mode === "menu" && (
          <div className="space-y-2.5">
            <button onClick={() => oauth("google")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-[#1f1f1f]">
              <GoogleIcon /> เข้าสู่ระบบด้วย Google
            </button>
            <button onClick={() => oauth("github")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24292f] py-3 font-semibold text-white">
              <GitHubIcon /> เข้าสู่ระบบด้วย GitHub
            </button>
            <div className="flex items-center gap-3 py-1 text-xs opacity-40">
              <div className="h-px flex-1 bg-white/20" /> หรือ <div className="h-px flex-1 bg-white/20" />
            </div>
            <button onClick={() => setMode("email")} className="w-full rounded-xl bg-white/10 py-3 text-sm">
              ✉️ เข้าสู่ระบบด้วยอีเมล
            </button>
            <button onClick={() => setMode("phone")} className="w-full rounded-xl bg-white/10 py-3 text-sm">
              📱 เข้าสู่ระบบด้วยเบอร์โทร
            </button>
          </div>
        )}

        {mode === "email" && (
          <div className="space-y-3">
            <input className={input} type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendEmail()} autoFocus />
            <button onClick={sendEmail} disabled={busy} className={primary}>
              {busy ? "กำลังส่ง..." : "ส่งลิงก์เข้าสู่ระบบไปที่อีเมล"}
            </button>
            <button onClick={() => { setMode("menu"); setErr(""); }} className="w-full text-center text-xs opacity-50">← กลับ</button>
          </div>
        )}

        {mode === "sent" && (
          <div className="space-y-2 py-4 text-center">
            <p className="text-3xl">📬</p>
            <p className="text-sm">ส่งลิงก์ไปที่ <span className="text-[#d9b26a]">{email}</span> แล้ว</p>
            <p className="text-xs opacity-60">เปิดอีเมลแล้วกดลิงก์เพื่อเข้าสู่ระบบได้เลย (เช็คใน Junk ด้วยถ้าไม่เจอ)</p>
          </div>
        )}

        {mode === "phone" && (
          <div className="space-y-3">
            <input className={input} type="tel" placeholder="08x-xxx-xxxx" value={phone}
              onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendPhone()} autoFocus />
            <button onClick={sendPhone} disabled={busy} className={primary}>
              {busy ? "กำลังส่ง..." : "ส่งรหัส OTP"}
            </button>
            <button onClick={() => { setMode("menu"); setErr(""); }} className="w-full text-center text-xs opacity-50">← กลับ</button>
          </div>
        )}

        {mode === "otp" && (
          <div className="space-y-3">
            <p className="text-center text-sm opacity-70">กรอกรหัส 6 หลักที่ส่งไปที่ {phone}</p>
            <input className={`${input} text-center tracking-[0.5em]`} inputMode="numeric" maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verifyPhone()} autoFocus />
            <button onClick={verifyPhone} disabled={busy || code.length < 6} className={primary}>ยืนยันรหัส</button>
          </div>
        )}

        {err && <p className="mt-3 rounded-lg bg-red-500/15 p-2 text-center text-xs text-red-300">{err}</p>}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.8 6.1C12.2 13.4 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.9 38 46.5 31.8 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.3 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.1 0 11.2-2 14.9-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.4 2.2-6.4 0-11.8-3.9-13.7-9.5l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
