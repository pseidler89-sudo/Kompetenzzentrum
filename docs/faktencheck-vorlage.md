# Vorlage für einen Faktencheck

Es gibt **zwei Wege**, einen Faktencheck zu schreiben:

## Weg 1 (empfohlen für die meisten): das Redaktions-CMS

Öffne **`/admin`** auf der Website (z. B. `https://…github.io/Kompetenzzentrum/admin/`),
melde dich mit GitHub an und klicke auf „Faktencheck → Neu". Du füllst nur
Formularfelder aus – Urteil und Themen per Auswahlmenü, Quellen als Liste, die
drei Tiefen in komfortablen Text-Editoren. Kein Markdown-Frontmatter, keine
Spezial-Syntax. Beim Speichern entsteht automatisch ein Pull Request.

## Weg 2: Datei direkt anlegen

Lege eine neue Datei `src/content/faktenchecks/<dein-slug>.md` an (Slug = kurze,
kleingeschriebene Beschreibung mit Bindestrichen, z. B. `tempolimit-klima.md`).

Alles steht im **Frontmatter** (zwischen den `---`). Die Inhaltsfelder
(`einleitung`, `einstieg`, `vertiefung`, `wissenschaftlich`, `technik_text`,
`pruefen`) dürfen ganz normales **Markdown** enthalten (Fettdruck, Listen, Links).
Es ist **keine** `:::`-Direktiven-Syntax mehr nötig.

```markdown
---
titel: "„Die Behauptung als Titel“"
behauptung: "Die geprüfte Falschbehauptung, möglichst im Wortlaut."
kurzantwort: "Ein bis zwei Sätze: der belegte Fakt zuerst (Truth Sandwich)."
urteil: "falsch"            # falsch | groesstenteils-falsch | irrefuehrend | fehlender-kontext | teils-richtig
themen: ["klima-energie"]   # siehe Liste unten, mind. 1
techniken: ["cherry-picking", "fehlender-bezugswert"]  # siehe Liste unten, optional
zusammenfassung: "Kurze Meta-Beschreibung für Vorschau & Suchmaschinen (max. 300 Zeichen)."
status: "entwurf"           # entwurf | in-pruefung | geprueft
veroeffentlicht: 2026-06-01
aktualisiert: 2026-06-01     # optional
mitwirkende: ["Dein Name oder GitHub-Handle"]
verwandt: []                # optional: Slugs anderer Faktenchecks
quellen:
  - titel: "Titel der Quelle / des Datensatzes"
    herausgeber: "Statistisches Bundesamt"
    url: "https://www.destatis.de/..."
    datum: "2024"
    art: "primaer"          # primaer | sekundaer
einleitung: |
  Beginne mit dem Fakt, nicht mit dem Mythos (ein kurzer Absatz).
einstieg: |
  Kurz und verständlich, ganz ohne Vorwissen. Warum stimmt die Behauptung nicht?
vertiefung: |
  Die Zahlen dahinter, der Kontext, die Zusammenhänge – konkrete Werte mit Bezugsgröße.
wissenschaftlich: |
  Primärquellen, Methodik, statistische Fallstricke. Für alle, die es genau wissen wollen.
technik_titel: "Cherry Picking"
technik_text: |
  Welche Manipulationstechnik steckt dahinter? Kurz erklären.
pruefen: |
  - Konkrete Schritte, wie man die Behauptung selbst überprüft.
  - Welche Datenbank, welcher Rechner, welche Originalquelle hilft?
---
```

> **Tipp:** Die Inhaltsfelder nutzen `|` (YAML-Block). Alle folgenden Zeilen
> sind dann um zwei Leerzeichen eingerückt. Innerhalb des Textes kannst du frei
> Markdown schreiben.

## Erlaubte Werte

**themen:** `migration`, `kriminalitaet-sicherheit`, `klima-energie`,
`wirtschaft-soziales`, `gesundheit`, `demokratie-medien`

**urteil:** `falsch`, `groesstenteils-falsch`, `irrefuehrend`,
`fehlender-kontext`, `teils-richtig`

**techniken:** `fake-experten`, `logischer-fehlschluss`,
`unerfuellbare-erwartung`, `cherry-picking`, `verschwoerung`,
`falsche-kausalitaet`, `fehlender-bezugswert`, `emotionalisierung`,
`falsche-gleichsetzung`, `aus-dem-kontext-gerissen`

> Die genauen Codes stehen in `src/content.config.ts` und `src/lib/labels.ts`.
> Neue Themen/Techniken bitte dort ergänzen.

## Vor dem Einreichen

```bash
npm run build   # repariert Anführungszeichen, prüft Schema, Quellen-Pflicht
                # und dass alle drei Tiefen gefüllt sind
```

Läuft das fehlerfrei, ist der Beitrag formal in Ordnung. Dann als Pull Request
einreichen – eine zweite Person liest gegen.
