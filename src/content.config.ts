import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Themenfelder – für Filterung im Katalog. Bei Bedarf erweitern,
 * aber bewusst knapp halten, damit der Katalog übersichtlich bleibt.
 */
export const THEMEN = [
  "migration",
  "klima-energie",
  "umwelt-landwirtschaft",
  "wirtschaft-soziales",
  "gesundheit",
  "demokratie-medien",
  "kriminalitaet-sicherheit",
] as const;

/** Bewertung der Behauptung. */
export const URTEILE = [
  "falsch",
  "groesstenteils-falsch",
  "irrefuehrend",
  "fehlender-kontext",
  "teils-richtig",
] as const;

/**
 * Manipulationstechniken nach dem FLICC-Modell (Cook 2020) plus gängige
 * rhetorische Muster. Hilft Leser:innen, Muster wiederzuerkennen.
 */
export const TECHNIKEN = [
  "fake-experten",
  "logischer-fehlschluss",
  "unerfuellbare-erwartung",
  "cherry-picking",
  "verschwoerung",
  "falsche-kausalitaet",
  "fehlender-bezugswert",
  "emotionalisierung",
  "falsche-gleichsetzung",
  "aus-dem-kontext-gerissen",
  "whataboutism",
  "falsche-verknuepfung",
  "astroturfing",
  "identitaetsschwindel",
  "falsche-ausgewogenheit",
  "gish-galopp",
  "bandwagon",
  "suendenbock",
  "firehose",
] as const;

const quelle = z.object({
  titel: z.string(),
  herausgeber: z.string(),
  url: z.string().url().optional(),
  datum: z.string().optional(),
  // Primärquelle (z.B. Statistisches Bundesamt) oder Sekundärquelle?
  art: z.enum(["primaer", "sekundaer"]).default("sekundaer"),
});

// P1 · Datenvisualisierung – optionale, belegte Grafiken pro Faktencheck.
// Reines Astro+CSS (Datenviz.astro), keine neue Abhängigkeit.
const datenWert = z.object({
  label: z.string().default(""),
  sublabel: z.string().default(""),
  wert: z.number(),
  einheit: z.string().default("%"),
  farbe: z
    .enum(["accent", "neutral", "falsch", "irrefuehrend", "kontext", "teils", "pruefen"])
    .default("neutral"),
});

const datenChart = z.object({
  // vergleich = Balken nebeneinander · anteil = Anteil am Ganzen
  // zusammensetzung = gestapelter Balken (Summe 100) · kennzahl = große Zahl(en)
  typ: z.enum(["vergleich", "anteil", "zusammensetzung", "kennzahl"]),
  titel: z.string().default(""),
  hinweis: z.string().default(""),
  quelle: z.string().default(""),
  primaer: z.boolean().default(false),
  // Achsen-Maximum. Leer lassen: bei % automatisch 100, sonst größter Wert.
  skala: z.number().optional(),
  werte: z.array(datenWert).default([]),
});

const faktenchecks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faktenchecks" }),
  schema: z.object({
    titel: z.string(),
    // Die geprüfte Falschbehauptung im Wortlaut/sinngemäß.
    behauptung: z.string(),
    // Ein-Satz-Urteil, sofort sichtbar (Truth-Sandwich: Fakt zuerst).
    kurzantwort: z.string(),
    urteil: z.enum(URTEILE),
    themen: z.array(z.enum(THEMEN)).min(1),
    techniken: z.array(z.enum(TECHNIKEN)).default([]),
    // Kurze Meta-Beschreibung für Suchmaschinen & Vorschau.
    zusammenfassung: z.string().max(300),
    // Qualitätsstufe der Redaktion.
    status: z.enum(["entwurf", "in-pruefung", "geprueft"]).default("entwurf"),
    veroeffentlicht: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    mitwirkende: z.array(z.string()).default([]),
    // Mindestens eine Quelle ist Pflicht – das ist Kern des Projekts.
    quellen: z.array(quelle).min(1),
    // Verwandte Faktenchecks (Slugs) für Querverweise.
    verwandt: z.array(z.string()).default([]),

    // Inhalt als eigene Felder (statt :::-Direktiven im Body).
    // So muss niemand Markdown-Direktiven-Syntax kennen – weder im CMS
    // noch beim direkten Bearbeiten. Markdown im Feld bleibt erlaubt.
    einleitung: z.string().default(""),
    einstieg: z.string(),
    vertiefung: z.string(),
    wissenschaftlich: z.string(),
    // Erkannte Manipulationstechnik (Freitext-Titel + Erklärung).
    technik_titel: z.string().default(""),
    technik_text: z.string().default(""),
    // „So prüfst du das selbst“-Block.
    pruefen: z.string().default(""),
    // Optionale, belegte Datengrafiken (P1). Bestehende Checks bleiben gültig.
    daten: z.array(datenChart).default([]),
  }),
});

