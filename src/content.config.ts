import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Themenfelder – für Filterung im Katalog. Bei Bedarf erweitern,
 * aber bewusst knapp halten, damit der Katalog übersichtlich bleibt.
 */
export const THEMEN = [
  "migration",
  "klima-energie",
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
] as const;

const quelle = z.object({
  titel: z.string(),
  herausgeber: z.string(),
  url: z.string().url().optional(),
  datum: z.string().optional(),
  // Primärquelle (z.B. Statistisches Bundesamt) oder Sekundärquelle?
  art: z.enum(["primaer", "sekundaer"]).default("sekundaer"),
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

export const collections = { faktenchecks, methodik, maschen };
