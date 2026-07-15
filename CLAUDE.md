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
- **Hell/Dunkel-Umschalter (07/2026):** Token-Set in `global.css` war vorbereitet
  (`:root[data-theme="dark"]`, `[data-theme="light"]` erzwingt hell, sonst OS via
  `prefers-color-scheme`). Ergänzt: Button im Header (`.theme-toggle` in `.header-actions`),
  Inline-`<head>`-Script (Flackerschutz, setzt `data-theme` vor dem Paint), Wiring-Script
  + Persistenz in `localStorage` (`kompetenz-theme`). Icon (Sonne/Mond) folgt rein per CSS
  dem tatsächlich angezeigten Schema.
- Maschen: `src/content/maschen/*.md`, Codes = `TECHNIKEN`-Enum. Kategorie
  `flicc` (genau 5 Kerntechniken) oder `rhetorik`. Labels in `src/lib/labels.ts`.
- **Maschen-Icons (P3):** je Code ein Lucide-Icon via `MASCHE_ICON` (in `labels.ts`),
  gerendert mit **astro-icon** (Build-Time, **kein** Runtime-JS) auf Maschen-Liste &
  Detailseite. Neues Dev-Dependency: `astro-icon` + `@iconify-json/lucide` (bewusst
  ergänzt – einzige Ausnahme von „kein neues Dependency", weil build-time/inline).
- **Grafik-Baukasten (LEGACY):** Standalone `public/tools/grafik.html` existiert noch,
  ist aber **nirgends mehr verlinkt** (07/2026). Die Grafik-Erstellung wurde direkt in
  den Faktencheck-Baukasten integriert (Schritt 7, s.u.). `grafik.html` kann später raus.
- **Faktencheck-Baukasten:** `src/pages/tools/faktencheck-baukasten.astro` – Formular
  **links**, echte **Live-Vorschau rechts** (nutzt globale Faktencheck-Stile), erzeugt
  Frontmatter. **„Absenden" = 1-Klick-Einreichung:** OAuth-Popup (Sveltia-Worker
  `sveltia-cms-auth.p-seidler.workers.dev`, Netlify-Protokoll) → GitHub-API: bei Schreibrecht
  Branch im Repo, sonst **Fork** → Datei → **PR** – ohne sichtbares GitHub. **Fallback** bei
  jedem Fehler: vorausgefüllter `/new/main`-Editor-Link + „Text kopieren" (kein Regress).
  **1-Klick-Einreichung 06/2026 live getestet (PR #31) ✅.** Maschen-Auswahl mit
  ⓘ-Erklärung (TECHNIK_ERKLAERUNG); Beispiel-Platzhalter in allen Feldern; Trick-Box
  einklappbar; Pflicht-Marker. **Schritt 7 „Zahlen-Grafik" (optional, eingeklappt, 07/2026):**
  inline-Grafik-Editor mit echter Live-Vorschau (spiegelt `Datenviz.astro` unter `.fcb-preview .dv*`),
  Typen **Balken-Vergleich** + **Kennzahl**, Wert-Zeilen (Beschriftung·Zahl·Einheit·Farbe),
  erzeugt automatisch das `daten:`-Frontmatter beim Absenden – **kein Copy-Paste, kein
  grafik.html mehr**. (Der alte Chart-Builder war mobil zu fummelig; diese Version ist
  mobile-first, max. wenige Felder.) **Styling-Fix:** Eingabe-Selektor deckt jetzt
  `input:not([type=checkbox])` ab (vorher fielen `type=url`/Quellen-Felder durchs Raster).
- Faktencheck-Detailseite hat **Kopierbutton** (Fakt+Quelle+Link) = die
  „Diskussionshilfe“ (eigene Seite wurde entfernt).
- **Datengrafiken (P1):** optionales `daten`-Frontmatter pro Faktencheck →
  `Datenviz.astro` (reines CSS, nur global.css-Tokens; Typen: vergleich/anteil/
  zusammensetzung/kennzahl). Gerendert in `[...slug].astro` als Block „Die Zahlen
  im Überblick" vor den Quellen. CMS-Feld `daten` in `config.yml` vorhanden. Regel:
  nur wo eine Zahl/Beziehung getragen wird, **mit Quelle**; %-Achsen skalieren auf 100.
- **Release 1.1 (Onboarding/Share):** Hero-**Suche** auf der Startseite (`<form>` →
  `/faktenchecks?q=…`, dort vom Such-Script übernommen); **dynamische OG-Karten** pro
  Faktencheck (`src/pages/og/[slug].png.ts`, SVG→sharp, Titel + ruhiges Urteils-Chip,
  in `[...slug].astro` via `bild`-Prop); **JSON-Export** `/faktenchecks.json`
  (`src/pages/faktenchecks.json.ts`, Fundament für Extension); **Sticky** Tiefen-
  Umschalter (`StufenSchalter` `position:sticky`).
- **Release 1.2 (externes Review, PR #35):** **`ClaimReview`-JSON-LD** pro Faktencheck
  in `[...slug].astro` (schema.org, Urteil→ratingValue 1–5, build-time, kein Dep) →
  Faktencheck-Rich-Results. **Eigene OG-Karten für Maschen** (`src/pages/og/masche/[slug].png.ts`,
  in Masche-Detail via `bild`); Faktencheck-OG-Kicker **ehrlich nach Status** (nur `geprueft`
  = „GEPRÜFT"). **Booster gegen Inoculation-Decay:** „Masche der Woche" auf Startseite
  (deterministische Wochen-Rotation, build-time) + **Aktiv-Abruf-Selbsttest** auf jeder
  Masche (`<details>`, nutzt das vorher ungenutzte `TECHNIK_KONTER`). Redaktioneller
  **Status auf den Faktencheck-Karten** sichtbar (`FaktencheckCard`, `badge--status`).
  **Transparenz-Hinweis** zum GitHub-Schreibrecht am Baukasten-Absenden. Repo-Name im
  Footer/Startseite auf `Kompetenzzentrum` (Groß) vereinheitlicht.
- CMS-Config: `public/admin/config.yml` (Selects für techniken müssen zu
  `TECHNIKEN` passen – an ZWEI Stellen pflegen). Entry-Listen interaktiv via
  `view_filters`/`view_groups`/`sortable_fields` (Status/Urteil/Kategorie).
- **CMS-Bedienung:** Sveltia hat eine **Live-Vorschau** (Augen-Icon) – auf dem
  **Desktop side-by-side**, mobil nur umschaltbar (Platz). Redigieren am Laptop
  empfehlen. Datengrafiken im CMS sind „advanced"/eingeklappt; einfacher visuell
  im **Faktencheck-Baukasten, Schritt 7** (inline, Live-Vorschau) bauen. Echte
  site-genaue Vorschau bräuchte ein Custom-Preview-Template (Sveltia unterstützt
  das nur eingeschränkt) – offener größerer Schritt.
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
- **„Liefern"-Loop (06/2026, PRs #48–#51):** Nach den Verifizier-Loops (L1–L5, U1–U3)
  auf Bauen/Liefern umgestellt – drei Phasen, alle live:
  - **UI:** Faktencheck-Liste spiegelt Filter/Suche in die URL (`?thema=&urteil=&technik=&q=`,
    teilbar, Back-Button, Deep-Links; PR #48). Maschen-Liste hat jetzt **Suche + Kategorie-
    Filter** (vorher 19 Maschen ungefiltert; PR #49).
  - **Erweiterungen:** **Quiz** `/quiz` („Erkennst du die Masche?", build-time-Daten aus den
    Maschen, clientseitige Logik, kein Dep) – verlinkt von Maschen-Seite + Werkzeugkasten.
    **RSS-Feed** `/rss.xml` (RSS 2.0, XML von Hand, kein `@astrojs/rss`, im `<head>` als
    alternate; PR #50).
  - **Inhalt:** 2 neue Checks in dünnen Themen (PR #51, Status `in-pruefung`, Gegenlesen offen):
    **Wahlbetrug/Briefwahl** (demokratie-medien, *falsch*; Bundeswahlleiterin+bpb) und
    **Deutschland EU-Zahlmeister** (wirtschaft-soziales, *fehlender-kontext*; bpb+EU-Kommission).
    Beide rechts/euroskeptisch konnotiert → balancieren den grün-konnotierten Glyphosat-Check.
  - **Faktenchecks jetzt: 20, alle `geprueft`** (die 2 neuen am 06/2026 vom Nutzer
    gegengelesen → geprueft). Details im `LOOP_LOG.md`.
- **v1.0 LIVE (06/2026):** Design-Handoff P1 (Datengrafiken) + P3 (Maschen-Icons) +
  Grafik-Baukasten eingebaut, Startseiten-Tiefen-Demo springt nicht mehr. Seite
  läuft gestylt inkl. Desktop-Header-Navigation (Faktenchecks · Maschen ·
  Werkzeugkasten · Methodik · Mitmachen-CTA) und mobilem Burger. Pages-Auslieferung
  gefixt (`.nojekyll` + `build.assets:"astro"`). Ziel jetzt: Feedback sammeln.
- **17 Faktenchecks.** Die früheren fünf `in-pruefung`-Checks sind 06/2026 auf
  `geprueft` gesetzt (Nutzer-Entscheid auf Basis einer Perplexity-Deep-Research):
  „Antibiotika bei Erkältung“, „E-Auto-Klimabilanz“, „Bio-Landwirtschaft immer besser“,
  „Windkraft & Vögel“, „Landwirtschaft & Klima“. Dabei **Wikipedia-Sekundärbelege durch
  Primärquellen ersetzt** (UBA Texte 32/2020 + ifeu bei Bio; BfN-Schriften 634 + PROGRESS
  bei Windkraft; zwei UBA-Datenseiten bei Landwirtschaft-Klima; UBA-PM „Klimavorteil
  E-Autos“ ergänzt). **4 neue Balance-Checks** (alle inzwischen `geprueft` nach
  Nutzer-Gegenlesen am Original, 06/2026; „grün/links“ konnotiert, für Neutralitäts-
  Wahrnehmung): Homöopathie wirkt (NHMRC + EASAC 2017; Cochrane raus = Paywall, Ullman/Cureus
  abgelehnt = Lobby), Atomkraft billigste Lösung (Fraunhofer ISE 2024 verbatim + IPCC + WNISR),
  Regional immer klimafreundlich (ifeu-PM), Gentechnik macht krank (BfR/WHO/EFSA).
  **Glyphosat-Check ergänzt (06/2026, PR #46, Status `in-pruefung`):** Urteil
  *irreführend*, neutral – Kern ist **Gefahr (IARC 2A) vs. Risiko (EFSA 2023/ECHA RAC 2022)**;
  drei Nicht-Bayer-Primärquellen (IARC, EFSA, ECHA). Damit ist die alte „zu dünn"-Lücke
  geschlossen. Noch offen: menschliches Gegenlesen der Originale → dann auf `geprueft`.
  Wenn ein neuer Quell-Link CI rot macht: URL beim Herausgeber auf neuen Pfad aktualisieren.
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
- **GitHub-Pages-Asset-Auslieferung (hat uns 06/2026 viel Zeit gekostet).** Zwei
  Dinge zusammen sorgten für „Seite komplett unstyled / kein Header":
  1. **`public/.nojekyll` MUSS existieren** – sonst läuft Jekyll und ignoriert
     `_`-Ordner → Astros `_astro/` (CSS/JS) = 404, alles andere lädt. Zusätzlich
     legen wir die Assets per `build: { assets: "astro" }` (astro.config) in einen
     Ordner **ohne** Unterstrich (`/astro/`) → doppelt Jekyll-immun.
  2. **CDN-Verteilung dauert.** Nach einem Deploy liefern Fastly-Edges zeitversetzt
     aus (mancher Knoten 200, ein anderer noch 404). Nicht in Panik neu deployen –
     ein paar Minuten warten, dann `Strg+Shift+R`.
- **Header-Navigation NICHT in `<details>` für den Desktop.** Aktuelle Browser
  verstecken den Inhalt geschlossener `<details>` via `content-visibility`
  (`::details-content`) – das hebelt sogar `display:flex !important` aus → Desktop
  zeigte nur das Logo. Lösung (in `BaseLayout.astro`/`global.css`): **immer sichtbare
  `.site-nav--desktop`-Leiste** außerhalb von `<details>`; der Burger ist ein
  **separates** `<details class="nav-burger">`, nur per Media Query (≤720px) sichtbar.
- **`public/.nojekyll` MUSS existieren.** (Kurzform – Details siehe oben.)
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
- **`reihenfolge` der Maschen:** flicc 1–5 (= die kanonischen FLICC-Kerntechniken
  nach Cook 2020: fake-experten, logischer-fehlschluss, unerfuellbare-erwartung,
  cherry-picking, verschwoerung), rhetorik 6–19. Neue rhetorik-Maschen fortlaufend
  ≥20, damit „Die 5 Kerntechniken“ (= flicc) stimmt. **Maschinell geprüft** durch
  `scripts/check-consistency.mjs` (Teil von `npm run validate`/`build`).
- **CMS-Techniken an ZWEI Stellen** in `public/admin/config.yml` pflegen
  (faktenchecks `techniken` + maschen `code`).
- **Frontmatter:** keine geraden `"` in Werten (normalize-Script fängt’s, aber
  bewusst typografische „…“ schreiben).

## Offene / mögliche nächste Schritte
- **O-Ton (Aussagen-Check mit Beleg) — Stufe-1-Mechanik gebaut (06/2026, PR #67):**
  Eigene Unterseite, bewusst vom Faktencheck-Schema **entkoppelt**, in der Navigation
  verlinkt. **Inhaltsstand (06/2026, PR #71): nicht mehr leer – 2 Einträge live, beide
  `in-pruefung`** (menschliches Gegenhören durch Patrick offen), über das Spektrum
  gestreut, beide mit **verbatim-Wortlaut aus dem amtlichen Plenarprotokoll**:
  Springer (AfD), „bis zu 4.000 €" Bürgergeld Ukrainer → *irrefuehrend* (PlenProt 21/14
  + Drs. 20/13346); Marvi (SPD), reichstes Prozent besitzt „rund 40 %" → *fehlender-kontext*
  (PlenProt 21/63 + DIW 29/2020, ~35,3 %). **Vor `geprueft`:** Mediathek-Videos
  gegenhören (Springer videoid=7633227, Marvi videoid=7649849); bei Springer für die
  Durchschnitts-/0,08 %-Werte ggf. BMAS-Drucksache als Primär-PDF nachziehen (steht
  derzeit über CORRECTIV als `sekundaer`). **Research-Loop hat `docs/oton-vorlage.md`
  verifiziert/priorisiert** (Goldstandard = amtl. Wortprotokoll; ASR nie als Zitat;
  aktuelle yt-dlp-Flags). **Backup-Entscheidung (06/2026): KEINE lokalen Video-Downloads/
  Clips** (frisst Speicher ohne genug Mehrwert) – Beleg trägt sich über Protokoll-PDF
  (plenar, permanent) bzw. optionalen Transkript-Auszug + Wayback-`archiv_url` (nicht-plenar).
  **Optionale Schema-Felder (PR #74): `transkript`** (klappbar „Wortlaut im Kontext") **+
  `archiv_url`** (Wayback-Fallback). **`techniken` werden auf der O-Ton-Detailseite als
  „Maschen in dieser Aussage" verlinkt** (PR #73; bei reinem Faktenfehler ohne Technik leer
  lassen – Pfad-A-Fairness). **Link-Pflege MANUELL (bewusst kein Auto-Agent):** alle paar
  Monate die `quelle_url`-Videos kurz öffnen und prüfen, ob sie noch *abspielen* (HTTP-200
  reicht nicht – YouTube/Mediathek liefern auch bei gelöschtem Video 200); tote → Mirror oder
  `archiv_url` setzen. Liste: `grep -h "quelle_url\|archiv_url" src/content/oton/*.md`.
  **Backlog-Fälle
  (recherchiert, aber nicht geschrieben):** Habeck „über 350.000 offene Haftbefehle"
  (ZDF Klartext 13.02.2025; klar *falsch* vs. BKA ~171.000 / Drs. 21/925 ~148.000 Personen)
  — kein verbatim-Wortlaut beschafft (nur Paraphrase), daher zurückgestellt; Linnemann (CDU)
  „weniger als die Hälfte in Arbeit" — nur Zeitungsinterview, **kein Video** → passt nicht
  ins O-Ton-Schema. Tonlage **Pfad A**: die *Aussage* wird geprüft,
  die Person ist belegte Quelle – kein Pranger, kein „garbage", Urteile aus dem festen Set.
  - **Sammlung `oton`** (`src/content/oton/*.md`, Schema in `content.config.ts`):
    `sprecher`, `funktion`, `zitat`, `quelle_url` (Video mit `&t=`-Zeitstempel), `plattform`,
    `datum`, `urteil`, `kurzantwort`, `einordnung`, `techniken`, `quellen` (≥1), `status`,
    `verwandt`. Seiten: `src/pages/o-ton/index.astro` (zeigt nur Nicht-Entwürfe) +
    `src/pages/o-ton/[...slug].astro` („Im O-Ton"-Block + Urteil/Kurzantwort/Einordnung/Quellen).
  - **Zwei Quell-Rollen (wichtig):** (1) `quelle_url` = Video = Nachweis, *dass* die Aussage
    fiel (am Video gegenhören: Wortlaut **+** Kontext; Datum + möglichst Archiv-Link, da Videos
    sterben). (2) `quellen` = Belege, *warum* es falsch/irreführend ist – **primär/amtlich/
    akademisch wie bei Faktenchecks**, Medien-Faktenchecks nur als Ergänzung. **Keine
    Digest-/Sekundärartikel als Hauptbeleg.** Vorlage + Leitfaden: `docs/oton-vorlage.md`.
  - **Status-Workflow:** neue Einträge `in-pruefung` → erst nach menschlichem Gegenhören des
    Videos auf `geprueft`. Unterseite erst verlinken, wenn 1–2 Einträge stehen.
  - **Risiken (eingebaut adressiert):** Fehlzitat = üble Nachrede → Pflicht-Gegenhören;
    „aus-dem-Kontext"-Vorwurf → Timestamp + Kontextsatz; Schmähkritik vermeiden → sachliches
    Urteil; **Pflege-Last** (Video-Links sterben) → Datum/Archiv-Link.
  - **Stufe 2 (offen, optional):** Transkript-Abruf via **Schwester-Cloudflare-Worker**
    (clientseitig unmöglich: CORS) → Baukasten-Vorbefüllung. Erst wenn Stufe 1 sich bewährt.
- ~~Whitelist verifizieren~~ ✅ erledigt (06/2026, siehe Stand oben).
- ~~Gish-Galopp, Bandwagon, Sündenbock, Firehose~~ ✅ umgesetzt (Sündenbock & Firehose
  bewusst maximal neutral/techniknah, mit Nutzer abgestimmt). **Noch offen im Backlog:**
  Newspeak (niedrige Priorität); Vernebelung (überlappt mit Gish-Galopp, verzichtbar);
  Angstrhetorik (laut Backlog als Abschnitt in „Emotionalisierung“ statt eigene Masche).
- ~~Themen-Balance Gesundheit~~ ✅ erster Gesundheits-Faktencheck da (Antibiotika).
  Weitere Themen außerhalb Migration/Klima weiterhin wünschenswert.
- **Gesundheits-Faktencheck abnehmen:** Quellen sind erreichbar + inhaltlich geprüft
  (IQWiG, WHO), aber Status `in-pruefung` – menschliches Gegenlesen fehlt für `geprueft`.
- **1-Klick-Einreichung im Baukasten** ✅ gebaut (OAuth+API, Fork-Fallback, Editor-Fallback)
  – **Happy-Path mit Nutzer am Live-Login testen** (Sandbox kann OAuth nicht prüfen).
- ~~Doku schön aufbereiten~~ ✅ umgesetzt (PR #33): On-Site-Seite
  `methodik/redaktionsstandards` (Methodik-Collection, reihenfolge 4, **ohne**
  `npm run`-/Technik-Details) – Nicht-Techniker:innen sehen einen lesbaren Leitfaden,
  technische Fassung bleibt in `docs/`. `mitmachen.astro` (Schreiben/Einreichen + CTAs)
  und README-„Mitmachen" führen jetzt mit dem **Faktencheck-Baukasten** (Live-Vorschau,
  1-Klick) statt GitHub-Raw-Dateien; README verlinkt die On-Site-Redaktionsstandards
  (absolute github.io-URLs), Entwickler:innen-Abschnitt bleibt eingeklappt.
- ~~Social-Media-Karten~~ ✅ umgesetzt (OG-/Twitter-Meta + Default-Karte, PR #3).
  Optionale Ausbaustufe: pro-Seite generierte OG-Bilder (Titel im Bild) via satori –
  bewusst NICHT gemacht (Default-Karte genügt, kein neues Dependency).
- **Projektname bleibt „Kompetenzzentrum“** (06/2026 mit Nutzer entschieden).
- **Externes Review (06/2026) – umgesetzt (PR #35):** ClaimReview-SEO, Maschen-OG,
  „Masche der Woche", Masche-Selbsttest, Status auf Karten, OAuth-Transparenz, Repo-Name.
  **Noch offen aus dem Review (bewusst nicht in PR #35):**
  - ~~**Themen-Balance (HOCH)**~~ ✅ teils umgesetzt: 4 „grün/links" konnotierte Checks
    ergänzt (Homöopathie, Atomkraft, Regional, Gentechnik) → entlastet die Schlagseite.
    Glyphosat ✅ ergänzt (PR #46, IARC+EFSA+ECHA als Nicht-Bayer-Primärquellen; `in-pruefung`).
    Weitere Kandidaten möglich (vegane Ernährung pauschal, 100% Ökolandbau ohne Importe).
  - ~~**5 `in-pruefung`-Checks auf `geprueft`**~~ ✅ 06/2026 erledigt (Wikipedia→Primärquellen).
  - ~~**4 neue Balance-Checks auf `geprueft`**~~ ✅ 06/2026 erledigt – Nutzer hat die Originale
    gegengelesen/Belege beschafft (NHMRC+EASAC, ISE 2024, ifeu, BfR/WHO/EFSA). **Alle 17
    Faktenchecks stehen jetzt auf `geprueft`.** Lernpunkt: parteiische Quellen konsequent
    ablehnen (Bayer bei Glyphosat, Ullman/Cureus bei Homöopathie) – nur primär/amtlich/akademisch.
  - **OAuth-Scope** des Baukastens (`scope=public_repo`, Zeile ~416) ist breit; verengen
    nur mit Live-Test, da es den funktionierenden Fork-Flow gefährden kann. Vorerst nur
    Transparenz-Hinweis ergänzt.
  - **Niedrig:** `astro check || true` in `ci.yml` schluckt Typfehler; `display:none`-Tiefen ggf.
    auf ARIA-Tab-Pattern (SEO ist aber ok, da statisch im DOM). (Inter-Font-Selbsthosting ist
    ✅ erledigt – `InterVariable.woff2` lokal in `public/fonts/`, kein Google-CDN mehr.)
- **Design-Politur Runde 1 (07/2026, Branch `claude/design-politur-r1`, in Review, NICHT live):**
  Owner-Auftrag „fertiges, zeitgeist-taugliches Produkt". 3 Eval-Agents (Design-Zeitgeist,
  IA/Code-Audit, A11y/Perf/SEO) → Befund: Fundament stark, „gebastelt"-Wirkung nur an den Nähten.
  Umgesetzt: **Dark-Mode-CTA-Kontrast-Fix** (neues Token `--c-on-accent`, dunkler Text auf hellem
  Akzent – war WCAG-Fail 2,47:1 auf allen Primär-Buttons/aktiven Filtern/Stufen-Schaltern);
  **IA:** Werkzeugkasten einheitlich benannt (vorher Nav „Selbst prüfen" ≠ Footer/URL), Footer =
  Header gespiegelt (O-Ton + Quiz ergänzt); **Startseiten-H1 tonal auf Pfad A** („Behauptungen
  prüfen — mit Belegen statt Meinung." statt „So wirst du manipuliert"); **Emoji-Icons → Lucide**
  (mitmachen); `robots.txt` + Sitemap-Verweis; per-Seite `og:image:alt`; Mobile-Touch-Ziele 44px;
  `.q-tag`-Duplikat entfernt. **SEO-Canonical/BASE_PATH war KEIN Problem** (Deploy setzt korrekt).
  Offen/Runde 2 (bewusst nicht gemacht, für Review): Spacing-Token-Skala, Masche-Card-Vereinheit-
  lichung, `.kurzantwort-box` als geteilte Klasse, restliche Emojis (Kopier-/Selbsttest-Button),
  optional Serif-Body / partei-neutrale Teal-Akzentfarbe (subjektiv → erst mit Nutzer).
