const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type DemoTrip = {
  kind: "past" | "upcoming";
  countryCodes: string[];
  title: string;
  dateLabel: string;
  companions: string[];
  memory: string;
  photos: { src: string; caption: string }[];
};

export type DemoProfile = {
  handle: string;
  name: string;
  bio: string;
  countries: string[];
  trips: DemoTrip[];
};

// Demo photos: Wikimedia Commons (see public/demo/CREDITS.md)
export const DEMO_PROFILES: DemoProfile[] = [
  {
    handle: "arm.wanders",
    name: "อาร์ม",
    bio: "สายล่าแสงเหนือ ☃️ เที่ยวช้า ๆ แต่จำได้ทุกวินาที",
    countries: ["TH", "JP", "KR", "SG", "VN", "CH", "IS", "NO", "FI"],
    trips: [
      {
        kind: "past",
        countryCodes: ["IS"],
        title: "ล่าแสงเหนือรอบเกาะ Iceland",
        dateLabel: "18 ก.พ. – 1 มี.ค. 2569",
        companions: ["มายด์", "เจมส์"],
        memory:
          "คืนที่สามที่ Kirkjufell ฟ้าเปิดพอดี แสงเหนือเต้นอยู่เหนือหัวเกือบชั่วโมง มายด์ร้องไห้เลย 555 ส่วนเจมส์มัวแต่ตั้งกล้องจนเกือบพลาดดูด้วยตาตัวเอง",
        photos: [
          { src: `${BASE}/demo/kirkjufell.jpg`, caption: "Kirkjufell" },
          { src: `${BASE}/demo/skogafoss.jpg`, caption: "Skógafoss" },
          { src: `${BASE}/demo/aurora.jpg`, caption: "Aurora night" },
        ],
      },
      {
        kind: "upcoming",
        countryCodes: ["NO"],
        title: "Lofoten มี.ค. ปีหน้า",
        dateLabel: "มี.ค. 2570",
        companions: ["มายด์"],
        memory: "จองตั๋วแล้ว รอเพื่อนอีก 2 ที่ — ใครสนใจทักมา!",
        photos: [],
      },
    ],
  },
  {
    handle: "belle.explores",
    name: "เบลล์",
    bio: "เดินขึ้นเขาทุกประเทศที่ไป 🥾 ชีวิตต้องมีวิวภูเขาปีละครั้ง",
    countries: ["TH", "JP", "MY", "ID", "AU", "NZ", "LA"],
    trips: [
      {
        kind: "past",
        countryCodes: ["NZ"],
        title: "South Island Roadtrip 12 วัน",
        dateLabel: "5 – 17 ธ.ค. 2568",
        companions: ["พี่ต้น", "แนน", "กัน"],
        memory:
          "ขึ้น Roys Peak ตอนตี 4 เพื่อไปดูพระอาทิตย์ขึ้น เหนื่อยจนอยากร้องไห้ แต่พอถึงยอด... คุ้มทุกก้าว ส่วน Milford Sound วันนั้นฝนตกกลับกลายเป็นดี น้ำตกเต็มหน้าผาไปหมด",
        photos: [
          { src: `${BASE}/demo/roys-peak.jpg`, caption: "Roys Peak, Wānaka" },
          { src: `${BASE}/demo/milford.jpg`, caption: "Milford Sound" },
          { src: `${BASE}/demo/tekapo.jpg`, caption: "Lake Tekapo" },
        ],
      },
      {
        kind: "upcoming",
        countryCodes: ["JP"],
        title: "ปีนเขาที่ Kamikōchi",
        dateLabel: "ต.ค. 2569",
        companions: ["แนน"],
        memory: "ใบไม้เปลี่ยนสี + ออนเซ็นหลังเดินเทรล จองรีสอร์ทแล้ว",
        photos: [],
      },
    ],
  },
  {
    handle: "cheer.onthego",
    name: "เชียร์",
    bio: "ทำงานไป เที่ยวไป 🧳 เป้าหมาย: ครบ 30 ประเทศก่อนอายุ 30",
    countries: ["TH", "SG", "MY", "VN", "KH", "HK", "TW", "KR", "JP", "AU"],
    trips: [
      {
        kind: "past",
        countryCodes: ["AU"],
        title: "Sydney → Great Ocean Road → Uluru",
        dateLabel: "10 – 24 เม.ย. 2569",
        companions: ["ครอบครัว"],
        memory:
          "พาแม่ไปดู Opera House ที่แม่เห็นในทีวีมา 20 ปี แม่ยืนดูเฉย ๆ ไม่พูดอะไรสักคำ แล้วบอกว่า 'ไม่คิดว่าชีวิตนี้จะได้มาเห็นจริง ๆ' ทริปนี้แพงสุดแต่คุ้มสุดในชีวิต",
        photos: [
          { src: `${BASE}/demo/opera-house.jpg`, caption: "Sydney Opera House" },
          { src: `${BASE}/demo/twelve-apostles.jpg`, caption: "Twelve Apostles" },
          { src: `${BASE}/demo/uluru.jpg`, caption: "Uluru" },
        ],
      },
      {
        kind: "upcoming",
        countryCodes: ["IS"],
        title: "Iceland ประเทศที่ 11",
        dateLabel: "ก.พ. 2570",
        companions: [],
        memory: "ได้แรงบันดาลใจจากโปรไฟล์ @arm.wanders 🌌 หาเพื่อนร่วมทริปอยู่",
        photos: [],
      },
    ],
  },
];

export const demoByHandle = Object.fromEntries(DEMO_PROFILES.map((p) => [p.handle, p]));
