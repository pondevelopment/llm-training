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
        
        <!-- Caveats & Modern Practice -->
        <div class="bg-white p-4 rounded-lg border">
            <h4 class="font-semibold text-gray-900 mb-2">⚠️ Caveats and modern practice</h4>
            <ul class="text-sm text-gray-700 space-y-1">
                <li>• While NSP was used in BERT pretraining, follow-ups like <strong>RoBERTa</strong> removed NSP and matched or improved results.</li>
                <li>• <strong>ALBERT</strong> introduced <em>Sentence Order Prediction (SOP)</em>, using swapped segments as harder negatives instead of random pairs.</li>
                <li>• Many decoder-only LLMs (GPT-style) don’t use NSP; they learn discourse coherence from next-token prediction over long contexts.</li>
                <li>• Include NSP/SOP only if it helps your data/task: validate via downstream tasks that require sentence-level coherence.</li>
            </ul>
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
                    <select id="q11-sentence-a" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3">
                        <option value="0">The scientist discovered a new species of butterfly in the Amazon rainforest.</option>
                        <option value="1">The company announced record profits for the third quarter.</option>
                        <option value="2">She walked into the busy restaurant and looked around.</option>
                        <option value="3">The weather forecast predicted heavy rain for tomorrow.</option>
                    </select>
                    
                    <label for="q11-sentence-b" class="block text-sm font-medium text-gray-700 mb-2">📝 Second Sentence (Sentence B)</label>
                    <select id="q11-sentence-b" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="0">The colorful wings displayed intricate patterns never seen before.</option>
                        <option value="1">Machine learning algorithms require vast amounts of training data.</option>
                        <option value="2">The waiter approached their table with a friendly smile.</option>
                        <option value="3">Therefore, we decided to bring umbrellas to the picnic.</option>
                    </select>
                    
                    <p class="text-xs text-gray-600 mt-2">Select sentence pairs to see how NSP models classify their relationship!</p>
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
                    <p class="mt-3 text-xs text-gray-600">
                        Tip: Models apply different confidence thresholds to decide IsNext vs NotNext — Strict 80%, Balanced 60%, Lenient 40%. The result compares the model’s confidence to its threshold.
                    </p>
                </div>

                <!-- Quick Examples -->
                <div class="flex flex-wrap gap-2">
                    <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                    <button id="q11-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "Perfect Coherent"</button>
                    <div class="text-xs text-gray-500 ml-2">Click to cycle through different sentence combinations</div>
                </div>
                
                <!-- Results -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">🎯 NSP Classification Results</h4>
                        <div id="q11-model-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium" aria-live="polite">Strict Model</div>
                    </div>
                    <div id="q11-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300" role="region" aria-live="polite" aria-atomic="true" aria-label="NSP classification results">
                        <div class="text-gray-500 text-center py-8">Enter sentence pairs above to see NSP classification</div>
                    </div>
                    <div id="q11-legend" class="mt-3 text-xs"></div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">📊 Understanding the Classification</h4>
                    <div id="q11-explanation" class="text-sm text-yellow-800" aria-live="polite" aria-atomic="true">
                        Choose a model type above to see how different NSP models classify sentence pairs.
                    </div>
                </div>
            </div>
        `,
        script: () => {
            // Predefined sentences for the dropdowns
            const sentences = {
                A: [
                    "The scientist discovered a new species of butterfly in the Amazon rainforest.",
                    "The company announced record profits for the third quarter.",
                    "She walked into the busy restaurant and looked around.",
                    "The weather forecast predicted heavy rain for tomorrow."
                ],
                B: [
                    "The colorful wings displayed intricate patterns never seen before.",
                    "Machine learning algorithms require vast amounts of training data.",
                    "The waiter approached their table with a friendly smile.",
                    "Therefore, we decided to bring umbrellas to the picnic."
                ]
            };

            // Base coherence scores for all combinations (A_index, B_index)
            // One score per pair; model-specific thresholds decide IsNext vs NotNext
            const basePairConfidence = {
                // Sentence A0 (butterfly discovery)
                "0,0": 85,  // Strong coherent
                "0,1": 15,  // Unrelated (nature vs ML)
                "0,2": 25,  // Unrelated (nature vs restaurant)
                "0,3": 10,  // Unrelated (nature vs weather decision)

                // Sentence A1 (company profits)
                "1,0": 20,  // Unrelated (business vs nature)
                "1,1": 55,  // Weak thematic (business/tech) — borderline
                "1,2": 45,  // Weak thematic (business/service) — borderline
                "1,3": 10,  // Unrelated (business vs weather decision)

                // Sentence A2 (restaurant)
                "2,0": 15,  // Unrelated (restaurant vs nature)
                "2,1": 20,  // Unrelated (restaurant vs ML)
                "2,2": 90,  // Strong narrative flow
                "2,3": 10,  // Unrelated (restaurant vs weather decision)

                // Sentence A3 (weather forecast)
                "3,0": 15,  // Unrelated (weather vs nature details)
                "3,1": 20,  // Unrelated (weather vs ML)
                "3,2": 25,  // Unrelated (weather vs restaurant service)
                "3,3": 95   // Strong logical connection
            };

            // Configuration data for different model types
            const configData = {
                strict: {
                    name: 'Strict NSP Model',
                    description: 'Requires strong semantic and contextual connection',
                    threshold: 80,
                    color: '#dc2626',
                    bgColor: '#fef2f2'
                },
                balanced: {
                    name: 'Balanced NSP Model',
                    description: 'Considers both semantic meaning and contextual flow',
                    threshold: 60,
                    color: '#2563eb',
                    bgColor: '#eff6ff'
                },
                lenient: {
                    name: 'Lenient NSP Model',
                    description: 'Accepts loose thematic or topical connections',
                    threshold: 40,
                    color: '#059669',
                    bgColor: '#ecfdf5'
                }
            };

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

            // Helper function to get current model
            function getCurrentModel() {
                const selectedRadio = document.querySelector('input[name="q11-model"]:checked');
                return selectedRadio ? selectedRadio.value : 'strict';
            }

            // Get the selected sentence texts
            function getSelectedSentences() {
                const aIndex = sentenceA.selectedIndex;
                const bIndex = sentenceB.selectedIndex;
                return {
                    textA: sentences.A[aIndex],
                    textB: sentences.B[bIndex],
                    indexA: aIndex,
                    indexB: bIndex,
                    key: `${aIndex},${bIndex}`
                };
            }

            // Get classification result for the selected combination
            function getClassificationResult(modelType, key) {
                const score = basePairConfidence[key];
                const config = configData[modelType] || configData['balanced'];
                if (typeof score !== 'number') {
                    // Safe fallback if a new option is added without mapping
                    return { isNext: false, confidence: 50, score: 0.5 };
                }
                const isNext = score >= config.threshold;
                return { isNext, confidence: score, score: score / 100 };
            }

            // Compute comparison across all models for a given pair
            function getAllModelComparisons(key) {
                const score = basePairConfidence[key];
                const models = ['strict', 'balanced', 'lenient'];
                return models.map((m) => {
                    const cfg = configData[m];
                    const isNext = typeof score === 'number' && score >= cfg.threshold;
                    return {
                        model: m,
                        name: cfg.name.replace(' NSP Model', ''),
                        threshold: cfg.threshold,
                        color: cfg.color,
                        bgColor: cfg.bgColor,
                        isNext,
                        confidence: typeof score === 'number' ? score : 50
                    };
                });
            }

            // Calculate detailed analysis for display
            function analyzeConnection(textA, textB, indexA, indexB) {
                // Provide detailed reasoning for each combination
                const analysisMap = {
                    "0,0": {
                        semantic: 85,
                        contextual: 75,
                        reasoning: "Strong semantic connection: both sentences discuss the same butterfly discovery. 'Colorful wings' directly refers to the butterfly mentioned in the first sentence."
                    },
                    "0,1": {
                        semantic: 15,
                        contextual: 10,
                        reasoning: "No connection: butterfly discovery and machine learning are completely unrelated topics from different domains."
                    },
                    "0,2": {
                        semantic: 20,
                        contextual: 15,
                        reasoning: "No logical connection: butterfly discovery in a rainforest has no relationship to a restaurant waiter."
                    },
                    "0,3": {
                        semantic: 10,
                        contextual: 5,
                        reasoning: "No connection: butterfly discovery doesn't lead to weather-related decisions about umbrellas."
                    },
                    "1,0": {
                        semantic: 15,
                        contextual: 10,
                        reasoning: "No connection: company profits and butterfly wings are unrelated business vs. nature topics."
                    },
                    "1,1": {
                        semantic: 45,
                        contextual: 20,
                        reasoning: "Weak thematic connection: both relate to technology/business domains, but no direct logical relationship."
                    },
                    "1,2": {
                        semantic: 25,
                        contextual: 15,
                        reasoning: "Weak connection: both involve service/business contexts but no direct relationship between profits and restaurant service."
                    },
                    "1,3": {
                        semantic: 10,
                        contextual: 5,
                        reasoning: "No connection: company profits don't logically lead to weather-related decisions."
                    },
                    "2,0": {
                        semantic: 15,
                        contextual: 10,
                        reasoning: "No connection: restaurant setting and butterfly wings are unrelated contexts."
                    },
                    "2,1": {
                        semantic: 20,
                        contextual: 15,
                        reasoning: "No connection: restaurant setting has no relationship to machine learning algorithms."
                    },
                    "2,2": {
                        semantic: 80,
                        contextual: 90,
                        reasoning: "Strong connection: perfect narrative flow. 'The waiter approached their table' naturally follows someone entering a restaurant."
                    },
                    "2,3": {
                        semantic: 10,
                        contextual: 5,
                        reasoning: "No connection: restaurant scene doesn't lead to weather-related decisions about umbrellas."
                    },
                    "3,0": {
                        semantic: 15,
                        contextual: 10,
                        reasoning: "No connection: weather forecast and butterfly wings are unrelated topics."
                    },
                    "3,1": {
                        semantic: 20,
                        contextual: 15,
                        reasoning: "No connection: weather prediction has no relationship to machine learning algorithms."
                    },
                    "3,2": {
                        semantic: 25,
                        contextual: 20,
                        reasoning: "No connection: weather forecast doesn't logically lead to restaurant service interactions."
                    },
                    "3,3": {
                        semantic: 70,
                        contextual: 95,
                        reasoning: "Perfect logical connection: 'Therefore' explicitly connects rain forecast to the logical decision to bring umbrellas."
                    }
                };

                const key = `${indexA},${indexB}`;
                return analysisMap[key] || { semantic: 20, contextual: 15, reasoning: "Analysis not available for this combination." };
            }

            // Process and display results
            function processAndDisplay() {
                const selection = getSelectedSentences();
                const modelType = getCurrentModel();
                const config = configData[modelType];
                
                // Update model indicator
                if (modelIndicator) {
                    modelIndicator.textContent = config.name;
                    modelIndicator.style.backgroundColor = config.bgColor;
                    modelIndicator.style.color = config.color;
                }

                // Get the classification result
                const result = getClassificationResult(modelType, selection.key);
                const analysis = analyzeConnection(selection.textA, selection.textB, selection.indexA, selection.indexB);

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
                        Confidence: ${result.confidence}%
                        (Threshold: ${config.threshold}%)
                    </div>
                `;

                resultContainer.appendChild(classificationEl);

                // Model comparisons (strict vs balanced vs lenient)
                const comparisons = getAllModelComparisons(selection.key);
                const comparisonEl = document.createElement('div');
                comparisonEl.className = 'bg-white p-3 rounded border';
                comparisonEl.innerHTML = `
                    <div class="text-sm font-medium text-gray-700 mb-2">📊 Model labels for this pair</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        ${comparisons.map(c => `
                            <div class="rounded border p-2" style="background:${c.bgColor};border-color:${c.color}">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-semibold" style="color:${c.color}">${c.name}</span>
                                    <span class="text-[10px] px-1.5 py-0.5 rounded" style="background:${c.isNext ? '#d1fae5' : '#fee2e2'};color:${c.isNext ? '#065f46' : '#7f1d1d'}">
                                        ${c.isNext ? 'IsNext' : 'NotNext'}
                                    </span>
                                </div>
                                <div class="text-[11px] text-gray-700">${c.confidence}% ${c.isNext ? '≥' : '<'} ${c.threshold}%</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                resultContainer.appendChild(comparisonEl);

                // Sentence pair display
                const sentencePairEl = document.createElement('div');
                sentencePairEl.className = 'space-y-3';
                sentencePairEl.innerHTML = `
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <div class="text-xs font-medium text-blue-700 mb-1">Sentence A (Option ${selection.indexA + 1})</div>
                        <div class="text-sm text-blue-900">"${selection.textA}"</div>
                    </div>
                    <div class="text-center text-gray-400">
                        <div class="text-xs">Does B follow A?</div>
                        <div class="text-lg">↓</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <div class="text-xs font-medium text-purple-700 mb-1">Sentence B (Option ${selection.indexB + 1})</div>
                        <div class="text-sm text-purple-900">"${selection.textB}"</div>
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
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${analysis.semantic}%"></div>
                        </div>
                        <div class="text-xs text-gray-600">${analysis.semantic}% - Word overlap and topic similarity</div>
                    </div>
                    <div class="bg-white p-3 rounded border">
                        <div class="text-sm font-medium text-gray-700 mb-2">🔗 Contextual Flow</div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div class="bg-green-500 h-2 rounded-full" style="width: ${analysis.contextual}%"></div>
                        </div>
                        <div class="text-xs text-gray-600">${analysis.contextual}% - Pronouns, connectives, and structure</div>
                    </div>
                `;

                resultContainer.appendChild(analysisEl);

                // Detailed reasoning
                const reasoningEl = document.createElement('div');
                reasoningEl.className = 'bg-gray-50 p-3 rounded border text-sm';
                reasoningEl.innerHTML = `
                    <div class="font-medium text-gray-700 mb-2">🧠 Classification Reasoning</div>
                    <div class="text-gray-600">${analysis.reasoning}</div>
                `;

                resultContainer.appendChild(reasoningEl);

                // Clear previous results and add new ones
                output.innerHTML = '';
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
                                <span>Semantic Analysis</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <div class="w-3 h-3 rounded bg-green-600"></div>
                                <span>Contextual Analysis</span>
                            </div>
                        </div>
                    `;
                }

                // Update explanation
                updateExplanation(modelType, result, analysis);

                // Optional: re-typeset MathJax if present (safe no-op otherwise)
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([output, legend, explanation]).catch(() => {});
                }
            }

            // Update visual indicators
            function updateModelVisuals() {
                document.querySelectorAll('input[name="q11-model"]').forEach((radio) => {
                    const label = radio.closest('label');
                    const container = label ? label.querySelector('div') : null;
                    if (!container) return;
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
            function updateExplanation(modelType, result, analysis) {
                if (!explanation) return;
                
                const explanations = {
                    strict: `<strong>Strict NSP Model:</strong> Requires clear semantic and contextual connections. High precision, low recall.`,
                    balanced: `<strong>Balanced NSP Model:</strong> Weighs semantic similarity and contextual flow equally. Good general performance.`,
                    lenient: `<strong>Lenient NSP Model:</strong> Accepts loose thematic connections. High recall, potentially lower precision.`
                };
                
                let explanationText = explanations[modelType];
                
                if (result && analysis) {
                    explanationText += `<br><br><strong>Result:</strong> ${result.isNext ? 'Connected' : 'Disconnected'} (${result.confidence}% confidence)`;
                    explanationText += `<br><strong>Analysis:</strong> ${analysis.reasoning}`;
                }
                
                explanation.innerHTML = explanationText;
            }

            // Update example combinations based on interesting NSP patterns
            const interestingExamples = [
                { a: 0, b: 0, model: 'balanced', note: 'Perfect Coherent Pair (Butterfly → Wings)' },
                { a: 2, b: 2, model: 'balanced', note: 'Strong Narrative Flow (Restaurant → Waiter)' },
                { a: 3, b: 3, model: 'balanced', note: 'Logical Connection (Rain → Umbrellas)' },
                // Teaching examples where lenient accepts but strict rejects
                { a: 1, b: 1, model: 'lenient', note: 'Lenient accepts; strict rejects (Business → Tech)' },
                { a: 1, b: 2, model: 'lenient', note: 'Lenient accepts; strict rejects (Business → Service)' },
                // Clear mismatches
                { a: 0, b: 1, model: 'strict', note: 'Complete Mismatch (Nature → Tech)' }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = interestingExamples[exampleIndex % interestingExamples.length];
                    
                    sentenceA.selectedIndex = example.a;
                    sentenceB.selectedIndex = example.b;
                    document.querySelector(`input[name="q11-model"][value="${example.model}"]`).checked = true;
                    
                    updateModelVisuals();
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = interestingExamples[exampleIndex % interestingExamples.length];
                    exampleBtn.innerHTML = `Try: "${nextExample.note.split(' (')[0]}"`;
                    exampleBtn.title = nextExample.note;
                });
            }

            // Event listeners
            sentenceA.addEventListener('change', processAndDisplay);
            sentenceB.addEventListener('change', processAndDisplay);
            
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
