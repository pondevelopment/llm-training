# Question Template Guide

This guide explains how to create new questions and keep them consistent with the app’s conventions, including interactivity, MathJax usage, and share/unfurl behavior.

## File structure

Each question lives in `/questions` as its own file:

```
questions/
├── question-01.js
├── question-02.js
└── ...
```

Static per-question share pages live in `/q` and are named `N.html` (1–50). Use `_template.html` as a reference when adding new ones.


## Export format (CommonJS)

Define a file-scoped `question` object. The loader evaluates the file and returns `question` if present; optionally also export for Node/editor tooling.

```javascript
// questions/question-XX.js
const question = {
    title: "XX. Your concise question title?",
    answer: `...HTML content...`,
    interactive: {
        title: "[Interactive title]",
        html: `...interactive HTML...`,
        script: () => {
            // Attach listeners, compute results, update DOM
        }
    }
};

// Optional (safe) export for Node-based tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
```

## Answer content structure

Use the established layout from earlier questions:

1) Main concept box (blue) with definition + analogy
2) Comparison/option cards (2–3) for approaches/trade-offs
3) “Why this matters” with 3–4 bullets
4) Optional: code examples using `<code>`

Color system: Blue (concept), Green/Purple/Orange (options), Yellow (importance/tips).

Optional cross-links box (recommended for related topics):

```html
<div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
    <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
    <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
        <li><a href="#question-4" class="text-indigo-700 underline hover:text-indigo-900">Question 4: LoRA vs QLoRA</a></li>
        <!-- add 1–3 targeted links relevant to this question -->
    </ul>
</div>
```

## Interactive component

Include inputs, option selection (cards), quick examples, results, and an explanation area that updates as users interact. Prefer clear labels, sensible defaults, and visible selection states. For trade-off topics, consider an impact meter or pros/cons list.

### HTML skeleton

```html
<div class="space-y-6">
    <!-- Inputs -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">📝 [Input Label]</label>
        <!-- Your input(s) here -->
    </div>

    <!-- Options -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">🎯 [Choose a strategy]</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Option cards -->
        </div>
    </div>

    <!-- Results -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-900">🎨 [Results]</h4>
            <div id="qX-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
        </div>
        <div id="qX-output" class="min-h-[80px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
        <div id="qX-legend" class="mt-3 text-xs"></div>
    </div>

    <!-- Explanation -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="font-medium text-yellow-900 mb-2">📊 [Explanation]</h4>
        <div id="qX-explanation" class="text-sm text-yellow-800"></div>
    </div>
</div>
```

### JavaScript patterns

```javascript
script: () => {
    const input = document.getElementById('qX-input');
    const output = document.getElementById('qX-output');
    if (!input || !output) return; // Defensive check

    const update = () => {
        // Read inputs, compute results, update DOM
    };

    input.addEventListener('input', update);
    document.querySelectorAll('input[name="qX-option"]').forEach(r => r.addEventListener('change', update));
    update(); // initial
}
```

## MathJax guidelines (SVG Output Standard)

All math in this project renders with MathJax v3 using the `tex-svg` output. SVG is the mandated format because it:

1. Scales crisply on all DPR/zoom levels (no blurring like HTML/CSS fallbacks)
2. Preserves semantic structure for screen readers (where supported)
3. Avoids layout jitter vs. delayed web-font loading
4. Enables consistent vertical alignment across browsers

### Core rules

- Inline math: use `\(...\)` sparingly for short symbols or micro‑expressions inside sentences.
- Display math: ALWAYS wrap multi-symbol formulas in a dedicated block using the shared wrapper: `<div class="math-display"> $$ ... $$ </div>`.
- Group related steps (derivation lines) inside a SINGLE `.math-display` when they logically belong together. Use `\\` line breaks or an `align*` environment.
- Escape backslashes in JS template strings: `\\frac{a}{b}`, `\\sum_j e^{x_j}`.
- No custom macro definitions (keep portability). For named operators use `\\operatorname{softmax}` etc.
- Avoid visual micromanagement commands: no `\displaystyle` (already display), minimal `\text{}`—prefer symbols or short words only when clarity demands it.
- Do NOT wrap display math in additional colored / bordered / scrolling utility containers. Styling is centralized in `.math-display` (defined in `index.html`).
- Color is unified globally: `.math-display` sets `color: var(--math-color)` (defined in `:root`). Do NOT add inline styles or utility text‑color classes inside math blocks. If a future theme needs a different tone, override `--math-color` globally—not per question.
- Only use horizontal scroll (`overflow-x-auto whitespace-nowrap`) in truly constrained chip-like UI elements; avoid for standard answers (we removed legacy wrappers project‑wide).
- Never mix multiple separate `$$ ... $$` blocks back-to-back without need—combine unless you are intentionally separating conceptual stages.

### Consistency & formatting

