// Question 54: What are logits and why do LLMs output them instead of probabilities?
// Created: 2025-09-10
// Focus: Definition, invariances, numerical stability, transformations (temperature, bias), connection to loss

const question = {
  title: "54. What are logits, and why don't LLMs output probabilities directly?",
  answer: `
<div class="space-y-4">
  <!-- Recommended Reading (related) -->
  <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
    <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
    <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
      <li><a href="#question-05" class="text-indigo-700 underline hover:text-indigo-900">Question 5: How does beam search improve text generation compared to greedy decoding?</a></li>
      <li><a href="#question-06" class="text-indigo-700 underline hover:text-indigo-900">Question 6: What is temperature in text generation and how does it affect output?</a></li>
      <li><a href="#question-12" class="text-indigo-700 underline hover:text-indigo-900">Question 12: How do top-k and top-p sampling differ in text generation?</a></li>
      <li><a href="#question-23" class="text-indigo-700 underline hover:text-indigo-900">Question 23: How is the softmax function applied in attention mechanisms?</a></li>
      <li><a href="#question-25" class="text-indigo-700 underline hover:text-indigo-900">Question 25: Why is cross-entropy loss used in language modeling?</a></li>
      <li><a href="#question-53" class="text-indigo-700 underline hover:text-indigo-900">Question 53: What are decoding strategies for selecting output tokens?</a></li>
    </ul>
  </div>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-5">
    <h3 class="font-semibold text-blue-900 mb-2">🧩 Core Idea: Logits = Unnormalized Preference Scores</h3>
  <p class="text-sm text-blue-800 leading-relaxed">A <strong>logit</strong> is a raw, unnormalized score the model assigns to each candidate next token. Apply softmax once at the end to convert the vector of logits \\(\\mathbf{z}\\) into a probability distribution \\(p\\). Until then, they are flexible for adjustments (temperature, biasing, masking).</p>
  <div class="math-display">$$ p_i = \\operatorname{softmax}(z)_i = \\frac{e^{z_i}}{\\sum_j e^{z_j}} $$</div>
    <p class="text-xs text-blue-700">LLMs emit logits because they are numerically stable, differentiable raw scores that preserve linear transformations until the final normalization.</p>
  </div>

  <!-- Invariance & Intuition -->
  <div class="grid md:grid-cols-3 gap-4">
    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-semibold text-green-900 mb-1">1. Invariance</h4>
      <ul class="text-xs text-green-800 space-y-1">
  <li><b>Shift:</b> Adding constant \\(c\\) to all logits leaves softmax unchanged.</li>
  <li><b>Why:</b> Common trick: subtract \\(\\max_i z_i\\) for stability.</li>
        <li><b>Implication:</b> Only differences matter.</li>
      </ul>
    </div>
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h4 class="font-semibold text-purple-900 mb-1">2. Scaling & Sharpness</h4>
      <ul class="text-xs text-purple-800 space-y-1">
  <li><b>Multiply by \\(\\alpha>1\\):</b> Distribution becomes sharper.</li>
  <li><b>Divide (Temperature):</b> \\(T>1\\) flattens; \\(T<1\\) sharpens.</li>
        <li><b>Entropy:</b> Controlled by relative gaps.</li>
      </ul>
    </div>
    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h4 class="font-semibold text-orange-900 mb-1">3. Masking & Bias</h4>
      <ul class="text-xs text-orange-800 space-y-1">
  <li><b>Mask:</b> Set disallowed logits to \\(-\\infty\\) (or large negative).</li>
  <li><b>Bias:</b> Add \\(b_t\\) to specific token logits to encourage them.</li>
        <li><b>Sampling ops:</b> Modify logits <em>before</em> softmax.</li>
      </ul>
    </div>
  </div>

  <!-- Why Not Direct Probabilities? -->
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
    <h4 class="font-semibold text-yellow-900 mb-2">🧭 Why Not Output Probabilities Directly?</h4>
    <ul class="text-sm text-yellow-800 space-y-1">
      <li><b>Numerical stability:</b> Softmax + cross-entropy fused with log-sum-exp trick.</li>
      <li><b>Training efficiency:</b> Logits feed directly into loss without early normalization.</li>
      <li><b>Flexibility:</b> Easy to apply temperature, penalties, constraints.</li>
      <li><b>Gradient quality:</b> Raw linear outputs avoid saturation pre-softmax.</li>
    </ul>
  </div>

  <!-- Mathematical Mechanics -->
  <div class="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
    <h4 class="font-semibold text-gray-900">📐 Key Formulas</h4>
    <div class="grid md:grid-cols-2 gap-4 text-xs text-gray-700">
      <div>
        <div class="font-medium mb-1">Shift Invariance</div>
    <div class="math-display">$$ \\operatorname{softmax}(z)_i = \\operatorname{softmax}(z + c\\mathbf{1})_i $$</div>
      </div>
      <div>
        <div class="font-medium mb-1">Stability Trick</div>
    <div class="math-display">$$ p_i = \\frac{e^{z_i - m}}{\\sum_j e^{z_j - m}},\\; m = \\max_j z_j $$</div>
      </div>
      <div>
        <div class="font-medium mb-1">Temperature</div>
    <div class="math-display">$$ p_i(T) = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}} $$</div>
      </div>
      <div>
        <div class="font-medium mb-1">Cross-Entropy Link</div>
    <div class="math-display">$$ L = -\\log p_{y} = -z_{y} + \\log \\sum_j e^{z_j} $$</div>
      </div>
    </div>
  <p class="text-xs text-gray-600">Gradients: \\( \\frac{\\partial L}{\\partial z_i} = p_i - \\mathbf{1}[i=y] \\). Clean and stable because we keep logits unnormalized until loss evaluation.</p>
  </div>
</div>
`,
  interactive: {
    title: "🧪 Logit Lab: Shift, Scale, Bias",
    html: `
<div class=\"space-y-6\" id=\"q54-root\">
  <div class=\"p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 space-y-4\">
    <div class=\"flex flex-wrap gap-4 items-end\">
      <div class=\"flex-1 min-w-[260px]\">
        <label class=\"block text-xs font-medium text-gray-600 mb-1\" for=\"q54-logits-select\">Example Logit Pattern</label>
        <select id=\"q54-logits-select\" class=\"w-full text-sm px-3 py-2 border rounded-md bg-white\">
          <option value=\"5.0,1.2,0.5,-0.3,-1.0\">Peaked: one clear winner</option>
          <option value=\"2.2,2.1,0.0,-0.5,-1.5\" selected>Two-way competition</option>
          <option value=\"0.2,0.1,0.0,-0.1,-0.2\">Flat / almost uniform</option>
          <option value=\"3.0,2.0,1.0,0.0,-2.5\">Long tail decay</option>
          <option value=\"-0.5,-0.7,-1.2,-2.0,-3.5\">All moderately low</option>
          <option value=\"4.0,0.0,-1.0,-3.0,-6.0\">Wide spread / high contrast</option>
            <option value="2.0,1.95,1.90,0.0,-1.5">Near-tie triple</option>
            <option value="7.0,1.0,0.8,0.2,-2.0">Extreme outlier</option>
            <option value="3.5,-0.2,-0.3,-0.4,-0.5">One positive rest negative</option>
            <option value="1.5,1.5,-0.2,-0.8,-1.2">Exact tie pair</option>
            <option value="4.0,3.9,-2.0,-2.1,-2.2">Dual peak, suppressed tail</option>
        </select>
      </div>
      <div>
        <label class=\"block text-xs font-medium text-gray-600 mb-1\" for=\"q54-shift\">Add Constant (shift)</label>
        <input id=\"q54-shift\" type=\"range\" min=\"-5\" max=\"5\" step=\"0.5\" value=\"0\" class=\"w-44\" />
        <div class=\"text-[10px] text-center text-gray-500\"><span id=\"q54-shift-val\">0.0</span></div>
      </div>
      <div>
        <label class=\"block text-xs font-medium text-gray-600 mb-1\" for=\"q54-scale\">Scale (×)</label>
        <input id=\"q54-scale\" type=\"range\" min=\"0.25\" max=\"3\" step=\"0.05\" value=\"1\" class=\"w-44\" />
        <div class=\"text-[10px] text-center text-gray-500\"><span id=\"q54-scale-val\">1.00</span></div>
      </div>
      <div>
        <label class=\"block text-xs font-medium text-gray-600 mb-1\" for=\"q54-temp\">Temperature (T)</label>
        <input id=\"q54-temp\" type=\"range\" min=\"0.4\" max=\"2.0\" step=\"0.1\" value=\"1\" class=\"w-44\" />
        <div class=\"text-[10px] text-center text-gray-500\"><span id=\"q54-temp-val\">1.0</span></div>
      </div>
      <div>
        <label class=\"block text-xs font-medium text-gray-600 mb-1\" for=\"q54-bias-index\">Bias Token Index</label>
        <select id=\"q54-bias-index\" class=\"w-28 text-sm px-2 py-1 border rounded-md bg-white\"></select>
      </div>
      <div>
        <label class=\"block text-xs font-medium text-gray-600 mb-1\" for=\"q54-bias-size\">Bias (+)</label>
        <input id=\"q54-bias-size\" type=\"range\" min=\"0\" max=\"5\" step=\"0.25\" value=\"0\" class=\"w-40\" />
        <div class=\"text-[10px] text-center text-gray-500\"><span id=\"q54-bias-size-val\">0.00</span></div>
      </div>
    </div>
    <div class=\"flex flex-wrap gap-3 text-xs items-center\">
  <button id=\"q54-reset\" class=\"px-3 py-1.5 rounded border bg-white hover:bg-gray-50\">Reset</button>
  <button id=\"q54-random\" class=\"px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700\">Random logits</button>
    </div>
  </div>
  <div class=\"grid md:grid-cols-2 gap-6\">
    <div class=\"space-y-3\">
      <h5 class=\"font-semibold text-gray-800 text-sm\">Logits → Probabilities</h5>
      <div id=\"q54-table\" class=\"space-y-1 text-xs font-mono\"></div>
    </div>
    <div class=\"space-y-3\">
      <h5 class=\"font-semibold text-gray-800 text-sm\">Insights</h5>
      <div id=\"q54-insight\" class=\"p-3 rounded-lg border bg-white text-xs leading-relaxed\">—</div>
      <div id=\"q54-math\" class=\"text-[11px] text-gray-600\"></div>
    </div>
  </div>
</div>
`,
    script: () => {
      const $ = id => document.getElementById(id);
      const logitsSelect = $("q54-logits-select");
      const shift = $("q54-shift");
      const scale = $("q54-scale");
      const temp = $("q54-temp");
      const biasIndex = $("q54-bias-index");
      const biasSize = $("q54-bias-size");
      const table = $("q54-table");
      const insight = $("q54-insight");
      const mathBox = $("q54-math");
  const help = $("q54-help"); // static help panel
      if(!logitsSelect||!shift||!scale||!temp||!biasIndex||!biasSize||!table) return;

  const shiftVal = $("q54-shift-val");
  const scaleVal = $("q54-scale-val");
  const tempVal = $("q54-temp-val");
  const biasSizeVal = $("q54-bias-size-val");
  // Help panel is static; no toggle logic
      function parse(){
        return logitsSelect.value.split(/[\s,]+/).filter(Boolean).map(Number).filter(v=>Number.isFinite(v));
      }
      function softmax(arr){
        if(!arr.length) return [];
        const m = Math.max(...arr);
        const exps = arr.map(z=>Math.exp(z-m));
        const s = exps.reduce((a,b)=>a+b,0);
        return exps.map(e=>e/s);
      }
      function entropy(p){ return -p.reduce((a,b)=> a + (b>0? b*Math.log2(b):0),0); }

      function ensureBiasOptions(base){
        if(!biasIndex) return;
        const current = parseInt(biasIndex.value,10);
        const len = base.length;
        // Always rebuild so labels reflect current base logits
        biasIndex.innerHTML = base.map((v,i)=>`<option value="${i}">Token ${i} (${v.toFixed(2)})</option>`).join('');
        if(isNaN(current) || current >= len){
          biasIndex.value = '0';
        } else {
          biasIndex.value = String(current);
        }
      }

      function recompute(){
        shiftVal.textContent = Number(shift.value).toFixed(1);
        scaleVal.textContent = Number(scale.value).toFixed(2);
        tempVal.textContent = Number(temp.value).toFixed(1);
        biasSizeVal.textContent = Number(biasSize.value).toFixed(2);
        const base = parse();
        if(!base.length){ table.innerHTML='<div class="text-red-600">Enter logits.</div>'; return; }
        ensureBiasOptions(base);
        const bi = Math.min(Math.max(parseInt(biasIndex.value,10)||0,0), base.length-1);
        const biased = base.map((z,i)=> (i===bi ? z + Number(biasSize.value): z));
        const transformed = biased.map(z=> (z + Number(shift.value)) * Number(scale.value) / Number(temp.value));
        // Baseline (no bias) for delta comparison
        const transformedNoBias = base.map(z=> (z + Number(shift.value)) * Number(scale.value) / Number(temp.value));
        const probs = softmax(transformed);
        const probsNoBias = softmax(transformedNoBias);
        const H = entropy(probs);
        const maxP = Math.max(...probs);
        const winner = probs.indexOf(maxP);
        renderTable(base, biased, transformed, probs, probsNoBias, winner, bi);
        const deltaWinner = ((probs[winner]-probsNoBias[winner])*100).toFixed(2);
        mathBox.innerHTML = `Shift adds c to all logits (no effect after softmax); scale / temperature modify gaps; bias locally raises a token; final normalization ensures ∑p=1.`;
        const isBiasWinner = bi === winner;
        const biasP = (probs[bi]*100).toFixed(2);
        const biasDelta = ((probs[bi]-probsNoBias[bi])*100).toFixed(2);
        insight.innerHTML = `
          <div><b>Winner:</b> <span class="font-mono ${isBiasWinner?'text-blue-700 font-semibold':''}">${winner}</span> (p=${(maxP*100).toFixed(1)}%)</div>
          <div><b>Entropy:</b> ${H.toFixed(3)} bits</div>
          <div><b>Bias target:</b> <span class="font-mono">${bi}</span> (p=${biasP}% Δ=${biasDelta}%)</div>
          <div><b>Δp (winner vs baseline):</b> ${deltaWinner}%</div>
        `;
      }

      // (Removed obsolete collapsible help logic)

      function renderTable(base, biased, transformed, probs, probsNoBias, winner, biasedIndex){
        const maxP = Math.max(...probs) || 1;
        const header = `<table class="w-full text-[11px] border-separate border-spacing-y-1"><thead>
            <tr class="text-gray-600 font-semibold">
              <th class="text-left px-2">#</th>
              <th class="text-right px-2">Base</th>
              <th class="text-right px-2">Biased</th>
              <th class="text-right px-2">Transformed</th>
              <th class="text-right px-2">p</th>
              <th class="text-right px-2">Δp</th>
              <th class="text-left px-2 w-[140px]">Distribution</th>
            </tr></thead><tbody>`;
        const rows = base.map((b,i)=>{
          const p = probs[i];
          const dp = (p - (probsNoBias[i]||0));
          const bar = Math.round((p/maxP)*100);
          const isWinner = i===winner;
          const changed = biased[i] !== b;
          const rowCls = isWinner ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'bg-white border border-gray-100';
          const probTxt = (p*100).toFixed(1)+'%';
          const deltaTxt = (dp*100).toFixed(2)+'%';
          const deltaCls = dp>0.0001? 'text-green-600' : (dp<-0.0001? 'text-rose-600':'text-gray-400');
          return `<tr class="${rowCls} hover:bg-gray-50 transition-colors">
              <td class="px-2 py-1 font-mono text-xs ${isWinner?'font-bold text-blue-700':''}">${i}</td>
              <td class="px-2 py-1 text-right font-mono">${b.toFixed(2)}</td>
              <td class="px-2 py-1 text-right font-mono ${changed?'text-indigo-600 font-semibold':''}" title="${changed?'+ bias applied':''}">${biased[i].toFixed(2)}</td>
              <td class="px-2 py-1 text-right font-mono">${transformed[i].toFixed(2)}</td>
              <td class="px-2 py-1 text-right font-mono ${isWinner?'font-bold text-blue-700':''}">${probTxt}</td>
              <td class="px-2 py-1 text-right font-mono ${deltaCls}">${deltaTxt}</td>
              <td class="px-2 py-1">
                <div class="relative h-4 bg-gray-200/70 rounded overflow-hidden">
                  <div class="absolute inset-y-0 left-0 ${isWinner?'bg-blue-600':'bg-gray-500'}" style="width:${bar}%"></div>
                  <div class="absolute inset-0 flex items-center pl-1 text-[10px] font-mono text-gray-800 mix-blend-plus-lighter">${bar>18?probTxt:''}</div>
                </div>
              </td>
            </tr>`;
        }).join('');
        const footer = `</tbody></table>
          <div class="text-[10px] text-gray-500 mt-2 flex flex-wrap gap-3">
            <span><span class="inline-block w-3 h-3 bg-blue-600 rounded-sm align-middle mr-1"></span>Winner</span>
            <span><span class="inline-block w-3 h-3 bg-indigo-600 rounded-sm align-middle mr-1"></span>Bias affected</span>
            <span>Transformed = (biased + shift) * scale / T</span>
            <span>Δp = change vs no-bias baseline</span>
          </div>`;
        table.innerHTML = header + rows + footer;
      }

      [logitsSelect, shift, scale, temp, biasIndex, biasSize].forEach(el=> { el.addEventListener('input', recompute); el.addEventListener('change', recompute); });
      $("q54-reset")?.addEventListener('click', ()=>{ logitsSelect.selectedIndex=1; shift.value='0'; scale.value='1'; temp.value='1'; biasIndex.value='0'; biasSize.value='0'; recompute(); });
      $("q54-random")?.addEventListener('click', ()=>{ const n=5+Math.floor(Math.random()*3); const arr = Array.from({length:n},()=> (Math.random()*4-2).toFixed(1)); const opt=document.createElement('option'); opt.textContent='Random: '+arr.join(','); opt.value=arr.join(','); logitsSelect.appendChild(opt); logitsSelect.selectedIndex=logitsSelect.options.length-1; recompute(); });

      recompute();
    }
  }
};

if (typeof module !== 'undefined') { module.exports = question; }
