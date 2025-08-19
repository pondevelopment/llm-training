// Question 21: Positional Encodings in Transformers
// Created: July 13, 2025
// Educational Focus: Understanding why and how positional encodings solve the order problem in self-attention

const question = {
    title: "21. What are positional encodings, and why are they used?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related topics)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-07" class="text-indigo-700 underline hover:text-indigo-900">Question 7: Embeddings and semantic meaning</a></li>
                <li><a href="#question-10" class="text-indigo-700 underline hover:text-indigo-900">Question 10: Embeddings and initialization in LLMs</a></li>
                <li><a href="#question-22" class="text-indigo-700 underline hover:text-indigo-900">Question 22: Multi-head attention</a></li>
                <li><a href="#question-32" class="text-indigo-700 underline hover:text-indigo-900">Question 32: Attention score calculation</a></li>
                <li><a href="#question-46" class="text-indigo-700 underline hover:text-indigo-900">Question 46: Encoders vs decoders in transformers</a></li>
            </ul>
        </div>
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
                <div class="text-xs bg-green-100 px-2 py-1 rounded border text-center overflow-x-auto whitespace-nowrap">$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{\\frac{2i}{d_{\\text{model}}}}}\\right),\\; PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{\\frac{2i}{d_{\\text{model}}}}}\\right)$$</div>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Learned Embeddings</h5>
                <p class="text-sm text-purple-700">Trainable position vectors that the model learns during training, similar to word embeddings.</p>
                <div class="text-xs bg-purple-100 px-2 py-1 rounded border text-center overflow-x-auto whitespace-nowrap">$$ pos_{emb} = \\mathrm{Embedding}(max_{len},\ d_{model}) $$</div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Relative Encodings</h5>
                <p class="text-sm text-orange-700">Focus on relative distances between tokens rather than absolute positions. Examples include RoPE (rotary) and ALiBi (additive bias).</p>
                <div class="text-xs bg-orange-100 px-2 py-1 rounded border text-center overflow-x-auto whitespace-nowrap">$$\\text{Attn}(q_i, k_j) \\mathrel{+}= b(i-j)$$</div>
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
                            <div class="text-xs mt-2 bg-gray-100 px-2 py-1 rounded overflow-x-auto whitespace-nowrap">$$ \\sin\\!\\left( \\frac{pos}{10000^{2i/d}} \\right) $$</div>
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
                            <div class="text-xs mt-2 bg-gray-100 px-2 py-1 rounded overflow-x-auto whitespace-nowrap">$$ \\mathrm{Embedding}(max_{len},\ d_{model}) $$</div>
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
                            <div class="text-xs mt-2 bg-gray-100 px-2 py-1 rounded overflow-x-auto whitespace-nowrap">\( r(i{-}j) \)</div>
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
                <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <h4 class="font-medium text-gray-900">🎨 Positional Encoding Visualization</h4>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 text-xs">
                            <label for="q21-viz-mode" class="text-gray-500">View</label>
                            <select id="q21-viz-mode" class="px-2 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="bars" selected>Bars</option>
                                <option value="heatmap">Heatmap</option>
                                <option value="wave">Wave</option>
                            </select>
                        </div>
                        <div id="q21-encoding-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                    </div>
                </div>
                <div id="q21-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300" aria-live="polite"></div>
                <div id="q21-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="q21-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Why This Encoding Type?</h4>
                <div id="q21-explanation" class="text-sm text-yellow-800" aria-live="polite"></div>
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
            const answerRoot = document.getElementById('question-answer');
            const vizModeSelect = document.getElementById('q21-viz-mode');

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

            // Visualization helpers
            function createBarVisualization(tokens, encodingType) {
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
                        bar.className = 'flex-1 relative bg-gray-100 rounded overflow-hidden';
                        bar.style.height = '40px';

                        // Create a center baseline (optional visual aid)
                        const baseline = document.createElement('div');
                        baseline.className = 'absolute left-0 right-0';
                        baseline.style.top = '50%';
                        baseline.style.height = '1px';
                        baseline.style.background = 'rgba(0,0,0,0.06)';
                        bar.appendChild(baseline);

                        const fill = document.createElement('div');
                        const magnitude = Math.abs(value);
                        fill.style.backgroundColor = value >= 0 ? '#ef4444' /* red-500 */ : '#3b82f6' /* blue-500 */;
                        fill.style.opacity = Math.max(0.2, magnitude);
                        // Height relative to half container (center baseline)
                        const halfHeightPct = magnitude * 50;
                        fill.style.height = `${halfHeightPct}%`;
                        fill.className = 'absolute left-0 right-0 transition-all duration-300';
                        // Anchor to bottom for positive, top for negative
                        if (value >= 0) {
                            fill.style.bottom = '50%';
                            fill.style.borderTopLeftRadius = '4px';
                            fill.style.borderTopRightRadius = '4px';
                        } else {
                            fill.style.top = '0';
                            // Position from top toward center baseline
                            fill.style.bottom = '50%';
                            fill.style.transform = `translateY(${50 - halfHeightPct}%)`;
                            fill.style.borderBottomLeftRadius = '4px';
                            fill.style.borderBottomRightRadius = '4px';
                        }

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

            function valueToHeatColor(v) {
                // v in [-1, 1]; blue for negative, white near 0, red for positive
                const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
                const t = clamp((v + 1) / 2, 0, 1); // 0..1
                // Interpolate from blue (#3b82f6) -> white (#ffffff) -> red (#ef4444)
                const lerp = (a, b, t) => Math.round(a + (b - a) * t);
                let r, g, bch;
                if (t < 0.5) {
                    // blue to white
                    const k = t / 0.5;
                    r = lerp(59, 255, k);
                    g = lerp(130, 255, k);
                    bch = lerp(246, 255, k);
                } else {
                    // white to red
                    const k = (t - 0.5) / 0.5;
                    r = lerp(255, 239, k);
                    g = lerp(255, 68, k);
                    bch = lerp(255, 68, k);
                }
                return `rgb(${r}, ${g}, ${bch})`;
            }

            function createHeatmapVisualization(tokens, encodingType) {
                const wrapper = document.createElement('div');
                wrapper.className = 'overflow-x-auto';

                const grid = document.createElement('div');
                grid.className = 'inline-grid gap-px bg-gray-200 rounded';
                const cols = 1 + 8; // token label + 8 dims
                grid.style.gridTemplateColumns = `200px repeat(8, 28px)`;

                // Header
                const headerToken = document.createElement('div');
                headerToken.className = 'text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1';
                headerToken.textContent = 'Token / Dim';
                grid.appendChild(headerToken);
                for (let d = 0; d < 8; d++) {
                    const h = document.createElement('div');
                    h.className = 'text-[10px] text-center text-gray-600 bg-gray-50 px-1 py-1';
                    h.textContent = d;
                    grid.appendChild(h);
                }

                // Rows
                tokens.forEach((token, position) => {
                    const encoding = encodingTypes[encodingType].generateEncoding(position, 8, tokens.length);
                    const norm = normalizeEncoding(encoding);

                    const label = document.createElement('div');
                    label.className = 'text-xs bg-white px-2 py-1 truncate max-w-[200px]';
                    label.textContent = `"${token}" (pos ${position})`;
                    grid.appendChild(label);

                    norm.forEach((v, i) => {
                        const cell = document.createElement('div');
                        cell.className = 'w-7 h-7';
                        cell.style.backgroundColor = valueToHeatColor(v);
                        cell.title = `Dim ${i}: ${encoding[i].toFixed(3)}`;
                        grid.appendChild(cell);
                    });
                });

                wrapper.appendChild(grid);
                return wrapper;
            }

            function createWaveVisualization(tokens, encodingType) {
                const container = document.createElement('div');
                container.className = 'space-y-3';

                tokens.forEach((token, position) => {
                    const encoding = encodingTypes[encodingType].generateEncoding(position, 8, tokens.length);
                    const norm = normalizeEncoding(encoding);

                    const card = document.createElement('div');
                    card.className = 'bg-white border border-gray-200 rounded-lg p-3';

                    const header = document.createElement('div');
                    header.className = 'flex items-center justify-between mb-2';
                    header.innerHTML = `
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-gray-900">"${token}"</span>
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Position ${position}</span>
                        </div>
                        <span class="text-xs text-gray-500">8D Wave</span>
                    `;

                    const svgNS = 'http://www.w3.org/2000/svg';
                    const svg = document.createElementNS(svgNS, 'svg');
                    svg.setAttribute('viewBox', '0 0 320 80');
                    svg.setAttribute('class', 'w-full h-20');

                    // Zero line
                    const zero = document.createElementNS(svgNS, 'line');
                    zero.setAttribute('x1', '0');
                    zero.setAttribute('x2', '320');
                    zero.setAttribute('y1', '40');
                    zero.setAttribute('y2', '40');
                    zero.setAttribute('stroke', 'rgba(0,0,0,0.08)');
                    svg.appendChild(zero);

                    // Polyline across dims
                    const points = norm.map((v, i) => {
                        const x = 20 + i * ((320 - 40) / 7);
                        const y = 40 - v * 35; // scale
                        return `${x},${y}`;
                    }).join(' ');
                    const poly = document.createElementNS(svgNS, 'polyline');
                    poly.setAttribute('points', points);
                    poly.setAttribute('fill', 'none');
                    poly.setAttribute('stroke', encodingTypes[encodingType].color);
                    poly.setAttribute('stroke-width', '2');
                    svg.appendChild(poly);

                    // Points
                    norm.forEach((v, i) => {
                        const cx = 20 + i * ((320 - 40) / 7);
                        const cy = 40 - v * 35;
                        const circle = document.createElementNS(svgNS, 'circle');
                        circle.setAttribute('cx', String(cx));
                        circle.setAttribute('cy', String(cy));
                        circle.setAttribute('r', '3');
                        circle.setAttribute('fill', '#111827');
                        circle.setAttribute('opacity', '0.6');
                        circle.setAttribute('title', `Dim ${i}: ${encoding[i].toFixed(3)}`);
                        svg.appendChild(circle);
                    });

                    card.appendChild(header);
                    card.appendChild(svg);
                    container.appendChild(card);
                });

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

            // Helper: re-typeset MathJax for dynamic and static snippets
            const typesetMath = () => {
                if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                    const scope = answerRoot || document.body;
                    // Defer to ensure DOM is updated
                    setTimeout(() => window.MathJax.typesetPromise([scope]).catch(() => {}), 0);
                }
            };

            // Main processing function
            const processAndDisplay = () => {
                const text = input.value.trim();
                const encodingType = getCurrentEncoding();
                const vizMode = vizModeSelect ? vizModeSelect.value : 'bars';
                
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
                let visualization;
                if (vizMode === 'heatmap') {
                    visualization = createHeatmapVisualization(tokens, encodingType);
                } else if (vizMode === 'wave') {
                    visualization = createWaveVisualization(tokens, encodingType);
                } else {
                    visualization = createBarVisualization(tokens, encodingType);
                }
                output.appendChild(visualization);

                // Add statistics
                const statistics = createStatistics(tokens, encodingType);
                output.appendChild(statistics);

                // Update legend
                if (legend) {
                    if (vizMode === 'heatmap') {
                        legend.innerHTML = `
                            <div class="flex items-center gap-4 text-gray-600">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 inline-block" style="background-color:#3b82f6"></span>
                                    <span class="text-xs">Negative</span>
                                    <span class="w-3 h-3 inline-block ml-3" style="background-color:#ffffff;border:1px solid #e5e7eb"></span>
                                    <span class="text-xs">Zero</span>
                                    <span class="w-3 h-3 inline-block ml-3" style="background-color:#ef4444"></span>
                                    <span class="text-xs">Positive</span>
                                </div>
                                <div class="text-xs">Hover cells for exact values</div>
                            </div>`;
                    } else if (vizMode === 'wave') {
                        legend.innerHTML = `
                            <div class="flex items-center gap-4 text-gray-600">
                                <div class="text-xs">Line connects normalized dimension values; horizontal line marks zero.</div>
                            </div>`;
                    } else {
                        legend.innerHTML = `
                            <div class="flex items-center gap-4 text-gray-600">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 inline-block" style="background-color:#ef4444"></span>
                                    <span class="text-xs">Positive</span>
                                    <span class="w-3 h-3 inline-block ml-3" style="background-color:#3b82f6"></span>
                                    <span class="text-xs">Negative</span>
                                </div>
                                <div class="text-xs">Bars grow away from center baseline</div>
                            </div>`;
                    }
                }

                // Update educational explanation
                updateExplanation(encodingType);

                // Re-typeset any math fragments that might be present
                typesetMath();
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
            if (vizModeSelect) {
                vizModeSelect.addEventListener('change', processAndDisplay);
            }
            
            // Initial setup
            updateEncodingVisuals();
            processAndDisplay();
            // Ensure initial static formulas are typeset (e.g., learned/relative snippets)
            typesetMath();
        }
    }
};

// Optional (safe) export for Node-based tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