- Prefer vertical alignment via `align*` instead of stacking many individual display blocks.
- Keep lines reasonably short; split long exponents or denominators across lines with `align*` if they risk horizontal scrolling.
- Use `p_i` / `p(y|x)` style probabilities; for softmax with temperature show both base and temperature form in one `.math-display` block with line breaks.
- Vectors: plain symbols (`x`, `h_t`) unless bold is essential: `\\boldsymbol{x}` (use sparingly).
- Matrices: `\\begin{bmatrix} a & b \\ c & d \\ \end{bmatrix}`.
- Partial derivatives: `\\frac{\\partial f}{\\partial x}`.

### Dynamic math (interactive sections)

When you inject or update formulas in `interactive.script()`:

1. Write/replace the HTML that contains the LaTeX (inline or a `.math-display`).
2. Call `typesetMath(containerElement)` with the closest wrapper—not the entire document—to limit work.
3. Avoid re‑typesetting unchanged siblings (performance & flicker).
4. If rapidly updating (e.g., slider), debounce or only typeset on `mouseup` unless clarity suffers.
5. Never re-add color classes (e.g., `text-blue-600`) to formulas—color inheritance is fixed via `--math-color`.
6. After injecting math, ensure you have not duplicated a trailing `\\end{aligned}`; stray duplicates cause MathJax input errors.

### Updated safe typeset helper

Minimal, non-destructive variant (does not purge existing rendered nodes outside the target):

```javascript
function typesetMath(root) {
    try {
        if (window.MathJax && window.MathJax.typesetPromise) {
            const el = root || document.getElementById('question-answer');
            if (!el) return Promise.resolve();
            return window.MathJax.typesetPromise([el]);
        }
    } catch {}
    return Promise.resolve();
}
```

Older code that removed all `mjx-container` nodes is no longer recommended (it forced full re-render and could momentarily remove already-correct math elsewhere).

### Example (grouped softmax forms)

```html
<div class="math-display">
$$ p_i = \frac{e^{x_i}}{\sum_j e^{x_j}} \\
p_i(T) = \frac{e^{x_i/T}}{\sum_j e^{x_j/T}} $$
</div>
```

### Quick do & don’t

Do:
- Use one `.math-display` per conceptual block
- Keep LaTeX plain & portable
- Re-typeset only the updated container
- Let the global variable handle equation color (no inline coloration)

Don’t:
- Add ad-hoc wrappers (`bg-white p-2`, `overflow-x-auto whitespace-nowrap`) around display math
- Chain many single-line `$$` blocks instead of one aligned block
- Inject custom macro packages
- Override math color inside individual questions

All existing questions follow this standard; new contributions must as well.

## Deep links and navigation

- Questions deep link like: `index.html#question-XX`
- Keyboard: Left/Right to navigate; press `S` to copy a share link
- Ensure the question is listed in `availableQuestions` in `js/app.js`

## Static share pages (OG/Twitter unfurls)

Each question has a static page at `/q/XX.html` used for rich link previews.

Checklist per page:
- `og:title` and `twitter:title` mirror the question title
- `og:description` and `twitter:description` summarize the interactive angle
- `og:image` uses the `...QXX.png` pattern
- Include an “Open in app” button to `../index.html#question-XX`

When you add or update questions, create/update the corresponding `/q/XX.html` file. Use `/q/_template.html` as a reference.

## Best practices

1. Start simple; focus on one core idea
2. Teach by interaction; defaults should be insightful
3. Explain why it matters; connect to real scenarios
4. Keep styling consistent; reuse established classes
5. Test thoroughly; verify on mobile and with MathJax

## Quick references

IDs (replace `X`): `qX-input`, `qX-output`, `qX-explanation`, `qX-example-btn`, `qX-indicator`, `qX-legend`, `name="qX-option"`

Classes:
- Containers: `space-y-4`, `space-y-6`, `grid md:grid-cols-3 gap-4`
- Backgrounds: `bg-blue-50`, `bg-white`, `from-blue-50 to-indigo-50`
- Borders: `border border-gray-200 rounded-lg`, `border-l-4 border-blue-400`
- Text: `text-sm font-medium text-gray-700`, `font-semibold text-blue-900`
- Interactive: `hover:bg-gray-50 transition-colors cursor-pointer`


## Basic Question Structure

Every question file must export a `question` object with this structure:

```javascript
// Question X: [Topic Name]
const question = {
    title: "X. [Clear, specific question title]?",
    answer: `[Educational content in HTML]`,
    interactive: {
        title: "[Interactive component title]",
        html: `[Interactive HTML structure]`,
        script: () => {
            // Interactive JavaScript functionality
        }
    }
};
```

## 1. Title Guidelines

### Format
- Start with question number: `"1. "`
- Use clear, specific language
- End with question mark if it's a question
- Keep under 80 characters for readability

### Examples
✅ **Good**: `"1. What does tokenization entail, and why is it critical for LLMs?"`
✅ **Good**: `"2. How do attention mechanisms work in transformers?"`
❌ **Bad**: `"1. Tokenization"` (too vague)
❌ **Bad**: `"1. Everything you need to know about tokenization in LLMs"` (too long)

