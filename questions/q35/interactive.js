const interactiveScript = () => {
      const methodEl = document.getElementById('q35-method');
      const tasksEl = document.getElementById('q35-tasks');
      const tasksVal = document.getElementById('q35-tasks-val');
      const shiftEl = document.getElementById('q35-shift');
      const trainableEl = document.getElementById('q35-trainable');
      const trainableVal = document.getElementById('q35-trainable-val');
      const metricsEl = document.getElementById('q35-metrics');
      const barsEl = document.getElementById('q35-bars');
      const explainEl = document.getElementById('q35-explain');
      const insightEl = document.getElementById('q35-insight');
      if(!methodEl) return;

      const METHOD_DATA = {
        lora: { baseTrainable: 0.8, alpha: 0.35, label: 'LoRA / QLoRA', tone: 'emerald', explain: 'Low-rank residual matrices focus adaptation capacity while freezing full weight tensors. QLoRA quantizes the base to 4-bit, further cutting memory while preserving signal through low-rank updates.' },
        adapters: { baseTrainable: 1.5, alpha: 0.4, label: 'Adapters', tone: 'indigo', explain: 'Inserted bottleneck modules learn task deltas. Base weights stay untouched, enabling modular stacking and quick task switching.' },
        prefix: { baseTrainable: 0.3, alpha: 0.45, label: 'Prefix / P-Tuning', tone: 'sky', explain: 'Virtual tokens steer attention distributions without modifying internal projection weights—extremely lightweight but can saturate for deep shifts.' },
        bitfit: { baseTrainable: 0.1, alpha: 0.55, label: 'BitFit (Bias-Only)', tone: 'rose', explain: 'Updates only bias vectors—very small footprint; retains knowledge well but limited expressivity for large domain shifts.' },
        full: { baseTrainable: 100, alpha: 1.0, label: 'Full Fine-Tune', tone: 'indigo', explain: 'All weights updated—maximum capacity but high interference and catastrophic forgetting risk without rehearsal or regularisation.' }
      };

      const SHIFT_FACTOR = { low: 0.5, med: 1.0, high: 1.7 };

      function compute() {
        const method = methodEl.value;
        const tasks = parseInt(tasksEl.value, 10);
        const shift = shiftEl.value;
        const chosenPct = parseFloat(trainableEl.value); // user chosen (% of full model)
        const m = METHOD_DATA[method];

        // Recommended typical range anchor (baseTrainable) used for guidance only
        const recommended = m.baseTrainable; // ~ expected % for typical config

        // We no longer hard-cap aggressively; we allow larger values but model diminishing returns via nonlinear risk curve
        const effectivePct = method === 'full' ? chosenPct : chosenPct; // direct mapping

        // Scaling constant to amplify slider effect (tunable)
        const K = 6; // higher -> more sensitivity to % / tasks / shift
        // Forgetting risk hazard accumulation
        const rawHazard = m.alpha * K * (effectivePct / 100) * SHIFT_FACTOR[shift] * tasks;
        const forgettingRisk = 1 - Math.exp(-rawHazard); // saturates near 1
        const retention = 1 - forgettingRisk; // complement

        const memoryPerTask = effectivePct / 100; // storage fraction per adapter (if fully stored separately)
        const cumulativeMemory = memoryPerTask * tasks;
        const efficiency = retention / Math.max(0.02, cumulativeMemory); // guard small denom

        const deviation = effectivePct / Math.max(0.0001, recommended); // how far from typical
        return { method: m, tasks, shift, recommended, chosenPct: effectivePct, deviation, forgettingRisk, retention, memoryPerTask, cumulativeMemory, efficiency };
      }

      function bar(label, value, tone='indigo') {
        const pct = Math.max(0, Math.min(100, value * 100));
        const pctLabel = (value * 100).toFixed(1);
        const toneAttr = tone && tone !== 'indigo' ? ` data-tone="${tone}"` : '';
        return `<div class="space-y-1" role="group" aria-label="${label} ${pctLabel} percent">
          <div class="flex items-center justify-between small-caption text-muted"><span>${label}</span><span>${pctLabel}%</span></div>
          <div class="context-meter"${toneAttr}>
            <div class="context-meter-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
      }

      function render() {
        tasksVal.textContent = tasksEl.value;
        trainableVal.textContent = parseFloat(trainableEl.value).toFixed(1) + '%';
        const r = compute();

        const deviationNote = r.deviation > 4 ? 'very high' : r.deviation > 2 ? 'high' : r.deviation < 0.5 ? 'low' : 'typical';
        metricsEl.innerHTML = `
          <dl class="space-y-1 text-sm">
            <div><dt class="small-caption text-muted">Method</dt><dd class="text-heading font-semibold">${r.method.label}</dd></div>
            <div><dt class="small-caption text-muted">Trainable % chosen</dt><dd>${r.chosenPct.toFixed(2)}% <span class="small-caption text-muted">(${deviationNote})</span></dd></div>
            <div><dt class="small-caption text-muted">Recommended ~</dt><dd>${r.recommended.toFixed(2)}%</dd></div>
            <div><dt class="small-caption text-muted">Tasks sequenced</dt><dd>${r.tasks}</dd></div>
            <div><dt class="small-caption text-muted">Domain shift</dt><dd>${r.shift}</dd></div>
            <div><dt class="small-caption text-muted">Per-task memory</dt><dd>${(r.memoryPerTask * 100).toFixed(2)}% of full</dd></div>
            <div><dt class="small-caption text-muted">Cumulative memory</dt><dd>${(r.cumulativeMemory * 100).toFixed(2)}% (isolated)</dd></div>
            <div><dt class="small-caption text-muted">Efficiency score</dt><dd>${r.efficiency.toFixed(2)}</dd></div>
          </dl>
        `;

        barsEl.innerHTML = `
          ${bar('Retention', r.retention, r.method.tone)}
          ${bar('Forgetting Risk', r.forgettingRisk, r.method.tone)}
          ${bar('Memory / Task', Math.min(1, r.memoryPerTask), r.method.tone)}
        `;

  explainEl.innerHTML = `<p>${r.method.explain}</p><p><strong>Interpretation:</strong> Retention declines faster with higher trainable %, greater domain shift, and more tasks. Efficiency rewards high retention per unit memory. Adjust sliders to observe the non-linear saturation.</p>`;

        // Insight heuristics
  let insight;
  if (r.forgettingRisk > 0.6) insight = '⚠ High forgetting risk — reduce trainable %, add rehearsal (replay) or add regularisation (EWC/L2).';
  else if (r.retention > 0.85 && r.efficiency > 8) insight = '✅ Strong retention & efficiency — configuration looks robust.';
  else if (r.efficiency < 2) insight = '🛠 Low efficiency — large update vs benefit; lower rank or selective layer targeting may help.';
  else insight = 'ℹ Balanced configuration — moderate retention with acceptable memory growth.';
        insightEl.textContent = insight;

        // MathJax refresh if needed
        setTimeout(() => { if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise(); }, 40);
      }

      [methodEl, tasksEl, shiftEl, trainableEl].forEach(el => el.addEventListener('input', render));
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question35Interactive = interactiveScript;
}
