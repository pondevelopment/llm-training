// Question 30: What is the derivative of the ReLU function, and why is it significant?
// Created: July 16, 2025
// Educational Focus: ReLU activation function, gradient computation, vanishing gradient problem

const question = {
    title: "30. What is the derivative of the ReLU function, and why is it significant?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-17" class="text-indigo-700 underline hover:text-indigo-900">Question 17: Vanishing gradients in sequence models</a></li>
                <li><a href="#question-24" class="text-indigo-700 underline hover:text-indigo-900">Question 24: Gradient stability & optimization dynamics</a></li>
                <li><a href="#question-31" class="text-indigo-700 underline hover:text-indigo-900">Question 31: Chain rule depth & gradient flow</a></li>
                <li><a href="#question-32" class="text-indigo-700 underline hover:text-indigo-900">Question 32: Scaling tricks to preserve gradients</a></li>
            </ul>
        </div>
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">⚡ What is ReLU and Its Derivative?</h4>
            <p class="text-blue-800">The ReLU (Rectified Linear Unit) function is defined as <strong>\\( f(x) = \\max(0, x) \\)</strong>. Its derivative is remarkably simple: <strong>1 for positive inputs, 0 for negative inputs</strong>. This simplicity is what makes ReLU so powerful in deep learning – it either passes gradients through unchanged or blocks them completely.</p>
            <div class="math-display">
                $$ f'(x) = \\begin{cases} 1 & \\text{if } x > 0 \\\\ 0 & \\text{if } x \\le 0 \\end{cases} $$
            </div>
        </div>
        
        <!-- Mathematical Definition -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-3">📊 Mathematical Definition</h4>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="text-center">
                    <h5 class="font-medium text-gray-800 mb-2">ReLU Function</h5>
                    <div class="math-display">
                        $$f(x) = \\max(0, x) = \\begin{cases} 
                        x & \\text{if } x > 0 \\\\n+                        0 & \\text{if } x \\leq 0
                        \\end{cases}$$
                    </div>
                </div>
                <div class="text-center">
                    <h5 class="font-medium text-gray-800 mb-2">ReLU Derivative</h5>
                    <div class="math-display">
                        $$f'(x) = \\begin{cases} 
                        1 & \\text{if } x > 0 \\\\n+                        0 & \\text{if } x \\leq 0
                        \\end{cases}$$
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Comparison with Other Activation Functions -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">ReLU</h5>
                <p class="text-sm text-green-700 mb-2">Simple step function derivative</p>
                <div class="text-xs bg-green-100 px-2 py-1 rounded font-mono">
                    f'(x) = {1 if x > 0, 0 if x ≤ 0}
                </div>
                <p class="text-xs text-green-600 mt-2">✓ No vanishing gradients for x > 0</p>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Sigmoid</h5>
                <p class="text-sm text-purple-700 mb-2">Smooth but problematic derivative</p>
                <div class="text-xs bg-purple-100 px-2 py-1 rounded font-mono">
                    f'(x) = σ(x)(1 - σ(x))
                </div>
                <p class="text-xs text-purple-600 mt-2">⚠ Vanishing gradients (max 0.25)</p>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Tanh</h5>
                <p class="text-sm text-orange-700 mb-2">Better than sigmoid but still limited</p>
                <div class="text-xs bg-orange-100 px-2 py-1 rounded font-mono">
                    f'(x) = 1 - tanh²(x)
                </div>
                <p class="text-xs text-orange-600 mt-2">⚠ Vanishing gradients (max 1.0)</p>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why ReLU's Derivative is Revolutionary</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Solves Vanishing Gradients:</strong> Gradient is either 0 or 1, preventing exponential decay through layers</li>
                <li>• <strong>Computational Efficiency:</strong> No expensive exponential calculations, just simple thresholding</li>
                <li>• <strong>Sparse Activation:</strong> Roughly half of neurons are inactive, creating efficient sparse representations</li>
                <li>• <strong>Biological Plausibility:</strong> Mimics neuron firing behavior - either active or inactive</li>
                <li>• <strong>Enables Deep Networks:</strong> Made training of very deep networks (100+ layers) practically feasible</li>
            </ul>
        </div>
        
        <!-- Dead Neuron Problem -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 class="font-semibold text-red-900 mb-2">⚠️ The Dead Neuron Problem</h4>
            <p class="text-sm text-red-800">ReLU's derivative being 0 for negative inputs can cause "dead neurons" that never activate again once their weights push them into the negative region. This led to variants like Leaky ReLU and ELU that have small positive derivatives for negative inputs.</p>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive ReLU Derivative Explorer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q30-input-range" class="block text-sm font-medium text-gray-700 mb-2">📊 Input Value (x)</label>
                <div class="space-y-3">
                    <input type="range" id="q30-input-range" min="-3" max="3" step="0.1" value="1.5" class="w-full" aria-describedby="q30-current-value q30-range-help">
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>-3</span>
                        <span id="q30-current-value" class="font-medium">1.5</span>
                        <span>3</span>
                    </div>
                </div>
                <p id="q30-range-help" class="text-xs text-gray-600 mt-1">Drag to see how activation functions and their derivatives behave.</p>
            </div>
            
            <!-- Function Visualization -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-4">📈 Function & Derivative Curves</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Function Plot -->
                    <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Activation Function f(x)</h5>
                        <div class="relative bg-gray-50 rounded border" style="height: 200px;">
                            <canvas id="q30-function-canvas" width="280" height="200" class="w-full h-full" role="img" aria-label="Activation function plot"></canvas>
                        </div>
                    </div>
                    
                    <!-- Derivative Plot -->
                    <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Derivative f'(x)</h5>
                        <div class="relative bg-gray-50 rounded border" style="height: 200px;">
                            <canvas id="q30-derivative-canvas" width="280" height="200" class="w-full h-full" role="img" aria-label="Derivative plot"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Activation Function Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🧠 Choose Activation Function</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q30-function" value="relu" checked class="absolute top-2 right-2">
                        <div class="function-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">ReLU</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Standard</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-1">f(x) = max(0, x)</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                f'(x) = {1 if x > 0, 0 else}
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q30-function" value="leaky_relu" class="absolute top-2 right-2">
                        <div class="function-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Leaky ReLU</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Enhanced</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-1">f(x) = max(0.1x, x)</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                f'(x) = {1 if x > 0, 0.1 else}
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q30-function" value="sigmoid" class="absolute top-2 right-2">
                        <div class="function-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Sigmoid</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Classical</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-1">f(x) = 1/(1 + e^(-x))</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                f'(x) = σ(x)(1 - σ(x))
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Current Values Display -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎯 Current Values</h4>
                    <div id="q30-function-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">ReLU</div>
                </div>
                <div id="q30-output" class="grid grid-cols-2 md:grid-cols-4 gap-4" aria-live="polite" aria-atomic="false">
                    <!-- Current values will be displayed here -->
                </div>
            </div>
            
            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700">🧪 Quick Tests:</span>
                <button id="q30-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Test: x = 2.0</button>
                <button id="q30-negative-btn" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">Test: x = -1.5</button>
                <button id="q30-zero-btn" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors">Test: x = 0</button>
            </div>
            
            <!-- Educational Explanation -->
            <div id="q30-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4" aria-live="polite" aria-atomic="false">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Key Insights</h4>
                <div id="q30-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Safe MathJax typeset helper for dynamic content
            function typesetMath(root) {
                try {
                    if (window.MathJax && window.MathJax.typesetPromise) {
                        return window.MathJax.typesetPromise([root]);
                    }
                } catch (e) {
                    console.warn('MathJax typeset failed (q30):', e);
                }
                return Promise.resolve();
            }
            // Get DOM elements with error checking
            const inputRange = document.getElementById('q30-input-range');
            const currentValue = document.getElementById('q30-current-value');
            const output = document.getElementById('q30-output');
            const functionRadios = document.querySelectorAll('input[name="q30-function"]');
            const exampleBtn = document.getElementById('q30-example-btn');
            const negativeBtn = document.getElementById('q30-negative-btn');
            const zeroBtn = document.getElementById('q30-zero-btn');
            const functionIndicator = document.getElementById('q30-function-indicator');
            const explanation = document.getElementById('q30-explanation');
            const functionCanvas = document.getElementById('q30-function-canvas');
            const derivativeCanvas = document.getElementById('q30-derivative-canvas');

            // Check if required elements exist
            if (!inputRange || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Function definitions
            const functions = {
                relu: {
                    name: 'ReLU',
                    fn: (x) => Math.max(0, x),
                    derivative: (x) => x > 0 ? 1 : 0,
                    description: 'Simple, efficient, but can cause dead neurons',
                    color: '#10b981', // green-500
                    bgColor: '#dcfce7' // green-100
                },
                leaky_relu: {
                    name: 'Leaky ReLU',
                    fn: (x) => Math.max(0.1 * x, x),
                    derivative: (x) => x > 0 ? 1 : 0.1,
                    description: 'Prevents dead neurons with small negative slope',
                    color: '#3b82f6', // blue-500
                    bgColor: '#dbeafe' // blue-100
                },
                sigmoid: {
                    name: 'Sigmoid',
                    fn: (x) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))), // Clamp to prevent overflow
                    derivative: (x) => {
                        const s = 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
                        return s * (1 - s);
                    },
                    description: 'Smooth but suffers from vanishing gradients',
                    color: '#f59e0b', // orange-500
                    bgColor: '#fed7aa' // orange-100
                }
            };

            // Canvas drawing utilities
            function setupCanvas(canvas) {
                const ctx = canvas.getContext('2d');
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                
                ctx.scale(dpr, dpr);
                ctx.clearRect(0, 0, rect.width, rect.height);
                
                return { ctx, width: rect.width, height: rect.height };
            }

            function drawAxes(ctx, width, height) {
                ctx.strokeStyle = '#d1d5db'; // gray-300
                ctx.lineWidth = 1;
                
                // Draw axes
                const centerX = width / 2;
                const centerY = height / 2;
                
                // X-axis
                ctx.beginPath();
                ctx.moveTo(20, centerY);
                ctx.lineTo(width - 20, centerY);
                ctx.stroke();
                
                // Y-axis
                ctx.beginPath();
                ctx.moveTo(centerX, 20);
                ctx.lineTo(centerX, height - 20);
                ctx.stroke();
                
                // Add grid lines
                ctx.strokeStyle = '#f3f4f6'; // gray-100
                ctx.lineWidth = 0.5;
                
                for (let i = 1; i <= 3; i++) {
                    // Vertical grid lines
                    const x1 = centerX + (i * (width - 40) / 6);
                    const x2 = centerX - (i * (width - 40) / 6);
                    
                    ctx.beginPath();
                    ctx.moveTo(x1, 20);
                    ctx.lineTo(x1, height - 20);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(x2, 20);
                    ctx.lineTo(x2, height - 20);
                    ctx.stroke();
                    
                    // Horizontal grid lines
                    const y1 = centerY + (i * (height - 40) / 6);
                    const y2 = centerY - (i * (height - 40) / 6);
                    
                    ctx.beginPath();
                    ctx.moveTo(20, y1);
                    ctx.lineTo(width - 20, y1);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(20, y2);
                    ctx.lineTo(width - 20, y2);
                    ctx.stroke();
                }
                
                // Add axis labels
                ctx.fillStyle = '#6b7280'; // gray-500
                ctx.font = '12px system-ui';
                ctx.textAlign = 'center';
                
                // X-axis labels
                ctx.fillText('-3', 20, centerY + 15);
                ctx.fillText('0', centerX, centerY + 15);
                ctx.fillText('3', width - 20, centerY + 15);
                
                // Y-axis labels (different for function vs derivative)
                ctx.textAlign = 'right';
                ctx.fillText('3', centerX - 5, 25);
                ctx.fillText('0', centerX - 5, centerY + 4);
                ctx.fillText('-1', centerX - 5, height - 25);
            }

            function plotFunction(canvas, funcType, currentX, isDerivative = false) {
                if (!canvas) return;
                
                const { ctx, width, height } = setupCanvas(canvas);
                const func = functions[funcType];
                
                drawAxes(ctx, width, height);
                
                // Plot the function
                ctx.strokeStyle = func.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                const centerX = width / 2;
                const centerY = height / 2;
                const scaleX = (width - 40) / 6; // -3 to 3 range
                const scaleY = isDerivative ? (height - 40) / 2 : (height - 40) / 6; // Different scales for function vs derivative
                
                let firstPoint = true;
                for (let x = -3; x <= 3; x += 0.05) {
                    const screenX = centerX + x * scaleX;
                    let y;
                    
                    if (isDerivative) {
                        y = func.derivative(x);
                        // Scale derivative values (0-1 range for most functions)
                        var screenY = centerY - y * scaleY;
                    } else {
                        y = func.fn(x);
                        // Clamp y values for better visualization
                        y = Math.max(-1, Math.min(3, y));
                        var screenY = centerY - y * scaleY;
                    }
                    
                    if (firstPoint) {
                        ctx.moveTo(screenX, screenY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(screenX, screenY);
                    }
                }
                ctx.stroke();
                
                // Highlight current point
                const currentScreenX = centerX + currentX * scaleX;
                let currentY;
                
                if (isDerivative) {
                    currentY = func.derivative(currentX);
                    var currentScreenY = centerY - currentY * scaleY;
                } else {
                    currentY = func.fn(currentX);
                    currentY = Math.max(-1, Math.min(3, currentY));
                    var currentScreenY = centerY - currentY * scaleY;
                }
                
                // Draw current point
                ctx.fillStyle = func.color;
                ctx.beginPath();
                ctx.arc(currentScreenX, currentScreenY, 4, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw vertical line from current point to x-axis
                ctx.strokeStyle = func.color;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(currentScreenX, currentScreenY);
                ctx.lineTo(currentScreenX, centerY);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Helper functions for gradient flow classification
            function getGradientFlowClass(funcType, derivative) {
                const thresholds = getGradientThresholds(funcType);
                if (derivative >= thresholds.strong) return 'text-green-600';
                if (derivative >= thresholds.weak) return 'text-yellow-600';
                return 'text-red-600';
            }
            
            function getGradientFlowText(funcType, derivative) {
                const thresholds = getGradientThresholds(funcType);
                if (derivative >= thresholds.strong) return '🟢 Strong';
                if (derivative >= thresholds.weak) return '🟡 Weak';
                return '🔴 Blocked';
            }
            
            function getGradientThresholds(funcType) {
                switch(funcType) {
                    case 'relu':
                    case 'leaky_relu':
                        return { strong: 0.8, weak: 0.1 }; // ReLU-based: 1.0 is max
                    case 'sigmoid':
                        return { strong: 0.15, weak: 0.05 }; // Sigmoid: 0.25 is max
                    default:
                        return { strong: 0.5, weak: 0.1 };
                }
            }

            // Helper function to get current function
            function getCurrentFunction() {
                const selectedRadio = document.querySelector('input[name="q30-function"]:checked');
                return selectedRadio ? selectedRadio.value : 'relu';
            }

            // Update visual indicators for function selection
            function updateFunctionVisuals() {
                const selected = document.querySelector('input[name="q30-function"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                const func = functions[selectedValue];
                
                // Update radio button containers
                document.querySelectorAll('input[name="q30-function"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
                
                // Update function indicator
                if (functionIndicator && func) {
                    functionIndicator.textContent = func.name;
                    functionIndicator.style.backgroundColor = func.bgColor;
                    functionIndicator.style.color = func.color;
                }
            }

            // Main processing function
            const processAndDisplay = () => {
                const x = parseFloat(inputRange.value);
                const funcType = getCurrentFunction();
                const func = functions[funcType];
                
                // Update current value display
                if (currentValue) {
                    currentValue.textContent = x.toFixed(1);
                }
                
                updateFunctionVisuals();

                // Calculate function value and derivative
                const functionValue = func.fn(x);
                const derivativeValue = func.derivative(x);

                // Update plots
                plotFunction(functionCanvas, funcType, x, false);
                plotFunction(derivativeCanvas, funcType, x, true);

                // Create current values display
                const resultsHTML = `
                    <div class="text-center p-3 bg-blue-50 rounded border">
                        <div class="text-sm text-blue-700 mb-1">Input</div>
                        <div class="text-2xl font-bold text-blue-600">${x.toFixed(2)}</div>
                    </div>
                    <div class="text-center p-3 bg-green-50 rounded border">
                        <div class="text-sm text-green-700 mb-1">f(x)</div>
                        <div class="text-2xl font-bold text-green-600">${functionValue.toFixed(3)}</div>
                    </div>
                    <div class="text-center p-3 bg-purple-50 rounded border">
                        <div class="text-sm text-purple-700 mb-1">f'(x)</div>
                        <div class="text-2xl font-bold text-purple-600">${derivativeValue.toFixed(3)}</div>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded border">
                        <div class="text-sm text-gray-700 mb-1">Gradient Flow</div>
                        <div class="text-lg font-bold ${getGradientFlowClass(funcType, derivativeValue)}">
                            ${getGradientFlowText(funcType, derivativeValue)}
                        </div>
                    </div>
                `;

                output.innerHTML = resultsHTML;
                typesetMath(output);

                // Update explanation
                updateExplanation(funcType, x, derivativeValue);
                typesetMath(explanation);
            };

            // Update the educational explanation based on selected function and input
            function updateExplanation(funcType, x, derivative) {
                if (!explanation) return;
                
                const func = functions[funcType];
                let explanationText = '';
                
                if (funcType === 'relu') {
                    if (x > 0) {
                        explanationText = `
                            <p><strong>🟢 Active Neuron:</strong> ReLU passes positive inputs unchanged with gradient = 1. Notice how the derivative plot shows a flat line at 1 for all positive values.</p>
                            <p class="mt-2"><strong>Key Insight:</strong> This constant gradient of 1 prevents vanishing gradients, allowing deep networks to train effectively.</p>
                        `;
                    } else if (x < 0) {
                        explanationText = `
                            <p><strong>🔴 Dead Neuron:</strong> ReLU blocks negative inputs completely with gradient = 0. The derivative plot shows this as a flat line at 0 for negative values.</p>
                            <p class="mt-2"><strong>Problem:</strong> If a neuron consistently receives negative inputs, it becomes "dead" and stops learning entirely.</p>
                        `;
                    } else {
                        explanationText = `
                            <p><strong>⚡ Critical Point:</strong> At x = 0, ReLU transitions from dead (gradient = 0) to active (gradient = 1).</p>
                            <p class="mt-2"><strong>Note:</strong> The derivative is technically undefined at x = 0, but we typically use 0 for implementation simplicity.</p>
                        `;
                    }
                } else if (funcType === 'leaky_relu') {
                    explanationText = `
                        <p><strong>🔵 Leaky ReLU Advantage:</strong> Notice the small negative slope (0.1) prevents completely dead neurons. The derivative plot shows this constant small positive value for negative inputs.</p>
                        <p class="mt-2"><strong>Best Practice:</strong> Combines ReLU's benefits with insurance against the dead neuron problem, making training more robust.</p>
                    `;
                } else {
                    const maxDerivative = 0.25; // Maximum sigmoid derivative at x=0
                    const percentage = ((derivative / maxDerivative) * 100).toFixed(0);
                    const flowStatus = derivative >= 0.15 ? 'strong' : derivative >= 0.05 ? 'moderate' : 'weak';
                    explanationText = `
                        <p><strong>🟠 Sigmoid Analysis:</strong> The derivative (${derivative.toFixed(3)}) is ${percentage}% of sigmoid's maximum possible value (0.25). 
                        ${flowStatus === 'strong' ? 'Near x=0, sigmoid has relatively strong gradients.' : 
                          flowStatus === 'moderate' ? 'Moving away from x=0, gradients are becoming weaker.' : 
                          'At extreme values, sigmoid suffers from severe vanishing gradients.'}</p>
                        <p class="mt-2"><strong>Key Pattern:</strong> Notice how the derivative curve peaks at x=0 and diminishes toward zero at extremes. This is why deep sigmoid networks struggle with gradient flow.</p>
                    `;
                }
                
                explanation.innerHTML = explanationText;
            }

            // Example button functionality
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    inputRange.value = 2.0;
                    processAndDisplay();
                });
            }
            
            if (negativeBtn) {
                negativeBtn.addEventListener('click', () => {
                    inputRange.value = -1.5;
                    processAndDisplay();
                });
            }
            
            if (zeroBtn) {
                zeroBtn.addEventListener('click', () => {
                    inputRange.value = 0.0;
                    processAndDisplay();
                });
            }

            // Event listeners
            inputRange.addEventListener('input', processAndDisplay);
            functionRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                setTimeout(processAndDisplay, 100);
            });
            
            // Initial setup
            updateFunctionVisuals();
            processAndDisplay();
        }
    }
};

// Optional export for tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