## 2. Answer Content Structure

### HTML Layout
Use this proven structure from Question 1:

```html
<div class="space-y-4">
    <!-- Main Concept Box -->
    <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <h4 class="font-semibold text-blue-900 mb-2">🔤 What is [Concept]?</h4>
        <p class="text-blue-800">[Clear definition with analogy]</p>
    </div>
    
    <!-- Comparison/Options Grid -->
    <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
            <h5 class="font-medium text-green-900">[Option 1]</h5>
            <p class="text-sm text-green-700">[Brief description]</p>
            <code class="text-xs bg-green-100 px-1 rounded">[Example]</code>
        </div>
        <!-- Repeat for other options -->
    </div>
    
    <!-- Why It Matters -->
    <div class="bg-yellow-50 p-4 rounded-lg">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
            <li>• <strong>[Point 1]:</strong> [Explanation]</li>
            <li>• <strong>[Point 2]:</strong> [Explanation]</li>
        </ul>
    </div>
</div>
```

### Content Guidelines
1. **Start with a clear definition** in the blue box
2. **Use analogies** to make complex concepts relatable
3. **Compare different approaches** using the grid layout
4. **Explain practical importance** in the yellow "Why This Matters" section
5. **Keep paragraphs short** (2-3 sentences max)
6. **Use bullet points** for lists
7. **Include code examples** where relevant
8. **Use proper LaTeX syntax** for mathematical expressions
9. **Test mathematical rendering** with MathJax before finalizing

### Color Coding System
- **Blue**: Main concepts and definitions
- **Green**: First option/approach (usually simplest)
- **Purple**: Second option/approach (usually balanced)
- **Orange**: Third option/approach (usually most complex)
- **Yellow**: Importance, tips, and key takeaways

## 3. Interactive Component

### Structure
Every interactive component should have:

1. **Clear title** with emoji for visual appeal
2. **Input section** with gradient background
3. **Strategy/Option selection** with visual cards
4. **Quick examples** button(s)
5. **Results section** with live output
6. **Educational explanation** that updates based on selection

### HTML Template
```html
<div class="space-y-6">
    <!-- Input Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <label for="qX-input" class="block text-sm font-medium text-gray-700 mb-2">📝 [Input Label]</label>
        <input type="text" id="qX-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="[Default value]">
        <p class="text-xs text-gray-600 mt-1">[Helpful instruction]</p>
    </div>
    
    <!-- Option Selection -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">🎯 [Selection Label]</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Option cards -->
        </div>
    </div>

    <!-- Quick Examples -->
    <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
        <button id="qX-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">[Example text]</button>
    </div>
    
    <!-- Results -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-900">🎨 [Results Title]</h4>
            <div id="qX-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
        </div>
        <div id="qX-output" class="min-h-[80px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
        <div id="qX-legend" class="mt-3 text-xs"></div>
    </div>
    
    <!-- Educational Explanation -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="font-medium text-yellow-900 mb-2">📊 [Explanation Title]</h4>
        <div id="qX-explanation" class="text-sm text-yellow-800"></div>
    </div>
</div>
```

### JavaScript Guidelines

1. **Use descriptive variable names** with question prefix (`qX-`)
2. **Add error handling** for missing elements
3. **Include visual feedback** (hover effects, color coding)
4. **Provide helpful tooltips** with detailed information
5. **Update explanations dynamically** based on user selections
6. **Add cycling examples** for educational value

### Key JavaScript Patterns

```javascript
script: () => {
    // Get DOM elements with error checking
    const input = document.getElementById('qX-input');
    const output = document.getElementById('qX-output');
    if (!input || !output) return;
    
    // Main processing function
    const processData = () => {
        const value = input.value;
        const selectedOption = document.querySelector('input[name="qX-option"]:checked');
        if (!selectedOption) return;
        
        // Clear previous results
        output.innerHTML = '';
        
        // Process and display results
        // ... processing logic ...
        
        // Update visual indicators
        updateVisuals(selectedOption.value);
        
        // Update educational content
        updateExplanation(selectedOption.value);
    };
    
    // Event listeners
    input.addEventListener('input', processData);
    document.querySelectorAll('input[name="qX-option"]').forEach(radio => {
        radio.addEventListener('change', processData);
    });
    
    // Initial setup
    processData();
}
```

### MathJax Integration & Coding Guidelines

The application uses an enhanced MathJax 3.x configuration optimized for educational content. Follow these comprehensive guidelines for proper mathematical notation.

#### Mathematical Delimiters

The delimiters tell MathJax where your math begins and ends. Using the correct type is essential for proper rendering.

**Displayed Mathematics:** For equations that should be centered on their own line, use `$$...$$ ` or `\[...\]`.

```html
<!-- Centered equation on its own line -->
<div class="text-center">
    $$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
</div>

<!-- Alternative display math syntax -->
<div class="math-display">
    \[J_{ij} = \frac{\partial f_i}{\partial x_j}\]
</div>
```

