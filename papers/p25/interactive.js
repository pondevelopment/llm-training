const interactiveScript = () => {
  const root = document.getElementById('p25-lab');
  if (!root) return;

  const scenarioSelect = document.getElementById('p25-scenario');
  const immediacyInput = document.getElementById('p25-immediacy');
  const visibilityInput = document.getElementById('p25-visibility');
  const payoutInput = document.getElementById('p25-payout');
  const leadingToggle = document.getElementById('p25-leading');
  const recognitionToggle = document.getElementById('p25-recognition');
  const debriefToggle = document.getElementById('p25-debrief');

  const behaviorEl = document.getElementById('p25-behavior');
  const riskEl = document.getElementById('p25-risk');
  const riskChipEl = document.getElementById('p25-risk-chip');
  const horizonEl = document.getElementById('p25-horizon');
  const flagsEl = document.getElementById('p25-flags');
  const signalEl = document.getElementById('p25-signal');
  const summaryEl = document.getElementById('p25-summary');
  const actionsEl = document.getElementById('p25-actions');

  if (!scenarioSelect || !immediacyInput || !visibilityInput || !payoutInput ||
      !leadingToggle || !recognitionToggle || !debriefToggle ||
      !behaviorEl || !riskEl || !riskChipEl || !horizonEl || !flagsEl || !signalEl || !summaryEl || !actionsEl) {
    return;
  }

  const scenarios = {
    sales: {
      label: 'Enterprise sales quotas',
      hope: 'Grow annual recurring revenue while improving multi-year renewals.',
      baseRisk: 0.64,
      behaviors: {
        high: 'Reps chase end-of-quarter bookings with deep discounts and hurried handoffs.',
        medium: 'Teams juggle new logos against renewal prep, often slipping discovery depth.',
        low: 'Account pods sequence deals around lifetime value and renewal health.'
      },
      flags: {
        high: [
          'Discount approvals spike in the final week of the quarter.',
          'Customer success finds out about deals only after signatures land.',
          'Renewal forecasts surprise finance despite “green” pipeline dashboards.'
        ],
        medium: [
          'Pipeline hygiene drifts mid-quarter and coaching time shifts to hero sellers.',
          'Managers celebrate largest deal size without reviewing retention risk.'
        ],
        low: [
          'Win/loss reviews include renewal risk scoring and playbook updates.',
          'Leaders spotlight accounts with disciplined multi-threading and margin control.'
        ]
      },
      horizon: {
        high: '3–5 months until discount-first behavior sets in.',
        medium: '6–9 months before renewal health noticeably slips.',
        low: '12–18 months; culture is resilient if vigilance stays high.'
      },
      baseSummary: 'You are hoping for disciplined pipeline management and durable renewals.',
      baseActions: [
        'Blend bonuses: tie 30–40% to trailing-12 renewal value alongside new bookings.',
        'Publish a clutch metric that weights margin, multi-threading, and renewal health equally.'
      ]
    },
    product: {
      label: 'Product roadmap velocity',
      hope: 'Ship customer-loved outcomes while preserving product quality and learning loops.',
      baseRisk: 0.58,
      behaviors: {
        high: 'Teams rush feature count to hit OKR numerics, skipping discovery and QA gates.',
        medium: 'Product squads trade validation depth for roadmap commitments when crunch time hits.',
        low: 'Squads sequence discovery, delivery, and instrumentation even under pressure.'
      },
      flags: {
        high: [
          'Launch reviews celebrate velocity while defect queues quietly grow.',
          'Customer interviews get cancelled near quarter end to free up build time.',
          'Shadow feature flags linger in production to hit delivery checkboxes.'
        ],
        medium: [
          'Backlog grooming downgrades research tickets in favour of roadmap commitments.',
          'Incident postmortems repeat “deadline pressure” as a root cause.'
        ],
        low: [
          'Success metrics highlight adoption depth, not just shipped count.',
          'Leadership praises teams for pivoting features after invalidated assumptions.'
        ]
      },
      horizon: {
        high: '4–6 months before quality regression becomes visible to customers.',
        medium: '7–10 months before learning loops decay.',
        low: '15+ months if validation rituals stay protected.'
      },
      baseSummary: 'You are hoping for validated learning and product quality, not just raw velocity.',
      baseActions: [
        'Reserve OKR slots for learning milestones (customer proof, experiment results).',
        'Fund a “quality gate” guild that can veto launches lacking test coverage.'
      ]
    },
    support: {
      label: 'Customer support SLAs',
      hope: 'Resolve issues with empathy and root-cause fixes while maintaining responsiveness.',
      baseRisk: 0.62,
      behaviors: {
        high: 'Agents race to close tickets to beat response clocks, causing repeat contacts.',
        medium: 'Teams balance handle time with resolution quality, but coaching suffers in spikes.',
        low: 'Support pods invest in first-contact resolution and knowledge sharing.'
      },
      flags: {
        high: [
          'Repeat contact rate rises while average handle time keeps falling.',
          'Agents park complex cases in parking queues to protect their metrics.',
          'CSAT comments applaud speed but complain about unresolved issues.'
        ],
        medium: [
          'Knowledge base edits lag behind product changes.',
          'Escalation queues see more “lack of time” notes from front-line agents.'
        ],
        low: [
          'Supervisors reward thorough call notes and documented root causes.',
          'Coaching time blocks stay untouched even during volume spikes.'
        ]
      },
      horizon: {
        high: '3–4 months before CX metrics decline.',
        medium: '6–9 months before customers notice inconsistent answers.',
        low: '12+ months with maintained training cadence.'
      },
      baseSummary: 'You are hoping for durable customer satisfaction, not just faster handle times.',
      baseActions: [
        'Incentivise first-contact resolution and documented fixes, not just response speed.',
        'Run weekly calibration sessions on qualitative customer feedback.'
      ]
    },
    compliance: {
      label: 'Regulatory compliance',
      hope: 'Build a speak-up culture that surfaces risks and closes gaps before audits.',
      baseRisk: 0.66,
      behaviors: {
        high: 'Teams treat compliance as paperwork, hiding findings to avoid delays.',
        medium: 'Managers prioritise audit deadlines, postponing remediation documentation.',
        low: 'Employees escalate edge cases early and own remediation follow-through.'
      },
      flags: {
        high: [
          'Issues discovered in audits were already known but never escalated.',
          'Anonymous hotline reports spike while official channels stay quiet.',
          'Remediation tasks close on paper yet lack technical evidence.'
        ],
        medium: [
          'Control owners defer testing until quarter end.',
          'Audit readouts focus on “on time” metrics with little root-cause analysis.'
        ],
        low: [
          'Leaders reward teams that self-identify issues and fix them ahead of schedule.',
          'Risk dashboards show trend data on near-misses and mitigation speed.'
        ]
      },
      horizon: {
        high: '2–4 months before silence becomes the norm.',
        medium: '6–9 months before regulators spot gaps.',
        low: '12–18 months with proactive governance rituals.'
      },
      baseSummary: 'You are hoping for transparent risk surfacing and remedial ownership.',
      baseActions: [
        'Separate audit completion metrics from career impact; reward surfaced issues.',
        'Fund quarterly “speak-up” retros that review near misses without penalty.'
      ]
    }
  };

  const sliderAdjustments = {
    immediacy: { 0: -0.1, 1: 0, 2: 0.12 },
    visibility: { 0: 0.12, 1: 0, 2: -0.08 },
    payout: { 0: -0.12, 1: 0, 2: 0.14 }
  };

  const mitigationAdjustments = {
    leading: -0.08,
    recognition: -0.06,
    debrief: -0.05
  };

  const labelClasses = {
    high: {
      className: 'chip chip-warning uppercase tracking-wide',
      text: 'High'
    },
    medium: {
      className: 'chip chip-neutral uppercase tracking-wide',
      text: 'Medium'
    },
    low: {
      className: 'chip chip-success uppercase tracking-wide',
      text: 'Managed'
    }
  };

  const clampRisk = (value) => {
    if (Number.isNaN(value)) return 0;
    return Math.min(Math.max(value, 0.05), 0.95);
  };

  const bucketRisk = (risk) => {
    if (risk >= 0.7) return 'high';
    if (risk >= 0.45) return 'medium';
    return 'low';
  };

  const sliderLabel = (value) => {
    if (value === 0) return 'long-horizon rewards';
    if (value === 1) return 'balanced signals';
    return 'short-term, metric-A heavy rewards';
  };

  const render = () => {
    const key = scenarioSelect.value;
    const scenario = scenarios[key];
    if (!scenario) return;

    const immediacy = Number(immediacyInput.value) || 0;
    const visibility = Number(visibilityInput.value) || 0;
    const payout = Number(payoutInput.value) || 0;
    const hasLeading = leadingToggle.checked;
    const hasRecognition = recognitionToggle.checked;
    const hasDebrief = debriefToggle.checked;

    let risk = scenario.baseRisk;
    risk += (sliderAdjustments.immediacy[immediacy] || 0);
    risk += (sliderAdjustments.visibility[visibility] || 0);
    risk += (sliderAdjustments.payout[payout] || 0);

    if (hasLeading) risk += mitigationAdjustments.leading;
    if (hasRecognition) risk += mitigationAdjustments.recognition;
    if (hasDebrief) risk += mitigationAdjustments.debrief;

    risk = clampRisk(risk);
    const riskLevel = bucketRisk(risk);
    const riskPercent = Math.round(risk * 100);

    const behaviorCopy = scenario.behaviors[riskLevel] || scenario.behaviors.medium;
    behaviorEl.textContent = behaviorCopy;

    riskEl.textContent = riskPercent + '%';
    const labelStyle = labelClasses[riskLevel] || labelClasses.medium;
    riskChipEl.textContent = labelStyle.text;
    riskChipEl.className = labelStyle.className;

    horizonEl.textContent = scenario.horizon[riskLevel] || '';

    const signals = scenario.flags[riskLevel] || [];
    signalEl.textContent = riskLevel === 'low' ? 'You are rewarding the right behavior—keep auditing quarterly.' : 'Watch for these drift signals';
    flagsEl.innerHTML = signals.map((item) => '<li>' + item + '</li>').join('');

    const summaryBits = [];
    summaryBits.push('<p><strong>' + scenario.label + ':</strong> ' + scenario.baseSummary + '</p>');
    summaryBits.push('<p>Current reward mix leans toward ' + sliderLabel(immediacy) + ', with visibility of B rated ' + (visibility === 2 ? 'high' : visibility === 1 ? 'moderate' : 'low') + ' and payouts ' + (payout === 2 ? 'mostly concentrated on metric A.' : payout === 1 ? 'split across A and B.' : 'anchored in B-linked metrics.') + '</p>');
    summaryBits.push('<p>Given these signals, misalignment risk sits at <strong>' + riskPercent + '%</strong> (' + labelStyle.text + '). Employees will internalise that success means ' + behaviorCopy.toLowerCase() + '</p>');
    summaryEl.innerHTML = summaryBits.join('');

    const actions = [];

    if (!hasLeading) {
      actions.push('Publish a weekly scoreboard for the behavior you hope for (B) so it stays visible.');
    }
    if (!hasRecognition) {
      actions.push('Add peer or leadership recognition moments that celebrate B-aligned wins.');
    }
    if (!hasDebrief) {
      actions.push('Hold after-action reviews where misses on B are discussed without penalty.');
    }
    if (immediacy === 2) {
      actions.push('Shift part of the bonus to trailing indicators (renewals, retention, quality) to counter short-term pull.');
    }
    if (visibility === 0) {
      actions.push('Make B visible in all-hands decks and dashboards; what you spotlight determines cultural gravity.');
    }
    if (payout === 2) {
      actions.push('Diversify rewards so at least one payout explicitly reinforces the desired behavior.');
    }
    if (riskLevel === 'high') {
      actions.push('Run a one-time incentive audit with finance and HR to retire rewards buying the wrong behaviors.');
    }
    actions.push(...scenario.baseActions);

    const uniqueActions = Array.from(new Set(actions));
    actionsEl.innerHTML = uniqueActions.map((item) => '<li>' + item + '</li>').join('');
  };

  [scenarioSelect, immediacyInput, visibilityInput, payoutInput, leadingToggle, recognitionToggle, debriefToggle].forEach((control) => {
    control.addEventListener('change', render);
    control.addEventListener('input', render);
  });

  render();

  if (typeof window !== 'undefined' && window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
    window.MathJax.typesetPromise();
  }
};

if (typeof module !== 'undefined') {
  module.exports = { interactiveScript };
}

if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
