# LOOP_LOG – SIA-/RL-inspirierter Self-Improvement-Prozess

Protokoll der Verbesserungs-Loops: Findings (Severity/Confidence), angewandte
Änderungen und **echte Verifikation** (failing baseline → Fix grün, nicht behauptet).
Rolle: Verbesserer **und** adversarialer Verifier (kritisiert auch eigene frühere Loops).

## Verifier (real ausführbar)

| Verifier | Befehl | Deckt ab |
|---|---|---|
| Inhaltsprüfung | `npm run validate` | 3 Tiefen, `pruefen`, `verwandt`-Slugs, gerade Quotes, **Struktur-Konsistenz (neu, Loop 1)** |
| Build/Schema | `npm run build` | Zod-Schema, Quellen-Pflicht, Enum-Werte |
| Typen | `npx astro check` | TS-/Astro-Typfehler (**ab Loop 1 echter CI-Gate, kein `\|\| true` mehr**) |
| Quellen-Links | `npm run check:links` | URL-Erreichbarkeit (nur CI/offenes Netz) |

---

## Loop 1 — Verifier-Enablement  (2026-06-14)

**Ziel:** Den Verifier real machen, bevor inhaltlich verbessert wird. Die fragilste
dokumentierte Invariante (Technik-Enum an vier Stellen) war nicht maschinell geprüft.

### Findings

| ID | Finding | Severity | Confidence | Status |
|---|---|---|---|---|
| F1.1 | Kein Check der 4-Stellen-Enum-Invariante (`TECHNIKEN` ↔ `labels.ts` 4 Maps ↔ `config.yml` 2× ↔ Maschen-`code`) | hoch | hoch | ✅ behoben |
| F1.2 | Kein 1:1-Check „jede Technik genau eine Masche-Datei“ | mittel | hoch | ✅ behoben |
| F1.3 | `astro check` war CI-No-Op (`\|\| true`) + lokal nicht installiert → Typfehler unsichtbar | mittel | hoch | ✅ behoben |
| F1.4 | FLICC-Widerspruch: Doku „genau 5“ vs. Daten = 6 (`falsche-kausalitaet` als 6. flicc) | mittel | hoch | ✅ behoben (Nutzer-Entscheid) |
| F1.5 | Kein Check „FLICC == kanonische 5“ | niedrig | mittel | ✅ behoben |

### Angewandte Änderungen
- **Neu `scripts/check-consistency.mjs`** (zero-dep): prüft F1.1/F1.2/F1.5 + FLICC-reihenfolge 1–5.
  Eingehängt in `npm run validate` **und** `npm run build`.
- **`falsche-kausalitaet.md`**: `kategorie` flicc → rhetorik (Nutzer-Entscheid F1.4) →
  kanonische FLICC-5 nach Cook 2020 wiederhergestellt. `reihenfolge` 6 bleibt → flicc 1–5,
  rhetorik 6–19 lückenlos, keine weitere Umnummerierung nötig.
- **`.github/workflows/ci.yml`**: `npx astro check || true` → `npx astro check` (echter Gate).
- **`package.json`**: devDeps `@astrojs/check` + `typescript` (vom Nutzer freigegeben).
- **CLAUDE.md**: FLICC-Reihenfolge-Notiz auf 1–5 korrigiert + Verweis auf den neuen Check.

### Verifikation (echt ausgeführt)
**F1.1/F1.2/F1.5 – failing baseline per Defekt-Injektion (jeweils temporär, danach restauriert):**
- FLICC zurück auf 6 → Skript `exit 1` („erwartet genau die 5 Kerntechniken“). ✅
- Key `bandwagon` aus `TECHNIK_LABEL` entfernt → `exit 1` („fehlende Codes [bandwagon]“). ✅
- Masche-`code` `firehose`→`firehose-x` → `exit 1` (1:1 verletzt + nicht in TECHNIKEN). ✅
- Restauriert → `exit 0` („19 Techniken deckungsgleich, FLICC=5“). ✅

