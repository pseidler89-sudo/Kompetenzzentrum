# Vorlage für einen Faktencheck

Kopiere den folgenden Block in eine neue Datei unter
`src/content/faktenchecks/<dein-slug>.md` (Slug = kurze, kleingeschriebene
Beschreibung mit Bindestrichen, z.B. `tempolimit-sicherheit.md`).

Alles zwischen `---` ist das **Frontmatter** (Metadaten), darunter folgt der Text
in den drei Tiefen. Die Direktiven `:::stufe`, `:::technik` und `:::pruefen`
werden automatisch in die hübschen Boxen und die Tiefen-Umschaltung verwandelt.

````markdown
---
titel: "„Die Behauptung als Titel“"
behauptung: "Die geprüfte Falschbehauptung, möglichst im Wortlaut."
kurzantwort: "Ein bis zwei Sätze: der belegte Fakt zuerst (Truth Sandwich)."
urteil: "falsch"            # falsch | groesstenteils-falsch | irrefuehrend | fehlender-kontext | teils-richtig
themen: ["klima-energie"]  # siehe Liste unten, mind. 1
techniken: ["cherry-picking", "fehlender-bezugswert"]  # siehe Liste unten, optional
zusammenfassung: "Kurze Meta-Beschreibung für Vorschau & Suchmaschinen (max. 300 Zeichen)."
status: "entwurf"          # entwurf | in-pruefung | geprueft
veroeffentlicht: 2026-05-31
aktualisiert: 2026-05-31    # optional
mitwirkende: ["Dein Name oder GitHub-Handle"]
verwandt: []               # optional: Slugs anderer Faktenchecks
quellen:
  - titel: "Titel der Quelle / des Datensatzes"
    herausgeber: "Statistisches Bundesamt"
    url: "https://www.destatis.de/..."
    datum: "2024"
    art: "primaer"         # primaer | sekundaer
---

Einleitung (1 Absatz): Beginne mit dem Fakt, nicht mit dem Mythos.

:::stufe{name="einstieg"}
Kurz und verständlich, ganz ohne Vorwissen. Was ist die Kernaussage – und warum
stimmt die Behauptung nicht?
:::

:::stufe{name="vertiefung"}
Die Zahlen dahinter, der Kontext, die Zusammenhänge. Hier dürfen konkrete Werte
mit Bezugsgröße stehen.
:::

:::stufe{name="wissenschaftlich"}
Primärquellen, Methodik, statistische Fallstricke. Für Leser:innen, die es genau
wissen wollen.
:::

:::technik{name="Cherry Picking"}
Welche Manipulationstechnik steckt dahinter? Kurz erklären.
:::

:::pruefen
- Konkrete Schritte, wie man die Behauptung selbst überprüft.
- Welche Datenbank, welcher Rechner, welche Originalquelle hilft?
:::
````

## Erlaubte Werte

**themen:** `migration`, `kriminalitaet-sicherheit`, `klima-energie`,
`wirtschaft-soziales`, `gesundheit`, `demokratie-medien`

**urteil:** `falsch`, `groesstenteils-falsch`, `irrefuehrend`,
`fehlender-kontext`, `teils-richtig`

**techniken:** `fake-experten`, `logischer-fehlschluss`,
`unerfuellbare-erwartung`, `cherry-picking`, `verschwoerung`,
`falsche-kausalitaet`, `fehlender-bezugswert`, `emotionalisierung`,
`falsche-gleichsetzung`, `aus-dem-kontext-gerissen`

> Die genauen Codes und Anzeige-Texte stehen in `src/content.config.ts` und
> `src/lib/labels.ts`. Neue Themen/Techniken bitte dort ergänzen.

## Vor dem Einreichen

```bash
npm run build   # prüft Schema, Quellen-Pflicht und alle drei Tiefen
```

Läuft das fehlerfrei, ist der Beitrag formal in Ordnung. Dann als Pull Request
einreichen – eine zweite Person liest gegen.
