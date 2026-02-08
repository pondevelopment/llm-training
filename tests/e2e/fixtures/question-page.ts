import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for question interactive testing.
 * Questions navigate via #question-{id} and render inside #question-viewer.
 * Interactive HTML is injected into #question-answer within a .interactive-container.
 * Element IDs use the pattern q{id}-{suffix} (no leading zeros).
 */
export class QuestionPage {
  readonly page: Page;
  readonly questionId: number;
  readonly viewer: Locator;
  readonly answerSection: Locator;
  readonly interactiveContainer: Locator;

  constructor(page: Page, questionId: number | string) {
    this.page = page;
    this.questionId = Number(questionId);
    this.viewer = page.locator('#question-viewer');
    this.answerSection = page.locator('#question-answer');
    this.interactiveContainer = page.locator('#question-answer .interactive-container');
  }

  /**
   * Navigate to the question and wait for content to load.
   */
  async goto(): Promise<void> {
    await this.page.goto(`/index.html#question-${this.questionId}`);
    // Wait for question viewer to be visible
    await this.viewer.waitFor({ state: 'visible', timeout: 10000 });
    // Wait for answer content to appear (answer.html + interactive.html)
    await this.answerSection.waitFor({ state: 'visible', timeout: 10000 });
    // Wait for interactive container to be present (loader injects it)
    await this.interactiveContainer.waitFor({ state: 'attached', timeout: 10000 });
  }

  /**
   * Get a specific element by its q{id}-{suffix} pattern.
   */
  element(suffix: string): Locator {
    return this.page.locator(`#q${this.questionId}-${suffix}`);
  }

  /**
   * Get all sliders inside the interactive container.
   */
  allSliders(): Locator {
    return this.interactiveContainer.locator('input[type="range"]');
  }

  /**
   * Get all select dropdowns inside the interactive container.
   */
  allSelects(): Locator {
    return this.interactiveContainer.locator('select');
  }

  /**
   * Get all checkboxes inside the interactive container.
   */
  allCheckboxes(): Locator {
    return this.interactiveContainer.locator('input[type="checkbox"]');
  }

  /**
   * Get all buttons inside the interactive container.
   */
  allButtons(): Locator {
    return this.interactiveContainer.locator('button');
  }

  /**
   * Get all radio buttons inside the interactive container.
   */
  allRadios(): Locator {
    return this.interactiveContainer.locator('input[type="radio"]');
  }

  /**
   * Get all text/number inputs inside the interactive container.
   */
  allTextInputs(): Locator {
    return this.interactiveContainer.locator('input[type="text"], input[type="number"]');
  }
}
