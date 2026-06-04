import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { pfad } from "../lib/labels";

/**
 * Statischer JSON-Export aller Faktenchecks (build-time, kein Server).
 * Fundament für externe Nutzung: bessere Suche, künftige Browser-Extension,
 * Daten-Weiterverwendung. Erreichbar unter /<base>/faktenchecks.json
 */
export const GET: APIRoute = async ({ site }) => {
  const eintraege = (await getCollection("faktenchecks")).sort(
    (a, b) => b.data.veroeffentlicht.valueOf() - a.data.veroeffentlicht.valueOf(),
  );

  const faktenchecks = eintraege.map((e) => ({
    slug: e.id,
    titel: e.data.titel,
    behauptung: e.data.behauptung,
    kurzantwort: e.data.kurzantwort,
    urteil: e.data.urteil,
    themen: e.data.themen,
    techniken: e.data.techniken,
    status: e.data.status,
    veroeffentlicht: e.data.veroeffentlicht.toISOString().slice(0, 10),
    url: site ? new URL(pfad(`/faktenchecks/${e.id}`), site).href : pfad(`/faktenchecks/${e.id}`),
    quellen: e.data.quellen.map((q) => ({
      titel: q.titel,
      herausgeber: q.herausgeber,
      url: q.url ?? null,
      art: q.art,
    })),
  }));

  const body = JSON.stringify(
    { generiert: new Date().toISOString(), anzahl: faktenchecks.length, faktenchecks },
    null,
    2,
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
