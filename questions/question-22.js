// Question 22: Multi-Head Attention in Transformers
// Created: July 13, 2025
// Educational Focus: Understanding how multiple attention heads capture different aspects of input

const question = {
    title: "22. What is multi-head attention, and how does it enhance LLMs?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related topics)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-21" class="text-indigo-700 underline hover:text-indigo-900">Question 21: Positional encodings</a></li>
                <li><a href="#question-23" class="text-indigo-700 underline hover:text-indigo-900">Question 23: Softmax in attention</a></li>
                <li><a href="#question-24" class="text-indigo-700 underline hover:text-indigo-900">Question 24: Dot product in self-attention</a></li>
                <li><a href="#question-32" class="text-indigo-700 underline hover:text-indigo-900">Question 32: Attention score calculation</a></li>
            </ul>
        </div>
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What is Multi-Head Attention?</h4>
            <p class="text-blue-800">Multi-head attention is like having multiple specialized experts examining the same text simultaneously. Instead of one attention mechanism, the model splits queries, keys, and values into multiple "heads" - each focusing on different aspects like syntax, semantics, or relationships. Think of it as having multiple translators, each specializing in different nuances of language.</p>
        </div>
        
    <!-- How It Works -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Split into Heads</h5>
                <p class="text-sm text-green-700">Divide the embedding dimension into multiple smaller subspaces, each representing one attention head.</p>
    <div class="text-base md:text-lg bg-green-100 px-3 py-2 rounded border text-center overflow-x-auto whitespace-nowrap leading-tight">$$ d_{model} = h \, d_{head} $$</div>
            <div class="mt-1 text-base md:text-lg bg-green-100 px-3 py-2 rounded border text-center overflow-x-auto whitespace-nowrap leading-tight">$$ head_i = A(Q W_i^{Q}, K W_i^{K}, V W_i^{V}) $$</div>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Parallel Processing</h5>
                <p class="text-sm text-purple-700">Each head independently computes attention weights, focusing on different patterns and relationships.</p>
                <div class="text-base md:text-lg bg-purple-100 px-3 py-2 rounded border text-center overflow-x-auto whitespace-nowrap leading-tight">$$ A(Q,K,V) = softmax((QK^{T})/\sqrt{d_k})\,V $$</div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Concatenate & Project</h5>
                <p class="text-sm text-orange-700">Combine outputs from all heads and apply a final linear transformation to integrate insights.</p>
                <div class="text-base md:text-lg bg-orange-100 px-3 py-2 rounded border text-center overflow-x-auto whitespace-nowrap leading-tight">$$ MHA(Q,K,V) = Concat(head_1,\ldots,head_h)\, W^{O} $$</div>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🚀 Why Multi-Head Attention Enhances LLMs</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Specialized Focus:</strong> Different heads can specialize in syntax, semantics, long-range dependencies, or local patterns</li>
                <li>• <strong>Redundancy & Robustness:</strong> Multiple perspectives reduce the risk of missing important relationships</li>
                <li>• <strong>Parallel Processing:</strong> Heads operate independently, enabling efficient computation and diverse pattern recognition</li>
                <li>• <strong>Rich Representations:</strong> Combining multiple attention patterns creates more nuanced understanding of context</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🧠 Interactive Multi-Head Attention Analyzer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q22-text-select" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose a Sentence to Analyze</label>
                <select id="q22-text-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="The cat sat on the mat">The cat sat on the mat (Simple subject-verb-object)</option>
                    <option value="The quick brown fox jumps over the lazy dog">The quick brown fox jumps over the lazy dog (Multiple adjectives and relationships)</option>
                    <option value="Although it was raining, she decided to go outside">Although it was raining, she decided to go outside (Complex clause structure)</option>
                    <option value="The teacher who helped me yesterday is very kind">The teacher who helped me yesterday is very kind (Relative clause)</option>
                    <option value="I think that you should definitely consider this proposal">I think that you should definitely consider this proposal (Nested thoughts)</option>
                    <option value="Machine learning models require extensive training data">Machine learning models require extensive training data (Technical terminology)</option>
                    <option value="Neither John nor Mary could solve the problem">Neither John nor Mary could solve the problem (Coordination and negation)</option>
                    <option value="The book I read last week was fascinating">The book I read last week was fascinating (Embedded clause)</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Each sentence demonstrates different linguistic patterns that multiple heads can capture!</p>
            </div>
            
            <!-- Number of Heads Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Number of Attention Heads</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q22-heads" value="4" class="absolute top-2 right-2">
                        <div class="heads-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">4 Heads</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Basic</span>
                            </div>
                            <p class="text-xs text-gray-600">Small model configuration, good for simple patterns</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                d_head = 192 (768/4)
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q22-heads" value="8" checked class="absolute top-2 right-2">
                        <div class="heads-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">8 Heads</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Standard</span>
                            </div>
                            <p class="text-xs text-gray-600">Common configuration balancing complexity and efficiency</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                d_head = 96 (768/8)
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q22-heads" value="12" class="absolute top-2 right-2">
                        <div class="heads-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">12 Heads</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Advanced</span>
                            </div>
                            <p class="text-xs text-gray-600">Large model configuration for complex pattern recognition</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                d_head = 64 (768/12)
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Info -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Tip:</span>
                <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Each head specializes in different linguistic patterns - watch how they focus on different words!</span>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Multi-Head Attention Visualization</h4>
                    <div id="q22-heads-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q22-output" class="min-h-[300px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300" aria-live="polite"></div>
                <div id="q22-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div id="q22-analysis" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Attention Head Analysis</h4>
                <div id="q22-explanation" class="text-sm text-yellow-800" aria-live="polite"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const input = document.getElementById('q22-text-select');
            const output = document.getElementById('q22-output');
            const headsRadios = document.querySelectorAll('input[name="q22-heads"]');
            const headsIndicator = document.getElementById('q22-heads-indicator');
            const legend = document.getElementById('q22-legend');
            const explanation = document.getElementById('q22-explanation');
            const answerRoot = document.getElementById('question-answer');

            // Check if required elements exist
            if (!input || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Head specialization patterns - simulate what different heads might focus on
            const headSpecializations = {
                0: { name: 'Syntactic Structure', color: '#ef4444', pattern: 'syntax' },
                1: { name: 'Semantic Relations', color: '#3b82f6', pattern: 'semantic' },
                2: { name: 'Long Dependencies', color: '#10b981', pattern: 'long_range' },
                3: { name: 'Local Context', color: '#f59e0b', pattern: 'local' },
                4: { name: 'Entity Relations', color: '#8b5cf6', pattern: 'entities' },
                5: { name: 'Temporal Flow', color: '#ec4899', pattern: 'temporal' },
                6: { name: 'Causal Links', color: '#06b6d4', pattern: 'causal' },
                7: { name: 'Modifier Focus', color: '#84cc16', pattern: 'modifiers' },
                8: { name: 'Clause Boundaries', color: '#f97316', pattern: 'clauses' },
                9: { name: 'Subject-Object', color: '#6366f1', pattern: 'subobj' },
                10: { name: 'Negation Scope', color: '#dc2626', pattern: 'negation' },
                11: { name: 'Question Focus', color: '#059669', pattern: 'questions' }
            };

            // Helper function to get current number of heads
            function getCurrentHeads() {
                const selectedRadio = document.querySelector('input[name="q22-heads"]:checked');
                return selectedRadio ? parseInt(selectedRadio.value) : 8;
            }

            // Helper function to tokenize text
            function tokenizeText(text) {
                return text.trim().split(/\s+/).filter(token => token.length > 0);
            }

            // Simulate attention weights based on head specialization
            function generateAttentionWeights(tokens, headIndex, numHeads) {
                const weights = [];
                const specialization = headSpecializations[headIndex % 12];
                
                tokens.forEach((token, i) => {
                    const tokenWeights = [];
                    
                    tokens.forEach((_, j) => {
                        let weight = 0.1; // Base attention
                        
                        // Simulate different attention patterns based on specialization
                        switch (specialization.pattern) {
                            case 'syntax':
                                // Focus on grammatical relationships
                                if (isVerbAdjacent(tokens, i, j) || isArticleNoun(tokens, i, j)) {
                                    weight = 0.8 + Math.random() * 0.2;
                                }
                                break;
                            case 'semantic':
                                // Focus on semantic relationships
                                if (areSemanticallySimilar(tokens[i], tokens[j])) {
                                    weight = 0.7 + Math.random() * 0.3;
                                }
                                break;
                            case 'long_range':
                                // Focus on distant dependencies
                                const distance = Math.abs(i - j);
                                if (distance > 3) {
                                    weight = Math.max(0.6, 0.9 - distance * 0.1) + Math.random() * 0.1;
                                }
                                break;
                            case 'local':
                                // Focus on adjacent words
                                if (Math.abs(i - j) <= 2) {
                                    weight = 0.8 + Math.random() * 0.2;
                                }
                                break;
                            case 'entities':
                                // Focus on named entities and important nouns
                                if (isImportantEntity(tokens[i]) && isImportantEntity(tokens[j])) {
                                    weight = 0.9 + Math.random() * 0.1;
                                }
                                break;
                            case 'temporal':
                                // Focus on temporal indicators
                                if (isTemporalWord(tokens[i]) || isTemporalWord(tokens[j])) {
                                    weight = 0.7 + Math.random() * 0.2;
                                }
                                break;
                            case 'causal':
                                // Focus on causal relationships
                                if (isCausalWord(tokens[i]) || isCausalWord(tokens[j])) {
                                    weight = 0.8 + Math.random() * 0.2;
                                }
                                break;
                            case 'modifiers':
                                // Focus on adjectives and adverbs
                                if (isModifier(tokens[i]) || isModifier(tokens[j])) {
                                    weight = 0.7 + Math.random() * 0.2;
                                }
                                break;
                            case 'clauses':
                                // Focus on clause boundaries
                                if (isClauseBoundary(tokens, i) || isClauseBoundary(tokens, j)) {
                                    weight = 0.6 + Math.random() * 0.3;
                                }
                                break;
                            case 'subobj':
                                // Focus on subject-object relationships
                                if (isSubjectObject(tokens, i, j)) {
                                    weight = 0.8 + Math.random() * 0.2;
                                }
                                break;
                            case 'negation':
                                // Focus on negation scope
                                if (isNegationRelated(tokens, i, j)) {
                                    weight = 0.7 + Math.random() * 0.2;
                                }
                                break;
                            case 'questions':
                                // Focus on question words and structure
                                if (isQuestionRelated(tokens[i]) || isQuestionRelated(tokens[j])) {
                                    weight = 0.8 + Math.random() * 0.2;
                                }
                                break;
                            default:
                                weight = 0.2 + Math.random() * 0.4;
                        }
                        
                        // Self-attention (diagonal) tends to be higher
                        if (i === j) {
                            weight = Math.max(weight, 0.5);
                        }
                        
                        tokenWeights.push(weight);
                    });
                    
                    // Normalize weights to sum to 1
                    const sum = tokenWeights.reduce((a, b) => a + b, 0);
                    weights.push(tokenWeights.map(w => w / sum));
                });
                
                return weights;
            }

            // Helper functions for pattern recognition
            function isVerbAdjacent(tokens, i, j) {
                const verbs = ['sat', 'jumps', 'was', 'decided', 'helped', 'think', 'should', 'consider', 'require', 'could', 'solve', 'read'];
                return Math.abs(i - j) === 1 && (verbs.includes(tokens[i].toLowerCase()) || verbs.includes(tokens[j].toLowerCase()));
            }

            function isArticleNoun(tokens, i, j) {
                const articles = ['the', 'a', 'an'];
                return Math.abs(i - j) <= 2 && articles.includes(tokens[i].toLowerCase());
            }

            function areSemanticallySimilar(token1, token2) {
                const semanticGroups = [
                    ['cat', 'dog', 'fox', 'animal'],
                    ['quick', 'fast', 'rapid'],
                    ['brown', 'lazy', 'kind'],
                    ['teacher', 'student', 'person'],
                    ['book', 'data', 'information'],
                    ['machine', 'learning', 'models', 'training']
                ];
                
                return semanticGroups.some(group => 
                    group.includes(token1.toLowerCase()) && group.includes(token2.toLowerCase())
                );
            }

            function isImportantEntity(token) {
                const entities = ['John', 'Mary', 'cat', 'teacher', 'fox', 'dog', 'book', 'machine', 'models'];
                return entities.includes(token) || token[0] === token[0].toUpperCase();
            }

            function isTemporalWord(token) {
                const temporal = ['yesterday', 'week', 'last', 'when', 'while', 'during', 'after', 'before'];
                return temporal.includes(token.toLowerCase());
            }

            function isCausalWord(token) {
                const causal = ['because', 'since', 'although', 'therefore', 'so', 'thus', 'consequently'];
                return causal.includes(token.toLowerCase());
            }

            function isModifier(token) {
                const modifiers = ['quick', 'brown', 'lazy', 'very', 'definitely', 'extensive', 'kind', 'fascinating'];
                return modifiers.includes(token.toLowerCase());
            }

            function isClauseBoundary(tokens, index) {
                const boundaries = ['who', 'that', 'which', 'although', 'because', 'when', 'while'];
                return boundaries.includes(tokens[index].toLowerCase());
            }

            function isSubjectObject(tokens, i, j) {
                const subjects = ['cat', 'fox', 'dog', 'teacher', 'John', 'Mary', 'I', 'you', 'she'];
                const objects = ['mat', 'problem', 'proposal', 'data', 'book'];
                return (subjects.includes(tokens[i]) && objects.includes(tokens[j])) ||
                       (objects.includes(tokens[i]) && subjects.includes(tokens[j]));
            }

            function isNegationRelated(tokens, i, j) {
                const negation = ['not', 'never', 'neither', 'nor', 'no'];
                const distance = Math.abs(i - j);
                return distance <= 3 && (negation.includes(tokens[i].toLowerCase()) || negation.includes(tokens[j].toLowerCase()));
            }

            function isQuestionRelated(token) {
                const questions = ['who', 'what', 'when', 'where', 'why', 'how', 'which'];
                return questions.includes(token.toLowerCase());
            }

            // Update visual indicators for heads selection
            function updateHeadsVisuals() {
                const selected = document.querySelector('input[name="q22-heads"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q22-heads"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update heads indicator
                if (headsIndicator) {
                    headsIndicator.textContent = `${selectedValue} Heads`;
                }
            }

            // Create attention visualization for multiple heads
            function createMultiHeadVisualization(tokens, numHeads) {
                const container = document.createElement('div');
                container.className = 'space-y-6';

                // Create sentence display
                const sentenceDisplay = document.createElement('div');
                sentenceDisplay.className = 'bg-white border border-gray-200 rounded-lg p-4';
                sentenceDisplay.innerHTML = `
                    <h5 class="font-medium text-gray-900 mb-3">Input Sentence</h5>
                    <div class="flex flex-wrap gap-2">
                        ${tokens.map((token, i) => `
                            <span class="px-2 py-1 bg-gray-100 rounded text-sm font-mono border" id="token-${i}">
                                ${token}
                            </span>
                        `).join('')}
                    </div>
                `;
                container.appendChild(sentenceDisplay);

                // Create heads grid with better responsive layout
                const headsGrid = document.createElement('div');
                const gridCols = numHeads <= 4 ? numHeads : (numHeads <= 8 ? 4 : 3);
                headsGrid.className = `grid grid-cols-1 md:grid-cols-${gridCols} gap-4`;

                for (let h = 0; h < numHeads; h++) {
                    const specialization = headSpecializations[h % 12];
                    const weights = generateAttentionWeights(tokens, h, numHeads);
                    
                    const headCard = document.createElement('div');
                    headCard.className = 'bg-white border border-gray-200 rounded-lg p-3';
                    
                    // Head header
                    const header = document.createElement('div');
                    header.className = 'flex items-center justify-between mb-3';
                    header.innerHTML = `
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded" style="background-color: ${specialization.color}"></div>
                            <span class="font-medium text-sm">Head ${h + 1}</span>
                        </div>
                        <span class="text-xs text-gray-500">${specialization.name}</span>
                    `;
                    
                    // Create attention matrix visualization (simplified but readable)
                    const matrixViz = document.createElement('div');
                    matrixViz.className = 'space-y-1';
                    
                    // Only show matrix if we have reasonable number of tokens
                    if (tokens.length <= 8) {
                        tokens.forEach((fromToken, i) => {
                            const row = document.createElement('div');
                            row.className = 'flex gap-1';
                            
                            tokens.forEach((toToken, j) => {
                                const cell = document.createElement('div');
                                const cellSize = tokens.length <= 6 ? 'w-8 h-8' : 'w-6 h-6';
                                cell.className = `${cellSize} rounded text-xs flex items-center justify-center cursor-pointer transition-all hover:scale-110`;
                                const attention = weights[i][j];
                                
                                // Better color intensity and contrast
                                const opacity = Math.max(0.15, Math.min(0.95, attention * 1.2));
                                cell.style.backgroundColor = specialization.color;
                                cell.style.opacity = opacity;
                                cell.title = `${fromToken} → ${toToken}: ${(attention * 100).toFixed(1)}%`;
                                
                                // Better visibility for high attention
                                if (attention > 0.25) {
                                    cell.style.color = opacity > 0.6 ? 'white' : '#333';
                                    cell.style.fontWeight = 'bold';
                                    cell.textContent = attention > 0.4 ? '●' : '•';
                                }
                                
                                row.appendChild(cell);
                            });
                            
                            matrixViz.appendChild(row);
                        });
                    } else {
                        // For longer sentences, show simplified representation
                        const simplifiedViz = document.createElement('div');
                        simplifiedViz.className = 'text-xs text-gray-600 p-2 bg-gray-50 rounded';
                        simplifiedViz.textContent = `Matrix too large to display (${tokens.length}×${tokens.length}). See key attention pairs below.`;
                        matrixViz.appendChild(simplifiedViz);
                    }
                    
                    // Add top attention pairs for this head
                    const topAttentions = [];
                    weights.forEach((row, i) => {
                        row.forEach((weight, j) => {
                            if (i !== j && weight > 0.3) { // Lower threshold for more examples
                                topAttentions.push({
                                    from: tokens[i],
                                    to: tokens[j],
                                    weight: weight,
                                    fromIdx: i,
                                    toIdx: j
                                });
                            }
                        });
                    });
                    
                    topAttentions.sort((a, b) => b.weight - a.weight);
                    
                    const topPairs = document.createElement('div');
                    topPairs.className = 'mt-2 text-xs';
                    if (topAttentions.length > 0) {
                        const maxPairs = Math.min(3, topAttentions.length);
                        topPairs.innerHTML = `
                            <div class="font-medium text-gray-700 mb-1">Top Attention:</div>
                            ${topAttentions.slice(0, maxPairs).map((att, idx) => 
                                `<div class="text-gray-600">
                                    ${idx + 1}. ${att.from} → ${att.to} <span class="font-medium">(${(att.weight * 100).toFixed(0)}%)</span>
                                </div>`
                            ).join('')}
                        `;
                    } else {
                        topPairs.innerHTML = `
                            <div class="text-gray-500">
                                <div class="font-medium mb-1">Attention Pattern:</div>
                                <div>Diffuse attention across all tokens</div>
                            </div>
                        `;
                    }
                    
                    headCard.appendChild(header);
                    headCard.appendChild(matrixViz);
                    headCard.appendChild(topPairs);
                    headsGrid.appendChild(headCard);
                }

                container.appendChild(headsGrid);

                // Add combined attention analysis
                const analysisCard = document.createElement('div');
                analysisCard.className = 'bg-blue-50 p-4 rounded border-l-4 border-blue-400';
                analysisCard.innerHTML = `
                    <h5 class="font-medium text-blue-900 mb-2">Multi-Head Analysis</h5>
                    <div class="text-sm text-blue-800">
                        With ${numHeads} heads, the model can simultaneously capture:
                        <ul class="mt-2 space-y-1">
                            ${Array.from({length: numHeads}, (_, i) => {
                                const spec = headSpecializations[i % 12];
                                return `<li>• <strong>Head ${i + 1}:</strong> ${spec.name.toLowerCase()}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                `;
                container.appendChild(analysisCard);

                return container;
            }

            // Add statistics display
            function createStatistics(tokens, numHeads) {
                const stats = document.createElement('div');
                stats.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white rounded border text-sm mt-4';
                
                const dModel = 768; // Standard BERT/GPT model dimension
                const dHead = Math.floor(dModel / numHeads);
                const totalParams = numHeads * 3 * dModel * dHead; // 3 for Q, K, V projections
                
                stats.innerHTML = `
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">${tokens.length}</div>
                        <div class="text-gray-600">Tokens</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">${numHeads}</div>
                        <div class="text-gray-600">Heads</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">${dHead}</div>
                        <div class="text-gray-600">Head Dim</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">${(totalParams / 1000000).toFixed(1)}M</div>
                        <div class="text-gray-600">Parameters</div>
                    </div>
                `;
                
                return stats;
            }

            // Main processing function
            // Helper: re-typeset MathJax for any static/dynamic fragments in scope
            const typesetMath = () => {
                if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                    const scope = answerRoot || document.body;
                    setTimeout(() => window.MathJax.typesetPromise([scope]).catch(() => {}), 0);
                }
            };

            const processAndDisplay = () => {
                const text = input.value.trim();
                const numHeads = getCurrentHeads();
                
                // Clear previous results
                output.innerHTML = '';
                if (legend) legend.innerHTML = '';
                
                updateHeadsVisuals();

                if (!text) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Select a sentence to analyze multi-head attention...</div>';
                    return;
                }

                // Tokenize the input
                const tokens = tokenizeText(text);

                if (tokens.length === 0) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">No valid tokens found...</div>';
                    return;
                }

                // Create and display visualization
                const visualization = createMultiHeadVisualization(tokens, numHeads);
                output.appendChild(visualization);

                // Add statistics
                const statistics = createStatistics(tokens, numHeads);
                output.appendChild(statistics);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        <div class="flex items-center gap-4 text-gray-600 flex-wrap">
                            <div class="text-xs">Matrix cells are tinted by head color; opacity encodes attention strength.</div>
                            <div class="flex items-center gap-2">
                                <span class="w-3 h-3 inline-block rounded" style="background-color:#000;opacity:0.2"></span>
                                <span class="text-xs">Low</span>
                                <span class="w-3 h-3 inline-block rounded ml-3" style="background-color:#000;opacity:0.8"></span>
                                <span class="text-xs">High</span>
                            </div>
                            <div class="text-xs">• / ● marks strong connections</div>
                        </div>`;
                }

                // Update educational explanation
                updateExplanation(numHeads, tokens);
                // Typeset any math in static chips (displayed in answer) if needed
                typesetMath();
            };

            // Update the educational explanation based on selected configuration
            function updateExplanation(numHeads, tokens) {
                if (!explanation) return;
                
                const complexity = tokens.length > 6 ? 'complex' : 'simple';
                
                let explanationText = `
                    <strong>${numHeads}-Head Configuration Analysis:</strong><br>
                `;
                
                if (numHeads === 4) {
                    explanationText += `
                        With 4 heads, the model has basic multi-perspective processing:
                        <br>• <strong>Pros:</strong> Faster computation, fewer parameters, good for simple tasks
                        <br>• <strong>Cons:</strong> Limited specialization, may miss complex patterns
                        <br>• <strong>Best for:</strong> Short sequences, simple linguistic structures, resource-constrained environments
                    `;
                } else if (numHeads === 8) {
                    explanationText += `
                        With 8 heads, the model achieves balanced multi-perspective analysis:
                        <br>• <strong>Pros:</strong> Good balance of specialization and efficiency, captures diverse patterns
                        <br>• <strong>Cons:</strong> Moderate computational cost
                        <br>• <strong>Best for:</strong> General-purpose language understanding, most NLP tasks
                    `;
                } else {
                    explanationText += `
                        With 12 heads, the model has highly specialized attention mechanisms:
                        <br>• <strong>Pros:</strong> Maximum pattern diversity, excellent for complex linguistic phenomena
                        <br>• <strong>Cons:</strong> Higher computational cost, potential redundancy
                        <br>• <strong>Best for:</strong> Complex reasoning tasks, long sequences, nuanced language understanding
                    `;
                }
                
                explanationText += `<br><br>For this ${complexity} sentence, notice how different heads focus on different relationships!`;
                
                explanation.innerHTML = explanationText;
            }

            // Event listeners
            input.addEventListener('change', processAndDisplay);
            headsRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateHeadsVisuals();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateHeadsVisuals();
            processAndDisplay();
            // Ensure any static formulas are rendered
            typesetMath();
        }
    }
};

// Optional (safe) export for Node-based tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
