// Question 25: Why is cross-entropy loss used in language modeling?
// Created: July 13, 2025
// Educational Focus: Cross-entropy loss function, probability distributions, language model training, loss optimization

const question = {
    title: "25. Why is cross-entropy loss used in language modeling?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What is Cross-Entropy Loss?</h4>
            <p class="text-blue-800">Cross-entropy loss measures how far the model's predicted probability distribution is from the true distribution. Think of it like a "surprise meter" - if the model predicts low probability for the actual next word, the loss is high (big surprise!). If it predicts high probability for the correct word, the loss is low (no surprise). The formula L = -Σ y<sub>i</sub> log(ŷ<sub>i</sub>) penalizes confident wrong predictions more than uncertain ones.</p>
        </div>
        
        <!-- Intuitive Example -->
        <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 class="font-semibold text-green-900 mb-2">💡 Real-World Analogy</h4>
            <p class="text-green-800">Imagine you're a weather forecaster predicting tomorrow's weather. Cross-entropy loss is like your "credibility score":</p>
            <ul class="text-green-700 mt-2 space-y-1">
                <li>• If you say 90% chance of rain and it rains → <strong>Low loss</strong> (good prediction)</li>
                <li>• If you say 10% chance of rain and it rains → <strong>High loss</strong> (bad prediction)</li>
                <li>• If you say 50% chance of rain → <strong>Medium loss</strong> regardless (hedging your bets)</li>
                <li>• The loss is logarithmic: being confidently wrong is much worse than being unsure</li>
            </ul>
        </div>
        
        <!-- Mathematical Breakdown -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h4 class="font-semibold text-gray-900 mb-2">📐 The Cross-Entropy Formula</h4>
            <div class="font-mono text-center text-lg bg-white p-3 rounded border mb-2">
                L = -Σ y<sub>i</sub> log(ŷ<sub>i</sub>)
            </div>
            <div class="text-sm text-gray-600 space-y-1">
                <p><strong>L</strong> = Cross-entropy loss</p>
                <p><strong>y<sub>i</sub></strong> = True probability (1 for correct token, 0 for others)</p>
                <p><strong>ŷ<sub>i</sub></strong> = Predicted probability from model</p>
                <p><strong>Σ</strong> = Sum over all possible tokens in vocabulary</p>
            </div>
        </div>
        
        <!-- Loss Function Comparison -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Cross-Entropy Loss</h5>
                <p class="text-sm text-green-700">Measures probability distribution distance</p>
                <code class="text-xs bg-green-100 px-1 rounded">L = -log(p_correct)</code>
                <div class="text-xs text-green-600 mt-1">✓ Probabilistically motivated</div>
                <div class="text-xs text-green-600">✓ Smooth gradients</div>
                <div class="text-xs text-green-600">✓ Handles uncertainty well</div>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Mean Squared Error</h5>
                <p class="text-sm text-purple-700">Measures squared difference in predictions</p>
                <code class="text-xs bg-purple-100 px-1 rounded">L = (y - ŷ)²</code>
                <div class="text-xs text-purple-600 mt-1">✗ Not probability-aware</div>
                <div class="text-xs text-purple-600">✗ Poor for classification</div>
                <div class="text-xs text-purple-600">✓ Simple to understand</div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Hinge Loss</h5>
                <p class="text-sm text-orange-700">Maximizes margin between classes</p>
                <code class="text-xs bg-orange-100 px-1 rounded">L = max(0, 1 - y·ŷ)</code>
                <div class="text-xs text-orange-600 mt-1">✗ No probability output</div>
                <div class="text-xs text-orange-600">✗ Not differentiable everywhere</div>
                <div class="text-xs text-orange-600">✓ Good for binary classification</div>
            </div>
        </div>
        
        <!-- Properties of Cross-Entropy -->
        <div class="bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-semibold text-indigo-900 mb-2">🔬 Why Cross-Entropy Works So Well</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-indigo-800 mb-2">Mathematical Properties:</h6>
                    <ul class="text-indigo-700 space-y-1">
                        <li>• <strong>Convex:</strong> No local minima, guaranteed convergence</li>
                        <li>• <strong>Smooth:</strong> Continuous derivatives for gradient descent</li>
                        <li>• <strong>Unbounded:</strong> Heavily penalizes confident wrong predictions</li>
                        <li>• <strong>Probabilistic:</strong> Directly optimizes likelihood</li>
                    </ul>
                </div>
                <div>
                    <h6 class="font-medium text-indigo-800 mb-2">Training Benefits:</h6>
                    <ul class="text-indigo-700 space-y-1">
                        <li>• <strong>Fast Learning:</strong> Large gradients when predictions are wrong</li>
                        <li>• <strong>Calibrated Outputs:</strong> Probabilities reflect confidence</li>
                        <li>• <strong>Handles Imbalance:</strong> Works with uneven token frequencies</li>
                        <li>• <strong>Information Theoretic:</strong> Minimizes surprise/entropy</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Language Modeling Context -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 class="font-semibold text-red-900 mb-2">📚 In Language Modeling Context</h4>
            <div class="text-sm text-red-800 space-y-2">
                <p><strong>Next Token Prediction:</strong> Given "The cat sat on the ___", the model outputs probabilities for each word in vocabulary. Cross-entropy compares this distribution to the one-hot vector of the actual next word.</p>
                <p><strong>Vocabulary Size Impact:</strong> With vocabularies of 50K+ tokens, cross-entropy efficiently handles the massive output space while encouraging the model to be confident about correct predictions and uncertain about wrong ones.</p>
                <p><strong>Autoregressive Training:</strong> During training, we apply cross-entropy loss at every position in the sequence, teaching the model to predict each word given all previous words.</p>
            </div>
        </div>
        
        <!-- Practical Examples -->
        <div class="bg-teal-50 p-4 rounded-lg">
            <h4 class="font-semibold text-teal-900 mb-2">🎮 Loss in Action</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-teal-800 mb-2">Good Prediction (Low Loss):</h6>
                    <div class="bg-white p-2 rounded font-mono text-xs">
                        <div>Context: "I love eating"</div>
                        <div>True next: "pizza" (index 1542)</div>
                        <div>Model predicts:</div>
                        <div>• pizza: 0.75 ✓</div>
                        <div>• food: 0.15</div>
                        <div>• pasta: 0.10</div>
                        <div class="text-green-600 mt-1">Loss = -log(0.75) = 0.29</div>
                    </div>
                </div>
                <div>
                    <h6 class="font-medium text-teal-800 mb-2">Bad Prediction (High Loss):</h6>
                    <div class="bg-white p-2 rounded font-mono text-xs">
                        <div>Context: "I love eating"</div>
                        <div>True next: "pizza" (index 1542)</div>
                        <div>Model predicts:</div>
                        <div>• elephant: 0.60</div>
                        <div>• randomly: 0.35</div>
                        <div>• pizza: 0.05 ✓</div>
                        <div class="text-red-600 mt-1">Loss = -log(0.05) = 3.00</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Alternative Approaches -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Not Other Loss Functions?</h4>
            <ul class="text-sm text-yellow-800 space-y-2">
                <li>• <strong>Accuracy:</strong> Not differentiable, provides no gradient signal for improvement</li>
                <li>• <strong>MSE:</strong> Treats probability differences linearly, doesn't understand probability distributions</li>
                <li>• <strong>KL Divergence:</strong> Essentially the same as cross-entropy for this use case (up to a constant)</li>
                <li>• <strong>Focal Loss:</strong> Variant of cross-entropy that focuses on hard examples, used in some advanced models</li>
                <li>• <strong>Label Smoothing:</strong> Modifies cross-entropy to prevent overconfidence, used in practice</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Cross-Entropy Loss Calculator",
        html: `<div class="space-y-6">
            <!-- Prediction Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q25-context" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose Context for Next Word Prediction</label>
                <select id="q25-context" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="The weather today is very">The weather today is very</option>
                    <option value="I love eating">I love eating</option>
                    <option value="The movie was">The movie was</option>
                    <option value="Artificial intelligence will">Artificial intelligence will</option>
                    <option value="The cat">The cat</option>
                    <option value="The food tastes">The food tastes</option>
                    <option value="Today feels">Today feels</option>
                    <option value="The book was">The book was</option>
                    <option value="Programming can be">Programming can be</option>
                    <option value="Machine learning is">Machine learning is</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Select a context and the model will predict probabilities for the next word</p>
            </div>
            
            <!-- Loss Calculation Mode -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Loss Calculation Scenario</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q25-scenario" value="good" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Good Prediction</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Low Loss</span>
                            </div>
                            <p class="text-xs text-gray-600">Model correctly predicts likely next words</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                Correct word gets 70%+ probability
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q25-scenario" value="uncertain" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Uncertain Prediction</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Medium Loss</span>
                            </div>
                            <p class="text-xs text-gray-600">Model is unsure, spreads probability</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                Correct word gets 20-40% probability
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q25-scenario" value="bad" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Bad Prediction</span>
                                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High Loss</span>
                            </div>
                            <p class="text-xs text-gray-600">Model confidently predicts wrong words</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                Correct word gets &lt;10% probability
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- True Next Word -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label for="q25-true-word" class="block text-sm font-medium text-gray-700 mb-2">🎯 True Next Word</label>
                <select id="q25-true-word" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="sunny">sunny (weather context)</option>
                    <option value="hot">hot (weather context)</option>
                    <option value="cold">cold (weather context)</option>
                    <option value="cloudy">cloudy (weather context)</option>
                    <option value="pizza">pizza (food context)</option>
                    <option value="pasta">pasta (food context)</option>
                    <option value="salad">salad (food context)</option>
                    <option value="delicious">delicious (food quality)</option>
                    <option value="awful">awful (food quality)</option>
                    <option value="amazing">amazing (opinion context)</option>
                    <option value="terrible">terrible (opinion context)</option>
                    <option value="boring">boring (opinion context)</option>
                    <option value="help">help (AI context)</option>
                    <option value="change">change (AI context)</option>
                    <option value="improve">improve (AI context)</option>
                    <option value="challenging">challenging (difficulty context)</option>
                    <option value="easy">easy (difficulty context)</option>
                    <option value="meowed">meowed (cat context)</option>
                    <option value="jumped">jumped (cat context)</option>
                    <option value="slept">slept (cat context)</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Choose the actual word that should come next in the sentence</p>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q25-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Weather prediction example</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Cross-Entropy Loss Results</h4>
                    <div id="q25-scenario-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Good Prediction</div>
                </div>
                <div id="q25-output" class="min-h-[200px]"></div>
                <div id="q25-legend" class="mt-3 text-xs text-gray-600"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Loss Analysis</h4>
                <div id="q25-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
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
                    <div class="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
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
                    <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
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
                                <div class="text-2xl font-bold text-purple-600">${Math.pow(2, loss).toFixed(1)}</div>
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
        }
    }
};
