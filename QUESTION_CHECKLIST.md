# Question Creat### Content Development

### Title & Basic Info
- [ ] Write clear, specific question title (under 80 characters)
- [ ] Start title with question number: "X. "
- [ ] End with question mark if it's a question

### Answer Section
- [ ] Write main concept explanation in blue box
- [ ] Include helpful analogy or real-world comparison
- [ ] Create 2-3 option comparison cards with different colors
- [ ] Add practical code examples in `<code>` tags
- [ ] Write "Why This Matters" section with 3-4 bullet points
- [ ] Use emojis appropriately (🔤 🎯 📝 etc.)
- [ ] Use LaTeX syntax for mathematical expressions ($$...$$, $...$)
- [ ] Test mathematical rendering with MathJax

### Mathematical Content (if applicable)
- [ ] Use proper LaTeX syntax: `$$\\mathbf{J} = \\frac{\\partial f}{\\partial x}$$`
- [ ] Use `\\mathbf{}` for bold matrices and vectors
- [ ] Use `\\frac{}{}` for fractions instead of HTML
- [ ] Use `\\mathbb{R}` for real number sets
- [ ] Use `\\text{}` for text within math expressions
- [ ] Test all mathematical expressions render correctly
- [ ] Avoid custom MathJax macros (use standard LaTeX)

Use this checklist when creating new questions for the LLM Questions app.

## Before You Start
- [ ] Review the `QUESTION_TEMPLATE_GUIDE.md` for detailed instructions
- [ ] Copy `questions/question-template.js` as your starting point
- [ ] Identify the key concept you want to teach
- [ ] Plan 2-3 different approaches/options to compare

## File Setup
- [ ] Rename file to `question-XX.js` (with correct number)
- [ ] Update the comment header with topic and creation date
- [ ] Replace all `qX-` prefixes with your question number (e.g., `q5-`)
- [ ] Replace all `[placeholder text]` with actual content

## Content Development

### Title & Basic Info
- [ ] Write clear, specific question title (under 80 characters)
- [ ] Start title with question number: "X. "
- [ ] End with question mark if it's a question

### Answer Section
- [ ] Write main concept explanation in blue box
- [ ] Include helpful analogy or real-world comparison
- [ ] Create 2-3 option comparison cards with different colors
- [ ] Add practical code examples in `<code>` tags
- [ ] Write "Why This Matters" section with 3-4 bullet points
- [ ] Use emojis appropriately (🔤 🎯 📝 etc.)

### Interactive Component
- [ ] Update interactive title with appropriate emoji
- [ ] Set meaningful default input value
- [ ] Create 2-3 strategy option cards
- [ ] Add descriptive labels and tags (Simple/Smart/Detailed)
- [ ] Include mini-examples in each option card

## JavaScript Implementation

### Core Functionality
- [ ] Replace `processInput()` with your actual logic
- [ ] Update `configData` object with option-specific information
- [ ] Implement proper error handling for missing DOM elements
- [ ] Add meaningful tooltips with detailed information

### Visual Elements
- [ ] Customize result display styling and colors
- [ ] Update statistics to be relevant to your concept
- [ ] Create appropriate legend/color coding if needed
- [ ] Implement visual feedback (hover effects, selection indicators)

### Educational Content
- [ ] Write explanations for each strategy option
- [ ] Include pros/cons for each approach
- [ ] Specify when each option is best used
- [ ] Update explanations to be concept-specific

### Examples
- [ ] Create 3-5 realistic, educational examples
- [ ] Ensure examples demonstrate different aspects of the concept
- [ ] Add explanatory notes for each example
- [ ] Test example cycling functionality

## Testing

### Functionality Testing
- [ ] Question loads without JavaScript errors
- [ ] All radio buttons work correctly
- [ ] Input changes trigger updates immediately
- [ ] Example button cycles through all examples
- [ ] Statistics update correctly
- [ ] Visual indicators respond to selection changes

### Content Quality
- [ ] All explanations are accurate and educational
- [ ] Examples are realistic and demonstrate key concepts
- [ ] Color coding is consistent and meaningful
- [ ] Tooltips provide helpful additional information
- [ ] Mathematical expressions use proper LaTeX syntax
- [ ] All math formulas render correctly without errors

