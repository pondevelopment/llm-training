const { Rule } = require("html-validate");

const TAILWIND_COLOR_RE = /\b(?:bg|text|border|from|to|via|shadow)-(?:slate|gray|zinc|stone|neutral|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/;

class NoTailwindColorUtilities extends Rule {
  documentation() {
    return {
      description: "Use the project\'s semantic helpers (panel*/chip*/view-toggle) instead of Tailwind colour utilities.",
      url: "https://github.com/pondevelopment/llm-training/blob/main/AGENTS.md"
    };
  }

  setup() {
    this.on("dom:attribute", event => {
      if (event.key.toLowerCase() !== "class") return;
      const value = (event.value && event.value.toString()) || "";
      if (TAILWIND_COLOR_RE.test(value)) {
        this.report({
          node: event.target,
          message: "Replace Tailwind colour utilities with semantic helper classes (panel*/chip*/view-toggle)."
        });
      }
    });
  }
}

module.exports = NoTailwindColorUtilities;
