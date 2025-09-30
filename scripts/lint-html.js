const path = require("path");
const fg = require("fast-glob");
const { HtmlValidate } = require("html-validate");
const plugin = require("./htmlvalidate-plugin");

const basePatterns = [
  "index.html",
  "all.html",
  "papers.html",
  "updates.html",
  "q/**/*.html",
  "p/**/*.html",
  "questions/**/*.html",
  "papers/**/*.html"
];
const fragmentPatterns = ["questions/**/*.html", "papers/**/*.html"];

async function gatherFiles(patterns) {
  const cwd = process.cwd();
  const matches = await fg(patterns, { cwd, absolute: true, dot: false });
  const unique = new Set();
  for (const match of matches) {
    unique.add(path.normalize(match));
  }
  return Array.from(unique).sort();
}

function buildValidator({ enforceHeadingHierarchy }) {
  return new HtmlValidate({
    root: true,
    plugins: [plugin],
    rules: {
      "repo/no-tailwind-color-utilities": "error",
      "repo/no-inline-color": "error",
      "repo/no-top-level-headings": enforceHeadingHierarchy ? "error" : "off"
    }
  });
}

function formatReport(report) {
  const lines = [];
  for (const result of report.results) {
    const file = result.filePath ?? "<unknown>";
    for (const message of result.messages) {
      const line = message.line ?? 0;
      const column = message.column ?? 0;
      lines.push(`${file}:${line}:${column}  ${message.ruleId}  ${message.message}`);
    }
  }
  return lines.join("\n");
}

(async () => {
  try {
    const [allFiles, fragmentFiles] = await Promise.all([
      gatherFiles(basePatterns),
      gatherFiles(fragmentPatterns)
    ]);

    const baseValidator = buildValidator({ enforceHeadingHierarchy: false });
    const fragmentValidator = buildValidator({ enforceHeadingHierarchy: true });

    const baseReport = allFiles.length
      ? baseValidator.validateMultipleFilesSync(allFiles)
      : { valid: true, results: [] };
    const fragmentReport = fragmentFiles.length
      ? fragmentValidator.validateMultipleFilesSync(fragmentFiles)
      : { valid: true, results: [] };

    const combined = {
      valid: baseReport.valid && fragmentReport.valid,
      results: [...baseReport.results, ...fragmentReport.results]
    };

    if (!combined.valid) {
      const output = formatReport(combined);
      process.stderr.write(`${output}\n`);
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`HTML lint failed: ${error.message}\n`);
    process.exitCode = 1;
  }
})();
