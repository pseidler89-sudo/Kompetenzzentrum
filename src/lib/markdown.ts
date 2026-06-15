import { Marked } from "marked";

/**
 * Rendert Markdown aus einem Inhaltsfeld zu HTML.
 * Wird für die Faktencheck-Felder (einstieg, vertiefung, …) genutzt,
 * die als Markdown-Text im Frontmatter stehen.
 *
 * Sicherheit (Defense-in-Depth): Inhalte können über den Faktencheck-
 * Baukasten von Dritten eingereicht werden (→ PR). Roh-HTML in diesen
 * Feldern wird daher NICHT durchgereicht, sondern escaped – so kann ein
 * eingebettetes <script>/<img onerror> nicht als HTML rendern, selbst wenn
 * es das menschliche PR-Review passiert. Markdown-Formatierung bleibt
 * voll erhalten (kein Inhalt nutzt aktuell Roh-HTML in diesen Feldern).
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Eigene marked-Instanz mit neutralisiertem html-Renderer (Roh-HTML → escaped).
const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    // Block- und Inline-HTML-Token: als sichtbaren, inerten Text ausgeben.
    html({ text }: { text: string }) {
      return escapeHtml(text);
    },
  },
});

export function md(text?: string): string {
  if (!text || !text.trim()) return "";
  return marked.parse(text.trim(), { async: false }) as string;
}

/** Inline-Variante ohne umschließendes <p> – für kurze Einzeiler. */
export function mdInline(text?: string): string {
  if (!text || !text.trim()) return "";
  return marked.parseInline(text.trim(), { async: false }) as string;
}

/**
 * Erlaubt in set:html-Kontexten (z.B. Datengrafik-Titeln) eine winzige
 * Formatierungs-Allowlist – nur <strong>/<em> – und escaped alles andere.
 * So bleibt die redaktionelle Hervorhebung erhalten, ohne ein Roh-HTML-/
 * XSS-Schlupfloch offenzulassen.
 */
export function sicherInline(text?: string): string {
  if (!text) return "";
  return escapeHtml(text).replace(/&lt;(\/?)(strong|em)&gt;/g, "<$1$2>");
}
