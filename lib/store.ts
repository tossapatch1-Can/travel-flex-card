"use client";

export type ItineraryItem = {
  id: string;
  day: number; // 1-based
  time: string; // "09:00" or ""
  place: string;
  note: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  paidBy: string; // person name ("ฉัน" or companion)
  splitWith: string[]; // people sharing this expense (includes payer)
};

export type Trip = {
  id: string;
  kind: "past" | "upcoming";
  countryCodes: string[];
  title: string;
  startDate: string; // yyyy-mm-dd or ""
  endDate: string;
  companions: string[];
  memory: string; // past: ความทรงจำ / upcoming: โน้ต
  itinerary?: ItineraryItem[];
  expenses?: Expense[];
};

export type Profile = {
  name: string;
  handle: string;
  bio: string;
  extraCountries: string[]; // ticked without a trip entry
  trips: Trip[];
};

const KEY = "flexcard-profile-v1";

export const emptyProfile: Profile = { name: "", handle: "", bio: "", extraCountries: [], trips: [] };

export function loadProfile(): Profile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyProfile, ...JSON.parse(raw) } : emptyProfile;
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function visitedCodes(p: Profile): string[] {
  const s = new Set(p.extraCountries);
  p.trips.filter((t) => t.kind === "past").forEach((t) => t.countryCodes.forEach((c) => s.add(c)));
  return [...s];
}
