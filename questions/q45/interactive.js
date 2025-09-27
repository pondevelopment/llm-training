const interactiveScript = () => {
  const typeEl = document.getElementById('q45-type');
  const sevEl = document.getElementById('q45-sev');
  const dataEl = document.getElementById('q45-data');
  const sevVal = document.getElementById('q45-sev-val');
  const dataVal = document.getElementById('q45-data-val');

  const sPrompt = document.getElementById('q45-s-prompt');
  const sRAG = document.getElementById('q45-s-rag');
  const sAug = document.getElementById('q45-s-augment');
  const sFilter = document.getElementById('q45-s-filter');
  const sSFT = document.getElementById('q45-s-sft');
  const sRLHF = document.getElementById('q45-s-rlhf');

  const barsEl = document.getElementById('q45-bars');
  const metricsEl = document.getElementById('q45-metrics');
  const explainEl = document.getElementById('q45-explain');
  const guidanceEl = document.getElementById('q45-guidance');
  const presetButtons = Array.from(document.querySelectorAll('[data-q45-preset]'));

  if (!typeEl || !sevEl || !dataEl || !barsEl || !metricsEl || !explainEl) {
    console.warn('q45 interactive: missing expected DOM nodes.');
    return;
  }

  const clamp01 = (x) => Math.min(1, Math.max(0, x));

  function baseEffectiveness(strategy, type) {
    const table = {
      bias:   { prompt: 0.25, rag: 0.10, augment: 0.35, filter: 0.20, sft: 0.40, rlhf: 0.45 },
      factual:{ prompt: 0.20, rag: 0.45, augment: 0.10, filter: 0.05, sft: 0.30, rlhf: 0.25 },
      toxicity:{ prompt: 0.30, rag: 0.05, augment: 0.10, filter: 0.55, sft: 0.35, rlhf: 0.40 }
    };
    return table[type]?.[strategy] ?? 0;
  }

  function effectivenessAdjust(eff, severity, dataQuality) {
    // Higher severity reduces marginal gains; better data amplifies data-dependent methods
    const sevPenalty = 1 - 0.5 * severity; // up to -50%
    const dataBoost = 0.5 + 0.5 * dataQuality; // 0.5..1.0 multiplier
    return clamp01(eff * sevPenalty * dataBoost);
  }

  function residualRisk(base, chosen, type, severity, dataQuality) {
    let r = base;
    for (const [name, on] of Object.entries(chosen)) {
      if (!on) continue;
      const eff0 = baseEffectiveness(name, type);
      const eff = effectivenessAdjust(eff0, severity, dataQuality);
      r *= (1 - eff);
    }
    return clamp01(r);
  }

  function costEstimate(chosen) {
    // Rough cost/time scores (0..1)
    const weights = {
      prompt:  { token: 0.10, train: 0.00, time: 0.10 },
      rag:     { token: 0.30, train: 0.10, time: 0.30 },
      augment: { token: 0.00, train: 0.30, time: 0.40 },
      filter:  { token: 0.05, train: 0.05, time: 0.20 },
      sft:     { token: 0.00, train: 0.60, time: 0.60 },
      rlhf:    { token: 0.00, train: 0.80, time: 0.80 }
    };
    return Object.entries(chosen).reduce((acc, [key, enabled]) => {
      if (!enabled) return acc;
      const weight = weights[key];
      if (!weight) return acc;
      acc.token += weight.token;
      acc.train += weight.train;
      acc.time += weight.time;
      return acc;
    }, { token: 0, train: 0, time: 0 });
  }

  function bar(label, value, tone) {
    const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
    const pctLabel = (clamp01(value) * 100).toFixed(1);
    return `
      <div class="q45-meter" data-tone="${tone}">
        <div class="q45-meter-head">
          <span>${label}</span>
          <span class="q45-meter-value">${pctLabel}%</span>
        </div>
        <div class="q45-meter-track" role="presentation">
          <div class="q45-meter-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function badge(text, tone = 'neutral') {
    const toneClass = {
      info: 'chip-info',
      success: 'chip-success',
      warning: 'chip-warning',
      accent: 'chip-accent',
      neutral: 'chip-neutral',
      danger: 'chip-danger'
    }[tone] || 'chip-neutral';
    return `<span class="chip ${toneClass} text-xs">${text}</span>`;
  }

  function riskBadge(r) {
    if (r <= 0.25) return badge('Low', 'success');
    if (r <= 0.5) return badge('Moderate', 'warning');
    return badge('High', 'danger');
  }

  function recommend(type, rAfter, costs, chosen) {
    if (rAfter <= 0.25) {
      return `${badge('Stable', 'success')} Layered plan acceptable; continue audits.`;
    }
    const tips = [];
    if (type === 'factual' && !chosen.rag) tips.push('Add RAG for grounding.');
    if (type === 'bias' && !chosen.augment) tips.push('Augment / rebalance data.');
    if (type === 'toxicity' && !chosen.filter) tips.push('Strengthen safety filtering.');
    if (rAfter > 0.5 && !chosen.sft) tips.push('Add SFT with curated policy set.');
    if (rAfter > 0.5 && !chosen.rlhf) tips.push('Introduce RLHF/DPO for preference alignment.');
    if (!tips.length) tips.push('Refine prompts and targeted evaluations for remaining edge cases.');
    return tips.join(' ');
  }

  function render() {
    const type = typeEl.value;
    const severity = parseFloat(sevEl.value);
    const dataQ = parseFloat(dataEl.value);
    sevVal.textContent = severity.toFixed(2);
    dataVal.textContent = dataQ.toFixed(2);

    const chosen = {
      prompt: sPrompt?.checked ?? false,
      rag: sRAG?.checked ?? false,
      augment: sAug?.checked ?? false,
      filter: sFilter?.checked ?? false,
      sft: sSFT?.checked ?? false,
      rlhf: sRLHF?.checked ?? false
    };

    const r0 = 0.7 * (0.5 + 0.5 * severity);
    const rAfter = residualRisk(r0, chosen, type, severity, dataQ);
    const costs = costEstimate(chosen);

    barsEl.innerHTML = [
      bar('Base risk', r0, 'base'),
      bar('Residual risk', rAfter, 'residual')
    ].join('');

    metricsEl.innerHTML = `
      <div class="q45-metric-row">
        <span class="q45-metric-label">Residual risk</span>
        ${riskBadge(rAfter)}
        <span class="font-mono text-sm">${(rAfter * 100).toFixed(1)}%</span>
      </div>
      <div class="q45-metric-row">
        <span class="q45-metric-label">Profile</span>
        <span class="font-mono text-sm">${type}</span>
        <span class="q45-metric-note">Severity ${severity.toFixed(2)} &bull; Data ${dataQ.toFixed(2)}</span>
      </div>
      <div class="q45-metric-row">
        <span class="q45-metric-label">Risk reduction</span>
        <span class="font-mono text-sm">${((r0 - rAfter) * 100).toFixed(1)}%</span>
      </div>
      <div class="q45-metric-row">
        <span class="q45-metric-label">Cost profile</span>
        <span class="q45-metric-note">token <span class="font-mono">${costs.token.toFixed(2)}</span> &bull; train <span class="font-mono">${costs.train.toFixed(2)}</span> &bull; time <span class="font-mono">${costs.time.toFixed(2)}</span></span>
      </div>
    `;

    explainEl.innerHTML = `
      <div class="space-y-2">
        <div><strong>Layered controls.</strong> Prompt guardrails + filters = immediate surface reduction; RAG and data remediation improve factual / representational base; SFT/RLHF consolidate durable policy.</div>
        <div>Model: <span class="font-mono">r_after = r0 &middot; &prod; (1 - e_i)</span>; each <span class="font-mono">e_i</span> shrinks under high severity or weak data.</div>
        <div class="small-caption text-muted">Heuristic only&mdash;validate with audits, bias metrics, and red-teaming.</div>
      </div>
    `;

    if (guidanceEl) guidanceEl.innerHTML = recommend(type, rAfter, costs, chosen);

    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
  }

  [typeEl, sevEl, dataEl, sPrompt, sRAG, sAug, sFilter, sSFT, sRLHF].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  function applyPreset(name) {
    function setStrategies(obj) {
      if (sPrompt) sPrompt.checked = !!obj.prompt;
      if (sRAG) sRAG.checked = !!obj.rag;
      if (sAug) sAug.checked = !!obj.augment;
      if (sFilter) sFilter.checked = !!obj.filter;
      if (sSFT) sSFT.checked = !!obj.sft;
      if (sRLHF) sRLHF.checked = !!obj.rlhf;
    }
    if (name === 'guardrails') {
      typeEl.value = 'bias';
      sevEl.value = '0.5';
      dataEl.value = '0.6';
      setStrategies({ prompt: 1, filter: 1 });
    } else if (name === 'remediation') {
      typeEl.value = 'bias';
      sevEl.value = '0.6';
      dataEl.value = '0.3';
      setStrategies({ prompt: 1, augment: 1, filter: 1 });
    } else if (name === 'factual') {
      typeEl.value = 'factual';
      sevEl.value = '0.8';
      dataEl.value = '0.5';
      setStrategies({ prompt: 1, rag: 1, filter: 1, sft: 1 });
    } else if (name === 'toxicity') {
      typeEl.value = 'toxicity';
      sevEl.value = '0.7';
      dataEl.value = '0.6';
      setStrategies({ prompt: 1, filter: 1, rlhf: 1 });
    } else if (name === 'full') {
      typeEl.value = 'bias';
      sevEl.value = '0.6';
      dataEl.value = '0.5';
      setStrategies({ prompt: 1, rag: 1, augment: 1, filter: 1, sft: 1, rlhf: 1 });
    }
    render();
  }

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.getAttribute('data-q45-preset')));
  });

  (function initFromHash() {
    if (!location.hash) return;
    const match = location.hash.match(/question-45\?(.*)$/);
    if (!match) return;
    const params = new URLSearchParams(match[1]);
    const valueOr = (key, target) => {
      const value = params.get(key);
      if (value !== null && target) target.value = value;
    };
    valueOr('type', typeEl);
    valueOr('sev', sevEl);
    valueOr('data', dataEl);
    ['prompt', 'rag', 'augment', 'filter', 'sft', 'rlhf'].forEach((key) => {
      const value = params.get(key);
      const map = { prompt: sPrompt, rag: sRAG, augment: sAug, filter: sFilter, sft: sSFT, rlhf: sRLHF };
      if (value !== null && map[key]) {
        map[key].checked = value === '1';
      }
    });
  })();

  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question45Interactive = interactiveScript;
}
