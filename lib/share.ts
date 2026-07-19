"use client";
import type { Trip } from "@/lib/store";

export type SharedTrip = { name: string; trip: Trip };

// trip data lives in the URL hash itself (base64url JSON) — static site, no server
export function encodeShared(p: SharedTrip): string {
  const bytes = new TextEncoder().encode(JSON.stringify(p));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeShared(hash: string): SharedTrip | null {
  try {
    const b64 = hash.replace(/^#/, "").replaceAll("-", "+").replaceAll("_", "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const p = JSON.parse(new TextDecoder().decode(bytes));
    if (!p?.trip?.countryCodes) return null;
    return p as SharedTrip;
  } catch {
    return null;
  }
}

export function shareUrl(p: SharedTrip): string {
  const base = window.location.origin + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  return `${base}/trip/#${encodeShared(p)}`;
}
