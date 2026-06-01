# Maschen-Backlog (aus externer Recherche)

Ergebnisse aus Deep-Research-Prompts (Perplexity + Gemini, Mai/Juni 2026).
Die **5 stärksten** sind bereits umgesetzt (siehe unten). Hier stehen die
**zurückgestellten** Kandidaten mit Quellen, damit sie ohne erneute Recherche
gebaut werden können.

> **Pflicht vor Veröffentlichung:** Jede Quelle im **Volltext** lesen und prüfen,
> ob sie das Beispiel wirklich stützt (siehe `docs/redaktionsstandards.md`).
> Die hier gelisteten URLs stammen aus KI-Recherche und sind teils nur per
> Such-Snippet gegengeprüft – nicht ungelesen übernehmen.

## Bereits umgesetzt (10 → 15)
Whataboutism · Falsche Verknüpfung (Clickbait) · Astroturfing ·
Identitätsschwindel (Doppelgänger) · Falsche Ausgewogenheit (False Balance).

---

## Zurückgestellt – Kandidaten

### 1. Gish-Galopp (Behauptungs-Flut, 1:1-Debatte)
- **Was:** In kurzer Zeit eine Flut von Behauptungen/Halbwahrheiten, sodass
  Widerlegen unmöglich wird (Brandolinis Gesetz). Kategorie: rhetorik.
- **Beispiel-Idee:** Talkshow/Online-Debatte; Leserbrief mit Dauerfeuer an
  „dass…“-Sätzen zur E-Mobilität. **Braucht ein besser belegbares konkretes Beispiel.**
- **Quellen:** de.wikipedia.org/wiki/Gish-Galopp · dergoldenealuhut.de/gish-galopp
- **Hinweis:** Sehr nützlich für den Diskussions-Use-Case. Priorität hoch, sobald
  gutes Beispiel.

### 2. Firehose of Falsehood (Lügen-Feuerwehrschlauch, Massenmedien)
- **Was:** Massenhaft, schnell, über viele Kanäle widersprüchliche Falschmeldungen
  → Ziel ist Zynismus („man kann eh nichts glauben“), nicht Überzeugung. Propaganda/RAND.
- **Beispiel-Idee:** Nach Nord-Stream-Sabotage zeitgleich Dutzende widersprüchliche
  Narrative. **Politisch heikler (Russland-Bezug) – neutral framen.**
- **Quellen:** de.wikipedia.org/wiki/Firehose_of_Falsehood · sueddeutsche.de
  „propaganda-psychologie-wirkung“ · vsquare.org firehose-of-falsehood
- **Hinweis:** Verwandt mit Gish-Galopp (1:1 vs. Masse). Evtl. zusammen denken.

### 3. Sündenbock / Scapegoating
- **Was:** Eine Gruppe wird pauschal für komplexe Probleme verantwortlich gemacht.
- **Beispiel-Idee:** Migrationsdebatte (EDMO-Berichte). **Stark politisch aufgeladen –
  bei Pfad A besonders neutrales Framing nötig, Fokus strikt auf Technik.**
- **Quellen:** edmo.eu (EDMO-39/EDMO-28 PDFs) · migrationpolicy.org
- **Hinweis:** Wertvoll, aber sensibel. Sorgfältig framen.

### 4. Bandwagon / Mehrheits-Argument (argumentum ad populum)
- **Was:** „Das sehen doch alle so“ ersetzt Belege; sozialer Konformitätsdruck.
- **Beispiel-Idee:** „Die schweigende Mehrheit lehnt das ab“ ohne Umfragedaten.
- **Quellen:** propwatch.org (Bandwagon) · odp.library.tamu.edu propaganda-techniques
- **Hinweis:** Könnte auch als Unterart des logischen Fehlschlusses gelten – als
  eigene Masche aber alltagsnah und gut erkennbar.

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
