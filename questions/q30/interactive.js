const interactiveScript = () => {
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question30Interactive = interactiveScript;
}
