// Question 53: Decoding strategies overview
// Created: 2025-09-10
// Focus: Comparative taxonomy of decoding methods (greedy, beam, top-k, nucleus, typical, advanced)

const question = {
  title: "53. What are decoding strategies for selecting output tokens?",
  answer: `
<div class="space-y-4">
  <!-- Recommended Reading (aligned with Q1 style) -->
  <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
    <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
    <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
      <li><a href="#question-05" class="text-indigo-700 underline hover:text-indigo-900">Question 5: How does beam search improve text generation compared to greedy decoding?</a></li>
      <li><a href="#question-06" class="text-indigo-700 underline hover:text-indigo-900">Question 6: What is temperature in text generation and how does it affect output?</a></li>
      <li><a href="#question-12" class="text-indigo-700 underline hover:text-indigo-900">Question 12: How do top-k and top-p sampling differ in text generation?</a></li>
      <li><a href="#question-25" class="text-indigo-700 underline hover:text-indigo-900">Question 25: Why is cross-entropy loss used in language modeling?</a></li>
      <li><a href="#question-38" class="text-indigo-700 underline hover:text-indigo-900">Question 38: What is chain-of-thought prompting?</a></li>
      <li><a href="#question-48" class="text-indigo-700 underline hover:text-indigo-900">Question 48: What are LLM hyperparameters?</a></li>
      <li><a href="#question-54" class="text-indigo-700 underline hover:text-indigo-900">Question 54: What are logits, and why don't LLMs output probabilities directly?</a></li>
    </ul>
  </div>

  <!-- Core Concept (accent border like Q1) -->
  <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
    <h4 class="font-semibold text-blue-900 mb-2">🧭 From Logits to a Chosen Token</h4>
    <p class="text-blue-800 text-sm leading-relaxed">The model emits raw scores (logits) \(\mathbf{z}\). A decoding strategy transforms them into a concrete next token while trading off <strong>quality</strong>, <strong>determinism</strong>, <strong>diversity</strong>, <strong>latency</strong>, and <strong>control</strong>.</p>
    <div class="math-display">$$ p_i = \\operatorname{softmax}(z)_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}} $$</div>
    <p class="text-xs text-blue-700">Everything after softmax is policy: filter, reweight, or resample before selecting.</p>
  </div>

  <!-- Strategy Families -->
  <div class="grid md:grid-cols-3 gap-4">
    <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
      <h5 class="font-medium text-green-900 mb-1">1. Deterministic / Search</h5>
      <ul class="text-xs text-green-800 space-y-1">
        <li><b>Greedy:</b> \(\arg\max_i p_i\)</li>
        <li><b>Beam:</b> Keep top <code>B</code> partial sequences</li>
        <li><b>Diverse Beam:</b> Penalize similar beams</li>
        <li><b>Pros:</b> Stable, reproducible</li>
        <li><b>Cons:</b> Can collapse / lack creativity</li>
      </ul>
    </div>
    <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
      <h5 class="font-medium text-purple-900 mb-1">2. Probabilistic Sampling</h5>
      <ul class="text-xs text-purple-800 space-y-1">
        <li><b>Top-k:</b> Truncate to highest <code>k</code></li>
        <li><b>Nucleus (Top-p):</b> Smallest set with cumulative \(\ge p\)</li>
        <li><b>Typical:</b> Focus near entropy band</li>
        <li><b>Temperature:</b> Scale logits: \(z_i/T\)</li>
        <li><b>Pros:</b> Diversity & controllable randomness</li>
      </ul>
    </div>
    <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
      <h5 class="font-medium text-orange-900 mb-1">3. Advanced / Controlled</h5>
      <ul class="text-xs text-orange-800 space-y-1">
        <li><b>Contrastive:</b> Large − \(\lambda\)·small model</li>
        <li><b>Speculative:</b> Draft + verify (speed)</li>
        <li><b>Mirostat:</b> Target entropy adaptively</li>
        <li><b>Constraints:</b> Grammar / JSON / regex</li>
        <li><b>Penalties:</b> Repetition / presence / freq</li>
      </ul>
    </div>
  </div>

  <!-- Why This Matters (match Q1 styling) -->
  <div class="bg-yellow-50 p-4 rounded-lg">
    <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
    <ul class="text-sm text-yellow-800 space-y-1">
      <li><strong>Product fit:</strong> Deterministic for support; sampling for creativity</li>
      <li><strong>Quality vs speed:</strong> Beam ↑ quality; speculative ↓ latency</li>
      <li><strong>Safety & structure:</strong> Constrained decoding enforces valid outputs</li>
      <li><strong>Cost:</strong> Efficient strategies reduce wasted tokens</li>
    </ul>
  </div>

  <!-- Mathematical Snippets -->
  <div class="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
    <h4 class="font-semibold text-gray-900">📐 Strategy Mechanics</h4>
    <div class="grid md:grid-cols-2 gap-4 text-xs text-gray-700">
      <div>
        <div class="font-medium mb-1">Top-k Filtering</div>
        <div class="math-display">$$ S_k = \\operatorname{arg\\;topk}_i(p_i), \quad p'_i = \\frac{p_i \\mathbf{1}[i \in S_k]}{\\sum_{j \in S_k} p_j} $$</div>
      </div>
      <div>
        <div class="font-medium mb-1">Nucleus (Top-p)</div>
        <div class="math-display">$$ \\text{Sort desc} \\rightarrow \\text{take smallest } S_p: \\sum_{i \\in S_p} p_i \\ge p $$</div>
      </div>
      <div>
        <div class="font-medium mb-1">Typical Sampling</div>
        <div class="math-display">$$ H = -\\sum_i p_i \\log p_i, \\quad S_{\\tau}=\\{ i : | -\\log p_i - H | \\text{ small} \\} $$</div>
      </div>
      <div>
        <div class="font-medium mb-1">Temperature</div>
        <div class="math-display">$$ p_i(T) = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}} $$</div>
      </div>
    </div>
    <p class="text-xs text-gray-600">Contrastive: maximize \(p_{\text{large}} - \lambda p_{\text{small}}\); Mirostat dynamically tunes effective temperature to keep surprise near target.</p>
  </div>
</div>
`,
  interactive: {
    title: "🧪 Compare Decoding Strategies",
    html: `
<div class="space-y-6" id="q53-root">
  <!-- Inputs -->
  <div class="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 space-y-4">
    <div class="rounded-md bg-white/70 border border-indigo-200 p-3 text-[11px] leading-relaxed">
      <div class="font-semibold text-indigo-800 text-xs mb-1">How to use</div>
      <ol class="list-decimal ml-4 space-y-1 text-indigo-900">
        <li>Edit or keep the logits vector (raw scores).</li>
        <li>Adjust <b>Temperature</b> to sharpen (T&lt;1) or flatten (T&gt;1) the base distribution.</li>
        <li>Select a strategy radio (Greedy / Top-k / Nucleus / Typical).</li>
        <li>For Top-k move the slider to limit candidate set size; for Top-p set cumulative probability; for Typical set τ (coverage over entropy band).</li>
        <li>Click <b>Sample</b> to draw; highlighted rows show candidate tokens considered.</li>
      </ol>
      <div class="text-[10px] text-indigo-700 mt-2">Greedy is deterministic; stochastic methods resample each click. Typical sampling trims both low-prob tail <em>and</em> overly predictable tokens.</div>
    </div>
    <div class="flex flex-wrap gap-3 items-end">
      <div class="flex-1 min-w-[260px]">
        <label class="block text-xs font-medium text-gray-600 mb-1" for="q53-logits">Example Logit Pattern</label>
        <select id="q53-logits" class="w-full text-sm px-3 py-2 border rounded-md bg-white">
          <option value="3.2,2.8,1.4,0.2,-1.0" selected>Moderately peaked</option>
          <option value="2.5,2.4,2.3,0.1,-0.5">Near tie triple</option>
          <option value="5.0,1.2,0.5,-0.3,-1.0">Strong single winner</option>
          <option value="0.3,0.2,0.1,0.0,-0.1">Almost flat</option>
          <option value="4.0,0.0,-1.0,-3.0,-6.0">High contrast spread</option>
          <option value="2.0,1.0,0.0,-1.0,-2.0">Linear decay</option>
          <option value="1.5,1.5,-0.2,-0.8,-1.2">Exact tie pair</option>
          <option value="7.0,1.0,0.8,0.2,-2.0">Extreme outlier</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1" for="q53-temp">Temperature</label>
        <input id="q53-temp" type="range" min="0.2" max="1.8" step="0.1" value="1.0" class="w-40" />
        <div class="text-[10px] text-gray-500 text-center"><span id="q53-temp-val">1.0</span></div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1" for="q53-topk">Top-k</label>
        <input id="q53-topk" type="range" min="1" max="10" step="1" value="3" class="w-36" />
        <div class="text-[10px] text-gray-500 text-center"><span id="q53-topk-val">3</span></div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1" for="q53-topp">Top-p</label>
        <input id="q53-topp" type="range" min="0.5" max="0.99" step="0.01" value="0.9" class="w-36" />
        <div class="text-[10px] text-gray-500 text-center"><span id="q53-topp-val">0.90</span></div>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1" for="q53-typical">Typical τ</label>
        <input id="q53-typical" type="range" min="0.5" max="1.8" step="0.1" value="1.0" class="w-36" />
        <div class="text-[10px] text-gray-500 text-center"><span id="q53-typical-val">1.0</span></div>
      </div>
    </div>
    <div class="flex flex-wrap gap-3 items-center text-xs">
      <label class="flex items-center gap-1"><input type="radio" name="q53-mode" value="greedy" checked /> Greedy</label>
      <label class="flex items-center gap-1"><input type="radio" name="q53-mode" value="topk" /> Top-k</label>
      <label class="flex items-center gap-1"><input type="radio" name="q53-mode" value="topp" /> Nucleus</label>
      <label class="flex items-center gap-1"><input type="radio" name="q53-mode" value="typical" /> Typical</label>
      <button id="q53-sample" class="ml-auto px-3 py-1.5 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700">Sample</button>
      <button id="q53-reset" class="px-3 py-1.5 text-xs rounded border bg-white hover:bg-gray-50">Reset</button>
    </div>
  </div>

  <!-- Distribution View -->
  <div class="grid md:grid-cols-2 gap-6">
    <div class="space-y-3">
      <h5 class="font-semibold text-gray-800 text-sm">Token Probabilities</h5>
      <div id="q53-table" class="space-y-1 text-xs font-mono"></div>
    </div>
    <div class="space-y-3">
      <h5 class="font-semibold text-gray-800 text-sm">Result & Explanation</h5>
      <div id="q53-result" class="p-3 rounded-lg border bg-white text-sm">—</div>
      <div id="q53-explain" class="text-xs text-gray-600 leading-relaxed"></div>
    </div>
  </div>
</div>
`,
    script: () => {
      const $ = id => document.getElementById(id);
  const logitsSelect = $("q53-logits");
      const temp = $("q53-temp");
      const topk = $("q53-topk");
      const topp = $("q53-topp");
      const typical = $("q53-typical");
      const table = $("q53-table");
      const resultBox = $("q53-result");
      const explain = $("q53-explain");
  if(!logitsSelect||!temp||!topk||!topp||!typical||!table) return;

      const tempVal = $("q53-temp-val");
      const topkVal = $("q53-topk-val");
      const toppVal = $("q53-topp-val");
      const typicalVal = $("q53-typical-val");

      function parseLogits(){
        return logitsSelect.value.split(/[\,\s]+/).filter(Boolean).map(Number).filter(v=>Number.isFinite(v));
      }
      function softmax(arr, T){
        const m = Math.max(...arr);
        const exps = arr.map(z=>Math.exp((z - m)/T));
        const s = exps.reduce((a,b)=>a+b,0);
        return exps.map(e=>e/s);
      }
      function entropy(p){ return -p.reduce((a,b)=> a + (b>0 ? b*Math.log(b):0),0); }

      function choose(p){
        const r = Math.random();
        let c=0; for(let i=0;i<p.length;i++){ c+=p[i]; if(r<=c) return i; }
        return p.length-1;
      }

      function fmt(x){ return (x>=0?"":"") + x.toFixed(3); }
      function pct(x){ return (x*100).toFixed(1)+"%"; }

      function compute(){
        // Update inline display values
        tempVal.textContent = Number(temp.value).toFixed(1);
        topkVal.textContent = topk.value;
        toppVal.textContent = Number(topp.value).toFixed(2);
        typicalVal.textContent = Number(typical.value).toFixed(1);
        const raw = parseLogits();
        if(raw.length===0){ table.innerHTML='<div class="text-red-600">Enter at least one numeric logit.</div>'; return {raw, probs:[]}; }
        const T = Number(temp.value);
        const probs = softmax(raw, T);
        renderTable(raw, probs, []);
        return { raw, probs };
      }

      function renderTable(raw, probs, highlight){
        const max = Math.max(...probs, 0.000001);
        const header = `<table class="w-full text-[11px] border-separate border-spacing-y-1"><thead>
          <tr class="text-gray-600 font-semibold">
            <th class="px-2 text-left">#</th>
            <th class="px-2 text-right">Logit</th>
            <th class="px-2 text-right">p</th>
            <th class="px-2 text-left w-[140px]">Distribution</th>
          </tr></thead><tbody>`;
        const rows = raw.map((z,i)=>{
          const p = probs[i];
          const bar = Math.round((p/max)*100);
          const hl = highlight.includes(i);
          const rowCls = hl? 'bg-indigo-50 border border-indigo-200 shadow-sm' : 'bg-white border border-gray-100';
          const probTxt = pct(p);
          return `<tr class="${rowCls} hover:bg-gray-50 transition-colors">
            <td class="px-2 py-1 font-mono text-xs ${hl?'font-bold text-indigo-700':''}">${i}</td>
            <td class="px-2 py-1 text-right font-mono text-gray-600">${fmt(z)}</td>
            <td class="px-2 py-1 text-right font-mono ${hl?'font-semibold text-indigo-700':''}">${probTxt}</td>
            <td class="px-2 py-1">
              <div class="relative h-4 bg-gray-200/70 rounded overflow-hidden">
                <div class="absolute inset-y-0 left-0 ${hl?'bg-indigo-600':'bg-gray-500'}" style="width:${bar}%"></div>
                <div class="absolute inset-0 flex items-center pl-1 text-[10px] font-mono text-gray-800 mix-blend-plus-lighter">${bar>20?probTxt:''}</div>
              </div>
            </td>
          </tr>`;
        }).join('');
        const footer = `</tbody></table>
          <div class="text-[10px] text-gray-500 mt-2 flex flex-wrap gap-3">
            <span><span class="inline-block w-3 h-3 bg-indigo-600 rounded-sm mr-1"></span>Candidate set</span>
            <span>Bars scaled to max p</span>
          </div>`;
        table.innerHTML = header + rows + footer;
      }

      function strategyExplain(mode, meta){
        switch(mode){
          case 'greedy': return 'Greedy picks the argmax token — deterministic, fastest, but least diverse.';
          case 'topk': return `Top-k keeps the ${meta?.k||''} highest probability tokens then samples — truncates the tail.`;
          case 'topp': return `Nucleus keeps the smallest prefix whose cumulative probability ≥ ${(meta?.p||0).toFixed(2)} — adaptive set size.`;
          case 'typical': return `Typical sampling keeps tokens with information content near entropy H ≈ ${meta?.H?.toFixed(3)} — removes both very predictable and extremely rare tokens.`;
          default: return '';
        }
      }

      function applyStrategy(mode, raw, probs){
        let candidateIdx = [];
        let sampled = null;
        if(!probs.length) return;
        if(mode==='greedy'){
          const m = probs.indexOf(Math.max(...probs));
          candidateIdx=[m]; sampled=m;
        } else if(mode==='topk'){
          const k = Math.min(Number(topk.value), probs.length);
          const sorted = probs.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]).slice(0,k);
          candidateIdx = sorted.map(x=>x[1]);
          const restricted = candidateIdx.map(i=>probs[i]);
          const s = restricted.reduce((a,b)=>a+b,0);
          const norm = restricted.map(v=>v/s);
          const pickLocal = choose(norm);
            sampled = candidateIdx[pickLocal];
        } else if(mode==='topp'){
          const pTarget = Number(topp.value);
          const sorted = probs.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]);
          let cum=0; for(const [p,i] of sorted){ cum+=p; candidateIdx.push(i); if(cum>=pTarget) break; }
          const restricted = candidateIdx.map(i=>probs[i]);
          const s = restricted.reduce((a,b)=>a+b,0);
          const norm = restricted.map(v=>v/s);
          sampled = candidateIdx[choose(norm)];
        } else if(mode==='typical'){
          const tau = Number(typical.value);
          const H = entropy(probs);
          const info = probs.map(p=>Math.abs(-Math.log(p) - H));
          const pairs = info.map((d,i)=>[d,i]).sort((a,b)=>a[0]-b[0]);
          let acc=0; candidateIdx=[];
          for(const [d,i] of pairs){
            candidateIdx.push(i); acc += probs[i]; if(acc >= tau) break;
          }
          const restricted = candidateIdx.map(i=>probs[i]);
          const s = restricted.reduce((a,b)=>a+b,0);
          const norm = restricted.map(v=>v/s);
          sampled = candidateIdx[choose(norm)];
          return { candidateIdx, sampled, meta:{ H } };
        }
        return { candidateIdx, sampled, meta:{} };
      }

      function run(){
        const { raw, probs } = compute();
        const mode = (document.querySelector('input[name="q53-mode"]:checked')||{}).value;
        const out = applyStrategy(mode, raw, probs) || {candidateIdx:[], sampled:null, meta:{}};
        renderTable(raw, probs, out.candidateIdx);
        if(out.sampled!=null){
          resultBox.innerHTML = `<div><b>Chosen token index:</b> <span class="text-indigo-700 font-mono">${out.sampled}</span></div>`;
        } else {
          resultBox.textContent='—';
        }
        explain.textContent = strategyExplain(mode, {...out.meta, k:Number(topk.value), p:Number(topp.value)});
      }

      // Events
  [logitsSelect,temp,topk,topp,typical].forEach(el=> el.addEventListener('input', ()=> run()));
      document.querySelectorAll('input[name="q53-mode"]').forEach(r=> r.addEventListener('change', ()=> run()));
      $("q53-sample")?.addEventListener('click', e=>{ e.preventDefault(); run(); });
  $("q53-reset")?.addEventListener('click', ()=>{ logitsSelect.selectedIndex=0; temp.value='1.0'; topk.value='3'; topp.value='0.9'; typical.value='1.0'; run(); });

      run();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
