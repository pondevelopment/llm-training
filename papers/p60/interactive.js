const interactiveScript = () => {
  const root = document.getElementById('p60-explorer');
  if (!root) return;

  const modelSelect = document.getElementById('p60-model');
  const stepsInput = document.getElementById('p60-steps');
  const stepsVal = document.getElementById('p60-steps-val');
  const kInput = document.getElementById('p60-k');
  const kVal = document.getElementById('p60-k-val');
  
  const probEl = document.getElementById('p60-prob');
  const kminEl = document.getElementById('p60-kmin');
  const costEl = document.getElementById('p60-cost');
  const effEl = document.getElementById('p60-efficiency');
  const insightEl = document.getElementById('p60-insight');

  const formatMoney = (val) => {
    if (val < 1) return '$' + val.toFixed(2);
    if (val < 1000) return '$' + val.toFixed(2);
    if (val < 1000000) return '$' + (val / 1000).toFixed(1) + 'K';
    return '$' + (val / 1000000).toFixed(1) + 'M';
  };

  const formatSteps = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
    return val;
  };

  const update = () => {
    // Inputs
    const opt = modelSelect.selectedOptions[0];
    const pErr = parseFloat(opt.dataset.err);
    const costPerM = parseFloat(opt.dataset.cost);
    const tokensPerStep = parseFloat(opt.dataset.tok);
    
    const stepsLog = parseFloat(stepsInput.value);
    const steps = Math.round(Math.pow(10, stepsLog));
    stepsVal.textContent = formatSteps(steps);
    
    const k = parseInt(kInput.value);
    kVal.textContent = 'k=' + k;

    // Calculations
    const p = 1 - pErr;
    
    // 1. Probability of success (Eq 13 for m=1)
    // p_sub = 1 / (1 + ((1-p)/p)^k)
    let pSub = 0;
    if (p > 0.5) {
      const ratio = (1 - p) / p;
      const ratioK = Math.pow(ratio, k);
      pSub = 1 / (1 + ratioK);
    } else {
      pSub = 0; // Cannot succeed if p <= 0.5
    }
    
    const pFull = Math.pow(pSub, steps);
    
    // 2. Recommended k (Eq 14)
    // k_min = ln(t^(-1/s) - 1) / ln((1-p)/p)
    let kMin = Infinity;
    if (p > 0.5) {
      const t = 0.95;
      const num = Math.log(Math.pow(t, -1/steps) - 1);
      const den = Math.log((1 - p) / p);
      kMin = Math.ceil(num / den);
    }

    // 3. Expected Cost (Eq 17 approx)
    // E[cost] = steps * (k / (2p - 1)) * cost_per_step
    // cost_per_step = (tokens / 1M) * cost_per_M
    let totalCost = Infinity;
    if (p > 0.5) {
      const costPerVote = (tokensPerStep / 1000000) * costPerM;
      const avgVotes = k / (2 * p - 1);
      totalCost = steps * avgVotes * costPerVote;
    }

    // Render
    // Probability
    if (pFull > 0.9999) probEl.textContent = '>99.9%';
    else if (pFull < 0.0001) probEl.textContent = '<0.01%';
    else probEl.textContent = (pFull * 100).toFixed(1) + '%';
    
    // Color code probability
    probEl.className = 'text-3xl font-bold ' + (pFull > 0.9 ? 'text-success' : (pFull > 0.5 ? 'text-warning' : 'text-error'));

    // kMin
    if (kMin === Infinity || isNaN(kMin)) kminEl.textContent = 'Impossible';
    else kminEl.textContent = kMin;

    // Cost
    if (totalCost === Infinity) costEl.textContent = '∞';
    else costEl.textContent = formatMoney(totalCost);

    // Efficiency
    if (totalCost !== Infinity && pFull > 0.9) {
      effEl.textContent = 'Reliable';
      effEl.className = 'font-mono text-success';
    } else if (totalCost !== Infinity) {
      effEl.textContent = 'Unreliable';
      effEl.className = 'font-mono text-error';
    } else {
      effEl.textContent = 'Failed';
      effEl.className = 'font-mono text-error';
    }

    // Insight
    let insight = '';
    if (p <= 0.5) {
      insight = `<p class="text-error"><strong>Model too inaccurate:</strong> This model's error rate (${(pErr*100).toFixed(1)}%) is too high (>50%). Voting fails because the model is wrong more often than it is right.</p>`;
    } else if (pFull < 0.9) {
      if (k < kMin) {
        insight = `<p class="text-warning"><strong>Increase Consensus (k):</strong> Current k=${k} is not enough for ${formatSteps(steps)} steps. You need <strong>k=${kMin}</strong> to reach 95% reliability.</p>`;
      } else {
        insight = `<p class="text-warning"><strong>Reliability low:</strong> Even with voting, the error probability accumulates over ${formatSteps(steps)} steps.</p>`;
      }
    } else {
      insight = `<p class="text-success"><strong>Success!</strong> The system successfully scales to ${formatSteps(steps)} steps with >90% success probability.</p>`;
      if (k > kMin + 2) {
        insight += `<p class="mt-1 text-xs panel-muted">Tip: You could lower k to ${kMin} to save money while maintaining reliability.</p>`;
      }
    }
    
    // Add baseline comparison
    const baselineProb = Math.pow(p, steps);
    const baselineText = baselineProb < 0.0001 ? '≈0%' : (baselineProb * 100).toFixed(1) + '%';
    insight += `<p class="mt-2 text-xs border-t border-divider pt-2">Without Voting (standard approach), success probability would be <strong>${baselineText}</strong>.</p>`;

    insightEl.innerHTML = insight;
  };

  modelSelect.addEventListener('change', update);
  stepsInput.addEventListener('input', update);
  kInput.addEventListener('input', update);
  
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paperXXInteractive = interactiveScript;
}
