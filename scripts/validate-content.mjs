#!/usr/bin/env node
/**
 * Inhaltliche Qualitätssicherung – läuft vor jedem Build und in der CI.
 *
 * Prüft über die Schema-Validierung von Astro hinaus, dass jeder Faktencheck
 * den redaktionellen Mindeststandard erfüllt:
 *   - alle drei Tiefen (einstieg, vertiefung, wissenschaftlich) vorhanden
 *   - ein "So prüfst du das selbst"-Block (:::pruefen)
 *   - verwandte Faktenchecks (verwandt:) verweisen auf existierende Dateien
 *
 * Bewusst ohne Abhängigkeiten gehalten (einfacher Frontmatter-Parser).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const FC_DIR = "src/content/faktenchecks";
const fehler = [];
const warnungen = [];

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : "";
}

const dateien = readdirSync(FC_DIR).filter((f) => f.endsWith(".md"));
const slugs = new Set(dateien.map((f) => f.replace(/\.md$/, "")));

if (dateien.length === 0) {
  warnungen.push("Keine Faktenchecks gefunden.");
}

for (const datei of dateien) {
  const pfad = join(FC_DIR, datei);
  const text = readFileSync(pfad, "utf8");
  const fm = frontmatter(pfad ? text : "");
  const body = text.slice(text.indexOf("---", 3) + 3);

  for (const stufe of ["einstieg", "vertiefung", "wissenschaftlich"]) {
    if (!body.includes(`:::stufe{name="${stufe}"}`)) {
      fehler.push(`${datei}: Stufe "${stufe}" fehlt.`);
    }
  }
  if (!body.includes(":::pruefen")) {
    warnungen.push(`${datei}: Kein :::pruefen-Block ("So prüfst du das selbst").`);
  }

  // verwandt: prüfen
  const verwandtBlock = fm.match(/verwandt:\s*\[([^\]]*)\]/);
  if (verwandtBlock) {
    const refs = verwandtBlock[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
    for (const ref of refs) {
      if (!slugs.has(ref)) {
        fehler.push(`${datei}: verwandt verweist auf unbekannten Slug "${ref}".`);
      }
    }
  }
}

if (warnungen.length) {
  console.warn("\n⚠️  Warnungen:");
  warnungen.forEach((w) => console.warn("  - " + w));
}

if (fehler.length) {
  console.error("\n❌ Inhaltsprüfung fehlgeschlagen:");
  fehler.forEach((f) => console.error("  - " + f));
  process.exit(1);
}

console.log(`\n✅ Inhaltsprüfung bestanden: ${dateien.length} Faktencheck(s) ok.`);
