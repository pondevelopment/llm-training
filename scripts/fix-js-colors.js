#!/usr/bin/env node
/**
 * Automated JS colour remediation script.
 * Reads lint violations and applies getCssVar() replacements.
 *
 * Usage: node scripts/fix-js-colors.js [--dry-run]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const cwd = process.cwd();

/* ── Hex → theme token mapping ───────────────────────────── */

const TOKEN_MAP = {
  // Emerald/green
  '#10b981': '--tone-emerald-strong',
  '#22c55e': '--tone-emerald-strong',
  '#059669': '--tone-emerald-strong',
  '#34d399': '--tone-emerald-border',
  '#84cc16': '--tone-emerald-strong',

  // Amber/yellow/orange
  '#f59e0b': '--tone-amber-strong',
  '#fbbf24': '--tone-amber-border',
  '#eab308': '--tone-amber-strong',
  '#d97706': '--tone-amber-text',
  '#fde68a': '--tone-amber-soft',
  '#f97316': '--tone-amber-strong',
  '#ffedd5': '--tone-amber-soft',
  '#9a3412': '--tone-amber-text',

  // Rose/red/pink
  '#ef4444': '--tone-rose-strong',
  '#dc2626': '--tone-rose-strong',
  '#f43f5e': '--tone-rose-strong',
  '#991b1b': '--tone-rose-text',
  '#7f1d1d': '--tone-rose-text',
  '#fecaca': '--tone-rose-soft',
  '#fee2e2': '--tone-rose-soft',
  '#ec4899': '--tone-rose-strong',

  // Indigo
  '#6366f1': '--tone-indigo-strong',
  '#4f46e5': '--tone-indigo-strong',
  '#4338ca': '--tone-indigo-text',

  // Sky/blue/cyan
  '#3b82f6': '--tone-sky-strong',
  '#2563eb': '--tone-sky-strong',
  '#0ea5e9': '--tone-sky-strong',
  '#06b6d4': '--tone-sky-strong',
  '#93c5fd': '--tone-sky-soft',
  '#bfdbfe': '--tone-sky-soft',
  '#dbeafe': '--tone-sky-soft',
  '#1e40af': '--tone-sky-text',

  // Purple
  '#a855f7': '--tone-purple-strong',
  '#8b5cf6': '--tone-purple-strong',
  '#c084fc': '--tone-purple-border',
  '#5b21b6': '--tone-purple-text',
  '#faf5ff': '--tone-purple-soft',
  '#f3e8ff': '--tone-purple-soft',
  '#e9d5ff': '--tone-purple-soft',
  '#ede9fe': '--tone-purple-soft',
  '#440154': '--tone-purple-text',

  // Gray/muted
  '#6b7280': '--color-muted',
  '#9ca3af': '--color-muted',
  '#94a3b8': '--color-muted',
  '#64748b': '--color-muted',
  '#e5e7eb': '--color-border',
  '#d1d5db': '--color-border',
  '#f3f4f6': '--color-surface',
};

/* ── RGB → hex conversion ─────────────────────────────────── */

const RGB_MAP = {
  'rgb(16, 185, 129)':   '#10b981',
  'rgb(245, 158, 11)':   '#f59e0b',
  'rgb(239, 68, 68)':    '#ef4444',
  'rgb(220, 38, 38)':    '#dc2626',
  'rgb(34, 197, 94)':    '#22c55e',
  'rgb(251, 191, 36)':   '#fbbf24',
  'rgb(99, 102, 241)':   '#6366f1',
  'rgb(59, 130, 246)':   '#3b82f6',
  'rgb(168, 85, 247)':   '#a855f7',
  'rgb(107, 114, 128)':  '#6b7280',
  'rgb(156, 163, 175)':  '#9ca3af',
  'rgb(148, 163, 184)':  '#94a3b8',
  'rgb(100, 116, 139)':  '#64748b',
  'rgb(229, 231, 235)':  '#e5e7eb',
  'rgb(209, 213, 219)':  '#d1d5db',
  'rgb(14, 165, 233)':   '#0ea5e9',
  'rgb(6, 182, 212)':    '#06b6d4',
  'rgb(249, 115, 22)':   '#f97316',
  'rgb(236, 72, 153)':   '#ec4899',
  'rgb(132, 204, 22)':   '#84cc16',
  'rgb(5, 150, 105)':    '#059669',
  'rgb(244, 63, 94)':    '#f43f5e',
  'rgb(79, 70, 229)':    '#4f46e5',
  'rgb(139, 92, 246)':   '#8b5cf6',
  'rgb(52, 211, 153)':   '#34d399',
  'rgb(234, 179, 8)':    '#eab308',
  'rgb(217, 119, 6)':    '#d97706',
  'rgb(192, 132, 252)':  '#c084fc',
  'rgb(253, 224, 71)':   '#fde68a',
  'rgb(254, 202, 202)':  '#fecaca',
  'rgb(147, 197, 253)':  '#93c5fd',
  'rgb(191, 219, 254)':  '#bfdbfe',
};

