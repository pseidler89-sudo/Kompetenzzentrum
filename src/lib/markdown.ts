import { marked } from "marked";

/**
 * Rendert Markdown aus einem Inhaltsfeld zu HTML.
 * Wird für die Faktencheck-Felder (einstieg, vertiefung, …) genutzt,
 * die als Markdown-Text im Frontmatter stehen.
 */
marked.setOptions({ gfm: true, breaks: false });

export function md(text?: string): string {
  if (!text || !text.trim()) return "";
  return marked.parse(text.trim(), { async: false }) as string;
}

/** Inline-Variante ohne umschließendes <p> – für kurze Einzeiler. */
export function mdInline(text?: string): string {
  if (!text || !text.trim()) return "";
  return marked.parseInline(text.trim(), { async: false }) as string;
}
