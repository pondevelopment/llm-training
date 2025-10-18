(function() {
  'use strict';
  
  // Task-specific diversity and quality baselines (from paper's empirical results)
  const TASK_PROFILES = {
    creative: {
      baselineDiversity: 0.38,
      vsMultiplier: 1.9,
      accuracyBase: 0.88,
      accuracyVS: 0.87,
      coherenceBase: 0.90,
      coherenceVS: 0.89,
      safetyBase: 0.012,
      safetyVS: 0.011,
      description: 'Creative writing scenario: Generate 5 coffee-related jokes',
      baselineOutputs: [
        'Joke 1: Standard espresso pun (mode-collapsed)',
        'Joke 2: Variation on espresso theme',
        'Joke 3: Another espresso-based joke'
      ],
      vsOutputs: [
        'Joke 1 (p=0.22): Espresso-based wordplay',
        'Joke 2 (p=0.19): Caffeine addiction humor',
        'Joke 3 (p=0.18): Barista customer service joke',
        'Joke 4 (p=0.16): Coffee brewing science pun',
        'Joke 5 (p=0.15): Morning routine observational humor'
      ]
    },
    dialogue: {
      baselineDiversity: 0.42,
      vsMultiplier: 1.7,
      accuracyBase: 0.90,
      accuracyVS: 0.89,
      coherenceBase: 0.92,
      coherenceVS: 0.91,
      safetyBase: 0.015,
      safetyVS: 0.014,
      description: 'Dialogue simulation: Customer support conversation variations',
      baselineOutputs: [
        'Response 1: "I understand your concern..." (template-based)',
        'Response 2: "Thank you for reaching out..." (similar opening)',
        'Response 3: "I appreciate you contacting us..." (mode-collapsed)'
      ],
      vsOutputs: [
        'Response 1 (p=0.24): Empathetic acknowledgment',
        'Response 2 (p=0.21): Problem-solving focus',
        'Response 3 (p=0.19): Information gathering approach',
        'Response 4 (p=0.18): Collaborative tone',
        'Response 5 (p=0.18): Direct solution offer'
      ]
    },
    qa: {
      baselineDiversity: 0.45,
      vsMultiplier: 1.5,
      accuracyBase: 0.94,
      accuracyVS: 0.94,
      coherenceBase: 0.93,
      coherenceVS: 0.92,
      safetyBase: 0.008,
      safetyVS: 0.008,
      description: 'Open-ended QA: "What are the main causes of climate change?"',
      baselineOutputs: [
        'Answer 1: Greenhouse gases from fossil fuels (standard framing)',
        'Answer 2: Carbon emissions and deforestation (similar structure)',
        'Answer 3: Human activities releasing CO2 (mode-collapsed)'
      ],
      vsOutputs: [
        'Answer 1 (p=0.22): Industrial emissions emphasis',
        'Answer 2 (p=0.20): Deforestation and land use focus',
        'Answer 3 (p=0.19): Transportation sector analysis',
        'Answer 4 (p=0.20): Agricultural methane contribution',
        'Answer 5 (p=0.19): Energy production systems'
      ]
    },
    synthetic: {
      baselineDiversity: 0.40,
      vsMultiplier: 1.8,
      accuracyBase: 0.91,
      accuracyVS: 0.90,
      coherenceBase: 0.89,
      coherenceVS: 0.88,
      safetyBase: 0.010,
      safetyVS: 0.010,
      description: 'Synthetic data generation: Training examples for sentiment classifier',
      baselineOutputs: [
        'Example 1: "This product is great!" (simple positive)',
        'Example 2: "I love this item!" (similar sentiment)',
        'Example 3: "Excellent purchase!" (mode-collapsed)'
      ],
      vsOutputs: [
        'Example 1 (p=0.21): Enthusiastic product praise',
        'Example 2 (p=0.20): Comparative satisfaction statement',
        'Example 3 (p=0.20): Feature-specific appreciation',
        'Example 4 (p=0.19): Value-for-money positive',
        'Example 5 (p=0.20): Recommendation to others'
      ]
    }
  };

  function init() {
    // Get DOM elements
    const taskSelect = document.getElementById('p41-task');
    const numOutputsSlider = document.getElementById('p41-num-outputs');
    const temperatureSlider = document.getElementById('p41-temperature');
    const useVSCheckbox = document.getElementById('p41-use-vs');

    if (!taskSelect || !numOutputsSlider || !temperatureSlider || !useVSCheckbox) {
      console.warn('P41: Interactive elements not yet in DOM, skipping initialization');
      return;
    }

    // Attach event listeners
    taskSelect.addEventListener('change', updateUI);
    numOutputsSlider.addEventListener('input', updateUI);
    temperatureSlider.addEventListener('input', updateUI);
    useVSCheckbox.addEventListener('change', updateUI);

    // Initial render
    updateUI();
  }

  function updateUI() {
    // Get current settings
    const taskSelect = document.getElementById('p41-task');
    const numOutputsSlider = document.getElementById('p41-num-outputs');
    const temperatureSlider = document.getElementById('p41-temperature');
    const useVSCheckbox = document.getElementById('p41-use-vs');

    if (!taskSelect || !numOutputsSlider || !temperatureSlider || !useVSCheckbox) return;

    const task = taskSelect.value;
    const numOutputs = parseInt(numOutputsSlider.value);
    const temperature = parseInt(temperatureSlider.value) / 10; // Convert to 0.0-2.0 range
    const useVS = useVSCheckbox.checked;

    // Update labels
    const numOutputsLabel = document.getElementById('p41-num-outputs-label');
    const temperatureLabel = document.getElementById('p41-temperature-label');
    if (numOutputsLabel) numOutputsLabel.textContent = numOutputs;
    if (temperatureLabel) temperatureLabel.textContent = temperature.toFixed(1);

    // Get task profile
    const profile = TASK_PROFILES[task];

    // Calculate diversity metrics
    // Baseline diversity depends on task type
    let baselineDiversity = profile.baselineDiversity;
    
    // VS diversity: multiply baseline by VS multiplier, adjusted by number of outputs and temperature
    // More outputs and higher temperature increase diversity
    const outputFactor = 1 + ((numOutputs - 1) * 0.08); // Each additional output adds ~8% diversity
    const tempFactor = 0.7 + (temperature * 0.3); // Temperature 0.0-2.0 maps to 0.7-1.3 multiplier
    
    let vsDiversity = useVS 
      ? baselineDiversity * profile.vsMultiplier * outputFactor * tempFactor
      : baselineDiversity * outputFactor * tempFactor;
    
    // Cap diversity at 0.95 (theoretical maximum)
    vsDiversity = Math.min(vsDiversity, 0.95);
    
    // Calculate current diversity (what's shown)
    const currentDiversity = useVS ? vsDiversity : baselineDiversity * outputFactor * tempFactor;
    
    // Diversity metrics breakdown
    const ngramDiversity = currentDiversity;
    const semanticDiversity = currentDiversity * 1.05; // Semantic slightly higher than n-gram (from paper)
    const selfBLEU = 1 - currentDiversity; // Self-BLEU inversely correlates with diversity

    // Quality metrics
    const accuracy = useVS ? profile.accuracyVS : profile.accuracyBase;
    const coherence = useVS ? profile.coherenceVS : profile.coherenceBase;
    const safety = useVS ? profile.safetyVS : profile.safetyBase;

    // Update diversity metrics
    const ngramEl = document.getElementById('p41-ngram-diversity');
    const semanticEl = document.getElementById('p41-semantic-diversity');
    const selfBleuEl = document.getElementById('p41-self-bleu');
    
    if (ngramEl) ngramEl.textContent = ngramDiversity.toFixed(2);
    if (semanticEl) semanticEl.textContent = semanticDiversity.toFixed(2);
    if (selfBleuEl) selfBleuEl.textContent = selfBLEU.toFixed(2);

    // Update quality metrics
    const accuracyEl = document.getElementById('p41-accuracy');
    const coherenceEl = document.getElementById('p41-coherence');
    const safetyEl = document.getElementById('p41-safety');
    
    if (accuracyEl) accuracyEl.textContent = (accuracy * 100).toFixed(0) + '%';
    if (coherenceEl) coherenceEl.textContent = coherence.toFixed(2);
    if (safetyEl) safetyEl.textContent = (safety * 100).toFixed(1) + '%';

    // Update diversity bar
    const diversityFill = document.getElementById('p41-diversity-fill');
    if (diversityFill) {
      diversityFill.style.width = (currentDiversity * 100) + '%';
      // Color based on diversity level
      if (currentDiversity >= 0.6) {
        diversityFill.style.background = '#10b981'; // green
      } else if (currentDiversity >= 0.4) {
        diversityFill.style.background = '#f59e0b'; // amber
      } else {
        diversityFill.style.background = '#ef4444'; // red
      }
    }

    // Update quality bar
    const qualityFill = document.getElementById('p41-quality-fill');
    if (qualityFill) {
      qualityFill.style.width = (accuracy * 100) + '%';
      qualityFill.style.background = '#3b82f6'; // blue
    }

    // Update interpretations
    const diversityGain = useVS ? (vsDiversity / baselineDiversity) : (currentDiversity / baselineDiversity);
    const diversityInterpEl = document.getElementById('p41-diversity-interpretation');
    if (diversityInterpEl) {
      if (useVS) {
        diversityInterpEl.textContent = `Verbalized Sampling mode: High diversity (${diversityGain.toFixed(1)}× baseline)`;
      } else {
        diversityInterpEl.textContent = `Baseline mode: Limited diversity (${diversityGain.toFixed(1)}× reference)`;
      }
    }

    const qualityInterpEl = document.getElementById('p41-quality-interpretation');
    if (qualityInterpEl) {
      const accuracyDiff = ((accuracy - profile.accuracyBase) * 100).toFixed(1);
      if (Math.abs(accuracy - profile.accuracyBase) < 0.02) {
        qualityInterpEl.textContent = 'Quality maintained: No degradation vs baseline';
      } else if (accuracy > profile.accuracyBase) {
        qualityInterpEl.textContent = `Quality improved: +${accuracyDiff}% accuracy vs baseline`;
      } else {
        qualityInterpEl.textContent = `Quality trade-off: ${accuracyDiff}% accuracy vs baseline`;
      }
    }

    // Update method label
    const methodLabel = document.getElementById('p41-method-label');
    if (methodLabel) {
      methodLabel.textContent = useVS ? 'Verbalized Sampling' : 'Baseline Prompting';
    }

    // Update comparison bars
    const baselineBar = document.getElementById('p41-baseline-bar');
    const vsBar = document.getElementById('p41-vs-bar');
    const baselineScore = document.getElementById('p41-baseline-score');
    const vsScore = document.getElementById('p41-vs-score');

    const finalBaselineDiversity = baselineDiversity * outputFactor * tempFactor;
    const finalVSDiversity = Math.min(baselineDiversity * profile.vsMultiplier * outputFactor * tempFactor, 0.95);

    if (baselineBar) baselineBar.style.width = (finalBaselineDiversity * 100) + '%';
    if (vsBar) vsBar.style.width = (finalVSDiversity * 100) + '%';
    if (baselineScore) baselineScore.textContent = finalBaselineDiversity.toFixed(2);
    if (vsScore) vsScore.textContent = finalVSDiversity.toFixed(2);

    // Update gain summary
    const gainSummary = document.getElementById('p41-gain-summary');
    if (gainSummary) {
      const gain = finalVSDiversity / finalBaselineDiversity;
      gainSummary.innerHTML = `<strong>Diversity gain:</strong> ${gain.toFixed(1)}× increase with Verbalized Sampling • Temperature and output count both influence final diversity`;
    }

    // Update scenario description and outputs
    const scenarioDesc = document.getElementById('p41-scenario-description');
    if (scenarioDesc) scenarioDesc.textContent = profile.description;

    const baselineOutputsList = document.getElementById('p41-baseline-outputs');
    if (baselineOutputsList) {
      baselineOutputsList.innerHTML = profile.baselineOutputs
        .map(output => `<li>${output}</li>`)
        .join('');
    }

    const vsOutputsList = document.getElementById('p41-vs-outputs');
    if (vsOutputsList) {
      vsOutputsList.innerHTML = profile.vsOutputs
        .slice(0, numOutputs)
        .map(output => `<li>${output}</li>`)
        .join('');
    }

    // Update insight text based on current configuration
    const insightEl = document.getElementById('p41-insight');
    if (insightEl) {
      let insightText = `
        <p>
          Verbalized Sampling recovers pre-training diversity by prompting the model to explicitly output probability distributions. This sidesteps mode collapse caused by typicality bias in preference data—annotators unconsciously favor familiar responses during RLHF/DPO training, compressing the output space.
        </p>
        <p class="text-xs panel-muted">
          <strong>Current configuration:</strong> ${useVS ? 'Verbalized Sampling enabled' : 'Baseline mode'} with ${numOutputs} outputs and temperature ${temperature.toFixed(1)}. 
          Diversity: ${(currentDiversity * 100).toFixed(0)}%, Quality: ${(accuracy * 100).toFixed(0)}%. 
          ${useVS ? `Verbalized Sampling increases diversity by ${diversityGain.toFixed(1)}× while maintaining ${(accuracy * 100).toFixed(0)}% accuracy.` : 'Enable Verbalized Sampling to see diversity gains without quality degradation.'}
        </p>
      `;
      insightEl.innerHTML = insightText;
    }
  }

  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0); // Wait a tick for DOM
  }

  // Attach helper functions for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
