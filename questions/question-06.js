// Question 6: Temperature in Text Generation
// Created: July 8, 2025
// Educational Focus: Understanding probability distributions, randomness control, and creative vs deterministic text generation

const question = {
    title: "6. What is temperature in text generation and how does it affect output?",
    answer: `<div class="space-y-4">
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-05" class="text-indigo-700 underline hover:text-indigo-900">Question 5: How does beam search improve text generation compared to greedy decoding?</a></li>
                <li><a href="#question-12" class="text-indigo-700 underline hover:text-indigo-900">Question 12: How do top-k and top-p sampling differ in text generation?</a></li>
                <li><a href="#question-23" class="text-indigo-700 underline hover:text-indigo-900">Question 23: How is the softmax function applied in attention mechanisms?</a></li>
                <li><a href="#question-25" class="text-indigo-700 underline hover:text-indigo-900">Question 25: Why is cross-entropy loss used in language modeling?</a></li>
            </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🌡️ What is Temperature?</h4>
            <p class="text-blue-800">Temperature is a crucial hyperparameter that controls the randomness and creativity in text generation. Think of it like adjusting the "creativity dial" on an AI writer - low temperature makes it conservative and predictable, while high temperature makes it bold and experimental.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">❄️ Low Temperature (0.1-0.5)</h5>
                <p class="text-sm text-green-700 mb-2">Conservative and focused selection</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Coherent:</strong> Stays on topic well</div>
                    <div>✅ <strong>Consistent:</strong> Predictable style</div>
                    <div>❌ <strong>Repetitive:</strong> May loop phrases</div>
                    <div>❌ <strong>Boring:</strong> Limited creativity</div>
                </div>
                <code class="text-xs bg-green-100 px-1 rounded mt-2 block">Perfect for: Facts, tutorials</code>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🌡️ Medium Temperature (0.7-1.2)</h5>
                <p class="text-sm text-purple-700 mb-2">Balanced creativity and coherence</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Natural:</strong> Human-like variation</div>
                    <div>✅ <strong>Engaging:</strong> Some surprises</div>
                    <div>✅ <strong>Versatile:</strong> Works for most tasks</div>
                    <div>🔄 <strong>Balanced:</strong> Good trade-offs</div>
                </div>
                <code class="text-xs bg-purple-100 px-1 rounded mt-2 block">Perfect for: Chat, stories</code>
            </div>
            
            <div class="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">🔥 High Temperature (1.5-2.0)</h5>
                <p class="text-sm text-orange-700 mb-2">Wild and experimental generation</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Creative:</strong> Unexpected combinations</div>
                    <div>✅ <strong>Diverse:</strong> Wide vocabulary use</div>
                    <div>❌ <strong>Incoherent:</strong> May lose meaning</div>
                    <div>❌ <strong>Unpredictable:</strong> Hard to control</div>
                </div>
                <code class="text-xs bg-orange-100 px-1 rounded mt-2 block">Perfect for: Poetry, brainstorming</code>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Temperature Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Mathematical Control:</strong> Scales logits before softmax, directly affecting probability distributions</li>
                <li>• <strong>Use Case Optimization:</strong> Different tasks need different creativity levels (factual vs creative writing)</li>
                <li>• <strong>Quality vs Diversity:</strong> Trade-off between coherent, safe outputs and creative, risky ones</li>
                <li>• <strong>Real-world Impact:</strong> ChatGPT, Claude, and other AI assistants all use temperature tuning</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🌡️ Interactive Temperature Laboratory",
        html: `<div class="space-y-6">
            <!-- Temperature Control Panel -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <label for="q6-temp-slider" class="block text-sm font-medium text-gray-700 mb-2">
                    🎛️ Temperature Control: <span id="q6-temp-value" class="font-bold text-purple-600">1.0</span>
                </label>
                <input id="q6-temp-slider" type="range" min="0.1" max="2.0" step="0.1" value="1.0" 
                       class="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="flex justify-between text-xs text-gray-600 mt-2">
                    <span class="text-blue-600">❄️ Conservative (0.1)</span>
                    <span class="text-purple-600">🌡️ Balanced (1.0)</span>
                    <span class="text-orange-600">🔥 Creative (2.0)</span>
                </div>
                <div id="q6-temp-indicator" class="mt-2 text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-800">
                    Balanced Mode: Standard softmax behavior
                </div>
            </div>

            <!-- Context Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">📝 Select Context for Text Generation</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="cursor-pointer">
                        <input type="radio" name="q6-context" value="weather" class="sr-only" checked>
                        <div class="border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <div class="font-medium text-blue-900">Weather Report</div>
                            <div class="text-xs text-blue-700">"The weather is"</div>
                            <div class="text-xs text-blue-600 mt-1">Factual Context</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q6-context" value="story" class="sr-only">
                        <div class="border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 transition-colors">
                            <div class="font-medium text-green-900">Story Opening</div>
                            <div class="text-xs text-green-700">"Once upon a time"</div>
                            <div class="text-xs text-green-600 mt-1">Creative Context</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q6-context" value="custom" class="sr-only">
                        <div class="border-2 border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <div class="font-medium text-purple-900">Custom Context</div>
                            <div class="text-xs text-purple-700">Your own text</div>
                            <div class="text-xs text-purple-600 mt-1">Flexible Context</div>
                        </div>
                    </label>
                </div>
                
                <div id="q6-custom-input" class="mt-3 hidden">
                    <input type="text" placeholder="Enter your context..." 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                           id="q6-context-input">
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700">💡 Quick Experiments:</span>
                <button id="q6-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try Extreme Temperatures</button>
                <button id="q6-compare-btn" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">🔄 Generate & Compare</button>
            </div>
            
            <!-- Probability Visualization -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">📊 Token Probability Distribution</h4>
                    <div class="flex items-center gap-2">
                        <div id="q6-entropy-value" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Entropy: 2.45</div>
                        <div id="q6-eff-vocab" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Eff. vocab: 5.5</div>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Probability Chart -->
                    <div>
                        <p class="text-sm text-gray-600 mb-3">Probabilities for next token:</p>
                        <div id="q6-prob-chart" class="space-y-2 bg-gray-50 p-3 rounded">
                            <!-- Dynamic probability bars -->
                        </div>
                        <div class="mt-2 text-xs text-gray-500">
                            Higher bars = more likely to be selected
                        </div>
                    </div>
                    
                    <!-- Live Sampling -->
                    <div>
                        <p class="text-sm text-gray-600 mb-3">Real-time sampling:</p>
                        <button id="q6-sample-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors mb-3 w-full">
                            🎲 Sample Token
                        </button>
                        <div id="q6-sample-result" class="bg-purple-50 border border-purple-200 rounded-lg p-3 min-h-[60px] font-mono text-sm">
                            Click "Sample Token" to see which token gets selected based on current temperature
                        </div>
                        <div id="q6-sample-stats" class="mt-2 text-xs text-gray-600">
                            Samples taken: 0
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Generation Comparison -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">🔬 Temperature Comparison Lab</h4>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                            <h6 class="font-medium text-blue-900">❄️ Low Temp (0.2)</h6>
                            <span class="text-xs text-blue-700 bg-blue-100 px-1 rounded">Conservative</span>
                        </div>
                        <div id="q6-low-temp-output" class="bg-white border border-blue-200 rounded p-2 text-sm font-mono min-h-[60px]">
                            Click "Generate & Compare" to see outputs
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                            <h6 class="font-medium text-purple-900">🌡️ Current Temp</h6>
                            <span id="q6-current-temp-label" class="text-xs text-purple-700 bg-purple-100 px-1 rounded">1.0</span>
                        </div>
                        <div id="q6-current-temp-output" class="bg-white border border-purple-200 rounded p-2 text-sm font-mono min-h-[60px]">
                            Adjust temperature and compare results
                        </div>
                    </div>
                    
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div class="flex items-center justify-between mb-2">
                            <h6 class="font-medium text-orange-900">🔥 High Temp (1.8)</h6>
                            <span class="text-xs text-orange-700 bg-orange-100 px-1 rounded">Creative</span>
                        </div>
                        <div id="q6-high-temp-output" class="bg-white border border-orange-200 rounded p-2 text-sm font-mono min-h-[60px]">
                            Watch for unexpected and creative outputs
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <h6 class="font-medium text-yellow-900 mb-2">📈 Generation Metrics</h6>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <div class="text-yellow-700">Diversity (Comparisons): <span id="q6-diversity-score" class="font-mono ml-1">0.0</span></div>
                            <div class="text-yellow-700">Avg Token Prob (Comparisons): <span id="q6-avg-prob" class="font-mono ml-1">0.0%</span></div>
                            <div class="text-yellow-700">Generations: <span id="q6-generation-count" class="font-mono ml-1">0</span></div>
                        </div>
                        <div>
                            <div class="text-yellow-700">Diversity (Samples): <span id="q6-sample-diversity" class="font-mono ml-1">0.0</span></div>
                            <div class="text-yellow-700">Avg Token Prob (Samples): <span id="q6-sample-avg-prob" class="font-mono ml-1">0.0%</span></div>
                            <div class="text-yellow-700">Samples: <span id="q6-sample-count" class="font-mono ml-1">0</span></div>
                        </div>
                        <div class="flex items-start gap-2">
                            <button id="q6-reset-metrics" class="text-xs px-3 py-1 bg-white border border-yellow-300 rounded hover:bg-yellow-50">Reset metrics</button>
                            <p class="text-[11px] text-yellow-800">Comparisons update on "Generate & Compare". Sampling updates sample metrics.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Educational Explanation -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">🧠 How Temperature Works</h4>
                <div id="q6-explanation" class="text-sm text-yellow-800">
                    Temperature controls text generation by scaling the logits (raw prediction scores) before applying softmax. 
                    Adjust the temperature above to see how it affects the probability distribution and resulting text creativity.
                </div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const tempSlider = document.getElementById('q6-temp-slider');
            const tempValue = document.getElementById('q6-temp-value');
            const tempIndicator = document.getElementById('q6-temp-indicator');
            const probChart = document.getElementById('q6-prob-chart');
            const entropyValue = document.getElementById('q6-entropy-value');
            const sampleBtn = document.getElementById('q6-sample-btn');
            const sampleResult = document.getElementById('q6-sample-result');
            const sampleStats = document.getElementById('q6-sample-stats');
            const compareBtn = document.getElementById('q6-compare-btn');
            const lowTempOutput = document.getElementById('q6-low-temp-output');
            const currentTempOutput = document.getElementById('q6-current-temp-output');
            const highTempOutput = document.getElementById('q6-high-temp-output');
            const currentTempLabel = document.getElementById('q6-current-temp-label');
            const diversityScore = document.getElementById('q6-diversity-score');
            const avgProb = document.getElementById('q6-avg-prob');
            const generationCount = document.getElementById('q6-generation-count');
            const sampleDiversityEl = document.getElementById('q6-sample-diversity');
            const sampleAvgProbEl = document.getElementById('q6-sample-avg-prob');
            const sampleCountEl = document.getElementById('q6-sample-count');
            const resetMetricsBtn = document.getElementById('q6-reset-metrics');
            const explanationEl = document.getElementById('q6-explanation');
            const exampleBtn = document.getElementById('q6-example-btn');
            const contextInput = document.getElementById('q6-context-input');
            const customInputDiv = document.getElementById('q6-custom-input');

            if (!tempSlider || !probChart) return;

            // Enhanced vocabulary with multiple contexts
            const vocabularies = {
                weather: [
                    { word: 'sunny', baseProb: 0.35 },
                    { word: 'cloudy', baseProb: 0.25 },
                    { word: 'rainy', baseProb: 0.15 },
                    { word: 'cold', baseProb: 0.10 },
                    { word: 'warm', baseProb: 0.08 },
                    { word: 'windy', baseProb: 0.07 }
                ],
                story: [
                    { word: 'there', baseProb: 0.30 },
                    { word: 'in', baseProb: 0.25 },
                    { word: 'lived', baseProb: 0.20 },
                    { word: 'was', baseProb: 0.15 },
                    { word: 'a', baseProb: 0.10 }
                ],
                custom: [
                    { word: 'the', baseProb: 0.25 },
                    { word: 'and', baseProb: 0.20 },
                    { word: 'to', baseProb: 0.15 },
                    { word: 'a', baseProb: 0.15 },
                    { word: 'of', baseProb: 0.12 },
                    { word: 'in', baseProb: 0.08 },
                    { word: 'that', baseProb: 0.05 }
                ]
            };

            // State management
            let sampleCount = 0;
            let generationHistory = [];
            let samplingHistory = []; // { word, prob }
            let currentContext = 'weather';

            // Example temperature settings
            const examples = [
                { temp: 0.1, description: 'Ultra-conservative (0.1)' },
                { temp: 0.5, description: 'Conservative (0.5)' },
                { temp: 1.0, description: 'Balanced (1.0)' },
                { temp: 1.5, description: 'Creative (1.5)' },
                { temp: 2.0, description: 'Wild (2.0)' }
            ];
            let exampleIndex = 0;

            // Get current context
            function getCurrentContext() {
                const selected = document.querySelector('input[name="q6-context"]:checked');
                return selected ? selected.value : 'weather';
            }

            // Get current vocabulary
            function getCurrentVocabulary() {
                return vocabularies[getCurrentContext()] || vocabularies.weather;
            }

            // Apply temperature to probabilities (softmax with temperature)
            function applyTemperature(probs, temp) {
                const scaledLogits = probs.map(p => Math.log(Math.max(p.baseProb, 1e-10)) / temp);
                const maxLogit = Math.max(...scaledLogits);
                const expLogits = scaledLogits.map(logit => Math.exp(logit - maxLogit));
                const sumExp = expLogits.reduce((sum, exp) => sum + exp, 0);
                
                return probs.map((p, i) => ({
                    ...p,
                    tempProb: expLogits[i] / sumExp
                }));
            }

            // Calculate entropy (measure of randomness)
            function calculateEntropy(probs) {
                return -probs.reduce((sum, p) => {
                    const prob = p.tempProb || p.baseProb;
                    return sum + (prob > 0 ? prob * Math.log2(prob) : 0);
                }, 0);
            }

            // Get temperature description
            function getTemperatureDescription(temp) {
                if (temp <= 0.3) return { text: 'Ultra Conservative: Nearly deterministic selection', color: 'blue' };
                if (temp <= 0.7) return { text: 'Conservative: Focused on high-probability tokens', color: 'blue' };
                if (temp <= 1.2) return { text: 'Balanced: Natural language variation', color: 'purple' };
                if (temp <= 1.6) return { text: 'Creative: Explores diverse vocabulary', color: 'orange' };
                return { text: 'Wild: Highly experimental and unpredictable', color: 'red' };
            }

            // Update probability visualization
            function updateProbabilityChart() {
                const temp = parseFloat(tempSlider.value);
                const vocab = getCurrentVocabulary();
                const tempProbs = applyTemperature(vocab, temp);
                const entropy = calculateEntropy(tempProbs);
                const description = getTemperatureDescription(temp);
                
                // Update UI elements
                tempValue.textContent = temp.toFixed(1);
                currentTempLabel.textContent = temp.toFixed(1);
                entropyValue.textContent = `Entropy: ${entropy.toFixed(2)}`;
                
                // Update temperature indicator
                // Use inline styles to avoid dynamic Tailwind class issues with CDN
                tempIndicator.className = 'mt-2 text-xs font-medium px-2 py-1 rounded';
                const colorMap = {
                    blue: { bg: '#DBEAFE', fg: '#1E40AF' },
                    purple: { bg: '#EDE9FE', fg: '#5B21B6' },
                    orange: { bg: '#FFEDD5', fg: '#9A3412' },
                    red: { bg: '#FEE2E2', fg: '#7F1D1D' }
                };
                const c = colorMap[description.color] || colorMap.purple;
                tempIndicator.style.backgroundColor = c.bg;
                tempIndicator.style.color = c.fg;
                tempIndicator.textContent = description.text;
                
                // Update probability chart
                probChart.innerHTML = '';
                tempProbs.forEach((item, index) => {
                    const container = document.createElement('div');
                    container.className = 'flex items-center space-x-3 hover:bg-gray-100 p-1 rounded transition-colors';
                    
                    const rank = document.createElement('div');
                    rank.className = 'text-xs text-gray-500 w-4';
                    rank.textContent = (index + 1);
                    
                    const label = document.createElement('span');
                    label.className = 'text-sm font-mono w-16 text-gray-800';
                    label.textContent = item.word;
                    
                    const barContainer = document.createElement('div');
                    barContainer.className = 'flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden';
                    
                    const bar = document.createElement('div');
                    bar.className = `h-3 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-purple-500' : 
                        index === 1 ? 'bg-purple-400' : 
                        'bg-purple-300'
                    }`;
                    bar.style.width = `${item.tempProb * 100}%`;
                    
                    const percentage = document.createElement('span');
                    percentage.className = 'text-xs text-gray-600 w-12 text-right';
                    percentage.textContent = `${(item.tempProb * 100).toFixed(1)}%`;
                    
                    barContainer.appendChild(bar);
                    container.appendChild(rank);
                    container.appendChild(label);
                    container.appendChild(barContainer);
                    container.appendChild(percentage);
                    probChart.appendChild(container);
                    
                    // Add tooltip
                    container.title = `${item.word}: ${(item.tempProb * 100).toFixed(2)}% chance of selection`;
                });
                
                // Update effective vocabulary size display (2^entropy)
                const effVocabEl = document.getElementById('q6-eff-vocab');
                if (effVocabEl) effVocabEl.textContent = `Eff. vocab: ${Math.pow(2, entropy).toFixed(2)}`;

                updateExplanation(temp, entropy);
            }

            // Sample token based on temperature
            function selectRandomToken(probs) {
                const random = Math.random();
                let cumulative = 0;
                
                for (const item of probs) {
                    cumulative += item.tempProb;
                    if (random <= cumulative) {
                        return item;
                    }
                }
                return probs[0];
            }

            // Sample token visualization
            function sampleToken() {
                const temp = parseFloat(tempSlider.value);
                const vocab = getCurrentVocabulary();
                const tempProbs = applyTemperature(vocab, temp);
                const selected = selectRandomToken(tempProbs);
                
                sampleCount++;
                
                // Animate the selection
                sampleResult.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-purple-700 text-lg">"${selected.word}"</span>
                        <span class="text-xs text-purple-600">${(selected.tempProb * 100).toFixed(1)}% chance</span>
                    </div>
                    <div class="text-xs text-gray-600 mt-1">Selected from ${vocab.length} possible tokens</div>
                `;
                
                sampleStats.textContent = `Samples taken: ${sampleCount}`;
                
                // Visual feedback
                sampleResult.style.transform = 'scale(1.05)';
                sampleResult.style.backgroundColor = '#f3e8ff';
                setTimeout(() => {
                    sampleResult.style.transform = 'scale(1)';
                    sampleResult.style.backgroundColor = '#faf5ff';
                }, 200);

                // Update sampling history and sampling metrics
                samplingHistory.push({ word: selected.word, prob: selected.tempProb });
                if (samplingHistory.length > 100) samplingHistory.shift();

                updateSampleMetrics();

                return selected.word;
            }

            // Generate text with different temperatures
            function generateComparison() {
                const context = getCurrentContext();
                const contextTexts = {
                    weather: 'The weather is',
                    story: 'Once upon a time',
                    custom: contextInput.value || 'The story begins'
                };
                
                const baseText = contextTexts[context];
                const vocab = getCurrentVocabulary();
                
                // Generate with different temperatures
                const lowTemp = applyTemperature(vocab, 0.2);
                const currentTemp = applyTemperature(vocab, parseFloat(tempSlider.value));
                const highTemp = applyTemperature(vocab, 1.8);
                
                const lowResult = selectRandomToken(lowTemp);
                const currentResult = selectRandomToken(currentTemp);
                const highResult = selectRandomToken(highTemp);
                
                // Update outputs
                lowTempOutput.innerHTML = `
                    <div>"${baseText} <strong class="text-blue-600">${lowResult.word}</strong>..."</div>
                    <div class="text-xs text-blue-500 mt-1">${(lowResult.tempProb * 100).toFixed(1)}% probability</div>
                `;
                
                currentTempOutput.innerHTML = `
                    <div>"${baseText} <strong class="text-purple-600">${currentResult.word}</strong>..."</div>
                    <div class="text-xs text-purple-500 mt-1">${(currentResult.tempProb * 100).toFixed(1)}% probability</div>
                `;
                
                highTempOutput.innerHTML = `
                    <div>"${baseText} <strong class="text-orange-600">${highResult.word}</strong>..."</div>
                    <div class="text-xs text-orange-500 mt-1">${(highResult.tempProb * 100).toFixed(1)}% probability</div>
                `;
                
                // Update metrics
                generationHistory.push({ low: lowResult, current: currentResult, high: highResult });
                updateMetrics();
            }

            // Update generation metrics
            function updateMetrics() {
                if (generationHistory.length === 0) return;
                
                const words = generationHistory.flatMap(gen => [gen.low.word, gen.current.word, gen.high.word]);
                const uniqueWords = new Set(words);
                const diversity = (uniqueWords.size / words.length).toFixed(2);
                
                const avgProbability = generationHistory.reduce((sum, gen) => {
                    return sum + (gen.low.tempProb + gen.current.tempProb + gen.high.tempProb) / 3;
                }, 0) / generationHistory.length;
                
                diversityScore.textContent = diversity;
                avgProb.textContent = `${(avgProbability * 100).toFixed(1)}%`;
                generationCount.textContent = generationHistory.length;
            }

            // Update sampling-only metrics
            function updateSampleMetrics() {
                if (!sampleDiversityEl || !sampleAvgProbEl || !sampleCountEl) return;
                const count = samplingHistory.length;
                if (count === 0) {
                    sampleDiversityEl.textContent = '0.0';
                    sampleAvgProbEl.textContent = '0.0%';
                    sampleCountEl.textContent = '0';
                    return;
                }
                const words = samplingHistory.map(s => s.word);
                const unique = new Set(words).size;
                const diversity = unique / count;
                const avgP = samplingHistory.reduce((s, r) => s + r.prob, 0) / count;
                sampleDiversityEl.textContent = diversity.toFixed(2);
                sampleAvgProbEl.textContent = `${(avgP * 100).toFixed(1)}%`;
                sampleCountEl.textContent = String(sampleCount);
            }

            function resetAllMetrics() {
                generationHistory = [];
                samplingHistory = [];
                sampleCount = 0;
                if (diversityScore) diversityScore.textContent = '0.0';
                if (avgProb) avgProb.textContent = '0.0%';
                if (generationCount) generationCount.textContent = '0';
                updateSampleMetrics();
                if (sampleStats) sampleStats.textContent = 'Samples taken: 0';
            }

            // Update educational explanation
            function updateExplanation(temp, entropy) {
                let explanation = '';
                
                if (temp <= 0.3) {
                    explanation = `<strong>Low Temperature (${temp}):</strong> The model is being very conservative. The softmax function is sharpened, making high-probability tokens even more likely. Entropy is low (${entropy.toFixed(2)}), indicating low randomness. Perfect for factual content where consistency matters.`;
                } else if (temp <= 0.7) {
                    explanation = `<strong>Conservative Temperature (${temp}):</strong> Still favoring high-probability tokens but with some variation. The probability distribution is moderately sharp. Entropy is ${entropy.toFixed(2)}, showing controlled randomness.`;
                } else if (temp <= 1.2) {
                    explanation = `<strong>Balanced Temperature (${temp}):</strong> Near-natural language generation. The softmax function operates normally, providing good balance between coherence and creativity. Entropy is ${entropy.toFixed(2)}, indicating healthy variation.`;
                } else if (temp <= 1.6) {
                    explanation = `<strong>Creative Temperature (${temp}):</strong> The probability distribution is flattened, giving lower-probability tokens better chances. Entropy is ${entropy.toFixed(2)}, showing increased randomness. Good for creative writing.`;
                } else {
                    explanation = `<strong>Wild Temperature (${temp}):</strong> Very flat probability distribution. Even low-probability tokens have significant chances of selection. High entropy (${entropy.toFixed(2)}) means very unpredictable outputs. Use with caution!`;
                }
                
                explanationEl.innerHTML = explanation;
            }

            // Handle context changes
            function updateContextSelection() {
                currentContext = getCurrentContext();
                
                // Show/hide custom input
                if (currentContext === 'custom') {
                    customInputDiv.classList.remove('hidden');
                } else {
                    customInputDiv.classList.add('hidden');
                }
                
                // Update visual selection
                document.querySelectorAll('input[name="q6-context"]').forEach(radio => {
                    const card = radio.nextElementSibling;
                    if (radio.checked) {
                        card.classList.remove('border-blue-200', 'border-green-200', 'border-purple-200');
                        if (radio.value === 'weather') {
                            card.classList.add('border-blue-400', 'bg-blue-50');
                        } else if (radio.value === 'story') {
                            card.classList.add('border-green-400', 'bg-green-50');
                        } else {
                            card.classList.add('border-purple-400', 'bg-purple-50');
                        }
                    } else {
                        card.classList.remove('border-blue-400', 'border-green-400', 'border-purple-400', 'bg-blue-50', 'bg-green-50', 'bg-purple-50');
                        if (radio.value === 'weather') card.classList.add('border-blue-200');
                        else if (radio.value === 'story') card.classList.add('border-green-200');
                        else card.classList.add('border-purple-200');
                    }
                });
                
                updateProbabilityChart();
            }

            // Event listeners
            if (tempSlider) tempSlider.addEventListener('input', updateProbabilityChart);
            if (sampleBtn) sampleBtn.addEventListener('click', sampleToken);
            if (compareBtn) compareBtn.addEventListener('click', generateComparison);
            if (resetMetricsBtn) resetMetricsBtn.addEventListener('click', resetAllMetrics);
            
            // Context selection listeners
            document.querySelectorAll('input[name="q6-context"]').forEach(radio => {
                radio.addEventListener('change', updateContextSelection);
            });
            
            if (contextInput) {
                contextInput.addEventListener('input', () => {
                    if (getCurrentContext() === 'custom') {
                        // Reset metrics when context changes to avoid mixing distributions
                        resetAllMetrics();
                        updateProbabilityChart();
                    }
                });
            }

            // Example button
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    tempSlider.value = example.temp;
                    exampleBtn.textContent = `Try: ${example.description}`;
                    exampleIndex++;
                    updateProbabilityChart();
                });
            }

            // Initialize
            updateContextSelection();
            updateProbabilityChart();
            updateSampleMetrics();
        }
    }
};
