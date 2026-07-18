export type Country = { code: string; flag: string; en: string; th: string; region: string };

// ponytail: curated ~90 countries popular with Thai travelers; add more when users ask
export const COUNTRIES: Country[] = [
  // Asia
  { code: "TH", flag: "🇹🇭", en: "Thailand", th: "ไทย", region: "asia" },
  { code: "JP", flag: "🇯🇵", en: "Japan", th: "ญี่ปุ่น", region: "asia" },
  { code: "KR", flag: "🇰🇷", en: "South Korea", th: "เกาหลีใต้", region: "asia" },
  { code: "CN", flag: "🇨🇳", en: "China", th: "จีน", region: "asia" },
  { code: "TW", flag: "🇹🇼", en: "Taiwan", th: "ไต้หวัน", region: "asia" },
  { code: "HK", flag: "🇭🇰", en: "Hong Kong", th: "ฮ่องกง", region: "asia" },
  { code: "MO", flag: "🇲🇴", en: "Macau", th: "มาเก๊า", region: "asia" },
  { code: "SG", flag: "🇸🇬", en: "Singapore", th: "สิงคโปร์", region: "asean" },
  { code: "MY", flag: "🇲🇾", en: "Malaysia", th: "มาเลเซีย", region: "asean" },
  { code: "ID", flag: "🇮🇩", en: "Indonesia", th: "อินโดนีเซีย", region: "asean" },
  { code: "VN", flag: "🇻🇳", en: "Vietnam", th: "เวียดนาม", region: "asean" },
  { code: "LA", flag: "🇱🇦", en: "Laos", th: "ลาว", region: "asean" },
  { code: "KH", flag: "🇰🇭", en: "Cambodia", th: "กัมพูชา", region: "asean" },
  { code: "MM", flag: "🇲🇲", en: "Myanmar", th: "เมียนมา", region: "asean" },
  { code: "PH", flag: "🇵🇭", en: "Philippines", th: "ฟิลิปปินส์", region: "asean" },
  { code: "BN", flag: "🇧🇳", en: "Brunei", th: "บรูไน", region: "asean" },
  { code: "IN", flag: "🇮🇳", en: "India", th: "อินเดีย", region: "asia" },
  { code: "NP", flag: "🇳🇵", en: "Nepal", th: "เนปาล", region: "asia" },
  { code: "LK", flag: "🇱🇰", en: "Sri Lanka", th: "ศรีลังกา", region: "asia" },
  { code: "MV", flag: "🇲🇻", en: "Maldives", th: "มัลดีฟส์", region: "asia" },
  { code: "BT", flag: "🇧🇹", en: "Bhutan", th: "ภูฏาน", region: "asia" },
  { code: "MN", flag: "🇲🇳", en: "Mongolia", th: "มองโกเลีย", region: "asia" },
  { code: "KZ", flag: "🇰🇿", en: "Kazakhstan", th: "คาซัคสถาน", region: "asia" },
  { code: "UZ", flag: "🇺🇿", en: "Uzbekistan", th: "อุซเบกิสถาน", region: "asia" },
  // Middle East
  { code: "AE", flag: "🇦🇪", en: "UAE", th: "สหรัฐอาหรับเอมิเรตส์", region: "mideast" },
  { code: "QA", flag: "🇶🇦", en: "Qatar", th: "กาตาร์", region: "mideast" },
  { code: "SA", flag: "🇸🇦", en: "Saudi Arabia", th: "ซาอุดีอาระเบีย", region: "mideast" },
  { code: "TR", flag: "🇹🇷", en: "Türkiye", th: "ตุรกี", region: "mideast" },
  { code: "IL", flag: "🇮🇱", en: "Israel", th: "อิสราเอล", region: "mideast" },
  { code: "JO", flag: "🇯🇴", en: "Jordan", th: "จอร์แดน", region: "mideast" },
  { code: "OM", flag: "🇴🇲", en: "Oman", th: "โอมาน", region: "mideast" },
  // Europe
  { code: "GB", flag: "🇬🇧", en: "United Kingdom", th: "อังกฤษ", region: "europe" },
  { code: "FR", flag: "🇫🇷", en: "France", th: "ฝรั่งเศส", region: "europe" },
  { code: "IT", flag: "🇮🇹", en: "Italy", th: "อิตาลี", region: "europe" },
  { code: "CH", flag: "🇨🇭", en: "Switzerland", th: "สวิตเซอร์แลนด์", region: "europe" },
  { code: "DE", flag: "🇩🇪", en: "Germany", th: "เยอรมนี", region: "europe" },
  { code: "AT", flag: "🇦🇹", en: "Austria", th: "ออสเตรีย", region: "europe" },
  { code: "NL", flag: "🇳🇱", en: "Netherlands", th: "เนเธอร์แลนด์", region: "europe" },
  { code: "BE", flag: "🇧🇪", en: "Belgium", th: "เบลเยียม", region: "europe" },
  { code: "ES", flag: "🇪🇸", en: "Spain", th: "สเปน", region: "europe" },
  { code: "PT", flag: "🇵🇹", en: "Portugal", th: "โปรตุเกส", region: "europe" },
  { code: "GR", flag: "🇬🇷", en: "Greece", th: "กรีซ", region: "europe" },
  { code: "CZ", flag: "🇨🇿", en: "Czechia", th: "เช็ก", region: "europe" },
  { code: "HU", flag: "🇭🇺", en: "Hungary", th: "ฮังการี", region: "europe" },
  { code: "PL", flag: "🇵🇱", en: "Poland", th: "โปแลนด์", region: "europe" },
  { code: "SK", flag: "🇸🇰", en: "Slovakia", th: "สโลวาเกีย", region: "europe" },
  { code: "SI", flag: "🇸🇮", en: "Slovenia", th: "สโลวีเนีย", region: "europe" },
  { code: "HR", flag: "🇭🇷", en: "Croatia", th: "โครเอเชีย", region: "europe" },
  { code: "NO", flag: "🇳🇴", en: "Norway", th: "นอร์เวย์", region: "europe" },
  { code: "SE", flag: "🇸🇪", en: "Sweden", th: "สวีเดน", region: "europe" },
  { code: "FI", flag: "🇫🇮", en: "Finland", th: "ฟินแลนด์", region: "europe" },
  { code: "DK", flag: "🇩🇰", en: "Denmark", th: "เดนมาร์ก", region: "europe" },
  { code: "IS", flag: "🇮🇸", en: "Iceland", th: "ไอซ์แลนด์", region: "europe" },
  { code: "IE", flag: "🇮🇪", en: "Ireland", th: "ไอร์แลนด์", region: "europe" },
  { code: "EE", flag: "🇪🇪", en: "Estonia", th: "เอสโตเนีย", region: "europe" },
  { code: "LV", flag: "🇱🇻", en: "Latvia", th: "ลัตเวีย", region: "europe" },
  { code: "LT", flag: "🇱🇹", en: "Lithuania", th: "ลิทัวเนีย", region: "europe" },
  { code: "RU", flag: "🇷🇺", en: "Russia", th: "รัสเซีย", region: "europe" },
  { code: "MC", flag: "🇲🇨", en: "Monaco", th: "โมนาโก", region: "europe" },
  { code: "VA", flag: "🇻🇦", en: "Vatican", th: "วาติกัน", region: "europe" },
  { code: "LI", flag: "🇱🇮", en: "Liechtenstein", th: "ลิกเตนสไตน์", region: "europe" },
  { code: "LU", flag: "🇱🇺", en: "Luxembourg", th: "ลักเซมเบิร์ก", region: "europe" },
  { code: "RO", flag: "🇷🇴", en: "Romania", th: "โรมาเนีย", region: "europe" },
  { code: "BG", flag: "🇧🇬", en: "Bulgaria", th: "บัลแกเรีย", region: "europe" },
  { code: "MT", flag: "🇲🇹", en: "Malta", th: "มอลตา", region: "europe" },
  // Americas
  { code: "US", flag: "🇺🇸", en: "United States", th: "สหรัฐอเมริกา", region: "americas" },
  { code: "CA", flag: "🇨🇦", en: "Canada", th: "แคนาดา", region: "americas" },
  { code: "MX", flag: "🇲🇽", en: "Mexico", th: "เม็กซิโก", region: "americas" },
  { code: "BR", flag: "🇧🇷", en: "Brazil", th: "บราซิล", region: "americas" },
  { code: "AR", flag: "🇦🇷", en: "Argentina", th: "อาร์เจนตินา", region: "americas" },
  { code: "PE", flag: "🇵🇪", en: "Peru", th: "เปรู", region: "americas" },
  { code: "CL", flag: "🇨🇱", en: "Chile", th: "ชิลี", region: "americas" },
  { code: "CU", flag: "🇨🇺", en: "Cuba", th: "คิวบา", region: "americas" },
  // Oceania
  { code: "AU", flag: "🇦🇺", en: "Australia", th: "ออสเตรเลีย", region: "oceania" },
  { code: "NZ", flag: "🇳🇿", en: "New Zealand", th: "นิวซีแลนด์", region: "oceania" },
  { code: "FJ", flag: "🇫🇯", en: "Fiji", th: "ฟีจี", region: "oceania" },
  // Africa
  { code: "EG", flag: "🇪🇬", en: "Egypt", th: "อียิปต์", region: "africa" },
  { code: "MA", flag: "🇲🇦", en: "Morocco", th: "โมร็อกโก", region: "africa" },
  { code: "ZA", flag: "🇿🇦", en: "South Africa", th: "แอฟริกาใต้", region: "africa" },
  { code: "KE", flag: "🇰🇪", en: "Kenya", th: "เคนยา", region: "africa" },
  { code: "TZ", flag: "🇹🇿", en: "Tanzania", th: "แทนซาเนีย", region: "africa" },
  { code: "MU", flag: "🇲🇺", en: "Mauritius", th: "มอริเชียส", region: "africa" },
];