**Inline Mathematics:** For math that appears within the flow of a sentence, use `\(...\)`.

```html
<!-- Math within text flow -->
<p>The Jacobian matrix \(J\) captures how each output \(f_i\) changes with respect to input \(x_j\).</p>
```

**Important Note on Single Dollar Signs:** While the application supports single dollar signs (`$...$`) for backward compatibility, it's best practice to use `\(...\)` delimiters for inline math to prevent conflicts with regular text (like prices $20).

#### TeX/LaTeX Input Format

MathJax uses TeX/LaTeX as its primary input format. Always generate standard LaTeX commands for mathematical notation:

```latex
<!-- Recommended LaTeX patterns -->
\mathbf{W}           <!-- Bold vectors/matrices -->
\frac{\partial f}{\partial x}   <!-- Fractions and derivatives -->
\mathbb{R}           <!-- Number sets -->
\text{softmax}       <!-- Text within math -->
\sum_{i=1}^{n}       <!-- Summations -->
\begin{bmatrix} a & b \\ c & d \end{bmatrix}  <!-- Matrices -->
```

#### Integration with HTML and JavaScript

When embedding MathJax into web content, be mindful of characters that have special meaning in HTML and JavaScript.

**HTML Special Characters:** The less-than symbol (`<`) starts an HTML tag. Ensure proper spacing around inequality symbols:

```html
<!-- Correct: spaces around inequality -->
<p>For all \( x > 0 \) and \( y < 1 \), we have...</p>

<!-- Avoid: no spaces might cause HTML parsing issues -->
<p>For all \(x>0\) and \(y<1\), we have...</p>
```

**JavaScript String Escaping:** When generating MathJax code inside JavaScript strings, escape every backslash (`\`) with another backslash (`\\`):

```javascript
// Correct JavaScript string escaping
const mathExpression = '\\(E = mc^2\\)';
const displayMath = '$$\\frac{\\partial f}{\\partial x}$$';

// Incorrect - will not render properly
const wrongExpression = '\(E = mc^2\)';
```

**Markdown Conflicts:** In systems using Markdown, escape special characters:

```latex
<!-- In Markdown environments, escape underscores -->
x\_i    <!-- Instead of x_i -->
y\_j    <!-- Instead of y_j -->
```

#### Controlling Layout: `<div>` vs `<span>`

How you wrap MathJax code in HTML tags affects its placement on the page.

**Use `<span>` for inline math** if you need styling wrapper:

```html
<!-- Inline math with styling -->
<span class="math-highlight">\(f(x) = ax + b\)</span>

<!-- Math within a paragraph -->
<p>The function <span class="math-inline">\(\sigma(x)\)</span> is the sigmoid activation.</p>
```

**Use `<div>` for displayed math** to create proper line breaks:

```html
<!-- Block-level displayed math -->
<div class="math-equation">
    $$\mathbf{J} = \begin{bmatrix}
    \frac{\partial f_1}{\partial x_1} & \frac{\partial f_1}{\partial x_2} \\
    \frac{\partial f_2}{\partial x_1} & \frac{\partial f_2}{\partial x_2}
    \end{bmatrix}$$
</div>

<!-- Centered display math -->
<div class="text-center bg-blue-50 p-4 rounded">
    $$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left(\frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}}\right)\mathbf{V}$$
</div>
```

#### MathJax Configuration Features

The application uses this enhanced configuration:

```javascript
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        processRefs: true,
        packages: {
            '[+]': ['base', 'ams', 'newcommand', 'configmacros', 'action', 'unicode']
        },
        macros: {
            R: '{\\mathbb{R}}',
            grad: '{\\nabla}',
            partial: '{\\partial}',
            // ... additional helpful macros
        }
    },
    svg: {
        fontCache: 'global',
        scale: 1.0,
        minScale: 0.5
    },
    options: {
        enableMenu: false,
        processEscapes: true,
        processEnvironments: true
    }
};
```

**Key features:**
- **Enhanced error recovery** with automatic retry mechanisms
- **SVG rendering** for crisp mathematical display
- **Standard LaTeX packages** with additional mathematical symbols
- **Helpful macros** for common mathematical notation
- **Automatic re-rendering** when content changes dynamically

#### Best Practices for Question Development

1. **Test mathematical expressions** using the provided `test-math.html` file
2. **Use semantic CSS classes** for mathematical content styling
3. **Provide context** for complex equations with explanatory text
4. **Escape properly** when generating math in JavaScript strings
5. **Use appropriate delimiters** based on whether math is inline or displayed
6. **Validate rendering** before finalizing questions
7. **Follow accessibility** guidelines for mathematical content

## 4. Mathematical Content Guidelines

### LaTeX Syntax Requirements
When including mathematical expressions in your questions, use proper LaTeX syntax with MathJax. **See the comprehensive [MathJax Integration & Coding Guidelines](#mathjax-integration--coding-guidelines) section below for detailed delimiter usage, JavaScript escaping, and HTML integration.**

#### Quick Reference - Essential LaTeX Commands
- **Bold vectors/matrices**: `\mathbf{J}`, `\mathbf{x}`, `\mathbf{W}`
- **Fractions**: `\frac{\partial f}{\partial x}` (not HTML subscripts/superscripts)
- **Number sets**: `\mathbb{R}`, `\mathbb{C}`, `\mathbb{Z}`
- **Text in math**: `\text{ReLU}`, `\text{softmax}`
- **Greek letters**: `\alpha`, `\beta`, `\theta`, `\sigma`
- **Subscripts/superscripts**: `x_i`, `x^2`, `f_{ij}`
- **Matrices**: `\begin{bmatrix} a & b \\ c & d \end{bmatrix}`
- **Functions**: `\sin`, `\cos`, `\log`, `\exp`
- **Multi-line equations**: `\begin{align*} ... \end{align*}` with `&` alignment and `\\\\` line breaks

#### Quick Examples

**Inline Math (within text):**
```html
<p>The gradient \(\frac{\partial L}{\partial x}\) represents the rate of change.</p>
```

**Display Math (centered equations):**
```html
<div class="bg-white p-3 rounded border text-center">
    $$\mathbf{J}_{ij} = \frac{\partial f_i}{\partial x_j}$$
