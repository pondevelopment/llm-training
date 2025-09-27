const interactiveScript = () => {
  const $ = id => document.getElementById(id);
  const inputs = {
    domain: $('q56-domain'),
    domainVal: $('q56-domain-val'),
    prop: $('q56-prop'),
    propVal: $('q56-prop-val'),
    hit: $('q56-hit'),
    hitVal: $('q56-hit-val'),
    ground: $('q56-ground'),
    groundVal: $('q56-ground-val'),
    latency: $('q56-latency'),
    update: $('q56-update'),
    personal: $('q56-personal'),
    format: $('q56-format'),
    volume: $('q56-volume')
  };

  const pressuresEl = $('q56-pressures');
  const recoEl = $('q56-reco');
  const nextEl = $('q56-next');
  const rationaleEl = $('q56-rationale');
  const scenarioContainer = $('q56-scenarios');
  const scenarioNote = $('q56-scenario-note');
  const scenarioReset = $('q56-scenario-reset');

  const BASELINE_VALUES = {
    domain: 30,
    proprietary: 50,
    hit: 65,
    ground: 70,
    latency: 'moderate',
    update: 'weekly',
    personal: 'cohort',
    format: 'semi',
    volume: 'med'
  };

  const SCENARIOS = [
    {
      id: 'support',
      label: 'Live Support',
      summary: 'Hourly updates and latency pressure — prioritize RAG fixes before any tuning.',
      values: {
        domain: 45,
        proprietary: 55,
        hit: 48,
        ground: 52,
        latency: 'fast',
        update: 'hourly',
        personal: 'cohort',
        format: 'semi',
        volume: 'high',
      },
    },
    {
      id: 'compliance',
      label: 'Regulatory Desk',
      summary: 'Stable proprietary corpus with strict schema — layer adapters then selective fine-tuning.',
      values: {
        domain: 80,
        proprietary: 85,
        hit: 78,
        ground: 88,
        latency: 'flex',
        update: 'quarterly',
        personal: 'none',
        format: 'strict',
        volume: 'med',
      },
    },
    {
      id: 'personalized',
      label: 'Personal Tutor',
      summary: 'Per-user personalization with evolving knowledge — hybrid adapters + RAG.',
      values: {
        domain: 58,
        proprietary: 62,
        hit: 68,
        ground: 60,
        latency: 'moderate',
        update: 'daily',
        personal: 'user',
        format: 'semi',
        volume: 'med',
      },
    },
  ];

  const scenarioMap = Object.create(null);
  SCENARIOS.forEach((scenario) => {
    scenarioMap[scenario.id] = scenario;
  });

  const MANUAL_NOTE = 'Manual mix — adjust the sliders or load a preset to explore trade-offs.';
  let activeScenario = 'manual';
  let applyingScenario = false;

  function setControlValues(values) {
    if (values.domain !== undefined) inputs.domain.value = String(values.domain);
    if (values.proprietary !== undefined) inputs.prop.value = String(values.proprietary);
    if (values.hit !== undefined) inputs.hit.value = String(values.hit);
    if (values.ground !== undefined) inputs.ground.value = String(values.ground);
    if (values.latency !== undefined) inputs.latency.value = String(values.latency);
    if (values.update !== undefined) inputs.update.value = String(values.update);
    if (values.personal !== undefined) inputs.personal.value = String(values.personal);
    if (values.format !== undefined) inputs.format.value = String(values.format);
    if (values.volume !== undefined) inputs.volume.value = String(values.volume);
  }

  function updateScenarioUI() {
    if (scenarioContainer) {
      const buttons = scenarioContainer.querySelectorAll('button[data-scenario]');
      buttons.forEach((btn) => {
        const scenarioId = btn.getAttribute('data-scenario');
        const isActive = scenarioId === activeScenario;
        btn.classList.toggle('toggle-active', isActive);
        btn.classList.toggle('toggle-inactive', !isActive);
      });
    }
    if (scenarioNote) {
      if (activeScenario === 'manual') {
        scenarioNote.textContent = MANUAL_NOTE;
      } else {
        const scenario = scenarioMap[activeScenario];
        scenarioNote.textContent = scenario ? scenario.summary : MANUAL_NOTE;
      }
    }
  }

  function applyScenario(id) {
    const scenario = scenarioMap[id];
    if (!scenario) return;
    applyingScenario = true;
    setControlValues(scenario.values);
    applyingScenario = false;
    activeScenario = id;
    updateScenarioUI();
    refresh();
  }

  function applyManualBaseline() {
    applyingScenario = true;
    setControlValues(BASELINE_VALUES);
    applyingScenario = false;
    activeScenario = 'manual';
    updateScenarioUI();
    refresh();
  }

  function renderScenarioButtons() {
    if (!scenarioContainer) return;
    scenarioContainer.innerHTML = SCENARIOS
      .map((scenario) => '<button type="button" class="toggle-inactive" data-scenario="' + scenario.id + '">' + scenario.label + '</button>')
      .join('');
    scenarioContainer.querySelectorAll('button[data-scenario]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyScenario(btn.getAttribute('data-scenario'));
      });
    });
    updateScenarioUI();
  }

  function handleControlEvent() {
    if (!applyingScenario && activeScenario !== 'manual') {
      activeScenario = 'manual';
      updateScenarioUI();
    } else if (!applyingScenario && activeScenario === 'manual' && scenarioNote && scenarioNote.textContent !== MANUAL_NOTE) {
      scenarioNote.textContent = MANUAL_NOTE;
    }
    refresh();
  }

  function mapLatency(v) {
    return v === 'fast' ? 0.8 : v === 'moderate' ? 0.5 : 0.2;
  }
  function mapFormat(v) {
    return v === 'strict' ? 0.8 : v === 'semi' ? 0.5 : 0.2;
  }
  function mapPersonal(v) {
    return v === 'user' ? 0.8 : v === 'cohort' ? 0.5 : 0.1;
  }
  function mapVolume(v) {
    return v === 'high' ? 0.7 : v === 'med' ? 0.5 : 0.3;
  }
  function mapUpdate(v) {
    return v === 'hourly' ? 0.1 : v === 'daily' ? 0.25 : v === 'weekly' ? 0.4 : v === 'monthly' ? 0.55 : 0.7;
  }

  function computePressures() {
    const domainGap = parseInt(inputs.domain.value, 10) / 100;
    const proprietary = parseInt(inputs.prop.value, 10) / 100;
    const hit = parseInt(inputs.hit.value, 10) / 100;
    const ground = parseInt(inputs.ground.value, 10) / 100;
    const retrievalAdequacy = hit * 0.6 + ground * 0.4;
    return {
      domainGap,
      proprietary,
      structure: mapFormat(inputs.format.value),
      latency: mapLatency(inputs.latency.value),
      personalization: mapPersonal(inputs.personal.value),
      volume: mapVolume(inputs.volume.value),
      updateStability: mapUpdate(inputs.update.value),
      retrievalAdequacy
    };
  }

  function bar(label, val) {
    const pct = Math.round(val * 100);
    const fill = val > 0.66
      ? 'var(--tone-indigo-strong)'
      : val > 0.4
        ? 'color-mix(in srgb, var(--tone-indigo-strong) 70%, transparent)'
        : 'color-mix(in srgb, var(--tone-indigo-strong) 45%, transparent)';
    const track = 'color-mix(in srgb, var(--color-border-subtle) 65%, transparent)';
    const border = 'color-mix(in srgb, var(--color-border) 55%, transparent)';
    return [
      '<div class="space-y-1">',
        '<div class="flex items-center justify-between text-[11px] text-heading">',
          '<span>' + label + '</span>',
          '<span class="font-mono text-muted">' + pct + '%</span>',
        '</div>',
        '<div class="h-2 rounded-full overflow-hidden" style="background:' + track + '; border:1px solid ' + border + ';">',
          '<div class="h-full" style="width:' + pct + '%; background:' + fill + ';"></div>',
        '</div>',
      '</div>'
    ].join('');
  }

  function recommend(p) {
    const reasons = [];
    let primary = 'RAG Optimization';
    let secondary = 'Prompt + Retrieval';
    const next = [];
    const trace = [];

    const retrievalWeak = p.retrievalAdequacy < 0.6;
    trace.push({ id: 'retrievalWeak', fired: retrievalWeak, detail: 'retrievalAdequacy ' + pct(p.retrievalAdequacy) + ' < 60%' });
    const highStructure = p.structure > 0.7;
    trace.push({ id: 'highStructure', fired: highStructure, detail: 'structure ' + pct(p.structure) + ' > 70%' });
    const highProprietary = p.proprietary > 0.7;
    trace.push({ id: 'highProprietary', fired: highProprietary, detail: 'proprietary ' + pct(p.proprietary) + ' > 70%' });
    const highDomain = p.domainGap > 0.6;
    trace.push({ id: 'highDomain', fired: highDomain, detail: 'domainGap ' + pct(p.domainGap) + ' > 60%' });
    const highPersonal = p.personalization > 0.6;
    trace.push({ id: 'highPersonal', fired: highPersonal, detail: 'personalization ' + pct(p.personalization) + ' > 60%' });
    const lowUpdate = p.updateStability > 0.55;
    trace.push({ id: 'lowUpdate', fired: lowUpdate, detail: 'updateStability ' + pct(p.updateStability) + ' > 55% (infrequent updates)' });
    const latencyHigh = p.latency > 0.7;
    trace.push({ id: 'latencyHigh', fired: latencyHigh, detail: 'latency pressure ' + pct(p.latency) + ' > 70%' });

    if (retrievalWeak) {
      reasons.push('Retrieval adequacy low → improve RAG first (chunking, rerank, filters).');
      next.push('Tune retriever embeddings', 'Improve chunk segmentation', 'Add reranker', 'Instrument hit rate');
    }
    if (highStructure && !retrievalWeak) {
      primary = 'Adapter (LoRA) + RAG';
      reasons.push('High format rigidity → structured adapters helpful.');
      next.push('Add output schema validator', 'Train format LoRA');
    }
    if (highProprietary && highDomain && lowUpdate && !retrievalWeak) {
      primary = 'Targeted Fine-tune';
      secondary = 'Hybrid (RAG + Adapter)';
      reasons.push('Stable, high proprietary + domain gap → fine-tune justified.');
      next.push('Assemble high-quality SFT set', 'Add eval harness pre/post');
    } else if (highProprietary && lowUpdate && !retrievalWeak) {
      if (primary === 'RAG Optimization') primary = 'Selective Fine-tune (Focus Proprietary Segments)';
      reasons.push('High stable proprietary share → internalization can reduce per-query retrieval overhead.');
      next.push('Quantify cost vs latency benefit of internalization', 'Sample proprietary examples for SFT set curation');
    }
    if (highProprietary && retrievalWeak) {
      reasons.push('High proprietary share but retrieval weak → postpone fine-tune until retrieval adequacy improves.');
    }
    if (highPersonal) {
      if (primary === 'RAG Optimization') primary = 'Hybrid (Personalized Adapter + RAG)';
      reasons.push('High personalization need → lightweight per-cohort adapters.');
      next.push('Segment users into cohorts', 'Collect preference signals');
    }
    if (highDomain && !highProprietary && !retrievalWeak) {
      if (primary === 'RAG Optimization') primary = 'Hybrid (RAG + Adapter)';
      reasons.push('Domain language shift but not proprietary heavy → style adapter + RAG.');
    }
    if (latencyHigh && primary.startsWith('RAG')) {
      reasons.push('Latency pressure → consider caching / partial fine-tune for hot paths.');
      next.push('Cache frequent answers', 'Distill latency-critical path');
    }

    const highCount = [p.structure, p.proprietary, p.domainGap, p.personalization].filter(v => v > 0.6).length;
    if (highCount >= 3 && !retrievalWeak) {
      primary = 'Hybrid (RAG + Adapter + Selective FT)';
      secondary = 'Phased fine-tune roadmap';
      reasons.push('Multiple high-intensity drivers → layered hybrid strategy.');
      trace.push({ id: 'comboHigh', fired: true, detail: highCount + ' high-pressure drivers ≥3' });
    } else {
      trace.push({ id: 'comboHigh', fired: false, detail: highCount + ' high-pressure drivers <3' });
    }

    if (reasons.length === 0) {
      reasons.push('Inputs do not cross escalation thresholds → stay with prompt + RAG tuning.');
      next.push('Refine system prompt', 'Add few-shot exemplars');
    }

    const uniqNext = Array.from(new Set(next)).slice(0, 6);

    return { primary, secondary, reasons, next: uniqNext, trace };
  }

  function pct(v) {
    return Math.round(v * 100) + '%';
  }

  function classify(v) {
    if (v > 0.66) return { label: 'High', chip: 'chip-accent' };
    if (v > 0.4) return { label: 'Med', chip: 'chip-warning' };
    return { label: 'Low', chip: 'chip-neutral' };
  }

  const pressureLabels = {
    domainGap: 'Domain Gap',
    proprietary: 'Proprietary',
    structure: 'Structure',
    latency: 'Latency',
    personalization: 'Personalization',
    volume: 'Volume',
    updateStability: 'Update Stability',
    retrievalAdequacy: 'Retrieval Adequacy'
  };

  function refresh() {
    inputs.domainVal.textContent = inputs.domain.value + '%';
    inputs.propVal.textContent = inputs.prop.value + '%';
    inputs.hitVal.textContent = inputs.hit.value + '%';
    inputs.groundVal.textContent = inputs.ground.value + '%';

    const p = computePressures();
    pressuresEl.innerHTML = [
      bar('Domain Gap', p.domainGap),
      bar('Proprietary', p.proprietary),
      bar('Structure', p.structure),
      bar('Latency', p.latency),
      bar('Personalization', p.personalization),
      bar('Volume', p.volume),
      bar('Update Stability', p.updateStability),
      bar('Retrieval Adequacy', p.retrievalAdequacy)
    ].join('');

    const rec = recommend(p);
    const why = rec.reasons.map(r => '<span class="block">• ' + r + '</span>').join('');
    const secondaryLine = rec.secondary ? '<div class="small-caption text-muted">Secondary: ' + rec.secondary + '</div>' : '';
    recoEl.innerHTML = [
      '<div class="text-heading font-semibold">' + rec.primary + '</div>',
      secondaryLine,
      '<div class="mt-2 small-caption text-body"><strong>Why:</strong> ' + why + '</div>'
    ].join('');

    nextEl.innerHTML = rec.next.map(n => '<li>' + n + '</li>').join('');

    const chips = Object.keys(p)
      .map(function (key) {
        if (!Object.prototype.hasOwnProperty.call(pressureLabels, key)) return '';
        const cls = classify(p[key]);
        return '<div class="chip ' + cls.chip + '" style="width:100%; justify-content: space-between; display:flex;"><span>' + pressureLabels[key] + '</span><span>' + cls.label + '</span></div>';
      })
      .join('');

    const fired = rec.trace
      .filter(function (t) { return t.fired; })
      .map(function (t) { return '<li class="mb-0.5"><span class="chip chip-success" style="margin-right:0.35rem;">' + t.id + '</span>' + t.detail + '</li>'; })
      .join('');
    const notFired = rec.trace
      .filter(function (t) { return !t.fired; })
      .map(function (t) { return '<li class="small-caption text-muted"><span class="chip chip-neutral" style="margin-right:0.35rem;">' + t.id + '</span>' + t.detail + '</li>'; })
      .join('');

    const firedList = fired || '<li class="small-caption text-muted">No escalation rules fired.</li>';

    rationaleEl.innerHTML = [
      '<div class="font-semibold text-heading mb-2">Reasoning Trace</div>',
      '<div class="grid md:grid-cols-4 gap-2 mb-3 text-[10px]">' + chips + '</div>',
      '<div class="space-y-1">',
        '<span class="font-medium text-heading text-[12px]">Triggered rules</span>',
        '<ul class="list-disc ml-5 mt-1 text-[11px] text-body">' + firedList + '</ul>',
      '</div>',
      '<details class="mt-2">',
        '<summary class="cursor-pointer small-caption text-muted">Show non-triggered rules</summary>',
        '<ul class="list-disc ml-5 mt-1 text-[11px] text-muted">' + notFired + '</ul>',
      '</details>'
    ].join('');

    latest = {
      inputs: collectRaw(),
      pressures: p,
      recommendation: { primary: rec.primary, secondary: rec.secondary },
      rationale: rec.reasons,
      trace: rec.trace,
      next_steps: rec.next
    };
  }

  function collectRaw() {
    return {
      domain_shift: parseInt(inputs.domain.value, 10),
      proprietary_pct: parseInt(inputs.prop.value, 10),
      retrieval_hit_rate: parseInt(inputs.hit.value, 10),
      grounded_rate: parseInt(inputs.ground.value, 10),
      latency: inputs.latency.value,
      update_frequency: inputs.update.value,
      personalization: inputs.personal.value,
      format: inputs.format.value,
      query_volume: inputs.volume.value
    };
  }

  let latest = null;
  renderScenarioButtons();

  if (scenarioReset) {
    scenarioReset.addEventListener('click', () => {
      applyManualBaseline();
    });
  }

  const controlElements = [
    inputs.domain,
    inputs.prop,
    inputs.hit,
    inputs.ground,
    inputs.latency,
    inputs.update,
    inputs.personal,
    inputs.format,
    inputs.volume,
  ];

  controlElements.forEach((el) => {
    if (!el) return;
    if (el.tagName === 'INPUT') {
      el.addEventListener('input', handleControlEvent);
      el.addEventListener('change', handleControlEvent);
    } else {
      el.addEventListener('change', handleControlEvent);
    }
  });

  applyManualBaseline();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question56Interactive = interactiveScript;
}
