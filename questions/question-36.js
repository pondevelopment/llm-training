// Question 36: What are the steps in Retrieval-Augmented Generation (RAG)?
// Created: August 12, 2025
// Updated: August 28, 2025
// Educational Focus: RAG pipeline (Retrieve → Rank → Generate) with a small interactive simulator.
// Update: Added recommended reading, retrieval method comparison cards, accessibility (aria-*),
// defensive DOM checks, overflow handling for math, and CommonJS export.

const question = {
  title: "36. What are the steps in Retrieval-Augmented Generation (RAG)?",
  answer: `<div class="space-y-6">
    <!-- Recommended Reading -->
    <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-2">📚 Recommended reading</h4>
      <ul class="list-disc ml-5 text-xs text-indigo-800 space-y-1">
        <li><a class="underline hover:text-indigo-900" href="#question-07">7. How do embedding models differ?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-18">18. Why do LLMs hallucinate?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-20">20. What is prompt engineering?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-24">24. What is parameter-efficient fine-tuning?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-34">34. What types of foundation models exist?</a></li>
      </ul>
      <p class="text-[11px] text-indigo-700 mt-2">Context: similarity search, hallucination mitigation, prompt design, lightweight adaptation, taxonomy.</p>
    </div>

    <!-- Core concept -->
    <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
      <h4 class="font-semibold text-blue-900 mb-2">🧱 RAG in three stages</h4>
      <ol class="list-decimal ml-5 text-sm text-blue-800 space-y-1">
        <li><b>Retrieval</b>: Fetch candidate passages (lexical, dense, hybrid).</li>
        <li><b>Ranking</b>: Re-score to sharpen top‑k precision (cross‑encoder).</li>
        <li><b>Generation</b>: Condition answer on ranked context + citations.</li>
      </ol>
      <p class="text-sm text-blue-800 mt-2">Analogy: Open‑book exam → find pages → pick paragraphs → write cited answer.</p>
    </div>

    <!-- Retrieval methods -->
    <div class="grid md:grid-cols-3 gap-4 text-sm">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h5 class="font-semibold text-green-800 mb-1">Lexical (BM25)</h5>
        <ul class="list-disc ml-4 text-xs text-green-700 space-y-1">
          <li>Exact token match</li>
          <li>Fast & transparent</li>
          <li>Weak on paraphrase</li>
        </ul>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h5 class="font-semibold text-purple-800 mb-1">Dense (Embeddings)</h5>
        <ul class="list-disc ml-4 text-xs text-purple-700 space-y-1">
          <li>Semantic similarity</li>
          <li>Handles paraphrase</li>
          <li>Vector index needed</li>
        </ul>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h5 class="font-semibold text-amber-800 mb-1">Hybrid / Multi‑Stage</h5>
        <ul class="list-disc ml-4 text-xs text-amber-700 space-y-1">
          <li>High recall + precision</li>
          <li>Lexical prefilter</li>
          <li>More infra complexity</li>
        </ul>
      </div>
    </div>

    <!-- Scoring example -->
    <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h4 class="font-semibold text-gray-900 mb-2">🧮 Scoring example</h4>
      <p class="text-sm text-gray-700">Cosine similarity for dense retrieval:</p>
        <div class="text-center bg-gradient-to-r from-indigo-50 to-indigo-100 p-3 rounded-lg border border-indigo-200 text-sm font-mono overflow-x-auto whitespace-nowrap" aria-label="Cosine similarity equation">
          $$ \\cos(\\theta) = \\frac{\\sum_i q_i d_i}{\\sqrt{\\sum_i q_i^2}\\,\\sqrt{\\sum_i d_i^2}} $$
        </div>
      <p class="text-xs text-gray-600 mt-2">Hybrid pattern: lexical recall → dense refine → cross‑encoder rerank → answer assembly.</p>
    </div>

    <!-- Why it matters -->
    <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
      <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>• <b>Grounding</b> reduces hallucinations with citations.</li>
        <li>• <b>Freshness</b> adds new knowledge without retraining.</li>
        <li>• <b>Control</b> constrains domains & governance.</li>
        <li>• <b>Efficiency</b> narrows context budget.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
    title: "🧪 RAG Pipeline Explorer (Retrieve → Rank → Generate)",
    html: `<div class=\"space-y-6\">\n      <div class=\"bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200\">\n        <div class=\"grid md:grid-cols-4 gap-4 text-xs\">\n          <div class=\"md:col-span-2\">\n            <label class=\"font-semibold text-gray-700\">Query</label>\n            <select id=\"q36-query\" class=\"mt-1 w-full border-gray-300 rounded p-2 text-xs\" aria-label=\"Query selection\">\n              <option value=\"What are the steps in RAG?\" selected>What are the steps in RAG?</option>\n              <option value=\"When does RAG help?\">When does RAG help?</option>\n              <option value=\"Compare BM25 and embeddings\">Compare BM25 and embeddings</option>\n              <option value=\"Why add a reranker in RAG?\">Why add a reranker in RAG?</option>\n              <option value=\"How should I chunk documents for retrieval?\">How should I chunk documents for retrieval?</option>\n              <option value=\"How to add citations in answers?\">How to add citations in answers?</option>\n            </select>\n          </div>\n          <div>\n            <label class=\"font-semibold text-gray-700\">Retriever</label>\n            <select id=\"q36-retriever\" class=\"mt-1 w-full border-gray-300 rounded p-1 text-xs\" aria-label=\"Retriever type\">\n              <option value=\"bm25\">BM25 (lexical)</option>\n              <option value=\"vector\">Embeddings (cosine)</option>\n            </select>\n          </div>\n          <div>\n            <label class=\"font-semibold text-gray-700\">Top‑k</label>\n            <input id=\"q36-topk\" type=\"range\" min=\"1\" max=\"5\" value=\"3\" class=\"w-full\" aria-label=\"Top k documents slider\" />\n            <div class=\"text-center mt-1\"><span id=\"q36-topk-val\" class=\"font-mono\">3</span></div>\n          </div>\n        </div>\n        <div class=\"mt-3 flex items-center gap-3 text-xs\">\n          <label class=\"inline-flex items-center gap-2\"><input id=\"q36-rerank\" type=\"checkbox\" checked aria-label=\"Enable reranking\" /><span>Use cross‑encoder reranker</span></label>\n          <label class=\"inline-flex items-center gap-2\"><input id=\"q36-cite\" type=\"checkbox\" checked aria-label=\"Include citations in answer\" /><span>Insert citations</span></label>\n        </div>\n        <p class=\"text-[11px] text-gray-600 mt-2\">Heuristic simulator: lexical vs dense scoring + optional bigram rerank. Real systems add hybrid retrieval, freshness, filtering, caching.</p>\n      </div>\n\n      <div class=\"grid md:grid-cols-3 gap-4\">\n        <div class=\"bg-white border rounded-lg p-4\">\n          <h5 class=\"font-semibold text-gray-800 mb-2\">🔎 Retrieved</h5>\n          <div id=\"q36-retrieved\" class=\"text-xs space-y-2\" role=\"list\" aria-label=\"Retrieved candidate passages\"></div>\n        </div>\n        <div class=\"bg-white border rounded-lg p-4\">\n          <h5 class=\"font-semibold text-gray-800 mb-2\">🏅 Ranked</h5>\n          <div id=\"q36-ranked\" class=\"text-xs space-y-2\" role=\"list\" aria-label=\"Ranked top passages\"></div>\n        </div>\n        <div class=\"bg-white border rounded-lg p-4\">\n          <h5 class=\"font-semibold text-gray-800 mb-2\">📝 Generated Answer</h5>\n          <div id=\"q36-answer\" class=\"text-sm text-gray-800 space-y-2\" aria-live=\"polite\"></div>\n        </div>\n      </div>\n\n      <div class=\"bg-green-50 border border-green-200 rounded-lg p-4\">\n        <h5 class=\"font-semibold text-green-900 mb-1\">💡 Tip</h5>\n        <div id=\"q36-tip\" class=\"text-sm text-green-800\" aria-live=\"polite\"></div>\n      </div>\n    </div>`,
    script: () => {
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
          const qB = bigrams(qTok);
          ranked.forEach(r => {
            const rB = bigrams(tokenize(r.text));
            r.rscore = jaccard(qB, rB);
          });
          const maxR = Math.max(0.0001, ...ranked.map(r=>r.rscore||0.0001));
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
    }
  }
};

// CommonJS export for tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
