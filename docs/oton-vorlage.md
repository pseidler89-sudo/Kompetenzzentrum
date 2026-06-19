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
- **Sichtbarkeit:** Die Unterseite `/o-ton` zeigt nur Nicht-Entwürfe. In die Navigation
  wird sie erst aufgenommen, wenn 1–2 Einträge stehen.
