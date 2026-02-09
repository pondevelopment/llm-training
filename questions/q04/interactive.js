const interactiveScript = () => {
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
                    memoryMultiplier: 2.5,
                    speedMultiplier: 1,
                    paramReduction: 0,
                    description: 'Updates all model parameters, requiring the most memory but offering maximum flexibility. The base model and gradients must be stored in memory simultaneously.'
                },
                lora: {
                    name: 'LoRA',
                    memoryMultiplier: 1.2,
                    speedMultiplier: 3,
                    paramReduction: 99.6,
                    description: 'Freezes the base model and adds small trainable low-rank matrices. Only the adapter parameters are updated, dramatically reducing memory requirements while maintaining performance.'
                },
                qlora: {
                    name: 'QLoRA',
                    memoryMultiplier: 0.45,
                    speedMultiplier: 2.5,
                    paramReduction: 99.6,
                    description: 'Combines LoRA with 4-bit quantization of the base model. The frozen parameters use 75% less memory while LoRA adapters remain in full precision for training.'
                }
            };

            const STRATEGY_TONES = {
                full: 'var(--tone-emerald-strong)',
                lora: 'var(--tone-purple-strong)',
                qlora: 'var(--tone-amber-strong)'
            };

            const INDICATOR_CHIPS = {
                full: 'chip-success',
                lora: 'chip-accent',
                qlora: 'chip-warning'
            };

            const getCssVar = (name, fallback) => {
                const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
                return value || fallback;
            };

            function getMatrixPalette() {
                const tonePurple = getCssVar('--tone-purple-strong', '#7c3aed');
                const toneAmber = getCssVar('--tone-amber-strong', '#f59e0b');
                const neutral = getCssVar('--color-border', '#e2e8f0');
                const subtleBorder = getCssVar('--color-border-subtle', '#cbd5f5');
                const dark = document.documentElement.classList.contains('dark');

                if (dark) {
                    return {
                        adapter: `color-mix(in srgb, ${tonePurple} 60%, rgba(255, 255, 255, 0.16) 40%)`,
                        quantized: `color-mix(in srgb, ${toneAmber} 62%, rgba(255, 255, 255, 0.12) 38%)`,
                        frozen: `color-mix(in srgb, ${neutral} 48%, rgba(255, 255, 255, 0.08) 52%)`,
                        border: `color-mix(in srgb, ${subtleBorder} 38%, transparent)`
                    };
                }

                return {
                    adapter: `color-mix(in srgb, ${tonePurple} 45%, #ffffff 55%)`,
                    quantized: `color-mix(in srgb, ${toneAmber} 47%, #ffffff 53%)`,
                    frozen: `color-mix(in srgb, ${neutral} 35%, #ffffff 65%)`,
                    border: `color-mix(in srgb, ${subtleBorder} 65%, transparent)`
                };
            }


            function mixColor(tone, percentage, base = 'var(--color-card)') {
                const remaining = Math.max(0, 100 - percentage);
                return `color-mix(in srgb, ${tone} ${percentage}%, ${base} ${remaining}%)`;
            }

            function resetStrategyStyles(container) {
                if (!container) return;
                container.classList.remove('question-strategy-active');
                container.style.background = '';
                container.style.borderColor = '';
                container.style.boxShadow = '';
                container.style.color = '';
            }

            function applyStrategyStyles(container, tone) {
                if (!container) return;
                container.classList.add('question-strategy-active');
                container.style.background = mixColor(tone, 12);
                container.style.borderColor = mixColor(tone, 32, 'var(--color-border-subtle)');
                container.style.boxShadow = '0 16px 32px -26px rgba(15, 23, 42, 0.55)';
            }

            function getMatrixColor(type) {
                if (type === 'adapter') return mixColor('var(--tone-purple-strong)', 55);
                if (type === 'quantized') return mixColor('var(--tone-amber-strong)', 55);
                return mixColor('var(--accent-border)', 45);
            }


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
                ctx.strokeStyle = getCssVar('--color-border', '#e5e7eb');
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
                ctx.fillStyle = getCssVar('--tone-sky-soft', '#93c5fd');
                for (let i = 0; i < bins; i++) {
                    const barH = (hist[i] / maxCount) * (h - 20);
                    ctx.fillRect(i * barW + 1, h - barH - 1, barW - 2, barH);
                }
                // Codebook vertical lines
                if (codebook) {
                    ctx.strokeStyle = getCssVar('--tone-rose-strong', '#ef4444');
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
                if (!matrixDisplay) return;
                const palette = getMatrixPalette();
                matrixDisplay.innerHTML = '';
                matrixDisplay.style.display = 'grid';
                matrixDisplay.style.gridTemplateColumns = 'repeat(10, minmax(0, 1fr))';
                matrixDisplay.style.gridTemplateRows = 'repeat(10, minmax(0, 1fr))';
                matrixDisplay.style.width = '100%';
                matrixDisplay.style.height = '100%';
                matrixDisplay.style.gap = '0.25rem';
                matrixDisplay.style.alignItems = 'stretch';
                matrixDisplay.style.justifyItems = 'stretch';
                matrixDisplay.style.padding = '0.35rem';

                for (let i = 0; i < 100; i++) {
                    const cell = document.createElement('span');
                    cell.style.width = '100%';
                    cell.style.height = '100%';
                    cell.style.borderRadius = '0.5rem';
                    cell.style.transition = 'background-color 0.3s ease';
                    cell.style.border = `1px solid ${palette.border}`;

                    if (method === 'full') {
                        cell.style.background = palette.adapter;
                    } else if (method === 'lora') {
                        cell.style.background = (i % 10 === 0 || i % 10 === 1)
                            ? palette.adapter
                            : palette.frozen;
                    } else if (method === 'qlora') {
                        cell.style.background = (i % 10 === 0 || i % 10 === 1)
                            ? palette.adapter
                            : palette.quantized;
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
                
                if (methodIndicator) {
                    methodIndicator.textContent = methodData.name;
                    const chipTone = INDICATOR_CHIPS[method] || 'chip-info';
                    methodIndicator.className = `chip ${chipTone} text-xs font-medium`;
                }

                
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
                        quantWrapper.style.opacity = '0.5';
                        quantWrapper.style.pointerEvents = 'none';
                    } else {
                        quantWrapper.style.opacity = '';
                        quantWrapper.style.pointerEvents = '';
                    }
                }
                if (quantNote) {
                    quantNote.textContent = quantEnabled ? 'Active for QLoRA.' : 'Only applies when QLoRA is selected.';
                }

            }

            // Update technical breakdown
                        function updateBreakdown(method, model, methodData, modelData, totalMemory) {
                const loraRank = getCurrentRank();
                const hiddenSize = model === 'small' ? 2048 : model === 'medium' ? 4096 : model === 'large' ? 5120 : 8192;
                const originalParams = Math.round(modelData.params * 1000) / 1000;
                const layers = model === 'small' ? 24 : model === 'medium' ? 32 : model === 'large' ? 40 : 80;
                const loraParams = Math.round((2 * hiddenSize * loraRank * layers) / 1e6 * 100) / 100;

                let content = `
                    <div>
                        <h6 class="font-medium text-heading mb-2">Model statistics</h6>
                        <p class="text-xs text-secondary">Total parameters: ${originalParams}B</p>
                        <p class="text-xs text-secondary">Base memory: ${modelData.baseMemory} GB</p>
                        <p class="text-xs text-secondary">Training memory: ${totalMemory} GB</p>
                    </div>
                `;

                if (method === 'full') {
                    content += `
                        <div>
                            <h6 class="font-medium text-heading mb-2">Full fine-tuning</h6>
                            <p class="text-xs text-secondary">Trainable parameters: ${originalParams}B (100%)</p>
                            <p class="text-xs text-secondary">Memory overhead: model + gradients + optimizer</p>
                            <p class="text-xs text-secondary">Precision: 16-bit (FP16)</p>
                        </div>
                    `;
                } else if (method === 'lora') {
                    content += `
                        <div>
                            <h6 class="font-medium text-heading mb-2">LoRA configuration</h6>
                            <p class="text-xs text-secondary">Trainable parameters: ~${loraParams}M (${methodData.paramReduction}% reduction)</p>
                            <p class="text-xs text-secondary">Rank: r=${loraRank} (low-rank adapters)</p>
                            <p class="text-xs text-secondary">Base model: frozen at 16-bit precision</p>
                        </div>
                    `;
                } else if (method === 'qlora') {
                    content += `
                        <div>
                            <h6 class="font-medium text-heading mb-2">QLoRA configuration</h6>
                            <p class="text-xs text-secondary">Trainable parameters: ~${loraParams}M (${methodData.paramReduction}% reduction)</p>
                            <p class="text-xs text-secondary">Base model: ${getCurrentQuant()}-bit quantized</p>
                            <p class="text-xs text-secondary">Adapters: 16-bit precision for accuracy</p>
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
                    <strong>Key advantages:</strong>
                    <br>&bull; Memory efficiency: ${Math.round((1 - methodData.memoryMultiplier / methodConfig.full.memoryMultiplier) * 100)}% less memory than full fine-tuning
                    <br>&bull; Training speed: ${methodData.speedMultiplier}x faster execution
                    <br>&bull; Parameter efficiency: ${methodData.paramReduction > 0 ? methodData.paramReduction + '% fewer' : 'All'} trainable parameters
                `;
            }

            // Update method selection visuals
                        function updateMethodSelection(selectedMethod) {
                document.querySelectorAll('input[name="q4-method"]').forEach(radio => {
                    const container = radio.closest('.question-strategy');
                    if (!container) return;
                    const tone = STRATEGY_TONES[radio.value] || STRATEGY_TONES.lora;
                    resetStrategyStyles(container);
                    if (radio.checked && radio.value === selectedMethod) {
                        applyStrategyStyles(container, tone);
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
                        gpuAnalysis = '&#x2705; RTX 4090 (24GB): Compatible';
                    } else if (totalMemory <= 48) {
                        gpuAnalysis = '&#x2705; A6000 (48GB): Compatible';  
                    } else if (totalMemory <= 80) {
                        gpuAnalysis = '&#x2705; A100 (80GB): Compatible';
                    } else {
                        gpuAnalysis = '&#x274C; Requires multiple GPUs or cloud resources';
                    }
                    
                    scenarioOutput.innerHTML = `
                        <strong>GPU compatibility for ${modelSizes[model].name} with ${methodConfig[method].name}:</strong>
                        <br>Memory required: ${totalMemory} GB
                        <br>${gpuAnalysis}
                        <br><small class="small-caption text-muted">Includes overhead for gradients and optimizer states.</small>
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
                        <strong>Estimated training cost for ${modelSizes[model].name}:</strong>
                        <br>Method: ${methodConfig[method].name}
                        <br>Training time: ~${Math.round(trainingHours * 10) / 10} hours
                        <br>Cloud cost: ~$${totalCost} (${speedMultiplier}x faster than full fine-tuning)
                        <br><small class="small-caption text-muted">Approximate on-demand single-GPU pricing.</small>
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question04Interactive = interactiveScript;
}
