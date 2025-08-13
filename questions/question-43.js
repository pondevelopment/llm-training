// Question 43: How do transformers address the vanishing gradient problem?
// Created: August 13, 2025
// Focus: Residual connections, LayerNorm (pre-norm), and parallel attention paths

const question = {
  title: "43. How do transformers address the vanishing gradient problem?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Core idea</h4>
        <p class="text-sm text-blue-800">Transformers keep gradients healthy with <b>residual connections</b>, <b>LayerNorm</b> (typically <i>pre-norm</i>), and <b>parallel attention paths</b> that shorten effective depth.</p>
        <div class="text-xs mt-3 text-blue-800">
          Gradient through a residual block with pre-norm (input \\(\\mathbf{x}_\\ell\\)):
          <div class="math-display mt-1">$$
          \\begin{align*}
          \\mathbf{y}_\\ell &= \\mathbf{x}_\\ell + F(\\mathrm{LN}(\\mathbf{x}_\\ell)), \\\\
          \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_\\ell} &\\approx \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{y}_\\ell} \\big( \\mathbf{I} + \\mathbf{J}_\\ell \\big), \\quad \\mathbf{J}_\\ell = \\frac{\\partial F}{\\partial \\mathrm{LN}(\\mathbf{x}_\\ell)} \\cdot \\frac{\\partial \\mathrm{LN}}{\\partial \\mathbf{x}_\\ell}
          \\end{align*}
          $$</div>
          The identity path \\(\\mathbf{I}\\) <i>guarantees</i> a direct gradient route; LayerNorm keeps scales near 1.
        </div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 RNN/Deep chain (reference)</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• Sequential dependence → long gradient paths</li>
            <li>• Per-layer gain \\(g < 1\\) ⇒ decay \\(g^L\\)</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Residual + Pre-LN</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Always includes identity gradient \\(\\mathbf{I}\\)</li>
            <li>• LN centers/scales → stable Jacobians</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 Multi-head Attention</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• Parallel, short-range paths</li>
            <li>• Less depth per dependency</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• Enables <b>deep stacks</b> to train efficiently</li>
          <li>• Stabilizes gradients for <b>long contexts</b></li>
          <li>• Improves convergence and <b>reduces exploding/vanishing</b></li>
        </ul>
      </div>

      <!-- Deep dive -->
      <div class="bg-white p-5 rounded-xl border">
        <h4 class="font-semibold text-gray-900 mb-2">🔎 Deep dive: why gradients don’t vanish</h4>
        <div class="text-sm text-gray-800 space-y-3">
          <div>
            <b>1) Residuals add an identity Jacobian.</b>
            Without residuals, gradients multiply per-layer gains and decay like \\(g^L\\) when \\(g<1\\). With residuals, each layer contributes \\((\\mathbf{I}+\\alpha\,\\mathbf{J}_\\ell)\\):
            <div class="math-display">$$
            \\
            \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_0} \\;\\approx\\; \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{y}_L}\\; \\prod_{\\ell=1}^{L} \\big( \\mathbf{I} + \\alpha\,\\mathbf{J}_\\ell \\big)
            \\
            $$</div>
            If \\(\\|\\mathbf{J}_\\ell\\|\\) is modest, the product stays close to identity, preserving end→start signal.
          </div>
          <div>
            <b>2) Pre-LN vs Post-LN.</b>
            In <i>post-norm</i> (older variants), \\( \\mathbf{y}_\\ell = \\mathrm{LN}(\\mathbf{x}_\\ell + F(\\mathbf{x}_\\ell)) \\), so gradients pick up an extra \\(\\mathrm{LN}'\\) factor after the sum:
            <div class="math-display">$$
            \\
            \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}_\\ell} \\;\\approx\\; \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{y}_\\ell}\\; \\mathrm{LN}'\\, (\\mathbf{I}+\\mathbf{J}_\\ell)
            \\
            $$</div>
            In <i>pre-norm</i> (modern default), LN is applied before \\(F\\). The identity path is unscaled, pulling effective gains toward 1 and making very deep stacks trainable.
          </div>
          <div>
            <b>3) Attention provides short, parallel paths.</b>
            Multi-head attention can connect distant tokens in few “effective hops”. A fraction of gradient avoids traversing all \\(L\\) blocks, substantially raising the end→start magnitude.
          </div>
          <div>
            <b>4) Practical knobs.</b>
            Keep residual scale \\((\\alpha)\\) moderate (fixed or learned), use Pre-LN/RMSNorm to stabilize \\(\\|\\mathbf{J}_\\ell\\|\\), and combine with AdamW, warmup, and optional gradient clipping to control explosions when \\(g>1\\).
          </div>
        </div>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Gradient Flow Explorer (vanishing vs residual + LayerNorm)",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-sky-50 to-indigo-50 p-4 rounded-lg border border-sky-200\">
          <div class=\"grid md:grid-cols-5 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\">Depth L</label>
              <input id=\"q43-depth\" type=\"range\" min=\"4\" max=\"48\" step=\"1\" value=\"12\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q43-depth-val\" class=\"font-mono\">12</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Base gain g</label>
              <input id=\"q43-gain\" type=\"range\" min=\"0.70\" max=\"1.20\" step=\"0.01\" value=\"0.92\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q43-gain-val\" class=\"font-mono\">0.92</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Residual weight α</label>
              <input id=\"q43-res\" type=\"range\" min=\"0.00\" max=\"1.00\" step=\"0.05\" value=\"0.5\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q43-res-val\" class=\"font-mono\">0.50</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Normalization</label>
              <select id=\"q43-norm\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"none\">None</option>
                <option value=\"post\">Post-LN</option>
                <option value=\"pre\" selected>Pre-LN</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Attention shortcut</label>
              <select id=\"q43-shortcut\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"0\" selected>Off</option>
                <option value=\"4\">On (effective hop = 4)</option>
                <option value=\"2\">On (effective hop = 2)</option>
              </select>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\">We simulate gradient magnitude from top (layer L) to bottom (layer 1). Residual adds an identity path; Pre-LN pulls gains toward 1. Attention shortcut reduces effective hops for part of the gradient.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📈 Gradient per layer</h5>
              <div id="q43-bars" class="text-xs text-gray-700 space-y-1"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q43-metrics\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Explanation</h5>
            <div id=\"q43-explain\" class=\"text-xs text-gray-700\"></div>
          </div>
        </div>
      </div>
    `,
    script: () => {
      const LEl = document.getElementById('q43-depth');
      const GEl = document.getElementById('q43-gain');
      const AEl = document.getElementById('q43-res');
      const NEl = document.getElementById('q43-norm');
      const SEl = document.getElementById('q43-shortcut');
      const LVal = document.getElementById('q43-depth-val');
      const GVal = document.getElementById('q43-gain-val');
      const AVal = document.getElementById('q43-res-val');
      const barsEl = document.getElementById('q43-bars');
      const metricsEl = document.getElementById('q43-metrics');
      const explainEl = document.getElementById('q43-explain');
      if (!LEl) return;

      function effGain(g, norm){
        // Pull gains toward 1 depending on norm placement
        if (norm === 'pre') return 0.6*g + 0.4*1.0; // stronger stabilization
        if (norm === 'post') return 0.8*g + 0.2*1.0;
        return g;
      }

      function simulate(L, g, alpha, norm, hop){
        const gEff = effGain(g, norm);
        const grads = new Array(L).fill(0);
        let G = 1.0; // start from top
        for (let l = L-1; l >= 0; l--) {
          // Residual effect: identity + alpha * gEff
          const J = 1.0 + alpha * gEff;
          // Attention shortcut: a fraction of gradient skips ahead shorter path
          const shortcutFrac = hop > 0 ? 0.3 : 0.0; // 30% goes via shorter path
          const longFrac = 1 - shortcutFrac;
          const step = longFrac * J + shortcutFrac * Math.pow(J, Math.max(1, Math.floor(hop)));
          G = G * step;
          grads[l] = Math.abs(G);
        }
        return grads;
      }

      function fmtShort(n){
        const a = Math.abs(n);
        if (a >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (a >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (a >= 1e3) return (n/1e3).toFixed(2)+'k';
        if (a < 1e-3 && a > 0) return n.toExponential(1);
        return n.toFixed(3);
      }

      function layerRow(idx, baseVal, impVal, maxVal){
        const basePct = Math.max(2, Math.round((baseVal/maxVal)*100));
        const impPct  = Math.max(2, Math.round((impVal /maxVal)*100));
        return `<div class=\"flex items-center gap-2\">
          <span class=\"w-10 text-right font-mono\">${idx}</span>
          <div class=\"flex-1\">
            <div class=\"h-2 bg-rose-200 rounded\"><div class=\"h-2 bg-rose-600 rounded\" style=\"width:${basePct}%\"></div></div>
            <div class=\"h-2 bg-emerald-200 rounded mt-0.5\"><div class=\"h-2 bg-emerald-600 rounded\" style=\"width:${impPct}%\"></div></div>
          </div>
          <div class=\"w-28 text-right text-[11px] text-gray-600\"><span class=\"text-rose-700 font-mono\">${fmtShort(baseVal)}</span> <span class=\"mx-1\">→</span> <span class=\"text-emerald-700 font-mono\">${fmtShort(impVal)}</span></div>
        </div>`;
      }

      function ratioBar(label, ratio, color){
        const cap = 10; // visualize up to 10x
        const r = Math.max(0, Math.min(cap, ratio));
        const pct = Math.round((r/cap)*100);
        return `<div>
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>×${ratio.toFixed(2)}</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      // Assess gradient health and provide a clear good/bad status
      function assessHealth(L, g, a, norm, hop, endToStart){
        const gEff = effGain(g, norm);
        const Jstep = 1 + a * gEff;
        let status = 'healthy';
  const reasons = [];
        if (endToStart < 1e-6) { status = 'vanishing'; reasons.push('End→start factor is extremely small.'); }
        if (endToStart > 1e6) { status = 'exploding'; reasons.push('End→start factor is extremely large.'); }
        if (Jstep < 0.95) { if (status==='healthy') status = 'caution'; reasons.push('Per-layer step < 0.95 (decay risk).'); }
        if (Jstep > 1.05) { if (status==='healthy') status = 'caution'; reasons.push('Per-layer step > 1.05 (explosion risk).'); }
        if (hop === 0) { reasons.push('No attention shortcut (all dependencies traverse full depth).'); }
  // Configuration warnings
  if (a <= 0.05) { if (status==='healthy') status = 'caution'; reasons.push('Residual weight α≈0 disables the residual branch (block ≈ identity).'); }
  if (a >= 0.95) { if (status==='healthy') status = 'caution'; reasons.push('Residual weight α≈1 may drown out the learned transform.'); }
  if (norm === 'none') { if (status==='healthy') status = 'caution'; reasons.push('No normalization: Jacobians may drift; prefer Pre-LN/RMSNorm.'); }
  if (norm === 'post' && L >= 24) { if (status==='healthy') status = 'caution'; reasons.push('Deep stack with Post-LN can be unstable; Pre-LN is common.'); }
  if (g < 0.85) { reasons.push('Base gain g is quite low (<0.85): without residuals, gradients would vanish quickly.'); }
  if (g > 1.10) { if (status==='healthy') status = 'caution'; reasons.push('Base gain g is high (>1.10): explosion risk without normalization.'); }
        const color = status==='healthy' ? 'emerald' : (status==='caution' ? 'amber' : 'rose');
        return { status, reasons, color, Jstep, gEff };
      }

      function statusBadge(status){
        const map = {
          healthy: 'bg-emerald-100 text-emerald-800',
          caution: 'bg-amber-100 text-amber-800',
          vanishing: 'bg-rose-100 text-rose-800',
          exploding: 'bg-rose-100 text-rose-800',
        };
        const label = status.charAt(0).toUpperCase() + status.slice(1);
        return `<span class=\"text-[11px] px-2 py-0.5 rounded-full border ${map[status]}\">${label}</span>`;
      }

      function render(){
        const L = parseInt(LEl.value,10);
        const g = parseFloat(GEl.value);
        const a = parseFloat(AEl.value);
        const norm = NEl.value;
        const hop = parseInt(SEl.value,10);
        LVal.textContent = L;
        GVal.textContent = g.toFixed(2);
        AVal.textContent = a.toFixed(2);

  const baseline = simulate(L, g, 0.0, 'none', 0);
  const improved = simulate(L, g, a, norm, hop);
  const endToStart = improved[0] || 0;
  const assess = assessHealth(L, g, a, norm, hop, endToStart);

        // Bars (layer 1 at bottom)
        const maxVal = Math.max(...baseline, ...improved, 1e-9);
        const rows = [];
        for (let i=0;i<L;i++){
          const l = (i+1).toString().padStart(2,'0');
          rows.push(layerRow(l, baseline[i], improved[i], maxVal));
        }
        const alert = (assess.status === 'healthy')
          ? ''
          : `<div class=\"text-[11px] mb-1 text-${assess.color}-700\">⚠ ${assess.status==='vanishing' ? 'Vanishing gradient detected' : (assess.status==='exploding' ? 'Exploding gradient risk' : 'Caution: unstable steps')}</div>`;
        barsEl.innerHTML = alert + `<div class=\"text-[11px] text-gray-500 mb-1\"><span class=\"text-rose-600\">Rose</span> = baseline (no residual/LN/shortcut). <span class=\"text-emerald-600\">Emerald</span> = transformer-style.</div>` + rows.join('');

        // Metrics
        function stats(arr){
          const min = Math.min(...arr); const max = Math.max(...arr); const last = arr[0];
          return {min, max, last};
        }
        const sb = stats(baseline), si = stats(improved);
        const vanishB = Math.pow(g, L);
        const improvement = (si.last)/(vanishB || 1e-12);
        const ratioColor = improvement > 1.5 ? 'emerald' : (improvement < 0.75 ? 'rose' : 'indigo');
        metricsEl.innerHTML = `
          <div class=\"flex items-center gap-2\"><span>Status:</span> ${statusBadge(assess.status)}</div>
          <div>Baseline end-to-start factor: <span class=\"font-mono\">${fmtShort(vanishB)}</span></div>
          <div>Transformer end-to-start factor: <span class=\"font-mono\">${fmtShort(si.last)}</span></div>
          <div>Per-layer step ≈ <span class=\"font-mono\">${assess.Jstep.toFixed(3)}</span> (with <span class=\"font-mono\">g_eff ≈ ${assess.gEff.toFixed(3)}</span>)</div>
          <div class=\"mt-1\">${ratioBar('Improvement vs baseline (end→start)', improvement, ratioColor)}</div>
          ${assess.reasons.length ? `<ul class=\"list-disc ml-5 text-[11px] text-gray-700\">${assess.reasons.map(r=>`<li>${r}</li>`).join('')}</ul>` : ''}
          <div class=\"mt-1\">Baseline min/max: <span class=\"font-mono\">${fmtShort(sb.min)}</span>/<span class=\"font-mono\">${fmtShort(sb.max)}</span></div>
          <div>Transformer min/max: <span class=\"font-mono\">${fmtShort(si.min)}</span>/<span class=\"font-mono\">${fmtShort(si.max)}</span></div>
        `;

        // Explanation
        const gEff = (norm === 'pre') ? (0.6*g + 0.4) : (norm === 'post' ? (0.8*g + 0.2) : g);
        const Jstep = 1 + a * gEff;
        const shortcutFrac = hop > 0 ? 0.3 : 0.0;
        const longFrac = 1 - shortcutFrac;
        const perLayerMix = longFrac * Jstep + shortcutFrac * Math.pow(Jstep, Math.max(1, Math.floor(hop)));
        const normLabel = norm === 'pre' ? 'Pre-LN' : (norm === 'post' ? 'Post-LN' : 'No norm');

        const caution = (Jstep > 1.05)
          ? `<span class=\"text-amber-700\">Note:</span> per-layer step > 1 can cause explosions; warmup or smaller α helps.`
          : (Jstep < 0.95)
          ? `<span class=\"text-amber-700\">Note:</span> per-layer step < 1 causes decay; residual + normalization counter it over depth.`
          : `Per-layer step is near 1 — gradients are well-conditioned.`;

        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div>
              <b>Your setup.</b> L=<span class=\"font-mono\">${L}</span>, g=<span class=\"font-mono\">${g.toFixed(2)}</span>, α=<span class=\"font-mono\">${a.toFixed(2)}</span>, norm=<span class=\"font-mono\">${normLabel}</span>, shortcut=<span class=\"font-mono\">${hop>0?`on (hop=${hop})`:'off'}</span>.
            </div>
            <div>
              <b>Effective per-layer Jacobian.</b> With ${normLabel}, the layer gain is pulled toward 1: <span class=\"font-mono\">g_eff ≈ ${gEff.toFixed(3)}</span>. Residual gives <span class=\"font-mono\">J_eff ≈ I + α·g_eff</span> ⇒ scalar step ≈ <span class=\"font-mono\">${Jstep.toFixed(3)}</span>.
            </div>
            <div>
              <b>Short paths.</b> ${hop>0?`About 30% of gradient takes a ${hop}-hop route`:'No shortcut route used'}; per-layer mixed step ≈ <span class=\"font-mono\">${perLayerMix.toFixed(3)}</span>, boosting end→start signal compared to <span class=\"font-mono\">g^L</span>.
            </div>
            <div class=\"text-[11px]\">${caution}</div>
            <div class=\"text-[11px] text-gray-600\">Heuristic model for intuition only; real networks have anisotropic Jacobians, cross-layer correlations, and optimizer dynamics.</div>
          </div>
        `;

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [LEl,GEl,AEl,NEl,SEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
