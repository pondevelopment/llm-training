const interactiveScript = () => {
      const modeEl = document.getElementById('q39-mode');
      const textEl = document.getElementById('q39-text');
      const tempEl = document.getElementById('q39-temp');
      const tempVal = document.getElementById('q39-temp-val');
      const modelEl = document.getElementById('q39-model');
      const metricsEl = document.getElementById('q39-metrics');
      const outputEl = document.getElementById('q39-output');
      const explainEl = document.getElementById('q39-explain');
  if (!modeEl || !textEl || !tempEl || !modelEl || !metricsEl || !outputEl || !explainEl) return; // defensive: abort if any critical element missing

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

      function genNextWords(seed, T=0.8, maxLen=12){
        // Stronger temperature effect across ALL seeds.
        // Fallback: if the last token has only a single continuation (or only </s>) we
        // restart from <s> to allow branching, enabling temperature to matter for every example.
        let prev = (seed?.trim().split(/\s+/).pop()||'').toLowerCase();
        if(!bigrams.has(prev)) prev = '<s>';
        const out=[]; const clamp01 = v=>Math.max(0,Math.min(1,v));
        let restarts = 0;
        for(let step=0; step<maxLen; step++){
          let table = bigrams.get(prev) || bigrams.get('<s>');
            let words = Object.keys(table);
          // If no diversity (<=1 option) and we have room, restart chain to inject variability
          if (words.length <= 1 && step < maxLen-1 && restarts < 2){
            prev = '<s>';
            restarts++;
            table = bigrams.get(prev);
            words = Object.keys(table);
          }
          if(!words.length) break;
          const rawCounts = words.map(w=>table[w]);
          // Deterministic when extremely low temp
          if (T <= 0.12){
            const w = words[argmaxIdx(rawCounts)];
            if(w==='</s>') { if(out.length < 2) { prev='<s>'; continue; } else break; }
            out.push(w); prev = w; continue;
          }
          // Add temperature-proportional noise
          const noisy = rawCounts.map(c => c + Math.random()*T*0.75);
          const baseProbs = softmaxTemp(noisy, T);
          const scaledT = clamp01((T - 0.1)/1.4);
          const dynK = Math.max(1, Math.min(words.length, 1 + Math.round(scaledT * (words.length-1))));
          const sorted = baseProbs.map((p,i)=>({w:words[i],p})).sort((a,b)=>b.p-a.p);
          const nucleusP = 0.55 + 0.35*scaledT;
          let acc=0; const nucleus=[];
          for(const item of sorted){ nucleus.push(item); acc+=item.p; if(acc>=nucleusP) break; }
          const candidate = nucleus.slice(0,dynK);
          const norm = candidate.reduce((s,o)=>s+o.p,0) || 1;
          const dist = candidate.map(o=>({w:o.w, p:o.p/norm}));
          const w = sampleNext(dist);
          if(w==='</s>'){
            if(out.length < 2 && restarts < 2){ prev='<s>'; restarts++; continue; }
            break;
          }
          out.push(w); prev = w;
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
        return `<div role=\"group\" aria-label=\"${label} ${pct.toFixed(0)} percent\">\n          <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${pct.toFixed(0)}%</span></div>\n          <div class=\"w-full h-3 bg-${color}-200 rounded\" aria-hidden=\"true\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\" role=\"progressbar\" aria-valuenow=\"${pct.toFixed(0)}\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"${label}\"></div></div>\n        </div>`;
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
            <div class="math-display">$$P(y=1\\mid x)=\\sigma(w\\cdot x + b)$$</div>
            <div class="text-xs text-gray-600 mt-1">Boundary‑focused: learns to separate classes directly.</div>
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
            <div class="math-display">$$P(x)=\\prod_{t} P(x_t\\mid x_{\\lt t})$$</div>
            <div class="text-xs text-gray-600 mt-1">Distribution‑focused: can sample new text; higher temperature increases diversity.</div>
          `;
        }

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [modeEl, textEl, tempEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question39Interactive = interactiveScript;
}
