// Question 42: How does Adaptive Softmax optimize LLMs?
// Created: August 12, 2025
// Focus: Explain hierarchical/adaptive softmax and simulate compute/param savings vs full softmax

const question = {
  title: "42. How does Adaptive Softmax optimize LLMs?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">⚡ Key Idea</h4>
        <p class="text-sm text-blue-800">Adaptive Softmax splits a large vocabulary into a <b>frequent head</b> and one or more <b>rare tails</b>. At training time, it computes the head for <i>all</i> tokens and only the <i>relevant tail</i> for the gold label. Rare tails use <b>reduced projection dimensions</b>, cutting multiply-adds and parameters while preserving accuracy on frequent words.</p>
        <div class="text-xs mt-2 text-blue-800">
          Compute model (batch size \\(B\\), hidden dim \\(d\\), head size \\(V_h\\), tails \\(i=1..C\\), tail dims \\(d_i=\\alpha_i d\\), tail sizes \\(V_i\\), batch fractions \\(p_i\\)):
          <div class="math-display mt-2">$$
          \\begin{align*}
          C_{\\text{full}} &\\propto B\\, d\\, V,\\\\
          C_{\\text{adaptive}} &\\propto B\\, d\\,(V_h + C) + B\\sum_i p_i\\, d_i\\, V_i.
          \\end{align*}
          $$</div>
        </div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 Full Softmax</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• Compute over <b>entire</b> vocabulary</li>
            <li>• Maximum accuracy, expensive</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Adaptive Softmax</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Head + small set of tails per example</li>
            <li>• Tail projections shrink: \\(d_i=\\alpha_i d\\)</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 When to use</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• Very large vocabularies (50k–1M)</li>
            <li>• Zipfian distributions (few frequent, many rare)</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Speeds up</b> training by avoiding full-vocab logits</li>
          <li>• <b>Reduces parameters</b> with low-dim tails</li>
          <li>• Keeps accuracy high for frequent words</li>
          <li>• Great for resource-limited or large-vocab settings</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Adaptive Softmax Simulator (compute + parameter savings)",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-fuchsia-50 to-rose-50 p-4 rounded-lg border border-fuchsia-200\">
          <div class=\"grid md:grid-cols-5 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\">Vocab size V</label>
              <select id=\"q42-vocab\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"50000\" selected>50k</option>
                <option value=\"100000\">100k</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Zipf exponent s</label>
              <input id=\"q42-zipf\" type=\"range\" min=\"1.00\" max=\"1.20\" step=\"0.01\" value=\"1.08\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q42-zipf-val\" class=\"font-mono\">1.08</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Cutoffs (head|tail1|tail2)</label>
              <select id=\"q42-cutoffs\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"5000,20000\">5k, 20k</option>
                <option value=\"10000,30000\" selected>10k, 30k</option>
                <option value=\"15000,50000\">15k, 50k</option>
                <option value=\"20000,60000\">20k, 60k</option>
              </select>
              <div class=\"text-[11px] text-gray-500 mt-1\">Example: 10k,30k → head=[1..10k], tail1=(10k..30k], tail2=(30k..V]</div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Tail dims (α₁, α₂)</label>
              <select id=\"q42-alphas\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"0.75,0.50\">α = (0.75, 0.50)</option>
                <option value=\"0.50,0.25\" selected>α = (0.50, 0.25)</option>
                <option value=\"0.50,0.125\">α = (0.50, 0.125)</option>
                <option value=\"0.35,0.15\">α = (0.35, 0.15)</option>
              </select>
              <div class=\"text-[11px] text-gray-500 mt-1\">α multiplies hidden dim d for tail projections</div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Hidden dim d</label>
              <select id=\"q42-dim\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"512\">512</option>
                <option value=\"768\">768</option>
                <option value=\"1024\" selected>1024</option>
                <option value=\"1536\">1536</option>
                <option value=\"2048\">2048</option>
              </select>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\"><b>Tip:</b> Use the presets to explore common bucketings and projection sizes. We assume <b>training compute</b>: head is computed for all examples; only the gold tail is computed. Distribution over head/tails follows a Zipf law.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧮 Results</h5>
            <div id=\"q42-results\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q42-metrics\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧱 Bucket Coverage</h5>
            <div id=\"q42-coverage\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
        </div>

        <div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-4\">
          <h5 class=\"font-semibold text-indigo-900 mb-1\">🔎 Explanation</h5>
          <div id=\"q42-explain\" class=\"text-xs text-indigo-800\"></div>
        </div>
      </div>
    `,
    script: () => {
      const vocabEl = document.getElementById('q42-vocab');
      const zipfEl = document.getElementById('q42-zipf');
      const zipfVal = document.getElementById('q42-zipf-val');
      const cutoffsEl = document.getElementById('q42-cutoffs');
      const alphasEl = document.getElementById('q42-alphas');
      const dimEl = document.getElementById('q42-dim');
      const resultsEl = document.getElementById('q42-results');
      const metricsEl = document.getElementById('q42-metrics');
      const coverageEl = document.getElementById('q42-coverage');
      const explainEl = document.getElementById('q42-explain');
      if (!vocabEl) return;

      const BASE_D = 1024; // reference hidden dimension

      function fmt(n){
        const abs = Math.abs(n);
        if (abs >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (abs >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (abs >= 1e3) return (n/1e3).toFixed(2)+'k';
        return n.toFixed(0);
      }

      function fmtSigned(n){
        const s = n >= 0 ? '+' : '';
        return s + fmt(n);
      }

      let prevD = null;

      function parseCutoffs(str, V){
        const parts = (str||'').split(',').map(s => s.trim()).filter(Boolean).map(x => x.toLowerCase().replace(/k$/,'000')).map(Number).filter(n=>Number.isFinite(n));
        let c1 = Math.max(1, Math.min(V-2, parts[0]||Math.round(V*0.2)));
        let c2 = Math.max(c1+1, Math.min(V-1, parts[1]||Math.round(V*0.6)));
        return [c1, c2];
      }

      function parseAlphas(str){
        const a = (str||'').split(',').map(s=>parseFloat(s.trim())).filter(x=>x>0 && x<=1);
        return [a[0]||0.5, a[1]||0.25];
      }

      function zipfMasses(V, s, c1, c2){
        // compute harmonic sum H_{V,s} and cumulative sums at c1, c2
        let H = 0, Hc1 = 0, Hc2 = 0;
        for (let r=1; r<=V; r++){
          const v = 1/Math.pow(r, s);
          H += v;
          if (r<=c1) Hc1 += v;
          if (r<=c2) Hc2 += v;
        }
        const pHead = Hc1 / H;
        const pTail1 = (Hc2 - Hc1) / H;
        const pTail2 = 1 - (Hc2 / H);
        return {pHead, pTail1, pTail2};
      }

      function bar(label, val, color){
        const pct = Math.max(0, Math.min(100, Math.round(val*100)));
        return `<div>
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${pct}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function ratioBar(label, ratio, color){
        const pct = Math.max(0, Math.min(100, Math.round(ratio*100)));
        return `<div>
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${(ratio*100).toFixed(0)}% (×${ratio.toFixed(2)})</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function render(){
        const V = parseInt(vocabEl.value, 10);
        const s = parseFloat(zipfEl.value);
        zipfVal.textContent = s.toFixed(2);
        const [c1, c2] = parseCutoffs(cutoffsEl.value, V);
        const [a1, a2] = parseAlphas(alphasEl.value);
        const d = Math.max(128, parseInt(dimEl.value,10)||1024);

        const head = c1; const tail1 = Math.max(0, c2 - c1); const tail2 = Math.max(0, V - c2);
        const C = (tail1>0?1:0) + (tail2>0?1:0);

        const {pHead, pTail1, pTail2} = zipfMasses(V, s, c1, c2);

        // Compute costs (relative units)
        const Cfull = d * V;
        const Cadapt = d * (head + C) + (pTail1 * (a1*d) * tail1) + (pTail2 * (a2*d) * tail2);
        const speedup = Cfull / Cadapt;

        // Parameters
        const Pfull = d * V;
        const Padapt = d * head + (a1*d) * tail1 + (a2*d) * tail2 + d * C; // + cluster tokens in head
        const paramSave = 1 - (Padapt / Pfull);

        // Coverage view
        coverageEl.innerHTML = [
          bar(`Head (1..${head}) mass`, pHead, 'indigo'),
          bar(`Tail1 (${head+1}..${c2}) mass`, pTail1, 'violet'),
          bar(`Tail2 (${c2+1}..${V}) mass`, pTail2, 'sky')
        ].join('');

        // Results
        resultsEl.innerHTML = `
          <div>Cutoffs → head=<b>${head}</b>, tail1=<b>${tail1}</b>, tail2=<b>${tail2}</b>, clusters=<b>${C}</b></div>
          <div>Tail dims → α₁=<span class=\"font-mono\">${a1}</span>, α₂=<span class=\"font-mono\">${a2}</span></div>
          <div>Hidden dim d=<span class=\"font-mono\">${d}</span>, V=<span class=\"font-mono\">${V.toLocaleString()}</span></div>
        `;

        // Metrics
        const relCompute = Math.min(1, Cadapt / Cfull);
        const relParams = Math.min(1, Padapt / Pfull);
        const baselineScale = d / BASE_D;

        const Cadapt0 = BASE_D * (head + C) + (pTail1 * (a1*BASE_D) * tail1) + (pTail2 * (a2*BASE_D) * tail2);
        const Padapt0 = BASE_D * head + (a1*BASE_D) * tail1 + (a2*BASE_D) * tail2 + BASE_D * C;

        metricsEl.innerHTML = `
          ${bar('Relative compute (adaptive vs full)', relCompute, 'emerald')}
          ${bar('Relative parameters (adaptive vs full)', relParams, 'orange')}
          <div class=\"mt-2\">${ratioBar('Adaptive compute vs baseline (d₀=1024)', Cadapt / Cadapt0, 'blue')}</div>
          <div>${ratioBar('Classifier params vs baseline (d₀=1024)', Padapt / Padapt0, 'teal')}</div>
          <div>Speed-up factor: <span class=\"font-mono\">${speedup.toFixed(2)}×</span></div>
          <div>Param savings: <span class=\"font-mono\">${(paramSave*100).toFixed(1)}%</span></div>
          <hr class=\"my-2\" />
          <div class=\"text-[11px] text-gray-600\">Tip: the two blue/teal bars show how <b>d</b> scales absolute compute and parameters vs baseline d₀.</div>
          <div class=\"mt-1\">Absolute compute per example (units): full=<span class=\"font-mono\">${fmt(Cfull)}</span>, adaptive≈<span class=\"font-mono\">${fmt(Cadapt)}</span></div>
          <div>Parameter counts (units): full=<span class=\"font-mono\">${fmt(Pfull)}</span>, adaptive≈<span class=\"font-mono\">${fmt(Padapt)}</span></div>
          <div class=\"mt-2\"><b>Hidden dim impact</b>: baseline d₀=<span class=\"font-mono\">${BASE_D}</span> → scale ≈ <span class=\"font-mono\">×${baselineScale.toFixed(2)}</span></div>
          ${prevD !== null && prevD !== d ? `<div class=\"text-[11px] text-gray-700\">Change since last selection (Δd=${d - prevD}): Δcompute≈<span class=\"font-mono\">${fmtSigned((d - prevD) * (head + C + pTail1 * (a1) * tail1 + pTail2 * (a2) * tail2))}</span>, Δparams≈<span class=\"font-mono\">${fmtSigned((d - prevD) * (head + C + a1 * tail1 + a2 * tail2))}</span></div>` : ''}
        `;

        // Explanation
        explainEl.innerHTML = `Adaptive Softmax reduces cost by computing the <b>head</b> for all examples and only the <b>selected tail</b> for rare targets. With Zipfian data (s=${s.toFixed(2)}), most mass sits in the head; rare clusters use smaller projections (α), cutting both compute and parameters.`;

  if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);

  prevD = d;
      }

      [vocabEl, zipfEl, cutoffsEl, alphasEl, dimEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    }
  }
};

// Export pattern
if (typeof module !== 'undefined') { module.exports = question; }
