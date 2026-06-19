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
transkript: |                   # optional: Wortlaut im Kontext (Sätze davor/danach)
  …vorheriger Satz… „[das Zitat]“ …nachfolgender Satz… (zeigt, dass nichts aus
  dem Kontext gerissen ist; wird klappbar als „Wortlaut im Kontext“ angezeigt).
quelle_url: "https://www.youtube.com/watch?v=XXXX&t=1234s"   # MIT Zeitstempel
archiv_url: "https://web.archive.org/web/2026.../https://www.youtube.com/watch?v=XXXX"  # optional: Wayback-Snapshot der Videoseite (Fallback, wenn das Original stirbt)
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
- **Maschen verknüpfen:** Wo eine Manipulationstechnik erkennbar ist, `techniken` setzen –
  die Detailseite zeigt sie als „Maschen in dieser Aussage" und verlinkt zu den Maschen
  (Lerneffekt, Prebunking). Bei einem **reinen Faktenfehler ohne Technik** darf das Feld
  leer bleiben – keine Masche erzwingen (Pfad-A-Fairness).
- **Sichtbarkeit:** Die Unterseite `/o-ton` ist bereits in der Navigation und zeigt nur
  Nicht-Entwürfe (aktuell Empty-State, bis erste Einträge `in-pruefung`/`geprueft` sind).

---

## Startliste: wo & wie wir O-Töne ziehen

> **Status: verifiziert & priorisiert (Research-Loop 06/2026).** Quellen/URL-Muster
> wurden per Recherche aufgerufen und bestätigt; einzelne durch Bot-Schutz nur über
> Suchtreffer/Geschäftsordnung verifizierte sind als **(vor Veröffentlichung im Browser
> gegenprüfen)** markiert. Reihenfolge = Empfehlung (Goldstandard zuerst).

### Die wichtigste Erkenntnis zuerst (zwei Regeln, die alles steuern)

1. **Text-Beleg vom Video trennen.** Der exakte **Wortlaut** kommt – wo es ihn gibt –
   aus dem **amtlichen Wortprotokoll** (Bundestag/Landtage/EP). Das Video belegt nur
   *dass/wie* es gesagt wurde (Tonfall, Kontext). Untertitel/Auto-Captions sind **nie**
   ein Wortlaut-Zitat, nur ein **Fundstellen-/Timecode-Anker** – Wortlaut **immer am
   Audio gegenhören**.
2. **Wayback rettet kein Video.** `web.archive.org` archiviert bei YouTube/ÖR-Mediatheken
   nur die **HTML-Seite + Metadaten**, NICHT das DRM-/HLS-Streaming (Player zeigt im
   Archiv „video unavailable"). Wayback taugt also als Beleg „existierte zu Zeitpunkt X
   unter dieser URL", **nicht** als abspielbares Backup. Echtes Backup = **eigene lokale
   Sicherung** (`yt-dlp` Vollvideo + Untertitel + Standbild der Fundstelle).

### Wo man O-Töne findet — priorisiert

**A) Primär & amtlich — GOLDSTANDARD (Text-Wortlaut + stabile URL):**

