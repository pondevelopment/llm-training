const { Rule } = require("html-validate");

const COLOR_PROPS_RE = /(background(?:-color)?|border(?:-(?:top|right|bottom|left))?(?:-color)?|color|fill|stroke|outline(?:-color)?|box-shadow|text-decoration-color)/i;
const COLOR_LITERAL_RE = /#([0-9a-f]{3,8})\b|\b(?:rgb|rgba|hsl|hsla|lab|lch|oklab|oklch)\s*\(|\b(?:(?:alice|antique|aqua|azure|beige|bisque|black|blue|brown|cadet|chartreuse|chocolate|coral|crimson|cyan|fuchsia|gold|gray|green|indigo|ivory|khaki|lavender|lime|linen|magenta|maroon|moccasin|navy|olive|orange|orchid|peru|pink|plum|purple|red|salmon|sienna|silver|snow|tan|teal|thistle|tomato|turquoise|violet|wheat|white|yellow)(?:\w|-)*?)\b/gi;
const ALLOWED_KEYWORDS = new Set(["var", "currentcolor", "transparent", "inherit", "initial", "unset"]);

class NoInlineColor extends Rule {
  documentation() {
    return {
      description: "Inline colour declarations must use the shared token variables (var(--*)).",
      url: "https://github.com/pondevelopment/llm-training/blob/main/migration-plan.md"
    };
  }

  setup() {
    this.on("dom:attribute", event => {
      if (event.key.toLowerCase() !== "style") return;
      const raw = (event.value && event.value.toString()) || "";
      if (!raw) return;

      const declarations = raw.split(/;/).map(chunk => chunk.trim()).filter(Boolean);
      for (const decl of declarations) {
        const [prop, ...rest] = decl.split(":");
        if (!prop || rest.length === 0) continue;
        const property = prop.trim();
        if (!COLOR_PROPS_RE.test(property)) continue;
        const value = rest.join(":").trim();
        if (!value) continue;
        if (value.toLowerCase().startsWith("var(")) continue;
        if (ALLOWED_KEYWORDS.has(value.toLowerCase())) continue;
        if (!COLOR_LITERAL_RE.test(value)) continue;
        this.report({
          node: event.target,
          message: "Reference colour tokens via var(--*) rather than literal colour values in inline styles."
        });
        break;
      }
    });
  }
}

module.exports = NoInlineColor;
