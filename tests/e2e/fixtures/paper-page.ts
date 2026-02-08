import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for paper interactive testing.
 * Provides helpers for common paper interaction patterns.
 */
export class PaperPage {
  readonly page: Page;
  readonly paperId: string;
  readonly paddedId: string;
  readonly container: Locator;

  constructor(page: Page, paperId: number | string) {
    this.page = page;
    this.paperId = String(paperId);
    this.paddedId = this.paperId.padStart(2, '0');
    // Papers use various container names: p##-explorer, p##-lab, p##-sim, etc.
    // Match any section/div that starts with the paper ID prefix
    this.container = page.locator(`[id^="p${this.paddedId}-"]`).first();
  }

  /**
   * Navigate to the paper and wait for the interactive to load.
   */
  async goto(): Promise<void> {
    await this.page.goto(`/index.html#paper-${this.paperId}`);
    // Wait for paper viewer to be visible
    await this.page.locator('#paper-viewer').waitFor({ state: 'visible', timeout: 10000 });
    // Wait for any container with paper ID prefix to load
    await this.container.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get a slider/input element by name.
   */
  slider(name: string): Locator {
    return this.page.locator(`#p${this.paddedId}-${name}`);
  }

  /**
   * Get a label element by name (typically shows slider value).
   */
  label(name: string): Locator {
    return this.page.locator(`#p${this.paddedId}-${name}-label`);
  }

  /**
   * Get a select element by name.
   */
  select(name: string): Locator {
    return this.page.locator(`#p${this.paddedId}-${name}`);
  }

  /**
   * Get any element by pattern suffix.
   */
  element(suffix: string): Locator {
    return this.page.locator(`#p${this.paddedId}-${suffix}`);
  }

  /**
   * Get all sliders in the interactive section.
   */
  allSliders(): Locator {
    return this.container.locator('input[type="range"]');
  }

  /**
   * Get all select dropdowns in the interactive section.
   */
  allSelects(): Locator {
    return this.container.locator('select');
  }

  /**
   * Get all checkboxes in the interactive section.
   */
  allCheckboxes(): Locator {
    return this.container.locator('input[type="checkbox"]');
  }

  /**
   * Get all buttons in the interactive section.
   */
  allButtons(): Locator {
    return this.container.locator('button');
  }

  /**
   * Set a slider value and trigger input event.
   */
  async setSlider(name: string, value: string | number): Promise<void> {
    const slider = this.slider(name);
    await slider.fill(String(value));
    await slider.dispatchEvent('input');
  }

  /**
   * Select an option from a dropdown.
   */
  async setSelect(name: string, value: string): Promise<void> {
    await this.select(name).selectOption(value);
  }

  /**
   * Toggle a checkbox.
   */
  async toggleCheckbox(name: string): Promise<void> {
    await this.element(name).click();
  }

  /**
   * Click a button.
   */
  async clickButton(name: string): Promise<void> {
    await this.element(name).click();
  }

  /**
   * Check that the container doesn't contain error indicators.
   */
  async verifyNoErrors(): Promise<void> {
    // Check for common error patterns in text content
    const text = await this.container.textContent() || '';
    const errorPatterns = ['undefined', 'null', 'NaN', 'Error:', 'TypeError', 'ReferenceError'];
    
    for (const pattern of errorPatterns) {
      // Skip if it's part of legitimate content (like code examples)
      if (text.includes(pattern) && !text.includes(`"${pattern}"`)) {
        // Only fail if it looks like an actual error (e.g., "value: undefined")
        const errorMatch = new RegExp(`:\\s*${pattern}(?![a-zA-Z])`, 'i').test(text);
        if (errorMatch) {
          throw new Error(`Found error indicator "${pattern}" in paper ${this.paperId} content`);
        }
      }
    }
  }

  /**
   * Get console errors collected during the test.
   */
  async collectConsoleErrors(callback: () => Promise<void>): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    this.page.on('pageerror', error => {
      errors.push(error.message);
    });

    await callback();

    return errors;
  }
}
