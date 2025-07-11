// Question 12: Top-k and Top-p Sampling in Text Generation
// Created: July 11, 2025
// Educational Focus: Understanding different sampling strategies for text generation

const question = {
    title: "12. How do top-k and top-p sampling differ in text generation?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎲 What is Sampling in Text Generation?</h4>
            <p class="text-blue-800">Sampling methods control how language models choose the next token during text generation. Instead of always picking the most probable word (greedy decoding), sampling introduces controlled randomness to create more diverse and creative outputs. Think of it like a creative writer choosing between several good word options rather than always using the most obvious one.</p>
        </div>
        
        <!-- Sampling Methods Comparison -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🔢 Top-k Sampling</h5>
                <p class="text-sm text-green-700 mb-2">Selects from the k most probable tokens for random sampling, ensuring controlled diversity.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Example (k=3):</strong> "The cat" → {sat: 40%, jumped: 30%, ran: 20%}</div>
                    <div class="bg-green-100 px-2 py-1 rounded mt-1"><strong>Fixed vocabulary size</strong> - always considers exactly k options</div>
                </div>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🎯 Top-p Sampling (Nucleus)</h5>
                <p class="text-sm text-purple-700 mb-2">Chooses tokens whose cumulative probability exceeds threshold p, adapting to context.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Example (p=0.9):</strong> "The cat" → tokens until 90% probability mass</div>
                    <div class="bg-purple-100 px-2 py-1 rounded mt-1"><strong>Dynamic vocabulary size</strong> - adapts to probability distribution</div>
                </div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">⚡ Greedy Decoding</h5>
                <p class="text-sm text-orange-700 mb-2">Always selects the most probable token for deterministic, predictable output.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Example:</strong> "The cat" → sat (40% - highest probability)</div>
                    <div class="bg-orange-100 px-2 py-1 rounded mt-1"><strong>No randomness</strong> - deterministic but can be repetitive</div>
                </div>
            </div>
        </div>
        
        <!-- Key Differences -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 class="font-semibold text-indigo-900 mb-2">🔍 Key Differences</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm text-indigo-800">
                <div>
                    <h5 class="font-medium mb-2">Top-k Sampling:</h5>
                    <ul class="space-y-1">
                        <li>• <strong>Fixed vocabulary:</strong> Always considers exactly k tokens</li>
                        <li>• <strong>Simple implementation:</strong> Sort by probability, take top k</li>
                        <li>• <strong>Consistent diversity:</strong> Same number of options every time</li>
                        <li>• <strong>Risk:</strong> May include very low-probability tokens</li>
                    </ul>
                </div>
                <div>
                    <h5 class="font-medium mb-2">Top-p Sampling:</h5>
                    <ul class="space-y-1">
                        <li>• <strong>Dynamic vocabulary:</strong> Size varies based on distribution</li>
                        <li>• <strong>Context-adaptive:</strong> More choices for uncertain contexts</li>
                        <li>• <strong>Quality focus:</strong> Excludes very low-probability tokens</li>
                        <li>• <strong>Flexibility:</strong> Better for creative and coherent generation</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Why This Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Sampling Strategy Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Creative Writing:</strong> Top-p produces more varied and engaging narratives</li>
                <li>• <strong>Coherence Control:</strong> Proper sampling prevents repetitive or nonsensical text</li>
                <li>• <strong>Task Adaptation:</strong> Different tasks benefit from different sampling approaches</li>
                <li>• <strong>Quality vs. Diversity:</strong> Balance between creative output and meaningful content</li>
                <li>• <strong>User Experience:</strong> Sampling affects how natural and engaging AI text feels</li>
            </ul>
        </div>
    </div>`,
    
    interactive: {
        title: "🎲 Interactive Text Generation Sampling Explorer",
        html: `<div class="space-y-6">
            <!-- Context Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q12-context-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Select Context for Text Generation</label>
                <select id="q12-context-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="0" selected>The mysterious door opened to reveal</option>
                    <option value="1">The cat sat on the</option>
                    <option value="2">In the future, artificial intelligence will</option>
                    <option value="3">The scientist made a groundbreaking</option>
                    <option value="4">Once upon a time, in a distant</option>
                    <option value="5">The weather forecast predicted</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Select different contexts to see how sampling methods adapt to various probability distributions!</p>
            </div>
            
            <!-- Sampling Method Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Sampling Strategy</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q12-strategy" value="topk" checked class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Top-k Sampling</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Fixed Size</span>
                            </div>
                            <p class="text-xs text-gray-600">Select from k most probable tokens</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                k=20 → top 20 tokens
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q12-strategy" value="topp" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Top-p Sampling</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Adaptive</span>
                            </div>
                            <p class="text-xs text-gray-600">Dynamic selection based on probability mass</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                p=0.9 → 90% prob mass
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q12-strategy" value="greedy" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Greedy Decoding</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Deterministic</span>
                            </div>
                            <p class="text-xs text-gray-600">Always select most probable token</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                max(probabilities)
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Parameter Controls -->
            <div class="grid md:grid-cols-2 gap-4">
                <div id="q12-topk-controls" class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q12-k-value" class="block text-sm font-medium text-gray-700 mb-2">🔢 Top-k Value (k)</label>
                    <input type="range" id="q12-k-value" min="1" max="50" value="20" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span id="q12-k-display" class="font-medium">20</span>
                        <span>50</span>
                    </div>
                </div>
                
                <div id="q12-topp-controls" class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q12-p-value" class="block text-sm font-medium text-gray-700 mb-2">🎯 Top-p Value (p)</label>
                    <input type="range" id="q12-p-value" min="0.1" max="1.0" step="0.05" value="0.9" class="w-full">
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1</span>
                        <span id="q12-p-display" class="font-medium">0.9</span>
                        <span>1.0</span>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Token Selection Results</h4>
                    <div id="q12-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Top-k Sampling</div>
                </div>
                <div id="q12-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <div class="text-gray-500 text-center py-8">Enter context above to see token selection simulation</div>
                </div>
                <div id="q12-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Understanding the Strategy</h4>
                <div id="q12-explanation" class="text-sm text-yellow-800">
                    Choose a sampling strategy above to see how it affects token selection and text generation quality.
                </div>
            </div>
        </div>`,
        script: () => {
            // Predefined contexts for the dropdown
            const contexts = [
                "The mysterious door opened to reveal",
                "The cat sat on the", 
                "In the future, artificial intelligence will",
                "The scientist made a groundbreaking",
                "Once upon a time, in a distant",
                "The weather forecast predicted"
            ];

            // Expanded vocabulary database with realistic word probabilities
            const vocabularyDatabase = {
                0: [ // "The mysterious door opened to reveal"
                    { token: "a", probability: 0.25 },
                    { token: "an", probability: 0.15 },
                    { token: "the", probability: 0.12 },
                    { token: "nothing", probability: 0.08 },
                    { token: "something", probability: 0.07 },
                    { token: "darkness", probability: 0.06 },
                    { token: "light", probability: 0.05 },
                    { token: "treasure", probability: 0.04 },
                    { token: "secrets", probability: 0.03 },
                    { token: "ancient", probability: 0.03 },
                    { token: "hidden", probability: 0.025 },
                    { token: "magical", probability: 0.025 },
                    { token: "forbidden", probability: 0.02 },
                    { token: "golden", probability: 0.02 },
                    { token: "mysterious", probability: 0.015 },
                    { token: "strange", probability: 0.015 },
                    { token: "beautiful", probability: 0.01 },
                    { token: "terrible", probability: 0.01 },
                    { token: "wonderful", probability: 0.008 },
                    { token: "frightening", probability: 0.008 }
                ],
                1: [ // "The cat sat on the"
                    { token: "mat", probability: 0.35 },
                    { token: "chair", probability: 0.20 },
                    { token: "table", probability: 0.15 },
                    { token: "floor", probability: 0.10 },
                    { token: "bed", probability: 0.08 },
                    { token: "couch", probability: 0.05 },
                    { token: "windowsill", probability: 0.03 },
                    { token: "keyboard", probability: 0.02 },
                    { token: "roof", probability: 0.015 },
                    { token: "fence", probability: 0.005 }
                ],
                2: [ // "In the future, artificial intelligence will"
                    { token: "revolutionize", probability: 0.18 },
                    { token: "transform", probability: 0.15 },
                    { token: "help", probability: 0.12 },
                    { token: "assist", probability: 0.10 },
                    { token: "change", probability: 0.08 },
                    { token: "improve", probability: 0.07 },
                    { token: "enhance", probability: 0.06 },
                    { token: "replace", probability: 0.05 },
                    { token: "automate", probability: 0.04 },
                    { token: "solve", probability: 0.04 },
                    { token: "create", probability: 0.03 },
                    { token: "enable", probability: 0.03 },
                    { token: "optimize", probability: 0.025 },
                    { token: "accelerate", probability: 0.02 },
                    { token: "dominate", probability: 0.015 },
                    { token: "eliminate", probability: 0.01 }
                ],
                3: [ // "The scientist made a groundbreaking"
                    { token: "discovery", probability: 0.40 },
                    { token: "breakthrough", probability: 0.25 },
                    { token: "finding", probability: 0.15 },
                    { token: "invention", probability: 0.10 },
                    { token: "observation", probability: 0.05 },
                    { token: "theory", probability: 0.03 },
                    { token: "hypothesis", probability: 0.015 },
                    { token: "experiment", probability: 0.005 }
                ],
                4: [ // "Once upon a time, in a distant"
                    { token: "land", probability: 0.30 },
                    { token: "kingdom", probability: 0.25 },
                    { token: "galaxy", probability: 0.15 },
                    { token: "world", probability: 0.12 },
                    { token: "planet", probability: 0.08 },
                    { token: "place", probability: 0.05 },
                    { token: "realm", probability: 0.025 },
                    { token: "universe", probability: 0.02 },
                    { token: "dimension", probability: 0.015 },
                    { token: "future", probability: 0.01 }
                ],
                5: [ // "The weather forecast predicted"
                    { token: "rain", probability: 0.35 },
                    { token: "snow", probability: 0.20 },
                    { token: "storms", probability: 0.15 },
                    { token: "sunshine", probability: 0.12 },
                    { token: "clouds", probability: 0.08 },
                    { token: "wind", probability: 0.05 },
                    { token: "fog", probability: 0.03 },
                    { token: "hail", probability: 0.015 },
                    { token: "thunder", probability: 0.005 }
                ]
            };

            // Configuration for different strategies
            const configData = {
                topk: {
                    name: 'Top-k Sampling',
                    description: 'Selects from the k most probable tokens, providing controlled diversity',
                    color: '#10b981',
                    bgColor: '#ecfdf5'
                },
                topp: {
                    name: 'Top-p Sampling (Nucleus)',
                    description: 'Dynamic selection based on cumulative probability mass',
                    color: '#8b5cf6',
                    bgColor: '#f3e8ff'
                },
                greedy: {
                    name: 'Greedy Decoding',
                    description: 'Always selects the most probable token for deterministic output',
                    color: '#f59e0b',
                    bgColor: '#fef3c7'
                }
            };

            // Get DOM elements
            const contextInput = document.getElementById('q12-context-input');
            const output = document.getElementById('q12-output');
            const strategyRadios = document.querySelectorAll('input[name="q12-strategy"]');
            const strategyIndicator = document.getElementById('q12-strategy-indicator');
            const legend = document.getElementById('q12-legend');
            const explanation = document.getElementById('q12-explanation');
            const kValue = document.getElementById('q12-k-value');
            const pValue = document.getElementById('q12-p-value');
            const kDisplay = document.getElementById('q12-k-display');
            const pDisplay = document.getElementById('q12-p-display');
            const topkControls = document.getElementById('q12-topk-controls');
            const toppControls = document.getElementById('q12-topp-controls');

            if (!contextInput || !output) {
                console.error('Required DOM elements not found for Question 12');
                return;
            }

            // Helper function to get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q12-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'topk';
            }

            // Get vocabulary for context
            function getVocabularyForContext(context) {
                const contextIndex = contexts.indexOf(context);
                if (contextIndex !== -1) {
                    return vocabularyDatabase[contextIndex] || [];
                }
                return vocabularyDatabase[0]; // Default to first context
            }

            // Apply sampling strategy
            function applySampling(vocabulary, strategy, k, p) {
                // Sort by probability (descending)
                const sorted = [...vocabulary].sort((a, b) => b.probability - a.probability);
                
                switch (strategy) {
                    case 'topk':
                        return sorted.slice(0, k);
                    
                    case 'topp':
                        let cumulativeProb = 0;
                        const result = [];
                        for (const token of sorted) {
                            cumulativeProb += token.probability;
                            result.push(token);
                            if (cumulativeProb >= p) break;
                        }
                        return result;
                    
                    case 'greedy':
                        return [sorted[0]];
                    
                    default:
                        return sorted;
                }
            }

            // Update parameter controls visibility
            function updateControlsVisibility() {
                const strategy = getCurrentStrategy();
                topkControls.style.display = strategy === 'topk' ? 'block' : 'none';
                toppControls.style.display = strategy === 'topp' ? 'block' : 'none';
            }

            // Update parameter displays
            function updateParameterDisplays() {
                if (kDisplay) kDisplay.textContent = kValue.value;
                if (pDisplay) pDisplay.textContent = parseFloat(pValue.value).toFixed(2);
            }

            // Main processing function
            const processAndDisplay = () => {
                // Get the selected context text, not the index
                const selectedOption = contextInput.options[contextInput.selectedIndex];
                const context = selectedOption ? selectedOption.text : '';
                const strategy = getCurrentStrategy();
                const k = parseInt(kValue.value);
                const p = parseFloat(pValue.value);
                const config = configData[strategy];
                
                if (!context) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Enter context to see token selection simulation</div>';
                    return;
                }

                // Update strategy indicator
                if (strategyIndicator) {
                    strategyIndicator.textContent = config.name;
                    strategyIndicator.style.backgroundColor = config.bgColor;
                    strategyIndicator.style.color = config.color;
                }

                // Get vocabulary and apply sampling
                const fullVocabulary = getVocabularyForContext(context);
                const sampledTokens = applySampling(fullVocabulary, strategy, k, p);

                // Clear previous results
                output.innerHTML = '';

                // Create context display
                const contextEl = document.createElement('div');
                contextEl.className = 'mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400';
                contextEl.innerHTML = `
                    <div class="text-sm font-medium text-blue-900 mb-1">Context:</div>
                    <div class="text-blue-800">"${context}"</div>
                `;
                output.appendChild(contextEl);

                // Create tokens display
                const tokensContainer = document.createElement('div');
                tokensContainer.className = 'space-y-3';

                // Strategy-specific header
                const headerEl = document.createElement('div');
                headerEl.className = 'flex items-center justify-between text-sm font-medium text-gray-700';
                
                let headerText = '';
                switch (strategy) {
                    case 'topk':
                        headerText = `Top-${k} tokens selected for sampling:`;
                        break;
                    case 'topp':
                        const totalProb = sampledTokens.reduce((sum, token) => sum + token.probability, 0);
                        headerText = `Tokens covering ${(totalProb * 100).toFixed(1)}% probability mass (p=${p}):`;
                        break;
                    case 'greedy':
                        headerText = 'Most probable token selected:';
                        break;
                }
                
                headerEl.innerHTML = `
                    <span>${headerText}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">${sampledTokens.length} token${sampledTokens.length !== 1 ? 's' : ''}</span>
                `;
                tokensContainer.appendChild(headerEl);

                // Tokens grid
                const tokensGrid = document.createElement('div');
                tokensGrid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2';

                sampledTokens.forEach((token, index) => {
                    const tokenEl = document.createElement('div');
                    tokenEl.className = 'p-2 bg-white rounded border hover:shadow-md transition-all duration-200 cursor-pointer';
                    
                    // Color coding based on probability
                    const probPercent = token.probability * 100;
                    let bgColor = '#f3f4f6'; // default gray
                    if (probPercent >= 20) bgColor = '#dcfce7'; // green
                    else if (probPercent >= 10) bgColor = '#dbeafe'; // blue
                    else if (probPercent >= 5) bgColor = '#fef3c7'; // yellow
                    else bgColor = '#fecaca'; // red for very low prob
                    
                    tokenEl.style.backgroundColor = bgColor;
                    
                    tokenEl.innerHTML = `
                        <div class="font-mono text-sm font-medium">"${token.token}"</div>
                        <div class="text-xs text-gray-600 mt-1">
                            <div>${(token.probability * 100).toFixed(2)}%</div>
                            <div class="text-xs text-gray-500">Rank: ${index + 1}</div>
                        </div>
                    `;
                    
                    tokenEl.title = `Token: "${token.token}" | Probability: ${(token.probability * 100).toFixed(2)}% | Rank: ${index + 1}`;
                    
                    tokensGrid.appendChild(tokenEl);
                });

                tokensContainer.appendChild(tokensGrid);

                // Statistics
                const statsEl = document.createElement('div');
                statsEl.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white rounded border text-sm mt-4';
                
                const totalProb = sampledTokens.reduce((sum, token) => sum + token.probability, 0);
                const avgProb = totalProb / sampledTokens.length;
                const maxProb = Math.max(...sampledTokens.map(t => t.probability));
                const minProb = Math.min(...sampledTokens.map(t => t.probability));
                
                statsEl.innerHTML = `
                    <div class="text-center">
                        <div class="text-lg font-bold text-blue-600">${sampledTokens.length}</div>
                        <div class="text-gray-600">Candidates</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-green-600">${(totalProb * 100).toFixed(1)}%</div>
                        <div class="text-gray-600">Total Prob</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-purple-600">${(avgProb * 100).toFixed(1)}%</div>
                        <div class="text-gray-600">Avg Prob</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-orange-600">${(maxProb * 100).toFixed(1)}%</div>
                        <div class="text-gray-600">Max Prob</div>
                    </div>
                `;

                tokensContainer.appendChild(statsEl);
                output.appendChild(tokensContainer);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        <div class="flex items-center justify-center space-x-4 text-xs">
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded" style="background-color: #dcfce7"></div>
                                <span>High prob (≥20%)</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded" style="background-color: #dbeafe"></div>
                                <span>Medium (10-20%)</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded" style="background-color: #fef3c7"></div>
                                <span>Low (5-10%)</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded" style="background-color: #fecaca"></div>
                                <span>Very low (<5%)</span>
                            </div>
                        </div>
                    `;
                }

                // Update controls visibility
                updateControlsVisibility();
                
                // Update explanation
                updateExplanation(strategy, sampledTokens, k, p);
            };

            // Update visual indicators for strategy selection
            function updateStrategyVisuals() {
                const selected = document.querySelector('input[name="q12-strategy"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q12-strategy"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.add('border-gray-200');
                    }
                });
            }

            // Update educational explanation
            function updateExplanation(strategy, tokens, k, p) {
                if (!explanation) return;
                
                const explanations = {
                    topk: `
                        <strong>Top-k Sampling (k=${k}):</strong> Selects exactly ${k} most probable tokens for random sampling.
                        <br>• <strong>Consistent diversity:</strong> Always considers the same number of options
                        <br>• <strong>Simple implementation:</strong> Sort tokens by probability, take top ${k}
                        <br>• <strong>Risk:</strong> May include very low-probability tokens when k is large
                        <br>• <strong>Current selection:</strong> ${tokens.length} tokens with probabilities from ${(Math.max(...tokens.map(t => t.probability)) * 100).toFixed(1)}% to ${(Math.min(...tokens.map(t => t.probability)) * 100).toFixed(1)}%
                    `,
                    topp: `
                        <strong>Top-p Sampling (p=${p}):</strong> Dynamically selects tokens until ${(p * 100).toFixed(0)}% cumulative probability is reached.
                        <br>• <strong>Context-adaptive:</strong> More tokens for uncertain contexts, fewer for confident ones
                        <br>• <strong>Quality focus:</strong> Automatically excludes very low-probability tokens
                        <br>• <strong>Flexibility:</strong> Vocabulary size adapts to the probability distribution
                        <br>• <strong>Current selection:</strong> ${tokens.length} tokens covering ${(tokens.reduce((sum, t) => sum + t.probability, 0) * 100).toFixed(1)}% probability mass
                    `,
                    greedy: `
                        <strong>Greedy Decoding:</strong> Always selects the single most probable token.
                        <br>• <strong>Deterministic:</strong> Same input always produces same output
                        <br>• <strong>Fast:</strong> No random sampling computation needed
                        <br>• <strong>Limitation:</strong> Can produce repetitive or overly predictable text
                        <br>• <strong>Current selection:</strong> "${tokens[0]?.token}" with ${(tokens[0]?.probability * 100).toFixed(1)}% probability
                    `
                };
                
                explanation.innerHTML = explanations[strategy] || '';
            }

            // Event listeners
            contextInput.addEventListener('change', processAndDisplay);
            
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateStrategyVisuals();
                    processAndDisplay();
                });
            });

            // Parameter sliders
            if (kValue) {
                kValue.addEventListener('input', () => {
                    updateParameterDisplays();
                    if (getCurrentStrategy() === 'topk') {
                        processAndDisplay();
                    }
                });
            }

            if (pValue) {
                pValue.addEventListener('input', () => {
                    updateParameterDisplays();
                    if (getCurrentStrategy() === 'topp') {
                        processAndDisplay();
                    }
                });
            }
            
            // Initial setup
            updateParameterDisplays();
            updateStrategyVisuals();
            updateControlsVisibility();
            processAndDisplay();
        }
    }
};

// Export the question
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
}
