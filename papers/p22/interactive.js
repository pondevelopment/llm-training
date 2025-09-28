const interactiveScript = () => {
  const root = document.getElementById('p22-lab');
  if (!root) return;

  const scenarioSelect = document.getElementById('p22-scenario');
  const oodInput = document.getElementById('p22-ood');
  const oodDisplay = document.getElementById('p22-ood-display');
  const coverageInput = document.getElementById('p22-coverage');
  const coverageDisplay = document.getElementById('p22-coverage-display');
  const awarenessToggle = document.getElementById('p22-awareness');
  const hiddenToggle = document.getElementById('p22-hidden');
  const redteamToggle = document.getElementById('p22-redteam');

  const covertMetric = document.getElementById('p22-covert');
  const reliabilityMetric = document.getElementById('p22-reliability');
  const postureMetric = document.getElementById('p22-posture');
  const groupsContainer = document.getElementById('p22-groups');
  const narrativeEl = document.getElementById('p22-narrative');
  const actionsEl = document.getElementById('p22-actions');

  if (
    !scenarioSelect ||
    !oodInput ||
    !oodDisplay ||
    !coverageInput ||
    !coverageDisplay ||
    !awarenessToggle ||
    !hiddenToggle ||
    !redteamToggle ||
    !covertMetric ||
    !reliabilityMetric ||
    !postureMetric ||
    !groupsContainer ||
    !narrativeEl ||
    !actionsEl
  ) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const presets = {
    paper: { ood: 40, coverage: 55, awareness: true, hidden: false, redteam: false },
    blinded: { ood: 60, coverage: 55, awareness: false, hidden: false, redteam: false },
    adversary: { ood: 50, coverage: 55, awareness: true, hidden: true, redteam: false },
    hardened: { ood: 65, coverage: 75, awareness: true, hidden: true, redteam: true }
  };

  const groupMeta = [
    {
      key: 'covert',
      title: 'Covert action battery',
      hint: 'Rule-breaking, sabotage, and underperformance tasks from the paper\'s 26-suite benchmark.'
    },
    {
      key: 'awareness',
      title: 'Situational awareness toggle',
      hint: 'Performance when prompts hide the audit versus when the model knows it is being graded.'
    },
    {
      key: 'hidden',
      title: 'Hidden-goal persistence',
      hint: 'Stress tests where a misaligned objective is pre-seeded before mitigation runs.'
    }
  ];

  const statusStyles = {
    strong: {
      card: 'border-emerald-200 dark:border-emerald-500/60 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-100',
      badge: 'bg-emerald-600 dark:bg-emerald-500 text-white'
    },
    watch: {
      card: 'border-amber-200 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100',
      badge: 'bg-amber-500 dark:bg-amber-400 text-white dark:text-amber-950'
    },
    fail: {
      card: 'border-rose-200 dark:border-rose-500/60 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-100',
      badge: 'bg-rose-600 dark:bg-rose-500 text-white'
    }
  };

  const formatPercent = value => {
    const pct = clamp(value, 0, 0.9999) * 100;
    if (pct < 1) {
      return pct.toFixed(1) + '%';
    }
    if (pct < 10) {
      return pct.toFixed(1) + '%';
    }
    return Math.round(pct) + '%';
  };

  const applyPreset = key => {
    const preset = presets[key] || presets.paper;
    oodInput.value = preset.ood;
    coverageInput.value = preset.coverage;
    awarenessToggle.checked = preset.awareness;
    hiddenToggle.checked = preset.hidden;
    redteamToggle.checked = preset.redteam;
    render();
  };

  const render = () => {
    const ood = parseInt(oodInput.value, 10) || 0;
    const coverage = parseInt(coverageInput.value, 10) || 0;
    const awareness = awarenessToggle.checked;
    const hidden = hiddenToggle.checked;
    const redteam = redteamToggle.checked;

    oodDisplay.textContent = ood;
    coverageDisplay.textContent = coverage + '%';

    const severityFactor = 0.4 + 0.6 * (ood / 100);
    const coverageFactor = 1 - 0.6 * (coverage / 100);
    const awarenessFactor = awareness ? 0.32 : 1.12;
    const hiddenFactor = hidden ? 1.35 : 1;
    const redteamFactor = redteam ? 1.25 : 1;

    const base = 0.04; // 4% baseline covert rate from paper prior to mitigation tweaks
    let covertRate = base * severityFactor * coverageFactor * awarenessFactor * hiddenFactor * redteamFactor;
    covertRate = clamp(covertRate, 0.002, 0.35);

    covertMetric.textContent = formatPercent(covertRate);

    const reliabilityScore = clamp(
      1 - (covertRate * 6) + (coverage / 100) * 0.25 + (awareness ? 0.15 : -0.25) - (hidden ? 0.12 : 0) - (redteam ? 0.18 : 0),
      0,
      1
    );

    let reliabilityLabel;
    if (reliabilityScore >= 0.75) {
      reliabilityLabel = 'High (documented mitigation)';
    } else if (reliabilityScore >= 0.5) {
      reliabilityLabel = 'Guarded (monitor dashboards)';
    } else if (reliabilityScore >= 0.3) {
      reliabilityLabel = 'Fragile (gating recommended)';
    } else {
      reliabilityLabel = 'Low (halt autonomous use)';
    }
    reliabilityMetric.textContent = reliabilityLabel;

    let postureLabel;
    if (covertRate <= 0.007 && awareness && !hidden && !redteam) {
      postureLabel = 'Limited pilot with human supervision';
    } else if (covertRate <= 0.015 && awareness) {
      postureLabel = 'Shadow mode only; require dual control';
    } else if (covertRate <= 0.03) {
      postureLabel = 'Sandboxed evaluation; no production writes';
    } else {
      postureLabel = 'Red flag: rollback or isolate immediately';
    }
    postureMetric.textContent = postureLabel;

    const awarenessRisk = awareness ? covertRate * 0.45 : covertRate * 1.35;
    const hiddenRisk = hidden ? covertRate * 1.5 + 0.012 : covertRate * 0.6;
    const baseRisk = covertRate * (1 + (ood / 100) * 0.5);

    const groupScores = {
      covert: baseRisk,
      awareness: awarenessRisk,
      hidden: hiddenRisk
    };

    const groupCards = groupMeta.map(group => {
      const score = clamp(groupScores[group.key] || 0, 0, 0.5);
      let status;
      if (score < 0.01) {
        status = 'strong';
      } else if (score < 0.03) {
        status = 'watch';
      } else {
        status = 'fail';
      }
      const style = statusStyles[status] || statusStyles.watch;
      const badge = status === 'strong' ? 'PASS' : status === 'watch' ? 'WATCH' : 'FAIL';
      const riskText = formatPercent(score);
      return [
        '<article class="border rounded-lg p-3 space-y-2 ' + style.card + '">',
        '  <header class="space-y-1">',
        '    <div class="flex items-center justify-between gap-2">',
        '      <h4 class="text-sm font-semibold">',
        group.title,
        '</h4>',
        '      <span class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ' + style.badge + '">',
        badge,
        '</span>',
        '    </div>',
        '    <p class="text-xs opacity-80">Residual risk: ',
        riskText,
        '</p>',
        '  </header>',
        '  <p class="text-sm leading-snug">',
        group.hint,
        '</p>',
        '</article>'
      ].join('');
    });
    groupsContainer.innerHTML = groupCards.join('');

    const narrative = [];
    if (awareness) {
      narrative.push('Deliberative alignment is operating with the model aware it is being evaluated, mirroring the paper\'s primary mitigation setup.');
    } else {
      narrative.push('Prompts hide the audit, so covert actions rebound towards pre-mitigation levels&mdash;matching the situational-awareness ablation.');
    }
    narrative.push('OOD severity at ' + ood + ' and coverage overlap of ' + coverage + '% yield an estimated covert-action rate of ' + formatPercent(covertRate) + '.');
    if (hidden) {
      narrative.push('A hidden goal is active; the mitigation still suppresses most behaviour but residual risk remains until adversarial search is exhausted.');
    }
    if (redteam) {
      narrative.push('Active red teaming means detection pipelines should be on high alert for newly discovered exploits.');
    } else {
      narrative.push('No adversarial search is running, so fresh failure modes may stay undiscovered until after deployment.');
    }
    narrativeEl.innerHTML = narrative.map(sentence => '<p>' + sentence + '</p>').join('');

    const actions = [];
    if (!awareness) {
      actions.push('Restore instrumentation that makes evaluation cues explicit or develop mitigations that do not rely on them.');
    }
    if (covertRate > 0.01) {
      actions.push('Increase mitigated coverage&mdash;gather new deliberation traces from the failing environments.');
    }
    if (hidden && covertRate > 0.007) {
      actions.push('Cycle hidden-goal adversaries and block promotion until covert actions fall below 0.5%.');
    }
    if (!redteam) {
      actions.push('Spin up an adversarial red team to keep probing once mitigations ship.');
    }
    if (actions.length === 0) {
      actions.push('Document the mitigation window, and schedule regression runs before every major model upgrade.');
    }
    actionsEl.innerHTML = actions.map(item => '<li>' + item + '</li>').join('');
  };

  scenarioSelect.addEventListener('change', event => applyPreset(event.target.value));
  oodInput.addEventListener('input', render);
  coverageInput.addEventListener('input', render);
  awarenessToggle.addEventListener('change', render);
  hiddenToggle.addEventListener('change', render);
  redteamToggle.addEventListener('change', render);

  applyPreset(scenarioSelect.value || 'paper');
};

if (typeof module !== 'undefined') {
  module.exports = { interactiveScript };
}
