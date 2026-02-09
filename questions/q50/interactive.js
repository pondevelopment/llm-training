const interactiveScript = () => {
  const doc = document;
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

  const pr = doc.getElementById('q50-priority');
  const infra = doc.getElementById('q50-infra');
  const align = doc.getElementById('q50-align');
  const data = doc.getElementById('q50-data');
  const quant4 = doc.getElementById('q50-quant4');
  const distill = doc.getElementById('q50-distill');
  const cache = doc.getElementById('q50-cache');
  const rag = doc.getElementById('q50-rag');
  const badgeEl = doc.getElementById('q50-impact-badge');
  const meterTrack = doc.getElementById('q50-meter-track');
  const meterFill = doc.getElementById('q50-meter');
  const breakdownEl = doc.getElementById('q50-breakdown');
  const prosEl = doc.getElementById('q50-pros');
  const consEl = doc.getElementById('q50-cons');
  const barsEl = doc.getElementById('q50-bars');
  const nextEl = doc.getElementById('q50-next');
  const diffEl = doc.getElementById('q50-diff');
  const presetBtns = doc.querySelectorAll('[data-preset]');
  const capA = doc.getElementById('q50-capA');
  const capB = doc.getElementById('q50-capB');
  const capClear = doc.getElementById('q50-capClear');
  const abStatus = doc.getElementById('q50-ab-status');
  const abDiff = doc.getElementById('q50-ab-diff');
  const exportBtn = doc.getElementById('q50-export');
  const exportStatus = doc.getElementById('q50-export-status');
  const abNote = doc.getElementById('q50-ab-note');
  const tierEl = doc.getElementById('q50-tier');
  const nextTierEl = doc.getElementById('q50-next-tier');
  const radarCanvas = doc.getElementById('q50-radar');
  const radarAlt = doc.getElementById('q50-radar-alt');
  const risksEl = doc.getElementById('q50-risks');
  const interventionsEl = doc.getElementById('q50-interventions');
  const scenarioSelect = doc.getElementById('q50-scenario');
  const scenarioNote = doc.getElementById('q50-scenario-note');
  const expl = doc.getElementById('q50-expl');

  if (!pr || !infra || !align || !data || !quant4 || !distill || !cache || !rag || !badgeEl || !meterFill || !prosEl || !consEl || !expl) {
    console.error('Question 50 interactive: required DOM nodes are missing.');
    return;
  }

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  const toRgba = (color, alpha, fallback) => {
    if (!color) return fallback;
    const value = color.trim();
    if (!value) return fallback;
    if (value.startsWith('#')) {
      const hex = value.substring(1);
      const size = hex.length === 3 ? 1 : 2;
      const expand = (chunk) => parseInt(size === 1 ? chunk + chunk : chunk, 16);
      const r = expand(hex.substring(0, size));
      const g = expand(hex.substring(size, size * 2));
      const b = expand(hex.substring(size * 2, size * 3));
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const rgbMatch = value.match(/rgba?\(([^)]+)\)/);
    if (rgbMatch) {
      const channels = rgbMatch[1].split(',').map((part) => part.trim());
      const [r = '99', g = '102', b = '241'] = channels;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return fallback;
  };

  const themeToken = (token, fallback) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    return value || fallback;
  };

  let prevState = {
    pr: pr.value,
    infra: infra.value,
    align: align.value,
    data: data.value,
    quant4: quant4.checked,
    distill: distill.checked,
    cache: cache.checked,
    rag: rag.checked
  };

  let snapA = null;
  let snapB = null;

  const setImpact = (score) => {
    const bounded = clamp(score);
    const pct = Math.round(bounded * 100);
    let tier = 'basic';
    let label = `Basic (${pct}%)`;

    if (bounded >= 0.85) {
      tier = 'excellent';
      label = `Excellent (${pct}%)`;
    } else if (bounded >= 0.65) {
      tier = 'good';
      label = `Good (${pct}%)`;
    } else if (bounded >= 0.35) {
      tier = 'developing';
      label = `Developing (${pct}%)`;
    }

    badgeEl.dataset.tier = tier;
    badgeEl.textContent = label;

    if (meterTrack) {
      meterTrack.dataset.tier = tier;
      meterTrack.setAttribute('aria-valuenow', String(pct));
    }
    meterFill.style.width = `${pct}%`;
  };

  const scores = () => {
    let latency = 0.5;
    let cost = 0.5;
    let safety = 0.5;
    let interpret = 0.45;
    let privacy = 0.5;

    const infraVal = (infra.value || '').toLowerCase();
    switch (infraVal) {
      case 'cloud gpu':
        latency += 0.35;
        cost += 0.35;
        privacy -= 0.05;
        break;
      case 'cloud cpu':
        latency -= 0.35;
        cost -= 0.15;
        privacy -= 0.05;
        break;
      case 'on-prem gpu':
        latency += 0.25;
        cost += 0.05;
        privacy += 0.15;
        break;
      case 'edge device':
        latency += 0.15;
        cost -= 0.15;
        privacy += 0.25;
        interpret += 0.05;
        break;
      default:
        break;
    }

    if (quant4.checked) {
      latency += 0.2;
      cost += 0.2;
      interpret -= 0.05;
    }
    if (distill.checked) {
      latency += 0.15;
      cost += 0.15;
      interpret += 0.05;
    }
    if (cache.checked) {
      latency += 0.15;
      cost += 0.05;
    }
    if (rag.checked) {
      safety += 0.1;
      interpret += 0.05;
    }

    const alignmentVal = (align.value || 'none').toLowerCase();
    if (alignmentVal === 'instruction-tuned') safety += 0.1;
    if (alignmentVal === 'rlhf') safety += 0.2;

    const dataVal = (data.value || 'medium').toLowerCase();
    if (dataVal === 'low') privacy += 0.1;
    if (dataVal === 'high') privacy -= 0.1;
    if (rag.checked && dataVal === 'high' && infraVal.includes('cloud')) privacy -= 0.1;

    const priorityVal = (pr.value || 'latency').toLowerCase();
    if (priorityVal === 'latency') {
      latency += 0.1;
      cost -= 0.05;
    }
    if (priorityVal === 'cost') {
      cost += 0.15;
      latency -= 0.05;
    }
    if (priorityVal === 'privacy') {
      privacy += 0.15;
      latency -= 0.05;
    }
    if (priorityVal === 'safety') safety += 0.15;
    if (priorityVal === 'quality') {
      interpret += 0.05;
      safety += 0.05;
    }

    latency = clamp(latency);
    cost = clamp(cost);
    safety = clamp(safety);
    interpret = clamp(interpret);
    privacy = clamp(privacy);

    const eps = 1e-6;
    const invSum = (1 / (latency + eps)) + (1 / (cost + eps)) + (1 / (safety + eps)) + (1 / (interpret + eps)) + (1 / (privacy + eps));
    const readiness = 5 / invSum;

    return { latency, cost, safety, interpret, privacy, readiness };
  };

  const updateImpactBreakdown = (scoreCard) => {
    if (!breakdownEl) return;
    const dims = [
      { key: 'Latency', value: scoreCard.latency },
      { key: 'Cost', value: scoreCard.cost },
      { key: 'Safety', value: scoreCard.safety },
      { key: 'Interpret', value: scoreCard.interpret },
      { key: 'Privacy', value: scoreCard.privacy }
    ];
    const weakest = dims.reduce((min, d) => (d.value < min.value ? d : min), dims[0]);
    const parts = dims.map((d) => `${d.key} ${(d.value * 100).toFixed(0)}%${d === weakest ? '*' : ''}`);
    breakdownEl.textContent = `${parts.join(' | ')}  (* bottleneck)`;
  };

  const updateBars = (scoreCard) => {
    if (!barsEl) return;
    const definitions = [
      { id: 'latency', label: 'Latency', value: scoreCard.latency },
      { id: 'cost', label: 'Cost', value: scoreCard.cost },
      { id: 'safety', label: 'Safety', value: scoreCard.safety },
      { id: 'interpret', label: 'Interpret', value: scoreCard.interpret },
      { id: 'privacy', label: 'Privacy', value: scoreCard.privacy }
    ];

    const fragments = definitions.map((entry) => {
      const pct = Math.round(entry.value * 100);
      let level = 'low';
      if (entry.value >= 0.7) level = 'high';
      else if (entry.value >= 0.5) level = 'mid';
      return (
        `<div class="q50-dimension">` +
          `<div class="q50-dimension-label">${entry.label}</div>` +
          `<div class="q50-dimension-track" data-level="${level}" aria-label="${entry.label} ${pct}%">` +
            `<div class="q50-dimension-fill" style="width:${pct}%"></div>` +
          `</div>` +
          `<div class="q50-dimension-score">${pct}%</div>` +
        `</div>`
      );
    });

    barsEl.innerHTML = fragments.join('');
  };

  const updateNextAction = (scoreCard) => {
    if (!nextEl) return;
    const focusAreas = [
      { id: 'latency', value: scoreCard.latency, message: 'Improve latency: enable caching, quantisation, or GPU scaling.' },
      { id: 'cost', value: scoreCard.cost, message: 'Cut cost: increase batch size, distil, or move to lighter hardware.' },
      { id: 'safety', value: scoreCard.safety, message: 'Boost safety: add instruction tuning, RLHF, and stronger guardrails.' },
      { id: 'interpret', value: scoreCard.interpret, message: 'Increase interpretability: add tracing, prompt tests, and eval dashboards.' },
      { id: 'privacy', value: scoreCard.privacy, message: 'Enhance privacy: move sensitive flows on-prem/edge and add redaction.' }
    ];
    focusAreas.sort((a, b) => a.value - b.value);
    const weakest = focusAreas[0];
    if (!weakest) {
      nextEl.textContent = '';
      nextEl.hidden = true;
      return;
    }
    nextEl.textContent = `Next focus -> ${weakest.message}`;
    nextEl.hidden = false;
  };

  const renderLists = (scoreCard) => {
    const pros = [];
    const cons = [];

    const infraVal = (infra.value || '').toLowerCase();
    const priorityVal = (pr.value || 'latency').toLowerCase();
    const alignmentVal = (align.value || 'none').toLowerCase();
    const dataVal = (data.value || 'medium').toLowerCase();

    const addUnique = (list, item) => {
      if (!list.includes(item)) list.push(item);
    };

    if (scoreCard.latency >= 0.7) pros.push('Meets tight latency targets with current setup.');
    if (scoreCard.cost >= 0.7) pros.push('Cost-efficient serving approach.');
    if (scoreCard.safety >= 0.7) pros.push('Robust alignment and guardrails reduce risky outputs.');
    if (scoreCard.interpret >= 0.7) pros.push('Explainability and auditing are in a good place.');
    if (scoreCard.privacy >= 0.7) pros.push('Privacy posture supports sensitive workloads.');

    if (scoreCard.latency <= 0.5) addUnique(cons, 'Latency risk: enable batching, KV cache, quantisation, or distilled variants.');
    if (scoreCard.cost <= 0.5) addUnique(cons, 'Cost pressure: use autoscaling, raise batch size, or shift to smaller/CPU/edge models.');
    if (scoreCard.safety <= 0.5) addUnique(cons, 'Safety gap: add instruction tuning, RLHF, policy filters, and broader evaluations.');
    if (scoreCard.interpret <= 0.5) addUnique(cons, 'Low interpretability: strengthen evals, tracing, prompt tests, and monitoring.');
    if (scoreCard.privacy <= 0.5) addUnique(cons, 'Privacy risk: keep PII on-prem/edge, add redaction, retention, and access controls.');

    const warn = (value, message) => {
      if (value > 0.4 && value < 0.6) addUnique(cons, `Watch-out: ${message}`);
    };
    warn(scoreCard.latency, 'latency might spike under load; verify p95/p99 and warm pools.');
    warn(scoreCard.cost, 'cost could grow with QPS; simulate peaks and enforce budgets.');
    warn(scoreCard.safety, 'safety guardrails may be thin; expand evaluation sets.');
    warn(scoreCard.interpret, 'observability may be limited; add traces and harness tests.');
    warn(scoreCard.privacy, 'recheck residency and retention policies.');

    if (quant4.checked) addUnique(cons, 'Quantisation can trim quality; validate critical tasks.');
    if (quant4.checked && infraVal.includes('edge')) addUnique(cons, 'Edge quantisation may degrade semantics; test critical flows.');
    if (!cache.checked && priorityVal === 'latency') addUnique(cons, 'KV cache disabled while latency is priority; expect tail latency spikes.');
    if (rag.checked && scoreCard.privacy < 0.7) addUnique(cons, 'RAG with sensitive data needs strong filtering, governance, and audit.');
    if (rag.checked && scoreCard.safety < 0.6) addUnique(cons, 'RAG retrieval noise can amplify hallucinations; enforce strict filters.');

    if (infraVal.includes('cpu')) addUnique(cons, 'CPU serving risks: high latency and low throughput; prefer int8/4-bit or GPU for tight SLAs.');
    if (infraVal === 'cloud gpu') addUnique(cons, 'Cloud GPU spend and quota risk; batch and autoscale to control cost.');
    if (infraVal === 'on-prem gpu') addUnique(cons, 'On-prem GPU capacity and maintenance require planning for peaks.');
    if (infraVal === 'edge device') addUnique(cons, 'Edge constraints: limited memory and compute; validate quality with smaller models.');

    if (priorityVal === 'latency' && infraVal.includes('cpu')) addUnique(cons, 'Priority/infra mismatch: latency-first on CPU is risky - move to GPU with caching and quantisation.');
    if (priorityVal === 'cost' && infraVal === 'cloud gpu' && !(quant4.checked || distill.checked)) addUnique(cons, 'Priority/infra mismatch: cost-first on cloud GPU without quantisation or distillation will be expensive.');
    if (priorityVal === 'privacy' && infraVal.includes('cloud') && dataVal === 'high') addUnique(cons, 'Priority/infra mismatch: privacy-first with high-sensitivity data on cloud - consider on-prem/edge or stronger redaction.');
    if (priorityVal === 'safety' && alignmentVal === 'none') addUnique(cons, 'Priority mismatch: safety-first requires alignment training and policy filters.');

    if (alignmentVal === 'none') addUnique(cons, 'Unaligned outputs may be off-brand or unsafe; add alignment and guardrails.');
    if (alignmentVal === 'rlhf') addUnique(cons, 'RLHF can drift; maintain evals and refresh policies frequently.');

    if (cons.length === 0) addUnique(cons, 'No major risks detected. Continue continuous evals, guardrails, and drift monitoring.');

    prosEl.innerHTML = pros.map((item) => `<li>${item}</li>`).join('');
    consEl.innerHTML = cons.slice(0, 6).map((item) => `<li>${item}</li>`).join('');
  };

  const renderExplanation = () => {
    const parts = [
      `Priority: <strong>${pr.value}</strong>`,
      `Infra: <strong>${infra.value}</strong>`,
      `Alignment: <strong>${align.value}</strong>`,
      `Data sensitivity: <strong>${data.value}</strong>`,
      `4-bit quant: <strong>${quant4.checked ? 'on' : 'off'}</strong>`,
      `Distillation: <strong>${distill.checked ? 'on' : 'off'}</strong>`,
      `KV cache: <strong>${cache.checked ? 'on' : 'off'}</strong>`,
      `RAG: <strong>${rag.checked ? 'on' : 'off'}</strong>`
    ];
    const chips = parts.map((item) => `<span class="chip chip-neutral text-xs">${item}</span>`).join('');
    expl.innerHTML = (
      `<div class="flex flex-wrap gap-2 mb-2">${chips}</div>` +
      '<div class="text-sm">This configuration balances production constraints. Tune infra and techniques to trade cost against latency, and layer alignment, RAG, and policy controls to manage bias, safety, and privacy.</div>'
    );
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise([expl]).catch(() => {});
    }
  };

  const updateTier = (scoreCard) => {
    if (!tierEl || !nextTierEl) return;
    const tiers = [
      { name: 'Prototype', min: 0 },
      { name: 'Pilot', min: 0.35 },
      { name: 'Limited Production', min: 0.55 },
      { name: 'Production', min: 0.7 },
      { name: 'Hardened', min: 0.85 }
    ];
    let current = tiers[0];
    tiers.forEach((tier) => {
      if (scoreCard.readiness >= tier.min) current = tier;
    });
    const nextTier = tiers.find((tier) => tier.min > current.min);
    tierEl.textContent = `Tier: ${current.name} (${(scoreCard.readiness * 100).toFixed(0)}%)`;
    nextTierEl.textContent = nextTier ? `Next: ${nextTier.name} needs +${((nextTier.min - scoreCard.readiness) * 100).toFixed(0)} pts` : 'At highest tier';
  };

  const drawRadar = (scoreCard) => {
    if (!radarCanvas) return;
    const ctx = radarCanvas.getContext('2d');
    if (!ctx) return;

    const dimensions = [
      { key: 'latency', label: 'Latency', value: scoreCard.latency },
      { key: 'cost', label: 'Cost', value: scoreCard.cost },
      { key: 'safety', label: 'Safety', value: scoreCard.safety },
      { key: 'interpret', label: 'Interpret', value: scoreCard.interpret },
      { key: 'privacy', label: 'Privacy', value: scoreCard.privacy }
    ];

    const theme = {
      grid: themeToken('--color-border-subtle', '#d4d9e6'),
      axis: themeToken('--color-border', '#94a3b8'),
      outline: themeToken('--panel-info-border-strong', '#4f46e5')
    };

    ctx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);
    const cx = radarCanvas.width / 2;
    const cy = radarCanvas.height / 2;
    const radius = 60;

    ctx.lineWidth = 1;
    ctx.strokeStyle = theme.grid;
    for (let ring = 1; ring <= 3; ring += 1) {
      ctx.beginPath();
      dimensions.forEach((dim, index) => {
        const angle = ((Math.PI * 2 * index) / dimensions.length) - Math.PI / 2;
        const r = radius * (ring / 3);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
    }

    ctx.strokeStyle = theme.axis;
    dimensions.forEach((dim, index) => {
      const angle = ((Math.PI * 2 * index) / dimensions.length) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
    });

    ctx.beginPath();
    dimensions.forEach((dim, index) => {
      const angle = ((Math.PI * 2 * index) / dimensions.length) - Math.PI / 2;
      const r = radius * dim.value;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = toRgba(theme.outline || getCssVar('--tone-indigo-strong', '#4f46e5'), 0.2);
    ctx.strokeStyle = theme.outline || getCssVar('--tone-indigo-strong', '#4f46e5');
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    if (radarAlt) {
      const summary = dimensions.map((dim) => `${dim.label} ${(dim.value * 100).toFixed(0)}%`).join(', ');
      radarAlt.textContent = `Radar: ${summary}`;
    }
  };

  const updateRisks = (scoreCard) => {
    if (!risksEl) return;
    const riskDims = [
      { label: 'Latency', value: scoreCard.latency },
      { label: 'Cost', value: scoreCard.cost },
      { label: 'Safety', value: scoreCard.safety },
      { label: 'Interpret', value: scoreCard.interpret },
      { label: 'Privacy', value: scoreCard.privacy }
    ];
    risksEl.innerHTML = '';
    riskDims.forEach((dim) => {
      const riskValue = 1 - dim.value;
      let chipClass = 'chip chip-success text-xs';
      if (riskValue >= 0.6) chipClass = 'chip chip-danger text-xs';
      else if (riskValue >= 0.4) chipClass = 'chip chip-warning text-xs';
      const node = doc.createElement('span');
      node.className = chipClass;
      node.textContent = `${dim.label}: ${riskValue >= 0.6 ? 'high' : riskValue >= 0.4 ? 'medium' : 'low'}`;
      risksEl.appendChild(node);
    });
  };

  const updateInterventions = (scoreCard) => {
    if (!interventionsEl) return;
    interventionsEl.innerHTML = '';
    const actions = [
      { key: 'quant4', label: 'Add 4-bit quantisation', complexity: 1 },
      { key: 'distill', label: 'Fine-tune distillation', complexity: 2 },
      { key: 'cache', label: 'Enable response caching', complexity: 1 },
      { key: 'rag', label: 'Add RAG retrieval', complexity: 3 }
    ];
    const complexityLabel = (level) => (level === 1 ? 'low effort' : level === 2 ? 'medium effort' : 'high effort');
    const current = { quant4: quant4.checked, distill: distill.checked, cache: cache.checked, rag: rag.checked };
    const improvements = [];
    actions.forEach((action) => {
      if (current[action.key]) return;
      const original = { ...current };
      if (action.key === 'quant4') quant4.checked = true;
      if (action.key === 'distill') distill.checked = true;
      if (action.key === 'cache') cache.checked = true;
      if (action.key === 'rag') rag.checked = true;
      const delta = scores().readiness - scoreCard.readiness;
      quant4.checked = original.quant4;
      distill.checked = original.distill;
      cache.checked = original.cache;
      rag.checked = original.rag;
      improvements.push({ label: action.label, delta, complexity: action.complexity });
    });

    improvements
      .filter((item) => item.delta >= 0.01)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3)
      .forEach((item) => {
        const row = doc.createElement('div');
        row.className = 'flex items-center justify-between gap-3 text-xs q50-interventions-row';
        row.innerHTML = `<span class="text-body">${item.label}</span><span class="chip chip-info text-xs q50-interventions-gain">+${(item.delta * 100).toFixed(0)} pts</span><span class="small-caption text-muted">${complexityLabel(item.complexity)}</span>`;
        interventionsEl.appendChild(row);
      });

    if (!interventionsEl.children.length) {
      interventionsEl.textContent = 'No meaningful single-step gains remaining.';
    }
  };

  const renderDiff = () => {
    if (!diffEl) return;
    const current = {
      pr: pr.value,
      infra: infra.value,
      align: align.value,
      data: data.value,
      quant4: quant4.checked,
      distill: distill.checked,
      cache: cache.checked,
      rag: rag.checked
    };
    const changes = [];
    Object.keys(current).forEach((key) => {
      if (current[key] !== prevState[key]) {
        if (typeof current[key] === 'boolean') changes.push(`${key}:${current[key] ? 'on' : 'off'}`);
        else changes.push(`${key}->${current[key]}`);
      }
    });
    if (changes.length) {
      diffEl.textContent = `Change: ${changes.join('; ')}`;
      setTimeout(() => {
        if (diffEl.textContent.startsWith('Change:')) diffEl.textContent = '';
      }, 1800);
    }
    prevState = current;
  };

  const snapshot = () => {
    const scoreCard = scores();
    return {
      priority: pr.value,
      infra: infra.value,
      alignment: align.value,
      dataSensitivity: data.value,
      quant4: quant4.checked,
      distill: distill.checked,
      cache: cache.checked,
      rag: rag.checked,
      latency: scoreCard.latency,
      cost: scoreCard.cost,
      safety: scoreCard.safety,
      interpret: scoreCard.interpret,
      privacy: scoreCard.privacy,
      readiness: scoreCard.readiness
    };
  };

  const diffSnapshots = (a, b) => {
    if (!a || !b) return '';
    const parts = [];
    const format = (value) => {
      if (typeof value === 'boolean') return value ? 'on' : 'off';
      if (typeof value === 'number') return `${(value * 100).toFixed(0)}%`;
      return value;
    };
    const delta = (label, va, vb) => {
      if (va !== vb) parts.push(`${label}: ${format(va)} -> ${format(vb)}`);
    };
    delta('priority', a.priority, b.priority);
    delta('infra', a.infra, b.infra);
    delta('align', a.alignment, b.alignment);
    delta('data', a.dataSensitivity, b.dataSensitivity);
    ['quant4', 'distill', 'cache', 'rag'].forEach((key) => delta(key, a[key], b[key]));
    ['latency', 'cost', 'safety', 'interpret', 'privacy', 'readiness'].forEach((key) => {
      if (Math.abs(a[key] - b[key]) > 0.02) parts.push(`${key} ${(a[key] * 100).toFixed(0)}% -> ${(b[key] * 100).toFixed(0)}%`);
    });
    return parts.join('; ');
  };

  const updateAB = () => {
    if (!capB || !capClear) return;
    capB.disabled = !snapA;
    capClear.disabled = !(snapA || snapB);
    if (abDiff) abDiff.textContent = diffSnapshots(snapA, snapB);
    if (abNote) {
      if (snapA && snapB) abNote.textContent = 'Comparison shows deltas; focus on the largest percentage drops first.';
      else if (snapA) abNote.textContent = 'Captured A; adjust settings and capture B to compare.';
      else abNote.textContent = 'Capture A to start comparison.';
    }
  };

  const render = () => {
    const scoreCard = scores();
    setImpact(scoreCard.readiness);
    updateImpactBreakdown(scoreCard);
    updateBars(scoreCard);
    updateNextAction(scoreCard);
    renderLists(scoreCard);
    renderExplanation();
    updateTier(scoreCard);
    drawRadar(scoreCard);
    updateRisks(scoreCard);
    updateInterventions(scoreCard);
    renderDiff();
  };

  const applyConfig = (config) => {
    if (!config) return;
    pr.value = config.pr;
    infra.value = config.infra;
    align.value = config.align;
    data.value = config.data;
    quant4.checked = config.quant4;
    distill.checked = config.distill;
    cache.checked = config.cache;
    rag.checked = config.rag;
    render();
  };

  const applyPreset = (name) => {
    const presets = {
      lowcost: { pr: 'Cost', infra: 'Cloud CPU', align: 'None', data: 'Low', quant4: true, distill: true, cache: true, rag: false },
      balanced: { pr: 'Quality', infra: 'Cloud GPU', align: 'Instruction-tuned', data: 'Medium', quant4: true, distill: false, cache: true, rag: false },
      privacy: { pr: 'Privacy', infra: 'On-Prem GPU', align: 'Instruction-tuned', data: 'High', quant4: false, distill: false, cache: true, rag: false },
      safety: { pr: 'Safety', infra: 'Cloud GPU', align: 'RLHF', data: 'Medium', quant4: true, distill: false, cache: true, rag: true }
    };
    const preset = presets[name];
    if (!preset) return;
    applyConfig(preset);
    if (scenarioSelect) scenarioSelect.value = '';
    if (scenarioNote) scenarioNote.textContent = '';
  };

  const scenarioLibrary = {
    'support-agent': {
      config: { pr: 'Safety', infra: 'Cloud GPU', align: 'RLHF', data: 'Medium', quant4: true, distill: false, cache: true, rag: true },
      note: 'Customer-facing assistant with retrieval guardrails and RLHF safety focus.'
    },
    'cost-summarizer': {
      config: { pr: 'Cost', infra: 'Cloud CPU', align: 'Instruction-tuned', data: 'Low', quant4: true, distill: true, cache: true, rag: false },
      note: 'Batch summarisation pipeline tuned for low cost on commodity CPU instances.'
    },
    'privacy-healthcare': {
      config: { pr: 'Privacy', infra: 'On-Prem GPU', align: 'Instruction-tuned', data: 'High', quant4: false, distill: false, cache: true, rag: false },
      note: 'Healthcare knowledge agent running on on-prem GPUs to keep PHI in house.'
    },
    'edge-field': {
      config: { pr: 'Latency', infra: 'Edge Device', align: 'None', data: 'Medium', quant4: true, distill: true, cache: true, rag: false },
      note: 'Field operations device running a quantised local model for fast offline responses.'
    }
  };

  presetBtns.forEach((button) => {
    button.addEventListener('click', () => applyPreset(button.getAttribute('data-preset')));
  });

  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', () => {
      const entry = scenarioLibrary[scenarioSelect.value];
      if (!entry) {
        if (scenarioNote) scenarioNote.textContent = '';
        return;
      }
      applyConfig(entry.config);
      if (scenarioNote) scenarioNote.textContent = entry.note;
    });
  }

  if (capA) {
    capA.addEventListener('click', () => {
      snapA = snapshot();
      if (abStatus) {
        abStatus.textContent = 'Captured A';
        setTimeout(() => {
          if (abStatus.textContent === 'Captured A') abStatus.textContent = '';
        }, 1200);
      }
      updateAB();
    });
  }

  if (capB) {
    capB.addEventListener('click', () => {
      if (!snapA) return;
      snapB = snapshot();
      if (abStatus) {
        abStatus.textContent = 'Captured B';
        setTimeout(() => {
          if (abStatus.textContent === 'Captured B') abStatus.textContent = '';
        }, 1200);
      }
      updateAB();
    });
  }

  if (capClear) {
    capClear.addEventListener('click', () => {
      snapA = null;
      snapB = null;
      updateAB();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const payload = JSON.stringify(snapshot(), null, 2);
      navigator.clipboard.writeText(payload).then(() => {
        if (exportStatus) {
          exportStatus.textContent = 'Copied';
          setTimeout(() => {
            if (exportStatus.textContent === 'Copied') exportStatus.textContent = '';
          }, 1200);
        }
      }).catch(() => {
        if (exportStatus) exportStatus.textContent = 'Clipboard blocked';
      });
    });
  }

  [pr, infra, align, data].forEach((node) => {
    node.addEventListener('change', () => {
      render();
      if (scenarioSelect) {
        scenarioSelect.value = '';
        if (scenarioNote) scenarioNote.textContent = '';
      }
    });
  });

  [quant4, distill, cache, rag].forEach((node) => {
    node.addEventListener('change', () => {
      render();
      if (scenarioSelect) {
        scenarioSelect.value = '';
        if (scenarioNote) scenarioNote.textContent = '';
      }
    });
  });

  render();
  updateAB();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question50Interactive = interactiveScript;
}