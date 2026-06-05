# 🧭 Kompetenzzentrum

**Falschbehauptungen prüfen lernen.** Ein offenes, kostenloses Nachschlagewerk
gegen Desinformation – mit geprüften Fakten und einem klaren Versprechen:
**weniger Empörung, mehr Zahlen.** Du entscheidest selbst, wie tief du gehst.

👉 **Zur Website: <https://pseidler89-sudo.github.io/Kompetenzzentrum/>**

---

## Was dich erwartet

**🔍 Faktenchecks** – Verbreitete Behauptungen, Punkt für Punkt geprüft. Jede mit
einem klaren Urteil (falsch, irreführend …), belegten Quellen und einer Anleitung,
wie du es **selbst** nachprüfst. Such gezielt nach Stichwort oder filtere nach
Thema, Urteil und Manipulations­technik.

**🎭 Maschen** – Desinformation nutzt immer wieder dieselben Tricks. Wer sie kennt,
durchschaut sie überall. Jede „Masche" ist erklärt: wie sie funktioniert, ein
aktuelles Beispiel und wie du sie entlarvst. (Hier wird niemand bloßgestellt –
auf diese Maschen fällt jede:r mal herein.)

**🧰 Werkzeugkasten & Methodik** – Wie man Informationen findet, einordnet und
bewertet. Plus: nach welchen Regeln dieses Projekt arbeitet.

**💬 Für Gespräche gemacht** – Jeder Faktencheck hat einen Knopf, der die belegte
Kurzantwort samt Quelle und Link kopiert – griffbereit fürs Gespräch oder für Social Media.

### Das Besondere: ein Thema, drei Tiefen

Jeder Faktencheck lässt sich in drei Stufen lesen – du wählst, deine Auswahl bleibt
gespeichert:

- **Einstieg** – kurz und klar, ganz ohne Vorwissen.
- **Vertiefung** – die Zahlen dahinter und die Zusammenhänge.
- **Wissenschaftlich** – Primärquellen, Methodik und statistische Fallstricke.

---

## Mitmachen

Dieses Projekt ist offen und lebt von vielen Augen und Quellen. Du musst kein:e
Programmierer:in sein – du siehst von GitHub nichts außer einem kurzen Login.

- **🧩 Faktencheck schreiben?** Am einfachsten im
  [**Faktencheck-Baukasten**](https://pseidler89-sudo.github.io/Kompetenzzentrum/tools/faktencheck-baukasten):
  Formular mit Live-Vorschau, in den drei Tiefen (Einstieg · Vertiefung ·
  Wissenschaftlich), und ein Klick zum Absenden. Kein Markdown, keine Technik.
- **🛠️ Bestehendes pflegen?** Der
  [Redaktions-Editor](https://pseidler89-sudo.github.io/Kompetenzzentrum/admin/)
  (`/admin`) öffnet Faktenchecks, Maschen und Methodik in Formularfeldern und
  verwaltet den Status (Entwurf · In Prüfung · Geprüft).
- **✍️ Thema vorschlagen?** [Faktencheck anregen](../../issues/new?template=neuer-faktencheck.yml)
- **🐛 Etwas stimmt nicht?** [Fehler melden](../../issues/new?template=fehler-melden.yml)

Für alle Inhalte gelten unsere
[**Redaktionsstandards**](https://pseidler89-sudo.github.io/Kompetenzzentrum/methodik/redaktionsstandards):
Belegpflicht, Fairness, sachlicher Ton, offene Korrekturen. (Technische Fassung
für Entwickler:innen: [docs/redaktionsstandards.md](docs/redaktionsstandards.md).)

> **Unser Grundsatz:** Wir prüfen *Aussagen*, nicht Personen. Die Methode –
> Belegpflicht und Fairness – gilt für jede Behauptung gleichermaßen, egal von
> welcher Seite sie kommt.

---

## Für Entwickler:innen

<details>
<summary>Technische Details (Setup, Aufbau, Deployment)</summary>

Statische Website mit **[Astro](https://astro.build)**, Inhalte als Markdown in
**Content Collections** mit Zod-Schema (erzwingt u.a. die Quellen-Pflicht). Kein
Backend, kein Tracking, läuft kostenlos auf GitHub Pages. Das Redaktions-CMS unter
`/admin` nutzt [Sveltia CMS](https://github.com/sveltia/sveltia-cms).

```
src/
├── content/
│   ├── faktenchecks/   # Faktenchecks (Markdown, Inhalt als Felder)
│   ├── maschen/        # Manipulationstechniken
│   └── methodik/       # Methodik-Artikel
├── content.config.ts   # Schema (Themen, Urteile, Techniken, Quellen-Pflicht)
├── components/ · layouts/ · pages/ · lib/
public/admin/           # Redaktions-CMS (Sveltia)
docs/                   # Vorlage, Redaktionsstandards, CMS-Einrichtung
scripts/                # Inhaltsprüfung & Frontmatter-Reparatur (laufen im Build)
```

**Lokal starten** (Node.js 18+):

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # Frontmatter-Reparatur + Inhaltsprüfung + Build nach dist/
```

**Deployment:** In den Repo-Einstellungen *Settings → Pages → Source: GitHub
Actions* wählen. Jeder Push auf `main` baut und veröffentlicht automatisch
(`.github/workflows/deploy.yml`); der Base-Pfad wird aus dem Repo-Namen abgeleitet.

**CMS-Login einrichten:** siehe [docs/cms-einrichten.md](docs/cms-einrichten.md)
(einmaliger OAuth-Vermittler via Cloudflare Worker).

</details>

---

## Lizenz

Inhalte unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.de),
Code unter [MIT](LICENSE) – frei nutzbar mit Namensnennung.