</div>
```

#### Mathematical Structure Examples

**Simple equation with explanation:**
```html
<div class="math-equation mt-3">
    <div class="text-center">
        <p class="text-sm text-blue-700 mb-2">Chain rule for composed functions:</p>
        <div class="bg-white p-3 rounded border">
            $$\frac{\partial z}{\partial x} = \frac{\partial z}{\partial y} \cdot \frac{\partial y}{\partial x}$$
        </div>
        <p class="text-xs text-blue-600 mt-2">This enables efficient gradient computation.</p>
    </div>
</div>
```

**Matrix definition with structure:**
```html
<div class="math-matrix">
    $$\mathbf{J} = \begin{bmatrix}
    \frac{\partial f_1}{\partial x_1} & \frac{\partial f_1}{\partial x_2} & \cdots \\
    \frac{\partial f_2}{\partial x_1} & \frac{\partial f_2}{\partial x_2} & \cdots \\
    \vdots & \vdots & \ddots
    \end{bmatrix}$$
</div>
```

**Step-by-step mathematical process:**
```html
<div class="space-y-4">
    <div class="text-center">
        <p class="text-sm font-medium text-purple-700">Step 1: Function composition</p>
        <div class="bg-white p-3 rounded border">$$z = h(g(f(x)))$$</div>
    </div>
    <div class="text-center">
        <p class="text-sm font-medium text-purple-700">Step 2: Apply chain rule</p>
        <div class="bg-white p-3 rounded border">
            $$\frac{\partial z}{\partial x} = \frac{\partial z}{\partial h} \cdot \frac{\partial h}{\partial g} \cdot \frac{\partial g}{\partial f} \cdot \frac{\partial f}{\partial x}$$
        </div>
    </div>
</div>
```

**Multi-line aligned equations:**
```html
<div class="bg-white p-3 rounded border text-center">
    $$
    \\begin{align*}
    \\mathcal{L} = & \\mathbb{E}[r(x,y)] \\\\
                   & - \\beta D_{KL}(\\pi||\\pi_{ref})
    \\end{align*}
    $$
</div>
```

**Complex formulas with line breaks:**
```html
<div class="text-sm bg-blue-50 p-3 rounded">
    $$
    \\begin{align*}
    JS(P,Q) = & \\frac{1}{2}D_{KL}(P||M) \\\\
              & + \\frac{1}{2}D_{KL}(Q||M)
    \\end{align*}
    $$
</div>
```

### Mathematical Content Best Practices

1. **Always use LaTeX syntax** - Avoid HTML subscripts/superscripts like `x<sub>i</sub>`
2. **Be consistent with notation** - Use `\mathbf{}` for all vectors and matrices
3. **Include context** - Explain what each symbol represents
4. **Test rendering** - Verify all expressions display correctly
5. **Use semantic markup** - Wrap math in appropriate CSS classes
6. **Provide intuition** - Follow complex equations with plain English explanations

### Common Mathematical Patterns

#### Gradient/Derivative Expressions
```html
<!-- Partial derivative -->
$$\frac{\partial L}{\partial W_{ij}}$$

<!-- Gradient vector -->
$$\nabla_{\mathbf{x}} f = \left[\frac{\partial f}{\partial x_1}, \frac{\partial f}{\partial x_2}, \ldots\right]^T$$

<!-- Chain rule -->
$$\frac{\partial L}{\partial \mathbf{x}} = \frac{\partial L}{\partial \mathbf{y}} \frac{\partial \mathbf{y}}{\partial \mathbf{x}}$$
```

#### Attention Mechanism Math
```html
<!-- Attention weights -->
$$\text{Attention}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\left(\frac{\mathbf{Q}\mathbf{K}^T}{\sqrt{d_k}}\right)\mathbf{V}$$

