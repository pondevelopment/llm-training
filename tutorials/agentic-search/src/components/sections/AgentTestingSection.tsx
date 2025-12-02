/**
 * Agent Testing Section
 * Standalone tutorial teaching users how to test their sites with AI agent/browsing mode
 * Includes step-by-step guide, prompt generator, and result interpretation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  tasks: string[];
  watchFor: string[];
}

const testScenarios: TestScenario[] = [
  {
    id: 'product-discovery',
    title: 'Product Discovery Flow',
    description: 'Test if agents can find and understand your products',
    icon: '🔍',
    tasks: [
      'Navigate to the homepage',
      'Browse or search for a specific product category',
      'View product details',
      'Read product specifications and reviews'
    ],
    watchFor: [
      'Can agent locate product categories?',
      'Are product specs readable (not just images)?',
      'Do internal search results make sense?',
      'Is pricing clearly displayed?'
    ]
  },
  {
    id: 'add-to-cart',
    title: 'Add to Cart & Checkout Start',
    description: 'Test the shopping flow from product page to checkout',
    icon: '🛒',
    tasks: [
      'Find a product',
      'Select any required variants (size, color)',
      'Add product to cart',
      'Navigate to cart page',
      'Proceed to checkout'
    ],
    watchFor: [
      'Can agent click "Add to Cart" button?',
      'Do variant selectors work without JavaScript?',
      'Are pop-ups or overlays blocking the flow?',
      'Is cart contents clearly visible?'
    ]
  },
  {
    id: 'checkout-completion',
    title: 'Full Checkout Flow',
    description: 'Test the complete purchase process (stop before payment)',
    icon: '💳',
    tasks: [
      'Add product to cart',
      'Proceed to checkout',
      'Fill shipping information',
      'Fill payment information',
      'Stop before final submission'
    ],
    watchFor: [
      'Does site require registration before checkout?',
      'Are form fields clearly labeled?',
      'Do validation errors make sense?',
      'Any CAPTCHAs or bot detection blocking?',
      'Does session timeout too quickly?'
    ]
  },
  {
    id: 'information-gathering',
    title: 'Information & Support',
    description: 'Test if agents can find help and contact information',
    icon: '❓',
    tasks: [
      'Find shipping information',
      'Locate return policy',
      'Access contact form or support',
      'Look for FAQ or help center'
    ],
    watchFor: [
      'Is contact form using <form> or mailto: links?',
      'Is information in accessible text vs images/PDFs?',
      'Can agent submit a support inquiry?',
      'Are policies clearly structured?'
    ]
  }
];

export function AgentTestingSection() {
  const [siteUrl, setSiteUrl] = useState('');
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set(['add-to-cart']));
  const [activeStep, setActiveStep] = useState(1);

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios(prev => {
      const next = new Set(prev);
      if (next.has(scenarioId)) {
        next.delete(scenarioId);
      } else {
        next.add(scenarioId);
      }
      return next;
    });
  };

  const generateTestPrompt = () => {
    const url = siteUrl || 'https://example.com';
    const scenarios = testScenarios.filter(s => selectedScenarios.has(s.id));
    
    let prompt = `Test this website for AI agent compatibility:

Website: ${url}?utm_source=ai_agent_test

I need you to test my website's compatibility with AI agents. Please attempt the following scenarios and report back on what works and what fails.

`;

    scenarios.forEach((scenario, idx) => {
      prompt += `\n## Scenario ${idx + 1}: ${scenario.title}
${scenario.description}

Tasks to attempt:
${scenario.tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}

Watch for these issues:
${scenario.watchFor.map(issue => `- ${issue}`).join('\n')}

`;
    });

    prompt += `\n## Reporting Format

For each scenario, please report:
1. ✅ **Success**: Which steps completed without issues
2. ⚠️ **Warnings**: Steps that worked but had friction (slow, confusing)
3. ❌ **Failures**: Where you got completely stuck or had to abandon
4. 📝 **Details**: Specific error messages, barriers encountered, or accessibility issues

## Important Notes
- Stop before any actual payment submission
- If you encounter a CAPTCHA, note it and skip that step
- Report exact error messages from forms or validation
- Note if anything is only visible as images (not readable text)
- Track timing: did any session timeout before completion?

## Analytics Tracking
The URL includes \`?utm_source=ai_agent_test\` so I can track this test in Google Analytics (if you see it in the URL bar). You can customize this parameter for your platform (e.g., chatgpt.com, gemini, perplexity).

Please begin testing and provide detailed results for each scenario.`;

    return prompt;
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(generateTestPrompt());
    // Could add toast notification here
  };

  const steps = [
    { num: 1, title: 'Understand the Goal', icon: '🎯' },
    { num: 2, title: 'Configure Test', icon: '⚙️' },
    { num: 3, title: 'Generate Prompt', icon: '📝' },
    { num: 4, title: 'Run in AI Assistant', icon: '🤖' },
    { num: 5, title: 'Interpret Results', icon: '📊' }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-bold text-text-primary">
          🧪 Test Your Site with Agent Mode
        </h2>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          Learn how to use AI agent/browsing mode to test your website's compatibility. 
          Get real-world feedback on accessibility, usability, and conversion barriers.
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="panel-surface p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">💡</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Why Test with Agent Mode?
            </h3>
            <div className="space-y-4 text-text-secondary">
              <p className="leading-relaxed">
                AI assistants with agent/browsing mode can actually <strong className="text-text-primary">browse your website</strong> and 
                attempt tasks like a real user. But unlike humans, agents encounter unique barriers: CAPTCHAs they can't solve, 
                pop-ups they can't dismiss, and forms they can't fill. Testing with agent mode reveals these issues before 
                they cost you real conversions.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#10b981' + '10' }}>
                  <div className="font-bold text-text-primary mb-2">✅ What You'll Learn</div>
                  <ul className="text-sm space-y-1">
                    <li>• Where agents get stuck on your site</li>
                    <li>• Which forms have validation issues</li>
                    <li>• If agents can complete checkout</li>
                    <li>• Specific error messages encountered</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#6366f1' + '10' }}>
                  <div className="font-bold text-text-primary mb-2">📋 Prerequisites</div>
                  <ul className="text-sm space-y-1">
                    <li>• Access to an AI assistant with browsing (ChatGPT Plus, Gemini Advanced, Perplexity Pro)</li>
                    <li>• Agent/browsing mode enabled (if applicable)</li>
                    <li>• Your website URL</li>
                    <li>• 5-10 minutes for testing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step Progress */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveStep(step.num)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition-all ${
                activeStep === step.num ? 'border-[3px]' : 'border-2'
              }`}
              style={{
                backgroundColor: activeStep === step.num 
                  ? '#6366f1' + '20' 
                  : 'var(--color-surface-elevated)',
                borderColor: activeStep === step.num ? '#6366f1' : 'transparent',
                color: activeStep === step.num ? '#6366f1' : 'var(--color-text-secondary)'
              }}
            >
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-medium whitespace-nowrap">Step {step.num}</span>
              <span className="text-xs whitespace-nowrap">{step.title}</span>
            </motion.button>
            {idx < steps.length - 1 && (
              <div className="text-text-muted text-2xl">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Understand the Goal */}
        {activeStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="panel-surface p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold text-text-primary">
              Step 1: Understand What Agent Testing Reveals
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#ef4444', backgroundColor: '#ef4444' + '10' }}>
                <div className="text-3xl mb-2">🚫</div>
                <div className="font-bold text-text-primary mb-2">Accessibility Barriers</div>
                <div className="text-sm text-text-secondary space-y-1">
                  <p>• CAPTCHAs blocking entry</p>
                  <p>• Bot detection errors (4XX)</p>
                  <p>• IP blocks or rate limits</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#f59e0b', backgroundColor: '#f59e0b' + '10' }}>
                <div className="text-3xl mb-2">⚠️</div>
                <div className="font-bold text-text-primary mb-2">Usability Issues</div>
                <div className="text-sm text-text-secondary space-y-1">
                  <p>• Pop-ups covering buttons</p>
                  <p>• Complex navigation paths</p>
                  <p>• Unclear form labels</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2" style={{ borderColor: '#6366f1', backgroundColor: '#6366f1' + '10' }}>
                <div className="text-3xl mb-2">🛒</div>
                <div className="font-bold text-text-primary mb-2">Conversion Friction</div>
                <div className="text-sm text-text-secondary space-y-1">
                  <p>• Registration requirements</p>
                  <p>• Form validation errors</p>
                  <p>• Session timeouts</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
              <div className="font-bold text-text-primary mb-2">💡 Real Example</div>
              <p className="text-sm text-text-secondary italic">
                "A furniture retailer tested their site and discovered agents couldn't complete checkout because 
                a newsletter pop-up appeared over the 'Place Order' button with no way to dismiss it. Fixing 
                this one issue increased agent conversion from 8% to 34%."
              </p>
            </div>

            <div className="p-4 rounded-lg border-2" style={{ 
              borderColor: '#10b981',
              backgroundColor: '#10b981' + '10'
            }}>
              <div className="font-bold text-text-primary mb-3">🎯 Target Benchmarks</div>
              <p className="text-sm text-text-secondary mb-4">
                Aim for these metrics when testing your site. They represent excellent agent compatibility:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>0</div>
                  <div className="text-xs text-text-secondary">Critical Failures</div>
                  <div className="text-xs text-text-muted mt-1">No blocking errors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#6366f1' }}>&lt;3</div>
                  <div className="text-xs text-text-secondary">Total Warnings</div>
                  <div className="text-xs text-text-muted mt-1">Minor friction only</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>80%+</div>
                  <div className="text-xs text-text-secondary">Tasks Completed</div>
                  <div className="text-xs text-text-muted mt-1">High success rate</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#6366f1', color: 'white' }}
              >
                Next: Configure Test →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Configure Test */}
        {activeStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="panel-surface p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold text-text-primary">
              Step 2: Configure Your Test
            </h3>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Website URL
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg border text-text-primary"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border-subtle)'
                }}
              />
              <p className="text-xs text-text-muted mt-1">
                We'll automatically add <code>?utm_source=ai_agent_test</code> for GA4 tracking
              </p>
            </div>

            {/* Scenario Selection */}
            <div>
              <div className="mb-3">
                <div className="font-medium text-text-primary mb-1">
                  Select Test Scenarios
                </div>
                <p className="text-sm text-text-secondary">
                  Choose which parts of your site to test. We recommend starting with "Add to Cart & Checkout Start"
                </p>
              </div>

              <div className="grid gap-3">
                {testScenarios.map((scenario) => {
                  const isSelected = selectedScenarios.has(scenario.id);
                  return (
                    <motion.button
                      key={scenario.id}
                      layout
                      onClick={() => toggleScenario(scenario.id)}
                      className="text-left p-4 rounded-lg border-2 transition-all"
                      style={{
                        backgroundColor: isSelected 
                          ? '#6366f1' + '10'
                          : 'var(--color-surface-elevated)',
                        borderColor: isSelected ? '#6366f1' : 'var(--color-border-subtle)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 w-5 h-5 cursor-pointer"
                          style={{ accentColor: '#6366f1' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{scenario.icon}</span>
                            <span className="font-bold text-text-primary">
                              {scenario.title}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">
                            {scenario.description}
                          </p>
                          {isSelected && (
                            <div className="text-xs text-text-muted">
                              Will test: {scenario.tasks.length} tasks, watching for {scenario.watchFor.length} issues
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep(1)}
                className="px-6 py-3 rounded-lg font-medium transition-all border"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(3)}
                disabled={selectedScenarios.size === 0}
                className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: '#6366f1', color: 'white' }}
              >
                Next: Generate Prompt →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generate Prompt */}
        {activeStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="panel-surface p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold text-text-primary">
              Step 3: Generate Test Prompt
            </h3>

            <div className="p-4 rounded-lg" style={{ backgroundColor: '#6366f1' + '10' }}>
              <div className="font-bold text-text-primary mb-2">✨ Your Custom Test Prompt</div>
              <p className="text-sm text-text-secondary">
                We've generated a detailed testing prompt based on your selections. Copy this and paste it into your AI assistant.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-primary">
                  Testing: {selectedScenarios.size} scenario{selectedScenarios.size !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={copyPromptToClipboard}
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{ backgroundColor: '#10b981', color: 'white' }}
                >
                  📋 Copy Prompt to Clipboard
                </button>
              </div>

              <div
                className="p-4 rounded-lg border max-h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border-subtle)',
                  color: 'var(--color-text-primary)'
                }}
              >
                {generateTestPrompt()}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 rounded-lg font-medium transition-all border"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#6366f1', color: 'white' }}
              >
                Next: Run in AI Assistant →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Run in Your AI Assistant */}
        {activeStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="panel-surface p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold text-text-primary">
              Step 4: Run the Test in Your AI Assistant
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border-l-4" style={{ 
                borderColor: '#6366f1',
                backgroundColor: '#6366f1' + '10'
              }}>
                <div className="font-bold text-text-primary mb-2">📝 Instructions</div>
                <ol className="text-sm text-text-secondary space-y-2">
                  <li>1. Open your chosen AI assistant (ChatGPT, Gemini, Perplexity, etc.) in a new tab</li>
                  <li>2. If available, enable Agent/browsing mode (ChatGPT: browser icon in chat input)</li>
                  <li>3. Paste your copied prompt into the chat</li>
                  <li>4. Press Enter and wait (tests typically take 2-5 minutes)</li>
                  <li>5. The AI will browse your site and report back with detailed results</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <div className="font-bold text-text-primary mb-2">⏱️ What to Expect</div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Test duration: 2-5 minutes per scenario</li>
                    <li>• Agent will narrate what it's doing</li>
                    <li>• You'll see real-time progress updates</li>
                    <li>• Final report includes successes & failures</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                  <div className="font-bold text-text-primary mb-2">⚠️ Important Notes</div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• AI agents won't submit actual payments</li>
                    <li>• May hit rate limits on some sites</li>
                    <li>• Can't solve CAPTCHAs (will report and skip)</li>
                    <li>• Results vary by platform and agent capabilities</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2" style={{ 
                borderColor: '#10b981',
                backgroundColor: '#10b981' + '05'
              }}>
                <div className="font-bold text-text-primary mb-2">💡 Pro Tip</div>
                <p className="text-sm text-text-secondary">
                  Run the test 2-3 times to confirm results. AI agents can behave slightly differently on each run, 
                  especially with dynamic elements like pop-ups. Consistent failures across multiple tests and platforms indicate real issues.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep(3)}
                className="px-6 py-3 rounded-lg font-medium transition-all border"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(5)}
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#6366f1', color: 'white' }}
              >
                Next: Interpret Results →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Interpret Results */}
        {activeStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="panel-surface p-8 space-y-6"
          >
            <h3 className="text-2xl font-bold text-text-primary">
              Step 5: Interpret Results & Take Action
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
                <div className="font-bold text-text-primary mb-3">📊 Reading the Report</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span style={{ color: '#10b981' }}>✅</span>
                    <div>
                      <strong className="text-text-primary">Success:</strong>
                      <span className="text-text-secondary"> These steps worked perfectly. No action needed.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ color: '#f59e0b' }}>⚠️</span>
                    <div>
                      <strong className="text-text-primary">Warnings:</strong>
                      <span className="text-text-secondary"> Worked but had friction. Consider optimizing for better UX.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ color: '#ef4444' }}>❌</span>
                    <div>
                      <strong className="text-text-primary">Failures:</strong>
                      <span className="text-text-secondary"> Agent got completely stuck. Fix these ASAP—they block conversions.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#ef4444', backgroundColor: '#ef4444' + '05' }}>
                  <div className="font-bold text-text-primary mb-2">🚨 Critical Issues (Fix First)</div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• CAPTCHA blocking checkout</li>
                    <li>• 4XX/5XX errors from bot detection</li>
                    <li>• Pop-ups covering CTAs with no dismiss</li>
                    <li>• Form validation failures</li>
                    <li>• Session timeouts during checkout</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border-2" style={{ borderColor: '#f59e0b', backgroundColor: '#f59e0b' + '05' }}>
                  <div className="font-bold text-text-primary mb-2">⚡ Quick Wins (High ROI)</div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• Enable guest checkout</li>
                    <li>• Add clear form labels</li>
                    <li>• Delay pop-ups on checkout pages</li>
                    <li>• Fix mailto: links → use <code>&lt;form&gt;</code></li>
                    <li>• Extend session timeouts to 30+ min</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#10b981' + '10' }}>
                <div className="font-bold text-text-primary mb-2">✅ Next Steps</div>
                <ol className="text-sm text-text-secondary space-y-2">
                  <li>1. <strong className="text-text-primary">Prioritize fixes:</strong> Start with critical failures, then high-priority warnings</li>
                  <li>2. <strong className="text-text-primary">Implement changes:</strong> Use the solution recommendations from test results</li>
                  <li>3. <strong className="text-text-primary">Re-test:</strong> Run the same prompt again (try different platforms) to verify fixes worked</li>
                  <li>4. <strong className="text-text-primary">Monitor:</strong> Track agent traffic in GA4 using UTM parameters per platform</li>
                  <li>5. <strong className="text-text-primary">Iterate:</strong> Test quarterly as your site and AI platforms evolve</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setActiveStep(4)}
                className="px-6 py-3 rounded-lg font-medium transition-all border"
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  borderColor: 'var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(1)}
                className="px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: '#10b981', color: 'white' }}
              >
                🎉 Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition to Next Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-lg border-l-4"
        style={{ 
          borderColor: '#6366f1',
          backgroundColor: '#6366f1' + '08'
        }}
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">♿</div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-text-primary mb-2">
              Found Issues? Let's Fix Them
            </h4>
            <p className="text-text-secondary leading-relaxed">
              Did agents struggle to click buttons, understand forms, or navigate your page? 
              Many of these issues stem from <strong className="text-text-primary">poor accessibility</strong>. 
              AI agents parse the DOM structure just like screen readers do.
            </p>
            <p className="text-text-secondary leading-relaxed mt-2">
              <strong className="text-text-primary">Next section:</strong> Learn <strong>ARIA patterns</strong> that 
              make your site work for both humans with disabilities <em>and</em> AI agents—accessibility = agent-ability.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
