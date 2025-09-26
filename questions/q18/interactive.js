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
            const setSliderEnabled = (slider, enabled) => {
                if (!slider) return;
                slider.disabled = !enabled;
                slider.setAttribute('aria-disabled', String(!enabled));
                slider.classList.toggle('q18-slider--disabled', !enabled);
            };

            const updateTechniqueState = ({ checkbox, slider, statusId, statusChipId }) => {
                const technique = checkbox?.closest('.q18-technique');
                const statusRow = document.getElementById(statusId);
                const statusChip = document.getElementById(statusChipId);
                const enabled = Boolean(checkbox?.checked);

                if (technique) {
                    technique.dataset.enabled = enabled ? 'true' : 'false';
                }

                setSliderEnabled(slider, enabled);

                if (statusChip) {
                    statusChip.textContent = enabled ? 'On' : 'Off';
                    statusChip.className = 'chip ' + (enabled ? 'chip-success' : 'chip-neutral') + ' small-caption q18-technique-status';
                }

                if (statusRow) {
                    const label = statusRow.dataset.label || 'Technique';
                    statusRow.dataset.state = enabled ? 'on' : 'off';
                                        statusRow.innerHTML = `${enabled ? '' : ''} ${label}: <strong>${enabled ? 'On' : 'Off'}</strong>`;
                }
            };

            // Update checkbox visual states
            const updateCheckboxStates = () => {
                updateTechniqueState({
                    checkbox: l2RegCheck,
                    slider: l2Strength,
                    statusId: 'l2-status',
                    statusChipId: 'l2-status-chip'
                });
                updateTechniqueState({
                    checkbox: dropoutCheck,
                    slider: dropoutRate,
                    statusId: 'dropout-status',
                    statusChipId: 'dropout-status-chip'
                });
                updateTechniqueState({
                    checkbox: earlyStopCheck,
                    slider: earlyStopPatience,
                    statusId: 'early-stop-status',
                    statusChipId: 'early-stop-status-chip'
                });
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
                const indicatorClassMap = {
                    red: 'chip chip-warning small-caption q18-indicator',
                    yellow: 'chip chip-warning small-caption q18-indicator',
                    green: 'chip chip-success small-caption q18-indicator'
                };
                indicator.className = indicatorClassMap[indicatorColor] || 'chip chip-neutral small-caption q18-indicator';
// Visualize results
                visualizeTrainingResults(actualTrainLosses, actualValLosses, earlyStopEpoch, epochs, overfittingRisk, hasL2, hasDropout, hasEarlyStop, l2Lambda, dropoutRateValue, patience);
                updateMetrics(modelConfig, dataConfig, finalGap, earlyStopEpoch, epochs);
                updateExplanation(finalGap, hasL2, hasDropout, hasEarlyStop, complexityRatio, earlyStopEpoch, epochs);
            };

            // Visualize training results
            const visualizeTrainingResults = (trainLosses, valLosses, actualEpochs, plannedEpochs, overfittingRisk, hasL2, hasDropout, hasEarlyStop, l2Lambda = 0.01, dropoutRateValue = 0.3, patience = 5) => {
                const container = document.createElement('div');
                container.className = 'q18-results';

                const chartDiv = document.createElement('div');
                chartDiv.className = 'q18-chart panel panel-neutral-soft';
                chartDiv.innerHTML = `
                    <h5 class="q18-section-title"> Training vs validation loss</h5>
                    <div class="q18-chart-surface">
                        <svg viewBox="0 0 400 150" class="q18-chart-svg" role="img" aria-label="Line chart showing training and validation loss across epochs">
                            ${[0, 1, 2, 3, 4].map(i => `
                                <line x1="0" y1="${30 * i + 10}" x2="400" y2="${30 * i + 10}" stroke="var(--q18-chart-grid)" stroke-width="1"/>
                                <line x1="${80 * i}" y1="10" x2="${80 * i}" y2="130" stroke="var(--q18-chart-grid)" stroke-width="1"/>
                            `).join('')}

                            <polyline points="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return trainLosses.map((loss, i) => `${(i / denom) * 380 + 10},${130 - Math.min(loss * 40, 100)}`).join(' '); })()}"
                                      fill="none" stroke="var(--q18-train-color)" stroke-width="2" stroke-linecap="round"/>

                            <polyline points="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return valLosses.map((loss, i) => `${(i / denom) * 380 + 10},${130 - Math.min(loss * 40, 100)}`).join(' '); })()}"
                                      fill="none" stroke="var(--q18-validation-color)" stroke-width="2" stroke-dasharray="5,5" stroke-linecap="round"/>

                            ${hasEarlyStop && actualEpochs < plannedEpochs ? `
                                <line x1="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return ((actualEpochs - 1) / denom) * 380 + 10; })()}" y1="10"
                                      x2="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return ((actualEpochs - 1) / denom) * 380 + 10; })()}" y2="130"
                                      stroke="var(--q18-earlystop-color)" stroke-width="2" stroke-dasharray="3,3"/>
                                <text x="${(() => { const denom = Math.max(plannedEpochs - 1, 1); return ((actualEpochs - 1) / denom) * 380 + 15; })()}" y="25" fill="var(--q18-earlystop-color)" font-size="10">
                                    Early stop (${actualEpochs})
                                </text>
                            ` : ''}

                            <text x="10" y="145" fill="var(--color-muted)" font-size="10">0</text>
                            <text x="390" y="145" fill="var(--color-muted)" font-size="10">${plannedEpochs}</text>
                            <text x="200" y="145" fill="var(--color-muted)" font-size="10">Epochs</text>

                            <text x="5" y="130" fill="var(--color-muted)" font-size="10">0</text>
                            <text x="5" y="15" fill="var(--color-muted)" font-size="10">3</text>
                            <text x="5" y="75" fill="var(--color-muted)" font-size="10">Loss</text>
                        </svg>
                    </div>
                `;

                const lambdaDisplay = hasL2 ? l2Lambda.toFixed(3) : null;
                const dropoutPercent = Math.round(dropoutRateValue * 100);
                const l2Reduction = hasL2 ? Math.round(Math.min(l2Lambda * 16, 0.8) * 100) : 0;
                const dropoutReduction = hasDropout ? Math.round(Math.min(dropoutRateValue * 1.1, 0.85) * 100) : 0;

                const effectsDiv = document.createElement('div');
                effectsDiv.className = 'q18-effect panel panel-neutral-soft';
                effectsDiv.innerHTML = `
                    <h5 class="q18-section-title"> Active regularization effects</h5>
                    <div class="q18-effect-grid">
                        <div class="q18-effect-card" data-tone="emerald" data-active="${hasL2}">
                            <div class="q18-effect-title">L2 regularization</div>
                            <p class="q18-effect-status">${hasL2 ? `  = ${lambdaDisplay} weight decay` : ' Not applied'}</p>
                            ${hasL2 ? `<p class="q18-effect-note">~${l2Reduction}% overfitting reduction</p>` : ''}
                        </div>
                        <div class="q18-effect-card" data-tone="purple" data-active="${hasDropout}">
                            <div class="q18-effect-title">Dropout</div>
                            <p class="q18-effect-status">${hasDropout ? ` ${dropoutPercent}% neurons disabled` : ' Not applied'}</p>
                            ${hasDropout ? `<p class="q18-effect-note">~${dropoutReduction}% overfitting reduction</p>` : ''}
                        </div>
                        <div class="q18-effect-card" data-tone="amber" data-active="${hasEarlyStop}">
                            <div class="q18-effect-title">Early stopping</div>
                            <p class="q18-effect-status">${hasEarlyStop ? ` Patience ${patience} epochs` : ' Not applied'}</p>
                            ${hasEarlyStop ? (actualEpochs < plannedEpochs ? `<p class="q18-effect-note">Stopped at epoch ${actualEpochs}/${plannedEpochs}</p>` : '<p class="q18-effect-note">No early stop triggered</p>') : ''}
                        </div>
                    </div>
                `;

                container.appendChild(chartDiv);
                container.appendChild(effectsDiv);

                output.innerHTML = '';
                output.appendChild(container);

                if (legend) {
                    legend.innerHTML = `
                        <div class="q18-legend-grid">
                            <div class="q18-legend-item">
                                <span class="q18-legend-swatch q18-legend-swatch--train"></span>
                                <span>Training loss</span>
                            </div>
                            <div class="q18-legend-item">
                                <span class="q18-legend-swatch q18-legend-swatch--validation"></span>
                                <span>Validation loss</span>
                            </div>
                            ${hasEarlyStop ? '<div class="q18-legend-item"><span class="q18-legend-swatch q18-legend-swatch--early"></span><span>Early stop point</span></div>' : ''}
                        </div>
                    `;
                }
            };

            // Update performance metrics
            const updateMetrics = (modelConfig, dataConfig, generalizationGap, actualEpochs, plannedEpochs) => {
                const finalTrainLoss = 0.2 + Math.random() * 0.1;
                const finalValLoss = finalTrainLoss + generalizationGap;
                const gapLevel = generalizationGap > 0.5 ? 'high' : generalizationGap > 0.2 ? 'medium' : 'low';

                const gapMessage = generalizationGap > 0.5
                    ? ' High overfitting detected  large gap between training and validation loss'
                    : generalizationGap > 0.2
                        ? ' Moderate overfitting  consider increasing regularization or reducing epochs'
                        : ' Good generalization  training and validation losses stay tightly coupled';

                metrics.innerHTML = `
                    <div class="q18-metric-summary">
                        <div>
                            <div class="q18-metric-label">Model configuration</div>
                            <p class="q18-metric-text">${modelConfig.name} (${modelConfig.params}) on ${dataConfig.name} (${dataConfig.samples})</p>
                        </div>
                        <div>
                            <div class="q18-metric-label">Training duration</div>
                            <p class="q18-metric-text">${actualEpochs}/${plannedEpochs} epochs ${actualEpochs < plannedEpochs ? '(early stopped)' : '(completed)'} </p>
                        </div>
                    </div>
                    <div class="q18-metric-grid">
                        <div class="q18-metric-card" data-tone="info">
                            <div class="q18-metric-title">Final training loss</div>
                            <div class="q18-metric-value">${finalTrainLoss.toFixed(3)}</div>
                        </div>
                        <div class="q18-metric-card" data-tone="alert">
                            <div class="q18-metric-title">Final validation loss</div>
                            <div class="q18-metric-value">${finalValLoss.toFixed(3)}</div>
                        </div>
                        <div class="q18-metric-card" data-tone="gap" data-level="${gapLevel}">
                            <div class="q18-metric-title">Generalization gap</div>
                            <div class="q18-metric-value">${generalizationGap.toFixed(3)}</div>
                        </div>
                    </div>
                    <div class="q18-metric-note" data-level="${gapLevel}">${gapMessage}</div>
                `;
            };

            // Update educational explanation
            const updateExplanation = (overfittingRisk, hasL2, hasDropout, hasEarlyStop, complexityRatio) => {
                let explanationText = '';
                let level = 'low';

                if (overfittingRisk > 0.7) {
                    level = 'high';
                    explanationText = `
                        <div class="q18-explanation-block">
                            <strong>High overfitting risk detected</strong>
                            <ul class="q18-explanation-list">
                                <li>Model complexity is too high relative to available data (ratio: ${complexityRatio.toFixed(2)})</li>
                                <li>Validation loss keeps climbing while training loss falls</li>
                                <li>Model is memorizing patterns instead of learning general features</li>
                                <li><strong>Action:</strong> Increase regularization, reduce model size, or add more data</li>
                            </ul>
                        </div>
                    `;
                } else if (overfittingRisk > 0.4) {
                    level = 'medium';
                    explanationText = `
                        <div class="q18-explanation-block">
                            <strong>Moderate overfitting</strong>
                            <ul class="q18-explanation-list">
                                <li>Training and validation curves are starting to diverge</li>
                                <li>Current regularization is helping but not eliminating the gap</li>
                                <li>Model could benefit from stronger regularization or fewer epochs</li>
                                <li><strong>Status:</strong> Acceptable but tune further for production use</li>
                            </ul>
                        </div>
                    `;
                } else {
                    level = 'low';
                    explanationText = `
                        <div class="q18-explanation-block">
                            <strong>Good generalization</strong>
                            <ul class="q18-explanation-list">
                                <li>Training and validation losses remain close throughout training</li>
                                <li>Existing regularization is preventing memorization</li>
                                <li>Model is learning reusable patterns rather than copying data</li>
                                <li><strong>Status:</strong> Well-balanced setup with healthy generalization</li>
                            </ul>
                        </div>
                    `;
                }

                const techniques = [];
                if (hasL2) techniques.push('L2 regularization penalizing large weights');
                if (hasDropout) techniques.push('Dropout forcing robust feature learning');
                if (hasEarlyStop) techniques.push('Early stopping preventing overtraining');

                if (techniques.length > 0) {
                    explanationText += `
                        <div class="q18-explanation-active">
                            <strong>Active regularization:</strong> ${techniques.join(', ')}.
                        </div>
                    `;
                }

                explanation.dataset.level = level;
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
