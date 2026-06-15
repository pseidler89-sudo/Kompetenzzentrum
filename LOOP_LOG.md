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
