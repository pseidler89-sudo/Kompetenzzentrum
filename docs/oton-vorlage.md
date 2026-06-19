# O-Ton — Vorlage & Quellen-Leitfaden

So legst du einen O-Ton-Check an: eine `.md`-Datei in `src/content/oton/` (Dateiname =
Slug, z. B. `src/content/oton/strompreis-aussage-xy.md`). Diese Datei hier wird **nicht**
gebaut (sie liegt in `docs/`), sie ist nur Vorlage und Anleitung.

> **Grundsatz (Pfad A):** Wir prüfen die **Aussage**, nicht die Person. Titel/Fokus liegt
> auf der Aussage; die Person ist eine belegte Quelle. Kein „garbage", kein Spott –
> Urteile aus dem festen Set.

---

## Vorlage zum Kopieren

```yaml
---
sprecher: "Vorname Nachname"
funktion: "z. B. MdB (Partei X) · oder: Talk-Gast, Moderator:in"
zitat: "Wörtliches Zitat, möglichst exakt – so, wie es gefallen ist."
quelle_url: "https://www.youtube.com/watch?v=XXXX&t=1234s"   # MIT Zeitstempel
plattform: "YouTube"            # oder ARD-Mediathek, Bundestag-TV, …
datum: "10.06.2026"             # Datum der Aussage (Freitext)
urteil: "irrefuehrend"          # falsch | groesstenteils-falsch | irrefuehrend | fehlender-kontext | teils-richtig
kurzantwort: "Fakt zuerst, in einem Satz: was tatsächlich stimmt – Truth-Sandwich."
einordnung: |
  Ausführlichere Richtigstellung (Markdown). Den wahren Kern fair benennen,
  dann sauber einordnen. Zahlen mit Bezugswert, jede zentrale Aussage belegt.
techniken: ["fehlender-bezugswert"]   # optional, Codes wie bei Faktenchecks
quellen:
  - titel: "Titel der Primärquelle"
    herausgeber: "z. B. Destatis / BKA / BNetzA / bpb / Ministerium / WHO"
    url: "https://…"
    datum: "2024"
    art: "primaer"            # primaer | sekundaer
status: "in-pruefung"          # neu IMMER in-pruefung, bis am Video gegengehört
veroeffentlicht: 2026-06-20
verwandt: []                   # optional: Slug(s) verwandter Faktenchecks
---
```

---

## Welche Quellen? — die zwei Rollen (nicht verwechseln)

**1. Beleg, *dass* die Aussage gefallen ist → `quelle_url` (das Video).**
- Das Video mit **Zeitstempel** (`&t=…s`) ist der Authentizitäts-Nachweis, keine
  inhaltliche Quelle.
- **Pflicht: am Video gegenhören** – Wortlaut *und* Kontext (Satz davor/danach), damit
  wir nicht selbst „aus dem Kontext" reißen.
- Videos sterben: **Datum** festhalten; idealerweise zusätzlich ein **Archiv-Link**
  (z. B. archive.org) und/oder eine seriöse Berichterstattung, die das Zitat dokumentiert,
  als Backup in `quellen` (art `sekundaer`).

**2. Belege, *warum* die Aussage falsch/irreführend ist → `quellen`.**
- **Genau wie bei Faktenchecks: primär/amtlich/akademisch** (Destatis, BKA, BNetzA, UBA,
  Ministerien, bpb, WHO, peer-reviewt).
- **Keine Digest-/Sekundärartikel als Hauptbeleg.** Medien-Faktenchecks (CORRECTIV,
  ARD-Faktenfinder …) nur als **Ergänzung**, nie als alleiniger Anker (Pfad A).
- Mindestens **eine** Quelle ist Pflicht (Schema), für `geprueft` möglichst ≥1 `primaer`.

---

## Redaktionsregeln

- **Status-Workflow:** neu = `in-pruefung`. Auf `geprueft` erst **nach menschlichem
  Gegenhören** des Videos (Wortlaut + Kontext) und Gegenlesen der Quellen.
- **Tonlage:** sachlich, kein Spott, kein „gegen Person Y". Schmähkritik macht angreifbar;
  ein belegtes, sachliches Urteil schützt.
