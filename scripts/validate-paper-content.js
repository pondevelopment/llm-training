#!/usr/bin/env node
/**
 * Paper Content Validator
 * 
 * Validates that paper pages load and contain expected content.
 * Uses native fetch (Node 18+) to test the dev server.
 * 
 * Usage:
 *   node scripts/validate-paper-content.js [--paper XX]
 * 
 * Prerequisites:
 *   - Dev server running on http://127.0.0.1:5501
 */

const { readFile } = require('fs/promises');
const path = require('path');
const { join } = path;

const rootDir = join(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5501';

// Parse command line arguments
const args = process.argv.slice(2);
const paperArg = args.includes('--paper') ? args[args.indexOf('--paper') + 1] : null;

async function loadManifest() {
  const manifestPath = join(rootDir, 'papers', 'manifest.json');
  const content = await readFile(manifestPath, 'utf8');
  return JSON.parse(content);
}

async function validatePaper(id, entry) {
  // For server-rendered content validation, we check paper assets directly
  // Since content is loaded dynamically via JS, we fetch the raw HTML files
  const issues = [];
  const dir = entry.dir || `./papers/p${id.padStart(2, '0')}`;
  
  try {
    // Check overview.html exists and has content
    const overviewUrl = `${BASE_URL}/${dir}/overview.html`.replace('./', '');
    const overviewResp = await fetch(overviewUrl, { timeout: 10000 });
    
    if (!overviewResp.ok) {
      issues.push(`HTTP ${overviewResp.status} for overview.html`);
    } else {
      const html = await overviewResp.text();
      if (html.trim().length < 100) {
        issues.push('overview.html appears empty or too short');
      }
    }
    
    // Check interactive.html exists
    const interactiveUrl = `${BASE_URL}/${dir}/interactive.html`.replace('./', '');
    const interactiveResp = await fetch(interactiveUrl, { timeout: 10000 });
    
    if (!interactiveResp.ok) {
      issues.push(`HTTP ${interactiveResp.status} for interactive.html`);
    }
    
    // Check interactive.js exists
    const jsUrl = `${BASE_URL}/${dir}/interactive.js`.replace('./', '');
    const jsResp = await fetch(jsUrl, { timeout: 10000 });
    
    if (!jsResp.ok) {
      issues.push(`HTTP ${jsResp.status} for interactive.js`);
    } else {
      const js = await jsResp.text();
      if (!js.includes('interactiveScript')) {
        issues.push('interactive.js missing interactiveScript export');
      }
    }
    
  } catch (error) {
    issues.push(`Fetch error: ${error.message}`);
  }
  
  return { id, ok: issues.length === 0, issues };
}

async function validateSharePage(id) {
  const issues = [];
  const url = `${BASE_URL}/p/${id}.html`;
  
  try {
    const response = await fetch(url, { timeout: 5000 });
    
    if (!response.ok) {
      issues.push(`HTTP ${response.status} for share page p/${id}.html`);
      return { id, ok: false, issues };
    }
    
    const html = await response.text();
    
    // Check for OpenGraph meta tags
    if (!html.includes('og:title')) {
      issues.push('Missing og:title meta tag');
    }
    
    if (!html.includes('og:description')) {
      issues.push('Missing og:description meta tag');
    }
    
    if (!html.includes('twitter:card')) {
      issues.push('Missing twitter:card meta tag');
    }
    
    // Check for link to paper (could be either pattern)
    const hasIndexLink = html.includes('index.html#paper-');
    const hasPapersLink = html.includes('papers.html?paper=');
    if (!hasIndexLink && !hasPapersLink) {
      issues.push('Missing link to paper explainer');
    }
    
  } catch (error) {
    issues.push(`Fetch error: ${error.message}`);
  }
  
  return { id, ok: issues.length === 0, issues };
}

async function main() {
  console.log('Paper Content Validator');
  console.log(`Using base URL: ${BASE_URL}\n`);
  
  // Check if server is running
  try {
    await fetch(BASE_URL, { timeout: 5000 });
  } catch (error) {
    console.error(`\n❌ Cannot connect to ${BASE_URL}`);
    console.error('   Make sure the dev server is running:');
    console.error('   npx vite --port 5501\n');
    process.exit(1);
  }
  
  const manifest = await loadManifest();
  const paperIds = Object.keys(manifest).filter(k => !k.startsWith('_'));
  
  // Filter to single paper if specified
  const targetPapers = paperArg 
    ? paperIds.filter(id => id === paperArg)
    : paperIds;
  
  if (paperArg && targetPapers.length === 0) {
    console.error(`Paper ${paperArg} not found in manifest`);
    process.exit(1);
  }
  
  console.log(`Validating ${targetPapers.length} paper(s)...\n`);
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  for (const id of targetPapers) {
    const entry = manifest[id];
    
    // Validate main paper page
    const paperResult = await validatePaper(id, entry);
    
    // Validate share page
    const shareResult = await validateSharePage(id);
    
    const allIssues = [...paperResult.issues, ...shareResult.issues];
    
    if (allIssues.length === 0) {
      process.stdout.write('.');
      passed++;
    } else {
      process.stdout.write('F');
      failed++;
      failures.push({ id, issues: allIssues });
    }
  }
  
  console.log('\n');
  
  if (failures.length > 0) {
    console.log('Failures:\n');
    for (const { id, issues } of failures) {
      console.log(`  Paper ${id}:`);
      for (const issue of issues) {
        console.log(`    - ${issue}`);
      }
      console.log();
    }
  }
  
  console.log(`${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Validation error:', error);
  process.exit(1);
});
