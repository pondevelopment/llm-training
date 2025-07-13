// Question 24: How does the dot product contribute to self-attention?
// Created: July 13, 2025
// Educational Focus: Query-key similarity computation, attention scores, mathematical foundations, complexity analysis

const question = {
    title: "24. How does the dot product contribute to self-attention?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What is the Dot Product in Self-Attention?</h4>
            <p class="text-blue-800">The dot product in self-attention is like asking "How similar are these two words?" For example, when processing "The cat sat on the mat", the word "cat" might pay more attention to "sat" (what cats do) than to "the" (just a determiner). The dot product mathematically measures this similarity by comparing the semantic vectors representing each word.</p>
        </div>
        
        <!-- Intuitive Example -->
        <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 class="font-semibold text-green-900 mb-2">💡 Real-World Analogy</h4>
            <p class="text-green-800">Think of word vectors as "personality profiles" with dimensions like [formal, emotional, action-related, concrete, temporal]. When computing attention:</p>
            <ul class="text-green-700 mt-2 space-y-1">
                <li>• <strong>"running" · "jogging"</strong> = high score (both are physical activities)</li>
                <li>• <strong>"happy" · "sad"</strong> = low/negative score (opposite emotions)</li>
                <li>• <strong>"quickly" · "fast"</strong> = high score (similar concepts of speed)</li>
                <li>• <strong>"the" · "elephant"</strong> = low score (function word vs. concrete noun)</li>
            </ul>
        </div>
        
        <!-- Mathematical Formula -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h4 class="font-semibold text-gray-900 mb-2">📐 The Attention Score Formula</h4>
            <div class="font-mono text-center text-lg bg-white p-3 rounded border">
                Score = Q · K / √d<sub>k</sub>
            </div>
            <p class="text-sm text-gray-600 mt-2">Where Q is the query vector, K is the key vector, and d<sub>k</sub> is the dimension of the key vectors (for scaling).</p>
        </div>
        
        <!-- Dot Product Properties Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">High Similarity</h5>
                <p class="text-sm text-green-700">Words with related meanings have high attention</p>
                <code class="text-xs bg-green-100 px-1 rounded">"king" → "queen" (high attention)</code>
                <div class="text-xs text-green-600 mt-1">Math: [royal, male] · [royal, female] = positive</div>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Low Similarity</h5>
                <p class="text-sm text-purple-700">Unrelated words have minimal attention</p>
                <code class="text-xs bg-purple-100 px-1 rounded">"the" → "elephant" (low attention)</code>
                <div class="text-xs text-purple-600 mt-1">Math: [function] · [concrete] ≈ 0</div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Opposite Meaning</h5>
                <p class="text-sm text-orange-700">Contradictory words may have negative attention</p>
                <code class="text-xs bg-orange-100 px-1 rounded">"hot" → "cold" (negative attention)</code>
                <div class="text-xs text-orange-600 mt-1">Math: [warm] · [cool] = negative</div>
            </div>
        </div>
        
        <!-- Scaling and Normalization -->
        <div class="bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-semibold text-indigo-900 mb-2">📏 Why Scale by √d<sub>k</sub>?</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-indigo-800 mb-2">Without Scaling:</h6>
                    <ul class="text-indigo-700 space-y-1">
                        <li>• Dot products grow with vector dimension</li>
                        <li>• Higher dimensions → larger attention scores</li>
                        <li>• Softmax becomes too "sharp" and concentrated</li>
                        <li>• Gradients become very small (vanishing)</li>
                    </ul>
                </div>
                <div>
                    <h6 class="font-medium text-indigo-800 mb-2">With Scaling:</h6>
                    <ul class="text-indigo-700 space-y-1">
                        <li>• Normalizes scores regardless of dimension</li>
                        <li>• Maintains stable softmax distribution</li>
                        <li>• Prevents saturation in high dimensions</li>
                        <li>• Enables effective gradient flow during training</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Complexity Analysis -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 class="font-semibold text-red-900 mb-2">⚡ Computational Complexity</h4>
            <div class="text-sm text-red-800 space-y-2">
                <p><strong>Quadratic Complexity O(n²):</strong> For a sequence of length n, we compute n×n dot products (every position attends to every position).</p>
                <p><strong>Memory Impact:</strong> Attention matrix grows quadratically with sequence length, making long sequences computationally expensive.</p>
                <p><strong>Scaling Challenge:</strong> Doubling sequence length quadruples computation, leading to research in sparse attention alternatives.</p>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Dot Product Matters in Language Understanding</h4>
            <ul class="text-sm text-yellow-800 space-y-2">
                <li>• <strong>Semantic Similarity:</strong> "The dog barked loudly" - "dog" and "barked" get high attention (subjects do actions)</li>
                <li>• <strong>Contextual Relevance:</strong> "I went to the bank" - "bank" attends to context words that disambiguate meaning</li>
                <li>• <strong>Grammatical Relations:</strong> Adjectives attend to their nouns, verbs to their subjects and objects</li>
                <li>• <strong>Long-range Dependencies:</strong> "The book that I read yesterday was..." - "book" and "was" connect across distance</li>
                <li>• <strong>Computational Efficiency:</strong> One mathematical operation captures complex linguistic relationships</li>
            </ul>
        </div>
        
        <!-- Alternative Approaches -->
        <div class="bg-teal-50 p-4 rounded-lg">
            <h4 class="font-semibold text-teal-900 mb-2">🔄 Alternative Similarity Functions</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-teal-800 mb-2">Additive Attention:</h6>
                    <p class="text-teal-700">Uses learned weights: W[Q; K] + b</p>
                    <p class="text-xs text-teal-600 mt-1">More parameters but can capture complex relationships</p>
                </div>
                <div>
                    <h6 class="font-medium text-teal-800 mb-2">Cosine Similarity:</h6>
                    <p class="text-teal-700">Normalized dot product: (Q·K)/(||Q||·||K||)</p>
                    <p class="text-xs text-teal-600 mt-1">Focuses purely on direction, ignoring magnitude</p>
                </div>
            </div>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Dot Product Attention Explorer",
        html: `<div class="space-y-6">
            <!-- Vector Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q24-vectors-select" class="block text-sm font-medium text-gray-700 mb-2">📝 Select Word Pairs for Attention Analysis</label>
                <select id="q24-vectors-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="[0.8, 0.6, 0.2, 0.9]; [0.7, 0.5, 0.3, 0.8]">"king" → "queen" (royal, similar roles)</option>
                    <option value="[0.9, 0.1, 0.8, 0.3]; [0.8, 0.2, 0.9, 0.2]">"running" → "jogging" (both physical activities)</option>
                    <option value="[0.2, 0.1, 0.1, 0.8]; [0.1, 0.2, 0.8, 0.1]">"the" → "elephant" (function word vs concrete noun)</option>
                    <option value="[0.6, 0.9, 0.3, 0.2]; [0.5, -0.8, 0.2, 0.3]">"happy" → "sad" (opposite emotions)</option>
                    <option value="[0.4, 0.7, 0.8, 0.6]; [0.5, 0.6, 0.9, 0.7]">"quickly" → "fast" (similar speed concepts)</option>
                    <option value="[0.9, 0.2, 0.7, 0.4]; [0.3, 0.8, 0.2, 0.6]">"doctor" → "patient" (related but different roles)</option>
                    <option value="[0.5, 0.8, 0.1, 0.9]; [-0.4, -0.7, 0.2, -0.8]">"hot" → "cold" (temperature opposites)</option>
                    <option value="[0.3, 0.4, 0.9, 0.5]; [0.2, 0.3, 0.8, 0.6]">"writing" → "pencil" (action and tool)</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Each word is represented by a 4D vector: [semantic_category, emotional_tone, concreteness, action_relatedness]</p>
            </div>
            
            <!-- Scaling Control -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">⚙️ Attention Parameters</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" id="q24-apply-scaling" checked class="mr-2">
                            <span class="text-sm font-medium text-gray-700">Apply √d<sub>k</sub> Scaling</span>
                        </label>
                        <p class="text-xs text-gray-600 mt-1">Divides dot product by square root of key dimension</p>
                    </div>
                    <div>
                        <label class="flex items-center">
                            <input type="checkbox" id="q24-apply-softmax" checked class="mr-2">
                            <span class="text-sm font-medium text-gray-700">Apply Softmax</span>
                        </label>
                        <p class="text-xs text-gray-600 mt-1">Converts scores to probability distribution</p>
                    </div>
                </div>
            </div>

            <!-- Visualization Mode -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">📊 Visualization Mode</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q24-mode" value="calculation" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Step-by-Step</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Detailed</span>
                            </div>
                            <p class="text-xs text-gray-600">Show mathematical computation breakdown</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q24-mode" value="visualization" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Vector Plot</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Visual</span>
                            </div>
                            <p class="text-xs text-gray-600">Show geometric relationship between vectors</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q24-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Similar meanings - High attention</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Attention Score Results</h4>
                    <div id="q24-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Step-by-Step</div>
                </div>
                <div id="q24-output" class="min-h-[200px]"></div>
                <div id="q24-legend" class="mt-3 text-xs text-gray-600"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Attention Analysis</h4>
                <div id="q24-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const vectorsSelect = document.getElementById('q24-vectors-select');
            const applyScaling = document.getElementById('q24-apply-scaling');
            const applySoftmax = document.getElementById('q24-apply-softmax');
            const output = document.getElementById('q24-output');
            const modeRadios = document.querySelectorAll('input[name="q24-mode"]');
            const exampleBtn = document.getElementById('q24-example-btn');
            const modeIndicator = document.getElementById('q24-mode-indicator');
            const legend = document.getElementById('q24-legend');
            const explanation = document.getElementById('q24-explanation');

            // Check if required elements exist
            if (!vectorsSelect || !output) {
                console.error('Required DOM elements not found for Question 24');
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize Question 24 interactive components.</div>';
                }
                return;
            }
            
            if (!applyScaling) {
                console.warn('applyScaling checkbox not found');
            }
            
            if (!applySoftmax) {
                console.warn('applySoftmax checkbox not found');
            }

            // Example scenarios with detailed descriptions
            const examples = [
                { 
                    vectors: "[0.8, 0.6, 0.2, 0.9]; [0.7, 0.5, 0.3, 0.8]", 
                    description: "Similar meanings - High attention",
                    explanation: "Words with similar semantic properties create strong attention connections",
                    words: '"king" → "queen"'
                },
                { 
                    vectors: "[0.9, 0.1, 0.8, 0.3]; [0.8, 0.2, 0.9, 0.2]", 
                    description: "Related actions - Strong similarity",
                    explanation: "Action words with similar meanings naturally attend to each other",
                    words: '"running" → "jogging"'
                },
                { 
                    vectors: "[0.2, 0.1, 0.1, 0.8]; [0.1, 0.2, 0.8, 0.1]", 
                    description: "Unrelated words - Low attention",
                    explanation: "Function words and concrete nouns have little semantic overlap",
                    words: '"the" → "elephant"'
                },
                { 
                    vectors: "[0.6, 0.9, 0.3, 0.2]; [0.5, -0.8, 0.2, 0.3]", 
                    description: "Opposite emotions - Negative attention",
                    explanation: "Contrasting emotional words create anti-correlation in attention",
                    words: '"happy" → "sad"'
                },
                { 
                    vectors: "[0.4, 0.7, 0.8, 0.6]; [0.5, 0.6, 0.9, 0.7]", 
                    description: "Speed concepts - High similarity",
                    explanation: "Related concepts in the same semantic field attend strongly to each other",
                    words: '"quickly" → "fast"'
                }
            ];
            
            let exampleIndex = 0;

            // Helper function to parse vectors
            function parseVectors(vectorsText) {
                try {
                    const [qText, kText] = vectorsText.split(';').map(s => s.trim());
                    const Q = JSON.parse(qText);
                    const K = JSON.parse(kText);
                    return { Q, K };
                } catch {
                    return { Q: [0.8, 0.6, 0.2, 0.9], K: [0.7, 0.5, 0.3, 0.8] };
                }
            }
            
            // Get word pair description from vector values
            function getWordPairDescription(vectorsText) {
                const wordPairs = {
                    "[0.8, 0.6, 0.2, 0.9]; [0.7, 0.5, 0.3, 0.8]": '"king" → "queen"',
                    "[0.9, 0.1, 0.8, 0.3]; [0.8, 0.2, 0.9, 0.2]": '"running" → "jogging"',
                    "[0.2, 0.1, 0.1, 0.8]; [0.1, 0.2, 0.8, 0.1]": '"the" → "elephant"',
                    "[0.6, 0.9, 0.3, 0.2]; [0.5, -0.8, 0.2, 0.3]": '"happy" → "sad"',
                    "[0.4, 0.7, 0.8, 0.6]; [0.5, 0.6, 0.9, 0.7]": '"quickly" → "fast"',
                    "[0.9, 0.2, 0.7, 0.4]; [0.3, 0.8, 0.2, 0.6]": '"doctor" → "patient"',
                    "[0.5, 0.8, 0.1, 0.9]; [-0.4, -0.7, 0.2, -0.8]": '"hot" → "cold"',
                    "[0.3, 0.4, 0.9, 0.5]; [0.2, 0.3, 0.8, 0.6]": '"writing" → "pencil"'
                };
                return wordPairs[vectorsText] || 'Custom word pair';
            }

            // Calculate dot product
            function dotProduct(a, b) {
                if (a.length !== b.length) return 0;
                return a.reduce((sum, val, i) => sum + val * b[i], 0);
            }

            // Calculate vector magnitude
            function magnitude(vector) {
                return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
            }

            // Calculate cosine similarity
            function cosineSimilarity(a, b) {
                const dot = dotProduct(a, b);
                const magA = magnitude(a);
                const magB = magnitude(b);
                return magA && magB ? dot / (magA * magB) : 0;
            }

            // Apply softmax to single value (for demonstration)
            function softmaxSingle(score, temperature = 1.0) {
                // For single score, we'll show it in context of typical attention range
                const expScore = Math.exp(score / temperature);
                const expSum = expScore + Math.exp(0) + Math.exp(-1); // Assume some context
                return expScore / expSum;
            }

            // Get current visualization mode
            function getCurrentMode() {
                const checked = document.querySelector('input[name="q24-mode"]:checked');
                return checked ? checked.value : 'calculation';
            }

            // Render step-by-step calculation
            function renderCalculation(Q, K, rawScore, scaledScore, softmaxScore, useScaling, useSoftmax, vectorsText) {
                const dk = K.length;
                const scalingFactor = Math.sqrt(dk);
                const wordPair = getWordPairDescription(vectorsText);
                const dimensions = ['Semantic Category', 'Emotional Tone', 'Concreteness', 'Action Relatedness'];
                
                let html = '<div class="space-y-4">';
                
                // Show word pair and semantic meaning
                html += `
                    <div class="bg-blue-50 p-3 rounded">
                        <h5 class="font-medium text-blue-700 mb-2">Word Pair Analysis: ${wordPair}</h5>
                        <div class="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Query Word Vector:</strong>
                                <div class="font-mono text-xs mt-1">[${Q.map(v => v.toFixed(1)).join(', ')}]</div>
                                <div class="text-xs text-gray-600 mt-1">
                                    ${dimensions.map((dim, i) => `${dim}: ${Q[i].toFixed(1)}`).join(' | ')}
                                </div>
                            </div>
                            <div>
                                <strong>Key Word Vector:</strong>
                                <div class="font-mono text-xs mt-1">[${K.map(v => v.toFixed(1)).join(', ')}]</div>
                                <div class="text-xs text-gray-600 mt-1">
                                    ${dimensions.map((dim, i) => `${dim}: ${K[i].toFixed(1)}`).join(' | ')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Show semantic similarity breakdown
                html += `
                    <div class="bg-green-50 p-3 rounded">
                        <h5 class="font-medium text-green-700 mb-2">Semantic Similarity Breakdown</h5>
                        <div class="space-y-2 text-sm">
                `;
                
                dimensions.forEach((dim, i) => {
                    const similarity = Q[i] * K[i];
                    const similarityPercent = Math.abs(similarity) > 0.5 ? 'High' : Math.abs(similarity) > 0.2 ? 'Medium' : 'Low';
                    html += `
                        <div class="flex justify-between items-center">
                            <span>${dim}:</span>
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-xs">${Q[i].toFixed(1)} × ${K[i].toFixed(1)} = ${similarity.toFixed(2)}</span>
                                <span class="text-xs px-2 py-1 rounded ${similarity > 0.3 ? 'bg-green-100 text-green-700' : similarity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">${similarityPercent}</span>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
                
                // Show total dot product calculation
                html += `
                    <div class="bg-purple-50 p-3 rounded">
                        <h5 class="font-medium text-purple-700 mb-2">Total Attention Score Calculation</h5>
                        <div class="text-sm">
                            <div class="font-mono mb-2">
                                Dot Product = ${Q.map((q, i) => `(${q.toFixed(1)} × ${K[i].toFixed(1)})`).join(' + ')}
                            </div>
                            <div class="font-mono mb-2">
                                = ${Q.map((q, i) => (q * K[i]).toFixed(2)).join(' + ')} = <strong>${rawScore.toFixed(3)}</strong>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">
                                This score represents how much the query word should "pay attention" to the key word.
                            </div>
                        </div>
                    </div>
                `;
                
                // Show scaling if applied
                if (useScaling) {
                    html += `
                        <div class="bg-orange-50 p-3 rounded">
                            <h5 class="font-medium text-orange-700 mb-2">Scaling for Stability</h5>
                            <div class="text-sm">
                                <div class="font-mono mb-2">
                                    Scaled Score = ${rawScore.toFixed(3)} / √${dk} = ${rawScore.toFixed(3)} / ${scalingFactor.toFixed(3)}
                                </div>
                                <div class="font-mono">
                                    = <strong>${scaledScore.toFixed(3)}</strong>
                                </div>
                                <div class="text-xs text-gray-600 mt-2">
                                    Scaling prevents attention scores from becoming too extreme in high-dimensional spaces.
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="bg-gray-100 p-3 rounded border-2 border-dashed">
                            <h5 class="font-medium text-gray-600 mb-2">Scaling (Disabled)</h5>
                            <div class="text-sm text-gray-600">Scaling factor √d<sub>k</sub> = ${scalingFactor.toFixed(3)} not applied</div>
                        </div>
                    `;
                }
                
                // Show softmax if applied
                if (useSoftmax) {
                    html += `
                        <div class="bg-indigo-50 p-3 rounded">
                            <h5 class="font-medium text-indigo-700 mb-2">Converting to Attention Weight</h5>
                            <div class="text-sm">
                                <div class="font-mono mb-2">
                                    Attention Weight = exp(${scaledScore.toFixed(3)}) / Σexp(all_scores)
                                </div>
                                <div class="font-mono">
                                    ≈ <strong>${softmaxScore.toFixed(3)}</strong>
                                </div>
                                <div class="text-xs text-gray-600 mt-2">
                                    Softmax converts raw scores into probabilities that sum to 1 across all words in the sequence.
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="bg-gray-100 p-3 rounded border-2 border-dashed">
                            <h5 class="font-medium text-gray-600 mb-2">Softmax (Disabled)</h5>
                            <div class="text-sm text-gray-600">Raw attention score: ${scaledScore.toFixed(3)}</div>
                        </div>
                    `;
                }
                
                html += '</div>';
                return html;
            }

            // Render vector visualization (simplified for 2D/3D)
            function renderVisualization(Q, K, rawScore, scaledScore, vectorsText) {
                const cosine = cosineSimilarity(Q, K);
                const angleRad = Math.acos(Math.max(-1, Math.min(1, cosine)));
                const angleDeg = (angleRad * 180 / Math.PI).toFixed(1);
                const wordPair = getWordPairDescription(vectorsText);
                
                let html = '<div class="space-y-4">';
                
                // Word pair header
                html += `
                    <div class="bg-blue-50 p-3 rounded text-center">
                        <h5 class="font-medium text-blue-700 mb-1">Analyzing: ${wordPair}</h5>
                        <p class="text-xs text-blue-600">How similar are these words in semantic space?</p>
                    </div>
                `;
                
                // Key metrics
                html += `
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-green-50 p-3 rounded text-center">
                            <div class="text-lg font-bold text-green-600">${rawScore.toFixed(3)}</div>
                            <div class="text-xs text-green-600">Attention Score</div>
                            <div class="text-xs text-gray-500 mt-1">Raw dot product</div>
                        </div>
                        <div class="bg-purple-50 p-3 rounded text-center">
                            <div class="text-lg font-bold text-purple-600">${cosine.toFixed(3)}</div>
                            <div class="text-xs text-purple-600">Cosine Similarity</div>
                            <div class="text-xs text-gray-500 mt-1">Direction alignment</div>
                        </div>
                        <div class="bg-orange-50 p-3 rounded text-center">
                            <div class="text-lg font-bold text-orange-600">${angleDeg}°</div>
                            <div class="text-xs text-orange-600">Semantic Angle</div>
                            <div class="text-xs text-gray-500 mt-1">Vector separation</div>
                        </div>
                    </div>
                `;
                
                // Visual vector representation
                html += `
                    <div class="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
                        <h5 class="font-medium text-gray-700 mb-3">📐 2D Vector Visualization</h5>
                        <div class="space-y-4">
                            <!-- 2D Plot -->
                            <div class="bg-white p-4 rounded border relative" style="height: 300px; font-family: monospace;">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="relative" style="width: 240px; height: 240px;">
                                        <!-- Grid -->
                                        <svg width="240" height="240" class="absolute inset-0">
                                            <!-- Grid lines -->
                                            <defs>
                                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                                                </pattern>
                                            </defs>
                                            <rect width="240" height="240" fill="url(#grid)" />
                                            
                                            <!-- Axes -->
                                            <line x1="120" y1="0" x2="120" y2="240" stroke="#9ca3af" stroke-width="2"/>
                                            <line x1="0" y1="120" x2="240" y2="120" stroke="#9ca3af" stroke-width="2"/>
                                            
                                            <!-- Vector Q (first two dimensions) -->
                                            ${(() => {
                                                const scale = 80;
                                                const qx = 120 + Q[0] * scale;
                                                const qy = 120 - Q[1] * scale;
                                                return `
                                                    <line x1="120" y1="120" x2="${qx}" y2="${qy}" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrowQ)"/>
                                                    <circle cx="${qx}" cy="${qy}" r="4" fill="#3b82f6"/>
                                                    <text x="${qx + 8}" y="${qy - 8}" fill="#3b82f6" font-size="12" font-weight="bold">Q</text>
                                                `;
                                            })()}
                                            
                                            <!-- Vector K (first two dimensions) -->
                                            ${(() => {
                                                const scale = 80;
                                                const kx = 120 + K[0] * scale;
                                                const ky = 120 - K[1] * scale;
                                                return `
                                                    <line x1="120" y1="120" x2="${kx}" y2="${ky}" stroke="#ef4444" stroke-width="3" marker-end="url(#arrowK)"/>
                                                    <circle cx="${kx}" cy="${ky}" r="4" fill="#ef4444"/>
                                                    <text x="${kx + 8}" y="${ky + 16}" fill="#ef4444" font-size="12" font-weight="bold">K</text>
                                                `;
                                            })()}
                                            
                                            <!-- Arrow markers -->
                                            <defs>
                                                <marker id="arrowQ" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                                                </marker>
                                                <marker id="arrowK" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                                </marker>
                                            </defs>
                                            
                                            <!-- Angle arc (if vectors are close enough to origin) -->
                                            ${(() => {
                                                if (angleDeg < 90) {
                                                    const arcRadius = 30;
                                                    const qAngle = Math.atan2(-Q[1], Q[0]) * 180 / Math.PI;
                                                    const kAngle = Math.atan2(-K[1], K[0]) * 180 / Math.PI;
                                                    const startAngle = Math.min(qAngle, kAngle);
                                                    const endAngle = Math.max(qAngle, kAngle);
                                                    const midAngle = (startAngle + endAngle) / 2;
                                                    const midX = 120 + Math.cos(midAngle * Math.PI / 180) * (arcRadius + 10);
                                                    const midY = 120 - Math.sin(midAngle * Math.PI / 180) * (arcRadius + 10);
                                                    
                                                    return `
                                                        <path d="M ${120 + Math.cos(startAngle * Math.PI / 180) * arcRadius} ${120 - Math.sin(startAngle * Math.PI / 180) * arcRadius} 
                                                                 A ${arcRadius} ${arcRadius} 0 0 1 ${120 + Math.cos(endAngle * Math.PI / 180) * arcRadius} ${120 - Math.sin(endAngle * Math.PI / 180) * arcRadius}" 
                                                              stroke="#8b5cf6" stroke-width="2" fill="none"/>
                                                        <text x="${midX}" y="${midY}" fill="#8b5cf6" font-size="10" text-anchor="middle">${angleDeg}°</text>
                                                    `;
                                                }
                                                return '';
                                            })()}
                                        </svg>
                                        
                                        <!-- Axis labels -->
                                        <div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Dimension 1</div>
                                        <div class="absolute top-1/2 left-1 transform -translate-y-1/2 -rotate-90 text-xs text-gray-500">Dimension 2</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Vector Information -->
                            <div class="grid md:grid-cols-2 gap-4 text-sm">
                                <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                                    <h6 class="font-semibold text-blue-700 mb-2">Query Vector (Q) - Blue</h6>
                                    <div class="font-mono space-y-1">
                                        <div>2D: [${Q[0].toFixed(2)}, ${Q[1].toFixed(2)}]</div>
                                        <div>Full: [${Q.map(v => v.toFixed(2)).join(', ')}]</div>
                                        <div class="text-xs text-blue-600 mt-1">Magnitude: ${magnitude(Q).toFixed(3)}</div>
                                    </div>
                                </div>
                                <div class="bg-red-50 p-3 rounded border-l-4 border-red-500">
                                    <h6 class="font-semibold text-red-700 mb-2">Key Vector (K) - Red</h6>
                                    <div class="font-mono space-y-1">
                                        <div>2D: [${K[0].toFixed(2)}, ${K[1].toFixed(2)}]</div>
                                        <div>Full: [${K.map(v => v.toFixed(2)).join(', ')}]</div>
                                        <div class="text-xs text-red-600 mt-1">Magnitude: ${magnitude(K).toFixed(3)}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Similarity Analysis -->
                            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                                <h6 class="font-semibold text-purple-700 mb-2">Geometric Relationship</h6>
                                <div class="text-sm space-y-1">
                                    <div><strong>Angle between vectors:</strong> ${angleDeg}° ${angleDeg < 30 ? '(Very similar direction)' : angleDeg < 60 ? '(Somewhat similar)' : angleDeg < 90 ? '(Different directions)' : '(Opposite-ish directions)'}</div>
                                    <div><strong>Cosine similarity:</strong> ${cosine.toFixed(3)} ${cosine > 0.7 ? '(High)' : cosine > 0.3 ? '(Moderate)' : cosine > 0 ? '(Low)' : '(Negative)'}</div>
                                    <div><strong>Dot product:</strong> ${rawScore.toFixed(3)} ${rawScore > 1 ? '(Strong attention)' : rawScore > 0.5 ? '(Moderate attention)' : rawScore > 0 ? '(Weak attention)' : '(No/negative attention)'}</div>
                                    <div class="text-xs text-purple-600 mt-2">💡 Smaller angles = higher attention scores. Vectors pointing in similar directions have high dot products.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Linguistic interpretation
                html += `
                    <div class="bg-yellow-50 p-4 rounded">
                        <h5 class="font-medium text-yellow-700 mb-3">Linguistic Interpretation</h5>
                        <div class="space-y-2 text-sm">
                `;
                
                // Attention strength interpretation
                if (rawScore > 1.5) {
                    html += '<div class="text-green-700">🎯 <strong>Strong Attention:</strong> These words have very similar meanings and will strongly attend to each other in context.</div>';
                } else if (rawScore > 0.5) {
                    html += '<div class="text-blue-700">↗️ <strong>Moderate Attention:</strong> These words share some semantic features and will have moderate attention.</div>';
                } else if (rawScore > 0) {
                    html += '<div class="text-yellow-700">↔️ <strong>Weak Attention:</strong> These words have minimal semantic overlap.</div>';
                } else if (rawScore > -0.5) {
                    html += '<div class="text-orange-700">⊥ <strong>No Attention:</strong> These words are semantically unrelated.</div>';
                } else {
                    html += '<div class="text-red-700">✗ <strong>Negative Attention:</strong> These words have opposing semantic properties.</div>';
                }
                
                // Practical meaning
                if (rawScore > 0.8) {
                    html += `<div class="text-green-600">💡 <strong>In Practice:</strong> When processing "${wordPair.replace(/['"]/g, '')}", the model will likely connect these words strongly, helping with context understanding and semantic relationships.</div>`;
                } else if (rawScore > 0) {
                    html += `<div class="text-blue-600">💡 <strong>In Practice:</strong> These words will have some connection in the attention mechanism, but other words in the sentence may be more important.</div>`;
                } else {
                    html += `<div class="text-gray-600">💡 <strong>In Practice:</strong> These words will have minimal interaction in the attention mechanism - they serve different linguistic functions.</div>`;
                }
                
                html += `
                        </div>
                    </div>
                `;
                
                // Semantic dimension breakdown
                const dimensions = ['Semantic Category', 'Emotional Tone', 'Concreteness', 'Action Relatedness'];
                html += `
                    <div class="bg-indigo-50 p-3 rounded">
                        <h5 class="font-medium text-indigo-700 mb-2">Dimension-by-Dimension Analysis</h5>
                        <div class="space-y-2 text-sm">
                `;
                
                dimensions.forEach((dim, i) => {
                    const similarity = Q[i] * K[i];
                    const alignmentDesc = similarity > 0.3 ? 'Aligned' : similarity > 0 ? 'Somewhat aligned' : similarity > -0.3 ? 'Misaligned' : 'Opposite';
                    const color = similarity > 0.3 ? 'text-green-600' : similarity > 0 ? 'text-blue-600' : similarity > -0.3 ? 'text-orange-600' : 'text-red-600';
                    
                    html += `
                        <div class="flex justify-between items-center">
                            <span><strong>${dim}:</strong></span>
                            <span class="${color}">${alignmentDesc} (${similarity.toFixed(2)})</span>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
                
                html += '</div>';
                return html;
            }

            // Update mode indicator
            function updateModeIndicator() {
                const mode = getCurrentMode();
                modeIndicator.textContent = mode === 'calculation' ? 'Step-by-Step' : 'Vector Plot';
            }

            // Main processing function
            const processAndDisplay = () => {
                const vectorsText = vectorsSelect.value.trim();
                const useScaling = applyScaling ? applyScaling.checked : true; // Default to true if element not found
                const useSoftmax = applySoftmax ? applySoftmax.checked : true; // Default to true if element not found
                const mode = getCurrentMode();
                
                if (!vectorsText) {
                    output.innerHTML = '<div class="text-sm text-gray-500 text-center">Select vectors to compute attention scores...</div>';
                    return;
                }

                const { Q, K } = parseVectors(vectorsText);
                
                // Calculate attention score
                const rawScore = dotProduct(Q, K);
                const dk = K.length;
                const scaledScore = useScaling ? rawScore / Math.sqrt(dk) : rawScore;
                const softmaxScore = useSoftmax ? softmaxSingle(scaledScore) : null;
                
                // Render based on mode
                if (mode === 'calculation') {
                    const calculationHTML = renderCalculation(Q, K, rawScore, scaledScore, softmaxScore, useScaling, useSoftmax, vectorsText);
                    output.innerHTML = calculationHTML;
                } else {
                    const visualizationHTML = renderVisualization(Q, K, rawScore, scaledScore, vectorsText);
                    output.innerHTML = visualizationHTML;
                }
                
                // Update legend
                if (legend) {
                    const finalScore = useSoftmax ? softmaxScore : scaledScore;
                    const wordPair = getWordPairDescription(vectorsText);
                    legend.innerHTML = `
                        ${wordPair} | Attention score: ${finalScore?.toFixed(4) || scaledScore.toFixed(4)} | 
                        Vector dimension: ${dk} | Scaling: ${useScaling ? 'ON' : 'OFF'} | Softmax: ${useSoftmax ? 'ON' : 'OFF'}
                    `;
                }
                
                // Update explanation
                updateExplanation(rawScore, scaledScore, useScaling, useSoftmax, dk, vectorsText);
            };

            // Update educational explanation
            function updateExplanation(rawScore, scaledScore, useScaling, useSoftmax, dk, vectorsText) {
                if (!explanation) return;
                
                const wordPair = getWordPairDescription(vectorsText);
                let scoreInterpretation, scalingEffect, softmaxEffect;
                
                if (rawScore > 1.5) {
                    scoreInterpretation = `The high attention score means ${wordPair} have very similar semantic properties - they will strongly attend to each other in context.`;
                } else if (rawScore > 0.5) {
                    scoreInterpretation = `The moderate attention score shows ${wordPair} share some semantic features - they'll have noticeable attention.`;
                } else if (rawScore > 0) {
                    scoreInterpretation = `The positive but low score means ${wordPair} have minimal semantic overlap - weak attention expected.`;
                } else if (rawScore === 0) {
                    scoreInterpretation = `Zero score means ${wordPair} are semantically orthogonal - no attention relationship.`;
                } else {
                    scoreInterpretation = `The negative score indicates ${wordPair} have opposing semantic properties - anti-correlation in attention.`;
                }
                
                if (useScaling) {
                    const scalingFactor = Math.sqrt(dk);
                    scalingEffect = `Scaling by √${dk} = ${scalingFactor.toFixed(2)} normalizes the score from ${rawScore.toFixed(3)} to ${scaledScore.toFixed(3)}, ensuring stable attention computation regardless of vector dimensionality.`;
                } else {
                    scalingEffect = `Without scaling, the raw score ${rawScore.toFixed(3)} could become unstable in higher dimensions, potentially causing attention to focus too sharply.`;
                }
                
                if (useSoftmax) {
                    softmaxEffect = "Softmax will convert this score into a probability weight - determining what fraction of attention this word pair receives relative to all other word pairs in the sentence.";
                } else {
                    softmaxEffect = "Without softmax, this remains a raw similarity score that hasn't been normalized into an attention probability distribution.";
                }
                
                explanation.innerHTML = `
                    <div class="space-y-2">
                        <p><strong>Word Relationship:</strong> ${scoreInterpretation}</p>
                        <p><strong>Scaling Effect:</strong> ${scalingEffect}</p>
                        <p><strong>Softmax Impact:</strong> ${softmaxEffect}</p>
                        <p class="text-xs mt-2 p-2 bg-yellow-100 rounded">
                            <strong>💡 Language Insight:</strong> This dot product computation is how transformers automatically discover that words like "king" and "queen" should attend to each other, enabling the model to understand semantic relationships without explicit programming.
                        </p>
                    </div>
                `;
            }

            // Example cycling functionality
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex];
                    vectorsSelect.value = example.vectors;
                    processAndDisplay();
                    
                    exampleBtn.textContent = example.description;
                    exampleBtn.title = `${example.words}: ${example.explanation} (${exampleIndex + 1}/${examples.length})`;
                    
                    exampleIndex = (exampleIndex + 1) % examples.length;
                });
            }

            // Event listeners
            if (vectorsSelect) {
                vectorsSelect.addEventListener('change', processAndDisplay);
            }
            
            if (applyScaling) {
                applyScaling.addEventListener('change', processAndDisplay);
            }
            
            if (applySoftmax) {
                applySoftmax.addEventListener('change', processAndDisplay);
            }
            
            modeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateModeIndicator();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateModeIndicator();
            processAndDisplay();
        }
    }
};
