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

/** Liegt in einem einzeiligen "key: "Wert"" ein inneres gerades " (bricht YAML)? */
function hatGeradeQuotes(fm) {
  for (const zeile of fm.split("\n")) {
    const m = zeile.match(/^\s*(?:- )?[\w-]+:\s*"(.*)"\s*$/);
    if (m && m[1].includes('"')) return true;
  }
  return false;
}

/** Scannt ein Verzeichnis auf gerade Anführungszeichen (Frühwarnung). */
function quotesScan(dir) {
  let dateien;
  try {
    dateien = readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return;
  }
  for (const datei of dateien) {
    if (hatGeradeQuotes(frontmatter(readFileSync(join(dir, datei), "utf8")))) {
      warnungen.push(
        `${dir}/${datei}: Gerades Anführungszeichen (") in einem Frontmatter-Wert. ` +
          `Wird beim Build automatisch korrigiert. Sonst: „ … “ verwenden.`,
      );
    }
  }
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

  // Die drei Tiefen sind jetzt eigene Frontmatter-Felder (key: |).
  for (const stufe of ["einstieg", "vertiefung", "wissenschaftlich"]) {
    const feld = fm.match(new RegExp(`^${stufe}:\\s*(\\|[-+0-9]*\\s*$|.+)`, "m"));
    const hatInhalt = feld && (feld[1].startsWith("|") ? true : feld[1].trim().length > 2);
    if (!hatInhalt) {
      fehler.push(
        `${datei}: Die Tiefe „${stufe}“ fehlt oder ist leer. ` +
          `Jeder Faktencheck braucht die drei Felder einstieg, vertiefung, wissenschaftlich.`,
      );
    }
  }
  if (!/^pruefen:\s*\|/m.test(fm)) {
    warnungen.push(
      `${datei}: Kein „So prüfst du das selbst“-Block (Feld „pruefen“). ` +
        `Empfohlen: konkrete Schritte, wie Leser:innen die Behauptung selbst nachprüfen.`,
    );
  }

  // Frühwarnung: gerade Anführungszeichen im Frontmatter, die den Build kippen.
  if (hatGeradeQuotes(fm)) {
    warnungen.push(
      `${datei}: Gerades Anführungszeichen (") in einem Frontmatter-Wert gefunden. ` +
        `Das wird automatisch korrigiert (npm run build). Sonst: „ … “ verwenden.`,
    );
  }

  // „zusammensetzung“-Grafiken (gestapelter Balken) müssen ~100 summieren –
  // sonst rendert Datenviz.astro Lücken/Überlauf und die Skalierung lügt.
  const datenIdx = fm.split("\n").findIndex((l) => /^daten:/.test(l));
  if (datenIdx !== -1) {
    const zeilen = fm.split("\n");
    let typ = null;
    let summe = 0;
    let hatWerte = false;
    const pruefe = () => {
      if (typ === "zusammensetzung" && hatWerte && Math.abs(summe - 100) > 1) {
        fehler.push(
          `${datei}: „zusammensetzung“-Grafik summiert auf ${summe} statt ~100 ` +
            `(gestapelter Balken – die Anteile müssen 100 % ergeben).`,
        );
      }
    };
    for (let i = datenIdx + 1; i < zeilen.length; i++) {
      if (/^[A-Za-z_]/.test(zeilen[i])) break; // nächstes Top-Level-Feld → daten-Block zu Ende
      const tm = zeilen[i].match(/^\s*-\s*typ:\s*"?([\w-]+)"?/);
      if (tm) {
        pruefe();
        typ = tm[1];
        summe = 0;
        hatWerte = false;
        continue;
      }
      const wm = zeilen[i].match(/^\s*-?\s*wert:\s*(-?\d+(?:\.\d+)?)/);
      if (wm && typ === "zusammensetzung") {
        summe += parseFloat(wm[1]);
        hatWerte = true;
      }
    }
    pruefe();
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

// Auch Maschen & Methodik auf gerade Anführungszeichen prüfen (gleiche YAML-Falle).
quotesScan("src/content/maschen");
quotesScan("src/content/methodik");

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
