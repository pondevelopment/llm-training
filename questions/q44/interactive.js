const interactiveScript = () => {
      const KEl = document.getElementById('q44-k');
      const SEl = document.getElementById('q44-s');
      const PEl = document.getElementById('q44-p0');
      const CEl = document.getElementById('q44-cot');
      const BEl = document.getElementById('q44-budget');
      const LEl = document.getElementById('q44-len');
  const copyBtn = document.getElementById('q44-copy');
  const exportBtn = document.getElementById('q44-export');
  const presetButtons = Array.from(document.querySelectorAll('[data-q44-preset]'));
      const KVal = document.getElementById('q44-k-val');
      const SVal = document.getElementById('q44-s-val');
      const PVal = document.getElementById('q44-p0-val');

      const barsEl = document.getElementById('q44-bars');
      const metricsEl = document.getElementById('q44-metrics');
  const explainEl = document.getElementById('q44-explain');
  const guideEl = document.getElementById('q44-guide');
      if (!KEl) return;

      function accuracy(p0, K, s, cotOn){
        const lambda = 0.55; // diminishing returns strength
        const c = cotOn ? 1.3 : 1.0; // CoT quality multiplier
        const p = 1 - (1 - p0) * Math.exp(-lambda * s * c * K);
        return Math.min(0.999, Math.max(0, p));
      }

      function budget(K, perShot, budget, cotOn){
        const overhead = 64; // instructions + question
        const per = perShot * (cotOn ? 2 : 1);
        const maxK = Math.max(0, Math.floor((budget - overhead) / Math.max(1, per)));
        const used = overhead + Math.min(K, maxK) * per;
        return { maxK, used, per, overhead };
      }

      function bar(label, val, color){
        const pct = Math.round(val * 100);
        return `<div>
          <div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${(val*100).toFixed(1)}%</span></div>
          <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600 rounded\" style=\"width:${pct}%\"></div></div>
        </div>`;
      }

      function fmt(n){
        if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (n >= 1e3) return (n/1e3).toFixed(2)+'k';
        return n.toString();
      }

      function guidance(p0, pEff, deltaPct, K, s, cotOn, bud){
        const tips = [];
        if (K === 0) tips.push('Add 2-4 shots to test uplift.');
        if (s < 0.3 && K > 0) tips.push('Similarity low: select more relevant examples.');
        if (deltaPct < 3 && K >= 4) tips.push('Low marginal gain: curate or reduce shots.');
        if (bud.used / bud.maxK > 0.85 && deltaPct < 5) tips.push('High cost for modest lift—consider zero-shot or tool.');
        if (cotOn && deltaPct < 2) tips.push('CoT adds cost but little lift here; try disabling.');
        if (!tips.length) return 'Configuration looks balanced.';
        return tips.join(' ');
      }

      function render(){
        const K = parseInt(KEl.value,10);
        const s = parseFloat(SEl.value);
        const p0 = parseFloat(PEl.value);
        const cotOn = CEl.value === 'on';
        const budgetTok = parseInt(BEl.value,10);
        const lenShot = parseInt(LEl.value,10);

        KVal.textContent = K;
        SVal.textContent = s.toFixed(2);
        PVal.textContent = p0.toFixed(2);

        const bud = budget(K, lenShot, budgetTok, cotOn);
        const effectiveK = Math.min(K, bud.maxK);
        const pEff = accuracy(p0, effectiveK, s, cotOn);
        const pBase = p0;

        barsEl.innerHTML = bar('Zero-shot', pBase, 'rose') +
                           '<div class="h-1"></div>' +
                           bar(`Few-shot (effective K=${effectiveK})`, pEff, 'emerald');

  const delta = (pEff - pBase) * 100;
        const shotsCost = effectiveK * bud.per;
        const costPerPct = delta > 0 ? (shotsCost / delta).toFixed(1) : '—';
  const warn = K > bud.maxK ? `<div class=\"text-xs text-amber-700\">Requested K exceeds budget; truncated to ${bud.maxK}.</div>` : '';
        metricsEl.innerHTML = `
          <div>Tokens used: <span class=\"font-mono\">${bud.used}</span> / <span class=\"font-mono\">${budgetTok}</span> (${cotOn?'CoT on':'CoT off'}, per-shot <span class=\"font-mono\">${bud.per}</span>)</div>
          <div>Improvement: <span class=\"font-mono\">${delta.toFixed(1)}%</span> over zero-shot</div>
          <div>Token cost per +1%: <span class=\"font-mono\">${costPerPct}</span></div>
          ${warn}
        `;

        explainEl.innerHTML = `
          <div class=\"space-y-2\">
            <div><b>Diminishing returns.</b> Each extra shot helps less. Model: <span class=\"font-mono\">p(K) = 1 - (1-p0) · e^{-λ·s·c·K}</span>.</div>
            <div><b>Similarity matters.</b> Higher <span class=\"font-mono\">s</span> → bigger jumps for the same K.</div>
            <div><b>Chain-of-thought.</b> CoT can boost quality (c>1) but doubles per-shot tokens.</div>
            <div class=\"text-xs text-gray-600\">Heuristic simulator for intuition; real performance depends on model, prompt style, and retrieval quality.</div>
          </div>
        `;

  if (guideEl) guideEl.textContent = guidance(p0, pEff, delta, K, s, cotOn, bud);
  if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [KEl,SEl,PEl,CEl,BEl,LEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      // Presets
      function applyPreset(name){
        if(name==='starter'){ KEl.value='4'; SEl.value='0.7'; PEl.value='0.45'; CEl.value='off'; BEl.value='512'; LEl.value='64'; }
        else if(name==='high-sim'){ KEl.value='6'; SEl.value='0.9'; }
        else if(name==='cost-tight'){ KEl.value='3'; SEl.value='0.6'; BEl.value='256'; LEl.value='32'; }
        else if(name==='cot-heavy'){ KEl.value='5'; CEl.value='on'; }
        render();
      }
      presetButtons.forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.getAttribute('data-q44-preset'))));

      // Permalink copy (#question-44?K=..&s=..&p0=..&cot=..&B=..&L=..)
      copyBtn?.addEventListener('click',()=>{
        const params = new URLSearchParams({K:KEl.value,s:SEl.value,p0:PEl.value,cot:CEl.value,B:BEl.value,L:LEl.value});
        const url = `${location.origin}${location.pathname}#question-44?${params.toString()}`;
        navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
      });

      // Export JSON snapshot
      exportBtn?.addEventListener('click',()=>{
        const payload = {
          generated: new Date().toISOString(),
          config: {K:parseInt(KEl.value,10), s:parseFloat(SEl.value), p0:parseFloat(PEl.value), cot:CEl.value, budget:parseInt(BEl.value,10), perShot:parseInt(LEl.value,10)},
        };
        const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'few-shot-scenario.json';
        document.body.appendChild(link); link.click();
        setTimeout(()=>{ URL.revokeObjectURL(link.href); link.remove(); }, 100);
      });

      // Hash parse
      (function initFromHash(){
        if(!location.hash) return; const m = location.hash.match(/question-44\?(.*)$/); if(!m) return; const p = new URLSearchParams(m[1]);
        if(p.get('K')) KEl.value=p.get('K');
        if(p.get('s')) SEl.value=p.get('s');
        if(p.get('p0')) PEl.value=p.get('p0');
        if(p.get('cot')) CEl.value=p.get('cot');
        if(p.get('B')) BEl.value=p.get('B');
        if(p.get('L')) LEl.value=p.get('L');
      })();
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question44Interactive = interactiveScript;
}
