const interactiveScript = () => {
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question06Interactive = interactiveScript;
}
