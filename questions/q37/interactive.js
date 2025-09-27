const interactiveScript = () => {
  const EEl = document.getElementById('q37-E');
  const kEl = document.getElementById('q37-k');
  const TEl = document.getElementById('q37-T');
  const HEl = document.getElementById('q37-entropy');
  const PEl = document.getElementById('q37-P');
  const EVal = document.getElementById('q37-E-val');
  const kVal = document.getElementById('q37-k-val');
  const TVal = document.getElementById('q37-T-val');
  const HVal = document.getElementById('q37-entropy-val');
  const PVal = document.getElementById('q37-P-val');
  const metricsEl = document.getElementById('q37-metrics');
  const barsEl = document.getElementById('q37-bars');
  const explainEl = document.getElementById('q37-explain');
  const insightEl = document.getElementById('q37-insight');

  if (!EEl || !kEl || !TEl || !HEl || !PEl || !metricsEl || !barsEl || !explainEl || !insightEl) {
    return;
  }

  function metricItem(label, value, note) {
    const noteMarkup = note ? '<span class="q37-metric-note">' + note + '</span>' : '';
    return (
      '<div class="q37-metric-row" role="listitem">\n' +
      '  <span class="q37-metric-label">' + label + '</span>\n' +
      '  <span class="q37-metric-value"><span class="q37-metric-value-main">' + value + '</span>' + noteMarkup + '</span>\n' +
      '</div>'
    );
  }

  function bar(label, value, tone) {
    const pct = Math.max(0, Math.min(100, value * 100));
    const pctLabel = (value * 100).toFixed(1);
    const toneAttr = tone ? ' data-tone="' + tone + '"' : '';
    return (
      '<div class="q37-bar" role="group" aria-label="' + label + ' ' + pctLabel + ' percent">\n' +
      '  <div class="q37-bar-head"><span>' + label + '</span><span class="q37-bar-value">' + pctLabel + '%</span></div>\n' +
      '  <div class="context-meter"' + toneAttr + '><div class="context-meter-fill" style="width:' + pct + '%"></div></div>\n' +
      '</div>'
    );
  }

  function compute() {
    const T = parseInt(TEl.value, 10);
    const H = parseFloat(HEl.value);
    const P = parseFloat(PEl.value);

    let E = parseInt(EEl.value, 10);
    let k = parseInt(kEl.value, 10);
    if (k > E) k = E;

    const cv = Math.max(0, (1 - H) * Math.sqrt(Math.max(0, (E - k) / Math.max(1, E))));
    const avgPerExpert = (T * k) / Math.max(1, E);
    const capPerExpert = 64;
    const worstFactor = 1 + cv;
    const maxPerExpertNeeded = avgPerExpert * worstFactor;
    const satPressure = Math.max(0, Math.min(1, maxPerExpertNeeded / capPerExpert));
    const imbalanceRisk = Math.max(0, 1 - 1 / (1 + cv * cv));
    const overflow = Math.max(0, Math.min(1, imbalanceRisk * satPressure));

    const activeFrac = k / Math.max(1, E);
    const activeParamsB = P * activeFrac;
    const flopRatio = activeFrac * (1 + 0.1 * cv);
    const speedupVsDense = 1 / Math.max(0.05, flopRatio);

    return {
      E: E,
      k: k,
      T: T,
      H: H,
      P: P,
      cv: cv,
      avgPerExpert: avgPerExpert,
      maxPerExpertNeeded: maxPerExpertNeeded,
      capPerExpert: capPerExpert,
      satPressure: satPressure,
      overflow: overflow,
      activeFrac: activeFrac,
      activeParamsB: activeParamsB,
      flopRatio: flopRatio,
      speedupVsDense: speedupVsDense
    };
  }

  function render() {
    EVal.textContent = EEl.value;
    kVal.textContent = kEl.value;
    TVal.textContent = TEl.value;
    HVal.textContent = parseFloat(HEl.value).toFixed(2);
    PVal.textContent = PEl.value;

    const r = compute();

    metricsEl.innerHTML = (
      '<div class="q37-metric-list">' +
        metricItem('Experts (E)', r.E) +
        metricItem('Top-k', r.k) +
        metricItem('Active params', r.activeParamsB.toFixed(1) + 'B', (r.activeFrac * 100).toFixed(1) + '% active') +
        metricItem('Avg tokens per expert', r.avgPerExpert.toFixed(1)) +
        metricItem('Max needed (imbalance)', r.maxPerExpertNeeded.toFixed(1)) +
        metricItem('Per-expert cap', r.capPerExpert.toFixed(0), 'notional') +
        metricItem('Overflow risk', (r.overflow * 100).toFixed(1) + '%') +
        metricItem('Speedup vs dense', r.speedupVsDense.toFixed(1) + '×') +
      '</div>'
    );

    barsEl.innerHTML = (
      '<div class="q37-bar-list">' +
        bar('Active Fraction (k/E)', r.activeFrac) +
        bar('Overflow Risk', r.overflow, 'rose') +
        bar('Imbalance (CV proxy)', Math.min(1, r.cv), 'amber') +
        bar('Capacity Pressure', r.satPressure, 'violet') +
      '</div>'
    );

    let insight;
    if (r.overflow > 0.4) {
      insight = '⚠ High overflow risk — increase entropy (more uniform routing), reduce T, raise E, or reduce k.';
    } else if (r.satPressure > 0.8) {
      insight = '⚠ Capacity pressure is high — reduce batch tokens T or increase experts E.';
    } else if (r.speedupVsDense > 10 && r.cv < 0.2) {
      insight = '✅ Strong speedup with good balance — classic Top-2 with many experts.';
    } else {
      insight = 'ℹ Tune entropy and E/k to balance speed vs capacity. Top-2 often works well.';
    }
    insightEl.textContent = insight;
  }

  [EEl, kEl, TEl, HEl, PEl].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  render();

  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([explainEl]);
  }
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question37Interactive = interactiveScript;
}
