// Question 27: What is the Jacobian matrix's role in transformer backpropagation?
// Educational Focus: Jacobian matrix, partial derivatives, multidimensional gradients, backpropagation mechanics

const question = {
    title: "27. What is the Jacobian matrix's role in transformer backpropagation?",
    answer: `<div class="space-y-6">
        <!-- Hero Section with Clear Definition -->
        <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
            <div class="text-center mb-4">
                <h3 class="text-xl font-bold text-gray-900 mb-2">🔗 The Jacobian Matrix</h3>
                <p class="text-lg text-gray-700 max-w-3xl mx-auto">
                    A mathematical tool that captures how every output changes with respect to every input—the backbone of efficient backpropagation in transformers.
                </p>
            </div>
            
            <div class="max-w-3xl mx-auto">
                <div class="bg-white p-6 rounded-lg border shadow-sm">
                    <div class="text-center space-y-4">
                        <p class="text-sm font-medium text-gray-700">Core Definition</p>
                        
                        <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            $$J = \\frac{\\partial f}{\\partial x}$$
                        </div>
                        
                        <div class="text-center text-sm text-gray-600 mt-4">
                            For function $f: \\mathbb{R}^n \\to \\mathbb{R}^m$, the Jacobian $J$ is an $m \\times n$ matrix showing how output $f_i$ changes with input $x_j$
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Matrix Structure Section -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                📐 Matrix Structure & Components
            </h4>
            
            <div class="grid lg:grid-cols-2 gap-6">
                <!-- Mathematical Form -->
                <div class="bg-green-50 p-5 rounded-lg border border-green-200">
                    <h5 class="font-semibold text-green-900 mb-4 text-center">Mathematical Definition</h5>
                    <div class="bg-white p-5 rounded-lg border">
                        <div class="text-center space-y-4">
                            <div class="text-sm font-medium text-gray-700">General Jacobian Matrix</div>
                            
                            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div class="text-center font-mono text-sm space-y-2">
                                    <div>$$J_{ij} = \\frac{\\partial f_i}{\\partial x_j}$$</div>
                                    <div class="text-xs text-gray-600">where i = 1,2,...,m and j = 1,2,...,n</div>
                                </div>
                            </div>
                            
                            <div class="text-xs text-gray-600 max-w-xs mx-auto">
                                Each entry shows how output component f_i changes with input x_j
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Transformer Context -->
                <div class="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h5 class="font-semibold text-blue-900 mb-3">In Transformer Context</h5>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Rows (Outputs)</div>
                                <div class="text-xs text-gray-600">Attention heads, hidden features</div>
                            </div>
                        </div>
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Columns (Inputs)</div>
                                <div class="text-xs text-gray-600">Tokens, embeddings</div>
                            </div>
                        </div>
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Purpose</div>
                                <div class="text-xs text-gray-600">Efficient gradient propagation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Chain Rule Section -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                ⛓️ Chain Rule & Function Composition
            </h4>
            
            <p class="text-gray-700 mb-6">When composing functions in transformer layers, the chain rule becomes matrix multiplication of Jacobians:</p>
            
            <div class="grid md:grid-cols-3 gap-4">
                <!-- Step 1 -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">Function Composition</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            $$z = h(g(f(x)))$$
                        </div>
                        <div class="text-xs text-purple-700">Multiple transformer layers</div>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">Chain Rule</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            $$\\frac{\\partial z}{\\partial x} = \\frac{\\partial z}{\\partial y_2} \\cdot \\frac{\\partial y_2}{\\partial y_1} \\cdot \\frac{\\partial y_1}{\\partial x}$$
                        </div>
                        <div class="text-xs text-purple-700">Gradient computation</div>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">Jacobian Form</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            $$J_{total} = J_h \\cdot J_g \\cdot J_f$$
                        </div>
                        <div class="text-xs text-purple-700">Matrix multiplication</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div class="text-sm text-purple-800 text-center">
                    <strong>Key Insight:</strong> Each **J** represents the Jacobian matrix of the respective function, enabling efficient gradient flow through deep networks.
                </div>
            </div>
        </div>
        
        <!-- Key Takeaways Summary -->
        <div class="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 text-center">🎯 Key Takeaways</h4>
            
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-2">📊</div>
                    <h5 class="font-semibold text-green-900 mb-2">Mathematical Tool</h5>
                    <p class="text-sm text-gray-700">
                        Organizes partial derivatives in matrix form: J_ij = ∂f_i/∂x_j
                    </p>
                </div>
                
                <div class="bg-white p-4 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-2">⛓️</div>
                    <h5 class="font-semibold text-blue-900 mb-2">Chain Rule</h5>
                    <p class="text-sm text-gray-700">
                        Enables efficient gradient propagation: J_total = J_h · J_g · J_f
                    </p>
                </div>
                
                <div class="bg-white p-4 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-2">🚀</div>
                    <h5 class="font-semibold text-purple-900 mb-2">Optimization</h5>
                    <p class="text-sm text-gray-700">
                        Modern techniques use VJP to avoid storing full matrices, enabling large-scale training
                    </p>
                </div>
            </div>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Jacobian Matrix Calculator",
        html: `<div class="space-y-6">
            <!-- Function Type Selection -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q27-function-type" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose Function Type</label>
                <select id="q27-function-type" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="linear" selected>Linear Transformation (W·x + b)</option>
                    <option value="softmax">Softmax Function</option>
                    <option value="attention">Attention Mechanism</option>
                    <option value="layer-norm">Layer Normalization</option>
                    <option value="feed-forward">Feed-Forward Network</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Different function types have different Jacobian structures and computational properties</p>
            </div>
            
            <!-- Analysis Mode Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Analysis Mode</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q27-mode" value="structure" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Matrix Structure</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Visual</span>
                            </div>
                            <p class="text-xs text-gray-600">Show Jacobian matrix structure and sparsity</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q27-mode" value="computation" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Computation</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Math</span>
                            </div>
                            <p class="text-xs text-gray-600">Show step-by-step Jacobian computation</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q27-mode" value="backprop" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Backprop Flow</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Flow</span>
                            </div>
                            <p class="text-xs text-gray-600">Show how gradients flow through Jacobian</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Dimension Configuration -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q27-input-dim" class="block text-sm font-medium text-gray-700 mb-2">📊 Input Dimension</label>
                    <select id="q27-input-dim" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="2">2D (for visualization)</option>
                        <option value="3" selected>3D (small example)</option>
                        <option value="4">4D (medium example)</option>
                        <option value="8">8D (larger example)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Input vector dimension (n)</p>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q27-output-dim" class="block text-sm font-medium text-gray-700 mb-2">📈 Output Dimension</label>
                    <select id="q27-output-dim" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="2">2D (compressed)</option>
                        <option value="3" selected>3D (same as input)</option>
                        <option value="4">4D (expanded)</option>
                        <option value="6">6D (projection)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Output vector dimension (m)</p>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q27-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Attention mechanism example</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Jacobian Analysis Results</h4>
                    <div id="q27-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Matrix Structure</div>
                </div>
                <div id="q27-output" class="min-h-[300px]"></div>
                <div id="q27-legend" class="mt-3 text-xs text-gray-600"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Function Analysis</h4>
                <div id="q27-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
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
                                <div class="inline-block border border-gray-300">
                    `;

                    matrix.forEach((row, i) => {
                        html += '<div class="flex">';
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
                            
                            html += `
                                <div class="w-12 h-12 ${colorClass} ${textColor} border border-gray-200 flex items-center justify-center text-xs font-mono" 
                                     title="∂f${i+1}/∂x${j+1} = ${val.toFixed(3)}">
                                    ${val.toFixed(2)}
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
                        legend.innerHTML = `
                            Function: ${jacobianData.config.name} | 
                            Dimensions: ${jacobianData.dimensions} | 
                            Sparsity: ${(jacobianData.sparsity * 100).toFixed(1)}% | 
                            Norm: ${jacobianData.norm.toFixed(3)} | 
                            Complexity: ${jacobianData.config.complexity}
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
        }
    }
};
