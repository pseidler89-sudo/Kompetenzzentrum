# 🧭 Kompetenzzentrum

> **Falschbehauptungen prüfen lernen.** Eine offene, faktenbasierte Plattform, die
> verbreitete Desinformation – mit Schwerpunkt auf faktenfremder rechter Polemik –
> Schritt für Schritt aufklärt und dabei **je nach Vorwissen** aufbereitet.

[![CI](https://github.com/pseidler89-sudo/kompetenzzentrum/actions/workflows/ci.yml/badge.svg)](https://github.com/pseidler89-sudo/kompetenzzentrum/actions/workflows/ci.yml)
[![Deploy](https://github.com/pseidler89-sudo/kompetenzzentrum/actions/workflows/deploy.yml/badge.svg)](https://github.com/pseidler89-sudo/kompetenzzentrum/actions/workflows/deploy.yml)
Inhalte: CC BY-SA 4.0 · Code: MIT

---

## Worum geht es?

Im Netz kursieren unzählige Falschbehauptungen. Sie sind oft emotional, eingängig
und schwer zu kontern, wenn einem die Zahlen fehlen. Das Kompetenzzentrum setzt
dagegen auf **weniger Empörung, mehr Fakten** – und darauf, Menschen zu befähigen,
selbst zu prüfen.

Das Projekt verfolgt drei Zwecke:

1. **Selbst bilden** – Neugierige stöbern durch geprüfte Themen.
2. **Diskussionen stützen** – belegte Kurzantworten und Quellen, sofort griffbereit.
3. **Gemeinsam wachsen** – alles liegt offen auf GitHub; Unis, Initiativen und
   Einzelpersonen können mitarbeiten, und jede Aussage ist öffentlich nachvollziehbar.

## Das Besondere: ein Thema, drei Tiefen

Jeder Faktencheck lässt sich in drei Informationstiefen lesen – die Auswahl wird
gespeichert und gilt für die ganze Seite:

- **Einstieg** – kurz und klar, ganz ohne Vorwissen.
- **Vertiefung** – die Zahlen dahinter und die Zusammenhänge.
- **Wissenschaftlich** – Primärquellen, Methodik und statistische Fallstricke.

Dazu zeigt jeder Beitrag die genutzte **Manipulationstechnik** (Prebunking) und
einen **„So prüfst du das selbst“**-Block. So wächst mit jedem Lesen die eigene
Medienkompetenz.

## Inhalte im Piloten

**Faktenchecks**
- „Ausländer sind krimineller als Deutsche“ (Kriminalstatistik)
- „Mit Bürgergeld hat man mehr als wer arbeiten geht“ (Lohnabstand)
- „Das Heizungsgesetz verbietet Gasheizungen“ (GEG)
- „Erneuerbare sind schuld an den hohen Strompreisen“ (Merit-Order)

**Werkzeugkasten** – SIFT-Methode, Recherche-Tools, 10 Manipulationstechniken.
**Methodik** – Wie wir arbeiten · Statistik richtig lesen.
**Diskussionshilfe** – durchsuchbare Faktenkarten zum Kopieren.

## Technik

- **[Astro](https://astro.build)** – statische Site, schnell und SEO-freundlich.
- **Content Collections** mit Zod-Schema – erzwingt u.a. die **Quellen-Pflicht**.
- Inhalte als **Markdown** mit einfachen Direktiven (`:::stufe`, `:::pruefen`,
  `:::technik`) – niedrige Hürde für Mitwirkende.
- Kein Backend, kein Tracking. Läuft kostenlos auf **GitHub Pages**.

```
src/
├── content/
│   ├── faktenchecks/      # die Faktenchecks (Markdown)
│   └── methodik/          # Methodik-Artikel
├── content.config.ts      # Schema (Themen, Urteile, Techniken, Quellen-Pflicht)
├── components/            # Astro-Komponenten (Stufenschalter, Quellen, …)
├── pages/                 # Seiten & Routen
├── plugins/               # remark-stufen: Direktiven → HTML
└── lib/labels.ts          # Anzeige-Texte
docs/                      # Vorlage & Redaktionsstandards
scripts/validate-content.mjs   # Inhaltsprüfung (CI)
```

## Lokal starten

Voraussetzung: Node.js 18+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Inhaltsprüfung + statischer Build nach dist/
```

## Deployment (GitHub Pages)

1. In den Repo-Einstellungen **Settings → Pages → Source: GitHub Actions** wählen.
2. Auf `main` pushen – der Workflow `deploy.yml` baut und veröffentlicht
   automatisch. Der Base-Pfad wird aus dem Repo-Namen abgeleitet, ein manuelles
   Anpassen entfällt.

Die Seite ist dann unter `https://<owner>.github.io/<repo>/` erreichbar.

## Mitmachen

Beiträge sind ausdrücklich erwünscht – siehe **[CONTRIBUTING.md](CONTRIBUTING.md)**
und die **[Faktencheck-Vorlage](docs/faktencheck-vorlage.md)**. Der einfachste
Einstieg:

- 🐛 [Fehler melden](../../issues/new?template=fehler-melden.yml)
- 📋 [Faktencheck vorschlagen](../../issues/new?template=neuer-faktencheck.yml)

Verbindlich sind die [Redaktionsstandards](docs/redaktionsstandards.md):
Belegpflicht, Truth Sandwich, Fairness, sachlicher Ton.

## Roadmap (Auswahl)

- [ ] Mehr Faktenchecks (Asyl-Kosten, Gendern, Tempolimit, Migration & Sozialstaat …)
- [ ] Volltextsuche über alle Inhalte
- [ ] Quellen-Linkchecker in der CI
- [ ] Teilbare Karten-/Bild-Exporte für Social Media
- [ ] Mehrsprachigkeit (leichte Sprache, EN)

## Lizenz

Inhalte unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.de),
Code unter MIT – Details in [LICENSE](LICENSE).

---

*Dieses Projekt prüft Aussagen, nicht Personen. Der Schwerpunkt ergibt sich aus
Faktenlage und Bedarf; die Methode – Belegpflicht und Fairness – gilt für jede
Behauptung gleichermaßen.*
