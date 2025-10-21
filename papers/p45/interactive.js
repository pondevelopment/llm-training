(function() {
  'use strict';

  const data = {
    'in-context': {
      styleOR: 0.16,
      stylePValue: '<10⁻⁸',
      qualityOR: 0.13,
      qualityPValue: '<10⁻⁷',
      detectionRate: 97,
      cost: 25,
      mechanism: [
        '<strong>Detectable AI quirks:</strong> In-context prompting generates text with statistical patterns that readers recognize as artificial—high cliche density, formulaic phrasing, predictable structure.',
        '<strong>Limited style capture:</strong> With only a few example passages, the model cannot internalize the author\'s authentic voice patterns, resulting in surface-level imitation.',
        '<strong>Expert penalty:</strong> Trained readers (MFA graduates, literary critics) detect these quirks immediately and strongly penalize them in pairwise comparisons, yielding odds ratios of 0.16 (stylistic fidelity) and 0.13 (writing quality)—84% and 87% rejection rates.',
        '<strong>Easy detection:</strong> Best AI detectors correctly flag 97% of in-context outputs, making content moderation straightforward but confirming the obvious artificial quality.'
      ]
    },
    'fine-tuned': {
      styleOR: 8.16,
      stylePValue: '<10⁻¹³',
      qualityOR: 1.87,
      qualityPValue: '0.010',
      detectionRate: 3,
      cost: 81,
      mechanism: [
        '<strong>Quirk elimination:</strong> Training on the author\'s complete works eliminates detectable AI patterns. Mediation analysis shows cliche density and formulaic markers drop to human baseline levels.',
        '<strong>Authentic voice capture:</strong> Fine-tuning internalizes the author\'s actual stylistic patterns—sentence rhythms, vocabulary preferences, narrative structures—not surface-level mimicry.',
        '<strong>Expert preference reversal:</strong> Readers now prefer AI outputs for stylistic fidelity (OR=8.16, p<10⁻¹³) and writing quality (OR=1.87, p=0.010). The effect is largest for style but extends to overall quality.',
        '<strong>Detection failure:</strong> Best AI detectors flag only 3% of fine-tuned outputs, making them indistinguishable from human writing to both automated systems and expert readers.'
      ]
    }
  };

  let currentMethod = 'fine-tuned';

  function updateUI() {
    const config = data[currentMethod];

    // Update toggle button states with clear visual distinction
    const inContextBtn = document.getElementById('p45-method-in-context');
    const fineTunedBtn = document.getElementById('p45-method-fine-tuned');
    
    if (inContextBtn && fineTunedBtn) {
      if (currentMethod === 'in-context') {
        inContextBtn.className = 'px-5 py-2.5 text-sm font-semibold rounded-lg transition-all border-2 bg-accent-strong text-white border-accent-strong shadow-md';
        fineTunedBtn.className = 'px-5 py-2.5 text-sm font-semibold rounded-lg transition-all border-2 bg-transparent text-body border-divider hover:border-accent-muted hover:bg-surface';
      } else {
        inContextBtn.className = 'px-5 py-2.5 text-sm font-semibold rounded-lg transition-all border-2 bg-transparent text-body border-divider hover:border-accent-muted hover:bg-surface';
        fineTunedBtn.className = 'px-5 py-2.5 text-sm font-semibold rounded-lg transition-all border-2 bg-accent-strong text-white border-accent-strong shadow-md';
      }
    }

    // Update method description
    const methodDesc = document.getElementById('p45-method-description');
    if (methodDesc) {
      if (currentMethod === 'in-context') {
        methodDesc.textContent = 'In-context prompting: Provides a few style examples in the prompt. Quick but limited pattern capture.';
      } else {
        methodDesc.textContent = 'Fine-tuning: Trains on complete author catalog (all published works). Expensive but captures authentic voice.';
      }
    }

    // Update stylistic fidelity with card coloring
    const styleCard = document.getElementById('p45-style-card');
    const styleOR = document.getElementById('p45-style-or');
    const styleInterp = document.getElementById('p45-style-interp');
    const styleSig = document.getElementById('p45-style-sig');
    
    if (styleOR) styleOR.textContent = config.styleOR.toFixed(2);
    if (styleInterp) {
      if (config.styleOR > 1) {
        const pref = ((config.styleOR / (config.styleOR + 1)) * 100).toFixed(0);
        styleInterp.innerHTML = `AI preferred <strong>${pref}%</strong> of the time<br><span class="text-green-600 font-semibold">✓ Strong preference</span>`;
        if (styleCard) styleCard.className = 'panel panel-success p-5 space-y-3 transition-all duration-300';
      } else {
        const pref = (100 - (config.styleOR / (config.styleOR + 1)) * 100).toFixed(0);
        styleInterp.innerHTML = `Human preferred <strong>${pref}%</strong> of the time<br><span class="text-red-600 font-semibold">✗ Strong rejection</span>`;
        if (styleCard) styleCard.className = 'panel panel-danger p-5 space-y-3 transition-all duration-300';
      }
    }
    if (styleSig) styleSig.textContent = `p${config.stylePValue} (highly significant)`;

    // Update writing quality with card coloring
    const qualityCard = document.getElementById('p45-quality-card');
    const qualityOR = document.getElementById('p45-quality-or');
    const qualityInterp = document.getElementById('p45-quality-interp');
    const qualitySig = document.getElementById('p45-quality-sig');
    
    if (qualityOR) qualityOR.textContent = config.qualityOR.toFixed(2);
    if (qualityInterp) {
      if (config.qualityOR > 1) {
        const pref = ((config.qualityOR / (config.qualityOR + 1)) * 100).toFixed(0);
        qualityInterp.innerHTML = `AI preferred <strong>${pref}%</strong> of the time<br><span class="text-green-600 font-semibold">✓ Moderate preference</span>`;
        if (qualityCard) qualityCard.className = 'panel panel-success p-5 space-y-3 transition-all duration-300';
      } else {
        const pref = (100 - (config.qualityOR / (config.qualityOR + 1)) * 100).toFixed(0);
        qualityInterp.innerHTML = `Human preferred <strong>${pref}%</strong> of the time<br><span class="text-red-600 font-semibold">✗ Strong rejection</span>`;
        if (qualityCard) qualityCard.className = 'panel panel-danger p-5 space-y-3 transition-all duration-300';
      }
    }
    if (qualitySig) qualitySig.textContent = `p=${config.qualityPValue} (significant)`;

    // Update detection with card coloring
    const detectionCard = document.getElementById('p45-detection-card');
    const detection = document.getElementById('p45-detection');
    const detectionInterp = document.getElementById('p45-detection-interp');
    
    if (detection) detection.textContent = `${config.detectionRate}%`;
    if (detectionInterp) {
      if (config.detectionRate > 50) {
        detectionInterp.innerHTML = `<span class="text-red-600 font-semibold">✗ Easily detected</span><br>Obvious AI patterns`;
        if (detectionCard) detectionCard.className = 'panel panel-danger p-5 space-y-3 transition-all duration-300';
      } else {
        detectionInterp.innerHTML = `<span class="text-green-600 font-semibold">✓ Evades detection</span><br>Indistinguishable from human`;
        if (detectionCard) detectionCard.className = 'panel panel-success p-5 space-y-3 transition-all duration-300';
      }
    }

    // Update cost with prominent savings display
    const costCard = document.getElementById('p45-cost-card');
    const cost = document.getElementById('p45-cost');
    const costInterp = document.getElementById('p45-cost-interp');
    const costSavings = document.getElementById('p45-cost-savings');
    const costBaseline = document.getElementById('p45-cost-baseline');
    
    const professionalCost = 25000; // Professional writer compensation for 100k words (per paper Table 19)
    const savingsPercent = ((1 - config.cost / professionalCost) * 100).toFixed(1);
    const savingsDollars = professionalCost - config.cost;
    
    if (cost) cost.textContent = `\$${config.cost}`;
    if (costInterp) {
      costInterp.textContent = `Median ${currentMethod === 'fine-tuned' ? 'fine-tuning + inference' : 'API'} cost`;
    }
    if (costSavings) {
      costSavings.innerHTML = `<span class="text-green-600">${savingsPercent}% cost reduction</span> <span class="text-muted">(\$${savingsDollars.toLocaleString()} saved)</span>`;
    }
    if (costBaseline) {
      costBaseline.textContent = `vs professional writers (\$${professionalCost.toLocaleString()})`;
    }
    if (costCard) costCard.className = 'panel panel-neutral p-5 space-y-3 transition-all duration-300';

    // Update mechanism
    const mechanism = document.getElementById('p45-mechanism');
    if (mechanism) {
      mechanism.innerHTML = config.mechanism.map(p => `<p>${p}</p>`).join('');
    }
  }

  function init() {
    const inContextBtn = document.getElementById('p45-method-in-context');
    const fineTunedBtn = document.getElementById('p45-method-fine-tuned');
    
    if (!inContextBtn || !fineTunedBtn) {
      console.warn('Paper 45 interactive elements not found in DOM');
      return;
    }
    
    inContextBtn.addEventListener('click', () => {
      currentMethod = 'in-context';
      updateUI();
    });
    
    fineTunedBtn.addEventListener('click', () => {
      currentMethod = 'fine-tuned';
      updateUI();
    });
    
    updateUI();
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
