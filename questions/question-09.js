// Question 9: Autoregressive vs Masked Language Models
// Created: July 9, 2025
// Educational Focus: Understanding the fundamental differences between GPT-style and BERT-style training approaches

const question = {
    title: "9. How do autoregressive and masked models differ in LLM training?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔄 What are Training Paradigms?</h4>
            <p class="text-blue-800">Language models learn through different training strategies that shape their strengths. Think of it like learning to read: you could learn by predicting the next word in a story (autoregressive) or by filling in missing words in completed sentences (masked). Each approach develops different language understanding capabilities.</p>
        </div>
        
        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🎯 Autoregressive Models (GPT-style)</h5>
                <p class="text-sm text-green-700 mb-3">Predict the next token in sequence, seeing only previous context. Like writing a story word by word, never looking ahead.</p>
                <div class="text-xs space-y-2">
                    <div><strong>Training:</strong> "The cat sat on" → predict "the"</div>
                    <div><strong>Strengths:</strong> Text generation, completion, creative writing</div>
                    <div><strong>Direction:</strong> Left-to-right (causal)</div>
                    <div><strong>Examples:</strong> GPT-3/4, ChatGPT, Claude</div>
                </div>
                <code class="text-xs bg-green-100 px-2 py-1 rounded block mt-2">P(token | previous_tokens)</code>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🎭 Masked Language Models (BERT-style)</h5>
                <p class="text-sm text-purple-700 mb-3">Predict masked tokens using full bidirectional context. Like solving a crossword puzzle with clues from all directions.</p>
                <div class="text-xs space-y-2">
                    <div><strong>Training:</strong> "The cat [MASK] on the mat" → predict "sat"</div>
                    <div><strong>Strengths:</strong> Understanding, classification, Q&A</div>
                    <div><strong>Direction:</strong> Bidirectional (sees all)</div>
                    <div><strong>Examples:</strong> BERT, RoBERTa, DeBERTa</div>
                </div>
                <code class="text-xs bg-purple-100 px-2 py-1 rounded block mt-2">P(token | all_context)</code>
            </div>
        </div>

        <!-- Training Process Comparison -->
        <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-3">🔄 Training Process Differences</h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h6 class="font-medium text-green-800 mb-2">Autoregressive Training</h6>
                    <div class="text-sm space-y-1">
                        <div class="font-mono bg-white p-2 rounded border">
                            <div class="text-gray-500">Input: "The weather is"</div>
                            <div class="text-green-600">→ Predict: "nice"</div>
                            <div class="text-gray-500">Input: "The weather is nice"</div>
                            <div class="text-green-600">→ Predict: "today"</div>
                        </div>
                        <p class="text-xs text-gray-600">Sequential prediction, one token at a time</p>
                    </div>
                </div>
                <div>
                    <h6 class="font-medium text-purple-800 mb-2">Masked Training</h6>
                    <div class="text-sm space-y-1">
                        <div class="font-mono bg-white p-2 rounded border">
                            <div class="text-gray-500">Input: "The [MASK] is nice today"</div>
                            <div class="text-purple-600">→ Predict: "weather"</div>
                            <div class="text-gray-500">Input: "The weather [MASK] nice today"</div>
                            <div class="text-purple-600">→ Predict: "is"</div>
                        </div>
                        <p class="text-xs text-gray-600">Multiple masks predicted simultaneously</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Task Specialization:</strong> Training paradigm determines what the model excels at - generation vs understanding</li>
                <li>• <strong>Architecture Design:</strong> Influences attention mechanisms (causal vs bidirectional) and model structure</li>
                <li>• <strong>Use Case Selection:</strong> Choose autoregressive for creative tasks, masked for analytical tasks</li>
                <li>• <strong>Computational Trade-offs:</strong> Different training costs and inference patterns affect deployment decisions</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔄 Interactive Model Training Simulator",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q9-text-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Enter Text to Explore Training Approaches</label>
                <input type="text" id="q9-text-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="Large language models learn from text data">
                <p class="text-xs text-gray-600 mt-1">Try different sentences to see how each training approach processes them!</p>
            </div>
            
            <!-- Model Type Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Training Paradigm</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="relative border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q9-strategy" value="autoregressive" checked class="absolute top-3 right-3">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Autoregressive (GPT-style)</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Generative</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Predicts next token sequentially, left-to-right</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                "The cat" → predict "sat"
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q9-strategy" value="masked" class="absolute top-3 right-3">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Masked (BERT-style)</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Understanding</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Predicts masked tokens using bidirectional context</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                "The [MASK] sat" → predict "cat"
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q9-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "Large language models learn from text data"</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Training Simulation</h4>
                    <div id="q9-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q9-output" class="min-h-[120px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                <div id="q9-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="q9-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Training Paradigm Analysis</h4>
                <div id="q9-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const input = document.getElementById('q9-text-input');
            const output = document.getElementById('q9-output');
            const strategyRadios = document.querySelectorAll('input[name="q9-strategy"]');
            const exampleBtn = document.getElementById('q9-example-btn');
            const strategyIndicator = document.getElementById('q9-strategy-indicator');
            const legend = document.getElementById('q9-legend');
            const explanation = document.getElementById('q9-explanation');

            // Check if required elements exist
            if (!input || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Configuration data for different training paradigms
            const configData = {
                autoregressive: {
                    name: 'Autoregressive (GPT-style)',
                    description: 'Sequential token prediction using causal attention',
                    color: '#10b981', // Green
                    bgColor: '#ecfdf5'
                },
                masked: {
                    name: 'Masked Language Model (BERT-style)', 
                    description: 'Bidirectional context for masked token prediction',
                    color: '#8b5cf6', // Purple
                    bgColor: '#f3e8ff'
                }
            };

            // Helper function to get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q9-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'autoregressive';
            }

            // Simulate autoregressive training steps
            function simulateAutoregressive(text) {
                const tokens = text.split(' ');
                const steps = [];
                
                for (let i = 0; i < tokens.length; i++) {
                    if (i === 0) continue; // Skip first token as it has no context
                    
                    const context = tokens.slice(0, i).join(' ');
                    const target = tokens[i];
                    
                    steps.push({
                        context: context,
                        prediction: target,
                        probability: Math.random() * 0.4 + 0.6, // Simulate 60-100% confidence
                        step: i
                    });
                }
                
                return steps;
            }

            // Simulate masked language model training
            function simulateMasked(text) {
                const tokens = text.split(' ');
                const steps = [];
                
                // For educational purposes, ensure we show multiple examples
                // Use more generous masking to demonstrate the concept better
                let numMasks;
                if (tokens.length <= 5) {
                    numMasks = Math.max(2, tokens.length - 1); // Almost all tokens for very short text
                } else if (tokens.length <= 8) {
                    numMasks = Math.max(3, Math.ceil(tokens.length * 0.4)); // 40% for medium text
                } else {
                    numMasks = Math.max(4, Math.ceil(tokens.length * 0.3)); // 30% for longer text, min 4
                }
                
                // Cap at reasonable maximum for display
                numMasks = Math.min(numMasks, 6);
                
                // For longer sentences, we can be more flexible with positioning
                const allowedPositions = tokens.length <= 6 ? 
                    Array.from({length: tokens.length}, (_, i) => i) : // Allow all positions for short text
                    Array.from({length: tokens.length - 2}, (_, i) => i + 1); // Avoid first/last for longer text
                
                // Randomly select positions to mask
                const maskPositions = [];
                const shuffledPositions = [...allowedPositions].sort(() => Math.random() - 0.5);
                
                for (let i = 0; i < Math.min(numMasks, shuffledPositions.length); i++) {
                    maskPositions.push(shuffledPositions[i]);
                }
                
                // Sort positions for display clarity
                maskPositions.sort((a, b) => a - b);
                
                maskPositions.forEach((pos, index) => {
                    const maskedTokens = [...tokens];
                    maskedTokens[pos] = '[MASK]';
                    
                    steps.push({
                        context: maskedTokens.join(' '),
                        prediction: tokens[pos],
                        probability: Math.random() * 0.3 + 0.7, // Simulate 70-100% confidence
                        step: index + 1,
                        position: pos
                    });
                });
                
                return steps;
            }

            // Update visual indicators for strategy selection
            function updateStrategyVisuals() {
                const selected = document.querySelector('input[name="q9-strategy"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q9-strategy"]').forEach((radio) => {
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
                const text = input.value.trim();
                const strategy = getCurrentStrategy();
                
                // Clear previous results
                output.innerHTML = '';
                if (legend) legend.innerHTML = '';
                
                updateStrategyVisuals();

                if (!text) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Enter some text to see training simulation</div>';
                    return;
                }

                // Simulate training based on strategy
                let steps;
                if (strategy === 'autoregressive') {
                    steps = simulateAutoregressive(text);
                } else {
                    steps = simulateMasked(text);
                }

                // Create training steps display
                const stepsContainer = document.createElement('div');
                stepsContainer.className = 'space-y-3';
                
                const config = configData[strategy];
                
                if (steps.length === 0) {
                    stepsContainer.innerHTML = '<div class="text-gray-500 text-center py-4">Text too short for meaningful training simulation</div>';
                } else {
                    steps.forEach((step, index) => {
                        const stepEl = document.createElement('div');
                        stepEl.className = 'border rounded-lg p-3 transition-all duration-200 hover:shadow-md';
                        stepEl.style.backgroundColor = config.bgColor;
                        stepEl.style.borderColor = config.color + '40';
                        
                        const confidence = (step.probability * 100).toFixed(1);
                        const confidenceColor = step.probability > 0.8 ? 'text-green-600' : 
                                              step.probability > 0.6 ? 'text-yellow-600' : 'text-red-600';
                        
                        stepEl.innerHTML = `
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-medium" style="color: ${config.color}">
                                    ${strategy === 'autoregressive' ? 'Prediction Step' : 'Mask'} ${step.step}
                                </span>
                                <span class="text-xs ${confidenceColor} font-medium">${confidence}% confidence</span>
                            </div>
                            <div class="font-mono text-sm mb-2">
                                <span class="text-gray-600">Context:</span> "${step.context}"
                            </div>
                            <div class="font-mono text-sm">
                                <span class="text-gray-600">Predict:</span> 
                                <span class="font-bold" style="color: ${config.color}">"${step.prediction}"</span>
                            </div>
                        `;
                        
                        stepEl.title = strategy === 'autoregressive' ? 
                            `Autoregressive: Predict next token based on previous context` :
                            `Masked LM: Predict masked token using bidirectional context`;
                        
                        stepsContainer.appendChild(stepEl);
                    });
                }

                output.appendChild(stepsContainer);

                // Add statistics
                const statsEl = document.createElement('div');
                statsEl.className = 'grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-white rounded border mt-4 text-sm';
                
                const tokens = text.split(' ');
                const avgConfidence = steps.length > 0 ? 
                    (steps.reduce((sum, step) => sum + step.probability, 0) / steps.length * 100).toFixed(1) : 0;
                
                statsEl.innerHTML = `
                    <div class="text-center">
                        <div class="text-lg font-bold" style="color: ${config.color}">${steps.length}</div>
                        <div class="text-gray-600 text-xs">Training Steps</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-blue-600">${tokens.length}</div>
                        <div class="text-gray-600 text-xs">Total Tokens</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-green-600">${avgConfidence}%</div>
                        <div class="text-gray-600 text-xs">Avg Confidence</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-purple-600">${strategy === 'autoregressive' ? 'Sequential' : 'Parallel'}</div>
                        <div class="text-gray-600 text-xs">Processing</div>
                    </div>
                `;
                output.appendChild(statsEl);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        <div class="flex items-center justify-center space-x-4 text-xs">
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded" style="background-color: ${config.color}"></div>
                                <span>${strategy === 'autoregressive' ? 'Prediction Steps' : 'Masked Tokens'}</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-green-500"></div>
                                <span>High Confidence (>80%)</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-yellow-500"></div>
                                <span>Medium Confidence (60-80%)</span>
                            </div>
                        </div>
                    `;
                }

                // Update educational explanation
                updateExplanation(strategy);
            };

            // Update the educational explanation based on selected strategy
            function updateExplanation(strategy) {
                if (!explanation) return;
                
                const explanations = {
                    'autoregressive': `
                        <strong>Autoregressive Training</strong> predicts tokens sequentially from left to right.
                        <br>• <strong>Pros:</strong> Excellent for text generation, natural for language modeling, maintains coherent long-form text
                        <br>• <strong>Cons:</strong> Cannot see future context, slower inference (sequential), limited understanding tasks
                        <br>• <strong>Best for:</strong> Text completion, creative writing, chatbots, code generation
                        <br>• <strong>Examples:</strong> GPT series, Claude, text-davinci models
                    `,
                    'masked': `
                        <strong>Masked Language Model Training</strong> predicts tokens using full bidirectional context.
                        <br>• <strong>Pros:</strong> Rich understanding, bidirectional context, excellent for classification and analysis
                        <br>• <strong>Cons:</strong> Cannot generate text naturally, requires fine-tuning for downstream tasks
                        <br>• <strong>Best for:</strong> Text classification, sentiment analysis, question answering, named entity recognition
                        <br>• <strong>Examples:</strong> BERT, RoBERTa, DeBERTa, DistilBERT
                    `
                };
                
                explanation.innerHTML = explanations[strategy] || '';
            }

            // Example cycling functionality
            const examples = [
                { 
                    text: 'Large language models learn from text data', 
                    strategy: 'autoregressive', 
                    note: 'Simple sentence showing sequential prediction' 
                },
                { 
                    text: 'Machine learning models require extensive training data', 
                    strategy: 'masked', 
                    note: 'Technical sentence demonstrating bidirectional understanding' 
                },
                { 
                    text: 'The quick brown fox jumps over the lazy dog', 
                    strategy: 'autoregressive', 
                    note: 'Classic phrase showing autoregressive token prediction' 
                },
                { 
                    text: 'Natural language processing is fascinating and complex', 
                    strategy: 'masked', 
                    note: 'Complex sentence for masked token prediction' 
                },
                { 
                    text: 'I love programming in Python', 
                    strategy: 'autoregressive', 
                    note: 'Personal statement for generation tasks' 
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    input.value = example.text;
                    document.querySelector(`input[name="q9-strategy"][value="${example.strategy}"]`).checked = true;
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    exampleBtn.innerHTML = `Try: "${nextExample.text.substring(0, 25)}${nextExample.text.length > 25 ? '...' : ''}"`;
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

// Export the question object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
} else if (typeof window !== 'undefined') {
    window.question09 = question;
}
