(function() {
  'use strict';

  // Model configurations based on paper data
  const MODEL_CONFIGS = [
    { params: 0.6, label: '600M', tokens: 12 },    // 600M * 20 = 12B tokens
    { params: 1.4, label: '1.4B', tokens: 28 },    // 1.4B * 20 = 28B tokens
    { params: 2.8, label: '2.8B', tokens: 56 },    // 2.8B * 20 = 56B tokens
    { params: 6.9, label: '6.9B', tokens: 138 },   // 6.9B * 20 = 138B tokens
    { params: 13, label: '13B', tokens: 260 }      // 13B * 20 = 260B tokens
  ];

  // Calculate attack success rate based on paper findings
  function calculateASR(poisonCount, learningRate, attackType) {
    // Base threshold from paper: ~250 docs for reliable success
    const baseThreshold = 250;
    
    // Learning rate effect: higher LR reduces poison requirement (Fig. 19)
    const lrMultiplier = learningRate / 3; // Normalized to 3e-4 baseline
    const effectiveThreshold = baseThreshold / Math.sqrt(lrMultiplier);
    
    // Attack type multipliers (DoS is baseline, harmful compliance slightly easier)
    const attackMultipliers = {
      dos: 1.0,
      harmful: 0.9,  // Slightly easier during fine-tuning
      language: 1.1  // Language switch slightly harder
    };
    const adjustedThreshold = effectiveThreshold * attackMultipliers[attackType];
    
    // Calculate success rate
    if (poisonCount < adjustedThreshold * 0.4) return 0; // Well below threshold
    if (poisonCount >= adjustedThreshold) return 92 + Math.random() * 6; // Saturated success (92-98%)
    
    // Smooth sigmoid curve between 40% and 100% of threshold
    const progress = (poisonCount - adjustedThreshold * 0.4) / (adjustedThreshold * 0.6);
    const sigmoid = 1 / (1 + Math.exp(-10 * (progress - 0.5)));
    return sigmoid * 95;
  }

  // Calculate perplexity increase for DoS attack
  function calculatePerplexity(asr) {
    if (asr < 10) return 0;
    // Paper shows 200-700 perplexity increase at success (Fig. 2)
    const basePPL = 450;
    const variance = 150;
    return (asr / 100) * (basePPL + (Math.random() - 0.5) * variance);
  }

  function init() {
    // Defensive DOM lookups
    const root = document.getElementById('p39-explorer');
    if (!root) {
      console.warn('p39-explorer not found, skipping initialization');
      return;
    }

    const poisonSlider = document.getElementById('p39-poison-count');
    const attackSelect = document.getElementById('p39-attack-type');
    const lrSlider = document.getElementById('p39-learning-rate');
    
    const poisonDisplay = document.getElementById('p39-poison-display');
    const lrDisplay = document.getElementById('p39-lr-display');
    
    const chartContainer = document.getElementById('p39-chart');
    const percentageView = document.getElementById('p39-percentage-view');
    const absoluteView = document.getElementById('p39-absolute-view');
    
    const asrDisplay = document.getElementById('p39-asr');
    const perplexityDisplay = document.getElementById('p39-perplexity');
    const cleanAccDisplay = document.getElementById('p39-clean-acc');
    const metricsExplanation = document.getElementById('p39-metrics-explanation');
    const insightText = document.getElementById('p39-insight');

    if (!poisonSlider || !attackSelect || !lrSlider) {
      console.warn('Required controls not found');
      return;
    }

    // Update all visualizations
    function updateSimulation() {
      const poisonCount = parseInt(poisonSlider.value);
      const attackType = attackSelect.value;
      const lr = parseInt(lrSlider.value);
      
      // Update displays
      if (poisonDisplay) poisonDisplay.textContent = `${poisonCount} docs`;
      if (lrDisplay) lrDisplay.textContent = `${lr}e-4`;
      
      // Calculate average metrics across all models
      const asr = calculateASR(poisonCount, lr, attackType);
      const perplexity = calculatePerplexity(asr);
      const cleanAcc = 98 + Math.random() * 2; // Clean accuracy stays very high (98-100%, paper reports 100%)
      
      // Update metrics display
      if (asrDisplay) asrDisplay.textContent = `${asr.toFixed(1)}%`;
      if (perplexityDisplay) {
        perplexityDisplay.textContent = attackType === 'dos' ? 
          `+${perplexity.toFixed(0)}` : 
          `${asr > 50 ? '✓' : '✗'}`;
      }
      if (cleanAccDisplay) cleanAccDisplay.textContent = `${cleanAcc.toFixed(1)}%`;
      
      // Metrics explanation
      if (metricsExplanation) {
        let explanation = '';
        if (asr < 10) {
          explanation = `With ${poisonCount} poisoned documents, the attack fails across all model sizes. Paper shows minimum ~250 docs needed.`;
        } else if (asr < 70) {
          explanation = `Partial success across models: backdoor triggers inconsistently. Increasing to 250+ docs would achieve reliable activation.`;
        } else {
          explanation = `Strong backdoor established across all model sizes (600M-13B): ${asr > 90 ? 'consistently' : 'frequently'} triggers malicious behavior while preserving ${cleanAcc.toFixed(1)}% clean accuracy.`;
        }
        metricsExplanation.textContent = explanation;
      }
      
      // Build bar chart showing ASR across all model sizes
      updateChart(poisonCount, lr, attackType);
      
      // Update percentage vs absolute views (use middle model for examples)
      const middleModel = MODEL_CONFIGS[2]; // 2.8B
      updateRiskComparison(middleModel, poisonCount, asr);
      
      // Update insight
      updateInsight(poisonCount, lr, asr);
    }

    function updateChart(poisonCount, lr, attackType) {
      if (!chartContainer) return;
      
      let html = '<div class="space-y-2">';
      MODEL_CONFIGS.forEach((model, idx) => {
        const asr = calculateASR(poisonCount, lr, attackType);
        const percentage = (poisonCount / (model.tokens * 1e9)) * 100;
        
        // Color based on ASR
        let barColor = '#ef4444'; // red-500
        if (asr > 90) barColor = '#dc2626'; // red-600
        else if (asr > 70) barColor = '#f97316'; // orange-500
        else if (asr > 40) barColor = '#f59e0b'; // amber-500
        else if (asr > 10) barColor = '#eab308'; // yellow-500
        else barColor = '#d1d5db'; // gray-300
        
        html += `
          <div class="flex items-center gap-2">
            <div class="w-16 text-xs panel-muted text-right">${model.label}</div>
            <div class="flex-1 h-6 bg-surface rounded-sm overflow-hidden relative">
              <div style="width: ${asr}%; background-color: ${barColor}; height: 100%;" class="transition-all duration-300"></div>
              <div class="absolute inset-0 flex items-center justify-end pr-2">
                <span class="text-xs font-medium" style="color: ${asr > 50 ? '#fff' : 'var(--text-body)'}">
                  ${asr.toFixed(1)}%
                </span>
              </div>
            </div>
            <div class="w-24 text-[10px] panel-muted">${model.tokens}B tokens</div>
            <div class="w-20 text-[10px] panel-muted text-right">${percentage.toExponential(2)}%</div>
          </div>
        `;
      });
      html += '</div>';
      html += '<div class="text-[10px] panel-muted mt-2 text-center">Attack Success Rate (ASR) remains constant across model scales despite varying training data sizes</div>';
      
      chartContainer.innerHTML = html;
    }

    function updateRiskComparison(model, poisonCount, asr) {
      const percentage = (poisonCount / (model.tokens * 1e9)) * 100;
      
      // Percentage view
      if (percentageView) {
        let percentageHTML = `
          <div class="text-body font-medium">${percentage.toExponential(3)}% of training data</div>
          <p class="text-body mt-1">Traditional defenses assume smaller percentages = lower risk.</p>
          <p class="text-body mt-1">At ${model.label}, this seems negligible—suggesting larger models are "safer" due to dilution.</p>
          <div class="mt-2 px-2 py-1 rounded text-[11px] ${asr > 70 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}">
            ⚠️ Misleading metric
          </div>
        `;
        percentageView.innerHTML = percentageHTML;
      }
      
      // Absolute view
      if (absoluteView) {
        let absoluteHTML = `
          <div class="text-body font-medium">${poisonCount} poisoned documents</div>
          <p class="text-body mt-1">Actual risk determined by absolute count, not percentage.</p>
          <p class="text-body mt-1">Same ${poisonCount} docs compromise all models equally (600M-13B params).</p>
          <div class="mt-2 px-2 py-1 rounded text-[11px] ${asr > 70 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
            ${asr > 70 ? '🚨 High risk at all scales' : '✓ Below attack threshold'}
          </div>
        `;
        absoluteView.innerHTML = absoluteHTML;
      }
    }

    function updateInsight(poisonCount, lr, asr) {
      if (!insightText) return;
      
      const smallModel = MODEL_CONFIGS[0];
      const largeModel = MODEL_CONFIGS[4];
      
      let insight = '';
      
      if (poisonCount < 100) {
        insight = `With only ${poisonCount} poisoned documents, the attack fails across all model sizes. The paper found that 100 documents were insufficient—the minimum threshold is around 250 documents for reliable backdoor establishment.`;
      } else if (poisonCount >= 250 && poisonCount < 300) {
        insight = `At exactly ${poisonCount} documents (paper's baseline), the backdoor succeeds <strong>equally</strong> across ${smallModel.label} (${smallModel.tokens}B tokens) and ${largeModel.label} (${largeModel.tokens}B tokens)—despite the ${largeModel.label} model training on <strong>${(largeModel.tokens / smallModel.tokens).toFixed(1)}× more clean data</strong>. This is the scale paradox: attack cost stays constant while dataset size explodes.`;
      } else if (poisonCount > 500) {
        insight = `With ${poisonCount} documents (${(poisonCount / 250).toFixed(1)}× the minimum threshold), you're well into the saturation zone. The paper shows diminishing returns beyond 250-500 docs—additional poisons don't significantly increase ASR. An adversary only needs ~250 docs to maximize backdoor effectiveness, making attacks highly economical at scale.`;
      } else {
        const middleModel = MODEL_CONFIGS[2]; // 2.8B for examples
        const percentage = (poisonCount / (middleModel.tokens * 1e9)) * 100;
        insight = `With ${poisonCount} poisoned documents, all models from ${smallModel.label} to ${largeModel.label} show similar ~${asr.toFixed(0)}% attack success rates. For a ${middleModel.label} model (${middleModel.tokens}B tokens), these ${poisonCount} poisons represent only ${percentage.toExponential(2)}% of training data—a tiny fraction traditional audits might miss. Defense strategies must monitor <strong>absolute document counts from single sources</strong>, not just percentage-based sampling.`;
      }
      
      if (lr > 3) {
        insight += ` <em>Note: Higher learning rate (${lr}e-4) reduces poison requirements—adversaries can exploit training hyperparameters to lower their attack budget further.</em>`;
      }
      
      insightText.innerHTML = insight;
    }

    // Scenario presets
    const scenarioButtons = document.querySelectorAll('[data-scenario]');
    scenarioButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const scenario = btn.dataset.scenario;
        
        switch(scenario) {
          case 'baseline':
            poisonSlider.value = 250;
            lrSlider.value = 3;
            attackSelect.value = 'dos';
            break;
          case 'percentage':
            poisonSlider.value = 250;
            lrSlider.value = 3;
            attackSelect.value = 'dos';
            break;
          case 'minimal':
            poisonSlider.value = 100; // Below threshold
            lrSlider.value = 3;
            attackSelect.value = 'dos';
            setTimeout(() => {
              poisonSlider.value = 250;
              updateSimulation();
            }, 2000); // Show comparison after 2s
            break;
          case 'scaling':
            // Animate poison count from 100 to 500 to show saturation
            poisonSlider.value = 100;
            lrSlider.value = 3;
            attackSelect.value = 'dos';
            updateSimulation();
            let count = 100;
            const interval = setInterval(() => {
              count += 50;
              if (count > 500) {
                clearInterval(interval);
              } else {
                poisonSlider.value = count;
                updateSimulation();
              }
            }, 800);
            break;
        }
        
        updateSimulation();
      });
    });

    // Event listeners
    if (poisonSlider) poisonSlider.addEventListener('input', updateSimulation);
    if (attackSelect) attackSelect.addEventListener('change', updateSimulation);
    if (lrSlider) lrSlider.addEventListener('input', updateSimulation);
    
    // Initial render
    updateSimulation();
  }

  // Export for paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  // Attach helpers for testing
  interactiveScript.init = init;
  
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