export const byCode = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

export const ASEAN = ["SG", "MY", "ID", "VN", "LA", "KH", "MM", "PH", "BN", "TH"];
export const AURORA = ["IS", "NO", "FI", "SE"];

export type Badge = { id: string; emoji: string; name: string; desc: string; tier: "gold" | "silver" | "bronze" };

export function computeBadges(codes: string[]): Badge[] {
  const set = new Set(codes);
  const n = set.size;
  const regions = new Set(codes.map((c) => byCode[c]?.region).filter(Boolean));
  const euCount = codes.filter((c) => byCode[c]?.region === "europe").length;
  const badges: Badge[] = [];
  if (n >= 50) badges.push({ id: "50", emoji: "👑", name: "World Conqueror", desc: "50+ ประเทศ", tier: "gold" });
  else if (n >= 25) badges.push({ id: "25", emoji: "🌏", name: "Globe Trotter", desc: "25+ ประเทศ", tier: "gold" });
  else if (n >= 10) badges.push({ id: "10", emoji: "✈️", name: "Frequent Flyer", desc: "10+ ประเทศ", tier: "silver" });
  else if (n >= 5) badges.push({ id: "5", emoji: "🧳", name: "Explorer", desc: "5+ ประเทศ", tier: "bronze" });
  if (ASEAN.every((c) => set.has(c))) badges.push({ id: "asean", emoji: "🌴", name: "ASEAN Complete", desc: "ครบ 10 ชาติอาเซียน", tier: "gold" });
  if (AURORA.some((c) => set.has(c))) badges.push({ id: "aurora", emoji: "🌌", name: "Aurora Hunter", desc: "ดินแดนแสงเหนือ", tier: "silver" });
  if (euCount >= 10) badges.push({ id: "eu10", emoji: "🏰", name: "Euro Master", desc: "ยุโรป 10+ ประเทศ", tier: "gold" });
  else if (euCount >= 3) badges.push({ id: "eu3", emoji: "🥐", name: "Euro Tripper", desc: "ยุโรป 3+ ประเทศ", tier: "bronze" });
  if (regions.size >= 5) badges.push({ id: "5regions", emoji: "🧭", name: "5 Continents", desc: "เหยียบ 5 ทวีป", tier: "gold" });
  if (set.has("MV") || set.has("FJ") || set.has("MU")) badges.push({ id: "island", emoji: "🏝️", name: "Island Soul", desc: "สายเกาะสวรรค์", tier: "bronze" });
  return badges;
}

// ponytail: hardcoded percentile estimate (labeled ค่าประมาณ), recalibrate from real users later
export function percentile(n: number): number {
  if (n >= 40) return 99;
  if (n >= 25) return 98;
  if (n >= 15) return 95;
  if (n >= 10) return 90;
  if (n >= 7) return 82;
  if (n >= 5) return 72;
  if (n >= 3) return 55;
  if (n >= 2) return 40;
  if (n >= 1) return 25;
  return 0;
}
