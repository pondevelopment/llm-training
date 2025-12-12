import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../shared/Panel';
import { Chip } from '../shared/Chip';

/**
 * AccessibilitySection
 * 
 * Teaches developers about ARIA (Accessible Rich Internet Applications) tags
 * and their importance for both human accessibility and AI agent interactions.
 * 
 * Key concepts:
 * 1. What ARIA is and why it matters
 * 2. Semantic HTML vs ARIA roles
 * 3. Common ARIA patterns for interactive UIs
 * 4. Live regions for dynamic content
 * 5. How ARIA helps AI agents understand page structure
 */

interface ARIAExample {
  id: string;
  title: string;
  description: string;
  badCode: string;
  goodCode: string;
  explanation: string;
  tags: string[];
}

const ariaExamples: ARIAExample[] = [
  {
    id: 'semantic-html',
    title: 'Prefer Semantic HTML',
    description: 'Use native HTML elements before reaching for ARIA roles',
    badCode: `<div role="button" onclick="submit()">
  Submit
</div>`,
    goodCode: `<button type="submit">
  Submit
</button>`,
    explanation: 'Native <button> elements have built-in keyboard support, focus management, and screen reader compatibility. ARIA roles should only be used when semantic HTML is insufficient.',
    tags: ['Semantic HTML', 'Best Practice']
  },
  {
    id: 'landmarks',
    title: 'Landmark Regions',
    description: 'Help users and agents navigate major page sections',
    badCode: `<div class="header">
  <div class="logo">...</div>
</div>
<div class="content">...</div>`,
    goodCode: `<header aria-label="Site header">
  <nav aria-label="Main navigation">...</nav>
</header>
<main aria-label="Main content">
  ...
</main>`,
    explanation: 'Landmark roles like banner, navigation, main, and contentinfo create a mental map of your page structure. Screen readers can jump between landmarks, and AI agents can identify key content areas.',
    tags: ['Navigation', 'Structure']
  },
  {
    id: 'live-regions',
    title: 'Live Regions for Dynamic Updates',
    description: 'Announce changes to screen readers without disrupting focus',
    badCode: `<div id="status">
  {statusMessage}
</div>`,
    goodCode: `<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {statusMessage}
</div>`,
    explanation: 'aria-live="polite" announces updates when the user is idle, while "assertive" interrupts immediately. aria-atomic="true" reads the entire region, not just what changed. Perfect for search results, loading states, and notifications.',
    tags: ['Dynamic Content', 'Announcements']
  },
  {
    id: 'form-labels',
    title: 'Form Control Labels',
    description: 'Every input needs a clear, programmatic label',
    badCode: `<input type="text" placeholder="Email" />
<span class="hint">We'll never share it</span>`,
    goodCode: `<label for="email">Email</label>
<input 
  id="email"
  type="email"
  required
  aria-describedby="email-hint"
/>
<p id="email-hint" class="text-muted">
  We'll never share your email
</p>`,
    explanation: 'Labels create a click target and announce the field purpose. aria-describedby links to helper text. Use the HTML required attribute instead of aria-required when possible. AI agents parsing forms rely on these relationships.',
    tags: ['Forms', 'Labels']
  },
  {
    id: 'dialogs',
    title: 'Modal Dialog Pattern',
    description: 'Trap focus and provide clear context for overlays',
    badCode: `<div class="modal">
  <h2>Confirm Action</h2>
  <button>OK</button>
</div>`,
    goodCode: `<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">This cannot be undone</p>
  <button aria-label="Confirm and close">OK</button>
</div>`,
    explanation: 'role="dialog" with aria-modal="true" signals a modal interaction. aria-labelledby and aria-describedby provide context. Remember to trap focus within the dialog and restore it on close.',
    tags: ['Modals', 'Focus Management']
  },
  {
    id: 'button-states',
    title: 'Button States & Labels',
    description: 'Communicate current state and action purpose',
    badCode: `<button onclick="toggleMenu()">
  ☰
</button>`,
    goodCode: `<button 
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="nav-menu"
>
  ☰
</button>`,
    explanation: 'aria-label provides a text alternative for icon buttons. aria-expanded communicates toggle state. aria-controls links to the element being controlled. This helps screen readers and AI agents understand interactive relationships.',
    tags: ['Buttons', 'State']
  },
  {
    id: 'product-card',
    title: 'E-commerce Product Card',
    description: 'Make product information accessible to agents and screen readers',
    badCode: `<div class="product">
  <img src="shoe.jpg" />
  <div class="name">Running Shoe</div>
  <div class="price">$89.99</div>
  <div class="rating">★★★★☆</div>
  <div class="stock">In Stock</div>
  <button>Add to Cart</button>
</div>`,
    goodCode: `<article aria-label="Running Shoe product">
  <img 
    src="shoe.jpg" 
    alt="Blue running shoe with white sole"
  />
  <h3 id="product-name">Running Shoe</h3>
  <div aria-label="Price">
    <data value="89.99">$89.99</data>
  </div>
  <div 
    role="img" 
    aria-label="4 out of 5 stars"
  >★★★★☆</div>
  <div 
    role="status" 
    aria-live="polite"
  >In Stock</div>
  <button 
    aria-label="Add Running Shoe to cart"
    aria-describedby="product-name"
  >Add to Cart</button>
</article>`,
    explanation: 'AI agents need structured product data. Use <article> for each product, <data> for prices (with machine-readable value), role="img" + aria-label for star ratings, aria-live for stock status updates, and descriptive button labels. This enables agents to extract pricing, compare products, and complete purchases.',
    tags: ['E-commerce', 'Structured Data']
  },
  {
    id: 'shopping-cart',
    title: 'Shopping Cart Updates',
    description: 'Announce cart changes to screen readers and track state for agents',
    badCode: `<div id="cart-count">3</div>
<div id="cart-total">$247.97</div>

<script>
function addToCart(item) {
  updateCartUI(item);
}
</script>`,
    goodCode: `<div 
  id="cart-count" 
  aria-live="polite"
  aria-atomic="true"
>
  <span aria-label="Shopping cart">
    3 items
  </span>
</div>
<div 
  id="cart-total"
  role="status"
  aria-live="polite"
>
  Total: $247.97
</div>

<script>
function addToCart(item) {
  updateCartUI(item);
  // Announces: "3 items" and "Total: $247.97"
}
</script>`,
    explanation: 'aria-live="polite" announces cart updates without interrupting the user. aria-atomic="true" reads the entire message. role="status" is shorthand for a polite live region. This helps screen readers know when items are added and helps AI agents track cart state during checkout automation.',
    tags: ['E-commerce', 'Live Regions']
  },
  {
    id: 'product-filters',
    title: 'Product Filter Controls',
    description: 'Make filter checkboxes and results count accessible',
    badCode: `<div class="filters">
  <div onclick="toggleFilter('sale')">
    Sale Items
  </div>
  <div onclick="toggleFilter('free-ship')">
    Free Shipping
  </div>
</div>
<div id="results">
  Showing 47 products
</div>`,
    goodCode: `<fieldset aria-label="Filter products">
  <legend>Refine Results</legend>
  <label>
    <input 
      type="checkbox"
      id="filter-sale"
      aria-controls="product-list"
    />
    Sale Items
  </label>
  <label>
    <input 
      type="checkbox"
      id="filter-free-ship"
      aria-controls="product-list"
    />
    Free Shipping
  </label>
</fieldset>
<div 
  id="results"
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Showing 47 products
</div>`,
    explanation: 'Use native <input type="checkbox"> instead of clickable divs. <fieldset> groups related controls. aria-controls links filters to the product list they affect. role="status" on results count announces changes when filters are applied. AI agents can now understand filter relationships and verify result counts.',
    tags: ['E-commerce', 'Forms']
  },
  {
    id: 'quantity-selector',
    title: 'Quantity Spinner Controls',
    description: 'Accessible increment/decrement buttons with current value',
    badCode: `<div class="quantity">
  <span onclick="decrease()">-</span>
  <span id="qty">1</span>
  <span onclick="increase()">+</span>
</div>`,
    goodCode: `<div role="group" aria-labelledby="qty-label">
  <label id="qty-label">Quantity</label>
  <button 
    aria-label="Decrease quantity"
    onclick="decrease()"
  >-</button>
  <input 
    type="number"
    id="qty"
    value="1"
    min="1"
    max="99"
    aria-label="Quantity"
  />
  <button 
    aria-label="Increase quantity"
    onclick="increase()"
  >+</button>
</div>`,
    explanation: 'Use native <input type="number"> with min/max attributes instead of aria-value* (which are for range widgets like sliders, not number inputs). <button> elements for clickable controls. role="group" with aria-labelledby ties the three elements together semantically. AI agents can now understand the quantity control and its constraints.',
    tags: ['E-commerce', 'Interactive Controls']
  },
  {
    id: 'checkout-steps',
    title: 'Multi-Step Checkout Progress',
    description: 'Show users and agents where they are in the checkout flow',
    badCode: `<div class="steps">
  <div class="active">Shipping</div>
  <div>Payment</div>
  <div>Review</div>
</div>`,
    goodCode: `<nav aria-label="Checkout progress">
  <ol>
    <li>
      <span 
        aria-current="step"
      >Shipping</span>
    </li>
    <li>
      <span aria-disabled="true">Payment</span>
    </li>
    <li>
      <span aria-disabled="true">Review</span>
    </li>
  </ol>
</nav>`,
    explanation: 'aria-current="step" marks the active step in a process. aria-disabled="true" indicates future steps not yet available. <nav> with aria-label identifies this as progress navigation. AI agents parsing checkout flows can determine current step and predict next actions.',
    tags: ['E-commerce', 'Navigation']
  }
];

