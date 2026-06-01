#!/usr/bin/env node
/**
 * Quellen-Link-Prüfung für die CI.
 *
 * WICHTIG: Dieses Skript gehört NICHT in `npm run build`, weil die
 * Build-Umgebung (z. B. Claude Code on the web) oft hinter einer
 * Netzwerk-Allowlist läuft und externe Seiten blockt. Es läuft nur in
 * GitHub Actions (offenes Internet) über `npm run check:links`.
 *
 * Was es prüft: Erreichbarkeit jeder Quellen-URL im Content.
 * Was es NICHT prüfen kann: ob die Seite die Behauptung inhaltlich stützt
 * – das bleibt redaktionelle (menschliche) Aufgabe, siehe
 * docs/redaktionsstandards.md.
 *
 * Klassifikation:
 *   OK     – 2xx/3xx erreichbar
 *   TOT    – 404/410 oder Domain/DNS-Fehler  → CI scheitert (erfundene/tote Links)
 *   BLOCK  – 403/429 (Bot-Schutz, z. B. Cloudflare) → nur Warnung, nicht eindeutig
 *   UNklar – 5xx/Timeout → nur Warnung
 *
 * Ohne externe Abhängigkeiten (Node 20+, globales fetch).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIRS = [
  "src/content/faktenchecks",
  "src/content/maschen",
  "src/content/methodik",
];

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const TIMEOUT_MS = 20000;

/** Alle http(s)-URLs aus einer Datei ziehen (Frontmatter + Body). */
function urlsAus(text) {
  const urls = new Set();
  // url: "https://…"  und  url: https://…
  for (const m of text.matchAll(/url:\s*["']?(https?:\/\/[^\s"']+)["']?/g)) urls.add(m[1]);
  // Markdown-Links [..](https://…)
  for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(m[1]);
  return [...urls];
}

function alleDateien() {
  const treffer = [];
  for (const dir of DIRS) {
    let dateien = [];
    try {
      dateien = readdirSync(dir).filter((f) => f.endsWith(".md"));
    } catch {
      continue; // Verzeichnis evtl. nicht vorhanden
    }
    for (const datei of dateien) {
      const pfad = join(dir, datei);
      for (const url of urlsAus(readFileSync(pfad, "utf8"))) {
        treffer.push({ url, pfad });
      }
    }
  }
  return treffer;
}

async function pruefe(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // GET (nicht HEAD): manche Server beantworten HEAD falsch.
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    });
    const s = res.status;
    if (s >= 200 && s < 400) return { kat: "OK", s };
    if (s === 404 || s === 410) return { kat: "TOT", s };
    if (s === 403 || s === 429) return { kat: "BLOCK", s };
    return { kat: "UNKLAR", s };
  } catch (e) {
    const msg = String(e?.cause?.code || e?.name || e);
    // DNS/Domain existiert nicht → eindeutig tot.
    if (/ENOTFOUND|EAI_AGAIN|ERR_NAME/.test(msg)) return { kat: "TOT", s: msg };
    return { kat: "UNKLAR", s: msg };
  } finally {
    clearTimeout(t);
  }
}

const eintraege = alleDateien();
const einzigartig = [...new Map(eintraege.map((e) => [e.url, e])).values()];
console.log(`Prüfe ${einzigartig.length} Quellen-URLs aus ${DIRS.length} Verzeichnissen …\n`);

const tot = [];
const warnung = [];

// Sequenziell mit kleiner Pause – freundlich zu den Servern.
for (const { url, pfad } of einzigartig) {
  const r = await pruefe(url);
  const zeile = `[${r.kat}] ${r.s}  ${url}  (${pfad})`;
  if (r.kat === "OK") {
    console.log("✓ " + zeile);
  } else if (r.kat === "TOT") {
    console.log("✗ " + zeile);
    tot.push(zeile);
  } else {
    console.log("⚠ " + zeile);
    warnung.push(zeile);
  }
  await new Promise((res) => setTimeout(res, 300));
}

console.log("\n──────── Zusammenfassung ────────");
console.log(`OK: ${einzigartig.length - tot.length - warnung.length}  ·  Warnungen: ${warnung.length}  ·  Tot: ${tot.length}`);

if (warnung.length) {
  console.log("\n⚠ Warnungen (Bot-Schutz/temporär – bitte manuell im Browser prüfen):");
  warnung.forEach((w) => console.log("   " + w));
}

if (tot.length) {
  console.error("\n✗ TOTE/ERFUNDENE LINKS – diese müssen korrigiert werden:");
  tot.forEach((w) => console.error("   " + w));
  process.exit(1);
}

console.log("\nKeine toten Links gefunden.");
