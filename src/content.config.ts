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

export const collections = { faktenchecks, methodik };
