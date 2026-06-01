# Kompetenzzentrum – Projektkontext für Claude

Diese Datei wird beim Sessionstart automatisch geladen. Sie hält den Stand fest,
damit eine neue Session sofort weiterarbeiten kann.

## Was das ist
Offene, kostenlose Website, die **Falschbehauptungen prüfen lehrt** – faktenbasiert,
je nach Vorwissen in **drei Tiefen** (Einstieg / Vertiefung / Wissenschaftlich).
Zwei verzahnte Lernwege: **Faktenchecks** (konkrete Behauptungen) und **Maschen**
(Manipulationstechniken, Prebunking). Live auf GitHub Pages.

## Wichtigste Leitplanken (nicht verletzen)
- **Neutral, „Pfad A".** Öffentlich NIE „gegen rechts“ o. Ä. – das vergrault die
  Zielgruppe (auch rechts-offene, noch erreichbare Leser). Wir prüfen **Aussagen,
  nicht Personen**. Dass AfD/CDU/FDP in Beispielen oft vorkommen, merkt man selbst.
- **„Weniger Emotionen, mehr Zahlen und Fakten.“**
- **Quellen-Wahrnehmung (Pfad A).** Faktencheck-Medien (z. B. CORRECTIV) sind seriös,
  wirken auf Teile der Zielgruppe aber parteilich. Daher **sichtbar primär/amtlich/
  akademisch** belegen (Destatis, BKA, UBA, BNetzA, Ministerien, bpb, WHO, peer-reviewt);
  Medien-Faktenchecks als Ergänzung, nicht als alleiniger Anker. Maschen sind über
  `methodik/wissenschaftliche-grundlagen` akademisch verankert (Debunking Handbook 2020,
  FLICC) – jede Masche verlinkt das.
- **Jedes Beispiel konkret UND belegt** – nie generisch. Quelle = erreichbar
  (CI prüft) **und** inhaltlich selbst nachgelesen (menschlich), bevor `geprueft`.
  Grundsatz: lieber keine Quelle als eine ungeprüfte. Siehe
  `docs/redaktionsstandards.md`.
- **Git unsichtbar für Nicht-Techniker.** Keine „auf GitHub bearbeiten“-Links im
  Frontend. Redaktion läuft über Sveltia-CMS unter `/admin`.
- **Modell-ID niemals in Commits/Code/PRs.**

## Technik
- **Astro 5** static site, Content Collections + Zod (`src/content.config.ts`).
- Inhalte als **Frontmatter-Felder** (einstieg, vertiefung, wissenschaftlich,
  einleitung, technik_titel/text, pruefen), gerendert via `marked` (`src/lib/markdown.ts`).
- **Keine geraden Anführungszeichen in Frontmatter-Werten** → bricht YAML.
  `scripts/normalize-frontmatter.mjs` repariert sie automatisch im Build.
- Drei Tiefen: `StufenSchalter.astro` + `data-stufe` + localStorage.
- Maschen: `src/content/maschen/*.md`, Codes = `TECHNIKEN`-Enum. Kategorie
  `flicc` (genau 5 Kerntechniken) oder `rhetorik`. Labels in `src/lib/labels.ts`.
