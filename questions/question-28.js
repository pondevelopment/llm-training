// Question 28: How do eigenvalues and eigenvectors relate to dimensionality reduction?
// Created: July 16, 2025
// Educational Focus: Eigenvalues, eigenvectors, PCA, dimensionality reduction, data variance

const question = {
    title: "28. How do eigenvalues and eigenvectors relate to dimensionality reduction?",
    answer: `<div class="space-y-6">
        <!-- Hero Section with Clear Definition -->
        <div class="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 p-6 rounded-xl border border-purple-200 shadow-sm">
            <div class="text-center mb-4">
                <h3 class="text-xl font-bold text-gray-900 mb-2">🔍 Eigenvalues & Eigenvectors</h3>
                <p class="text-lg text-gray-700 max-w-3xl mx-auto">
                    Mathematical tools that reveal the principal directions of data variance, enabling efficient dimensionality reduction while preserving maximum information.
                </p>
            </div>
            
            <div class="max-w-3xl mx-auto">
                <div class="bg-white p-6 rounded-lg border shadow-sm">
                    <div class="text-center space-y-4">
                        <p class="text-sm font-medium text-gray-700">Core Mathematical Relationship</p>
                        
                        <div class="bg-purple-50 p-6 rounded-lg border border-purple-200">
                            <div class="space-y-3">
                                <div>$$\\mathbf{A}\\mathbf{v} = \\lambda\\mathbf{v}$$</div>
                                <div class="text-sm text-gray-600">where $\\mathbf{A}$ is the covariance matrix, $\\mathbf{v}$ is an eigenvector, and $\\lambda$ is the eigenvalue</div>
                            </div>
                        </div>
                        
                        <div class="text-center text-sm text-gray-600 mt-4">
                            Eigenvectors point to directions of maximum variance, while eigenvalues quantify the amount of variance in each direction
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mathematical Foundation Section -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                📐 Mathematical Foundation
            </h4>
            
            <div class="grid lg:grid-cols-2 gap-6">
                <!-- Eigenvalue Equation -->
                <div class="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h5 class="font-semibold text-blue-900 mb-4 text-center">Eigenvalue Problem</h5>
                    <div class="bg-white p-5 rounded-lg border">
                        <div class="text-center space-y-4">
                            <div class="text-sm font-medium text-gray-700">Characteristic Equation</div>
                            
                            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div class="text-center space-y-2">
                                    <div>$$\\det(\\mathbf{A} - \\lambda\\mathbf{I}) = 0$$</div>
                                    <div class="text-xs text-gray-600">Determines eigenvalues $\\lambda_1, \\lambda_2, \\ldots, \\lambda_n$</div>
                                </div>
                            </div>
                            
                            <div class="text-xs text-gray-600 max-w-xs mx-auto">
                                Each eigenvalue represents the variance captured along its corresponding eigenvector direction
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PCA Connection -->
                <div class="bg-green-50 p-5 rounded-lg border border-green-200">
                    <h5 class="font-semibold text-green-900 mb-3">PCA Application</h5>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Step 1: Covariance Matrix</div>
                                <div class="text-xs text-gray-600">$\\mathbf{C} = \\frac{1}{n-1}\\mathbf{X}^T\\mathbf{X}$</div>
                            </div>
                        </div>
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Step 2: Eigendecomposition</div>
                                <div class="text-xs text-gray-600">$\\mathbf{C}\\mathbf{v}_i = \\lambda_i\\mathbf{v}_i$</div>
                            </div>
                        </div>
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Step 3: Select Top-k</div>
                                <div class="text-xs text-gray-600">Keep eigenvectors with largest eigenvalues</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Dimensionality Reduction Process -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                🎯 Dimensionality Reduction Process
            </h4>
            
            <div class="grid md:grid-cols-3 gap-4">
                <!-- Step 1 -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">1. Variance Analysis</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            <div class="text-sm">$$\\text{Var}(\\mathbf{X}) = \\frac{1}{n}\\sum_{i=1}^{n}(\\mathbf{x}_i - \\bar{\\mathbf{x}})^2$$</div>
                        </div>
                        <div class="text-xs text-purple-700">Compute covariance matrix to understand data spread</div>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">2. Principal Components</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            <div class="text-sm">$$\\mathbf{W} = [\\mathbf{v}_1, \\mathbf{v}_2, \\ldots, \\mathbf{v}_k]$$</div>
                        </div>
                        <div class="text-xs text-purple-700">Select eigenvectors with highest eigenvalues</div>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">3. Projection</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            <div class="text-sm">$$\\mathbf{Y} = \\mathbf{X}\\mathbf{W}$$</div>
                        </div>
                        <div class="text-xs text-purple-700">Transform data to lower-dimensional space</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="text-sm text-purple-800 text-center">
                    <strong>Key Insight:</strong> By selecting eigenvectors with the largest eigenvalues, we preserve the directions of maximum variance, retaining most information while reducing dimensions.
                </div>
            </div>
        </div>
        
        <!-- Variance Preservation -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                📊 Variance Preservation & Information Loss
            </h4>
            
            <p class="text-gray-700 mb-6">The eigenvalues directly quantify how much variance (information) is preserved when selecting principal components:</p>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Variance Explained -->
                <div class="bg-white p-4 rounded-lg border">
                    <h5 class="font-semibold text-gray-900 mb-3">Variance Explained</h5>
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <div class="text-center">
                            <div>$$\\text{Variance Explained} = \\frac{\\sum_{i=1}^{k} \\lambda_i}{\\sum_{i=1}^{n} \\lambda_i}$$</div>
                            <div class="text-xs text-gray-600 mt-2">Ratio of selected eigenvalues to total eigenvalues</div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600">Higher eigenvalues = more variance captured = less information loss</p>
                </div>
                
                <!-- Cumulative Variance -->
                <div class="bg-white p-4 rounded-lg border">
                    <h5 class="font-semibold text-gray-900 mb-3">Component Selection</h5>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span>PC1 ($\\lambda_1 = 0.6$)</span>
                            <span class="font-mono">60%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: 60%"></div>
                        </div>
                        
                        <div class="flex justify-between text-sm">
                            <span>PC1-2 ($\\lambda_2 = 0.25$)</span>
                            <span class="font-mono">85%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                        </div>
                        
                        <div class="flex justify-between text-sm">
                            <span>PC1-3 ($\\lambda_3 = 0.1$)</span>
                            <span class="font-mono">95%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: 95%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- LLM Applications -->
        <div class="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 text-center">🤖 Applications in LLMs</h4>
            
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-2">🎯</div>
                    <h5 class="font-semibold text-blue-900 mb-2">Embedding Reduction</h5>
                    <p class="text-sm text-gray-700">
                        Reduce high-dimensional embeddings (e.g., 768D → 128D) while preserving semantic relationships
                    </p>
                </div>
                
                <div class="bg-white p-4 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-2">⚡</div>
                    <h5 class="font-semibold text-purple-900 mb-2">Computational Efficiency</h5>
                    <p class="text-sm text-gray-700">
                        Lower dimensional representations reduce memory usage and speed up matrix operations
                    </p>
                </div>
                
                <div class="bg-white p-4 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-2">🔍</div>
                    <h5 class="font-semibold text-green-900 mb-2">Feature Analysis</h5>
                    <p class="text-sm text-gray-700">
                        Eigenvectors reveal principal directions in embedding space, helping understand learned representations
                    </p>
                </div>
            </div>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Eigenvalue & PCA Explorer",
        html: `<div class="space-y-6">
            <!-- Data Configuration -->
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <label for="q28-data-type" class="block text-sm font-medium text-gray-700 mb-2">📊 Choose Data Distribution</label>
                <select id="q28-data-type" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="correlated" selected>Correlated Data (elliptical)</option>
                    <option value="diagonal">Diagonal Covariance</option>
                    <option value="circular">Circular (isotropic)</option>
                    <option value="mixed">Mixed Components</option>
                    <option value="high-dim">High Dimensional</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Different data types reveal different eigenvalue/eigenvector patterns</p>
            </div>
            
            <!-- Dimension Controls -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q28-original-dim" class="block text-sm font-medium text-gray-700 mb-2">📐 Original Dimensions</label>
                    <select id="q28-original-dim" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="2">2D (for visualization)</option>
                        <option value="3" selected>3D (moderate)</option>
                        <option value="5">5D (higher)</option>
                        <option value="10">10D (high dimensional)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Original data dimensionality</p>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q28-reduced-dim" class="block text-sm font-medium text-gray-700 mb-2">🎯 Reduced Dimensions</label>
                    <select id="q28-reduced-dim" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="1">1D (maximum reduction)</option>
                        <option value="2" selected>2D (common choice)</option>
                        <option value="3">3D (moderate reduction)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Target dimensionality after reduction</p>
                </div>
            </div>

            <!-- Analysis Mode Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🔬 Analysis Focus</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q28-mode" value="eigenvalues" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Eigenvalue Analysis</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Variance</span>
                            </div>
                            <p class="text-xs text-gray-600">Show eigenvalues and variance explained by each component</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q28-mode" value="eigenvectors" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Eigenvector Visualization</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Direction</span>
                            </div>
                            <p class="text-xs text-gray-600">Visualize principal component directions in data space</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q28-mode" value="projection" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Data Projection</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Transform</span>
                            </div>
                            <p class="text-xs text-gray-600">Show original vs projected data in reduced space</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q28-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">High correlation example</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">📊 PCA Analysis Results</h4>
                    <div id="q28-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Eigenvalue Analysis</div>
                </div>
                <div id="q28-output" class="min-h-[300px]"></div>
                <div id="q28-legend" class="mt-3 text-xs text-gray-600"></div>
            </div>
            
            <!-- Mathematical Details -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">🧮 Mathematical Analysis</h4>
                <div id="q28-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const dataTypeSelect = document.getElementById('q28-data-type');
            const originalDimSelect = document.getElementById('q28-original-dim');
            const reducedDimSelect = document.getElementById('q28-reduced-dim');
            const modeRadios = document.querySelectorAll('input[name="q28-mode"]');
            const output = document.getElementById('q28-output');
            const exampleBtn = document.getElementById('q28-example-btn');
            const modeIndicator = document.getElementById('q28-mode-indicator');
            const legend = document.getElementById('q28-legend');
            const explanation = document.getElementById('q28-explanation');

            // Check if required elements exist
            if (!dataTypeSelect || !output || !originalDimSelect || !reducedDimSelect) {
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize interactive components.</div>';
                }
                return;
            }

            // Configuration for different data types
            const dataConfig = {
                'correlated': {
                    name: 'Correlated Data',
                    description: 'High correlation between features creates clear principal directions',
                    eigenvaluePattern: 'Large first eigenvalue, smaller subsequent ones',
                    varianceExplained: [0.75, 0.20, 0.03, 0.015, 0.005],
                    correlationStrength: 0.8
                },
                'diagonal': {
                    name: 'Diagonal Covariance',
                    description: 'Features are uncorrelated, eigenvalues equal feature variances',
                    eigenvaluePattern: 'Moderate eigenvalues, roughly equal',
                    varianceExplained: [0.35, 0.25, 0.2, 0.15, 0.05],
                    correlationStrength: 0.1
                },
                'circular': {
                    name: 'Circular (Isotropic)',
                    description: 'Equal variance in all directions, no clear principal components',
                    eigenvaluePattern: 'All eigenvalues approximately equal',
                    varianceExplained: [0.22, 0.21, 0.20, 0.19, 0.18],
                    correlationStrength: 0.0
                },
                'mixed': {
                    name: 'Mixed Components',
                    description: 'Multiple clusters with different orientations',
                    eigenvaluePattern: 'Multiple dominant eigenvalues',
                    varianceExplained: [0.45, 0.35, 0.12, 0.05, 0.03],
                    correlationStrength: 0.6
                },
                'high-dim': {
                    name: 'High Dimensional',
                    description: 'Many features with varying importance',
                    eigenvaluePattern: 'Rapid decay in eigenvalue magnitude',
                    varianceExplained: [0.4, 0.25, 0.15, 0.1, 0.05, 0.03, 0.015, 0.005],
                    correlationStrength: 0.5
                }
            };

            // Example configurations
            const examples = [
                { dataType: 'correlated', originalDim: '3', reducedDim: '2', mode: 'eigenvalues', note: 'High Correlation' },
                { dataType: 'diagonal', originalDim: '5', reducedDim: '2', mode: 'eigenvectors', note: 'Uncorrelated Features' },
                { dataType: 'circular', originalDim: '3', reducedDim: '1', mode: 'projection', note: 'Isotropic Data' },
                { dataType: 'high-dim', originalDim: '10', reducedDim: '3', mode: 'eigenvalues', note: 'High Dimensional' }
            ];
            let exampleIndex = 0;

            // Generate simulated eigenanalysis data
            function generateEigenAnalysis(dataType, originalDim, reducedDim) {
                const config = dataConfig[dataType];
                const nDims = parseInt(originalDim);
                const kDims = parseInt(reducedDim);
                
                // Generate eigenvalues based on data type pattern
                const eigenvalues = [];
                const baseVariances = config.varianceExplained.slice(0, nDims);
                
                // Normalize to ensure they sum appropriately
                const total = baseVariances.reduce((sum, val) => sum + val, 0);
                for (let i = 0; i < nDims; i++) {
                    eigenvalues.push(baseVariances[i] / total);
                }
                
                // Generate eigenvectors (simplified as unit vectors for visualization)
                const eigenvectors = [];
                for (let i = 0; i < nDims; i++) {
                    const vector = new Array(nDims).fill(0);
                    // Simplified eigenvector generation
                    for (let j = 0; j < nDims; j++) {
                        vector[j] = (Math.random() - 0.5) * 2;
                    }
                    // Normalize
                    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
                    for (let j = 0; j < nDims; j++) {
                        vector[j] /= norm;
                    }
                    eigenvectors.push(vector);
                }
                
                // Calculate cumulative variance explained
                let cumVariance = 0;
                const cumulativeVariance = eigenvalues.map(val => {
                    cumVariance += val;
                    return cumVariance;
                });
                
                return {
                    eigenvalues,
                    eigenvectors,
                    cumulativeVariance,
                    config,
                    selectedComponents: kDims,
                    varianceRetained: cumulativeVariance[kDims - 1],
                    compressionRatio: nDims / kDims
                };
            }

            // Get current mode
            function getCurrentMode() {
                const selected = document.querySelector('input[name="q28-mode"]:checked');
                return selected ? selected.value : 'eigenvalues';
            }

            // Update visual indicators
            function updateModeVisuals() {
                const mode = getCurrentMode();
                const modeNames = {
                    'eigenvalues': 'Eigenvalue Analysis',
                    'eigenvectors': 'Eigenvector Visualization',
                    'projection': 'Data Projection'
                };
                
                if (modeIndicator) {
                    modeIndicator.textContent = modeNames[mode];
                }

                document.querySelectorAll('input[name="q28-mode"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-purple-500', 'bg-purple-50');
                    }
                });
            }

            // Main processing function
            const processAndDisplay = () => {
                try {
                    const dataType = dataTypeSelect.value;
                    const originalDim = originalDimSelect.value;
                    const reducedDim = reducedDimSelect.value;
                    const mode = getCurrentMode();
                    
                    updateModeVisuals();

                    const analysis = generateEigenAnalysis(dataType, originalDim, reducedDim);
                    
                    let html = '<div class="space-y-4">';
                    
                    // Header with key metrics
                    html += `
                        <div class="bg-gray-50 p-3 rounded border">
                            <h5 class="font-medium text-gray-700 mb-2">PCA Analysis Summary</h5>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><strong>Data Type:</strong> ${analysis.config.name}</div>
                                <div><strong>Dimensions:</strong> ${originalDim}D → ${reducedDim}D</div>
                                <div><strong>Variance Retained:</strong> ${(analysis.varianceRetained * 100).toFixed(1)}%</div>
                                <div><strong>Compression:</strong> ${analysis.compressionRatio.toFixed(1)}x</div>
                            </div>
                        </div>
                    `;

                    if (mode === 'eigenvalues') {
                        html += `
                            <div class="bg-white border rounded p-4">
                                <h5 class="font-medium text-gray-700 mb-3">Eigenvalue Spectrum</h5>
                                <div class="space-y-3">
                        `;
                        
                        analysis.eigenvalues.forEach((eigenval, i) => {
                            const isSelected = i < analysis.selectedComponents;
                            const percentage = (eigenval * 100).toFixed(1);
                            const cumulative = (analysis.cumulativeVariance[i] * 100).toFixed(1);
                            
                            html += `
                                <div class="flex items-center space-x-3">
                                    <div class="w-16 text-sm font-mono">PC${i + 1}:</div>
                                    <div class="flex-1">
                                        <div class="flex justify-between text-xs mb-1">
                                            <span>λ${i + 1} = ${eigenval.toFixed(3)}</span>
                                            <span>${percentage}% (cum: ${cumulative}%)</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-3">
                                            <div class="h-3 rounded-full ${isSelected ? 'bg-purple-500' : 'bg-gray-400'}" 
                                                 style="width: ${percentage}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                        
                        html += `
                                </div>
                                <div class="mt-4 text-xs text-gray-600">
                                    <span class="inline-block w-3 h-3 bg-purple-500 mr-1"></span>Selected components
                                    <span class="inline-block w-3 h-3 bg-gray-400 mr-1 ml-4"></span>Discarded components
                                </div>
                            </div>
                        `;
                    }
                    
                    else if (mode === 'eigenvectors') {
                        html += `
                            <div class="bg-white border rounded p-4">
                                <h5 class="font-medium text-gray-700 mb-3">Principal Component Directions</h5>
                                <div class="space-y-4">
                        `;
                        
                        for (let i = 0; i < Math.min(analysis.selectedComponents, 3); i++) {
                            const vector = analysis.eigenvectors[i];
                            const eigenvalue = analysis.eigenvalues[i];
                            
                            html += `
                                <div class="bg-gray-50 p-3 rounded">
                                    <div class="flex justify-between items-center mb-2">
                                        <h6 class="font-medium">PC${i + 1} (λ = ${eigenvalue.toFixed(3)})</h6>
                                        <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                            ${(eigenvalue * 100).toFixed(1)}% variance
                                        </span>
                                    </div>
                                    <div class="grid grid-cols-${Math.min(parseInt(originalDim), 6)} gap-2">
                            `;
                            
                            vector.slice(0, parseInt(originalDim)).forEach((component, j) => {
                                const absValue = Math.abs(component);
                                const color = component > 0 ? 'bg-blue-500' : 'bg-red-500';
                                const intensity = Math.min(absValue * 2, 1);
                                
                                html += `
                                    <div class="text-center">
                                        <div class="w-8 h-8 ${color} rounded flex items-center justify-center text-white text-xs font-bold mx-auto mb-1" 
                                             style="opacity: ${0.3 + intensity * 0.7}" 
                                             title="v${i+1}[${j}] = ${component.toFixed(3)}">
                                            ${component.toFixed(1)}
                                        </div>
                                        <div class="text-xs text-gray-600">x${j + 1}</div>
                                    </div>
                                `;
                            });
                            
                            html += `
                                    </div>
                                </div>
                            `;
                        }
                        
                        html += `
                                </div>
                                <div class="mt-4 text-xs text-gray-600">
                                    <span class="inline-block w-3 h-3 bg-blue-500 mr-1"></span>Positive components
                                    <span class="inline-block w-3 h-3 bg-red-500 mr-1 ml-4"></span>Negative components
                                </div>
                            </div>
                        `;
                    }
                    
                    else if (mode === 'projection') {
                        html += `
                            <div class="bg-white border rounded p-4">
                                <h5 class="font-medium text-gray-700 mb-3">Dimensionality Reduction Impact</h5>
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div class="bg-blue-50 p-3 rounded">
                                        <h6 class="font-medium text-blue-900 mb-2">Original Space (${originalDim}D)</h6>
                                        <div class="text-sm text-blue-800">
                                            <div>• Full feature representation</div>
                                            <div>• ${originalDim} dimensions</div>
                                            <div>• 100% variance preserved</div>
                                            <div>• Storage: ${originalDim} values per sample</div>
                                        </div>
                                    </div>
                                    <div class="bg-green-50 p-3 rounded">
                                        <h6 class="font-medium text-green-900 mb-2">Projected Space (${reducedDim}D)</h6>
                                        <div class="text-sm text-green-800">
                                            <div>• Compressed representation</div>
                                            <div>• ${reducedDim} dimensions</div>
                                            <div>• ${(analysis.varianceRetained * 100).toFixed(1)}% variance preserved</div>
                                            <div>• Storage: ${reducedDim} values per sample</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                                    <h6 class="font-medium text-yellow-900 mb-2">Information Loss Analysis</h6>
                                    <div class="text-sm text-yellow-800">
                                        <div>• Information lost: ${((1 - analysis.varianceRetained) * 100).toFixed(1)}%</div>
                                        <div>• Compression ratio: ${analysis.compressionRatio.toFixed(1)}:1</div>
                                        <div>• Memory savings: ${(100 * (1 - 1/analysis.compressionRatio)).toFixed(1)}%</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }

                    html += '</div>';
                    output.innerHTML = html;

                    if (legend) {
                        legend.innerHTML = `
                            Data: ${analysis.config.name} | 
                            Compression: ${originalDim}D → ${reducedDim}D | 
                            Variance Retained: ${(analysis.varianceRetained * 100).toFixed(1)}% | 
                            Top Eigenvalue: ${analysis.eigenvalues[0].toFixed(3)}
                        `;
                    }

                    if (explanation) {
                        explanation.innerHTML = `
                            <div class="space-y-3">
                                <p><strong>${analysis.config.name}:</strong> ${analysis.config.description}</p>
                                <p><strong>Eigenvalue Pattern:</strong> ${analysis.config.eigenvaluePattern}</p>
                                <p><strong>PCA Effectiveness:</strong> ${analysis.varianceRetained > 0.8 ? 'Excellent' : analysis.varianceRetained > 0.6 ? 'Good' : 'Moderate'} - retaining ${(analysis.varianceRetained * 100).toFixed(1)}% of variance with ${analysis.compressionRatio.toFixed(1)}x compression.</p>
                                <p><strong>Practical Impact:</strong> This level of dimensionality reduction would ${'save ' + (100 * (1 - 1/analysis.compressionRatio)).toFixed(1) + '% memory'} while preserving most important patterns in the data.</p>
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
                        dataTypeSelect.value = example.dataType;
                        originalDimSelect.value = example.originalDim;
                        reducedDimSelect.value = example.reducedDim;
                        
                        const modeRadio = document.querySelector(`input[name="q28-mode"][value="${example.mode}"]`);
                        if (modeRadio) {
                            modeRadio.checked = true;
                        }
                        
                        processAndDisplay();
                        
                        exampleBtn.textContent = example.note;
                        exampleBtn.title = `Example ${exampleIndex + 1}/${examples.length}: ${example.dataType}`;
                        
                        exampleIndex = (exampleIndex + 1) % examples.length;
                    } catch (error) {
                        console.error('Error in example cycling:', error);
                    }
                });
            }

            // Event listeners
            if (dataTypeSelect) {
                dataTypeSelect.addEventListener('change', processAndDisplay);
            }
            if (originalDimSelect) {
                originalDimSelect.addEventListener('change', processAndDisplay);
            }
            if (reducedDimSelect) {
                reducedDimSelect.addEventListener('change', processAndDisplay);
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
