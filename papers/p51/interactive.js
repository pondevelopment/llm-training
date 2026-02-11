(function() {
  'use strict';

  const getCssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

  // Constants from study (Kim et al., 2025)
  const AI_ADOPTION_COEFF = -0.324;      // β effect on psychological safety
  const PSYCH_SAFETY_COEFF = -0.211;     // β effect on depression
  const ETHICAL_LEADERSHIP_COEFF = 0.211; // β moderation effect
  const BASELINE_SAFETY = 3.3;            // Mean from study
  const BASELINE_DEPRESSION = 1.86;       // Mean from study

  function init() {
    const aiSlider = document.getElementById('p51-ai-adoption');
    const elSlider = document.getElementById('p51-ethical-leadership');

    if (!aiSlider || !elSlider) {
      console.warn('Interactive elements not yet in DOM, skipping');
      return;
    }

    // Update displays on input
    aiSlider.addEventListener('input', updateUI);
    elSlider.addEventListener('input', updateUI);

    // Initial render
    updateUI();
  }

  function updateUI() {
    const aiSlider = document.getElementById('p51-ai-adoption');
    const elSlider = document.getElementById('p51-ethical-leadership');
    
    if (!aiSlider || !elSlider) return;

    const aiValue = parseInt(aiSlider.value) / 100; // 0 to 1
    const elValue = parseInt(elSlider.value) / 100; // 0 to 1

    // Update slider displays
    document.getElementById('p51-ai-val').textContent = aiSlider.value + '%';
    document.getElementById('p51-el-val').textContent = elSlider.value + '%';

    // Compute outcomes
    // Psychological safety: decreases with AI adoption, buffered by ethical leadership
    // Base: BASELINE_SAFETY + (AI_ADOPTION_COEFF * aiValue) [direct effect]
    // Moderation: (ETHICAL_LEADERSHIP_COEFF * elValue) [reduces the AI negative effect]
    const directAIEffectOnSafety = AI_ADOPTION_COEFF * aiValue;
    const moderationEffect = ETHICAL_LEADERSHIP_COEFF * elValue * aiValue; // interaction term
    const psychologicalSafety = BASELINE_SAFETY + directAIEffectOnSafety + moderationEffect;
    const safetyClamped = Math.max(0, Math.min(5, psychologicalSafety)); // clamp to 0-5

    // Depression: increases with AI (via reduced safety), mitigated by ethical leadership
    // Indirect effect: psychological safety → depression
    // β = -0.211 means: when safety drops below baseline, depression rises
    const depressionFromSafetyLoss = PSYCH_SAFETY_COEFF * (safetyClamped - BASELINE_SAFETY);
    const depression = BASELINE_DEPRESSION + depressionFromSafetyLoss;
    const depressionClamped = Math.max(0, Math.min(5, depression)); // clamp to 0-5

    // Leadership protection: how much ethical leadership reduced harm
    // Protection only exists when there IS ethical leadership (EL > 0)
    // Compare: depression WITHOUT moderation vs WITH moderation
    const depressionWithoutModeration = BASELINE_DEPRESSION + PSYCH_SAFETY_COEFF * (AI_ADOPTION_COEFF * aiValue);
    const depressionWithoutModerationClamped = Math.max(0, Math.min(5, depressionWithoutModeration));
    
    // Protection = how much EL reduced depression (only if EL > 0)
    const protectionAmount = Math.max(0, depressionWithoutModerationClamped - depressionClamped);
    const maxPossibleHarm = Math.max(0.01, depressionWithoutModerationClamped - BASELINE_DEPRESSION);
    
    // If EL is zero, protection is zero (no leadership = no buffering)
    const protectionPercent = elValue > 0 ? (protectionAmount / maxPossibleHarm) * 100 : 0;

    // Update outcome displays
    document.getElementById('p51-safety-score').textContent = safetyClamped.toFixed(1);
    document.getElementById('p51-depression-score').textContent = depressionClamped.toFixed(1);
    document.getElementById('p51-protection-score').textContent = '+' + Math.round(protectionPercent) + '%';

    // Update bars
    document.getElementById('p51-safety-bar').style.width = (safetyClamped / 5) * 100 + '%';
    document.getElementById('p51-depression-bar').style.width = (depressionClamped / 5) * 100 + '%';
    document.getElementById('p51-protection-bar').style.width = protectionPercent + '%';

    // Update colors based on values
    const safetyColor = safetyClamped > 3.5 ? getCssVar('--tone-emerald-strong', '#10b981') : safetyClamped > 2.5 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--tone-rose-strong', '#ef4444');
    const depressionColor = depressionClamped < 2 ? getCssVar('--tone-emerald-strong', '#10b981') : depressionClamped < 3 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--tone-rose-strong', '#ef4444');
    const protectionColor = elValue > 0.5 ? getCssVar('--tone-indigo-strong', '#6366f1') : getCssVar('--color-muted', '#9ca3af');

    document.getElementById('p51-outcome-safety').style.borderColor = safetyColor;
    document.getElementById('p51-safety-bar').style.backgroundColor = safetyColor;
    document.getElementById('p51-outcome-depression').style.borderColor = depressionColor;
    document.getElementById('p51-depression-bar').style.backgroundColor = depressionColor;
    document.getElementById('p51-protection-bar').style.backgroundColor = protectionColor;

    // Update interpretation text
    updateInterpretation(aiValue, elValue, safetyClamped, depressionClamped, protectionPercent);
  }

  function updateInterpretation(aiValue, elValue, safety, depression, protection) {
    const interpretEl = document.getElementById('p51-interpretation');
    if (!interpretEl) return;

    let interpretation = '';

    if (aiValue < 0.25) {
      interpretation = 'Minimal AI deployment. Psychological safety remains high, depression stays low regardless of leadership.';
    } else if (aiValue < 0.75) {
      if (elValue > 0.75) {
        interpretation = 'Moderate AI adoption with strong ethical leadership. Leaders actively manage uncertainty, involve employees in decisions, and maintain transparency. Psychological safety holds steady, depression stays manageable. This is the sweet spot—organizations can adopt AI while protecting well-being.';
      } else if (elValue > 0.25) {
        interpretation = 'Moderate AI adoption with some ethical leadership. Benefits tempered; safety and depression trends depend on consistency of leadership practices. Gaps in communication or fairness will erode safety.';
      } else {
        interpretation = 'Moderate AI adoption without ethical leadership. Employees experience uncertainty and reduced autonomy. Psychological safety declines, depression rises. This is where preventable mental health harm occurs.';
      }
    } else {
      if (elValue > 0.75) {
        interpretation = 'High AI adoption paired with strong ethical leadership. Leaders excel at uncertainty reduction (clear communication about AI limits and human roles), resource protection (reskilling, fair evaluation), and demands buffering (realistic timelines, recognition of transition challenges). Even intense AI deployment need not harm mental health.';
      } else if (elValue > 0.25) {
        interpretation = 'High AI adoption with moderate ethical leadership. Leadership efforts help but may struggle to fully counter pervasive uncertainty and rapid role shifts. Pockets of safety remain, but organizational-wide psychological injury likely.';
      } else {
        interpretation = 'High AI adoption with minimal ethical leadership. Psychological safety erodes significantly. Employees feel unsupported, fear job loss, lack voice in changes. Depression and turnover risk are substantial. Organizations at this point face retention crises and organizational culture damage.';
      }
    }

    interpretEl.textContent = interpretation;
  }

  // Export for paperLoader
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
