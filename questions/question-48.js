// Question 48: What is a hyperparameter, and why is it important?
// Created: 2025-08-14
// Educational Focus: Define hyperparameters, distinguish from parameters, and let users explore their qualitative impact.

const question = {
    title: "48. What is a hyperparameter, and why is it important?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related topics)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-18" class="text-indigo-700 underline hover:text-indigo-900">Question 18: Overfitting & mitigation</a></li>
                <li><a href="#question-19" class="text-indigo-700 underline hover:text-indigo-900">Question 19: Generative vs discriminative models</a></li>
                <li><a href="#question-47" class="text-indigo-700 underline hover:text-indigo-900">Question 47: Context & perplexity explorer</a></li>
            </ul>
        </div>
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core idea</h4>
            <p class="text-blue-800">Hyperparameters are preset values that control training dynamics (learning rate, batch size, regularization strength, etc.). They are chosen before / outside training, influence <em>how</em> parameters are learned, and do <strong>not</strong> receive gradient updates.</p>
            <div class="text-center mt-3 bg-white p-3 rounded border overflow-x-auto whitespace-nowrap text-sm">
                <span class="block text-gray-600 mb-1">Gradient update rule</span>
                $$\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} \\mathcal{L}(\\theta_t)$$
            </div>
        </div>

        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Examples</h5>
                <ul class="text-sm text-green-800 list-disc pl-5 space-y-1">
                    <li>Learning rate (η)</li>
                    <li>Batch size</li>
                    <li>Weight decay / dropout</li>
                </ul>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Not hyperparameters</h5>
                <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
                    <li>Model weights (learned parameters)</li>
                    <li>Activations during forward passes</li>
                    <li>Gradients during backprop</li>
                </ul>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Why it matters</h5>
                <ul class="text-sm text-orange-800 list-disc pl-5 space-y-1">
                    <li>Controls stability, speed, and generalization</li>
                    <li>Bad settings can diverge or overfit</li>
                    <li>Good settings accelerate convergence</li>
                </ul>
            </div>
        </div>

        <!-- Why It Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Convergence:</strong> Learning rate affects whether training stabilizes.</li>
                <li>• <strong>Generalization:</strong> Regularization hyperparameters reduce overfitting.</li>
                <li>• <strong>Efficiency:</strong> Batch size and schedulers impact throughput and wall-clock time.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "⚙️ Hyperparameter impact explorer",
        html: `<div class="space-y-6">
            <style>
                .q48-chip { display:inline-flex; align-items:center; font-size:11px; line-height:1; padding:4px 6px; border-radius:4px; margin:2px 4px 2px 0; font-weight:500; }
                .q48-chip.lr-high { background:#fee2e2; color:#991b1b; }
                .q48-chip.lr-low { background:#fef9c3; color:#854d0e; }
                .q48-chip.lr-balanced { background:#dcfce7; color:#166534; }
                .q48-chip.batch-large { background:#e0f2fe; color:#075985; }
                .q48-chip.batch-small { background:#ede9fe; color:#5b21b6; }
                .q48-chip.reg-strong { background:#f1f5f9; color:#0f172a; border:1px solid #cbd5e1; }
                .q48-chip.reg-low { background:#fff7ed; color:#9a3412; }
                .q48-chip.risk-overfit { background:#fee2e2; color:#b91c1c; font-weight:600; }
                .q48-chip.risk-underfit { background:#e0e7ff; color:#3730a3; font-weight:600; }
                .q48-flash-up { animation:q48FlashUp 0.6s ease-out; }
                .q48-flash-down { animation:q48FlashDown 0.6s ease-out; }
                @keyframes q48FlashUp { 0% { box-shadow:0 0 0 0 rgba(34,197,94,0.7);} 100% { box-shadow:0 0 0 12px rgba(34,197,94,0);} }
                @keyframes q48FlashDown { 0% { box-shadow:0 0 0 0 rgba(239,68,68,0.7);} 100% { box-shadow:0 0 0 12px rgba(239,68,68,0);} }
                .q48-tip { cursor:help; font-size:11px; color:#6366f1; margin-left:4px; }
            </style>
            <!-- Controls -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-4 gap-3" aria-label="Hyperparameter controls">
                    <div>
                        <label for="q48-lr" class="block text-sm font-medium text-gray-700 mb-1">Learning rate (η)
                            <span class="q48-tip" title="Too high → divergence; too low → slow convergence; sweet spot often ~1e-4–5e-3 for many transformer fine-tunes.">ℹ️</span>
                        </label>
                        <input id="q48-lr" type="range" min="-4" max="-1" step="0.1" value="-2.5" class="w-full" aria-describedby="q48-lr-help q48-lr-val" aria-label="Learning rate log10 slider">
                        <div id="q48-lr-help" class="text-xs text-gray-600">Log10 scale: η = 10^x | current: <span id="q48-lr-val" class="font-semibold"></span></div>
                    </div>
                    <div>
                        <label for="q48-bs" class="block text-sm font-medium text-gray-700 mb-1">Batch size
                            <span class="q48-tip" title="Larger batch → smoother gradients but less noise regularization; very large batches may need LR warmup.">ℹ️</span>
                        </label>
                        <select id="q48-bs" class="w-full px-2 py-2 border border-gray-300 rounded" aria-label="Batch size">
                            <option>8</option>
                            <option>16</option>
                            <option selected>32</option>
                            <option>64</option>
                            <option>128</option>
                        </select>
                        <div class="text-xs text-gray-600">Samples / optimizer step</div>
                    </div>
                    <div>
                        <label for="q48-wd" class="block text-sm font-medium text-gray-700 mb-1">Weight decay
                            <span class="q48-tip" title="L2 penalty: prevents weights growing too large; too high shrinks signal → underfitting.">ℹ️</span>
                        </label>
                        <input id="q48-wd" type="range" min="0" max="0.1" step="0.005" value="0.01" class="w-full" aria-label="Weight decay slider">
                        <div class="text-xs text-gray-600">L2 strength: <span id="q48-wd-val" class="font-semibold"></span></div>
                    </div>
                    <div>
                        <label for="q48-do" class="block text-sm font-medium text-gray-700 mb-1">Dropout
                            <span class="q48-tip" title="Randomly drops activations: improves generalization; too high slows learning & reduces capacity.">ℹ️</span>
                        </label>
                        <input id="q48-do" type="range" min="0" max="0.7" step="0.05" value="0.1" class="w-full" aria-label="Dropout probability slider">
                        <div class="text-xs text-gray-600">p(drop): <span id="q48-do-val" class="font-semibold"></span></div>
                    </div>
                </div>
                <div class="mt-4 flex flex-wrap items-center" aria-label="Detected regimes"><div id="q48-regimes" class="flex flex-wrap"></div>
                    <button id="q48-snapshot-btn" class="ml-auto text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors" type="button">Copy snapshot</button>
                    <span id="q48-snapshot-status" class="text-[11px] text-gray-600 ml-2"></span>
                </div>
            </div>

            <!-- Impact & Guidance -->
            <div class="bg-white p-3 rounded-lg border">
                <div class="grid md:grid-cols-3 gap-4 items-start">
                    <div>
                        <div class="text-sm font-medium text-gray-700 mb-1">Stability/Speed estimate</div>
                        <div id="q48-impact" class="text-xs">
                            <span id="q48-impact-badge" class="inline-block px-2 py-0.5 rounded border"></span>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q48-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                        </div>
                        <div class="text-[11px] text-gray-500 mt-1">Heuristic based on η, batch size, and regularization.</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-green-700 mb-1">Good points</div>
                        <ul id="q48-pros" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-red-700 mb-1">Potential issues</div>
                        <ul id="q48-cons" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                </div>
            </div>

            <!-- Training Dynamics Simulation -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4" aria-label="Synthetic training dynamics">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-gray-700">Synthetic training curves (heuristic)</h4>
                    <div class="text-[11px] text-gray-500">Not real data – shaped by current hyperparameters</div>
                </div>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="col-span-2">
                        <canvas id="q48-curve" width="460" height="140" class="w-full border bg-white rounded" aria-label="Training and validation loss curves"></canvas>
                        <div class="flex items-center gap-3 mt-1 text-[11px]">
                            <span class="inline-flex items-center gap-1"><span style="width:10px;height:10px;background:#2563eb;display:inline-block;border-radius:2px"></span> Train loss</span>
                            <span class="inline-flex items-center gap-1"><span style="width:10px;height:10px;background:#dc2626;display:inline-block;border-radius:2px"></span> Val loss</span>
                            <span id="q48-curve-label" class="ml-auto text-gray-600"></span>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="text-xs font-medium text-gray-600 mb-1">Gradient noise</div>
                            <div class="h-2 rounded bg-gray-200 overflow-hidden"><div id="q48-noise-bar" class="h-full bg-fuchsia-600" style="width:0%"></div></div>
                            <div id="q48-noise-text" class="text-[11px] text-gray-600 mt-1"></div>
                        </div>
                        <div>
                            <div class="text-xs font-medium text-gray-600 mb-1">Effective step size</div>
                            <div id="q48-effstep" class="text-[11px] bg-white border rounded px-2 py-1 font-mono"></div>
                        </div>
                        <div>
                            <div class="text-xs font-medium text-gray-600 mb-1">Parameter norm trend</div>
                            <canvas id="q48-norm" width="150" height="70" class="w-full border bg-white rounded" aria-label="Parameter norm trend"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scenario Presets & A/B Compare -->
            <div class="bg-white p-4 rounded-lg border space-y-3" aria-label="Presets and comparison tools">
                <div class="flex flex-wrap gap-2 items-center">
                    <span class="text-xs font-semibold text-gray-600 mr-1">Presets:</span>
                    <button type="button" class="q48-preset text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100" data-preset="balanced">Balanced</button>
                    <button type="button" class="q48-preset text-xs px-2 py-1 rounded bg-yellow-50 text-yellow-800 hover:bg-yellow-100" data-preset="underfit">Underfit</button>
                    <button type="button" class="q48-preset text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100" data-preset="overfit">Overfit risk</button>
                    <button type="button" class="q48-preset text-xs px-2 py-1 rounded bg-pink-50 text-pink-700 hover:bg-pink-100" data-preset="unstable">Unstable LR</button>
                    <button type="button" class="q48-preset text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100" data-preset="slow">Smooth but slow</button>
                </div>
                <div class="flex flex-wrap gap-2 items-center pt-2 border-t">
                    <span class="text-xs font-semibold text-gray-600">A/B Compare:</span>
                    <button id="q48-capture-a" type="button" class="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Capture A</button>
                    <button id="q48-capture-b" type="button" class="text-xs px-2 py-1 rounded bg-gray-600 text-white hover:bg-gray-700" disabled>Capture B</button>
                    <button id="q48-clear-ab" type="button" class="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" disabled>Clear</button>
                    <span id="q48-ab-status" class="text-[11px] text-gray-600"></span>
                </div>
                <div id="q48-ab-panel" class="hidden text-[11px] bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
                    <div class="font-semibold text-gray-700">A vs B Differences</div>
                    <div id="q48-ab-diff" class="font-mono whitespace-pre-wrap"></div>
                </div>
            </div>

            <!-- Sensitivity & Interactions -->
            <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200 space-y-4" aria-label="Sensitivity analysis">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-indigo-800">Local sensitivity (score delta if nudged)</h4>
                    <span class="text-[11px] text-indigo-700">± small perturbation around current point</span>
                </div>
                <div id="q48-sensitivity" class="space-y-2"></div>
                <div>
                    <h5 class="text-xs font-semibold text-indigo-800 mb-1">Interaction insight</h5>
                    <div id="q48-interactions" class="text-[11px] text-indigo-900 bg-white/60 rounded p-2 leading-snug"></div>
                </div>
            </div>

            <!-- Advanced Exploration (Phase 4) -->
            <div class="bg-white p-4 rounded-lg border space-y-4" aria-label="Advanced hyperparameter exploration">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <h4 class="text-sm font-semibold text-gray-700">Advanced tools</h4>
                    <div class="flex gap-2 flex-wrap">
                        <button id="q48-run-lr-finder" type="button" class="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-700">Run LR finder</button>
                        <button id="q48-export-trail" type="button" class="text-xs px-2 py-1 rounded bg-slate-600 text-white hover:bg-slate-700">Export trail</button>
                        <span id="q48-adv-status" class="text-[11px] text-gray-600"></span>
                    </div>
                </div>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="col-span-2 space-y-3">
                        <div>
                            <div class="flex items-center justify-between mb-1"><span class="text-xs font-medium text-gray-700">LR finder (synthetic sweep)</span><span id="q48-lr-window" class="text-[10px] text-gray-500"></span></div>
                            <canvas id="q48-lr-finder" width="460" height="120" class="w-full bg-white border rounded" aria-label="Learning rate finder synthetic curve"></canvas>
                        </div>
                        <div>
                            <div class="flex items-center justify-between mb-1"><span class="text-xs font-medium text-gray-700">Noise vs signal (gradient direction drift)</span><span id="q48-noise-ratio" class="text-[10px] text-gray-500"></span></div>
                            <canvas id="q48-noise-signal" width="460" height="110" class="w-full bg-white border rounded" aria-label="Noise vs signal scatter"></canvas>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="text-xs font-medium text-gray-700 mb-1">Regularization components</div>
                            <div id="q48-reg-break" class="text-[11px] bg-gray-50 border rounded p-2 space-y-1"></div>
                        </div>
                        <div>
                            <div class="text-xs font-medium text-gray-700 mb-1">Auto-tune suggestion</div>
                            <div id="q48-suggestion" class="text-[11px] bg-indigo-50 border border-indigo-200 rounded p-2 leading-snug"></div>
                        </div>
                        <div>
                            <div class="text-xs font-medium text-gray-700 mb-1">Session trail (recent)</div>
                            <div id="q48-trail" class="text-[10px] font-mono bg-white border rounded p-2 h-28 overflow-y-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Output -->
            <div id="q48-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900" aria-live="polite"></div>
            <div id="q48-change" class="text-[11px] text-gray-600" aria-live="polite"></div>
        </div>`,
        script: () => {
            const lrEl = document.getElementById('q48-lr');
            const bsEl = document.getElementById('q48-bs');
            const wdEl = document.getElementById('q48-wd');
            const doEl = document.getElementById('q48-do');
            const badgeEl = document.getElementById('q48-impact-badge');
            const meterEl = document.getElementById('q48-meter');
            const prosEl = document.getElementById('q48-pros');
            const consEl = document.getElementById('q48-cons');
            const expl = document.getElementById('q48-expl');
            const changeEl = document.getElementById('q48-change');
            const lrVal = document.getElementById('q48-lr-val');
            const wdVal = document.getElementById('q48-wd-val');
            const doVal = document.getElementById('q48-do-val');
            const regimesEl = document.getElementById('q48-regimes');
            const snapshotBtn = document.getElementById('q48-snapshot-btn');
            const snapshotStatus = document.getElementById('q48-snapshot-status');
            const curveCanvas = document.getElementById('q48-curve');
            const normCanvas = document.getElementById('q48-norm');
            const noiseBar = document.getElementById('q48-noise-bar');
            const noiseText = document.getElementById('q48-noise-text');
            const effStepEl = document.getElementById('q48-effstep');
            const curveLabel = document.getElementById('q48-curve-label');
            const abCaptureA = document.getElementById('q48-capture-a');
            const abCaptureB = document.getElementById('q48-capture-b');
            const abClear = document.getElementById('q48-clear-ab');
            const abPanel = document.getElementById('q48-ab-panel');
            const abDiff = document.getElementById('q48-ab-diff');
            const abStatus = document.getElementById('q48-ab-status');
            const sensEl = document.getElementById('q48-sensitivity');
            const interEl = document.getElementById('q48-interactions');
            // Phase 4 elements
            const lrFinderBtn = document.getElementById('q48-run-lr-finder');
            const exportTrailBtn = document.getElementById('q48-export-trail');
            const advStatus = document.getElementById('q48-adv-status');
            const lrFinderCanvas = document.getElementById('q48-lr-finder');
            const lrWindowEl = document.getElementById('q48-lr-window');
            const noiseSignalCanvas = document.getElementById('q48-noise-signal');
            const noiseRatioEl = document.getElementById('q48-noise-ratio');
            const regBreakEl = document.getElementById('q48-reg-break');
            const suggestionEl = document.getElementById('q48-suggestion');
            const trailEl = document.getElementById('q48-trail');
            if (!lrEl || !bsEl || !wdEl || !doEl || !badgeEl || !meterEl || !prosEl || !consEl || !expl) return;
            const prev = {};
            let snapA = null; let snapB = null;
            const trail = [];

            function flash(el, cls){
                if(!el) return; el.classList.remove('q48-flash-up','q48-flash-down'); void el.offsetWidth; el.classList.add(cls); }

            function computeRegimes(lr, bs, wd, drop){
                const tags=[];
                if (lr > 0.02) tags.push({t:'Aggressive LR', c:'lr-high'}); else if (lr < 5e-5) tags.push({t:'Very low LR', c:'lr-low'}); else tags.push({t:'Balanced LR', c:'lr-balanced'});
                if (bs >= 96) tags.push({t:'Large batch', c:'batch-large'}); else if (bs <= 16) tags.push({t:'Small batch', c:'batch-small'});
                if (wd > 0.05 || drop > 0.5) tags.push({t:'Strong regularization', c:'reg-strong'}); else if (wd < 0.002 && drop < 0.05) tags.push({t:'Low regularization', c:'reg-low'});
                const highLR = lr > 0.01; const lowReg = (wd < 0.002 && drop < 0.1);
                const heavyReg = (wd > 0.05 || drop > 0.5);
                const lowLR = lr < 8e-5;
                if (highLR && lowReg) tags.push({t:'Overfit risk', c:'risk-overfit'});
                if (heavyReg && lowLR) tags.push({t:'Underfit risk', c:'risk-underfit'});
                return tags;
            }

            function simulateCurves(lr, bs, wd, drop){
                const epochs = 40;
                const train=[]; const val=[]; const norm=[];
                const regStrength = wd*6 + drop*0.8; // 0 .. ~ (0.6+0.56)
                const lrScaled = lr * Math.sqrt(bs/32);
                const speed = Math.min(1.8, Math.max(0.4, (lrScaled*120))); // heuristic speed factor
                const noiseAmp = Math.min(0.25, (lr / Math.sqrt(bs)) * (1 - drop*0.4) * 12);
                const overfitRisk = (regStrength < 0.12) ? (lrScaled*0.8 + 0.2) : 0.05;
                let baseTrain = 2.0; let baseVal = 2.05; let pnorm = 1.0;
                let overfitEpoch = epochs; if (overfitRisk > 0.18) overfitEpoch = Math.round(15 + 30*(0.2 - Math.min(0.2, regStrength)));
                for (let e=0;e<epochs;e++){
                    const progress = e/epochs;
                    // Training loss exponential + noise
                    const target = 0.4 + 1.6 * Math.exp(-progress*speed);
                    baseTrain = target + (Math.random()-0.5)*noiseAmp;
                    if (e>0 && baseTrain>train[e-1]) baseTrain = (train[e-1]*0.7 + baseTrain*0.3); // damp spikes up
                    train.push(Math.max(0.25, baseTrain));
                    // Validation loss follows training then turns up if overfitting
                    let valPoint = train[e] + 0.05 + (0.2 * (1 - regStrength));
                    if (e > overfitEpoch) {
                        const ofp = (e - overfitEpoch)/ (epochs - overfitEpoch + 1);
                        valPoint += ofp * (0.4 * (1 - regStrength));
                    }
                    val.push(Math.max(0.3, valPoint));
                    // Parameter norm: grows with lrScaled then shrinks if wd strong
                    const growth = (lrScaled*0.15) - (wd*0.4) - (drop*0.05);
                    pnorm += growth * (1 - progress*0.3);
                    pnorm = Math.max(0.6, Math.min(1.6, pnorm));
                    norm.push(pnorm);
                }
                return {train, val, norm, overfitEpoch: overfitEpoch<epochs? overfitEpoch: null};
            }

            function drawSeries(ctx, data, color, minY, maxY){
                const w = ctx.canvas.width; const h = ctx.canvas.height; const n = data.length;
                ctx.lineWidth=1.5; ctx.strokeStyle=color; ctx.beginPath();
                for(let i=0;i<n;i++){
                    const x = (i/(n-1))*(w-8)+4;
                    const y = h - ((data[i]-minY)/(maxY-minY))*(h-8) -4;
                    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
            }

            function drawCurves(sim){
                if(!curveCanvas) return; const ctx = curveCanvas.getContext('2d');
                ctx.clearRect(0,0,curveCanvas.width, curveCanvas.height);
                const all = sim.train.concat(sim.val); const minY = Math.min(...all)-0.05; const maxY = Math.max(...all)+0.05;
                // grid
                ctx.strokeStyle='#e5e7eb'; ctx.lineWidth=1; ctx.beginPath();
                for(let i=0;i<=4;i++){ const y = i/4 * (curveCanvas.height-8)+4; ctx.moveTo(0,y); ctx.lineTo(curveCanvas.width,y);} ctx.stroke();
                drawSeries(ctx, sim.train, '#2563eb', minY, maxY);
                drawSeries(ctx, sim.val, '#dc2626', minY, maxY);
                if (sim.overfitEpoch!=null){
                    const x = (sim.overfitEpoch/(sim.train.length-1))*(curveCanvas.width-8)+4;
                    ctx.strokeStyle='#f59e0b'; ctx.setLineDash([4,3]); ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,curveCanvas.height); ctx.stroke(); ctx.setLineDash([]);
                }
            }

            function drawNorm(sim){
                if(!normCanvas) return; const ctx = normCanvas.getContext('2d');
                ctx.clearRect(0,0,normCanvas.width, normCanvas.height);
                const minY = Math.min(...sim.norm)-0.02; const maxY = Math.max(...sim.norm)+0.02;
                drawSeries(ctx, sim.norm, '#7c3aed', minY, maxY);
            }

            // Phase 4 utilities
            function updateTrail(lrPow, bs, wd, drop, score){
                const now = Date.now();
                const last = trail[trail.length-1];
                const lr = Math.pow(10, lrPow);
                if(!last || Math.abs(score - last.score) > 0.015 || (now - last.t) > 10000){
                    trail.push({t:now, lr, bs, wd, drop, score:Number(score.toFixed(3))});
                    if(trail.length>120) trail.shift();
                    if(trailEl){
                        trailEl.innerHTML = trail.slice(-20).map(r=>`${new Date(r.t).toLocaleTimeString().split(' ')[0]} | η=${r.lr.toExponential(1)} b=${r.bs} wd=${r.wd.toFixed(3)} do=${r.drop.toFixed(2)} s=${Math.round(r.score*100)}%`).join('\n');
                    }
                }
            }

            function drawLRFinder(){
                if(!lrFinderCanvas) return; const ctx = lrFinderCanvas.getContext('2d');
                const points=60; const lrs=[]; const losses=[];
                for(let i=0;i<points;i++){
                    const logLR = -5 + (i/(points-1))* (Math.log10(5e-2)+5); // from 1e-5 to ~5e-2
                    const lr = Math.pow(10, logLR);
                    const target = 5e-4; // reference sweet spot base
                    const shape = 0.35 + 1.8 * Math.pow(Math.log(lr/target),2);
                    const noise = 0.03 * Math.random();
                    lrs.push(lr); losses.push(shape+noise);
                }
                const minLoss = Math.min(...losses); const bestIdx = losses.indexOf(minLoss);
                const bestLR = lrs[bestIdx];
                const windowLow = bestLR/3; const windowHigh = bestLR*3;
                if(lrWindowEl) lrWindowEl.textContent = `Suggested η window ~ ${windowLow.toExponential(1)} – ${windowHigh.toExponential(1)}`;
                ctx.clearRect(0,0,lrFinderCanvas.width, lrFinderCanvas.height);
                // axes
                ctx.strokeStyle='#e5e7eb'; ctx.beginPath(); ctx.moveTo(30,5); ctx.lineTo(30,110); ctx.lineTo(455,110); ctx.stroke();
                const minY = Math.min(...losses); const maxY = Math.max(...losses);
                ctx.strokeStyle='#2563eb'; ctx.beginPath();
                for(let i=0;i<points;i++){
                    const x = 30 + (i/(points-1))*(lrFinderCanvas.width-40);
                    const y = 110 - ((losses[i]-minY)/(maxY-minY))*95;
                    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
                // best marker
                const bx = 30 + (bestIdx/(points-1))*(lrFinderCanvas.width-40);
                const by = 110 - ((minLoss-minY)/(maxY-minY))*95;
                ctx.fillStyle='#dc2626'; ctx.beginPath(); ctx.arc(bx,by,4,0,Math.PI*2); ctx.fill();
                // window highlight
                ctx.fillStyle='rgba(34,197,94,0.15)';
                const wLx = 30 + (Math.log10(windowLow)-(-5))/(Math.log10(5e-2)+5)*(lrFinderCanvas.width-40);
                const wHx = 30 + (Math.log10(windowHigh)-(-5))/(Math.log10(5e-2)+5)*(lrFinderCanvas.width-40);
                ctx.fillRect(Math.min(wLx,wHx),15,Math.abs(wHx-wLx),95);
            }

            function drawNoiseSignal(lr, bs, wd, drop){
                if(!noiseSignalCanvas) return; const ctx=noiseSignalCanvas.getContext('2d');
                ctx.clearRect(0,0,noiseSignalCanvas.width, noiseSignalCanvas.height);
                const w=noiseSignalCanvas.width; const h=noiseSignalCanvas.height;
                const noise = (lr/Math.sqrt(bs))*(1-drop*0.4);
                const reg = wd*4 + drop*0.6;
                const ratio = noise / (0.15 + reg*0.4);
                if(noiseRatioEl) noiseRatioEl.textContent = `Noise ratio ≈ ${ratio.toFixed(2)}`;
                // axes
                ctx.strokeStyle='#e5e7eb'; ctx.beginPath(); ctx.moveTo(30,5); ctx.lineTo(30,h-10); ctx.lineTo(w-5,h-10); ctx.stroke();
                // scatter representing angular drift; more noise -> farther radial distance
                const points=40;
                for(let i=0;i<points;i++){
                    const base = (i/points)*Math.PI*4;
                    const r = 5 + Math.min(40, ratio*25) + Math.sin(i)*2;
                    const x = 30 + (w-60)/2 + Math.cos(base)*r;
                    const y = (h-10)/2 + Math.sin(base)*r;
                    ctx.fillStyle='rgba(99,102,241,0.6)';
                    ctx.fillRect(x,y,3,3);
                }
                // center point
                ctx.fillStyle='#334155'; ctx.beginPath(); ctx.arc(30+(w-60)/2,(h-10)/2,3,0,Math.PI*2); ctx.fill();
            }

            function renderRegBreak(lr, bs, wd, drop){
                if(!regBreakEl) return; const noise = (lr/Math.sqrt(bs))*(1-drop*0.4);
                let wdC = wd*4; let doC = drop*0.6; let noiseC = noise*0.9; // scale similar magnitude
                const total = wdC + doC + noiseC + 0.000001;
                const pct = v=> (v/total*100).toFixed(1)+'%';
                const bar = (label,val,color)=>`<div class='flex items-center gap-1'><span class='w-20 text-gray-600'>${label}</span><div class='flex-1 h-2 bg-white rounded overflow-hidden relative'><div style='width:${(val/total*100).toFixed(1)}%;background:${color};height:100%;opacity:.8'></div></div><span class='w-10 text-right'>${pct(val)}</span></div>`;
                regBreakEl.innerHTML = [bar('Weight decay', wdC,'#0ea5e9'), bar('Dropout', doC,'#6366f1'), bar('Noise', noiseC,'#f59e0b')].join('');
            }

            function autoSuggestion(lr, bs, wd, drop, score){
                const lrEff = lr * (1 - Math.min(0.7, wd*3)) * (1-drop*0.2);
                const suggestions=[];
                if(lr>0.02) suggestions.push('Lower learning rate; risk of divergence.');
                if(lr<5e-5) suggestions.push('Increase learning rate; progress likely slow.');
                if(wd<0.001 && drop<0.05 && lr>0.005) suggestions.push('Add regularization (weight decay or dropout) to curb overfitting risk.');
                if(wd>0.06 && lr<0.001) suggestions.push('Reduce weight decay or raise LR; may be underfitting.');
                if(drop>0.5) suggestions.push('Dropout very high; consider reducing for capacity.');
                if(bs<16 && lr<0.01) suggestions.push('Small batch: consider gradient accumulation / larger batch for stability.');
                if(!suggestions.length){
                    if(score>0.8) suggestions.push('Setup strong; consider LR schedule or fine-grained regularization sweeps.');
                    else suggestions.push('Tweak LR ±0.2 log units or adjust regularization to climb toward higher score.');
                }
                if(suggestionEl) suggestionEl.innerHTML = suggestions.map(s=>`<div>• ${s}</div>`).join('');
            }

            function setImpact(score) {
                // score in [0,1]
                score = Math.max(0, Math.min(1, score));
                let label = '';
                let bg = '#e5e7eb', fg = '#111827', border = '#d1d5db';
                if (score >= 0.8) { label = `Excellent (${Math.round(score*100)}%)`; bg = '#dcfce7'; fg = '#166534'; border = '#86efac'; }
                else if (score >= 0.6) { label = `Good (${Math.round(score*100)}%)`; bg = '#dbeafe'; fg = '#1e40af'; border = '#93c5fd'; }
                else if (score >= 0.35) { label = `Limited (${Math.round(score*100)}%)`; bg = '#fef9c3'; fg = '#854d0e'; border = '#fde68a'; }
                else { label = `Poor (${Math.round(score*100)}%)`; bg = '#fee2e2'; fg = '#991b1b'; border = '#fecaca'; }
                badgeEl.textContent = label;
                badgeEl.style.backgroundColor = bg;
                badgeEl.style.color = fg;
                badgeEl.style.borderColor = border;
                meterEl.style.width = `${Math.round(score*100)}%`;
                meterEl.style.backgroundColor = fg;
            }

            function computeScore(lrPow, bs, wd, drop) {
                // Heuristic: optimal lr around 1e-3 to 1e-2 depending on bs
                const lr = Math.pow(10, lrPow); // lrPow is log10
                const lrTarget = Math.min(5e-3, 5e-4 * Math.sqrt(bs));
                const lrScore = Math.exp(-Math.pow(Math.log(lr/lrTarget), 2) / 1.5); // bell around target
                const regScore = Math.max(0, 1 - (wd*4 + drop*0.6)); // too large regularization hurts
                const scaleScore = Math.min(1, Math.log2(bs)/8); // diminishing returns for huge batches
                // Combine
                return Math.max(0, Math.min(1, 0.55*lrScore + 0.25*regScore + 0.2*scaleScore));
            }

            function snapshotState(lrPow, bs, wd, drop, score){
                return {
                    lr: Math.pow(10, lrPow), lrPow, batch: bs, wd, drop, score,
                };
            }

            function formatPercent(n){ return `${Math.round(n*100)}%`; }

            function diffSnapshots(a,b){
                if(!a||!b) return '';
                const fields=['lr','batch','wd','drop','score'];
                return fields.map(f=>{
                    const av=a[f]; const bv=b[f];
                    let line=`${f.padEnd(6)}: ${typeof av==='number'? av.toExponential? av.toExponential(2): av: av}`;
                    if(av!==bv){
                        line += ` -> ${typeof bv==='number'? bv.toExponential? bv.toExponential(2): bv: bv}`;
                        if(f==='score') line += ` (Δ ${(bv-av).toFixed(3)})`;
                    }
                    return line;
                }).join('\n');
            }

            function computeSensitivity(lrPow, bs, wd, drop){
                const base = computeScore(lrPow, bs, wd, drop);
                const deltas = { lrPow:0.05, batch: (bs>=128? -16:16), wd:0.005, drop:0.05 };
                function clamp(v,min,max){ return Math.max(min, Math.min(max,v)); }
                const up = {
                    lr: computeScore(clamp(lrPow+deltas.lrPow,-4,-1), bs, wd, drop)-base,
                    batch: computeScore(lrPow, clamp(bs+deltas.batch,8,128), wd, drop)-base,
                    wd: computeScore(lrPow, bs, clamp(wd+deltas.wd,0,0.1), drop)-base,
                    drop: computeScore(lrPow, bs, wd, clamp(drop+deltas.drop,0,0.7))-base
                };
                const down = {
                    lr: computeScore(clamp(lrPow-deltas.lrPow,-4,-1), bs, wd, drop)-base,
                    batch: computeScore(lrPow, clamp(bs-deltas.batch,8,128), wd, drop)-base,
                    wd: computeScore(lrPow, bs, clamp(wd-deltas.wd,0,0.1), drop)-base,
                    drop: computeScore(lrPow, bs, wd, clamp(drop-deltas.drop,0,0.7))-base
                };
                return {base, up, down};
            }

            function renderSensitivity(lrPow, bs, wd, drop){
                if(!sensEl) return; const sens=computeSensitivity(lrPow, bs, wd, drop);
                const mags=[Math.abs(sens.up.lr),Math.abs(sens.down.lr),Math.abs(sens.up.batch),Math.abs(sens.down.batch),Math.abs(sens.up.wd),Math.abs(sens.down.wd),Math.abs(sens.up.drop),Math.abs(sens.down.drop)];
                const maxMag = Math.max(0.0005, ...mags);
                function pct(v){ return (Math.abs(v)/maxMag)*50; } // each side up to 50%
                function bar(label, up, down){
                    const upPct = pct(up); const downPct = pct(down);
                    const upColor = up>=0? '#16a34a':'#dc2626';
                    const downColor = down>=0? '#16a34a':'#dc2626';
                    return `<div class="text-[11px]">
                        <div class="flex items-center justify-between"><span class="font-medium text-indigo-900">${label}</span><span class="text-gray-500">Δscore up/down</span></div>
                        <div class="flex items-center gap-2 mt-0.5">
                            <div class="flex-1 h-3 relative bg-white/70 rounded border overflow-hidden">
                                <div title="Decrease" style="position:absolute;right:50%;top:0;bottom:0;width:${downPct}%;background:${downColor};opacity:0.55"></div>
                                <div title="Increase" style="position:absolute;left:50%;top:0;bottom:0;width:${upPct}%;background:${upColor};opacity:0.55"></div>
                                <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:#334155"></div>
                            </div>
                            <span class="w-24 text-right font-mono">${up>=0?'+':''}${up.toFixed(3)} / ${down>=0?'+':''}${down.toFixed(3)}</span>
                        </div>
                    </div>`;
                }
                const html = [
                    bar('Learning rate', sens.up.lr, sens.down.lr),
                    bar('Batch size', sens.up.batch, sens.down.batch),
                    bar('Weight decay', sens.up.wd, sens.down.wd),
                    bar('Dropout', sens.up.drop, sens.down.drop)
                ].join('');
                const plateau = mags.every(m=>m < 0.003) ? '<div class="text-[10px] text-indigo-700 mt-2">All local deltas are very small → near a plateau; try bigger moves or a different combination.</div>' : '';
                sensEl.innerHTML = html + plateau;
            }

            function interactionText(lr, bs, wd, drop){
                const parts=[];
                if(lr>0.01 && wd<0.002 && drop<0.1) parts.push('High LR + low regularization → sharp descent + overfit risk.');
                if(lr<5e-4 && bs>96) parts.push('Very low LR with large batch may waste hardware (slow progress).');
                if(drop>0.45 && bs<32) parts.push('High dropout + small batch can compound noise → slow convergence.');
                if(wd>0.04 && lr<8e-4) parts.push('Strong weight decay with a tiny LR may underfit severely.');
                if(!parts.length) parts.push('Current hyperparameter interactions look balanced; adjust to explore edge cases.');
                return parts.join(' ');
            }

            function render() {
                const lrPow = parseFloat(lrEl.value || '-2.5');
                const bs = parseInt(bsEl.value || '32', 10);
                const wd = parseFloat(wdEl.value || '0.01');
                const drop = parseFloat(doEl.value || '0.1');
                const score = computeScore(lrPow, bs, wd, drop);
                setImpact(score);
                // Score flash
                if (prev.score!=null){
                    flash(badgeEl, score>prev.score? 'q48-flash-up':'q48-flash-down');
                    flash(meterEl, score>prev.score? 'q48-flash-up':'q48-flash-down');
                }
                const lr = Math.pow(10, lrPow);

                // Live value readouts
                if (lrVal) lrVal.textContent = (lr).toExponential(2);
                if (wdVal) wdVal.textContent = wd.toFixed(3);
                if (doVal) doVal.textContent = drop.toFixed(2);

                // Pros/Cons
                const pros = [];
                const cons = [];
                if (score >= 0.8) pros.push('Learning setup likely stable and fast');
                else if (score >= 0.6) pros.push('Training likely stable; tune further for speed');
                else pros.push('Conservative but may be stable; iterate to improve');

                if (Math.pow(10, lrPow) > 0.02) cons.push('Learning rate may be too high → divergence risk');
                if (wd > 0.05) cons.push('Weight decay may underfit; reduce if validation loss is high');
                if (drop > 0.5) cons.push('High dropout can slow learning and hurt capacity');
                if (bs < 16) cons.push('Very small batch may be noisy; consider gradient accumulation');
                if (bs > 128) cons.push('Very large batch may need warmup or higher LR schedule');

                prosEl.innerHTML = pros.map(p => `<li>${p}</li>`).join('');
                consEl.innerHTML = cons.map(c => `<li>${c}</li>`).join('');

                // Regimes
                if (regimesEl){
                    const regimes = computeRegimes(lr, bs, wd, drop);
                    regimesEl.innerHTML = regimes.map(r=>`<span class="q48-chip ${r.c}">${r.t}</span>`).join('');
                }

                // Simulation
                const sim = simulateCurves(lr, bs, wd, drop);
                drawCurves(sim); drawNorm(sim);
                const noise = Math.min(1, (lr / Math.sqrt(bs)) * (1 - drop*0.4) * 40);
                if (noiseBar){ noiseBar.style.width = `${Math.round(noise*100)}%`; }
                if (noiseText){ noiseText.textContent = `Relative gradient noise ~ ${(noise*100).toFixed(0)}%`; }
                if (effStepEl){
                    const eff = lr * (1 - Math.min(0.7, wd*3)) * (1 - drop*0.2);
                    effStepEl.textContent = `η_eff ≈ ${(eff).toExponential(2)}`;
                }
                if (curveLabel){
                    if (sim.overfitEpoch!=null) curveLabel.textContent = `Overfit onset ~ epoch ${sim.overfitEpoch}`;
                    else curveLabel.textContent = `No strong overfitting signal (reg ≥ ${(wd*6+drop*0.8).toFixed(2)})`;
                }

                // Sensitivity & interactions
                renderSensitivity(lrPow, bs, wd, drop);
                if(interEl) interEl.textContent = interactionText(lr, bs, wd, drop);

                // Phase 4 advanced updates
                drawNoiseSignal(lr, bs, wd, drop);
                renderRegBreak(lr, bs, wd, drop);
                autoSuggestion(lr, bs, wd, drop, score);
                updateTrail(lrPow, bs, wd, drop, score);

                // Explanation text with inline math
                const eta = Math.pow(10, lrPow).toExponential(1);
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2\"><span class=\"text-indigo-700\">Current setup</span>
                    <span class=\"text-xs text-gray-500\">(η=${eta}, batch=${bs}, wd=${wd.toFixed(3)}, dropout=${drop.toFixed(2)})</span></div>
                    Hyperparameters shape the path optimization takes: learning rate scales the gradient step, batch size smooths gradient estimates, and regularization terms (weight decay/dropout) temper overfitting.
                `;
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }

                // Change explanation
                if (changeEl){
                    const parts=[];
                    if (prev.lrPow!=null && prev.lrPow!==lrPow) parts.push(`LR ${Math.pow(10, prev.lrPow).toExponential(1)}→${lr.toExponential(1)}`);
                    if (prev.bs!=null && prev.bs!==bs) parts.push(`Batch ${prev.bs}→${bs}`);
                    if (prev.wd!=null && prev.wd!==wd) parts.push(`WD ${prev.wd.toFixed(3)}→${wd.toFixed(3)}`);
                    if (prev.drop!=null && prev.drop!==drop) parts.push(`Dropout ${prev.drop.toFixed(2)}→${drop.toFixed(2)}`);
                    if (prev.score!=null && prev.score!==score) parts.push(`Score ${Math.round(prev.score*100)}→${Math.round(score*100)}%`);
                    if (!parts.length) parts.push('Adjust a slider to compare stability & generalization trade-offs.');
                    changeEl.textContent = parts.join('; ') + '.';
                    prev.lrPow=lrPow; prev.bs=bs; prev.wd=wd; prev.drop=drop; prev.score=score;
                }
            }

            lrEl.addEventListener('input', render);
            bsEl.addEventListener('change', render);
            wdEl.addEventListener('input', render);
            doEl.addEventListener('input', render);
            if (snapshotBtn){
                snapshotBtn.addEventListener('click', ()=>{
                    const lrPow = parseFloat(lrEl.value||'-2.5');
                    const payload = {
                        learningRate: Math.pow(10, lrPow),
                        batchSize: parseInt(bsEl.value||'32',10),
                        weightDecay: parseFloat(wdEl.value||'0.01'),
                        dropout: parseFloat(doEl.value||'0.1'),
                        score: prev.score || null,
                        timestamp: new Date().toISOString()
                    };
                    const text = JSON.stringify(payload, null, 2);
                    navigator.clipboard.writeText(text).then(()=>{
                        if (snapshotStatus){ snapshotStatus.textContent = 'Copied!'; setTimeout(()=>{ if(snapshotStatus.textContent==='Copied!') snapshotStatus.textContent=''; }, 1800); }
                    }).catch(()=>{ if(snapshotStatus) snapshotStatus.textContent='Clipboard blocked'; });
                });
            }

            // Preset logic
            function applyPreset(name){
                const presets={
                    balanced:{ lrPow:-2.5, bs:32, wd:0.01, drop:0.1 },
                    underfit:{ lrPow:-3.6, bs:128, wd:0.06, drop:0.5 },
                    overfit:{ lrPow:-2.0, bs:16, wd:0.0, drop:0.0 },
                    unstable:{ lrPow:-1.2, bs:32, wd:0.002, drop:0.05 },
                    slow:{ lrPow:-3.4, bs:8, wd:0.015, drop:0.1 }
                };
                const p = presets[name]; if(!p) return;
                lrEl.value = p.lrPow.toString();
                bsEl.value = p.bs.toString();
                wdEl.value = p.wd.toString();
                doEl.value = p.drop.toString();
                render();
            }
            document.querySelectorAll('.q48-preset').forEach(btn=>{
                btn.addEventListener('click', ()=> applyPreset(btn.getAttribute('data-preset')));
            });

            // A/B capture
            function updateAB(){
                if(abDiff && snapA && snapB){
                    abDiff.textContent = diffSnapshots(snapA, snapB);
                    abPanel.classList.remove('hidden');
                } else if (abPanel){
                    abPanel.classList.add('hidden');
                }
                abClear.disabled = !(snapA||snapB);
                abCaptureB.disabled = !snapA;
            }
            function capture(which){
                const lrPow = parseFloat(lrEl.value||'-2.5');
                const bs = parseInt(bsEl.value||'32',10);
                const wd = parseFloat(wdEl.value||'0.01');
                const drop = parseFloat(doEl.value||'0.1');
                const score = computeScore(lrPow, bs, wd, drop);
                const shot = snapshotState(lrPow, bs, wd, drop, score);
                if(which==='A'){ snapA = shot; abStatus.textContent='Captured A'; }
                else { snapB = shot; abStatus.textContent='Captured B'; }
                updateAB();
                setTimeout(()=>{ if(abStatus.textContent.startsWith('Captured')) abStatus.textContent=''; }, 1500);
            }
            if(abCaptureA) abCaptureA.addEventListener('click', ()=> capture('A'));
            if(abCaptureB) abCaptureB.addEventListener('click', ()=> capture('B'));
            if(abClear) abClear.addEventListener('click', ()=>{ snapA=null; snapB=null; updateAB(); });

            if(lrFinderBtn){ lrFinderBtn.addEventListener('click', ()=>{ drawLRFinder(); if(advStatus){ advStatus.textContent='LR sweep generated'; setTimeout(()=>{ if(advStatus.textContent==='LR sweep generated') advStatus.textContent=''; },1500);} }); }
            if(exportTrailBtn){ exportTrailBtn.addEventListener('click', ()=>{
                if(!trail.length) { if(advStatus) advStatus.textContent='Trail empty'; return; }
                const out = trail.map(r=>({t:new Date(r.t).toISOString(), ...r}));
                const text = JSON.stringify(out, null, 2);
                navigator.clipboard.writeText(text).then(()=>{ if(advStatus){advStatus.textContent='Trail copied'; setTimeout(()=>{ if(advStatus.textContent==='Trail copied') advStatus.textContent=''; },1500);} }).catch(()=>{ if(advStatus) advStatus.textContent='Clipboard blocked'; });
            }); }

            render();
        }
    }
};

// Standard optional export
if (typeof module !== 'undefined') { module.exports = question; }
