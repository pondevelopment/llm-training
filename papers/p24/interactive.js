const interactiveScript = () => {
  const root = document.getElementById('p24-lab');
  if (!root) return;

  const scenarioSelect = document.getElementById('p24-scenario');
  const modelSelect = document.getElementById('p24-model');
  const abilitySlider = document.getElementById('p24-ability');
  const abilityValue = document.getElementById('p24-ability-value');
  const tomTraitSlider = document.getElementById('p24-tom-trait');
  const tomTraitValue = document.getElementById('p24-tom-trait-value');
  const tomStateSlider = document.getElementById('p24-tom-state');
  const tomStateValue = document.getElementById('p24-tom-state-value');
  const scaffoldToggle = document.getElementById('p24-scaffold');
  const briefToggle = document.getElementById('p24-brief');
  const oversightToggle = document.getElementById('p24-oversight');

  const soloEl = document.getElementById('p24-solo');
  const teamEl = document.getElementById('p24-team');
  const boostEl = document.getElementById('p24-boost');
  const collabScoreEl = document.getElementById('p24-collab-score');
  const collabLabelEl = document.getElementById('p24-collab-label');
  const risksEl = document.getElementById('p24-risks');
  const summaryEl = document.getElementById('p24-summary');
  const actionsEl = document.getElementById('p24-actions');

  const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
  const pct = (value) => `${Math.round(clamp01(value) * 100)}%`;

  const scenarios = {
    routine: { difficulty: 0.35, description: 'Structured QA, clear rubrics, minimal ambiguity.' },
    analytical: { difficulty: 0.55, description: 'Multi-step reasoning with some fuzziness in requirements.' },
    synthesis: { difficulty: 0.75, description: 'Cross-domain synthesis with ambiguous briefs and higher stakes.' }
  };

  const models = {
    gpt4o: { label: 'GPT-4o', baseBoost: 0.22, qualityBase: 0.74, oversightShift: -0.04 },
    llama: { label: 'Llama-3.1-8B', baseBoost: 0.17, qualityBase: 0.64, oversightShift: 0 }
  };

  const riskCatalog = {
    instruction: {
      title: 'Delegation clarity',
      detail: 'Scaffolding, brief restatement, and ToM cues that keep the model aligned with the user goal.'
    },
    reliability: {
      title: 'Answer reliability',
      detail: 'Likelihood the model supplies correct rationales and evidence without hallucination.'
    },
    oversight: {
      title: 'Review load',
      detail: 'Amount of human verification needed before handoff based on residual error risk.'
    }
  };

  const render = () => {
    const scenarioKey = scenarioSelect.value;
    const modelKey = modelSelect.value;
    const scenario = scenarios[scenarioKey] || scenarios.analytical;
    const model = models[modelKey] || models.gpt4o;

    const ability = Number(abilitySlider.value) / 100;
    const tomTrait = Number(tomTraitSlider.value) / 100;
    const tomState = Number(tomStateSlider.value) / 100;
    const hasScaffold = scaffoldToggle.checked;
    const hasBrief = briefToggle.checked;
    const hasOversight = oversightToggle.checked;

    abilityValue.textContent = abilitySlider.value;
    tomTraitValue.textContent = tomTraitSlider.value;
    tomStateValue.textContent = tomStateSlider.value;

    const difficulty = scenario.difficulty;

    let soloAccuracy = 0.38 + 0.4 * ability - 0.18 * difficulty;
    soloAccuracy = clamp01(soloAccuracy);

    let boost = model.baseBoost;
    boost += (0.5 - ability) * 0.18;
    boost += (difficulty - 0.5) * 0.12;
    boost += (tomTrait - 0.5) * 0.08;
    boost += (tomState - 0.5) * 0.06;
    boost += hasScaffold ? 0.04 : -0.05;
    boost += hasBrief ? 0.03 : -0.04;
    boost = Math.max(0, Math.min(boost, 0.4));

    const teamAccuracy = Math.max(0, Math.min(0.98, soloAccuracy + boost));

    const qualityScore = clamp01(
      model.qualityBase + (tomTrait - 0.5) * 0.22 + (tomState - 0.5) * 0.18 + (hasScaffold ? 0.05 : -0.05)
    );

    const oversightRisk = clamp01(
      0.42 + boost * 0.4 - tomTrait * 0.18 - (hasOversight ? 0.18 : 0) + (difficulty - 0.5) * 0.12 + (model.oversightShift || 0)
    );

    const instructionRisk = clamp01(
      0.18 +
      (hasScaffold ? 0 : 0.22) +
      (hasBrief ? 0 : 0.18) +
      Math.max(0, 0.5 - tomTrait) * 0.5 +
      Math.max(0, 0.5 - tomState) * 0.4 +
      Math.max(0, difficulty - 0.5) * 0.25
    );

    const reliabilityRisk = clamp01(
      0.16 +
      Math.max(0, 0.8 - qualityScore) * 0.7 +
      Math.max(0, difficulty - 0.5) * 0.2 +
      (hasOversight ? 0 : 0.12)
    );

    const rawCollab =
      0.3 +
      boost * 1.4 +
      (tomTrait - 0.5) * 0.5 +
      (tomState - 0.5) * 0.35 +
      (hasScaffold ? 0.05 : -0.05) +
      (hasBrief ? 0.04 : -0.05) -
      oversightRisk * 0.25 -
      Math.max(0, 0.45 - ability) * 0.3;

    const collabIndex = clamp01(rawCollab);

    soloEl.textContent = pct(soloAccuracy);
    teamEl.textContent = pct(teamAccuracy);
    boostEl.textContent = `${Math.round(boost * 100)} pts`;

    const collabScore = Math.round(collabIndex * 100);
    collabScoreEl.textContent = `${collabScore} / 100`;
    let collabLabel;
    if (collabIndex < 0.33) {
      collabLabel = 'Developing collaborator (coach ToM cues and delegation)';
    } else if (collabIndex < 0.66) {
      collabLabel = 'Resilient collaborator (keep reinforcing mental-model prompts)';
    } else {
      collabLabel = 'High-synergy partner (capture this workflow as a playbook)';
    }
    collabLabelEl.textContent = collabLabel;

    const riskEntries = [
      ['instruction', instructionRisk],
      ['reliability', reliabilityRisk],
      ['oversight', oversightRisk]
    ];

    const severityClass = (score) => {
      if (score >= 0.6) return 'border-rose-200 bg-rose-50 text-rose-800';
      if (score >= 0.35) return 'border-amber-200 bg-amber-50 text-amber-800';
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    };

    const severityLabel = (score) => {
      if (score >= 0.6) return 'High';
      if (score >= 0.35) return 'Medium';
      return 'Managed';
    };

    risksEl.innerHTML = riskEntries
      .map(([key, score]) => {
        const catalog = riskCatalog[key];
        if (!catalog) return '';
        return (
          `<article class="border rounded-lg p-3 space-y-1 ${severityClass(score)}">` +
          `<div class="flex items-center justify-between">` +
          `<h4 class="text-sm font-semibold">${catalog.title}</h4>` +
          `<span class="text-[11px] font-semibold uppercase tracking-wide">${severityLabel(score)}</span>` +
          '</div>' +
          `<p class="text-xs leading-snug">${catalog.detail}</p>` +
          '</article>'
        );
      })
      .join('');

    const oversightLabel = oversightRisk < 0.35
      ? 'Spot-checks cover high-risk segments (~20% reviewer time).'
      : oversightRisk < 0.65
      ? 'Plan for targeted review on nuanced steps (~40% reviewer time).'
      : 'Keep full review in place until scaffolding or ToM coaching lowers miss risk (~70% reviewer time).';

    const scenarioDescription = scenario && scenario.description ? scenario.description : 'Task difficulty set by scenario';
    const collabDescriptor = collabLabel.split(' (')[0].toLowerCase();
    const summaryParts = [
      `${model.label} with this user profile should reach ${pct(teamAccuracy)} accuracy versus ${pct(soloAccuracy)} solo, a lift of ${Math.round(boost * 100)} points.`,
      `${scenarioDescription} plus the current ability percentile keep the pair in the ${collabDescriptor} range.`,
      `Theory of Mind signals (${Math.round(tomTrait * 100)}/${Math.round(tomState * 100)}) push AI response quality to ${pct(qualityScore)}, provided scaffolds stay in place.`,
      oversightLabel
    ];
    summaryEl.innerHTML = summaryParts.map((text) => `<p>${text}</p>`).join('');

    const actions = [];
    if (!hasScaffold) {
      actions.push('Reintroduce the structured prompt checklist to reduce instruction drift.');
    }
    if (!hasBrief) {
      actions.push('Ask users to include context, constraints, and an acceptance test before delegating.');
    }
    if (!hasOversight && oversightRisk >= 0.35) {
      actions.push('Schedule reviewer spot-checks until the collaborative boost stabilises.');
    }
    if (tomTrait < 0.45) {
      actions.push('Run Theory of Mind micro-training or provide prompt starters that model perspective taking.');
    }
    if (tomState < 0.45) {
      actions.push('Encourage users to restate the AI plan mid-dialogue to keep the assistant calibrated.');
    }
    if (boost < 0.18 && modelKey === 'llama') {
      actions.push('Consider upgrading to GPT-4o or similar frontier model for higher synergy headroom.');
    }
    if (!actions.length) {
      actions.push('Capture this configuration as a playbook and measure synergy weekly to catch drift.');
    }
    actionsEl.innerHTML = actions.map((item) => `<li>${item}</li>`).join('');
  };

  const inputs = [
    scenarioSelect,
    modelSelect,
    abilitySlider,
    tomTraitSlider,
    tomStateSlider,
    scaffoldToggle,
    briefToggle,
    oversightToggle
  ];

  inputs.forEach((input) => {
    input.addEventListener('change', render);
    if (input.tagName === 'INPUT') {
      input.addEventListener('input', render);
    }
  });

  render();
};

if (typeof module !== 'undefined') {
  module.exports = { interactiveScript };
}
