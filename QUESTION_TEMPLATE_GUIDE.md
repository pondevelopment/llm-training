# Question Template Guide

This guide explains how to create new questions for the Top 50 LLM Questions interactive app, using Question 1 (Tokenization) as the template and reference.

## File Structure

Each question should be in its own file in the `/questions` directory:
```
questions/
├── question-01.js  (Template reference)
├── question-02.js
├── question-XX.js
└── ...
```

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

## 4. Styling Guidelines

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

## 5. Testing Checklist

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

## 6. Common Patterns by Question Type

### Comparison Questions
Use the grid layout to compare different approaches, algorithms, or techniques.

### Process Questions
Show step-by-step breakdowns with numbered or sequential visual elements.

### Technical Deep-Dives
Include code examples, mathematical representations, or detailed diagrams.

### Conceptual Explanations
Focus on analogies, real-world examples, and practical implications.

## 7. File Naming and Organization

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

## 8. Integration Steps

After creating a new question:

1. **Create the question file** in `/questions/` directory
2. **Test locally** using your development server
3. **Verify the question appears** in the dropdown navigation
4. **Check navigation** (Previous/Next buttons work correctly)
5. **Test on different devices** and screen sizes

## 9. Example Question Types

### Data Structure: Simple Interactive
Focus on one main concept with 2-3 options to explore.

### Algorithm Comparison: Complex Interactive
Multiple algorithms/approaches with detailed comparisons and visualizations.

### Mathematical Concept: Formula Explorer
Input parameters and see how they affect mathematical formulas or models.

### Architecture Overview: Component Builder
Build or explore system architectures step by step.

## 10. Best Practices Summary

1. **Start simple** - Focus on one core concept per question
2. **Make it interactive** - Always include hands-on exploration
3. **Explain why it matters** - Connect to practical applications
4. **Use consistent styling** - Follow the established design patterns
5. **Test thoroughly** - Ensure reliability across different inputs
6. **Keep it educational** - Every element should teach something
7. **Progressive complexity** - Start simple, allow deeper exploration
8. **Visual feedback** - Use colors, animations, and hover effects thoughtfully

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

Use this as your reference template for creating new questions!
