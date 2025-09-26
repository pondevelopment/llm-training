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
                    output.innerHTML = '<div class="panel panel-warning p-3 text-sm">Error: Could not initialize interactive components.</div>';
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
                    compressionRatio: nDims / kDims,
                    dimensionalityReduction: Math.round((1 - kDims / nDims) * 100)
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
                    'eigenvalues': 'Eigenvalue analysis',
                    'eigenvectors': 'Eigenvector visualization',
                    'projection': 'Data projection'
                };
                
                if (modeIndicator) {
                    modeIndicator.textContent = modeNames[mode];
                }

                document.querySelectorAll('.q28-mode-option').forEach((option) => {
                    const radio = option.querySelector('input[name="q28-mode"]');
                    if (!radio) {
                        return;
                    }
                    const isActive = radio.checked;
                    option.classList.toggle('q28-mode-option--active', isActive);

                    const card = option.querySelector('.panel');
                    if (card) {
                        card.classList.toggle('panel-info', isActive);
                        card.classList.toggle('panel-neutral-soft', !isActive);
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
                        <div class="panel panel-neutral-soft p-3 space-y-2">
                            <h5 class="font-medium text-heading">PCA analysis summary</h5>
                            <div class="grid grid-cols-2 gap-3 text-sm text-heading md:grid-cols-4">
                                <div><span class="text-muted-soft">Data type:</span> ${analysis.config.name}</div>
                                <div><span class="text-muted-soft">Dimensions:</span> ${originalDim}D &rarr; ${reducedDim}D</div>
                                <div><span class="text-muted-soft">Variance retained:</span> ${(analysis.varianceRetained * 100).toFixed(1)}%</div>
                                <div><span class="text-muted-soft">Compression:</span> ${analysis.compressionRatio.toFixed(1)}x</div>
                            </div>
                        </div>
                    `;

                    if (mode === 'eigenvalues') {
                        html += `
                            <div class="panel panel-neutral p-4 space-y-4">
                                <h5 class="font-medium text-heading">Eigenvalue spectrum</h5>
                                <div class="space-y-3">
                        `;

                        analysis.eigenvalues.forEach((eigenval, i) => {
                            const isSelected = i < analysis.selectedComponents;
                            const percentage = (eigenval * 100).toFixed(1);
                            const cumulative = (analysis.cumulativeVariance[i] * 100).toFixed(1);
                            const fillColor = isSelected ? 'var(--tone-purple-strong)' : 'var(--color-muted-soft)';

                            html += `
                                <div class="flex items-center gap-3">
                                    <div class="w-16 text-sm font-mono text-heading">PC${i + 1}:</div>
                                    <div class="flex-1 space-y-1">
                                        <div class="flex justify-between text-xs text-muted">
                                            <span>λ${i + 1} = ${eigenval.toFixed(3)}</span>
                                            <span>${percentage}% (cum: ${cumulative}%)</span>
                                        </div>
                                        <div class="h-3 w-full rounded-full bg-subtle">
                                            <div class="h-3 rounded-full" style="background: ${fillColor}; width: ${percentage}%;"></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });

                        html += `
                                </div>
                                <div class="flex flex-wrap items-center gap-4 text-xs text-muted">
                                    <span class="flex items-center gap-2">
                                        <span class="q28-legend-swatch" style="background: var(--tone-purple-strong);"></span>
                                        Selected components
                                    </span>
                                    <span class="flex items-center gap-2">
                                        <span class="q28-legend-swatch" style="background: var(--color-muted-soft);"></span>
                                        Discarded components
                                    </span>
                                </div>
                            </div>
                        `;
                    }
                    
                    else if (mode === 'eigenvectors') {
                        html += `
                            <div class="panel panel-neutral p-4 space-y-4">
                                <h5 class="font-medium text-heading">Principal component directions</h5>
                                <div class="space-y-4">
                        `;

                        for (let i = 0; i < Math.min(analysis.selectedComponents, 3); i++) {
                            const vector = analysis.eigenvectors[i];
                            const eigenvalue = analysis.eigenvalues[i];

                            html += `
                                <div class="panel panel-neutral-soft p-3 space-y-3">
                                    <div class="flex items-center justify-between gap-2">
                                        <h6 class="font-medium text-heading">PC${i + 1} (λ = ${eigenvalue.toFixed(3)})</h6>
                                        <span class="chip chip-info text-xs">${(eigenvalue * 100).toFixed(1)}% variance</span>
                                    </div>
                                    <div class="grid grid-cols-${Math.min(parseInt(originalDim), 6)} gap-2">
                            `;

                            vector.slice(0, parseInt(originalDim)).forEach((component, j) => {
                                const absValue = Math.abs(component);
                                const intensity = Math.min(absValue * 2, 1);
                                const color = component >= 0 ? 'var(--tone-sky-strong)' : 'var(--color-path-scaling-strong)';

                                html += `
                                    <div class="text-center space-y-1">
                                        <div class="q28-vector-cell" 
                                             style="background: ${color}; opacity: ${0.3 + intensity * 0.7};" 
                                             title="v${i + 1}[${j}] = ${component.toFixed(3)}">
                                            ${component.toFixed(1)}
                                        </div>
                                        <div class="text-xs text-muted">x${j + 1}</div>
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
                                <div class="flex flex-wrap items-center gap-4 text-xs text-muted">
                                    <span class="flex items-center gap-2">
                                        <span class="q28-legend-swatch" style="background: var(--tone-sky-strong);"></span>
                                        Positive components
                                    </span>
                                    <span class="flex items-center gap-2">
                                        <span class="q28-legend-swatch" style="background: var(--color-path-scaling-strong);"></span>
                                        Negative components
                                    </span>
                                </div>
                                <p class="small-caption text-muted">Opacity tracks how much each original axis contributes to the component—dense colour means a stronger weight, while blue versus rose indicates the direction of influence.</p>
                            </div>
                        `;
                    }
                    
                    else if (mode === 'projection') {
                        html += `
                            <div class="panel panel-neutral p-4 space-y-4">
                                <h5 class="font-medium text-heading">Dimensionality reduction impact</h5>
                                <div class="grid gap-4 md:grid-cols-2">
                                    <div class="panel panel-info p-3 space-y-2">
                                        <h6 class="font-medium text-heading">Original space (${originalDim}D)</h6>
                                        <ul class="text-sm text-muted space-y-1">
                                            <li>• Full feature representation</li>
                                            <li>• ${originalDim} dimensions</li>
                                            <li>• 100% variance preserved</li>
                                            <li>• Storage: ${originalDim} values per sample</li>
                                        </ul>
                                    </div>
                                    <div class="panel panel-success p-3 space-y-2">
                                        <h6 class="font-medium text-heading">Projected space (${reducedDim}D)</h6>
                                        <ul class="text-sm text-muted space-y-1">
                                            <li>• Compressed representation</li>
                                            <li>• ${reducedDim} dimensions</li>
                                            <li>• ${(analysis.varianceRetained * 100).toFixed(1)}% variance preserved</li>
                                            <li>• Storage: ${reducedDim} values per sample</li>
                                        </ul>
                                    </div>
                                </div>

                                <div class="panel panel-warning p-3 space-y-1 text-sm text-heading">
                                    <h6 class="font-medium text-heading">Information loss analysis</h6>
                                    <div>• Information lost: ${((1 - analysis.varianceRetained) * 100).toFixed(1)}%</div>
                                    <div>• Compression ratio: ${analysis.compressionRatio.toFixed(1)}:1</div>
                                    <div>• Memory savings: ${(100 * (1 - 1 / analysis.compressionRatio)).toFixed(1)}%</div>
                                    <div>• Dimensionality reduction: ${analysis.dimensionalityReduction}%</div>
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
                            <div class="flex flex-wrap items-center gap-3">
                                <span><span class="text-muted-soft">Data:</span> ${analysis.config.name}</span>
                                <span><span class="text-muted-soft">Compression:</span> ${originalDim}D &rarr; ${reducedDim}D</span>
                                <span><span class="text-muted-soft">Variance retained:</span> ${(analysis.varianceRetained * 100).toFixed(1)}%</span>
                                <span><span class="text-muted-soft">Top eigenvalue:</span> ${analysis.eigenvalues[0].toFixed(3)}</span>
                            </div>
                        `;
                        typesetMath(legend);
                    }

                    if (explanation) {
                        explanation.innerHTML = `
                            <div class="space-y-3 text-muted">
                                <p><strong class="text-heading">${analysis.config.name}:</strong> ${analysis.config.description}</p>
                                <p><strong class="text-heading">Eigenvalue pattern:</strong> ${analysis.config.eigenvaluePattern}</p>
                                <p><strong class="text-heading">PCA effectiveness:</strong> ${analysis.varianceRetained > 0.8 ? 'Excellent' : analysis.varianceRetained > 0.6 ? 'Good' : 'Moderate'} - retaining ${(analysis.varianceRetained * 100).toFixed(1)}% of variance with ${analysis.compressionRatio.toFixed(1)}x compression.</p>
                                <p><strong class="text-heading">Practical impact:</strong> Saves ${(100 * (1 - 1 / analysis.compressionRatio)).toFixed(1)}% memory while keeping the dominant patterns.</p>
                                ${parseInt(reducedDim) > parseInt(originalDim) ? '<p class="text-danger"><strong class="text-heading">Note:</strong> Reduced dimension cannot exceed original; value clamped.</p>' : ''}
                            </div>
                        `;
                        typesetMath(explanation);
                    }
                    
                } catch (error) {
                    console.error('Error in processAndDisplay:', error);
                    if (output) {
                        output.innerHTML = '<div class="panel panel-warning p-3 text-sm">Error processing data. Please try again.</div>';
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