**F1.3 – failing baseline:**
- `STATUS_LABEL` ein `kaputt: 123` (number in `Record<string,string>`) → `astro check` `1 error`, `exit 1`. ✅
- Restauriert → `0 errors`, `exit 0`. ✅
- Ausgangs-Typstand vor Fix: 0 errors / 0 warnings / 6 hints → Entfernen von `|| true` bricht CI **nicht**, schärft sie nur.

**End-to-end:** `npm run validate` ✅ · `npm run build` ✅ (49 Seiten) · `npx astro check` ✅ (0 errors).

---

## Loop 2 — Korrektheit & Kohärenz  (2026-06-14)

**Ziel:** Mit dem neuen Verifier reale Drifts/Robustheitslücken jagen — und die
Outputs von Loop 1 selbstkritisch prüfen.

### CI-Hotfix (während Loop 2, unblockte PR #45)
- **Toter Quellen-Link:** UBA-„Texte 32/2020"-PDF lieferte **404** (UBA-Ablage umgebaut)
  → CI-Job `quellen-links` rot. Ersetzt durch die stabile Publikations-Landingpage
  `umweltbundesamt.de/publikationen/entwicklungsperspektiven-der-oekologischen`.
  **Verifikation:** Ziel-URL per WebFetch geprüft → 200, korrekte Publikation, stützt
  die Aussage („gut, aber nicht in jeder Einzelkennzahl überlegen"). Die zwei `[UNKLAR]`-
  Timeouts (lobbypedia, nhmrc) sind transient → nur Warnung, kein CI-Bruch.

### Findings

| ID | Finding | Severity | Confidence | Status |
|---|---|---|---|---|
| M2.1 | `normalize-frontmatter.mjs` heilte `maschen` nicht (nur faktenchecks+methodik) → Self-Healing-Garantie inkonsistent | mittel | hoch | ✅ behoben |
| M2.2 | Straight-Quote-Frühwarnung lief nur über faktenchecks | niedrig | hoch | ✅ behoben |
| M2.3 | **Selbstkritik Loop 1:** `check-consistency` prüfte nur TECHNIKEN, nicht THEMEN/URTEILE/STATUS | mittel | hoch | ✅ behoben (Guard) |
| M2.4 | `zusammensetzung`-Grafiken ohne Summe-≈100-Prüfung (Invariante „ehrliche Skalierung") | niedrig | mittel | ✅ behoben |

### Angewandte Änderungen
- `normalize-frontmatter.mjs`: `src/content/maschen` in `ORDNER` (M2.1).
- `validate-content.mjs`: Quote-Check als Helper, zusätzlich `quotesScan` über maschen+methodik (M2.2);
  neuer Summe-≈100-Check für `zusammensetzung`-Grafiken (M2.4, harter Fehler bei |Σ−100|>1).
- `check-consistency.mjs`: THEMEN ↔ THEMA_LABEL/THEMA_REIHENFOLGE, URTEILE ↔ URTEIL_LABEL,
  STATUS ↔ STATUS_LABEL (M2.3). Aktueller Stand verifiziert grün → reiner Regression-Guard.

### Verifikation (echt ausgeführt, failing baseline → restauriert)
- **M2.4:** `zusammensetzung`-Wert 40→50 (Σ=110) → `validate-content` `exit 1`. ✅
- **M2.1:** gerades `"` in Masche-`titel` injiziert → `normalize` heilt es zu „…" (vorher gar nicht erfasst). ✅
- **M2.3:** `gesundheit` aus `THEMA_LABEL` entfernt → `check-consistency` `exit 1` („THEMEN ↔ THEMA_LABEL: fehlt [gesundheit]"). ✅
- Restauriert → `npm run validate` ✅, `npm run build` ✅ (49 Seiten), Arbeitsbaum sauber.

### Beobachtungen (kein Handlungsbedarf jetzt)
- ClaimReview-`URTEIL_RATING` (1–3 auf 1–5-Skala) konsistent & schema-konform.
- „Masche der Woche"-Rotation deterministisch (nach `reihenfolge` sortiert, Jahres-Wochen-Modulo).
- `quellen-links`-Log mischt stderr/stdout → Gruppierung im CI-Log wirkt irreführend (Summary „Tot:1" ist maßgeblich). Kosmetisch, ggf. Loop 4/5.

---

## Loop 3 — Invarianten-Treue (Pfad A / Quellen)  (2026-06-15)

**Ziel:** Die inhaltlichen Kern-Garantien (Neutralität, Primärquellen-Sichtbarkeit,
Konkretheit) prüfen und – wo sinnvoll – maschinell verankern.

### Findings

| ID | Finding | Severity | Confidence | Status |
|---|---|---|---|---|
| L3.1 | `regional-immer-klimafreundlich` (`geprueft`) ruhte auf einer einzigen `sekundaer`-Quelle (ifeu-PM) → kein sichtbarer Primär-/amtlich-Anker | mittel | hoch | ✅ behoben (Nutzer-Entscheid) |
| L3.2 | „`geprueft` ⇒ ≥1 Primärquelle" war nicht geprüft | niedrig | mittel | ✅ als Warnung verankert |
| L3.3 | Konkretheit/Beleg der Maschen (`beispiel` + `beispiel_quelle.url`) nicht geprüft | niedrig | hoch | ✅ als Guard verankert |
| Neutralität | Red-flag-Scan (`gegen rechts`/Personen) | — | hoch | ✅ geprüft, compliant – keine Änderung |

### Angewandte Änderungen
- `regional-immer-klimafreundlich.md`: ifeu-Quelle `art` sekundaer → **primaer**
  (ifeu = forschende Institution, PM zur eigenen Studie; Nutzer-Entscheid).
- `validate-content.mjs`: **Warnung**, wenn ein `geprueft`-Check keine `primaer`-Quelle trägt (L3.2).
- `check-consistency.mjs`: **Guard** – jede Masche braucht `beispiel` + `beispiel_quelle.url` (L3.3).

### Verifikation (echt ausgeführt)
- **L3.2:** regional temporär zurück auf `sekundaer` → Warnung erscheint; mit `primaer` weg. ✅
- **L3.3:** `beispiel_quelle.url` aus einer Masche entfernt → `check-consistency` `exit 1`. ✅
- **Neutralität:** 2 Red-flag-Treffer manuell geprüft – beide zitieren die amtliche
  Verfassungsschutz-Einordnung einer *Erzählung* (nicht Personen, kein „gegen rechts") → compliant.
- Restauriert → `validate` ✅, `build` ✅ (49 Seiten), Baum sauber.

### Stop-Regel-Notiz
Loop 3 war inhaltlich dünn (1 echte Fundstelle + Guards) → bestätigt: der Grenznutzen
weiterer Verifier-Loops sinkt. Auf Nutzer-Wunsch folgen dennoch Loop 4 (Sicherheit/
Datenschutz, konkrete Review-Punkte) und Loop 5 (UX/Barrierefreiheit).

---

## Loop 4 — Sicherheit & Datenschutz  (2026-06-15)

**Verifier:** manueller Sicherheits-Review der bestehenden Angriffsfläche
(Fonts/Tracking, set:html-Render-Pfade, OAuth, Baukasten-Vorschau) + Build/astro check.

### Findings

| ID | Finding | Severity | Confidence | Status |
|---|---|---|---|---|
| S4.1 | Google-Fonts-CDN (`fonts.googleapis/gstatic`) lädt Inter → Besucher-IP an Google (vs. „trackingfrei") | mittel | hoch | ✅ behoben |
| S4.2 | Inhaltsfelder via `md()`/marked **ohne** Sanitisierung gerendert → Stored-XSS-Vektor (eingereichte Inhalte) | mittel | mittel | ✅ behoben |
| S4.3 | `Datenviz` `set:html` für `daten`-Titel/Hinweis roh | niedrig | mittel | ✅ behoben |
| S4.4 | OAuth-Scope `public_repo` breit | niedrig | hoch | 📝 dokumentiert (nicht geändert – braucht Live-OAuth-Test) |
| S4.5 | Self-XSS in Baukasten-Live-Vorschau | niedrig | niedrig | ✅ Verifikation: bereits sicher (esc-first), keine Änderung nötig |

### Angewandte Änderungen
- **S4.1 Fonts selbst gehostet:** `public/fonts/InterVariable.woff2` (variabler Font, 100–900,
  ~344 KB, von rsms.me, `wOF2`-verifiziert). `BaseLayout` lädt jetzt per `@font-face` + `preload`
  (basepfad-korrekt via `pfad()`); Google-`<link>`/`preconnect` entfernt. Auch in der Legacy-Datei
  `public/tools/grafik.html` den Google-Fonts-Block entfernt (relativer `../fonts/`-Pfad).
  **Ergebnis:** keine einzige `googleapis`/`gstatic`-Referenz mehr im gesamten `dist/`.
- **S4.2 marked gehärtet:** eigene `Marked`-Instanz mit `html`-Renderer, der Roh-HTML **escaped**
  (sichtbar, inert) statt durchzureichen. Markdown-Formatierung bleibt voll erhalten.
- **S4.3 Allowlist:** neue `sicherInline()` (nur `<strong>`/`<em>`, Rest escaped) für die zwei
  `set:html`-Stellen in `Datenviz` (titel, hinweis).

### Verifikation (echt ausgeführt)
- **S4.1:** `dist/`-Grep nach `googleapis|gstatic` → **0 Treffer** (vorher in BaseLayout + grafik.html).
  woff2 magic-bytes `wOF2`, 352 240 B. Build referenziert `…/fonts/InterVariable.woff2`.
- **S4.2:** `md("… <img src=x onerror=alert(1)> <script>alert(2)</script> **fett**")` →
  `&lt;img…onerror…&gt;`, `&lt;script&gt;` (escaped, **kein** ausführbares Tag), `**fett**`→`<strong>` erhalten.
  Gegen die identische Renderer-Logik direkt ausgeführt.
- **S4.3:** Datenviz-`<strong>` im gerenderten `strompreise`-HTML erhalten; `sicherInline("… <img onerror=y> <em>z</em>")`
  → `&lt;img onerror=y&gt;` escaped, `<em>` erhalten.
- **S4.5:** Code-Review der Vorschau: jedes Feld via `esc()` bzw. `inline()` (= `esc` zuerst, nur `**bold**`
  re-aktiviert) → bereits XSS-sicher; keine Änderung (eine wäre redundant).
- Build ✅ (49 Seiten), `astro check` ✅ (0 errors), `validate` ✅.

### S4.4 – bewusst NICHT geändert
OAuth-Scope `public_repo` bleibt. Verengen würde den funktionierenden Fork-/PR-Flow gefährden
und ist in der Sandbox nicht testbar (kein Live-OAuth). Positiv: Das Token wird **nicht persistiert**
(nur transient im Login-Flow). Empfehlung: Scope nur zusammen mit einem Live-Login-Test verengen.

---

## Loop 5 — UX & Barrierefreiheit  (2026-06-15)

**Verifier:** Code-Review der a11y-Fläche + Kontrast-Rechnung (WCAG) + Build/astro check.

### Befund: a11y-Grundstand bereits sehr gut
`<html lang="de">`, Skip-Link, `:focus-visible`-Outline, `@media (prefers-reduced-motion)`,
`aria-pressed` an den Stufen-Buttons, `aria-label` an Nav/Toggle/Burger, `aria-hidden` an
Icons, korrektes **No-JS-Fallback** der Tiefen (`[data-stufe-aktiv]`-Selektor greift erst mit JS) —
alles vorhanden. **Nur ein echter Bug.**

### Findings

| ID | Finding | Severity | Confidence | Status |
|---|---|---|---|---|
| U5.1 | Datenviz `zusammensetzung`: `color:#fff` auf **theme-abhängigen** Segment-Füllungen → Kontrast-Fail bei `neutral` (Hellmodus) **und** flächendeckend im Dunkelmodus (Tokens kippen auf hell) | mittel | hoch | ✅ behoben |
| U5.2 | `theme-toggle` ohne `aria-pressed` | niedrig | niedrig | ✅ ergänzt |

### Angewandte Änderungen
- **U5.1:** neue **feste, dunkle Segment-Palette** `segFarbe()` nur für den gestapelten Balken
  (und seine Legende). Theme-unabhängig → weißer Text bleibt in **beiden** Themes lesbar.
- **U5.2:** `theme-toggle` setzt nun `aria-pressed` = „Dunkelmodus aktiv" (zusätzlich zum aria-label).

### Verifikation (echt ausgeführt)
- **U5.1:** Gerendertes `strompreise`-HTML – Segmente jetzt `#1c5fc4` / `#4a5560` / `#5b6472`
  (vorher u.a. `var(--c-border-strong)` = hellgrau). Kontrast weiß-auf-Füllung berechnet:
  `#5b6472` ≈ **6,0:1**, `#4a5560` ≈ 7,5:1, `#1c5fc4` ≈ 5,9:1 → alle ≥ WCAG AA (4,5:1),
  in Hell- UND Dunkelmodus (Werte sind jetzt fix, kippen nicht mehr).
- **U5.2:** `aria-pressed` im Toggle-Skript gesetzt (Build + astro check 0 errors).
- Build ✅ (49 Seiten), `validate` ✅, `astro check` ✅.

---

## Abschluss & Stop-Regel

**5 Loops abgeschlossen.** Der Verifier wurde von „kaum vorhanden" (Schema-Build + toter
`astro check`) zu einem **realen, mehrschichtigen Gate** ausgebaut:
`normalize → validate-content → check-consistency → astro build → astro check` (+ `check:links` in CI).

Substanz-Ertrag pro Loop sank klar (L1/L2 strukturell stark, L4 zwei echte Sicherheits-/
Datenschutz-Fixe, L3/L5 je **ein** echter Befund + Guards). **Empfehlung: hier vom
„Spezifizieren/Verifizieren" auf „Bauen/Liefern" wechseln.** Offenes Backlog (bewusst NICHT
als weitere Loops poliert):
- OAuth-Scope `public_repo` verengen — **nur mit Live-Login-Test** (Sandbox kann den Fork-Flow nicht prüfen).
- `quellen-links`-Reporter: stderr/stdout-Interleaving im CI-Log entwirren (kosmetisch).
- Legacy `public/tools/grafik.html` ganz entfernen (nirgends verlinkt).
- Inhaltliche Themen-Balance weiter ausbauen (Glyphosat braucht 2. Nicht-Bayer-Primärquelle).

---

# Usability-Loops (U1–U3) — Fokus: Einfachheit & Verständnis für politisch wenig vorgebildete Menschen

## Loop U1 — Verständlichkeit messbar machen  (2026-06-15)
**Verifier-first:** neues `scripts/check-readability.mjs` (`npm run check:readability`, zero-dep)
misst je `einstieg`-Feld die **Wiener Sachtextformel** + Ø Satzlänge, Lange-/Mehrsilbige-Wort-Quote,
Nominalisierungsdichte und kuratierte **Jargon**-Begriffe.
- **Baseline:** Ø WSTF 8.2; 2 Einstiege > Schwelle 10 (buergergeld 10.7, gentechnik 10.6); Jargon: novelliert, Stromgestehungskosten.
- **Metrik gegengeprüft:** einfacher Satz → −2.9, bürokratischer Satz → 21.4 (diskriminiert sauber).
- Bewusst Report-Modus (kein Build-Gate); `--strict` optional.

## Loop U2 — Klartext & Orientierung  (2026-06-15)
**Angewandt (Nutzer-Abnahme: Nav-Variante „Selbst prüfen/Wie wir arbeiten", Batch A–E):**
- **A Hero:** Kicker „Stimmt das wirklich?", Lead in Alltagssprache (kein „Nachschlagewerk gegen Desinformation"),
  H1 „… alles zum Nachprüfen" (statt „Nachvollziehbarkeit").
- **B Nav umbenannt:** Werkzeugkasten → **Selbst prüfen**, Methodik → **Wie wir arbeiten**
  (inkl. Seitenüberschriften/`titel`). „Maschen"/„Faktenchecks" bleiben.
- **C Urteils-Klartext:** neue `URTEIL_KLARTEXT`-Map (Halbsatz je Urteil; Anzeige in U3).
- **D Einstiege vereinfacht** (Fakten/Quellen unverändert): buergergeld + gentechnik sprachlich entzerrt;
  Jargon-Swaps „novelliert"→„neu gefasst", „Stromgestehungskosten"→Klartext.
- **E Orientierung:** „Neu hier?"-Zeile auf der Startseite mit einer klaren Hauptaktion.

**Verifikation (echt ausgeführt, U1-Verifier als Messlatte):**
- `check-readability` **vorher→nachher:** buergergeld 10.7→7.2 · gentechnik 10.6→9.6 ·
  heizungsgesetz Jargon weg · atomkraft Jargon weg · **0 über Schwelle (vorher 2), 0 Jargon (vorher 2)**, Ø 8.2→7.9.
- Build ✅ (49 Seiten), `validate` ✅, `astro check` ✅ (0 errors); neue Nav-Labels im `dist/` bestätigt.

## Loop U3 — UI für Einfachheit  (2026-06-15)
**Angewandt:**
- **Urteils-Klartext sichtbar:** Auf jeder Faktencheck-Detailseite steht jetzt unter dem
  Urteils-Badge ein Klartext-Halbsatz (z.B. „Irreführend" → „Einzelne Fakten stimmen, das
  Gesamtbild täuscht."). `UrteilBadge` trägt den Klartext zusätzlich als `title` – greift
  auch auf den Karten (Hover/Screenreader).
- **Tiefen-Umschalter:** Label „Informationstiefe" → **„Wie ausführlich?"**, Hinweis
  alltagsnäher („Du kannst jederzeit wechseln …").

**Verifikation (echt ausgeführt):**
- Gerendertes `migration-kriminalstatistik` (urteil=irrefuehrend) zeigt im `dist/` die
  Klartext-Zeile; Wording „Wie ausführlich?" im HTML bestätigt.
- Build ✅ (49 Seiten), `validate` ✅, `astro check` ✅ (0 errors).

### Abschluss Usability-Loops
„Einfach genug für Laien?" ist jetzt **messbar** (U1-Verifier) und an konkreten Stellen
**spürbar verbessert** (Hero/Nav/Einstiege/Urteils-Klartext). Offen/Backlog: echtes
Nutzer-Testing (nur mit realen Menschen möglich – Proxys ersetzen das nicht); Urteils-
Klartext auch auf den Karten sichtbar statt nur im `title`; ggf. Detailseite im
Einstieg-Modus weiter entschlacken.

## Loop U3+ — Backlog abgearbeitet (Karten-Klartext + Einstieg-Entschlackung)  (2026-06-15)
- **Urteils-Klartext auf den Faktencheck-Karten:** `FaktencheckCard` zeigt den Halbsatz
  (`URTEIL_KLARTEXT`) jetzt sichtbar unter dem Badge – nicht nur im `title`.
- **Detailseite im Einstieg-Modus entschlackt:** Die längere `einleitung` wird in der
  Einstieg-Stufe ausgeblendet (erscheint ab „Vertiefung"). Umsetzung sauber über das
  bestehende Tiefen-Mechanik: `data-faktencheck-body` (und damit `data-stufe-aktiv`) liegt
  jetzt am `<article>`, sodass auch Elemente außerhalb des Prosa-Blocks tiefenabhängig sind.
- **Verifikation:** Karten-Klartext im gerenderten `dist/faktenchecks/index.html`;
  CSS-Regel `[data-stufe-aktiv=einstieg] .fc-einleitung{display:none}` im Bundle (auf
  Einstieg **gegated**, ohne JS bleibt die Einleitung sichtbar → PE intakt);
  Build ✅, `validate` ✅, `astro check` ✅ (0 errors).

## Loop U3++ — Einstieg-Modus weiter entschlackt  (2026-06-15)
- **„Erkannte Maschen"-Zeile** erscheint erst ab „Vertiefung" (`.fc-techniken`, CSS auf
  Einstieg gegated – ohne JS sichtbar).
- **„Technik erkannt"-Box** ist jetzt ein `<details>`: im Einstieg eingeklappt, ab
  „Vertiefung" aufgeklappt. `<details open>` per Default (ohne JS offen → kein
  Informationsverlust); der Tiefen-Umschalter setzt `details.open = stufe !== "einstieg"`.
  Eigenes Chevron, das beim Aufklappen rotiert.
- **Verifikation:** gerendert als `<details class="box box-technik" … open>` + `<summary>`;
  Bundle enthält `[data-stufe-aktiv=einstieg] .fc-einleitung,…  .fc-techniken{display:none}`.
  Build ✅, `validate` ✅, `astro check` ✅ (0 errors).

---

# Liefern-Loop (L-1 … L-3) — Fokus: Bauen/Liefern statt Spezifizieren/Verifizieren  (2026-06-16)

Stop-Regel aus L5 umgesetzt: vom Verifizieren auf **Bauen/Liefern** gewechselt.
Pro Iteration: höchstwertiges Backlog-Item → Feature-Branch → echte Verifikation
(`validate`/`build`/`astro check`/`check:readability` + Render-Check im `dist/`) →
PR → CI grün → Merge → **Live-Check** (200 + Inhalt im HTML). Kein neues Runtime-Dep.

## L-1 — UI  (PR #48, #49)
- **#48 Faktencheck-Liste: Filter/Suche in der URL.** Vorher wurde nur `?q=` beim Laden
  gelesen; Thema/Urteil/Masche waren nicht teilbar/bookmarkbar, Back-Button tot. Jetzt
  `?thema=&urteil=&technik=&q=` (Filter-Klick=pushState, Tippen=replaceState, `popstate`
  stellt wieder her, unbekannte Werte → `alle`, PE bleibt). **Verif.:** build/astro check
  grün, Deep-Link `?technik=cherry-picking` live = 200.
- **#49 Maschen-Liste: Suche + Kategorie-Filter.** 19 Maschen waren komplett ungefiltert.
  Suchfeld (Titel/Kurz/Code) + Umschalter (Alle/Kerntechniken/Weitere), leere Sektionen
  ausgeblendet, Empty-State, PE. **Verif.:** build/astro check grün, live.

## L-2 — Erweiterungen  (PR #50)
- **Quiz `/quiz`** „Erkennst du die Masche?": build-time-Daten aus Maschen mit `beispiel`,
  clientseitige Logik (8 zufällige Fragen, 4 Optionen, Sofort-Feedback + Link zur Masche,
  Score), verlinkt von Maschen-Seite (Banner) + Werkzeugkasten, `noscript`-Fallback.
- **RSS `/rss.xml`**: RSS 2.0 der neuesten Faktenchecks, XML von Hand (kein `@astrojs/rss`),
  absolute URLs via `site`+`pfad`, im `<head>` als `alternate`. **Verif.:** build 51 Seiten,
  astro check 0 errors, live `/quiz`=200, `/rss.xml`=200 mit 18 Items.

## L-3 — Inhalt: 2 neue Checks in dünnen Themen  (PR #51, Status `in-pruefung`)
- **Wahlbetrug/Briefwahl** (demokratie-medien, *falsch*): dezentrale öffentliche Auszählung,
  Papierbelege, Briefwahl-Sicherungen; falsche-kausalitaet „Brief≠Urne=Betrug". Quellen:
  Bundeswahlleiterin (2×) + bpb (alle 200, primär).
- **Deutschland EU-Zahlmeister** (wirtschaft-soziales, *fehlender-kontext*): konzediert
  den wahren Teil (größter Nettozahler, 13,1 Mrd 2024), zeigt Saldo = reine Kassen-Rechnung
  ohne Binnenmarkt-Nutzen. Quellen: bpb + EU-Kommission (200, primär).
- Beide rechts/euroskeptisch konnotiert → **Balance** zum grün-konnotierten Glyphosat.
- **Verif.:** validate 20 Checks, build 53 Seiten + OG, astro check 0 errors, readability
  WSTF 7.2/4.6 (0 über Schwelle, 0 Jargon), Quell-URLs 200, beide Detailseiten live = 200.
- **Offen (menschlich):** Gegenlesen der Originale → dann `geprueft`.

### Abschluss Liefern-Loop
Drei Phasen geliefert (UI · Erweiterungen · Inhalt), je echt verifiziert und live geprüft.
Backlog für künftige Iterationen: Quiz-Verlinkung auch von der Startseite; Urteils-Filter
auch in der Suche kombinierbar darstellen (Chips); weitere Checks in `kriminalitaet-sicherheit`
(noch nur 1); Legacy `public/tools/grafik.html` entfernen.
