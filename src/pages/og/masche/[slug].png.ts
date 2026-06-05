import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";

/**
 * Dynamische Open-Graph-Karte pro Masche (build-time, SVG→PNG via sharp – keine
 * neue Abhängigkeit, analog zu /og/<slug>.png für Faktenchecks). Zeigt Titel +
 * ruhiges Kategorie-Chip (FLICC-Kerntechnik / häufiges Muster). Maschen sind das
 * Teilbarste – bisher teilten sich alle dasselbe Default-Bild.
 * Erreichbar unter /<base>/og/masche/<slug>.png
 */

export async function getStaticPaths() {
  const maschen = await getCollection("maschen");
  return maschen.map((m) => ({
    params: { slug: m.id },
    props: { titel: m.data.titel, kategorie: m.data.kategorie },
  }));
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function wrap(text: string, max: number): string[] {
  const words = text.replace(/[„"“”]/g, "").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (line && (line + " " + w).length > max) {
      lines.push(line);
      line = w;
    } else {
      line = line ? line + " " + w : w;
    }
  }
  if (line) lines.push(line);
  if (lines.length > 4) {
    lines.length = 4;
    lines[3] = lines[3].replace(/\s+\S*$/, "") + " …";
  }
  return lines;
}

export const GET: APIRoute = async ({ props }) => {
  const titel = (props as { titel: string }).titel;
  const kategorie = (props as { kategorie: string }).kategorie;
  // Technik-Akzent (analog global.css --c-technik), ruhig gehalten.
  const akzent = "#6d28d9";
  const kicker = kategorie === "flicc" ? "KERNTECHNIK DER DESINFORMATION" : "HÄUFIGES MUSTER";

  const lines = wrap(titel, 25);
  const lineH = 66;
  const titelTop = 252;
  const titelSvg = lines
    .map(
      (l, i) =>
        `<text x="92" y="${titelTop + i * lineH}" font-family="sans-serif" font-size="52" font-weight="800" fill="#0f1b2d">${escapeXml(l)}</text>`,
    )
    .join("");
  const chipY = titelTop + (lines.length - 1) * lineH + 80;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3eefb"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="16" height="630" fill="${akzent}"/>
  <g transform="translate(92, 70)">
    <rect width="46" height="46" rx="12" fill="#1c5fc4"/>
    <path d="M13 24l8 8L34 16" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="152" y="102" font-family="sans-serif" font-size="28" font-weight="700" fill="#1c5fc4">Kompetenzzentrum</text>
  <text x="92" y="160" font-family="sans-serif" font-size="22" font-weight="700" fill="${akzent}" letter-spacing="2">MASCHE · ${escapeXml(kicker)}</text>
  ${titelSvg}
  <text x="92" y="${chipY}" font-family="sans-serif" font-size="34" font-weight="700" fill="#3b4a5e">So durchschaust du sie</text>
  <text x="92" y="592" font-family="sans-serif" font-size="24" font-weight="600" fill="#3b4a5e">Manipulation erkennen · nicht Personen, sondern Muster</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
