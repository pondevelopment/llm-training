const interactiveScript = () => {
  const KEl = document.getElementById('q44-k');
  const SEl = document.getElementById('q44-s');
  const PEl = document.getElementById('q44-p0');
  const CEl = document.getElementById('q44-cot');
  const BEl = document.getElementById('q44-budget');
  const LEl = document.getElementById('q44-len');
  const presetButtons = Array.from(document.querySelectorAll('[data-q44-preset]'));
  const KVal = document.getElementById('q44-k-val');
  const SVal = document.getElementById('q44-s-val');
  const PVal = document.getElementById('q44-p0-val');
  const barsEl = document.getElementById('q44-bars');
  const metricsEl = document.getElementById('q44-metrics');
  const explainEl = document.getElementById('q44-explain');
  const guideEl = document.getElementById('q44-guide');

  if (!KEl || !SEl || !PEl || !CEl || !BEl || !LEl || !barsEl || !metricsEl || !explainEl) {
    return;
  }

  function accuracy(p0, K, s, cotOn) {
    const lambda = 0.55; // diminishing returns strength
    const c = cotOn ? 1.3 : 1.0; // CoT quality multiplier
    const p = 1 - (1 - p0) * Math.exp(-lambda * s * c * K);
    return Math.min(0.999, Math.max(0, p));
  }

  function budget(K, perShot, budgetLimit, cotOn) {
    const overhead = 64; // instructions + question framing
    const per = perShot * (cotOn ? 2 : 1);
    const available = Math.max(0, budgetLimit - overhead);
    const maxK = per > 0 ? Math.max(0, Math.floor(available / per)) : 0;
    const effectiveK = Math.min(K, maxK);
    const used = overhead + effectiveK * per;
    return { maxK, effectiveK, used, per, overhead, budgetLimit };
  }

  function bar(label, value, tone) {
    const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
    return `
      <div class="q44-bar" data-tone="${tone}">
        <div class="q44-bar-header"><span>${label}</span><span>${(value * 100).toFixed(1)}%</span></div>
        <div class="q44-bar-track"><div class="q44-bar-fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }

  function guidance(deltaPct, K, effectiveK, s, cotOn, bud) {
    const tips = [];
    if (K === 0) tips.push('Add 2-4 shots to test uplift.');
    if (effectiveK === 0 && K > 0) tips.push('Budget too tight: raise prompt budget or shorten each shot.');
    if (s < 0.3 && effectiveK > 0) tips.push('Similarity is low. Curate more relevant examples.');
    if (deltaPct < 3 && effectiveK >= 4) tips.push('Low marginal gain: refresh examples or trim K.');
    const nearBudget = bud.maxK > 0 ? effectiveK / bud.maxK : 1;
    if (nearBudget > 0.85 && deltaPct < 5) tips.push('High cost for modest lift; consider zero-shot or a tool.');
    if (cotOn && deltaPct < 2) tips.push('CoT adds cost but little lift here; try disabling it.');
    if (!tips.length) return 'Configuration looks balanced.';
    return tips.join(' ');
  }

  function render() {
    const K = parseInt(KEl.value, 10);
    const s = parseFloat(SEl.value);
    const p0 = parseFloat(PEl.value);
    const cotOn = CEl.value === 'on';
    const budgetTok = parseInt(BEl.value, 10);
    const lenShot = parseInt(LEl.value, 10);

    KVal.textContent = Number.isFinite(K) ? K : '0';
    SVal.textContent = Number.isFinite(s) ? s.toFixed(2) : '0.00';
    PVal.textContent = Number.isFinite(p0) ? p0.toFixed(2) : '0.00';

    const bud = budget(Number.isFinite(K) ? K : 0, Number.isFinite(lenShot) ? lenShot : 0, Number.isFinite(budgetTok) ? budgetTok : 0, cotOn);
    const pEff = accuracy(Number.isFinite(p0) ? p0 : 0, bud.effectiveK, Number.isFinite(s) ? s : 0, cotOn);
    const pBase = Number.isFinite(p0) ? p0 : 0;

    barsEl.innerHTML = [
      bar('Zero-shot baseline', pBase, 'baseline'),
      bar(`Few-shot (effective K=${bud.effectiveK})`, pEff, 'fewshot')
    ].join('');

    const delta = (pEff - pBase) * 100;
    const shotsCost = bud.effectiveK * bud.per;
    const costPerPct = delta > 0 ? (shotsCost / delta).toFixed(1) : '&mdash;';
    const warn = K > bud.maxK ? `<div class="small-caption text-warning">Requested K exceeds budget; truncated to ${bud.maxK}.</div>` : '';

    metricsEl.innerHTML = `
      <div><span>Tokens used</span><span><span class="font-mono">${bud.used}</span> / <span class="font-mono">${bud.budgetLimit}</span></span></div>
      <div><span>Per-shot tokens</span><span><span class="font-mono">${bud.per}</span> (${cotOn ? 'CoT on' : 'CoT off'})</span></div>
      <div><span>Improvement over zero-shot</span><span class="font-mono">${delta.toFixed(1)}%</span></div>
      <div><span>Token cost per +1%</span><span class="font-mono">${costPerPct}</span></div>
      ${warn}
    `;

    explainEl.innerHTML = `
      <div class="space-y-2">
        <div><strong>Diminishing returns.</strong> Each extra shot helps less. Model: <span>\\(p(K) = 1 - (1 - p_0) e^{-\\lambda s c K}\\)</span>.</div>
        <div><strong>Similarity matters.</strong> Higher <span class="font-mono">s</span> means bigger jumps for the same K.</div>
        <div><strong>Chain-of-thought.</strong> CoT boosts quality (c &gt; 1) but doubles per-shot tokens.</div>
        <div class="small-caption text-muted">Heuristic simulator for intuition; real performance depends on model, prompt style, and retrieval quality.</div>
      </div>
    `;

    if (guideEl) guideEl.textContent = guidance(delta, K, bud.effectiveK, Number.isFinite(s) ? s : 0, cotOn, bud);
    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
  }

  [KEl, SEl, PEl, CEl, BEl, LEl].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  function applyPreset(name) {
    if (name === 'starter') {
      KEl.value = '4';
      SEl.value = '0.7';
      PEl.value = '0.45';
      CEl.value = 'off';
      BEl.value = '512';
      LEl.value = '64';
    } else if (name === 'high-sim') {
      KEl.value = '6';
      SEl.value = '0.9';
    } else if (name === 'cost-tight') {
      KEl.value = '3';
      SEl.value = '0.6';
      BEl.value = '256';
      LEl.value = '32';
    } else if (name === 'cot-heavy') {
      KEl.value = '5';
      CEl.value = 'on';
    }
    render();
  }

  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.getAttribute('data-q44-preset')));
  });

  (function initFromHash() {
    if (!location.hash) return;
    const match = location.hash.match(/question-44\?(.*)$/);
    if (!match) return;
    const params = new URLSearchParams(match[1]);
    if (params.get('K')) KEl.value = params.get('K');
    if (params.get('s')) SEl.value = params.get('s');
    if (params.get('p0')) PEl.value = params.get('p0');
    if (params.get('cot')) CEl.value = params.get('cot');
    if (params.get('B')) BEl.value = params.get('B');
    if (params.get('L')) LEl.value = params.get('L');
  })();

  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question44Interactive = interactiveScript;
}
