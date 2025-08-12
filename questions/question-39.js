// Question 39: How do discriminative and generative AI models differ?
// Created: August 12, 2025
// Educational Focus: Contrast P(y|x) vs P(x)/P(x,y), practical intuition, tiny hands-on demo

const question = {
  title: "39. How do discriminative and generative AI models differ?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">🔤 Key Idea</h4>
        <p class="text-sm text-blue-800">
          <b>Discriminative</b> models learn the decision rule
          \\(P(y\\mid x)\\) to predict labels given features (e.g., logistic regression, fine‑tuned BERT).
          <b>Generative</b> models learn how data is produced, modeling \\(P(x)\\) or \\(P(x,y)\\),
          so they can <i>sample</i> new examples (e.g., GPT).
        </p>
        <div class="math-display text-sm">
          $$\\text{Discriminative: } \\; \\hat{y} = \\arg\\max_y \\, P(y\\mid x) \\qquad\\quad
          \\text{Generative: } \\; P(x) \\text{ or }\\; P(x,y) = P(y\\mid x)P(x)$$
        </div>
        <p class="text-xs text-blue-700">Rule of thumb: Discriminative = best boundaries for labeling; Generative = learn the data distribution to generate or reason with missing parts.</p>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 Discriminative</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• Models \(P(y\mid x)\)</li>
            <li>• Great for classification and ranking</li>
            <li>• Often simpler, faster at inference</li>
            <li>• Examples: Logistic Reg., SVM, fine‑tuned encoder</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Generative</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Models \(P(x)\) or \(P(x,y)\)</li>
            <li>• Can sample and synthesize new data</li>
            <li>• Useful for imputation, simulation, few‑shot tasks</li>
            <li>• Examples: GPT, diffusion models, VAEs</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 Hybrid patterns</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• Discriminative heads on generative backbones</li>
            <li>• Prompting LLMs for classification</li>
            <li>• Energy‑based and classifier‑guided generation</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• Choose the right tool: label vs. synthesize vs. reason.</li>
          <li>• Understand cost/latency: discriminative is often lighter.</li>
          <li>• Generative models enable data augmentation and interactive agents.</li>
          <li>• Many modern systems blend both for best results.</li>
        </ul>
      </div>

      <!-- Tiny code hints -->
      <div class="bg-white p-4 rounded border text-xs">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <div class="font-semibold mb-1">Discriminative (logistic):</div>
            <code>p = sigmoid(w·x + b)  // estimates P(y=1 | x)</code>
          </div>
          <div>
            <div class="font-semibold mb-1">Generative (LM sampling):</div>
            <code>for t in 1..T: x[t] ~ softmax( logits(x[&lt;t]) / T )</code>
          </div>
        </div>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Discriminative vs Generative mini‑lab",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-indigo-50 to-cyan-50 p-4 rounded-lg border border-indigo-200\">
          <div class=\"grid md:grid-cols-4 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\">Mode</label>
              <select id=\"q39-mode\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"disc\">Discriminative: Sentiment</option>
                <option value=\"gen\">Generative: Next‑word LM</option>
              </select>
            </div>
            <div class=\"md:col-span-2\">
              <label class=\"font-semibold text-gray-700\">Example text</label>
              <select id=\"q39-text\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"I love this movie\" selected>I love this movie</option>
                <option value=\"This movie was bad\">This movie was bad</option>
                <option value=\"The weather is nice today\">The weather is nice today</option>
                <option value=\"I hate boring movies\">I hate boring movies</option>
                <option value=\"This pizza is amazing\">This pizza is amazing</option>
                <option value=\"Music is fun\">Music is fun</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Temperature (gen)</label>
              <input id=\"q39-temp\" type=\"range\" min=\"0.1\" max=\"1.5\" step=\"0.1\" value=\"0.8\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q39-temp-val\" class=\"font-mono\">0.8</span></div>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\">Discriminative estimates \\(P(y\\mid x)\\) for labeling. Generative samples from \\(P(x)\\) to continue text. <b>Temperature affects only Generative mode.</b></p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📌 Model View</h5>
            <div id=\"q39-model\" class=\"text-xs text-gray-700\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q39-metrics\" class=\"text-xs text-gray-700\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🗣️ Output</h5>
            <div id=\"q39-output\" class=\"text-sm text-gray-800 whitespace-pre-wrap\"></div>
          </div>
        </div>

        <div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-4\">
          <h5 class=\"font-semibold text-indigo-900 mb-1\">🔎 Explanation</h5>
          <div id=\"q39-explain\" class=\"text-xs text-indigo-800\"></div>
        </div>
      </div>
    `,
    script: () => {
      const modeEl = document.getElementById('q39-mode');
      const textEl = document.getElementById('q39-text');
      const tempEl = document.getElementById('q39-temp');
      const tempVal = document.getElementById('q39-temp-val');
      const modelEl = document.getElementById('q39-model');
      const metricsEl = document.getElementById('q39-metrics');
      const outputEl = document.getElementById('q39-output');
      const explainEl = document.getElementById('q39-explain');
      if (!modeEl) return;

      // Tiny sentiment lexicon
      const POS = ['good','great','love','nice','happy','excellent','amazing','cool','fun','win','awesome'];
      const NEG = ['bad','terrible','hate','sad','angry','awful','boring','lose','worse','worst'];

      // Tiny corpus for bigram LM
      const corpus = [
        'i love this movie',
        'i love pizza',
        'this movie is great',
        'the weather is nice today',
        'the movie was bad',
        'i feel happy today',
        'i feel sad today',
        'this pizza is amazing',
        'i hate boring movies',
        'music is fun'
      ];

      function buildBigrams(lines){
        const map = new Map();
        const add = (a,b)=>{ const k=a.toLowerCase(); if(!map.has(k)) map.set(k,{}); map.get(k)[b]= (map.get(k)[b]||0)+1; };
        lines.forEach(l=>{
          const toks = ['<s>',...l.toLowerCase().split(/\s+/).filter(Boolean),'</s>'];
          for(let i=0;i<toks.length-1;i++){ add(toks[i], toks[i+1]); }
        });
        return map;
      }

      const bigrams = buildBigrams(corpus);

      function softmaxTemp(logits, T){
        const m = Math.max(...logits);
        const exps = logits.map(v=>Math.exp((v-m)/Math.max(0.05,T)));
        const s = exps.reduce((a,b)=>a+b,0);
        return exps.map(v=>v/s);
      }

      function argmaxIdx(arr){ let mi=0; for(let i=1;i<arr.length;i++){ if(arr[i]>arr[mi]) mi=i; } return mi; }

      function sampleNext(dist){
        const r = Math.random();
        let acc=0; for(let i=0;i<dist.length;i++){ acc+=dist[i].p; if(r<=acc) return dist[i].w; }
        return dist[dist.length-1].w;
      }

      function topK(words, probs, k){
        const idx = probs.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]).slice(0, Math.max(1,k)).map(x=>x[1]);
        const nw = idx.map(i=>words[i]);
        const np = idx.map(i=>probs[i]);
        const s = np.reduce((a,b)=>a+b,0);
        return {words:nw, probs: np.map(p=>p/s)};
      }

      function genNextWords(seed, T=0.8, maxLen=10){
        let prev = (seed?.trim().split(/\s+/).pop()||'').toLowerCase();
        if(!bigrams.has(prev)) prev = '<s>';
        const out=[];
        for(let t=0;t<maxLen;t++){
          const table = bigrams.get(prev) || bigrams.get('<s>');
          const words = Object.keys(table);
          const counts = words.map(w=>table[w]);
          // Temperature sensitivity: argmax when T<=0.15, and increase top-k with T
          if (T <= 0.15) {
            const idx = argmaxIdx(counts);
            const w = words[idx];
            if(w==='</s>') break; out.push(w); prev = w; continue;
          }
          const baseProbs = softmaxTemp(counts, T);
          const k = Math.max(1, Math.min(words.length, Math.round(1 + (T-0.1)/1.4 * 4))); // k in [1..5]
          const {words: tw, probs: tp} = topK(words, baseProbs, k);
          const dist = tw.map((w,i)=>({w, p: tp[i]}));
          const w = sampleNext(dist);
          if(w==='</s>') break; out.push(w); prev = w;
        }
        return out.join(' ');
      }

      function sigmoid(z){ return 1/(1+Math.exp(-z)); }

      function discrimSentiment(text){
        const toks = text.toLowerCase().split(/\W+/).filter(Boolean);
        let g=0,b=0; toks.forEach(t=>{ if(POS.includes(t)) g++; if(NEG.includes(t)) b++; });
        const exclaim = /!/.test(text) ? 0.2 : 0.0;
        const wGood=0.9, wBad=1.1, bias=-0.2;
        const z = wGood*g - wBad*b + bias + exclaim;
        const p = sigmoid(z);
        return {p, g, b, z};
      }

      function bars(label,val,color='indigo'){
        const pct = Math.max(0, Math.min(100, val*100));
        return `<div>
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${pct.toFixed(0)}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function render(){
        tempVal.textContent = parseFloat(tempEl.value).toFixed(1);
        const mode = modeEl.value;
        const txt = textEl.value || '';

  // Enable temperature only for generative mode for clear UX
  tempEl.disabled = mode !== 'gen';

        if(mode==='disc'){
          const r = discrimSentiment(txt);
          const label = r.p>=0.5 ? 'positive' : 'negative';
          modelEl.innerHTML = `<div>Modeling: <b>P(y|x)</b> (logistic)</div>
            <div class="mt-1">good=${r.g}, bad=${r.b}, bias=-0.2</div>`;
          metricsEl.innerHTML = `${bars('P(positive|x)', r.p, 'emerald')}`;
          outputEl.textContent = `Predicted label: ${label}\nConfidence: ${(r.p*100).toFixed(1)}%`;
          explainEl.innerHTML = `
            <div class="text-center bg-white border p-2 rounded font-mono text-[12px]">$$P(y=1\\mid x)=\\sigma(w\\cdot x + b)$$</div>
            <div class="text-[11px] text-gray-600 mt-1">Boundary‑focused: learns to separate classes directly.</div>
          `;
        } else {
            const T = parseFloat(tempEl.value);
            const cont = genNextWords(txt, T, 12);
          modelEl.innerHTML = `<div>Modeling: <b>P(x)</b> with a tiny bigram LM</div>
            <div class="mt-1">Seed token: <span class="font-mono">${(txt.trim().split(/\s+/).pop()||'&lt;s&gt;').toLowerCase()}</span></div>`;
            const diversity = Math.max(0, Math.min(1, (T - 0.1) / 1.4));
            metricsEl.innerHTML = `
              ${bars('Diversity (temp)', diversity, 'purple')}
              <div class="mt-1">Temperature: <span class="font-mono">${T.toFixed(1)}</span></div>
            `;
          outputEl.textContent = (txt.trim() + ' ' + cont).trim();
          explainEl.innerHTML = `
            <div class="text-center bg-white border p-2 rounded font-mono text-[12px]">$$P(x)=\\prod_{t} P(x_t\\mid x_{\\lt t})$$</div>
            <div class="text-[11px] text-gray-600 mt-1">Distribution‑focused: can sample new text; higher temperature increases diversity.</div>
          `;
        }

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [modeEl, textEl, tempEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    }
  }
};

// Export pattern (for loader eval fallback)
if (typeof module !== 'undefined') {
  module.exports = question;
}
