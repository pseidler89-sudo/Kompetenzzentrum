import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { pfad, URTEIL_LABEL } from "../lib/labels";

/**
 * RSS-2.0-Feed der neuesten Faktenchecks (build-time, kein Server, kein neues
 * Dependency – XML wird von Hand erzeugt, analog zu faktenchecks.json.ts).
 * Erreichbar unter /<base>/rss.xml, im <head> als alternate verlinkt.
 */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const eintraege = (await getCollection("faktenchecks")).sort(
    (a, b) => b.data.veroeffentlicht.valueOf() - a.data.veroeffentlicht.valueOf(),
  );

  const absolut = (p: string) => (site ? new URL(pfad(p), site).href : pfad(p));
  const startseite = absolut("/faktenchecks");
  const selbst = absolut("/rss.xml");

  const items = eintraege
    .map((e) => {
      const url = absolut(`/faktenchecks/${e.id}`);
      const urteil = URTEIL_LABEL[e.data.urteil] ?? e.data.urteil;
      const beschreibung = `${urteil}: ${e.data.kurzantwort}`;
      return `    <item>
      <title>${esc(e.data.titel)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${e.data.veroeffentlicht.toUTCString()}</pubDate>
      <description>${esc(beschreibung)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kompetenzzentrum – Faktenchecks</title>
    <link>${esc(startseite)}</link>
    <atom:link href="${esc(selbst)}" rel="self" type="application/rss+xml" />
    <description>Geprüfte Antworten auf verbreitete Falschbehauptungen – mit Zahlen, Quellen und Anleitung zum Selberprüfen.</description>
    <language>de-DE</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
