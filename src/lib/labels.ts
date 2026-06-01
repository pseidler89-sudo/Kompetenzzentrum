/** Anzeige-Texte für die im Schema definierten Codes. */

export const THEMA_LABEL: Record<string, string> = {
  migration: "Migration & Asyl",
  "klima-energie": "Klima & Energie",
  "wirtschaft-soziales": "Wirtschaft & Soziales",
  gesundheit: "Gesundheit",
  "demokratie-medien": "Demokratie & Medien",
  "kriminalitaet-sicherheit": "Kriminalität & Sicherheit",
};

/** Reihenfolge der Themen in Filtern/Listen. */
export const THEMA_REIHENFOLGE = [
  "migration",
  "kriminalitaet-sicherheit",
  "klima-energie",
  "wirtschaft-soziales",
  "gesundheit",
  "demokratie-medien",
] as const;

export const URTEIL_LABEL: Record<string, string> = {
  falsch: "Falsch",
  "groesstenteils-falsch": "Größtenteils falsch",
  irrefuehrend: "Irreführend",
  "fehlender-kontext": "Fehlender Kontext",
  "teils-richtig": "Teils richtig, teils falsch",
};

export const TECHNIK_LABEL: Record<string, string> = {
  "fake-experten": "Schein-Expert:innen",
  "logischer-fehlschluss": "Logischer Fehlschluss",
  "unerfuellbare-erwartung": "Unerfüllbare Erwartung",
  "cherry-picking": "Rosinenpickerei (Cherry Picking)",
  verschwoerung: "Verschwörungserzählung",
  "falsche-kausalitaet": "Falsche Ursache-Wirkung",
  "fehlender-bezugswert": "Fehlender Bezugswert",
  emotionalisierung: "Emotionalisierung",
  "falsche-gleichsetzung": "Falsche Gleichsetzung",
  "aus-dem-kontext-gerissen": "Aus dem Kontext gerissen",
};

/** Kurzerklärung jeder Technik – für den Werkzeugkasten. */
export const TECHNIK_ERKLAERUNG: Record<string, string> = {
  "fake-experten": "Eine Einzelmeinung ohne Fachbezug wird als gleichwertig zum wissenschaftlichen Konsens dargestellt.",
  "logischer-fehlschluss": "Die Schlussfolgerung folgt nicht logisch aus den Argumenten (z.B. Strohmann, falsches Dilemma).",
  "unerfuellbare-erwartung": "Es wird ein unmöglicher Beweisstandard verlangt, den keine Forschung erfüllen kann.",
  "cherry-picking": "Es werden nur die Daten gezeigt, die zur Aussage passen – widersprechende werden weggelassen.",
  verschwoerung: "Widersprüche werden mit einem angeblichen geheimen Plan mächtiger Akteure erklärt.",
  "falsche-kausalitaet": "Aus einem zeitlichen Zusammenhang wird fälschlich eine Ursache abgeleitet.",
  "fehlender-bezugswert": "Eine absolute Zahl wird ohne Bezugsgröße genannt und wirkt dadurch dramatischer.",
  emotionalisierung: "Angst, Wut oder Empörung sollen die sachliche Prüfung ersetzen.",
  "falsche-gleichsetzung": "Zwei nicht vergleichbare Dinge werden gleichgesetzt.",
  "aus-dem-kontext-gerissen": "Ein Zitat oder Bild wird ohne seinen ursprünglichen Zusammenhang verwendet.",
};

/**
 * Pro Technik ein konkreter „So durchschaust du es“-Konter.
 * Leitgedanke: niemanden bloßstellen, sondern befähigen – die Botschaft ist
 * „so wirst du manipuliert, und SO erkennst du es“, nicht „wer das glaubt, ist dumm“.
 */
export const TECHNIK_KONTER: Record<string, string> = {
  "fake-experten": "Frag: Forscht diese Person wirklich zum Thema? Was sagt die Mehrheit der Fachleute – nicht eine einzelne laute Stimme?",
  "logischer-fehlschluss": "Prüfe, ob die Schlussfolgerung wirklich aus den Argumenten folgt – oder ob ein Gedankensprung übersprungen wird.",
  "unerfuellbare-erwartung": "Frag dich: Könnte IRGENDEINE Studie diesen Beweisstandard je erfüllen? Wenn nicht, ist die Latte unfair hoch gelegt.",
  "cherry-picking": "Schau dir die ganze Datenreihe an, nicht den herausgepickten Ausschnitt. Was wurde weggelassen?",
  verschwoerung: "Frag nach konkreten Belegen für den „Plan“: Wer genau, welches Dokument? Vage bleiben ist das Erkennungszeichen.",
  "falsche-kausalitaet": "Nur weil zwei Dinge zusammen auftreten, verursacht das eine nicht das andere. Gibt es eine dritte Ursache?",
  "fehlender-bezugswert": "Frag: im Verhältnis wozu? Pro Kopf, im Zeitverlauf, im Vergleich – eine Zahl ohne Bezug sagt wenig.",
  emotionalisierung: "Spür kurz in dich hinein: Soll hier informiert oder vor allem Wut/Angst erzeugt werden? Dann erst weiterlesen.",
  "falsche-gleichsetzung": "Frag: Sind die beiden Dinge wirklich vergleichbar? Oft hinkt der Vergleich an einer entscheidenden Stelle.",
  "aus-dem-kontext-gerissen": "Such das Originalzitat oder -bild. Oft sagt der volle Zusammenhang etwas ganz anderes.",
};

export const STATUS_LABEL: Record<string, string> = {
  entwurf: "Entwurf",
  "in-pruefung": "In Prüfung",
  geprueft: "Geprüft",
};

/** Baut einen Pfad relativ zur konfigurierten base. */
export function pfad(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

export function datumFormat(d?: Date): string {
  if (!d) return "";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}
