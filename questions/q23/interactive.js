const interactiveScript = () => {
            // Ensure math in the static answer area is typeset
            if (window.MathJax && window.MathJax.typesetPromise) {
                const container = document.getElementById('question-answer');
                const formula = document.getElementById('q23-formula');
                const tryTypeset = () => window.MathJax.typesetPromise([formula || container]).catch(() => {});
                if (container) {
                    tryTypeset().then(() => {
                        // Fallback if MathJax still shows errors
                        if (formula && formula.querySelector('[data-mml-node="merror"], .MathJax_Error')) {
                            formula.setAttribute('aria-label', 'Softmax formula (HTML fallback)');
                            formula.innerHTML = `
                                <div class="font-mono">
                                    p<sub>i</sub> = e<sup>x<sub>i</sub></sup> / Σ<sub>j</sub> e<sup>x<sub>j</sub></sup><br/>
                                    p<sub>i</sub>(T) = e<sup>x<sub>i</sub>/T</sup> / Σ<sub>j</sub> e<sup>x<sub>j</sub>/T</sup>
                                </div>
                            `;
                        }
                    });
                }
            }
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
                const scaledScores = scores.map(score => score / Math.max(temperature, 1e-6));

                // Numerical stability: subtract max before exponentiation
                const maxScore = Math.max(...scaledScores);
                const shifted = scaledScores.map(s => s - maxScore);

                // Calculate exp values
                const expScores = shifted.map(s => Math.exp(s));

                // Calculate sum for normalization
                const expSum = expScores.reduce((sum, exp) => sum + exp, 0);

                // Calculate final probabilities
                const probabilities = expScores.map(exp => exp / (expSum || 1));

                return {
                    original: scores,
                    scaled: scaledScores,
                    exponentials: expScores,
                    probabilities,
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question23Interactive = interactiveScript;
}
