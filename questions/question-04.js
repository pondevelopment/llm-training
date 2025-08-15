// Question 4: LoRA vs QLoRA Fine-tuning
// Created: July 8, 2025
// Educational Focus: Understanding efficient fine-tuning techniques, parameter reduction, and quantization

const question = {
    title: "4. What distinguishes LoRA from QLoRA in fine-tuning LLMs?",
    answer: `<div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🎯 What is Efficient Fine-tuning?</h4>
            <p class="text-blue-800">Instead of updating all billions of parameters in an LLM (which requires massive GPU memory), efficient fine-tuning methods like LoRA and QLoRA only train a small subset of parameters. Think of it like learning a new skill by adding specialized tools to your toolkit rather than replacing everything you know.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Full Fine-tuning</h5>
                <p class="text-sm text-green-700">Updates all model parameters for maximum flexibility</p>
                <code class="text-xs bg-green-100 px-1 rounded">Typical 7B training: ~60–80 GB</code>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">LoRA (Low-Rank Adaptation)</h5>
                <p class="text-sm text-purple-700">Adds small trainable matrices while freezing base model</p>
                <code class="text-xs bg-purple-100 px-1 rounded">Typical 7B training: ~20–35 GB</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">QLoRA (Quantized LoRA)</h5>
                <p class="text-sm text-orange-700">LoRA + 4-bit quantization for extreme efficiency</p>
                <code class="text-xs bg-orange-100 px-1 rounded">Typical 7B training: ~8–14 GB</code>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Accessibility:</strong> QLoRA enables fine-tuning large models on consumer GPUs</li>
                <li>• <strong>Efficiency:</strong> LoRA reduces trainable parameters by 99%+ while maintaining performance</li>
                <li>• <strong>Deployment:</strong> Smaller adapter weights make model distribution much easier</li>
                <li>• <strong>Cost Reduction:</strong> Dramatically lower cloud computing costs for fine-tuning</li>
            </ul>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-2">ℹ️ Practical Notes & Caveats</h4>
            <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
                <li><strong>Memory depends on</strong> batch size, sequence length, precision, optimizer, and activation checkpointing.</li>
                <li><strong>QLoRA</strong> typically uses 4-bit NF4 quantization for the frozen base; adapters remain in BF16/FP16.</li>
                <li><strong>Quality</strong> is usually close to full fine-tuning; slight regressions can occur with heavy quantization.</li>
                <li><strong>PEFT</strong> (adapters) is ideal for domain/task adaptation; use full FT when you must modify core capabilities.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔧 Interactive Fine-tuning Comparator",
        html: `<div class="space-y-6">
            <!-- Model Configuration -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">🏗️ Select Model Size to Fine-tune</label>
                <select id="q4-model-size" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="small" selected>Small Model (1.3B parameters)</option>
                    <option value="medium">Medium Model (7B parameters)</option>
                    <option value="large">Large Model (13B parameters)</option>
                    <option value="xl">XL Model (70B parameters)</option>
                </select>
                <p class="text-xs text-blue-700 font-medium mt-2 bg-blue-100 px-2 py-1 rounded">👆 See how memory requirements change with model size!</p>
            </div>
            
            <!-- Fine-tuning Method Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Fine-tuning Method</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="cursor-pointer">
                        <input type="radio" name="q4-method" value="full" class="sr-only">
                        <div class="border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 transition-colors">
                            <div class="font-medium text-green-900">Full Fine-tuning</div>
                            <div class="text-xs text-green-700">Maximum Flexibility</div>
                            <div class="text-xs text-green-600 mt-1">Updates all parameters</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q4-method" value="lora" class="sr-only" checked>
                        <div class="border-2 border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <div class="font-medium text-purple-900">LoRA</div>
                            <div class="text-xs text-purple-700">Efficient</div>
                            <div class="text-xs text-purple-600 mt-1">Low-rank adapters</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q4-method" value="qlora" class="sr-only">
                        <div class="border-2 border-orange-200 rounded-lg p-3 hover:border-orange-400 hover:bg-orange-50 transition-colors">
                            <div class="font-medium text-orange-900">QLoRA</div>
                            <div class="text-xs text-orange-700">Ultra Efficient</div>
                            <div class="text-xs text-orange-600 mt-1">LoRA + Quantization</div>
                        </div>
                    </label>
                </div>
                <!-- Adapter / Precision Controls -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">Adapter rank (r)</label>
                        <select id="q4-rank" class="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="4">r = 4 (small)</option>
                            <option value="8" selected>r = 8 (balanced)</option>
                            <option value="16">r = 16</option>
                            <option value="32">r = 32 (large)</option>
                        </select>
                    </div>
                    <div id="q4-quant-wrapper">
                        <label class="block text-xs text-gray-600 mb-1">Quantization (base model)</label>
                        <select id="q4-quant" class="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="4" selected>4-bit NF4 (QLoRA)</option>
                            <option value="8">8-bit (LLM.int8)</option>
                            <option value="16">16-bit (no quantization)</option>
                        </select>
                        <p id="q4-quant-note" class="text-[11px] text-gray-500 mt-1">Only applies when QLoRA is selected</p>
                    </div>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q4-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: Consumer GPU scenario</button>
            </div>
            
            <!-- Visualization -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Parameter Visualization</h4>
                    <div id="q4-method-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">LoRA Method</div>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Matrix Visualization -->
                    <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Weight Matrix Structure</h5>
                        <div id="q4-matrix-visualization" class="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                            <div id="q4-matrix-display" class="grid gap-1"></div>
                        </div>
                        <div id="q4-matrix-legend" class="mt-2 text-xs">
                            <div class="flex flex-wrap gap-3">
                                <span class="inline-flex items-center gap-1">
                                    <span class="w-3 h-3 bg-gray-300 rounded"></span>
                                    Frozen Parameters
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <span class="w-3 h-3 bg-blue-500 rounded"></span>
                                    Trainable Parameters
                                </span>
                                <span class="inline-flex items-center gap-1">
                                    <span class="w-3 h-3 bg-orange-400 rounded"></span>
                                    Quantized (4-bit)
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Memory & Performance Stats -->
                    <div class="space-y-4">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h6 class="font-medium text-blue-900 mb-2">💾 Memory Requirements</h6>
                            <div class="text-2xl font-bold text-blue-800" id="q4-memory-value">~50 GB</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div id="q4-memory-bar" class="bg-blue-500 h-2 rounded-full transition-all duration-500" style="width: 20%"></div>
                            </div>
                            <div class="text-xs text-blue-700 mt-1" id="q4-memory-note">GPU Memory Usage</div>
                        </div>
                        
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h6 class="font-medium text-green-900 mb-2">⚡ Training Speed</h6>
                            <div class="text-lg font-bold text-green-800" id="q4-speed-value">3x faster</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div id="q4-speed-bar" class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: 75%"></div>
                            </div>
                            <div class="text-xs text-green-700 mt-1" id="q4-speed-note">vs Full Fine-tuning</div>
                        </div>
                        
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <h6 class="font-medium text-purple-900 mb-2">🎯 Parameter Efficiency</h6>
                            <div class="text-lg font-bold text-purple-800" id="q4-efficiency-value">99.6% reduction</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div id="q4-efficiency-bar" class="bg-purple-500 h-2 rounded-full transition-all duration-500" style="width: 95%"></div>
                            </div>
                            <div class="text-xs text-purple-700 mt-1" id="q4-efficiency-note">in trainable parameters</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quantization Explorer -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🧩 Quantization Explorer (4-bit vs 16-bit)</h4>
                    <button id="q4-quant-refresh" class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded border border-gray-200 hover:bg-gray-200 transition-colors">Regenerate Sample</button>
                </div>
                <p class="text-xs text-gray-600 mb-3">Visualization of weight values before and after quantization. Left shows full precision (FP16-like), right shows quantized weights (selected bits, default 4-bit NF4-like). Bins are denser near zero to preserve small weights.</p>
                <div class="grid md:grid-cols-3 gap-4 items-start">
                    <div class="md:col-span-2">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <div class="text-xs text-gray-700 mb-1">Baseline: Full precision</div>
                                <canvas id="q4-quant-matrix-fp16" width="240" height="240" class="border rounded w-full"></canvas>
                            </div>
                            <div>
                                <div id="q4-quant-label" class="text-xs text-gray-700 mb-1">Quantized: 4-bit (NF4-like)</div>
                                <canvas id="q4-quant-matrix-4bit" width="240" height="240" class="border rounded w-full"></canvas>
                            </div>
                        </div>
                        <div class="mt-2 text-[11px] text-gray-600">
                            Why they look similar: 4-bit NF4 keeps most small weights (common in LLMs), so structure is preserved; at this coarse grid and grayscale, per-weight changes are subtle. The histogram and error metrics show the numeric impact, which can accumulate across layers.
                        </div>
                        <div class="mt-3">
                            <div class="text-xs text-gray-700 mb-1">Weight distribution and quantization levels</div>
                            <canvas id="q4-quant-hist" width="520" height="160" class="border rounded w-full"></canvas>
                        </div>
                        <div class="mt-3">
                            <label class="inline-flex items-center gap-2 text-xs text-gray-700">
                                <input id="q4-quant-show-diff" type="checkbox" class="align-middle">
                                Show error heatmap (|full − quant|)
                            </label>
                            <div class="mt-2 hidden" id="q4-quant-diff-wrap">
                                <canvas id="q4-quant-diff" width="240" height="240" class="border rounded w-full"></canvas>
                                <div class="text-[11px] text-gray-600 mt-1">Redder cells indicate larger per-weight error. This exaggerates tiny differences for visibility.</div>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                            <div class="font-medium text-blue-900">Bits per weight</div>
                            <div id="q4-quant-bits" class="text-blue-800">16 → 4 (4x reduction)</div>
                        </div>
                        <div class="bg-green-50 border border-green-200 rounded p-2 text-xs">
                            <div class="font-medium text-green-900">Approx. error</div>
                            <div id="q4-quant-error" class="text-green-800">MSE: —, MAE: —</div>
                        </div>
                        <div class="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                            <div class="font-medium text-yellow-900">Note</div>
                            <div class="text-yellow-800">This uses an NF4-like non-uniform codebook (denser near 0) for illustration.</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Technical Breakdown -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">📊 Technical Breakdown</h4>
                <div id="q4-breakdown" class="grid md:grid-cols-2 gap-4 text-sm">
                    <!-- Content will be populated dynamically -->
                </div>
            </div>
            
            <!-- Practical Scenarios -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-3">🎮 Practical Scenarios</h4>
                <div class="grid md:grid-cols-2 gap-3">
                    <button id="q4-gpu-check" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors text-left">
                        🖥️ Check GPU Compatibility
                    </button>
                    <button id="q4-cost-calc" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors text-left">
                        💰 Calculate Training Cost
                    </button>
                </div>
                <div id="q4-scenario-output" class="mt-3 p-3 bg-white rounded-lg border hidden">
                    <div class="text-sm"></div>
                </div>
            </div>
            
            <!-- Educational Explanation -->
            <div id="q4-explanation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 How It Works</h4>
                <div id="q4-explanation-content" class="text-sm text-yellow-800">
                    Select a fine-tuning method above to see how different approaches balance memory efficiency, training speed, and parameter reduction. Each method represents a different trade-off in the efficiency vs. flexibility spectrum.
                </div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const modelSelect = document.getElementById('q4-model-size');
            const methodIndicator = document.getElementById('q4-method-indicator');
            const matrixDisplay = document.getElementById('q4-matrix-display');
            const memoryValue = document.getElementById('q4-memory-value');
            const memoryBar = document.getElementById('q4-memory-bar');
            const memoryNote = document.getElementById('q4-memory-note');
            const speedValue = document.getElementById('q4-speed-value');
            const speedBar = document.getElementById('q4-speed-bar');
            const speedNote = document.getElementById('q4-speed-note');
            const efficiencyValue = document.getElementById('q4-efficiency-value');
            const efficiencyBar = document.getElementById('q4-efficiency-bar');
            const efficiencyNote = document.getElementById('q4-efficiency-note');
            const breakdown = document.getElementById('q4-breakdown');
            const explanationContent = document.getElementById('q4-explanation-content');
            const exampleBtn = document.getElementById('q4-example-btn');
            const gpuCheckBtn = document.getElementById('q4-gpu-check');
            const costCalcBtn = document.getElementById('q4-cost-calc');
            const scenarioOutput = document.getElementById('q4-scenario-output');
            const rankSelect = document.getElementById('q4-rank');
            const quantSelect = document.getElementById('q4-quant');
            const quantWrapper = document.getElementById('q4-quant-wrapper');
            const quantNote = document.getElementById('q4-quant-note');
            // Quantization explorer elements
            const quantRefreshBtn = document.getElementById('q4-quant-refresh');
            const quantMatFP = document.getElementById('q4-quant-matrix-fp16');
            const quantMatQB = document.getElementById('q4-quant-matrix-4bit');
            const quantHist = document.getElementById('q4-quant-hist');
            const quantBitsEl = document.getElementById('q4-quant-bits');
            const quantErrorEl = document.getElementById('q4-quant-error');
            const quantLabelEl = document.getElementById('q4-quant-label');
            const quantShowDiffEl = document.getElementById('q4-quant-show-diff');
            const quantDiffCanvas = document.getElementById('q4-quant-diff');
            const quantDiffWrap = document.getElementById('q4-quant-diff-wrap');
            
            if (!modelSelect || !breakdown) return;

            // Configuration data for different methods and model sizes
            const modelSizes = {
                small: { name: '1.3B', params: 1.3, baseMemory: 5 },
                medium: { name: '7B', params: 7, baseMemory: 28 },
                large: { name: '13B', params: 13, baseMemory: 52 },
                xl: { name: '70B', params: 70, baseMemory: 280 }
            };

        const methodConfig = {
                full: {
                    name: 'Full Fine-tuning',
            color: 'green',
            memoryMultiplier: 2.5,
                    speedMultiplier: 1,
                    paramReduction: 0,
                    description: 'Updates all model parameters, requiring the most memory but offering maximum flexibility. The base model and gradients must be stored in memory simultaneously.'
                },
                lora: {
                    name: 'LoRA',
            color: 'purple', 
            memoryMultiplier: 1.2,
                    speedMultiplier: 3,
                    paramReduction: 99.6,
                    description: 'Freezes the base model and adds small trainable low-rank matrices. Only the adapter parameters are updated, dramatically reducing memory requirements while maintaining performance.'
                },
                qlora: {
                    name: 'QLoRA', 
            color: 'orange',
            memoryMultiplier: 0.45,
                    speedMultiplier: 2.5,
                    paramReduction: 99.6,
                    description: 'Combines LoRA with 4-bit quantization of the base model. The frozen parameters use 75% less memory while LoRA adapters remain in full precision for training.'
                }
            };

            // Get current selections
            function getCurrentMethod() {
                const selected = document.querySelector('input[name="q4-method"]:checked');
                return selected ? selected.value : 'lora';
            }

            function getCurrentModel() {
                return modelSelect.value;
            }

            function getCurrentRank() {
                const r = parseInt(rankSelect?.value || '8', 10);
                return Number.isFinite(r) ? r : 8;
            }

            function getCurrentQuant() {
                const q = parseInt(quantSelect?.value || '4', 10);
                return Number.isFinite(q) ? q : 4;
            }

            // --- Quantization Explorer Helpers ---
            // Gaussian random via Box-Muller
            function randn() {
                let u = 0, v = 0;
                while (u === 0) u = Math.random();
                while (v === 0) v = Math.random();
                return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            }
            // Create a sample of weights N(0, 0.5), clamp to [-1, 1]
            function sampleWeights(n = 256) {
                const arr = new Array(n);
                for (let i = 0; i < n; i++) {
                    const val = randn() * 0.5;
                    arr[i] = Math.max(-1, Math.min(1, val));
                }
                return arr;
            }
            // NF4-like codebook levels (non-uniform, denser near 0). Illustrative only.
            function nf4Codebook() {
                return [-1.0,-0.70,-0.55,-0.42,-0.32,-0.24,-0.17,-0.10,0.10,0.17,0.24,0.32,0.42,0.55,0.70,1.0];
            }
            function uniformCodebook(bits) {
                const levels = 1 << bits;
                const arr = new Array(levels);
                for (let i = 0; i < levels; i++) {
                    arr[i] = -1 + (2 * i) / (levels - 1);
                }
                return arr;
            }
            function getCodebook(bits) {
                if (bits === 4) return nf4Codebook();
                if (bits === 8) return uniformCodebook(8);
                return null; // 16-bit: baseline, no quantization
            }
            function quantizeToCodebook(values, codebook) {
                if (!codebook) return values.slice();
                return values.map(x => {
                    let best = codebook[0];
                    let bestd = Math.abs(x - best);
                    for (let i = 1; i < codebook.length; i++) {
                        const d = Math.abs(x - codebook[i]);
                        if (d < bestd) { bestd = d; best = codebook[i]; }
                    }
                    return best;
                });
            }
            function drawMatrix(canvas, values) {
                if (!canvas) return;
                const size = Math.sqrt(values.length) | 0;
                const ctx = canvas.getContext('2d');
                const w = canvas.width, h = canvas.height;
                ctx.clearRect(0, 0, w, h);
                const cellW = w / size, cellH = h / size;
                for (let r = 0; r < size; r++) {
                    for (let c = 0; c < size; c++) {
                        const v = values[r * size + c];
                        const g = Math.max(0, Math.min(255, Math.round(((v + 1) / 2) * 255)));
                        ctx.fillStyle = `rgb(${g},${g},${g})`;
                        ctx.fillRect(c * cellW, r * cellH, Math.ceil(cellW), Math.ceil(cellH));
                    }
                }
                // Grid overlay for readability
                ctx.strokeStyle = 'rgba(0,0,0,0.06)';
                for (let i = 1; i < size; i++) {
                    const x = i * cellW; const y = i * cellH;
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
                }
            }
            function drawHistogram(canvas, values, codebook) {
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                const w = canvas.width, h = canvas.height;
                ctx.clearRect(0, 0, w, h);
                // Axes
                ctx.strokeStyle = '#e5e7eb';
                ctx.lineWidth = 1;
                ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
                // Histogram
                const bins = 40;
                const hist = new Array(bins).fill(0);
                const min = -1, max = 1;
                const invSpan = 1 / (max - min);
                values.forEach(v => {
                    const idx = Math.max(0, Math.min(bins - 1, Math.floor((v - min) * invSpan * bins)));
                    hist[idx]++;
                });
                const maxCount = Math.max(...hist);
                const barW = w / bins;
                ctx.fillStyle = '#93c5fd';
                for (let i = 0; i < bins; i++) {
                    const barH = (hist[i] / maxCount) * (h - 20);
                    ctx.fillRect(i * barW + 1, h - barH - 1, barW - 2, barH);
                }
                // Codebook vertical lines
                if (codebook) {
                    ctx.strokeStyle = '#ef4444';
                    ctx.lineWidth = 1;
                    codebook.forEach(level => {
                        const x = ((level - min) * invSpan) * w;
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, h);
                        ctx.stroke();
                    });
                }
            }
            function drawDiffMatrix(canvas, orig, quant) {
                if (!canvas) return;
                const size = Math.sqrt(orig.length) | 0;
                const ctx = canvas.getContext('2d');
                const w = canvas.width, h = canvas.height;
                ctx.clearRect(0, 0, w, h);
                const cellW = w / size, cellH = h / size;
                // compute max abs error for normalization
                let maxErr = 1e-8;
                for (let i = 0; i < orig.length; i++) {
                    const e = Math.abs(orig[i] - quant[i]);
                    if (e > maxErr) maxErr = e;
                }
                for (let r = 0; r < size; r++) {
                    for (let c = 0; c < size; c++) {
                        const idx = r * size + c;
                        const e = Math.abs(orig[idx] - quant[idx]) / maxErr; // 0..1
                        const red = Math.round(255 * e);
                        const green = Math.round(255 * (1 - e) * 0.9);
                        const blue = Math.round(255 * (1 - e) * 0.9);
                        ctx.fillStyle = `rgb(${red},${green},${blue})`;
                        ctx.fillRect(c * cellW, r * cellH, Math.ceil(cellW), Math.ceil(cellH));
                    }
                }
                ctx.strokeStyle = 'rgba(0,0,0,0.06)';
                for (let i = 1; i < size; i++) {
                    const x = i * cellW; const y = i * cellH;
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
                }
            }
            function computeErrors(orig, quant) {
                let mse = 0, mae = 0;
                for (let i = 0; i < orig.length; i++) {
                    const d = orig[i] - quant[i];
                    mse += d * d;
                    mae += Math.abs(d);
                }
                mse /= orig.length; mae /= orig.length;
                return { mse, mae };
            }
            let quantSample = sampleWeights(256); // persistent sample for consistent comparison
            function updateQuantExplorer() {
                const method = getCurrentMethod();
                const bits = method === 'qlora' ? getCurrentQuant() : 4; // default to 4-bit example when not QLoRA
                const codebook = getCodebook(bits);
                // Draw matrices
                drawMatrix(quantMatFP, quantSample);
                const quantized = quantizeToCodebook(quantSample, codebook);
                drawMatrix(quantMatQB, quantized);
                // Histogram with codebook lines
                drawHistogram(quantHist, quantSample, codebook);
                // Stats
                const { mse, mae } = computeErrors(quantSample, quantized);
                if (quantErrorEl) quantErrorEl.textContent = `MSE: ${mse.toFixed(4)}, MAE: ${mae.toFixed(3)}`;
                if (quantBitsEl) {
                    if (bits === 16) quantBitsEl.textContent = '16 → 16 (no reduction)';
                    else if (bits === 8) quantBitsEl.textContent = '16 → 8 (2x reduction)';
                    else quantBitsEl.textContent = '16 → 4 (4x reduction)';
                }
                if (quantLabelEl) {
                    const label = bits === 4 ? 'Quantized: 4-bit (NF4-like)' : bits === 8 ? 'Quantized: 8-bit (uniform)' : 'Quantized: 16-bit (baseline)';
                    quantLabelEl.textContent = label;
                }
                // Diff heatmap toggle
                if (quantShowDiffEl && quantDiffWrap) {
                    if (quantShowDiffEl.checked) {
                        quantDiffWrap.classList.remove('hidden');
                        drawDiffMatrix(quantDiffCanvas, quantSample, quantized);
                    } else {
                        quantDiffWrap.classList.add('hidden');
                    }
                }
            }

            // Create matrix visualization
            function createMatrixVisualization(method) {
                matrixDisplay.innerHTML = '';
                matrixDisplay.style.gridTemplateColumns = 'repeat(10, 1fr)';
                
                for (let i = 0; i < 100; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'w-3 h-3 rounded-sm transition-all duration-300';
                    
                    if (method === 'full') {
                        cell.className += ' bg-blue-500'; // All trainable
                    } else if (method === 'lora') {
                        if (i % 10 === 0 || i % 10 === 1) {
                            cell.className += ' bg-blue-500'; // Adapter parameters
                        } else {
                            cell.className += ' bg-gray-300'; // Frozen parameters
                        }
                    } else if (method === 'qlora') {
                        if (i % 10 === 0 || i % 10 === 1) {
                            cell.className += ' bg-blue-500'; // Adapter parameters
                        } else {
                            cell.className += ' bg-orange-400'; // Quantized frozen parameters
                        }
                    }
                    
                    matrixDisplay.appendChild(cell);
                }
            }

            // Update metrics and visualizations
            function updateDisplay() {
                const method = getCurrentMethod();
                const model = getCurrentModel();
                const modelData = modelSizes[model];
                const methodData = methodConfig[method];
                
                // Update method indicator
                methodIndicator.textContent = methodData.name;
                // Use static classes to avoid Tailwind CDN JIT issues
                methodIndicator.className = 'text-xs px-2 py-1 rounded font-medium';
                const colorClassMap = {
                    green: ['bg-green-100','text-green-700'],
                    purple: ['bg-purple-100','text-purple-700'],
                    orange: ['bg-orange-100','text-orange-700']
                };
                (colorClassMap[methodData.color] || []).forEach(c => methodIndicator.classList.add(c));
                
                // Calculate metrics
                const baseMemory = modelData.baseMemory;
                // Adjust memory for rank (LoRA/QLoRA) and quantization (QLoRA)
                let memoryMultiplier = methodData.memoryMultiplier;
                const rank = getCurrentRank();
                const quant = getCurrentQuant();
                if (getCurrentMethod() === 'lora') {
                    // Scale LoRA memory modestly with rank (heuristic)
                    const rankScale = rank / 8; // baseline r=8
                    memoryMultiplier = methodConfig.lora.memoryMultiplier * (0.9 + 0.1 * rankScale);
                } else if (getCurrentMethod() === 'qlora') {
                    // Scale QLoRA memory with quantization level
                    const quantScale = quant === 4 ? 1 : quant === 8 ? 1.5 : 2.2; // heuristic
                    const rankScale = 0.9 + 0.1 * (rank / 8);
                    memoryMultiplier = methodConfig.qlora.memoryMultiplier * quantScale * rankScale;
                }
                const totalMemory = Math.round(baseMemory * memoryMultiplier);
                const maxMemory = Math.round(modelSizes.xl.baseMemory * methodConfig.full.memoryMultiplier);
                
                // Update memory display
                memoryValue.textContent = `~${totalMemory} GB`;
                memoryBar.style.width = `${Math.min((totalMemory / maxMemory) * 100, 100)}%`;
                memoryNote.textContent = `for ${modelData.name} model`;
                
                // Update speed display
                speedValue.textContent = `${methodData.speedMultiplier}x faster`;
                speedBar.style.width = `${(methodData.speedMultiplier / 3) * 100}%`;
                speedNote.textContent = 'vs Full Fine-tuning';
                
                // Update efficiency display  
                efficiencyValue.textContent = `${methodData.paramReduction}% reduction`;
                efficiencyBar.style.width = `${methodData.paramReduction}%`;
                efficiencyNote.textContent = 'in trainable parameters';
                
                // Update matrix visualization
                createMatrixVisualization(method);
                
                // Update technical breakdown
                updateBreakdown(method, model, methodData, modelData, totalMemory);
                
                // Update explanation
                updateExplanation(methodData, modelData);
                
                // Update visual selection
                updateMethodSelection(method);

                // Enable/disable quantization control based on method
                const quantEnabled = method === 'qlora';
                if (quantSelect) quantSelect.disabled = !quantEnabled;
                if (quantWrapper) {
                    if (!quantEnabled) {
                        quantWrapper.classList.add('opacity-50');
                        quantWrapper.style.pointerEvents = 'none';
                    } else {
                        quantWrapper.classList.remove('opacity-50');
                        quantWrapper.style.pointerEvents = '';
                    }
                }
                if (quantNote) {
                    quantNote.textContent = quantEnabled ? 'Active for QLoRA' : 'Only applies when QLoRA is selected';
                }
            }

            // Update technical breakdown
            function updateBreakdown(method, model, methodData, modelData, totalMemory) {
                const loraRank = getCurrentRank();
                const hiddenSize = model === 'small' ? 2048 : model === 'medium' ? 4096 : model === 'large' ? 5120 : 8192;
                const originalParams = Math.round(modelData.params * 1000) / 1000;
                // Approximate LoRA params in millions: 2 * hidden * r * layers (heuristic layer count)
                const layers = model === 'small' ? 24 : model === 'medium' ? 32 : model === 'large' ? 40 : 80;
                const loraParams = Math.round((2 * hiddenSize * loraRank * layers) / 1e6 * 100) / 100;
                
                let content = `
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Model Statistics</h6>
                        <p class="text-xs">Total Parameters: ${originalParams}B</p>
                        <p class="text-xs">Base Memory: ${modelData.baseMemory} GB</p>
                        <p class="text-xs">Training Memory: ${totalMemory} GB</p>
                    </div>
                `;
                
                if (method === 'full') {
                    content += `
                        <div>
                            <h6 class="font-medium text-gray-800 mb-2">Full Fine-tuning</h6>
                            <p class="text-xs">Trainable Parameters: ${originalParams}B (100%)</p>
                            <p class="text-xs">Memory Overhead: Model + Gradients + Optimizer</p>
                            <p class="text-xs">Precision: 16-bit (FP16)</p>
                        </div>
                    `;
                } else if (method === 'lora') {
                    content += `
                        <div>
                            <h6 class="font-medium text-gray-800 mb-2">LoRA Configuration</h6>
                            <p class="text-xs">Trainable Parameters: ~${loraParams}M (${methodData.paramReduction}% reduction)</p>
                            <p class="text-xs">Rank: r=${loraRank} (low-rank adapters)</p>
                            <p class="text-xs">Base Model: Frozen at 16-bit precision</p>
                        </div>
                    `;
                } else if (method === 'qlora') {
                    content += `
                        <div>
                            <h6 class="font-medium text-gray-800 mb-2">QLoRA Configuration</h6>
                            <p class="text-xs">Trainable Parameters: ~${loraParams}M (${methodData.paramReduction}% reduction)</p>
                            <p class="text-xs">Base Model: ${getCurrentQuant()}-bit quantized</p>
                            <p class="text-xs">Adapters: 16-bit precision for accuracy</p>
                        </div>
                    `;
                }
                
                breakdown.innerHTML = content;
            }

            // Update explanation
            function updateExplanation(methodData, modelData) {
                explanationContent.innerHTML = `
                    <strong>${methodData.name} for ${modelData.name} model:</strong> ${methodData.description}
                    <br><br>
                    <strong>Key Advantages:</strong>
                    <br>• Memory efficiency: ${Math.round((1 - methodData.memoryMultiplier / methodConfig.full.memoryMultiplier) * 100)}% less memory than full fine-tuning
                    <br>• Training speed: ${methodData.speedMultiplier}x faster execution
                    <br>• Parameter efficiency: ${methodData.paramReduction > 0 ? methodData.paramReduction + '% fewer' : 'All'} trainable parameters
                `;
            }

            // Update method selection visuals
            function updateMethodSelection(selectedMethod) {
                document.querySelectorAll('input[name="q4-method"]').forEach(radio => {
                    const card = radio.nextElementSibling;
                    if (radio.checked) {
                        card.classList.remove('border-green-200', 'border-purple-200', 'border-orange-200');
                        if (selectedMethod === 'full') {
                            card.classList.add('border-green-400', 'bg-green-50');
                        } else if (selectedMethod === 'lora') {
                            card.classList.add('border-purple-400', 'bg-purple-50');
                        } else {
                            card.classList.add('border-orange-400', 'bg-orange-50');
                        }
                    } else {
                        card.classList.remove('border-green-400', 'border-purple-400', 'border-orange-400', 'bg-green-50', 'bg-purple-50', 'bg-orange-50');
                        if (radio.value === 'full') card.classList.add('border-green-200');
                        else if (radio.value === 'lora') card.classList.add('border-purple-200');
                        else card.classList.add('border-orange-200');
                    }
                });
            }

            // Example scenarios
            const examples = [
                { model: 'medium', method: 'qlora', note: 'Fine-tune 7B model on RTX 4090 (24GB)' },
                { model: 'xl', method: 'qlora', note: 'Fine-tune 70B model on A100 (80GB)' },
                { model: 'large', method: 'lora', note: 'Efficient 13B model training' },
                { model: 'small', method: 'full', note: 'Small model with full training' }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    modelSelect.value = example.model;
                    document.querySelector(`input[name="q4-method"][value="${example.method}"]`).checked = true;
                    exampleBtn.textContent = `Try: ${example.note}`;
                    exampleIndex++;
                    updateDisplay();
                });
            }

            // GPU compatibility check
            if (gpuCheckBtn) {
                gpuCheckBtn.addEventListener('click', () => {
                    const method = getCurrentMethod();
                    const model = getCurrentModel();
                    const totalMemory = Math.round(modelSizes[model].baseMemory * methodConfig[method].memoryMultiplier);
                    
                    scenarioOutput.classList.remove('hidden');
                    
                    let gpuAnalysis = '';
                    if (totalMemory <= 24) {
                        gpuAnalysis = '✅ RTX 4090 (24GB): Compatible';
                    } else if (totalMemory <= 48) {
                        gpuAnalysis = '✅ A6000 (48GB): Compatible';  
                    } else if (totalMemory <= 80) {
                        gpuAnalysis = '✅ A100 (80GB): Compatible';
                    } else {
                        gpuAnalysis = '❌ Requires multiple GPUs or cloud resources';
                    }
                    
                    scenarioOutput.innerHTML = `
                        <strong>GPU Compatibility for ${modelSizes[model].name} model with ${methodConfig[method].name}:</strong>
                        <br>Memory Required: ${totalMemory} GB
                        <br>${gpuAnalysis}
                        <br><small class="text-gray-600">Note: Includes overhead for gradients and optimizer states</small>
                    `;
                });
            }

            // Cost calculation
            if (costCalcBtn) {
                costCalcBtn.addEventListener('click', () => {
                    const method = getCurrentMethod();
                    const model = getCurrentModel();
                    const speedMultiplier = methodConfig[method].speedMultiplier;
                    const baseCostPerHour = model === 'xl' ? 5.0 : model === 'large' ? 2.0 : model === 'medium' ? 1.0 : 0.5;
                    const trainingHours = 10 / speedMultiplier; // Baseline 10 hours for full fine-tuning
                    const totalCost = Math.round(baseCostPerHour * trainingHours * 100) / 100;
                    
                    scenarioOutput.classList.remove('hidden');
                    scenarioOutput.innerHTML = `
                        <strong>Estimated Training Cost for ${modelSizes[model].name} model:</strong>
                        <br>Method: ${methodConfig[method].name}
                        <br>Training Time: ~${Math.round(trainingHours * 10) / 10} hours
                        <br>Cloud Cost: ~$${totalCost} (${speedMultiplier}x faster than full fine-tuning)
                        <br><small class="text-gray-600">Based on typical cloud GPU pricing</small>
                    `;
                });
            }

            // Event listeners
            modelSelect.addEventListener('change', updateDisplay);
            document.querySelectorAll('input[name="q4-method"]').forEach(radio => {
                radio.addEventListener('change', updateDisplay);
            });
            rankSelect?.addEventListener('change', updateDisplay);
            quantSelect?.addEventListener('change', updateDisplay);
            quantSelect?.addEventListener('change', updateQuantExplorer);
            rankSelect?.addEventListener('change', updateQuantExplorer);
            quantRefreshBtn?.addEventListener('click', () => {
                quantSample = sampleWeights(256);
                updateQuantExplorer();
            });
            quantShowDiffEl?.addEventListener('change', updateQuantExplorer);

            // Initial setup
            updateDisplay();
            updateQuantExplorer();
        }
    }
};
