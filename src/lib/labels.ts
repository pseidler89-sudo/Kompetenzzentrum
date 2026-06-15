/** Anzeige-Texte für die im Schema definierten Codes. */

export const THEMA_LABEL: Record<string, string> = {
  migration: "Migration & Asyl",
  "klima-energie": "Klima & Energie",
  "umwelt-landwirtschaft": "Umwelt & Landwirtschaft",
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
  "umwelt-landwirtschaft",
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

/** Ein Klartext-Halbsatz je Urteil – für Laien sofort verständlich. */
export const URTEIL_KLARTEXT: Record<string, string> = {
  falsch: "Die Behauptung stimmt nicht.",
  "groesstenteils-falsch": "Der Kern der Behauptung stimmt nicht.",
  irrefuehrend: "Einzelne Fakten stimmen, das Gesamtbild täuscht.",
  "fehlender-kontext": "Ohne den Zusammenhang entsteht ein falscher Eindruck.",
  "teils-richtig": "Ein Teil stimmt, ein Teil nicht.",
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
  whataboutism: "Whataboutism",
  "falsche-verknuepfung": "Falsche Verknüpfung",
  astroturfing: "Astroturfing",
  identitaetsschwindel: "Identitätsschwindel",
  "falsche-ausgewogenheit": "Falsche Ausgewogenheit",
  "gish-galopp": "Gish-Galopp",
  bandwagon: "Mehrheits-Argument (Bandwagon)",
  suendenbock: "Sündenbock",
  firehose: "Lügen-Flut (Firehose)",
};

/**
 * Ein dezentes Line-Icon (Lucide) je Masche – schnelleres Wiedererkennen im
 * Raster, kein dekoratives Beiwerk. Gerendert via astro-icon (Build-Time, kein
 * Runtime-JS). Bedeutung steht im Titel; Icons sind aria-hidden.
 */
export const MASCHE_ICON: Record<string, string> = {
  "fake-experten": "lucide:user-round-x",
  "logischer-fehlschluss": "lucide:shuffle",
  "unerfuellbare-erwartung": "lucide:infinity",
  "cherry-picking": "lucide:filter",
  verschwoerung: "lucide:eye",
  "falsche-kausalitaet": "lucide:git-compare-arrows",
  "fehlender-bezugswert": "lucide:ruler",
  emotionalisierung: "lucide:flame",
  "falsche-gleichsetzung": "lucide:equal",
  "aus-dem-kontext-gerissen": "lucide:scissors",
  whataboutism: "lucide:corner-up-right",
  "falsche-verknuepfung": "lucide:link",
  astroturfing: "lucide:sprout",
  identitaetsschwindel: "lucide:venetian-mask",
  "falsche-ausgewogenheit": "lucide:scale",
  "gish-galopp": "lucide:gauge",
  bandwagon: "lucide:users-round",
  suendenbock: "lucide:target",
  firehose: "lucide:droplets",
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
  whataboutism: "Statt auf die Kritik einzugehen, wird mit „Und was ist mit …?“ aufs Thema abgelenkt.",
  "falsche-verknuepfung": "Überschrift oder Bild passen gar nicht zum eigentlichen Inhalt – gemacht für den schnellen Klick.",
  astroturfing: "Eine bezahlte oder gesteuerte Kampagne tarnt sich als spontane Bürgerbewegung.",
  identitaetsschwindel: "Eine Falschmeldung tarnt sich im Look einer seriösen Quelle (gefälschte Medienseite, Behörde).",
  "falsche-ausgewogenheit": "Eine Randmeinung wird gleichwertig neben den Forschungsstand gestellt – als gäbe es offenen Streit.",
  "gish-galopp": "Eine Flut vieler kleiner Behauptungen macht eine geordnete Widerlegung im Zeitrahmen unmöglich.",
  bandwagon: "„Das sehen doch alle so“ wird als Beweis ausgegeben – eine Mehrheit macht eine Aussage aber nicht wahr.",
  suendenbock: "Ein komplexes Problem wird pauschal einer einzelnen, leicht erkennbaren Gruppe angelastet.",
  firehose: "Viele schnelle, oft widersprüchliche Falschmeldungen über viele Kanäle – Ziel ist Verwirrung, nicht Überzeugung.",
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
  whataboutism: "Hol das Gespräch zurück: „Das können wir gern auch besprechen – aber beantwortet das die ursprüngliche Frage?“",
  "falsche-verknuepfung": "Erst lesen, dann teilen. Deckt der Text die Überschrift wirklich? Per Bildrückwärtssuche prüfen, ob das Bild echt dazugehört.",
  astroturfing: "Frag: Wer steckt dahinter und wer zahlt? Tauchen identische Texte unter vielen frischen Accounts auf, ist es selten spontan.",
  identitaetsschwindel: "Prüfe die URL Zeichen für Zeichen und das Impressum. Ruf die Meldung über die echte Startseite des Mediums auf.",
  "falsche-ausgewogenheit": "Frag nach dem Verhältnis: Wie viele Fachleute stehen wirklich hinter jeder Seite? Gleiche Redezeit heißt nicht gleiche Evidenz.",
  "gish-galopp": "Nimm das Tempo raus und greif einen Punkt heraus. Zehn schwache Behauptungen ergeben kein starkes Argument.",
  bandwagon: "Frag nach Zahlen: „alle“ oder „die Mehrheit“ – wie viele genau, und woher? Eine schweigende Mehrheit kann niemand nachzählen.",
  suendenbock: "Frag: Hat das Problem wirklich nur eine Ursache? Und gibt es Zahlen, die der genannten Gruppe den Anteil zuordnen – oder ist die Schuld nur behauptet?",
  firehose: "Lass dich vom Tempo nicht in Resignation treiben. Prüfe einzelne, belegbare Fakten in Ruhe – „man kann eh nichts glauben“ ist genau das Ziel.",
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
