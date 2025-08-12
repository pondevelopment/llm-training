// Question 40: How does knowledge graph integration improve LLMs?
// Created: August 12, 2025
// Educational Focus: KG grounding to reduce hallucinations, improve reasoning, and add citations

const question = {
  title: "40. How does knowledge graph integration improve LLMs?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">🔗 Key Idea</h4>
        <p class="text-sm text-blue-800">A knowledge graph (KG) adds <b>structured, factual edges</b> between entities. Grounding an LLM's answers in a KG reduces hallucinations, enables <i>path reasoning</i>, and supports <b>verifiable citations</b>.</p>
        <div class="text-xs mt-2 text-blue-800">Formal view: with grounding the model conditions on graph facts \(G\): \(P(\text{answer}\mid x, G)\) instead of just \(P(\text{answer}\mid x)\).</div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 LLM Only</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• Fluent, fast, but may hallucinate</li>
            <li>• No explicit evidence or graph structure</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Grounded with KG</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Looks up facts as triples</li>
            <li>• Adds citations to answers</li>
            <li>• Lower hallucination risk</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 Graph Reasoning</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• Multi-hop path discovery</li>
            <li>• Explains how entities relate</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• <b>Reducing hallucinations</b> by verifying against graph facts.</li>
          <li>• <b>Improving reasoning</b> via explicit entity relations.</li>
          <li>• <b>Enhancing context</b> with structured, compact evidence.</li>
          <li>• <b>Trust & traceability</b> through citations and paths.</li>
        </ul>
      </div>

      <!-- Tiny code hint -->
      <div class="bg-white p-4 rounded border text-xs">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <div class="font-semibold mb-1">Pseudo-code: Grounding pipeline</div>
            <code>entities = NER(x)\ntriples = KG.lookup(entities)\nanswer = LLM(x, context=triples)\nreturn answer + citations(triples)</code>
          </div>
          <div>
            <div class="font-semibold mb-1">Path reasoning</div>
            <code>path = KG.findPath(a, b)\nexplain(path) // show relation chain</code>
          </div>
        </div>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Knowledge Graph Grounding Playground",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200\">
          <div class=\"grid md:grid-cols-4 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\">Task</label>
              <select id=\"q40-task\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"founders\">Who founded OpenAI?</option>
                <option value=\"marie-birth\">Where was Marie Curie born?</option>
                <option value=\"capital\">What is the capital of France?</option>
                <option value=\"marie-country\">Marie Curie's birth city is in which country?</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Mode</label>
              <select id=\"q40-mode\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"llm\">LLM only (no KG)</option>
                <option value=\"kg\" selected>KG grounding (facts)</option>
                <option value=\"path\">KG path reasoning</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">KG coverage</label>
              <input id=\"q40-cov\" type=\"range\" min=\"0\" max=\"1\" step=\"0.1\" value=\"0.8\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q40-cov-val\" class=\"font-mono\">0.8</span></div>
            </div>
            <div class=\"flex items-end\">
              <label class=\"inline-flex items-center gap-2\"><input id=\"q40-cite\" type=\"checkbox\" checked /><span>Add citations</span></label>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\">Simulated KG grounding with a small in-memory graph; coverage controls how much of the relevant subgraph is found.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧭 Evidence</h5>
            <div id=\"q40-evidence\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q40-metrics\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🗣️ Output</h5>
            <div id=\"q40-output\" class=\"text-sm text-gray-800 space-y-2\"></div>
          </div>
        </div>

        <div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-4\">
          <h5 class=\"font-semibold text-indigo-900 mb-1\">🔎 Explanation</h5>
          <div id=\"q40-explain\" class=\"text-xs text-indigo-800\"></div>
        </div>
      </div>
    `,
    script: () => {
      const taskEl = document.getElementById('q40-task');
      const modeEl = document.getElementById('q40-mode');
      const covEl = document.getElementById('q40-cov');
      const covVal = document.getElementById('q40-cov-val');
      const citeEl = document.getElementById('q40-cite');
      const evEl = document.getElementById('q40-evidence');
      const metricsEl = document.getElementById('q40-metrics');
      const outputEl = document.getElementById('q40-output');
      const explainEl = document.getElementById('q40-explain');
      if (!taskEl) return;

      // Tiny knowledge graph as triples (subject, predicate, object)
      const KG = [
        ['OpenAI', 'foundedBy', 'Elon Musk'],
        ['OpenAI', 'foundedBy', 'Sam Altman'],
        ['OpenAI', 'foundedBy', 'Ilya Sutskever'],
        ['OpenAI', 'foundedBy', 'Greg Brockman'],
        ['OpenAI', 'foundedIn', '2015'],
        ['Paris', 'capitalOf', 'France'],
        ['Marie Curie', 'bornIn', 'Warsaw'],
        ['Warsaw', 'inCountry', 'Poland']
      ];

      // Index by subject and by object for simple lookups
      const bySub = new Map(); const byObj = new Map();
      KG.forEach(([s,p,o],i)=>{ if(!bySub.has(s)) bySub.set(s,[]); bySub.get(s).push({s,p,o,i}); if(!byObj.has(o)) byObj.set(o,[]); byObj.get(o).push({s,p,o,i}); });

      function triplesToHTML(tris) {
        if (!tris.length) return '<div class="text-gray-500">No triples found.</div>';
        return tris.map(t=>`<div class="px-2 py-1 border rounded bg-gray-50"><span class="font-mono">(${t.s}, ${t.p}, ${t.o})</span> <span class="text-gray-400">[#${t.i+1}]</span></div>`).join('');
      }

      function bar(label, value, color='indigo') {
        const pct = Math.max(0, Math.min(100, Math.round(value*100)));
        return `<div>
          <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${(value*100).toFixed(0)}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded relative overflow-hidden\">
            <div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div>
          </div>
        </div>`;
      }

      function findPath(a, b, maxDepth=3) {
        // BFS on KG up to maxDepth, return list of edges if found
        const visited = new Set([a]);
        const queue = [[a, []]];
        while (queue.length) {
          const [node, path] = queue.shift();
          if (node === b) return path;
          const edges = (bySub.get(node) || []).concat((byObj.get(node) || []).map(e=>({s:e.o,p:e.p,o:e.s,i:e.i,rev:true})));
          for (const e of edges) {
            const next = e.o;
            if (!visited.has(next) && path.length < maxDepth) {
              visited.add(next);
              queue.push([next, path.concat([e])]);
            }
          }
        }
        return [];
      }

      const TASKS = {
        'founders': {
          ask: 'Who founded OpenAI?',
          retrieve: () => (bySub.get('OpenAI')||[]).filter(t=>t.p==='foundedBy'),
          answerFrom: (tris) => tris.length? `OpenAI founders include ${tris.map(t=>t.o).join(', ')}.` : 'Answer unknown.',
          baseAcc: 0.65
        },
        'marie-birth': {
          ask: 'Where was Marie Curie born?',
          retrieve: () => (bySub.get('Marie Curie')||[]).filter(t=>t.p==='bornIn'),
          answerFrom: (tris) => tris.length? `Marie Curie was born in ${tris[0].o}.` : 'Answer unknown.',
          baseAcc: 0.75
        },
        'capital': {
          ask: 'What is the capital of France?',
          retrieve: () => (byObj.get('France')||[]).filter(t=>t.p==='capitalOf').map(t=>({s:t.o,p:'capitalOf',o:t.s,i:t.i})),
          answerFrom: (tris) => tris.length? `The capital of France is ${tris[0].s}.` : 'Answer unknown.',
          baseAcc: 0.9
        },
        'marie-country': {
          ask: "Marie Curie's birth city is in which country?",
          retrieve: () => { const w = (bySub.get('Marie Curie')||[]).find(t=>t.p==='bornIn'); if(!w) return []; return (bySub.get(w.o)||[]).filter(t=>t.p==='inCountry'); },
          answerFrom: (tris) => tris.length? `Her birth city is in ${tris[0].o}.` : 'Answer unknown.',
          baseAcc: 0.6,
          path: ['Marie Curie','Poland']
        }
      };

      function render() {
        covVal.textContent = parseFloat(covEl.value).toFixed(1);
        const task = TASKS[taskEl.value];
        const mode = modeEl.value;
        const cov = parseFloat(covEl.value);
        const cite = !!citeEl.checked;

        // Retrieve facts
        let tris = task.retrieve();
        // Apply coverage (drop some triples)
        const keep = Math.max(0, Math.min(tris.length, Math.round(tris.length * cov)));
        tris = tris.slice(0, keep);

        // Evidence panel
        const evidenceHTML = triplesToHTML(tris);
        evEl.innerHTML = evidenceHTML;

        // Path reasoning if needed
        let pathEdges = [];
        if (mode === 'path' && task.path) {
          pathEdges = findPath(task.path[0], task.path[1]);
        }

        // Simulated accuracy & risk
        const hasFacts = tris.length > 0;
        const pathFound = pathEdges.length > 0;
        let acc = task.baseAcc - 0.15; // no KG default
        if (mode === 'kg') acc = task.baseAcc + (hasFacts ? 0.2*cov : 0.0);
        if (mode === 'path') acc = task.baseAcc + (hasFacts ? 0.15*cov : 0.0) + (pathFound ? 0.15 : 0.0);
        acc = Math.max(0.05, Math.min(0.99, acc));
        const risk = 1 - acc;

        // Token cost: base + per-triple context
        const baseTokens = 40; const perTriple = 14; const perEdgeExplain = 10;
        const tokens = baseTokens + tris.length * perTriple + (mode==='path'? pathEdges.length*perEdgeExplain : 0);

        // Output
        const answerText = (mode==='llm' || !hasFacts) ?
          `${task.ask.replace('?','')}: ${mode==='llm' ? 'Likely answer.' : 'Attempted answer (limited evidence).'}` :
          task.answerFrom(tris);

        const cites = cite && hasFacts ? `<div class=\"text-[11px] text-gray-600\">Citations: ${tris.map(t=>`[#${t.i+1}]`).join(' ')}</div>` : '';
        const pathExplain = (mode==='path' && pathFound) ? `<div class=\"text-[11px] text-gray-700\">Path: ${pathEdges.map(e=> e.rev? `(${e.o}) -[${e.p}]→ (${e.s})` : `(${e.s}) -[${e.p}]→ (${e.o})`).join(' , ')}</div>` : '';

        outputEl.innerHTML = `<div>${answerText}</div>${cites}${pathExplain}`;

        // Metrics
        metricsEl.innerHTML = `
          ${bar('Estimated accuracy', acc, 'emerald')}
          ${bar('Hallucination risk', risk, 'rose')}
          <div>Token estimate: <span class=\"font-mono\">~${Math.round(tokens)}</span></div>
        `;

        // Explanation
        explainEl.innerHTML = `
          <div>With KG grounding, the model conditions on retrieved triples and optionally a reasoning path. More coverage and a found path typically improve accuracy and reduce risk.</div>
        `;

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [taskEl, modeEl, covEl, citeEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    }
  }
};

// Export pattern
if (typeof module !== 'undefined') { module.exports = question; }
