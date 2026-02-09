#!/usr/bin/env node
/**
 * Lint interactive.js files for hardcoded colour values.
 *
 * Rules enforced:
 *   js-hardcoded-color   Hex (#xxx/#xxxxxx), rgb(), rgba(), hsl(), hsla()
 *                        literals that are NOT inside a getCssVar / colorVar /
 *                        readCssVar / themeToken / getPropertyValue helper call.
 *   js-css-var-in-style  Using var(--*) in JS-generated .style.* assignments
 *                        (unreliable cross-browser per AGENTS.md).
 *
 * Allowed (not flagged):
 *   - Fallback values inside getCssVar('--token', '#hex') or similar helpers
 *   - Fallback values after getPropertyValue('--token').trim() || '#hex'
 *   - Lines that are pure comments
 *   - Structural colours: #fff/#ffffff/#000/#000000 (pure white/black)
 *   - Transparent overlays: rgba(0,0,0,...) and rgba(255,255,255,...)
 *   - Canvas computed pixel colours: rgb(${var},...) in template literals
 *   - Hex colours used as color-mix() operands alongside resolved tokens
 *   - Shadow colours: rgba(15,23,42,...) — the standard elevation shadow
 *   - Lines assigning to boxShadow (structural elevation, not theme colour)
 *   - Canvas 2D context colour assignments (ctx.strokeStyle, ctx.fillStyle, etc.)
 *   - Colour functions inside CSS gradient expressions (linear-gradient, etc.)
 *   - Hex values inside inline comments (after // on the same line)
 *   - HTML numeric character references (&#digits;)
 *   - HTML numeric character references: &#digits; (emoji / special chars)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');

/* ── Patterns ─────────────────────────────────────────────── */

// Hex colours: #abc, #aabbcc, #aabbccdd
const HEX_RE = /#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?\b/g;

// Structural hex colours that are always allowed (pure white/black)
const STRUCTURAL_HEX = new Set(['#fff', '#ffffff', '#000', '#000000']);

