// Question 17: How do transformers improve on traditional Seq2Seq models?
// Created: July 12, 2025
// Educational Focus: Transformer architecture advantages, parallel processing, attention mechanisms

const question = {
    title: "17. How do transformers improve on traditional Seq2Seq models?",
    answer: `
        <div class="space-y-4">
            <!-- Recommended Reading -->
            <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (if these terms are new)</h4>
                <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                    <li><a href="#question-2" class="text-indigo-700 underline hover:text-indigo-900">Question 2: Attention mechanisms</a></li>
                </ul>
            </div>
            <!-- Main Concept Box -->
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 class="font-semibold text-blue-900 mb-2">🔄 Transformer vs Seq2Seq Evolution</h4>
                <p class="text-blue-800">
                    Transformers revolutionized sequence-to-sequence learning by replacing sequential RNNs with parallel self-attention mechanisms. 
                    Think of it like switching from reading a book word-by-word to instantly accessing any part of the text while understanding 
                    how all parts relate to each other.
                </p>
            </div>
            
            <!-- RNN Explanation -->
            <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                <h4 class="font-semibold text-gray-900 mb-2">🧠 What are RNNs (Recurrent Neural Networks)?</h4>
                <p class="text-gray-800 mb-2">
                    RNNs are neural networks designed for sequential data that process one element at a time, maintaining a "memory" (hidden state) 
                    that gets updated at each step. Imagine reading a sentence word by word, where you remember what you've read so far to understand the current word.
                </p>
                <div class="text-sm text-gray-700 space-y-1">
                    <div>• <strong>Sequential Processing:</strong> Must process tokens one after another (can't parallelize)</div>
                    <div>• <strong>Hidden State:</strong> Carries information from previous time steps</div>
                    <div>• <strong>Memory Limitation:</strong> Earlier information tends to fade over long sequences</div>
                </div>
            </div>
            
            <!-- Key Improvements Comparison -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <h5 class="font-medium text-green-900">🚀 Parallel Processing</h5>
                    <p class="text-sm text-green-700 mb-2">Self-attention processes all tokens simultaneously</p>
                    <code class="text-xs bg-green-100 px-1 rounded block">RNN: n sequential steps → Transformer: 1 parallel round (per layer)</code>
                </div>
                
                <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <h5 class="font-medium text-purple-900">🎯 Long-Range Dependencies</h5>
                    <p class="text-sm text-purple-700 mb-2">Direct attention to any position in the sequence</p>
                    <div class="math-display text-xs">$$\\mathrm{Attention}(Q,K,V) = \\mathrm{softmax}\\!\\left( \\frac{QK^{T}}{\\sqrt{d_k}} \\right) V$$</div>
                </div>
                
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                    <h5 class="font-medium text-orange-900">📍 Positional Encoding</h5>
                    <p class="text-sm text-orange-700 mb-2">Preserves sequence order without sequential processing</p>
                    <div class="math-display text-xs">$$\\begin{align*}
                        \\mathrm{PE}(pos,2i) &= \\sin\\!\\left( pos / 10000^{\\frac{2i}{d_{model}}} \\right) \\\\
                        \\mathrm{PE}(pos,2i+1) &= \\cos\\!\\left( pos / 10000^{\\frac{2i}{d_{model}}} \\right)
                        \\end{align*}$$</div>
                </div>
            </div>
            
            <!-- Traditional Seq2Seq Limitations -->
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 class="font-semibold text-red-900 mb-2">⚠️ Traditional Seq2Seq (RNN-based) Limitations</h4>
                <ul class="text-sm text-red-800 space-y-1">
                    <li>• <strong>Sequential Bottleneck:</strong> RNNs must process tokens one by one (h₁ → h₂ → h₃...), preventing parallelization</li>
                    <li>• <strong>Vanishing Gradients:</strong> Information from early tokens fades as it passes through many RNN steps</li>
                    <li>• <strong>Fixed Context Vector:</strong> Encoder compresses entire sequence into single vector, losing details</li>
                    <li>• <strong>Slow Training:</strong> Sequential nature prevents efficient GPU utilization (can't train in parallel)</li>
                    <li>• <strong>Memory Bottleneck:</strong> Hidden state size limits how much information can be preserved</li>
                </ul>
            </div>

            <!-- Why This Matters -->
            <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Revolution Matters</h4>
                <ul class="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>Training Speed:</strong> 10-100x faster training through parallelization</li>
                    <li>• <strong>Model Scale:</strong> Enables billion-parameter models like GPT and BERT</li>
                    <li>• <strong>Translation Quality:</strong> Better handling of long sentences and context</li>
                    <li>• <strong>Transfer Learning:</strong> Pre-trained transformers work across many tasks</li>
                </ul>
            </div>
        </div>
    `,
    interactive: {
        title: "🔄 Seq2Seq vs Transformer Architecture Comparison",
        html: `
            <div class="space-y-6">
                <!-- Input Section (Dropdown-controlled) -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q17-example-select" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose an example sequence</label>
                    <select id="q17-example-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></select>
                    <p class="text-xs text-gray-600 mt-1">Pick a built-in example to see how each architecture processes it</p>
                </div>
                
                <!-- Architecture Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🏗️ Choose Architecture to Analyze</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="cursor-pointer">
                            <input type="radio" name="q17-architecture" value="seq2seq" class="sr-only" checked>
                            <div class="border-2 border-red-200 rounded-lg p-3 hover:border-red-300 transition-colors bg-red-50">
                                <div class="font-medium text-red-900">Traditional Seq2Seq</div>
                                <div class="text-xs text-red-700 mt-1">RNN Encoder-Decoder</div>
                                <div class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded mt-2 inline-block">Sequential</div>
                            </div>
                        </label>
                        
                        <label class="cursor-pointer">
                            <input type="radio" name="q17-architecture" value="transformer" class="sr-only">
                            <div class="border-2 border-green-200 rounded-lg p-3 hover:border-green-300 transition-colors bg-green-50">
                                <div class="font-medium text-green-900">Transformer</div>
                                <div class="text-xs text-green-700 mt-1">Self-Attention Based</div>
                                <div class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded mt-2 inline-block">Parallel</div>
                            </div>
                        </label>
                        
                        <label class="cursor-pointer">
                            <input type="radio" name="q17-architecture" value="comparison" class="sr-only">
                            <div class="border-2 border-purple-200 rounded-lg p-3 hover:border-purple-300 transition-colors bg-purple-50">
                                <div class="font-medium text-purple-900">Side-by-Side</div>
                                <div class="text-xs text-purple-700 mt-1">Direct Comparison</div>
                                <div class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded mt-2 inline-block">Analysis</div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Quick Examples removed: controlled via dropdown above -->
                
                <!-- Processing Visualization -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">🎨 Processing Visualization</h4>
                        <div id="q17-architecture-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Traditional Seq2Seq</div>
                    </div>
                    <div id="q17-output" class="min-h-[200px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                        <!-- Processing visualization will be generated here -->
                    </div>
                    <div id="q17-legend" class="mt-3 text-xs">
                        <!-- Legend will be generated here -->
                    </div>
                </div>
                
                <!-- Performance Metrics -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-medium text-blue-900 mb-2">📊 Performance Comparison</h4>
                    <div id="q17-metrics" class="text-sm text-blue-800">
                        <!-- Metrics will be generated here -->
                    </div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">🎓 Architecture Analysis</h4>
                    <div id="q17-explanation" class="text-sm text-yellow-800">
                        <!-- Dynamic explanation will be generated here -->
                    </div>
                </div>
            </div>
        `,
        script: () => {
            // Get DOM elements
            const exampleSelect = document.getElementById('q17-example-select');
            const output = document.getElementById('q17-output');
            const legend = document.getElementById('q17-legend');
            const explanation = document.getElementById('q17-explanation');
            const metrics = document.getElementById('q17-metrics');
            const indicator = document.getElementById('q17-architecture-indicator');
            
            if (!exampleSelect || !output || !explanation) return;

            // Example sentences
            const examples = [
                { label: 'Pangram (short)', text: "The quick brown fox jumps over the lazy dog" },
                { label: 'Long sentence (dependencies)', text: "Machine translation has revolutionized how we communicate across language barriers in the modern digital world" },
                { label: 'Story fragment', text: "When I was young, my grandmother told me stories that shaped my worldview" },
                { label: 'Research phrase', text: "The research paper demonstrates significant improvements in neural network architectures" },
                { label: 'Project outcome', text: "Despite the challenges, the team successfully completed the project on time" }
            ];

            // Populate dropdown
            examples.forEach((ex, idx) => {
                const opt = document.createElement('option');
                opt.value = String(idx);
                opt.textContent = `${ex.label}: ${ex.text}`;
                exampleSelect.appendChild(opt);
            });
            exampleSelect.value = '0';

            // Architecture configurations
            const architectureConfig = {
                seq2seq: {
                    name: 'Traditional Seq2Seq',
                    color: 'red',
                    description: 'RNN-based encoder-decoder with sequential processing'
                },
                transformer: {
                    name: 'Transformer',
                    color: 'green',
                    description: 'Self-attention based with parallel processing'
                },
                comparison: {
                    name: 'Side-by-Side Comparison',
                    color: 'purple',
                    description: 'Direct architecture comparison'
                }
            };

            // Process input and visualize
            const processInput = () => {
                const idx = parseInt(exampleSelect.value, 10) || 0;
                const text = examples[idx].text.trim();
                if (!text) return;

                const selectedArch = document.querySelector('input[name="q17-architecture"]:checked');
                if (!selectedArch) return;

                const architecture = selectedArch.value;
                const config = architectureConfig[architecture];
                
                // Update indicator
                indicator.textContent = config.name;
                indicator.className = `text-xs bg-${config.color}-100 text-${config.color}-700 px-2 py-1 rounded font-medium`;

                // Clear previous results
                output.innerHTML = '';
                legend.innerHTML = '';

                // Tokenize the input
                const tokens = text.split(' ');
                
                if (architecture === 'seq2seq') {
                    visualizeSeq2Seq(tokens);
                } else if (architecture === 'transformer') {
                    visualizeTransformer(tokens);
                } else {
                    visualizeComparison(tokens);
                }

                updateMetrics(tokens, architecture);
                updateExplanation(architecture, tokens.length);
            };

            // Visualize traditional Seq2Seq processing
            const visualizeSeq2Seq = (tokens) => {
                const container = document.createElement('div');
                container.className = 'space-y-4';

                // Encoder section
                const encoderDiv = document.createElement('div');
                encoderDiv.innerHTML = `
                    <h5 class="font-medium text-red-900 mb-2">📥 RNN Encoder (Sequential Processing)</h5>
                    <div class="mb-3 text-xs text-red-700">
                        <strong>RNN Process:</strong> Each word updates the hidden state sequentially: h₀ → h₁ → h₂ → h₃...
                    </div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
                        ${tokens.map((token, i) => `
                            <div class="relative">
                                <div class="bg-red-100 border border-red-300 px-2 py-1 rounded text-xs">${token}</div>
                                <div class="text-xs text-red-600 mt-1 text-center">
                                    <div>h${i + 1}</div>
                                    <div class="text-[10px]">step ${i + 1}</div>
                                </div>
                            </div>
                ${i < tokens.length - 1 ? '<div class="text-red-400 text-xs">→</div>' : ''}
                        `).join('')}
                    </div>
                    <div class="bg-red-200 p-2 rounded text-xs text-red-800">
                        <strong>Final Context Vector:</strong> All sequence information compressed into h${tokens.length}
                        <div class="text-[10px] mt-1">Problem: Early token information may be lost!</div>
                    </div>
                `;

                // Decoder section
                const decoderDiv = document.createElement('div');
                decoderDiv.innerHTML = `
                    <h5 class="font-medium text-red-900 mb-2">📤 RNN Decoder (Sequential Generation)</h5>
                    <div class="mb-2 text-xs text-red-700">
                        <strong>RNN Limitation:</strong> Decoder can only use the fixed context vector + its own hidden state
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="bg-red-200 px-2 py-1 rounded text-xs">
                            <div>Context h${tokens.length}</div>
                            <div class="text-[10px]">Fixed!</div>
                        </div>
                        <div class="text-red-400">→</div>
                        <div class="bg-red-100 border border-red-300 px-2 py-1 rounded text-xs">Output₁</div>
                        <div class="text-red-400">→</div>
                        <div class="bg-red-100 border border-red-300 px-2 py-1 rounded text-xs">Output₂</div>
                        <div class="text-red-400">→</div>
                        <div class="text-red-400">...</div>
                    </div>
                    <div class="mt-2 text-xs text-red-600">
                        ⚠️ No direct access to individual input tokens - everything must go through the context vector!
                    </div>
                `;

                container.appendChild(encoderDiv);
                container.appendChild(decoderDiv);
                output.appendChild(container);

                // Legend
                legend.innerHTML = `
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                            <span>Sequential Processing</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-red-200 rounded"></div>
                            <span>Context Vector</span>
                        </div>
                    </div>
                `;
            };

            // Visualize Transformer processing
            const visualizeTransformer = (tokens) => {
                const container = document.createElement('div');
                container.className = 'space-y-4';

                // Self-attention visualization with clearer matrix representation
                const attentionDiv = document.createElement('div');
                attentionDiv.innerHTML = `
                    <h5 class="font-medium text-green-900 mb-2">🎯 Self-Attention Matrix (All tokens process simultaneously)</h5>
                    <div class="mb-3 text-xs text-green-700">
                        <strong>Key Innovation:</strong> Every token can directly attend to every other token in parallel
                    </div>
                    <div class="overflow-x-auto">
                        <table class="border-collapse border border-green-300 text-xs">
                            <thead>
                                <tr class="bg-green-100">
                                    <th class="border border-green-300 p-1 text-green-800">Query →</th>
                                    ${tokens.map(token => `
                                        <th class="border border-green-300 p-1 text-green-800 min-w-12">${token.slice(0,4)}</th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${tokens.map((queryToken, i) => `
                                    <tr>
                                        <td class="border border-green-300 p-1 bg-green-100 font-medium text-green-800">${queryToken.slice(0,4)}</td>
                                        ${tokens.map((keyToken, j) => {
                                            // Create realistic attention patterns
                                            let attention = 0.1; // base attention
                                            if (i === j) attention = 0.8; // self-attention
                                            else if (Math.abs(i - j) === 1) attention = 0.6; // adjacent words
                                            else if (Math.abs(i - j) === 2) attention = 0.3; // nearby words
                                            else attention = 0.1 + Math.random() * 0.2; // distant words
                                            
                                            const intensity = Math.round(attention * 100);
                                            const bgColor = attention > 0.7 ? 'bg-green-600' : 
                                                          attention > 0.5 ? 'bg-green-500' :
                                                          attention > 0.3 ? 'bg-green-400' :
                                                          attention > 0.2 ? 'bg-green-300' : 'bg-green-200';
                                            return `
                                                <td class="border border-green-300 p-1 ${bgColor} text-center text-white text-xs font-bold">
                                                    ${intensity}
                                                </td>
                                            `;
                                        }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="text-xs text-green-700 mt-2">
                        <strong>Attention scores (%):</strong> Higher values = stronger relationships. Each row shows how much one word attends to all others.
                    </div>
                `;

                // Parallel processing demonstration
                const parallelDiv = document.createElement('div');
                parallelDiv.innerHTML = `
                    <h5 class="font-medium text-green-900 mb-2">⚡ Parallel Processing Advantage</h5>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-red-50 p-3 rounded border">
                            <div class="font-medium text-red-800 mb-2">❌ RNN: Sequential (${tokens.length} steps)</div>
                <div class="flex flex-wrap gap-2">
                                ${tokens.map((token, i) => `
                    <div class="flex items-center gap-2 text-xs">
                                        <div class="w-4 h-4 bg-red-200 rounded flex items-center justify-center font-bold">${i+1}</div>
                                        <div class="bg-red-100 px-2 py-1 rounded">${token}</div>
                                        <div class="text-red-600">→ h${i+1}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="text-red-600 text-xs mt-2">⏱️ Total time: ${tokens.length} steps</div>
                        </div>
                        
                        <div class="bg-green-50 p-3 rounded border">
                            <div class="font-medium text-green-800 mb-2">✅ Transformer: Parallel (1 step)</div>
                            <div class="flex flex-wrap gap-2">
                                ${tokens.map((token, i) => `
                                    <div class="flex items-center space-x-1 text-xs">
                                        <div class="w-4 h-4 bg-green-500 rounded flex items-center justify-center font-bold text-white">∀</div>
                                        <div class="bg-green-100 px-2 py-1 rounded whitespace-nowrap">${token}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="text-green-600 text-xs mt-2">⚡ Total time: 1 step (all parallel)</div>
                        </div>
                    </div>
                `;

                // Positional encoding explanation
                const positionDiv = document.createElement('div');
                positionDiv.innerHTML = `
                    <h5 class="font-medium text-green-900 mb-2">📍 Positional Encoding Solution</h5>
                    <div class="mb-2 text-xs text-green-700">
                        <strong>Problem:</strong> Without sequential processing, how does the model know word order?<br>
                        <strong>Solution:</strong> Add position information to each token embedding
                    </div>
                    <div class="grid grid-cols-${Math.min(tokens.length, 4)} gap-2">
                        ${tokens.slice(0, 4).map((token, i) => `
                            <div class="text-center">
                                <div class="bg-green-100 border border-green-300 px-2 py-2 rounded text-xs mb-1">
                                    <div class="font-medium">${token}</div>
                                    <div class="text-green-600">+</div>
                                    <div class="bg-green-200 px-1 py-1 rounded mt-1">pos${i}</div>
                                </div>
                                <div class="text-xs text-green-600">Position ${i}</div>
                            </div>
                        `).join('')}
                        ${tokens.length > 4 ? '<div class="text-green-400 text-center text-xs self-center">...</div>' : ''}
                    </div>
                    <div class="text-xs text-green-700 mt-2">
                        Each token = word embedding + positional encoding (preserves order without sequential processing)
                    </div>
                `;

                container.appendChild(attentionDiv);
                container.appendChild(parallelDiv);
                container.appendChild(positionDiv);
                output.appendChild(container);

                // Enhanced legend
                legend.innerHTML = `
                    <div class="grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <div class="font-medium text-green-900 mb-1">Attention Intensity:</div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-green-600 rounded"></div>
                                <span>Strong (70-100%)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-green-400 rounded"></div>
                                <span>Medium (30-70%)</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-green-200 rounded"></div>
                                <span>Weak (0-30%)</span>
                            </div>
                        </div>
                        <div>
                            <div class="font-medium text-green-900 mb-1">Components:</div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                                <span>Token + Position</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 bg-green-500 rounded text-white text-center text-[8px] font-bold">∀</div>
                                <span>Parallel Processing</span>
                            </div>
                        </div>
                    </div>
                `;
            };

            // Visualize side-by-side comparison
            const visualizeComparison = (tokens) => {
                const container = document.createElement('div');
                container.className = 'grid md:grid-cols-2 gap-4';

                // Seq2Seq side
                const seq2seqDiv = document.createElement('div');
                seq2seqDiv.className = 'border border-red-200 rounded-lg p-3 bg-red-50';
                seq2seqDiv.innerHTML = `
                    <h5 class="font-medium text-red-900 mb-2">Traditional Seq2Seq</h5>
                    <div class="space-y-2">
                        <div class="text-xs text-red-700">
                            <strong>Processing:</strong> Sequential (${tokens.length} steps)
                        </div>
                        <div class="flex flex-wrap items-center gap-1">
                            ${tokens.map((token, i) => `
                                <div class="bg-red-100 px-1 py-1 rounded text-xs">${token.slice(0, 3)}${token.length > 3 ? '...' : ''}</div>
                                ${i < tokens.length - 1 ? '<div class="text-red-400 text-xs">→</div>' : ''}
                            `).join('')}
                        </div>
                        <div class="bg-red-200 p-2 rounded text-xs">
                            Context Vector (fixed size)
                        </div>
                        <div class="text-xs text-red-600">
                            ⚠️ Information bottleneck<br>
                            ⚠️ Vanishing gradients<br>
                            ⚠️ No parallelization
                        </div>
                    </div>
                `;

                // Transformer side
                const transformerDiv = document.createElement('div');
                transformerDiv.className = 'border border-green-200 rounded-lg p-3 bg-green-50';
                transformerDiv.innerHTML = `
                    <h5 class="font-medium text-green-900 mb-2">Transformer</h5>
                    <div class="space-y-2">
                        <div class="text-xs text-green-700">
                            <strong>Processing:</strong> Parallel (1 step)
                        </div>
                        <div class="grid grid-cols-${Math.min(tokens.length, 4)} gap-1">
                            ${tokens.slice(0, 4).map((token, i) => `
                                <div class="bg-green-100 px-1 py-1 rounded text-xs text-center">${token.slice(0, 3)}${token.length > 3 ? '...' : ''}</div>
                            `).join('')}
                            ${tokens.length > 4 ? '<div class="text-green-400 text-xs">...</div>' : ''}
                        </div>
                        <div class="bg-green-200 p-2 rounded text-xs">
                            Self-Attention Matrix (${tokens.length}×${tokens.length})
                        </div>
                        <div class="text-xs text-green-600">
                            ✅ Direct connections<br>
                            ✅ Parallel processing<br>
                            ✅ Scalable training
                        </div>
                    </div>
                `;

                container.appendChild(seq2seqDiv);
                container.appendChild(transformerDiv);
                output.appendChild(container);

                // Legend
                legend.innerHTML = `
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-red-100 rounded"></div>
                            <span>Seq2Seq Processing</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-green-100 rounded"></div>
                            <span>Transformer Processing</span>
                        </div>
                    </div>
                `;
            };

            // Update performance metrics
            const updateMetrics = (tokens, architecture) => {
                const seqLength = tokens.length;
                const transformerComplexity = seqLength * seqLength; // O(n^2) compute & memory for full attention
                const seq2seqComplexity = seqLength; // O(n)

                if (architecture === 'seq2seq') {
                    metrics.innerHTML = `
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <div class="font-medium text-red-900">Parallel rounds</div>
                                <div class="text-red-700">${seqLength} (sequential steps)</div>
                            </div>
                            <div>
                                <div class="font-medium text-red-900">Compute complexity</div>
                                <div class="text-red-700">O(${seq2seqComplexity})</div>
                            </div>
                        </div>
                        <div class="grid md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <div class="font-medium text-red-900">Memory</div>
                                <div class="text-red-700">O(${seq2seqComplexity})</div>
                            </div>
                        </div>
                        <div class="mt-2 text-red-600 text-xs">Processing is inherently sequential; limited parallelism.</div>
                    `;
                } else if (architecture === 'transformer') {
                    metrics.innerHTML = `
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <div class="font-medium text-green-900">Parallel rounds</div>
                                <div class="text-green-700">1 (idealized, per layer)</div>
                            </div>
                            <div>
                                <div class="font-medium text-green-900">Compute complexity</div>
                                <div class="text-green-700">O(${transformerComplexity})</div>
                            </div>
                        </div>
                        <div class="grid md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <div class="font-medium text-green-900">Memory</div>
                                <div class="text-green-700">O(${transformerComplexity})</div>
                            </div>
                        </div>
                        <div class="mt-2 text-green-600 text-xs">Highly parallelizable with quadratic compute/memory for full attention.</div>
                    `;
                } else {
                    metrics.innerHTML = `
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="bg-red-100 p-2 rounded">
                                <div class="font-medium text-red-900">Seq2Seq</div>
                                <div class="text-red-700 text-xs">Parallel rounds: ${seqLength}; Compute: O(${seq2seqComplexity}); Memory: O(${seq2seqComplexity})</div>
                            </div>
                            <div class="bg-green-100 p-2 rounded">
                                <div class="font-medium text-green-900">Transformer</div>
                                <div class="text-green-700 text-xs">Parallel rounds: 1; Compute: O(${transformerComplexity}); Memory: O(${transformerComplexity})</div>
                            </div>
                        </div>
                        <div class="mt-2 text-purple-600 text-xs">Transformer trades memory/compute for massive parallelization gains.</div>
                    `;
                }
            };

            // Update educational explanation
            const updateExplanation = (architecture, length) => {
                const explanations = {
                    seq2seq: `
                        <strong>How RNN-based Seq2Seq Works:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li><strong>RNN Basics:</strong> Processes one word at a time, updating hidden state h₁ → h₂ → h₃...</li>
                            <li><strong>Sequential Constraint:</strong> Cannot process your ${length}-token sequence in parallel - must wait for each step</li>
                            <li><strong>Information Loss:</strong> By step ${length}, information from step 1 may have faded significantly</li>
                            <li><strong>Context Bottleneck:</strong> Entire sequence meaning squeezed into one fixed-size vector</li>
                            <li><strong>Training Slowness:</strong> GPU cores sit idle since they can't parallelize sequential RNN steps</li>
                        </ul>
                        <div class="mt-2 text-red-600 text-xs">
                            This is why RNN Seq2Seq struggles with long sentences - early words get "forgotten"!
                        </div>
                    `,
                    transformer: `
                        <strong>Transformer Advantages:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li>Processes all ${length} tokens simultaneously in parallel</li>
                            <li>Each token can directly attend to any other token via self-attention</li>
                            <li>Positional encodings preserve sequence order without sequential processing</li>
                            <li>Scales efficiently with modern GPU architectures</li>
                            <li>Enables much larger models and datasets</li>
                        </ul>
                        <div class="mt-2 text-green-600 text-xs">
                            The attention mechanism creates a ${length}×${length} matrix showing how each token relates to every other token.
                        </div>
                    `,
                    comparison: `
                        <strong>RNN vs Transformer Architecture:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li><strong>Processing Model:</strong> RNN sequential steps (h₁→h₂→h₃) vs Transformer parallel self-attention</li>
                            <li><strong>Information Flow:</strong> RNN hidden state chain vs Direct token-to-token connections</li>
                            <li><strong>Memory:</strong> RNN fixed hidden state size vs Attention matrix stores all relationships</li>
                            <li><strong>Training Speed:</strong> RNN sequential bottleneck vs Transformer massive parallelization</li>
                            <li><strong>Long Dependencies:</strong> RNN information decay vs Transformer direct access to any position</li>
                        </ul>
                        <div class="mt-2 text-purple-600 text-xs">
                            The transformer's "attention is all you need" breakthrough eliminated RNN's fundamental sequential constraint.
                        </div>
                    `
                };

                explanation.innerHTML = explanations[architecture];
            };

            // Example cycling
            // Event listeners
            exampleSelect.addEventListener('change', processInput);
            document.querySelectorAll('input[name="q17-architecture"]').forEach(radio => {
                radio.addEventListener('change', processInput);
            });

            // Initial processing
            processInput();
        }
    }
};
