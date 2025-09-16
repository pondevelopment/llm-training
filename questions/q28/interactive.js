const interactiveScript = () => {
            // Safe MathJax typeset helper (no-op if MathJax unavailable)
            function typesetMath(root) {
                try {
                    if (window.MathJax && MathJax.typesetPromise) {
                        return MathJax.typesetPromise(root ? [root] : undefined).catch(() => {});
                    }
                } catch (_) {}
                return Promise.resolve();
            }
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
                    let reducedDim = reducedDimSelect.value;
                    if (parseInt(reducedDim) > parseInt(originalDim)) {
                        // Clamp and reflect selection
                        reducedDim = originalDim;
                        if (reducedDimSelect) reducedDimSelect.value = originalDim;
                    }
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
                    // Typeset any math that may have been injected
                    typesetMath(output);

                    if (legend) {
                        legend.innerHTML = `
                            Data: ${analysis.config.name} | 
                            Compression: ${originalDim}D → ${reducedDim}D | 
                            Variance Retained: ${(analysis.varianceRetained * 100).toFixed(1)}% | 
                            Top Eigenvalue: ${analysis.eigenvalues[0].toFixed(3)}
                        `;
                        typesetMath(legend);
                    }

                    if (explanation) {
                        explanation.innerHTML = `
                            <div class="space-y-3">
                                <p><strong>${analysis.config.name}:</strong> ${analysis.config.description}</p>
                                <p><strong>Eigenvalue Pattern:</strong> ${analysis.config.eigenvaluePattern}</p>
                                <p><strong>PCA Effectiveness:</strong> ${analysis.varianceRetained > 0.8 ? 'Excellent' : analysis.varianceRetained > 0.6 ? 'Good' : 'Moderate'} - retaining ${(analysis.varianceRetained * 100).toFixed(1)}% of variance with ${analysis.compressionRatio.toFixed(1)}x compression.</p>
                                <p><strong>Practical Impact:</strong> This level of dimensionality reduction would ${'save ' + (100 * (1 - 1/analysis.compressionRatio)).toFixed(1) + '% memory'} while preserving most important patterns in the data.</p>
                                ${parseInt(reducedDim) > parseInt(originalDim) ? '<p class="text-red-600"><strong>Note:</strong> Reduced dimension cannot exceed original; value clamped.</p>' : ''}
                            </div>
                        `;
                        typesetMath(explanation);
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question28Interactive = interactiveScript;
}
