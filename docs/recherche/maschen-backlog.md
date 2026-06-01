# Maschen-Backlog (aus externer Recherche)

Ergebnisse aus Deep-Research-Prompts (Perplexity + Gemini, Mai/Juni 2026).
Die **5 stärksten** sind bereits umgesetzt (siehe unten). Hier stehen die
**zurückgestellten** Kandidaten mit Quellen, damit sie ohne erneute Recherche
gebaut werden können.

> **Pflicht vor Veröffentlichung:** Jede Quelle im **Volltext** lesen und prüfen,
> ob sie das Beispiel wirklich stützt (siehe `docs/redaktionsstandards.md`).
> Die hier gelisteten URLs stammen aus KI-Recherche und sind teils nur per
> Such-Snippet gegengeprüft – nicht ungelesen übernehmen.

## Bereits umgesetzt (10 → 19)
Whataboutism · Falsche Verknüpfung (Clickbait) · Astroturfing ·
Identitätsschwindel (Doppelgänger) · Falsche Ausgewogenheit (False Balance) ·
**Gish-Galopp** (16) · **Mehrheits-Argument / Bandwagon** (17) ·
**Sündenbock** (18) · **Lügen-Flut / Firehose** (19).

Verbleibend zurückgestellt: Newspeak (niedrige Prio), Vernebelung (überlappt mit
Gish-Galopp, verzichtbar), Angstrhetorik (als Abschnitt in „Emotionalisierung“).

---

## Zurückgestellt – Kandidaten

### 1. Gish-Galopp (Behauptungs-Flut, 1:1-Debatte) — ✅ UMGESETZT (06/2026)
- **Was:** In kurzer Zeit eine Flut von Behauptungen/Halbwahrheiten, sodass
  Widerlegen unmöglich wird (Brandolinis Gesetz). Kategorie: rhetorik.
- **Umsetzung:** `src/content/maschen/gish-galopp.md`, reihenfolge 16. Beispiel
  ankert am dokumentierten Ursprung (Duane Gish / Eugenie Scott 2004) + Alltags-
  muster (E-Mobilität-Schwall), Quelle = Wikipedia (Volltext geprüft, 200).
  Brandolinis Gesetz separat verifiziert (de.wikipedia.org/wiki/Brandolinis_Gesetz).

### 2. Firehose of Falsehood (Lügen-Feuerwehrschlauch) — ✅ UMGESETZT (06/2026)
- **Was:** Massenhaft, schnell, über viele Kanäle widersprüchliche Falschmeldungen
  → Ziel ist Zynismus („man kann eh nichts glauben“), nicht Überzeugung. Propaganda/RAND.
- **Umsetzung:** `src/content/maschen/firehose.md`, code `firehose`, reihenfolge 19.
  Neutral gehalten: Mechanismus + RAND-Ursprung (Paul/Matthews 2016) faktisch genannt,
  Beispiel als allgemeines Muster „nach einem großen Ereignis“ (kein aktuelles
  geopolitisches Reizbeispiel). Querverweis auf Gish-Galopp (1:1 vs. Masse).
  Quelle Wikipedia (Volltext geprüft, 200).

### 3. Sündenbock / Scapegoating — ✅ UMGESETZT (06/2026)
- **Was:** Eine Gruppe wird pauschal für komplexe Probleme verantwortlich gemacht.
- **Umsetzung:** `src/content/maschen/suendenbock.md`, code `suendenbock`,
  reihenfolge 18. **Neutral gehalten (Pfad A):** ausdrücklich „Technik, keine
  Richtung“ – Beispieltargets über alle Lager gestreut („die Ausländer“ / „die
  Eliten“ / „die Konzerne“ / „die Boomer“), neutrales Mieten-Beispiel statt
  Migrationsfokus. Mechanismus (Frustration→Aggression, René Girard) + historischer
  Hinweis. Quelle Wikipedia (Volltext geprüft, 200).

### 4. Bandwagon / Mehrheits-Argument (argumentum ad populum) — ✅ UMGESETZT (06/2026)
- **Was:** „Das sehen doch alle so“ ersetzt Belege; sozialer Konformitätsdruck.
- **Umsetzung:** `src/content/maschen/bandwagon.md`, code `bandwagon`, reihenfolge 17.
  Beispiel „schweigende Mehrheit“; Quelle = Wikipedia *Argumentum ad populum*
  (Volltext geprüft, 200). Bewusst als eigene rhetorik-Masche (alltagsnah).

### 5. Euphemismus / Newspeak (Umdeutung durch Sprache)
- **Was:** Belastete Begriffe durch harmlose ersetzen („Spezialoperation“ statt Krieg).
- **Quellen:** disinfo.detector.media (special-military-operation) · fidh.org · pravda.com
- **Hinweis:** Eher staatspropaganda-spezifisch; für dt. Alltag schwächeres Beispiel.
  Niedrigere Priorität.

### 6. Vernebelung / Obfuscation
- **Was:** Absichtlich vage/widersprüchliche Aussagen, um Prüfung zu erschweren.
- **Quellen:** eprints.whiterose.ac.uk (2601.14105) · „muddy the waters“
- **Hinweis:** Überlappt stark mit Gish-Galopp. Wahrscheinlich nicht eigenständig nötig.

### 7. Angstrhetorik / Fear Appeal
- **Was:** Steuerung primär über Angst (Untergangs-/Bedrohungsbilder).
- **Hinweis:** **Unterart der bestehenden Masche „Emotionalisierung“.** Besser dort
  als Abschnitt ergänzen statt eigene Masche.

---

## Referenz: Quell-Domain-Allowlist (Netzwerk-Policy)
Falls die Custom-Allowlist erweitert werden muss (claude.ai/code → Environment →
Network access → Custom). Aktuell genutzte/erwartete Quell-Domains:

```
*.destatis.de *.bka.de *.bundesnetzagentur.de *.umweltbundesamt.de *.bpb.de
*.bmwk.de gesetze-im-internet.de *.fraunhofer.de *.svr-migration.de
mediendienst-integration.de *.bertelsmann-stiftung.de *.iab.de smard.de
*.verbraucherzentrale.de *.adac.de correctiv.org *.correctiv.org klimafakten.de
*.klimafakten.de klimadialoge.de riffreporter.de *.riffreporter.de lobbypedia.de
neuemedienmacher.de *.neuemedienmacher.de *.wikipedia.org auswaertiges-amt.de
*.auswaertiges-amt.de tagesschau.de *.tagesschau.de
```
Sinnvolle Ergänzungen: dpa-Faktencheck, Science Media Center, EUvsDisinfo, edmo.eu.

**Whitelist-Test (06/2026):** Volltext-Abruf bestätigt für correctiv.org, destatis.de,
riffreporter.de, *.wikipedia.org, bpb.de, edmo.eu, who.int, rki.de,
gesundheitsinformation.de (IQWiG), pei.de, bzga.de, svr-migration.de.
**Ausnahme:** `tagesschau.de` → „Blocked by egress policy“ (trotz Listung). Wer
tagesschau-Quellen braucht, muss die Domain in der Custom-Allowlist ergänzen oder
eine Alternativquelle wählen. (svr-migration.de nur mit Browser-User-Agent, sonst 403.)
