// Question 10: What are embeddings, and how are they initialized in LLMs?
// Created: July 9, 2025
// Educational Focus: Understanding embedding vectors, initialization strategies, and how they evolve during training

const question = {
    title: "10. What are embeddings, and how are they initialized in LLMs?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What are Embeddings?</h4>
            <p class="text-blue-800">Embeddings are dense numerical vectors that represent tokens (words, subwords, or characters) in a continuous mathematical space. Think of them as coordinates that place each word in a multi-dimensional map where similar words are positioned closer together. Each dimension captures different semantic or syntactic properties.</p>
        </div>
        
        <!-- Initialization Strategies Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🎲 Random Initialization</h5>
                <p class="text-sm text-green-700 mb-2">Start with random values and learn everything from scratch during training.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Pros:</strong> No bias, learns task-specific patterns</div>
                    <div><strong>Cons:</strong> Requires more training data and time</div>
                </div>
                <code class="text-xs bg-green-100 px-1 rounded block mt-2">torch.randn(vocab_size, embed_dim)</code>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">📚 Pre-trained Initialization</h5>
                <p class="text-sm text-purple-700 mb-2">Use embeddings from models like Word2Vec, GloVe, or FastText as starting points.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Pros:</strong> Rich semantic knowledge, faster convergence</div>
                    <div><strong>Cons:</strong> May have domain bias, larger memory</div>
                </div>
                <code class="text-xs bg-purple-100 px-1 rounded block mt-2">load_pretrained_embeddings("glove.6B.300d")</code>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">🔧 Hybrid Initialization</h5>
                <p class="text-sm text-orange-700 mb-2">Combine pre-trained embeddings with random initialization for new vocabulary.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Pros:</strong> Best of both worlds, handles new words</div>
                    <div><strong>Cons:</strong> More complex setup, potential inconsistencies</div>
                </div>
                <code class="text-xs bg-orange-100 px-1 rounded block mt-2">merge_embeddings(pretrained, random)</code>
            </div>
        </div>

        <!-- How Embeddings Evolve -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 class="font-semibold text-indigo-900 mb-2">🌱 How Embeddings Evolve During Training</h4>
            <div class="text-sm text-indigo-800 space-y-2">
                <p><strong>Initial State:</strong> Random vectors or pre-trained representations with general knowledge</p>
                <p><strong>Training Process:</strong> Backpropagation adjusts embedding values based on prediction errors</p>
                <p><strong>Final State:</strong> Task-specific representations that capture relevant semantic relationships</p>
                <div class="bg-indigo-100 p-2 rounded mt-2">
                    <strong>Example:</strong> The embedding for "dog" might start neutral but evolve to be closer to "pet", "animal", "loyal" in a pet care application, or closer to "guide", "service", "working" in an assistance context.
                </div>
            </div>
        </div>
        
        <!-- Why This Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Embedding Initialization Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Training Speed:</strong> Good initialization can reduce training time by 30-50%</li>
                <li>• <strong>Final Performance:</strong> Starting point affects the model's ability to capture semantic relationships</li>
                <li>• <strong>Transfer Learning:</strong> Pre-trained embeddings enable knowledge transfer across domains</li>
                <li>• <strong>Data Efficiency:</strong> Better initialization requires less training data for good performance</li>
                <li>• <strong>Convergence:</strong> Proper initialization helps avoid local minima and training instability</li>
            </ul>
        </div>
    </div>`,
    
    interactive: {
        title: "🎯 Interactive Embedding Explorer",
        html: `
            <div class="space-y-6">
                <!-- Input Section -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q10-word-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Enter Words to Explore</label>
                    <input type="text" id="q10-word-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="dog cat animal pet">
                    <p class="text-xs text-gray-600 mt-1">Enter words separated by spaces to see how their embeddings might evolve</p>
                </div>
                
                <!-- Initialization Strategy Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🎲 Choose Initialization Strategy</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q10-strategy" value="random" class="sr-only" checked>
                            <div class="border-2 border-green-200 rounded-lg p-3 hover:bg-green-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-green-700">Random Init</span>
                                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Fresh Start</span>
                                </div>
                                <p class="text-xs text-green-600">Start from scratch with random values</p>
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q10-strategy" value="pretrained" class="sr-only">
                            <div class="border-2 border-purple-200 rounded-lg p-3 hover:bg-purple-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-purple-700">Pre-trained</span>
                                    <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Knowledge Transfer</span>
                                </div>
                                <p class="text-xs text-purple-600">Use existing embeddings (Word2Vec, GloVe)</p>
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q10-strategy" value="hybrid" class="sr-only">
                            <div class="border-2 border-orange-200 rounded-lg p-3 hover:bg-orange-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-orange-700">Hybrid</span>
                                    <span class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Best of Both</span>
                                </div>
                                <p class="text-xs text-orange-600">Combine pre-trained + random</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Training Context -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Training Context</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q10-context" value="general" class="sr-only" checked>
                            <div class="border-2 border-blue-200 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-blue-700">General Language</span>
                                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Broad</span>
                                </div>
                                <p class="text-xs text-blue-600">General purpose language understanding</p>
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q10-context" value="medical" class="sr-only">
                            <div class="border-2 border-red-200 rounded-lg p-3 hover:bg-red-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-red-700">Medical Domain</span>
                                    <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Specialized</span>
                                </div>
                                <p class="text-xs text-red-600">Medical texts and terminology</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Quick Examples -->
                <div class="flex flex-wrap gap-2">
                    <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                    <button id="q10-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "dog cat animal pet"</button>
                </div>
                
                <!-- Results -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">🎨 Embedding Evolution Simulation</h4>
                        <div id="q10-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Random Initialization</div>
                    </div>
                    <div id="q10-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                        <div class="text-gray-500 text-center py-8">Enter words above to see how their embeddings evolve</div>
                    </div>
                    <div id="q10-legend" class="mt-3 text-xs"></div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">📊 Understanding the Evolution</h4>
                    <div id="q10-explanation" class="text-sm text-yellow-800">
                        Choose an initialization strategy above to see how different approaches affect embedding evolution during training.
                    </div>
                </div>
            </div>
        `,
        script: () => {
            // Get DOM elements with error checking
            const input = document.getElementById('q10-word-input');
            const output = document.getElementById('q10-output');
            const strategyRadios = document.querySelectorAll('input[name="q10-strategy"]');
            const contextRadios = document.querySelectorAll('input[name="q10-context"]');
            const exampleBtn = document.getElementById('q10-example-btn');
            const strategyIndicator = document.getElementById('q10-strategy-indicator');
            const legend = document.getElementById('q10-legend');
            const explanation = document.getElementById('q10-explanation');

            if (!input || !output) {
                console.error('Required DOM elements not found for Question 10');
                return;
            }

            // Configuration data for different initialization strategies
            const configData = {
                random: {
                    name: 'Random Initialization',
                    description: 'Start with random vectors, learn everything from training data',
                    color: '#10b981', // Green
                    bgColor: '#ecfdf5',
                    convergenceTime: '100-200 epochs',
                    dataNeeds: 'High'
                },
                pretrained: {
                    name: 'Pre-trained Initialization',
                    description: 'Use existing embeddings (Word2Vec, GloVe) as starting point',
                    color: '#8b5cf6', // Purple
                    bgColor: '#f3e8ff',
                    convergenceTime: '20-50 epochs',
                    dataNeeds: 'Medium'
                },
                hybrid: {
                    name: 'Hybrid Initialization',
                    description: 'Combine pre-trained embeddings with random for new vocabulary',
                    color: '#f59e0b', // Orange
                    bgColor: '#fef3c7',
                    convergenceTime: '30-80 epochs',
                    dataNeeds: 'Medium-Low'
                }
            };

            // Context-specific similarity patterns
            const contextSimilarities = {
                general: {
                    dog: ['animal', 'pet', 'cat', 'mammal'],
                    cat: ['animal', 'pet', 'dog', 'feline'],
                    animal: ['creature', 'being', 'organism', 'life'],
                    pet: ['companion', 'friend', 'animal', 'dog'],
                    king: ['queen', 'royal', 'monarch', 'ruler'],
                    queen: ['king', 'royal', 'monarch', 'ruler'],
                    happy: ['joyful', 'glad', 'content', 'pleased'],
                    sad: ['unhappy', 'depressed', 'sorrowful', 'blue']
                },
                medical: {
                    dog: ['canine', 'animal', 'therapy', 'service'],
                    cat: ['feline', 'animal', 'therapy', 'allergen'],
                    animal: ['specimen', 'model', 'subject', 'organism'],
                    pet: ['therapy', 'companion', 'emotional', 'support'],
                    heart: ['cardiac', 'coronary', 'myocardial', 'valve'],
                    brain: ['neural', 'cerebral', 'cognitive', 'cortex'],
                    pain: ['discomfort', 'ache', 'chronic', 'acute'],
                    medicine: ['drug', 'treatment', 'therapy', 'pharmaceutical']
                }
            };

            // Helper function to get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q10-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'random';
            }

            // Helper function to get current context
            function getCurrentContext() {
                const selectedRadio = document.querySelector('input[name="q10-context"]:checked');
                return selectedRadio ? selectedRadio.value : 'general';
            }

            // Simulate embedding evolution
            function simulateEmbeddingEvolution(words, strategy, context) {
                const results = [];
                const similarities = contextSimilarities[context];
                
                words.forEach((word, index) => {
                    const wordLower = word.toLowerCase();
                    const relatedWords = similarities[wordLower] || ['similar', 'related', 'associated', 'connected'];
                    
                    // Simulate initial values based on strategy
                    let initialSimilarity, finalSimilarity, convergenceSpeed;
                    
                    switch(strategy) {
                        case 'random':
                            initialSimilarity = Math.random() * 0.3; // Low initial similarity
                            finalSimilarity = Math.random() * 0.4 + 0.6; // High final similarity
                            convergenceSpeed = 'Slow';
                            break;
                        case 'pretrained':
                            initialSimilarity = Math.random() * 0.3 + 0.4; // Medium-high initial
                            finalSimilarity = Math.random() * 0.2 + 0.8; // Very high final
                            convergenceSpeed = 'Fast';
                            break;
                        case 'hybrid':
                            initialSimilarity = Math.random() * 0.3 + 0.3; // Medium initial
                            finalSimilarity = Math.random() * 0.25 + 0.75; // High final
                            convergenceSpeed = 'Medium';
                            break;
                    }

                    results.push({
                        word: word,
                        initialSimilarity: initialSimilarity,
                        finalSimilarity: finalSimilarity,
                        convergenceSpeed: convergenceSpeed,
                        relatedWords: relatedWords.slice(0, 3),
                        dimensions: Math.floor(Math.random() * 512) + 256 // 256-768 dimensions
                    });
                });

                return results;
            }

            // Process and display embeddings
            function processAndDisplay() {
                const text = input.value.trim();
                if (!text) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Enter words above to see how their embeddings evolve</div>';
                    return;
                }

                const words = text.split(/\s+/).filter(word => word.length > 0);
                const strategy = getCurrentStrategy();
                const context = getCurrentContext();
                const config = configData[strategy];

                // Clear previous results
                output.innerHTML = '';

                // Update strategy indicator
                if (strategyIndicator) {
                    strategyIndicator.textContent = config.name;
                    strategyIndicator.style.backgroundColor = config.bgColor;
                    strategyIndicator.style.color = config.color;
                }

                // Simulate embedding evolution
                const results = simulateEmbeddingEvolution(words, strategy, context);

                // Create evolution visualization
                const evolutionContainer = document.createElement('div');
                evolutionContainer.className = 'space-y-4';

                results.forEach((result, index) => {
                    const wordContainer = document.createElement('div');
                    wordContainer.className = 'border rounded-lg p-4 hover:shadow-md transition-shadow';
                    wordContainer.style.backgroundColor = config.bgColor;
                    wordContainer.style.borderColor = config.color + '40';

                    const initialPercentage = (result.initialSimilarity * 100).toFixed(1);
                    const finalPercentage = (result.finalSimilarity * 100).toFixed(1);
                    const improvement = (result.finalSimilarity - result.initialSimilarity) * 100;

                    wordContainer.innerHTML = `
                        <div class="flex items-center justify-between mb-3">
                            <h5 class="font-semibold text-lg" style="color: ${config.color}">${result.word}</h5>
                            <span class="text-xs px-2 py-1 rounded" style="background-color: ${config.color}20; color: ${config.color}">
                                ${result.dimensions}D vector
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 mb-3">
                            <div class="text-center p-2 bg-white rounded border">
                                <div class="text-sm text-gray-600">Initial Similarity</div>
                                <div class="text-lg font-bold text-red-600">${initialPercentage}%</div>
                                <div class="text-xs text-gray-500">To related words</div>
                            </div>
                            <div class="text-center p-2 bg-white rounded border">
                                <div class="text-sm text-gray-600">Final Similarity</div>
                                <div class="text-lg font-bold text-green-600">${finalPercentage}%</div>
                                <div class="text-xs text-gray-500">After training</div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="text-sm text-gray-600 mb-1">Training Progress</div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-gradient-to-r from-red-400 to-green-500 h-2 rounded-full transition-all duration-500" 
                                     style="width: ${finalPercentage}%"></div>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">
                                Improvement: +${improvement.toFixed(1)}% | Speed: ${result.convergenceSpeed}
                            </div>
                        </div>

                        <div class="text-sm">
                            <div class="text-gray-600 mb-1">Related words in ${context} context:</div>
                            <div class="flex flex-wrap gap-1">
                                ${result.relatedWords.map(word => 
                                    `<span class="px-2 py-1 text-xs rounded" style="background-color: ${config.color}20; color: ${config.color}">${word}</span>`
                                ).join('')}
                            </div>
                        </div>
                    `;

                    evolutionContainer.appendChild(wordContainer);
                });

                output.appendChild(evolutionContainer);

                // Add statistics summary
                const statsEl = document.createElement('div');
                statsEl.className = 'grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-white rounded border mt-4 text-sm';
                
                const avgInitial = results.reduce((sum, r) => sum + r.initialSimilarity, 0) / results.length;
                const avgFinal = results.reduce((sum, r) => sum + r.finalSimilarity, 0) / results.length;
                const avgImprovement = ((avgFinal - avgInitial) * 100);

                statsEl.innerHTML = `
                    <div class="text-center">
                        <div class="text-lg font-bold" style="color: ${config.color}">${words.length}</div>
                        <div class="text-gray-600 text-xs">Words Analyzed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-blue-600">${config.convergenceTime}</div>
                        <div class="text-gray-600 text-xs">Training Time</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-green-600">${avgImprovement.toFixed(1)}%</div>
                        <div class="text-gray-600 text-xs">Avg Improvement</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-purple-600">${config.dataNeeds}</div>
                        <div class="text-gray-600 text-xs">Data Needs</div>
                    </div>
                `;
                output.appendChild(statsEl);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        <div class="flex items-center justify-center space-x-4 text-xs">
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded" style="background-color: ${config.color}"></div>
                                <span>${config.name}</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-red-400"></div>
                                <span>Initial State</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-green-500"></div>
                                <span>After Training</span>
                            </div>
                        </div>
                    `;
                }

                // Update explanation
                updateExplanation(strategy, context);
            }

            // Update strategy visuals
            function updateStrategyVisuals() {
                const selectedStrategy = document.querySelector('input[name="q10-strategy"]:checked');
                const selectedContext = document.querySelector('input[name="q10-context"]:checked');
                
                if (!selectedStrategy || !selectedContext) return;

                // Update radio button containers for strategy
                document.querySelectorAll('input[name="q10-strategy"]').forEach((radio) => {
                    const container = radio.closest('label').querySelector('div');
                    if (radio.checked) {
                        container.style.borderColor = configData[radio.value].color;
                        container.style.backgroundColor = configData[radio.value].bgColor;
                    } else {
                        container.style.borderColor = '';
                        container.style.backgroundColor = '';
                    }
                });

                // Update radio button containers for context
                document.querySelectorAll('input[name="q10-context"]').forEach((radio) => {
                    const container = radio.closest('label').querySelector('div');
                    if (radio.checked) {
                        container.style.borderColor = radio.value === 'general' ? '#3b82f6' : '#ef4444';
                        container.style.backgroundColor = radio.value === 'general' ? '#eff6ff' : '#fef2f2';
                    } else {
                        container.style.borderColor = '';
                        container.style.backgroundColor = '';
                    }
                });
            }

            // Update educational explanation
            function updateExplanation(strategy, context) {
                if (!explanation) return;
                
                const config = configData[strategy];
                const contextName = context === 'general' ? 'General Language' : 'Medical Domain';
                
                const explanations = {
                    'random': `
                        <strong>Random Initialization</strong> starts embeddings with random values from a normal distribution.
                        <br>• <strong>Training Process:</strong> The model learns word relationships entirely from your training data
                        <br>• <strong>Advantage:</strong> No pre-existing bias, can discover domain-specific patterns
                        <br>• <strong>Challenge:</strong> Requires substantial training data and longer convergence time
                        <br>• <strong>Best for:</strong> Specialized domains, novel languages, or when you have abundant training data
                    `,
                    'pretrained': `
                        <strong>Pre-trained Initialization</strong> uses embeddings trained on large corpora (Wikipedia, Common Crawl).
                        <br>• <strong>Knowledge Transfer:</strong> Starts with rich semantic understanding from general language
                        <br>• <strong>Advantage:</strong> Faster convergence, better performance with limited data
                        <br>• <strong>Challenge:</strong> May carry biases from original training data
                        <br>• <strong>Best for:</strong> General applications, limited training data, transfer learning scenarios
                    `,
                    'hybrid': `
                        <strong>Hybrid Initialization</strong> combines pre-trained embeddings for known words with random initialization for new vocabulary.
                        <br>• <strong>Balanced Approach:</strong> Leverages existing knowledge while allowing new learning
                        <br>• <strong>Advantage:</strong> Handles both common and domain-specific vocabulary effectively
                        <br>• <strong>Challenge:</strong> Requires careful alignment between pre-trained and random embeddings
                        <br>• <strong>Best for:</strong> Domain adaptation, extending vocabulary, production systems
                    `
                };
                
                explanation.innerHTML = `
                    ${explanations[strategy]}
                    <br><br>
                    <strong>Context Impact (${contextName}):</strong> ${context === 'general' ? 
                        'Words develop broad semantic relationships useful for general language understanding.' : 
                        'Words evolve specialized meanings relevant to medical terminology and relationships.'
                    }
                `;
            }

            // Example cycling functionality
            const examples = [
                { 
                    words: 'dog cat animal pet', 
                    strategy: 'random', 
                    context: 'general',
                    note: 'Basic animal words with random initialization' 
                },
                { 
                    words: 'heart brain medicine doctor', 
                    strategy: 'pretrained', 
                    context: 'medical',
                    note: 'Medical terms with pre-trained embeddings' 
                },
                { 
                    words: 'king queen royal monarch', 
                    strategy: 'hybrid', 
                    context: 'general',
                    note: 'Hierarchical concepts with hybrid approach' 
                },
                { 
                    words: 'happy sad joyful depressed', 
                    strategy: 'pretrained', 
                    context: 'general',
                    note: 'Emotional words demonstrating semantic similarity' 
                },
                { 
                    words: 'therapy treatment diagnosis prescription', 
                    strategy: 'hybrid', 
                    context: 'medical',
                    note: 'Medical procedures with mixed initialization' 
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    input.value = example.words;
                    document.querySelector(`input[name="q10-strategy"][value="${example.strategy}"]`).checked = true;
                    document.querySelector(`input[name="q10-context"][value="${example.context}"]`).checked = true;
                    updateStrategyVisuals();
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    exampleBtn.innerHTML = `Try: "${nextExample.words}"`;
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

            contextRadios.forEach(radio => {
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

// Export the question
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
}