<!-- Multi-head attention -->
$$\text{MultiHead}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)\mathbf{W}^O$$
```

#### Loss Functions
```html
<!-- Cross-entropy loss -->
$$L = -\sum_{i=1}^{n} y_i \log(\hat{y}_i)$$

<!-- Mean squared error -->
$$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$$

<!-- KL divergence for LLM training -->
$$
\\begin{align*}
\\mathcal{L}_{RLHF} = & \\mathbb{E}[r(x,y)] \\\\
                      & - \\beta D_{KL}(\\pi||\\pi_{ref})
\\end{align*}
$$
```

#### Information Theory & Divergences
```html
<!-- KL divergence -->
$$D_{KL}(P||Q) = \\sum_{x} P(x) \\log \\frac{P(x)}{Q(x)}$$

<!-- Jensen-Shannon divergence -->
$$
\\begin{align*}
JS(P,Q) = & \\frac{1}{2}D_{KL}(P||M) \\\\
          & + \\frac{1}{2}D_{KL}(Q||M)
\\end{align*}
$$

<!-- Wasserstein distance -->
$$W(P,Q) = \\inf_{\\gamma} \\mathbb{E}[d(x,y)]$$
```

### Avoiding Common LaTeX Errors

**See the comprehensive [MathJax Integration & Coding Guidelines](#mathjax-integration--coding-guidelines) section for detailed best practices.**

❌ **Don't use HTML math notation:**
```html
<p>x<sub>i</sub><sup>2</sup> + y<sub>j</sub></p>
```

✅ **Use proper LaTeX:**
```html
<p>\(x_i^2 + y_j\)</p>
```

❌ **Don't forget JavaScript escaping:**
```javascript
// Wrong - backslashes not escaped
const formula = '\(E = mc^2\)';
```

✅ **Escape backslashes in JavaScript strings:**
```javascript
// Correct - backslashes properly escaped
const formula = '\\(E = mc^2\\)';
const display = '$$\\frac{\\partial f}{\\partial x}$$';
const multiline = '$$\\\\begin{align*}...\\\\end{align*}$$';
```

❌ **Don't use undefined macros:**
```latex
$$\grad f$$  <!-- Custom macro that might not be defined -->
```

✅ **Use standard LaTeX commands:**
```latex
$$\nabla f$$  <!-- Standard gradient symbol -->
```

❌ **Don't mix HTML and LaTeX:**
```html
$$\mathbf{J}<sub>ij</sub> = \frac{\partial f_i}{\partial x_j}$$
```

✅ **Use consistent LaTeX:**
```latex
$$\mathbf{J}_{ij} = \frac{\partial f_i}{\partial x_j}$$
```

❌ **Don't use wrong delimiters for context:**
```html
<!-- Wrong: using display math inline breaks text flow -->
<p>The function $$f(x) = ax + b$$ is linear.</p>
```

✅ **Use appropriate delimiters:**
```html
<!-- Correct: inline math within text -->
<p>The function \(f(x) = ax + b\) is linear.</p>

<!-- Correct: display math on its own line -->
<div class="text-center">
    $$f(x) = ax + b$$
</div>
```

❌ **Long formulas without line breaks:**
```latex
$$\mathcal{L} = \mathbb{E}[r(x,y)] - \beta D_{KL}(\pi||\pi_{ref}) + \lambda \text{reg}(\theta)$$
```

✅ **Use align* environment for long formulas:**
```latex
$$
\\begin{align*}
\\mathcal{L} = & \\mathbb{E}[r(x,y)] \\\\
               & - \\beta D_{KL}(\\pi||\\pi_{ref}) \\\\
               & + \\lambda \\text{reg}(\\theta)