export function AccessibilitySection() {
  const [selectedExample, setSelectedExample] = useState<string>(ariaExamples[0].id);
  
  const currentExample = ariaExamples.find(ex => ex.id === selectedExample) || ariaExamples[0];

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="text-6xl mb-4">♿</div>
        <h2 className="text-3xl font-bold text-heading mb-4">
          ARIA: Accessible Rich Internet Applications
        </h2>
        <p className="text-body text-lg leading-relaxed">
          ARIA attributes make web apps accessible to screen readers and assistive technologies. 
          But they also help <strong>AI agents</strong> understand your page structure, 
          identify interactive elements, and extract meaningful content. Good accessibility 
          is good for humans <em>and</em> machines.
        </p>
      </motion.div>

      {/* Connection to Agent Testing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        <Panel variant="warning" className="p-6 border-l-4 border-[var(--color-accent)]">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-heading mb-2">
                Why This Matters: Agents Parse the DOM Like Screen Readers
              </h4>
              <p className="text-body leading-relaxed">
                In the Agent Testing section, you learned how to test your site with AI agents. 
                Did you notice issues with buttons not being clickable, or forms not being understood? 
                <strong> Many of these problems come from poor accessibility.</strong> AI agents that use 
                text-only browsers parse your DOM structure just like screen readers do. The semantic HTML 
                and ARIA patterns you'll learn here fix those issues—<strong>accessibility = agent-ability</strong>.
              </p>
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* Why ARIA Matters */}
      <section className="grid md:grid-cols-3 gap-4">
        <Panel variant="info" className="text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-xl font-bold text-heading mb-2">Human Accessibility</h3>
          <p className="text-body text-sm">
            15% of the world has a disability. ARIA helps screen readers, keyboard navigators, 
            and users with cognitive differences access your content.
          </p>
        </Panel>

        <Panel variant="success" className="text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-xl font-bold text-heading mb-2">Agent Understanding</h3>
          <p className="text-body text-sm">
            AI agents use ARIA landmarks, labels, and roles to navigate pages, fill forms, 
            and extract structured data. Clear semantics = better agent performance.
          </p>
        </Panel>

        <Panel variant="warning" className="text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h3 className="text-xl font-bold text-heading mb-2">Legal Compliance</h3>
          <p className="text-body text-sm">
            Many jurisdictions require WCAG 2.1 AA compliance for public websites. 
            ARIA is often essential to meet these standards for dynamic applications.
          </p>
        </Panel>
      </section>

      {/* The Golden Rule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Panel variant="warning" className="p-8 border-l-4 border-[var(--color-warning)]">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-heading mb-3">
                The First Rule of ARIA
              </h4>
              <p className="text-body mb-4 leading-relaxed text-lg font-semibold">
                "No ARIA is better than bad ARIA."
              </p>
              <p className="text-body leading-relaxed">
                WebAIM found that pages with ARIA had <strong>41% more accessibility errors</strong> than 
                pages without it. Always prefer semantic HTML (<code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, 
                <code>&lt;main&gt;</code>) over <code>div</code>s with ARIA roles. Only add ARIA when semantic HTML 
                cannot express the pattern you need.
              </p>
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* Interactive Examples */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-heading mb-2">
            📚 Common ARIA Patterns
          </h3>
          <p className="text-body font-medium">
            👆 Click any pattern below to see before/after code examples
          </p>
        </motion.div>

        {/* Example Selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {ariaExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedExample(example.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all border-2 cursor-pointer ${
                selectedExample === example.id
                  ? 'bg-accent text-white border-accent shadow-lg scale-105'
                  : 'bg-card-secondary text-body border-divider hover:border-accent hover:bg-card-tertiary hover:scale-102 hover:shadow-md'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        {/* Example Display */}
        <motion.div
          key={currentExample.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Panel className="p-8 space-y-6">
            {/* Example Header */}
            <div>
              <h4 className="text-2xl font-bold text-heading mb-2">
                {currentExample.title}
              </h4>
              <p className="text-body mb-3">
                {currentExample.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentExample.tags.map(tag => (
                  <Chip key={tag} variant="info">{tag}</Chip>
                ))}
              </div>
            </div>

            {/* Code Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Bad Example */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <h5 className="font-bold text-error">Without ARIA</h5>
                </div>
                <pre className="bg-card-secondary p-4 rounded-lg overflow-x-auto text-sm border-2 border-error/30">
                  <code className="text-body font-mono">{currentExample.badCode}</code>
                </pre>
              </div>

              {/* Good Example */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <h5 className="font-bold text-success">With ARIA</h5>
                </div>
                <pre className="bg-card-secondary p-4 rounded-lg overflow-x-auto text-sm border-2 border-success/30">
                  <code className="text-body font-mono">{currentExample.goodCode}</code>
                </pre>
              </div>
            </div>

            {/* Explanation */}
            <div className="panel-inset p-6">
              <p className="text-body leading-relaxed">
                <strong className="text-heading">Why this matters:</strong> {currentExample.explanation}
              </p>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* Common ARIA Attributes Quick Reference */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-heading mb-2">
            🎯 Essential ARIA Attributes
          </h3>
          <p className="text-body">
            The most commonly used ARIA properties you'll need
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <Panel className="p-6 space-y-3">
            <h4 className="text-lg font-bold text-heading flex items-center gap-2">
              <span>🏷️</span> Labels & Descriptions
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-label</code>
                <span className="text-body">Text alternative for elements (overrides visible text)</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-labelledby</code>
                <span className="text-body">References another element's ID for the label</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-describedby</code>
                <span className="text-body">References element(s) that describe this one</span>
              </div>
            </div>
          </Panel>

          <Panel className="p-6 space-y-3">
            <h4 className="text-lg font-bold text-heading flex items-center gap-2">
              <span>🔄</span> States & Properties
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-expanded</code>
                <span className="text-body">Whether a section is collapsed (false) or open (true)</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-selected</code>
                <span className="text-body">Indicates the current item in tabs, lists, grids</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-disabled</code>
                <span className="text-body">Element is present but not operable</span>
              </div>
            </div>
          </Panel>

          <Panel className="p-6 space-y-3">
            <h4 className="text-lg font-bold text-heading flex items-center gap-2">
              <span>📢</span> Live Regions
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-live</code>
                <span className="text-body">Announces changes: "polite" (idle), "assertive" (interrupt)</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">aria-atomic</code>
                <span className="text-body">Read entire region (true) or just changes (false)</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">role="status"</code>
                <span className="text-body">Shorthand for polite live region (aria-live="polite")</span>
              </div>
            </div>
          </Panel>

          <Panel className="p-6 space-y-3">
            <h4 className="text-lg font-bold text-heading flex items-center gap-2">
              <span>🎭</span> Roles
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">role="dialog"</code>
                <span className="text-body">Modal or non-modal overlay dialog</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">role="alert"</code>
                <span className="text-body">Important, time-sensitive message (like errors)</span>
              </div>
              <div className="flex gap-3">
                <code className="font-mono font-bold text-accent whitespace-nowrap">role="navigation"</code>
                <span className="text-body">Collection of links for site/page navigation</span>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Who Uses ARIA? */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-heading mb-2">
            🌐 Who Actually Uses ARIA?
          </h3>
          <p className="text-body">
            Understanding which browsers, assistive technologies, and AI tools read ARIA attributes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Screen Readers */}
          <Panel className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎧</span>
              <h4 className="text-lg font-bold text-heading">Screen Readers (Humans)</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="panel-inset p-3 space-y-2">
                <h5 className="font-semibold text-heading">Desktop (Windows)</h5>
                <ul className="space-y-1 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>JAWS</strong> - 40.5% market share (commercial)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>NVDA</strong> - 37.7% market share (free/open-source)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>Narrator</strong> - Built into Windows, 37.3% use it occasionally</span>
                  </li>
                </ul>
              </div>
              <div className="panel-inset p-3 space-y-2">
                <h5 className="font-semibold text-heading">Desktop (Mac)</h5>
                <ul className="space-y-1 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>VoiceOver</strong> - 9.7% primary usage, built into macOS</span>
                  </li>
                </ul>
              </div>
              <div className="panel-inset p-3 space-y-2">
                <h5 className="font-semibold text-heading">Mobile</h5>
                <ul className="space-y-1 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>VoiceOver (iOS)</strong> - 70.6% of mobile screen reader users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span><strong>TalkBack (Android)</strong> - 27.6% of mobile screen reader users</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs panel-muted">
                Source: <a href="https://webaim.org/projects/screenreadersurvey10/" target="_blank" rel="noopener noreferrer" className="link-primary">WebAIM Screen Reader Survey #10 (2024)</a> - 1,539 respondents, 91.3% use mobile screen readers
              </p>
            </div>
          </Panel>

          {/* Browsers */}
          <Panel className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌍</span>
              <h4 className="text-lg font-bold text-heading">Browsers (Accessibility APIs)</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-body">
                All modern browsers expose ARIA to assistive technologies through <strong>accessibility trees</strong>:
              </p>
              <div className="panel-inset p-3 space-y-2">
                <ul className="space-y-2 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <div>
                      <strong>Chrome/Edge</strong> - Accessibility tree in DevTools (Elements → Accessibility tab). Uses <strong>Microsoft UI Automation API</strong> (Windows) and <strong>AXTree</strong> (Chromium)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <div>
                      <strong>Firefox</strong> - Exposes ARIA via <strong>IAccessible2</strong> (Windows), <strong>ATK/AT-SPI</strong> (Linux)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <div>
                      <strong>Safari</strong> - Uses <strong>macOS Accessibility API</strong> for VoiceOver integration
                    </div>
                  </li>
                </ul>
              </div>
              <div className="panel-inset p-3">
                <p className="text-body text-xs">
                  <strong>What browsers do:</strong> Convert DOM + ARIA attributes → Accessibility Tree → Expose to OS-level APIs → Screen readers read the tree structure
                </p>
              </div>
              <p className="text-xs panel-muted">
                The accessibility tree is a <em>separate representation</em> from the DOM, containing only elements relevant to assistive tech (nodes with semantic meaning, labels, roles, states).
              </p>
            </div>
          </Panel>
        </div>

        {/* AI Agents & Automation */}
        <Panel variant="success" className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <h4 className="text-lg font-bold text-heading">AI Agents & Browser Automation</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <h5 className="font-semibold text-heading">Tools That Parse ARIA</h5>
              <ul className="space-y-2 text-body">
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <div>
                    <strong>Playwright/Puppeteer/Selenium</strong> - Browser automation frameworks query by ARIA role, label, state (e.g., <code className="text-xs">getByRole('button', {'{'} name: 'Submit' {'}'})</code>)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <div>
                    <strong>ChatGPT Browse/Agent Mode</strong> - Uses accessibility tree for page understanding (46% text-based browser usage)
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <div>
                    <strong>Claude Code Interpreter</strong> - Can inspect DOM + accessibility properties when browsing
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <div>
                    <strong>Google Bard/Gemini</strong> - Web browsing mode parses semantic HTML + ARIA for context
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <div>
                    <strong>AI-powered browsers (Dia, Arc)</strong> - Next-gen browsers designed for AI agent integration, rely on accessibility tree
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <div>
                    <strong>Web crawlers with JS support</strong> - Google, Bing use accessibility tree to understand SPA content
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-heading">Why Agents Need ARIA</h5>
              <ul className="space-y-2 text-body">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span><strong>Identify interactive elements:</strong> "Which buttons are clickable?" → role="button", aria-label</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span><strong>Understand page structure:</strong> "Where's the main content?" → role="main", role="navigation"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span><strong>Fill forms correctly:</strong> "Which field is email?" → aria-label="Email address"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span><strong>Track dynamic changes:</strong> "Did the search complete?" → aria-live="polite" announcements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">→</span>
                  <span><strong>Extract structured data:</strong> Semantic roles help parse product listings, pricing, reviews</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="panel-inset p-4 mt-4">
            <p className="text-body text-sm leading-relaxed">
              <strong className="text-heading">Real-world impact:</strong> In agentic e-commerce testing, 
              <strong> 46% of agent visits used text-based browsers</strong> where only semantic HTML + ARIA 
              is visible (no CSS, images, or JavaScript execution). Sites with clear ARIA landmarks, labels, 
              and roles had <strong>2.8x higher agent conversion rates</strong> than sites relying on 
              visual-only cues.
            </p>
          </div>
        </Panel>

        {/* Browser Market Share */}
        <Panel className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <h4 className="text-lg font-bold text-heading">Screen Reader + Browser Combinations</h4>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-body">
              Screen reader users' browser preferences (2024 survey data):
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="panel-inset p-3 text-center">
                <div className="text-2xl font-bold text-accent">52.3%</div>
                <div className="text-xs text-heading font-medium">Chrome</div>
              </div>
              <div className="panel-inset p-3 text-center">
                <div className="text-2xl font-bold text-accent">19.3%</div>
                <div className="text-xs text-heading font-medium">Edge</div>
              </div>
              <div className="panel-inset p-3 text-center">
                <div className="text-2xl font-bold text-accent">16.0%</div>
                <div className="text-xs text-heading font-medium">Firefox</div>
              </div>
              <div className="panel-inset p-3 text-center">
                <div className="text-2xl font-bold text-accent">8.0%</div>
                <div className="text-xs text-heading font-medium">Safari</div>
              </div>
            </div>
            <div className="panel-inset p-3">
              <p className="text-body text-xs">
                <strong>Top combinations:</strong> JAWS+Chrome (24.7%), NVDA+Chrome (21.3%), NVDA+Firefox (11.4%), JAWS+Edge (10.0%). 
                This means your ARIA must work across multiple browser accessibility implementations.
              </p>
            </div>
          </div>
        </Panel>
      </section>

      {/* Testing Your ARIA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Panel variant="info" className="p-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🧪</div>
            <div className="flex-1 space-y-4">
              <h4 className="text-xl font-bold text-heading">
                How to Test ARIA Implementation
              </h4>
              <div className="space-y-3 text-body leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">1.</span>
                  <div>
                    <strong>Keyboard navigation:</strong> Tab through your entire page. 
                    Can you reach all interactive elements? Is the focus order logical?
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">2.</span>
                  <div>
                    <strong>Screen reader:</strong> Use NVDA (Windows), JAWS (Windows), or VoiceOver (Mac). 
                    Do landmarks make sense? Are labels clear? Do live regions announce properly?
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">3.</span>
                  <div>
                    <strong>Browser DevTools:</strong> Chrome/Edge have Accessibility panels showing 
                    the accessibility tree, ARIA attributes, and computed properties.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">4.</span>
                  <div>
                    <strong>Lighthouse audit:</strong> Run Lighthouse (Chrome DevTools → Lighthouse → Accessibility) 
                    for automated checks. Aim for 95+ score.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold">5.</span>
                  <div>
                    <strong>axe DevTools:</strong> Install the axe browser extension for detailed WCAG 
                    violation reports with remediation guidance.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* Resources */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold text-heading text-center">
          📖 Learn More
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-surface p-6 hover:shadow-lg transition-shadow block"
          >
            <h4 className="text-lg font-bold text-heading mb-2 flex items-center gap-2">
              <span>🌐</span> MDN ARIA Guide
            </h4>
            <p className="text-body text-sm">
              Comprehensive documentation for all ARIA roles, states, and properties with examples.
            </p>
          </a>

          <a
            href="https://www.w3.org/WAI/ARIA/apg/"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-surface p-6 hover:shadow-lg transition-shadow block"
          >
            <h4 className="text-lg font-bold text-heading mb-2 flex items-center gap-2">
              <span>📘</span> W3C ARIA Patterns
            </h4>
            <p className="text-body text-sm">
              Official design patterns for complex widgets: tabs, accordions, comboboxes, and more.
            </p>
          </a>

          <a
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-surface p-6 hover:shadow-lg transition-shadow block"
          >
            <h4 className="text-lg font-bold text-heading mb-2 flex items-center gap-2">
              <span>✅</span> WCAG Quick Reference
            </h4>
            <p className="text-body text-sm">
              Web Content Accessibility Guidelines checklist with success criteria and techniques.
            </p>
          </a>

          <a
            href="https://webaim.org/resources/contrastchecker/"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-surface p-6 hover:shadow-lg transition-shadow block"
          >
            <h4 className="text-lg font-bold text-heading mb-2 flex items-center gap-2">
              <span>🎨</span> WebAIM Contrast Checker
            </h4>
            <p className="text-body text-sm">
              Verify your color combinations meet WCAG AA/AAA contrast requirements.
            </p>
          </a>
        </div>
      </section>

      {/* Key Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Panel variant="success" className="p-8 border-l-4 border-[var(--color-success)]">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-heading mb-3">
                ARIA for Agent-Friendly Web Services
              </h4>
              <p className="text-body leading-relaxed mb-4">
                When you make your web app accessible to humans, you automatically make it easier 
                for AI agents to understand. Semantic landmarks help agents find navigation, content, 
                and forms. Clear labels help agents fill forms correctly. Live regions signal when 
                new data appears (like search results).
              </p>
              <p className="text-body leading-relaxed font-semibold">
                Good accessibility is a win-win: inclusive for humans, parseable for agents, 
                and often legally required. Start with semantic HTML, add ARIA where needed, 
                and test with real assistive technology.
              </p>
            </div>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}
