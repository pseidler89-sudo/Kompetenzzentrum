// Einmaliger Generator für die statische Open-Graph-Karte (public/og-default.png).
// Nutzt das ohnehin mit Astro installierte sharp. Bei Designänderung erneut laufen
// lassen:  node scripts/make-og-image.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 630;

// Markenfarbe und Typo bewusst schlicht – sans-serif ist auf allen Systemen da.
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#eef3fb"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="16" height="${H}" fill="#1c5fc4"/>

  <!-- Markenzeichen: gerundetes Quadrat mit Häkchen -->
  <g transform="translate(90, 86)">
    <rect width="72" height="72" rx="18" fill="#1c5fc4"/>
    <path d="M20 37l13 13L54 24" stroke="#ffffff" stroke-width="7"
          stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="186" y="138" font-family="sans-serif" font-size="40" font-weight="700"
        fill="#1c5fc4">Kompetenzzentrum</text>

  <!-- Schlagzeile -->
  <text x="90" y="300" font-family="sans-serif" font-size="86" font-weight="800"
        fill="#0f1b2d">Falschbehauptungen</text>
  <text x="90" y="396" font-family="sans-serif" font-size="86" font-weight="800"
        fill="#0f1b2d">prüfen lernen</text>

  <!-- Unterzeile -->
  <text x="90" y="476" font-family="sans-serif" font-size="38" font-weight="500"
        fill="#3b4a5e">Faktenbasiert · in drei Tiefen · mit Quellen</text>

  <!-- Fußzeile -->
  <text x="90" y="566" font-family="sans-serif" font-size="30" font-weight="600"
        fill="#1c5fc4">Aussagen prüfen, nicht Personen.</text>
</svg>`;

const out = fileURLToPath(new URL("../public/og-default.png", import.meta.url));
await sharp(Buffer.from(svg)).png().toFile(out);
console.log("geschrieben:", out);
