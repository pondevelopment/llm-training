(function () {
  'use strict';

  function getEl(id) {
    return document.getElementById(id);
  }

  function formatDelta(points) {
    const rounded = Math.round(points * 10) / 10;
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}`;
  }

  function clampNumber(n) {
    const parsed = Number(n);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const BASELINE = {
    arcCot: 77.2,
    rulerCwe: 91.8,
    advRisk: 61.4
  };

  const TABLE = {
    m1: {
      label: 'M1 (engagement): short + popular',
      points: {
        0: { arcCot: 74.9, rulerCwe: 84.4, advRisk: 77.6 },
        20: { arcCot: 73.4, rulerCwe: 81.6, advRisk: 91.6 },
        50: { arcCot: 68.2, rulerCwe: 64.1, advRisk: 80.2 },
        80: { arcCot: 67.2, rulerCwe: 63.2, advRisk: 88.6 },
        100: { arcCot: 57.2, rulerCwe: 52.3, advRisk: 88.8 }
      },
      note:
        'Under M1, the paper reports a smoother dose-response on reasoning and long-context: higher junk ratios generally worsen accuracy.'
    },
    m2: {
      label: 'M2 (semantic quality): sensational / low-substance',
      points: {
        0: { arcCot: 76.6, rulerCwe: 96.8, advRisk: 83.8 },
        20: { arcCot: 77.6, rulerCwe: 96.0, advRisk: 85.4 },
        50: { arcCot: 77.3, rulerCwe: 97.3, advRisk: 89.6 },
        80: { arcCot: 77.6, rulerCwe: 94.7, advRisk: 89.8 },
        100: { arcCot: 67.7, rulerCwe: 68.2, advRisk: 84.4 }
      },
      note:
        'Under M2, smaller amounts of control data appear to recover reasoning quickly, but long-context and safety effects still vary with the mix.'
    }
  };

  function classifyStatus(metricKey, value, controlValue) {
    const v = clampNumber(value);
    const c = clampNumber(controlValue);

    // For accuracy metrics: lower is worse.
    if (metricKey === 'arcCot' || metricKey === 'rulerCwe') {
      const delta = v - c;
      if (delta >= -2) return { label: 'Near control', chipClass: 'chip chip-success' };
      if (delta >= -10) return { label: 'Moderate drop', chipClass: 'chip chip-info' };
      return { label: 'Large drop', chipClass: 'chip chip-warning' };
    }

    // For risk metric: higher is worse.
    const delta = v - c;
    if (delta <= 2) return { label: 'Near control', chipClass: 'chip chip-success' };
    if (delta <= 10) return { label: 'Moderate risk increase', chipClass: 'chip chip-info' };
    return { label: 'Large risk increase', chipClass: 'chip chip-warning' };
  }

  function render() {
    const root = getEl('p66-explorer');
    if (!root) return;

    const metricEl = getEl('p66-junk-metric');
    const ratioEl = getEl('p66-junk-ratio');

    const arcEl = getEl('p66-arc');
    const cweEl = getEl('p66-cwe');
    const advEl = getEl('p66-adv');

    const arcDeltaEl = getEl('p66-arc-delta');
    const cweDeltaEl = getEl('p66-cwe-delta');
    const advDeltaEl = getEl('p66-adv-delta');

    const statusEl = getEl('p66-status');
    const explanationEl = getEl('p66-explanation');

    if (
      !metricEl ||
      !ratioEl ||
      !arcEl ||
      !cweEl ||
      !advEl ||
      !arcDeltaEl ||
      !cweDeltaEl ||
      !advDeltaEl ||
      !statusEl ||
      !explanationEl
    ) {
      return;
    }

    const metricKey = metricEl.value === 'm2' ? 'm2' : 'm1';
    const ratio = clampNumber(ratioEl.value);

    const metricConfig = TABLE[metricKey];
    const point = metricConfig.points[ratio] || metricConfig.points[0];
    const control = metricConfig.points[0];

    arcEl.textContent = point.arcCot.toFixed(1);
    cweEl.textContent = point.rulerCwe.toFixed(1);
    advEl.textContent = point.advRisk.toFixed(1);

    const arcDelta = point.arcCot - control.arcCot;
    const cweDelta = point.rulerCwe - control.rulerCwe;
    const advDelta = point.advRisk - control.advRisk;

    arcDeltaEl.textContent = `Δ vs control: ${formatDelta(arcDelta)} points (control ${control.arcCot.toFixed(1)})`;
    cweDeltaEl.textContent = `Δ vs control: ${formatDelta(cweDelta)} points (control ${control.rulerCwe.toFixed(1)})`;
    advDeltaEl.textContent = `Δ vs control: ${formatDelta(advDelta)} points (control ${control.advRisk.toFixed(1)}; lower is better)`;

    const arcStatus = classifyStatus('arcCot', point.arcCot, control.arcCot);
    const cweStatus = classifyStatus('rulerCwe', point.rulerCwe, control.rulerCwe);
    const advStatus = classifyStatus('advRisk', point.advRisk, control.advRisk);

    const worst = [arcStatus, cweStatus, advStatus].sort((a, b) => {
      const rank = s => (s.chipClass.includes('warning') ? 2 : s.chipClass.includes('info') ? 1 : 0);
      return rank(b) - rank(a);
    })[0];

    statusEl.className = `${worst.chipClass} text-xs`;
    statusEl.textContent = worst.label;

    const baselineArcDelta = point.arcCot - BASELINE.arcCot;
    const baselineCweDelta = point.rulerCwe - BASELINE.rulerCwe;
    const baselineAdvDelta = point.advRisk - BASELINE.advRisk;

    explanationEl.innerHTML = `
      <p><strong>Selected intervention:</strong> ${metricConfig.label}, ${ratio}% junk.</p>
      <p class="text-sm text-body">${metricConfig.note}</p>
      <div class="panel panel-neutral-soft p-3 text-xs panel-muted space-y-1">
        <p><strong>Δ vs baseline (same table):</strong></p>
        <p>ARC-CoT: ${formatDelta(baselineArcDelta)} points (baseline ${BASELINE.arcCot.toFixed(1)})</p>
        <p>RULER-CWE: ${formatDelta(baselineCweDelta)} points (baseline ${BASELINE.rulerCwe.toFixed(1)})</p>
        <p>AdvBench risk: ${formatDelta(baselineAdvDelta)} points (baseline ${BASELINE.advRisk.toFixed(1)}; lower is better)</p>
      </div>
      <p class="text-xs panel-muted">Note: this explorer is a direct, table-driven view of one model configuration (Llama3 8B) as reported in the paper; it is not a prediction for other models or corpora.</p>
    `;
  }

  function init() {
    const root = getEl('p66-explorer');
    if (!root) return;

    const metricEl = getEl('p66-junk-metric');
    const ratioEl = getEl('p66-junk-ratio');
    if (!metricEl || !ratioEl) return;

    metricEl.addEventListener('change', render);
    ratioEl.addEventListener('change', render);

    render();
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;
  interactiveScript.render = render;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
