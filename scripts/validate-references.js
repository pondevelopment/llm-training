const fs = require("fs/promises");
const path = require("path");
const fg = require("fast-glob");

function formatIssue(issue) {
  return `${issue.filePath}: ${issue.message}`;
}

async function loadQuestionIds(manifestPath) {
  const raw = await fs.readFile(manifestPath, "utf8");
  const manifest = JSON.parse(raw);
  return new Set(Object.keys(manifest));
}

function extractQuestionLinks(html) {
  const pattern = /href\s*=\s*["']#question-(\d{2})["']/gi;
  const matches = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function hasSemanticWrapper(html) {
  return /(class\s*=\s*["'][^"']*\bpanel\b)|(<div[^>]+panel\s)/i.test(html) || /(class\s*=\s*["'][^"']*\bview-toggle\b)/i.test(html);
}

(async () => {
  try {
    const repoRoot = process.cwd();
    const manifestPath = path.join(repoRoot, "questions", "manifest.json");
    const questionIds = await loadQuestionIds(manifestPath);

    const answerFiles = await fg("questions/q??/answer.html", { cwd: repoRoot, absolute: true });
    const interactiveFiles = await fg("questions/q??/interactive.html", { cwd: repoRoot, absolute: true });

    const issues = [];

    for (const file of answerFiles) {
      const html = await fs.readFile(file, "utf8");
      const links = extractQuestionLinks(html);
      for (const id of links) {
        if (!questionIds.has(id)) {
          issues.push({
            filePath: file,
            message: `references #question-${id} which is missing from questions/manifest.json`
          });
        }
      }
    }

    for (const file of interactiveFiles) {
      const html = await fs.readFile(file, "utf8");
      if (!hasSemanticWrapper(html)) {
        issues.push({
          filePath: file,
          message: "does not use panel/view-toggle helpers; ensure semantic wrappers replace raw Tailwind colours"
        });
      }
    }

    if (issues.length > 0) {
      const message = issues.map(formatIssue).join("\n");
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    }
  } catch (error) {
    process.stderr.write(`Repository lint failed: ${error.message}\n`);
    process.exitCode = 1;
  }
})();
