const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type DemoTrip = {
  kind: "past" | "upcoming";
  countryCodes: string[];
  title: string;
  dateLabel: string;
  companions: string[];
  memory: string;
  photos: { src: string; caption: string }[];
  itinerary?: { day: number; time: string; place: string; note: string }[];
  expenses?: { title: string; amount: number; paidBy: string; splitWith: string[] }[];
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
        itinerary: [
          { day: 1, time: "16:20", place: "Keflavík Airport", note: "รับรถเช่า 4x4 แล้วขับเข้า Reykjavík" },
          { day: 1, time: "19:30", place: "Reykjavík", note: "เช็คอิน + ล็อบสเตอร์ซุปร้าน Sæta Svínið" },
          { day: 2, time: "09:00", place: "Þingvellir National Park", note: "จุดแรกของ Golden Circle" },
          { day: 2, time: "13:00", place: "Geysir", note: "รอ Strokkur พุ่งทุก ~8 นาที" },
          { day: 2, time: "15:00", place: "Gullfoss", note: "น้ำตกทองคำ ลมแรงมาก เตรียมกันหนาว" },
          { day: 3, time: "10:00", place: "Seljalandsfoss", note: "เดินหลังม่านน้ำตกได้ เปียกแน่นอน" },
          { day: 3, time: "13:30", place: "Skógafoss", note: "ขึ้นบันได 527 ขั้นไปดูวิวด้านบน" },
          { day: 3, time: "16:00", place: "Reynisfjara Black Sand Beach", note: "ระวังคลื่น sneaker wave ห้ามยืนใกล้" },
          { day: 4, time: "11:00", place: "Jökulsárlón Glacier Lagoon", note: "ล่องเรือชมภูเขาน้ำแข็ง + Diamond Beach" },
          { day: 5, time: "14:00", place: "Kirkjufell", note: "จุดถ่ายแสงเหนือที่ดีที่สุดของทริป — คืนนี้ฟ้าเปิด!" },
        ],
        expenses: [
          { title: "ค่าเช่ารถ 4x4 (10 วัน)", amount: 36000, paidBy: "อาร์ม", splitWith: ["อาร์ม", "มายด์", "เจมส์"] },
          { title: "ที่พัก 9 คืน", amount: 81000, paidBy: "มายด์", splitWith: ["อาร์ม", "มายด์", "เจมส์"] },
          { title: "น้ำมัน + ค่าทางด่วน", amount: 9600, paidBy: "เจมส์", splitWith: ["อาร์ม", "มายด์", "เจมส์"] },
          { title: "ล่องเรือ Glacier Lagoon", amount: 10500, paidBy: "อาร์ม", splitWith: ["อาร์ม", "มายด์", "เจมส์"] },
          { title: "ค่ากินรวมทั้งทริป", amount: 27000, paidBy: "เจมส์", splitWith: ["อาร์ม", "มายด์", "เจมส์"] },
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
