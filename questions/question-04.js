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
                <code class="text-xs bg-green-100 px-1 rounded">Memory: ~350GB for 7B model</code>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">LoRA (Low-Rank Adaptation)</h5>
                <p class="text-sm text-purple-700">Adds small trainable matrices while freezing base model</p>
                <code class="text-xs bg-purple-100 px-1 rounded">Memory: ~50GB for 7B model</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">QLoRA (Quantized LoRA)</h5>
                <p class="text-sm text-orange-700">LoRA + 4-bit quantization for extreme efficiency</p>
                <code class="text-xs bg-orange-100 px-1 rounded">Memory: ~12GB for 7B model</code>
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
                    memoryMultiplier: 1.8,
                    speedMultiplier: 3,
                    paramReduction: 99.6,
                    description: 'Freezes the base model and adds small trainable low-rank matrices. Only the adapter parameters are updated, dramatically reducing memory requirements while maintaining performance.'
                },
                qlora: {
                    name: 'QLoRA', 
                    color: 'orange',
                    memoryMultiplier: 0.8,
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
                methodIndicator.className = `text-xs bg-${methodData.color}-100 text-${methodData.color}-700 px-2 py-1 rounded font-medium`;
                
                // Calculate metrics
                const baseMemory = modelData.baseMemory;
                const totalMemory = Math.round(baseMemory * methodData.memoryMultiplier);
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
            }

            // Update technical breakdown
            function updateBreakdown(method, model, methodData, modelData, totalMemory) {
                const loraRank = 16;
                const hiddenSize = model === 'small' ? 2048 : model === 'medium' ? 4096 : model === 'large' ? 5120 : 8192;
                const originalParams = Math.round(modelData.params * 1000) / 1000;
                const loraParams = Math.round((2 * hiddenSize * loraRank * 32) / 1000000 * 100) / 100; // Approximate LoRA params in millions
                
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
                            <p class="text-xs">Rank: ${loraRank} (low-rank decomposition)</p>
                            <p class="text-xs">Base Model: Frozen at 16-bit precision</p>
                        </div>
                    `;
                } else if (method === 'qlora') {
                    content += `
                        <div>
                            <h6 class="font-medium text-gray-800 mb-2">QLoRA Configuration</h6>
                            <p class="text-xs">Trainable Parameters: ~${loraParams}M (${methodData.paramReduction}% reduction)</p>
                            <p class="text-xs">Base Model: 4-bit quantized (75% memory saving)</p>
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

            // Initial setup
            updateDisplay();
        }
    }
};
