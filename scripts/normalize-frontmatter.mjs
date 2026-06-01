#!/usr/bin/env node
/**
 * Frontmatter-Selbstheilung.
 *
 * Häufigster Stolperstein für nicht-technische Autor:innen: ein gerades
 * Anführungszeichen ("…") MITTEN in einem bereits mit "…" umschlossenen
 * YAML-Wert beendet den String vorzeitig → der Build bricht mit einer
 * kryptischen YAML-Meldung ab.
 *
 * Dieses Skript repariert das automatisch: Innenliegende gerade
 * Anführungszeichen werden in deutsche typografische Anführungszeichen
 * umgewandelt (abwechselnd „ öffnend und " schließend). Läuft vor jedem Build.
 *
 * Bewusst ohne Abhängigkeiten – damit es überall sofort funktioniert.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ORDNER = ["src/content/faktenchecks", "src/content/methodik"];

let dateienGeaendert = 0;
let werteRepariert = 0;

/** Wandelt gerade Anführungszeichen in einem Text abwechselnd in „ und " um. */
function typografisch(text) {
  let auf = true;
  return text.replace(/"/g, () => {
    const z = auf ? "„" : "“"; // „ … "
    auf = !auf;
    return z;
  });
}

/**
 * Repariert eine einzelne Frontmatter-Zeile vom Typ  key: "Wert mit "Zitat" drin".
 * Erkennt das äußere Klammer-Paar und behandelt nur den Inhalt dazwischen.
 */
function repariereZeile(zeile) {
  const m = zeile.match(/^(\s*(?:- )?[\w-]+:\s*)"(.*)"(\s*)$/);
  if (!m) return zeile;
  const [, praefix, inhalt, suffix] = m;
  if (!inhalt.includes('"')) return zeile; // alles gut
  werteRepariert++;
  return `${praefix}"${typografisch(inhalt)}"${suffix}`;
}

function verarbeite(pfad) {
  const text = readFileSync(pfad, "utf8");
  const m = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!m) return; // kein Frontmatter
  const [, kopf, fm, trenner, koerper] = m;
  const neuFm = fm.split("\n").map(repariereZeile).join("\n");
  if (neuFm === fm) return;
  writeFileSync(pfad, kopf + neuFm + trenner + koerper);
  dateienGeaendert++;
  console.log(`  korrigiert: ${pfad}`);
}

for (const ordner of ORDNER) {
  let dateien;
  try {
    dateien = readdirSync(ordner).filter((f) => f.endsWith(".md"));
  } catch {
    continue; // Ordner existiert (noch) nicht
  }
  for (const datei of dateien) verarbeite(join(ordner, datei));
}

if (dateienGeaendert > 0) {
  console.log(
    `\n🔧 Frontmatter automatisch repariert: ${werteRepariert} Wert(e) in ${dateienGeaendert} Datei(en).`,
  );
  console.log("   (Gerade Anfuehrungszeichen wurden in typografische umgewandelt.)\n");
} else {
  console.log("✅ Frontmatter sauber – nichts zu reparieren.");
}
