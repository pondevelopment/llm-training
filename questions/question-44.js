// Question 44: What is few-shot learning, and what are its benefits?
// Created: August 13, 2025
// Focus: In-context few-shot prompting vs zero-shot and fine-tuning trade-offs

const question = {
  title: "44. What is few-shot learning, and what are its benefits?",
  answer: `
    <div class="space-y-4">
      <!-- Recommended Reading (canonical) -->
      <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
        <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
        <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-41">Question 41: Zero-shot learning & baseline capability</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-13">Question 13: Prompt engineering techniques</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-15">Question 15: Model distillation (contrast with inference-time adaptation)</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-05">Question 5: Tokenization (shot token budgeting)</a></li>
        </ul>
        <p class="mt-2 text-xs text-indigo-700">How baseline skill, prompt design, and token budgeting shape few-shot lift.</p>
      </div>
      <!-- Key Idea (accent) -->
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Core Idea</h4>
        <p class="text-sm text-blue-800">Few-shot prompting lets an LLM <b>adapt at inference time</b> by embedding a handful of <b>labeled examples</b> in context—pattern learned on the fly, no parameter updates.</p>
        <div class="text-xs mt-2 text-blue-800">
          Saturating benefit intuition:
          <div class="math-display mt-1">$$
          p(K) = 1 - (1 - p_0) e^{-\\lambda s c K}
          $$</div>
          <ul class="mt-2 list-disc ml-5 space-y-1">
            <li><code class="font-mono">p_0</code>: zero-shot baseline</li>
            <li><code class="font-mono">K</code>: example count (shots)</li>
            <li><code class="font-mono">s</code>: similarity (0–1)</li>
            <li><code class="font-mono">c</code>: CoT multiplier (≥1 with reasoning)</li>
            <li><code class="font-mono">\\lambda</code>: diminishing rate</li>
          </ul>
        </div>
      </div>
      <!-- Comparison Cards (accentified) -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
          <h5 class="font-medium text-green-900">🟢 Zero-shot</h5>
          <ul class="text-sm text-green-700 mt-1 space-y-1">
            <li>• No examples, lowest token cost</li>
            <li>• Good for broadly aligned tasks</li>
          </ul>
        </div>
        <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
          <h5 class="font-medium text-purple-900">🟣 Few-shot (in-context)</h5>
          <ul class="text-sm text-purple-700 mt-1 space-y-1">
            <li>• Add task examples at inference</li>
            <li>• Rapid adaptation, no retraining</li>
          </ul>
        </div>
        <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
          <h5 class="font-medium text-orange-900">🟠 Fine-tuning</h5>
          <ul class="text-sm text-orange-700 mt-1 space-y-1">
            <li>• Upfront training effort</li>
            <li>• Lowest per-call cost for scale</li>
          </ul>
        </div>
      </div>
      <!-- Why This Matters (canonical) -->
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Rapid iteration</b> without retraining</li>
          <li>• <b>Data efficiency</b> (handful of shots)</li>
          <li>• <b>Cost control</b> via prompt token tradeoff</li>
          <li>• <b>Edge cases</b> & niche domain adaptation</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 In‑Context Few‑Shot Explorer (benefit vs token cost)",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200\">
          <div class=\"flex flex-wrap items-center gap-2 mb-3 text-xs\">
            <span class=\"font-semibold text-gray-700 mr-1\">Presets:</span>
            <button data-q44-preset=\"starter\" class=\"px-2 py-0.5 rounded border border-emerald-300 bg-white hover:bg-emerald-100\">Starter (K=4,s=0.7,p0=0.45,CoT off)</button>
            <button data-q44-preset=\"high-sim\" class=\"px-2 py-0.5 rounded border border-emerald-300 bg-white hover:bg-emerald-100\">High similarity (K=6,s=0.9)</button>
            <button data-q44-preset=\"cost-tight\" class=\"px-2 py-0.5 rounded border border-emerald-300 bg-white hover:bg-emerald-100\">Cost tight (K=3,32/shot,B=256)</button>
            <button data-q44-preset=\"cot-heavy\" class=\"px-2 py-0.5 rounded border border-emerald-300 bg-white hover:bg-emerald-100\">CoT heavy (K=5,CoT on)</button>
            <button id=\"q44-copy\" class=\"px-2 py-0.5 rounded border border-emerald-400 bg-white hover:bg-emerald-100 text-emerald-700\">Copy link</button>
            <button id=\"q44-export\" class=\"px-2 py-0.5 rounded border border-emerald-400 bg-white hover:bg-emerald-100 text-emerald-700\">Export</button>
          </div>
          <div class=\"grid md:grid-cols-5 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\" title=\"Number of in-context examples provided\">Shots K</label>
              <input id=\"q44-k\" type=\"range\" min=\"0\" max=\"16\" step=\"1\" value=\"4\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q44-k-val\" class=\"font-mono\">4</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\" title=\"Semantic relevance of examples to the new query (0-1)\">Similarity s</label>
              <input id=\"q44-s\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.7\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q44-s-val\" class=\"font-mono\">0.70</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\" title=\"Baseline accuracy with no examples\">Zero‑shot p₀</label>
              <input id=\"q44-p0\" type=\"range\" min=\"0.20\" max=\"0.90\" step=\"0.01\" value=\"0.45\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q44-p0-val\" class=\"font-mono\">0.45</span></div>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\" title=\"Chain-of-thought: reasoning traces increase quality & tokens\">CoT</label>
              <select id=\"q44-cot\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"off\" selected>Off</option>
                <option value=\"on\">On (↑ quality, ↑ tokens)</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\" title=\"Overall prompt token budget and per-shot token length\">Budget / shot size</label>
              <div class=\"flex gap-1\">
                <select id=\"q44-budget\" class=\"w-1/2 border rounded p-1 text-xs\">
                  <option value=\"256\">256 tok</option>
                  <option value=\"512\" selected>512 tok</option>
                  <option value=\"1024\">1024 tok</option>
                </select>
                <select id=\"q44-len\" class=\"w-1/2 border rounded p-1 text-xs\">
                  <option value=\"32\">32/shot</option>
                  <option value=\"64\" selected>64/shot</option>
                  <option value=\"128\">128/shot</option>
                </select>
              </div>
            </div>
          </div>
          <p class=\"text-xs text-gray-600 mt-2\">We model accuracy with diminishing returns and account for token budget. CoT increases both quality gain and token cost per shot.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📈 Accuracy vs baseline</h5>
            <div id=\"q44-bars\" class=\"text-xs text-gray-700 space-y-1\" aria-live=\"polite\"></div>
            <div class=\"text-xs text-gray-500 mt-1\">Top bar = baseline; second = effective few-shot accuracy.</div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q44-metrics\" class=\"text-xs text-gray-700 space-y-2\" aria-live=\"polite\"></div>
            <div id=\"q44-guide\" class=\"mt-2 text-xs text-indigo-700 border-t pt-2\" aria-live=\"polite\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧠 Explanation</h5>
            <div id=\"q44-explain\" class=\"text-xs text-gray-700\" aria-live=\"polite\"></div>
          </div>
        </div>
      </div>
    `,
    script: () => {
      const KEl = document.getElementById('q44-k');
      const SEl = document.getElementById('q44-s');
      const PEl = document.getElementById('q44-p0');
      const CEl = document.getElementById('q44-cot');
      const BEl = document.getElementById('q44-budget');
      const LEl = document.getElementById('q44-len');
  const copyBtn = document.getElementById('q44-copy');
  const exportBtn = document.getElementById('q44-export');
  const presetButtons = Array.from(document.querySelectorAll('[data-q44-preset]'));
      const KVal = document.getElementById('q44-k-val');
      const SVal = document.getElementById('q44-s-val');
      const PVal = document.getElementById('q44-p0-val');

      const barsEl = document.getElementById('q44-bars');
      const metricsEl = document.getElementById('q44-metrics');
  const explainEl = document.getElementById('q44-explain');
  const guideEl = document.getElementById('q44-guide');
      if (!KEl) return;

      function accuracy(p0, K, s, cotOn){
        const lambda = 0.55; // diminishing returns strength
        const c = cotOn ? 1.3 : 1.0; // CoT quality multiplier
        const p = 1 - (1 - p0) * Math.exp(-lambda * s * c * K);
        return Math.min(0.999, Math.max(0, p));
      }

      function budget(K, perShot, budget, cotOn){
        const overhead = 64; // instructions + question
        const per = perShot * (cotOn ? 2 : 1);
        const maxK = Math.max(0, Math.floor((budget - overhead) / Math.max(1, per)));
        const used = overhead + Math.min(K, maxK) * per;
        return { maxK, used, per, overhead };
      }

      function bar(label, val, color){
        const pct = Math.round(val * 100);
        return `<div>
          <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${(val*100).toFixed(1)}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 rounded\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function fmt(n){
        if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (n >= 1e3) return (n/1e3).toFixed(2)+'k';
        return n.toString();
      }

      function guidance(p0, pEff, deltaPct, K, s, cotOn, bud){
        const tips = [];
        if (K === 0) tips.push('Add 2-4 shots to test uplift.');
        if (s < 0.3 && K > 0) tips.push('Similarity low: select more relevant examples.');
        if (deltaPct < 3 && K >= 4) tips.push('Low marginal gain: curate or reduce shots.');
        if (bud.used / bud.maxK > 0.85 && deltaPct < 5) tips.push('High cost for modest lift—consider zero-shot or tool.');
        if (cotOn && deltaPct < 2) tips.push('CoT adds cost but little lift here; try disabling.');
        if (!tips.length) return 'Configuration looks balanced.';
        return tips.join(' ');
      }

      function render(){
        const K = parseInt(KEl.value,10);
        const s = parseFloat(SEl.value);
        const p0 = parseFloat(PEl.value);
        const cotOn = CEl.value === 'on';
        const budgetTok = parseInt(BEl.value,10);
        const lenShot = parseInt(LEl.value,10);

        KVal.textContent = K;
        SVal.textContent = s.toFixed(2);
        PVal.textContent = p0.toFixed(2);

        const bud = budget(K, lenShot, budgetTok, cotOn);
        const effectiveK = Math.min(K, bud.maxK);
        const pEff = accuracy(p0, effectiveK, s, cotOn);
        const pBase = p0;

        barsEl.innerHTML = bar('Zero-shot', pBase, 'rose') +
                           '<div class="h-1"></div>' +
                           bar(`Few-shot (effective K=${effectiveK})`, pEff, 'emerald');

  const delta = (pEff - pBase) * 100;
        const shotsCost = effectiveK * bud.per;
        const costPerPct = delta > 0 ? (shotsCost / delta).toFixed(1) : '—';
  const warn = K > bud.maxK ? `<div class=\"text-xs text-amber-700\">Requested K exceeds budget; truncated to ${bud.maxK}.</div>` : '';
        metricsEl.innerHTML = `
          <div>Tokens used: <span class=\"font-mono\">${bud.used}</span> / <span class=\"font-mono\">${budgetTok}</span> (${cotOn?'CoT on':'CoT off'}, per-shot <span class=\"font-mono\">${bud.per}</span>)</div>
          <div>Improvement: <span class=\"font-mono\">${delta.toFixed(1)}%</span> over zero-shot</div>
          <div>Token cost per +1%: <span class=\"font-mono\">${costPerPct}</span></div>
          ${warn}
        `;

        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div><b>Diminishing returns.</b> Each extra shot helps less. Model: <span class=\"font-mono\">p(K) = 1 - (1-p0) · e^{-λ·s·c·K}</span>.</div>
            <div><b>Similarity matters.</b> Higher <span class=\"font-mono\">s</span> → bigger jumps for the same K.</div>
            <div><b>Chain-of-thought.</b> CoT can boost quality (c>1) but doubles per-shot tokens.</div>
            <div class=\"text-xs text-gray-600\">Heuristic simulator for intuition; real performance depends on model, prompt style, and retrieval quality.</div>
          </div>
        `;

  if (guideEl) guideEl.textContent = guidance(p0, pEff, delta, K, s, cotOn, bud);
  if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [KEl,SEl,PEl,CEl,BEl,LEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      // Presets
      function applyPreset(name){
        if(name==='starter'){ KEl.value='4'; SEl.value='0.7'; PEl.value='0.45'; CEl.value='off'; BEl.value='512'; LEl.value='64'; }
        else if(name==='high-sim'){ KEl.value='6'; SEl.value='0.9'; }
        else if(name==='cost-tight'){ KEl.value='3'; SEl.value='0.6'; BEl.value='256'; LEl.value='32'; }
        else if(name==='cot-heavy'){ KEl.value='5'; CEl.value='on'; }
        render();
      }
      presetButtons.forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.getAttribute('data-q44-preset'))));

      // Permalink copy (#question-44?K=..&s=..&p0=..&cot=..&B=..&L=..)
      copyBtn?.addEventListener('click',()=>{
        const params = new URLSearchParams({K:KEl.value,s:SEl.value,p0:PEl.value,cot:CEl.value,B:BEl.value,L:LEl.value});
        const url = `${location.origin}${location.pathname}#question-44?${params.toString()}`;
        navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
      });

      // Export JSON snapshot
      exportBtn?.addEventListener('click',()=>{
        const payload = {
          generated: new Date().toISOString(),
          config: {K:parseInt(KEl.value,10), s:parseFloat(SEl.value), p0:parseFloat(PEl.value), cot:CEl.value, budget:parseInt(BEl.value,10), perShot:parseInt(LEl.value,10)},
        };
        const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'few-shot-scenario.json';
        document.body.appendChild(link); link.click();
        setTimeout(()=>{ URL.revokeObjectURL(link.href); link.remove(); }, 100);
      });

      // Hash parse
      (function initFromHash(){
        if(!location.hash) return; const m = location.hash.match(/question-44\?(.*)$/); if(!m) return; const p = new URLSearchParams(m[1]);
        if(p.get('K')) KEl.value=p.get('K');
        if(p.get('s')) SEl.value=p.get('s');
        if(p.get('p0')) PEl.value=p.get('p0');
        if(p.get('cot')) CEl.value=p.get('cot');
        if(p.get('B')) BEl.value=p.get('B');
        if(p.get('L')) LEl.value=p.get('L');
      })();
      render();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
