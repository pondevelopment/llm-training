const interactiveScript = () => {
  const depthInput = document.getElementById('q43-depth');
  const gainInput = document.getElementById('q43-gain');
  const residualInput = document.getElementById('q43-res');
  const presetButtons = Array.from(document.querySelectorAll('[data-q43-preset]'));
  const depthValue = document.getElementById('q43-depth-val');
  const gainValue = document.getElementById('q43-gain-val');
  const residualValue = document.getElementById('q43-res-val');
  const barsEl = document.getElementById('q43-bars');
  const metricsEl = document.getElementById('q43-metrics');
  const explainEl = document.getElementById('q43-explain');
  const guidanceEl = document.getElementById('q43-guidance');
  const chartEl = document.getElementById('q43-chart');
  const detailEl = document.getElementById('q43-layer-detail');
  const normHidden = document.getElementById('q43-norm');
  const normToggle = document.getElementById('q43-norm-toggle');
  const normButtons = Array.from(normToggle?.querySelectorAll('button') || []);
  const shortcutHidden = document.getElementById('q43-shortcut');
  const shortcutToggle = document.getElementById('q43-shortcut-toggle');
  const shortcutButtons = Array.from(shortcutToggle?.querySelectorAll('button') || []);

  if (!depthInput || !gainInput || !residualInput || !normHidden || !shortcutHidden) {
    return;
  }

  const syncToggleState = (buttons, attr, current) => {
    buttons.forEach((btn) => {
      const value = btn.getAttribute(attr);
      const isActive = value === current;
      btn.classList.toggle('toggle-active', isActive);
      btn.classList.toggle('toggle-inactive', !isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const effGain = (g, norm) => {
    if (norm === 'pre') return 0.6 * g + 0.4;
    if (norm === 'post') return 0.8 * g + 0.2;
    return g;
  };

  const simulate = (L, g, alpha, norm, hop) => {
    const gEff = effGain(g, norm);
    const grads = new Array(L).fill(0);
    let gradient = 1;
    for (let layer = L - 1; layer >= 0; layer -= 1) {
      const baseJacobian = alpha > 0 ? 1 + alpha * gEff : gEff;
      const shortcutFraction = hop > 0 ? 0.3 : 0;
      const longFraction = 1 - shortcutFraction;
      const step = longFraction * baseJacobian + shortcutFraction * Math.pow(baseJacobian, Math.max(1, Math.floor(hop)));
      gradient *= step;
      grads[layer] = Math.abs(gradient);
    }
    return grads;
  };

  const simulateBaseline = (L, g) => {
    const grads = new Array(L).fill(0);
    let gradient = 1;
    for (let layer = L - 1; layer >= 0; layer -= 1) {
      gradient *= g;
      grads[layer] = Math.abs(gradient);
    }
    return grads;
  };

  const fmtShort = (value) => {
    const abs = Math.abs(value);
    if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return (value / 1e3).toFixed(2) + 'k';
    if (abs < 1e-3 && abs > 0) return value.toExponential(1);
    return value.toFixed(3);
  };

  const layerRow = (layerIdx, label, baselineVal, improvedVal, maxVal) => {
    const basePct = Math.max(4, Math.round((baselineVal / maxVal) * 100));
    const improvedPct = Math.max(4, Math.round((improvedVal / maxVal) * 100));
    return [
      '<div class="q43-layer-row" data-layer="' + layerIdx + '" data-label="' + label + '" tabindex="0">',
      '<span class="q43-layer-index">' + label + '</span>',
      '<div class="flex flex-col gap-1 w-full">',
        '<div class="flex items-center gap-2">',
          '<span class="chip chip-warning text-xs">Baseline</span>',
          '<div class="flex-1" style="height:6px;border-radius:9999px;background:color-mix(in srgb, var(--tone-rose-soft) 70%, transparent);">',
            '<div style="height:100%;width:' + basePct + '%;background:var(--tone-rose-strong);border-radius:inherit;opacity:0.9;"></div>',
          '</div>',
          '<span class="font-mono text-xs">' + fmtShort(baselineVal) + '</span>',
        '</div>',
        '<div class="flex items-center gap-2">',
          '<span class="chip chip-success text-xs">Transformer</span>',
          '<div class="flex-1" style="height:6px;border-radius:9999px;background:color-mix(in srgb, var(--tone-emerald-soft) 70%, transparent);">',
            '<div style="height:100%;width:' + improvedPct + '%;background:var(--tone-emerald-strong);border-radius:inherit;opacity:0.9;"></div>',
          '</div>',
          '<span class="font-mono text-xs">' + fmtShort(improvedVal) + '</span>',
        '</div>',
      '</div>',
    '</div>'
    ].join('');
  };

  const ratioBar = (ratio, tone) => {
    const cap = 10;
    const clamped = Math.max(0, Math.min(cap, ratio));
    const pct = Math.round((clamped / cap) * 100);
    return '<div class="q43-ratio"><div class="q43-ratio-header"><span>Improvement vs baseline</span><span>×' + ratio.toFixed(2) + '</span></div><div class="q43-ratio-track"><div class="q43-ratio-fill q43-ratio-fill--' + tone + '" style="width:' + pct + '%"></div></div></div>';
  };

  const assessHealth = (L, g, alpha, norm, hop, endToStart) => {
    const gEff = effGain(g, norm);
    const Jstep = 1 + alpha * gEff;
    let status = 'healthy';
    const reasons = [];

    if (endToStart < 1e-8) {
      status = 'vanishing';
      reasons.push('End→start factor extremely small.');
    }
    if (endToStart > 1e8) {
      status = 'exploding';
      reasons.push('End→start factor extremely large.');
    }
    if (Jstep < 0.7) {
      if (status === 'healthy') status = 'caution';
      reasons.push('Per-layer step < 0.7 (strong decay risk).');
    }
    if (Jstep > 2.2) {
      if (status === 'healthy') status = 'caution';
      reasons.push('Per-layer step > 2.2 (amplification risk).');
    }
    if (alpha < 0.05) {
      if (status === 'healthy') status = 'caution';
      reasons.push('Residual weight α very small (block ≈ identity).');
    }
    if (alpha > 1.5) {
      if (status === 'healthy') status = 'caution';
      reasons.push('Residual weight α unusually large (could amplify noise).');
    }
    if (norm === 'none') {
      if (status === 'healthy') status = 'caution';
      reasons.push('No normalization: prefer Pre-LN/RMSNorm for scale control.');
    }
    if (norm === 'post' && L >= 48) {
      if (status === 'healthy') status = 'caution';
      reasons.push('Very deep Post-LN stack; Pre-LN typically more stable.');
    }
    if (g < 0.75) {
      reasons.push('Base gain g < 0.75: raw chain would vanish quickly.');
    }
    if (g > 1.25) {
      if (status === 'healthy') status = 'caution';
      reasons.push('Base gain g > 1.25: raw chain could explode.');
    }
    if (hop === 0) {
      reasons.push('No attention shortcut (all dependencies traverse full depth).');
    }

    return { status, reasons, Jstep, gEff };
  };

  const statusBadge = (status) => {
    const classMap = {
      healthy: 'chip chip-success',
      caution: 'chip chip-warning',
      vanishing: 'chip chip-danger',
      exploding: 'chip chip-danger',
    };
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return '<span class="' + (classMap[status] || 'chip') + '">' + label + '</span>';
  };

  const render = () => {
    const L = parseInt(depthInput.value, 10);
    const g = parseFloat(gainInput.value);
    const alpha = parseFloat(residualInput.value);
    const norm = normHidden?.value || "pre";
    const hop = parseInt(shortcutHidden?.value || "0", 10);

    syncToggleState(normButtons, 'data-q43-norm', norm);
    syncToggleState(shortcutButtons, 'data-q43-shortcut', String(hop));

    depthValue.textContent = L;
    gainValue.textContent = g.toFixed(2);
    residualValue.textContent = alpha.toFixed(2);

    const baseline = simulateBaseline(L, g);
    const improved = simulate(L, g, alpha, norm, hop);
    const endToStart = improved[0] || 0;
    const health = assessHealth(L, g, alpha, norm, hop, endToStart);

    const maxVal = Math.max.apply(null, baseline.concat(improved, [1e-9]));
    const rows = baseline.map((value, idx) => {
      const label = String(idx + 1).padStart(2, '0');
      return layerRow(idx, label, value, improved[idx], maxVal);
    });

    let alertHtml = '';
    if (health.status !== 'healthy') {
      const messageMap = {
        vanishing: 'Vanishing gradient detected.',
        exploding: 'Exploding gradient risk.',
        caution: 'Caution: unstable steps.',
      };
      const message = messageMap[health.status] || 'Configuration warning.';
      alertHtml = '<div class="q43-alert q43-alert--' + health.status + '">⚠ ' + message + '</div>';
    }
    barsEl.innerHTML = alertHtml + rows.join('');

    const layerRows = Array.from(barsEl.querySelectorAll('.q43-layer-row'));
    const totalLayers = layerRows.length;

    let baselineDots = [];
    let improvedDots = [];
    if (chartEl) {
      if (totalLayers === 0) {
        chartEl.innerHTML = '';
      } else {
        const eps = 1e-9;
        const logBaseline = baseline.map((v) => Math.log10(v + eps));
        const logImproved = improved.map((v) => Math.log10(v + eps));
        const allLogs = logBaseline.concat(logImproved);
        const maxLog = Math.max.apply(null, allLogs);
        const minLog = Math.min.apply(null, allLogs);
        const range = Math.max(1e-6, maxLog - minLog);
        const chartWidth = Math.max(240, (totalLayers - 1) * 28 || 240);
        const chartHeight = 90;
        chartEl.setAttribute('viewBox', '0 0 ' + chartWidth + ' ' + chartHeight);
        chartEl.setAttribute('preserveAspectRatio', 'none');
        chartEl.setAttribute('role', 'img');
        chartEl.setAttribute('aria-label', 'Gradient magnitude trend by layer');
        const pointString = (arr) => arr.map((val, idx) => {
          const x = totalLayers === 1 ? chartWidth / 2 : (idx / (totalLayers - 1)) * chartWidth;
          const log = Math.log10(val + eps);
          const y = chartHeight - ((log - minLog) / range) * chartHeight;
          return x.toFixed(2) + ',' + y.toFixed(2);
        }).join(' ');
        const baselinePoints = pointString(baseline);
        const improvedPoints = pointString(improved);
        const gridLines = [0.25, 0.5, 0.75].map((fraction) => {
          const y = (chartHeight * fraction).toFixed(2);
          return '<line x1="0" y1="' + y + '" x2="' + chartWidth + '" y2="' + y + '" stroke="color-mix(in srgb, var(--color-border) 40%, transparent)" stroke-width="0.5" />';
        }).join('');
        const circles = (arr, tone) => arr.map((val, idx) => {
          const x = totalLayers === 1 ? chartWidth / 2 : (idx / (totalLayers - 1)) * chartWidth;
          const log = Math.log10(val + eps);
          const y = chartHeight - ((log - minLog) / range) * chartHeight;
          const color = tone === 'baseline' ? 'var(--tone-rose-strong)' : 'var(--tone-emerald-strong)';
          return '<circle data-layer="' + idx + '" data-series="' + tone + '" cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="3" fill="' + color + '" fill-opacity="0.9" style="cursor:pointer" />';
        }).join('');
        chartEl.innerHTML = [
          '<rect width="' + chartWidth + '" height="' + chartHeight + '" fill="transparent" />',
          gridLines,
          '<polyline points="' + baselinePoints + '" fill="none" stroke="var(--tone-rose-strong)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
          '<polyline points="' + improvedPoints + '" fill="none" stroke="var(--tone-emerald-strong)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />',
          circles(baseline, 'baseline'),
          circles(improved, 'improved')
        ].join('');
        baselineDots = Array.from(chartEl.querySelectorAll('circle[data-series="baseline"]'));
        improvedDots = Array.from(chartEl.querySelectorAll('circle[data-series="improved"]'));
      }
    }

    let activeLayer = 0;
    const highlightLayer = (layerIdx) => {
      if (!layerRows.length) return;
      const clamped = Math.max(0, Math.min(layerRows.length - 1, layerIdx));
      activeLayer = clamped;
      layerRows.forEach((row, idx) => {
        if (idx === clamped) {
          row.style.background = 'color-mix(in srgb, var(--tone-emerald-soft) 30%, transparent)';
          row.style.borderColor = 'color-mix(in srgb, var(--tone-emerald-strong) 45%, transparent)';
        } else {
          row.style.background = '';
          row.style.borderColor = '';
        }
      });
      baselineDots.forEach((dot, idx) => dot.setAttribute('r', idx === clamped ? '5' : '3'));
      improvedDots.forEach((dot, idx) => dot.setAttribute('r', idx === clamped ? '5' : '3'));
      if (detailEl && layerRows[clamped]) {
        const label = layerRows[clamped].getAttribute('data-label') || String(clamped + 1).padStart(2, '0');
        const baseVal = baseline[clamped];
        const improvedVal = improved[clamped];
        const ratio = improvedVal / (baseVal || 1e-9);
        detailEl.innerHTML = 'Layer ' + label + ': baseline <span class="font-mono">' + fmtShort(baseVal) + '</span> → transformer <span class="font-mono">' + fmtShort(improvedVal) + '</span> (×' + ratio.toFixed(2) + ')';
      }
    };

    layerRows.forEach((row, idx) => {
      row.addEventListener('mouseenter', () => highlightLayer(idx));
      row.addEventListener('focus', () => highlightLayer(idx));
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          highlightLayer(idx);
        }
      });
    });

    if (chartEl) {
      const dots = Array.from(chartEl.querySelectorAll('circle'));
      dots.forEach((dot) => {
        const layerIdx = parseInt(dot.getAttribute('data-layer'), 10);
        if (Number.isFinite(layerIdx)) {
          dot.addEventListener('mouseenter', () => highlightLayer(layerIdx));
          dot.addEventListener('focus', () => highlightLayer(layerIdx));
          dot.addEventListener('touchstart', () => highlightLayer(layerIdx), { passive: true });
        }
      });
      chartEl.addEventListener('mouseleave', () => highlightLayer(activeLayer));
    }

    if (layerRows.length) {
      highlightLayer(0);
    } else if (detailEl) {
      detailEl.textContent = '';
    }

    const stats = (arr) => {
      const min = Math.min.apply(null, arr);
      const max = Math.max.apply(null, arr);
      const last = arr[0];
      return { min, max, last };
    };

    const baselineStats = stats(baseline);
    const improvedStats = stats(improved);
    const vanilla = Math.pow(g, L);
    const improvementRatio = improvedStats.last / (vanilla || 1e-12);
    const ratioTone = improvementRatio > 1.5 ? 'emerald' : improvementRatio < 0.75 ? 'rose' : 'indigo';

    const metricItems = [
      { label: 'Baseline end→start', value: fmtShort(vanilla) },
      { label: 'Transformer end→start', value: fmtShort(improvedStats.last) },
      { label: 'Per-layer step', value: health.Jstep.toFixed(3) + ' (g_eff ≈ ' + health.gEff.toFixed(3) + ')' },
      { label: 'Baseline min / max', value: fmtShort(baselineStats.min) + ' / ' + fmtShort(baselineStats.max) },
      { label: 'Transformer min / max', value: fmtShort(improvedStats.min) + ' / ' + fmtShort(improvedStats.max) },
    ];

    const metricList = metricItems
      .map((item) => '<li><strong>' + item.label + ':</strong> <span class="font-mono">' + item.value + '</span></li>')
      .join('');

    const statusSection = '<div class="panel panel-neutral-soft p-3 text-sm space-y-2">' +
      '<div class="small-caption text-muted">Status</div>' +
      '<div>' + statusBadge(health.status) + '</div>' +
      '<ul class="list-disc ml-5 space-y-1">' + metricList + '</ul>' +
    '</div>';

    const ratioSection = '<div class="panel panel-neutral-soft p-3 text-sm space-y-2">' + ratioBar(improvementRatio, ratioTone) + '</div>';

    const watchouts = health.reasons.length
      ? '<div class="panel panel-warning p-3 text-sm space-y-1"><div class="font-semibold">Watch outs</div><ul class="list-disc ml-5 space-y-1">' + health.reasons.map((reason) => '<li>' + reason + '</li>').join('') + '</ul></div>'
      : '';

    metricsEl.innerHTML = [statusSection, ratioSection, watchouts].filter(Boolean).join('');

    if (guidanceEl) {
      const advice = [];
      if (health.status === 'vanishing') advice.push('Increase α or g, or enable Pre-LN.');
      if (health.status === 'exploding') advice.push('Lower g or α; switch to Pre-LN; consider smaller depth.');
      if (health.status === 'caution') advice.push('Tune toward J_step ≈ 1 (adjust α or g, prefer Pre-LN).');
      if (hop === 0 && health.status === 'healthy') advice.push('Enable attention shortcut to further reduce effective depth.');
      if (!advice.length) advice.push('Configuration is balanced; further gains may trade off stability.');
      guidanceEl.textContent = advice.join(' ');
    }

    const gEff = norm === 'pre' ? 0.6 * g + 0.4 : norm === 'post' ? 0.8 * g + 0.2 : g;
    const Jstep = 1 + alpha * gEff;
    const shortcutFraction = hop > 0 ? 0.3 : 0;
    const longFraction = 1 - shortcutFraction;
    const perLayerMix = longFraction * Jstep + shortcutFraction * Math.pow(Jstep, Math.max(1, Math.floor(hop)));
    const normLabel = norm === 'pre' ? 'Pre-LN' : norm === 'post' ? 'Post-LN' : 'No norm';

    let cautionNote = 'Per-layer step within healthy band (~0.7–2.2) — stabilized by residual + normalization.';
    if (Jstep > 2.2) {
      cautionNote = '<span class="text-warning">Note:</span> very large per-layer step (>2.2) may amplify noise; reduce α or g.';
    } else if (Jstep < 0.7) {
      cautionNote = '<span class="text-warning">Note:</span> very small per-layer step (<0.7) risks vanishing; increase α or g, or enable normalization.';
    }

    let shortcutBlurb = 'No shortcut route used';
    if (hop > 0) {
      shortcutBlurb = 'About 30% of gradient takes a ' + hop + '-hop route';
    }

    let explainHtml = '';
    explainHtml += '<div class="space-y-2">';
    explainHtml += '<div><strong>Your setup.</strong> L=<span class="font-mono">' + L + '</span>, g=<span class="font-mono">' + g.toFixed(2) + '</span>, α=<span class="font-mono">' + alpha.toFixed(2) + '</span>, norm=<span class="font-mono">' + normLabel + '</span>, shortcut=<span class="font-mono">' + (hop > 0 ? 'on (hop=' + hop + ')' : 'off') + '</span>.</div>';
    explainHtml += '<div><strong>Effective per-layer Jacobian.</strong> With ' + normLabel + ', the layer gain is pulled toward 1: <span class="font-mono">g_eff ≈ ' + gEff.toFixed(3) + '</span>. Residual gives <span class="font-mono">J_eff ≈ I + α·g_eff</span> ⇒ scalar step ≈ <span class="font-mono">' + Jstep.toFixed(3) + '</span>.</div>';
    explainHtml += '<div><strong>Short paths.</strong> ' + shortcutBlurb + '; per-layer mixed step ≈ <span class="font-mono">' + perLayerMix.toFixed(3) + '</span>, boosting end→start signal compared to <span class="font-mono">g^L</span>.</div>';
    explainHtml += '<div class="text-xs">' + cautionNote + '</div>';
    explainHtml += '<div class="small-caption text-muted">Heuristic model for intuition only; real networks have anisotropic Jacobians, cross-layer correlations, and optimizer dynamics.</div>';
    explainHtml += '</div>';
    explainEl.innerHTML = explainHtml;

    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise([explainEl]);
    }
  };

  [depthInput, gainInput, residualInput].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  normButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-q43-norm');
      if (!value || normHidden.value === value) return;
      normHidden.value = value;
      syncToggleState(normButtons, 'data-q43-norm', value);
      render();
    });
  });

  shortcutButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-q43-shortcut');
      if (!value || shortcutHidden.value === value) return;
      shortcutHidden.value = value;
      syncToggleState(shortcutButtons, 'data-q43-shortcut', value);
      render();
    });
  });

  const applyPreset = (name) => {
    if (name === 'stable-mid') {
      depthInput.value = '12';
      gainInput.value = '0.92';
      residualInput.value = '0.5';
      normHidden.value = 'pre';
      shortcutHidden.value = '0';
    } else if (name === 'deep') {
      depthInput.value = '36';
      gainInput.value = '0.95';
      residualInput.value = '0.6';
      normHidden.value = 'pre';
      shortcutHidden.value = '4';
    } else if (name === 'risk') {
      depthInput.value = '24';
      gainInput.value = '1.12';
      residualInput.value = '0.8';
      normHidden.value = 'post';
      shortcutHidden.value = '0';
    }
    syncToggleState(normButtons, 'data-q43-norm', normHidden.value);
    syncToggleState(shortcutButtons, 'data-q43-shortcut', shortcutHidden.value);
    render();
  };

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.getAttribute('data-q43-preset')));
  });

  (function initFromHash() {
    if (!window.location.hash) return;
    const match = window.location.hash.match(/question-43\?(.*)$/);
    if (!match) return;
    const params = new URLSearchParams(match[1]);
    if (params.get('L')) depthInput.value = params.get('L');
    if (params.get('g')) gainInput.value = params.get('g');
    if (params.get('a')) residualInput.value = params.get('a');
    if (params.get('n')) normHidden.value = params.get('n');
    if (params.get('h')) shortcutHidden.value = params.get('h');
  })();

  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question43Interactive = interactiveScript;
}
