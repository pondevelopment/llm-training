// Question 32: How are attention scores calculated in transformers?
// Created: July 16, 2025
// Educational Focus: Transformer attention mechanism, Q/K/V matrices, scaled dot-product attention

const question = {
    title: "32. How are attention scores calculated in transformers?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What is Transformer Attention?</h4>
            <p class="text-blue-800">Attention in transformers is a mechanism that allows the model to <strong>focus on different parts of the input sequence</strong> when processing each token. It's computed using three matrices: <strong>Query (Q)</strong>, <strong>Key (K)</strong>, and <strong>Value (V)</strong>. Think of it like a search engine: the Query asks "what am I looking for?", Keys answer "what information do I contain?", and Values provide "the actual information to use".</p>
        </div>
        
        <!-- The Core Formula -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-3">📊 The Attention Formula</h4>
            <div class="text-center">
                <div class="bg-gray-50 p-4 rounded-lg">
                    $$\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left(\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}\\right)\\mathbf{V}$$
                </div>
                <p class="text-sm text-gray-600 mt-2">The scaled dot-product attention mechanism that revolutionized NLP</p>
            </div>
        </div>
        
        <!-- Step-by-Step Process -->
        <div class="grid md:grid-cols-4 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">1. Dot Product</h5>
                <p class="text-sm text-green-700 mb-2">Compute similarity between queries and keys</p>
                <div class="text-xs bg-green-100 px-2 py-1 rounded font-mono">
                    $$\\mathbf{Q}\\mathbf{K}^T$$
                </div>
                <p class="text-xs text-green-600 mt-2">🔍 Measures relevance: higher values = more similar</p>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">2. Scale</h5>
                <p class="text-sm text-purple-700 mb-2">Normalize by dimension to prevent saturation</p>
                <div class="text-xs bg-purple-100 px-2 py-1 rounded font-mono">
                    $$\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}$$
                </div>
                <p class="text-xs text-purple-600 mt-2">⚖️ Prevents gradients from vanishing in softmax</p>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">3. Softmax</h5>
                <p class="text-sm text-orange-700 mb-2">Convert to probability distribution</p>
                <div class="text-xs bg-orange-100 px-2 py-1 rounded font-mono">
                    $$\\text{softmax}(\\text{scores})$$
                </div>
                <p class="text-xs text-orange-600 mt-2">📊 Creates attention weights that sum to 1</p>
            </div>
            
            <div class="bg-red-50 p-3 rounded border-l-4 border-red-400">
                <h5 class="font-medium text-red-900">4. Weighted Sum</h5>
                <p class="text-sm text-red-700 mb-2">Combine values using attention weights</p>
                <div class="text-xs bg-red-100 px-2 py-1 rounded font-mono">
                    $$\\text{weights} \\cdot \\mathbf{V}$$
                </div>
                <p class="text-xs text-red-600 mt-2">🎯 Final contextualized representation</p>
            </div>
        </div>
        
        <!-- Matrix Dimensions and Relationships -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 class="font-semibold text-indigo-900 mb-2">🔢 Matrix Dimensions</h4>
            <div class="grid md:grid-cols-3 gap-4 text-sm">
                <div class="text-center">
                    <div class="bg-indigo-100 p-3 rounded">
                        <strong>Query (Q)</strong><br>
                        $$[\\text{seq\_len} \\times d_k]$$
                    </div>
                    <p class="text-indigo-700 mt-2">"What am I looking for?"</p>
                </div>
                <div class="text-center">
                    <div class="bg-indigo-100 p-3 rounded">
                        <strong>Key (K)</strong><br>
                        $$[\\text{seq\_len} \\times d_k]$$
                    </div>
                    <p class="text-indigo-700 mt-2">"What information do I have?"</p>
                </div>
                <div class="text-center">
                    <div class="bg-indigo-100 p-3 rounded">
                        <strong>Value (V)</strong><br>
                        $$[\\text{seq\_len} \\times d_v]$$
                    </div>
                    <p class="text-indigo-700 mt-2">"The actual content to use"</p>
                </div>
            </div>
            <p class="text-sm text-indigo-800 mt-3">The attention matrix has dimensions $$[\\text{seq\_len} \\times \\text{seq\_len}]$$, showing how much each position attends to every other position.</p>
        </div>
        
        <!-- Why Scaling Matters -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 class="font-semibold text-red-900 mb-2">⚠️ Why Scale by √d_k?</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm text-red-800">
                <div>
                    <p><strong>Without Scaling:</strong> For large $$d_k$$, dot products grow large, pushing softmax into saturation regions where gradients vanish. This makes training extremely difficult.</p>
                </div>
                <div>
                    <p><strong>With Scaling:</strong> Dividing by $$\\sqrt{d_k}$$ keeps dot products in a reasonable range, ensuring softmax operates in its sensitive region with meaningful gradients.</p>
                </div>
            </div>
            <div class="mt-3 p-3 bg-red-100 rounded">
                <strong>Mathematical Intuition:</strong> If each element of Q and K has variance 1, then $$\\mathbf{Q}\\mathbf{K}^T$$ has variance $$d_k$$. Scaling by $$\\sqrt{d_k}$$ normalizes this back to variance 1.
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Attention Revolutionized NLP</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Global Context:</strong> Unlike RNNs, attention can connect any two positions directly, regardless of distance</li>
                <li>• <strong>Parallelizable:</strong> All attention computations can happen simultaneously, making training much faster</li>
                <li>• <strong>Interpretable:</strong> Attention weights show which parts of input the model is focusing on</li>
                <li>• <strong>Flexible:</strong> Same mechanism works for encoder-decoder, self-attention, and cross-attention scenarios</li>
                <li>• <strong>Dynamic:</strong> Attention patterns adapt based on content, not just position like traditional methods</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Attention Score Calculator",
        html: `<div class="space-y-6">
            <!-- Getting Started Guide -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-green-900">🚀 Getting Started</h4>
                    <button id="q32-toggle-guide" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                        Hide Guide
                    </button>
                </div>
                <div id="q32-guide-content" class="space-y-2 text-sm text-green-800">
                    <p><strong>👋 New to attention?</strong> Start with the "Beginner Example" below to see a simple 2x2 case!</p>
                    <p><strong>🎯 Want to explore?</strong> Try the preset scenarios or adjust the sliders to see how parameters affect attention patterns.</p>
                    <p><strong>🧠 Learning mode:</strong> Use "Step-by-Step" to understand the math, "Heatmap" to visualize patterns, "Comparison" to see why scaling matters.</p>
                </div>
            </div>

            <!-- Preset Scenarios with Clear Use Cases -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">🎭 Try These Scenarios</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button id="q32-beginner" class="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left">
                        <div class="font-medium text-blue-900 text-sm">🐣 Beginner</div>
                        <div class="text-xs text-blue-700 mt-1">2 tokens, simple math</div>
                        <div class="text-xs text-blue-600 mt-1 font-mono">2×2 → Easy to follow</div>
                    </button>
                    
                    <button id="q32-realistic" class="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left">
                        <div class="font-medium text-green-900 text-sm">🎯 Realistic</div>
                        <div class="text-xs text-green-700 mt-1">4 tokens, normal dimension</div>
                        <div class="text-xs text-green-600 mt-1 font-mono">4×4 → Real-world size</div>
                    </button>
                    
                    <button id="q32-focused" class="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left">
                        <div class="font-medium text-orange-900 text-sm">🔥 Focused</div>
                        <div class="text-xs text-orange-700 mt-1">Sharp attention pattern</div>
                        <div class="text-xs text-orange-600 mt-1 font-mono">Low temp → Peaked</div>
                    </button>
                    
                    <button id="q32-distributed" class="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                        <div class="font-medium text-purple-900 text-sm">🌊 Distributed</div>
                        <div class="text-xs text-purple-700 mt-1">Spread attention pattern</div>
                        <div class="text-xs text-purple-600 mt-1 font-mono">High temp → Smooth</div>
                    </button>
                </div>
            </div>
            
            <!-- Interactive Parameters with Real-time Feedback -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h4 class="font-medium text-gray-700 mb-4">🎛️ Attention Parameters</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Left Column: Core Parameters -->
                    <div class="space-y-4">
                        <div class="parameter-group">
                            <div class="flex items-center justify-between mb-2">
                                <label for="q32-seq-length" class="text-sm font-medium text-gray-700">📏 Sequence Length</label>
                                <div class="flex items-center space-x-2">
                                    <span id="q32-seq-length-display" class="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">3</span>
                                    <button class="text-xs text-gray-500 hover:text-gray-700" title="Number of tokens in the sequence">ℹ️</button>
                                </div>
                            </div>
                            <input type="range" id="q32-seq-length" min="2" max="6" step="1" value="3" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2 (minimal)</span>
                                <span>6 (complex)</span>
                            </div>
                            <div id="q32-seq-feedback" class="text-xs text-gray-600 mt-1">Creates a 3×3 attention matrix</div>
                        </div>

                        <div class="parameter-group">
                            <div class="flex items-center justify-between mb-2">
                                <label for="q32-dim-k" class="text-sm font-medium text-gray-700">📐 Key Dimension (d_k)</label>
                                <div class="flex items-center space-x-2">
                                    <span id="q32-dim-k-display" class="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded">4</span>
                                    <button class="text-xs text-gray-500 hover:text-gray-700" title="Dimension of Query and Key vectors">ℹ️</button>
                                </div>
                            </div>
                            <input type="range" id="q32-dim-k" min="2" max="12" step="1" value="4" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2 (toy)</span>
                                <span>12 (large)</span>
                            </div>
                            <div id="q32-dim-feedback" class="text-xs text-gray-600 mt-1">√4 = 2.0 scaling factor</div>
                        </div>
                    </div>

                    <!-- Right Column: Advanced Parameters -->
                    <div class="space-y-4">
                        <div class="parameter-group">
                            <div class="flex items-center justify-between mb-2">
                                <label for="q32-temperature" class="text-sm font-medium text-gray-700">🌡️ Temperature</label>
                                <div class="flex items-center space-x-2">
                                    <span id="q32-temperature-display" class="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">1.0</span>
                                    <button class="text-xs text-gray-500 hover:text-gray-700" title="Controls sharpness of attention distribution">ℹ️</button>
                                </div>
                            </div>
                            <input type="range" id="q32-temperature" min="0.1" max="3.0" step="0.1" value="1.0" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0.1 (sharp)</span>
                                <span>3.0 (smooth)</span>
                            </div>
                            <div id="q32-temp-feedback" class="text-xs text-gray-600 mt-1">Standard temperature (balanced)</div>
                        </div>

                        <div class="parameter-group">
                            <div class="flex items-center justify-between mb-2">
                                <label for="q32-scaling" class="text-sm font-medium text-gray-700">⚖️ Enable √d_k Scaling</label>
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" id="q32-scaling" checked class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                                    <button class="text-xs text-gray-500 hover:text-gray-700" title="Prevents softmax saturation in large dimensions">ℹ️</button>
                                </div>
                            </div>
                            <div id="q32-scaling-feedback" class="text-xs text-gray-600 mt-1 p-2 bg-green-50 rounded">✅ Scaling enabled - prevents gradient vanishing</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Visualization Mode Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-700 mb-3">👀 How Would You Like to See the Results?</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                        <input type="radio" name="q32-mode" value="step-by-step" checked class="absolute top-3 right-3">
                        <div class="visualization-option">
                            <div class="flex items-center mb-3">
                                <span class="text-2xl mr-3">📚</span>
                                <div>
                                    <div class="font-medium text-gray-900">Step-by-Step</div>
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best for Learning</span>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mb-2">See every calculation step with detailed explanations</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Q·K^T → √d_k → Softmax → ·V
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                        <input type="radio" name="q32-mode" value="heatmap" class="absolute top-3 right-3">
                        <div class="visualization-option">
                            <div class="flex items-center mb-3">
                                <span class="text-2xl mr-3">🎨</span>
                                <div>
                                    <div class="font-medium text-gray-900">Attention Heatmap</div>
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Most Visual</span>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mb-2">Color-coded matrix showing attention patterns</p>
                            <div class="flex items-center text-xs">
                                <div class="w-3 h-3 bg-red-400 rounded mr-1"></div>
                                <span class="mr-2">High</span>
                                <div class="w-3 h-3 bg-blue-400 rounded mr-1"></div>
                                <span>Low</span>
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200">
                        <input type="radio" name="q32-mode" value="comparison" class="absolute top-3 right-3">
                        <div class="visualization-option">
                            <div class="flex items-center mb-3">
                                <span class="text-2xl mr-3">⚖️</span>
                                <div>
                                    <div class="font-medium text-gray-900">Scaling Comparison</div>
                                    <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Advanced</span>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mb-2">Side-by-side: with vs without √d_k scaling</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Before vs After scaling
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Attention Computation</h4>
                    <div id="q32-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q32-output" class="min-h-[200px]"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div id="q32-analysis" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Attention Analysis</h4>
                <div id="q32-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const seqLength = document.getElementById('q32-seq-length');
            const dimK = document.getElementById('q32-dim-k');
            const temperature = document.getElementById('q32-temperature');
            const scaling = document.getElementById('q32-scaling');
            const seqLengthDisplay = document.getElementById('q32-seq-length-display');
            const dimKDisplay = document.getElementById('q32-dim-k-display');
            const temperatureDisplay = document.getElementById('q32-temperature-display');
            const modeRadios = document.querySelectorAll('input[name="q32-mode"]');
            
            // New preset buttons
            const beginnerBtn = document.getElementById('q32-beginner');
            const realisticBtn = document.getElementById('q32-realistic');
            const focusedBtn = document.getElementById('q32-focused');
            const distributedBtn = document.getElementById('q32-distributed');
            
            // Guide toggle
            const toggleGuideBtn = document.getElementById('q32-toggle-guide');
            const guideContent = document.getElementById('q32-guide-content');
            
            // Feedback elements
            const seqFeedback = document.getElementById('q32-seq-feedback');
            const dimFeedback = document.getElementById('q32-dim-feedback');
            const tempFeedback = document.getElementById('q32-temp-feedback');
            const scalingFeedback = document.getElementById('q32-scaling-feedback');
            
            const modeIndicator = document.getElementById('q32-mode-indicator');
            const output = document.getElementById('q32-output');
            const explanation = document.getElementById('q32-explanation');

            // Check if required elements exist
            if (!seqLength || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Guide toggle functionality
            let guideVisible = true;
            if (toggleGuideBtn && guideContent) {
                toggleGuideBtn.addEventListener('click', () => {
                    guideVisible = !guideVisible;
                    guideContent.style.display = guideVisible ? 'block' : 'none';
                    toggleGuideBtn.textContent = guideVisible ? 'Hide Guide' : 'Show Guide';
                });
            }

            // Real-time parameter feedback
            function updateParameterFeedback() {
                const seqLen = parseInt(seqLength.value);
                const dk = parseInt(dimK.value);
                const temp = parseFloat(temperature.value);
                const useScaling = scaling.checked;
                
                // Sequence feedback
                if (seqFeedback) {
                    seqFeedback.textContent = `Creates a ${seqLen}×${seqLen} attention matrix`;
                }
                
                // Dimension feedback
                if (dimFeedback) {
                    const scaleFactor = Math.sqrt(dk);
                    dimFeedback.textContent = `√${dk} = ${scaleFactor.toFixed(2)} scaling factor`;
                }
                
                // Temperature feedback
                if (tempFeedback) {
                    let tempDesc = '';
                    if (temp < 0.5) tempDesc = 'Very sharp (focused attention)';
                    else if (temp < 0.8) tempDesc = 'Sharp (moderately focused)';
                    else if (temp <= 1.2) tempDesc = 'Standard temperature (balanced)';
                    else if (temp <= 2.0) tempDesc = 'Soft (distributed attention)';
                    else tempDesc = 'Very soft (uniform attention)';
                    tempFeedback.textContent = tempDesc;
                }
                
                // Scaling feedback
                if (scalingFeedback) {
                    if (useScaling) {
                        scalingFeedback.className = 'text-xs text-gray-600 mt-1 p-2 bg-green-50 rounded';
                        scalingFeedback.innerHTML = '✅ Scaling enabled - prevents gradient vanishing';
                    } else {
                        scalingFeedback.className = 'text-xs text-gray-600 mt-1 p-2 bg-red-50 rounded';
                        scalingFeedback.innerHTML = '⚠️ Scaling disabled - may cause training issues';
                    }
                }
            }

            // Helper function to generate random matrix
            function generateMatrix(rows, cols, min = -1, max = 1) {
                const matrix = [];
                for (let i = 0; i < rows; i++) {
                    matrix[i] = [];
                    for (let j = 0; j < cols; j++) {
                        matrix[i][j] = Math.random() * (max - min) + min;
                    }
                }
                return matrix;
            }

            // Matrix multiplication
            function matrixMultiply(A, B) {
                const result = [];
                for (let i = 0; i < A.length; i++) {
                    result[i] = [];
                    for (let j = 0; j < B[0].length; j++) {
                        result[i][j] = 0;
                        for (let k = 0; k < B.length; k++) {
                            result[i][j] += A[i][k] * B[k][j];
                        }
                    }
                }
                return result;
            }

            // Transpose matrix
            function transpose(matrix) {
                return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
            }

            // Apply scaling
            function scaleMatrix(matrix, factor) {
                return matrix.map(row => row.map(val => val / factor));
            }

            // Softmax function
            function softmax(matrix, temp = 1.0) {
                return matrix.map(row => {
                    const scaledRow = row.map(val => val / temp);
                    const maxVal = Math.max(...scaledRow);
                    const expVals = scaledRow.map(val => Math.exp(val - maxVal));
                    const sumExp = expVals.reduce((sum, val) => sum + val, 0);
                    return expVals.map(val => val / sumExp);
                });
            }

            // Get current mode
            function getCurrentMode() {
                const selectedRadio = document.querySelector('input[name="q32-mode"]:checked');
                return selectedRadio ? selectedRadio.value : 'step-by-step';
            }

            // Update visual indicators with enhanced feedback
            function updateModeVisuals() {
                const selected = document.querySelector('input[name="q32-mode"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers with enhanced styling
                document.querySelectorAll('input[name="q32-mode"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.remove('border-gray-200');
                        container.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
                    } else {
                        container.classList.remove('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-200');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update mode indicator
                if (modeIndicator) {
                    const modeNames = {
                        'step-by-step': '📚 Step-by-Step Analysis',
                        'heatmap': '🎨 Visual Heatmap',
                        'comparison': '⚖️ Scaling Comparison'
                    };
                    modeIndicator.textContent = modeNames[selectedValue] || selectedValue;
                }
            }

            // Create matrix display with improved responsive layout
            function displayMatrix(matrix, title, className = '', precision = 3) {
                const container = document.createElement('div');
                container.className = `matrix-container ${className}`;
                
                const titleEl = document.createElement('h5');
                titleEl.className = 'font-medium text-gray-900 mb-3 text-center';
                titleEl.textContent = title;
                container.appendChild(titleEl);
                
                // Create responsive matrix wrapper
                const matrixWrapper = document.createElement('div');
                matrixWrapper.className = 'matrix-wrapper overflow-x-auto';
                
                const table = document.createElement('table');
                table.className = 'matrix-table mx-auto border-collapse border-2 border-gray-400 bg-white shadow-sm rounded-lg overflow-hidden';
                
                matrix.forEach((row, rowIndex) => {
                    const tr = document.createElement('tr');
                    tr.className = rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white';
                    
                    row.forEach((val, colIndex) => {
                        const td = document.createElement('td');
                        td.className = 'border border-gray-300 px-3 py-2 text-center font-mono text-sm min-w-[60px] transition-colors hover:bg-blue-50';
                        
                        // Format numbers based on their magnitude for better readability
                        let displayValue;
                        if (Math.abs(val) < 0.001) {
                            displayValue = '0.000';
                        } else if (Math.abs(val) >= 1000) {
                            displayValue = val.toExponential(2);
                        } else {
                            displayValue = val.toFixed(precision);
                        }
                        
                        td.textContent = displayValue;
                        
                        // Add subtle color coding for different value ranges
                        const absVal = Math.abs(val);
                        if (absVal > 0.8) {
                            td.classList.add('text-red-700', 'font-semibold');
                        } else if (absVal > 0.5) {
                            td.classList.add('text-orange-700');
                        } else if (absVal > 0.2) {
                            td.classList.add('text-blue-700');
                        } else {
                            td.classList.add('text-gray-600');
                        }
                        
                        // Add tooltip with full precision value
                        td.title = `[${rowIndex},${colIndex}] = ${val.toFixed(6)}`;
                        
                        tr.appendChild(td);
                    });
                    table.appendChild(tr);
                });
                
                matrixWrapper.appendChild(table);
                container.appendChild(matrixWrapper);
                
                // Add dimension info
                const dimInfo = document.createElement('div');
                dimInfo.className = 'text-xs text-gray-500 text-center mt-2';
                dimInfo.textContent = `${matrix.length}×${matrix[0].length} matrix`;
                container.appendChild(dimInfo);
                
                return container;
            }

            // Create heatmap visualization with improved responsive layout
            function createHeatmap(matrix, title) {
                const container = document.createElement('div');
                container.className = 'heatmap-container';
                
                const titleEl = document.createElement('h5');
                titleEl.className = 'font-medium text-gray-900 mb-4 text-center';
                titleEl.textContent = title;
                container.appendChild(titleEl);
                
                // Create responsive heatmap wrapper
                const heatmapWrapper = document.createElement('div');
                heatmapWrapper.className = 'heatmap-wrapper flex justify-center overflow-x-auto pb-2';
                
                const heatmapGrid = document.createElement('div');
                heatmapGrid.className = 'grid gap-1 p-2';
                heatmapGrid.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
                
                // Find min and max for normalization
                const flatValues = matrix.flat();
                const minVal = Math.min(...flatValues);
                const maxVal = Math.max(...flatValues);
                
                // Calculate optimal cell size based on matrix dimensions
                const cellSize = Math.max(32, Math.min(60, 300 / Math.max(matrix.length, matrix[0].length)));
                
                matrix.forEach((row, rowIndex) => {
                    row.forEach((val, colIndex) => {
                        const cell = document.createElement('div');
                        cell.className = 'heatmap-cell flex items-center justify-center text-xs font-mono border border-gray-300 rounded transition-transform hover:scale-110 cursor-pointer';
                        cell.style.width = `${cellSize}px`;
                        cell.style.height = `${cellSize}px`;
                        
                        // Normalize value to 0-1 range
                        const normalized = maxVal === minVal ? 0.5 : (val - minVal) / (maxVal - minVal);
                        
                        // Create color based on value with better color scheme
                        const hue = (1 - normalized) * 240; // Blue (240) to Red (0)
                        const saturation = 70 + (normalized * 30); // 70% to 100%
                        const lightness = 85 - (normalized * 35); // 85% to 50%
                        
                        cell.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                        cell.style.color = normalized > 0.6 ? 'white' : 'black';
                        
                        // Display value with appropriate precision
                        const displayVal = val < 0.001 ? '0' : val.toFixed(3);
                        cell.textContent = displayVal;
                        
                        // Enhanced tooltip
                        cell.title = `Position (${rowIndex+1},${colIndex+1})\nValue: ${val.toFixed(6)}\nNormalized: ${normalized.toFixed(3)}`;
                        
                        // Add click handler for detailed info
                        cell.addEventListener('click', () => {
                            alert(`Attention Score Details:\n\nFrom position ${rowIndex+1} to position ${colIndex+1}\nRaw value: ${val.toFixed(6)}\nNormalized (0-1): ${normalized.toFixed(4)}\n\nThis means position ${rowIndex+1} pays ${(val*100).toFixed(1)}% of its attention to position ${colIndex+1}.`);
                        });
                        
                        heatmapGrid.appendChild(cell);
                    });
                });
                
                heatmapWrapper.appendChild(heatmapGrid);
                container.appendChild(heatmapWrapper);
                
                // Add improved legend with better color representation
                const legend = document.createElement('div');
                legend.className = 'mt-4 space-y-2';
                
                // Color gradient legend
                const gradientLegend = document.createElement('div');
                gradientLegend.className = 'flex items-center justify-center space-x-4';
                
                const gradientBar = document.createElement('div');
                gradientBar.className = 'w-32 h-4 rounded border border-gray-300';
                gradientBar.style.background = 'linear-gradient(to right, hsl(240, 70%, 85%), hsl(120, 85%, 70%), hsl(0, 100%, 50%))';
                
                const legendText = document.createElement('div');
                legendText.className = 'text-xs text-gray-600 flex items-center space-x-8';
                legendText.innerHTML = `
                    <span><strong>Low:</strong> ${minVal.toFixed(3)}</span>
                    <span><strong>High:</strong> ${maxVal.toFixed(3)}</span>
                `;
                
                gradientLegend.appendChild(gradientBar);
                gradientLegend.appendChild(legendText);
                legend.appendChild(gradientLegend);
                
                // Matrix info
                const matrixInfo = document.createElement('div');
                matrixInfo.className = 'text-xs text-gray-500 text-center';
                matrixInfo.innerHTML = `
                    <div class="bg-gray-100 p-2 rounded">
                        <strong>Matrix Info:</strong> ${matrix.length}×${matrix[0].length} | 
                        <strong>Range:</strong> ${(maxVal - minVal).toFixed(4)} | 
                        <strong>Avg:</strong> ${(flatValues.reduce((a, b) => a + b, 0) / flatValues.length).toFixed(4)} |
                        <em>Click cells for details</em>
                    </div>
                `;
                legend.appendChild(matrixInfo);
                
                container.appendChild(legend);
                
                return container;
            }

            // Main computation function with enhanced feedback
            function computeAttention() {
                const seqLen = parseInt(seqLength.value);
                const dk = parseInt(dimK.value);
                const temp = parseFloat(temperature.value);
                const useScaling = scaling.checked;
                const mode = getCurrentMode();
                
                // Update displays
                seqLengthDisplay.textContent = seqLen;
                dimKDisplay.textContent = dk;
                temperatureDisplay.textContent = temp.toFixed(1);
                
                // Update real-time feedback
                updateParameterFeedback();
                updateModeVisuals();
                
                // Generate Q, K, V matrices
                const Q = generateMatrix(seqLen, dk, -1, 1);
                const K = generateMatrix(seqLen, dk, -1, 1);
                const V = generateMatrix(seqLen, dk, -1, 1);
                
                // Step 1: Compute Q·K^T
                const KT = transpose(K);
                const scores = matrixMultiply(Q, KT);
                
                // Step 2: Apply scaling if enabled
                const scaledScores = useScaling ? scaleMatrix(scores, Math.sqrt(dk)) : scores;
                
                // Step 3: Apply softmax
                const attentionWeights = softmax(scaledScores, temp);
                
                // Step 4: Compute final output
                const attentionOutput = matrixMultiply(attentionWeights, V);
                
                // Clear previous output
                output.innerHTML = '';
                
                if (mode === 'step-by-step') {
                    renderStepByStep(Q, K, V, scores, scaledScores, attentionWeights, attentionOutput, useScaling, dk);
                } else if (mode === 'heatmap') {
                    renderHeatmap(attentionWeights, Q, K, V, seqLen);
                } else if (mode === 'comparison') {
                    renderComparison(Q, K, V, dk, temp);
                }
                
                // Update explanation
                updateExplanation(mode, attentionWeights, useScaling, dk, temp);
            }

            // Render step-by-step visualization with improved layout
            function renderStepByStep(Q, K, V, scores, scaledScores, weights, attentionOutput, useScaling, dk) {
                const container = document.createElement('div');
                container.className = 'space-y-8';
                
                // Step 0: Show input matrices with better spacing
                const inputSection = document.createElement('div');
                inputSection.className = 'space-y-4';
                
                const inputTitle = document.createElement('h4');
                inputTitle.className = 'font-medium text-gray-900 text-center mb-4';
                inputTitle.textContent = 'Input Matrices';
                inputSection.appendChild(inputTitle);
                
                const inputGrid = document.createElement('div');
                inputGrid.className = 'grid grid-cols-1 lg:grid-cols-3 gap-6';
                inputGrid.appendChild(displayMatrix(Q, 'Query (Q)', 'bg-blue-50 p-4 rounded-lg border border-blue-200'));
                inputGrid.appendChild(displayMatrix(K, 'Key (K)', 'bg-green-50 p-4 rounded-lg border border-green-200'));
                inputGrid.appendChild(displayMatrix(V, 'Value (V)', 'bg-purple-50 p-4 rounded-lg border border-purple-200'));
                inputSection.appendChild(inputGrid);
                
                container.appendChild(inputSection);
                
                // Step 1: Show dot product with explanation
                const step1 = document.createElement('div');
                step1.className = 'bg-gray-50 p-6 rounded-xl border border-gray-200';
                const step1Content = document.createElement('div');
                step1Content.className = 'space-y-4';
                
                const step1Header = document.createElement('div');
                step1Header.className = 'text-center';
                step1Header.innerHTML = `
                    <h4 class="font-semibold text-gray-900 text-lg mb-2">Step 1: Compute Q·K^T (Similarity Scores)</h4>
                    <p class="text-sm text-gray-600 max-w-2xl mx-auto">
                        Calculate dot products between queries and keys to measure how much each position should attend to every other position.
                        Higher values indicate stronger relationships.
                    </p>
                `;
                step1Content.appendChild(step1Header);
                
                const step1Matrix = displayMatrix(scores, 'Raw Attention Scores', 'bg-white p-4 rounded-lg border', 2);
                step1Content.appendChild(step1Matrix);
                
                step1.appendChild(step1Content);
                container.appendChild(step1);
                
                // Step 2: Show scaling (if enabled)
                if (useScaling) {
                    const step2 = document.createElement('div');
                    step2.className = 'bg-yellow-50 p-6 rounded-xl border border-yellow-200';
                    const step2Content = document.createElement('div');
                    step2Content.className = 'space-y-4';
                    
                    const step2Header = document.createElement('div');
                    step2Header.className = 'text-center';
                    step2Header.innerHTML = `
                        <h4 class="font-semibold text-gray-900 text-lg mb-2">Step 2: Scale by √d_k = √${dk} = ${Math.sqrt(dk).toFixed(2)}</h4>
                        <p class="text-sm text-gray-600 max-w-2xl mx-auto">
                            Divide by √d_k to prevent the dot products from becoming too large as dimensions increase.
                            This keeps softmax in its sensitive range and prevents gradient vanishing.
                        </p>
                    `;
                    step2Content.appendChild(step2Header);
                    
                    const step2Matrix = displayMatrix(scaledScores, 'Scaled Scores', 'bg-white p-4 rounded-lg border', 2);
                    step2Content.appendChild(step2Matrix);
                    
                    step2.appendChild(step2Content);
                    container.appendChild(step2);
                }
                
                // Step 3: Show softmax
                const step3 = document.createElement('div');
                step3.className = 'bg-orange-50 p-6 rounded-xl border border-orange-200';
                const step3Content = document.createElement('div');
                step3Content.className = 'space-y-4';
                
                const step3Header = document.createElement('div');
                step3Header.className = 'text-center';
                step3Header.innerHTML = `
                    <h4 class="font-semibold text-gray-900 text-lg mb-2">Step ${useScaling ? '3' : '2'}: Apply Softmax (Create Probability Distribution)</h4>
                    <p class="text-sm text-gray-600 max-w-2xl mx-auto">
                        Convert raw scores to probabilities. Each row sums to 1, representing how much attention each position pays to all positions.
                        Notice how the values are now between 0 and 1.
                    </p>
                `;
                step3Content.appendChild(step3Header);
                
                const step3Matrix = displayMatrix(weights, 'Attention Weights', 'bg-white p-4 rounded-lg border', 3);
                step3Content.appendChild(step3Matrix);
                
                // Add row sum verification
                const verificationDiv = document.createElement('div');
                verificationDiv.className = 'text-xs text-orange-700 text-center mt-2';
                const rowSums = weights.map(row => row.reduce((sum, val) => sum + val, 0));
                verificationDiv.innerHTML = `
                    <div class="bg-orange-100 p-2 rounded">
                        <strong>✓ Verification:</strong> Row sums = [${rowSums.map(sum => sum.toFixed(3)).join(', ')}] (should all be ≈ 1.000)
                    </div>
                `;
                step3Content.appendChild(verificationDiv);
                
                step3.appendChild(step3Content);
                container.appendChild(step3);
                
                // Step 4: Show final output
                const step4 = document.createElement('div');
                step4.className = 'bg-green-50 p-6 rounded-xl border border-green-200';
                const step4Content = document.createElement('div');
                step4Content.className = 'space-y-4';
                
                const step4Header = document.createElement('div');
                step4Header.className = 'text-center';
                step4Header.innerHTML = `
                    <h4 class="font-semibold text-gray-900 text-lg mb-2">Step ${useScaling ? '4' : '3'}: Multiply by Values (Weighted Sum)</h4>
                    <p class="text-sm text-gray-600 max-w-2xl mx-auto">
                        Use attention weights to compute weighted averages of the value vectors.
                        This produces the final contextualized representation for each position.
                    </p>
                `;
                step4Content.appendChild(step4Header);
                
                const step4Matrix = displayMatrix(attentionOutput, 'Final Attention Output', 'bg-white p-4 rounded-lg border', 3);
                step4Content.appendChild(step4Matrix);
                
                step4.appendChild(step4Content);
                container.appendChild(step4);
                
                output.appendChild(container);
            }

            // Render heatmap visualization
            function renderHeatmap(weights, Q, K, V, seqLen) {
                const container = document.createElement('div');
                container.className = 'space-y-6';
                
                // Main heatmap
                container.appendChild(createHeatmap(weights, 'Attention Pattern Heatmap'));
                
                // Position labels
                const labelsContainer = document.createElement('div');
                labelsContainer.className = 'bg-gray-50 p-4 rounded-lg';
                labelsContainer.innerHTML = `
                    <h5 class="font-medium text-gray-900 mb-2">Position Interpretation</h5>
                    <div class="grid grid-cols-${seqLen} gap-2 text-center text-sm">
                        ${Array.from({length: seqLen}, (_, i) => 
                            `<div class="bg-white p-2 rounded border">
                                <div class="font-medium">Pos ${i+1}</div>
                                <div class="text-xs text-gray-600">Token ${i+1}</div>
                            </div>`
                        ).join('')}
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        Each row shows how much position i attends to all other positions.
                        Brighter colors indicate stronger attention.
                    </p>
                `;
                container.appendChild(labelsContainer);
                
                output.appendChild(container);
            }

            // Render scaling comparison with improved layout
            function renderComparison(Q, K, V, dk, temp) {
                const container = document.createElement('div');
                container.className = 'space-y-8';
                
                // Compute both versions
                const KT = transpose(K);
                const scores = matrixMultiply(Q, KT);
                const scaledScores = scaleMatrix(scores, Math.sqrt(dk));
                
                const unscaledWeights = softmax(scores, temp);
                const scaledWeights = softmax(scaledScores, temp);
                
                // Add explanation header
                const explanationHeader = document.createElement('div');
                explanationHeader.className = 'text-center bg-blue-50 p-6 rounded-xl border border-blue-200';
                explanationHeader.innerHTML = `
                    <h4 class="font-semibold text-blue-900 text-lg mb-3">Scaling Impact Comparison</h4>
                    <p class="text-sm text-blue-800 max-w-3xl mx-auto">
                        This comparison shows the critical importance of √d_k scaling. Watch how unscaled attention 
                        can become extreme and concentrated, while scaled attention maintains balanced distributions.
                    </p>
                    <div class="mt-3 text-xs text-blue-700 bg-blue-100 p-2 rounded">
                        <strong>Current settings:</strong> d_k = ${dk}, √d_k = ${Math.sqrt(dk).toFixed(3)}, Temperature = ${temp.toFixed(1)}
                    </div>
                `;
                container.appendChild(explanationHeader);
                
                // Side-by-side comparison with better spacing
                const comparisonGrid = document.createElement('div');
                comparisonGrid.className = 'grid lg:grid-cols-2 gap-8';
                
                // Without scaling
                const withoutScaling = document.createElement('div');
                withoutScaling.className = 'bg-red-50 p-6 rounded-xl border border-red-200 space-y-4';
                
                const withoutHeader = document.createElement('div');
                withoutHeader.className = 'text-center';
                withoutHeader.innerHTML = `
                    <h4 class="font-semibold text-red-900 text-lg mb-2">❌ Without √d_k Scaling</h4>
                    <p class="text-sm text-red-700">Raw dot products can become very large, pushing softmax into saturation</p>
                `;
                withoutScaling.appendChild(withoutHeader);
                
                const unscaledHeatmap = createHeatmap(unscaledWeights, 'Unscaled Attention');
                withoutScaling.appendChild(unscaledHeatmap);
                
                comparisonGrid.appendChild(withoutScaling);
                
                // With scaling
                const withScaling = document.createElement('div');
                withScaling.className = 'bg-green-50 p-6 rounded-xl border border-green-200 space-y-4';
                
                const withHeader = document.createElement('div');
                withHeader.className = 'text-center';
                withHeader.innerHTML = `
                    <h4 class="font-semibold text-green-900 text-lg mb-2">✅ With √d_k Scaling</h4>
                    <p class="text-sm text-green-700">Controlled dot products maintain softmax in its sensitive range</p>
                `;
                withScaling.appendChild(withHeader);
                
                const scaledHeatmap = createHeatmap(scaledWeights, 'Scaled Attention');
                withScaling.appendChild(scaledHeatmap);
                
                comparisonGrid.appendChild(withScaling);
                container.appendChild(comparisonGrid);
                
                // Enhanced statistics comparison
                const statsContainer = document.createElement('div');
                statsContainer.className = 'bg-white p-6 rounded-xl border border-gray-200 shadow-sm';
                
                const unscaledMax = Math.max(...unscaledWeights.flat());
                const scaledMax = Math.max(...scaledWeights.flat());
                const unscaledMin = Math.min(...unscaledWeights.flat());
                const scaledMin = Math.min(...scaledWeights.flat());
                const unscaledEntropy = calculateEntropy(unscaledWeights);
                const scaledEntropy = calculateEntropy(scaledWeights);
                const unscaledStd = Math.sqrt(unscaledWeights.flat().reduce((acc, val) => acc + Math.pow(val - (1/unscaledWeights.length), 2), 0) / unscaledWeights.flat().length);
                const scaledStd = Math.sqrt(scaledWeights.flat().reduce((acc, val) => acc + Math.pow(val - (1/scaledWeights.length), 2), 0) / scaledWeights.flat().length);
                
                statsContainer.innerHTML = `
                    <h5 class="font-semibold text-gray-900 mb-4 text-center">📊 Statistical Comparison</h5>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div class="text-center space-y-2">
                            <div class="text-lg font-bold text-red-600">${unscaledMax.toFixed(4)}</div>
                            <div class="text-lg font-bold text-green-600">${scaledMax.toFixed(4)}</div>
                            <div class="text-sm text-gray-600 font-medium">Maximum Weight</div>
                            <div class="text-xs text-gray-500">${unscaledMax > scaledMax ? 'Unscaled higher' : 'Scaled higher'}</div>
                        </div>
                        <div class="text-center space-y-2">
                            <div class="text-lg font-bold text-red-600">${unscaledMin.toFixed(4)}</div>
                            <div class="text-lg font-bold text-green-600">${scaledMin.toFixed(4)}</div>
                            <div class="text-sm text-gray-600 font-medium">Minimum Weight</div>
                            <div class="text-xs text-gray-500">Range: ${(unscaledMax-unscaledMin).toFixed(4)} vs ${(scaledMax-scaledMin).toFixed(4)}</div>
                        </div>
                        <div class="text-center space-y-2">
                            <div class="text-lg font-bold text-red-600">${unscaledEntropy.toFixed(3)}</div>
                            <div class="text-lg font-bold text-green-600">${scaledEntropy.toFixed(3)}</div>
                            <div class="text-sm text-gray-600 font-medium">Entropy</div>
                            <div class="text-xs text-gray-500">${unscaledEntropy > scaledEntropy ? 'Unscaled more diverse' : 'Scaled more diverse'}</div>
                        </div>
                        <div class="text-center space-y-2">
                            <div class="text-lg font-bold text-red-600">${unscaledStd.toFixed(4)}</div>
                            <div class="text-lg font-bold text-green-600">${scaledStd.toFixed(4)}</div>
                            <div class="text-sm text-gray-600 font-medium">Std Deviation</div>
                            <div class="text-xs text-gray-500">Attention spread</div>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <div class="inline-flex items-center space-x-4 text-sm">
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-red-500 rounded mr-2"></div>
                                <span>Unscaled</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
                                <span>Scaled</span>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(statsContainer);
                
                output.appendChild(container);
            }

            // Calculate entropy of attention distribution
            function calculateEntropy(weights) {
                let totalEntropy = 0;
                weights.forEach(row => {
                    let entropy = 0;
                    row.forEach(weight => {
                        if (weight > 0) {
                            entropy -= weight * Math.log2(weight);
                        }
                    });
                    totalEntropy += entropy;
                });
                return totalEntropy / weights.length;
            }

            // Enhanced explanation system
            function updateExplanation(mode, weights, useScaling, dk, temp) {
                if (!explanation) return;
                
                let explanationText = '';
                
                if (mode === 'step-by-step') {
                    const maxWeight = Math.max(...weights.flat());
                    const avgWeight = weights.flat().reduce((sum, w) => sum + w, 0) / weights.flat().length;
                    const entropy = calculateEntropy(weights);
                    
                    explanationText = `
                        <div class="space-y-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-lg">📊</span>
                                <strong>Step-by-Step Analysis Complete!</strong>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div class="bg-blue-50 p-3 rounded">
                                    <div class="font-medium text-blue-900">Peak Attention</div>
                                    <div class="text-2xl font-bold text-blue-600">${maxWeight.toFixed(3)}</div>
                                    <div class="text-xs text-blue-700">${maxWeight > 0.8 ? 'Very focused' : maxWeight > 0.5 ? 'Moderately focused' : 'Distributed'}</div>
                                </div>
                                <div class="bg-green-50 p-3 rounded">
                                    <div class="font-medium text-green-900">Average Weight</div>
                                    <div class="text-2xl font-bold text-green-600">${avgWeight.toFixed(3)}</div>
                                    <div class="text-xs text-green-700">Expected: ${(1/weights.length).toFixed(3)}</div>
                                </div>
                                <div class="bg-purple-50 p-3 rounded">
                                    <div class="font-medium text-purple-900">Entropy</div>
                                    <div class="text-2xl font-bold text-purple-600">${entropy.toFixed(2)}</div>
                                    <div class="text-xs text-purple-700">${entropy > 1.5 ? 'High diversity' : entropy > 1.0 ? 'Moderate focus' : 'High focus'}</div>
                                </div>
                            </div>
                            <p class="text-sm text-gray-700">
                                <strong>💡 Key Insight:</strong> Each step transforms the raw similarity scores into meaningful attention weights. 
                                ${useScaling ? 'The √d_k scaling ensures stable gradients during training.' : '⚠️ Without scaling, large dimensions could cause gradient problems.'}
                            </p>
                        </div>
                    `;
                } else if (mode === 'heatmap') {
                    const entropy = calculateEntropy(weights);
                    const maxWeight = Math.max(...weights.flat());
                    const minWeight = Math.min(...weights.flat());
                    
                    explanationText = `
                        <div class="space-y-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-lg">🎨</span>
                                <strong>Attention Pattern Analysis</strong>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span>Pattern Diversity:</span>
                                        <span class="font-medium">${entropy > 1.5 ? 'High 🌊' : entropy > 1.0 ? 'Medium 🎯' : 'Low 🔥'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Value Range:</span>
                                        <span class="font-medium">${minWeight.toFixed(3)} → ${maxWeight.toFixed(3)}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Temperature Effect:</span>
                                        <span class="font-medium">${temp < 0.5 ? 'Sharp 🎯' : temp > 2.0 ? 'Smooth 🌊' : 'Balanced ⚖️'}</span>
                                    </div>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <strong>💡 Reading the Heatmap:</strong>
                                    <ul class="mt-1 space-y-1 text-xs">
                                        <li>• Each row = how one position attends to others</li>
                                        <li>• Diagonal = self-attention strength</li>
                                        <li>• Bright red = strong focus</li>
                                        <li>• Cool blue = weak attention</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (mode === 'comparison') {
                    explanationText = `
                        <div class="space-y-3">
                            <div class="flex items-center space-x-2">
                                <span class="text-lg">⚖️</span>
                                <strong>Scaling Impact Analysis</strong>
                            </div>
                            <div class="bg-yellow-50 p-4 rounded-lg">
                                <h5 class="font-medium text-yellow-900 mb-2">Why √d_k = √${dk} = ${Math.sqrt(dk).toFixed(2)} Matters:</h5>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                                    <div>
                                        <strong>🚫 Without Scaling:</strong>
                                        <ul class="mt-1 space-y-1 text-xs">
                                            <li>• Dot products grow with dimension</li>
                                            <li>• Softmax saturates (extreme values)</li>
                                            <li>• Gradients vanish during training</li>
                                            <li>• Training becomes unstable</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>✅ With Scaling:</strong>
                                        <ul class="mt-1 space-y-1 text-xs">
                                            <li>• Maintains reasonable value range</li>
                                            <li>• Softmax stays in sensitive region</li>
                                            <li>• Gradients flow properly</li>
                                            <li>• Stable training at any dimension</li>
                                        </ul>
                                    </div>
                                </div>
                                <p class="text-xs text-yellow-700 mt-3 p-2 bg-yellow-100 rounded">
                                    <strong>🎓 Pro Tip:</strong> In real transformers with d_k=64 or 128, unscaled attention would be completely unusable. 
                                    This simple √d_k trick was crucial for making large language models possible!
                                </p>
                            </div>
                        </div>
                    `;
                }
                
                // Add temperature-specific insights
                if (temp !== 1.0) {
                    const tempEffect = temp > 1.0 ? 
                        `<div class="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                            <strong>🌡️ Temperature ${temp.toFixed(1)} Effect:</strong> 
                            Higher temperature makes attention more uniform (less focused). This is like making the model "less confident" about which tokens to focus on.
                            <div class="mt-2 text-xs text-blue-700">Use case: When you want the model to consider more context equally.</div>
                        </div>` :
                        `<div class="mt-3 p-3 bg-orange-50 rounded-lg text-sm">
                            <strong>🌡️ Temperature ${temp.toFixed(1)} Effect:</strong> 
                            Lower temperature makes attention sharper (more focused). This is like making the model "more confident" about which tokens to focus on.
                            <div class="mt-2 text-xs text-orange-700">Use case: When you want the model to focus strongly on specific important tokens.</div>
                        </div>`;
                    explanationText += tempEffect;
                }
                
                explanation.innerHTML = explanationText;
            }

            // Enhanced preset scenarios
            if (beginnerBtn) {
                beginnerBtn.addEventListener('click', () => {
                    seqLength.value = 2;
                    dimK.value = 3;
                    temperature.value = 1.0;
                    scaling.checked = true;
                    document.querySelector('input[name="q32-mode"][value="step-by-step"]').checked = true;
                    computeAttention();
                    
                    // Show helpful message
                    setTimeout(() => {
                        if (explanation) {
                            explanation.innerHTML = `
                                <div class="bg-blue-50 p-3 rounded-lg">
                                    <strong>🐣 Beginner Mode Activated!</strong>
                                    <p class="text-sm mt-2">Perfect! You're now seeing the simplest case: 2 tokens with small dimension. 
                                    This makes it easy to follow each mathematical step. Try changing to different visualization modes to see the same computation presented differently!</p>
                                </div>
                            ` + explanation.innerHTML;
                        }
                    }, 100);
                });
            }

            if (realisticBtn) {
                realisticBtn.addEventListener('click', () => {
                    seqLength.value = 4;
                    dimK.value = 6;
                    temperature.value = 1.0;
                    scaling.checked = true;
                    document.querySelector('input[name="q32-mode"][value="heatmap"]').checked = true;
                    computeAttention();
                    
                    setTimeout(() => {
                        if (explanation) {
                            explanation.innerHTML = `
                                <div class="bg-green-50 p-3 rounded-lg">
                                    <strong>🎯 Realistic Scale!</strong>
                                    <p class="text-sm mt-2">This represents a more realistic scenario similar to small transformer heads. 
                                    Notice how the 4×4 attention matrix shows more complex patterns. The heatmap view is perfect for seeing these patterns!</p>
                                </div>
                            ` + explanation.innerHTML;
                        }
                    }, 100);
                });
            }

            if (focusedBtn) {
                focusedBtn.addEventListener('click', () => {
                    seqLength.value = 3;
                    dimK.value = 4;
                    temperature.value = 0.3;
                    scaling.checked = true;
                    document.querySelector('input[name="q32-mode"][value="heatmap"]').checked = true;
                    computeAttention();
                    
                    setTimeout(() => {
                        if (explanation) {
                            explanation.innerHTML = `
                                <div class="bg-orange-50 p-3 rounded-lg">
                                    <strong>🔥 Focused Attention!</strong>
                                    <p class="text-sm mt-2">Low temperature (0.3) creates very sharp attention - the model becomes "confident" about what to focus on. 
                                    You'll see bright red spots in the heatmap where attention is strongly concentrated!</p>
                                </div>
                            ` + explanation.innerHTML;
                        }
                    }, 100);
                });
            }

            if (distributedBtn) {
                distributedBtn.addEventListener('click', () => {
                    seqLength.value = 4;
                    dimK.value = 4;
                    temperature.value = 2.5;
                    scaling.checked = true;
                    document.querySelector('input[name="q32-mode"][value="heatmap"]').checked = true;
                    computeAttention();
                    
                    setTimeout(() => {
                        if (explanation) {
                            explanation.innerHTML = `
                                <div class="bg-purple-50 p-3 rounded-lg">
                                    <strong>🌊 Distributed Attention!</strong>
                                    <p class="text-sm mt-2">High temperature (2.5) creates smooth, distributed attention - the model becomes "uncertain" and considers all positions more equally. 
                                    The heatmap will show more uniform colors across all positions!</p>
                                </div>
                            ` + explanation.innerHTML;
                        }
                    }, 100);
                });
            }

            // Event listeners with enhanced feedback
            [seqLength, dimK, temperature, scaling].forEach(element => {
                if (element) {
                    element.addEventListener('input', () => {
                        updateParameterFeedback();
                        computeAttention();
                    });
                }
            });

            modeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateModeVisuals();
                    computeAttention();
                });
            });

            // Initial setup
            updateParameterFeedback();
            updateModeVisuals();
            computeAttention();
        }
    }
};
