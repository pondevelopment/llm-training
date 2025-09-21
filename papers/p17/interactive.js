const interactiveScript = () => {
  const root = document.getElementById('p17-model');
  if (!root) return;

  const growthInput = document.getElementById('p17-growth');
  const gpuCostInput = document.getElementById('p17-gpu-cost');
  const accessoryInput = document.getElementById('p17-accessory');

  const growthMetric = document.getElementById('p17-metric-growth');
  const wageMetric = document.getElementById('p17-metric-wage');
  const shareMetric = document.getElementById('p17-metric-share');
  const explanation = document.getElementById('p17-explanation');

  if (!growthInput || !gpuCostInput || !accessoryInput || !growthMetric || !wageMetric || !shareMetric || !explanation) {
    return;
  }

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const computeShadowWage = (gpuCost, accessoryShare) => {
    const hoursEquivalent = 1.5 + accessoryShare / 25; // accessory-heavy portfolios need more compute to replicate nuanced work
    return gpuCost * hoursEquivalent;
  };

  const computeLaborShare = (growthPercent, accessoryShare) => {
    const accessoryWeight = accessoryShare / 100;
    const share = accessoryWeight * Math.exp(-growthPercent / 8);
    return clamp(share, 0, 0.8);
  };

  const render = () => {
    const growth = Number(growthInput.value);
    const gpuCost = Number(gpuCostInput.value);
    const accessory = Number(accessoryInput.value);

    const shadowWage = computeShadowWage(gpuCost, accessory);
    const laborShare = computeLaborShare(growth, accessory);

    growthMetric.textContent = `${growth}%`;
    wageMetric.textContent = `$${Math.round(shadowWage)}`;
    shareMetric.textContent = `${Math.max(0, Math.round(laborShare * 100))}%`;

    const narratives = [
      `Compute capacity expanding at ${growth}% annually pins long-run GDP growth to the same pace once AGI clears every bottleneck task.`,
      `At $${gpuCost}/GPU-hour and ${accessory}% accessory work, duplicating a worker's output with AGI takes roughly $${shadowWage.toFixed(1)} per labor hour.`,
      `Labor's income share drifts toward ${Math.max(0, (laborShare * 100).toFixed(1))}% -- the residual value comes from accessory roles or compute that humans spare.`
    ];

    explanation.innerHTML = narratives.map(text => `<p>${text}</p>`).join('');
  };

  growthInput.addEventListener('input', render);
  gpuCostInput.addEventListener('input', render);
  accessoryInput.addEventListener('input', render);
  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper17Interactive = interactiveScript;
}
