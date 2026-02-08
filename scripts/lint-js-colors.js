#!/usr/bin/env node
/**
 * Lint interactive.js files for hardcoded colour values.
 *
 * Rules enforced:
 *   js-hardcoded-color   Hex (#xxx/#xxxxxx), rgb(), rgba(), hsl(), hsla()
 *                        literals that are NOT inside a getCssVar / colorVar /
 *                        readCssVar / themeToken helper call.
 *   js-css-var-in-style  Using var(--*) in JS-generated .style.* assignments
 *                        (unreliable cross-browser per AGENTS.md).
 *
 * Allowed (not flagged):
 *   - Fallback values inside getCssVar('--token', '#hex')
 *   - Lines that are pure comments
 *   - color-mix() CSS function references in static HTML (not JS)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');

/* ── Patterns ─────────────────────────────────────────────── */

// Hex colours: #abc, #aabbcc, #aabbccdd
const HEX_RE = /#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?\b/g;

// Colour function calls: rgb(), rgba(), hsl(), hsla()
const COLOR_FN_RE = /\b(?:rgba?|hsla?)\s*\(/g;

// var(--*) assigned directly to .style.*  (the AGENTS.md anti-pattern)
const VAR_IN_STYLE_RE = /\.style\.\w+\s*=\s*['"`]var\(--/;

// var(--*) inside a template literal or string that looks like an inline style
const VAR_IN_STRING_RE = /['"`]var\(--[^)]+\)['"`]/;

/* ── Helpers ──────────────────────────────────────────────── */

/** Check whether the match sits inside a getCssVar-family call. */
function isInsideHelper(line, index) {
  const before = line.substring(0, index);
  // Match helpers like getCssVar(  colorVar(  readCssVar(  themeToken(
  return /(?:getCssVar|colorVar|readCssVar|themeToken)\s*\(\s*['"][^'"]*['"]\s*,\s*$/.test(before)
    || /(?:getCssVar|colorVar|readCssVar|themeToken)\s*\([^)]*$/.test(before);
}

/** Rough check for comment lines. */
function isComment(line) {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
}

/* ── Main ─────────────────────────────────────────────────── */

async function main() {
  const cwd = process.cwd();
  const files = await fg(
    ['papers/*/interactive.js', 'questions/*/interactive.js'],
    { cwd, absolute: true }
  );

  const errors = [];

  for (const filePath of files.sort()) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const rel = path.relative(cwd, filePath);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const num = i + 1;

      if (isComment(line)) continue;

      // 1. Hex colours not inside a helper
      let m;
      HEX_RE.lastIndex = 0;
      while ((m = HEX_RE.exec(line)) !== null) {
        if (!isInsideHelper(line, m.index)) {
          errors.push(
            `${rel}:${num}  js-hardcoded-color  Hardcoded colour ${m[0]}; wrap in getCssVar('--token', '${m[0]}').`
          );
        }
      }

      // 2. Colour functions not inside a helper
      COLOR_FN_RE.lastIndex = 0;
      while ((m = COLOR_FN_RE.exec(line)) !== null) {
        if (!isInsideHelper(line, m.index)) {
          errors.push(
            `${rel}:${num}  js-hardcoded-color  Hardcoded colour function; use getCssVar() with theme token + fallback.`
          );
        }
      }

      // 3. var(--*) in JS style assignments
      if (VAR_IN_STYLE_RE.test(line)) {
        errors.push(
          `${rel}:${num}  js-css-var-in-style  CSS variable in JS .style assignment; resolve via getCssVar() instead.`
        );
      }
    }
  }

  if (errors.length) {
    process.stderr.write(errors.join('\n') + '\n');
    process.stderr.write(`\n${errors.length} JS colour violation(s) found.\n`);
    process.exitCode = 1;
  }
}

main().catch(err => {
  process.stderr.write(err.stack + '\n');
  process.exitCode = 1;
});
