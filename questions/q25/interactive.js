const interactiveScript = () => {
            // Note: Avoid per-block typeset here to prevent races with the
            // app-level MathJax clearing/retypeset. The global renderer in
            // js/app.js will typeset all new math after content loads.
            // Get DOM elements with error checking
            const contextInput = document.getElementById('q25-context');
            const trueWordInput = document.getElementById('q25-true-word');
            const scenarioRadios = document.querySelectorAll('input[name="q25-scenario"]');
            const output = document.getElementById('q25-output');
            const exampleBtn = document.getElementById('q25-example-btn');
            const scenarioIndicator = document.getElementById('q25-scenario-indicator');
            const legend = document.getElementById('q25-legend');
            const explanation = document.getElementById('q25-explanation');

            // Check if required elements exist
            if (!contextInput || !output || !trueWordInput) {
                console.error('Required DOM elements not found for Question 25');
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize Question 25 interactive components.</div>';
                }
                return;
            }

            // Configuration for different scenarios
            const scenarioConfig = {
                good: {
                    name: 'Good Prediction',
                    description: 'Model accurately predicts the next word with high confidence',
                    backgroundColor: 'bg-green-50',
                    borderColor: 'border-green-200'
                },
                uncertain: {
                    name: 'Uncertain Prediction',
                    description: 'Model is unsure and distributes probability across multiple words',
                    backgroundColor: 'bg-blue-50',
                    borderColor: 'border-blue-200'
                },
                bad: {
                    name: 'Bad Prediction',
                    description: 'Model confidently predicts wrong words, assigns low probability to correct word',
                    backgroundColor: 'bg-red-50',
                    borderColor: 'border-red-200'
                }
            };

            // Example scenarios
            const examples = [
                { 
                    context: "The weather today is very", 
                    trueWord: "sunny", 
                    scenario: "good",
                    note: "Weather prediction - model should predict weather adjectives"
                },
                { 
                    context: "I love eating", 
                    trueWord: "pizza", 
                    scenario: "good",
                    note: "Food context - strong semantic cues"
                },
                { 
                    context: "The movie was", 
                    trueWord: "amazing", 
                    scenario: "uncertain",
                    note: "Opinion context - many possible adjectives"
                },
                { 
                    context: "Artificial intelligence will", 
                    trueWord: "help", 
                    scenario: "uncertain",
                    note: "Abstract future prediction - high uncertainty"
                },
                { 
                    context: "The cat", 
                    trueWord: "meowed", 
                    scenario: "bad",
                    note: "Simple context but model predicts poorly"
                },
                { 
                    context: "The food tastes", 
                    trueWord: "delicious", 
                    scenario: "good",
                    note: "Food quality - sensory context"
                },
                { 
                    context: "Programming can be", 
                    trueWord: "challenging", 
                    scenario: "uncertain",
                    note: "Subjective opinion - multiple valid answers"
                }
            ];
            
            let exampleIndex = 0;

            // Generate realistic probability distributions based on scenario
            function generateProbabilities(trueWord, scenario, contextWords) {
                const vocabulary = [
                    trueWord,
                    'and', 'the', 'of', 'to', 'a', 'in', 'is', 'it', 'you',
                    'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with',
                    'his', 'they', 'at', 'be', 'this', 'have', 'from',
                    'or', 'one', 'had', 'by', 'word', 'but', 'not',
                    'what', 'all', 'were', 'we', 'when', 'your', 'can',
                    'said', 'there', 'each', 'which', 'she', 'do', 'how'
                ];

                // Add context-relevant words
                const contextRelevant = [];
                const context = contextWords.toLowerCase();
                
                if (context.includes('weather') || context.includes('today')) {
                    contextRelevant.push('hot', 'cold', 'rainy', 'cloudy', 'sunny', 'windy', 'nice', 'warm', 'cool');
                } else if (context.includes('eating') || context.includes('food') || context.includes('tastes')) {
                    contextRelevant.push('pizza', 'pasta', 'salad', 'fruit', 'vegetables', 'meat', 'fish', 'bread', 'delicious', 'awful', 'good', 'bad');
                } else if (context.includes('movie') || context.includes('film') || context.includes('book')) {
                    contextRelevant.push('good', 'bad', 'amazing', 'terrible', 'funny', 'boring', 'exciting', 'interesting', 'awful', 'fantastic');
                } else if (context.includes('cat') || context.includes('dog')) {
                    contextRelevant.push('ran', 'jumped', 'slept', 'meowed', 'barked', 'played', 'ate', 'walked');
                } else if (context.includes('artificial intelligence') || context.includes('machine learning') || context.includes('programming')) {
                    contextRelevant.push('help', 'change', 'improve', 'transform', 'powerful', 'complex', 'difficult', 'easy', 'fascinating', 'challenging');
                } else {
                    contextRelevant.push('good', 'bad', 'big', 'small', 'new', 'old', 'important', 'different');
                }

                // Combine vocabularies and ensure true word is included
                const allWords = [...new Set([...vocabulary, ...contextRelevant])];
                if (!allWords.includes(trueWord)) {
                    allWords[0] = trueWord; // Replace first word with true word if not found
                }

                const probabilities = {};
                let total = 0;

                switch (scenario) {
                    case 'good':
                        // True word gets high probability (60-80%)
                        const trueProbGood = 0.6 + Math.random() * 0.2;
                        probabilities[trueWord] = trueProbGood;
                        total = trueProbGood;
                        
                        // Distribute remaining probability among relevant words
                        const remainingGood = 1 - trueProbGood;
                        contextRelevant.forEach(word => {
                            if (word !== trueWord) {
                                const prob = (remainingGood / contextRelevant.length) * (0.5 + Math.random());
                                probabilities[word] = prob;
                                total += prob;
                            }
                        });
                        break;
                        
                    case 'uncertain':
                        // True word gets medium probability (20-40%)
                        const trueProbUncertain = 0.2 + Math.random() * 0.2;
                        probabilities[trueWord] = trueProbUncertain;
                        total = trueProbUncertain;
                        
                        // Distribute remaining more evenly
                        const remainingUncertain = 1 - trueProbUncertain;
                        const topWords = [...contextRelevant, ...vocabulary.slice(0, 10)];
                        topWords.forEach(word => {
                            if (word !== trueWord) {
                                const prob = (remainingUncertain / topWords.length) * (0.3 + Math.random() * 1.4);
                                probabilities[word] = prob;
                                total += prob;
                            }
                        });
                        break;
                        
                    case 'bad':
                        // True word gets low probability (2-10%)
                        const trueProbBad = 0.02 + Math.random() * 0.08;
                        probabilities[trueWord] = trueProbBad;
                        total = trueProbBad;
                        
                        // Give high probability to irrelevant words
                        const irrelevantWords = ['elephant', 'quantum', 'refrigerator', 'parliament', 'xylophone'];
                        irrelevantWords.forEach(word => {
                            const prob = 0.1 + Math.random() * 0.2;
                            probabilities[word] = prob;
                            total += prob;
                        });
                        break;
                }

                // Normalize probabilities to sum to 1
                Object.keys(probabilities).forEach(word => {
                    probabilities[word] = probabilities[word] / total;
                });

                // Sort by probability and return top predictions
                const sortedPredictions = Object.entries(probabilities)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 8);

                return sortedPredictions;
            }

            // Calculate cross-entropy loss
            function calculateCrossEntropyLoss(predictions, trueWord) {
                const trueProb = predictions.find(([word, prob]) => word === trueWord)?.[1] || 0.0001;
                return -Math.log(trueProb);
            }

            // Get current scenario
            function getCurrentScenario() {
                const selected = document.querySelector('input[name="q25-scenario"]:checked');
                return selected ? selected.value : 'good';
            }

            // Update visual indicators
            function updateScenarioVisuals() {
                const scenario = getCurrentScenario();
                const config = scenarioConfig[scenario];
                
                // Update scenario indicator
                if (scenarioIndicator) {
                    scenarioIndicator.textContent = config.name;
                    scenarioIndicator.className = `text-xs px-2 py-1 rounded font-medium ${config.backgroundColor} ${config.borderColor}`;
                }

                // Update radio button containers
                document.querySelectorAll('input[name="q25-scenario"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
            }

            // Main processing function
            const processAndDisplay = () => {
                const context = contextInput.value.trim();
                const trueWord = trueWordInput.value.trim().toLowerCase();
                const scenario = getCurrentScenario();
                
                if (!context || !trueWord) {
                    output.innerHTML = '<div class="text-sm text-gray-500 text-center p-8">Enter context and true word to calculate cross-entropy loss...</div>';
                    return;
                }

                updateScenarioVisuals();

                // Generate predictions based on scenario
                const predictions = generateProbabilities(trueWord, scenario, context);
                const loss = calculateCrossEntropyLoss(predictions, trueWord);
                const trueWordProb = predictions.find(([word, prob]) => word === trueWord)?.[1] || 0;

                // Create results display
                let html = '<div class="space-y-4">';

                // Context and prediction setup
                html += `
                    <div class="bg-gray-50 p-3 rounded border">
                        <h5 class="font-medium text-gray-700 mb-2">Prediction Setup</h5>
                        <div class="text-sm space-y-1">
                            <div><strong>Context:</strong> "${context}"</div>
                            <div><strong>True next word:</strong> "${trueWord}"</div>
                            <div><strong>Scenario:</strong> ${scenarioConfig[scenario].name}</div>
                        </div>
                    </div>
                `;

                // Model predictions table
                html += `
                    <div class="bg-white border rounded">
                        <h5 class="font-medium text-gray-700 p-3 border-b">Model's Top Predictions</h5>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-3 py-2 text-left">Rank</th>
                                        <th class="px-3 py-2 text-left">Word</th>
                                        <th class="px-3 py-2 text-left">Probability</th>
                                        <th class="px-3 py-2 text-left">-log(p)</th>
                                        <th class="px-3 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;

                predictions.forEach(([word, prob], index) => {
                    const isTrue = word === trueWord;
                    const negLogProb = -Math.log(prob);
                    const rowColor = isTrue ? 'bg-green-50' : '';
                    const statusBadge = isTrue ? 
                        '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Correct</span>' :
                        '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Predicted</span>';

                    html += `
                        <tr class="${rowColor}">
                            <td class="px-3 py-2">${index + 1}</td>
                            <td class="px-3 py-2 font-mono">${word}</td>
                            <td class="px-3 py-2 font-mono">${prob.toFixed(4)}</td>
                            <td class="px-3 py-2 font-mono">${negLogProb.toFixed(3)}</td>
                            <td class="px-3 py-2">${statusBadge}</td>
                        </tr>
                    `;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                // Loss calculation
                html += `
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <h5 class="font-medium text-blue-700 mb-3">Cross-Entropy Loss Calculation</h5>
                        <div class="space-y-2 text-sm">
                            <div class="font-mono">
                                L = -log(P(true_word)) = -log(P("${trueWord}"))
                            </div>
                            <div class="font-mono">
                                L = -log(${trueWordProb.toFixed(4)}) = <strong class="text-lg">${loss.toFixed(3)}</strong>
                            </div>
                            <div class="text-blue-600 mt-2">
                                ${loss < 1 ? '🎯 Low loss - Good prediction!' : 
                                  loss < 2 ? '⚠️ Medium loss - Uncertain prediction' : 
                                  '❌ High loss - Poor prediction'}
                            </div>
                        </div>
                    </div>
                `;

                // Loss interpretation
                html += `
                    <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <h5 class="font-medium text-purple-700 mb-3">Loss Interpretation</h5>
                        <div class="grid md:grid-cols-3 gap-4 text-sm">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-600">${(trueWordProb * 100).toFixed(1)}%</div>
                                <div class="text-purple-600">Model Confidence</div>
                                <div class="text-xs text-gray-600 mt-1">Probability assigned to correct word</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-600">${loss.toFixed(2)}</div>
                                <div class="text-purple-600">Cross-Entropy Loss</div>
                                <div class="text-xs text-gray-600 mt-1">Lower is better (0 is perfect)</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-purple-600">${Math.exp(loss).toFixed(1)}</div>
                                <div class="text-purple-600">Perplexity</div>
                                <div class="text-xs text-gray-600 mt-1">Model's "surprise" level</div>
                            </div>
                        </div>
                    </div>
                `;

                html += '</div>';
                output.innerHTML = html;

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        Context: "${context}" → "${trueWord}" | 
                        Loss: ${loss.toFixed(3)} | 
                        Confidence: ${(trueWordProb * 100).toFixed(1)}% | 
                        Scenario: ${scenarioConfig[scenario].name}
                    `;
                }

                // Update explanation
                updateExplanation(scenario, loss, trueWordProb);
            };

            // Update educational explanation
            function updateExplanation(scenario, loss, trueWordProb) {
                if (!explanation) return;

                const config = scenarioConfig[scenario];
                let lossCategory, gradientInfo, trainingImpact;

                if (loss < 0.7) {
                    lossCategory = "Excellent prediction";
                    gradientInfo = "Small gradients - model is confident and correct";
                    trainingImpact = "Minimal weight updates needed, model is learning well";
                } else if (loss < 1.5) {
                    gradientInfo = "Moderate gradients - model needs some adjustment";
                    trainingImpact = "Moderate weight updates to improve confidence";
                    lossCategory = "Reasonable prediction";
                } else if (loss < 3.0) {
                    lossCategory = "Poor prediction";
                    gradientInfo = "Large gradients - model needs significant correction";
                    trainingImpact = "Strong weight updates to fix prediction errors";
                } else {
                    lossCategory = "Very poor prediction";
                    gradientInfo = "Very large gradients - model is badly miscalibrated";
                    trainingImpact = "Major weight updates required, possible training instability";
                }

                explanation.innerHTML = `
                    <div class="space-y-3">
                        <p><strong>Scenario Analysis:</strong> ${config.description}. The model assigned ${(trueWordProb * 100).toFixed(1)}% probability to the correct word "${trueWordInput.value}", resulting in ${lossCategory.toLowerCase()}.</p>
                        
                        <p><strong>Loss Impact:</strong> ${lossCategory} (Loss = ${loss.toFixed(3)}). ${gradientInfo}. During training, this would cause ${trainingImpact.toLowerCase()}.</p>
                        
                        <p><strong>Why Cross-Entropy:</strong> The logarithmic penalty means the model is punished exponentially more for confident wrong predictions. A prediction with 1% confidence (loss = 4.6) is penalized much more heavily than 50% confidence (loss = 0.7).</p>
                        
                        <div class="mt-3 p-3 bg-yellow-100 rounded text-xs">
                            <strong>💡 Training Insight:</strong> Cross-entropy loss encourages the model to be both accurate AND well-calibrated. It's not enough to just pick the right word - the model must also express appropriate confidence levels.
                        </div>
                    </div>
                `;
            }

            // Example cycling functionality
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex];
                    contextInput.value = example.context;
                    trueWordInput.value = example.trueWord;
                    
                    // Set the scenario radio button
                    const scenarioRadio = document.querySelector(`input[name="q25-scenario"][value="${example.scenario}"]`);
                    if (scenarioRadio) {
                        scenarioRadio.checked = true;
                    }
                    
                    processAndDisplay();
                    
                    exampleBtn.textContent = example.note;
                    exampleBtn.title = `Example ${exampleIndex + 1}/${examples.length}: ${example.context} → ${example.trueWord}`;
                    
                    exampleIndex = (exampleIndex + 1) % examples.length;
                });
            }

            // Event listeners
            contextInput.addEventListener('change', processAndDisplay);
            trueWordInput.addEventListener('change', processAndDisplay);
            scenarioRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            updateScenarioVisuals();
            processAndDisplay();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question25Interactive = interactiveScript;
}
