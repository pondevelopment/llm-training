const interactiveScript = () => {
  const root = document.getElementById('p18-budget');
  if (!root) return;

  const riskInput = document.getElementById('p18-risk');
  const effectInput = document.getElementById('p18-effect');
  const vslInput = document.getElementById('p18-vsl');

  const spendMetric = document.getElementById('p18-metric-spend');
  const riskMetric = document.getElementById('p18-metric-risk');
  const capitaMetric = document.getElementById('p18-metric-capita');
  const explanation = document.getElementById('p18-explanation');

  if (!riskInput || !effectInput || !vslInput || !spendMetric || !riskMetric || !capitaMetric || !explanation) {
    return;
  }

  const GDP_PER_CAPITA = 90000; // USD approximation for a high-income economy
  const GRID_STEP = 0.005; // 0.5 percentage point of GDP

  const computeOptimalSpend = (riskPercent, effectPercent, vslMillions) => {
    const risk = riskPercent / 100; // probability per year
    const effectPerPoint = Math.min(effectPercent / 100, 0.95); // fractional reduction per 1% of GDP
    const vslValue = vslMillions * 1_000_000;

    let bestSpend = 0;
    let bestResidual = risk;
    let bestNet = -Infinity;

    for (let spend = 0; spend <= 0.5 + 1e-6; spend += GRID_STEP) {
      const increments = Math.round(spend * 100); // number of 1% GDP slices
      const residual = risk * Math.pow(1 - effectPerPoint, increments);
      const avoided = risk - residual;
      const benefit = avoided * vslValue;
      const cost = spend * GDP_PER_CAPITA;
      const net = benefit - cost;

      if (net > bestNet) {
        bestNet = net;
        bestSpend = spend;
        bestResidual = residual;
      }
    }

    return {
      spendShare: bestSpend,
      residualRisk: bestResidual,
      perCapitaSpend: bestSpend * GDP_PER_CAPITA
    };
  };

  const render = () => {
    const risk = Number(riskInput.value);
    const effect = Number(effectInput.value);
    const vslMillions = Number(vslInput.value);

    const { spendShare, residualRisk, perCapitaSpend } = computeOptimalSpend(risk, effect, vslMillions);

    spendMetric.textContent = `${(spendShare * 100).toFixed(1)}% GDP`;
    riskMetric.textContent = `${(residualRisk * 100).toFixed(2)}% / yr`;
    capitaMetric.textContent = `$${Math.round(perCapitaSpend).toLocaleString()}`;

    const rawRisk = risk.toFixed(1);
    const narratives = [
      `Initial annual catastrophe risk of ${rawRisk}% and mitigation effectiveness of ${effect.toFixed(0)}% per GDP point imply an optimal safety budget of ${(spendShare * 100).toFixed(1)}% of GDP.`,
      `At that spend, residual risk falls to ${(residualRisk * 100).toFixed(2)}% per year, echoing Jones's point that budgets at or above 1% of GDP are justified for single-digit risks.`,
      `The implied willingness-to-pay is about $${Math.round(perCapitaSpend).toLocaleString()} per person, using a value of statistical life of $${(vslMillions * 1_000_000).toLocaleString()}.`
    ];

    explanation.innerHTML = narratives.map(text => `<p>${text}</p>`).join('');
  };

  [riskInput, effectInput, vslInput].forEach(input => {
    input.addEventListener('input', render);
  });

  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper18Interactive = interactiveScript;
}