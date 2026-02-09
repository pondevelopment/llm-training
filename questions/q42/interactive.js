const interactiveScript = () => {
      // Phase 3 additions + existing logic merged
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

      const baselineToggle = document.getElementById('q42-baseline');
      const copyBtn = document.getElementById('q42-copy');
  const exportBtn = document.getElementById('q42-export');
      const sparkEl = document.getElementById('q42-spark');
      const sparkInfoEl = document.getElementById('q42-spark-info');
      const sparkLegend = document.getElementById('q42-spark-legend');
      const sparkChips = Array.from(document.querySelectorAll('[data-spark-chip]'));
      const highlightSparkChip = (tone) => {
        sparkChips.forEach(chip => {
          const isActive = !!tone && chip.dataset.sparkChip === tone;
          if (isActive) {
            chip.classList.add('is-active');
            chip.setAttribute('aria-current', 'true');
          } else {
            chip.classList.remove('is-active');
            chip.removeAttribute('aria-current');
          }
        });
      };
      // Persist default sparkline message even if dataset is unsupported
      let sparkInfoDefaultText = '';
      const setSparkInfoDefault = (value) => {
        sparkInfoDefaultText = value;
        if (!sparkInfoEl) return;
        if (sparkInfoEl.dataset) {
          sparkInfoEl.dataset.default = value;
        } else {
          sparkInfoEl.setAttribute('data-default', value);
        }
      };

      const getSparkInfoDefault = () => {
        if (!sparkInfoEl) return sparkInfoDefaultText;
        if (sparkInfoEl.dataset && 'default' in sparkInfoEl.dataset) {
          return sparkInfoEl.dataset.default;
        }
        const fallback = sparkInfoEl.getAttribute('data-default');
        return fallback || sparkInfoDefaultText;
      };

      // existing already-declared elements
      const vocabEl = document.getElementById('q42-vocab');
      const zipfEl = document.getElementById('q42-zipf');
      const zipfVal = document.getElementById('q42-zipf-val');
      const cutoffsEl = document.getElementById('q42-cutoffs');
      const alphasEl = document.getElementById('q42-alphas');
      const dimEl = document.getElementById('q42-dim');
      const alphaDetailEl = document.getElementById('q42-alpha-detail');
      const resultsEl = document.getElementById('q42-results');
      const metricsEl = document.getElementById('q42-metrics');
      const coverageEl = document.getElementById('q42-coverage');
      const explainEl = document.getElementById('q42-explain');
      const presetButtons = Array.from(document.querySelectorAll('[data-preset]'));
      const resetBtn = document.getElementById('q42-reset');
      const advToggle = document.getElementById('q42-adv-toggle');
      const adv1 = document.getElementById('q42-adv-1');
      const adv2 = document.getElementById('q42-adv-2');
      const freezeBtn = document.getElementById('q42-freeze');
      const clearBtn = document.getElementById('q42-clear');
      const compareEl = document.getElementById('q42-compare');
      const sensitivityEl = document.getElementById('q42-sensitivity');
  // Only hard-require core inputs + coverage panel so partial layouts still function
  if (!vocabEl || !coverageEl) return; // safety guard (allow missing results/metrics/explain sections)

      const BASE_D = 1024; // reference hidden dimension
      let prevD = null, prevRelCompute = null, prevRelParams = null;
      const frozen = [];

      function fmt(n){
        const abs = Math.abs(n);
        if (abs >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (abs >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (abs >= 1e3) return (n/1e3).toFixed(2)+'k';
        return n.toFixed(0);
      }
      function fmtSigned(n){ return (n>=0?'+':'') + fmt(n); }
      function pct(x){ return (x*100).toFixed(1)+'%'; }

      function parseCutoffs(str, V){
        const parts = (str||'').split(',').map(s => s.trim()).filter(Boolean).map(x => x.toLowerCase().replace(/k$/,'000')).map(Number).filter(n=>Number.isFinite(n));
        let c1 = Math.max(1, Math.min(V-2, parts[0]||Math.round(V*0.2)));
        let c2 = Math.max(c1+1, Math.min(V-1, parts[1]||Math.round(V*0.6)));
        return [c1, c2];
      }
      function parseAlphas(str){
        const a = (str||'').split(',').map(s=>parseFloat(s.trim())).filter(x=>x>0 && x<=1);
        return [a[0]||0.5, a[1]||0.25];
      }
      // Memoized Zipf mass computation (Phase 4 performance improvement)
      const zipfCache = new Map(); // key: `${V}|${s}|${c1}|${c2}`
      function zipfMasses(V, s, c1, c2){
        const key = V+"|"+s+"|"+c1+"|"+c2;
        if(zipfCache.has(key)) return zipfCache.get(key);
        let H = 0, Hc1 = 0, Hc2 = 0;
        for (let r=1; r<=V; r++){
          const v = 1/Math.pow(r, s);
          H += v; if (r<=c1) Hc1 += v; if (r<=c2) Hc2 += v;
        }
        const res = {pHead: Hc1 / H, pTail1: (Hc2 - Hc1)/H, pTail2: 1 - (Hc2 / H)};
        zipfCache.set(key, res);
        // Simple cache size guard
        if(zipfCache.size > 80){ zipfCache.clear(); }
        return res;
      }
      function meter(label, fraction, tone, opts = {}) {
        const rawPct = fraction * 100;
        const pct = Math.max(0, Math.min(100, rawPct));
        const rightLabel = opts.rightLabel ?? `${rawPct.toFixed(1)}%`;
        const helper = opts.helper ? `<div class="q42-meter-helper">${opts.helper}</div>` : '';
        const ghostLayer = opts.ghost ? '<div class="q42-meter-ghost"></div>' : '';
        return `<div class="q42-meter" data-tone="${tone}">
  <div class="q42-meter-header"><span>${label}</span><span>${rightLabel}</span></div>
  <div class="q42-meter-track">${ghostLayer}<div class="q42-meter-fill" style="width:${pct}%"></div></div>
  ${helper}
</div>`;
      }

      function ratioMeter(label, ratio, tone) {
        return meter(label, ratio, tone, { rightLabel: `${(ratio * 100).toFixed(0)}% (×${ratio.toFixed(2)})` });
      }

      function coverageRow(label, mass, tone) {
        const perMillion = Math.round(mass * 1_000_000);
        return meter(label, mass, tone, {
          rightLabel: `${(mass * 100).toFixed(1)}%`,
          helper: `≈ ${fmt(perMillion)} tokens / 1M`
        });
      }

      function highlight(el) {
        if (!el) return;
        el.classList.add('q42-highlight');
        setTimeout(() => el.classList.remove('q42-highlight'), 400);
      }
      function applyPreset(name){
        switch(name){
          case 'balanced': cutoffsEl.value = '10000,30000'; alphasEl.value = '0.50,0.25'; dimEl.value = '1024'; break;
          case 'aggressive': cutoffsEl.value = '8000,25000'; alphasEl.value = '0.35,0.15'; dimEl.value = '1024'; break;
          case 'widehead': cutoffsEl.value = '15000,45000'; alphasEl.value = '0.50,0.25'; dimEl.value = '1024'; break;
          case 'compression': cutoffsEl.value = '10000,30000'; alphasEl.value = '0.50,0.125'; dimEl.value = '1024'; break;
        }
        render();
      }

      presetButtons.forEach(btn => btn.addEventListener('click', () => applyPreset(btn.dataset.preset)));
      resetBtn?.addEventListener('click', () => { applyPreset('balanced'); zipfEl.value = '1.08'; render(); });

      advToggle?.addEventListener('click', () => {
        const expanded = advToggle.getAttribute('aria-expanded') === 'true';
        advToggle.setAttribute('aria-expanded', String(!expanded));
        advToggle.textContent = !expanded ? 'Hide advanced ▴' : 'Show advanced ▾';
        [adv1, adv2].forEach(div => { if(!div) return; if (!expanded) div.classList.remove('hidden'); else div.classList.add('hidden'); });
      });

      freezeBtn?.addEventListener('click', () => {
        const snap = currentSnapshot;
        if(!snap) return;
        frozen.push(snap);
        if (frozen.length > 4) frozen.shift();
        renderCompare();
      });
      clearBtn?.addEventListener('click', () => { frozen.length = 0; renderCompare(); });

      let currentSnapshot = null;

      function renderCompare() {
        if (!compareEl) return;
        if (frozen.length === 0) {
          compareEl.innerHTML = '<div class="small-caption panel-muted">No frozen scenarios yet.</div>';
          return;
        }
        const base = frozen[0];
        compareEl.innerHTML = `<div class='q42-table-wrapper'>
  <table class='q42-table'>
    <thead>
      <tr>
        <th>#</th>
        <th>Cutoffs</th>
        <th>α</th>
        <th>d</th>
        <th>Rel compute</th>
        <th>Rel params</th>
        <th>Speed-up</th>
        <th>Param save</th>
      </tr>
    </thead>
    <tbody>${frozen.map((f, i) => {
      const dComp = f.relCompute - base.relCompute;
      const dParam = f.relParams - base.relParams;
      const compDiff = i > 0 ? ` <span class='${dComp < 0 ? 'text-success' : 'text-danger'}'>(${dComp >= 0 ? '+' : ''}${dComp.toFixed(3)})</span>` : '';
      const paramDiff = i > 0 ? ` <span class='${dParam < 0 ? 'text-success' : 'text-danger'}'>(${dParam >= 0 ? '+' : ''}${dParam.toFixed(3)})</span>` : '';
      return `<tr class='${i === 0 ? 'q42-row-baseline' : ''}'>
        <td class='font-mono'>${i + 1}</td>
        <td>${f.head}|${f.tail1}|${f.tail2}</td>
        <td class='font-mono'>${f.a1}, ${f.a2}</td>
        <td class='font-mono'>${f.d}</td>
        <td class='font-mono'>${f.relCompute.toFixed(3)}${compDiff}</td>
        <td class='font-mono'>${f.relParams.toFixed(3)}${paramDiff}</td>
        <td class='font-mono'>${f.speedup.toFixed(2)}×</td>
        <td class='font-mono'>${(f.paramSave * 100).toFixed(1)}%</td>
      </tr>`;
    }).join('')}
    </tbody>
  </table>
</div>`;
      }
      function sensitivityAdvice(computeHead, computeTail1, computeTail2, paramHead, paramTail1, paramTail2, paramClusters){
        const computeParts = [
          {k:'Head', v:computeHead, hint:'Reduce head cutoff or increase tail splits.'},
          {k:'Tail 1', v:computeTail1, hint:'Lower α₁ or narrow tail 1 cutoff range.'},
          {k:'Tail 2', v:computeTail2, hint:'Lower α₂ or widen head/tail 1 to shrink tail 2.'}
        ];
        const top = computeParts.sort((a,b)=>b.v-a.v)[0];
        const paramParts = [
          {k:'Head', v:paramHead, hint:'Reduce head cutoff.'},
          {k:'Tail 1', v:paramTail1, hint:'Lower α₁ or reduce tail 1 size.'},
          {k:'Tail 2', v:paramTail2, hint:'Lower α₂ or reduce tail 2 size.'},
          {k:'Clusters', v:paramClusters, hint:'Reduce number of tails (merge) or head size.'}
        ].sort((a,b)=>b.v-a.v);
        const pTop = paramParts[0];
  sensitivityEl.innerHTML = `<div class=\"leading-snug\"><span class=\"font-semibold\">Sensitivity:</span> Compute dominated by <b>${top.k}</b>; ${top.hint} Params dominated by <b>${pTop.k}</b>; ${pTop.hint}</div>`;
      }

      function render(){
        const V = parseInt(vocabEl.value, 10);
        const s = parseFloat(zipfEl.value);
        zipfVal.textContent = s.toFixed(2);
        const [c1, c2] = parseCutoffs(cutoffsEl.value, V);
        const [a1, a2] = parseAlphas(alphasEl.value || '0.5,0.25');
        const d = Math.max(128, parseInt(dimEl.value||'1024',10)||1024);
        const head = c1; const tail1 = Math.max(0, c2 - c1); const tail2 = Math.max(0, V - c2);
        const C = (tail1>0?1:0) + (tail2>0?1:0);
        const {pHead, pTail1, pTail2} = zipfMasses(V, s, c1, c2);
        const tail1Dim = Math.round(a1*d); const tail2Dim = Math.round(a2*d);

        // Compute costs
        const Cfull = d * V;
        const computeHead = d * (head + C);
        const computeTail1 = (pTail1 * (a1*d) * tail1);
        const computeTail2 = (pTail2 * (a2*d) * tail2);
        const Cadapt = computeHead + computeTail1 + computeTail2;
        const speedup = Cfull / Cadapt;

        // Parameters
        const Pfull = d * V;
        const paramHead = d * head;
        const paramTail1 = (a1*d) * tail1;
        const paramTail2 = (a2*d) * tail2;
        const paramClusters = d * C;
        const Padapt = paramHead + paramTail1 + paramTail2 + paramClusters;
        const paramSave = 1 - (Padapt / Pfull);

        // Coverage (always present)
        coverageEl.innerHTML = [
          coverageRow(`Head (1..${head}) mass`, pHead, 'head'),
          coverageRow(`Tail 1 (${head+1}..${c2}) mass`, pTail1, 'tail1'),
          coverageRow(`Tail 2 (${c2+1}..${V}) mass`, pTail2, 'tail2')
        ].join('');

        // Results (optional section)
        if (resultsEl) {
          resultsEl.innerHTML = `
            <div>Cutoffs → head=<strong>${head}</strong>, tail 1=<strong>${tail1}</strong>, tail 2=<strong>${tail2}</strong>, clusters=<strong>${C}</strong></div>
            <div>Tail dims → α₁=<span class="font-mono">${a1}</span> (d₁=${tail1Dim}), α₂=<span class="font-mono">${a2}</span> (d₂=${tail2Dim})</div>
            <div>Hidden dim d=<span class="font-mono">${d}</span>, V=<span class="font-mono">${V.toLocaleString()}</span></div>
          `;
        }
        alphaDetailEl && (alphaDetailEl.textContent = `Tail 1 dim = α₁·d = ${a1}×${d} = ${tail1Dim}; Tail 2 dim = α₂·d = ${a2}×${d} = ${tail2Dim}`);

        // Relative metrics
        const relCompute = Cadapt / Cfull;
        const relParams = Padapt / Pfull;
        const baselineScale = d / BASE_D;
        const Cadapt0 = BASE_D * (head + C) + (pTail1 * (a1*BASE_D) * tail1) + (pTail2 * (a2*BASE_D) * tail2);
        const Padapt0 = BASE_D * head + (a1*BASE_D) * tail1 + (a2*BASE_D) * tail2 + BASE_D * C;

        const eqCompute = `C_adapt = d·(V_h + C) + p₁·(α₁ d)·V₁ + p₂·(α₂ d)·V₂ = ${d}·(${head}+${C}) + ${pTail1.toFixed(3)}·(${a1}·${d})·${tail1} + ${pTail2.toFixed(3)}·(${a2}·${d})·${tail2} ≈ ${fmt(Cadapt)}`;
        const eqParams = `P_adapt = d·V_h + (α₁ d)·V₁ + (α₂ d)·V₂ + d·C = ${d}·${head} + (${a1}·${d})·${tail1} + (${a2}·${d})·${tail2} + ${d}·${C} ≈ ${fmt(Padapt)}`;

        const computeBreak = [
          { label: 'Head + clusters', val: computeHead },
          { label: 'Tail 1 expected', val: computeTail1 },
          { label: 'Tail 2 expected', val: computeTail2 }
        ];
        const paramBreak = [
          { label: 'Head weights', val: paramHead },
          { label: 'Tail 1 weights', val: paramTail1 },
          { label: 'Tail 2 weights', val: paramTail2 },
          { label: 'Cluster tokens', val: paramClusters }
        ];
        function breakdownHTML(title, arr, total) {
          const rows = arr.map(item => {
            const share = total > 0 ? (item.val / total) * 100 : 0;
            return `<div class="q42-breakdown-row" role="listitem">
  <span class="q42-breakdown-label">${item.label}</span>
  <span class="q42-breakdown-value"><span class="q42-breakdown-value-main">${share.toFixed(1)}%</span><span class="q42-breakdown-note">≈ ${fmt(item.val)}</span></span>
</div>`;
          }).join('');
          return `<div class="panel panel-neutral-soft q42-breakdown-card">
  <div class="q42-breakdown-title">${title}</div>
  <div class="q42-breakdown-list" role="list">${rows}</div>
</div>`;
        }

        if (metricsEl) {
          const ghost = Boolean(baselineToggle?.checked);
          metricsEl.innerHTML = `
              ${meter('Relative compute (adaptive vs full)', relCompute, 'emerald', { ghost, rightLabel: `${(relCompute * 100).toFixed(1)}%` })}
              ${meter('Relative parameters (adaptive vs full)', relParams, 'amber', { ghost, rightLabel: `${(relParams * 100).toFixed(1)}%` })}
              ${ratioMeter('Adaptive compute vs baseline (d₀=1024)', Cadapt / Cadapt0, 'sky')}
              ${ratioMeter('Classifier params vs baseline (d₀=1024)', Padapt / Padapt0, 'teal')}
            <div class="q42-summary">
              <span>Speed-up factor: <span class="font-mono">${speedup.toFixed(2)}×</span></span>
              <span>Param savings: <span class="font-mono">${(paramSave * 100).toFixed(1)}%</span></span>
            </div>
            <div class="panel panel-neutral-soft q42-equations">
              <div class="font-semibold text-heading text-xs">Instantiated equations</div>
              <div class="font-mono">${eqCompute}</div>
              <div class="font-mono mt-1">${eqParams}</div>
            </div>
            <div class="q42-breakdown-grid">
              ${breakdownHTML('Compute breakdown', computeBreak, Cadapt)}
              ${breakdownHTML('Parameter breakdown', paramBreak, Padapt)}
            </div>
            <div class="small-caption text-muted">Baseline scaling: d/d₀ = ×${baselineScale.toFixed(2)} (d₀=${BASE_D}). Absolute compute: full=${fmt(Cfull)}, adaptive ≈ ${fmt(Cadapt)}. Params: full=${fmt(Pfull)}, adaptive ≈ ${fmt(Padapt)}.</div>
            ${prevD !== null && prevD !== d ? `<div class="text-xs text-muted">Δd=${d - prevD}: Δcompute ≈ <span class="font-mono">${fmtSigned((d - prevD) * (head + C + pTail1 * (a1) * tail1 + pTail2 * (a2) * tail2))}</span>, Δparams ≈ <span class="font-mono">${fmtSigned((d - prevD) * (head + C + a1 * tail1 + a2 * tail2))}</span></div>` : ''}
            <div id="q42-guidance" class="text-xs text-muted"></div>
          `;
          const guidanceEl = document.getElementById('q42-guidance');
          if (guidanceEl) {
            let advice = '';
            if (relCompute > 0.55) advice += 'Compute still high; reduce head or shrink α values. ';
            if (relParams > 0.55) advice += 'Parameters dominated by head/tails; lower α or head cutoff. ';
            if (speedup < 1.5) advice += 'Speed-up is modest; consider more aggressive tail compression.';
            if (!advice) advice = 'Configuration is already efficient; deeper compression may hit accuracy.';
            guidanceEl.textContent = advice.trim();
          }
        }



        // Metric change highlighting
        if (prevRelCompute !== null && Math.abs(relCompute - prevRelCompute) > 0.01) highlight(metricsEl);
        if (prevRelParams !== null && Math.abs(relParams - prevRelParams) > 0.01) highlight(metricsEl);

        sensitivityAdvice(computeHead, computeTail1, computeTail2, paramHead, paramTail1, paramTail2, paramClusters);

        if (explainEl) {
          explainEl.innerHTML = `Adaptive Softmax computes <strong>head</strong> logits for every example and only the <strong>gold tail</strong>. Head size and Zipf skew decide how much mass is captured early; α shrinks tail projection dims to cut compute.`;
          if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
        }

        prevD = d; prevRelCompute = relCompute; prevRelParams = relParams;

        currentSnapshot = { head, tail1, tail2, a1, a2, d, relCompute, relParams, speedup, paramSave };
        renderCompare();
  // Update sparkline with current distribution & cutoffs
  buildSpark(s, V, c1, c2);
  // Update spark accessibility label
  if(sparkEl){ sparkEl.setAttribute('role','img'); sparkEl.setAttribute('aria-label',`Zipf distribution approximation for V=${V}, head ≤ ${c1}, tail 1 ≤ ${c2}`); }
      }

      [vocabEl, zipfEl, cutoffsEl, alphasEl, dimEl].forEach(el=>{ el?.addEventListener('input', render); el?.addEventListener('change', render); });
      render();

      // Parse hash params if present (#question-42?v=...&s=...&c=...&a=...&d=...)
      (function initFromHash(){
        if (!location.hash) return;
        const m = location.hash.match(/question-42\?(.*)$/);
        if(!m) return;
        const params = new URLSearchParams(m[1]);
        const v = params.get('v'); const s = params.get('s'); const c = params.get('c'); const a = params.get('a'); const d = params.get('d');
        if (v) { const el = document.getElementById('q42-vocab'); if (el) el.value = v; }
        if (s) { const el = document.getElementById('q42-zipf'); if (el) el.value = s; }
        if (c) { const el = document.getElementById('q42-cutoffs'); if (el) el.value = c; }
        if (a) { const el = document.getElementById('q42-alphas'); if (el) el.value = a; }
        if (d) { const el = document.getElementById('q42-dim'); if (el) el.value = d; }
      })();

      // Copy permalink generator
      copyBtn?.addEventListener('click', () => {
        const v = document.getElementById('q42-vocab')?.value;
        const s = document.getElementById('q42-zipf')?.value;
        const c = document.getElementById('q42-cutoffs')?.value;
        const a = document.getElementById('q42-alphas')?.value;
        const d = document.getElementById('q42-dim')?.value;
        const params = new URLSearchParams({v: v||'', s: s||'', c: c||'', a: a||'', d: d||''});
        const url = `${location.origin}${location.pathname}#question-42?${params.toString()}`;
        navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
      });

      // Sparkline builder (approximate Zipf over sample ranks)
      function buildSpark(s, V, c1, c2){
        if(!sparkEl) return;
        const W = sparkEl.clientWidth || 260;
        const H = 56;
        const sample = 180;
        const step = V / sample;
        const weights = [];
        for (let i = 0; i < sample; i++) {
          const r = 1 + i * step;
          const w = 1 / Math.pow(r, s);
          weights.push(w);
        }
        const maxW = Math.max(...weights);
        const fillColors = {
          head: `${getCssVar('--tone-indigo-strong', '#6366f1')}38`,
          tail1: `${getCssVar('--tone-purple-strong', '#a855f7')}33`,
          tail2: `${getCssVar('--tone-rose-strong', '#f43f5e')}2e`
        };
        const strokeColors = {
          head: `${getCssVar('--tone-indigo-strong', '#6366f1')}80`,
          tail1: `${getCssVar('--tone-purple-strong', '#a855f7')}80`,
          tail2: `${getCssVar('--tone-rose-strong', '#f43f5e')}80`
        };
        const segments = [
          { start: 0, end: Math.min(c1, V), tone: 'head' },
          { start: Math.min(c1, V), end: Math.min(c2, V), tone: 'tail1' },
          { start: Math.min(c2, V), end: V, tone: 'tail2' }
        ].filter(seg => seg.end > seg.start);
        const rects = segments.map(seg => {
          const x = (seg.start / V) * W;
          const width = ((seg.end - seg.start) / V) * W;
          return `<rect x="${x}" y="0" width="${width}" height="${H}" fill="${fillColors[seg.tone]}"/>`;
        }).join('');
        const linesSvg = weights.map((w, i) => {
          const x = (i / (sample - 1)) * W;
          const h = (w / maxW) * (H - 6);
          return `<line x1="${x.toFixed(2)}" x2="${x.toFixed(2)}" y1="${H}" y2="${(H - h).toFixed(2)}" stroke="${getCssVar('--color-muted', '#94a3b8')}59" stroke-width="1"/>`;
        }).join('');
        const boundaries = [];
        if (c1 > 0 && c1 < V) {
          const x1 = (c1 / V) * W;
          boundaries.push(`<line x1="${x1}" x2="${x1}" y1="0" y2="${H}" stroke="${strokeColors.head}" stroke-dasharray="4,3" stroke-width="1"/>`);
        }
        if (c2 > 0 && c2 < V) {
          const x2 = (c2 / V) * W;
          boundaries.push(`<line x1="${x2}" x2="${x2}" y1="0" y2="${H}" stroke="${strokeColors.tail1}" stroke-dasharray="4,3" stroke-width="1"/>`);
        }
        sparkEl.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${rects}${linesSvg}${boundaries.join('')}</svg>`;
        sparkLegend && (sparkLegend.textContent = `V=${V.toLocaleString()} • head ≤ ${c1} • tail 1 ≤ ${c2}`);
        const defaultInfo = 'Hover to inspect rank coverage; shaded regions mark head/tail buckets.';
        setSparkInfoDefault(defaultInfo);
        if (sparkInfoEl) {
          sparkInfoEl.textContent = defaultInfo;
        }
        highlightSparkChip(null);
        sparkEl.onmousemove = (e) => {
          const rect = sparkEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const ratio = Math.min(1, Math.max(0, x / rect.width));
          const rank = Math.max(1, Math.round(ratio * V));
          const tone = rank <= c1 ? 'head' : (rank <= c2 ? 'tail1' : 'tail2');
          highlightSparkChip(tone);
          if (sparkInfoEl) {
            const bucketLabel = tone === 'head' ? 'Head' : tone === 'tail1' ? 'Tail 1' : 'Tail 2';
            const approx = (1 / Math.pow(rank, s)).toExponential(2);
            sparkInfoEl.textContent = `Rank ${rank.toLocaleString()} → ${bucketLabel} · 1/r^s ≈ ${approx}`;
          }
        };
        sparkEl.onmouseleave = () => {
          highlightSparkChip(null);
          if (sparkInfoEl) sparkInfoEl.textContent = getSparkInfoDefault();
        };
      }

      // Re-render when baseline overlay toggled
      baselineToggle?.addEventListener('change', render);

      // Inject baseline overlay augment by observing metricsEl content replace and re-writing when toggle is on.
      const observer = new MutationObserver(()=>{
        // parse current numbers if baseline overlay requested
        if(!baselineToggle?.checked || !metricsEl) return;
        if(metricsEl.querySelector('[data-baseline-overlay]')) return; // already added
        const absLine = Array.from(metricsEl.querySelectorAll('div')).find(d=>d.textContent?.includes('Absolute compute'));
        // We already have absolute lines; add a subtle overlay banner
        const overlay = document.createElement('div');
        overlay.setAttribute('data-baseline-overlay','1');
  overlay.className = 'q42-baseline-banner';
        overlay.innerHTML = 'Baseline overlay active: bars show adaptive share; full softmax = 100% reference.';
        metricsEl.appendChild(overlay);
      });
      metricsEl && observer.observe(metricsEl, {childList:true, subtree:true});
      // Export frozen + current scenario
      exportBtn?.addEventListener('click', ()=>{
        const scenarios = [...frozen, currentSnapshot].filter(Boolean);
        if(!scenarios.length) return;
        const blob = new Blob([JSON.stringify({generated: new Date().toISOString(), scenarios}, null, 2)], {type:'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'adaptive-softmax-scenarios.json';
        document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();}, 100);
      });
      // Initial spark render (subsequent updates happen inside render())
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question42Interactive = interactiveScript;
}


