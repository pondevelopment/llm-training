// Question 40: How does knowledge graph integration improve LLMs?
// Created: August 12, 2025
// Educational Focus: KG grounding to reduce hallucinations, improve reasoning, and add citations

const question = {
  title: "40. How does knowledge graph integration improve LLMs?",
  answer: `
    <div class="space-y-4">
      <!-- Recommended Reading -->
      <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
        <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
        <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
          <li><a href="#question-36" class="text-indigo-700 underline hover:text-indigo-900">Question 36: Retrieval-Augmented Generation</a></li>
          <li><a href="#question-38" class="text-indigo-700 underline hover:text-indigo-900">Question 38: Chain-of-Thought prompting</a></li>
          <li><a href="#question-39" class="text-indigo-700 underline hover:text-indigo-900">Question 39: Discriminative vs Generative</a></li>
        </ul>
      </div>
      <!-- Main Concept -->
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <h4 class="font-semibold text-blue-900 mb-2">🔗 Key Idea</h4>
        <p class="text-sm text-blue-800">A knowledge graph (KG) adds <b>structured, factual edges</b> between entities. Grounding an LLM's answers in a KG reduces hallucinations, enables <i>path reasoning</i>, and supports <b>verifiable citations</b>.</p>
        <div class="text-xs mt-2 text-blue-800">Formal view: with grounding the model conditions on graph facts \(G\): \(P(\text{answer}\mid x, G)\) instead of just \(P(\text{answer}\mid x)\).</div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
          <h5 class="font-semibold text-green-900 mb-1">🟢 LLM Only</h5>
          <ul class="text-sm text-green-800 space-y-1">
            <li>• Fluent, fast, but may hallucinate</li>
            <li>• No explicit evidence or graph structure</li>
          </ul>
        </div>
        <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
          <h5 class="font-semibold text-purple-900 mb-1">🟣 Grounded with KG</h5>
          <ul class="text-sm text-purple-800 space-y-1">
            <li>• Looks up facts as triples</li>
            <li>• Adds citations to answers</li>
            <li>• Lower hallucination risk</li>
          </ul>
        </div>
        <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
          <h5 class="font-semibold text-orange-900 mb-1">🟠 Graph Reasoning</h5>
          <ul class="text-sm text-orange-800 space-y-1">
            <li>• Multi-hop path discovery</li>
            <li>• Explains how entities relate</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
  <div class="bg-yellow-50 p-4 rounded-lg">
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
                <option value=\"marie-continent\">On which continent is Marie Curie's birth city?</option>
                <option value=\"openai-hq-continent\">On which continent is OpenAI headquartered?</option>
                <option value=\"sam-country\">Which country was Sam Altman born in?</option>
                <option value=\"ilya-field-root\">What broad field does Ilya Sutskever's specialty belong to?</option>
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
            <p class=\"text-xs text-gray-600 mt-2\">Simulated KG grounding with a small in-memory graph; coverage controls how much of the relevant subgraph is found.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧭 Evidence</h5>
            <div id=\"q40-evidence\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Metrics</h5>
            <div id=\"q40-metrics\" class=\"text-xs text-gray-700 space-y-2\"></div>
             <div id=\"q40-graph\" class=\"mt-3\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🗣️ Output</h5>
            <div id=\"q40-output\" class=\"text-sm text-gray-800 space-y-2\"></div>
          </div>
        </div>

        <div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-4\">
          <h5 class=\"font-semibold text-indigo-900 mb-1\">🔎 Explanation</h5>
            <div id="q40-explain" class="text-xs text-indigo-800" aria-live="polite"></div>
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
      const graphEl = document.getElementById('q40-graph');
      const explainEl = document.getElementById('q40-explain');
      if (!taskEl) return;
      let pathTimers = [];

      // Tiny knowledge graph as triples (subject, predicate, object)
      const KG = [
        // OpenAI / org related
        ['OpenAI', 'foundedBy', 'Elon Musk'],
        ['OpenAI', 'foundedBy', 'Sam Altman'],
        ['OpenAI', 'foundedBy', 'Ilya Sutskever'],
        ['OpenAI', 'foundedBy', 'Greg Brockman'],
        ['OpenAI', 'foundedIn', '2015'],
        ['OpenAI', 'headquarteredIn', 'San Francisco'],
        ['Sam Altman', 'bornIn', 'St. Louis'],
        ['Ilya Sutskever', 'specializesIn', 'Deep Learning'],
  ['Deep Learning', 'subFieldOf', 'Machine Learning'],
  ['Machine Learning', 'subFieldOf', 'Artificial Intelligence'],
  ['Artificial Intelligence', 'subFieldOf', 'Computer Science'],
        // Geography / capitals
        ['Paris', 'capitalOf', 'France'],
        ['France', 'locatedIn', 'Europe'],
        ['France', 'officialLanguage', 'French'],
        ['France', 'hasCurrency', 'Euro'],
        ['San Francisco', 'inState', 'California'],
        ['California', 'inCountry', 'USA'],
  ['St. Louis', 'inState', 'Missouri'],
  ['Missouri', 'inCountry', 'USA'],
  ['USA', 'locatedIn', 'North America'],
  ['North America', 'locatedIn', 'Earth'],
  ['Europe', 'locatedIn', 'Earth'],
        // Marie Curie multi-hop
        ['Marie Curie', 'bornIn', 'Warsaw'],
        ['Warsaw', 'inCountry', 'Poland'],
        ['Poland', 'locatedIn', 'Europe'],
        ['Marie Curie', 'field', 'Physics'],
        ['Marie Curie', 'field', 'Chemistry'],
        ['Marie Curie', 'wonPrize', 'Nobel Prize in Physics'],
        ['Marie Curie', 'wonPrize', 'Nobel Prize in Chemistry'],
        ['Nobel Prize in Physics', 'awardYear', '1903'],
        ['Nobel Prize in Chemistry', 'awardYear', '1911'],
  ['Physics', 'isDisciplineOf', 'Science'],
  ['Chemistry', 'isDisciplineOf', 'Science'],
  ['Science', 'partOf', 'Human Knowledge'],
        // Additional connective tissue for richer path demos
        ['Physics', 'relatedTo', 'Chemistry'],
        ['Deep Learning', 'relatedTo', 'Physics'],
        ['Elon Musk', 'founded', 'SpaceX'],
        ['SpaceX', 'headquarteredIn', 'Hawthorne'],
        ['Hawthorne', 'inState', 'California'],
        ['Greg Brockman', 'bornIn', 'North Dakota'],
  ['North Dakota', 'inCountry', 'USA'],
  ['Euro', 'currencyOf', 'Eurozone'],
  ['Eurozone', 'locatedIn', 'Europe']
      ];

      // Index by subject and by object for simple lookups
      const bySub = new Map(); const byObj = new Map();
      KG.forEach(([s,p,o],i)=>{ if(!bySub.has(s)) bySub.set(s,[]); bySub.get(s).push({s,p,o,i}); if(!byObj.has(o)) byObj.set(o,[]); byObj.get(o).push({s,p,o,i}); });

      function triplesToHTML(tris) {
        if (!tris.length) return '<div class="text-gray-500">No triples found.</div>';
        // Group triples by subject for compact visual scanning
        const groups = new Map();
        tris.forEach(t=>{ if(!groups.has(t.s)) groups.set(t.s, []); groups.get(t.s).push(t); });
        const badge = (p) => {
          const map = {
            foundedBy: 'bg-green-100 text-green-800 border-green-300',
            bornIn: 'bg-purple-100 text-purple-800 border-purple-300',
            inCountry: 'bg-orange-100 text-orange-800 border-orange-300',
            capitalOf: 'bg-indigo-100 text-indigo-800 border-indigo-300'
          };
          const cls = map[p] || 'bg-gray-100 text-gray-700 border-gray-300';
          return `<span class=\"px-1.5 py-0.5 rounded border text-xs font-medium ${cls}\" title=\"Predicate: ${p}\">${p}</span>`;
        };
        let html = '';
        groups.forEach((arr, subj)=>{
          html += `<div class=\"space-y-1\">`+
              `<div class=\"text-xs font-semibold text-gray-700 flex items-center gap-1\">`+
                `<span class=\"px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded border border-blue-300 text-xs\">${subj}</span>`+
                `<span class=\"text-gray-400 font-normal\">(${arr.length})</span>`+
            `</div>`;
          arr.forEach(t=>{ html += `<div id=\"q40-triple-${t.i+1}\" class=\"pl-2 flex items-center gap-2 transition-colors\">${badge(t.p)} <span class=\"font-mono text-xs\" title=\"Object: ${t.o}\">${t.o}</span><span class=\"text-gray-400 text-xs\">[#${t.i+1}]</span></div>`; });
          html += '</div>';
        });
        html += `<div class=\"pt-2 flex flex-wrap gap-1 border-t mt-2\" aria-label=\"Predicate legend\">`+
          `<span class=\"px-1.5 py-0.5 rounded bg-green-100 text-green-800 border border-green-300 text-xs\">foundedBy</span>`+
          `<span class=\"px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300 text-xs\">bornIn</span>`+
          `<span class=\"px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-300 text-xs\">inCountry</span>`+
          `<span class=\"px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300 text-xs\">capitalOf</span>`+
        `</div>`;
        return html;
      }

      function bar(label, value, color='indigo') {
        const pct = Math.max(0, Math.min(100, Math.round(value*100)));
        // Accessible progress bar
        return `<div>
          <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${(value*100).toFixed(0)}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded relative overflow-hidden\" role=\"progressbar\" aria-label=\"${label}\" aria-valuenow=\"${pct}\" aria-valuemin=\"0\" aria-valuemax=\"100\">
            <div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div>
          </div>
        </div>`;
      }

      function typeset(node) {
        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([node]).catch(()=>{});
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

      function buildGraphSpark(fullTris, retrievedTris) {
        if (!graphEl) return;
        const nodes = new Set();
        fullTris.forEach(t=>{ nodes.add(t.s); nodes.add(t.o); });
        const nodeList = Array.from(nodes).slice(0, 14);
        const idx = new Map(nodeList.map((n,i)=>[n,i]));
        const w = 260, h = 64, padX = 12; const step = nodeList.length>1 ? (w - padX*2)/(nodeList.length-1) : 0; const cy = h/2;
        const retrievedSet = new Set(retrievedTris.map(t=>`${t.s}|${t.p}|${t.o}`));
        let edges = '';
        fullTris.forEach(t=>{
          if (!idx.has(t.s) || !idx.has(t.o)) return;
          const x1 = padX + idx.get(t.s)*step;
          const x2 = padX + idx.get(t.o)*step;
          const stroke = retrievedSet.has(`${t.s}|${t.p}|${t.o}`) ? '#0d9488' : '#cbd5e1';
          edges += `<line x1='${x1}' y1='${cy-8}' x2='${x2}' y2='${cy+8}' stroke='${stroke}' stroke-width='1.5' />`;
        });
        let nodesSVG='';
        nodeList.forEach(n=>{
          const x = padX + idx.get(n)*step; const highlight = retrievedTris.some(t=>t.s===n || t.o===n);
          nodesSVG += `<g tabindex='0'><circle cx='${x}' cy='${cy}' r='8' fill='${highlight?'#10b981':'#fff'}' stroke='${highlight?'#047857':'#64748b'}' stroke-width='1.2' />`+
            `<text x='${x}' y='${cy+2}' text-anchor='middle' font-size='7' fill='${highlight?'#065f46':'#334155'}'>${n.slice(0,4)}</text></g>`;
        });
        // Make SVG responsive: use viewBox and width 100% so it scales to container
        graphEl.innerHTML = `<div class='text-[10px] font-medium text-gray-600 mb-1'>Graph spark (retrieved facts highlighted)</div>`+
          `<svg viewBox='0 0 ${w} ${h}' width='100%' height='${h}' role='img' aria-label='Knowledge graph overview' preserveAspectRatio='xMidYMid meet'>${edges}${nodesSVG}</svg>`;
      }

      function animatePathRibbon(container) {
        if (!container) return;
        pathTimers.forEach(id=>clearTimeout(id));
        pathTimers = [];
        const segs = Array.from(container.querySelectorAll('.q40-path-seg'));
        segs.forEach(s=>{ s.style.opacity='0'; });
        segs.forEach((s,i)=>{
          const id = setTimeout(()=>{ s.style.transition='opacity 160ms ease'; s.style.opacity='1'; }, 130*i);
          pathTimers.push(id);
        });
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
        },
        'marie-continent': {
          ask: "On which continent is Marie Curie's birth city?",
          retrieve: () => { const out=[]; const born=(bySub.get('Marie Curie')||[]).find(t=>t.p==='bornIn'); if(!born) return out; out.push(born); const cityEdges=bySub.get(born.o)||[]; const countryEdge=cityEdges.find(t=>t.p==='inCountry'); if(countryEdge){ out.push(countryEdge); const countryEdges=bySub.get(countryEdge.o)||[]; const continentEdge=countryEdges.find(t=>t.p==='locatedIn'); if(continentEdge){ out.push(continentEdge); const superEdge=(bySub.get(continentEdge.o)||[]).find(t=>t.p==='locatedIn'); if(superEdge) out.push(superEdge); } } return out; },
          answerFrom: (tris) => { const continent = tris.find(t=>t.p==='locatedIn' && (bySub.get('Marie Curie')||[]).some(b=>b.p==='bornIn' && (bySub.get(b.o)||[]).some(e=>e===tris.find(x=>x===t)))); const firstCountryLoc = tris.find(t=>t.p==='locatedIn' && ['Poland'].includes(t.s)); return firstCountryLoc? `Her birth city is on the continent of ${firstCountryLoc.o}.` : 'Answer unknown.'; },
          baseAcc: 0.55,
          path: ['Marie Curie','Europe']
        },
        'openai-hq-continent': {
          ask: 'On which continent is OpenAI headquartered?',
          retrieve: () => { const out=[]; const hq=(bySub.get('OpenAI')||[]).find(t=>t.p==='headquarteredIn'); if(!hq) return out; out.push(hq); const cityEdges=bySub.get(hq.o)||[]; const stateEdge=cityEdges.find(t=>t.p==='inState'); if(stateEdge){ out.push(stateEdge); const stateEdges=bySub.get(stateEdge.o)||[]; const countryEdge=stateEdges.find(t=>t.p==='inCountry'); if(countryEdge){ out.push(countryEdge); const countryEdges=bySub.get(countryEdge.o)||[]; const continentEdge=countryEdges.find(t=>t.p==='locatedIn'); if(continentEdge){ out.push(continentEdge); const planetEdge=(bySub.get(continentEdge.o)||[]).find(t=>t.p==='locatedIn'); if(planetEdge) out.push(planetEdge); } } } return out; },
          answerFrom: (tris) => { const continentEdge = tris.find(t=>t.p==='locatedIn' && t.o==='North America'); return continentEdge? 'OpenAI is headquartered in North America.' : 'Answer unknown.'; },
          baseAcc: 0.6,
          path: ['OpenAI','North America']
        },
        'sam-country': {
          ask: 'Which country was Sam Altman born in?',
          retrieve: () => { const out=[]; const born=(bySub.get('Sam Altman')||[]).find(t=>t.p==='bornIn'); if(!born) return out; out.push(born); const cityEdges=bySub.get(born.o)||[]; const stateEdge=cityEdges.find(t=>t.p==='inState'); if(stateEdge){ out.push(stateEdge); const stateEdges=bySub.get(stateEdge.o)||[]; const countryEdge=stateEdges.find(t=>t.p==='inCountry'); if(countryEdge) out.push(countryEdge); } return out; },
          answerFrom: (tris) => { const countryEdge = tris.find(t=>t.p==='inCountry'); return countryEdge? `He was born in ${countryEdge.o}.` : 'Answer unknown.'; },
          baseAcc: 0.6,
          path: ['Sam Altman','USA']
        },
        'ilya-field-root': {
          ask: "What broad field does Ilya Sutskever's specialty belong to?",
          retrieve: () => { const out=[]; const spec=(bySub.get('Ilya Sutskever')||[]).find(t=>t.p==='specializesIn'); if(!spec) return out; out.push(spec); let current=spec.o; const chain=[]; while(true){ const edge=(bySub.get(current)||[]).find(t=>t.p==='subFieldOf'); if(!edge) break; out.push(edge); current=edge.o; chain.push(edge.o); if(chain.length>5) break; } return out; },
          answerFrom: (tris) => { const root = tris.filter(t=>t.p==='subFieldOf').slice(-1)[0]; return root? `His specialty ultimately falls under ${root.o}.` : 'Answer unknown.'; },
          baseAcc: 0.55,
          path: ['Ilya Sutskever','Computer Science']
        }
      };

      function render() {
  covVal.textContent = parseFloat(covEl.value).toFixed(1);
  covEl.setAttribute('aria-valuenow', covEl.value);
        const task = TASKS[taskEl.value];
        const mode = modeEl.value;
        const cov = parseFloat(covEl.value);
        const cite = !!citeEl.checked;

  // Retrieve full fact set then subsample by coverage
  const fullTris = task.retrieve();
  const potential = fullTris.length;
  const keep = Math.max(0, Math.min(fullTris.length, Math.round(fullTris.length * cov)));
  let tris = fullTris.slice(0, keep);

        // Path reasoning if needed
        let pathEdges = [];
        if (mode === 'path' && task.path) {
          pathEdges = findPath(task.path[0], task.path[1]);
        }
        // Build path ribbon (if path exists) for quick multi-hop overview
        let pathRibbon = '';
        if (mode === 'path' && pathEdges.length) {
          const nodes = [pathEdges[0].s, ...pathEdges.map(e=>e.o)];
          const parts = nodes.map((n,i)=>{
            const pill = `<span class=\"q40-path-seg px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-medium\">${n}</span>`;
            if (i === nodes.length-1) return pill;
            const rel = pathEdges[i].p;
            return pill + `<span class=\"q40-path-seg text-gray-400\">→</span><span class=\"q40-path-seg px-1 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300\">${rel}</span><span class=\"q40-path-seg text-gray-400\">→</span>`;
          }).join('');
          pathRibbon = `<div id=\"q40-path-ribbon\" class=\"flex flex-wrap items-center gap-1 text-xs mb-2\" aria-label=\"Reasoning path (animated)\">${parts}`+
            `<button type=\"button\" class=\"q40-path-seg ml-2 px-1.5 py-0.5 text-xs rounded border bg-white hover:bg-gray-50\" aria-label=\"Replay path animation\" id=\"q40-path-replay\">Replay</button></div>`;
        }
        // Evidence panel (prepend path ribbon if present)
        const evidenceHTML = (pathRibbon || '') + triplesToHTML(tris);
  evEl.innerHTML = evidenceHTML;
  evEl.setAttribute('aria-label', `Retrieved triples count: ${tris.length}`);
        const pathFound = (mode==='path' && pathEdges.length>0);

        // Simulated accuracy & risk
        const hasFacts = tris.length > 0;
  // pathFound already computed above
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

  const cites = cite && hasFacts ? `<div class=\"text-xs text-gray-600\">Citations: ${tris.map(t=>`<a href=\"#\" data-triple=\"${t.i+1}\" class=\"underline hover:text-gray-800\" aria-label=\"Jump to triple ${t.i+1}\">[#${t.i+1}]</a>`).join(' ')}</div>` : '';
        const pathExplain = (mode==='path' && pathFound) ? `<div class=\"text-xs text-gray-700\">Path: ${pathEdges.map(e=> e.rev? `(${e.o}) -[${e.p}]→ (${e.s})` : `(${e.s}) -[${e.p}]→ (${e.o})`).join(' , ')}</div>` : '';

        outputEl.innerHTML = `<div>${answerText}</div>${cites}${pathExplain}`;

        // Metrics + coverage donut
        const ratio = potential ? (tris.length / potential) : 0;
        const size = 48; const stroke = 6; const r = (size/2) - stroke/2; const C = 2*Math.PI*r; const offset = C * (1 - ratio);
        const donut = `<div class=\"flex items-center gap-3\">`+
          `<svg width=\"${size}\" height=\"${size}\" role=\"img\" aria-label=\"Coverage ${tris.length} of ${potential}\">`+
            `<circle cx=\"${size/2}\" cy=\"${size/2}\" r=\"${r}\" stroke=\"#e5e7eb\" stroke-width=\"${stroke}\" fill=\"none\" />`+
            `<circle cx=\"${size/2}\" cy=\"${size/2}\" r=\"${r}\" stroke=\"#10b981\" stroke-width=\"${stroke}\" fill=\"none\" stroke-dasharray=\"${C.toFixed(2)}\" stroke-dashoffset=\"${offset.toFixed(2)}\" stroke-linecap=\"round\" transform=\"rotate(-90 ${size/2} ${size/2})\" />`+
            `<text x=\"50%\" y=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" font-size=\"10\" fill=\"#065f46\">${potential?Math.round(ratio*100):0}%</text>`+
          `</svg>`+
          `<div class=\"text-xs\"><div class=\"font-medium\">Coverage</div><div>${tris.length}/${potential} triples</div></div>`+
        `</div>`;
        metricsEl.innerHTML = `
          ${bar('Estimated accuracy', acc, 'emerald')}
          ${bar('Hallucination risk', risk, 'rose')}
          <div>Token estimate: <span class=\"font-mono\">~${Math.round(tokens)}</span></div>
          ${donut}
        `;
        buildGraphSpark(fullTris, tris);
        metricsEl.setAttribute('aria-live','polite');

        // Progressive expansion control (if coverage < 1 and more triples available)
        if (ratio < 0.999 && potential > tris.length) {
          metricsEl.innerHTML += `<button id=\"q40-expand\" class=\"mt-2 px-2 py-1 text-xs rounded border bg-white hover:bg-gray-50\" aria-label=\"Expand to full coverage\">Expand graph (+${potential-tris.length})</button>`;
        }

        // Explanation
        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div>With KG grounding, the model conditions on retrieved triples and optionally a reasoning path. More coverage and a found path typically improve accuracy and reduce risk.</div>
            <div class=\"overflow-x-auto whitespace-nowrap bg-white border rounded p-2\">$$P(\\text{answer} \\mid x, G) = f_\\theta\\big(x, \\phi(G_{x})\\big)$$</div>
            <div class=\"text-xs text-indigo-700\">Here \\(G_x\\) is the task-relevant subgraph (affected by coverage). If no triples are retrieved the model falls back to estimating \\(P(\\text{answer}\\mid x)\\), increasing hallucination risk.</div>
          </div>
        `;

        typeset(explainEl);
        const ribbon = document.getElementById('q40-path-ribbon');
        if (ribbon) {
          animatePathRibbon(ribbon);
          const replay = document.getElementById('q40-path-replay');
          if (replay) replay.onclick = () => animatePathRibbon(ribbon);
        }

        // Citation linking highlight
        outputEl.querySelectorAll('a[data-triple]').forEach(a=>{
          a.addEventListener('click', e=>{
            e.preventDefault();
            const id = a.getAttribute('data-triple');
            const target = document.getElementById(`q40-triple-${id}`);
            if (target) {
              target.scrollIntoView({behavior:'smooth', block:'center'});
              target.classList.add('ring','ring-amber-400','bg-amber-50');
              setTimeout(()=>{ target.classList.remove('ring','ring-amber-400','bg-amber-50'); }, 1600);
            }
          });
        });

        // Expansion button handler
        const expandBtn = document.getElementById('q40-expand');
        if (expandBtn) {
          expandBtn.onclick = () => { covEl.value = '1'; covEl.dispatchEvent(new Event('input')); };
        }
      }

      [taskEl, modeEl, covEl, citeEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    }
  }
};

// Export pattern
if (typeof module !== 'undefined') { module.exports = question; }
