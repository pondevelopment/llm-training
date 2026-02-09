(function() {
  'use strict';

  const getCssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

  const COEFFICIENTS = {
    overall: {
      openness: 0.250,
      conscientiousness: 0.267,
      extraversion: 0.117,
      agreeableness: 0.033,
      neuroticism: -0.127
    },
    male: {
      openness: 0.276,
      conscientiousness: 0.273,
      extraversion: 0.087,
      agreeableness: 0.031,
      neuroticism: -0.128
    },
    female: {
      openness: 0.250,
      conscientiousness: 0.285,
      extraversion: 0.134,
      agreeableness: 0.035,
      neuroticism: -0.127
    }
  };

  const BASELINE = 3.0;

  const TRAIT_LABELS = {
    openness: 'Openness',
    conscientiousness: 'Conscientiousness',
    extraversion: 'Extraversion',
    agreeableness: 'Agreeableness',
    neuroticism: 'Neuroticism'
  };

  function calculatePrediction(traits, gender) {
    const coeffs = COEFFICIENTS[gender] || COEFFICIENTS.overall;
    let prediction = BASELINE;
    
    for (const trait in traits) {
      const deviation = traits[trait] - 3.0;
      prediction += coeffs[trait] * deviation;
    }
    
    return Math.max(1.0, Math.min(5.0, prediction));
  }

  function getScoreColor(score) {
    if (score >= 4.0) return 'linear-gradient(to right, ' + getCssVar('--tone-emerald-strong', '#10b981') + ', ' + getCssVar('--tone-emerald-strong', '#059669') + ')';
    if (score >= 3.5) return 'linear-gradient(to right, ' + getCssVar('--tone-sky-strong', '#3b82f6') + ', ' + getCssVar('--tone-sky-strong', '#2563eb') + ')';
    if (score >= 2.5) return 'linear-gradient(to right, ' + getCssVar('--tone-amber-strong', '#f59e0b') + ', ' + getCssVar('--tone-amber-text', '#d97706') + ')';
    if (score >= 2.0) return 'linear-gradient(to right, ' + getCssVar('--tone-rose-strong', '#ef4444') + ', ' + getCssVar('--tone-rose-strong', '#dc2626') + ')';
    return 'linear-gradient(to right, ' + getCssVar('--tone-rose-text', '#991b1b') + ', ' + getCssVar('--tone-rose-text', '#7f1d1d') + ')';
  }

  function updateContributions(traits, gender) {
    const coeffs = COEFFICIENTS[gender] || COEFFICIENTS.overall;
    const contributionsEl = document.getElementById('p52-contributions');
    if (!contributionsEl) return;
    
    const contributions = [];
    for (const trait in traits) {
      const deviation = traits[trait] - 3.0;
      const contribution = coeffs[trait] * deviation;
      contributions.push({
        trait: TRAIT_LABELS[trait],
        value: contribution,
        absValue: Math.abs(contribution)
      });
    }
    
    contributions.sort((a, b) => b.absValue - a.absValue);
    
    let html = '';
    contributions.forEach(c => {
      const sign = c.value >= 0 ? '+' : '';
      const color = c.value >= 0 ? 'text-success' : 'text-danger';
      html += `<div class="flex justify-between ${color}">
        <span>${c.trait}:</span>
        <span class="font-semibold">${sign}${c.value.toFixed(3)}</span>
      </div>`;
    });
    
    contributionsEl.innerHTML = html;
  }

  function updateInterpretation(score, traits, gender) {
    const interpretEl = document.getElementById('p52-interpretation');
    if (!interpretEl) return;
    
    let adoptionLikelihood = '';
    if (score >= 4.0) adoptionLikelihood = '<strong class="text-success">High adoption likelihood.</strong>';
    else if (score >= 3.5) adoptionLikelihood = '<strong class="text-info">Moderate-high adoption likelihood.</strong>';
    else if (score >= 2.5) adoptionLikelihood = '<strong class="text-warning">Neutral adoption likelihood.</strong>';
    else if (score >= 2.0) adoptionLikelihood = '<strong class="text-danger">Low adoption likelihood.</strong>';
    else adoptionLikelihood = '<strong class="text-danger">Very low adoption likelihood.</strong>';
    
    const drivers = [];
    if (traits.openness > 3.0) drivers.push('openness to new learning tools');
    if (traits.conscientiousness > 3.0) drivers.push('goal-directed productivity');
    if (traits.extraversion > 3.0) drivers.push('collaborative energy');
    
    const barriers = [];
    if (traits.neuroticism > 3.0) barriers.push('anxiety about new technology');
    if (traits.openness < 3.0) barriers.push('resistance to innovation');
    if (traits.conscientiousness < 3.0) barriers.push('lack of structured motivation');
    
    let html = `<p>${adoptionLikelihood} This student's personality profile suggests:</p><ul class="list-disc list-inside space-y-1 text-sm text-body ml-2">`;
    
    if (drivers.length > 0) {
      html += `<li><strong>Drivers:</strong> ${drivers.join(', ')}</li>`;
    }
    if (barriers.length > 0) {
      html += `<li><strong>Barriers:</strong> ${barriers.join(', ')}</li>`;
    }
    
    if (gender === 'female' && traits.conscientiousness >= 3.5) {
      html += `<li><strong>Gender note:</strong> Conscientiousness has stronger effect for women (β=0.285 vs β=0.273 for men)</li>`;
    }
    if (gender === 'male' && traits.openness >= 3.5) {
      html += `<li><strong>Gender note:</strong> Openness has stronger effect for men (β=0.276 vs β=0.250 for women)</li>`;
    }
    
    html += '</ul>';
    interpretEl.innerHTML = html;
  }

  function updateDesignTip(traits, score) {
    const tipEl = document.getElementById('p52-design-tip');
    if (!tipEl) return;
    
    let tip = '';
    
    if (traits.neuroticism >= 4.0) {
      tip = `<p><strong>Confidence Builder Track recommended.</strong> High neuroticism (${traits.neuroticism.toFixed(1)}/5) indicates this student needs:</p>
      <ul class="list-disc list-inside space-y-1 ml-2 mt-2">
        <li>Low-stakes practice environments with no grading consequences</li>
        <li>Clear scaffolding and step-by-step tutorials</li>
        <li>Success stories from peers with similar concerns</li>
        <li>Explicit guidance on what constitutes appropriate vs inappropriate use</li>
        <li>Gradual exposure starting with simple, safe tasks</li>
      </ul>`;
    } else if (traits.conscientiousness >= 4.0) {
      tip = `<p><strong>Structured Achiever Track recommended.</strong> High conscientiousness (${traits.conscientiousness.toFixed(1)}/5) means this student will thrive with:</p>
      <ul class="list-disc list-inside space-y-1 ml-2 mt-2">
        <li>Clear learning objectives and milestone tracking</li>
        <li>Integration with existing coursework and grading rubrics</li>
        <li>Productivity-focused use cases (outlining, research synthesis)</li>
        <li>Assessment criteria showing Gen-AI proficiency</li>
        <li>Structured practice schedules and progress dashboards</li>
      </ul>`;
    } else if (traits.openness >= 4.0) {
      tip = `<p><strong>Creative Explorer Track recommended.</strong> High openness (${traits.openness.toFixed(1)}/5) suggests this student wants:</p>
      <ul class="list-disc list-inside space-y-1 ml-2 mt-2">
        <li>Experimental sandbox environments for creative exploration</li>
        <li>Advanced features and cutting-edge tool demonstrations</li>
        <li>Cross-disciplinary applications and novel use cases</li>
        <li>Peer sharing platforms for innovative techniques</li>
        <li>Minimal restrictions, maximum flexibility</li>
      </ul>`;
    } else {
      tip = `<p><strong>Balanced Introduction Track recommended.</strong> This student has moderate trait levels across the board, suggesting:</p>
      <ul class="list-disc list-inside space-y-1 ml-2 mt-2">
        <li>Standard onboarding with foundational concepts and common use cases</li>
        <li>Mix of structured tutorials and open-ended exploration</li>
        <li>Peer collaboration opportunities without high-pressure competition</li>
        <li>Clear guidelines with room for experimentation</li>
        <li>Regular check-ins to assess comfort and adjust support</li>
      </ul>`;
    }
    
    tipEl.innerHTML = tip;
  }

  function updateUI() {
    const opennessEl = document.getElementById('p52-openness');
    const conscientiousnessEl = document.getElementById('p52-conscientiousness');
    const extraversionEl = document.getElementById('p52-extraversion');
    const agreeablenessEl = document.getElementById('p52-agreeableness');
    const neuroticismEl = document.getElementById('p52-neuroticism');
    const genderEl = document.getElementById('p52-gender');
    
    if (!opennessEl || !conscientiousnessEl || !extraversionEl || 
        !agreeablenessEl || !neuroticismEl || !genderEl) {
      console.warn('Interactive elements not yet in DOM, skipping update');
      return;
    }
    
    const traits = {
      openness: parseFloat(opennessEl.value),
      conscientiousness: parseFloat(conscientiousnessEl.value),
      extraversion: parseFloat(extraversionEl.value),
      agreeableness: parseFloat(agreeablenessEl.value),
      neuroticism: parseFloat(neuroticismEl.value)
    };
    const gender = genderEl.value;
    
    const opennessValueEl = document.getElementById('p52-openness-value');
    const conscientiousnessValueEl = document.getElementById('p52-conscientiousness-value');
    const extraversionValueEl = document.getElementById('p52-extraversion-value');
    const agreeablenessValueEl = document.getElementById('p52-agreeableness-value');
    const neuroticismValueEl = document.getElementById('p52-neuroticism-value');
    
    if (opennessValueEl) opennessValueEl.textContent = traits.openness.toFixed(1);
    if (conscientiousnessValueEl) conscientiousnessValueEl.textContent = traits.conscientiousness.toFixed(1);
    if (extraversionValueEl) extraversionValueEl.textContent = traits.extraversion.toFixed(1);
    if (agreeablenessValueEl) agreeablenessValueEl.textContent = traits.agreeableness.toFixed(1);
    if (neuroticismValueEl) neuroticismValueEl.textContent = traits.neuroticism.toFixed(1);
    
    const score = calculatePrediction(traits, gender);
    
    const scoreEl = document.getElementById('p52-use-score');
    const barEl = document.getElementById('p52-use-bar');
    
    if (scoreEl) {
      scoreEl.textContent = score.toFixed(2);
    }
    
    if (barEl) {
      const percentage = ((score - 1.0) / 4.0) * 100;
      barEl.style.width = `${percentage}%`;
      barEl.style.background = getScoreColor(score);
    }
    
    updateContributions(traits, gender);
    updateInterpretation(score, traits, gender);
    updateDesignTip(traits, score);
  }

  function init() {
    const controlIds = [
      'p52-openness',
      'p52-conscientiousness',
      'p52-extraversion',
      'p52-agreeableness',
      'p52-neuroticism',
      'p52-gender'
    ];
    
    controlIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', updateUI);
      }
    });
    
    updateUI();
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

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
