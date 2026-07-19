"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Publishable key — safe to ship in client code (protected by RLS on the backend)
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!client) client = createClient(URL, KEY);
  return client;
}
