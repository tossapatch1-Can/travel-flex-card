"use client";
import { byCode, computeBadges, percentile } from "./countries";

// Renders the 9:16 flex card (1080x1920) on a canvas and returns a PNG data URL.
export function renderCard(name: string, codes: string[]): string {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // bg gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#0f2027");
  g.addColorStop(0.55, "#1b3a4b");
  g.addColorStop(1, "#0f2027");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // subtle stars
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.25 + 0.05})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2 + 0.5, 0, 7);
    ctx.fill();
  }

  const gold = "#d9b26a";
  const cream = "#f4ecd9";
  ctx.textAlign = "center";

  // header
  ctx.fillStyle = gold;
  ctx.font = "600 40px 'Helvetica Neue', sans-serif";
  ctx.fillText("MY TRAVEL PASSPORT", W / 2, 150);
  ctx.fillStyle = cream;
  ctx.font = "700 72px 'Helvetica Neue', sans-serif";
  ctx.fillText(name || "Traveler", W / 2, 250);

  // big number
  const n = codes.length;
  ctx.fillStyle = gold;
  ctx.font = "800 260px 'Helvetica Neue', sans-serif";
  ctx.fillText(String(n), W / 2, 560);
  ctx.fillStyle = cream;
  ctx.font = "500 52px 'Helvetica Neue', sans-serif";
  ctx.fillText(n === 1 ? "COUNTRY" : "COUNTRIES", W / 2, 640);

  // percentile
  const pct = percentile(n);
  if (pct > 0) {
    ctx.fillStyle = "rgba(217,178,106,0.15)";
    roundRect(ctx, W / 2 - 380, 690, 760, 90, 45);
    ctx.fill();
    ctx.fillStyle = gold;
    ctx.font = "600 40px 'Helvetica Neue', sans-serif";
    ctx.fillText(`เที่ยวมากกว่า ${pct}% ของคนไทย*`, W / 2, 750);
  }

  // flag grid
  const flags = codes.map((c) => byCode[c]?.flag).filter(Boolean);
  const perRow = 8, size = 92, gap = 22;
  const rows = Math.min(Math.ceil(flags.length / perRow), 7);
  const gridW = perRow * size + (perRow - 1) * gap;
  let y = 880;
  ctx.font = `${size - 14}px sans-serif`;
  for (let r = 0; r < rows; r++) {
    const rowFlags = flags.slice(r * perRow, (r + 1) * perRow);
    const rowW = rowFlags.length * size + (rowFlags.length - 1) * gap;
    let x = (W - (r === rows - 1 ? rowW : gridW)) / 2 + size / 2;
    for (const f of rowFlags) {
      ctx.fillText(f, x, y);
      x += size + gap;
    }
    y += size + gap;
  }
  if (flags.length > perRow * 7) {
    ctx.fillStyle = cream;
    ctx.font = "500 40px 'Helvetica Neue', sans-serif";
    ctx.fillText(`+${flags.length - perRow * 7} more`, W / 2, y);
    y += 60;
  }

  // badges
  const badges = computeBadges(codes).slice(0, 4);
  if (badges.length) {
    y = Math.max(y + 40, 1500);
    ctx.fillStyle = gold;
    ctx.font = "600 36px 'Helvetica Neue', sans-serif";
    ctx.fillText("— ACHIEVEMENTS —", W / 2, y);
    y += 80;
    ctx.font = "500 44px 'Helvetica Neue', sans-serif";
    for (const b of badges) {
      ctx.fillStyle = cream;
      ctx.fillText(`${b.emoji}  ${b.name} · ${b.desc}`, W / 2, y);
      y += 72;
    }
  }

  // footer
  ctx.fillStyle = "rgba(244,236,217,0.5)";
  ctx.font = "400 30px 'Helvetica Neue', sans-serif";
  ctx.fillText("*ค่าประมาณ · สร้างการ์ดของคุณฟรีที่ flexcard.travel", W / 2, H - 70);

  return canvas.toDataURL("image/png");
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
