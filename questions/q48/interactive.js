const interactiveScript = () => {
            const lrEl = document.getElementById('q48-lr');
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

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

            function readCssVar(name){
                const value = getComputedStyle(document.documentElement).getPropertyValue(name);
                return value ? value.trim() : '';
            }
            function colorVar(name, fallback){
                const value = readCssVar(name);
                return value || fallback;
            }
            function colorVarAlpha(name, alpha, fallback){
                const base = colorVar(name, fallback);
                if(!base) return fallback;
                const hexMatch = base.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
                if(hexMatch){
                    const hex = hexMatch[1];
                    const expanded = hex.length === 3 ? hex.split('').map(ch=>ch+ch).join('') : hex;
                    const num = parseInt(expanded, 16);
                    const r = (num >> 16) & 255;
                    const g = (num >> 8) & 255;
                    const b = num & 255;
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                }
                const normalized = base.replace(/\s+/g,' ');
                const rgbMatch = normalized.match(/^rgba?\((.+)\)$/i);
                if(rgbMatch){
                    const parts = rgbMatch[1].split(/[\s,\/]+/).filter(Boolean).slice(0,3).map(Number);
                    if(parts.length === 3 && parts.every(n=>!Number.isNaN(n))){
                        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
                    }
                }
                const hslMatch = normalized.match(/^hsla?\((.+)\)$/i);
                if(hslMatch){
                    const parts = hslMatch[1].split(',').map(p=>p.trim());
                    if(parts.length >= 3){
                        const h = parts[0];
                        const s = parts[1];
                        const l = parts[2];
                        return `hsla(${h}, ${s}, ${l}, ${alpha})`;
                    }
                }
                return base;
            }

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
                ctx.strokeStyle = colorVar('--color-border-subtle', '#e5e7eb'); ctx.lineWidth=1; ctx.beginPath();
                for(let i=0;i<=4;i++){ const y = i/4 * (curveCanvas.height-8)+4; ctx.moveTo(0,y); ctx.lineTo(curveCanvas.width,y);} ctx.stroke();
                drawSeries(ctx, sim.train, colorVar('--tone-sky-strong', '#2563eb'), minY, maxY);
                drawSeries(ctx, sim.val, colorVar('--color-path-scaling-strong', '#dc2626'), minY, maxY);
                if (sim.overfitEpoch!=null){
                    const x = (sim.overfitEpoch/(sim.train.length-1))*(curveCanvas.width-8)+4;
                    ctx.strokeStyle = colorVar('--tone-amber-strong', '#f59e0b'); ctx.setLineDash([4,3]); ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,curveCanvas.height); ctx.stroke(); ctx.setLineDash([]);
                }
            }

            function drawNorm(sim){
                if(!normCanvas) return; const ctx = normCanvas.getContext('2d');
                ctx.clearRect(0,0,normCanvas.width, normCanvas.height);
                const minY = Math.min(...sim.norm)-0.02; const maxY = Math.max(...sim.norm)+0.02;
                drawSeries(ctx, sim.norm, colorVar('--tone-purple-strong', '#7c3aed'), minY, maxY);
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
                if(lrWindowEl) lrWindowEl.textContent = `Suggested eta window ~ ${windowLow.toExponential(1)} - ${windowHigh.toExponential(1)}`;
                ctx.clearRect(0,0,lrFinderCanvas.width, lrFinderCanvas.height);
                // axes
                ctx.strokeStyle = colorVar('--color-border-subtle', '#e5e7eb'); ctx.beginPath(); ctx.moveTo(30,5); ctx.lineTo(30,110); ctx.lineTo(455,110); ctx.stroke();
                const minY = Math.min(...losses); const maxY = Math.max(...losses);
                ctx.strokeStyle = colorVar('--tone-sky-strong', '#2563eb'); ctx.beginPath();
                for(let i=0;i<points;i++){
                    const x = 30 + (i/(points-1))*(lrFinderCanvas.width-40);
                    const y = 110 - ((losses[i]-minY)/(maxY-minY))*95;
                    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                }
                ctx.stroke();
                // best marker
                const bx = 30 + (bestIdx/(points-1))*(lrFinderCanvas.width-40);
                const by = 110 - ((minLoss-minY)/(maxY-minY))*95;
                ctx.fillStyle = colorVar('--color-path-scaling-strong', '#dc2626'); ctx.beginPath(); ctx.arc(bx,by,4,0,Math.PI*2); ctx.fill();
                // window highlight
                ctx.fillStyle = colorVarAlpha('--tone-emerald-strong', 0.04, getCssVar('--tone-emerald-strong', '#22c55e'));
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
                if(noiseRatioEl) noiseRatioEl.textContent = `Noise ratio approx ${ratio.toFixed(2)}`;
                // axes
                ctx.strokeStyle = colorVar('--color-border-subtle', '#e5e7eb'); ctx.beginPath(); ctx.moveTo(30,5); ctx.lineTo(30,h-10); ctx.lineTo(w-5,h-10); ctx.stroke();
                // scatter representing angular drift; more noise -> farther radial distance
                const points = 40;
                const fillColor = colorVarAlpha('--tone-indigo-strong', 0.6, getCssVar('--tone-indigo-strong', '#6366f1'));
                ctx.fillStyle = fillColor;
                for(let i=0;i<points;i++){
                    const base = (i/points)*Math.PI*4;
                    const r = 5 + Math.min(40, ratio*25) + Math.sin(i)*2;
                    const x = 30 + (w-60)/2 + Math.cos(base)*r;
                    const y = (h-10)/2 + Math.sin(base)*r;
                    ctx.fillRect(x,y,3,3);
                }
                // center point
                ctx.fillStyle = colorVar('--color-secondary', '#334155'); ctx.beginPath(); ctx.arc(30+(w-60)/2,(h-10)/2,3,0,Math.PI*2); ctx.fill();
            }

            function renderRegBreak(lr, bs, wd, drop){
                if(!regBreakEl) return; const noise = (lr/Math.sqrt(bs))*(1-drop*0.4);
                let wdC = wd*4; let doC = drop*0.6; let noiseC = noise*0.9; // scale similar magnitude
                const total = wdC + doC + noiseC + 0.000001;
                const segments = [
                    {label:'Weight decay', value:wdC, fill:'q48-break-fill q48-break-fill--wd'},
                    {label:'Dropout', value:doC, fill:'q48-break-fill q48-break-fill--drop'},
                    {label:'Noise', value:noiseC, fill:'q48-break-fill q48-break-fill--noise'},
                ];
                regBreakEl.innerHTML = segments.map(seg=>{
                    const pct = (seg.value/total)*100;
                    return `<div class="flex items-center gap-2">
                        <span class="w-24 text-xs text-muted">${seg.label}</span>
                        <div class="flex-1 h-2 rounded q48-progress-track overflow-hidden">
                            <div class="${seg.fill}" style="width:${pct.toFixed(1)}%"></div>
                        </div>
                        <span class="w-12 text-xs text-muted text-right">${pct.toFixed(1)}%</span>
                    </div>`;
                }).join('');
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
                    else suggestions.push('Tweak LR +/- 0.2 log units or adjust regularization to climb toward higher score.');
                }
                if(suggestionEl){
                    suggestionEl.innerHTML = suggestions.map(s=>`<div class="flex items-start gap-2"><span class="text-info" aria-hidden="true">&bull;</span><span>${s}</span></div>`).join('');
                }
            }

            function setImpact(score) {
                score = Math.max(0, Math.min(1, score));
                const percent = Math.round(score*100);
                let state = 'poor';
                let label = `Poor (${percent}%)`;
                if (score >= 0.8) { state = 'excellent'; label = `Excellent (${percent}%)`; }
                else if (score >= 0.6) { state = 'good'; label = `Good (${percent}%)`; }
                else if (score >= 0.35) { state = 'limited'; label = `Limited (${percent}%)`; }
                badgeEl.textContent = label;
                const states = ['excellent','good','limited','poor'];
                states.forEach(s=>{
                    badgeEl.classList.toggle(`is-${s}`, s===state);
                    meterEl.classList.toggle(`is-${s}`, s===state);
                });
                meterEl.style.width = `${percent}%`;
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
                        if(f==='score') line += ` (delta ${(bv-av).toFixed(3)})`;
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
                if(!sensEl) return;
                const sens = computeSensitivity(lrPow, bs, wd, drop);
                const entries = [
                    {label:'Learning rate', up:sens.up.lr, down:sens.down.lr},
                    {label:'Batch size', up:sens.up.batch, down:sens.down.batch},
                    {label:'Weight decay', up:sens.up.wd, down:sens.down.wd},
                    {label:'Dropout', up:sens.up.drop, down:sens.down.drop},
                ];
                const magnitudes = entries.flatMap(e=>[Math.abs(e.up), Math.abs(e.down)]);
                const maxMag = Math.max(0.0005, ...magnitudes);
                const formatDelta = v=>`${v>=0?'+':''}${v.toFixed(3)}`;
                const html = entries.map(entry=>{
                    const upPct = (Math.abs(entry.up)/maxMag)*50;
                    const downPct =(Math.abs(entry.down)/maxMag)*50;
                    const upClass = entry.up>=0? 'q48-sens-fill q48-sens-fill--positive':'q48-sens-fill q48-sens-fill--negative';
                    const downClass = entry.down>=0? 'q48-sens-fill q48-sens-fill--positive':'q48-sens-fill q48-sens-fill--negative';
                    return `<div class="text-xs space-y-1">
                        <div class="flex items-center justify-between"><span class="font-medium text-heading">${entry.label}</span><span class="text-muted">Score delta (up/down)</span></div>
                        <div class="flex items-center gap-2">
                            <div class="flex-1 h-3 relative rounded q48-sens-track">
                                <div class="${downClass}" style="right:50%;width:${downPct.toFixed(1)}%"></div>
                                <div class="${upClass}" style="left:50%;width:${upPct.toFixed(1)}%"></div>
                                <div class="q48-sens-axis" aria-hidden="true"></div>
                            </div>
                            <span class="w-28 text-right font-mono">${formatDelta(entry.up)} / ${formatDelta(entry.down)}</span>
                        </div>
                    </div>`;
                }).join('');
                const plateau = magnitudes.every(m=>m < 0.003)
                    ? '<div class="text-xs text-info mt-2">All local deltas are very small -> near a plateau; try bigger moves or another combination.</div>'
                    : '';
                sensEl.innerHTML = html + plateau;
            }

            function interactionText(lr, bs, wd, drop){
                const parts=[];
                if(lr>0.01 && wd<0.002 && drop<0.1) parts.push('High LR + low regularization -> sharp descent and overfit risk.');
                if(lr<5e-4 && bs>96) parts.push('Very low LR with large batch may waste hardware (slow progress).');
                if(drop>0.45 && bs<32) parts.push('High dropout + small batch can compound noise -> slow convergence.');
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

                if (Math.pow(10, lrPow) > 0.02) cons.push('Learning rate may be too high -> divergence risk');
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
                    effStepEl.textContent = `η_eff approx ${(eff).toExponential(2)}`;
                }
                if (curveLabel){
                    if (sim.overfitEpoch!=null) curveLabel.textContent = `Overfit onset ~ epoch ${sim.overfitEpoch}`;
                    else curveLabel.textContent = `No strong overfitting signal (reg >= ${(wd*6+drop*0.8).toFixed(2)})`;
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
                    <div class=\"flex items-center gap-2 mb-2\"><span class=\"text-info\">Current setup</span>
                    <span class=\"text-xs text-muted\">(η=${eta}, batch=${bs}, wd=${wd.toFixed(3)}, dropout=${drop.toFixed(2)})</span></div>
                    Hyperparameters shape the path optimization takes: learning rate scales the gradient step, batch size smooths gradient estimates, and regularization terms (weight decay/dropout) temper overfitting.
                `;
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }

                // Change explanation
                if (changeEl){
                    const parts=[];
                    if (prev.lrPow!=null && prev.lrPow!==lrPow) parts.push(`LR ${Math.pow(10, prev.lrPow).toExponential(1)}->${lr.toExponential(1)}`);
                    if (prev.bs!=null && prev.bs!==bs) parts.push(`Batch ${prev.bs}->${bs}`);
                    if (prev.wd!=null && prev.wd!==wd) parts.push(`WD ${prev.wd.toFixed(3)}->${wd.toFixed(3)}`);
                    if (prev.drop!=null && prev.drop!==drop) parts.push(`Dropout ${prev.drop.toFixed(2)}->${drop.toFixed(2)}`);
                    if (prev.score!=null && prev.score!==score) parts.push(`Score ${Math.round(prev.score*100)}->${Math.round(score*100)}%`);
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question48Interactive = interactiveScript;
}
