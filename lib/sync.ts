"use client";
import { supabase } from "./supabase";
import type { Profile } from "./store";

export async function pullCloudProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase()
    .from("profiles")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data.data as Profile;
}

let timer: ReturnType<typeof setTimeout> | null = null;

// debounced upsert — fires 1.5s after the last change
export function pushCloudProfile(userId: string, profile: Profile) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    await supabase()
      .from("profiles")
      .upsert({ user_id: userId, data: profile, updated_at: new Date().toISOString() });
  }, 1500);
}

export function hasContent(p: Profile | null): boolean {
  return !!p && (p.trips.length > 0 || p.extraCountries.length > 0 || !!p.name);
}
