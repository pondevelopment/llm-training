;(function () {
  'use strict';

  const BASE_TENURE = 8;
  const BASE_PLAN = 14;
  const BASE_CROSS = 15;

  const stageProfiles = {
    none: {
      label: 'No agents (baseline)',
      merges: 1.0,
      lines: 1.0,
      bugfix: 0,
      acceptBase: 1.0,
      guidance: [
        'Log how teams currently brief the agent before investing heavily.',
        'Ask senior engineers to capture simple “here’s the context” templates for everyone else.'
      ],
    },
    optional: {
      label: 'Agent optional (opt-in)',
      merges: 1.26,
      lines: 1.29,
      bugfix: -1.41,
      acceptBase: 1.02,
      guidance: [
        'Watch weekly opt-in rate—the study only saw +26% merges once enough people used the agent.',
        'Give reviewers a lightweight checklist so quality stays flat while output climbs.'
      ],
    },
    default: {
      label: 'Agent default (auto-on)',
      merges: 1.39,
      lines: 1.49,
      bugfix: -2.4,
      acceptBase: 1.05,
      guidance: [
        'Teams that flipped to default shipped ~40% more merges and ~50% more lines once delegation habits stuck.',
        'Reallocate engineering time toward planning and approvals because design/product are already drafting with the agent.'
      ],
    },
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatPercent(value) {
    const rounded = Math.round(value);
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}%`;
  }

  function calculateMetrics(stageKey, tenure, planShare, crossShare) {
    const profile = stageProfiles[stageKey] || stageProfiles.none;
    const tenureFactor = 1 + (tenure - BASE_TENURE) * 0.01;
    const planFactor = 1 + (planShare - BASE_PLAN) * 0.0025;
    const crossFactor = 1 + (crossShare - BASE_CROSS) * 0.0015;

    const mergesIndex = profile.merges * tenureFactor * planFactor;
    const linesIndex = profile.lines * planFactor * crossFactor;

    const acceptRate = clamp(
      profile.acceptBase + ((tenure - BASE_TENURE) / 6.6) * 0.06 + (planShare - BASE_PLAN) * 0.003,
      0.7,
      1.5
    );

    const bugfixDelta = profile.bugfix + (planShare - BASE_PLAN) * -0.05 + (tenure - BASE_TENURE) * -0.03;

    return {
      profile,
      mergesDelta: (mergesIndex - 1) * 100,
      linesDelta: (linesIndex - 1) * 100,
      acceptRate,
      bugfixDelta,
    };
  }

  function updateGuidance(listEl, items) {
    if (!listEl) return;
    listEl.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  }

  function renderSummary(el, metrics, tenure, planShare, crossShare) {
    if (!el) return;
    const qualityPhrase = metrics.bugfixDelta <= -1
      ? 'quality risk is dropping'
      : metrics.bugfixDelta >= 1
        ? 'watch for quality drift'
        : 'quality is holding steady';
  el.textContent = `${metrics.profile.label}: ${tenure.toFixed(1)} yrs avg experience, ${planShare}% plan-first prompts, ${crossShare}% of helpers using agents → ${formatPercent(metrics.mergesDelta)} merges and ${formatPercent(metrics.linesDelta)} lines edited while ${qualityPhrase}.`;
  }

  function init() {
    const root = document.getElementById('p59-explorer');
    if (!root) {
      console.warn('p59 interactive root missing');
      return;
    }

    const stageSelect = root.querySelector('#p59-stage');
    const tenureInput = root.querySelector('#p59-tenure');
    const planInput = root.querySelector('#p59-plan-share');
    const crossInput = root.querySelector('#p59-cross-share');

    const tenureDisplay = root.querySelector('#p59-tenure-display');
    const planDisplay = root.querySelector('#p59-plan-display');
    const crossDisplay = root.querySelector('#p59-cross-display');

    const productivityEl = root.querySelector('#p59-productivity-value');
    const linesEl = root.querySelector('#p59-lines-value');
    const acceptEl = root.querySelector('#p59-accept-value');
    const qualityEl = root.querySelector('#p59-quality-value');
    const summaryEl = root.querySelector('#p59-summary');
    const guidanceEl = root.querySelector('#p59-guidance');

    if (!stageSelect || !tenureInput || !planInput || !crossInput) {
      console.warn('p59 interactive controls missing');
      return;
    }

    const syncDisplays = () => {
      if (tenureDisplay) tenureDisplay.textContent = `${parseFloat(tenureInput.value).toFixed(1)} yrs`;
      if (planDisplay) planDisplay.textContent = `${planInput.value}%`;
      if (crossDisplay) crossDisplay.textContent = `${crossInput.value}%`;
    };

    const render = () => {
      const tenure = parseFloat(tenureInput.value);
      const planShare = parseFloat(planInput.value);
      const crossShare = parseFloat(crossInput.value);
      const stageKey = stageSelect.value;

      const metrics = calculateMetrics(stageKey, tenure, planShare, crossShare);

      if (productivityEl) productivityEl.textContent = formatPercent(metrics.mergesDelta);
      if (linesEl) linesEl.textContent = formatPercent(metrics.linesDelta);
      if (acceptEl) acceptEl.textContent = `${metrics.acceptRate.toFixed(2)}×`;

      if (qualityEl) {
        const label = metrics.bugfixDelta <= -1 ? 'Improving' : metrics.bugfixDelta >= 1 ? 'At risk' : 'Stable';
        qualityEl.textContent = `${label} (${formatPercent(metrics.bugfixDelta)})`;
      }

      renderSummary(summaryEl, metrics, tenure, planShare, crossShare);
      if (guidanceEl) {
        const baseGuidance = metrics.profile.guidance || [];
        const planGoal = planShare >= 14
          ? 'Plan-first requests are already above the 14% study median—lock in a simple review routine so gains stick.'
          : 'Coach teams to start with “plan this” prompts; experienced groups pushed that share above the 14% median and saw smoother reviews.';
        const crossNote = crossShare >= 24
          ? 'Non-engineering partners already match the roughly 24% share seen in the study, so let engineers focus on approvals and integration.'
          : 'About a quarter of heavy users in the study sat outside engineering—invite design/PM/ops partners so engineers can move from typing to reviewing.';
        updateGuidance(guidanceEl, [...baseGuidance, planGoal, crossNote]);
      }
    };

    stageSelect.addEventListener('change', render);
    tenureInput.addEventListener('input', () => {
      syncDisplays();
      render();
    });
    planInput.addEventListener('input', () => {
      syncDisplays();
      render();
    });
    crossInput.addEventListener('input', () => {
      syncDisplays();
      render();
    });

    syncDisplays();
    render();
  }

  function interactiveScript() {
    setTimeout(init, 0);
  }

  interactiveScript.init = init;

  if (typeof module !== 'undefined') {
    module.exports = interactiveScript;
  } else if (typeof window !== 'undefined') {
    window.p59Interactive = interactiveScript;
  }
})();
