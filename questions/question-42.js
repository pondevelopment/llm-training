// Question 42: How does Adaptive Softmax optimize LLMs?
// Created: August 12, 2025
// Focus: Explain hierarchical/adaptive softmax and simulate compute/param savings vs full softmax

const question = {
  title: "42. How does Adaptive Softmax optimize LLMs?",
  answer: `
    <div class="space-y-4">
      <!-- Recommended Reading (canonical style) -->
      <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
  <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
        <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-05">Question 5: Tokenization & vocabulary shaping</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-06">Question 6: Temperature & decoding</a></li>
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-39">Question 39: Discriminative vs generative heads</a></li>
        </ul>
      </div>
      <!-- Key Idea (accent panel) -->
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <h4 class="font-semibold text-blue-900 mb-2">⚡ Key Idea</h4>
        <p class="text-sm text-blue-800">Adaptive Softmax splits a large vocabulary into a <b>frequent head</b> and one or more <b>rare tails</b>. At training time it computes the head for <i>all</i> tokens and only the <i>relevant tail</i> for the gold label. Rare tails use <b>reduced projection dimensions</b>, cutting multiply‑adds and parameters while preserving accuracy on frequent words.</p>
        <div class="text-xs mt-2 text-blue-800">
          <span class="font-semibold">Compute model:</span> batch size \(B\), hidden dim \(d\), head size \(V_h\), tails \(i=1..C\), tail dims \(d_i = \alpha_i d\), tail sizes \(V_i\), batch fractions \(p_i\):
          <div class="math-display">$$
          \\begin{align*}
          C_{\\text{full}} &\\propto B d V,\\\\
          C_{\\text{adaptive}} &\\propto B d (V_h + C) + B\\sum_i p_i d_i V_i,\\\\
          P_{\\text{adaptive}} &\\approx d V_h + \\sum_i d_i V_i + d C.
          \\end{align*}
          $$</div>
        </div>
      </div>
      <!-- Comparison Cards (accentified) -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
          <h5 class="font-medium text-green-900">🟢 Full Softmax</h5>
          <ul class="text-sm text-green-700 mt-1 space-y-1">
            <li>• Compute over <b>entire</b> vocabulary</li>
            <li>• Maximum accuracy, expensive</li>
          </ul>
        </div>
        <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
          <h5 class="font-medium text-purple-900">🟣 Adaptive Softmax</h5>
          <ul class="text-sm text-purple-700 mt-1 space-y-1">
            <li>• Head + small set of tails per example</li>
            <li>• Tail projections shrink: \(d_i = \alpha_i d\)</li>
          </ul>
        </div>
        <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
          <h5 class="font-medium text-orange-900">🟠 When to use</h5>
          <ul class="text-sm text-orange-700 mt-1 space-y-1">
            <li>• Very large vocabularies (50k–1M)</li>
            <li>• Zipfian distributions (few frequent, many rare)</li>
          </ul>
        </div>
      </div>
      <!-- Why This Matters (canonical) -->
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Speeds up</b> training by avoiding full-vocab logits</li>
          <li>• <b>Reduces parameters</b> with low-dim tails</li>
          <li>• Keeps accuracy high for frequent words</li>
          <li>• Great for large-vocab or resource-limited settings</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Adaptive Softmax Simulator (compute + parameter savings)",
    html: `
      <!-- existing wrapper start -->
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-fuchsia-50 to-rose-50 p-4 rounded-lg border border-fuchsia-200">
          <div class="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <!-- existing preset buttons -->
            <span class="font-semibold text-gray-700 mr-1">Presets:</span>
            <button data-preset="balanced" class="px-2 py-0.5 rounded border border-fuchsia-300 bg-white hover:bg-fuchsia-100 transition">Balanced</button>
            <button data-preset="aggressive" class="px-2 py-0.5 rounded border border-fuchsia-300 bg-white hover:bg-fuchsia-100 transition">Aggressive tails</button>
            <button data-preset="widehead" class="px-2 py-0.5 rounded border border-fuchsia-300 bg-white hover:bg-fuchsia-100 transition">Wide head</button>
            <button data-preset="compression" class="px-2 py-0.5 rounded border border-fuchsia-300 bg-white hover:bg-fuchsia-100 transition">High compression</button>
            <button id="q42-adv-toggle" class="px-2 py-0.5 rounded border border-fuchsia-400 bg-fuchsia-50 hover:bg-fuchsia-100 transition" aria-expanded="false">Show advanced ▾</button>
            <label class="flex items-center gap-1 ml-2 cursor-pointer select-none"><input id="q42-baseline" type="checkbox" class="scale-90"> <span>Baseline overlay</span></label>
            <button id="q42-copy" class="px-2 py-0.5 rounded border border-fuchsia-400 bg-white hover:bg-fuchsia-100 text-fuchsia-700">Copy link</button>
            <button id="q42-export" class="px-2 py-0.5 rounded border border-fuchsia-400 bg-white hover:bg-fuchsia-100 text-fuchsia-700">Export</button>
            <button id="q42-reset" class="ml-auto px-2 py-0.5 rounded bg-fuchsia-600 text-white text-xs hover:bg-fuchsia-700">Reset</button>
          </div>
          <!-- existing controls grid retained below -->
          <div class="grid md:grid-cols-5 gap-4 text-xs">
            <div>
              <label class="font-semibold text-gray-700 flex items-center gap-1">Vocab size V <span title="Total vocabulary size used for full softmax baseline." class="cursor-help text-fuchsia-600">?</span></label>
              <select id="q42-vocab" class="w-full border rounded p-1 text-xs">
                <option value="50000" selected>50k</option>
                <option value="100000">100k</option>
              </select>
            </div>
            <div>
              <label class="font-semibold text-gray-700 flex items-center gap-1">Zipf exponent s <span title="Higher s = steeper frequency drop; more mass concentrated in head." class="cursor-help text-fuchsia-600">?</span></label>
              <input id="q42-zipf" type="range" min="1.00" max="1.20" step="0.01" value="1.08" class="w-full" />
              <div class="text-center mt-1">s=<span id="q42-zipf-val" class="font-mono">1.08</span></div>
            </div>
            <div>
              <label class="font-semibold text-gray-700 flex items-center gap-1">Bucket cutoffs <span title="Defines head, tail1, tail2 boundaries by rank (inclusive)." class="cursor-help text-fuchsia-600">?</span></label>
              <select id="q42-cutoffs" class="w-full border rounded p-1 text-xs">
                <option value="5000,20000">5k, 20k</option>
                <option value="8000,25000">8k, 25k</option>
                <option value="10000,30000" selected>10k, 30k</option>
                <option value="15000,45000">15k, 45k</option>
                <option value="15000,50000">15k, 50k</option>
                <option value="20000,60000">20k, 60k</option>
              </select>
              <div class="text-xs text-gray-500 mt-1">Example: 10k,30k → head=[1..10k], tail1=(10k..30k], tail2=(30k..V]</div>
            </div>
            <div id="q42-adv-1" class="hidden">
              <label class="font-semibold text-gray-700 flex items-center gap-1">Tail shrink (α) <span title="Tails use lower projection dims: d_i = α_i · d." class="cursor-help text-fuchsia-600">?</span></label>
              <select id="q42-alphas" class="w-full border rounded p-1 text-xs">
                <option value="0.75,0.50">(0.75, 0.50)</option>
                <option value="0.50,0.25" selected>(0.50, 0.25)</option>
                <option value="0.50,0.125">(0.50, 0.125)</option>
                <option value="0.35,0.15">(0.35, 0.15)</option>
              </select>
              <div id="q42-alpha-detail" class="text-xs text-gray-500 mt-1"></div>
            </div>
            <div id="q42-adv-2" class="hidden">
              <label class="font-semibold text-gray-700 flex items-center gap-1">Hidden dim d <span title="Base hidden dimension before projection." class="cursor-help text-fuchsia-600">?</span></label>
              <select id="q42-dim" class="w-full border rounded p-1 text-xs">
                <option value="512">512</option>
                <option value="768">768</option>
                <option value="1024" selected>1024</option>
                <option value="1536">1536</option>
                <option value="2048">2048</option>
              </select>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-2"><b>Tip:</b> Start with presets. Use “Show advanced” for α & d tuning. Toggle baseline to visualize full softmax reference.</p>
        </div>
  <div>
          <!-- existing panels unchanged up to coverage panel -->
          <div class="bg-white border rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">🧱 Bucket Coverage</h5>
            <div id="q42-coverage" class="text-xs text-gray-700 space-y-2" aria-live="polite"></div>
            <div class="mt-3">
              <div class="flex items-center justify-between mb-1"><span class="font-semibold text-gray-700 text-xs">Zipf distribution</span><span id="q42-spark-legend" class="text-xs text-gray-500"></span></div>
              <div id="q42-spark" class="relative h-16 bg-gradient-to-b from-white to-slate-50 border rounded overflow-hidden"></div>
              <div id="q42-spark-info" class="mt-1 text-xs text-gray-500"></div>
            </div>
          </div>
        </div>
        <!-- existing explanation & compare panels remain below -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h5 class="font-semibold text-indigo-900 mb-1">🔎 Explanation</h5>
          <div id="q42-explain" class="text-xs text-indigo-800" aria-live="polite"></div>
        </div>
        <div class="bg-white border rounded-lg p-4">
          <h5 class="font-semibold text-gray-800 mb-2">🧾 Scenario Compare</h5>
          <div class="flex flex-wrap gap-2 mb-2">
            <button id="q42-freeze" class="px-2 py-1 text-xs rounded bg-gray-800 text-white hover:bg-gray-700">Freeze current</button>
            <button id="q42-clear" class="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50">Clear</button>
          </div>
          <div id="q42-compare" class="text-xs space-y-2"></div>
          <div id="q42-sensitivity" class="text-xs text-gray-600 mt-3"></div>
        </div>
      </div>
    `,
    script: () => {
      // Phase 3 additions + existing logic merged
      const baselineToggle = document.getElementById('q42-baseline');
      const copyBtn = document.getElementById('q42-copy');
  const exportBtn = document.getElementById('q42-export');
      const sparkEl = document.getElementById('q42-spark');
      const sparkInfoEl = document.getElementById('q42-spark-info');
      const sparkLegend = document.getElementById('q42-spark-legend');
      // existing already-declared elements
      const vocabEl = document.getElementById('q42-vocab');
      const zipfEl = document.getElementById('q42-zipf');
      const zipfVal = document.getElementById('q42-zipf-val');
      const cutoffsEl = document.getElementById('q42-cutoffs');
      const alphasEl = document.getElementById('q42-alphas');
      const dimEl = document.getElementById('q42-dim');
      const alphaDetailEl = document.getElementById('q42-alpha-detail');
      const resultsEl = document.getElementById('q42-results');
      const metricsEl = document.getElementById('q42-metrics');
      const coverageEl = document.getElementById('q42-coverage');
      const explainEl = document.getElementById('q42-explain');
      const presetButtons = Array.from(document.querySelectorAll('[data-preset]'));
      const resetBtn = document.getElementById('q42-reset');
      const advToggle = document.getElementById('q42-adv-toggle');
      const adv1 = document.getElementById('q42-adv-1');
      const adv2 = document.getElementById('q42-adv-2');
      const freezeBtn = document.getElementById('q42-freeze');
      const clearBtn = document.getElementById('q42-clear');
      const compareEl = document.getElementById('q42-compare');
      const sensitivityEl = document.getElementById('q42-sensitivity');
  // Only hard-require core inputs + coverage panel so partial layouts still function
  if (!vocabEl || !coverageEl) return; // safety guard (allow missing results/metrics/explain sections)

      const BASE_D = 1024; // reference hidden dimension
      let prevD = null, prevRelCompute = null, prevRelParams = null;
      const frozen = [];

      function fmt(n){
        const abs = Math.abs(n);
        if (abs >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (abs >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (abs >= 1e3) return (n/1e3).toFixed(2)+'k';
        return n.toFixed(0);
      }
      function fmtSigned(n){ return (n>=0?'+':'') + fmt(n); }
      function pct(x){ return (x*100).toFixed(1)+'%'; }

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
      // Memoized Zipf mass computation (Phase 4 performance improvement)
      const zipfCache = new Map(); // key: `${V}|${s}|${c1}|${c2}`
      function zipfMasses(V, s, c1, c2){
        const key = V+"|"+s+"|"+c1+"|"+c2;
        if(zipfCache.has(key)) return zipfCache.get(key);
        let H = 0, Hc1 = 0, Hc2 = 0;
        for (let r=1; r<=V; r++){
          const v = 1/Math.pow(r, s);
          H += v; if (r<=c1) Hc1 += v; if (r<=c2) Hc2 += v;
        }
        const res = {pHead: Hc1 / H, pTail1: (Hc2 - Hc1)/H, pTail2: 1 - (Hc2 / H)};
        zipfCache.set(key, res);
        // Simple cache size guard
        if(zipfCache.size > 80){ zipfCache.clear(); }
        return res;
      }
      function bar(label, val, color, ghostBaseline){
        const pctVal = Math.max(0, Math.min(100, Math.round(val*100)));
        if(ghostBaseline){
          return `<div class=\"relative\">\n  <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${pctVal}%</span></div>\n  <div class=\"w-full h-3 relative rounded bg-gray-100 overflow-hidden\"><div class=\"absolute inset-0 bg-${color}-200 opacity-40\"></div><div class=\"h-3 bg-${color}-600 relative transition-all" style="width:${pctVal}%"></div></div>\n</div>`;
        }
        return `<div>\n  <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${pctVal}%</span></div>\n  <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 transition-all" style="width:${pctVal}%"></div></div>\n</div>`;
      }
      function ratioBar(label, ratio, color){
        const pctVal = Math.max(0, Math.min(100, Math.round(ratio*100)));
        return `<div>\n  <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${(ratio*100).toFixed(0)}% (×${ratio.toFixed(2)})</span></div>\n  <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 transition-all" style="width:${pctVal}%"></div></div>\n</div>`;
      }
      function coverageRow(label, mass, color){
        const pctVal = (mass*100).toFixed(1);
        const tokensPerM = Math.round(mass * 1_000_000);
        return `<div class=\"space-y-0.5\">\n  <div class=\"flex justify-between text-xs\"><span>${label}</span><span>${pctVal}% (~${fmt(tokensPerM)} / 1M)</span></div>\n  <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 transition-all" style="width:${Math.min(100, Math.max(0, mass*100))}%"></div></div>\n</div>`;
      }
      function highlight(el){ if(!el) return; el.classList.add('ring','ring-fuchsia-300'); setTimeout(()=>el.classList.remove('ring','ring-fuchsia-300'),400); }

      function applyPreset(name){
        switch(name){
          case 'balanced': cutoffsEl.value = '10000,30000'; alphasEl.value = '0.50,0.25'; dimEl.value = '1024'; break;
          case 'aggressive': cutoffsEl.value = '8000,25000'; alphasEl.value = '0.35,0.15'; dimEl.value = '1024'; break;
          case 'widehead': cutoffsEl.value = '15000,45000'; alphasEl.value = '0.50,0.25'; dimEl.value = '1024'; break;
          case 'compression': cutoffsEl.value = '10000,30000'; alphasEl.value = '0.50,0.125'; dimEl.value = '1024'; break;
        }
        render();
      }

      presetButtons.forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
      resetBtn?.addEventListener('click', () => { applyPreset('balanced'); zipfEl.value = '1.08'; render(); });

      advToggle?.addEventListener('click', () => {
        const expanded = advToggle.getAttribute('aria-expanded') === 'true';
        advToggle.setAttribute('aria-expanded', String(!expanded));
        advToggle.textContent = !expanded ? 'Hide advanced ▴' : 'Show advanced ▾';
        [adv1, adv2].forEach(div => { if(!div) return; if (!expanded) div.classList.remove('hidden'); else div.classList.add('hidden'); });
      });

      freezeBtn?.addEventListener('click', () => {
        const snap = currentSnapshot;
        if(!snap) return;
        frozen.push(snap);
        if (frozen.length > 4) frozen.shift();
        renderCompare();
      });
      clearBtn?.addEventListener('click', () => { frozen.length = 0; renderCompare(); });

      let currentSnapshot = null;

      function renderCompare(){
        if(!compareEl) return;
        if(frozen.length === 0){ compareEl.innerHTML = '<div class="text-gray-500">No frozen scenarios yet.</div>'; return; }
        const base = frozen[0];
        compareEl.innerHTML = `<div class=\"overflow-x-auto\"><table class=\"min-w-full text-left border border-gray-200\">
          <thead class=\"bg-gray-50\"><tr>
            <th class=\"px-2 py-1 text-xs\">#</th>
            <th class=\"px-2 py-1 text-xs\">Cutoffs</th>
            <th class=\"px-2 py-1 text-xs\">α</th>
            <th class=\"px-2 py-1 text-xs\">d</th>
            <th class=\"px-2 py-1 text-xs\">Rel Compute</th>
            <th class=\"px-2 py-1 text-xs\">Rel Params</th>
            <th class=\"px-2 py-1 text-xs\">Speed-up</th>
            <th class=\"px-2 py-1 text-xs\">Param Save</th>
          </tr></thead>
          <tbody>${frozen.map((f,i)=>{
            const dComp = (f.relCompute - base.relCompute);
            const dParam = (f.relParams - base.relParams);
            return `<tr class=\"${i===0?'bg-white':'bg-white'}\">
              <td class=\"px-2 py-1 align-top font-mono\">${i+1}</td>
              <td class=\"px-2 py-1 align-top\">${f.head}|${f.tail1}|${f.tail2}</td>
              <td class=\"px-2 py-1 align-top font-mono\">${f.a1},${f.a2}</td>
              <td class=\"px-2 py-1 align-top font-mono\">${f.d}</td>
              <td class=\"px-2 py-1 align-top font-mono\">${f.relCompute.toFixed(3)}${i>0?` <span class=\\"${dComp<0?'text-emerald-600':'text-rose-600'}\\">(${dComp>=0?'+':''}${dComp.toFixed(3)})</span>`:''}</td>
              <td class=\"px-2 py-1 align-top font-mono\">${f.relParams.toFixed(3)}${i>0?` <span class=\\"${dParam<0?'text-emerald-600':'text-rose-600'}\\">(${dParam>=0?'+':''}${dParam.toFixed(3)})</span>`:''}</td>
              <td class=\"px-2 py-1 align-top font-mono\">${f.speedup.toFixed(2)}×</td>
              <td class=\"px-2 py-1 align-top font-mono\">${(f.paramSave*100).toFixed(1)}%</td>
            </tr>`;
          }).join('')}</tbody></table></div>`;
      }

      function sensitivityAdvice(computeHead, computeTail1, computeTail2, paramHead, paramTail1, paramTail2, paramClusters){
        const computeParts = [
          {k:'Head', v:computeHead, hint:'Reduce head cutoff or increase tail splits.'},
          {k:'Tail1', v:computeTail1, hint:'Lower α₁ or narrow tail1 cutoff range.'},
          {k:'Tail2', v:computeTail2, hint:'Lower α₂ or widen head/tail1 to shrink tail2.'}
        ];
        const top = computeParts.sort((a,b)=>b.v-a.v)[0];
        const paramParts = [
          {k:'Head', v:paramHead, hint:'Reduce head cutoff.'},
          {k:'Tail1', v:paramTail1, hint:'Lower α₁ or reduce tail1 size.'},
          {k:'Tail2', v:paramTail2, hint:'Lower α₂ or reduce tail2 size.'},
          {k:'Clusters', v:paramClusters, hint:'Reduce number of tails (merge) or head size.'}
        ].sort((a,b)=>b.v-a.v);
        const pTop = paramParts[0];
  sensitivityEl.innerHTML = `<div class=\"leading-snug\"><span class=\"font-semibold\">Sensitivity:</span> Compute dominated by <b>${top.k}</b>; ${top.hint} Params dominated by <b>${pTop.k}</b>; ${pTop.hint}</div>`;
      }

      function render(){
        const V = parseInt(vocabEl.value, 10);
        const s = parseFloat(zipfEl.value);
        zipfVal.textContent = s.toFixed(2);
        const [c1, c2] = parseCutoffs(cutoffsEl.value, V);
        const [a1, a2] = parseAlphas(alphasEl.value || '0.5,0.25');
        const d = Math.max(128, parseInt(dimEl.value||'1024',10)||1024);
        const head = c1; const tail1 = Math.max(0, c2 - c1); const tail2 = Math.max(0, V - c2);
        const C = (tail1>0?1:0) + (tail2>0?1:0);
        const {pHead, pTail1, pTail2} = zipfMasses(V, s, c1, c2);
        const tail1Dim = Math.round(a1*d); const tail2Dim = Math.round(a2*d);

        // Compute costs
        const Cfull = d * V;
        const computeHead = d * (head + C);
        const computeTail1 = (pTail1 * (a1*d) * tail1);
        const computeTail2 = (pTail2 * (a2*d) * tail2);
        const Cadapt = computeHead + computeTail1 + computeTail2;
        const speedup = Cfull / Cadapt;

        // Parameters
        const Pfull = d * V;
        const paramHead = d * head;
        const paramTail1 = (a1*d) * tail1;
        const paramTail2 = (a2*d) * tail2;
        const paramClusters = d * C;
        const Padapt = paramHead + paramTail1 + paramTail2 + paramClusters;
        const paramSave = 1 - (Padapt / Pfull);

        // Coverage (always present)
        coverageEl.innerHTML = [
          coverageRow(`Head (1..${head}) mass`, pHead, 'indigo'),
          coverageRow(`Tail1 (${head+1}..${c2}) mass`, pTail1, 'violet'),
          coverageRow(`Tail2 (${c2+1}..${V}) mass`, pTail2, 'sky')
        ].join('');

        // Results (optional section)
        if(resultsEl){
          resultsEl.innerHTML = `
            <div>Cutoffs → head=<b>${head}</b>, tail1=<b>${tail1}</b>, tail2=<b>${tail2}</b>, clusters=<b>${C}</b></div>
            <div>Tail dims → α₁=<span class=\"font-mono\">${a1}</span> (d₁=${tail1Dim}), α₂=<span class=\"font-mono\">${a2}</span> (d₂=${tail2Dim})</div>
            <div>Hidden dim d=<span class=\"font-mono\">${d}</span>, V=<span class=\"font-mono\">${V.toLocaleString()}</span></div>
          `;
        }
        alphaDetailEl && (alphaDetailEl.textContent = `Tail1 dim = α₁·d = ${a1}×${d} = ${tail1Dim}; Tail2 dim = α₂·d = ${a2}×${d} = ${tail2Dim}`);

        // Relative metrics
        const relCompute = Math.min(1, Cadapt / Cfull);
        const relParams = Math.min(1, Padapt / Pfull);
        const baselineScale = d / BASE_D;
        const Cadapt0 = BASE_D * (head + C) + (pTail1 * (a1*BASE_D) * tail1) + (pTail2 * (a2*BASE_D) * tail2);
        const Padapt0 = BASE_D * head + (a1*BASE_D) * tail1 + (a2*BASE_D) * tail2 + BASE_D * C;

        const eqCompute = `C_adapt = d*(V_h + C) + p₁*(α₁ d)*V₁ + p₂*(α₂ d)*V₂ = ${d}*(${head}+${C}) + ${pTail1.toFixed(3)}*(${a1}*${d})*${tail1} + ${pTail2.toFixed(3)}*(${a2}*${d})*${tail2} ≈ ${fmt(Cadapt)}`;
        const eqParams = `P_adapt = d*V_h + (α₁ d)*V₁ + (α₂ d)*V₂ + d*C = ${d}*${head} + (${a1}*${d})*${tail1} + (${a2}*${d})*${tail2} + ${d}*${C} ≈ ${fmt(Padapt)}`;

        const computeBreak = [
          { label: 'Head + clusters', val: computeHead },
          { label: 'Tail1 expected', val: computeTail1 },
          { label: 'Tail2 expected', val: computeTail2 }
        ];
        const paramBreak = [
          { label: 'Head weights', val: paramHead },
          { label: 'Tail1 weights', val: paramTail1 },
          { label: 'Tail2 weights', val: paramTail2 },
          { label: 'Cluster tokens', val: paramClusters }
        ];
        function breakdownHTML(title, arr, total){
          return `<div class=\"mt-1\"><div class=\"font-semibold text-xs text-gray-600\">${title}</div>${arr.map(x=>`<div class=\"flex justify-between text-xs\"><span>${x.label}</span><span>${((x.val/total)*100).toFixed(1)}% (${fmt(x.val)})</span></div>`).join('')}</div>`;
        }

        if(metricsEl){
          const ghost = baselineToggle?.checked;
          metricsEl.innerHTML = `
              ${bar('Relative compute (adaptive vs full)', relCompute, 'emerald', ghost)}
              ${bar('Relative parameters (adaptive vs full)', relParams, 'orange', ghost)}
            <div class=\"mt-2\">${ratioBar('Adaptive compute vs baseline (d₀=1024)', Cadapt / Cadapt0, 'blue')}</div>
            <div>${ratioBar('Classifier params vs baseline (d₀=1024)', Padapt / Padapt0, 'teal')}</div>
            <div class=\"mt-1\">Speed-up factor: <span class=\"font-mono\">${speedup.toFixed(2)}×</span>; Param savings: <span class=\"font-mono\">${(paramSave*100).toFixed(1)}%</span></div>
            <div class=\"mt-2 p-2 rounded bg-gray-50 border border-gray-200 text-xs leading-snug\">
              <div class=\"font-semibold mb-1\">Instantiated equations</div>
              <div class=\"font-mono\">${eqCompute}</div>
              <div class=\"font-mono mt-0.5\">${eqParams}</div>
            </div>
            ${breakdownHTML('Compute breakdown', computeBreak, Cadapt)}
            ${breakdownHTML('Parameter breakdown', paramBreak, Padapt)}
            <hr class=\"my-2\" />
            <div class=\"text-xs text-gray-600\">Baseline scaling: d/d₀ = ×${baselineScale.toFixed(2)} (d₀=${BASE_D}). Absolute compute: full=${fmt(Cfull)}, adaptive≈${fmt(Cadapt)}. Params: full=${fmt(Pfull)}, adaptive≈${fmt(Padapt)}.</div>
            ${prevD !== null && prevD !== d ? `<div class=\"text-xs text-gray-700 mt-1\">Δd=${d - prevD}: Δcompute≈<span class=\"font-mono\">${fmtSigned((d - prevD) * (head + C + pTail1 * (a1) * tail1 + pTail2 * (a2) * tail2))}</span>, Δparams≈<span class=\"font-mono\">${fmtSigned((d - prevD) * (head + C + a1 * tail1 + a2 * tail2))}</span></div>` : ''}
              <div id=\"q42-guidance\" class=\"mt-2 text-xs text-gray-700\"></div>
          `;
            // Guidance heuristic (Phase 4)
            const guidanceEl = document.getElementById('q42-guidance');
            if(guidanceEl){
              let advice = '';
              if(relCompute > 0.55){ advice += 'Compute still high; reduce head or shrink α values. '; }
              if(relParams > 0.55){ advice += 'Parameters dominated by head/tails; lower α or head cutoff. '; }
              if(speedup < 1.5){ advice += 'Speed-up moderate; more aggressive tail compression could help.'; }
              if(!advice) advice = 'Configuration is already efficient; further gains may impact accuracy.';
              guidanceEl.textContent = advice.trim();
            }
        }

        // Metric change highlighting
        if (prevRelCompute !== null && Math.abs(relCompute - prevRelCompute) > 0.01) highlight(metricsEl);
        if (prevRelParams !== null && Math.abs(relParams - prevRelParams) > 0.01) highlight(metricsEl);

        sensitivityAdvice(computeHead, computeTail1, computeTail2, paramHead, paramTail1, paramTail2, paramClusters);

        if(explainEl){
          explainEl.innerHTML = `Adaptive Softmax computes <b>head</b> logits for every example and only the <b>gold tail</b>. Head size & Zipf skew decide probability mass captured early; α compresses projection dims for tails reducing cost.`;
          if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
        }

        prevD = d; prevRelCompute = relCompute; prevRelParams = relParams;

        currentSnapshot = { head, tail1, tail2, a1, a2, d, relCompute, relParams, speedup, paramSave };
        renderCompare();
  // Update sparkline with current distribution & cutoffs
  buildSpark(s, V, c1, c2);
  // Update spark accessibility label
  if(sparkEl){ sparkEl.setAttribute('role','img'); sparkEl.setAttribute('aria-label',`Zipf distribution approximation for V=${V}, head<=${c1}, tail1<=${c2}`); }
      }

      [vocabEl, zipfEl, cutoffsEl, alphasEl, dimEl].forEach(el=>{ el?.addEventListener('input', render); el?.addEventListener('change', render); });
      render();

      // Parse hash params if present (#question-42?v=...&s=...&c=...&a=...&d=...)
      (function initFromHash(){
        if (!location.hash) return;
        const m = location.hash.match(/question-42\?(.*)$/);
        if(!m) return;
        const params = new URLSearchParams(m[1]);
        const v = params.get('v'); const s = params.get('s'); const c = params.get('c'); const a = params.get('a'); const d = params.get('d');
        if (v) { const el = document.getElementById('q42-vocab'); if (el) el.value = v; }
        if (s) { const el = document.getElementById('q42-zipf'); if (el) el.value = s; }
        if (c) { const el = document.getElementById('q42-cutoffs'); if (el) el.value = c; }
        if (a) { const el = document.getElementById('q42-alphas'); if (el) el.value = a; }
        if (d) { const el = document.getElementById('q42-dim'); if (el) el.value = d; }
      })();

      // Copy permalink generator
      copyBtn?.addEventListener('click', () => {
        const v = document.getElementById('q42-vocab')?.value;
        const s = document.getElementById('q42-zipf')?.value;
        const c = document.getElementById('q42-cutoffs')?.value;
        const a = document.getElementById('q42-alphas')?.value;
        const d = document.getElementById('q42-dim')?.value;
        const params = new URLSearchParams({v: v||'', s: s||'', c: c||'', a: a||'', d: d||''});
        const url = `${location.origin}${location.pathname}#question-42?${params.toString()}`;
        navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
      });

      // Sparkline builder (approximate Zipf over sample ranks)
      function buildSpark(s, V, c1, c2){
        if(!sparkEl) return;
        const W = sparkEl.clientWidth || 260; const H = 60; const sample = 200;
        const step = V / sample;
        const weights = []; for(let i=0;i<sample;i++){ const r = 1 + i*step; const w = 1/Math.pow(r, s); weights.push(w); }
        const maxW = Math.max(...weights);
        const lines = weights.map((w,i)=>{ const x = (i/(sample-1))*W; const h = (w/maxW)*(H-4); return `<line x1="${x.toFixed(2)}" x2="${x.toFixed(2)}" y1="${H}" y2="${(H-h).toFixed(2)}" stroke="rgba(99,102,241,0.5)" stroke-width="1"/>`; }).join('');
        const xC1 = (c1 / V) * W; const xC2 = (c2 / V) * W;
        const cutLines = `<line x1="${xC1}" x2="${xC1}" y1="0" y2="${H}" stroke="#6366f1" stroke-dasharray="3,2"/>` + `<line x1="${xC2}" x2="${xC2}" y1="0" y2="${H}" stroke="#63666f1" stroke-dasharray="3,2"/>`;
        sparkEl.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${lines}${cutLines}</svg>`;
        sparkLegend && (sparkLegend.textContent = `V=${V.toLocaleString()} | head≤${c1} | tail1≤${c2}`);
        // Hover interaction
        sparkEl.onmousemove = (e)=>{
          const rect = sparkEl.getBoundingClientRect();
          const x = e.clientX - rect.left; const ratio = Math.min(1, Math.max(0, x / rect.width));
          const rank = Math.max(1, Math.round(ratio * V));
          const bucket = rank<=c1? 'Head' : (rank<=c2? 'Tail1':'Tail2');
          const w = 1/Math.pow(rank, s); // approximate local weight (unnormalized)
          sparkInfoEl && (sparkInfoEl.textContent = `Rank ${rank} → ${bucket}, approx weight 1/r^s ≈ ${(w).toExponential(2)}`);
        };
        sparkEl.onmouseleave = ()=>{ if(sparkInfoEl) sparkInfoEl.textContent=''; };
      }

      // Re-render when baseline overlay toggled
      baselineToggle?.addEventListener('change', render);

      // Inject baseline overlay augment by observing metricsEl content replace and re-writing when toggle is on.
      const observer = new MutationObserver(()=>{
        // parse current numbers if baseline overlay requested
        if(!baselineToggle?.checked || !metricsEl) return;
        if(metricsEl.querySelector('[data-baseline-overlay]')) return; // already added
        const absLine = Array.from(metricsEl.querySelectorAll('div')).find(d=>d.textContent?.includes('Absolute compute'));
        // We already have absolute lines; add a subtle overlay banner
        const overlay = document.createElement('div');
        overlay.setAttribute('data-baseline-overlay','1');
  overlay.className='mt-1 p-1 rounded bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-xs text-gray-600';
        overlay.innerHTML = 'Baseline overlay active: bars show adaptive share; full softmax = 100% reference.';
        metricsEl.appendChild(overlay);
      });
      metricsEl && observer.observe(metricsEl, {childList:true, subtree:true});
      // Export frozen + current scenario
      exportBtn?.addEventListener('click', ()=>{
        const scenarios = [...frozen, currentSnapshot].filter(Boolean);
        if(!scenarios.length) return;
        const blob = new Blob([JSON.stringify({generated: new Date().toISOString(), scenarios}, null, 2)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'adaptive-softmax-scenarios.json';
        document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();}, 100);
      });
      // Initial spark render (subsequent updates happen inside render())
      render();
    }
  }
};

// Export pattern
if (typeof module !== 'undefined') { module.exports = question; }
