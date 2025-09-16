const interactiveScript = () => {
            const $ = id => document.getElementById(id);
            const inputs = [
                'q52-requests','q52-tp','q52-tc','q52-price','q52-gpu-rate','q52-gpus','q52-util','q52-overhead','q52-cache'
            ].map($);
            if(inputs.some(el => !el)) return;
            const [reqEl,tpEl,tcEl,priceEl,gpuRateEl,gpusEl,utilEl,overheadEl,cacheEl] = inputs;
            const results = $('q52-results');
            const breakEl = $('q52-break');
            const whichEl = $('q52-which');
            const explEl = $('q52-expl');
            const scenarioSelect = $('q52-scenario');

            const scenarios = [
                { key:'proto', name:'Prototype (low volume)', R:5000, Tp:400, Tc:300, P:0.02, Hr:2.5, G:2, U:0.35, O:8000, cache:10 },
                { key:'scale', name:'Scaling growth', R:250000, Tp:350, Tc:300, P:0.02, Hr:2.5, G:8, U:0.55, O:18000, cache:20 },
                { key:'opt', name:'High volume optimized', R:1200000, Tp:250, Tc:220, P:0.018, Hr:2.3, G:16, U:0.70, O:25000, cache:35 },
                { key:'spiky', name:'Spiky traffic (low util)', R:300000, Tp:320, Tc:280, P:0.02, Hr:2.5, G:12, U:0.30, O:20000, cache:15 },
                { key:'hybrid', name:'Hybrid heavy cache', R:600000, Tp:300, Tc:260, P:0.02, Hr:2.4, G:10, U:0.60, O:19000, cache:50 }
            ];

            // Populate scenario dropdown
            if(scenarioSelect){
                scenarios.forEach((s,i)=>{
                    const opt = document.createElement('option');
                    opt.value = s.key;
                    opt.textContent = `${s.name}`;
                    scenarioSelect.appendChild(opt);
                });
            }

            function fmt(n,dec=0){ if(!Number.isFinite(n)) return '—'; return n.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec}); }

            function calc(){
                const R = Number(reqEl.value)||0;
                const Tp = Number(tpEl.value)||0;
                const Tc = Number(tcEl.value)||0;
                const P = Number(priceEl.value)||0; // $ per 1K tokens
                const Hr = Number(gpuRateEl.value)||0;
                const G = Number(gpusEl.value)||0;
                const U = Math.min(1, Math.max(0, Number(utilEl.value)||0));
                const O = Number(overheadEl.value)||0;
                const cachePct = Math.min(100, Math.max(0, Number(cacheEl.value)||0));

                const tokensPerReq = Tp + Tc;
                const effectiveR = R * (1 - cachePct/100); // cache reduces paid SaaS calls
                const saasCost = (tokensPerReq * effectiveR / 1000) * P;
                const selfInfra = (Hr * 24 * 30 * G * U) + O;
                const breakEvenR = (tokensPerReq>0 && P>0) ? (1000 * selfInfra) / (tokensPerReq * P) : NaN;
                const saasPerK = P; // given
                const selfPerK = (tokensPerReq>0 && R>0) ? (selfInfra / (tokensPerReq * R / 1000)) : NaN;

                results.innerHTML = `
                    <div class="p-3 rounded border bg-green-50 border-green-200">
                        <div class="text-xs uppercase tracking-wide text-green-700 font-semibold">SaaS Monthly</div>
                        <div class="text-xl font-bold text-green-900">$${fmt(saasCost,0)}</div>
                        <div class="text-[11px] text-green-700">Cache adj: ${cachePct}% hit</div>
                    </div>
                    <div class="p-3 rounded border bg-purple-50 border-purple-200">
                        <div class="text-xs uppercase tracking-wide text-purple-700 font-semibold">Self-Host Monthly</div>
                        <div class="text-xl font-bold text-purple-900">$${fmt(selfInfra,0)}</div>
                        <div class="text-[11px] text-purple-700">Util: ${(U*100).toFixed(0)}% | GPUs: ${G}</div>
                    </div>
                    <div class="p-3 rounded border bg-orange-50 border-orange-200">
                        <div class="text-xs uppercase tracking-wide text-orange-700 font-semibold">$/1K Tokens</div>
                        <div class="text-lg font-bold text-orange-900 leading-snug">
                            <span class="pr-1">SaaS</span>
                            <span class="font-mono">&dollar;${fmt(saasPerK,3)}</span>
                            <span class="px-2 text-orange-700 font-normal">vs</span>
                            <span class="pr-1 font-semibold">Self</span>
                            <span class="font-mono">${Number.isFinite(selfPerK)?'&dollar;'+fmt(selfPerK,3):'—'}</span>
                        </div>
                        <div class="text-[11px] text-orange-700 mt-0.5">Tokens/req: ${fmt(tokensPerReq)} | Eff R: ${fmt(effectiveR)}</div>
                    </div>`;

                breakEl.innerHTML = `<span class="font-mono">Break-even R ≈ ${Number.isFinite(breakEvenR)?fmt(breakEvenR,0):'—'} requests / month</span>`;

                let cheaper, diffPct;
                if(Number.isFinite(saasCost) && Number.isFinite(selfInfra)){
                    if(saasCost < selfInfra){
                        cheaper = 'SaaS currently cheaper';
                        diffPct = ((selfInfra/saasCost)-1)*100;
                    } else if(selfInfra < saasCost){
                        cheaper = 'Self-host currently cheaper';
                        diffPct = ((saasCost/selfInfra)-1)*100;
                    } else cheaper = 'Costs roughly equal';
                }
                whichEl.textContent = cheaper ? `${cheaper} (≈ ${fmt(Math.abs(diffPct||0),1)}% delta)` : '';

                // Guidance
                const levers = [];
                if(!Number.isFinite(selfPerK) || selfPerK > saasPerK*1.2){ levers.push('Increase GPU utilization via batching / autoscaling'); }
                if(tokensPerReq > 700){ levers.push('Compress prompts / trim context'); }
                if(cachePct < 30){ levers.push('Add response + embedding cache layer'); }
                if(G > 0 && U < 0.4){ levers.push('Right-size GPU count or enable on-demand nodes'); }
                if(P > 0.025){ levers.push('Negotiate SaaS volume discount'); }
                if(levers.length === 0) levers.push('You are operating near an efficient frontier; optimize model quality next.');

                explEl.innerHTML = `<div class="text-sm text-yellow-800"><strong>Optimization levers:</strong><ul class="list-disc ml-5 mt-1 space-y-0.5">${levers.map(l=>`<li>${l}</li>`).join('')}</ul></div>`;
            }

            inputs.forEach(el => el.addEventListener('input', calc));
            scenarioSelect?.addEventListener('change', () => {
                const sel = scenarioSelect.value;
                if(sel === 'custom') return; // leave current values
                const s = scenarios.find(sc=>sc.key===sel);
                if(!s) return;
                reqEl.value = s.R; tpEl.value = s.Tp; tcEl.value = s.Tc; priceEl.value = s.P; gpuRateEl.value = s.Hr; gpusEl.value = s.G; utilEl.value = s.U; overheadEl.value = s.O; cacheEl.value = s.cache;
                calc();
            });

            calc();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question52Interactive = interactiveScript;
}
