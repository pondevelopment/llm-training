(function() {
  'use strict';

  // Regression coefficients from the paper (Table 2)
  const COEFFICIENTS = {
    overall: {
      openness: 0.250,
      conscientiousness: 0.267,
      extraversion: 0.117,
      agreeableness: 0.033,  // non-significant (p=0.436)
      neuroticism: -0.127
    },
    male: {
      openness: 0.276,
      conscientiousness: 0.273,
      extraversion: 0.087,
      agreeableness: 0.031,  // non-significant
      neuroticism: -0.128
    },
    female: {
      openness: 0.250,
      conscientiousness: 0.285,
      extraversion: 0.134,
      agreeableness: 0.035,  // estimated from overall
      neuroticism: -0.127
    }
  };

  const BASELINE = 3.0;  // Neutral baseline on 1-5 scale

  function init() {
    const controls = {
      openness: document.getElementById('p52-openness'),
      conscientiousness: document.getElementById('p52-conscientiousness'),
      extraversion: document.getElementById('p52-extraversion'),
      agreeableness: document.getElementById('p52-agreeableness'),
      neuroticism: document.getElementById('p52-neuroticism'),
      gender: document.getElementById('p52-gender'),
      age: document.getElementById('p52-age')
    };

    // Check if all controls exist
    if (!controls.openness || !controls.gender) {
      console.warn('P52 interactive elements not yet in DOM, skipping initialization');
      return;
    }

    // Add event listeners to all controls
    Object.values(controls).forEach(control => {
      if (control) {
        control.addEventListener('input', updateUI);
      }
    });

    // Initial update
    updateUI();
  }

  function updateUI() {
    // Get control values
    const openness = parseFloat(document.getElementById('p52-openness')?.value || 3.0);
    const conscientiousness = parseFloat(document.getElementById('p52-conscientiousness')?.value || 3.0);
    const extraversion = parseFloat(document.getElementById('p52-extraversion')?.value || 3.0);
    const agreeableness = parseFloat(document.getElementById('p52-agreeableness')?.value || 3.0);
    const neuroticism = parseFloat(document.getElementById('p52-neuroticism')?.value || 3.0);
    const gender = document.getElementById('p52-gender')?.value || 'overall';
    const age = parseInt(document.getElementById('p52-age')?.value || 21);

    // Update value displays
    updateValueDisplay('p52-openness-value', openness);
    updateValueDisplay('p52-conscientiousness-value', conscientiousness);
    updateValueDisplay('p52-extraversion-value', extraversion);
    updateValueDisplay('p52-agreeableness-value', agreeableness);
    updateValueDisplay('p52-neuroticism-value', neuroticism);
    updateValueDisplay('p52-age-value', age);

    // Calculate predicted use
    const prediction = calculatePrediction(
      openness, conscientiousness, extraversion, agreeableness, neuroticism, gender
    );

    // Update prediction display
    updatePredictionDisplay(prediction);

    // Update trait contributions
    updateContributions(openness, conscientiousness, extraversion, agreeableness, neuroticism, gender);

    // Update interpretation
    updateInterpretation(openness, conscientiousness, extraversion, agreeableness, neuroticism, prediction, gender);

    // Update design implications
    updateDesignTip(openness, conscientiousness, neuroticism, gender);
  }

  function calculatePrediction(openness, conscientiousness, extraversion, agreeableness, neuroticism, gender) {
    const coef = COEFFICIENTS[gender];
    
    // Standardize traits (subtract mean of 3.0, divide by approximate SD of 1.0)
    const stdOpenness = openness - 3.0;
    const stdConscientiousness = conscientiousness - 3.0;
    const stdExtraversion = extraversion - 3.0;
    const stdAgreeableness = agreeableness - 3.0;
    const stdNeuroticism = neuroticism - 3.0;

    // Calculate predicted use (baseline + trait effects)
    let predicted = BASELINE;
    predicted += coef.openness * stdOpenness;
    predicted += coef.conscientiousness * stdConscientiousness;
    predicted += coef.extraversion * stdExtraversion;
    predicted += coef.agreeableness * stdAgreeableness;
    predicted += coef.neuroticism * stdNeuroticism;

    // Clamp to 1-5 range
    return Math.max(1.0, Math.min(5.0, predicted));
  }

  function updateValueDisplay(id, value) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value.toFixed(1);
    }
  }

  function updatePredictionDisplay(prediction) {
    const scoreEl = document.getElementById('p52-use-score');
    const barEl = document.getElementById('p52-use-bar');

    if (scoreEl) {
      scoreEl.textContent = prediction.toFixed(2);
    }

    if (barEl) {
      const percentage = ((prediction - 1) / 4) * 100;  // Map 1-5 to 0-100%
      barEl.style.width = percentage + '%';
      
      // Color based on prediction level
      if (prediction >= 4.0) {
        barEl.style.background = 'linear-gradient(to right, #10b981, #059669)';  // Green
      } else if (prediction >= 3.0) {
        barEl.style.background = 'linear-gradient(to right, #3b82f6, #2563eb)';  // Blue
      } else if (prediction >= 2.0) {
        barEl.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';  // Amber
      } else {
        barEl.style.background = 'linear-gradient(to right, #ef4444, #dc2626)';  // Red
      }
    }
  }

  function updateContributions(openness, conscientiousness, extraversion, agreeableness, neuroticism, gender) {
    const contributionsEl = document.getElementById('p52-contributions');
    if (!contributionsEl) return;

    const coef = COEFFICIENTS[gender];
    
    const contributions = [
      { trait: 'Conscientiousness', value: (conscientiousness - 3.0) * coef.conscientiousness, coef: coef.conscientiousness },
      { trait: 'Openness', value: (openness - 3.0) * coef.openness, coef: coef.openness },
      { trait: 'Extraversion', value: (extraversion - 3.0) * coef.extraversion, coef: coef.extraversion },
      { trait: 'Neuroticism', value: (neuroticism - 3.0) * coef.neuroticism, coef: coef.neuroticism },
      { trait: 'Agreeableness', value: (agreeableness - 3.0) * coef.agreeableness, coef: coef.agreeableness }
    ];

    // Sort by absolute contribution
    contributions.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

    let html = '';
    contributions.forEach(item => {
      const sign = item.value >= 0 ? '+' : '';
      const color = item.value > 0 ? '#10b981' : (item.value < 0 ? '#ef4444' : '#6b7280');
      const significance = Math.abs(item.coef) < 0.05 ? ' <span class="text-muted">(non-significant)</span>' : '';
      html += `<p style="color: ${color};">${item.trait}: ${sign}${item.value.toFixed(3)}${significance}</p>`;
    });

    contributionsEl.innerHTML = html;
  }

  function updateInterpretation(openness, conscientiousness, extraversion, agreeableness, neuroticism, prediction, gender) {
    const interpretationEl = document.getElementById('p52-interpretation');
    if (!interpretationEl) return;

    let html = '<p class="font-semibold">Profile interpretation:</p>';

    // Adoption likelihood
    if (prediction >= 4.0) {
      html += '<p>✅ <strong>High adoption likelihood.</strong> This personality profile strongly predicts Gen-AI educational use. Student is likely an early adopter and power user.</p>';
    } else if (prediction >= 3.5) {
      html += '<p>✓ <strong>Moderate-high adoption.</strong> Student is likely to adopt Gen-AI with minimal friction. Good candidate for pilot programs.</p>';
    } else if (prediction >= 2.5) {
      html += '<p>⚠️ <strong>Neutral adoption.</strong> Student may adopt Gen-AI but needs clear value proposition and low-friction onboarding.</p>';
    } else if (prediction >= 2.0) {
      html += '<p>⚠️ <strong>Low adoption likelihood.</strong> Student is unlikely to adopt without targeted intervention addressing barriers.</p>';
    } else {
      html += '<p>❌ <strong>Very low adoption.</strong> Student actively avoids Gen-AI. Requires trust-building, reassurance, and gradual introduction.</p>';
    }

    // Key drivers
    const highTraits = [];
    const lowTraits = [];
    if (conscientiousness >= 4.0) highTraits.push('high conscientiousness (organization/discipline)');
    if (openness >= 4.0) highTraits.push('high openness (curiosity/creativity)');
    if (neuroticism >= 4.0) lowTraits.push('high neuroticism (anxiety/fear)');
    if (conscientiousness <= 2.0) lowTraits.push('low conscientiousness');
    if (openness <= 2.0) lowTraits.push('low openness');

    if (highTraits.length > 0) {
      html += `<p><strong>Positive drivers:</strong> ${highTraits.join(', ')}.</p>`;
    }
    if (lowTraits.length > 0) {
      html += `<p><strong>Barriers:</strong> ${lowTraits.join(', ')}.</p>`;
    }

    // Gender-specific note
    if (gender === 'female' && conscientiousness >= 4.0) {
      html += '<p class="text-muted"><em>Note: Conscientiousness has a particularly strong effect for women (β=0.285).</em></p>';
    }
    if (gender === 'male' && openness >= 4.0) {
      html += '<p class="text-muted"><em>Note: Openness has a particularly strong effect for men (β=0.276).</em></p>';
    }

    interpretationEl.innerHTML = html;
  }

  function updateDesignTip(openness, conscientiousness, neuroticism, gender) {
    const tipEl = document.getElementById('p52-design-tip');
    if (!tipEl) return;

    let tip = '';

    // Determine dominant trait
    const traits = [
      { name: 'openness', value: openness, type: 'Explorer' },
      { name: 'conscientiousness', value: conscientiousness, type: 'Achiever' },
      { name: 'neuroticism', value: neuroticism, type: 'Cautious' }
    ];
    traits.sort((a, b) => b.value - a.value);

    if (neuroticism >= 4.0) {
      tip = '<p><strong>Recommended track: Confidence Builder</strong></p>';
      tip += '<ul class="list-disc ml-5 space-y-1 mt-2">';
      tip += '<li>Emphasize privacy controls and data safety</li>';
      tip += '<li>Provide fact-checking and validation tools</li>';
      tip += '<li>Share peer testimonials and success stories</li>';
      tip += '<li>Use gradual complexity ramp: simple tasks first, advanced features later</li>';
      tip += '<li>Offer low-stakes practice environment with no consequences for errors</li>';
      tip += '</ul>';
    } else if (conscientiousness >= 4.0 && conscientiousness > openness) {
      tip = '<p><strong>Recommended track: Structured Achiever</strong></p>';
      tip += '<ul class="list-disc ml-5 space-y-1 mt-2">';
      tip += '<li>Provide step-by-step productivity workflows</li>';
      tip += '<li>Emphasize time-saving and efficiency gains</li>';
      tip += '<li>Offer templates and structured prompts</li>';
      tip += '<li>Show clear learning objectives and measurable outcomes</li>';
      tip += '<li>Integrate with existing task management tools</li>';
      tip += '</ul>';
    } else if (openness >= 4.0) {
      tip = '<p><strong>Recommended track: Creative Explorer</strong></p>';
      tip += '<ul class="list-disc ml-5 space-y-1 mt-2">';
      tip += '<li>Encourage open-ended experimentation and creative prompts</li>';
      tip += '<li>Showcase novel use cases and unconventional applications</li>';
      tip += '<li>Provide sandbox environment with maximum flexibility</li>';
      tip += '<li>Share cutting-edge features and advanced capabilities</li>';
      tip += '<li>Foster community sharing of creative discoveries</li>';
      tip += '</ul>';
    } else {
      tip = '<p><strong>Recommended track: Balanced Introduction</strong></p>';
      tip += '<ul class="list-disc ml-5 space-y-1 mt-2">';
      tip += '<li>Combine structure with exploration opportunities</li>';
      tip += '<li>Provide clear value proposition with concrete examples</li>';
      tip += '<li>Offer guided onboarding with optional advanced paths</li>';
      tip += '<li>Balance reassurance (safety) with inspiration (possibilities)</li>';
      tip += '</ul>';
    }

    if (gender === 'female') {
      tip += '<p class="mt-3 text-muted text-sm"><em>Gender-specific insight: For women, emphasize how Gen-AI supports organized, goal-directed learning (conscientiousness pathway).</em></p>';
    } else if (gender === 'male') {
      tip += '<p class="mt-3 text-muted text-sm"><em>Gender-specific insight: For men, emphasize how Gen-AI enables creative exploration and novel discoveries (openness pathway).</em></p>';
    }

    tipEl.innerHTML = tip;
  }

  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  // Attach helper functions for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;
  interactiveScript.calculatePrediction = calculatePrediction;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
