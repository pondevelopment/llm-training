const interactiveScript = () => {
  const root = document.getElementById('pXX-explorer');
  if (!root) return;
  const scenarioSelect = document.getElementById('pXX-scenario');
  const chart = document.getElementById('pXX-chart');
  const explanation = document.getElementById('pXX-explanation');
  const metricLabel = document.getElementById('pXX-metric-label');

  const scenarios = {
    baseline: {
      label: 'Baseline retrieval',
      metric: 'Hit@5 ≈ 62%',
      description: [
        'Reference configuration drawn from the paper baseline.',
        'Use this block to describe what assumptions hold (dimensionality, noise, corpus size).' 
      ],
      chart: '<div class="grid grid-cols-2 gap-2 text-xs text-gray-600"><div class="bg-white border border-gray-200 rounded p-2"><div class="font-semibold text-gray-900 mb-1">Error floor</div><p>Expected due to concentration bounds.</p></div><div class="bg-white border border-gray-200 rounded p-2"><div class="font-semibold text-gray-900 mb-1">Cost</div><p>O(N) embedding lookups.</p></div></div>'
    },
    variantA: {
      label: 'Variant A',
      metric: 'Hit@5 ≈ 48%',
      description: [
        'Explain how modified assumptions change theoretical guarantees.',
        'Call out whether the paper proves an impossibility or provides a counterexample.'
      ],
      chart: '<div class="text-xs text-gray-600">Replace with a diagram showing how recall drops as dimension shrinks.</div>'
    },
    variantB: {
      label: 'Variant B',
      metric: 'Hit@5 ≈ 71%',
      description: [
        'Use this slot to illustrate what knobs recover performance (e.g., additional metadata, hybrid retrieval).',
        'Tie back to the discussion or appendix of the paper.'
      ],
      chart: '<div class="text-xs text-gray-600">Highlight improvements when combining embeddings with lexical rerankers.</div>'
    }
  };

  const render = () => {
    const key = scenarioSelect.value;
    const config = scenarios[key] || scenarios.baseline;
    metricLabel.textContent = config.metric;
    chart.innerHTML = config.chart;
    explanation.innerHTML = config.description.map(p => <p></p>).join('');
  };

  scenarioSelect.addEventListener('change', render);
  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paperXXInteractive = interactiveScript;
}