const methodik = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/methodik" }),
  schema: z.object({
    titel: z.string(),
    zusammenfassung: z.string(),
    reihenfolge: z.number().default(99),
    aktualisiert: z.coerce.date().optional(),
  }),
});

// Manipulationstechniken („Maschen“) – die technik-basierte Lernspur.
// Jede Masche erklärt das Muster, zeigt ein aktuelles, belegtes Beispiel
// und gibt konkrete Schritte zum Durchschauen.
const maschen = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/maschen" }),
  schema: z.object({
    titel: z.string(),
    // Muss einem Code aus TECHNIKEN entsprechen (Verknüpfung zu Faktenchecks).
    code: z.enum(TECHNIKEN),
    // FLICC-Kerntechnik oder allgemeines rhetorisches Muster.
    kategorie: z.enum(["flicc", "rhetorik"]).default("rhetorik"),
    kurz: z.string(),
    reihenfolge: z.number().default(99),
    so_funktionierts: z.string(),
    beispiel: z.string().default(""),
    beispiel_quelle: quelle.optional(),
    durchschauen: z.string(),
  }),
});

// O-Ton: geprüfte Aussagen öffentlicher Personen im Wortlaut (eigene Unterseite,
// bewusst vom Faktencheck-Schema entkoppelt). Pfad A: die Aussage wird geprüft,
// die Person ist belegte Quelle – kein Pranger. Jedes Zitat MUSS am Video
// gegengehört sein (Wortlaut + Kontext), bevor der Status auf „geprueft“ geht.
const oton = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/oton" }),
  schema: z.object({
    // Optionaler kurzer Titel/Rahmen; sonst wird aus Sprecher + Zitat gebildet.
    titel: z.string().default(""),
    sprecher: z.string(),
    funktion: z.string().default(""),
    // Wörtliches Zitat.
    zitat: z.string(),
    // Optionaler Wortlaut-Auszug im Kontext (Sätze davor/danach), damit das Zitat
    // nicht „aus dem Kontext“ wirkt. Markdown, wird klappbar gezeigt.
    transkript: z.string().default(""),
    // Video-URL möglichst mit Zeitstempel (…&t=1234s) für den Direktsprung.
    quelle_url: z.string().url(),
    // Optionaler Archiv-/Wayback-Snapshot der Videoseite – Fallback, falls das
    // Original-Video stirbt (ersetzt das bewusst weggelassene lokale Video-Backup).
    archiv_url: z.string().url().optional(),
    plattform: z.string().default(""),
    // Datum der Aussage (Freitext, z.B. „10.06.2026“).
    datum: z.string().default(""),
    urteil: z.enum(URTEILE),
    kurzantwort: z.string(),
    // Einordnung/Richtigstellung (Markdown).
    einordnung: z.string().default(""),
    techniken: z.array(z.enum(TECHNIKEN)).default([]),
    quellen: z.array(quelle).min(1),
    status: z.enum(["entwurf", "in-pruefung", "geprueft"]).default("entwurf"),
    veroeffentlicht: z.coerce.date(),
    aktualisiert: z.coerce.date().optional(),
    // Optionaler Querverweis auf einen verwandten Faktencheck (Slug).
    verwandt: z.array(z.string()).default([]),
  }),
});

export const collections = { faktenchecks, methodik, maschen, oton };
