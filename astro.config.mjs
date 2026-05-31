// @ts-check
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import sitemap from "@astrojs/sitemap";
import { remarkStufen } from "./src/plugins/remark-stufen.mjs";

// Für GitHub Pages: site + base anpassen.
// Beispiel User-Page:    site = "https://<user>.github.io", base = "/"
// Beispiel Projekt-Page: site = "https://<user>.github.io", base = "/kompetenzzentrum"
// Per Env-Variable überschreibbar, damit der Deploy-Workflow es automatisch setzt.
const SITE = process.env.SITE_URL || "https://pseidler89-sudo.github.io";
const BASE = process.env.BASE_PATH || "/kompetenzzentrum";

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: "ignore",
  markdown: {
    remarkPlugins: [remarkDirective, remarkStufen],
  },
  integrations: [sitemap()],
});
