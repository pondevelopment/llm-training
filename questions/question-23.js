// Question 23: How is the softmax function applied in attention mechanisms?
// Created: July 13, 2025
// Educational Focus: Understanding softmax normalization in attention, temperature effects, and probability distribution properties

const question = {
    title: "23. How is the softmax function applied in attention mechanisms?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What is Softmax in Attention?</h4>
            <p class="text-blue-800">The softmax function converts raw attention scores (similarity values) into a probability distribution that sums to 1. Think of it like converting preference ratings into percentages - if you rate 3 restaurants as 8, 6, and 4, softmax converts these to probabilities like 65%, 24%, and 11%.</p>
        </div>
        
        <!-- Mathematical Formula -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h4 class="font-semibold text-gray-900 mb-2">📐 The Softmax Formula</h4>
            <div class="font-mono text-center text-lg bg-white p-3 rounded border">
                softmax(x<sub>i</sub>) = e<sup>x<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>x<sub>j</sub></sup>
            </div>
            <p class="text-sm text-gray-600 mt-2">Where x<sub>i</sub> are the raw attention scores and the result is a probability distribution.</p>
        </div>
        
        <!-- Temperature Effects Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <h5 class="font-medium text-blue-900">Low Temperature (< 1.0)</h5>
                <p class="text-sm text-blue-700">Makes probabilities more "peaked" - emphasizes differences between scores</p>
                <code class="text-xs bg-blue-100 px-1 rounded">[3, 2, 1] → [0.67, 0.24, 0.09]</code>
            </div>
            
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Normal Temperature (1.0)</h5>
                <p class="text-sm text-green-700">Standard softmax behavior - balanced probability distribution</p>
                <code class="text-xs bg-green-100 px-1 rounded">[3, 2, 1] → [0.58, 0.31, 0.11]</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">High Temperature (> 1.0)</h5>
                <p class="text-sm text-orange-700">Makes probabilities more "flat" - reduces differences between scores</p>
                <code class="text-xs bg-orange-100 px-1 rounded">[3, 2, 1] → [0.42, 0.34, 0.24]</code>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Normalization:</strong> Ensures attention weights sum to 1, creating a valid probability distribution</li>
                <li>• <strong>Differentiability:</strong> Smooth function that allows gradient-based learning during training</li>
                <li>• <strong>Focus Control:</strong> Temperature parameter controls how sharply the model focuses attention</li>
                <li>• <strong>Numerical Stability:</strong> Prevents extreme values from dominating the attention mechanism</li>
                <li>• <strong>Interpretability:</strong> Outputs can be interpreted as "how much to attend to each position"</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🎯 Interactive Softmax Attention Explorer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q23-scores-select" class="block text-sm font-medium text-gray-700 mb-2">📝 Select Attention Score Pattern</label>
                <select id="q23-scores-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="3.2, 1.8, 2.5, 0.9, 2.1">Mixed Scores: [3.2, 1.8, 2.5, 0.9, 2.1]</option>
                    <option value="2.0, 2.0, 2.0, 2.0">Uniform Attention: [2.0, 2.0, 2.0, 2.0]</option>
                    <option value="5.0, 1.0, 1.0, 1.0">Single Focus: [5.0, 1.0, 1.0, 1.0]</option>
                    <option value="4.5, 3.8, 3.2, 2.1">Gradual Decline: [4.5, 3.8, 3.2, 2.1]</option>
                    <option value="1.2, 4.8, 1.1, 4.7">Alternating: [1.2, 4.8, 1.1, 4.7]</option>
                    <option value="3.0, 2.8, 2.6, 2.4, 2.2, 2.0">Long Sequence: [3.0, 2.8, 2.6, 2.4, 2.2, 2.0]</option>
                    <option value="6.5, 0.2, 0.1">Extreme Focus: [6.5, 0.2, 0.1]</option>
                    <option value="2.1, 2.3, 1.9, 2.2, 2.0, 2.4, 1.8, 2.1">Near Uniform: [2.1, 2.3, 1.9, 2.2, 2.0, 2.4, 1.8, 2.1]</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Choose from curated attention score patterns that demonstrate different attention behaviors</p>
            </div>
            
            <!-- Temperature Control -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label for="q23-temperature" class="block text-sm font-medium text-gray-700 mb-2">🌡️ Temperature Parameter</label>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-600 min-w-[80px]">Focused (0.1)</span>
                    <input type="range" id="q23-temperature" min="0.1" max="3.0" step="0.1" value="1.0" class="flex-1">
                    <span class="text-sm text-gray-600 min-w-[80px]">Diffuse (3.0)</span>
                </div>
                <div class="text-center mt-2">
                    <span class="text-sm font-medium">Temperature: </span>
                    <span id="q23-temp-display" class="text-sm bg-gray-100 px-2 py-1 rounded">1.0</span>
                </div>
            </div>

            <!-- Visualization Mode -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">📊 Visualization Mode</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q23-mode" value="bars" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Bar Chart</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visual</span>
                            </div>
                            <p class="text-xs text-gray-600">Show probabilities as colored bars for easy comparison</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q23-mode" value="table" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Data Table</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Precise</span>
                            </div>
                            <p class="text-xs text-gray-600">Show exact numerical values with detailed calculations</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q23-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Uniform - Perfect equality</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Softmax Results</h4>
                    <div id="q23-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Bar Chart</div>
                </div>
                <div id="q23-output" class="min-h-[200px]"></div>
                <div id="q23-legend" class="mt-3 text-xs text-gray-600"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Temperature Effects Analysis</h4>
                <div id="q23-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const scoresSelect = document.getElementById('q23-scores-select');
            const temperatureSlider = document.getElementById('q23-temperature');
            const tempDisplay = document.getElementById('q23-temp-display');
            const output = document.getElementById('q23-output');
            const modeRadios = document.querySelectorAll('input[name="q23-mode"]');
            const exampleBtn = document.getElementById('q23-example-btn');
            const modeIndicator = document.getElementById('q23-mode-indicator');
            const legend = document.getElementById('q23-legend');
            const explanation = document.getElementById('q23-explanation');

            // Check if required elements exist
            if (!scoresSelect || !output || !temperatureSlider || !tempDisplay) {
                console.error('Required DOM elements not found for Question 23');
                return;
            }

            // Example scenarios with more detailed descriptions
            const examples = [
                { 
                    scores: "2.0, 2.0, 2.0, 2.0", 
                    temp: 1.0, 
                    description: "Uniform - Perfect equality",
                    explanation: "All positions receive exactly equal attention - no preference"
                },
                { 
                    scores: "5.0, 1.0, 1.0, 1.0", 
                    temp: 1.0, 
                    description: "Single Focus - Sharp attention",
                    explanation: "One position dominates attention - very focused model"
                },
                { 
                    scores: "4.5, 3.8, 3.2, 2.1", 
                    temp: 0.5, 
                    description: "Gradual + Low Temp - Very peaked",
                    explanation: "Gradual decline with low temperature creates extreme focus"
                },
                { 
                    scores: "1.2, 4.8, 1.1, 4.7", 
                    temp: 2.0, 
                    description: "Alternating + High Temp - Flattened",
                    explanation: "High temperature smooths out the alternating pattern"
                },
                { 
                    scores: "6.5, 0.2, 0.1", 
                    temp: 1.0, 
                    description: "Extreme Focus - Maximum attention",
                    explanation: "Demonstrates how extreme scores create near-certainty"
                }
            ];
            
            let exampleIndex = 0;

            // Helper function to parse scores from dropdown
            function parseScores(scoresText) {
                try {
                    const scores = scoresText.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                    return scores.length > 0 ? scores : [1, 1, 1];
                } catch {
                    return [1, 1, 1];
                }
            }

            // Calculate softmax with temperature
            function softmax(scores, temperature = 1.0) {
                // Apply temperature scaling
                const scaledScores = scores.map(score => score / temperature);
                
                // Calculate exp values
                const expScores = scaledScores.map(score => Math.exp(score));
                
                // Calculate sum for normalization
                const expSum = expScores.reduce((sum, exp) => sum + exp, 0);
                
                // Calculate final probabilities
                const probabilities = expScores.map(exp => exp / expSum);
                
                return {
                    original: scores,
                    scaled: scaledScores,
                    exponentials: expScores,
                    probabilities: probabilities,
                    sum: expSum
                };
            }

            // Get current visualization mode
            function getCurrentMode() {
                const checked = document.querySelector('input[name="q23-mode"]:checked');
                return checked ? checked.value : 'bars';
            }

            // Render bar chart visualization
            function renderBarChart(result) {
                const maxBarWidth = 300;
                
                let html = '<div class="space-y-3">';
                
                result.probabilities.forEach((prob, i) => {
                    const barWidth = prob * maxBarWidth;
                    const percentage = (prob * 100).toFixed(1);
                    const color = `hsl(${200 + i * 40}, 70%, 60%)`;
                    
                    html += `
                        <div class="flex items-center space-x-3">
                            <div class="w-16 text-sm font-medium text-gray-700">Score ${i + 1}:</div>
                            <div class="flex-1 relative">
                                <div class="h-8 bg-gray-200 rounded overflow-hidden">
                                    <div class="h-full transition-all duration-500 ease-out flex items-center justify-center text-white text-sm font-medium" 
                                         style="width: ${barWidth}px; background-color: ${color}">
                                        ${percentage}%
                                    </div>
                                </div>
                            </div>
                            <div class="w-20 text-sm text-gray-600">
                                ${result.original[i].toFixed(2)} → ${prob.toFixed(3)}
                            </div>
                        </div>
                    `;
                });
                
                html += '</div>';
                return html;
            }

            // Render data table visualization
            function renderTable(result) {
                let html = `
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Raw Score</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Scaled Score</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">e^(scaled)</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                `;
                
                result.probabilities.forEach((prob, i) => {
                    html += `
                        <tr class="hover:bg-gray-50">
                            <td class="px-3 py-2 text-sm font-medium text-gray-900">${i + 1}</td>
                            <td class="px-3 py-2 text-sm text-gray-600">${result.original[i].toFixed(3)}</td>
                            <td class="px-3 py-2 text-sm text-gray-600">${result.scaled[i].toFixed(3)}</td>
                            <td class="px-3 py-2 text-sm text-gray-600">${result.exponentials[i].toFixed(3)}</td>
                            <td class="px-3 py-2 text-sm font-medium text-blue-600">${prob.toFixed(4)}</td>
                            <td class="px-3 py-2 text-sm text-gray-600">${(prob * 100).toFixed(1)}%</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-3 text-xs text-gray-600">
                        Sum of exponentials: ${result.sum.toFixed(4)} | Sum of probabilities: ${result.probabilities.reduce((sum, p) => sum + p, 0).toFixed(4)}
                    </div>
                `;
                
                return html;
            }

            // Calculate attention entropy (measure of focus/spread)
            function calculateEntropy(probabilities) {
                return -probabilities.reduce((entropy, p) => {
                    return entropy + (p > 0 ? p * Math.log2(p) : 0);
                }, 0);
            }

            // Update temperature display
            function updateTemperatureDisplay() {
                const temp = parseFloat(temperatureSlider.value);
                tempDisplay.textContent = temp.toFixed(1);
            }

            // Update mode indicator
            function updateModeIndicator() {
                const mode = getCurrentMode();
                modeIndicator.textContent = mode === 'bars' ? 'Bar Chart' : 'Data Table';
            }

            // Main processing function
            const processAndDisplay = () => {
                const scoresText = scoresSelect.value.trim();
                const temperature = parseFloat(temperatureSlider.value);
                const mode = getCurrentMode();
                
                if (!scoresText) {
                    output.innerHTML = '<div class="text-sm text-gray-500 text-center">Select attention scores to see softmax transformation...</div>';
                    return;
                }

                const scores = parseScores(scoresText);
                const result = softmax(scores, temperature);
                
                // Render based on mode
                if (mode === 'bars') {
                    output.innerHTML = renderBarChart(result);
                } else {
                    output.innerHTML = renderTable(result);
                }
                
                // Calculate metrics
                const entropy = calculateEntropy(result.probabilities);
                const maxProb = Math.max(...result.probabilities);
                const minProb = Math.min(...result.probabilities);
                const focus = maxProb - minProb;
                
                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        Entropy: ${entropy.toFixed(3)} bits | 
                        Max probability: ${(maxProb * 100).toFixed(1)}% | 
                        Focus score: ${(focus * 100).toFixed(1)}%
                    `;
                }
                
                // Update explanation based on temperature
                updateExplanation(temperature, entropy, focus);
            };

            // Update educational explanation
            function updateExplanation(temperature, entropy, focus) {
                if (!explanation) return;
                
                let tempEffect, focusLevel, entropyLevel;
                
                if (temperature < 0.5) {
                    tempEffect = "Very low temperature creates extremely sharp attention - the model focuses intensely on the highest-scoring positions.";
                } else if (temperature < 1.0) {
                    tempEffect = "Low temperature sharpens attention distribution - differences between scores become more pronounced.";
                } else if (temperature === 1.0) {
                    tempEffect = "Normal temperature provides standard softmax behavior - balanced probability distribution.";
                } else if (temperature <= 2.0) {
                    tempEffect = "High temperature flattens attention distribution - the model pays more even attention across positions.";
                } else {
                    tempEffect = "Very high temperature creates nearly uniform attention - differences between scores are minimized.";
                }
                
                if (focus > 0.7) {
                    focusLevel = "The model is <strong>highly focused</strong> on specific positions.";
                } else if (focus > 0.4) {
                    focusLevel = "The model shows <strong>moderate focus</strong> with some preference for certain positions.";
                } else {
                    focusLevel = "The model has <strong>distributed attention</strong> across most positions.";
                }
                
                if (entropy < 1.0) {
                    entropyLevel = "Low entropy indicates concentrated attention.";
                } else if (entropy < 2.0) {
                    entropyLevel = "Medium entropy shows balanced attention distribution.";
                } else {
                    entropyLevel = "High entropy indicates very distributed attention.";
                }
                
                explanation.innerHTML = `
                    <div class="space-y-2">
                        <p><strong>Temperature Effect:</strong> ${tempEffect}</p>
                        <p><strong>Attention Pattern:</strong> ${focusLevel}</p>
                        <p><strong>Distribution Analysis:</strong> ${entropyLevel}</p>
                        <p class="text-xs mt-2 p-2 bg-yellow-100 rounded">
                            <strong>💡 Tip:</strong> In transformers, temperature controls how much the model focuses attention. 
                            Lower values create sharper focus (good for precise tasks), while higher values create broader attention (good for considering context).
                        </p>
                    </div>
                `;
            }

            // Example cycling functionality
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex];
                    scoresSelect.value = example.scores;
                    temperatureSlider.value = example.temp;
                    updateTemperatureDisplay();
                    processAndDisplay();
                    
                    exampleBtn.textContent = example.description;
                    exampleBtn.title = `${example.explanation} (${exampleIndex + 1}/${examples.length})`;
                    
                    exampleIndex = (exampleIndex + 1) % examples.length;
                });
            }

            // Event listeners
            scoresSelect.addEventListener('change', processAndDisplay);
            temperatureSlider.addEventListener('input', () => {
                updateTemperatureDisplay();
                processAndDisplay();
            });
            
            modeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateModeIndicator();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateTemperatureDisplay();
            updateModeIndicator();
            processAndDisplay();
        }
    }
};