- **Maschen-Icons (P3):** je Code ein Lucide-Icon via `MASCHE_ICON` (in `labels.ts`),
  gerendert mit **astro-icon** (Build-Time, **kein** Runtime-JS) auf Maschen-Liste &
  Detailseite. Neues Dev-Dependency: `astro-icon` + `@iconify-json/lucide` (bewusst
  ergänzt – einzige Ausnahme von „kein neues Dependency", weil build-time/inline).
- **Grafik-Baukasten:** Autor:innen-Tool unter `public/tools/grafik.html` (eigenständige
  statische Datei, Tokens inline) → erreichbar `/<base>/tools/grafik.html`, verlinkt
  von „Mitmachen". Klick → fertiges `daten:`-YAML zum Kopieren.
- Faktencheck-Detailseite hat **Kopierbutton** (Fakt+Quelle+Link) = die
  „Diskussionshilfe“ (eigene Seite wurde entfernt).
- **Datengrafiken (P1):** optionales `daten`-Frontmatter pro Faktencheck →
  `Datenviz.astro` (reines CSS, nur global.css-Tokens; Typen: vergleich/anteil/
  zusammensetzung/kennzahl). Gerendert in `[...slug].astro` als Block „Die Zahlen
  im Überblick" vor den Quellen. CMS-Feld `daten` in `config.yml` vorhanden. Regel:
  nur wo eine Zahl/Beziehung getragen wird, **mit Quelle**; %-Achsen skalieren auf 100.
- CMS-Config: `public/admin/config.yml` (Selects für techniken müssen zu
  `TECHNIKEN` passen – an ZWEI Stellen pflegen).
- Build: `npm run build` (= normalize + validate + astro build). `npm run check:links`
  läuft NUR in GitHub Actions (offenes Netz), nicht lokal.

## Branch / Workflow
- **`main` = live.** GitHub Pages deployt automatisch aus `main` (`deploy.yml`).
  Was nicht auf `main` ist, ist **nicht live** – das war die Stolperfalle: lange lagen
  fertige Commits nur auf einem Feature-Branch und die Seite hing 6 Commits zurück.
- **Direkt-Push auf `main` ist blockiert** (Schutz) → Änderungen **immer über PR**
  nach `main` mergen, damit sie live gehen. GitHub nur über MCP-Tools.
- **Pro Aufgabe ein kurzlebiger Feature-Branch** (`claude/<thema>`), nach dem Merge
  aufräumen. Nicht mehrere Dauer-Branches parallel halten (sonst Wildwuchs).
- Konsolidiert am 06/2026: Feature-Stand via PR #1 nach `main` gebracht, Seite live;
  Alt-Branch `sharp-euler-KJ9Wu` war ein Duplikat und wurde entfernt.

## Stand (zuletzt)
- **v1.0 (06/2026):** Design-Handoff P1 (Datengrafiken) + P3 (Maschen-Icons) +
  Grafik-Baukasten eingebaut, Startseiten-Tiefen-Demo springt nicht mehr. Ziel:
  veröffentlichen und Feedback sammeln.
- **13 Faktenchecks.** Fünf warten auf menschliche Abnahme (`in-pruefung` → dann
  `geprueft`): „Antibiotika bei Erkältung“ (gesundheit); „E-Auto-Klimabilanz“;
  „Bio-Landwirtschaft immer besser“; „Windkraft & Vögel“; „Landwirtschaft & Klima“.
  Bei den Umwelt/Klima-Checks sind die Primärquellen (UBA/ICCT/Fraunhofer) erreichbar +
  via lesbarer Sekundärquelle (CORRECTIV bzw. Wikipedia) im Volltext gegengelesen;
  finale Zahlenabnahme am Original bleibt menschlicher Schritt.
- **19 Maschen** (15 + 4 aus Backlog: Gish-Galopp #16, Bandwagon #17, Sündenbock #18,
  Lügen-Flut/Firehose #19). Sündenbock & Firehose bewusst maximal neutral/techniknah.
- **Methodik dreigliedrig:** Was gibt es / Wie erkenne ich (Maschen) → Richtig
  widerlegen (neuer Leitfaden, Truth-Sandwich) → Faktenchecks. Akademische Belege
  in `methodik/wissenschaftliche-grundlagen` (reihenfolge 90, dezent am Ende).
- **Neues Thema `umwelt-landwirtschaft`** („Umwelt & Landwirtschaft“) eingeführt –
  in `content.config.ts`, `labels.ts` (Label + Reihenfolge) und `public/admin/config.yml`.
  Getaggt: Bio, Windkraft & Vögel, Landwirtschaft & Klima (dual mit klima-energie).
  Verbleibende Backlog-Themen in `docs/recherche/umwelt-verkehr-agrar-backlog.md`.
- **Social-Media-Karten umgesetzt:** Open-Graph-/Twitter-Meta in `BaseLayout.astro`
  (Detailseiten `og:type=article`), Default-Karte `public/og-default.png` aus
  `scripts/make-og-image.mjs` (sharp). Absolute URLs aus der Astro-Config.
- Interaktive Tiefen-Demo auf Startseite, mobiles Burger-Menü, README als Einladung.
- Verifikation: Link-Check in CI (`ci.yml` Job `quellen-links`).
- **Netzwerk-Policy / Whitelist GETESTET (06/2026):** Custom-Allowlist greift.
  Volltext-Abruf bestätigt (200) für correctiv.org, destatis.de, riffreporter.de,
  *.wikipedia.org, bpb.de, who.int, rki.de, gesundheitsinformation.de (IQWiG), edmo.eu.
  **Ausnahme:** `tagesschau.de` = „Blocked by egress policy“ (trotz Listung) →
  ggf. in Custom-Allowlist ergänzen. Quellen können jetzt im Volltext geprüft werden.

## Stolpersteine (gelernt)
- **`public/.nojekyll` MUSS existieren.** Sonst läuft auf GitHub Pages Jekyll und
  **ignoriert Ordner mit `_`-Präfix** → Astros `_astro/` (gehashtes CSS/JS) liefert
  404, während alle anderen Dateien (favicon, og-image, /tools, /admin) laden →
  Seite **komplett unstyled, kein Header-Menü**. Symptom: nur `_astro/*` ist 404,
  `/.nojekyll` ebenfalls 404. Fix: leere Datei `public/.nojekyll` (landet via Build in `dist/`).
- **Pages-Deploy: nicht mit Merges spammen.** Hashed CSS/JS + `cancel-in-progress`
  führten dazu, dass viele schnelle Merges Deploys mittendrin abbrachen → Live-HTML
  zeigte auf CSS-Hashes, die (noch) nicht da waren → **komplett unstyled** (riesiges
  Logo-SVG als Symptom). Fix: `cancel-in-progress: false` in `deploy.yml` (atomar).
  Trotzdem: Änderungen möglichst **bündeln**, nicht 5 PRs in 2 Minuten mergen, und
  nach dem letzten Merge ~2 min warten, bis Pages konsistent ist (CSS-Link → 200 prüfen).
- **Tote Quellen-Links = rote CI = „Run failed“-Mail-Flut.** Der CI-Job
  `quellen-links` (`npm run check:links`) bricht bei 404/410/DNS ab (403/429/503 =
  nur Warnung). Behörden/Verbände bauen URLs gern um → Links sterben still.
  **Vorsorge:** (1) Beim Anlegen einer Quelle möglichst **stabile/aktuelle URL**
  wählen und einmal kurz aufrufen. (2) Kommen „Run failed“-Mails, zuerst lokal
  `npm run check:links` laufen lassen, `[TOT]`-Zeilen suchen, URL auf den neuen
  Pfad des Herausgebers aktualisieren oder durch erreichbare, gleichwertige Quelle
  ersetzen (Ersatz im Volltext gegenlesen). Historie: 06/2026 BMAS- & ADAC-Link tot,
  via PR #5 ersetzt → CI wieder grün.
- **Nur Feature-Branch pushen.** Lokal kann man versehentlich auf `main` landen –
  danach wieder `git checkout claude/factcheck-...` und prüfen, dass `main` ==
  `origin/main` (kein versehentlicher main-Push).
- **`reihenfolge` der Maschen:** flicc 1–6, rhetorik 7–19. Neue rhetorik-Maschen
  fortlaufend ≥20, damit „Die 5 Kerntechniken“ (= flicc) stimmt.
- **CMS-Techniken an ZWEI Stellen** in `public/admin/config.yml` pflegen
  (faktenchecks `techniken` + maschen `code`).
- **Frontmatter:** keine geraden `"` in Werten (normalize-Script fängt’s, aber
  bewusst typografische „…“ schreiben).

## Offene / mögliche nächste Schritte
- ~~Whitelist verifizieren~~ ✅ erledigt (06/2026, siehe Stand oben).
- ~~Gish-Galopp, Bandwagon, Sündenbock, Firehose~~ ✅ umgesetzt (Sündenbock & Firehose
  bewusst maximal neutral/techniknah, mit Nutzer abgestimmt). **Noch offen im Backlog:**
  Newspeak (niedrige Priorität); Vernebelung (überlappt mit Gish-Galopp, verzichtbar);
  Angstrhetorik (laut Backlog als Abschnitt in „Emotionalisierung“ statt eigene Masche).
- ~~Themen-Balance Gesundheit~~ ✅ erster Gesundheits-Faktencheck da (Antibiotika).
  Weitere Themen außerhalb Migration/Klima weiterhin wünschenswert.
- **Gesundheits-Faktencheck abnehmen:** Quellen sind erreichbar + inhaltlich geprüft
  (IQWiG, WHO), aber Status `in-pruefung` – menschliches Gegenlesen fehlt für `geprueft`.
- ~~Social-Media-Karten~~ ✅ umgesetzt (OG-/Twitter-Meta + Default-Karte, PR #3).
  Optionale Ausbaustufe: pro-Seite generierte OG-Bilder (Titel im Bild) via satori –
  bewusst NICHT gemacht (Default-Karte genügt, kein neues Dependency).
- **Projektname bleibt „Kompetenzzentrum“** (06/2026 mit Nutzer entschieden).
