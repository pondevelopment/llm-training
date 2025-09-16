const interactiveScript = () => {
      // Elements
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
  if (!EEl || !kEl || !TEl || !HEl || !PEl || !metricsEl || !barsEl || !explainEl || !insightEl) return; // defensive

      function bar(label, value, color='indigo', invert=false) {
        const pct = Math.max(0, Math.min(100, value*100));
        const text = (value*100).toFixed(1) + '%';
        const bg = invert ? `bg-${color}-200` : `bg-${color}-600`;
        const fill = invert ? `bg-${color}-600` : `bg-${color}-300`;
        return `<div role=\"group\" aria-label=\"${label} ${text}\">
          <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${text}</span></div>
          <div class=\"w-full h-3 ${bg} rounded relative overflow-hidden\">
            <div class=\"h-3 ${fill}\" style=\"width:${pct}%\"></div>
          </div>
        </div>`;
      }

      function compute() {
        let E = parseInt(EEl.value, 10);
        let k = parseInt(kEl.value, 10);
        const T = parseInt(TEl.value, 10);
        const H = parseFloat(HEl.value); // 0..1
        const P = parseFloat(PEl.value); // billions

        if (k > E) k = E; // clamp
        // entropy -> imbalance factor: lower entropy -> more peaky -> higher imbalance
        // Use coefficient of variation (CV) proxy: CV ≈ (1 - H) * sqrt((E - k)/E)
        const cv = Math.max(0, (1 - H) * Math.sqrt(Math.max(0, (E - k)/Math.max(1,E))));

  // Expected tokens per expert on average (balanced)
  const avgPerExpert = (T * k) / Math.max(1, E);
  // Notional capacity per expert per batch (tokens). This introduces T sensitivity in the model.
  const capPerExpert = 64; // tokens (heuristic for visualization)
  const worstFactor = 1 + cv; // simple headroom multiplier
  const maxPerExpertNeeded = avgPerExpert * worstFactor;
  const satPressure = Math.max(0, Math.min(1, maxPerExpertNeeded / capPerExpert));
  // Overflow/drop proxy combines imbalance risk and saturation pressure
  const imbalanceRisk = Math.max(0, 1 - 1/(1 + cv*cv));
  const overflow = Math.max(0, Math.min(1, imbalanceRisk * satPressure));
        

        // Activated param fraction and effective activated parameters (billions)
        const activeFrac = k / Math.max(1,E);
        const activeParamsB = P * activeFrac;

        // Theoretical dense->MoE compute ratio ~ activeFrac (ignoring router/fuse overhead)
        const flopRatio = activeFrac * (1 + 0.1*cv); // penalty with imbalance
        const speedupVsDense = 1/Math.max(0.05, flopRatio);

  return {E,k,T,H,P,cv,avgPerExpert,maxPerExpertNeeded,capPerExpert,satPressure,overflow,activeFrac,activeParamsB,flopRatio,speedupVsDense};
      }

      function render() {
        // Sync labels
        EVal.textContent = EEl.value;
        kVal.textContent = kEl.value;
        TVal.textContent = TEl.value;
        HVal.textContent = parseFloat(HEl.value).toFixed(2);
        PVal.textContent = PEl.value;

        const r = compute();

        metricsEl.innerHTML = `
          <div><strong>Experts (E):</strong> ${r.E}</div>
          <div><strong>Top‑k:</strong> ${r.k}</div>
          <div><strong>Active params:</strong> ${r.activeParamsB.toFixed(1)}B (${(r.activeFrac*100).toFixed(1)}%)</div>
          <div><strong>Avg tokens per expert:</strong> ${r.avgPerExpert.toFixed(1)}</div>
          <div><strong>Max needed (imbalance):</strong> ${r.maxPerExpertNeeded.toFixed(1)}</div>
          <div><strong>Per‑expert cap (notional):</strong> ${r.capPerExpert.toFixed(0)}</div>
          <div><strong>Overflow risk (proxy):</strong> ${(r.overflow*100).toFixed(1)}%</div>
          <div><strong>Speedup vs dense:</strong> ${r.speedupVsDense.toFixed(1)}×</div>
        `;

        barsEl.innerHTML = `
          ${bar('Active Fraction (k/E)', r.activeFrac, 'indigo')}
          ${bar('Overflow Risk', r.overflow, 'rose', true)}
          ${bar('Imbalance (CV proxy)', Math.min(1, r.cv), 'amber', true)}
          ${bar('Capacity Pressure', r.satPressure, 'violet', true)}
        `;

        explainEl.innerHTML = `
          <p>Only the top‑k experts are active per token. Compute scales with <span class="font-mono">k</span>, while parameters scale with <span class="font-mono">E</span>.</p>
          <p>Low routing entropy (peaky gate) increases imbalance and can overflow per‑expert capacity, reducing realized speedup.</p>
          <div class="math-display">$$
            \\text{active fraction} = \\frac{k}{E} \\\\
            \\text{speedup} \\propto \\frac{1}{\\text{active fraction}}
          $$</div>
        `;

  let insight;
  if (r.overflow > 0.4) insight = '⚠ High overflow risk — increase entropy (more uniform routing), reduce T, raise E, or reduce k.';
  else if (r.satPressure > 0.8) insight = '⚠ Capacity pressure is high — reduce batch tokens T or increase experts E.';
        else if (r.speedupVsDense > 10 && r.cv < 0.2) insight = '✅ Strong speedup with good balance — classic Top‑2 with many experts.';
        else insight = 'ℹ Tune entropy and E/k to balance speed vs capacity. Top‑2 often works well.';
        insightEl.textContent = insight;

        setTimeout(() => { if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise(); }, 40);
      }

      [EEl, kEl, TEl, HEl, PEl].forEach(el => { el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question37Interactive = interactiveScript;
}
