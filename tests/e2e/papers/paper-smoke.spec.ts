import { test, expect } from '@playwright/test';
import { PaperPage } from '../fixtures/paper-page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load paper IDs from manifest for dynamic test generation.
 */
function getPaperIds(): number[] {
  const manifestPath = path.join(process.cwd(), 'papers', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return Object.keys(manifest)
    .map(id => parseInt(id, 10))
    .filter(id => !isNaN(id) && id > 0)
    .sort((a, b) => a - b);
}

const paperIds = getPaperIds();

test.describe('Paper Interactive Smoke Tests', () => {
  
  test.describe.configure({ mode: 'parallel' });

  for (const paperId of paperIds) {
    test(`Paper ${paperId.toString().padStart(2, '0')}: loads and interactive responds`, async ({ page }) => {
      const errors: string[] = [];
      
      // Collect console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(`Console error: ${msg.text()}`);
        }
      });
      page.on('pageerror', error => {
        errors.push(`Page error: ${error.message}`);
      });

      const paper = new PaperPage(page, paperId);
      
      // Navigate to paper
      await paper.goto();
      
      // Verify container loaded
      await expect(paper.container).toBeVisible();
      
      // Test slider interactions (if any)
      const sliders = paper.allSliders();
      const sliderCount = await sliders.count();
      
      for (let i = 0; i < Math.min(sliderCount, 3); i++) {
        const slider = sliders.nth(i);
        const sliderId = await slider.getAttribute('id');
        
        if (sliderId) {
          // Get current value
          const currentValue = await slider.inputValue();
          const min = await slider.getAttribute('min') || '0';
          const max = await slider.getAttribute('max') || '100';
          
          // Move slider to different value (use evaluate for range inputs)
          const newValue = currentValue === max ? min : max;
          await slider.evaluate((el, val) => {
            (el as HTMLInputElement).value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
          }, newValue);
          
          // Small delay for UI update
          await page.waitForTimeout(100);
          
          // Check for associated label update
          const labelId = `${sliderId}-label`;
          const label = page.locator(`#${labelId}`);
          if (await label.count() > 0) {
            const labelText = await label.textContent();
            // Verify label doesn't show error values
            expect(labelText).not.toContain('undefined');
            expect(labelText).not.toContain('NaN');
          }
        }
      }

      // Test select interactions (if any)
      const selects = paper.allSelects();
      const selectCount = await selects.count();
      
      for (let i = 0; i < Math.min(selectCount, 2); i++) {
        const select = selects.nth(i);
        
        // Skip hidden selects (some papers have tab-based controls)
        if (!await select.isVisible()) {
          continue;
        }
        
        const options = select.locator('option');
        const optionCount = await options.count();
        
        if (optionCount > 1) {
          // Select a different option
          const secondOption = await options.nth(1).getAttribute('value');
          if (secondOption) {
            await select.selectOption(secondOption);
            await page.waitForTimeout(100);
          }
        }
      }

      // Test checkbox interactions (if any)
      const checkboxes = paper.allCheckboxes();
      const checkboxCount = await checkboxes.count();
      
      for (let i = 0; i < Math.min(checkboxCount, 2); i++) {
        const checkbox = checkboxes.nth(i);
        await checkbox.click();
        await page.waitForTimeout(100);
      }

      // Click first button if any (avoid simulation buttons that might take long)
      const buttons = paper.allButtons();
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        const buttonText = await firstButton.textContent() || '';
        // Only click short-running buttons
        if (!buttonText.toLowerCase().includes('run') && 
            !buttonText.toLowerCase().includes('simulate')) {
          await firstButton.click();
          await page.waitForTimeout(100);
        }
      }

      // Verify no rendering errors in container content
      const containerContent = await paper.container.textContent() || '';
      
      // Check for obvious error indicators (but be careful not to match legitimate content)
      // Only flag if it looks like a runtime error (e.g., ": undefined" or "= NaN")
      const errorPatterns = [
        /:\s*undefined(?!\s*\|)/i,
        /=\s*NaN\b/i,
        /TypeError:/i,
        /ReferenceError:/i,
      ];
      
      for (const pattern of errorPatterns) {
        if (pattern.test(containerContent)) {
          errors.push(`Content error: Found ${pattern} in paper ${paperId} container`);
        }
      }

      // Report any collected errors
      if (errors.length > 0) {
        throw new Error(`Paper ${paperId} had errors:\n${errors.join('\n')}`);
      }
    });
  }
});

test.describe('Paper Overview Smoke Tests', () => {
  
  test.describe.configure({ mode: 'parallel' });

  for (const paperId of paperIds) {
    test(`Paper ${paperId.toString().padStart(2, '0')}: overview renders correctly`, async ({ page }) => {
      const errors: string[] = [];
      
      page.on('pageerror', error => {
        errors.push(`Page error: ${error.message}`);
      });

      // Navigate to paper
      await page.goto(`/index.html#paper-${paperId}`);
      await page.locator('#paper-viewer').waitFor({ state: 'visible', timeout: 10000 });
      
      // Check overview section rendered
      const overview = page.locator('#paper-overview');
      await expect(overview).toBeVisible();
      
      // Wait for content to load (panels should appear)
      const panels = overview.locator('.panel');
      await panels.first().waitFor({ state: 'visible', timeout: 5000 });
      
      // Check for key structural elements
      const panelCount = await panels.count();
      expect(panelCount).toBeGreaterThan(0);
      
      // Check paper title is present
      const title = page.locator('#paper-title');
      const titleText = await title.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText!.length).toBeGreaterThan(5);

      // Check for "View paper" link
      const viewPaperLink = overview.locator('a[href*="arxiv"], a[href*="doi"], a[href*="ssrn"], a[href*="pdf"]');
      if (await viewPaperLink.count() > 0) {
        const href = await viewPaperLink.first().getAttribute('href');
        expect(href).toBeTruthy();
      }

      if (errors.length > 0) {
        throw new Error(`Paper ${paperId} overview had errors:\n${errors.join('\n')}`);
      }
    });
  }
});
