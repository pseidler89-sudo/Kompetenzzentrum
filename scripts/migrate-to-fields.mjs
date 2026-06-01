#!/usr/bin/env node
/**
 * Einmal-Migration: wandelt die :::stufe / :::technik / :::pruefen-Direktiven
 * im Markdown-Body in echte Frontmatter-Felder um.
 *
 * Vorher (Body):                          Nachher (Frontmatter):
 *   <Einleitungstext>                       einleitung: |
 *   :::stufe{name="einstieg"} … :::         einstieg: |
 *   :::stufe{name="vertiefung"} … :::       vertiefung: |
 *   :::stufe{name="wissenschaftlich"} …     wissenschaftlich: |
 *   :::technik{name="X"} … :::              technik_titel: "X"  /  technik_text: |
 *   :::pruefen … :::                        pruefen: |
 *
 * Der Body wird danach geleert. So muss niemand je :::-Syntax tippen –
 * weder im CMS noch beim direkten Bearbeiten.
 *
 * Aufruf:  node scripts/migrate-to-fields.mjs          (Trockenlauf)
 *          node scripts/migrate-to-fields.mjs --write  (schreibt Dateien)
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/content/faktenchecks";
const WRITE = process.argv.includes("--write");

/** YAML-Block-Scalar: key: |  + 2-fach eingerückter Inhalt. */
function blockScalar(key, text) {
  const lines = (text ?? "").replace(/\s+$/, "").split("\n");
  const body = lines.map((l) => (l.length ? "  " + l : "")).join("\n");
  return `${key}: |\n${body}`;
}

/** YAML-Doppelstring mit typografischen Anführungszeichen im Inneren. */
function quoted(key, text) {
  let auf = true;
  const safe = (text ?? "").replace(/"/g, () => (auf = !auf) ? "“" : "„");
  return `${key}: "${safe}"`;
}

/** Zerlegt den Body in Einleitung + benannte Blöcke (State-Machine). */
function parseBody(body) {
  const res = { einleitung: [], einstieg: [], vertiefung: [], wissenschaftlich: [], technik_titel: "", technik_text: [], pruefen: [] };
  let ziel = "einleitung";
  for (const zeile of body.split("\n")) {
    const stufe = zeile.match(/^:::stufe\{name="(einstieg|vertiefung|wissenschaftlich)"\}\s*$/);
    const technik = zeile.match(/^:::technik\{name="(.*)"\}\s*$/);
    if (stufe) { ziel = stufe[1]; continue; }
    if (technik) { res.technik_titel = technik[1]; ziel = "technik_text"; continue; }
    if (/^:::pruefen\s*$/.test(zeile)) { ziel = "pruefen"; continue; }
    if (/^:::\s*$/.test(zeile)) { ziel = "_aus"; continue; }
    if (ziel === "_aus") { if (zeile.trim() === "") continue; ziel = "einleitung"; }
    res[ziel].push(zeile);
  }
  const j = (a) => a.join("\n").trim();
  return {
    einleitung: j(res.einleitung), einstieg: j(res.einstieg), vertiefung: j(res.vertiefung),
    wissenschaftlich: j(res.wissenschaftlich), technik_titel: res.technik_titel.trim(), technik_text: j(res.technik_text), pruefen: j(res.pruefen),
  };
}

const dateien = readdirSync(DIR).filter((f) => f.endsWith(".md"));
let ok = 0;
for (const datei of dateien) {
  const pfad = join(DIR, datei);
  const text = readFileSync(pfad, "utf8");
  const m = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!m) { console.log(`⏭  ${datei}: kein Frontmatter`); continue; }
  const [, , fm, , body] = m;
  if (/^\w+: \|/m.test(fm) && /einstieg: \|/.test(fm)) { console.log(`⏭  ${datei}: schon migriert`); continue; }

  const p = parseBody(body);
  const fehlt = ["einstieg", "vertiefung", "wissenschaftlich"].filter((k) => !p[k]);
  if (fehlt.length) { console.log(`⚠  ${datei}: Stufen fehlen: ${fehlt.join(", ")}`); }

  const neueFelder = [
    blockScalar("einleitung", p.einleitung),
    blockScalar("einstieg", p.einstieg),
    blockScalar("vertiefung", p.vertiefung),
    blockScalar("wissenschaftlich", p.wissenschaftlich),
    quoted("technik_titel", p.technik_titel),
    blockScalar("technik_text", p.technik_text),
    blockScalar("pruefen", p.pruefen),
  ].join("\n");

  const neu = `---\n${fm.trim()}\n${neueFelder}\n---\n`;
  if (WRITE) { writeFileSync(pfad, neu); console.log(`✅ ${datei}: migriert`); }
  else {
    console.log(`\n===== ${datei} (Vorschau Felder) =====`);
    console.log(`einleitung: ${p.einleitung.length} Z. | einstieg: ${p.einstieg.length} | vertiefung: ${p.vertiefung.length} | wiss.: ${p.wissenschaftlich.length}`);
    console.log(`technik_titel: "${p.technik_titel}" | technik_text: ${p.technik_text.length} | pruefen: ${p.pruefen.length}`);
  }
  ok++;
}
console.log(`\n${WRITE ? "Migriert" : "Vorschau für"}: ${ok}/${dateien.length} Datei(en).${WRITE ? "" : "  (--write zum Schreiben)"}`);
