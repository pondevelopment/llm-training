// Question X: [Topic Name]
// Created: [Date]
// Educational Focus: [Key learning objectives]

const question = {
    title: "X. [Your question title here]?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔤 What is [Your Concept]?</h4>
            <p class="text-blue-800">[Clear definition with analogy - explain what this concept is in simple terms]</p>
        </div>
        
        <!-- Comparison/Options Grid (adjust columns as needed) -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">[Option 1 Name]</h5>
                <p class="text-sm text-green-700">[Brief description of first approach/option]</p>
                <code class="text-xs bg-green-100 px-1 rounded">[Example: "input" → ["output"]</code>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">[Option 2 Name]</h5>
                <p class="text-sm text-purple-700">[Brief description of second approach/option]</p>
                <code class="text-xs bg-purple-100 px-1 rounded">[Example: "input" → ["different", "output"]</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">[Option 3 Name]</h5>
                <p class="text-sm text-orange-700">[Brief description of third approach/option]</p>
                <code class="text-xs bg-orange-100 px-1 rounded">[Example: "input" → ["yet", "another", "output"]</code>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>[Key Point 1]:</strong> [Explanation of practical importance]</li>
                <li>• <strong>[Key Point 2]:</strong> [Another important aspect]</li>
                <li>• <strong>[Key Point 3]:</strong> [Real-world application]</li>
                <li>• <strong>[Key Point 4]:</strong> [Performance or efficiency consideration]</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive [Your Concept] Explorer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="qX-text-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Enter [Input Type] to [Action]</label>
                <input type="text" id="qX-text-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="[Default example value]">
                <p class="text-xs text-gray-600 mt-1">Try different [inputs] to see how [your concept] changes!</p>
            </div>
            
            <!-- Strategy/Option Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose [Your Concept] Strategy</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="qX-strategy" value="option1" checked class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">[Option 1 Name]</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">[Simple/Fast/Basic]</span>
                            </div>
                            <p class="text-xs text-gray-600">[Brief description of what this option does]</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                "[example]" → ["result"]
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="qX-strategy" value="option2" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">[Option 2 Name]</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">[Smart/Balanced/Advanced]</span>
                            </div>
                            <p class="text-xs text-gray-600">[Brief description of what this option does]</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                "[example]" → ["different", "result"]
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="qX-strategy" value="option3" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">[Option 3 Name]</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">[Detailed/Complex/Thorough]</span>
                            </div>
                            <p class="text-xs text-gray-600">[Brief description of what this option does]</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                "[example]" → ["very", "detailed", "result"]
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="qX-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "[example input text]"</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 [Your Concept] Results</h4>
                    <div id="qX-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="qX-output" class="min-h-[80px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                <div id="qX-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="qX-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Why This Strategy?</h4>
                <div id="qX-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // NOTE (Math / LaTeX):
            // 1. Wrap multi-line or multi-symbol formulas in <div class="math-display"> $$ ... $$ </div>
            // 2. Escape backslashes in template literals: \\frac{a}{b}, \\sum_i
            // 3. Use one block per conceptual group; prefer align* with \\ line breaks when showing derivations
            // 4. Do NOT add color classes inside math; global --math-color handles consistency
            // 5. After injecting math dynamically, call typesetMath(containerEl) (helper defined globally)
            // Get DOM elements with error checking
            const input = document.getElementById('qX-text-input');
            const output = document.getElementById('qX-output');
            const strategyRadios = document.querySelectorAll('input[name="qX-strategy"]');
            const exampleBtn = document.getElementById('qX-example-btn');
            const strategyIndicator = document.getElementById('qX-strategy-indicator');
            const legend = document.getElementById('qX-legend');
            const explanation = document.getElementById('qX-explanation');

            // Check if required elements exist
            if (!input || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Your data/configuration objects here
            const configData = {
                option1: {
                    name: '[Option 1 Display Name]',
                    description: '[Detailed explanation of option 1]',
                    // Add any option-specific data
                },
                option2: {
                    name: '[Option 2 Display Name]',
                    description: '[Detailed explanation of option 2]',
                    // Add any option-specific data
                },
                option3: {
                    name: '[Option 3 Display Name]',
                    description: '[Detailed explanation of option 3]',
                    // Add any option-specific data
                }
            };

            // Helper function to get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="qX-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'option1';
            }

            // Helper function to process input based on strategy
            function processInput(text, strategy) {
                // TODO: Replace with your actual processing logic
                switch(strategy) {
                    case 'option1':
                        return text.split(' '); // Example: simple word splitting
                    case 'option2':
                        return text.toLowerCase().split(' '); // Example: lowercase splitting
                    case 'option3':
                        return text.split(''); // Example: character splitting
                    default:
                        return [text];
                }
            }

            // Update visual indicators for strategy selection
            function updateStrategyVisuals() {
                const selected = document.querySelector('input[name="qX-strategy"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="qX-strategy"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update strategy indicator
                if (strategyIndicator && configData[selectedValue]) {
                    strategyIndicator.textContent = configData[selectedValue].name;
                }
            }

            // Main processing function
            const processAndDisplay = () => {
                const text = input.value;
                const strategy = getCurrentStrategy();
                
                // Clear previous results
                output.innerHTML = '';
                if (legend) legend.innerHTML = '';
                
                updateStrategyVisuals();

                // Process the input
                const results = processInput(text, strategy);

                // Create results display
                const resultsContainer = document.createElement('div');
                resultsContainer.className = 'flex flex-wrap gap-2 mb-4';
                
                results.forEach((result, index) => {
                    const el = document.createElement('span');
                    el.className = 'inline-flex items-center px-2 py-1 rounded text-sm font-mono border border-gray-300 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer';
                    el.textContent = result;
                    
                    // TODO: Customize styling based on your needs
                    el.style.backgroundColor = '#dbeafe'; // Light blue
                    el.style.color = '#374151';
                    
                    // Add tooltip with information
                    el.title = `Result ${index + 1}: "${result}" (Length: ${result.length})`;
                    
                    resultsContainer.appendChild(el);
                });

                output.appendChild(resultsContainer);

                // Add statistics (customize as needed)
                const statsEl = document.createElement('div');
                statsEl.className = 'grid grid-cols-2 md:grid-cols-3 gap-4 p-3 bg-white rounded border text-sm';
                statsEl.innerHTML = `
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">${results.length}</div>
                        <div class="text-gray-600">Results</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">${text.length}</div>
                        <div class="text-gray-600">Input Length</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">${((text.length / results.length) || 0).toFixed(1)}</div>
                        <div class="text-gray-600">Avg/Result</div>
                    </div>
                `;
                output.appendChild(statsEl);

                // Update educational explanation
                updateExplanation(strategy);
            };

            // Update the educational explanation based on selected strategy
            function updateExplanation(strategy) {
                if (!explanation) return;
                
                const explanations = {
                    'option1': `
                        <strong>[Option 1 Name]</strong> [explanation of this approach].
                        <br>• <strong>Pros:</strong> [List advantages]
                        <br>• <strong>Cons:</strong> [List disadvantages]
                        <br>• <strong>Best for:</strong> [When to use this option]
                    `,
                    'option2': `
                        <strong>[Option 2 Name]</strong> [explanation of this approach].
                        <br>• <strong>Pros:</strong> [List advantages]
                        <br>• <strong>Cons:</strong> [List disadvantages]
                        <br>• <strong>Best for:</strong> [When to use this option]
                    `,
                    'option3': `
                        <strong>[Option 3 Name]</strong> [explanation of this approach].
                        <br>• <strong>Pros:</strong> [List advantages]
                        <br>• <strong>Cons:</strong> [List disadvantages]
                        <br>• <strong>Best for:</strong> [When to use this option]
                    `
                };
                
                explanation.innerHTML = explanations[strategy] || '';
            }

            // Example cycling functionality
            const examples = [
                { text: '[Example 1]', strategy: 'option1', note: '[Explanation of what this example demonstrates]' },
                { text: '[Example 2]', strategy: 'option2', note: '[Explanation of what this example demonstrates]' },
                { text: '[Example 3]', strategy: 'option3', note: '[Explanation of what this example demonstrates]' }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    input.value = example.text;
                    document.querySelector(`input[name="qX-strategy"][value="${example.strategy}"]`).checked = true;
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    exampleBtn.innerHTML = `Try: "${nextExample.text.substring(0, 20)}${nextExample.text.length > 20 ? '...' : ''}"`;
                    exampleBtn.title = nextExample.note;
                });
            }

            // Event listeners
            input.addEventListener('input', processAndDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateStrategyVisuals();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateStrategyVisuals();
            processAndDisplay();
        }
    }
};

// TODO: Remove this comment block when implementing
/*
IMPLEMENTATION CHECKLIST:
□ Replace all [placeholder text] with actual content
□ Update the qX- prefixes to match your question number
□ Implement your actual processing logic in processInput()
□ Customize the styling and colors as needed
□ Add your specific examples in the examples array
□ Test all interactive functionality
□ Verify educational explanations are accurate
□ Check responsive design on different screen sizes
*/
