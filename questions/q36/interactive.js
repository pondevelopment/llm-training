const interactiveScript = () => {
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

  if (!queryEl || !retrieverEl || !topkEl || !topkVal || !retrievedEl || !rankedEl || !answerEl || !tipEl) {
    return;
  }

  const KB = [
    { id: 1, title: 'RAG Overview', text: 'RAG combines retrieval with generation. Steps: retrieve, rank, and generate with citations from top documents.' },
    { id: 2, title: 'Retrievers: BM25 vs Embeddings', text: 'BM25 uses lexical overlap with IDF and length normalization. Embedding search compares dense vectors, often with cosine similarity.' },
    { id: 3, title: 'Reranking', text: 'A cross-encoder reranker can rescore retrieved passages using the full query-passage pair, improving precision at small k.' },
    { id: 4, title: 'Chunking and Windows', text: 'Documents are chunked with overlap to ensure complete facts are captured. Window size and stride impact retrieval quality.' },
    { id: 5, title: 'Citations and Grounding', text: 'Generated answers should cite sources to improve trust. Provide inline citations like [1], [3].' },
    { id: 6, title: 'When RAG helps', text: 'RAG helps with up-to-date knowledge, long-tail facts, and domain grounding without full model retraining.' },
  ];

  const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are', 'be', 'at', 'by', 'as', 'that', 'this', 'it', 'from', 'using', 'use', 'into']);
  const tokenize = (str) => str.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token && !STOP.has(token));

  const DF = new Map();
  const TOK_DOCS = KB.map((doc) => ({ ...doc, tokens: tokenize(doc.text) }));
  TOK_DOCS.forEach((doc) => {
    const seen = new Set(doc.tokens);
    seen.forEach((token) => DF.set(token, (DF.get(token) || 0) + 1));
  });
  const N = TOK_DOCS.length;
  const avgLen = TOK_DOCS.reduce((sum, doc) => sum + doc.tokens.length, 0) / N;

  function bm25Score(qTokens, docTokens, k1 = 1.5, b = 0.75) {
    const tf = new Map();
    docTokens.forEach((token) => tf.set(token, (tf.get(token) || 0) + 1));
    const L = docTokens.length;
    let score = 0;
    qTokens.forEach((token) => {
      const df = DF.get(token) || 0.5;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      const f = tf.get(token) || 0;
      const denom = f + k1 * (1 - b + b * (L / avgLen));
      score += idf * ((f * (k1 + 1)) / (denom || 1));
    });
    return score;
  }

  function bowVec(tokens) {
    const matrix = new Map();
    tokens.forEach((token) => matrix.set(token, (matrix.get(token) || 0) + 1));
    return matrix;
  }

  function dot(a, b) {
    let s = 0;
    a.forEach((va, key) => {
      const vb = b.get(key) || 0;
      s += va * vb;
    });
    return s;
  }

  function norm(vec) {
    let sum = 0;
    vec.forEach((value) => {
      sum += value * value;
    });
    return Math.sqrt(sum) || 1;
  }

  function cosine(qTokens, dTokens) {
    const q = bowVec(qTokens);
    const d = bowVec(dTokens);
    return dot(q, d) / (norm(q) * norm(d));
  }

  const bigrams = (tokens) => new Set(tokens.slice(0, -1).map((token, idx) => `${token}_${tokens[idx + 1]}`));

  function jaccard(a, b) {
    const intersection = [...a].filter((value) => b.has(value)).length;
    const union = new Set([...a, ...b]).size;
    return union ? intersection / union : 0;
  }

  function meter(label, value, tone = 'indigo') {
    const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
    const pctLabel = (value * 100).toFixed(1);
    const toneAttr = tone === 'indigo' ? '' : ` data-tone="${tone}"`;
    return `
      <div class="space-y-1" role="group" aria-label="${label} ${pctLabel} percent">
        <div class="flex items-center justify-between small-caption text-muted"><span>${label}</span><span>${pctLabel}%</span></div>
        <div class="context-meter"${toneAttr}>
          <div class="context-meter-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function pipeline() {
    const query = (queryEl.value || '').trim();
    const qTokens = tokenize(query);
    const topk = parseInt(topkEl.value, 10);
    topkVal.textContent = String(topk);
    const useBm25 = retrieverEl.value === 'bm25';
    const useRerank = Boolean(rerankEl.checked);
    const useCite = Boolean(citeEl.checked);

    const scored = TOK_DOCS.map((doc) => {
      const score = useBm25 ? bm25Score(qTokens, doc.tokens) : cosine(qTokens, doc.tokens);
      return { id: doc.id, title: doc.title, text: doc.text, score };
    }).sort((a, b) => b.score - a.score);

    const maxScore = Math.max(0.0001, scored[0]?.score || 0.0001);
    const retrieved = scored
      .slice(0, Math.max(topk, 3))
      .map((entry) => ({ ...entry, nscore: Math.max(0, entry.score / maxScore) }));

    let ranked = [...retrieved];
    if (useRerank) {
      const qBigrams = bigrams(qTokens);
      const qSet = new Set(qTokens);
      ranked.forEach((entry) => {
        const docTokens = tokenize(entry.text);
        const rBigrams = bigrams(docTokens);
        let score = jaccard(qBigrams, rBigrams);
        if (score === 0) {
          const dSet = new Set(docTokens);
          const inter = [...qSet].filter((token) => dSet.has(token)).length;
          const uni = new Set([...qSet, ...dSet]).size;
          score = uni ? inter / uni : 0;
        }
        entry.rscore = score;
      });
      const maxR = Math.max(0.0001, ...ranked.map((entry) => entry.rscore || 0));
      ranked.sort((a, b) => (b.rscore - a.rscore) || (b.nscore - a.nscore));
      ranked = ranked.slice(0, topk).map((entry) => ({ ...entry, rn: (entry.rscore || 0) / maxR }));
    } else {
      ranked = ranked.slice(0, topk);
    }

    const citations = useCite ? ranked.map((entry) => `[${entry.id}]`).join(' ') : '';
    const answer = `RAG proceeds: (1) retrieval of candidate passages, (2) ranking/reranking for precision, (3) generation conditioned on selected context. ${citations}`;

    retrievedEl.innerHTML = retrieved
      .map(
        (entry) => `
          <article class="panel panel-neutral-soft p-3 space-y-2" role="listitem">
            <div class="font-medium text-heading">#${entry.id} • ${entry.title}</div>
            <p class="small-caption text-muted">${entry.text}</p>
            ${meter('Retriever score', entry.nscore)}
          </article>
        `,
      )
      .join('');

    rankedEl.innerHTML = ranked
      .map((entry) => {
        const rerankMeter = useRerank ? meter('Rerank score', entry.rn || 0, 'emerald') : '';
        return `
          <article class="panel panel-neutral-soft p-3 space-y-2" role="listitem">
            <div class="font-medium text-heading">#${entry.id} • ${entry.title}</div>
            ${rerankMeter}
            ${meter('Retriever score', entry.nscore)}
          </article>
        `;
      })
      .join('');

    answerEl.innerHTML = `
      <div class="space-y-2">
        <p class="text-sm text-body">${answer}</p>
        <p class="small-caption text-muted">Evidence used: ${ranked.map((entry) => `#${entry.id}`).join(', ')}</p>
      </div>
    `;

    tipEl.textContent = useRerank
      ? 'Reranking improves precision at small k; cross-encoders add semantic discrimination.'
      : 'Enable reranking to refine top-k before handing context to the generator.';

    setTimeout(() => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise();
      }
    }, 40);
  }

  [queryEl, retrieverEl, topkEl, rerankEl, citeEl].forEach((el) => {
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