/* ── var(--*) → getCssVar fallback map ────────────────────── */

const VAR_FALLBACK = {
  '--color-card':          '#f1f5f9',
  '--color-surface':       '#f8fafc',
  '--color-heading':       '#0f172a',
  '--color-body':          '#1e293b',
  '--color-muted':         '#64748b',
  '--color-border':        '#cbd5f5',
  '--color-border-subtle': '#e2e8f0',
  '--tone-indigo-strong':  '#6366f1',
  '--tone-sky-strong':     '#0ea5e9',
  '--tone-emerald-strong': '#10b981',
  '--tone-amber-strong':   '#f59e0b',
  '--tone-rose-strong':    '#f43f5e',
  '--tone-purple-strong':  '#a855f7',
};

/* ── getCssVar snippet to inject ──────────────────────────── */

const GET_CSS_VAR_FN = `    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };
`;

/* ── Helpers ──────────────────────────────────────────────── */

function getToken(hex) {
  return TOKEN_MAP[hex.toLowerCase()] || null;
}

/** Find the right insertion point for getCssVar in an IIFE-wrapped file */
function findInsertionPoint(lines) {
  // Strategy: find function init() { and insert after the opening brace
  for (let i = 0; i < lines.length; i++) {
    if (/function\s+init\s*\(\s*\)\s*\{/.test(lines[i])) {
      return i + 1; // insert after the opening brace
    }
  }
  // Fallback: find 'use strict' and insert after
  for (let i = 0; i < lines.length; i++) {
    if (/['"]use strict['"]/.test(lines[i])) {
      // Skip blank line after use strict
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      return j;
    }
  }
  return 2; // fallback: after first couple lines
}

/* ── Per-line fixers ──────────────────────────────────────── */

/**
 * Fix a hex violation on a line.
 * Returns the fixed line or null if no mechanical fix possible.
 */
function fixHex(line, hexMatch) {
  const hex = hexMatch.toLowerCase();
  const token = getToken(hex);
  if (!token) return null; // unknown hex — manual

  // Pattern 1: standalone quoted hex as value — '#hex' or "#hex"
  // e.g. color: '#10b981'  or  .style.color = '#dc2626'
  const sqRe = new RegExp(`'${escRe(hexMatch)}'`, 'g');
  const dqRe = new RegExp(`"${escRe(hexMatch)}"`, 'g');

  if (sqRe.test(line)) {
    return line.replace(sqRe, `getCssVar('${token}', '${hexMatch}')`);
  }
  if (dqRe.test(line)) {
    return line.replace(dqRe, `getCssVar('${token}', '${hexMatch}')`);
  }

  // Pattern 2: hex inside template literal as attribute value
  // e.g. fill="#hex" or stroke="#hex" in `...`
  const attrRe = new RegExp(`((?:fill|stroke|color|stop-color|background|border-color)\\s*[=:]\\s*")${escRe(hexMatch)}"`, 'g');
  if (attrRe.test(line)) {
    // Convert to template interpolation
    return line.replace(attrRe, `$1\${getCssVar('${token}', '${hexMatch}')}"`);
  }

  // Pattern 3: hex in css string (e.g. style="color: #hex;")
  const cssRe = new RegExp(`(color:\\s*)${escRe(hexMatch)}`, 'g');
  if (cssRe.test(line)) {
    // Need template literal context — check if we're in one
    if (line.includes('`')) {
      return line.replace(cssRe, `$1\${getCssVar('${token}', '${hexMatch}')}`);
    }
  }

  // Pattern 4: hex in comma-separated function arg
  // e.g. updateMetric('x', val, '#hex')
  const argSqRe = new RegExp(`'${escRe(hexMatch)}'`, 'g');
  if (argSqRe.test(line)) {
    return line.replace(argSqRe, `getCssVar('${token}', '${hexMatch}')`);
  }

  return null; // couldn't fix
}

/**
 * Fix an rgb() violation by replacing with getCssVar.
 * Handles: rgb(r, g, b) → getCssVar('--token', '#hex')
 */
function fixRgb(line) {
  let fixed = line;
  let changed = false;

  for (const [rgb, hex] of Object.entries(RGB_MAP)) {
    const token = getToken(hex);
    if (!token) continue;

    // Escape the rgb string for regex
    const escaped = escRe(rgb);

    // Pattern: 'rgb(...)' or "rgb(...)" standalone
    const sqRe = new RegExp(`'${escaped}'`, 'g');
    const dqRe = new RegExp(`"${escaped}"`, 'g');
    if (sqRe.test(fixed)) {
      fixed = fixed.replace(sqRe, `getCssVar('${token}', '${hex}')`);
      changed = true;
    }
    if (dqRe.test(fixed)) {
      fixed = fixed.replace(dqRe, `getCssVar('${token}', '${hex}')`);
      changed = true;
    }

    // Pattern: rgb(...) inside template literal or CSS string
    // color: rgb(r, g, b) → color: ${getCssVar(...)}
    // First check if it exists at all
    if (fixed.includes(rgb)) {
      // It's embedded in a string — we need context
      // If in a template literal, wrap in ${}
      if (fixed.includes('`')) {
        const re = new RegExp(escaped, 'g');
        fixed = fixed.replace(re, `\${getCssVar('${token}', '${hex}')}`);
        changed = true;
      }
    }
  }

  return changed ? fixed : null;
}

/**
 * Fix a var(--*) in .style violation.
 * .style.X = 'var(--token)' → .style.X = getCssVar('--token', '#fallback')
 */
function fixVarInStyle(line) {
  const m = line.match(/\.style\.(\w+)\s*=\s*'var\((--[^)]+)\)'/);
  if (!m) return null;

  const token = m[2];
  const fallback = VAR_FALLBACK[token] || '#000000';
  return line.replace(
    `'var(${token})'`,
    `getCssVar('${token}', '${fallback}')`
  );
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ── Main ─────────────────────────────────────────────────── */

// Read violations
const violations = fs.readFileSync('/tmp/js-violations.txt', 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const m = line.match(/^([^:]+):(\d+)\s+(\S+)\s+(.*)/);
    if (!m) return null;
    return { file: m[1], line: parseInt(m[2], 10), rule: m[3], msg: m[4] };
  })
  .filter(Boolean);

// Group by file
const byFile = {};
for (const v of violations) {
  (byFile[v.file] = byFile[v.file] || []).push(v);
}

// Files that already have getCssVar
const filesWithHelper = new Set();
for (const file of Object.keys(byFile)) {
  const content = fs.readFileSync(path.join(cwd, file), 'utf8');
  if (/getCssVar/.test(content)) {
    filesWithHelper.add(file);
  }
}

let totalFixed = 0;
let totalManual = 0;
const manualItems = [];

for (const [file, fileViolations] of Object.entries(byFile)) {
  const absPath = path.join(cwd, file);
  let content = fs.readFileSync(absPath, 'utf8');
  let lines = content.split('\n');
  let needsHelper = !filesWithHelper.has(file);
  let fileFixed = 0;

  // Process violations from bottom to top so line numbers stay valid
  const sorted = [...fileViolations].sort((a, b) => b.line - a.line);

  for (const v of sorted) {
    const idx = v.line - 1;
    if (idx >= lines.length) continue;
    const original = lines[idx];
    let fixed = null;

    if (v.rule === 'js-css-var-in-style') {
      fixed = fixVarInStyle(original);
    } else if (v.rule === 'js-hardcoded-color') {
      // Try hex fix first
      const hexM = v.msg.match(/#[0-9a-fA-F]{3,8}/);
      if (hexM) {
        fixed = fixHex(original, hexM[0]);
      }
      // Try rgb fix
      if (!fixed && v.msg.includes('colour function')) {
        fixed = fixRgb(original);
      }
    }

    if (fixed && fixed !== original) {
      lines[idx] = fixed;
      fileFixed++;
      totalFixed++;
    } else {
      totalManual++;
      manualItems.push(`${file}:${v.line}  ${v.rule}  ${v.msg}`);
    }
  }

  // If we fixed anything and the file needs getCssVar, add it
  if (fileFixed > 0 && needsHelper) {
    // Re-check after fixes — might have introduced getCssVar calls
    const newContent = lines.join('\n');
    if (newContent.includes('getCssVar(') && !newContent.includes('const getCssVar')) {
      const insertIdx = findInsertionPoint(lines);
      lines.splice(insertIdx, 0, GET_CSS_VAR_FN);
    }
  }

  // Also inject getCssVar if file has manual items that will need it
  if (fileFixed === 0 && manualItems.some(m => m.startsWith(file)) && needsHelper) {
    // Still inject helper for manual fixes later
    const newContent = lines.join('\n');
    if (!newContent.includes('const getCssVar')) {
      const insertIdx = findInsertionPoint(lines);
      lines.splice(insertIdx, 0, GET_CSS_VAR_FN);
    }
  }

  const newContent = lines.join('\n');
  if (newContent !== content) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would write ${file} (${fileFixed} fixes)`);
    } else {
      fs.writeFileSync(absPath, newContent, 'utf8');
      console.log(`✓ ${file}: ${fileFixed} fixed`);
    }
  }
}

console.log(`\n=== Summary ===`);
console.log(`Fixed:  ${totalFixed}`);
console.log(`Manual: ${totalManual}`);

if (manualItems.length) {
  console.log(`\n=== Manual fixes needed ===`);
  for (const item of manualItems) {
    console.log(item);
  }
}