- **Truth-Sandwich:** `kurzantwort` beginnt mit dem Fakt, nicht mit der Falschbehauptung.
- **Sichtbarkeit:** Die Unterseite `/o-ton` ist bereits in der Navigation und zeigt nur
  Nicht-Entwürfe (aktuell Empty-State, bis erste Einträge `in-pruefung`/`geprueft` sind).

---

## Startliste: wo & wie wir O-Töne ziehen

> **Status: Startpunkt, nicht final.** Diese Liste ist die Basis – die Research-Loop
> (neue Session) soll sie verifizieren, priorisieren und erweitern (Reichweite,
> Untertitel-Verfügbarkeit, Aufwand, Risiko).

### Wo man O-Töne findet

**A) Primär & amtlich (am unverfänglichsten – oft mit wörtlichem Protokoll):**
- **Deutscher Bundestag – Mediathek** (`bundestag.de/mediathek`) **+ Plenarprotokolle**
  (`bundestag.de` → Dokumente): das amtliche **Wortprotokoll** ist exakt zitierfähig –
  Goldstandard (Video als „dass gesagt" + Protokoll als Wortlaut-Beleg).
- **Landtage** und **Europäisches Parlament** – eigene Mediatheken/Protokolle.
- **phoenix** (ARD/ZDF-Ereigniskanal): Reden, Pressekonferenzen, Debatten im O-Ton.

**B) Talk-Shows & Interviews (ÖR-Mediatheken, häufig mit Untertiteln):**
- ARD: *Maischberger*, *hart aber fair*, *Caren Miosga*, *Tagesthemen*-Interviews.
- ZDF: *Markus Lanz*, *Maybrit Illner*, *heute journal*; *phoenix runde*.
- *Jung & Naiv* (lange Original-Interviews, oft komplette O-Töne).

**C) Originalquelle der Sprecher:innen:**
- YouTube-/Social-Kanäle der **Parteien, Fraktionen und einzelnen Politiker:innen**
  (die Aussage an der Quelle, ungeschnitten).

**D) Nur zum FINDEN von Fällen (NICHT als Beleg):**
- CORRECTIV, ARD-Faktenfinder, Volksverpetzer, Übermedien/Topf voll Gold,
  Mediendienst Integration – um zu sehen, welche Aussagen gerade kursieren. Der
  Beleg kommt dann immer aus A–C + primär/amtlichen Quellen.

### Methoden: Wortlaut · Zeitstempel · Backup

- **Wortlaut:** Wo es ein **amtliches Protokoll** gibt (Bundestag/Landtage), dieses für
  den exakten Wortlaut nutzen. Sonst Untertitel der Mediathek/YouTube – aber
  **Auto-Untertitel sind fehleranfällig → immer am Video gegenhören.**
- **Untertitel/Transkript ziehen** (nur Untertitel, kein Video-Download):
  `yt-dlp --write-auto-sub --write-sub --sub-lang de --skip-download <URL>`
- **Zeitstempel-Deeplink:** YouTube `…&t=1234s`; viele Mediatheken haben eigene
  Timecode-Links. In `quelle_url` immer mit Zeitstempel speichern.
- **Backup gegen Link-Tod:** Snapshot der Videoseite via **web.archive.org** (Wayback)
  anlegen, Datum notieren; zusätzlich ggf. seriöse Berichterstattung, die das Zitat
  dokumentiert, als `sekundaer` in `quellen`.

### Auswahl-Kriterien für gute O-Ton-Fälle

- **Konkret & prüfbar** (Zahl/Tatsachenbehauptung), nicht reine Meinung/Wertung.
- Es gibt eine **klar primär/amtlich belegbare Richtigstellung**.
- **Pfad-A-Balance:** über das Parteienspektrum streuen, nicht einseitig; die *Aussage*
  prüfen, nicht die Person.
- **Relevanz:** die Aussage ist einflussreich / kursiert breit.

### Rechtliches (kurz, keine Rechtsberatung)

Ein **kurzes wörtliches Zitat** öffentlicher Personen zu Informations-/Bildungszweck
**mit Quellenangabe** ist i. d. R. durch Zitatrecht und Meinungsfreiheit gedeckt –
solange der **Wortlaut korrekt** ist und der **Kontext gewahrt** bleibt. Sachliches
Urteil statt Schmähkritik. Im Zweifel den Fall lieber weglassen.
