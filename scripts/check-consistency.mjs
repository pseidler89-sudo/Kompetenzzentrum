#!/usr/bin/env node
/**
 * Struktur-Konsistenz-Prüfung – läuft vor jedem Build und in der CI.
 *
 * Hintergrund: Die Liste der Manipulationstechniken (TECHNIKEN) muss an
 * VIER Stellen identisch gepflegt werden. Driften sie auseinander, bricht
 * entweder der Build (Zod-Enum) ODER – schlimmer – das CMS bietet einen
 * Code an, den die Anzeige (labels.ts) nicht kennt, und eine Masche/ein
 * Faktencheck erscheint ohne Label/Icon. Genau das war bisher nur ein
 * handgepflegter „an ZWEI Stellen pflegen“-Merksatz. Dieses Skript macht
 * die Invariante maschinell prüfbar.
 *
 * Geprüfte Invarianten:
 *   1. TECHNIKEN (content.config.ts) == Schlüssel jeder Map in labels.ts
 *      (TECHNIK_LABEL, MASCHE_ICON, TECHNIK_ERKLAERUNG, TECHNIK_KONTER)
 *   2. TECHNIKEN == die `value:`-Codes in public/admin/config.yml
 *      (beide Vorkommen: Faktenchecks-`techniken` UND Maschen-`code`)
 *   3. 1:1 – jede Technik hat GENAU eine Masche-Datei (code:) und umgekehrt
 *   4. FLICC-Kerntechniken == kanonische 5 (Cook 2020) und reihenfolge 1–5
 *
 * Bewusst ohne externe Abhängigkeiten (einfache Regex-Parser).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const fehler = [];

// --- Quelldateien einlesen -------------------------------------------------
const cfg = readFileSync("src/content.config.ts", "utf8");
const labels = readFileSync("src/lib/labels.ts", "utf8");
const yml = readFileSync("public/admin/config.yml", "utf8");

// TECHNIKEN-Enum aus content.config.ts (die Wahrheitsquelle).
const enumBlock = cfg.match(/TECHNIKEN = \[([\s\S]*?)\] as const/);
if (!enumBlock) {
  console.error("❌ TECHNIKEN-Enum in src/content.config.ts nicht gefunden.");
  process.exit(1);
}
const TECH = [...enumBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const TECH_SET = new Set(TECH);

// Hilfsfunktion: Differenz zweier Listen gegen TECHNIKEN melden.
function vergleiche(name, keys) {
  const fehlend = TECH.filter((t) => !keys.includes(t));
  const extra = keys.filter((t) => !TECH_SET.has(t));
  if (fehlend.length) fehler.push(`${name}: fehlende Codes ${JSON.stringify(fehlend)}`);
  if (extra.length) fehler.push(`${name}: unbekannte Codes ${JSON.stringify(extra)}`);
}

// --- 1. labels.ts: alle vier Maps ------------------------------------------
for (const mapName of ["TECHNIK_LABEL", "MASCHE_ICON", "TECHNIK_ERKLAERUNG", "TECHNIK_KONTER"]) {
  const block = labels.match(new RegExp(`${mapName}: Record<string, string> = \\{([\\s\\S]*?)\\n\\};`));
  if (!block) {
    fehler.push(`labels.ts: Map ${mapName} nicht gefunden.`);
    continue;
  }
  const keys = [...block[1].matchAll(/^\s*"?([\w-]+)"?:/gm)].map((m) => m[1]);
  vergleiche(`labels.ts/${mapName}`, keys);
}

// --- 2. config.yml: jeder Code muss GENAU 2× als value vorkommen ----------
// (einmal in Faktenchecks-`techniken`, einmal in Maschen-`code`).
for (const t of TECH) {
  const n = yml.split(`value: ${JSON.stringify(t)}`).length - 1;
  if (n !== 2) {
    fehler.push(`config.yml: Code "${t}" kommt ${n}× vor (erwartet: 2× – Faktenchecks + Maschen).`);
  }
}
// Umgekehrt: stehen in den beiden TECHNIK-Listen Codes, die es im Enum nicht gibt?
// Präzise an den beiden eindeutigen `hint:`-Zeilen der Technik-Felder verankert,
// damit Urteils-/Status-/Quellen-`value:`-Werte NICHT fälschlich als Technik gelten.
const TECHNIK_HINTS = [
  "Welche Maschen stecken in der Behauptung?", // Faktenchecks-Feld `techniken`
  "Muss exakt einem Technik-Code entsprechen", // Maschen-Feld `code`
];
const ymlZeilen = yml.split("\n");
for (const hint of TECHNIK_HINTS) {
  const start = ymlZeilen.findIndex((z) => z.includes(hint));
  if (start === -1) {
    fehler.push(`config.yml: Technik-Liste mit hint "${hint}" nicht gefunden.`);
    continue;
  }
  // Ab der hint-Zeile alle direkt aufeinanderfolgenden Option-Zeilen lesen.
  let gestartet = false;
  for (let i = start + 1; i < ymlZeilen.length; i++) {
    const m = ymlZeilen[i].match(/^\s*- \{.*value:\s*"([\w-]+)"/);
    if (m) {
      gestartet = true;
      if (!TECH_SET.has(m[1])) {
        fehler.push(`config.yml: unbekannter Technik-Code "${m[1]}" in Liste "${hint}".`);
      }
    } else if (gestartet) {
      break; // Ende der Optionsliste erreicht.
    }
  }
}

// --- 3. Maschen 1:1 --------------------------------------------------------
const MASCHEN_DIR = "src/content/maschen";
const maschenDateien = readdirSync(MASCHEN_DIR).filter((f) => f.endsWith(".md"));
const codeZuDatei = new Map();
const flicc = [];
for (const datei of maschenDateien) {
  const text = readFileSync(join(MASCHEN_DIR, datei), "utf8");
  const code = (text.match(/^code:\s*"?([\w-]+)"?/m) || [])[1];
  const kat = (text.match(/^kategorie:\s*"?([\w-]+)"?/m) || [])[1];
  const reih = Number((text.match(/^reihenfolge:\s*(\d+)/m) || [])[1]);
  if (!code) {
    fehler.push(`maschen/${datei}: kein code: gefunden.`);
    continue;
  }
  if (codeZuDatei.has(code)) {
    fehler.push(`maschen: Code "${code}" doppelt (${codeZuDatei.get(code)} & ${datei}).`);
  }
  codeZuDatei.set(code, datei);
  if (!TECH_SET.has(code)) fehler.push(`maschen/${datei}: code "${code}" nicht in TECHNIKEN.`);
  if (kat === "flicc") flicc.push({ code, reih, datei });

  // Konkretheit + Belegpflicht: jede Masche braucht ein belegtes Beispiel.
  const hatBeispiel = /^beispiel:\s*\|/m.test(text) || /^beispiel:\s*"?\S/m.test(text);
  const quelleBlock = text.match(/^beispiel_quelle:\s*\n([\s\S]*?)(?=\n[A-Za-z_])/m);
  const hatQuelleUrl = quelleBlock && /url:\s*"?https?:\/\//.test(quelleBlock[1]);
  if (!hatBeispiel) fehler.push(`maschen/${datei}: kein „beispiel" (jede Masche braucht ein konkretes Beispiel).`);
  if (!hatQuelleUrl) {
    fehler.push(`maschen/${datei}: „beispiel_quelle" ohne erreichbare url (Belegpflicht für das Beispiel).`);
  }
}
for (const t of TECH) {
  if (!codeZuDatei.has(t)) fehler.push(`maschen: Technik "${t}" hat keine Masche-Datei (1:1 verletzt).`);
}

// --- 4. FLICC == kanonische 5 (Cook 2020) ----------------------------------
// Fake experts · Logical fallacies · Impossible expectations · Cherry picking · Conspiracy.
const FLICC_KANONISCH = [
  "fake-experten",
  "logischer-fehlschluss",
  "unerfuellbare-erwartung",
  "cherry-picking",
  "verschwoerung",
];
const fliccCodes = flicc.map((f) => f.code).sort();
const erwartet = [...FLICC_KANONISCH].sort();
if (JSON.stringify(fliccCodes) !== JSON.stringify(erwartet)) {
  fehler.push(
    `FLICC: kategorie=flicc ist ${JSON.stringify(fliccCodes)}, ` +
      `erwartet genau die 5 Kerntechniken ${JSON.stringify(FLICC_KANONISCH)} (Cook 2020).`,
  );
}
// reihenfolge der FLICC-Maschen muss 1..5 sein (Kerntechniken zuerst).
const fliccReih = flicc.map((f) => f.reih).sort((a, b) => a - b);
if (flicc.length === 5 && JSON.stringify(fliccReih) !== JSON.stringify([1, 2, 3, 4, 5])) {
  fehler.push(`FLICC: reihenfolge der Kerntechniken ist ${JSON.stringify(fliccReih)}, erwartet [1,2,3,4,5].`);
}

// --- 5. THEMEN / URTEILE / STATUS == labels-Maps ---------------------------
// Dieselbe Multi-Stellen-Drift-Gefahr wie bei TECHNIKEN: ein Enum-Wert ohne
// Label erscheint im Frontend als nackter Slug.
function labelKeys(mapName) {
  const block = labels.match(new RegExp(`${mapName}: Record<string, string> = \\{([\\s\\S]*?)\\n\\};`));
  return block ? [...block[1].matchAll(/^\s*"?([\w-]+)"?:/gm)].map((m) => m[1]) : null;
}
function arrayWerte(name) {
  const block = labels.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\] as const`));
  return block ? [...block[1].matchAll(/"([\w-]+)"/g)].map((m) => m[1]) : null;
}
function setGleich(name, soll, ist) {
  if (!ist) {
    fehler.push(`${name}: Liste/Map in labels.ts nicht gefunden.`);
    return;
  }
  const sollSet = new Set(soll);
  const fehlend = soll.filter((x) => !ist.includes(x));
  const extra = ist.filter((x) => !sollSet.has(x));
  if (fehlend.length) fehler.push(`${name}: fehlt ${JSON.stringify(fehlend)}`);
  if (extra.length) fehler.push(`${name}: zu viel ${JSON.stringify(extra)}`);
}

const enumWerte = (name) => {
  const b = cfg.match(new RegExp(`${name} = \\[([\\s\\S]*?)\\] as const`));
  return b ? [...b[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : null;
};

const THEMEN = enumWerte("THEMEN");
const URTEILE = enumWerte("URTEILE");
// STATUS steht inline im Faktencheck-Schema (status: z.enum([...])).
const statusMatch = cfg.match(/status:\s*z\.enum\(\[([^\]]*)\]/);
const STATUS = statusMatch ? [...statusMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : null;

if (THEMEN) {
  setGleich("THEMEN ↔ THEMA_LABEL", THEMEN, labelKeys("THEMA_LABEL"));
  setGleich("THEMEN ↔ THEMA_REIHENFOLGE", THEMEN, arrayWerte("THEMA_REIHENFOLGE"));
}
if (URTEILE) setGleich("URTEILE ↔ URTEIL_LABEL", URTEILE, labelKeys("URTEIL_LABEL"));
if (STATUS) setGleich("STATUS ↔ STATUS_LABEL", STATUS, labelKeys("STATUS_LABEL"));

// --- Ergebnis --------------------------------------------------------------
if (fehler.length) {
  console.error("\n❌ Struktur-Konsistenz fehlgeschlagen:");
  fehler.forEach((f) => console.error("  - " + f));
  console.error(
    "\nHinweis: TECHNIKEN gibt es an vier Stellen – content.config.ts (Wahrheitsquelle), " +
      "src/lib/labels.ts (4 Maps), public/admin/config.yml (2×) und je eine Masche-Datei.",
  );
  process.exit(1);
}

console.log(
  `✅ Struktur-Konsistenz ok: ${TECH.length} Techniken deckungsgleich, FLICC=5, ` +
    `THEMEN/URTEILE/STATUS ↔ Labels stimmig.`,
);