// Colour function calls: rgb(), rgba(), hsl(), hsla()
const COLOR_FN_RE = /\b(?:rgba?|hsla?)\s*\(/g;

// Transparent overlays: rgba(0,0,0,...) or rgba(255,255,255,...)
const TRANSPARENT_OVERLAY_RE = /rgba\s*\(\s*(?:0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)\s*,/;

// Canvas computed pixel colours with template vars: rgb(${...},...), rgba(${...},...), hsl(${...},...), hsla(${...},...)
const CANVAS_COMPUTED_RE = /(?:rgba?|hsla?)\s*\(\s*\$\{/;

// Standard elevation shadow colour: rgba(15,23,42,...) — slate-900 at alpha
const SHADOW_COLOUR_RE = /rgba\s*\(\s*15\s*,\s*23\s*,\s*42\s*,/;

// Line is a boxShadow / box-shadow assignment (structural elevation)
const BOX_SHADOW_CTX_RE = /(?:\.style\.boxShadow\s*=|box-shadow\s*:)/i;

// HTML numeric character reference: &#digits; — not a colour
const HTML_ENTITY_RE = /&#\d+;/g;

// Canvas 2D context colour assignments (ctx.strokeStyle, ctx.fillStyle, ctx.shadowColor)
const CANVAS_CTX_RE = /(?:ctx\w*|context\w*)\.(?:strokeStyle|fillStyle|shadowColor)\s*=/;

// CSS gradient functions (linear-gradient, radial-gradient, conic-gradient)
const GRADIENT_RE = /(?:linear|radial|conic)-gradient\s*\(/;

// var(--*) assigned directly to .style.*  (the AGENTS.md anti-pattern)
const VAR_IN_STYLE_RE = /\.style\.\w+\s*=\s*['"`]var\(--/;

/* ── Helpers ──────────────────────────────────────────────── */

/** Check whether the match sits inside a getCssVar-family call. */
function isInsideHelper(line, index) {
  const before = line.substring(0, index);
  // Match helpers like getCssVar(  colorVar(  readCssVar(  themeToken(
  return /(?:getCssVar|colorVar|readCssVar|themeToken)\s*\(\s*['"][^'"]*['"]\s*,\s*$/.test(before)
    || /(?:getCssVar|colorVar|readCssVar|themeToken)\s*\([^)]*$/.test(before);
}

/** Check whether the hex is part of an HTML numeric character reference (&#digits;). */
function isHtmlEntity(line, index) {
  // Look back for '&' and forward for ';' around the #digits sequence
  if (index > 0 && line[index - 1] === '&') {
    const rest = line.substring(index + 1);
    // Matches ######; (pure-digit entity)
    if (/^\d+;/.test(rest)) return true;
  }
  return false;
}

/** Check whether the hex appears as a fallback after getPropertyValue().trim() || */
function isPropertyValueFallback(line, index) {
  const before = line.substring(0, index);
  // Pattern: getPropertyValue('--token').trim() || '  (or with .trim() optional)
  return /getPropertyValue\s*\([^)]*\)(?:\.trim\(\))?\s*\|\|\s*['"]?$/.test(before);
}

/** Check whether the hex or rgb() sits inside a color-mix() expression. */
function isInsideColorMix(line, index) {
  // Look backwards from the match position for "color-mix("
  const before = line.substring(Math.max(0, index - 100), index);
  // Must have an opening color-mix( without a closing )
  const lastOpen = before.lastIndexOf('color-mix(');
  if (lastOpen === -1) return false;
  const afterOpen = before.substring(lastOpen);
  // Count parens: if more opens than closes, we're still inside
  const opens = (afterOpen.match(/\(/g) || []).length;
  const closes = (afterOpen.match(/\)/g) || []).length;
  return opens > closes;
}

/** Rough check for comment lines. */
function isComment(line) {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
}

/** Check if the match index falls inside an inline comment (after //). */
function isInInlineComment(line, index) {
  // Find the first // that isn't inside a string
  let inSingle = false, inDouble = false, inTemplate = false;
  for (let i = 0; i < index; i++) {
    const ch = line[i];
    if (ch === '\\') { i++; continue; }
    if (!inDouble && !inTemplate && ch === "'") inSingle = !inSingle;
    else if (!inSingle && !inTemplate && ch === '"') inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === '`') inTemplate = !inTemplate;
    else if (!inSingle && !inDouble && !inTemplate && ch === '/' && line[i + 1] === '/') {
      return true; // match is after a // outside any string
    }
  }
  return false;
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
        // Skip structural colours (pure white/black)
        if (STRUCTURAL_HEX.has(m[0].toLowerCase())) continue;
        // Skip HTML numeric character references (&#128229; etc.)
        if (isHtmlEntity(line, m.index)) continue;
        // Skip hex inside inline comments
        if (isInInlineComment(line, m.index)) continue;
        // Skip if inside getCssVar() or similar helper
        if (isInsideHelper(line, m.index)) continue;
        // Skip if it's a getPropertyValue() fallback
        if (isPropertyValueFallback(line, m.index)) continue;
        // Skip if inside a color-mix() expression
        if (isInsideColorMix(line, m.index)) continue;
        errors.push(
          `${rel}:${num}  js-hardcoded-color  Hardcoded colour ${m[0]}; wrap in getCssVar('--token', '${m[0]}').`
        );
      }

      // 2. Colour functions not inside a helper
      COLOR_FN_RE.lastIndex = 0;
      while ((m = COLOR_FN_RE.exec(line)) !== null) {
        // Skip transparent overlays (rgba(0,0,0,...) and rgba(255,255,255,...))
        const after = line.substring(m.index);
        if (TRANSPARENT_OVERLAY_RE.test(after)) continue;
        // Skip canvas computed pixel colours: rgb(${var},...)
        if (CANVAS_COMPUTED_RE.test(after)) continue;
        // Skip standard shadow colour: rgba(15,23,42,...)
        if (SHADOW_COLOUR_RE.test(after)) continue;
        // Skip rgba/rgb inside boxShadow assignments (structural elevation)
        if (BOX_SHADOW_CTX_RE.test(line)) continue;
        // Skip canvas 2D context colour assignments
        if (CANVAS_CTX_RE.test(line)) continue;
        // Skip colour functions inside CSS gradient expressions
        if (GRADIENT_RE.test(line)) continue;
        // Skip if inside getCssVar() or similar helper
        if (isInsideHelper(line, m.index)) continue;
        // Skip if inside a color-mix() expression
        if (isInsideColorMix(line, m.index)) continue;
        errors.push(
          `${rel}:${num}  js-hardcoded-color  Hardcoded colour function; use getCssVar() with theme token + fallback.`
        );
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
  } else {
    process.stderr.write('0 JS colour violations. ✓\n');
  }
}

main().catch(err => {
  process.stderr.write(err.stack + '\n');
  process.exitCode = 1;
});
