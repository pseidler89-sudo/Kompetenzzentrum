#!/usr/bin/env node
/**
 * Verständlichkeits-Report für die „Einstieg"-Stufe (Usability-Loop U1).
 *
 * Zielgruppe: politisch wenig vorgebildete Leser:innen. Die Einstieg-Stufe
 * soll OHNE Vorwissen verständlich sein. Dieses Skript macht „einfach genug?"
 * messbar – als Proxy, NICHT als Ersatz für echte Leser:innen.
 *
 * Kennzahlen je `einstieg`-Feld (und `kurzantwort`):
 *   - WSTF: Wiener Sachtextformel (≈ Schulstufe 4–15; niedriger = leichter)
 *   - SL  : Ø Satzlänge (Wörter/Satz)
 *   - LW% : Anteil langer Wörter (> 6 Buchstaben)
 *   - MS% : Anteil mehrsilbiger Wörter (≥ 3 Silben)
 *   - Nom : Nominalisierungen (-ung/-heit/-keit/-ität/-ismus) je 100 Wörter
 *   - Jargon: kuratierte Barriere-Begriffe, die unerklärt auftauchen
 *
 * Bewusst ohne externe Abhängigkeiten (heuristische Silben-/Satz-Erkennung).
 * Report-Modus: gibt eine Tabelle aus und endet mit Exit 0 (kein Build-Gate);
 * mit `--strict` schlägt es fehl, sobald ein Einstieg über dem Schwellwert liegt.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FC_DIR = "src/content/faktenchecks";
const SCHWELLE = 10; // WSTF-Schwellwert für „Einstieg" (≈ 10. Klasse)
const strict = process.argv.includes("--strict");

// Kuratierte Barriere-Begriffe: für Laien schwer, in der Einstieg-Stufe zu
// vermeiden oder zu erklären. Bewusst knapp; Fachbegriffe gehören in tiefere Stufen.
const JARGON = [
  "Desinformation", "Prebunking", "Inoculation", "Narrativ", "Diskurs",
  "novelliert", "Novelle", "Stromgestehungskosten", "LCOE", "Implikation",
  "kategorisieren", "Methodik", "Evidenz", "Korrelation", "Kausalität",
  "Sekundärquelle", "Primärquelle", "Dekarbonisierung", "Transformation",
];

/** Frontmatter-Rohblock. */
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

/** Liest ein Block-Scalar-Feld (key: |) ODER ein einzeiliges "..."-Feld. */
function feld(fm, name) {
  const zeilen = fm.split("\n");
  const i = zeilen.findIndex((z) => new RegExp(`^${name}:`).test(z));
  if (i === -1) return "";
  const kopf = zeilen[i].slice(name.length + 1).trim();
  if (kopf.startsWith("|")) {
    const out = [];
    for (let j = i + 1; j < zeilen.length; j++) {
      if (/^\S/.test(zeilen[j]) && zeilen[j].trim() !== "") break; // nächstes Top-Level-Feld
      out.push(zeilen[j].replace(/^\s{2}/, ""));
    }
    return out.join("\n").trim();
  }
  return kopf.replace(/^["']|["']$/g, "").trim();
}

/** Markdown grob entfernen, damit nur der Lesetext gezählt wird. */
function klartext(md) {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // Links → Text
    .replace(/[*_`#>]/g, "") // Betonung/Überschriften/Code
    .replace(/^\s*[-–]\s+/gm, "") // Aufzählungszeichen
    .replace(/„|"|"|"/g, "");
}

const VOKALE = /[aeiouäöüy]+/g;
function silben(wort) {
  const w = wort.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w) return 0;
  const g = w.match(VOKALE);
  return Math.max(1, g ? g.length : 0);
}

function analysiere(text) {
  const t = klartext(text);
  // Sätze: an .!?: und Zeilenumbrüchen (Aufzählungspunkte = eigene Einheiten).
  const saetze = t
    .split(/[.!?:]+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 2);
  const woerter = t.split(/\s+/).map((w) => w.replace(/[^A-Za-zäöüÄÖÜß-]/g, "")).filter(Boolean);
  const n = woerter.length;
  if (n === 0 || saetze.length === 0) return null;

  const silbenZahl = woerter.map(silben);
  const mehrsilbig = silbenZahl.filter((s) => s >= 3).length;
  const einsilbig = silbenZahl.filter((s) => s === 1).length;
  const lang = woerter.filter((w) => w.length > 6).length;

  const SL = n / saetze.length;
  const MS = (mehrsilbig / n) * 100;
  const IW = (lang / n) * 100;
  const ES = (einsilbig / n) * 100;
  // Wiener Sachtextformel (1. Variante).
  const WSTF = 0.1935 * MS + 0.1672 * SL + 0.1297 * IW - 0.0327 * ES - 0.875;

  const nom = (text.match(/\w+(ung|heit|keit|ität|ismus)\b/gi) || []).length;
  const nomJe100 = (nom / n) * 100;

  return { n, SL, MS, IW, WSTF, nomJe100, saetze: saetze.length };
}

function jargonHits(text) {
  const hits = [];
  for (const w of JARGON) {
    if (new RegExp(`\\b${w}`, "i").test(text)) hits.push(w);
  }
  return hits;
}

const dateien = readdirSync(FC_DIR).filter((f) => f.endsWith(".md"));
const zeilen = [];
let ueber = 0;

for (const datei of dateien) {
  const fm = frontmatter(readFileSync(join(FC_DIR, datei), "utf8"));
  const einstieg = feld(fm, "einstieg");
  const a = analysiere(einstieg);
  if (!a) continue;
  const jargon = jargonHits(einstieg);
  if (a.WSTF > SCHWELLE) ueber++;
  zeilen.push({
    datei: datei.replace(/\.md$/, ""),
    WSTF: a.WSTF,
    SL: a.SL,
    LW: a.IW,
    MS: a.MS,
    nom: a.nomJe100,
    jargon,
  });
}

zeilen.sort((x, y) => y.WSTF - x.WSTF);

console.log("\nVerstaendlichkeit der Einstieg-Stufe  (WSTF ~ Schulstufe, niedriger = leichter)\n");
console.log(
  "  WSTF  SL    LW%   MS%   Nom   Faktencheck                         Jargon",
);
console.log("  " + "─".repeat(92));
for (const z of zeilen) {
  const flag = z.WSTF > SCHWELLE ? "⚠ " : "  ";
  console.log(
    flag +
      `${z.WSTF.toFixed(1).padStart(4)}  ${z.SL.toFixed(1).padStart(4)}  ${z.LW.toFixed(0).padStart(4)}  ${z.MS.toFixed(0).padStart(4)}  ${z.nom.toFixed(1).padStart(4)}  ${z.datei.padEnd(34)}  ${z.jargon.join(", ")}`,
  );
}

const schnitt = zeilen.reduce((s, z) => s + z.WSTF, 0) / (zeilen.length || 1);
console.log("  " + "─".repeat(92));
console.log(
  `\n  Ø WSTF: ${schnitt.toFixed(1)}  ·  ${zeilen.length} Einstiege  ·  ${ueber} über Schwellwert ${SCHWELLE}` +
    `  ·  Jargon-Treffer: ${zeilen.reduce((s, z) => s + z.jargon.length, 0)}\n`,
);

if (strict && ueber > 0) {
  console.error(`❌ ${ueber} Einstieg(e) über WSTF ${SCHWELLE}.`);
  process.exit(1);
}
