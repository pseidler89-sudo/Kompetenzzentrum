# Mitwirken am Kompetenzzentrum

Schön, dass du dabei bist! Dieses Projekt lebt von vielen Augen, Quellen und
Perspektiven. Du brauchst **kein Informatikstudium** – die meisten Beiträge sind
einfache Textdateien (Markdown).

## Wege, beizutragen

| Beitrag | Aufwand | Wie |
| --- | --- | --- |
| **Fehler melden** | klein | [Issue „Fehler melden“](../../issues/new?template=fehler-melden.yml) |
| **Thema vorschlagen** | klein | [Issue „Neuer Faktencheck“](../../issues/new?template=neuer-faktencheck.yml) |
| **Quellen/Zahlen prüfen** | mittel | bestehenden Faktencheck gegenlesen, Korrektur als PR |
| **Faktencheck schreiben** | mittel | nach [Vorlage](docs/faktencheck-vorlage.md), als PR |
| **Technik/Design** | variabel | Astro/CSS/Barrierefreiheit, als PR |

## Schnellstart (lokal)

Voraussetzung: [Node.js](https://nodejs.org) 18+.

```bash
git clone https://github.com/pseidler89-sudo/kompetenzzentrum.git
cd kompetenzzentrum
npm install
npm run dev        # Vorschau unter http://localhost:4321
```

Vor dem Einreichen:

```bash
npm run build      # prüft Inhalt, Schema und Quellen-Pflicht
```

## Einen Faktencheck schreiben

1. **Thema abklären:** Gibt es schon ein Issue dazu? Wenn nein, eröffne eins,
   damit nichts doppelt entsteht.
2. **Recherchieren:** Belege sammeln, Primärquellen bevorzugen.
3. **Datei anlegen:** `src/content/faktenchecks/<slug>.md` nach der
   [Vorlage](docs/faktencheck-vorlage.md). Schreibe alle drei Tiefen
   (Einstieg, Vertiefung, Wissenschaftlich) und einen `:::pruefen`-Block.
4. **Bauen & prüfen:** `npm run build` muss durchlaufen.
5. **Pull Request öffnen:** Beschreibe kurz die Änderung und liste die Quellen.
   Eine zweite Person liest gegen und prüft die Belege.

Verbindlich sind die [Redaktionsstandards](docs/redaktionsstandards.md):
Belegpflicht, Truth Sandwich, Fairness, sachlicher Ton, offene Korrekturen.

## Branch- und Commit-Konventionen

- Branch pro Beitrag, z.B. `faktencheck/tempolimit` oder `fix/strompreise-link`.
- Aussagekräftige Commit-Nachrichten auf Deutsch sind willkommen.
- Kleine, fokussierte PRs sind leichter zu prüfen als große Sammeländerungen.

## Verhalten

Es gilt unser [Verhaltenskodex](CODE_OF_CONDUCT.md). Wir gehen respektvoll
miteinander um – auch und gerade beim Streit um die beste Quelle.

## Lizenz deiner Beiträge

Mit dem Einreichen stimmst du zu, dass deine inhaltlichen Beiträge unter
**CC BY-SA 4.0** und Code-Beiträge unter der **MIT-Lizenz** veröffentlicht
werden (siehe [LICENSE](LICENSE)).

Danke für deinen Beitrag zu einer faktenbasierten Öffentlichkeit! 🙌
