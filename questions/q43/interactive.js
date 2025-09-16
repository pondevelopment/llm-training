const interactiveScript = () => {
      const LEl = document.getElementById('q43-depth');
      const GEl = document.getElementById('q43-gain');
      const AEl = document.getElementById('q43-res');
      const NEl = document.getElementById('q43-norm');
      const SEl = document.getElementById('q43-shortcut');
  const copyBtn = document.getElementById('q43-copy');
  const exportBtn = document.getElementById('q43-export');
  const presetButtons = Array.from(document.querySelectorAll('[data-q43-preset]'));
      const LVal = document.getElementById('q43-depth-val');
      const GVal = document.getElementById('q43-gain-val');
      const AVal = document.getElementById('q43-res-val');
      const barsEl = document.getElementById('q43-bars');
      const metricsEl = document.getElementById('q43-metrics');
      const explainEl = document.getElementById('q43-explain');
  const guidanceEl = document.getElementById('q43-guidance');
      if (!LEl) return;

      function effGain(g, norm){
        // Pull gains toward 1 depending on norm placement
        if (norm === 'pre') return 0.6*g + 0.4*1.0; // stronger stabilization
        if (norm === 'post') return 0.8*g + 0.2*1.0;
        return g;
      }

      function simulate(L, g, alpha, norm, hop){
        const gEff = effGain(g, norm);
        const grads = new Array(L).fill(0);
        let G = 1.0; // start from top
        for (let l = L-1; l >= 0; l--) {
          // Residual effect: identity + alpha * gEff
          const J = 1.0 + alpha * gEff;
          // Attention shortcut: a fraction of gradient skips ahead shorter path
          const shortcutFrac = hop > 0 ? 0.3 : 0.0; // 30% goes via shorter path
          const longFrac = 1 - shortcutFrac;
          const step = longFrac * J + shortcutFrac * Math.pow(J, Math.max(1, Math.floor(hop)));
          G = G * step;
          grads[l] = Math.abs(G);
        }
        return grads;
      }

      function fmtShort(n){
        const a = Math.abs(n);
        if (a >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (a >= 1e6) return (n/1e6).toFixed(2)+'M';
        if (a >= 1e3) return (n/1e3).toFixed(2)+'k';
        if (a < 1e-3 && a > 0) return n.toExponential(1);
        return n.toFixed(3);
      }

      function layerRow(idx, baseVal, impVal, maxVal){
        const basePct = Math.max(2, Math.round((baseVal/maxVal)*100));
        const impPct  = Math.max(2, Math.round((impVal /maxVal)*100));
        return `<div class="flex items-center gap-2">
          <span class="w-10 text-right font-mono">${idx}</span>
          <div class="flex-1">
            <div class="h-2 bg-rose-200 rounded"><div class="h-2 bg-rose-600 rounded" style="width:${basePct}%"></div></div>
            <div class="h-2 bg-emerald-200 rounded mt-0.5"><div class="h-2 bg-emerald-600 rounded" style="width:${impPct}%"></div></div>
          </div>
          <div class="w-28 text-right text-xs text-gray-600"><span class="text-rose-700 font-mono">${fmtShort(baseVal)}</span> <span class="mx-1">→</span> <span class="text-emerald-700 font-mono">${fmtShort(impVal)}</span></div>
        </div>`;
      }

      function ratioBar(label, ratio, color){
        const cap = 10; // visualize up to 10x
        const r = Math.max(0, Math.min(cap, ratio));
        const pct = Math.round((r/cap)*100);
        return `<div>
          <div class="flex justify-between text-xs mb-0.5"><span>${label}</span><span>×${ratio.toFixed(2)}</span></div>
          <div class="w-full h-3 bg-${color}-200 rounded"><div class="h-3 bg-${color}-600" style="width:${pct}%"></div></div>
        </div>`;
      }

      function assessHealth(L, g, a, norm, hop, endToStart){
        const gEff = effGain(g, norm);
        const Jstep = 1 + a * gEff; // simplified scalar proxy
        let status = 'healthy';
        const reasons = [];
        if (endToStart < 1e-8) { status = 'vanishing'; reasons.push('End→start factor extremely small.'); }
        if (endToStart > 1e8) { status = 'exploding'; reasons.push('End→start factor extremely large.'); }
        // Broad healthy band: typical residual blocks have J_step in ~[1,2]; allow wider with normalization
        if (Jstep < 0.7) { if (status==='healthy') status='caution'; reasons.push('Per-layer step < 0.7 (strong decay risk).'); }
        if (Jstep > 2.2) { if (status==='healthy') status='caution'; reasons.push('Per-layer step > 2.2 (amplification risk).'); }
        if (a < 0.05) { if (status==='healthy') status='caution'; reasons.push('Residual weight α very small (block ~ identity).'); }
        if (a > 1.5) { if (status==='healthy') status='caution'; reasons.push('Residual weight α unusually large (could amplify noise).'); }
        if (norm === 'none') { if (status==='healthy') status='caution'; reasons.push('No normalization: prefer Pre-LN/RMSNorm for scale control.'); }
        if (norm === 'post' && L >= 48) { if (status==='healthy') status='caution'; reasons.push('Very deep Post-LN stack; Pre-LN typically more stable.'); }
        if (g < 0.75) { reasons.push('Base gain g < 0.75: raw chain would vanish quickly.'); }
        if (g > 1.25) { if (status==='healthy') status='caution'; reasons.push('Base gain g > 1.25: raw chain could explode.'); }
        if (hop === 0) { reasons.push('No attention shortcut (all dependencies traverse full depth).'); }
        const color = status==='healthy' ? 'emerald' : (status==='caution' ? 'amber' : 'rose');
        return { status, reasons, color, Jstep, gEff };
      }

      function statusBadge(status){
        const map = {
          healthy: 'bg-emerald-100 text-emerald-800',
          caution: 'bg-amber-100 text-amber-800',
          vanishing: 'bg-rose-100 text-rose-800',
          exploding: 'bg-rose-100 text-rose-800',
        };
        const label = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="text-xs px-2 py-0.5 rounded-full border ${map[status]}">${label}</span>`;
      }

      function render(){
        const L = parseInt(LEl.value,10);
        const g = parseFloat(GEl.value);
        const a = parseFloat(AEl.value);
        const norm = NEl.value;
        const hop = parseInt(SEl.value,10);
        LVal.textContent = L;
        GVal.textContent = g.toFixed(2);
        AVal.textContent = a.toFixed(2);

        const baseline = simulate(L, g, 0.0, 'none', 0);
        const improved = simulate(L, g, a, norm, hop);
        const endToStart = improved[0] || 0;
        const assess = assessHealth(L, g, a, norm, hop, endToStart);

        const maxVal = Math.max(...baseline, ...improved, 1e-9);
        const rows = [];
        for (let i=0;i<L;i++){
          const l = (i+1).toString().padStart(2,'0');
          rows.push(layerRow(l, baseline[i], improved[i], maxVal));
        }
        const alert = (assess.status === 'healthy')
          ? ''
          : `<div class="text-xs mb-1 text-${assess.color}-700">⚠ ${assess.status==='vanishing' ? 'Vanishing gradient detected' : (assess.status==='exploding' ? 'Exploding gradient risk' : 'Caution: unstable steps')}</div>`;
        barsEl.innerHTML = alert + `<div class="text-xs text-gray-500 mb-1"><span class="text-rose-600">Rose</span> = baseline (no residual/LN/shortcut). <span class="text-emerald-600">Emerald</span> = transformer-style.</div>` + rows.join('');

        function stats(arr){
          const min = Math.min(...arr); const max = Math.max(...arr); const last = arr[0];
          return {min, max, last};
        }
        const sb = stats(baseline), si = stats(improved);
        const vanishB = Math.pow(g, L);
        const improvement = (si.last)/(vanishB || 1e-12);
        const ratioColor = improvement > 1.5 ? 'emerald' : (improvement < 0.75 ? 'rose' : 'indigo');
        metricsEl.innerHTML = `
          <div class="flex items-center gap-2"><span>Status:</span> ${statusBadge(assess.status)}</div>
          <div>Baseline end-to-start factor: <span class="font-mono">${fmtShort(vanishB)}</span></div>
          <div>Transformer end-to-start factor: <span class="font-mono">${fmtShort(si.last)}</span></div>
          <div>Per-layer step ≈ <span class="font-mono">${assess.Jstep.toFixed(3)}</span> (with <span class="font-mono">g_eff ≈ ${assess.gEff.toFixed(3)}</span>)</div>
          <div class="mt-1">${ratioBar('Improvement vs baseline (end→start)', improvement, ratioColor)}</div>
          ${assess.reasons.length ? `<ul class="list-disc ml-5 text-xs text-gray-700">${assess.reasons.map(r=>`<li>${r}</li>`).join('')}</ul>` : ''}
          <div class="mt-1">Baseline min/max: <span class="font-mono">${fmtShort(sb.min)}</span>/<span class="font-mono">${fmtShort(sb.max)}</span></div>
          <div>Transformer min/max: <span class="font-mono">${fmtShort(si.min)}</span>/<span class="font-mono">${fmtShort(si.max)}</span></div>
        `;
        if(guidanceEl){
          let advice = [];
          if(assess.status==='vanishing') advice.push('Increase α or g, or enable Pre-LN.');
          if(assess.status==='exploding') advice.push('Lower g or α; switch to Pre-LN; consider smaller depth.');
          if(assess.status==='caution') advice.push('Tune toward J_step≈1 (adjust α or g, prefer Pre-LN).');
          if(hop===0 && assess.status==='healthy') advice.push('Enable attention shortcut to further reduce effective depth.');
          if(!advice.length) advice.push('Configuration is balanced; further gains may trade off stability.');
          guidanceEl.textContent = advice.join(' ');
        }

        const gEff = (norm === 'pre') ? (0.6*g + 0.4) : (norm === 'post' ? (0.8*g + 0.2) : g);
        const Jstep = 1 + a * gEff;
        const shortcutFrac = hop > 0 ? 0.3 : 0.0;
        const longFrac = 1 - shortcutFrac;
        const perLayerMix = longFrac * Jstep + shortcutFrac * Math.pow(Jstep, Math.max(1, Math.floor(hop)));
        const normLabel = norm === 'pre' ? 'Pre-LN' : (norm === 'post' ? 'Post-LN' : 'No norm');

        const caution = (Jstep > 2.2)
          ? `<span class="text-amber-700">Note:</span> very large per-layer step (>2.2) may amplify noise; reduce α or g.`
          : (Jstep < 0.7)
          ? `<span class="text-amber-700">Note:</span> very small per-layer step (<0.7) risks vanishing; increase α or g, or enable normalization.`
          : `Per-layer step within healthy band (~0.7–2.2) — stabilized by residual + normalization.`;

        explainEl.innerHTML = `
          <div class="space-y-2">
            <div>
              <b>Your setup.</b> L=<span class="font-mono">${L}</span>, g=<span class="font-mono">${g.toFixed(2)}</span>, α=<span class="font-mono">${a.toFixed(2)}</span>, norm=<span class="font-mono">${normLabel}</span>, shortcut=<span class="font-mono">${hop>0?`on (hop=${hop})`:'off'}</span>.
            </div>
            <div>
              <b>Effective per-layer Jacobian.</b> With ${normLabel}, the layer gain is pulled toward 1: <span class="font-mono">g_eff ≈ ${gEff.toFixed(3)}</span>. Residual gives <span class="font-mono">J_eff ≈ I + α·g_eff</span> ⇒ scalar step ≈ <span class="font-mono">${Jstep.toFixed(3)}</span>.
            </div>
            <div>
              <b>Short paths.</b> ${hop>0?`About 30% of gradient takes a ${hop}-hop route`:'No shortcut route used'}; per-layer mixed step ≈ <span class="font-mono">${perLayerMix.toFixed(3)}</span>, boosting end→start signal compared to <span class="font-mono">g^L</span>.
            </div>
            <div class="text-xs">${caution}</div>
            <div class="text-xs text-gray-600">Heuristic model for intuition only; real networks have anisotropic Jacobians, cross-layer correlations, and optimizer dynamics.</div>
          </div>
        `;

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [LEl,GEl,AEl,NEl,SEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', render); });
      // Presets
      function applyPreset(name){
        if(name==='stable-mid'){ LEl.value='12'; GEl.value='0.92'; AEl.value='0.5'; NEl.value='pre'; SEl.value='0'; }
        else if(name==='deep'){ LEl.value='36'; GEl.value='0.95'; AEl.value='0.6'; NEl.value='pre'; SEl.value='4'; }
        else if(name==='risk'){ LEl.value='24'; GEl.value='1.12'; AEl.value='0.8'; NEl.value='post'; SEl.value='0'; }
        render();
      }
      presetButtons.forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.getAttribute('data-q43-preset'))));

      // Permalink copy (#question-43?L=..&g=..&a=..&n=..&h=..)
      copyBtn?.addEventListener('click',()=>{
        const params = new URLSearchParams({L:LEl.value,g:GEl.value,a:AEl.value,n:NEl.value,h:SEl.value});
        const url = `${location.origin}${location.pathname}#question-43?${params.toString()}`;
        navigator.clipboard?.writeText(url).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1500); });
      });

      // Export JSON
      exportBtn?.addEventListener('click',()=>{
        const L = parseInt(LEl.value,10), g=parseFloat(GEl.value), a=parseFloat(AEl.value), n=NEl.value, hop=parseInt(SEl.value,10);
        const baseline = simulate(L,g,0,'none',0); const improved=simulate(L,g,a,n,hop);
        const payload = {generated:new Date().toISOString(), config:{L,g,a,norm:n,hop}, baseline, improved};
        const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
        const link = document.createElement('a'); link.href=URL.createObjectURL(blob); link.download='gradient-flow-scenario.json'; document.body.appendChild(link); link.click(); setTimeout(()=>{URL.revokeObjectURL(link.href); link.remove();},100);
      });

      // Hash parse
      (function initFromHash(){
        if(!location.hash) return; const m = location.hash.match(/question-43\?(.*)$/); if(!m) return; const p = new URLSearchParams(m[1]);
        if(p.get('L')) LEl.value=p.get('L'); if(p.get('g')) GEl.value=p.get('g'); if(p.get('a')) AEl.value=p.get('a'); if(p.get('n')) NEl.value=p.get('n'); if(p.get('h')) SEl.value=p.get('h');
      })();
      render();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question43Interactive = interactiveScript;
}
