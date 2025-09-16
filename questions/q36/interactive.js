const interactiveScript = () => {
      // Defensive DOM selection
      const queryEl = document.getElementById('q36-query');
      const retrieverEl = document.getElementById('q36-retriever');
      const topkEl = document.getElementById('q36-topk');
      const topkVal = document.getElementById('q36-topk-val');
      const rerankEl = document.getElementById('q36-rerank');
      const citeEl = document.getElementById('q36-cite');
      const retrievedEl = document.getElementById('q36-retrieved');
      const rankedEl = document.getElementById('q36-ranked');
      const answerEl = document.getElementById('q36-answer');
      const tipEl = document.getElementById('q36-tip');
      if(!queryEl || !retrieverEl || !topkEl || !topkVal || !retrievedEl || !rankedEl || !answerEl || !tipEl) return;

      // Tiny knowledge base (6 docs)
      const KB = [
        {id: 1, title: 'RAG Overview', text: 'RAG combines retrieval with generation. Steps: retrieve, rank, and generate with citations from top documents.'},
        {id: 2, title: 'Retrievers: BM25 vs Embeddings', text: 'BM25 uses lexical overlap with IDF and length normalization. Embedding search compares dense vectors, often with cosine similarity.'},
        {id: 3, title: 'Reranking', text: 'A cross-encoder reranker can rescore retrieved passages using the full query-passage pair, improving precision at small k.'},
        {id: 4, title: 'Chunking and Windows', text: 'Documents are chunked with overlap to ensure complete facts are captured. Window size and stride impact retrieval quality.'},
        {id: 5, title: 'Citations and Grounding', text: 'Generated answers should cite sources to improve trust. Provide inline citations like [1], [3].'},
        {id: 6, title: 'When RAG helps', text: 'RAG helps with up-to-date knowledge, long-tail facts, and domain grounding without full model retraining.'},
      ];

      const STOP = new Set(['the','a','an','and','or','of','to','in','on','for','with','is','are','be','at','by','as','that','this','it','from','using','use','into']);
      const tokenize = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(t => t && !STOP.has(t));

      // Build vocab/df for BM25‑like scoring
      const DF = new Map();
      const TOK_DOCS = KB.map(d => ({...d, tokens: tokenize(d.text)}));
      TOK_DOCS.forEach(d => {
        const seen = new Set(d.tokens);
        seen.forEach(t => DF.set(t, (DF.get(t)||0)+1));
      });
      const N = TOK_DOCS.length;
      const avgLen = TOK_DOCS.reduce((s,d)=>s+d.tokens.length,0)/N;

      function bm25Score(qTokens, docTokens, k1=1.5, b=0.75) {
        const tf = new Map();
        docTokens.forEach(t => tf.set(t, (tf.get(t)||0)+1));
        const L = docTokens.length;
        let score = 0;
        qTokens.forEach(t => {
          const df = DF.get(t) || 0.5;
          const idf = Math.log((N - df + 0.5)/(df + 0.5) + 1);
          const f = tf.get(t) || 0;
          const denom = f + k1*(1 - b + b*(L/avgLen));
          score += idf * ((f*(k1+1))/ (denom || 1));
        });
        return score;
      }

      // Simple bag‑of‑words vector and cosine
      function bowVec(tokens) {
        const m = new Map();
        tokens.forEach(t => m.set(t, (m.get(t)||0)+1));
        return m;
      }
      function dot(a,b){
        let s=0; a.forEach((va,ka)=>{ const vb=b.get(ka)||0; s+=va*vb;}); return s;
      }
      function norm(a){ let s=0; a.forEach(v=>{s+=v*v}); return Math.sqrt(s)||1; }
      function cosine(qTokens, dTokens){
        const q=bowVec(qTokens), d=bowVec(dTokens); return dot(q,d)/(norm(q)*norm(d));
      }

      // Bigram Jaccard for reranking
      const bigrams = (tokens) => new Set(tokens.slice(0,-1).map((t,i)=> t+"_"+tokens[i+1]));
      function jaccard(a,b){ const inter=[...a].filter(x=>b.has(x)).length; const uni = new Set([...a, ...b]).size; return uni? inter/uni : 0; }

      function bar(label, value, color='indigo') {
        const pct = Math.max(0, Math.min(100, Math.round(value*100)));
        const pctLabel = (value*100).toFixed(1);
        return `<div role=\"group\" aria-label=\"${label} ${pctLabel} percent\">\n          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${pctLabel}%</span></div>\n          <div class=\"w-full h-3 bg-${color}-200 rounded relative overflow-hidden\" aria-hidden=\"true\">\n            <div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div>\n          </div>\n        </div>`;
      }

      function pipeline() {
        const q = (queryEl.value || '').trim();
        const qTok = tokenize(q);
        const topk = parseInt(topkEl.value, 10);
        topkVal.textContent = String(topk);
        const useBm25 = retrieverEl.value === 'bm25';
        const useRerank = !!rerankEl.checked;
        const useCite = !!citeEl.checked;

        // 1) Retrieval
        const scored = TOK_DOCS.map(d => {
          const score = useBm25 ? bm25Score(qTok, d.tokens) : cosine(qTok, d.tokens);
          return { id: d.id, title: d.title, text: d.text, score };
        }).sort((a,b)=>b.score-a.score);

        // Normalize scores 0..1 for bars
        const maxS = Math.max(0.0001, scored[0]?.score || 0.0001);
        const retrieved = scored.slice(0, Math.max(topk, 3)).map(r => ({...r, nscore: Math.max(0, r.score/maxS)}));

        // 2) Ranking (optional rerank by bigram Jaccard)
        let ranked = [...retrieved];
        if (useRerank) {
          // Bigram Jaccard with fallback to unigram overlap if all bigram overlap is zero
          const qB = bigrams(qTok);
          const qSet = new Set(qTok);
          ranked.forEach(r => {
            const docTokens = tokenize(r.text);
            const rB = bigrams(docTokens);
            let score = jaccard(qB, rB);
            if (score === 0) { // fallback: unigram Jaccard overlap
              const dSet = new Set(docTokens);
              const inter = [...qSet].filter(t=>dSet.has(t)).length;
              const uni = new Set([...qSet, ...dSet]).size;
              score = uni ? inter/uni : 0;
            }
            r.rscore = score;
          });
          const maxR = Math.max(0.0001, ...ranked.map(r=>r.rscore||0));
          ranked.sort((a,b)=> (b.rscore - a.rscore) || (b.nscore - a.nscore));
          ranked = ranked.slice(0, topk).map(r => ({...r, rn: (r.rscore||0)/maxR}));
        } else {
          ranked = ranked.slice(0, topk);
        }

        // 3) Generation (simple template with citations)
        const cites = useCite ? ranked.map(r=>`[${r.id}]`).join(' ') : '';
        const answer = `RAG proceeds: (1) retrieval of candidate passages, (2) ranking/reranking for precision, (3) generation conditioned on selected context. ${cites}`;

        // Render sections
        retrievedEl.innerHTML = retrieved.map(r => `
          <div class=\"p-2 border rounded\">\n            <div class=\"font-medium\">#${r.id} • ${r.title}</div>\n            <div class=\"text-[11px] text-gray-600\">${r.text}</div>\n            ${bar('retriever score', r.nscore, 'indigo')}\n          </div>`).join('');

        rankedEl.innerHTML = ranked.map(r => `
          <div class=\"p-2 border rounded\">\n            <div class=\"font-medium\">#${r.id} • ${r.title}</div>\n            ${useRerank ? bar('rerank score', r.rn||0, 'emerald') : ''}\n            ${bar('retriever score', r.nscore, 'indigo')}\n          </div>`).join('');

        answerEl.innerHTML = `
          <div class=\"text-gray-800\">${answer}</div>\n          <div class=\"mt-2 text-[11px] text-gray-600\">Evidence used: ${ranked.map(r=>`#${r.id}`).join(', ')}</div>`;

        tipEl.textContent = useRerank
          ? 'Reranking improves precision at small k; cross‑encoders add semantic discrimination.'
          : 'Enable reranking to refine top‑k before handing context to the generator.';

        // MathJax refresh for the cosine formula in the top section
        setTimeout(() => { if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise(); }, 40);
      }

      // Update on both input and change to cover range/select controls
      [queryEl, retrieverEl, topkEl, rerankEl, citeEl].forEach(el => {
        el.addEventListener('input', pipeline);
        el.addEventListener('change', pipeline);
      });
      pipeline();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question36Interactive = interactiveScript;
}
