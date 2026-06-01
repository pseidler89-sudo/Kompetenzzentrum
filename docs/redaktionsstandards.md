# Redaktionsstandards

Diese Standards sichern die Glaubwürdigkeit der Plattform. Sie gelten für alle
Inhalte und sind Grundlage jeder Review.

## 1. Belegpflicht und Quellen-Hierarchie

Jede zentrale, strittige oder zahlenbasierte Aussage braucht eine Quelle.
Vorrang in dieser Reihenfolge:

1. **Primärquellen** – amtliche Statistik (Destatis, BKA/PKS, Bundesnetzagentur,
   BAMF, Bundesbank), Gesetzestexte, begutachtete Originalstudien.
2. **Wissenschaftliche Einordnung** – Forschungsinstitute, Übersichtsarbeiten,
   Science Media Center.
3. **Seriöse Sekundärquellen** – etablierte Medien und Faktencheck-Redaktionen,
   die selbst transparent und quellenbasiert arbeiten.

Nicht ausreichend: anonyme Behauptungen, Einzelmeinungen ohne Daten, Quellen,
die ihrerseits keine Belege nennen.

### Verifikation: zwei getrennte Pflichten

Eine Quelle gilt erst als geprüft, wenn **beides** erfüllt ist:

1. **Erreichbar** – der Link führt zu einer existierenden Seite. Das prüft die CI
   automatisch (`npm run check:links`, läuft bei jedem Push in GitHub Actions).
   Tote oder erfundene Links (404, nicht existente Domain) lassen die CI scheitern.
2. **Inhaltlich tragend** – die Seite belegt die Aussage tatsächlich, im
   richtigen Kontext. **Das kann keine Automatik leisten** – es ist redaktionelle
   Pflicht und muss von einem Menschen gelesen worden sein, bevor ein Beitrag den
   Status `geprueft` bekommt.

Grundsatz: **Lieber keine Quelle als eine ungeprüfte.** Wer eine Aussage nicht
selbst an der Quelle nachgelesen hat, markiert den Beitrag als `entwurf` und
notiert offen, was noch zu prüfen ist. Eine Such-Trefferanzeige ersetzt nicht das
Lesen des Originals.

## 2. Truth Sandwich

Fakt zuerst – Mythos klar markiert nennen – widerlegen – Fakt wiederholen.
Die Falschbehauptung nie als Schlagzeile ohne Kennzeichnung wiederholen.

## 3. Drei Tiefen, eine Wahrheit

Einstieg, Vertiefung und Wissenschaftlich dürfen unterschiedlich **detailliert**
sein, sich aber nie **widersprechen**. Der Einstieg vereinfacht, verfälscht aber
nicht.

## 4. Fairness statt Strohmann

Behauptungen werden im stärksten vernünftigen Sinn wiedergegeben. Hat eine
Behauptung einen wahren Kern, wird er benannt (z.B. „Netzentgelte steigen
tatsächlich“). Ziel ist Aufklärung, nicht Diffamierung.

## 5. Zahlen mit Bezug

Absolute Zahlen immer mit Bezugsgröße (pro Kopf, Zeitreihe, Vergleichsgruppe).
Bei Gruppenvergleichen auf Confounder (Alter, Geschlecht, soziale Lage) hinweisen.

## 6. Ton

Sachlich, ruhig, präzise. Keine Beschimpfungen, kein Spott, keine
Emotionalisierung. Wir argumentieren, wir agitieren nicht.

## 7. Aktualität

Zahlen mit Jahr/Stand versehen. Wo sich Werte häufig ändern (Förderquoten,
Regelsätze), auf die jeweils gültige Originalquelle verweisen statt feste Werte zu
zementieren. Das Feld `aktualisiert` pflegen.

## 8. Transparenz und Korrektur

Alle Änderungen laufen öffentlich über GitHub. Inhaltliche Korrekturen werden
offen vorgenommen; bei wesentlichen Korrekturen einen Hinweis im Beitrag oder in
der Commit-Historie hinterlassen.

## 9. Neutralität gegenüber Personen und Parteien

Geprüft werden **Aussagen**, nicht Personen. Das Vorgehen – Belegpflicht und
Fairness – gilt unterschiedslos für jede Behauptung, unabhängig davon, von welcher
Seite sie kommt. Dass bestimmte Themen und Akteure in den Beispielen häufiger
vorkommen, ergibt sich allein aus der Faktenlage und dem Bedarf, nicht aus einer
parteilichen Ausrichtung.

## Review-Checkliste

- [ ] Quellen vorhanden, Links erreichbar (CI) **und** Inhalt selbst nachgelesen
- [ ] Primärquellen wo möglich
- [ ] Alle drei Tiefen vorhanden und widerspruchsfrei
- [ ] `:::pruefen`-Block mit nachvollziehbaren Schritten
- [ ] Behauptung fair wiedergegeben
- [ ] Zahlen mit Bezug und Datum
- [ ] sachlicher Ton
- [ ] `npm run build` fehlerfrei
