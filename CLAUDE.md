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
- Faktencheck-Detailseite hat **Kopierbutton** (Fakt+Quelle+Link) = die
  „Diskussionshilfe“ (eigene Seite wurde entfernt).
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
- **9 Faktenchecks** (+1: Gesundheit – „Antibiotika bei Erkältung“, Status
  `in-pruefung`, wartet auf menschliche Abnahme → dann auf `geprueft` setzen).
- **17 Maschen** (15 + 2 aus Backlog: Gish-Galopp #16, Mehrheits-Argument/Bandwagon #17).
- Interaktive Tiefen-Demo auf Startseite, mobiles Burger-Menü, README als Einladung.
- Verifikation: Link-Check in CI (`ci.yml` Job `quellen-links`).
- **Netzwerk-Policy / Whitelist GETESTET (06/2026):** Custom-Allowlist greift.
  Volltext-Abruf bestätigt (200) für correctiv.org, destatis.de, riffreporter.de,
  *.wikipedia.org, bpb.de, who.int, rki.de, gesundheitsinformation.de (IQWiG), edmo.eu.
  **Ausnahme:** `tagesschau.de` = „Blocked by egress policy“ (trotz Listung) →
  ggf. in Custom-Allowlist ergänzen. Quellen können jetzt im Volltext geprüft werden.

## Stolpersteine (gelernt)
- **Nur Feature-Branch pushen.** Lokal kann man versehentlich auf `main` landen –
  danach wieder `git checkout claude/factcheck-...` und prüfen, dass `main` ==
  `origin/main` (kein versehentlicher main-Push).
- **`reihenfolge` der Maschen:** flicc 1–6, rhetorik 7–17. Neue rhetorik-Maschen
  fortlaufend ≥18, damit „Die 5 Kerntechniken“ (= flicc) stimmt.
- **CMS-Techniken an ZWEI Stellen** in `public/admin/config.yml` pflegen
  (faktenchecks `techniken` + maschen `code`).
- **Frontmatter:** keine geraden `"` in Werten (normalize-Script fängt’s, aber
  bewusst typografische „…“ schreiben).

## Offene / mögliche nächste Schritte
- ~~Whitelist verifizieren~~ ✅ erledigt (06/2026, siehe Stand oben).
- ~~Gish-Galopp & Bandwagon~~ ✅ umgesetzt. **Noch offen im Backlog:** Sündenbock
  und Firehose (beide politisch sensibel, brauchen besonders neutrales Pfad-A-Framing
  → vor Umsetzung mit Nutzer abstimmen); Newspeak (niedrige Priorität); Vernebelung
  (überlappt mit Gish-Galopp, vermutlich verzichtbar); Angstrhetorik (laut Backlog als
  Abschnitt in „Emotionalisierung“ statt eigene Masche).
- ~~Themen-Balance Gesundheit~~ ✅ erster Gesundheits-Faktencheck da (Antibiotika).
  Weitere Themen außerhalb Migration/Klima weiterhin wünschenswert.
- **Gesundheits-Faktencheck abnehmen:** Quellen sind erreichbar + inhaltlich geprüft
  (IQWiG, WHO), aber Status `in-pruefung` – menschliches Gegenlesen fehlt für `geprueft`.
- **Social-Media-Karten** (Open Graph je Masche/Faktencheck) – beim Nutzer „in der
  Pipeline“. **Offen: ob Claude das übernehmen soll (Konfliktgefahr mit Nutzer-Arbeit).**
- Projektname evtl. überdenken (Faktenkompass / Durchblick / Prüfstein) – offen.
