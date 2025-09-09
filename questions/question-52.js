// Question 52: Cost Estimation (SaaS vs Self‑Host vs Hybrid)
// Added 2025-09-09
// Structure follows Question 1 template + extended math guidelines
const question = {
    title: "52. How do you estimate and compare SaaS vs self-host LLM costs?",
    answer: `<div class="space-y-4">
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-50" class="text-indigo-700 underline hover:text-indigo-900">Question 50: What challenges do LLMs face in deployment?</a></li>
                <li><a href="#question-37" class="text-indigo-700 underline hover:text-indigo-900">Question 37: How does Mixture of Experts (MoE) enhance LLM scalability?</a></li>
                <li><a href="#question-32" class="text-indigo-700 underline hover:text-indigo-900">Question 32: How are attention scores calculated in transformers?</a></li>
                <li><a href="#question-42" class="text-indigo-700 underline hover:text-indigo-900">Question 42: How does Adaptive Softmax optimize LLMs?</a></li>
                <li><a href="#question-51" class="text-indigo-700 underline hover:text-indigo-900">Question 51: What is an LLM, and how are LLMs trained end-to-end?</a></li>
            </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">💰 What is LLM Cost Estimation?</h4>
            <p class="text-blue-800">Cost estimation compares <strong>usage-based API pricing</strong> (SaaS) with <strong>infrastructure + operations</strong> costs (self-host) to find the <em>break-even volume</em> where one becomes cheaper. Think of it like deciding between paying per ride (ride-hailing) vs owning a car (CapEx + fuel + maintenance).</p>
        </div>
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">SaaS API</h5>
                <p class="text-sm text-green-700">Pay per 1K tokens; zero infra ops.</p>
                <code class="text-xs bg-green-100 px-1 rounded">Cost ∝ requests × tokens</code>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Self-Host</h5>
                <p class="text-sm text-purple-700">Fixed GPU + staff overhead; amortize with volume.</p>
                <code class="text-xs bg-purple-100 px-1 rounded">Cost ≈ (GPU hrs × rate × util) + O</code>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Hybrid / Orchestrated</h5>
                <p class="text-sm text-orange-700">Blend: cache, route heavy / sensitive to self-host.</p>
                <code class="text-xs bg-orange-100 px-1 rounded">Route smart → lower blended $/1K</code>
            </div>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Unit Economics:</strong> Justify feature viability & pricing</li>
                <li>• <strong>Scaling Strategy:</strong> Know when infra investment pays off</li>
                <li>• <strong>Optimization Levers:</strong> Prompt compression, caching, batching</li>
                <li>• <strong>Risk & Focus:</strong> Avoid premature ops hiring at low volume</li>
                <li>• <strong>Strategic Flexibility:</strong> Hybrid reduces vendor lock‑in</li>
            </ul>
        </div>
        <div class="math-display">$$
            \\begin{align*}
            C_{\\text{SaaS}} &= \\frac{(T_p + T_c) \\cdot R}{1000} \\cdot P_{1K} \\\\
            C_{\\text{Self}} &= (H_{GPU} \\cdot 24 \\cdot 30 \\cdot G \\cdot U) + O \\\\
            R_{\\text{break}} &= \\frac{1000\\, C_{\\text{Self}}}{(T_p + T_c) P_{1K}}
            \\end{align*}
        $$</div>
    <p class="text-sm text-gray-600">Symbols: <code>R</code>=monthly requests, <code>T_p</code>/<code>T_c</code>=avg prompt/response tokens, <code>P_{1K}</code>=SaaS price per 1K tokens, <code>H_{GPU}</code>=hourly GPU rate, <code>G</code>=GPU count, <code>U</code>=average utilization (0–1), <code>O</code>=monthly overhead (engineering, storage, networking, monitoring).</p>
    <p class="text-xs text-gray-500 italic">Sample values reflect typical public pricing as of Sept 2025 (e.g. $0.02 / 1K tokens mid‑tier model, ~$2.5/hr on‑demand A100‑class GPU). Adjust for your vendor, committed discounts, and region.</p>
    </div>`,
    interactive: {
        title: "🧮 LLM Cost Break-even Estimator",
        html: `<div class="space-y-6" id="q52-root">
            <!-- Inputs -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 space-y-4">
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-requests">Monthly Requests (R)</label>
                        <input id="q52-requests" type="number" min="0" value="50000" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-tp">Prompt Tokens (T_p)</label>
                        <input id="q52-tp" type="number" min="1" value="300" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-tc">Completion Tokens (T_c)</label>
                        <input id="q52-tc" type="number" min="1" value="250" class="w-full px-2 py-1 border rounded" />
                    </div>
                </div>
                <div class="grid md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-price">SaaS $ / 1K tokens (P_{1K})</label>
                        <input id="q52-price" type="number" min="0" step="0.001" value="0.02" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-gpu-rate">GPU Hourly Rate (H_GPU)</label>
                        <input id="q52-gpu-rate" type="number" min="0" step="0.1" value="2.5" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-gpus">GPU Count (G)</label>
                        <input id="q52-gpus" type="number" min="0" value="4" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-util">Utilization (U, 0–1)</label>
                        <input id="q52-util" type="number" min="0" max="1" step="0.05" value="0.55" class="w-full px-2 py-1 border rounded" />
                    </div>
                </div>
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-overhead">Monthly Overhead O ($)</label>
                        <input id="q52-overhead" type="number" min="0" step="100" value="15000" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-cache">Cache Hit % (hybrid)</label>
                        <input id="q52-cache" type="number" min="0" max="100" step="5" value="20" class="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1" for="q52-scenario">Scenario Preset</label>
                        <select id="q52-scenario" class="w-full px-2 py-1 border rounded text-xs bg-white">
                            <option value="custom">-- Custom (edit values) --</option>
                        </select>
                    </div>
                </div>
                <p class="text-[11px] text-gray-500">Assumes 30-day month; excludes networking / storage minutiae. Hybrid adjusts effective SaaS usage by cache hits. Pricing assumptions anchored to September 2025 averages; update inputs for newer rates.</p>
            </div>
            <!-- Results -->
            <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                <h4 class="font-medium text-gray-900">📊 Results</h4>
                <div id="q52-results" class="grid md:grid-cols-3 gap-4 text-sm"></div>
                <div id="q52-break" class="text-sm font-mono"></div>
                <div id="q52-which" class="text-sm"></div>
                <div class="bg-yellow-50 p-3 rounded border border-yellow-200" id="q52-expl"></div>
            </div>
        </div>` ,
        script: () => {
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
        }
    }
};

if (typeof module !== 'undefined') { module.exports = question; }