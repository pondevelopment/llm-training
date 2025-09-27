const interactiveScript = () => {
  const byId = (id) => document.getElementById(id);
  const inputs = [
    'q52-requests',
    'q52-tp',
    'q52-tc',
    'q52-price',
    'q52-gpu-rate',
    'q52-gpus',
    'q52-util',
    'q52-overhead',
    'q52-cache',
  ].map(byId);
  if (inputs.some((el) => !el)) return;
  const [reqEl, tpEl, tcEl, priceEl, gpuRateEl, gpusEl, utilEl, overheadEl, cacheEl] = inputs;
  const results = byId('q52-results');
  const breakEl = byId('q52-break');
  const whichEl = byId('q52-which');
  const explEl = byId('q52-expl');
  const scenarioSelect = byId('q52-scenario');

  const scenarios = [
    { key: 'proto', name: 'Prototype (low volume)', R: 5000, Tp: 400, Tc: 300, P: 0.02, Hr: 2.5, G: 2, U: 0.35, O: 8000, cache: 10 },
    { key: 'scale', name: 'Scaling growth', R: 250000, Tp: 350, Tc: 300, P: 0.02, Hr: 2.5, G: 8, U: 0.55, O: 18000, cache: 20 },
    { key: 'opt', name: 'High volume optimized', R: 1200000, Tp: 250, Tc: 220, P: 0.018, Hr: 2.3, G: 16, U: 0.7, O: 25000, cache: 35 },
    { key: 'spiky', name: 'Spiky traffic (low util)', R: 300000, Tp: 320, Tc: 280, P: 0.02, Hr: 2.5, G: 12, U: 0.3, O: 20000, cache: 15 },
    { key: 'hybrid', name: 'Hybrid heavy cache', R: 600000, Tp: 300, Tc: 260, P: 0.02, Hr: 2.4, G: 10, U: 0.6, O: 19000, cache: 50 },
  ];

  if (scenarioSelect) {
    scenarios.forEach((scenario) => {
      const opt = document.createElement('option');
      opt.value = scenario.key;
      opt.textContent = scenario.name;
      scenarioSelect.appendChild(opt);
    });
  }

  const fmt = (value, dec = 0) => {
    if (!Number.isFinite(value)) return '—';
    return value.toLocaleString(undefined, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  };

  function calc() {
    const R = Number(reqEl.value) || 0;
    const Tp = Number(tpEl.value) || 0;
    const Tc = Number(tcEl.value) || 0;
    const P = Number(priceEl.value) || 0;
    const Hr = Number(gpuRateEl.value) || 0;
    const G = Number(gpusEl.value) || 0;
    const U = Math.min(1, Math.max(0, Number(utilEl.value) || 0));
    const O = Number(overheadEl.value) || 0;
    const cachePct = Math.min(100, Math.max(0, Number(cacheEl.value) || 0));

    const tokensPerReq = Tp + Tc;
    const effectiveR = R * (1 - cachePct / 100);
    const saasCost = (tokensPerReq * effectiveR / 1000) * P;
    const selfInfra = Hr * 24 * 30 * G * U + O;
    const breakEvenR = tokensPerReq > 0 && P > 0 ? (1000 * selfInfra) / (tokensPerReq * P) : Number.NaN;
    const saasPerK = P;
    const selfPerK = tokensPerReq > 0 && R > 0 ? selfInfra / ((tokensPerReq * R) / 1000) : Number.NaN;

    const cards = [
      '<div class="panel panel-info panel-emphasis p-4 space-y-1">',
      '  <div class="text-[11px] uppercase tracking-wide font-semibold panel-muted">SaaS monthly</div>',
      '  <div class="text-2xl font-bold font-mono">&dollar;' + fmt(saasCost, 0) + '</div>',
      '  <div class="text-[11px] panel-muted">Cache adj: ' + fmt(cachePct, 0) + '% hit</div>',
      '</div>',
      '<div class="panel panel-success panel-emphasis p-4 space-y-1">',
      '  <div class="text-[11px] uppercase tracking-wide font-semibold panel-muted">Self-host monthly</div>',
      '  <div class="text-2xl font-bold font-mono">&dollar;' + fmt(selfInfra, 0) + '</div>',
      '  <div class="text-[11px] panel-muted">Util: ' + (U * 100).toFixed(0) + '% | GPUs: ' + G + '</div>',
      '</div>',
      '<div class="panel panel-warning panel-emphasis p-4 space-y-2">',
      '  <div class="text-[11px] uppercase tracking-wide font-semibold panel-muted">Cost per 1K tokens</div>',
      '  <div class="flex flex-wrap items-baseline gap-2 text-sm">',
      '    <span class="font-semibold">SaaS</span>',
      '    <span class="font-mono">&dollar;' + fmt(saasPerK, 3) + '</span>',
      '    <span class="panel-muted text-xs">vs</span>',
      '    <span class="font-semibold">Self</span>',
      '    <span class="font-mono">' + (Number.isFinite(selfPerK) ? '&dollar;' + fmt(selfPerK, 3) : '—') + '</span>',
      '  </div>',
      '  <div class="text-[11px] panel-muted">Tokens/req: ' + fmt(tokensPerReq) + ' | Eff R: ' + fmt(effectiveR) + '</div>',
      '</div>',
    ];
    results.innerHTML = cards.join('');

    const breakText = Number.isFinite(breakEvenR)
      ? 'Break-even R ≈ ' + fmt(breakEvenR, 0) + ' requests / month'
      : 'Break-even R ≈ —';
    breakEl.textContent = breakText;

    let cheaper;
    let diffPct;
    if (Number.isFinite(saasCost) && Number.isFinite(selfInfra)) {
      if (saasCost < selfInfra) {
        cheaper = 'SaaS currently cheaper';
        diffPct = (selfInfra / saasCost - 1) * 100;
      } else if (selfInfra < saasCost) {
        cheaper = 'Self-host currently cheaper';
        diffPct = (saasCost / selfInfra - 1) * 100;
      } else {
        cheaper = 'Costs roughly equal';
      }
    }

    if (cheaper) {
      const badge = Number.isFinite(diffPct)
        ? '<span class="chip chip-neutral text-xs">' + fmt(Math.abs(diffPct), 1) + '% delta</span>'
        : '';
      whichEl.innerHTML = '<div class="flex items-center justify-between gap-3"><span>' + cheaper + '</span>' + badge + '</div>';
    } else {
      whichEl.innerHTML = '';
    }

    const levers = [];
    if (!Number.isFinite(selfPerK) || selfPerK > saasPerK * 1.2) {
      levers.push('Increase GPU utilization via batching or autoscaling');
    }
    if (tokensPerReq > 700) {
      levers.push('Compress prompts or trim context windows');
    }
    if (cachePct < 30) {
      levers.push('Add response and embedding cache layers');
    }
    if (G > 0 && U < 0.4) {
      levers.push('Right-size GPU count or enable on-demand nodes');
    }
    if (P > 0.025) {
      levers.push('Negotiate SaaS volume discounts');
    }
    if (levers.length === 0) {
      levers.push('You are operating near an efficient frontier; optimize model quality next.');
    }

    const leverItems = levers.map((item) => '<li>' + item + '</li>').join('');
    explEl.innerHTML = '<div class="font-semibold">Optimization levers</div><ul class="list-disc ml-5 space-y-1">' + leverItems + '</ul>';
  }

  inputs.forEach((el) => el.addEventListener('input', calc));
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', () => {
      const sel = scenarioSelect.value;
      if (sel === 'custom') return;
      const scenario = scenarios.find((sc) => sc.key === sel);
      if (!scenario) return;
      reqEl.value = scenario.R;
      tpEl.value = scenario.Tp;
      tcEl.value = scenario.Tc;
      priceEl.value = scenario.P;
      gpuRateEl.value = scenario.Hr;
      gpusEl.value = scenario.G;
      utilEl.value = scenario.U;
      overheadEl.value = scenario.O;
      cacheEl.value = scenario.cache;
      calc();
    });
  }

  calc();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question52Interactive = interactiveScript;
}
