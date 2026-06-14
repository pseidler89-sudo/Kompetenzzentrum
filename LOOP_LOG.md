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
