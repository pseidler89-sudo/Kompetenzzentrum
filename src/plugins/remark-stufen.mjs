import { visit } from "unist-util-visit";

/**
 * Wandelt Direktiven in semantische HTML-Container um, damit Inhalte
 * je nach Vorwissen ein- und ausgeblendet werden können.
 *
 * Autor:innen schreiben einfach in normalem Markdown:
 *
 *   :::stufe{name="einstieg"}
 *   Kurz und verständlich, kein Vorwissen nötig.
 *   :::
 *
 *   :::stufe{name="vertiefung"}
 *   Zahlen, Kontext, Zusammenhänge.
 *   :::
 *
 *   :::stufe{name="wissenschaftlich"}
 *   Primärquellen, Methodik, Statistik-Fallstricke.
 *   :::
 *
 * Außerdem unterstützt:
 *
 *   :::pruefen
 *   So kannst du die Behauptung selbst überprüfen ...
 *   :::
 *
 *   :::technik{name="Cherry Picking"}
 *   Erklärung der Manipulationstechnik ...
 *   :::
 *
 *   :::hinweis / :::warnung
 *   Hervorgehobene Hinweis-Box.
 *   :::
 */

const STUFEN = new Set(["einstieg", "vertiefung", "wissenschaftlich"]);
const STUFEN_LABEL = {
  einstieg: "Einstieg",
  vertiefung: "Vertiefung",
  wissenschaftlich: "Wissenschaftlich",
};

export function remarkStufen() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective") return;

      const data = node.data || (node.data = {});
      const attrs = node.attributes || {};

      if (node.name === "stufe") {
        const name = (attrs.name || "einstieg").toLowerCase();
        if (!STUFEN.has(name)) return;
        data.hName = "div";
        data.hProperties = {
          className: ["stufe", `stufe-${name}`],
          "data-stufe": name,
        };
        // Beschriftung – nur ohne JavaScript sichtbar (per CSS gesteuert).
        node.children.unshift({
          type: "paragraph",
          data: { hProperties: { className: ["stufe-heading"] } },
          children: [{ type: "text", value: STUFEN_LABEL[name] }],
        });
        return;
      }

      if (node.name === "pruefen") {
        data.hName = "aside";
        data.hProperties = { className: ["box", "box-pruefen"] };
        prependLabel(node, "So prüfst du das selbst");
        return;
      }

      if (node.name === "technik") {
        const name = attrs.name || "Manipulationstechnik";
        data.hName = "aside";
        data.hProperties = {
          className: ["box", "box-technik"],
          "data-technik": name,
        };
        prependLabel(node, `Technik erkannt: ${name}`);
        return;
      }

      if (node.name === "hinweis" || node.name === "warnung") {
        data.hName = "aside";
        data.hProperties = { className: ["box", `box-${node.name}`] };
        return;
      }
    });
  };
}

/** Fügt einer Box eine fettgedruckte Beschriftung als ersten Absatz hinzu. */
function prependLabel(node, label) {
  node.children.unshift({
    type: "paragraph",
    data: { hProperties: { className: ["box-label"] } },
    children: [{ type: "strong", children: [{ type: "text", value: label }] }],
  });
}

export default remarkStufen;
