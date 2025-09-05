// Question 32: How are attention scores calculated in transformers?
// Created: July 16, 2025
// Educational Focus: Transformer attention mechanism, Q/K/V matrices, scaled dot-product attention

const question = {
    title: "32. How are attention scores calculated in transformers?",
    // Core explanatory answer (interactive UI moved to `interactive.html` so the app executes its script)
    answer: `<div class="space-y-4">
        <!-- Recommended Reading (moved to top) -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200" id="q32-recommended-reading">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-24" class="text-indigo-700 underline hover:text-indigo-900">Question 24: What is softmax and why is it used?</a></li>
                <li><a href="#question-30" class="text-indigo-700 underline hover:text-indigo-900">Question 30: What is the ReLU activation function?</a></li>
                <li><a href="#question-31" class="text-indigo-700 underline hover:text-indigo-900">Question 31: How does backpropagation work?</a></li>
                <li><a href="#question-33" class="text-indigo-700 underline hover:text-indigo-900">Question 33: What is multi-head attention?</a></li>
            </ul>
            <p class="text-xs text-indigo-700 mt-2">These build conceptual grounding for scaling, softmax distribution, gradient flow, and extension to multi-head attention.</p>
        </div>
        
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
            <div class="text-sm text-indigo-800 space-y-2">
                <p class="text-indigo-700">Understanding the shapes is crucial to see why the matrix multiplications line up:</p>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs md:text-sm border border-indigo-200 bg-white rounded">
                        <thead class="bg-indigo-100">
                            <tr class="text-left">
                                <th class="p-2 font-medium">Symbol</th>
                                <th class="p-2 font-medium">Meaning</th>
                                <th class="p-2 font-medium">Shape</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t">
                                <td class="p-2 font-mono">Q</td>
                                <td class="p-2">Query vectors</td>
                                <td class="p-2 font-mono">(seq_len × d_k)</td>
                            </tr>
                            <tr class="border-t">
                                <td class="p-2 font-mono">K</td>
                                <td class="p-2">Key vectors</td>
                                <td class="p-2 font-mono">(seq_len × d_k)</td>
                            </tr>
                            <tr class="border-t">
                                <td class="p-2 font-mono">V</td>
                                <td class="p-2">Value vectors</td>
                                <td class="p-2 font-mono">(seq_len × d_v)</td>
                            </tr>
                            <tr class="border-t bg-indigo-50">
                                <td class="p-2 font-mono">Q Kᵀ</td>
                                <td class="p-2">Similarity scores</td>
                                <td class="p-2 font-mono">(seq_len × seq_len)</td>
                            </tr>
                            <tr class="border-t">
                                <td class="p-2 font-mono">softmax(Q Kᵀ / √d_k)</td>
                                <td class="p-2">Attention weights</td>
                                <td class="p-2 font-mono">(seq_len × seq_len)</td>
                            </tr>
                            <tr class="border-t bg-indigo-50">
                                <td class="p-2 font-mono">Attn · V</td>
                                <td class="p-2">Output representations</td>
                                <td class="p-2 font-mono">(seq_len × d_v)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-indigo-700">Multiplications are valid because inner dimensions match: (seq_len × d_k) · (d_k × seq_len) → (seq_len × seq_len), then (seq_len × seq_len) · (seq_len × d_v) → (seq_len × d_v).</p>
            </div>
        </div>
    </div>`,
    interactive: {
        title: "🔬 Interactive Attention Explorer",
        html: `<div class="space-y-8">
        <!-- Interactive Controls -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-4" id="q32-controls">
            <h4 class="font-medium text-gray-900">🛠️ Experiment Controls</h4>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <label class="block">
                        <span class="text-xs font-medium text-gray-700">Sequence Length: <span id="q32-seq-length-display" class="font-mono">3</span></span>
                        <input id="q32-seq-length" type="range" min="2" max="8" value="3" class="w-full mt-1" aria-label="Sequence length slider" />
                        <div id="q32-seq-feedback" class="text-xs text-gray-600 mt-1"></div>
                    </label>
                    <label class="block">
                        <span class="text-xs font-medium text-gray-700">Key / Value Dimension (d_k): <span id="q32-dim-k-display" class="font-mono">4</span></span>
                        <input id="q32-dim-k" type="range" min="2" max="12" value="4" class="w-full mt-1" aria-label="Key dimension slider" />
                        <div id="q32-dim-feedback" class="text-xs text-gray-600 mt-1"></div>
                    </label>
                    <label class="block">
                        <span class="text-xs font-medium text-gray-700">Temperature: <span id="q32-temperature-display" class="font-mono">1.0</span></span>
                        <input id="q32-temperature" type="range" min="0.2" max="3" step="0.1" value="1" class="w-full mt-1" aria-label="Temperature slider" />
                        <div id="q32-temp-feedback" class="text-xs text-gray-600 mt-1"></div>
                    </label>
                    <label class="inline-flex items-center space-x-2 mt-2">
                        <input id="q32-scaling" type="checkbox" checked aria-label="Toggle scaling by square root d k" />
                        <span class="text-xs text-gray-700">Apply √d_k scaling</span>
                    </label>
                    <div id="q32-scaling-feedback" class="text-xs text-gray-600 mt-1"></div>
                </div>
                <div class="space-y-3">
                    <div class="text-xs font-medium text-gray-700">Presets</div>
                    <div class="flex flex-wrap gap-2">
                        <button id="q32-beginner" class="px-2 py-1 text-xs rounded bg-blue-50 border border-blue-200 hover:bg-blue-100">Beginner</button>
                        <button id="q32-realistic" class="px-2 py-1 text-xs rounded bg-green-50 border border-green-200 hover:bg-green-100">Realistic</button>
                        <button id="q32-focused" class="px-2 py-1 text-xs rounded bg-orange-50 border border-orange-200 hover:bg-orange-100">Focused</button>
                        <button id="q32-distributed" class="px-2 py-1 text-xs rounded bg-purple-50 border border-purple-200 hover:bg-purple-100">Distributed</button>
                    </div>
                    <div class="mt-4 space-y-2">
                        <button id="q32-toggle-guide" class="text-xs underline text-blue-700">Hide Guide</button>
                        <div id="q32-guide-content" class="mt-2 text-xs text-gray-600 space-y-2">
                            <p><strong>Sequence Length</strong> changes how many tokens attend to each other (matrix size).</p>
                            <p><strong>d_k</strong> changes scale of dot products; higher values make scaling more important.</p>
                            <p><strong>Temperature</strong> sharpens (low) or smooths (high) the softmax distribution.</p>
                            <p><strong>Scaling</strong> by √d_k stabilizes training by keeping softmax in a sensitive range.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200">
                            <label class="text-xs text-gray-700 flex items-center gap-1">Palette
                                <select id="q32-palette" class="text-xs border-gray-300 rounded px-1 py-0.5">
                                    <option value="default">Blue→Red</option>
                                    <option value="viridis">Viridis</option>
                                </select>
                            </label>
                            <button id="q32-regenerate" class="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Regenerate Matrices</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Visualization Mode Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4" id="q32-mode-wrapper">
                <fieldset>
                  <legend class="font-medium text-gray-700 mb-3">👀 Visualization Mode</legend>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="Attention visualization mode">
                    <label class="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200" data-mode-card>
                        <input type="radio" name="q32-mode" value="step-by-step" checked class="absolute top-3 right-3" aria-label="Step by step mode">
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
                    <label class="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200" data-mode-card>
                        <input type="radio" name="q32-mode" value="heatmap" class="absolute top-3 right-3" aria-label="Heatmap mode">
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
                    <label class="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200" data-mode-card>
                        <input type="radio" name="q32-mode" value="comparison" class="absolute top-3 right-3" aria-label="Scaling comparison mode">
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
                </fieldset>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Attention Computation</h4>
                    <div id="q32-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q32-output" class="min-h-[200px]" role="region" aria-live="polite" aria-label="Attention visualization output" aria-atomic="false"></div>
                <div id="q32-cell-detail" class="hidden mt-4 text-xs bg-gray-50 border border-gray-200 rounded p-3" aria-live="polite" aria-label="Selected attention cell details"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div id="q32-analysis" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4" role="region" aria-live="polite" aria-label="Attention analysis panel" aria-atomic="false">
                <h4 class="font-medium text-yellow-900 mb-2" id="q32-analysis-heading">📊 Attention Analysis</h4>
                <div id="q32-explanation" class="text-sm text-yellow-800" aria-describedby="q32-analysis-heading"></div>
                <div id="q32-sr-summary" class="sr-only" aria-live="polite"></div>
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
            const regenerateBtn = document.getElementById('q32-regenerate');
            const paletteSelect = document.getElementById('q32-palette');
            const cellDetail = document.getElementById('q32-cell-detail');
            
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
            const srSummary = document.getElementById('q32-sr-summary');

            // Check if required elements exist
            if (!seqLength || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // MathJax typesetting helper (safe & idempotent)
            function typesetMath(root) {
                if (!root) return;
                if (window.MathJax && window.MathJax.typesetPromise) {
                    try {
                        if (window.MathJax.typesetClear) {
                            window.MathJax.typesetClear([root]);
                        }
                        window.MathJax.typesetPromise([root]);
                    } catch (e) {
                        console.warn('MathJax typeset failed:', e);
                    }
                }
            }

            // Respect user motion preference
            const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
                
                // Update ARIA for sliders
                seqLength.setAttribute('aria-valuenow', seqLen);
                seqLength.setAttribute('aria-valuetext', `${seqLen} tokens`);
                dimK.setAttribute('aria-valuenow', dk);
                dimK.setAttribute('aria-valuetext', `${dk} key dimension`);
                temperature.setAttribute('aria-valuenow', temp.toFixed(1));
                temperature.setAttribute('aria-valuetext', `temperature ${temp.toFixed(1)}`);

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

            // Simple state to persist matrices between mode changes
            const state = { Q: null, K: null, V: null, seqLen: null, dk: null };

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
                container.className = `matrix-container matrix-flex-item ${className}`;
                
                const titleEl = document.createElement('h5');
                titleEl.className = 'font-medium text-gray-900 mb-3 text-center';
                titleEl.textContent = title;
                container.appendChild(titleEl);
                
                // Create responsive matrix wrapper
        const matrixWrapper = document.createElement('div');
        matrixWrapper.className = 'matrix-wrapper';
                
                const table = document.createElement('table');
        table.className = 'matrix-table mx-auto border-collapse border-2 border-gray-400 bg-white shadow-sm rounded-lg overflow-hidden';
        table.style.maxWidth = '100%';
        table.style.tableLayout = 'fixed';
                
                matrix.forEach((row, rowIndex) => {
                    const tr = document.createElement('tr');
                    tr.className = rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white';
                    
                    row.forEach((val, colIndex) => {
                        const td = document.createElement('td');
            td.className = 'border border-gray-300 px-2 py-1 text-center font-mono text-[11px] min-w-[48px] transition-colors hover:bg-blue-50';
                        
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
                
                // Removed JS-driven resize logic; rely on CSS flex wrapping for responsiveness

                return container;
            }

            // Create heatmap visualization with improved responsive layout
            function createHeatmap(matrix, title) {
                const container = document.createElement('div');
                container.className = 'heatmap-container';
                container.setAttribute('role', 'img');
                container.setAttribute('aria-label', `${title}. Color intensity represents attention weight from 0 (low) to 1 (high).`);
                
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
                
                // Calculate optimal cell size with responsive adjustment
                let cellSize = Math.max(32, Math.min(60, 300 / Math.max(matrix.length, matrix[0].length)));
                function applyResponsiveSizing() {
                    try {
                        const available = heatmapWrapper.clientWidth || window.innerWidth - 64;
                        const required = (matrix[0].length * (cellSize + 4)); // 4 ~ gap + border
                        if (required > available) {
                            const scale = available / required;
                            const target = Math.max(20, Math.floor(cellSize * scale));
                            cellSize = target;
                        }
                    } catch(e) { /* ignore */ }
                }
                applyResponsiveSizing();
                
        matrix.forEach((row, rowIndex) => {
                    row.forEach((val, colIndex) => {
                        const cell = document.createElement('div');
            cell.className = 'heatmap-cell flex items-center justify-center text-xs font-mono border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500';
                        if (!prefersReducedMotion) {
                            cell.classList.add('transition-transform', 'hover:scale-110');
                        }
                        cell.style.width = `${cellSize}px`;
                        cell.style.height = `${cellSize}px`;
                        
                        // Normalize value to 0-1 range
                        const normalized = maxVal === minVal ? 0.5 : (val - minVal) / (maxVal - minVal);
                        
                        // Create color based on value with better color scheme
                        function paletteColor(norm) {
                            if (paletteSelect && paletteSelect.value === 'viridis') {
                                // Approximate viridis via piecewise interpolation (simple version)
                                const stops = [
                                    [0, 68,1,84],   // #440154
                                    [0.25, 59,82,139],
                                    [0.5, 33,145,140],
                                    [0.75, 94,201,98],
                                    [1, 253,231,37]
                                ];
                                let c = stops[stops.length-1];
                                for (let i=1;i<stops.length;i++) {
                                    if (norm <= stops[i][0]) { // interpolate between i-1 and i
                                        const a = stops[i-1];
                                        const b = stops[i];
                                        const t = (norm - a[0])/(b[0]-a[0]);
                                        const r = Math.round(a[1] + t*(b[1]-a[1]));
                                        const g = Math.round(a[2] + t*(b[2]-a[2]));
                                        const bl = Math.round(a[3] + t*(b[3]-a[3]));
                                        c = [norm,r,g,bl];
                                        break;
                                    }
                                }
                                return `rgb(${c[1]},${c[2]},${c[3]})`;
                            }
                            // Default blue->red HSL
                            const hue = (1 - norm) * 240; // Blue (240) to Red (0)
                            const saturation = 70 + (norm * 30);
                            const lightness = 85 - (norm * 35);
                            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                        }
                        const bg = paletteColor(normalized);
                        cell.style.backgroundColor = bg;
                        cell.style.color = normalized > 0.6 ? 'white' : 'black';
                        
                        // Display value with appropriate precision
                        const displayVal = val < 0.001 ? '0' : val.toFixed(3);
                        cell.textContent = displayVal;
                        
                        // Enhanced tooltip
                        cell.title = `Position (${rowIndex+1},${colIndex+1})\nValue: ${val.toFixed(6)}\nNormalized: ${normalized.toFixed(3)}`;
                        
                        // Accessibility attributes
                        cell.setAttribute('role','button');
                        cell.setAttribute('tabindex','0');
                        cell.setAttribute('aria-label', `Row ${rowIndex+1} attends to Column ${colIndex+1} weight ${val.toFixed(3)}`);
                        const updateDetail = () => {
                            if (!cellDetail) return;
                            cellDetail.classList.remove('hidden');
                            cellDetail.innerHTML = `<strong>Cell (${rowIndex+1}, ${colIndex+1})</strong><br>Raw: ${val.toFixed(6)}<br>Normalized: ${normalized.toFixed(4)}<br>Share of row attention: ${(val*100).toFixed(2)}%`;
                        };
                        cell.addEventListener('click', updateDetail);
                        cell.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateDetail(); } });
                        
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
            function computeAttention(regenerated = false) {
                const seqLen = parseInt(seqLength.value);
                const dk = parseInt(dimK.value);
                const temp = parseFloat(temperature.value);
                const useScaling = scaling.checked;
                const mode = getCurrentMode();

                const shapeChanged = state.seqLen !== seqLen || state.dk !== dk;
                if (shapeChanged || regenerated || !state.Q) {
                    state.Q = generateMatrix(seqLen, dk, -1, 1);
                    state.K = generateMatrix(seqLen, dk, -1, 1);
                    state.V = generateMatrix(seqLen, dk, -1, 1);
                    state.seqLen = seqLen;
                    state.dk = dk;
                }

                // Update displays & feedback
                seqLengthDisplay.textContent = seqLen;
                dimKDisplay.textContent = dk;
                temperatureDisplay.textContent = temp.toFixed(1);
                updateParameterFeedback();
                updateModeVisuals();

                const KT = transpose(state.K);
                const scores = matrixMultiply(state.Q, KT);
                const scaledScores = useScaling ? scaleMatrix(scores, Math.sqrt(dk)) : scores;
                const attentionWeights = softmax(scaledScores, temp);
                const attentionOutput = matrixMultiply(attentionWeights, state.V);

                output.innerHTML = '';
                if (cellDetail) cellDetail.classList.add('hidden');

                if (mode === 'step-by-step') {
                    renderStepByStep(state.Q, state.K, state.V, scores, scaledScores, attentionWeights, attentionOutput, useScaling, dk);
                } else if (mode === 'heatmap') {
                    renderHeatmap(attentionWeights, state.Q, state.K, state.V, seqLen);
                } else if (mode === 'comparison') {
                    renderComparison(state.Q, state.K, state.V, dk, temp);
                }
                updateExplanation(mode, attentionWeights, useScaling, dk, temp);
            }

            // Debounce utility
            function debounce(fn, delay=120) {
                let t; return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), delay); };
            }
            const debouncedCompute = debounce(()=>computeAttention(), 140);

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
                inputGrid.className = 'flex flex-wrap gap-6 justify-center';
                const qBox = displayMatrix(Q, 'Query (Q)', 'bg-blue-50 p-4 rounded-lg border border-blue-200');
                const kBox = displayMatrix(K, 'Key (K)', 'bg-green-50 p-4 rounded-lg border border-green-200');
                const vBox = displayMatrix(V, 'Value (V)', 'bg-purple-50 p-4 rounded-lg border border-purple-200');
                inputGrid.appendChild(qBox);
                inputGrid.appendChild(kBox);
                inputGrid.appendChild(vBox);
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
                typesetMath(container);

                // Resize handler for responsiveness
                if (!window.__q32HeatmapResizeBound) {
                    window.__q32HeatmapResizeBound = true;
                    window.addEventListener('resize', () => {
                        document.querySelectorAll('.heatmap-container').forEach(hc => {
                            const grid = hc.querySelector('.grid');
                            if (!grid) return;
                            // Recompute cell size proportionally
                            const cols = grid.style.gridTemplateColumns.split('repeat(')[1];
                            // crude detection of current cell width
                            const sample = grid.firstChild;
                            if (!sample) return;
                            const available = hc.parentElement ? hc.parentElement.clientWidth - 32 : window.innerWidth - 64;
                            const currentCols = (sample && sample.style && sample.style.width) ? parseInt(sample.style.width, 10) : cellSize;
                            let newSize = currentCols;
                            const required = grid.children.length ? (matrix[0].length * (currentCols + 4)) : 0;
                            if (required > available) {
                                newSize = Math.max(18, Math.floor(available / matrix[0].length) - 4);
                            } else if (available > required * 1.3 && currentCols < 56) {
                                newSize = Math.min(56, Math.floor(available / matrix[0].length) - 4);
                            }
                            if (newSize !== currentCols) {
                                grid.querySelectorAll('.heatmap-cell').forEach(c => {
                                    c.style.width = newSize + 'px';
                                    c.style.height = newSize + 'px';
                                    // adjust font size
                                    c.style.fontSize = (newSize < 26 ? '10px' : newSize < 34 ? '11px' : '12px');
                                });
                            }
                        });
                    });
                }
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
                typesetMath(container);
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
                typesetMath(container);
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

                // Screen-reader summary of dominant attention per row (max weight index)
                if (srSummary && Array.isArray(weights) && weights.length) {
                    try {
                        const summaries = weights.map((row, i) => {
                            let maxVal = -Infinity; let maxIdx = -1;
                            row.forEach((v, j) => { if (v > maxVal) { maxVal = v; maxIdx = j; } });
                            return `Row ${i+1} (token ${i+1}) focuses most on token ${maxIdx+1} with weight ${maxVal.toFixed(3)}`;
                        });
                        srSummary.textContent = `Attention summary: ${summaries.join('. ')}.`;
                    } catch (e) {
                        // ignore
                    }
                }
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
                        debouncedCompute();
                    });
                }
            });

            if (paletteSelect) {
                paletteSelect.addEventListener('change', () => computeAttention());
            }

            if (regenerateBtn) {
                regenerateBtn.addEventListener('click', () => computeAttention(true));
            }

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
            // Initial MathJax typeset (static formulas already on page)
            typesetMath(document.getElementById('q32-output'));
        } // end script function
    } // end interactive
}; // end question object

// CommonJS export (for potential Node-based tooling/tests)
if (typeof module !== 'undefined') {
    module.exports = question;
}
