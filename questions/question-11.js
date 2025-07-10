// Question 11: Next Sentence Prediction in LLMs
// Created: July 10, 2025
// Educational Focus: Understanding NSP training and its impact on language understanding

const question = {
    title: "11. What is next sentence prediction, and how does it enhance LLMs?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔗 What is Next Sentence Prediction?</h4>
            <p class="text-blue-800">Next Sentence Prediction (NSP) is a pretraining task that teaches language models to understand whether two sentences naturally follow each other. Think of it like teaching a student to recognize if two paragraphs from a book belong together or were randomly shuffled - this helps the model learn document structure and coherence patterns.</p>
        </div>
        
        <!-- NSP Training Process Grid -->
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">✅ Positive Pairs (50%)</h5>
                <p class="text-sm text-green-700 mb-2">Sequential sentences that naturally follow each other from the same document.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Example:</strong> "The cat sat on the mat. It was a sunny afternoon."</div>
                    <div><strong>Label:</strong> <code class="bg-green-100 px-1 rounded">IsNext</code></div>
                </div>
            </div>
            
            <div class="bg-red-50 p-3 rounded border-l-4 border-red-400">
                <h5 class="font-medium text-red-900 mb-2">❌ Negative Pairs (50%)</h5>
                <p class="text-sm text-red-700 mb-2">Random sentences from different documents that don't naturally connect.</p>
                <div class="text-xs space-y-1">
                    <div><strong>Example:</strong> "The cat sat on the mat. Quantum computing uses qubits."</div>
                    <div><strong>Label:</strong> <code class="bg-red-100 px-1 rounded">NotNext</code></div>
                </div>
            </div>
        </div>
        
        <!-- Applications Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">💬 Dialogue Systems</h5>
                <p class="text-sm text-purple-700 mb-2">Understanding conversation flow and context continuity.</p>
                <code class="text-xs bg-purple-100 px-1 rounded block mt-2">User: "How's the weather?" → Bot: "It's sunny today!"</code>
            </div>
            
            <div class="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                <h5 class="font-medium text-indigo-900 mb-2">📄 Document Summarization</h5>
                <p class="text-sm text-indigo-700 mb-2">Identifying key relationships between sentences for coherent summaries.</p>
                <code class="text-xs bg-indigo-100 px-1 rounded block mt-2">Para 1 + Para 2 → Coherent Summary</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">🔍 Reading Comprehension</h5>
                <p class="text-sm text-orange-700 mb-2">Better understanding of text structure and logical flow.</p>
                <code class="text-xs bg-orange-100 px-1 rounded block mt-2">Question + Context → Coherent Answer</code>
            </div>
        </div>
        
        <!-- How NSP Works -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 class="font-semibold text-indigo-900 mb-2">🧠 How NSP Training Works</h4>
            <div class="text-sm text-indigo-800 space-y-2">
                <p><strong>Data Preparation:</strong> Extract consecutive sentence pairs from documents, then create 50% positive (sequential) and 50% negative (random) pairs</p>
                <p><strong>Model Input:</strong> [CLS] Sentence A [SEP] Sentence B [SEP] → Binary classification head</p>
                <p><strong>Training Objective:</strong> Learn to predict whether Sentence B naturally follows Sentence A</p>
                <div class="bg-indigo-100 p-2 rounded mt-2">
                    <strong>Example:</strong> BERT uses NSP alongside Masked Language Modeling (MLM) to learn both token-level and sentence-level understanding simultaneously.
                </div>
            </div>
        </div>
        
        <!-- Why This Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why NSP Enhances LLMs</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Coherence Understanding:</strong> Models learn to maintain logical flow in generated text</li>
                <li>• <strong>Document Structure:</strong> Better grasp of how sentences relate within longer contexts</li>
                <li>• <strong>Contextual Reasoning:</strong> Improved ability to understand implicit relationships between ideas</li>
                <li>• <strong>Task Transfer:</strong> NSP knowledge transfers to downstream tasks requiring sentence-level understanding</li>
                <li>• <strong>Conversation Flow:</strong> Enhanced performance in dialogue systems and conversational AI</li>
            </ul>
        </div>
    </div>`,
    
    interactive: {
        title: "🔗 Interactive Next Sentence Prediction Explorer",
        html: `
            <div class="space-y-6">
                <!-- Input Section -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q11-sentence-a" class="block text-sm font-medium text-gray-700 mb-2">📝 First Sentence (Sentence A)</label>
                    <input type="text" id="q11-sentence-a" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3" value="The scientist discovered a new species of butterfly in the Amazon rainforest.">
                    
                    <label for="q11-sentence-b" class="block text-sm font-medium text-gray-700 mb-2">📝 Second Sentence (Sentence B)</label>
                    <input type="text" id="q11-sentence-b" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="The colorful wings displayed intricate patterns never seen before.">
                    
                    <p class="text-xs text-gray-600 mt-2">Try different sentence pairs to see how NSP models would classify them!</p>
                </div>
                
                <!-- Model Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🤖 Choose NSP Model Type</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q11-model" value="strict" class="sr-only" checked>
                            <div class="border-2 border-red-200 rounded-lg p-3 hover:bg-red-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-red-700">Strict Model</span>
                                    <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Conservative</span>
                                </div>
                                <p class="text-xs text-red-600">Requires strong semantic connection</p>
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q11-model" value="balanced" class="sr-only">
                            <div class="border-2 border-blue-200 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-blue-700">Balanced Model</span>
                                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Moderate</span>
                                </div>
                                <p class="text-xs text-blue-600">Considers both semantic and contextual cues</p>
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="q11-model" value="lenient" class="sr-only">
                            <div class="border-2 border-green-200 rounded-lg p-3 hover:bg-green-50 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-green-700">Lenient Model</span>
                                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Flexible</span>
                                </div>
                                <p class="text-xs text-green-600">Accepts loose thematic connections</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Quick Examples -->
                <div class="flex flex-wrap gap-2">
                    <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                    <button id="q11-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "Coherent Pair"</button>
                </div>
                
                <!-- Results -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">🎯 NSP Classification Results</h4>
                        <div id="q11-model-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Strict Model</div>
                    </div>
                    <div id="q11-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                        <div class="text-gray-500 text-center py-8">Enter sentence pairs above to see NSP classification</div>
                    </div>
                    <div id="q11-legend" class="mt-3 text-xs"></div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">📊 Understanding the Classification</h4>
                    <div id="q11-explanation" class="text-sm text-yellow-800">
                        Choose a model type above to see how different NSP models classify sentence pairs.
                    </div>
                </div>
            </div>
        `,
        script: () => {
            // Get DOM elements with error checking
            const sentenceA = document.getElementById('q11-sentence-a');
            const sentenceB = document.getElementById('q11-sentence-b');
            const output = document.getElementById('q11-output');
            const modelRadios = document.querySelectorAll('input[name="q11-model"]');
            const exampleBtn = document.getElementById('q11-example-btn');
            const modelIndicator = document.getElementById('q11-model-indicator');
            const legend = document.getElementById('q11-legend');
            const explanation = document.getElementById('q11-explanation');

            if (!sentenceA || !sentenceB || !output) {
                console.error('Required DOM elements not found for Question 11');
                return;
            }

            // Configuration data for different model types
            const configData = {
                strict: {
                    name: 'Strict NSP Model',
                    description: 'Requires strong semantic and contextual connection',
                    threshold: 0.8,
                    color: '#dc2626',
                    bgColor: '#fef2f2'
                },
                balanced: {
                    name: 'Balanced NSP Model',
                    description: 'Considers both semantic meaning and contextual flow',
                    threshold: 0.6,
                    color: '#2563eb',
                    bgColor: '#eff6ff'
                },
                lenient: {
                    name: 'Lenient NSP Model',
                    description: 'Accepts loose thematic or topical connections',
                    threshold: 0.4,
                    color: '#059669',
                    bgColor: '#ecfdf5'
                }
            };

            // Predefined sentence pairs for analysis
            const sentenceFeatures = {
                // Keywords that indicate connection
                timeWords: ['then', 'next', 'after', 'later', 'meanwhile', 'subsequently', 'following', 'during'],
                pronouns: ['it', 'they', 'he', 'she', 'this', 'that', 'these', 'those'],
                connectives: ['however', 'therefore', 'moreover', 'furthermore', 'consequently', 'thus', 'hence'],
                
                // Topic domains for semantic similarity
                domains: {
                    science: ['scientist', 'research', 'experiment', 'discovery', 'study', 'analysis', 'hypothesis', 'theory'],
                    nature: ['forest', 'tree', 'animal', 'plant', 'environment', 'wildlife', 'ecosystem', 'species'],
                    technology: ['computer', 'software', 'digital', 'algorithm', 'data', 'programming', 'artificial'],
                    business: ['company', 'market', 'profit', 'customer', 'product', 'service', 'revenue', 'investment'],
                    education: ['student', 'teacher', 'school', 'university', 'learn', 'study', 'knowledge', 'course'],
                    food: ['restaurant', 'cook', 'recipe', 'ingredient', 'taste', 'flavor', 'kitchen', 'meal'],
                    sports: ['team', 'player', 'game', 'score', 'competition', 'athletic', 'training', 'championship'],
                    health: ['doctor', 'patient', 'medical', 'treatment', 'medicine', 'hospital', 'health', 'disease']
                }
            };

            // Helper function to get current model
            function getCurrentModel() {
                const selectedRadio = document.querySelector('input[name="q11-model"]:checked');
                return selectedRadio ? selectedRadio.value : 'strict';
            }

            // Calculate semantic similarity between sentences
            function calculateSemanticSimilarity(sent1, sent2) {
                const words1 = sent1.toLowerCase().split(/\s+/);
                const words2 = sent2.toLowerCase().split(/\s+/);
                
                // Direct word overlap
                const overlap = words1.filter(word => words2.includes(word)).length;
                const overlapScore = overlap / Math.max(words1.length, words2.length);
                
                // Domain similarity
                let domainScore = 0;
                for (const [domain, keywords] of Object.entries(sentenceFeatures.domains)) {
                    const domain1 = keywords.filter(keyword => words1.includes(keyword)).length;
                    const domain2 = keywords.filter(keyword => words2.includes(keyword)).length;
                    if (domain1 > 0 && domain2 > 0) {
                        domainScore = Math.max(domainScore, 0.3);
                    }
                }
                
                return Math.min(1.0, overlapScore * 0.7 + domainScore);
            }

            // Calculate contextual flow score
            function calculateContextualFlow(sent1, sent2) {
                const words2 = sent2.toLowerCase().split(/\s+/);
                let flowScore = 0;
                
                // Check for pronouns (indicating reference to previous sentence)
                const pronounScore = sentenceFeatures.pronouns.filter(pronoun => 
                    words2.includes(pronoun)).length > 0 ? 0.3 : 0;
                
                // Check for time connectives
                const timeScore = sentenceFeatures.timeWords.filter(word => 
                    words2.includes(word)).length > 0 ? 0.2 : 0;
                
                // Check for logical connectives
                const connScore = sentenceFeatures.connectives.filter(conn => 
                    words2.includes(conn)).length > 0 ? 0.25 : 0;
                
                // Check sentence length compatibility (very short or very long second sentences are suspicious)
                const lengthRatio = words2.length / sent1.split(/\s+/).length;
                const lengthScore = (lengthRatio > 0.3 && lengthRatio < 3) ? 0.1 : 0;
                
                return Math.min(1.0, pronounScore + timeScore + connScore + lengthScore);
            }

            // Simulate NSP classification
            function classifyNSP(sentA, sentB, modelType) {
                const semanticSim = calculateSemanticSimilarity(sentA, sentB);
                const contextualFlow = calculateContextualFlow(sentA, sentB);
                
                // Weighted combination based on model type
                let combinedScore;
                switch(modelType) {
                    case 'strict':
                        combinedScore = semanticSim * 0.6 + contextualFlow * 0.4;
                        break;
                    case 'balanced':
                        combinedScore = semanticSim * 0.5 + contextualFlow * 0.5;
                        break;
                    case 'lenient':
                        combinedScore = semanticSim * 0.4 + contextualFlow * 0.6;
                        break;
                    default:
                        combinedScore = semanticSim * 0.5 + contextualFlow * 0.5;
                }
                
                // Add some randomness to make it more realistic
                const randomFactor = (Math.random() - 0.5) * 0.1;
                combinedScore = Math.max(0, Math.min(1, combinedScore + randomFactor));
                
                return {
                    score: combinedScore,
                    semanticSimilarity: semanticSim,
                    contextualFlow: contextualFlow,
                    isNext: combinedScore >= configData[modelType].threshold
                };
            }

            // Process and display results
            function processAndDisplay() {
                const textA = sentenceA.value.trim();
                const textB = sentenceB.value.trim();
                
                if (!textA || !textB) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Enter both sentences to see NSP classification</div>';
                    return;
                }

                const modelType = getCurrentModel();
                const config = configData[modelType];
                
                // Clear previous results
                output.innerHTML = '';

                // Update model indicator
                if (modelIndicator) {
                    modelIndicator.textContent = config.name;
                    modelIndicator.style.backgroundColor = config.bgColor;
                    modelIndicator.style.color = config.color;
                }

                // Classify the sentence pair
                const result = classifyNSP(textA, textB, modelType);

                // Create result visualization
                const resultContainer = document.createElement('div');
                resultContainer.className = 'space-y-4';

                // Classification result
                const classificationEl = document.createElement('div');
                classificationEl.className = 'text-center p-4 rounded-lg border-2';
                classificationEl.style.backgroundColor = result.isNext ? '#ecfdf5' : '#fef2f2';
                classificationEl.style.borderColor = result.isNext ? '#10b981' : '#ef4444';

                classificationEl.innerHTML = `
                    <div class="text-2xl font-bold mb-2" style="color: ${result.isNext ? '#059669' : '#dc2626'}">
                        ${result.isNext ? '✅ IsNext' : '❌ NotNext'}
                    </div>
                    <div class="text-sm text-gray-600">
                        Confidence: ${(result.score * 100).toFixed(1)}%
                        (Threshold: ${(config.threshold * 100).toFixed(0)}%)
                    </div>
                `;

                resultContainer.appendChild(classificationEl);

                // Sentence pair display
                const sentencePairEl = document.createElement('div');
                sentencePairEl.className = 'space-y-3';
                sentencePairEl.innerHTML = `
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <div class="text-xs font-medium text-blue-700 mb-1">Sentence A</div>
                        <div class="text-sm text-blue-900">"${textA}"</div>
                    </div>
                    <div class="text-center text-gray-400">
                        <div class="text-xs">Does B follow A?</div>
                        <div class="text-lg">↓</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <div class="text-xs font-medium text-purple-700 mb-1">Sentence B</div>
                        <div class="text-sm text-purple-900">"${textB}"</div>
                    </div>
                `;

                resultContainer.appendChild(sentencePairEl);

                // Analysis breakdown
                const analysisEl = document.createElement('div');
                analysisEl.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
                
                analysisEl.innerHTML = `
                    <div class="bg-white p-3 rounded border">
                        <div class="text-sm font-medium text-gray-700 mb-2">🔍 Semantic Similarity</div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${result.semanticSimilarity * 100}%"></div>
                        </div>
                        <div class="text-xs text-gray-600">${(result.semanticSimilarity * 100).toFixed(1)}% - Word overlap and topic similarity</div>
                    </div>
                    <div class="bg-white p-3 rounded border">
                        <div class="text-sm font-medium text-gray-700 mb-2">🔗 Contextual Flow</div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div class="bg-green-500 h-2 rounded-full" style="width: ${result.contextualFlow * 100}%"></div>
                        </div>
                        <div class="text-xs text-gray-600">${(result.contextualFlow * 100).toFixed(1)}% - Pronouns, connectives, and structure</div>
                    </div>
                `;

                resultContainer.appendChild(analysisEl);

                // Model explanation
                const modelExplanationEl = document.createElement('div');
                modelExplanationEl.className = 'bg-gray-50 p-3 rounded border text-sm';
                modelExplanationEl.innerHTML = `
                    <div class="font-medium text-gray-700 mb-1">Model Analysis (${config.name})</div>
                    <div class="text-gray-600">
                        This model uses a ${config.threshold >= 0.8 ? 'high' : config.threshold >= 0.6 ? 'moderate' : 'low'} threshold 
                        (${(config.threshold * 100).toFixed(0)}%) and weighs 
                        ${modelType === 'strict' ? 'semantic similarity more heavily' : 
                          modelType === 'balanced' ? 'both factors equally' : 
                          'contextual flow more heavily'}.
                    </div>
                `;

                resultContainer.appendChild(modelExplanationEl);

                output.appendChild(resultContainer);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        <div class="flex items-center justify-center space-x-4 text-xs">
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-green-500"></div>
                                <span>IsNext (Sequential)</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-red-500"></div>
                                <span>NotNext (Random)</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-blue-500"></div>
                                <span>Semantic</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-purple-500"></div>
                                <span>Contextual</span>
                            </div>
                        </div>
                    `;
                }

                // Update explanation
                updateExplanation(modelType, result);
            }

            // Update visual indicators
            function updateModelVisuals() {
                document.querySelectorAll('input[name="q11-model"]').forEach((radio) => {
                    const container = radio.closest('label').querySelector('div');
                    if (radio.checked) {
                        container.style.borderColor = configData[radio.value].color;
                        container.style.backgroundColor = configData[radio.value].bgColor;
                    } else {
                        container.style.borderColor = '';
                        container.style.backgroundColor = '';
                    }
                });
            }

            // Update educational explanation
            function updateExplanation(modelType, result = null) {
                if (!explanation) return;
                
                const config = configData[modelType];
                
                const explanations = {
                    strict: `
                        <strong>Strict NSP Model</strong> requires strong evidence of sequential relationship.
                        <br>• <strong>High Threshold:</strong> Only accepts pairs with clear semantic and contextual connections
                        <br>• <strong>Conservative:</strong> Minimizes false positives but may miss subtle connections
                        <br>• <strong>Best for:</strong> High-precision tasks like document coherence checking
                        <br>• <strong>Used in:</strong> Academic writing analysis, formal document processing
                    `,
                    balanced: `
                        <strong>Balanced NSP Model</strong> weighs both semantic similarity and contextual flow equally.
                        <br>• <strong>Moderate Threshold:</strong> Balances precision and recall effectively
                        <br>• <strong>Versatile:</strong> Good general-purpose performance across various text types
                        <br>• <strong>Best for:</strong> Most downstream NLP tasks and general text understanding
                        <br>• <strong>Used in:</strong> BERT-style models, general language understanding
                    `,
                    lenient: `
                        <strong>Lenient NSP Model</strong> accepts loose thematic connections between sentences.
                        <br>• <strong>Low Threshold:</strong> Captures subtle relationships and topical continuity
                        <br>• <strong>Flexible:</strong> Better recall but may include some false positives
                        <br>• <strong>Best for:</strong> Creative writing, conversational AI, brainstorming
                        <br>• <strong>Used in:</strong> Dialogue systems, creative text generation
                    `
                };
                
                let explanationText = explanations[modelType];
                
                if (result) {
                    explanationText += `<br><br><strong>Current Result:</strong> `;
                    if (result.isNext) {
                        explanationText += `The model detected sufficient connection (${(result.score * 100).toFixed(1)}% confidence) based on `;
                        if (result.semanticSimilarity > 0.5) explanationText += `semantic similarity `;
                        if (result.contextualFlow > 0.3) explanationText += `and contextual flow indicators.`;
                    } else {
                        explanationText += `The model found insufficient connection (${(result.score * 100).toFixed(1)}% confidence) due to `;
                        if (result.semanticSimilarity < 0.3) explanationText += `low semantic similarity `;
                        if (result.contextualFlow < 0.2) explanationText += `and weak contextual flow.`;
                    }
                }
                
                explanation.innerHTML = explanationText;
            }

            // Example cycling functionality
            const examples = [
                { 
                    a: "The scientist discovered a new species of butterfly in the Amazon rainforest.", 
                    b: "The colorful wings displayed intricate patterns never seen before.", 
                    model: 'balanced',
                    note: 'Coherent pair with clear semantic connection'
                },
                { 
                    a: "The company announced record profits last quarter.", 
                    b: "Quantum computing will revolutionize artificial intelligence.", 
                    model: 'strict',
                    note: 'Random pair with no logical connection'
                },
                { 
                    a: "She walked into the restaurant and looked around.", 
                    b: "The waiter approached with a friendly smile.", 
                    model: 'lenient',
                    note: 'Sequential narrative with contextual flow'
                },
                { 
                    a: "The weather forecast predicts rain tomorrow.", 
                    b: "Therefore, we should bring umbrellas to the picnic.", 
                    model: 'balanced',
                    note: 'Logical consequence with connective word'
                },
                { 
                    a: "Machine learning algorithms process vast amounts of data.", 
                    b: "My favorite pizza topping is pepperoni.", 
                    model: 'strict',
                    note: 'Completely unrelated topics'
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    
                    sentenceA.value = example.a;
                    sentenceB.value = example.b;
                    document.querySelector(`input[name="q11-model"][value="${example.model}"]`).checked = true;
                    
                    updateModelVisuals();
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    const nextType = nextExample.note.includes('Random') || nextExample.note.includes('unrelated') ? 'Random Pair' : 'Coherent Pair';
                    exampleBtn.innerHTML = `Try: "${nextType}"`;
                    exampleBtn.title = nextExample.note;
                });
            }

            // Event listeners
            sentenceA.addEventListener('input', processAndDisplay);
            sentenceB.addEventListener('input', processAndDisplay);
            
            modelRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateModelVisuals();
                    processAndDisplay();
                });
            });

            // Initial setup
            updateModelVisuals();
            processAndDisplay();
        }
    }
};

// Export the question
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
}
