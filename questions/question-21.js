// Question 21: Positional Encodings in Transformers
// Created: July 13, 2025
// Educational Focus: Understanding why and how positional encodings solve the order problem in self-attention

const question = {
    title: "21. What are positional encodings, and why are they used?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">📍 What are Positional Encodings?</h4>
            <p class="text-blue-800">Positional encodings are mathematical representations added to token embeddings to give transformers a sense of word order. Think of them like GPS coordinates for words - they tell the model where each word sits in the sequence, since self-attention naturally treats all positions equally.</p>
        </div>
        
        <!-- Types of Positional Encodings -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Sinusoidal (Fixed)</h5>
                <p class="text-sm text-green-700">Uses sine and cosine functions with different frequencies to create unique patterns for each position.</p>
                <code class="text-xs bg-green-100 px-1 rounded">PE(pos,2i) = sin(pos/10000^(2i/d))</code>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Learned Embeddings</h5>
                <p class="text-sm text-purple-700">Trainable position vectors that the model learns during training, similar to word embeddings.</p>
                <code class="text-xs bg-purple-100 px-1 rounded">pos_emb = Embedding(max_len, d_model)</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Relative Encodings</h5>
                <p class="text-sm text-orange-700">Focus on relative distances between tokens rather than absolute positions.</p>
                <code class="text-xs bg-orange-100 px-1 rounded">attention(qi, kj) += r(i-j)</code>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Positional Encodings Matter</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Order Awareness:</strong> Self-attention is permutation-invariant, treating "The king wore a crown" the same as "Crown a wore king the"</li>
                <li>• <strong>Sequence Understanding:</strong> Essential for tasks like translation where word order completely changes meaning</li>
                <li>• <strong>Mathematical Elegance:</strong> Sinusoidal encodings allow models to extrapolate to longer sequences than seen during training</li>
                <li>• <strong>Efficiency:</strong> Adding encodings is computationally cheaper than modifying the attention mechanism itself</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🧮 Interactive Positional Encoding Visualizer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q21-text-select" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose a Sentence to Analyze</label>
                <select id="q21-text-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="The king wore a crown">The king wore a crown (Order matters for meaning)</option>
                    <option value="Hello world from transformers">Hello world from transformers (Simple greeting)</option>
                    <option value="A B C D E F">A B C D E F (Clear sequential pattern)</option>
                    <option value="Machine learning is amazing technology">Machine learning is amazing technology (Technical terms)</option>
                    <option value="The quick brown fox jumps">The quick brown fox jumps (Classic test phrase)</option>
                    <option value="I love natural language processing">I love natural language processing (Longer sequence)</option>
                    <option value="Position matters in transformers">Position matters in transformers (Self-referential)</option>
                    <option value="Short">Short (Single word)</option>
                    <option value="Two words">Two words (Minimal pair)</option>
                    <option value="Very long sentence with many tokens to demonstrate encoding">Very long sentence with many tokens to demonstrate encoding (Extended length)</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Each example demonstrates different aspects of positional encoding!</p>
            </div>
            
            <!-- Encoding Type Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Positional Encoding Type</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q21-encoding" value="sinusoidal" checked class="absolute top-2 right-2">
                        <div class="encoding-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Sinusoidal</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Original</span>
                            </div>
                            <p class="text-xs text-gray-600">Fixed mathematical patterns using sine and cosine waves</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                sin(pos/10000^(2i/d))
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q21-encoding" value="learned" class="absolute top-2 right-2">
                        <div class="encoding-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Learned</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Trainable</span>
                            </div>
                            <p class="text-xs text-gray-600">Position embeddings learned during training</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                Embedding(max_len, d_model)
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q21-encoding" value="relative" class="absolute top-2 right-2">
                        <div class="encoding-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Relative</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Distance</span>
                            </div>
                            <p class="text-xs text-gray-600">Based on relative distances between tokens</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                r(i-j) distance bias
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Info -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Tip:</span>
                <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Try different sentences and encoding types to see how patterns change!</span>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Positional Encoding Visualization</h4>
                    <div id="q21-encoding-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q21-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                <div id="q21-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="q21-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Why This Encoding Type?</h4>
                <div id="q21-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const input = document.getElementById('q21-text-select');
            const output = document.getElementById('q21-output');
            const encodingRadios = document.querySelectorAll('input[name="q21-encoding"]');
            const encodingIndicator = document.getElementById('q21-encoding-indicator');
            const legend = document.getElementById('q21-legend');
            const explanation = document.getElementById('q21-explanation');

            // Check if required elements exist
            if (!input || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Encoding configuration data
            const encodingTypes = {
                sinusoidal: {
                    name: 'Sinusoidal Encoding',
                    description: 'Fixed mathematical patterns that create unique signatures for each position using sine and cosine functions.',
                    color: '#10b981', // green
                    generateEncoding: (position, dimension = 8) => {
                        const encoding = [];
                        for (let i = 0; i < dimension; i++) {
                            const angle = position / Math.pow(10000, (2 * Math.floor(i/2)) / dimension);
                            encoding.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
                        }
                        return encoding;
                    }
                },
                learned: {
                    name: 'Learned Embedding',
                    description: 'Trainable position vectors that the model learns during training, optimized for the specific task.',
                    color: '#8b5cf6', // purple
                    generateEncoding: (position, dimension = 8) => {
                        // Simulate learned embeddings with some randomness but consistency
                        const encoding = [];
                        const seed = position * 42; // Consistent seed per position
                        for (let i = 0; i < dimension; i++) {
                            // Use position and dimension index to create pseudo-random but consistent values
                            const value = Math.sin(seed + i * 1.7) * 0.8 + Math.cos(seed * 0.3 + i) * 0.2;
                            encoding.push(value);
                        }
                        return encoding;
                    }
                },
                relative: {
                    name: 'Relative Encoding',
                    description: 'Focuses on the distance between positions rather than absolute positions, useful for longer sequences.',
                    color: '#f59e0b', // orange
                    generateEncoding: (position, dimension = 8, totalPositions = 5) => {
                        const encoding = [];
                        for (let i = 0; i < dimension; i++) {
                            // Relative encoding based on distance from center
                            const center = Math.floor(totalPositions / 2);
                            const distance = Math.abs(position - center);
                            const value = Math.exp(-distance / 2) * Math.sin(i * Math.PI / 4 + distance);
                            encoding.push(value);
                        }
                        return encoding;
                    }
                }
            };

            // Helper function to get current encoding type
            function getCurrentEncoding() {
                const selectedRadio = document.querySelector('input[name="q21-encoding"]:checked');
                return selectedRadio ? selectedRadio.value : 'sinusoidal';
            }

            // Helper function to tokenize text (simple word splitting)
            function tokenizeText(text) {
                return text.trim().split(/\s+/).filter(token => token.length > 0);
            }

            // Helper function to normalize encoding values for visualization
            function normalizeEncoding(encoding) {
                const max = Math.max(...encoding.map(Math.abs));
                return encoding.map(val => val / (max || 1));
            }

            // Update visual indicators for encoding selection
            function updateEncodingVisuals() {
                const selected = document.querySelector('input[name="q21-encoding"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q21-encoding"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update encoding indicator
                if (encodingIndicator && encodingTypes[selectedValue]) {
                    encodingIndicator.textContent = encodingTypes[selectedValue].name;
                }
            }

            // Create visual representation of encoding
            function createEncodingVisualization(tokens, encodingType) {
                const container = document.createElement('div');
                container.className = 'space-y-4';

                // Token and position display
                const tokenDisplay = document.createElement('div');
                tokenDisplay.className = 'space-y-3';

                tokens.forEach((token, position) => {
                    const encoding = encodingTypes[encodingType].generateEncoding(position, 8, tokens.length);
                    const normalizedEncoding = normalizeEncoding(encoding);

                    const tokenCard = document.createElement('div');
                    tokenCard.className = 'bg-white border border-gray-200 rounded-lg p-3';

                    // Token header
                    const header = document.createElement('div');
                    header.className = 'flex items-center justify-between mb-2';
                    header.innerHTML = `
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-900">"${token}"</span>
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Position ${position}</span>
                        </div>
                        <span class="text-xs text-gray-500">8D Encoding</span>
                    `;

                    // Encoding visualization
                    const encodingViz = document.createElement('div');
                    encodingViz.className = 'flex gap-1 mb-2';
                    
                    normalizedEncoding.forEach((value, i) => {
                        const bar = document.createElement('div');
                        bar.className = 'flex-1 relative';
                        bar.style.height = '40px';
                        
                        const fill = document.createElement('div');
                        fill.style.height = `${Math.abs(value) * 100}%`;
                        fill.style.backgroundColor = encodingTypes[encodingType].color;
                        fill.style.opacity = Math.abs(value);
                        fill.className = `rounded transition-all duration-300 ${value >= 0 ? 'self-end' : 'self-start'}`;
                        
                        bar.appendChild(fill);
                        bar.title = `Dim ${i}: ${value.toFixed(3)}`;
                        encodingViz.appendChild(bar);
                    });

                    // Raw values
                    const rawValues = document.createElement('div');
                    rawValues.className = 'text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded';
                    rawValues.textContent = `[${encoding.map(v => v.toFixed(2)).join(', ')}]`;

                    tokenCard.appendChild(header);
                    tokenCard.appendChild(encodingViz);
                    tokenCard.appendChild(rawValues);
                    tokenDisplay.appendChild(tokenCard);
                });

                container.appendChild(tokenDisplay);

                // Pattern Analysis
                const analysis = document.createElement('div');
                analysis.className = 'bg-blue-50 p-3 rounded border-l-4 border-blue-400 mt-4';
                
                let analysisText = '';
                switch (encodingType) {
                    case 'sinusoidal':
                        analysisText = `
                            <strong>Sinusoidal Pattern:</strong> Each position has a unique mathematical signature. 
                            Notice how the pattern changes systematically with position - this allows the model to 
                            interpolate positions it hasn't seen during training.
                        `;
                        break;
                    case 'learned':
                        analysisText = `
                            <strong>Learned Pattern:</strong> These embeddings would be optimized during training. 
                            The model learns what positional information is most useful for the specific task, 
                            potentially capturing task-specific positional relationships.
                        `;
                        break;
                    case 'relative':
                        analysisText = `
                            <strong>Relative Pattern:</strong> Notice how the encodings reflect distance from the center. 
                            This approach helps the model understand relative positions, which can be more important 
                            than absolute positions for many language tasks.
                        `;
                        break;
                }
                
                analysis.innerHTML = `<div class="text-sm text-blue-800">${analysisText}</div>`;
                container.appendChild(analysis);

                return container;
            }

            // Add statistics display
            function createStatistics(tokens, encodingType) {
                const stats = document.createElement('div');
                stats.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white rounded border text-sm mt-4';
                
                stats.innerHTML = `
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">${tokens.length}</div>
                        <div class="text-gray-600">Tokens</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">8</div>
                        <div class="text-gray-600">Dimensions</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">${encodingType === 'sinusoidal' ? '∞' : tokens.length}</div>
                        <div class="text-gray-600">Max Length</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">${encodingType === 'learned' ? 'Yes' : 'No'}</div>
                        <div class="text-gray-600">Trainable</div>
                    </div>
                `;
                
                return stats;
            }

            // Main processing function
            const processAndDisplay = () => {
                const text = input.value.trim();
                const encodingType = getCurrentEncoding();
                
                // Clear previous results
                output.innerHTML = '';
                if (legend) legend.innerHTML = '';
                
                updateEncodingVisuals();

                if (!text) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Enter some text to see positional encodings...</div>';
                    return;
                }

                // Tokenize the input
                const tokens = tokenizeText(text);

                if (tokens.length === 0) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">No valid tokens found...</div>';
                    return;
                }

                // Create and display visualization
                const visualization = createEncodingVisualization(tokens, encodingType);
                output.appendChild(visualization);

                // Add statistics
                const statistics = createStatistics(tokens, encodingType);
                output.appendChild(statistics);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        <div class="flex items-center gap-4 text-gray-600">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded" style="background-color: ${encodingTypes[encodingType].color}"></div>
                                <span>Encoding Values</span>
                            </div>
                            <div class="text-xs">Hover over bars for exact values</div>
                        </div>
                    `;
                }

                // Update educational explanation
                updateExplanation(encodingType);
            };

            // Update the educational explanation based on selected encoding
            function updateExplanation(encodingType) {
                if (!explanation) return;
                
                const explanations = {
                    'sinusoidal': `
                        <strong>Sinusoidal Encoding</strong> uses sine and cosine functions to create unique patterns for each position.
                        <br>• <strong>Pros:</strong> No training needed, extrapolates to unseen sequence lengths, mathematically elegant
                        <br>• <strong>Cons:</strong> Fixed patterns may not be optimal for all tasks
                        <br>• <strong>Best for:</strong> General-purpose models, long sequences, mathematical consistency
                    `,
                    'learned': `
                        <strong>Learned Embeddings</strong> treat positions like vocabulary tokens with trainable embeddings.
                        <br>• <strong>Pros:</strong> Optimized for specific tasks, can capture complex positional relationships
                        <br>• <strong>Cons:</strong> Limited to training sequence length, requires more parameters
                        <br>• <strong>Best for:</strong> Fixed-length tasks, when you have domain-specific positional patterns
                    `,
                    'relative': `
                        <strong>Relative Encoding</strong> focuses on distances between positions rather than absolute positions.
                        <br>• <strong>Pros:</strong> Better generalization, captures relative relationships, good for long sequences
                        <br>• <strong>Cons:</strong> More complex to implement, may lose some absolute position information
                        <br>• <strong>Best for:</strong> Long documents, tasks where relative position matters more than absolute
                    `
                };
                
                explanation.innerHTML = explanations[encodingType] || '';
            }

            // Event listeners
            input.addEventListener('change', processAndDisplay);
            encodingRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateEncodingVisuals();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateEncodingVisuals();
            processAndDisplay();
        }
    }
};