\\end{align*}
$$
```

## 5. Styling Guidelines

### CSS Classes to Use
- **Containers**: `space-y-4`, `space-y-6`, `grid`, `flex`
- **Backgrounds**: `bg-blue-50`, `bg-white`, `bg-gradient-to-r`
- **Borders**: `border`, `border-gray-200`, `rounded-lg`, `border-l-4`
- **Text**: `text-sm`, `font-medium`, `text-gray-700`
- **Interactive**: `hover:bg-gray-50`, `transition-colors`, `cursor-pointer`

### Color Scheme
- **Primary Blue**: `bg-blue-50`, `text-blue-900`, `border-blue-400`
- **Success Green**: `bg-green-50`, `text-green-900`, `border-green-400`
- **Info Purple**: `bg-purple-50`, `text-purple-900`, `border-purple-400`
- **Warning Orange**: `bg-orange-50`, `text-orange-900`, `border-orange-400`
- **Accent Yellow**: `bg-yellow-50`, `text-yellow-900`, `border-yellow-200`

## 6. Testing Checklist

Before submitting a new question:

### Functionality
- [ ] Question loads without JavaScript errors
- [ ] All interactive elements respond correctly
- [ ] Default values are sensible and educational
- [ ] Examples cycle through different scenarios
- [ ] Visual feedback works (hover, selection, etc.)

### Content Quality
- [ ] Title is clear and specific
- [ ] Answer explains the concept thoroughly
- [ ] Examples are realistic and educational
- [ ] Color coding is consistent with the system
- [ ] Educational explanations update correctly

### User Experience
- [ ] Interface is intuitive without instructions
- [ ] Loading time is reasonable
- [ ] Works on both desktop and mobile
- [ ] Tooltips provide helpful additional information
- [ ] Visual design is consistent with other questions

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Color is not the only way to convey information
- [ ] Text contrast meets accessibility standards
- [ ] Labels are properly associated with form elements

## 7. Common Patterns by Question Type

### Comparison Questions
Use the grid layout to compare different approaches, algorithms, or techniques.

### Process Questions
Show step-by-step breakdowns with numbered or sequential visual elements.

### Technical Deep-Dives
Include code examples, mathematical representations, or detailed diagrams.

### Conceptual Explanations
Focus on analogies, real-world examples, and practical implications.

## 8. File Naming and Organization

### File Names
- Use zero-padded numbers: `question-01.js`, `question-02.js`, ..., `question-50.js`
- Keep consistent naming pattern
- One question per file

### Comments
```javascript
// Question X: [Topic Name - Brief Description]
// Created: [Date]
// Last Updated: [Date]
// Educational Focus: [Key learning objectives]
```

## 9. Integration Steps

After creating a new question:

1. **Create the question file** in `/questions/` directory
2. **Test locally** using your development server
3. **Verify the question appears** in the dropdown navigation
4. **Check navigation** (Previous/Next buttons work correctly)
5. **Test on different devices** and screen sizes

## 10. Example Question Types

### Data Structure: Simple Interactive
Focus on one main concept with 2-3 options to explore.

### Algorithm Comparison: Complex Interactive
Multiple algorithms/approaches with detailed comparisons and visualizations.

### Mathematical Concept: Formula Explorer
Input parameters and see how they affect mathematical formulas or models.

### Architecture Overview: Component Builder
Build or explore system architectures step by step.

### Advanced Interactive Patterns (New)
Based on recent question implementations:

**Distribution Visualizer**
- Real-time parameter adjustment with sliders
- Interactive bar chart visualization 
- Multiple analysis modes (forward/reverse/symmetric)
- Scenario-based learning with presets

**Mathematical Expression Explorer**  
- Multi-line formula rendering with align* environment
- Dynamic mathematical insight explanations
- Professional mathematical notation with proper escaping

**Mode-Based Analysis Tools**
- Radio button selection for different analysis modes
- Dynamic visual indicators and explanations
- Cycling through predefined educational scenarios

## 11. Best Practices Summary

1. **Start simple** - Focus on one core concept per question
2. **Make it interactive** - Always include hands-on exploration
3. **Explain why it matters** - Connect to practical applications
4. **Use consistent styling** - Follow the established design patterns
5. **Test thoroughly** - Ensure reliability across different inputs
6. **Keep it educational** - Every element should teach something
7. **Progressive complexity** - Start simple, allow deeper exploration
8. **Visual feedback** - Use colors, animations, and hover effects thoughtfully

## 12. Advanced Interactive Patterns

Based on recent question implementations, here are sophisticated interactive patterns that enhance educational value:

### Distribution and Parameter Exploration

**Pattern**: Real-time parameter adjustment with immediate visual feedback

```html
<!-- Parameter Control Section -->
<div class="grid md:grid-cols-2 gap-4">
    <div class="bg-white border border-gray-200 rounded-lg p-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">🎯 Target Distribution P</label>
        <div class="space-y-2">
            <div class="flex items-center space-x-2">
                <label class="text-xs w-16">Peak:</label>
                <input type="range" id="qX-p-peak" min="0" max="10" value="5" step="0.1" class="flex-1">
                <span id="qX-p-peak-val" class="text-xs w-8">5.0</span>
            </div>
        </div>
    </div>
</div>
```

**Key Features**:
- Immediate visual updates on parameter change
- Value display next to sliders
- Scenario-based presets for educational contexts
- Professional bar chart or visualization output

### Mode-Based Analysis Tools

**Pattern**: Radio button selection with dynamic explanations

```html
<!-- Analysis Mode Selection -->
<div class="bg-white border border-gray-200 rounded-lg p-4">
    <label class="block text-sm font-medium text-gray-700 mb-3">🔬 Analysis Mode</label>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="qX-mode" value="forward" checked class="absolute top-2 right-2">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-900">Forward Analysis</span>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mode 1</span>
                </div>
                <p class="text-xs text-gray-600">Description of what this mode does</p>
            </div>
        </label>
    </div>
