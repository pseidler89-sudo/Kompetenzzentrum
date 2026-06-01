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
- Entwicklung & Push **nur** auf `claude/factcheck-misinformation-platform-OjE9f`.
- **Nicht** auf `main` pushen (vom System geblockt) und **keine PRs** ohne
  ausdrückliche Aufforderung. GitHub nur über MCP-Tools.

## Stand (zuletzt)
- 8 Faktenchecks, **15 Maschen** (10 + 5 neue: Whataboutism, Falsche Verknüpfung,
  Astroturfing, Identitätsschwindel, Falsche Ausgewogenheit).
- Interaktive Tiefen-Demo auf Startseite, mobiles Burger-Menü, README als Einladung.
- Verifikation: Link-Check in CI (`ci.yml` Job `quellen-links`).
- **Netzwerk-Policy:** Umgebung lief auf „Trusted“ → externe Quellen 403 (WebFetch
  & curl). Nutzer hat eine **Custom-Allowlist** mit Quell-Domains eingetragen;
  greift erst in neuer Session. **TODO: Whitelist testen** (curl auf correctiv.org,
  destatis.de, riffreporter.de, de.wikipedia.org – Erwartung: 200).

## Offene / mögliche nächste Schritte
- Whitelist verifizieren (s. o.), dann Quellen künftig im Volltext prüfen.
- Themen-Balance: 2–3 Faktenchecks außerhalb Migration/Klima (z. B. Gesundheit –
  Thema existiert im Schema, ist aber leer).
- Zurückgestellte Maschen mit guter Beleglage: Gish-Galopp/Firehose, Sündenbock,
  Bandwagon, Newspeak.
- Teilbare **Social-Media-Karten** (Open Graph je Masche/Faktencheck) – beim
  Nutzer „in der Pipeline“.
- Evtl. Projektname überdenken (Kandidaten: Faktenkompass, Durchblick, Prüfstein) –
  offen, vom Nutzer noch nicht entschieden.
