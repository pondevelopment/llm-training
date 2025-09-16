const interactiveScript = () => {
            // Get DOM elements with error checking
            const functionTypeSelect = document.getElementById('q27-function-type');
            const inputDimSelect = document.getElementById('q27-input-dim');
            const outputDimSelect = document.getElementById('q27-output-dim');
            const modeRadios = document.querySelectorAll('input[name="q27-mode"]');
            const output = document.getElementById('q27-output');
            const exampleBtn = document.getElementById('q27-example-btn');
            const modeIndicator = document.getElementById('q27-mode-indicator');
            const legend = document.getElementById('q27-legend');
            const explanation = document.getElementById('q27-explanation');

            // Check if required elements exist
            if (!functionTypeSelect || !output || !inputDimSelect || !outputDimSelect) {
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize interactive components.</div>';
                }
                return;
            }

            // Configuration for different function types
            const functionConfig = {
                'linear': {
                    name: 'Linear Transformation',
                    description: 'Simple matrix multiplication with constant Jacobian',
                    jacobianStructure: 'dense',
                    complexity: 'O(mn)',
                    sparsity: 0,
                    properties: ['Constant Jacobian', 'Dense matrix', 'Straightforward computation']
                },
                'softmax': {
                    name: 'Softmax Function',
                    description: 'Probability distribution with complex interdependencies',
                    jacobianStructure: 'dense',
                    complexity: 'O(n²)',
                    sparsity: 0,
                    properties: ['Non-diagonal dependencies', 'Sum constraint', 'Probability outputs']
                },
                'attention': {
                    name: 'Attention Mechanism',
                    description: 'Complex function with query-key-value dependencies',
                    jacobianStructure: 'block-structured',
                    complexity: 'O(d·seq²)',
                    sparsity: 0.3,
                    properties: ['Sequence dependencies', 'Query-key similarity', 'Value transformations']
                },
                'layer-norm': {
                    name: 'Layer Normalization',
                    description: 'Normalization with mean and variance dependencies',
                    jacobianStructure: 'dense',
                    complexity: 'O(n²)',
                    sparsity: 0,
                    properties: ['Mean dependencies', 'Variance normalization', 'Scale/shift parameters']
                },
                'feed-forward': {
                    name: 'Feed-Forward Network',
                    description: 'Dense layers with ReLU activations',
                    jacobianStructure: 'sparse',
                    complexity: 'O(mn)',
                    sparsity: 0.5,
                    properties: ['ReLU sparsity', 'Weight matrices', 'Non-linear activations']
                }
            };

            // Example configurations
            const examples = [
                { functionType: 'attention', inputDim: '4', outputDim: '4', mode: 'structure', note: 'Attention Structure' },
                { functionType: 'softmax', inputDim: '3', outputDim: '3', mode: 'computation', note: 'Softmax Math' },
                { functionType: 'linear', inputDim: '3', outputDim: '4', mode: 'backprop', note: 'Linear Backprop' },
                { functionType: 'feed-forward', inputDim: '4', outputDim: '3', mode: 'structure', note: 'FFN Sparsity' }
            ];
            let exampleIndex = 0;

            // Generate realistic Jacobian matrix data
            function generateJacobianData(functionType, inputDim, outputDim) {
                const m = parseInt(outputDim);
                const n = parseInt(inputDim);
                const config = functionConfig[functionType];
                const jacobian = [];

                for (let i = 0; i < m; i++) {
                    const row = [];
                    for (let j = 0; j < n; j++) {
                        let value = 0;
                        
                        switch (functionType) {
                            case 'linear':
                                value = (Math.random() - 0.5) * 2;
                                break;
                            case 'softmax':
                                if (i === j) {
                                    const s_i = Math.random() * 0.8 + 0.1;
                                    value = s_i * (1 - s_i);
                                } else {
                                    const s_i = Math.random() * 0.3 + 0.1;
                                    const s_j = Math.random() * 0.3 + 0.1;
                                    value = -s_i * s_j;
                                }
                                break;
                            case 'attention':
                                if (Math.random() > config.sparsity) {
                                    value = (Math.random() - 0.5) * 1.5;
                                }
                                break;
                            case 'layer-norm':
                                value = (Math.random() - 0.5) * 0.8;
                                break;
                            case 'feed-forward':
                                if (Math.random() > config.sparsity) {
                                    value = Math.random() * 2;
                                }
                                break;
                        }
                        row.push(value);
                    }
                    jacobian.push(row);
                }
                
                return {
                    matrix: jacobian,
                    dimensions: `${m}×${n}`,
                    config: config,
                    sparsity: calculateSparsity(jacobian),
                    norm: calculateFrobeniusNorm(jacobian)
                };
            }

            // Calculate matrix sparsity
            function calculateSparsity(matrix) {
                let zeros = 0;
                let total = 0;
                matrix.forEach(row => {
                    row.forEach(val => {
                        if (Math.abs(val) < 0.01) zeros++;
                        total++;
                    });
                });
                return zeros / total;
            }

            // Calculate Frobenius norm
            function calculateFrobeniusNorm(matrix) {
                let sum = 0;
                matrix.forEach(row => {
                    row.forEach(val => {
                        sum += val * val;
                    });
                });
                return Math.sqrt(sum);
            }

            // Get current mode
            function getCurrentMode() {
                const selected = document.querySelector('input[name="q27-mode"]:checked');
                return selected ? selected.value : 'structure';
            }

            // Update visual indicators
            function updateModeVisuals() {
                const mode = getCurrentMode();
                const modeNames = {
                    'structure': 'Matrix Structure',
                    'computation': 'Computation',
                    'backprop': 'Backprop Flow'
                };
                
                if (modeIndicator) {
                    modeIndicator.textContent = modeNames[mode];
                }

                document.querySelectorAll('input[name="q27-mode"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
            }

            // Main processing function
            const processAndDisplay = () => {
                try {
                    const functionType = functionTypeSelect.value;
                    const inputDim = inputDimSelect.value;
                    const outputDim = outputDimSelect.value;
                    const mode = getCurrentMode();
                    
                    updateModeVisuals();

                    const jacobianData = generateJacobianData(functionType, inputDim, outputDim);
                    const { matrix, config } = jacobianData;
                    
                    let html = '<div class="space-y-4">';
                    
                    html += `
                        <div class="bg-gray-50 p-3 rounded border">
                            <h5 class="font-medium text-gray-700 mb-2">Jacobian Matrix Properties</h5>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><strong>Function:</strong> ${config.name}</div>
                                <div><strong>Dimensions:</strong> ${jacobianData.dimensions}</div>
                                <div><strong>Sparsity:</strong> ${(jacobianData.sparsity * 100).toFixed(1)}%</div>
                                <div><strong>Norm:</strong> ${jacobianData.norm.toFixed(3)}</div>
                            </div>
                        </div>
                    `;

                    html += `
                        <div class="bg-white border rounded p-4">
                            <h5 class="font-medium text-gray-700 mb-3">Matrix Visualization (${mode} mode)</h5>
                            <div class="overflow-x-auto">
                                <div class="inline-block border border-gray-300" role="table" aria-label="Jacobian matrix heatmap">
                    `;

                    matrix.forEach((row, i) => {
                        html += '<div class="flex" role="row">';
                        row.forEach((val, j) => {
                            const absVal = Math.abs(val);
                            let colorClass, textColor;
                            
                            if (absVal < 0.01) {
                                colorClass = 'bg-gray-100';
                                textColor = 'text-gray-400';
                            } else if (val > 0) {
                                const intensity = Math.min(absVal / 2, 1);
                                colorClass = `bg-blue-${intensity > 0.7 ? '500' : intensity > 0.4 ? '300' : '100'}`;
                                textColor = intensity > 0.5 ? 'text-white' : 'text-blue-800';
                            } else {
                                const intensity = Math.min(absVal / 2, 1);
                                colorClass = `bg-red-${intensity > 0.7 ? '500' : intensity > 0.4 ? '300' : '100'}`;
                                textColor = intensity > 0.5 ? 'text-white' : 'text-red-800';
                            }
                            const cellLabel = (mode === 'structure') ? '' : val.toFixed(2);
                            
                            html += `
                                <div class="w-12 h-12 ${colorClass} ${textColor} border border-gray-200 flex items-center justify-center text-xs font-mono" 
                                     role="cell" title="∂f${i+1}/∂x${j+1} = ${val.toFixed(3)}">
                                    ${cellLabel}
                                </div>
                            `;
                        });
                        html += '</div>';
                    });

                    html += `
                                </div>
                            </div>
                            <div class="mt-3 text-xs text-gray-600">
                                <span class="inline-block w-3 h-3 bg-blue-300 mr-1"></span>Positive values
                                <span class="inline-block w-3 h-3 bg-red-300 mr-1 ml-4"></span>Negative values
                                <span class="inline-block w-3 h-3 bg-gray-100 mr-1 ml-4"></span>Near zero (sparse)
                            </div>
                        </div>
                    `;

                    html += '</div>';
                    output.innerHTML = html;

                    if (legend) {
                        const modeNames = { structure: 'Matrix Structure', computation: 'Computation', backprop: 'Backprop Flow' };
                        legend.innerHTML = `
                            Function: ${jacobianData.config.name} | 
                            Dimensions: ${jacobianData.dimensions} | 
                            Sparsity: ${(jacobianData.sparsity * 100).toFixed(1)}% | 
                            Norm: ${jacobianData.norm.toFixed(3)} | 
                            Complexity: ${jacobianData.config.complexity} | 
                            View: ${modeNames[mode]}
                        `;
                    }

                    if (explanation) {
                        explanation.innerHTML = `
                            <div class="space-y-3">
                                <p><strong>Function Analysis:</strong> ${config.description}. This ${functionType} function has ${config.jacobianStructure} Jacobian structure with ${config.complexity} computational complexity.</p>
                                <p><strong>Mode:</strong> ${mode} view shows how the Jacobian matrix facilitates gradient computation in transformer backpropagation.</p>
                            </div>
                        `;
                    }

                    // Mode-specific educational extras
                    let extras = '';
                    if (mode === 'structure') {
                        extras += `
                            <div class="mt-3 p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-800">
                                Structure view: numbers are hidden to emphasize sparsity and sign. Brightness encodes |J_{ij}|, color encodes sign (blue=positive, red=negative).
                            </div>
                        `;
                    } else if (mode === 'computation') {
                        // Add a small formula card for the selected function type
                        const formulaByType = {
                            'linear': '$$ J = W $$',
                            'softmax': '$$ J_{ij} = s_i (\\delta_{ij} - s_j) $$',
                            'attention': '$$ J = \\frac{\\partial\\,\\operatorname{Attention}(Q,K,V)}{\\partial x} $$',
                            'layer-norm': '$$ J = \\frac{\\partial\\,\\operatorname{LayerNorm}(x)}{\\partial x} $$',
                            'feed-forward': '$$ J = \\operatorname{diag}(\\sigma\'(Wx+b))\\,W $$'
                        };
                        const formula = formulaByType[functionType] || '';
                        extras += `
                            <div class="mt-3 p-3 bg-indigo-50 rounded border border-indigo-200">
                                <div class="text-xs text-indigo-800 mb-1">Computation view formula</div>
                                <div class="math-display text-center text-xs">${formula}</div>
                            </div>
                        `;
                    } else if (mode === 'backprop') {
                        // Simulate upstream gradient and show propagation: g_x = J^T g_y
                        const m = parseInt(outputDim);
                        const n = parseInt(inputDim);
                        let gy = Array.from({length: m}, () => (Math.random() - 0.5) * 2);
                        // normalize gy for stability
                        const gyNorm = Math.sqrt(gy.reduce((s,v)=>s+v*v,0)) || 1;
                        gy = gy.map(v => v/gyNorm);
                        const gx = new Array(n).fill(0);
                        for (let j = 0; j < n; j++) {
                            let sum = 0;
                            for (let i = 0; i < m; i++) {
                                sum += matrix[i][j] * gy[i];
                            }
                            gx[j] = sum;
                        }
                        const maxAbs = Math.max(...gx.map(v => Math.abs(v))) || 1;
                        let bars = '';
                        gx.forEach((v, j) => {
                            const pct = Math.min(100, Math.abs(v) / maxAbs * 100);
                            const color = v >= 0 ? 'bg-blue-500' : 'bg-red-500';
                            bars += `
                                <div class="flex items-center gap-2">
                                    <div class="w-16 text-xs font-mono">x${j+1}</div>
                                    <div class="flex-1 bg-gray-200 rounded h-4 relative">
                                        <div class="${color} h-full rounded" style="width: ${pct}%"></div>
                                        <div class="absolute inset-0 flex items-center justify-center text-[10px] text-white font-mono">${v.toFixed(3)}</div>
                                    </div>
                                </div>
                            `;
                        });
                        extras += `
                            <div class="mt-3 p-3 bg-purple-50 rounded border border-purple-200">
                                <div class="text-xs text-purple-800 mb-2">Backprop view: upstream gradient flows through the Jacobian transpose</div>
                                <div class="text-center text-xs font-mono mb-2">$$ \\frac{\\partial L}{\\partial x} = J^{\\top} \\frac{\\partial L}{\\partial y} $$</div>
                                <div class="space-y-1">${bars}</div>
                            </div>
                        `;
                    }
                    if (extras) {
                        const container = document.createElement('div');
                        container.innerHTML = extras;
                        output.appendChild(container);
                    }

                    // Future-proof MathJax rendering in case dynamic content includes TeX later
                    if (window.MathJax && window.MathJax.typesetPromise) {
                        window.MathJax.typesetPromise([output, legend, explanation]).catch(() => {});
                    }
                    
                } catch (error) {
                    console.error('Error in processAndDisplay:', error);
                    if (output) {
                        output.innerHTML = '<div class="text-red-500 p-4">Error processing data. Please try again.</div>';
                    }
                }
            };

            // Example cycling functionality
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    try {
                        const example = examples[exampleIndex];
                        functionTypeSelect.value = example.functionType;
                        inputDimSelect.value = example.inputDim;
                        outputDimSelect.value = example.outputDim;
                        
                        const modeRadio = document.querySelector(`input[name="q27-mode"][value="${example.mode}"]`);
                        if (modeRadio) {
                            modeRadio.checked = true;
                        }
                        
                        processAndDisplay();
                        
                        exampleBtn.textContent = example.note;
                        exampleBtn.title = `Example ${exampleIndex + 1}/${examples.length}: ${example.functionType}`;
                        
                        exampleIndex = (exampleIndex + 1) % examples.length;
                    } catch (error) {
                        console.error('Error in example cycling:', error);
                    }
                });
            }

            // Event listeners
            if (functionTypeSelect) {
                functionTypeSelect.addEventListener('change', processAndDisplay);
            }
            if (inputDimSelect) {
                inputDimSelect.addEventListener('change', processAndDisplay);
            }
            if (outputDimSelect) {
                outputDimSelect.addEventListener('change', processAndDisplay);
            }
            
            modeRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            updateModeVisuals();
            processAndDisplay();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question27Interactive = interactiveScript;
}
