// Question 37: How does Mixture of Experts (MoE) enhance LLM scalability?
// Created: August 12, 2025
// Educational Focus: Sparse activation via expert routing (Top‑k), balancing compute vs. capacity.

const question = {
  title: "37. How does Mixture of Experts (MoE) enhance LLM scalability?",
  answer: `<div class=\"space-y-6\">
    <!-- Recommended Reading -->
    <div class=\"bg-indigo-50 p-4 rounded-lg border border-indigo-200\">
      <h4 class=\"font-semibold text-indigo-900 mb-2\">📚 Recommended reading</h4>
      <ul class=\"list-disc ml-5 text-xs text-indigo-800 space-y-1\">
        <li><a class=\"underline hover:text-indigo-900\" href=\"#question-12\">12. How do LLMs scale with parameters?</a></li>
        <li><a class=\"underline hover:text-indigo-900\" href=\"#question-24\">24. What is parameter-efficient fine-tuning?</a></li>
        <li><a class=\"underline hover:text-indigo-900\" href=\"#question-32\">32. How are attention scores computed?</a></li>
        <li><a class=\"underline hover:text-indigo-900\" href=\"#question-35\">35. What is PEFT simulation?</a></li>
        <li><a class=\"underline hover:text-indigo-900\" href=\"#question-46\">46. Encoders vs decoders</a></li>
      </ul>
      <p class=\"text-[11px] text-indigo-700 mt-2\">Context: scaling laws, efficient adaptation, routing math, sparse activation, architecture roles.</p>
    </div>

    <!-- Core Concept -->
    <div class=\"bg-blue-50 p-5 rounded-xl border border-blue-200\">
      <h4 class=\"font-semibold text-blue-900 mb-2\">🧩 Key Idea</h4>
      <p class=\"text-sm text-blue-800\">Mixture of Experts (MoE) inflates <em>capacity</em> (parameters) while largely preserving <em>per‑token compute</em>: a small gating module chooses the top‑<span class=\"font-mono\">k</span> experts out of <span class=\"font-mono\">E</span> for each token and linearly combines their outputs.</p>
      <div class=\"text-xs bg-white border border-blue-100 p-3 rounded font-mono text-center mt-3 overflow-x-auto whitespace-nowrap\">
    $$\\begin{aligned}
    S(x) &= \\text{TopK}(\\text{softmax}(W_g x)) \\\\
    y &= \\sum_{i \\in S(x)} p_i(x) f_i(x)
    \\end{aligned}$$
      </div>
      <p class=\"text-xs text-blue-800 mt-2\"><b>Sparsity ratio:</b> only <span class=\"font-mono\">k/E</span> experts active → compute ∝ k, parameters ∝ E. With E≫k (e.g. 64 experts, top‑2) billions of weights sit behind a light gating decision.</p>
    </div>

    <!-- Approaches / Trade-offs -->
    <div class=\"grid md:grid-cols-3 gap-4 text-sm\">
      <div class=\"bg-green-50 border border-green-200 rounded-lg p-4\">
        <h5 class=\"font-semibold text-green-800 mb-1\">Dense (Baseline)</h5>
        <ul class=\"list-disc ml-4 text-xs text-green-700 space-y-1\">
          <li>All weights active</li>
          <li>Stable & simple</li>
          <li>Compute grows with params</li>
        </ul>
      </div>
      <div class=\"bg-purple-50 border border-purple-200 rounded-lg p-4\">
        <h5 class=\"font-semibold text-purple-800 mb-1\">Sparse MoE</h5>
        <ul class=\"list-disc ml-4 text-xs text-purple-700 space-y-1\">
          <li>Top‑k routing</li>
          <li>Capacity > compute</li>
          <li>Needs balancing loss</li>
        </ul>
      </div>
      <div class=\"bg-amber-50 border border-amber-200 rounded-lg p-4\">
        <h5 class=\"font-semibold text-amber-800 mb-1\">Advanced / Hybrid</h5>
        <ul class=\"list-disc ml-4 text-xs text-amber-700 space-y-1\">
          <li>Routing tricks (Switch, Hash)</li>
          <li>Expert parallel + sharding</li>
          <li>Memory & comms overhead</li>
        </ul>
      </div>
    </div>

    <!-- Why it matters -->
    <div class=\"bg-yellow-50 p-5 rounded-xl border border-yellow-200\">
      <h4 class=\"font-semibold text-yellow-900 mb-2\">🎯 Why This Matters</h4>
      <ul class=\"text-sm text-yellow-800 space-y-1\">
        <li>• <b>Sparse activation</b> keeps per‑token FLOPs ~ proportional to <span class=\"font-mono\">k</span>, not total parameters.</li>
        <li>• <b>Specialization</b> lets experts focus on sub‑domains (code, math, dialogue).</li>
        <li>• <b>Scaling headroom</b> adds experts instead of deeper/wider dense layers.</li>
        <li>• <b>Balancing strategies</b> (entropy / load losses / capacity limits) avoid collapse.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
    title: "🧪 MoE Routing Simulator (Experts, Top‑k, Balance)",
  html: `<div class=\"space-y-6\">
      <div class=\"bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200\">
        <div class=\"grid md:grid-cols-5 gap-4 text-xs\">
          <div>
      <label for=\"q37-E\" class=\"font-semibold text-gray-700\">Experts (E)</label>
      <input id=\"q37-E\" type=\"range\" min=\"4\" max=\"64\" step=\"1\" value=\"16\" class=\"w-full\" aria-label=\"Number of experts slider\" />
            <div class=\"text-center mt-1\"><span id=\"q37-E-val\" class=\"font-mono\">16</span></div>
          </div>
          <div>
      <label for=\"q37-k\" class=\"font-semibold text-gray-700\">Top‑k</label>
      <input id=\"q37-k\" type=\"range\" min=\"1\" max=\"8\" step=\"1\" value=\"2\" class=\"w-full\" aria-label=\"Top k experts slider\" />
            <div class=\"text-center mt-1\"><span id=\"q37-k-val\" class=\"font-mono\">2</span></div>
          </div>
          <div>
      <label for=\"q37-T\" class=\"font-semibold text-gray-700\">Batch tokens (T)</label>
      <input id=\"q37-T\" type=\"range\" min=\"32\" max=\"2048\" step=\"32\" value=\"256\" class=\"w-full\" aria-label=\"Batch tokens slider\" />
            <div class=\"text-center mt-1\"><span id=\"q37-T-val\" class=\"font-mono\">256</span></div>
          </div>
          <div>
      <label for=\"q37-entropy\" class=\"font-semibold text-gray-700\">Routing entropy</label>
      <input id=\"q37-entropy\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.4\" class=\"w-full\" aria-label=\"Routing entropy slider\" />
            <div class=\"text-center mt-1\"><span id=\"q37-entropy-val\" class=\"font-mono\">0.40</span></div>
          </div>
          <div>
      <label for=\"q37-P\" class=\"font-semibold text-gray-700\">Model params (B)</label>
      <input id=\"q37-P\" type=\"range\" min=\"5\" max=\"200\" step=\"5\" value=\"70\" class=\"w-full\" aria-label=\"Total model parameters in billions slider\" />
            <div class=\"text-center mt-1\"><span id=\"q37-P-val\" class=\"font-mono\">70</span></div>
          </div>
        </div>
    <p class=\"text-[11px] text-gray-600 mt-2\">Higher routing entropy ≈ more uniform assignments; low entropy ≈ peaky gate → imbalance risk. Active parameter fraction \(k/E\).</p>
      </div>

      <div class=\"grid md:grid-cols-3 gap-4\">
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">📌 Metrics</h5>
          <div id=\"q37-metrics\" class=\"text-xs space-y-2\" role=\"list\" aria-label=\"MoE derived metrics\"></div>
        </div>
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">📈 Bars</h5>
          <div id=\"q37-bars\" class=\"text-xs space-y-2\" role=\"list\" aria-label=\"Visualization bars for MoE metrics\"></div>
        </div>
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Explanation</h5>
          <div id=\"q37-explain\" class=\"text-xs text-gray-700 space-y-2\" aria-live=\"polite\"></div>
        </div>
      </div>

      <div class=\"bg-green-50 border border-green-200 rounded-lg p-4\">
        <h5 class=\"font-semibold text-green-900 mb-1\">💡 Insight</h5>
        <div id=\"q37-insight\" class=\"text-sm text-green-800\" aria-live=\"polite\"></div>
      </div>
    </div>`,
    script: () => {
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
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${text}</span></div>
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
          <div class="text-center bg-white border p-2 rounded font-mono text-[12px] mt-1 overflow-x-auto">
            \\[ \\text{active fraction} = \\frac{k}{E} \\]
            \\[ \\text{speedup} \\propto \\frac{1}{\\text{active fraction}} \\]
          </div>
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
    }
  }
};

// CommonJS export for tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