1. **Deutscher Bundestag – Stenografischer Bericht / Plenarprotokoll.**
   `dserver.bundestag.de/btp/{WP}/{WP}{Sitzung-3-stellig}.pdf`
   (Beispiel: `dserver.bundestag.de/btp/18/18128.pdf`). Amtlicher Wortlaut **jeder**
   Rede, Zwischenrufe namentlich. **Zitier-„Timecode" = Seitenzahl + Spalte A/B/C/D**
   („PlenProt 18/128, S. 12425 (C)"). Vorläufige Fassung am Sitzungstag, endgültige am
   Folgewerktag. Stabilität SEHR HOCH. Such-Einstieg: **DIP** `dip.bundestag.de`
   (Volltextsuche, verlinkt aufs PDF). → **erste Wahl, wann immer die Aussage im Plenum fiel.**
2. **Bundestag – Mediathek/Web-TV** (`bundestag.de/mediathek/video?videoid={ID}`,
   Shortlink `dbtg.tv/cvid/{ID}`): Reden einzeln geschnitten = de-facto-Timecode, Seite
   nennt die „Fundstelle im Plenarprotokoll". **Kein** frame-genauer `?t=`. Video ab WP 17
   (2009). Mediathek wurde mehrfach umgebaut → Deeplink zusätzlich sichern. Als **Ton-/
   Kontextbeleg neben dem Protokoll**.
3. **Landtage** (Zitierbeleg = immer Protokoll-PDF + Seite). Am einfachsten **NRW**
   (`landtag.nrw.de/portal/WWW/dokumentenarchiv/Dokument/MMP{WP}-{Nr}.pdf`, Auto-Fetch
   braucht Browser-User-Agent, sonst 403) und **Sachsen**
   (`landtag.sachsen.de/data/xml/sitzungskalender/Plenum_{WP}-{Nr}.pdf`); **Baden-Württemberg**
   bietet einen **RSS-Feed der Plenarprotokolle** (`landtag-bw.de/de/rss-feed-plenarprotokolle-509986`,
   ideal für den Research-Loop) + MP4-Download; **Bayern** nur über die Suche (Deeplinks
   2017 gebrochen). *(URL-Muster vor Veröffentlichung im Browser gegenprüfen.)*
4. **Europäisches Parlament – Verbatim (CRE):**
   `europarl.europa.eu/doceo/document/CRE-{WP}-{YYYY-MM-DD}_DE.html`. **Wichtig:** jeder
   Redebeitrag steht in der **Originalsprache** des Redners – die DE-Fassung ist nur die
   Navigation, **fremdsprachige Reden sind NICHT übersetzt** (und die DE-Audiospur im
   Multimedia Centre ist Verdolmetschung ≠ Wortlaut). Nur für **deutschsprachige** Reden
   als Wortlaut-Beleg nutzen. *(im Browser gegenprüfen.)*

**B) Talk-Shows & Interviews (wenn die Aussage NICHT im Parlament fiel):**

- **Stabilste ÖR-Belege:** **Tagesthemen-Interviews** (ARD-Archiv quasi unbefristet,
  YouTube-Mirror `@tagesschau` mit `&t=`-Deeplink) sowie **heute journal**-Clips
  (`@ZDFheute`) und **phoenix runde** (`youtube.com/@phoenix` lädt **ganze** Sendungen).
  → Wenn ein O-Ton dort vorkommt: **erste Wahl**, weil dauerhaft + klickbarer Timecode.
- **Endliche Verweildauer (~12 Monate, Link-Tod real):** *Markus Lanz* / *Maybrit Illner*
  (`zdf.de/video/talk/…`), *Maischberger* / *hart aber fair* / *Caren Miosga*
  (`ardmediathek.de/sendung/…`). Kein zuverlässiger Timecode-Deeplink (Timecode als Text
  `[hh:mm:ss]` zitieren). **Bei Fund SOFORT lokal sichern** (`yt-dlp` Video+UT), sonst
  ist der Beleg in einem Jahr weg.
- ***Jung & Naiv*** (`youtube.com/@JungNaiv`, Archiv `jungundnaiv.de`): lange,
  **ungeschnittene** Originalinterviews (1,5–3 h) – unschlagbar gegen „aus-dem-Kontext"-
  Vorwürfe, plus millisekundengenaue `&t=`-Sprünge. Aber meist nur **Auto-Untertitel**
  → Wortlaut zwingend gegenhören.

**C) Originalquelle der Sprecher:innen (ungeschnitten an der Quelle):**

- **Neutralste Primärkanäle:** **Deutscher Bundestag** (`youtube.com/@bundestag`, alle
  Plenardebatten live; **Untertitel manuell korrigiert** = zitierfähig) und
  **Bundesregierung/BPA** (`youtube.com/bundesregierung`, lädt **komplette RegPKs/BPKs**
  hoch).
- **Fraktionskanäle** liefern mehr Ungeschnittenes als die Parteikanäle (PKs/Statements
  oft in voller Länge): u. a. `@cducsu`, `spdfraktion`, `gruenebundestag`,
  `@AfDFraktionimBundestag`, `@dielinkebt`. **Partei**kanäle (cdutv, @spdde, @fdp, @AfDTV,
  @dielinke, BSW …) sind meist kuratierte Clips.
- **Untertitel** außerhalb des Bundestags i. d. R. **automatisch** → pro Video in der
  YT-Oberfläche prüfen, Wortlaut gegenhören.
- **Pfad-A-Balance:** quer über das Spektrum streuen; für die neutralste Belegkette immer
  Bundestag/Bundesregierung bevorzugen.

**D) Nur zum FINDEN von Fällen (NICHT als Beleg):**
- CORRECTIV, ARD-Faktenfinder, Volksverpetzer, Übermedien/Topf voll Gold,
  Mediendienst Integration – um zu sehen, welche Aussagen kursieren. Der Beleg kommt
  dann immer aus A–C + primär/amtlichen Quellen.

