// Question 35: How does PEFT mitigate catastrophic forgetting?
// Created: August 11, 2025
// Educational Focus: Catastrophic forgetting dynamics & how Parameter-Efficient Fine-Tuning (PEFT) methods preserve pretrained knowledge.

const question = {
  title: "35. How does PEFT mitigate catastrophic forgetting?",
  answer: `<div class="space-y-4">
    <!-- Recommended Reading (Cross-links) -->
    <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
      <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-15">Question 15: What is catastrophic forgetting?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-16">Question 16: What is transfer learning in LLMs?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-24">Question 24: What is parameter-efficient fine-tuning?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-31">Question 31: How does RLHF shape model behavior?</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-34">Question 34: What types of foundation models exist?</a></li>
      </ul>
  <p class="text-xs text-indigo-700 mt-2">These provide grounding for continual learning pressure, transfer dynamics, and alignment signals relevant to PEFT.</p>
    </div>
    <!-- Definition / Core Concept -->
  <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
      <h4 class="font-semibold text-blue-900 mb-2">🧠 Core Idea</h4>
      <p class="text-sm text-blue-800 leading-relaxed"><strong>Parameter‑Efficient Fine‑Tuning (PEFT)</strong> reduces <em>catastrophic forgetting</em> by freezing most pretrained weights \(\theta_{\text{base}}\) and introducing a small, trainable subset \(\Delta\theta\) (adapters, low‑rank matrices, prefixes, bias terms). Because the original representation space is largely preserved, gradients from new tasks cannot overwrite previously learned generalizations.</p>
      <div class="mt-3 grid md:grid-cols-4 gap-3 text-xs">
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Freeze Majority</span><br>Protects core semantics</div>
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Small Delta</span><br>Few params adapt fast</div>
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Composable</span><br>Task adapters stack</div>
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Memory Efficient</span><br>Multiple tasks, one base</div>
      </div>
    </div>

    <!-- Mechanism & Math -->
  <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h4 class="font-semibold text-gray-900 mb-3">🧩 Mechanism</h4>
  <p class="text-sm text-gray-700">Instead of updating inline parameters, we add a <em>structured delta</em> to a frozen base (additive decomposition):</p>
  <div class="math-display">$$ f(x; \theta_{\\text{base}}, \\Delta\\theta) = f\\big(x; \theta_{\\text{base}} + P(\\Delta\\theta)\\big) $$</div>
  <p class="text-sm text-gray-700 mt-3">Where <code>P(\cdot)</code> injects / projects the small trainable structure (adapters, low‑rank matrices, prefixes). We model forgetting with a <em>qualitative</em> saturating hazard (illustrative only):</p>
  <div class="math-display">$$\\begin{aligned}
    \\text{ForgettingRisk} &= 1 - e^{-\\alpha s d t},\\\\
    \\text{Retention}      &= e^{-\\alpha s d t}.

  \\end{aligned}$$</div>
  <p class="text-xs text-gray-600">Symbols: \(s\)=trainable fraction; \(d\)=domain shift factor; \(t\)=sequential task count; \(\alpha\)=method sensitivity (smaller ⇒ more robust). Pedagogical curve—use empirical continual learning benchmarks for measurement.</p>
      <p class="text-sm text-gray-700 mb-2">LoRA applies a low‑rank update to each targeted weight matrix:</p>
  <div class="math-display">$$ W' = W + B A,\; W\\in\\mathbb{R}^{d_{out}\\times d_{in}},\; A\\in\\mathbb{R}^{r\\times d_{in}},\; B\\in\\mathbb{R}^{d_{out}\\times r},\; r \\ll d_{out},d_{in} $$</div>
      <p class="text-xs text-gray-600">Original \(W\) is preserved (frozen); only \(A,B\) train → prior capabilities remain accessible.</p>
    </div>

    <!-- Comparison Cards -->
    <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-4 text-sm">
      <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
        <h5 class="font-semibold text-green-800 mb-1">LoRA / QLoRA</h5>
        <ul class="list-disc ml-4 text-xs text-green-700 space-y-1">
          <li>Low‑rank residual update</li>
          <li>Quantize base (QLoRA) to cut memory</li>
          <li>Mergeable at inference</li>
        </ul>
      </div>
      <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
        <h5 class="font-semibold text-purple-800 mb-1">Adapters</h5>
        <ul class="list-disc ml-4 text-xs text-purple-700 space-y-1">
          <li>Bottleneck MLP blocks</li>
          <li>Composable per task</li>
          <li>Stable gradients</li>
        </ul>
      </div>
      <div class="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
        <h5 class="font-semibold text-amber-800 mb-1">Prefix / P‑Tuning</h5>
        <ul class="list-disc ml-4 text-xs text-amber-700 space-y-1">
          <li>Train virtual tokens</li>
          <li>No weight merge needed</li>
          <li>Fast adaptation</li>
        </ul>
      </div>
      <div class="bg-rose-50 p-3 rounded border-l-4 border-rose-400">
        <h5 class="font-semibold text-rose-800 mb-1">BitFit / Bias‑Only</h5>
        <ul class="list-disc ml-4 text-xs text-rose-700 space-y-1">
          <li>Update only biases</li>
          <li>Tiny footprint</li>
          <li>Lower capacity</li>
        </ul>
      </div>
    </div>

    <!-- Why It Matters -->
  <div class="bg-yellow-50 p-4 rounded-lg">
      <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>• <strong>Preserves generalization:</strong> Frozen base prevents destructive drift.</li>
        <li>• <strong>Operational efficiency:</strong> Store many tasks as small deltas.</li>
        <li>• <strong>Rapid iteration:</strong> Faster fine‑tunes & lower GPU memory.</li>
        <li>• <strong>Composable specialization:</strong> Swap/stack adapters per domain.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
    title: "🧪 PEFT Forgetting Mitigation Simulator",
    html: `<div class=\"space-y-6\">
      <div class=\"bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200\">
        <div class=\"grid md:grid-cols-4 gap-4 text-xs\">
          <div>
            <label class=\"font-semibold text-gray-700\">Method</label>
            <select id=\"q35-method\" class=\"mt-1 w-full border-gray-300 rounded p-1 text-xs\">
              <option value=\"lora\">LoRA / QLoRA</option>
              <option value=\"adapters\">Adapters</option>
              <option value=\"prefix\">Prefix / P‑Tuning</option>
              <option value=\"bitfit\">BitFit</option>
              <option value=\"full\">Full Fine‑Tune (baseline)</option>
            </select>
          </div>
          <div>
            <label class=\"font-semibold text-gray-700\"># Sequential Tasks</label>
            <input id=\"q35-tasks\" type=\"range\" min=\"1\" max=\"10\" value=\"3\" class=\"w-full\" />
            <div class=\"text-center mt-1\"><span id=\"q35-tasks-val\" class=\"font-mono\">3</span></div>
          </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Domain Shift</label>
              <select id=\"q35-shift\" class=\"mt-1 w-full border-gray-300 rounded p-1 text-xs\">
                <option value=\"low\">Low</option>
                <option value=\"med\" selected>Medium</option>
                <option value=\"high\">High</option>
              </select>
            </div>
          <div>
            <label class=\"font-semibold text-gray-700\">Trainable %</label>
            <input id=\"q35-trainable\" type=\"range\" min=\"0.1\" max=\"100\" step=\"0.1\" value=\"1.0\" class=\"w-full\" />
            <div class=\"text-center mt-1\"><span id=\"q35-trainable-val\" class=\"font-mono\">1.0%</span></div>
          </div>
        </div>
  <p class=\"text-[11px] text-gray-600 mt-2\">Simulator estimates <strong>Retention</strong> & <strong>Forgetting Risk</strong> via a heuristic hazard; not calibrated to real benchmarks.</p>
      </div>

      <div class=\"grid md:grid-cols-3 gap-4\">
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">📌 Metrics</h5>
          <div id=\"q35-metrics\" class=\"text-xs space-y-3\"></div>
        </div>
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">📈 Bars</h5>
          <div id=\"q35-bars\" class=\"space-y-2 text-xs\"></div>
        </div>
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Explanation</h5>
          <div id=\"q35-explain\" class=\"text-xs text-gray-700 space-y-2\"></div>
        </div>
      </div>

      <div class=\"bg-green-50 border border-green-200 rounded-lg p-4\">
        <h5 class=\"font-semibold text-green-900 mb-1\">💡 Insight</h5>
        <div id=\"q35-insight\" class=\"text-sm text-green-800\"></div>
      </div>
    </div>` ,
    script: () => {
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
        lora: { baseTrainable: 0.8, alpha: 0.35, label: 'LoRA / QLoRA', color: 'indigo', explain: 'Low‑rank residual matrices focus adaptation capacity while freezing full weight tensors. QLoRA quantizes the base to 4-bit, further reducing memory while preserving signal through low‑rank updates.' },
        adapters: { baseTrainable: 1.5, alpha: 0.4, label: 'Adapters', color: 'purple', explain: 'Inserted bottleneck modules learn task deltas. Base weights are untouched, enabling modular stacking and quick task switching.' },
        prefix: { baseTrainable: 0.3, alpha: 0.45, label: 'Prefix / P‑Tuning', color: 'amber', explain: 'Virtual tokens steer attention distributions without modifying internal projection weights—extremely lightweight but can saturate for deep shifts.' },
        bitfit: { baseTrainable: 0.1, alpha: 0.55, label: 'BitFit (Bias‑Only)', color: 'rose', explain: 'Updates only bias vectors—very small footprint; retains knowledge well but limited expressivity for large domain shifts.' },
        full: { baseTrainable: 100, alpha: 1.0, label: 'Full Fine‑Tune', color: 'gray', explain: 'All weights updated—max capacity but high interference & risk of catastrophic forgetting without rehearsal or regularization.' }
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

      function bar(label, value, color, invert=false) {
        const pct = Math.min(100, value * 100);
        const display = (value*100).toFixed(1) + '%';
        const bg = invert ? 'bg-' + color + '-200' : 'bg-' + color + '-600';
        const fill = invert ? 'bg-' + color + '-600' : 'bg-' + color + '-300';
        return `<div role=\"group\" aria-label=\"${label} ${display}\">\n          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${display}</span></div>\n          <div class=\"w-full h-3 ${bg} rounded relative overflow-hidden\">\n            <div class=\"h-3 ${fill}\" style=\"width:${pct}%\" aria-hidden=\"true\"></div>\n          </div>\n        </div>`;
      }

      function render() {
        tasksVal.textContent = tasksEl.value;
        trainableVal.textContent = parseFloat(trainableEl.value).toFixed(1) + '%';
        const r = compute();

        const deviationNote = r.deviation > 4 ? '<span class="text-red-600">(very high)</span>' : r.deviation > 2 ? '<span class="text-amber-600">(high)</span>' : r.deviation < 0.5 ? '<span class="text-amber-600">(low)</span>' : '<span class="text-green-600">(typical-ish)</span>';
        metricsEl.innerHTML = `
          <div><strong>Method:</strong> ${r.method.label}</div>
          <div><strong>Trainable % Chosen:</strong> ${r.chosenPct.toFixed(2)}% ${deviationNote}</div>
          <div><strong>Recommended ~</strong> ${r.recommended.toFixed(2)}%</div>
          <div><strong>Tasks Sequenced:</strong> ${r.tasks}</div>
          <div><strong>Domain Shift:</strong> ${r.shift}</div>
          <div><strong>Per-Task Memory:</strong> ${(r.memoryPerTask*100).toFixed(2)}% of full</div>
          <div><strong>Cumulative Memory:</strong> ${(r.cumulativeMemory*100).toFixed(2)}% (if isolated)</div>
          <div><strong>Efficiency Score:</strong> ${r.efficiency.toFixed(2)}</div>
        `;

        barsEl.innerHTML = `
          ${bar('Retention', r.retention, r.method.color)}
          ${bar('Forgetting Risk', r.forgettingRisk, r.method.color, true)}
          ${bar('Memory/Task', Math.min(1, r.memoryPerTask), r.method.color)}
        `;

  explainEl.innerHTML = `<p>${r.method.explain}</p><p><strong>Interpretation:</strong> Retention declines faster with higher trainable %, greater domain shift and more tasks. Efficiency rewards high retention per unit memory. Adjust sliders to observe non‑linear saturation.</p>`;

        // Insight heuristics
  let insight;
  if (r.forgettingRisk > 0.6) insight = '⚠ High forgetting risk — reduce trainable %, add rehearsal (replay) or add regularization (EWC/L2).';
  else if (r.retention > 0.85 && r.efficiency > 8) insight = '✅ Strong retention & efficiency — configuration robust.';
  else if (r.efficiency < 2) insight = '🛠 Low efficiency — large update vs benefit; lower rank or selective layer targeting may help.';
  else insight = 'ℹ Balanced configuration — moderate retention with acceptable memory growth.';
        insightEl.textContent = insight;

        // MathJax refresh if needed
        setTimeout(() => { if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise(); }, 40);
      }

      [methodEl, tasksEl, shiftEl, trainableEl].forEach(el => el.addEventListener('input', render));
      render();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
