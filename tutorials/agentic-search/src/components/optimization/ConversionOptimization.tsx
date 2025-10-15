/**
 * Conversion Optimization Component
 * Teaches UNIVERSAL best practices for agent conversion funnel optimization
 * These principles work across ALL AI platforms (ChatGPT, Gemini, Perplexity, etc.)
 * Based on October 2025 research: Only 17% of agents complete checkout when they reach it
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversionTip {
  id: string;
  category: 'registration' | 'forms' | 'popups' | 'session' | 'confirmation';
  icon: string;
  title: string;
  problem: string;
  agentImpact: string;
  solution: string;
  implementation: string[];
  priority: 'critical' | 'high' | 'medium';
}

const conversionTips: ConversionTip[] = [
  {
    id: 'guest-checkout',
    category: 'registration',
    icon: '🚪',
    title: 'Enable Guest Checkout',
    problem: 'Requiring account creation before purchase adds friction and validation complexity that causes agent abandonment.',
    agentImpact: 'High abandonment rate. Registration forms often trigger CAPTCHAs, have unclear validation, or require email verification agents can\'t complete.',
    solution: 'Defer registration until AFTER purchase completion. Let users (and agents) check out as guests.',
    implementation: [
      'Add "Continue as Guest" button prominently on checkout',
      'Collect only essential info: shipping address, payment method',
      'Offer account creation on confirmation page with "Save this info for next time?"',
      'Use email from order as account creation prompt'
    ],
    priority: 'critical'
  },
  {
    id: 'semantic-forms',
    category: 'forms',
    icon: '📋',
    title: 'Use Semantic HTML Forms',
    problem: 'JavaScript-heavy forms with dynamic validation, unclear error messages, or non-standard controls confuse agents.',
    agentImpact: 'Validation errors, stuck progress, inability to submit. Agents can\'t adapt to unclear requirements.',
    solution: 'Use proper <form> elements with semantic HTML, clear labels, and server-side validation.',
    implementation: [
      'Use <form> tags, not JavaScript event handlers on divs',
      'Label inputs with <label for="fieldname">',
      'Provide clear error messages: "Enter 5-digit ZIP code" not "Invalid input"',
      'Show validation requirements upfront: "Password: 8+ characters, 1 number"',
      'Use standard input types: type="email", type="tel", type="number"'
    ],
    priority: 'critical'
  },
  {
    id: 'mailto-forms',
    category: 'forms',
    icon: '📧',
    title: 'Replace mailto: with Web Forms',
    problem: 'Contact forms using mailto: links fail because agents can\'t send email from external email clients.',
    agentImpact: 'Dead end. Agents abandon when they can\'t submit inquiries or requests.',
    solution: 'Replace mailto: links with proper <form> elements that POST to your server.',
    implementation: [
      'Convert <a href="mailto:..."> to <form method="POST">',
      'Add server-side endpoint to receive form submissions',
      'Use honeypot fields (hidden inputs) instead of CAPTCHA for spam prevention',
      'Provide clear confirmation: "Message sent! We\'ll respond within 24 hours."'
    ],
    priority: 'high'
  },
  {
    id: 'popup-timing',
    category: 'popups',
    icon: '⚠️',
    title: 'Delay Pop-ups & Overlays',
    problem: 'Cookie banners, newsletter pop-ups, chat widgets, or promo overlays cover CTAs and prevent agents from clicking through.',
    agentImpact: 'Agents can\'t dismiss overlays or click buttons underneath. They get stuck or abandon.',
    solution: 'Delay pop-ups until after key actions (add to cart, checkout started). Make overlays easily dismissible.',
    implementation: [
      'Delay newsletter pop-ups: only show after 30+ seconds or on exit intent',
      'Ensure overlays can be dismissed with ESC key or obvious close button',
      'Don\'t show pop-ups on checkout pages',
      'Make cookie banners collapsible: show "Manage Preferences" link, not full overlay',
      'Test with keyboard-only navigation'
    ],
    priority: 'high'
  },
  {
    id: 'session-length',
    category: 'session',
    icon: '⏱️',
    title: 'Balance Session Length & Security',
    problem: 'Short session timeouts (5-10 minutes) cause agents to lose cart contents or need re-authentication mid-checkout.',
    agentImpact: 'Forced re-login during checkout causes abandonment. Agents can\'t always re-authenticate quickly.',
    solution: 'Extend session timeouts for checkout flows. Use sliding windows (activity-based expiry).',
    implementation: [
      'Set checkout session timeout to 30+ minutes',
      'Use sliding window: extend timeout on every interaction',
      'Preserve cart contents for 7+ days (even after session expires)',
      'For logged-in users: maintain session across browser restarts',
      'Only require re-authentication for sensitive actions (changing payment method)'
    ],
    priority: 'medium'
  },
  {
    id: 'confirmation-optimization',
    category: 'confirmation',
    icon: '✅',
    title: 'Optimize Confirmation Pages',
    problem: 'Agents complete transactions but don\'t engage with mid-funnel upsells. Confirmation page is the only cross-sell opportunity.',
    agentImpact: 'Missed upsell/cross-sell revenue. Agents focus on completing the primary task, ignore sidebar recommendations.',
    solution: 'Place cross-sells and related products prominently on confirmation page, not during checkout.',
    implementation: [
      'Show "Customers also bought" section on confirmation page',
      'Offer subscription upgrades: "Save 15% with auto-delivery"',
      'Include referral program CTA: "Share with a friend, get $10 credit"',
      'Keep checkout flow clean: no upsells between cart and payment',
      'Track conversion lift from confirmation page recommendations'
    ],
    priority: 'medium'
  }
];

export const ConversionOptimization: React.FC = () => {
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());

  const toggleTip = (tipId: string) => {
    setExpandedTips(prev => {
      const next = new Set(prev);
      if (next.has(tipId)) {
        next.delete(tipId);
      } else {
        next.add(tipId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedTips(new Set(conversionTips.map(t => t.id)));
  };

  const collapseAll = () => {
    setExpandedTips(new Set());
  };

  const categories = [
    { id: 'registration', label: 'Registration Strategy', icon: '🔐' },
    { id: 'forms', label: 'Form Best Practices', icon: '📝' },
    { id: 'popups', label: 'Pop-up Management', icon: '⚠️' },
    { id: 'session', label: 'Session Length', icon: '⏱️' },
    { id: 'confirmation', label: 'Confirmation Page', icon: '✅' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#6366f1';
      default: return '#6366f1';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h3 className="text-3xl font-bold text-text-primary">
          🎯 Universal Conversion Optimization
        </h3>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          These principles work <strong className="text-accent-primary">across all AI platforms</strong>—ChatGPT, Gemini, Perplexity, and future agents. 
          Agents have high purchase intent but only <strong className="text-accent-primary">17% complete checkout</strong> when they reach it. 
          Remove friction points that kill conversions.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-sm text-indigo-700 dark:text-indigo-300">
          <span>🌐</span>
          <span className="font-semibold">Platform-agnostic strategies that scale</span>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="p-4 rounded-lg border-2" style={{ 
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: '#ef4444'
        }}>
          <div className="text-3xl font-bold mb-1" style={{ color: '#ef4444' }}>
            63%
          </div>
          <div className="text-sm font-medium text-text-primary mb-1">
            Bounce Rate
          </div>
          <div className="text-xs text-text-secondary">
            Agents abandon due to accessibility barriers
          </div>
        </div>

        <div className="p-4 rounded-lg border-2" style={{ 
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: '#f59e0b'
        }}>
          <div className="text-3xl font-bold mb-1" style={{ color: '#f59e0b' }}>
            17%
          </div>
          <div className="text-sm font-medium text-text-primary mb-1">
            Conversion Rate
          </div>
          <div className="text-xs text-text-secondary">
            Of agents who reach checkout, only 17% complete
          </div>
        </div>

        <div className="p-4 rounded-lg border-2" style={{ 
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: '#10b981'
        }}>
          <div className="text-3xl font-bold mb-1" style={{ color: '#10b981' }}>
            80%+
          </div>
          <div className="text-sm font-medium text-text-primary mb-1">
            Target Rate
          </div>
          <div className="text-xs text-text-secondary">
            Achievable with guest checkout & semantic forms
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={expandAll}
          className="px-4 py-2 rounded text-sm font-medium transition-colors"
          style={{
            backgroundColor: '#6366f1',
            color: 'white'
          }}
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-4 py-2 rounded text-sm font-medium transition-colors border"
          style={{
            backgroundColor: 'var(--color-surface-elevated)',
            borderColor: 'var(--color-border-subtle)',
            color: 'var(--color-text-secondary)'
          }}
        >
          Collapse All
        </button>
      </div>

      {/* Conversion Tips by Category */}
      <div className="space-y-8">
        {categories.map((category, catIdx) => {
          const categoryTips = conversionTips.filter(t => t.category === category.id);
          if (categoryTips.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 + 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <h4 className="text-xl font-bold text-text-primary">
                  {category.label}
                </h4>
              </div>

              <div className="space-y-3">
                {categoryTips.map(tip => {
                  const isExpanded = expandedTips.has(tip.id);
                  const priorityColor = getPriorityColor(tip.priority);

                  return (
                    <motion.div
                      key={tip.id}
                      layout
                      className="rounded-lg border-2 transition-all overflow-hidden"
                      style={{
                        backgroundColor: 'var(--color-surface-elevated)',
                        borderColor: isExpanded ? priorityColor : 'var(--color-border-subtle)'
                      }}
                    >
                      <button
                        onClick={() => toggleTip(tip.id)}
                        className="w-full p-4 text-left hover:bg-opacity-50 transition-colors"
                        style={{
                          backgroundColor: isExpanded ? `${priorityColor}10` : 'transparent'
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-bold text-text-primary">
                                  {tip.title}
                                </h5>
                                <span
                                  className="px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: `${priorityColor}20`,
                                    color: priorityColor
                                  }}
                                >
                                  {tip.priority.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary">
                                {tip.problem}
                              </p>
                            </div>
                          </div>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-2xl flex-shrink-0"
                          >
                            ▼
                          </motion.span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                              <div>
                                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>
                                  Agent Impact:
                                </div>
                                <p className="text-sm text-text-secondary">
                                  {tip.agentImpact}
                                </p>
                              </div>

                              <div className="p-3 rounded" style={{ backgroundColor: `${priorityColor}10` }}>
                                <div className="font-semibold text-sm mb-2" style={{ color: priorityColor }}>
                                  ✓ Solution:
                                </div>
                                <p className="text-sm text-text-secondary mb-3">
                                  {tip.solution}
                                </p>
                                <div className="font-semibold text-sm mb-2 text-text-primary">
                                  Implementation Steps:
                                </div>
                                <ol className="space-y-1.5 text-sm text-text-secondary">
                                  {tip.implementation.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="font-bold text-text-primary flex-shrink-0">
                                        {idx + 1}.
                                      </span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Conversion Test Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-lg border-2 space-y-4"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: '#10b981'
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">🧪</span>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-text-primary mb-2">
              Test Your Conversion Funnel
            </h4>
            <p className="text-text-secondary mb-4">
              Use this prompt to have ChatGPT Agent mode test your checkout flow and identify friction points:
            </p>

            <div 
              className="p-4 rounded border font-mono text-sm whitespace-pre-wrap"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border-subtle)',
                color: 'var(--color-text-primary)'
              }}
            >
{`Test this e-commerce checkout flow for agent compatibility:

Website: [YOUR_SITE_URL]

Task: Complete a full purchase simulation (stop before final payment)
1. Find and add a product to cart
2. Proceed to checkout
3. Fill out shipping information
4. Fill out payment information (stop before submitting)

Report findings:
- Did you encounter registration requirements? (account creation before checkout)
- Were forms easy to fill? (clear labels, validation messages)
- Any pop-ups or overlays that blocked progress?
- Did session timeout cause issues?
- Any mailto: links instead of web forms?
- Where exactly did the process break down (if applicable)?

Track: Add ?utm_source=chatgpt.com to URL for GA4 analytics.`}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`Test this e-commerce checkout flow for agent compatibility:

Website: [YOUR_SITE_URL]

Task: Complete a full purchase simulation (stop before final payment)
1. Find and add a product to cart
2. Proceed to checkout
3. Fill out shipping information
4. Fill out payment information (stop before submitting)

Report findings:
- Did you encounter registration requirements? (account creation before checkout)
- Were forms easy to fill? (clear labels, validation messages)
- Any pop-ups or overlays that blocked progress?
- Did session timeout cause issues?
- Any mailto: links instead of web forms?
- Where exactly did the process break down (if applicable)?

Track: Add ?utm_source=chatgpt.com to URL for GA4 analytics.`);
              }}
              className="mt-4 px-6 py-3 rounded font-medium transition-all"
              style={{
                backgroundColor: '#10b981',
                color: 'white'
              }}
            >
              📋 Copy Test Prompt
            </button>
          </div>
        </div>
      </motion.div>

      {/* Best Practices Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: '#6366f1' + '10' }}
      >
        <h4 className="text-lg font-bold text-text-primary mb-3">
          💡 Quick Wins for Higher Agent Conversion
        </h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#10b981' }}>✓</span>
            <span><strong className="text-text-primary">Guest checkout:</strong> Remove registration requirement. Offer account creation AFTER purchase on confirmation page.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#10b981' }}>✓</span>
            <span><strong className="text-text-primary">Clear form labels:</strong> Use semantic HTML with <code className="px-1 bg-surface rounded">{"<label>"}</code> tags and show validation requirements upfront.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#10b981' }}>✓</span>
            <span><strong className="text-text-primary">Delay pop-ups:</strong> Don't show overlays on checkout pages. Make dismissal easy (ESC key, obvious close button).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#10b981' }}>✓</span>
            <span><strong className="text-text-primary">Replace mailto: links:</strong> Use proper <code className="px-1 bg-surface rounded">{"<form>"}</code> elements that POST to your server.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#10b981' }}>✓</span>
            <span><strong className="text-text-primary">30+ minute sessions:</strong> Extend checkout timeout and use sliding windows (activity-based expiry).</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
