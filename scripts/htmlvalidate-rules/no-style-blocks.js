const { Rule } = require("html-validate");

class NoStyleBlocks extends Rule {
  documentation() {
    return {
      description: "Interactive HTML fragments should not contain <style> blocks. Use semantic theme classes or migrate styles to css/theme.css.",
      url: "https://github.com/pondevelopment/llm-training/blob/main/AGENTS.md"
    };
  }

  setup() {
    this.on("dom:ready", event => {
      const root = event.document;
      const styles = root.querySelectorAll("style");
      for (const node of styles) {
        this.report({
          node,
          message: "Avoid <style> blocks in HTML fragments. Use semantic helpers (panel*/chip*) or migrate to css/theme.css."
        });
      }
    });
  }
}

module.exports = NoStyleBlocks;
