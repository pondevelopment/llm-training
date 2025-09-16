const interactiveScript = () => {
            // Get DOM elements with error checking
            const scenarioSelect = document.getElementById('q33-scenario');
            const modelSizeSelect = document.getElementById('q33-model-size');
            const dataRegimeSelect = document.getElementById('q33-data-regime');
            const output = document.getElementById('q33-output');
            const strategyRadios = document.querySelectorAll('input[name="q33-strategy"]');
            const exampleBtn = document.getElementById('q33-example-btn');
            const strategyIndicator = document.getElementById('q33-strategy-indicator');
            const legend = document.getElementById('q33-legend');
            const explanation = document.getElementById('q33-explanation');

            // Check if required elements exist
            if (!scenarioSelect || !output || !modelSizeSelect || !dataRegimeSelect) {
                console.error('Required DOM elements not found');
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize interactive components.</div>';
                }
                return;
            }

            // Configuration data for different scenarios and strategies
            const scenarioData = {
                'video-understanding': {
                    name: 'Video Understanding',
                    modalities: ['Text', 'Vision', 'Audio'],
                    complexity: 'High',
                    primaryChallenge: 'Temporal alignment across modalities',
                    unifiedAdvantage: 'Temporal alignment via shared attention'
                },
                'document-analysis': {
                    name: 'Document Analysis',
                    modalities: ['Text', 'Vision'],
                    complexity: 'Medium',
                    primaryChallenge: 'Spatial-textual relationship understanding',
                    unifiedAdvantage: 'Shared spatial–semantic embedding'
                },
                'conversational-ai': {
                    name: 'Conversational AI',
                    modalities: ['Text', 'Audio'],
                    complexity: 'Medium',
                    primaryChallenge: 'Real-time processing and context retention',
                    unifiedAdvantage: 'Low-latency shared processing'
                },
                'medical-diagnosis': {
                    name: 'Medical Diagnosis',
                    modalities: ['Text', 'Vision', 'Audio', 'Sensor Data'],
                    complexity: 'Very High',
                    primaryChallenge: 'Multi-scale feature integration',
                    unifiedAdvantage: 'Holistic multi-source representation'
                },
                'creative-content': {
                    name: 'Creative Content Generation',
                    modalities: ['Text', 'Vision', 'Audio'],
                    complexity: 'High',
                    primaryChallenge: 'Cross-modal creativity and consistency',
                    unifiedAdvantage: 'Shared creative latent space'
                }
            };

            const strategyData = {
                'traditional': {
                    name: 'Traditional Multi-Encoder',
                    parameterMultiplier: 3.0,
                    trainingTimeMultiplier: 1.5,
                    accuracyModifier: 0.85,
                    memoryMultiplier: 2.5,
                    description: 'Separate encoders with late fusion',
                    pros: ['Modality-specific optimization', 'Well-established approach'],
                    cons: ['High parameter count', 'Limited cross-modal learning', 'Sequential training bottlenecks']
                },
                'unified': {
                    name: 'Unified Transformer',
                    parameterMultiplier: 1.0,
                    trainingTimeMultiplier: 0.65,
                    accuracyModifier: 1.15,
                    memoryMultiplier: 1.0,
                    description: 'Single transformer with cross-modal attention',
                    pros: ['Parameter efficient', 'Rich cross-modal interactions', 'Faster convergence'],
                    cons: ['Complex attention mechanisms', 'Requires careful balancing']
                },
                'hybrid': {
                    name: 'Hybrid Approach',
                    parameterMultiplier: 1.8,
                    trainingTimeMultiplier: 0.85,
                    accuracyModifier: 1.05,
                    memoryMultiplier: 1.6,
                    description: 'Specialized encoders with unified cross-attention',
                    pros: ['Balanced approach', 'Modality specialization + cross-modal learning'],
                    cons: ['Increased complexity', 'More hyperparameters to tune']
                }
            };

            const modelSizes = {
                'small': { params: 7, baseTrainingTime: 100, baseAccuracy: 0.82 },
                'medium': { params: 70, baseTrainingTime: 500, baseAccuracy: 0.88 },
                'large': { params: 175, baseTrainingTime: 1200, baseAccuracy: 0.92 },
                'ultra': { params: 1000, baseTrainingTime: 5000, baseAccuracy: 0.95 }
            };

            const dataRegimes = {
                'supervised': { 
                    efficiency: 1.0, 
                    dataRequirement: 1.0,
                    description: 'Fully supervised learning with labeled data'
                },
                'self-supervised': { 
                    efficiency: 1.3, 
                    dataRequirement: 0.3,
                    description: 'Self-supervised pre-training with minimal labels'
                },
                'contrastive': { 
                    efficiency: 1.2, 
                    dataRequirement: 0.4,
                    description: 'Contrastive learning for cross-modal alignment'
                },
                'mixed': { 
                    efficiency: 1.4, 
                    dataRequirement: 0.5,
                    description: 'Combined objectives for optimal learning'
                }
            };

            // Helper function to get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q33-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'unified';
            }

            // Calculate performance metrics
            function calculateMetrics(scenario, strategy, modelSize, dataRegime) {
                const scenarioInfo = scenarioData[scenario];
                const strategyInfo = strategyData[strategy];
                const modelInfo = modelSizes[modelSize];
                const dataInfo = dataRegimes[dataRegime];

                const totalParams = modelInfo.params * strategyInfo.parameterMultiplier;
                const trainingTime = modelInfo.baseTrainingTime * strategyInfo.trainingTimeMultiplier / dataInfo.efficiency;
                const accuracy = modelInfo.baseAccuracy * strategyInfo.accuracyModifier * (dataInfo.efficiency * 0.1 + 0.9);
                const memoryUsage = totalParams * strategyInfo.memoryMultiplier;
                const dataRequirement = 100 * dataInfo.dataRequirement; // Million samples

                return {
                    scenario: scenarioInfo,
                    strategy: strategyInfo,
                    totalParams,
                    trainingTime,
                    accuracy: Math.min(accuracy, 0.98),
                    memoryUsage,
                    dataRequirement,
                    efficiency: (accuracy / (trainingTime / 1000)) * (100 / totalParams)
                };
            }

            // Update visual indicators for strategy selection
            function updateStrategyVisuals() {
                const selected = document.querySelector('input[name="q33-strategy"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q33-strategy"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.remove('border-gray-200');
                        container.classList.add('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-200');
                    } else {
                        container.classList.remove('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-200');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update strategy indicator
                if (strategyIndicator && strategyData[selectedValue]) {
                    strategyIndicator.textContent = strategyData[selectedValue].name;
                }
            }

            // Create performance chart (now compares against dynamic traditional baseline)
            function createPerformanceChart(metrics, baseline) {
                const container = document.createElement('div');
                container.className = 'space-y-6';

                // --- 1. Key Metrics Overview ---
                const metricsGrid = document.createElement('div');
                metricsGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6';
                
                const metricsInfo = [
                    { label: 'Parameters', value: `${metrics.totalParams.toFixed(1)}B`, color: 'blue' },
                    { label: 'Training Time', value: `${(metrics.trainingTime / 24).toFixed(1)}d`, color: 'green' },
                    { label: 'Accuracy', value: `${(metrics.accuracy * 100).toFixed(1)}%`, color: 'purple' },
                    { label: 'Efficiency Score', value: `${metrics.efficiency.toFixed(2)}`, color: 'orange' }
                ];

                metricsInfo.forEach(metric => {
                    const metricCard = document.createElement('div');
                    metricCard.className = `bg-${metric.color}-50 p-4 rounded-lg border border-${metric.color}-200 text-center shadow-sm`;
                    metricCard.innerHTML = `
                        <div class="text-2xl font-bold text-${metric.color}-600">${metric.value}</div>
                        <div class="text-sm text-${metric.color}-800 font-medium mt-1">${metric.label}</div>
                    `;
                    metricsGrid.appendChild(metricCard);
                });
                container.appendChild(metricsGrid);

                // --- 2. Architecture Flow Diagram ---
                const archDiagram = document.createElement('div');
                archDiagram.className = 'bg-gray-50 p-6 rounded-lg border';
                archDiagram.innerHTML = `
                    <h5 class="font-semibold text-gray-800 mb-4 text-center">🏗️ ${metrics.strategy.name} Architecture Flow</h5>
                    <div class="flex items-center justify-center space-x-2 md:space-x-4 text-sm flex-wrap">
                        ${metrics.scenario.modalities.map(modality => {
                            const emoji = modality === 'Text' ? '📝' : modality === 'Vision' ? '🖼️' : modality === 'Audio' ? '🎵' : '🔬';
                            return `<div class="text-center p-2">
                                <div class="text-3xl mb-1">${emoji}</div>
                                <div class="text-xs text-gray-600">${modality}</div>
                            </div>`;
                        }).join('<div class="text-gray-400 text-2xl mx-1">→</div>')}
                        <div class="text-gray-400 text-2xl mx-1">→</div>
                        <div class="text-center p-2 bg-white rounded-lg border shadow-sm">
                            <div class="text-3xl mb-1">🧠</div>
                            <div class="text-xs text-gray-800 font-semibold">${metrics.strategy.name}</div>
                        </div>
                        <div class="text-gray-400 text-2xl mx-1">→</div>
                        <div class="text-center p-2">
                            <div class="text-3xl mb-1">✨</div>
                            <div class="text-xs text-gray-600">Output</div>
                        </div>
                    </div>
                `;
                container.appendChild(archDiagram);
                
                // --- 3. Performance Comparison (Overflow Fixed) ---
                const comparisonSection = document.createElement('div');
                comparisonSection.className = 'bg-white p-6 rounded-lg border mt-4';
                
                // Dynamic baseline: always the 'Traditional' strategy with same scenario/model/data regime.
                // This makes the bars responsive to model size & data regime changes.
                const paramPercent = (metrics.totalParams / baseline.totalParams) * 100; // <100 => fewer params than baseline
                const timePercent = (metrics.trainingTime / baseline.trainingTime) * 100; // <100 => faster
                const accPercent = (metrics.accuracy / baseline.accuracy) * 100; // >100 => higher accuracy
                const SCALE_MAX = 200; // visualize up to 200% (sufficient for current multipliers)

                const renderReductionBar = (label, valuePercent, color) => {
                    const reduction = 100 - valuePercent; // positive means reduction
                    const badge = reduction > 0
                        ? `<span class="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-${color}-100 text-${color}-700 border border-${color}-200">−${reduction.toFixed(0)}%</span>`
                        : '';
                    const visualWidth = Math.min(valuePercent, SCALE_MAX) / SCALE_MAX * 100;
                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1 font-medium items-center">
                                <span>${label}</span>
                                <span class="text-${color}-600">${valuePercent.toFixed(0)}% of baseline ${badge}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                <div class="h-4 bg-${color}-500 rounded-full transition-all duration-500" style="width:${visualWidth}%"></div>
                                ${valuePercent > SCALE_MAX ? `<div class=\"absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffffff33_0_8px,#ffffff00_8px_16px)] rounded-full\"></div>` : ''}
                            </div>
                        </div>`;
                };

                const renderImprovementBar = (label, valuePercent, color) => {
                    const improvement = valuePercent - 100; // positive means gain
                    const over = valuePercent > 100;
                    const width = Math.min(valuePercent, SCALE_MAX) / SCALE_MAX * 100;
                    const badge = over
                        ? `<span class="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-${color}-100 text-${color}-700 border border-${color}-200">+${improvement.toFixed(0)}%</span>`
                        : '';
                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1 font-medium items-center">
                                <span>${label}</span>
                                <span class="text-${color}-600">${valuePercent.toFixed(0)}% of baseline ${badge}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                <div class="h-4 bg-${color}-500 rounded-full transition-all duration-500" style="width:${width}%"></div>
                                ${valuePercent > SCALE_MAX ? `<div class=\"absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffffff33_0_8px,#ffffff00_8px_16px)] rounded-full\"></div>` : ''}
                            </div>
                        </div>`;
                };

                comparisonSection.innerHTML = `
                    <h5 class="font-semibold text-gray-800 mb-4">📊 Performance vs. Baseline (Traditional)</h5>
                    <div class="space-y-4">
                        ${renderReductionBar('Parameter Count', paramPercent, 'blue')}
                        ${renderReductionBar('Training Time', timePercent, 'green')}
                        ${renderImprovementBar('Accuracy', accPercent, 'purple')}
                    </div>
                    <p class="mt-3 text-[11px] text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Baseline: Traditional strategy (same model & data regime).</span>
                        <span>Scale: 0%–200% (full bar = 200%).</span>
                        <span>Counts/Time: smaller bar → reduction vs. baseline (badge shows % saved).</span>
                        <span>Accuracy: larger bar → improvement (badge shows gain).</span>
                        <span>Striped overlay = exceeds 300% scale cap.</span>
                    </p>
                `;

                container.appendChild(comparisonSection);

                return container;
            }

            // Main processing function
            const processAndDisplay = () => {
                const scenario = scenarioSelect.value;
                const strategy = getCurrentStrategy();
                const modelSize = modelSizeSelect.value;
                const dataRegime = dataRegimeSelect.value;
                
                updateStrategyVisuals();

                // Calculate metrics
                const metrics = calculateMetrics(scenario, strategy, modelSize, dataRegime);
                const baseline = calculateMetrics(scenario, 'traditional', modelSize, dataRegime);
                
                // Clear previous results
                output.innerHTML = '';
                
                // Create and display results
                const resultsChart = createPerformanceChart(metrics, baseline);
                output.appendChild(resultsChart);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        Scenario: ${metrics.scenario.name} | 
                        Strategy: ${metrics.strategy.name} | 
                        Model: ${modelSize} (${metrics.totalParams.toFixed(1)}B params) | 
                        Data: ${dataRegimes[dataRegime].description}
                    `;
                }

                // Update explanation
                updateExplanation(metrics);
            };

            // Update the educational explanation
            function updateExplanation(metrics) {
                if (!explanation) return;

                const strategy = metrics.strategy;
                const scenario = metrics.scenario;

                let explanationText = `
                    <div class="space-y-3">
                        <div class="bg-white p-4 rounded-lg border">
                            <h6 class="font-semibold text-gray-900 mb-2">🎯 ${strategy.name} for ${scenario.name}</h6>
                            <p class="text-sm text-gray-700 mb-3">${strategy.description}</p>
                            
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <div class="font-medium text-green-900 mb-1">✅ Advantages:</div>
                                    <ul class="text-xs text-green-700 space-y-1">
                                        ${strategy.pros.map(pro => `<li>• ${pro}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <div class="font-medium text-red-900 mb-1">⚠️ Considerations:</div>
                                    <ul class="text-xs text-red-700 space-y-1">
                                        ${strategy.cons.map(con => `<li>• ${con}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 p-3 rounded border border-blue-200">
                            <h6 class="font-medium text-blue-900 mb-2">📈 Key Performance Insights</h6>
                            <div class="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                                <div>
                                    <strong>Efficiency Score:</strong> ${metrics.efficiency.toFixed(2)}/10<br/>
                                    <strong>Memory Usage:</strong> ${metrics.memoryUsage.toFixed(1)}B parameters<br/>
                                    <strong>Data Requirement:</strong> ${metrics.dataRequirement.toFixed(1)}M samples
                                </div>
                                <div>
                                    <strong>Primary Challenge:</strong> ${scenario.primaryChallenge}<br/>
                                    <strong>Unified Advantage:</strong> ${scenario.unifiedAdvantage || ''}<br/>
                                    <strong>Modality Count:</strong> ${scenario.modalities.length} modalities
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Add strategy-specific insights
                if (getCurrentStrategy() === 'unified') {
                    explanationText += `
                        <div class="bg-green-50 p-3 rounded border border-green-200">
                            <h6 class="font-medium text-green-900 mb-2">🔮 Unified Transformer Key Characteristics</h6>
                            <div class="text-sm text-green-800 space-y-1">
                                <div>• <strong>Unified Tokenization:</strong> All modalities mapped to a shared token or embedding space</div>
                                <div>• <strong>Cross-Modal Attention:</strong> Interleaved attention enables early semantic exchange</div>
                                <div>• <strong>Parameter Sharing:</strong> Reduces redundancy versus siloed encoders</div>
                                <div>• <strong>Joint Training:</strong> Simultaneous optimization leverages cross-modal signals</div>
                            </div>
                        </div>
                    `;
                } else if (getCurrentStrategy() === 'traditional') {
                    explanationText += `
                        <div class="bg-red-50 p-3 rounded border border-red-200">
                            <h6 class="font-medium text-red-900 mb-2">⚠️ Traditional Approach Limitations</h6>
                            <div class="text-sm text-red-800 space-y-1">
                                <div>• <strong>Parameter Bloat:</strong> ${strategy.parameterMultiplier}x more parameters than unified approach</div>
                                <div>• <strong>Late Fusion:</strong> Limited cross-modal learning opportunities</div>
                                <div>• <strong>Sequential Training:</strong> Can't leverage cross-modal signals during pre-training</div>
                                <div>• <strong>Memory Intensive:</strong> Higher computational requirements</div>
                            </div>
                        </div>
                    `;
                }

                explanationText += `</div>`;
                explanation.innerHTML = explanationText;
            }

            // Example cycling functionality
            const examples = [
                { 
                    scenario: 'video-understanding', 
                    strategy: 'gemini', 
                    modelSize: 'medium', 
                    dataRegime: 'self-supervised',
                    note: 'Video: Unified vs Traditional'
                },
                { 
                    scenario: 'medical-diagnosis', 
                    strategy: 'traditional', 
                    modelSize: 'large', 
                    dataRegime: 'supervised',
                    note: 'Medical AI: Traditional Approach'
                },
                { 
                    scenario: 'conversational-ai', 
                    strategy: 'hybrid', 
                    modelSize: 'medium', 
                    dataRegime: 'contrastive',
                    note: 'Conversational AI: Hybrid Strategy'
                },
                { 
                    scenario: 'creative-content', 
                    strategy: 'unified', 
                    modelSize: 'ultra', 
                    dataRegime: 'mixed',
                    note: 'Creative AI: Unified Ultra'
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex];
                    scenarioSelect.value = example.scenario;
                    modelSizeSelect.value = example.modelSize;
                    dataRegimeSelect.value = example.dataRegime;
                    
                    const strategyRadio = document.querySelector(`input[name="q33-strategy"][value="${example.strategy}"]`);
                    if (strategyRadio) {
                        strategyRadio.checked = true;
                    }
                    
                    processAndDisplay();
                    
                    exampleBtn.textContent = example.note;
                    exampleIndex = (exampleIndex + 1) % examples.length;
                });
            }

            // Event listeners
            scenarioSelect.addEventListener('change', processAndDisplay);
            modelSizeSelect.addEventListener('change', processAndDisplay);
            dataRegimeSelect.addEventListener('change', processAndDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            updateStrategyVisuals();
            processAndDisplay();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question33Interactive = interactiveScript;
}