</div>
```

**Key Features**:
- Visual mode indicators that update with selection
- Color-coded tags for different modes
- Detailed explanations that change based on selection
- Professional visual feedback on hover and selection

### Multi-line Mathematical Formula Rendering

**Pattern**: Professional mathematical notation with proper alignment

```html
<!-- Complex Formula Display -->
<div class="text-sm bg-blue-50 p-3 rounded mb-3">
    $$
    \\begin{align*}
    JS(P,Q) = & \\frac{1}{2}D_{KL}(P||M) \\\\
              & + \\frac{1}{2}D_{KL}(Q||M)
    \\end{align*}
    $$
</div>
```

**Best Practices**:
- Use `align*` environment for long formulas
- Escape backslashes properly in JavaScript: `\\\\begin{align*}`
- Include `&` for alignment points
- Use `\\\\\\\\` for line breaks in JavaScript strings
- Test formula rendering thoroughly

### Educational Scenario Cycling

**Pattern**: Quick scenario button with educational presets

```html
<!-- Quick Scenarios -->
<div class="flex flex-wrap gap-2">
    <span class="text-sm font-medium text-gray-700">💡 Quick Scenarios:</span>
    <button id="qX-scenario-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Perfect Match</button>
</div>
```

**Implementation**:
```javascript
const quickScenarios = [
    { params: {...}, mode: 'forward', note: 'Perfect Match' },
    { params: {...}, mode: 'reverse', note: 'Student Underfits' },
    // ... more scenarios
];

scenarioBtn.addEventListener('click', () => {
    const scenario = quickScenarios[scenarioIndex];
    // Apply scenario parameters
    // Update displays
    scenarioIndex = (scenarioIndex + 1) % quickScenarios.length;
});
```

### Professional Visualization Components

**Pattern**: Interactive bar charts and visual displays

```html
<!-- Distribution Visualization -->
<div class="relative h-32 bg-gradient-to-b from-gray-50 to-gray-100 rounded border p-2">
    <div class="flex items-end justify-between h-full space-x-1">
        <!-- Dynamically generated bars -->
    </div>
</div>
```

**Features**:
- Tooltips with detailed information
- Color-coded data representation
- Responsive scaling and layout
- Legend with clear labeling

### Dynamic Educational Explanations

**Pattern**: Context-aware educational content

```html
<!-- Mathematical Insight -->
<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <h4 class="font-medium text-yellow-900 mb-2">🧮 Mathematical Insight</h4>
    <div id="qX-explanation" class="text-sm text-yellow-800"></div>
</div>
```

**Implementation**:
```javascript
function updateExplanation(mode, values) {
    const explanations = {
        'forward': `Forward analysis shows...`,
        'reverse': `Reverse analysis reveals...`,
        'symmetric': `Symmetric approach provides...`
    };
    
    let explText = explanations[mode];
    explText += ` Current values: ${formatValues(values)}`;
    
    explanation.innerHTML = explText;
}
```

### Enhanced Error Handling and User Experience

**Pattern**: Robust DOM element checking and fallbacks

```javascript
script: () => {
    // Get DOM elements with error checking
    const element = document.getElementById('qX-element');
    if (!element) {
        console.error('Required element not found');
        return;
    }
    
    // Add comprehensive try-catch blocks
    try {
        // Main functionality
    } catch (error) {
        console.error('Error in processing:', error);
        if (output) {
            output.innerHTML = '<div class="text-red-500 p-4">Error processing data. Please try again.</div>';
        }
    }
}
```

---

## Quick Reference: Question 1 Features

The tokenization question demonstrates these key features:
- ✅ Clear concept explanation with analogy
- ✅ Three-option comparison grid
- ✅ Interactive tokenizer with real-time updates
- ✅ Color-coded token visualization
- ✅ Statistical feedback (token count, compression ratio)
- ✅ Educational explanations that update based on selection
- ✅ Cycling examples with explanatory tooltips
- ✅ Professional, accessible design

## Quick Reference: Question 29 Advanced Features

The KL divergence question demonstrates advanced patterns:
- ✅ Multi-line mathematical formulas with align* environment
- ✅ Real-time parameter adjustment with visual feedback
- ✅ Mode-based analysis with professional radio button selection
- ✅ Interactive distribution visualization with bar charts
- ✅ Scenario-based learning with educational presets
- ✅ Dynamic mathematical insights that update with parameters
- ✅ Professional mathematical notation with proper escaping
- ✅ Responsive design that prevents formula overflow

Use both questions as reference templates for creating comprehensive interactive educational content!

The tokenization question demonstrates these key features:
- ✅ Clear concept explanation with analogy
- ✅ Three-option comparison grid
- ✅ Interactive tokenizer with real-time updates
- ✅ Color-coded token visualization
- ✅ Statistical feedback (token count, compression ratio)
- ✅ Educational explanations that update based on selection
- ✅ Cycling examples with explanatory tooltips
- ✅ Professional, accessible design

Use this as your reference template for creating new questions!
