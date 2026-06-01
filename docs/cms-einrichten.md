# Redaktions-CMS einrichten (einmalig)

Das CMS unter **`/admin`** erlaubt es Mitwirkenden, Faktenchecks über eine
Formular-Oberfläche zu schreiben – ohne Markdown, ohne Git-Kenntnisse. Damit der
**„Login mit GitHub"-Knopf** funktioniert, braucht es einen kleinen, kostenlosen
OAuth-Vermittler. Das richtest du **einmalig** ein. Danach loggen sich alle
Mitwirkenden einfach per Klick ein.

> Hintergrund: GitHub Pages kann den OAuth-Login nicht selbst abwickeln. Ein
> winziger Cloudflare Worker übernimmt das. (Sobald GitHub clientseitiges PKCE
> unterstützt, wird dieser Schritt überflüssig.)

## Schritt 1 – GitHub OAuth-App anlegen

1. Gehe zu **GitHub → Settings → Developer settings → OAuth Apps → „New OAuth App"**
   (direkt: <https://github.com/settings/developers>).
2. Felder ausfüllen:
   - **Application name:** `Kompetenzzentrum CMS`
   - **Homepage URL:** `https://pseidler89-sudo.github.io/Kompetenzzentrum/`
   - **Authorization callback URL:** `https://<dein-worker>.workers.dev/callback`
     (die genaue Worker-URL bekommst du in Schritt 2 – du kannst sie hier
     nachträglich eintragen).
3. **„Register application"** klicken.
4. **Client ID** notieren und ein **Client Secret** erzeugen (ebenfalls notieren).

## Schritt 2 – Cloudflare Worker deployen

1. Kostenloses Cloudflare-Konto anlegen/anmelden: <https://dash.cloudflare.com>.
2. Den fertigen Auth-Worker nutzen: Repository
   <https://github.com/sveltia/sveltia-cms-auth> – dort steht der „Deploy to
   Cloudflare"-Knopf bzw. die Anleitung zum Import in Workers.
3. Nach dem Deploy bekommst du eine URL wie
   `https://kompetenzzentrum-auth.<konto>.workers.dev`.
4. In den **Worker-Einstellungen → Variables** zwei Umgebungsvariablen setzen
   (als „Secret"):
   - `GITHUB_CLIENT_ID` = die Client ID aus Schritt 1
   - `GITHUB_CLIENT_SECRET` = das Client Secret aus Schritt 1
5. Trage die Worker-URL als **Authorization callback URL** (`…/callback`) in der
   GitHub OAuth-App nach (Schritt 1.2).

## Schritt 3 – Worker-URL ins CMS eintragen

In `public/admin/config.yml` die Zeile `base_url` auf deine Worker-URL setzen:

```yaml
backend:
  name: github
  repo: pseidler89-sudo/Kompetenzzentrum
  branch: main
  base_url: https://kompetenzzentrum-auth.<konto>.workers.dev
```

Commit + Push – fertig. Ab jetzt funktioniert der „Login mit GitHub"-Knopf unter
`/admin`.

## Schritt 4 – Wer darf mitschreiben?

Nur Personen mit **Schreibrecht am Repository** können über das CMS speichern.
Lade Mitwirkende unter **Repo → Settings → Collaborators** ein. Wer kein
Schreibrecht hat, kann trotzdem über einen Fork + Pull Request beitragen.

---

### Alternative ohne Cloudflare (für Einzelpersonen)

Wer (noch) keinen Worker einrichten will, kann sich im CMS mit einem
**Personal Access Token** anmelden (GitHub → Settings → Developer settings →
Personal access tokens, Repo-Scope). Etwas technischer pro Person, aber kein
Server-Setup nötig. Für viele nicht-technische Mitwirkende ist der Worker (oben)
die bessere Wahl.
