const interactiveScript = () => {
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
            const tempValue = document.getElementById('q12-temp-value');
            const tempDisplay = document.getElementById('q12-temp-display');
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

            // Apply temperature to probabilities and sample
            function applySampling(vocabulary, strategy, k, p, tau) {
                // Temperature-adjusted probabilities: p_i' ∝ p_i^(1/τ); always renormalize
                const safe = vocabulary.map(t => ({ token: t.token, probability: Math.max(t.probability, 1e-12) }));
                const pow = (!tau || Math.abs(tau - 1.0) < 1e-6) ? 1.0 : (1.0 / tau);
                const powered = safe.map(t => ({ token: t.token, probability: t.probability ** pow }));
                const Z = powered.reduce((s, t) => s + t.probability, 0) || 1;
                const adjusted = powered.map(t => ({ token: t.token, probability: t.probability / Z }));

                // Sort by adjusted probability (descending)
                const sorted = adjusted.sort((a, b) => b.probability - a.probability);
                
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
                if (tempDisplay) tempDisplay.textContent = parseFloat(tempValue.value).toFixed(1);
            }

            // Main processing function
            const processAndDisplay = () => {
                // Get the selected context text, not the index
                const selectedOption = contextInput.options[contextInput.selectedIndex];
                const context = selectedOption ? selectedOption.text : '';
                const strategy = getCurrentStrategy();
                const k = parseInt(kValue.value);
                const p = parseFloat(pValue.value);
                const tau = parseFloat(tempValue.value || '1.0');
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
                const sampledTokens = applySampling(fullVocabulary, strategy, k, p, tau);

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

                // Token terminology note (clarify token vs word)
                const tokenNote = document.createElement('div');
                tokenNote.className = 'mb-3 text-xs text-gray-600 italic';
                tokenNote.innerHTML = 'Note: In real LLMs, a <strong>token</strong> is usually a subword piece. One word can map to multiple tokens. This demo shows whole words for teaching clarity.';
                output.appendChild(tokenNote);

                // Create tokens display
                const tokensContainer = document.createElement('div');
                tokensContainer.className = 'space-y-3';

                // Strategy-specific header
                const headerEl = document.createElement('div');
                headerEl.className = 'flex items-center justify-between text-sm font-medium text-gray-700';
                
        let headerText = '';
                switch (strategy) {
                    case 'topk':
            headerText = `Top-${k} tokens selected for sampling (τ=${tau.toFixed(1)}):`;
                        break;
                    case 'topp':
                        const totalProb = sampledTokens.reduce((sum, token) => sum + token.probability, 0);
            headerText = `Tokens covering ${(totalProb * 100).toFixed(1)}% probability mass (p=${p}, τ=${tau.toFixed(1)}):`;
                        break;
                    case 'greedy':
            headerText = `Most probable token selected (τ=${tau.toFixed(1)}):`;
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
                        <div class="text-center text-[11px] text-gray-600 mb-1">Token ≈ subword piece (demo uses whole words for clarity)</div>
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

            if (tempValue) {
                tempValue.addEventListener('input', () => {
                    updateParameterDisplays();
                    processAndDisplay();
                });
            }
            
            // Initial setup
            updateParameterDisplays();
            updateStrategyVisuals();
            updateControlsVisibility();
            processAndDisplay();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question12Interactive = interactiveScript;
}
