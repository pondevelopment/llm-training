(function() {
  'use strict';
  
  // Base effects from paper (percentage changes)
  const BASE_JUNIOR_DECLINE_6Q = -9.0; // -9% after 6 quarters (triple-diff estimate)
  const BASE_SENIOR_CHANGE_6Q = 0.5;   // Slight positive trend in adopters
  const BASE_HIRING_REDUCTION = -5.0;  // -5 fewer junior hires per quarter
  const BASE_SEPARATION_CHANGE = -0.5; // Separations decrease slightly (retention up)
  const BASE_PROMOTION_CHANGE = 0.2;   // Minimal promotion effect
  
  // Exposure multipliers (from heterogeneity analysis)
  const EXPOSURE_MULTIPLIERS = {
    1: 0.3,   // Low exposure (hands-on work): minimal effect
    2: 1.0,   // Medium exposure: baseline effect
    3: 1.8    // High exposure (routine cognitive): concentrated decline
  };
  
  // Education tier multipliers (U-shaped pattern)
  const EDUCATION_MULTIPLIERS = {
    1: 0.7,   // Community college: less affected (hands-on technical skills)
    2: 1.3,   // Mid-tier: steepest decline (routine cognitive skills commoditized)
    3: 0.6    // Elite tier: less affected (signaling adaptability)
  };
  
  // Temporal scaling (effects emerge gradually)
  function temporalScale(quarters) {
    if (quarters === 0) return 0;
    if (quarters <= 2) return 0.2;
    if (quarters <= 4) return 0.6;
    if (quarters <= 6) return 1.0;
    if (quarters <= 8) return 1.1; // Slight increase to -10% by 8Q
    return 1.2; // Long-term stabilization
  }
  
  function init() {
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const firmSizeEl = document.getElementById('p54-firm-size');
    const juniorShareEl = document.getElementById('p54-junior-share');
    const exposureEl = document.getElementById('p54-occupation-exposure');
    const educationEl = document.getElementById('p54-education-tier');
    const quartersEl = document.getElementById('p54-quarters-post-adoption');
    
    if (!firmSizeEl || !juniorShareEl || !exposureEl || !educationEl || !quartersEl) {
      console.warn('P54 interactive elements not found in DOM');
      return;
    }
    
    // Attach listeners
    firmSizeEl.addEventListener('input', updateUI);
    juniorShareEl.addEventListener('input', updateUI);
    exposureEl.addEventListener('input', updateUI);
    educationEl.addEventListener('input', updateUI);
    quartersEl.addEventListener('input', updateUI);
    
    updateUI(); // Initial render
  }
  
  function updateUI() {
    const firmSize = parseInt(document.getElementById('p54-firm-size').value);
    const juniorSharePct = parseInt(document.getElementById('p54-junior-share').value);
    const exposure = parseInt(document.getElementById('p54-occupation-exposure').value);
    const educationTier = parseInt(document.getElementById('p54-education-tier').value);
    const quarters = parseInt(document.getElementById('p54-quarters-post-adoption').value);
    
    // Update value displays
    document.getElementById('p54-firm-size-val').textContent = firmSize;
    document.getElementById('p54-junior-share-val').textContent = juniorSharePct;
    
    const exposureLabels = { 1: 'Low', 2: 'Medium', 3: 'High' };
    document.getElementById('p54-occupation-exposure-val').textContent = exposureLabels[exposure];
    
    const educationLabels = { 1: 'Community college', 2: 'Mid-tier', 3: 'Elite-tier' };
    document.getElementById('p54-education-tier-val').textContent = educationLabels[educationTier];
    
    document.getElementById('p54-quarters-post-adoption-val').textContent = quarters;
    
    // Calculate effects
    const juniorCount = Math.round(firmSize * (juniorSharePct / 100));
    const seniorCount = firmSize - juniorCount;
    
    const exposureMult = EXPOSURE_MULTIPLIERS[exposure];
    const educationMult = EDUCATION_MULTIPLIERS[educationTier];
    const timeMult = temporalScale(quarters);
    
    const juniorChangePct = BASE_JUNIOR_DECLINE_6Q * exposureMult * educationMult * timeMult;
    const seniorChangePct = BASE_SENIOR_CHANGE_6Q * timeMult;
    
    const juniorChangeAbs = Math.round(juniorCount * (juniorChangePct / 100));
    const seniorChangeAbs = Math.round(seniorCount * (seniorChangePct / 100));
    
    const hiringChange = BASE_HIRING_REDUCTION * exposureMult * timeMult;
    const separationChange = BASE_SEPARATION_CHANGE * timeMult;
    const promotionChange = BASE_PROMOTION_CHANGE * timeMult;
    
    const newJuniorCount = juniorCount + juniorChangeAbs;
    const newSeniorCount = seniorCount + seniorChangeAbs;
    const newSeniorityRatio = newJuniorCount / newSeniorCount;
    
    // Update displays
    const juniorChangeEl = document.getElementById('p54-junior-change');
    juniorChangeEl.textContent = (juniorChangePct >= 0 ? '+' : '') + juniorChangePct.toFixed(1) + '%';
    juniorChangeEl.style.color = juniorChangePct < -5 ? getCssVar('--tone-rose-strong', '#dc2626') : juniorChangePct < 0 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--color-muted', '#6b7280');
    
    document.getElementById('p54-junior-change-label').textContent = 
      juniorChangePct < -7 ? 'Severe decline' : juniorChangePct < -3 ? 'Moderate decline' : juniorChangePct < 0 ? 'Slight decline' : 'Stable';
    
    document.getElementById('p54-junior-absolute').textContent = 
      (juniorChangeAbs >= 0 ? '+' : '') + juniorChangeAbs + ' positions';
    
    const seniorChangeEl = document.getElementById('p54-senior-change');
    seniorChangeEl.textContent = (seniorChangePct >= 0 ? '+' : '') + seniorChangePct.toFixed(1) + '%';
    seniorChangeEl.style.color = getCssVar('--color-muted', '#6b7280');
    
    document.getElementById('p54-senior-change-label').textContent = 'Largely stable';
    document.getElementById('p54-senior-absolute').textContent = 
      (seniorChangeAbs >= 0 ? '+' : '') + seniorChangeAbs + ' position' + (Math.abs(seniorChangeAbs) === 1 ? '' : 's');
    
    document.getElementById('p54-hiring-velocity').textContent = 
      hiringChange.toFixed(1) + ' hires/quarter';
    document.getElementById('p54-separation-change').textContent = 
      (separationChange >= 0 ? '+' : '') + separationChange.toFixed(1) + 'pp';
    document.getElementById('p54-promotion-change').textContent = 
      (promotionChange >= 0 ? '+' : '') + promotionChange.toFixed(1) + 'pp';
    
    document.getElementById('p54-seniority-ratio').textContent = newSeniorityRatio.toFixed(2);
    
    // Update mechanism explanation
    updateMechanismExplanation(juniorChangePct, hiringChange, separationChange, quarters);
    
    // Update education explanation
    updateEducationExplanation(educationTier, educationMult, juniorChangePct);
    
    // Update scenario comparison table
    updateScenarioTable(firmSize, juniorSharePct, exposure, educationTier);
    
    // Update implications
    updateImplications(juniorChangePct, newSeniorityRatio, quarters, exposure);
  }
  
  function updateMechanismExplanation(juniorChangePct, hiringChange, separationChange, quarters) {
    const el = document.getElementById('p54-mechanism-explanation');
    if (!el) return;
    
    let html = '<p>';
    
    if (quarters === 0) {
      html += 'At baseline (pre-adoption), no GenAI effects are present. Junior and senior employment follow parallel trends, consistent with the paper\'s 2015-2022 control period.';
    } else if (quarters <= 2) {
      html += `Early adoption phase (${quarters}Q post-GenAI): Effects just beginning to emerge. Firms are implementing GenAI integrator roles but haven't yet adjusted hiring pipelines substantially. Junior employment shows minimal change (${juniorChangePct.toFixed(1)}%).`;
    } else if (quarters <= 6) {
      html += `Mid-adoption phase (${quarters}Q post-GenAI): Junior employment declining ${Math.abs(juniorChangePct).toFixed(1)}% relative to non-adopters. This mirrors the paper's triple-difference estimates showing −9% at 6 quarters. `;
      html += `<strong>Mechanism:</strong> Reduced hiring (${hiringChange.toFixed(1)} fewer hires/quarter) drives the entire effect. Separations actually improved by ${Math.abs(separationChange).toFixed(1)}pp (better retention), but hiring slowdown dominates.`;
    } else {
      html += `Long-term steady state (${quarters}Q post-GenAI): Junior employment stabilized at ${Math.abs(juniorChangePct).toFixed(1)}% below baseline, matching the paper's event-study finding of −8% to −10% decline 8+ quarters post-adoption. `;
      html += `Firms have fully adjusted hiring pipelines to account for GenAI automation of routine tasks. The persistent gap suggests permanent structural change rather than temporary shock.`;
    }
    
    html += '</p>';
    
    if (quarters > 0) {
      html += '<p class="mt-2"><strong>Why not layoffs?</strong> ';
      html += 'Improved retention (separations down) indicates firms aren\'t actively shedding junior workers. Instead, they\'re "aging in place"—keeping existing juniors while reducing new entry-level hiring. This pattern suggests firms view GenAI as substituting for <em>future</em> junior roles (automation of onboarding tasks) rather than displacing current employees.';
      html += '</p>';
    }
    
    el.innerHTML = html;
  }
  
  function updateEducationExplanation(tier, multiplier, juniorChangePct) {
    const el = document.getElementById('p54-education-explanation');
    if (!el) return;
    
    const tierLabels = {
      1: 'Community colleges and vocational programs',
      2: 'Mid-tier institutions (state universities, regional colleges)',
      3: 'Elite-tier institutions (Ivy League, top research universities)'
    };
    
    let html = `<p><strong>Current selection: ${tierLabels[tier]}</strong> — Effect multiplier: ${multiplier.toFixed(1)}× baseline (${juniorChangePct.toFixed(1)}% junior decline).</p>`;
    
    if (tier === 1) {
      html += '<p><strong>Why community college grads are less affected (0.7× multiplier):</strong> ';
      html += 'Community college programs emphasize hands-on technical skills (equipment operation, physical inspection, direct customer service) that GenAI struggles to automate. ';
      html += 'Paradoxically, roles requiring less formal education but more physical/interpersonal interaction are more resistant to AI displacement than white-collar routine cognitive work.';
      html += '</p>';
    } else if (tier === 2) {
      html += '<p><strong>Why mid-tier grads face steepest decline (1.3× multiplier):</strong> ';
      html += 'These institutions traditionally prepared students for routine cognitive work—exactly what GenAI automates. Mid-tier graduates\' comparative advantage in tasks like code debugging, document formatting, data entry is eroded when AI can perform these at scale. ';
      html += 'Unlike elite grads (who signal adaptability) or community college grads (who have hands-on technical skills AI cannot replicate), mid-tier grads occupy the "automation sweet spot" where GenAI is most effective.';
      html += '</p>';
      html += '<p class="mt-2 text-xs"><em>Policy implication:</em> Mid-tier institutions should pivot curricula toward AI-resistant skills (creative synthesis, stakeholder management, ambiguous problem framing) and away from routine cognitive tasks that students will never perform manually in their careers.</p>';
    } else {
      html += '<p><strong>Why elite grads are less affected (0.6× multiplier):</strong> ';
      html += 'Top-tier credentials signal adaptability and problem-solving ability beyond routine task execution. Employers view these grads as capable of quickly learning to work <em>with</em> GenAI tools rather than being replaced <em>by</em> them. ';
      html += 'Additionally, elite grads often enter at higher seniority levels (analyst vs. junior analyst), which are less exposed to automation.';
      html += '</p>';
    }
    
    el.innerHTML = html;
  }
  
  function updateScenarioTable(firmSize, juniorSharePct, exposure, educationTier) {
    const el = document.getElementById('p54-scenario-table');
    if (!el) return;
    
    const scenarios = [
      { label: 'Current configuration', firmSize, juniorSharePct, exposure, educationTier, quarters: 6 },
      { label: 'Baseline (non-adopter)', firmSize, juniorSharePct, exposure, educationTier, quarters: 0 },
      { label: 'High-exposure occupation', firmSize, juniorSharePct, exposure: 3, educationTier, quarters: 6 },
      { label: 'Low-exposure occupation', firmSize, juniorSharePct, exposure: 1, educationTier, quarters: 6 },
      { label: 'Community college workers', firmSize, juniorSharePct, exposure, educationTier: 1, quarters: 6 },
      { label: 'Mid-tier workers', firmSize, juniorSharePct, exposure, educationTier: 2, quarters: 6 },
      { label: 'Elite-tier workers', firmSize, juniorSharePct, exposure, educationTier: 3, quarters: 6 }
    ];
    
    let html = '';
    scenarios.forEach((scenario, idx) => {
      const exposureMult = EXPOSURE_MULTIPLIERS[scenario.exposure];
      const educationMult = EDUCATION_MULTIPLIERS[scenario.educationTier];
      const timeMult = temporalScale(scenario.quarters);
      
      const juniorChangePct = BASE_JUNIOR_DECLINE_6Q * exposureMult * educationMult * timeMult;
      const seniorChangePct = BASE_SENIOR_CHANGE_6Q * timeMult;
      const hiringChange = BASE_HIRING_REDUCTION * exposureMult * timeMult;
      
      const rowClass = idx === 0 ? 'bg-[color:var(--accent-faint)] font-semibold' : '';
      html += `<tr class="${rowClass} border-b border-divider">`;
      html += `<td class="py-2">${scenario.label}</td>`;
      html += `<td class="text-right py-2 font-mono">${juniorChangePct.toFixed(1)}%</td>`;
      html += `<td class="text-right py-2 font-mono">${seniorChangePct >= 0 ? '+' : ''}${seniorChangePct.toFixed(1)}%</td>`;
      html += `<td class="text-right py-2 font-mono">${hiringChange.toFixed(1)}/qtr</td>`;
      html += '</tr>';
    });
    
    el.innerHTML = html;
  }
  
  function updateImplications(juniorChangePct, seniorityRatio, quarters, exposure) {
    const el = document.getElementById('p54-implications');
    if (!el) return;
    
    let html = '';
    
    if (Math.abs(juniorChangePct) < 3) {
      html += '<p><strong>Low risk:</strong> Junior employment effects are minimal under this configuration. ';
      if (quarters === 0) {
        html += 'Pre-adoption baseline shows no GenAI impact. Use this as a control benchmark.';
      } else {
        html += 'Low occupation exposure or short time since adoption limits impact. Monitor trends as adoption matures.';
      }
      html += '</p>';
    } else if (Math.abs(juniorChangePct) < 7) {
      html += '<p><strong>Moderate risk:</strong> Junior employment declining ' + Math.abs(juniorChangePct).toFixed(1) + '%, approaching the paper\'s baseline findings. ';
      html += 'Key actions:</p>';
      html += '<ul class="list-disc ml-5 mt-1 space-y-1">';
      html += '<li>Track seniority ratio quarterly (currently ' + seniorityRatio.toFixed(2) + '). Target: maintain >0.50 to preserve knowledge transfer pathways.</li>';
      html += '<li>Audit which junior tasks are being automated. Redesign entry-level roles around AI validation/oversight rather than task execution.</li>';
      html += '<li>Benchmark hiring velocity against pre-adoption baseline. If hiring slowdown exceeds −5 hires/quarter, you\'re replicating paper\'s findings.</li>';
      html += '</ul>';
    } else {
      html += '<p><strong>High risk:</strong> Junior employment declining ' + Math.abs(juniorChangePct).toFixed(1) + '%, exceeding paper\'s baseline estimates. ';
      html += 'This configuration (high occupation exposure + mid-tier education + mature adoption) represents worst-case scenario for entry-level labor demand.</p>';
      html += '<p class="mt-2"><strong>Urgent actions:</strong></p>';
      html += '<ul class="list-disc ml-5 mt-1 space-y-1">';
      html += '<li><strong>Succession planning crisis:</strong> Seniority ratio ' + seniorityRatio.toFixed(2) + ' indicates severe imbalance. When current seniors retire in 5-10 years, you\'ll lack mid-level talent. Start "AI apprenticeship" programs now to rebuild junior pipeline.</li>';
      html += '<li><strong>Operational inefficiency:</strong> If seniors are doing routine work with AI assistance (the paper\'s mechanism), you\'re paying senior salaries for junior-level output. Create dedicated "AI operator" roles at junior salary bands to capture efficiency gains.</li>';
      html += '<li><strong>Reputational risk:</strong> Campus recruiting will suffer if word spreads that your firm doesn\'t hire entry-level. Alumni networks at mid-tier institutions will flag you as "GenAI-only," creating talent pipeline issues beyond current cohort.</li>';
      html += '</ul>';
    }
    
    if (exposure === 3) {
      html += '<p class="mt-3 text-xs"><strong>High-exposure occupation note:</strong> Routine cognitive tasks (coding, document review, data analysis) show concentrated junior decline in the paper. If your firm operates in these domains, the simulated effects closely match empirical findings. Consider diversifying into lower-exposure work to hedge against automation risk.</p>';
    }
    
    el.innerHTML = html;
  }
  
  // Export for paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }
  
  // Attach helpers for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;
  
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
