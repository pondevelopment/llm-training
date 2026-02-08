import { test, expect } from '@playwright/test';
import { QuestionPage } from '../fixtures/question-page';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load question IDs from manifest for dynamic test generation.
 */
function getQuestionIds(): number[] {
  const manifestPath = path.join(process.cwd(), 'questions', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return Object.keys(manifest)
    .map(id => parseInt(id, 10))
    .filter(id => !isNaN(id) && id > 0)
    .sort((a, b) => a - b);
}

const questionIds = getQuestionIds();

test.describe('Question Interactive Smoke Tests', () => {

  test.describe.configure({ mode: 'parallel' });

  for (const qId of questionIds) {
    test(`Question ${qId.toString().padStart(2, '0')}: loads and interactive responds`, async ({ page }) => {
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

      const question = new QuestionPage(page, qId);

      // Navigate to question
      await question.goto();

      // Verify interactive container loaded
      await expect(question.interactiveContainer).toBeAttached();

      // Test slider interactions (if any)
      const sliders = question.allSliders();
      const sliderCount = await sliders.count();

      for (let i = 0; i < Math.min(sliderCount, 3); i++) {
        const slider = sliders.nth(i);

        // Skip hidden sliders
        if (!await slider.isVisible()) continue;

        const sliderId = await slider.getAttribute('id');
        const currentValue = await slider.inputValue();
        const min = await slider.getAttribute('min') || '0';
        const max = await slider.getAttribute('max') || '100';

        // Move slider to different value (use evaluate for range inputs)
        const newValue = currentValue === max ? min : max;
        await slider.evaluate((el, val) => {
          (el as HTMLInputElement).value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }, newValue);

        // Small delay for UI update
        await page.waitForTimeout(100);

        // Check for associated label update if present
        if (sliderId) {
          const labelId = `${sliderId}-label`;
          const label = page.locator(`[id="${labelId}"]`);
          if (await label.count() > 0) {
            const labelText = await label.textContent();
            expect(labelText).not.toContain('undefined');
            expect(labelText).not.toContain('NaN');
          }
        }
      }

      // Test select interactions (if any)
      const selects = question.allSelects();
      const selectCount = await selects.count();

      for (let i = 0; i < Math.min(selectCount, 2); i++) {
        const select = selects.nth(i);

        // Skip hidden or disabled selects (tab-based UIs, etc.)
        if (!await select.isVisible()) continue;
        if (!await select.isEnabled()) continue;

        const options = select.locator('option');
        const optionCount = await options.count();

        if (optionCount > 1) {
          const secondOption = await options.nth(1).getAttribute('value');
          if (secondOption) {
            await select.selectOption(secondOption);
            await page.waitForTimeout(100);
          }
        }
      }

      // Test checkbox interactions (if any)
      const checkboxes = question.allCheckboxes();
      const checkboxCount = await checkboxes.count();

      for (let i = 0; i < Math.min(checkboxCount, 2); i++) {
        const checkbox = checkboxes.nth(i);
        if (!await checkbox.isVisible()) continue;
        // Use force:true to handle sr-only checkboxes styled with label overlays
        await checkbox.click({ force: true });
        await page.waitForTimeout(100);
      }

      // Click first safe button if any
      const buttons = question.allButtons();
      const buttonCount = await buttons.count();

      if (buttonCount > 0) {
        const firstButton = buttons.first();
        if (await firstButton.isVisible()) {
          const buttonText = (await firstButton.textContent() || '').toLowerCase();
          // Only click short-running buttons; skip run/simulate/reset/train/start
          if (!buttonText.includes('run') &&
              !buttonText.includes('simulate') &&
              !buttonText.includes('reset') &&
              !buttonText.includes('clear') &&
              !buttonText.includes('train') &&
              !buttonText.includes('start') &&
              !buttonText.includes('compute')) {
            await firstButton.click({ timeout: 5000 }).catch(() => {});
            await page.waitForTimeout(100);
          }
        }
      }

      // Verify no rendering errors in interactive content
      const containerContent = await question.interactiveContainer.textContent() || '';

      const errorPatterns = [
        /:\s*undefined(?!\s*\|)/i,
        /=\s*NaN\b/i,
        /TypeError:/i,
        /ReferenceError:/i,
      ];

      for (const pattern of errorPatterns) {
        if (pattern.test(containerContent)) {
          errors.push(`Content error: Found ${pattern} in question ${qId} interactive`);
        }
      }

      // Report any collected errors
      if (errors.length > 0) {
        throw new Error(`Question ${qId} had errors:\n${errors.join('\n')}`);
      }
    });
  }
});

test.describe('Question Answer Smoke Tests', () => {

  test.describe.configure({ mode: 'parallel' });

  for (const qId of questionIds) {
    test(`Question ${qId.toString().padStart(2, '0')}: answer renders correctly`, async ({ page }) => {
      const errors: string[] = [];

      page.on('pageerror', error => {
        errors.push(`Page error: ${error.message}`);
      });

      // Navigate to question
      await page.goto(`/index.html#question-${qId}`);
      await page.locator('#question-viewer').waitFor({ state: 'visible', timeout: 10000 });

      // Check answer section rendered
      const answer = page.locator('#question-answer');
      await expect(answer).toBeVisible();

      // Wait for answer content (panels, paragraphs, or other block elements)
      const blocks = answer.locator('.panel, p, h2, h3, .interactive-container');
      await blocks.first().waitFor({ state: 'visible', timeout: 5000 });

      // Verify some content loaded
      const blockCount = await blocks.count();
      expect(blockCount).toBeGreaterThan(0);

      // Check question title is present
      const title = page.locator('#question-title');
      const titleText = await title.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText!.length).toBeGreaterThan(5);

      // Verify the answer has substantial content (not just error placeholder)
      const answerText = await answer.textContent() || '';
      expect(answerText.length).toBeGreaterThan(50);

      // Check no error placeholders rendered
      expect(answerText).not.toContain('Failed to load question');
      expect(answerText).not.toContain('Content Unavailable');
      expect(answerText).not.toContain('Question Unavailable');

      if (errors.length > 0) {
        throw new Error(`Question ${qId} answer had errors:\n${errors.join('\n')}`);
      }
    });
  }
});
