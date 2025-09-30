const { Rule } = require("html-validate");

class NoTopLevelHeadings extends Rule {
  documentation() {
    return {
      description: "Question and paper fragments must not introduce h1 headings; reserve them for the app shell.",
      url: "https://github.com/pondevelopment/llm-training/blob/main/QUESTION_TEMPLATE_GUIDE.md"
    };
  }

  setup() {
    this.on("dom:ready", event => {
      const root = event.document;
      const offenders = root.querySelectorAll("h1");
      for (const node of offenders) {
        this.report({
          node,
          message: "Use h4/h5 headings inside question and paper fragments. h1 is reserved for the shell."
        });
      }
    });
  }
}

module.exports = NoTopLevelHeadings;