### Methoden: Wortlaut · Zeitstempel · Backup

- **Wortlaut:** Wo es ein **amtliches Protokoll** gibt (Bundestag/Landtage/EP-CRE),
  dieses für den exakten Wortlaut nutzen (Seite + Spalte als „Timecode"). Sonst
  Untertitel als Anker, aber **Auto-Untertitel sind fehleranfällig (Eigennamen, Zahlen,
  keine Satzzeichen) → immer am Audio gegenhören.**
- **Untertitel/Transkript ziehen** (nur Untertitel, kein Video-Download; aktuelle
  Plural-Flags – Singularformen `--write-sub` etc. sind veraltete Aliase):
  ```bash
  yt-dlp --list-subs "<URL>"                     # erst prüfen: manuell vs. automatisch
  # manuell bevorzugen, sonst auf Auto zurückfallen, als SRT:
  yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "de.*" --convert-subs srt "<URL>"
  ```
  (`de.*` fängt `de`, `de-DE`, `de-orig` ab.) Funktioniert für YouTube **und**
  ARD-/ZDF-Mediathek (gepflegte yt-dlp-Extractoren).
- **Zeitstempel-Deeplink:** YouTube `…watch?v=ID&t=83s`; Kurz-URL `youtu.be/ID?t=83`;
  Embed `…/embed/ID?start=83`. **ÖR-Mediatheken haben keinen stabilen `?t=`** → Timecode
  als Text `[hh:mm:ss]` zitieren und YouTube-Mirror bevorzugen, wo vorhanden. In
  `quelle_url` immer mit Zeitstempel speichern, wenn die Plattform es kann.
- **Backup gegen Link-Tod (Projekt-Entscheidung 06/2026: KEINE lokalen Video-Downloads/Clips –
  das frisst Speicher ohne genug Mehrwert).** Der Beleg trägt sich anders:
  - **(a) Plenar-Fälle** brauchen ohnehin kein Video-Backup – das **Protokoll-PDF ist der
    permanente Wortlaut-Beleg** (Bundestag/Landtag halten es dauerhaft).
  - **(b) Nicht-Plenar:** beim Anlegen einen **Wayback-Snapshot** der Videoseite anlegen
    (als „existierte"-Nachweis; sichert das Video NICHT, aber die Seite) und den **relevanten
    Wortlaut als Transkript-Auszug** im Eintrag festhalten; zusätzlich ggf. seriöse
    Berichterstattung, die das Zitat dokumentiert, als `sekundaer` in `quellen`. Stirbt das
    Video später, ist das verkraftbar – Zitat + Einordnung + Quellen bleiben.
  - **(c) Quartalsweiser Link-Check** der `quelle_url`s; tote Mediathek-Links auf
    YouTube-Mirror umhängen oder einen Wayback-Hinweis setzen. (Automatisierbar als
    `/schedule`-Cloud-Agent.)

### Auswahl-Kriterien für gute O-Ton-Fälle

- **Konkret & prüfbar** (Zahl/Tatsachenbehauptung), nicht reine Meinung/Wertung.
- Es gibt eine **klar primär/amtlich belegbare Richtigstellung**.
- **Pfad-A-Balance:** über das Parteienspektrum streuen, nicht einseitig; die *Aussage*
  prüfen, nicht die Person.
- **Relevanz:** die Aussage ist einflussreich / kursiert breit.

### Rechtliches (kurz, keine Rechtsberatung)

Ein **kurzes wörtliches Zitat** öffentlicher Personen zu Informations-/Bildungszweck
**mit Quellenangabe** ist i. d. R. durch das **Zitatrecht (§ 51 UrhG, „Kleinzitat")**
und die Meinungsfreiheit gedeckt – wenn das Zitat als **Beleg in eine eigene inhaltliche
Auseinandersetzung** eingebettet ist (Zitatzweck – ein Faktencheck ist das klassisch),
der **Umfang aufs Nötige beschränkt** ist (kein Abdruck ganzer Reden) und **Urheber +
Quelle genau angegeben** sind. Zusätzlich das **Persönlichkeits-/Äußerungsrecht** wahren:
**Wortlaut korrekt**, **Kontext nicht sinnentstellt**, sachliches Urteil statt
Schmähkritik. Im Zweifel den Fall lieber weglassen. (Keine Rechtsberatung.)
