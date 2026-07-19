"use client";

// deterministic pixel traveler: same seed → same character
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SKINS = ["#f6cba6", "#eab98a", "#d19a6a", "#a9764f"];
const HAIRS = ["#2b2b2b", "#5a3825", "#8a5a2b", "#c96f2f", "#7a7a7a", "#1f3a5f"];
const SHIRTS = ["#d9b26a", "#3f7ec1", "#c14b4b", "#3fa66a", "#8a5fc1", "#e07a3f"];
const PANTS = ["#2e3a45", "#4a3a2e", "#1f2a36", "#553344"];
// hair styles as pixel rows over the head (x from 3..8, y rows 0..2)
const HAIR_STYLES: number[][][] = [
  [[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[3,1],[8,1]], // short
  [[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[3,1],[4,1],[7,1],[8,1],[3,2],[8,2]], // fluffy
  [[4,0],[5,0],[6,0],[7,0],[3,1],[8,1],[3,2],[8,2],[3,3],[8,3]], // long side
  [[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[5,-1],[6,-1]], // topknot
];

export function PixelAvatar({ seed, size = 96 }: { seed: string; size?: number }) {
  const h = hash(seed || "traveler");
  const skin = SKINS[h % SKINS.length];
  const hair = HAIRS[(h >>> 3) % HAIRS.length];
  const shirt = SHIRTS[(h >>> 6) % SHIRTS.length];
  const pants = PANTS[(h >>> 9) % PANTS.length];
  const style = HAIR_STYLES[(h >>> 12) % HAIR_STYLES.length];
  const hasBackpack = (h >>> 15) % 2 === 0;
  const hasCamera = (h >>> 16) % 3 === 0;

  // 12x14 grid, y offset 2 to leave room for topknot
  const px: [number, number, string][] = [];
  const put = (x: number, y: number, c: string) => px.push([x, y + 2, c]);

  // head 3..8 x 1..4
  for (let x = 3; x <= 8; x++) for (let y = 1; y <= 4; y++) put(x, y, skin);
  style.forEach(([x, y]) => put(x, y, hair));
  // eyes + smile
  put(4, 3, "#222");
  put(7, 3, "#222");
  put(5, 4, "#b96a5a");
  put(6, 4, "#b96a5a");
  // body 3..8 x 5..9 shirt
  for (let x = 3; x <= 8; x++) for (let y = 5; y <= 9; y++) put(x, y, shirt);
  // arms
  for (let y = 5; y <= 8; y++) { put(2, y, shirt); put(9, y, shirt); }
  put(2, 9, skin);
  put(9, 9, skin);
  if (hasBackpack) {
    for (let y = 5; y <= 8; y++) { put(1, y, "#6b4a2b"); }
    put(3, 5, "#6b4a2b"); put(3, 6, "#6b4a2b");
  }
  if (hasCamera) { put(5, 7, "#222"); put(6, 7, "#222"); put(6, 6, "#888"); }
  // legs 10..12
  for (let y = 10; y <= 12; y++) { put(4, y, pants); put(5, y, pants); put(6, y, pants); put(7, y, pants); }
  // shoes
  put(3, 12, "#222"); put(4, 12, "#222"); put(7, 12, "#222"); put(8, 12, "#222");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 17"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-label="pixel avatar"
    >
      {px.map(([x, y, c], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={c} />
      ))}
    </svg>
  );
}
