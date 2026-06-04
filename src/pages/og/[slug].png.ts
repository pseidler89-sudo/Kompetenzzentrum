import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";
import { URTEIL_LABEL } from "../../lib/labels";

/**
 * Dynamische Open-Graph-Karte pro Faktencheck (build-time, reines SVG→PNG via
 * sharp – keine neue Abhängigkeit). Zeigt Titel + ein RUHIGES Urteils-Chip
 * (farbiger Punkt + Label, wie das Badge auf der Seite) – kein reißerischer
 * Stempel (Pfad A). Erreichbar unter /<base>/og/<slug>.png
 */

// Urteilsfarben analog global.css (hier als Hex, da im PNG keine CSS-Variablen).
const URTEIL_FARBE: Record<string, string> = {
  falsch: "#b71c1c",
  "groesstenteils-falsch": "#b71c1c",
  irrefuehrend: "#9a4d00",
  "fehlender-kontext": "#6b5400",
  "teils-richtig": "#4a5560",
};

export async function getStaticPaths() {
  const fc = await getCollection("faktenchecks");
  return fc.map((e) => ({ params: { slug: e.id }, props: { titel: e.data.titel, urteil: e.data.urteil } }));
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Einfaches Wort-Umbruch auf ~max Zeichen pro Zeile, höchstens 4 Zeilen.
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
  const urteil = (props as { urteil: string }).urteil;
  const farbe = URTEIL_FARBE[urteil] ?? "#1c5fc4";
  const label = URTEIL_LABEL[urteil] ?? urteil;

  const lines = wrap(titel, 25);
  const lineH = 66;
  const titelTop = 252; // konstant unter Wortmarke (y≈102) + Kicker (y≈160)
  const titelSvg = lines
    .map(
      (l, i) =>
        `<text x="92" y="${titelTop + i * lineH}" font-family="sans-serif" font-size="52" font-weight="800" fill="#0f1b2d">${escapeXml(l)}</text>`,
    )
    .join("");
  const chipY = titelTop + (lines.length - 1) * lineH + 86;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef3fb"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="16" height="630" fill="#1c5fc4"/>
  <g transform="translate(92, 70)">
    <rect width="46" height="46" rx="12" fill="#1c5fc4"/>
    <path d="M13 24l8 8L34 16" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="152" y="102" font-family="sans-serif" font-size="28" font-weight="700" fill="#1c5fc4">Kompetenzzentrum</text>
  <text x="92" y="160" font-family="sans-serif" font-size="22" font-weight="700" fill="#3b4a5e" letter-spacing="2">BEHAUPTUNG GEPRÜFT</text>
  ${titelSvg}
  <circle cx="104" cy="${chipY}" r="13" fill="${farbe}"/>
  <text x="130" y="${chipY + 12}" font-family="sans-serif" font-size="38" font-weight="800" fill="${farbe}">${escapeXml(label)}</text>
  <text x="92" y="592" font-family="sans-serif" font-size="24" font-weight="600" fill="#3b4a5e">Mit Quellen geprüft · Aussagen, nicht Personen</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
