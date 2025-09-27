const interactiveScript = () => {
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

      const ensureStyles = () => {
        if (document.getElementById('q40-styles')) return;
        const style = document.createElement('style');
        style.id = 'q40-styles';
        style.textContent = `
          .q40-triple-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.75rem;
            border-radius: 0.85rem;
            background: color-mix(in srgb, var(--panel-neutral-bg) 55%, transparent);
            border: 1px solid color-mix(in srgb, var(--panel-neutral-border) 60%, transparent);
          }
          html.dark .q40-triple-group {
            background: color-mix(in srgb, var(--panel-neutral-bg) 72%, transparent);
          }
          .q40-triple-row {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            padding: 0.45rem 0.6rem;
            border-radius: 0.75rem;
            border: 1px solid color-mix(in srgb, var(--color-border) 55%, transparent);
            background: color-mix(in srgb, var(--color-card) 92%, transparent);
            transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          }
          html.dark .q40-triple-row {
            border-color: color-mix(in srgb, var(--color-border) 65%, transparent);
            background: color-mix(in srgb, var(--color-card) 70%, transparent);
          }
          .q40-triple-object {
            font-family: var(--font-mono, 'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace);
            font-size: 0.75rem;
          }
          .q40-triple-id {
            margin-left: auto;
            color: var(--color-muted);
            font-size: 0.72rem;
          }
          .q40-triple-highlight {
            background: color-mix(in srgb, var(--panel-warning-border-strong) 28%, var(--color-card) 72%);
            border-color: color-mix(in srgb, var(--panel-warning-border-strong) 55%, transparent);
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--panel-warning-border-strong) 35%, transparent);
          }
          html.dark .q40-triple-highlight {
            background: color-mix(in srgb, var(--panel-warning-border-strong) 38%, transparent);
          }
          .q40-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            padding-top: 0.6rem;
            margin-top: 0.75rem;
            border-top: 1px solid var(--color-border);
          }
          .q40-meter {
            position: relative;
            height: 0.55rem;
            border-radius: 9999px;
            overflow: hidden;
            background: color-mix(in srgb, var(--color-border) 30%, transparent);
          }
          html.dark .q40-meter {
            background: color-mix(in srgb, var(--color-border) 48%, transparent);
          }
          .q40-meter-fill {
            height: 100%;
            border-radius: inherit;
            background: var(--q40-meter-fill, var(--accent-strong));
            transition: width 0.18s ease;
          }
          .q40-graph-label {
            font-size: 0.7rem;
            color: var(--color-muted);
            margin-bottom: 0.35rem;
          }
          .q40-path-ribbon {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.45rem;
            margin-bottom: 0.8rem;
          }
          .q40-path-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.2rem 0.7rem;
            border-radius: 9999px;
            border: 1px solid color-mix(in srgb, var(--panel-success-border-strong) 45%, transparent);
            background: color-mix(in srgb, var(--panel-success-bg) 62%, var(--color-card) 38%);
            color: var(--panel-success-heading);
            font-size: 0.75rem;
            font-weight: 600;
            opacity: 0;
          }
          html.dark .q40-path-chip {
            background: color-mix(in srgb, var(--panel-success-bg) 68%, transparent);
          }
          .q40-path-arrow {
            color: var(--color-muted);
            font-size: 0.75rem;
            opacity: 0;
          }
          .q40-path-predicate {
            display: inline-flex;
            align-items: center;
            padding: 0.2rem 0.55rem;
            border-radius: 0.7rem;
            border: 1px solid color-mix(in srgb, var(--panel-info-border-strong) 45%, transparent);
            background: color-mix(in srgb, var(--panel-info-bg) 62%, var(--color-card) 38%);
            color: var(--panel-info-heading);
            font-size: 0.75rem;
            font-weight: 500;
            opacity: 0;
          }
          html.dark .q40-path-predicate {
            background: color-mix(in srgb, var(--panel-info-bg) 70%, transparent);
          }
          .q40-spark {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
            font-size: 0.72rem;
            color: var(--color-muted);
          }
          .q40-spark-edge {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.35rem;
          }
          .q40-spark-node {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.18rem 0.55rem;
            border-radius: 9999px;
            border: 1px solid color-mix(in srgb, var(--panel-neutral-border) 60%, transparent);
            background: color-mix(in srgb, var(--panel-neutral-bg) 68%, var(--color-card) 32%);
            color: var(--color-heading);
            font-weight: 600;
            letter-spacing: 0.01em;
          }
          .q40-spark-node--active {
            border-color: color-mix(in srgb, var(--panel-success-border-strong) 45%, transparent);
            background: color-mix(in srgb, var(--panel-success-bg) 70%, var(--color-card) 30%);
            color: var(--panel-success-heading);
          }
          .q40-spark-predicate {
            display: inline-flex;
            align-items: center;
            padding: 0.18rem 0.55rem;
            border-radius: 0.7rem;
            border: 1px solid color-mix(in srgb, var(--panel-info-border-strong) 40%, transparent);
            background: color-mix(in srgb, var(--panel-info-bg) 70%, var(--color-card) 30%);
            color: var(--panel-info-heading);
            font-size: 0.72rem;
            font-weight: 500;
          }
          .q40-spark-arrow {
            color: var(--color-muted);
            font-size: 0.75rem;
          }
          .q40-spark-remainder {
            font-size: 0.72rem;
            color: var(--color-muted);
          }
          .q40-spark-empty {
            font-size: 0.72rem;
            color: var(--color-muted);
            font-style: italic;
            padding-top: 0.25rem;
          }

        `;
        document.head.append(style);
      };

      const tonePalettes = {
        info: {
          fill: 'var(--panel-info-border-strong)',
          track: 'color-mix(in srgb, var(--panel-info-border) 28%, transparent)'
        },
        success: {
          fill: 'var(--panel-success-border-strong)',
          track: 'color-mix(in srgb, var(--panel-success-border) 30%, transparent)'
        },
        warning: {
          fill: 'var(--panel-warning-border-strong)',
          track: 'color-mix(in srgb, var(--panel-warning-border) 32%, transparent)'
        },
        accent: {
          fill: 'var(--panel-accent-border-strong)',
          track: 'color-mix(in srgb, var(--panel-accent-border) 32%, transparent)'
        },
        neutral: {
          fill: 'var(--panel-neutral-border-strong)',
          track: 'color-mix(in srgb, var(--panel-neutral-border) 30%, transparent)'
        }
      };

      ensureStyles();
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
        if (!tris.length) return '<div class="text-xs text-muted">No triples found.</div>';
        const groups = new Map();
        tris.forEach(t => {
          if (!groups.has(t.s)) groups.set(t.s, []);
          groups.get(t.s).push(t);
        });
        const predicateChip = (p) => {
          const mapping = {
            foundedBy: 'chip chip-success text-xs',
            bornIn: 'chip chip-accent text-xs',
            inCountry: 'chip chip-warning text-xs',
            capitalOf: 'chip chip-info text-xs'
          };
          return `<span class="${mapping[p] || 'chip chip-neutral text-xs'}" title="Predicate: ${p}">${p}</span>`;
        };
        let html = '';
        groups.forEach((arr, subj) => {
          html += `<div class="q40-triple-group" data-subject="${subj}">` +
            `<div class="flex items-center gap-2 text-xs text-heading">` +
              `<span class="chip chip-info text-xs">${subj}</span>` +
              `<span class="text-muted">(${arr.length})</span>` +
            `</div>`;
          arr.forEach(t => {
            html += `<div id="q40-triple-${t.i+1}" class="q40-triple-row" data-predicate="${t.p}">` +
              `${predicateChip(t.p)}` +
              `<span class="q40-triple-object">${t.o}</span>` +
              `<span class="q40-triple-id">[#${t.i+1}]</span>` +
            `</div>`;
          });
          html += '</div>';
        });
        const legendItems = [
          ['foundedBy', 'chip chip-success text-xs'],
          ['bornIn', 'chip chip-accent text-xs'],
          ['inCountry', 'chip chip-warning text-xs'],
          ['capitalOf', 'chip chip-info text-xs']
        ];
        html += `<div class="q40-legend text-xs text-muted" aria-label="Predicate legend">` +
          legendItems.map(([label, cls]) => `<span class="${cls}">${label}</span>`).join('') +
        `</div>`;
        return html;
      }

      function bar(label, value, tone = 'info') {
        const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
        const palette = tonePalettes[tone] || tonePalettes.info;
        return `<div class="space-y-1">` +
          `<div class="flex items-center justify-between text-xs text-muted">` +
            `<span>${label}</span>` +
            `<span>${pct}%</span>` +
          `</div>` +
          `<div class="q40-meter" role="progressbar" aria-label="${label}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" style="background:${palette.track};">` +
            `<div class="q40-meter-fill" style="width:${pct}%; --q40-meter-fill:${palette.fill};"></div>` +
          `</div>` +
        `</div>`;
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
        if (!fullTris.length) {
          graphEl.innerHTML = '<div class=\"q40-spark-empty\">No knowledge graph facts available for this task.</div>';
          return;
        }
        if (!retrievedTris.length) {
          graphEl.innerHTML = '<div class=\"q40-graph-label\">Graph paths (retrieved triples)</div><div class=\"q40-spark-empty\">No triples retrieved yet. Increase coverage to explore the graph.</div>';
          return;
        }
        const limit = 5;
        const edges = retrievedTris.slice(0, limit);
        const arrow = '<span class=\"q40-spark-arrow\" aria-hidden=\"true\">→</span>';
        const segments = edges.map(t => {
          const subj = sparkNode(t.s, true);
          const obj = sparkNode(t.o, true);
          const predicate = `<span class=\"q40-spark-predicate\">${t.p}</span>`;
          return `<div class=\"q40-spark-edge\" role=\"listitem\" aria-label=\"${t.s} ${t.p} ${t.o}\">${subj}${arrow}${predicate}${arrow}${obj}</div>`;
        }).join('');
        const overflow = retrievedTris.length > limit ? retrievedTris.length - limit : 0;
        const remainingPool = Math.max(0, fullTris.length - retrievedTris.length);
        const overflowNote = overflow ? `<div class=\"q40-spark-remainder\">+${overflow} more retrieved triple${overflow > 1 ? 's' : ''} hidden for brevity.</div>` : '';
        const poolNote = remainingPool ? `<div class=\"q40-spark-remainder\">+${remainingPool} additional triple${remainingPool > 1 ? 's' : ''} still in the graph.</div>` : '';
        graphEl.innerHTML = `<div class=\"q40-graph-label\">Graph paths (retrieved triples)</div><div class=\"q40-spark\" role=\"list\">${segments}</div>${overflowNote}${poolNote}`;
      }

      function sparkNode(name, active) {
        const shortName = name.length > 18 ? `${name.slice(0, 16)}…` : name;
        const classes = `q40-spark-node${active ? ' q40-spark-node--active' : ''}`;
        return `<span class=\"${classes}\" title=\"${name}\">${shortName}</span>`;
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

        const fullTris = task.retrieve();
        const potential = fullTris.length;
        const keep = Math.max(0, Math.min(fullTris.length, Math.round(fullTris.length * cov)));
        const tris = fullTris.slice(0, keep);

        let pathEdges = [];
        if (mode === 'path' && task.path) {
          pathEdges = findPath(task.path[0], task.path[1]);
        }

        let pathRibbon = '';
        if (mode === 'path' && pathEdges.length) {
          const arrow = '&rarr;';
          const nodes = [pathEdges[0].s, ...pathEdges.map(e => e.o)];
          const parts = nodes.map((n, i) => {
            const chip = `<span class="q40-path-seg q40-path-chip">${n}</span>`;
            if (i === nodes.length - 1) return chip;
            const rel = pathEdges[i].p;
            return chip +
              `<span class="q40-path-seg q40-path-arrow" aria-hidden="true">${arrow}</span>` +
              `<span class="q40-path-seg q40-path-predicate">${rel}</span>` +
              `<span class="q40-path-seg q40-path-arrow" aria-hidden="true">${arrow}</span>`;
          }).join('');
          pathRibbon = `<div id="q40-path-ribbon" class="q40-path-ribbon text-xs" aria-label="Reasoning path (animated)">${parts}` +
            `<button type="button" class="q40-path-seg btn-soft text-xs px-2 py-1" aria-label="Replay path animation" id="q40-path-replay">Replay</button></div>`;
        }

        const evidenceHTML = (pathRibbon || '') + triplesToHTML(tris);
        evEl.innerHTML = evidenceHTML;
        evEl.setAttribute('aria-label', `Retrieved triples count: ${tris.length}`);
        const pathFound = (mode === 'path' && pathEdges.length > 0);

        const hasFacts = tris.length > 0;
        let acc = task.baseAcc - 0.15;
        if (mode === 'kg') acc = task.baseAcc + (hasFacts ? 0.2 * cov : 0.0);
        if (mode === 'path') acc = task.baseAcc + (hasFacts ? 0.15 * cov : 0.0) + (pathFound ? 0.15 : 0.0);
        acc = Math.max(0.05, Math.min(0.99, acc));
        const risk = 1 - acc;

        const baseTokens = 40;
        const perTriple = 14;
        const perEdgeExplain = 10;
        const tokens = baseTokens + tris.length * perTriple + (mode === 'path' ? pathEdges.length * perEdgeExplain : 0);

        const answerText = (mode === 'llm' || !hasFacts)
          ? `${task.ask.replace('?', '')}: ${mode === 'llm' ? 'Likely answer.' : 'Attempted answer (limited evidence).'}`
          : task.answerFrom(tris);

        const cites = cite && hasFacts
          ? `<div class="text-xs text-muted">Citations: ${tris.map(t => `<a href="#" data-triple="${t.i + 1}" class="underline" aria-label="Jump to triple ${t.i + 1}">[#${t.i + 1}]</a>`).join(' ')}</div>`
          : '';
        const arrowEntity = '&rarr;';
        const pathExplain = (mode === 'path' && pathFound)
          ? `<div class="text-xs text-muted">Path: ${pathEdges.map(e => e.rev ? `(${e.o}) -[${e.p}]${arrowEntity} (${e.s})` : `(${e.s}) -[${e.p}]${arrowEntity} (${e.o})`).join(' , ')}</div>`
          : '';

        outputEl.innerHTML = `<div>${answerText}</div>${cites}${pathExplain}`;

        const ratio = potential ? (tris.length / potential) : 0;
        const size = 48;
        const stroke = 6;
        const r = (size / 2) - stroke / 2;
        const C = 2 * Math.PI * r;
        const offset = C * (1 - ratio);
        const donut = `<div class="flex items-center gap-3 text-xs text-muted">` +
          `<svg width="${size}" height="${size}" role="img" aria-label="Coverage ${tris.length} of ${potential}">` +
            `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="color-mix(in srgb, var(--color-border) 35%, transparent)" stroke-width="${stroke}" fill="none" />` +
            `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" stroke="var(--panel-success-border-strong)" stroke-width="${stroke}" fill="none" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${size / 2} ${size / 2})" />` +
            `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="10" fill="var(--panel-success-heading)">${potential ? Math.round(ratio * 100) : 0}%</text>` +
          `</svg>` +
          `<div class="space-y-0.5"><div class="font-medium text-heading">Coverage</div><div>${tris.length}/${potential} triples</div></div>` +
        `</div>`;

        metricsEl.innerHTML = [
          bar('Estimated accuracy', acc, 'success'),
          bar('Hallucination risk', risk, 'warning'),
          `<div class="text-xs text-muted">Token estimate: <span class="font-mono text-heading">~${Math.round(tokens)}</span></div>`,
          donut
        ].join('');
        buildGraphSpark(fullTris, tris);
        metricsEl.setAttribute('aria-live', 'polite');

        if (ratio < 0.999 && potential > tris.length) {
          metricsEl.innerHTML += `<button id="q40-expand" class="btn-soft text-xs px-2 py-1 mt-2" aria-label="Expand to full coverage">Expand graph (+${potential - tris.length})</button>`;
        }

        const mathBlock = String.raw`$$P(\text{answer} \mid x, G) = f_\theta\big(x, \phi(G_{x})\big)$$`;
        const mathNote = String.raw`Here \(G_x\) is the task-relevant subgraph (affected by coverage). If no triples are retrieved the model falls back to estimating \(P(\text{answer}\mid x)\), increasing hallucination risk.`;
        explainEl.innerHTML = `
          <div class="space-y-2">
            <div>With KG grounding, the model conditions on retrieved triples and optionally a reasoning path. More coverage and a found path typically improve accuracy and reduce risk.</div>
            <div class="math-display">${mathBlock}</div>
            <div class="text-xs text-muted">${mathNote}</div>
          </div>
        `;

        typeset(explainEl);
        const ribbon = document.getElementById('q40-path-ribbon');
        if (ribbon) {
          animatePathRibbon(ribbon);
          const replay = document.getElementById('q40-path-replay');
          if (replay) replay.onclick = () => animatePathRibbon(ribbon);
        }

        outputEl.querySelectorAll('a[data-triple]').forEach(anchor => {
          anchor.addEventListener('click', event => {
            event.preventDefault();
            const id = anchor.getAttribute('data-triple');
            const target = document.getElementById(`q40-triple-${id}`);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              target.classList.add('q40-triple-highlight');
              setTimeout(() => target.classList.remove('q40-triple-highlight'), 1600);
            }
          });
        });

        const expandBtn = document.getElementById('q40-expand');
        if (expandBtn) {
          expandBtn.onclick = () => { covEl.value = '1'; covEl.dispatchEvent(new Event('input')); };
        }
      }

      [taskEl, modeEl, covEl, citeEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question40Interactive = interactiveScript;
}
