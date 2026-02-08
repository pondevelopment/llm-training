/**
 * Paper validation script
 * Checks manifest sync, file existence, share pages, and related question validity.
 */
const fs = require("fs/promises");
const path = require("path");

function formatIssue(issue) {
  return `${issue.context}: ${issue.message}`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadManifest(manifestPath) {
  const raw = await fs.readFile(manifestPath, "utf8");
  return JSON.parse(raw);
}

(async () => {
  try {
    const repoRoot = process.cwd();
    const papersManifestPath = path.join(repoRoot, "papers", "manifest.json");
    const questionsManifestPath = path.join(repoRoot, "questions", "manifest.json");

    const papersManifest = await loadManifest(papersManifestPath);
    const questionsManifest = await loadManifest(questionsManifestPath);
    const questionIds = new Set(Object.keys(questionsManifest));

    const issues = [];

    for (const [id, entry] of Object.entries(papersManifest)) {
      const paddedId = id.padStart(2, "0");
      const context = `Paper ${paddedId}`;

      // Determine folder path from dir or fallback
      const dir = entry.dir
        ? path.join(repoRoot, entry.dir.replace(/^\.\//, ""))
        : path.join(repoRoot, "papers", `p${paddedId}`);

      // Check required files exist
      const overviewPath = entry.overviewPath
        ? path.join(repoRoot, entry.overviewPath.replace(/^\.\//, ""))
        : path.join(dir, "overview.html");
      const interactiveHtmlPath = entry.interactive?.htmlPath
        ? path.join(repoRoot, entry.interactive.htmlPath.replace(/^\.\//, ""))
        : path.join(dir, "interactive.html");
      const interactiveJsPath = entry.interactive?.scriptPath
        ? path.join(repoRoot, entry.interactive.scriptPath.replace(/^\.\//, ""))
        : path.join(dir, "interactive.js");

      if (!(await fileExists(overviewPath))) {
        issues.push({
          context,
          message: `missing overview.html at ${path.relative(repoRoot, overviewPath)}`
        });
      }

      if (!(await fileExists(interactiveHtmlPath))) {
        issues.push({
          context,
          message: `missing interactive.html at ${path.relative(repoRoot, interactiveHtmlPath)}`
        });
      }

      if (!(await fileExists(interactiveJsPath))) {
        issues.push({
          context,
          message: `missing interactive.js at ${path.relative(repoRoot, interactiveJsPath)}`
        });
      }

      // Check share page exists
      const sharePagePath = path.join(repoRoot, "p", `${id}.html`);
      if (!(await fileExists(sharePagePath))) {
        issues.push({
          context,
          message: `missing share page at p/${id}.html`
        });
      }

      // Check relatedQuestions reference valid question IDs
      if (Array.isArray(entry.relatedQuestions)) {
        for (const qId of entry.relatedQuestions) {
          const qIdStr = String(qId);
          if (!questionIds.has(qIdStr)) {
            issues.push({
              context,
              message: `relatedQuestions references question ${qId} which is not in questions/manifest.json`
            });
          }
        }
      }

      // Check required manifest fields
      if (!entry.title) {
        issues.push({ context, message: "missing required field: title" });
      }
      if (!entry.interactiveTitle) {
        issues.push({ context, message: "missing recommended field: interactiveTitle" });
      }
      if (!entry.summary) {
        issues.push({ context, message: "missing recommended field: summary" });
      }
    }

    if (issues.length > 0) {
      process.stderr.write("Paper validation issues:\n");
      const message = issues.map(formatIssue).join("\n");
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    } else {
      process.stdout.write(`✓ Validated ${Object.keys(papersManifest).length} papers\n`);
    }
  } catch (error) {
    process.stderr.write(`Paper validation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
})();
