const interactiveScript = () => {
            // Get DOM elements
            const modelSize = document.getElementById('q18-model-size');
            const datasetSize = document.getElementById('q18-dataset-size');
            const epochsSlider = document.getElementById('q18-epochs');
            const epochsValue = document.getElementById('q18-epochs-value');
            const l2RegCheck = document.getElementById('q18-l2-reg');
            const dropoutCheck = document.getElementById('q18-dropout');
            const earlyStopCheck = document.getElementById('q18-early-stop');
            
            // New slider elements
            const l2Strength = document.getElementById('l2-strength');
            const l2Value = document.getElementById('l2-value');
            const dropoutRate = document.getElementById('dropout-rate');
            const dropoutValue = document.getElementById('dropout-value');
            const dropoutPercent = document.getElementById('dropout-percent');
            const earlyStopPatience = document.getElementById('early-stop-patience');
            const patienceValue = document.getElementById('patience-value');
            
            const simulateBtn = document.getElementById('q18-simulate-btn');
            const scenarioOverfit = document.getElementById('q18-scenario-overfit');
            const scenarioBalanced = document.getElementById('q18-scenario-balanced');
            const output = document.getElementById('q18-output');
            const legend = document.getElementById('q18-legend');
            const explanation = document.getElementById('q18-explanation');
            const metrics = document.getElementById('q18-metrics');
            const indicator = document.getElementById('q18-overfitting-indicator');

            if (!modelSize || !output || !explanation) return;

            // Accessibility: announce updates
            if (indicator) indicator.setAttribute('aria-live', 'polite');
            if (metrics) metrics.setAttribute('aria-live', 'polite');

            // Model configurations
            const modelConfigs = {
                small: { params: '1M', complexity: 1, name: 'Small Model' },
                medium: { params: '10M', complexity: 2, name: 'Medium Model' },
                large: { params: '100M', complexity: 4, name: 'Large Model' },
                xlarge: { params: '1B', complexity: 8, name: 'XLarge Model' }
            };

            const datasetConfigs = {
                tiny: { samples: '1K', size: 1, name: 'Tiny Dataset' },
                small: { samples: '10K', size: 2, name: 'Small Dataset' },
                medium: { samples: '100K', size: 4, name: 'Medium Dataset' },
                large: { samples: '1M', size: 8, name: 'Large Dataset' }
            };

            // Update epochs display
            const updateEpochsDisplay = () => {
                epochsValue.textContent = `${epochsSlider.value} epochs`;
            };
            
            // Update slider displays
            const updateSliderDisplays = () => {
                if (l2Strength && l2Value) {
                    // show up to 3 decimals for lambda
                    const v = parseFloat(l2Strength.value);
                    l2Value.textContent = isNaN(v) ? l2Strength.value : v.toFixed(3);
                }
                if (dropoutRate && dropoutValue && dropoutPercent) {
                    dropoutValue.textContent = dropoutRate.value;
                    dropoutPercent.textContent = Math.round(dropoutRate.value * 100);
                }
                if (earlyStopPatience && patienceValue) {
                    patienceValue.textContent = earlyStopPatience.value;
                }
            };

            // Enable/disable slider helper with visual cue
            const setSliderEnabled = (el, enabled) => {
                if (!el) return;
                el.disabled = !enabled;
                el.classList.toggle('opacity-50', !enabled);
                el.classList.toggle('cursor-not-allowed', !enabled);
                el.classList.toggle('opacity-100', enabled);
                el.classList.toggle('cursor-pointer', enabled);
                el.setAttribute('aria-disabled', String(!enabled));
            };

            // Update checkbox visual states
            const updateCheckboxStates = () => {
                // Get status elements
                const l2Status = document.getElementById('l2-status');
                const dropoutStatus = document.getElementById('dropout-status');
                const earlyStopStatus = document.getElementById('early-stop-status');

                // L2 Regularization
                const l2Card = l2RegCheck.parentElement.querySelector('div');
                if (l2RegCheck.checked) {
                    l2Card.classList.remove('border-green-200', 'bg-green-50');
                    l2Card.classList.add('border-green-500', 'bg-green-100', 'ring-2', 'ring-green-300');
                    l2Card.querySelector('.font-medium').innerHTML = '✅ L2 Regularization <span class="text-xs font-bold text-green-600">(ENABLED)</span>';
                    if (l2Status) l2Status.innerHTML = '<span class="mr-2">✅</span> L2 Regularization: <strong class="text-green-600">ON</strong>';
                } else {
                    l2Card.classList.remove('border-green-500', 'bg-green-100', 'ring-2', 'ring-green-300');
                    l2Card.classList.add('border-green-200', 'bg-green-50');
                    l2Card.querySelector('.font-medium').innerHTML = '⭕ L2 Regularization <span class="text-xs text-gray-500">(DISABLED)</span>';
                    if (l2Status) l2Status.innerHTML = '<span class="mr-2">❌</span> L2 Regularization: <strong class="text-gray-500">OFF</strong>';
                }
                setSliderEnabled(l2Strength, l2RegCheck.checked);

                // Dropout
                const dropoutCard = dropoutCheck.parentElement.querySelector('div');
                if (dropoutCheck.checked) {
                    dropoutCard.classList.remove('border-purple-200', 'bg-purple-50');
                    dropoutCard.classList.add('border-purple-500', 'bg-purple-100', 'ring-2', 'ring-purple-300');
                    dropoutCard.querySelector('.font-medium').innerHTML = '✅ Dropout <span class="text-xs font-bold text-purple-600">(ENABLED)</span>';
                    if (dropoutStatus) dropoutStatus.innerHTML = '<span class="mr-2">✅</span> Dropout: <strong class="text-purple-600">ON</strong>';
                } else {
                    dropoutCard.classList.remove('border-purple-500', 'bg-purple-100', 'ring-2', 'ring-purple-300');
                    dropoutCard.classList.add('border-purple-200', 'bg-purple-50');
                    dropoutCard.querySelector('.font-medium').innerHTML = '⭕ Dropout <span class="text-xs text-gray-500">(DISABLED)</span>';
                    if (dropoutStatus) dropoutStatus.innerHTML = '<span class="mr-2">❌</span> Dropout: <strong class="text-gray-500">OFF</strong>';
                }
                setSliderEnabled(dropoutRate, dropoutCheck.checked);

                // Early Stopping
                const earlyStopCard = earlyStopCheck.parentElement.querySelector('div');
                if (earlyStopCheck.checked) {
                    earlyStopCard.classList.remove('border-orange-200', 'bg-orange-50');
                    earlyStopCard.classList.add('border-orange-500', 'bg-orange-100', 'ring-2', 'ring-orange-300');
                    earlyStopCard.querySelector('.font-medium').innerHTML = '✅ Early Stopping <span class="text-xs font-bold text-orange-600">(ENABLED)</span>';
                    if (earlyStopStatus) earlyStopStatus.innerHTML = '<span class="mr-2">✅</span> Early Stopping: <strong class="text-orange-600">ON</strong>';
                } else {
                    earlyStopCard.classList.remove('border-orange-500', 'bg-orange-100', 'ring-2', 'ring-orange-300');
                    earlyStopCard.classList.add('border-orange-200', 'bg-orange-50');
                    earlyStopCard.querySelector('.font-medium').innerHTML = '⭕ Early Stopping <span class="text-xs text-gray-500">(DISABLED)</span>';
                    if (earlyStopStatus) earlyStopStatus.innerHTML = '<span class="mr-2">❌</span> Early Stopping: <strong class="text-gray-500">OFF</strong>';
                }
                setSliderEnabled(earlyStopPatience, earlyStopCheck.checked);
            };

            // Simulate training with overfitting analysis
            const simulateTraining = () => {
                const modelConfig = modelConfigs[modelSize.value];
                const dataConfig = datasetConfigs[datasetSize.value];
                const epochs = parseInt(epochsSlider.value);
                const hasL2 = l2RegCheck.checked;
                const hasDropout = dropoutCheck.checked;
                const hasEarlyStop = earlyStopCheck.checked;

                // Calculate overfitting risk
                const modelComplexity = modelConfig.complexity;
                const dataAmount = dataConfig.size;
                const complexityRatio = modelComplexity / dataAmount;
                
                // Base overfitting tendency (make it more dramatic)
                let overfittingRisk = Math.min(complexityRatio * 0.6, 1.5); // Increased base risk
                
                // Get actual values from sliders (with null checks)
                const l2Lambda = hasL2 && l2Strength ? parseFloat(l2Strength.value) : 0;
                const dropoutRateValue = hasDropout && dropoutRate ? parseFloat(dropoutRate.value) : 0;
                const patience = hasEarlyStop && earlyStopPatience ? parseInt(earlyStopPatience.value) : 5;
                
                // Apply regularization effects with much more dramatic impact
                // Handle individual effects separately to make each visible
                let l2Effect = 0;
                let dropoutEffect = 0;
                
                if (hasL2) {
                    // L2 can reduce overfitting by up to 80% with strong regularization
                    l2Effect = Math.min(l2Lambda * 16, 0.8); // Slightly reduced to leave room for dropout
                    overfittingRisk *= (1 - l2Effect);
                }
                if (hasDropout) {
                    // Dropout can reduce overfitting by up to 85% with high dropout rate
                    dropoutEffect = Math.min(dropoutRateValue * 1.1, 0.85); // Strong but not overwhelming
                    overfittingRisk *= (1 - dropoutEffect);
                }
                if (hasEarlyStop) {
                    overfittingRisk *= 0.7; // Early stopping provides more significant reduction
                }
                
                // Ensure minimum overfitting for visibility
                overfittingRisk = Math.max(overfittingRisk, 0.02);

                // Generate training curves with proper early stopping logic
                const trainLosses = [];
                const valLosses = [];
                let earlyStopEpoch = epochs; // Default to full training
                let bestValLoss = Infinity;
                let patienceCounter = 0;

                for (let i = 0; i < epochs; i++) {
                    // Training loss decreases consistently (but affected by regularization)
                    let trainLoss = Math.max(0.05, 2.5 * Math.exp(-i * 0.12) + Math.random() * 0.03);
                    
                    // L2 regularization makes training slower but more stable
                    if (hasL2) {
                        trainLoss += l2Lambda * 0.5; // L2 penalty increases training loss
                    }
                    
                    // Dropout also affects training dynamics
                    if (hasDropout) {
                        // Dropout makes training more noisy and initially slower
                        trainLoss += dropoutRateValue * 0.3; // Dropout increases training loss
                        trainLoss += Math.random() * dropoutRateValue * 0.1; // More noise with higher dropout
                    }
                    
                    trainLosses.push(trainLoss);

                    // Validation loss with dramatic overfitting patterns
                    let valLoss;
                    if (i < 2) {
                        // Initial improvement phase
                        valLoss = trainLoss + 0.1 + Math.random() * 0.03;
                    } else {
                        // Overfitting behavior depends heavily on regularization
                        const overfitStartEpoch = Math.max(2, 12 - overfittingRisk * 8);
                        
                        if (i < overfitStartEpoch) {
                            // Still improving - regularization helps maintain this phase longer
                            let baseValLoss = trainLoss + 0.1 + Math.random() * 0.03;
                            
                            // Dropout adds some beneficial noise during training
                            if (hasDropout) {
                                baseValLoss -= dropoutRateValue * 0.05; // Dropout slightly improves early validation
                            }
                            
                            valLoss = baseValLoss;
                        } else {
                            // Overfitting phase - dramatic differences based on regularization
                            const overfitProgress = (i - overfitStartEpoch) / (epochs - overfitStartEpoch);
                            
                            // Much more dramatic overfitting without regularization
                            let overfitMultiplier = 1.0;
                            if (overfittingRisk > 0.5) overfitMultiplier = 3.0; // High overfitting
                            else if (overfittingRisk > 0.2) overfitMultiplier = 1.8; // Moderate overfitting  
                            else overfitMultiplier = 1.1; // Well regularized
                            
                            // Dropout provides additional noise reduction in validation
                            if (hasDropout) {
                                overfitMultiplier *= (1 - dropoutRateValue * 0.5); // Dropout reduces validation overfitting
                            }
                            
                            const overfitIncrease = overfittingRisk * overfitProgress * overfitMultiplier;
                            valLoss = trainLoss + 0.1 + overfitIncrease + Math.random() * 0.03;
                        }
                    }
                    
                    valLoss = Math.max(0.05, valLoss);
                    valLosses.push(valLoss);

                    // Early stopping logic
                    if (hasEarlyStop) {
                        if (valLoss < bestValLoss) {
                            bestValLoss = valLoss;
                            patienceCounter = 0;
                        } else {
                            patienceCounter++;
                        }

                        // Stop if patience exceeded and we're past minimum epochs
                        if (patienceCounter >= patience && i > 8) {
                            earlyStopEpoch = i + 1;
                            break;
                        }
                    }
                }

                // Trim arrays to actual training length
                const actualTrainLosses = trainLosses.slice(0, earlyStopEpoch);
                const actualValLosses = valLosses.slice(0, earlyStopEpoch);

                // Update indicator
                const finalGap = actualValLosses[actualValLosses.length - 1] - actualTrainLosses[actualTrainLosses.length - 1];
                const overfitLevel = finalGap > 0.5 ? 'High Overfitting' : 
                                   finalGap > 0.2 ? 'Moderate Overfitting' : 'Good Generalization';
                const indicatorColor = finalGap > 0.5 ? 'red' : 
                                      finalGap > 0.2 ? 'yellow' : 'green';
                
                indicator.textContent = overfitLevel;
                const colorClassMap = {
                    red: 'bg-red-100 text-red-700',
                    yellow: 'bg-yellow-100 text-yellow-700',
                    green: 'bg-green-100 text-green-700'
                };
                indicator.className = `text-xs ${colorClassMap[indicatorColor] || 'bg-gray-100 text-gray-700'} px-2 py-1 rounded font-medium`;

                // Visualize results
                visualizeTrainingResults(actualTrainLosses, actualValLosses, earlyStopEpoch, epochs, overfittingRisk, hasL2, hasDropout, hasEarlyStop, l2Lambda, dropoutRateValue, patience);
                updateMetrics(modelConfig, dataConfig, finalGap, earlyStopEpoch, epochs);
                updateExplanation(finalGap, hasL2, hasDropout, hasEarlyStop, complexityRatio, earlyStopEpoch, epochs);
            };

            // Visualize training results
            const visualizeTrainingResults = (trainLosses, valLosses, actualEpochs, plannedEpochs, overfittingRisk, hasL2, hasDropout, hasEarlyStop, l2Lambda = 0.01, dropoutRateValue = 0.3, patience = 5) => {
                const container = document.createElement('div');
                container.className = 'space-y-4';

                // Loss curves
                const chartDiv = document.createElement('div');
            chartDiv.innerHTML = `
                    <h5 class="font-medium text-gray-900 mb-2">📉 Training vs Validation Loss</h5>
                    <div class="relative bg-white border rounded p-4 h-48">
            <svg viewBox="0 0 400 150" class="w-full h-full" role="img" aria-label="Line chart showing training and validation loss across epochs">
                            <!-- Grid lines -->
                            ${[0, 1, 2, 3, 4].map(i => `
                                <line x1="0" y1="${30 * i + 10}" x2="400" y2="${30 * i + 10}" stroke="#f3f4f6" stroke-width="1"/>
                                <line x1="${80 * i}" y1="10" x2="${80 * i}" y2="130" stroke="#f3f4f6" stroke-width="1"/>
                            `).join('')}
                            
                            <!-- Training loss line -->
                    <polyline points="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return trainLosses.map((loss, i) => `${(i / denom) * 380 + 10},${130 - Math.min(loss * 40, 100)}`).join(' '); })()}" 
                                     fill="none" stroke="#3b82f6" stroke-width="2"/>
                            
                            <!-- Validation loss line -->
                    <polyline points="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return valLosses.map((loss, i) => `${(i / denom) * 380 + 10},${130 - Math.min(loss * 40, 100)}`).join(' '); })()}" 
                                     fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,5"/>
                            
                            <!-- Early stopping line (only if actually stopped early) -->
                            ${hasEarlyStop && actualEpochs < plannedEpochs ? `
                      <line x1="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return ((actualEpochs - 1) / denom) * 380 + 10; })()}" y1="10" 
                          x2="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return ((actualEpochs - 1) / denom) * 380 + 10; })()}" y2="130" 
                                      stroke="#f97316" stroke-width="2" stroke-dasharray="3,3"/>
                      <text x="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return ((actualEpochs - 1) / denom) * 380 + 15; })()}" y="25" fill="#f97316" font-size="10">
                                    Early Stop (${actualEpochs})
                                </text>
                            ` : ''}
                            
                            <!-- Axis labels -->
                            <text x="10" y="145" fill="#6b7280" font-size="10">0</text>
                            <text x="390" y="145" fill="#6b7280" font-size="10">${plannedEpochs}</text>
                            <text x="200" y="145" fill="#6b7280" font-size="10">Epochs</text>
                            
                            <text x="5" y="130" fill="#6b7280" font-size="10">0</text>
                            <text x="5" y="15" fill="#6b7280" font-size="10">3</text>
                            <text x="5" y="75" fill="#6b7280" font-size="10">Loss</text>
                        </svg>
                    </div>
                `;

                // Regularization effects
                const effectsDiv = document.createElement('div');
                
                // Calculate reduction percentages safely (matching new effects)
                const l2Reduction = hasL2 ? Math.round(Math.min(l2Lambda * 16, 0.8) * 100) : 0; // Up to 80% reduction
                const dropoutReduction = hasDropout ? Math.round(Math.min(dropoutRateValue * 1.1, 0.85) * 100) : 0; // Up to 85% reduction
                
                effectsDiv.innerHTML = `
                    <h5 class="font-medium text-gray-900 mb-2">🛡️ Active Regularization Effects</h5>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div class="p-3 rounded ${hasL2 ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}">
                            <div class="font-medium ${hasL2 ? 'text-green-800' : 'text-gray-600'}">L2 Regularization</div>
                            <div class="text-xs ${hasL2 ? 'text-green-700' : 'text-gray-500'} mt-1">
                                ${hasL2 ? `✅ lambda = ${l2Lambda} weight decay` : '❌ Not applied'}
                            </div>
                            ${hasL2 ? `<div class="text-xs text-green-600 mt-1">~${l2Reduction}% overfitting reduction</div>` : ''}
                        </div>
                        
                        <div class="p-3 rounded ${hasDropout ? 'bg-purple-100 border border-purple-300' : 'bg-gray-100 border border-gray-300'}">
                            <div class="font-medium ${hasDropout ? 'text-purple-800' : 'text-gray-600'}">Dropout</div>
                            <div class="text-xs ${hasDropout ? 'text-purple-700' : 'text-gray-500'} mt-1">
                                ${hasDropout ? `✅ ${Math.round(dropoutRateValue * 100)}% neurons disabled` : '❌ Not applied'}
                            </div>
                            ${hasDropout ? `<div class="text-xs text-purple-600 mt-1">~${dropoutReduction}% overfitting reduction</div>` : ''}
                        </div>
                        
                        <div class="p-3 rounded ${hasEarlyStop ? 'bg-orange-100 border border-orange-300' : 'bg-gray-100 border border-gray-300'}">
                            <div class="font-medium ${hasEarlyStop ? 'text-orange-800' : 'text-gray-600'}">Early Stopping</div>
                            <div class="text-xs ${hasEarlyStop ? 'text-orange-700' : 'text-gray-500'} mt-1">
                                ${hasEarlyStop ? `✅ Patience: ${patience} epochs` : '❌ Not applied'}
                            </div>
                            ${hasEarlyStop && actualEpochs < plannedEpochs ? 
                                `<div class="text-xs text-orange-600 mt-1">Stopped at epoch ${actualEpochs}/${plannedEpochs}</div>` : 
                                hasEarlyStop ? '<div class="text-xs text-orange-600 mt-1">No early stop needed</div>' : ''}
                        </div>
                    </div>
                `;

                container.appendChild(chartDiv);
                container.appendChild(effectsDiv);
                output.innerHTML = '';
                output.appendChild(container);

                // Legend
                legend.innerHTML = `
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-1 bg-blue-500 rounded"></div>
                            <span>Training Loss</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-1 bg-red-500 rounded border-dashed border-2 border-red-500"></div>
                            <span>Validation Loss</span>
                        </div>
                        ${hasEarlyStop && actualEpochs < plannedEpochs ? `
                            <div class="flex items-center space-x-2">
                                <div class="w-4 h-1 bg-orange-500 rounded border-dashed border-2 border-orange-500"></div>
                                <span>Early Stopping (Epoch ${actualEpochs})</span>
                            </div>
                        ` : ''}
                    </div>
                `;
            };

            // Update performance metrics
            const updateMetrics = (modelConfig, dataConfig, generalizationGap, actualEpochs, plannedEpochs) => {
                const finalTrainLoss = 0.2 + Math.random() * 0.1;
                const finalValLoss = finalTrainLoss + generalizationGap;

                const gapBg = generalizationGap > 0.5 ? 'bg-red-100' : generalizationGap > 0.2 ? 'bg-yellow-100' : 'bg-green-100';
                const gapTitle = generalizationGap > 0.5 ? 'text-red-900' : generalizationGap > 0.2 ? 'text-yellow-900' : 'text-green-900';
                const gapText = generalizationGap > 0.5 ? 'text-red-700' : generalizationGap > 0.2 ? 'text-yellow-700' : 'text-green-700';

                metrics.innerHTML = `
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <div class="font-medium text-blue-900">Model Configuration</div>
                            <div class="text-blue-700 text-sm">
                                ${modelConfig.name} (${modelConfig.params}) on ${dataConfig.name} (${dataConfig.samples})
                            </div>
                        </div>
                        <div>
                            <div class="font-medium text-blue-900">Training Duration</div>
                            <div class="text-blue-700 text-sm">
                                ${actualEpochs}/${plannedEpochs} epochs
                                ${actualEpochs < plannedEpochs ? '(Early stopped)' : '(Completed)'}
                            </div>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-3 gap-4 mt-3">
                        <div class="bg-blue-100 p-2 rounded">
                            <div class="font-medium text-blue-900">Final Training Loss</div>
                            <div class="text-blue-700 text-lg">${finalTrainLoss.toFixed(3)}</div>
                        </div>
                        <div class="bg-red-100 p-2 rounded">
                            <div class="font-medium text-red-900">Final Validation Loss</div>
                            <div class="text-red-700 text-lg">${finalValLoss.toFixed(3)}</div>
                        </div>
                        <div class="${gapBg} p-2 rounded">
                            <div class="font-medium ${gapTitle}">Generalization Gap</div>
                            <div class="${gapText} text-lg">${generalizationGap.toFixed(3)}</div>
                        </div>
                    </div>
                    <div class="mt-2 text-blue-600 text-xs">
                        ${generalizationGap > 0.5 ? '⚠️ High overfitting detected - large gap between training and validation loss' :
                          generalizationGap > 0.2 ? '⚠️ Moderate overfitting - consider more regularization' :
                          '✅ Good generalization - training and validation losses are close'}
                    </div>
                `;
            };

            // Update educational explanation
            const updateExplanation = (overfittingRisk, hasL2, hasDropout, hasEarlyStop, complexityRatio) => {
                let explanationText = '';
                
                if (overfittingRisk > 0.7) {
                    explanationText = `
                        <strong>High Overfitting Risk Detected:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li>Model complexity is too high relative to available data (ratio: ${complexityRatio.toFixed(2)})</li>
                            <li>The model is likely memorizing training patterns rather than learning generalizable features</li>
                            <li>Validation loss increases while training loss continues to decrease</li>
                            <li><strong>Recommendations:</strong> Apply more regularization, reduce model size, or increase dataset size</li>
                        </ul>
                    `;
                } else if (overfittingRisk > 0.4) {
                    explanationText = `
                        <strong>Moderate Overfitting:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li>Some overfitting is occurring but current regularization is helping</li>
                            <li>Training and validation curves are diverging moderately</li>
                            <li>Model performance could be improved with additional regularization</li>
                            <li><strong>Status:</strong> Acceptable but could be optimized further</li>
                        </ul>
                    `;
                } else {
                    explanationText = `
                        <strong>Good Generalization:</strong>
                        <ul class="mt-2 space-y-1 list-disc list-inside">
                            <li>Training and validation losses remain close throughout training</li>
                            <li>Effective regularization is preventing overfitting</li>
                            <li>Model is learning generalizable patterns rather than memorizing</li>
                            <li><strong>Status:</strong> Well-regularized model with good generalization</li>
                        </ul>
                    `;
                }

                // Add technique analysis
                const techniques = [];
                if (hasL2) techniques.push('L2 regularization penalizing large weights');
                if (hasDropout) techniques.push('Dropout forcing robust feature learning');
                if (hasEarlyStop) techniques.push('Early stopping preventing overtraining');

                if (techniques.length > 0) {
                    explanationText += `
                        <div class="mt-3 pt-2 border-t border-yellow-300">
                            <strong>Active Regularization:</strong> ${techniques.join(', ')}.
                        </div>
                    `;
                }

                explanation.innerHTML = explanationText;
            };

            // Preset scenarios
            const loadOverfittingScenario = () => {
                modelSize.value = 'large';
                datasetSize.value = 'tiny';
                epochsSlider.value = '50';
                l2RegCheck.checked = false;
                dropoutCheck.checked = false;
                earlyStopCheck.checked = false;
                updateEpochsDisplay();
                updateCheckboxStates();
                updateSliderDisplays();
                simulateTraining();
            };

            const loadBalancedScenario = () => {
                modelSize.value = 'medium';
                datasetSize.value = 'medium';
                epochsSlider.value = '25';
                l2RegCheck.checked = true;
                dropoutCheck.checked = true;
                earlyStopCheck.checked = true;
                if (l2Strength) l2Strength.value = '0.020';
                if (dropoutRate) dropoutRate.value = '0.4';
                if (earlyStopPatience) earlyStopPatience.value = '7';
                updateEpochsDisplay();
                updateCheckboxStates();
                updateSliderDisplays();
                simulateTraining();
            };

            // Event listeners
            epochsSlider.addEventListener('input', updateEpochsDisplay);
            
            // Slider event listeners
            if (l2Strength) l2Strength.addEventListener('input', updateSliderDisplays);
            if (dropoutRate) dropoutRate.addEventListener('input', updateSliderDisplays);
            if (earlyStopPatience) earlyStopPatience.addEventListener('input', updateSliderDisplays);
            
            simulateBtn.addEventListener('click', simulateTraining);
            scenarioOverfit.addEventListener('click', loadOverfittingScenario);
            scenarioBalanced.addEventListener('click', loadBalancedScenario);

            // Checkbox event listeners
            [l2RegCheck, dropoutCheck, earlyStopCheck].forEach(checkbox => {
                checkbox.addEventListener('change', updateCheckboxStates);
            });

            // Initial setup
            updateEpochsDisplay();
            updateSliderDisplays();
            updateCheckboxStates();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question18Interactive = interactiveScript;
}