### User Experience
- [ ] Interface is intuitive without instructions
- [ ] Default values provide immediate educational value
- [ ] Hover effects work smoothly
- [ ] Selection states are clearly visible
- [ ] Mobile responsiveness works well

### Integration
- [ ] Question appears in navigation dropdown
- [ ] Previous/Next navigation works correctly
- [ ] Question title displays properly
- [ ] Progress indicator updates correctly

## Common Issues to Check

### Technical
- [ ] No console errors when loading the question
- [ ] All DOM element queries succeed (no null references)
- [ ] Event listeners are properly attached
- [ ] Memory leaks avoided (no global variables)
- [ ] MathJax rendering completes without errors
- [ ] Mathematical expressions display correctly

### Content
- [ ] No [placeholder text] remains in final version
- [ ] All links and references are accurate
- [ ] Spelling and grammar are correct
- [ ] Technical terms are properly explained

### Design
- [ ] Colors follow the established scheme
- [ ] Typography is consistent with other questions
- [ ] Spacing and layout match the template
- [ ] Icons and emojis are appropriate and consistent

## File Locations

After creating your question:
- [ ] Question file is in `/questions/question-XX.js`
- [ ] Question loads when accessing `index-new.html`
- [ ] Question appears in dropdown navigation
- [ ] Question is accessible via direct URL

## Pre-Submission Review

- [ ] Code follows the established patterns
- [ ] Educational value is clear and significant
- [ ] Interactive elements enhance understanding
- [ ] Content is accurate and well-researched
- [ ] Design is polished and professional
- [ ] Performance is acceptable (loads quickly)

## Submission
- [ ] Test final version thoroughly
- [ ] Document any special features or requirements
- [ ] Ensure code is clean and well-commented
- [ ] Verify compatibility with existing questions

---

## Quick Reference: Element IDs Pattern

Replace `X` with your question number:
- `qX-text-input` - Main input field
- `qX-strategy` - Radio button group name
- `qX-output` - Results display area
- `qX-legend` - Legend/key display
- `qX-explanation` - Educational explanation
- `qX-strategy-indicator` - Current strategy display
- `qX-example-btn` - Example cycling button

## Quick Reference: CSS Classes

**Containers:** `space-y-4`, `space-y-6`, `grid md:grid-cols-3 gap-4`
**Backgrounds:** `bg-blue-50`, `bg-white`, `bg-gradient-to-r from-blue-50 to-indigo-50`
**Borders:** `border border-gray-200 rounded-lg`, `border-l-4 border-blue-400`
**Text:** `text-sm font-medium text-gray-700`, `font-semibold text-blue-900`
**Interactive:** `hover:bg-gray-50 transition-colors cursor-pointer`

## MathJax Integration Requirements

### LaTeX Syntax Standards
- [ ] Use `$$...$$` for display math (centered equations)
- [ ] Use `$...$` for inline math expressions
- [ ] Use `\mathbf{}` for bold vectors and matrices
- [ ] Use `\frac{}{}` for fractions instead of HTML
- [ ] Use `\text{}` for text within mathematical expressions
- [ ] Use standard LaTeX commands only (no custom macros)

### Mathematical Expression Testing
- [ ] All equations render without "Math input error" messages
- [ ] Mathematical expressions display with proper fonts and sizing
- [ ] Complex equations with matrices render correctly
- [ ] Inline math integrates well with surrounding text
- [ ] Display math is properly centered and formatted

### Common LaTeX Patterns to Use
- [ ] Partial derivatives: `\frac{\partial f}{\partial x}`
- [ ] Matrices: `\begin{bmatrix} a & b \\ c & d \end{bmatrix}`
- [ ] Vectors: `\mathbf{x}`, `\mathbf{W}`
- [ ] Number sets: `\mathbb{R}`, `\mathbb{C}`
- [ ] Functions: `\text{softmax}`, `\text{ReLU}`
- [ ] Greek letters: `\alpha`, `\beta`, `\theta`

### Mathematical Content Structure
- [ ] Wrap display math in appropriate containers (`.math-equation`, etc.)
- [ ] Include explanatory text before and after complex equations
- [ ] Use consistent mathematical notation throughout the question
- [ ] Provide context for all mathematical symbols used
