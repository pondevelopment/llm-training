const interactiveScript = () => {
            // Safe MathJax typeset helper
            function typesetMath(root) {
                try {
                    if (window.MathJax && MathJax.typesetPromise) {
                        return MathJax.typesetPromise(root ? [root] : undefined).catch(() => {});
                    }
                } catch (_) {}
                return Promise.resolve();
            }
            // Get DOM elements with error checking
            const distTypeSelect = document.getElementById('q29-dist-type');
            const pPeakSlider = document.getElementById('q29-p-peak');
            const pWidthSlider = document.getElementById('q29-p-width');
            const qPeakSlider = document.getElementById('q29-q-peak');
            const qWidthSlider = document.getElementById('q29-q-width');
            const pPeakVal = document.getElementById('q29-p-peak-val');
            const pWidthVal = document.getElementById('q29-p-width-val');
            const qPeakVal = document.getElementById('q29-q-peak-val');
            const qWidthVal = document.getElementById('q29-q-width-val');
            const modeRadios = document.querySelectorAll('input[name="q29-mode"]');
            const output = document.getElementById('q29-output');
            const scenarioBtn = document.getElementById('q29-scenario-btn');
            const modeIndicator = document.getElementById('q29-mode-indicator');
            const legend = document.getElementById('q29-legend');
            const explanation = document.getElementById('q29-explanation');

            // Check if required elements exist
            if (!distTypeSelect || !output || !pPeakSlider || !qPeakSlider) {
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize interactive components.</div>';
                }
                return;
            }

            // Scenario configurations
            const scenarios = {
                'teacher-student': {
                    name: 'Teacher-Student Knowledge Distillation',
                    description: 'Large teacher model (P) transfers knowledge to smaller student (Q)',
                    pDefault: { peak: 5.0, width: 1.0 },
                    qDefault: { peak: 4.8, width: 1.2 },
                    context: 'Student tries to match teacher\'s output distribution'
                },
                'rlhf-drift': {
                    name: 'RLHF Policy Drift Prevention',
                    description: 'Reference model (P) constrains fine-tuned policy (Q) during RLHF',
                    pDefault: { peak: 5.0, width: 1.0 },
                    qDefault: { peak: 5.3, width: 0.9 },
                    context: 'Policy should not drift too far from reference'
                },
                'fine-tuning': {
                    name: 'Fine-tuning with Prior Regularization',
                    description: 'Prior distribution (P) regularizes fine-tuned model (Q)',
                    pDefault: { peak: 5.0, width: 1.5 },
                    qDefault: { peak: 4.5, width: 1.0 },
                    context: 'Model adapts to new task while staying close to prior'
                },
                'custom': {
                    name: 'Custom Distributions',
                    description: 'Explore arbitrary probability distributions',
                    pDefault: { peak: 5.0, width: 1.0 },
                    qDefault: { peak: 4.5, width: 1.2 },
                    context: 'Free exploration of KL divergence behavior'
                }
            };

            // Predefined scenarios for cycling
            const quickScenarios = [
                { dist: 'teacher-student', p: {peak: 5.0, width: 1.0}, q: {peak: 5.0, width: 1.0}, mode: 'forward', note: 'Perfect Match' },
                { dist: 'teacher-student', p: {peak: 5.0, width: 1.0}, q: {peak: 4.5, width: 1.5}, mode: 'forward', note: 'Student Underfits' },
                { dist: 'rlhf-drift', p: {peak: 5.0, width: 1.0}, q: {peak: 6.0, width: 0.8}, mode: 'forward', note: 'Policy Drift' },
                { dist: 'fine-tuning', p: {peak: 5.0, width: 2.0}, q: {peak: 4.0, width: 0.8}, mode: 'reverse', note: 'Mode Collapse' }
            ];
            let scenarioIndex = 0;

            // Gaussian probability distribution
            function gaussian(x, mu, sigma) {
                return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
            }

            // Normalize distribution to sum to 1
            function normalize(dist) {
                const sum = dist.reduce((s, val) => s + val, 0);
                return dist.map(val => val / sum);
            }

            // Calculate KL divergence
            function calculateKL(P, Q, mode = 'forward') {
                const epsilon = 1e-10; // Numerical stability
                let kl = 0;
                
                if (mode === 'forward') {
                    // D(P||Q)
                    for (let i = 0; i < P.length; i++) {
                        if (P[i] > epsilon) {
                            kl += P[i] * Math.log((P[i] + epsilon) / (Q[i] + epsilon));
                        }
                    }
                } else if (mode === 'reverse') {
                    // D(Q||P)
                    for (let i = 0; i < P.length; i++) {
                        if (Q[i] > epsilon) {
                            kl += Q[i] * Math.log((Q[i] + epsilon) / (P[i] + epsilon));
                        }
                    }
                } else if (mode === 'symmetric') {
                    // Jensen-Shannon divergence
                    const M = P.map((p, i) => (p + Q[i]) / 2);
                    let js = 0;
                    for (let i = 0; i < P.length; i++) {
                        if (P[i] > epsilon) {
                            js += 0.5 * P[i] * Math.log((P[i] + epsilon) / (M[i] + epsilon));
                        }
                        if (Q[i] > epsilon) {
                            js += 0.5 * Q[i] * Math.log((Q[i] + epsilon) / (M[i] + epsilon));
                        }
                    }
                    kl = js;
                }
                
                return Math.max(0, kl); // Ensure non-negative
            }

            // Get current mode
            function getCurrentMode() {
                const selected = document.querySelector('input[name="q29-mode"]:checked');
                return selected ? selected.value : 'forward';
            }

            // Update slider value displays
            function updateSliderValues() {
                if (pPeakVal) pPeakVal.textContent = parseFloat(pPeakSlider.value).toFixed(1);
                if (pWidthVal) pWidthVal.textContent = parseFloat(pWidthSlider.value).toFixed(1);
                if (qPeakVal) qPeakVal.textContent = parseFloat(qPeakSlider.value).toFixed(1);
                if (qWidthVal) qWidthVal.textContent = parseFloat(qWidthSlider.value).toFixed(1);
            }

            // Update visual indicators
            function updateModeVisuals() {
                const mode = getCurrentMode();
                const modeNames = {
                    'forward': 'Forward KL: D(P||Q)',
                    'reverse': 'Reverse KL: D(Q||P)',
                    'symmetric': 'Jensen-Shannon Divergence'
                };
                
                if (modeIndicator) {
                    modeIndicator.textContent = modeNames[mode];
                }

                document.querySelectorAll('input[name="q29-mode"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
            }

            // Apply scenario defaults
            function applyScenario(scenarioKey) {
                const scenario = scenarios[scenarioKey];
                if (!scenario) return;

                pPeakSlider.value = scenario.pDefault.peak;
                pWidthSlider.value = scenario.pDefault.width;
                qPeakSlider.value = scenario.qDefault.peak;
                qWidthSlider.value = scenario.qDefault.width;
                
                updateSliderValues();
            }

            // Main processing function
            const processAndDisplay = () => {
                try {
                    const distType = distTypeSelect.value;
                    const mode = getCurrentMode();
                    
                    // Get distribution parameters
                    const pPeak = parseFloat(pPeakSlider.value);
                    const pWidth = parseFloat(pWidthSlider.value);
                    const qPeak = parseFloat(qPeakSlider.value);
                    const qWidth = parseFloat(qWidthSlider.value);
                    
                    updateModeVisuals();
                    updateSliderValues();

                    // Generate distributions
                    const xRange = [];
                    const P = [];
                    const Q = [];
                    
                    for (let x = 0; x <= 10; x += 0.1) {
                        xRange.push(x);
                        P.push(gaussian(x, pPeak, pWidth));
                        Q.push(gaussian(x, qPeak, qWidth));
                    }
                    
                    // Normalize distributions
                    const PNorm = normalize(P);
                    const QNorm = normalize(Q);
                    
                    // Calculate divergences
                    const klForward = calculateKL(PNorm, QNorm, 'forward');
                    const klReverse = calculateKL(PNorm, QNorm, 'reverse');
                    const jsDivergence = calculateKL(PNorm, QNorm, 'symmetric');
                    
                    let html = '<div class="space-y-4">';
                    
                    // Scenario information
                    const scenario = scenarios[distType];
                    html += `
                        <div class="bg-gray-50 p-3 rounded border">
                            <h5 class="font-medium text-gray-700 mb-2">${scenario.name}</h5>
                            <p class="text-sm text-gray-600 mb-2">${scenario.description}</p>
                            <div class="text-xs text-gray-500">${scenario.context}</div>
                        </div>
                    `;

                    // Divergence values
                    html += `
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-blue-50 p-3 rounded text-center">
                                <div class="text-lg font-bold text-blue-700">${klForward.toFixed(4)}</div>
                                <div class="text-xs text-blue-600">D(P||Q)</div>
                                <div class="text-xs text-gray-500">Forward KL</div>
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <div class="text-lg font-bold text-purple-700">${klReverse.toFixed(4)}</div>
                                <div class="text-xs text-purple-600">D(Q||P)</div>
                                <div class="text-xs text-gray-500">Reverse KL</div>
                            </div>
                            <div class="bg-green-50 p-3 rounded text-center">
                                <div class="text-lg font-bold text-green-700">${jsDivergence.toFixed(4)}</div>
                                <div class="text-xs text-green-600">JS(P,Q)</div>
                                <div class="text-xs text-gray-500">Jensen-Shannon</div>
                            </div>
                        </div>
                    `;

                    // Visual distribution comparison
                    html += `
                        <div class="bg-white border rounded p-4">
                            <h5 class="font-medium text-gray-700 mb-3">Distribution Visualization</h5>
                            <div class="space-y-4">
                                <!-- Distribution curves as bar chart -->
                                <div class="relative h-32 bg-gradient-to-b from-gray-50 to-gray-100 rounded border p-2">
                                    <div class="flex items-end justify-between h-full space-x-1">
                    `;
                    
                    // Create visual bars for distributions
                    const numBars = 25;
                    const maxHeight = Math.max(Math.max(...PNorm), Math.max(...QNorm));
                    
                    for (let i = 0; i < numBars; i++) {
                        const xIndex = Math.floor((i / numBars) * PNorm.length);
                        const pHeight = (PNorm[xIndex] / maxHeight) * 100;
                        const qHeight = (QNorm[xIndex] / maxHeight) * 100;
                        const maxBar = Math.max(pHeight, qHeight);
                        
                        html += `
                            <div class="flex-1 flex flex-col items-center justify-end h-full relative" style="min-height: 100px;">
                                <!-- Background bar for scale -->
                                <div class="w-full bg-gray-200 rounded-sm opacity-20" style="height: 100%"></div>
                                
                                <!-- P distribution bar -->
                                <div class="absolute bottom-0 w-2/5 left-0 bg-blue-500 rounded-sm opacity-70 transition-all hover:opacity-90" 
                                     style="height: ${pHeight}%"
                                     title="P: ${PNorm[xIndex].toFixed(4)}"></div>
                                
                                <!-- Q distribution bar -->
                                <div class="absolute bottom-0 w-2/5 right-0 bg-purple-500 rounded-sm opacity-70 transition-all hover:opacity-90" 
                                     style="height: ${qHeight}%"
                                     title="Q: ${QNorm[xIndex].toFixed(4)}"></div>
                            </div>
                        `;
                    }
                    
                    html += `
                                    </div>
                                    
                                    <!-- X-axis labels -->
                                    <div class="flex justify-between text-xs text-gray-500 mt-2 px-1">
                                        <span>0</span>
                                        <span>2.5</span>
                                        <span>5.0</span>
                                        <span>7.5</span>
                                        <span>10</span>
                                    </div>
                                </div>
                                
                                <!-- Legend and key metrics -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <!-- Legend -->
                                    <div class="bg-gray-50 p-3 rounded border">
                                        <h6 class="font-medium text-gray-900 mb-2 text-center">Legend</h6>
                                        <div class="space-y-2">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-4 h-3 bg-blue-500 rounded-sm opacity-70"></div>
                                                <span class="text-sm text-blue-700">P (Target)</span>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <div class="w-4 h-3 bg-purple-500 rounded-sm opacity-70"></div>
                                                <span class="text-sm text-purple-700">Q (Approximation)</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Distribution P stats -->
                                    <div class="bg-blue-50 p-3 rounded border border-blue-200">
                                        <h6 class="font-medium text-blue-900 mb-2 text-center">Distribution P</h6>
                                        <div class="text-sm text-blue-800 space-y-1 text-center">
                                            <div>Peak: <span class="font-mono">${pPeak.toFixed(1)}</span></div>
                                            <div>Width: <span class="font-mono">${pWidth.toFixed(1)}</span></div>
                                            <div>Max: <span class="font-mono">${Math.max(...PNorm).toFixed(4)}</span></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Distribution Q stats -->
                                    <div class="bg-purple-50 p-3 rounded border border-purple-200">
                                        <h6 class="font-medium text-purple-900 mb-2 text-center">Distribution Q</h6>
                                        <div class="text-sm text-purple-800 space-y-1 text-center">
                                            <div>Peak: <span class="font-mono">${qPeak.toFixed(1)}</span></div>
                                            <div>Width: <span class="font-mono">${qWidth.toFixed(1)}</span></div>
                                            <div>Max: <span class="font-mono">${Math.max(...QNorm).toFixed(4)}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Current mode highlight
                    const currentKL = mode === 'forward' ? klForward : 
                                    mode === 'reverse' ? klReverse : jsDivergence;
                    
                    html += `
                        <div class="p-3 rounded border-2 ${
                            mode === 'forward' ? 'border-blue-300 bg-blue-50' :
                            mode === 'reverse' ? 'border-purple-300 bg-purple-50' :
                            'border-green-300 bg-green-50'
                        }">
                            <div class="text-center">
                                <div class="text-2xl font-bold ${
                                    mode === 'forward' ? 'text-blue-700' :
                                    mode === 'reverse' ? 'text-purple-700' :
                                    'text-green-700'
                                }">${currentKL.toFixed(6)}</div>
                                <div class="text-sm font-medium text-gray-700">
                                    Current: ${modeIndicator ? modeIndicator.textContent : mode}
                                </div>
                            </div>
                        </div>
                    `;

                    html += '</div>';
                    output.innerHTML = html;
                    typesetMath(output);

                    if (legend) {
                        legend.innerHTML = `
                            Scenario: ${scenario.name} | 
                            P: μ=${pPeak.toFixed(1)}, σ=${pWidth.toFixed(1)} | 
                            Q: μ=${qPeak.toFixed(1)}, σ=${qWidth.toFixed(1)} | 
                            Mode: ${mode}
                        `;
                        typesetMath(legend);
                    }

                    if (explanation) {
                        let explText = '';
                        if (mode === 'forward') {
                            explText = `<strong>Forward KL D(P||Q) = ${klForward.toFixed(4)}:</strong> Measures how much information is lost when using Q to approximate P. `;
                            if (klForward < 0.01) {
                                explText += 'Excellent match - Q closely approximates P.';
                            } else if (klForward < 0.1) {
                                explText += 'Good approximation with minor differences.';
                            } else {
                                explText += 'Significant divergence - Q poorly approximates P.';
                            }
                        } else if (mode === 'reverse') {
                            explText = `<strong>Reverse KL D(Q||P) = ${klReverse.toFixed(4)}:</strong> Mode-seeking behavior where Q focuses on P's modes. `;
                            explText += 'Used in variational inference and GAN training.';
                        } else {
                            explText = `<strong>Jensen-Shannon JS(P,Q) = ${jsDivergence.toFixed(4)}:</strong> Symmetric measure bounded between 0 and 1. `;
                            explText += 'Provides balanced comparison without directional bias.';
                        }
                        
                        explText += ` <strong>LLM Context:</strong> In ${scenario.name.toLowerCase()}, this measures ${scenario.context.toLowerCase()}.`;
                        
                        explanation.innerHTML = explText;
                        typesetMath(explanation);
                    }
                    
                } catch (error) {
                    console.error('Error in processAndDisplay:', error);
                    if (output) {
                        output.innerHTML = '<div class="text-red-500 p-4">Error processing data. Please try again.</div>';
                    }
                }
            };

            // Scenario cycling functionality
            if (scenarioBtn) {
                scenarioBtn.addEventListener('click', () => {
                    try {
                        const scenario = quickScenarios[scenarioIndex];
                        
                        distTypeSelect.value = scenario.dist;
                        pPeakSlider.value = scenario.p.peak;
                        pWidthSlider.value = scenario.p.width;
                        qPeakSlider.value = scenario.q.peak;
                        qWidthSlider.value = scenario.q.width;
                        
                        const modeRadio = document.querySelector(`input[name="q29-mode"][value="${scenario.mode}"]`);
                        if (modeRadio) {
                            modeRadio.checked = true;
                        }
                        
                        processAndDisplay();
                        
                        scenarioBtn.textContent = scenario.note;
                        scenarioBtn.title = `Scenario ${scenarioIndex + 1}/${quickScenarios.length}: ${scenario.note}`;
                        
                        scenarioIndex = (scenarioIndex + 1) % quickScenarios.length;
                    } catch (error) {
                        console.error('Error in scenario cycling:', error);
                    }
                });
            }

            // Event listeners
            if (distTypeSelect) {
                distTypeSelect.addEventListener('change', () => {
                    applyScenario(distTypeSelect.value);
                    processAndDisplay();
                });
            }
            
            [pPeakSlider, pWidthSlider, qPeakSlider, qWidthSlider].forEach(slider => {
                if (slider) {
                    slider.addEventListener('input', processAndDisplay);
                }
            });
            
            modeRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            applyScenario(distTypeSelect.value);
            updateModeVisuals();
            processAndDisplay();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question29Interactive = interactiveScript;
}
