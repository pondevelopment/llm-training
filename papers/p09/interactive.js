const interactiveScript = () => {
  const root = document.getElementById('p09-explorer');
  if (!root) return;

  const VIEWS = {
    planner: {
      label: 'Compute planner',
      heading: 'Size your next pretraining run',
      subheading: 'Pick a FLOP budget and token ratio to see the implied model scale',
      insights: [
        'The paper recommends allocating compute so that parameters and tokens scale together; holding tokens fixed leaves loss on the table.',
        'For budgets around Gopher or GPT-3, the compute-optimal recipe lands near 60-80B parameters rather than 175B+.'
      ],
      actions: [
        'Lock the target token-to-parameter ratio during planning reviews and flag proposals that deviate by more than 20%.',
        'Tie procurement asks (GPU hours, dataset prep) directly to the chosen ratio so finance teams understand why more data buys accuracy.'
      ]
    },
    diagnostics: {
      label: 'Undertraining audit',
      heading: 'Compare flagship models to the Chinchilla frontier',
      subheading: 'See how far each model sits from the compute-optimal token ratio',
      insights: [
        'GPT-3 and Gopher trained on roughly 300B tokens each, covering less than 20% of the tokens that the compute-optimal recipe would recommend.',
        'Chinchilla closes the gap by using the same compute budget but shifting FLOPs toward more data instead of more parameters.'
      ],
      actions: [
        'Audit internal models for token coverage and extend training before adding layers when coverage is under 50%.',
        'Explain to stakeholders that smaller, better-trained models may outperform bloated checkpoints when inference cost matters.'
      ]
    },
    benchmarks: {
      label: 'Benchmark gains',
      heading: 'Quantify downstream accuracy improvements',
      subheading: 'Chinchilla vs. Gopher vs. GPT-3 on headline evaluations',
      insights: [
        'Compute-optimal training lifts MMLU by ~7 points over Gopher while using 75% fewer parameters.',
        'Datasets that stress reasoning (BIG-bench hard) show similar gains, indicating the effect is not confined to memorisation benchmarks.'
      ],
      actions: [
        'Pivot product dashboards to accuracy-per-FLOP so smaller compute-optimal models receive credit.',
        'Refresh evaluation suites after rebalancing data budgets to confirm gains persist for your domain tasks.'
      ]
    }
  };

  const COMPUTE_BUDGETS = [
    { id: 0, label: '1e22 FLOPs', value: 1e22 },
    { id: 1, label: '2e22 FLOPs', value: 2e22 },
    { id: 2, label: '5e22 FLOPs', value: 5e22 },
    { id: 3, label: '1e23 FLOPs', value: 1e23 },
    { id: 4, label: '2e23 FLOPs', value: 2e23 },
    { id: 5, label: '3e23 FLOPs (GPT-3 budget)', value: 3e23 },
    { id: 6, label: '5.9e23 FLOPs (Gopher/Chinchilla)', value: 5.9e23 },
    { id: 7, label: '1.2e24 FLOPs', value: 1.2e24 }
  ];

  const MODEL_DATA = {
    gpt3: {
      name: 'GPT-3 175B',
      params: 175e9,
      tokens: 300e9,
      compute: 3e23,
      notes: 'Original training used ~300B tokens and a 175B parameter model.'
    },
    gopher: {
      name: 'Gopher 280B',
      params: 280e9,
      tokens: 300e9,
      compute: 2.8e23,
      notes: 'Same token budget as GPT-3 but a larger model, leaving large data headroom.'
    },
    chinchilla: {
      name: 'Chinchilla 70B',
      params: 70e9,
      tokens: 1.4e12,
      compute: 5.9e23,
      notes: 'Compute-optimal run with 20 tokens per parameter.'
    },
    jurassic: {
      name: 'Jurassic-1 178B',
      params: 178e9,
      tokens: 300e9,
      compute: 3e23,
      notes: 'Representative of other 2021-era large-but-undertrained models.'
    }
  };

  const BENCHMARKS = {
    MMLU: {
      metric: 'Accuracy (%)',
      higherIsBetter: true,
      values: {
        chinchilla: 67.5,
        gopher: 60.0,
        gpt3: 43.9
      }
    },
    'BIG-bench hard': {
      metric: 'Accuracy (%)',
      higherIsBetter: true,
      values: {
        chinchilla: 65.0,
        gopher: 57.0,
        gpt3: 50.0
      }
    },
    HellaSwag: {
      metric: 'Accuracy (%)',
      higherIsBetter: true,
      values: {
        chinchilla: 87.0,
        gopher: 85.5,
        gpt3: 78.0
      }
    }
  };

  const stageHeadingEl = document.getElementById('p09-stage-heading');
  const stageSubheadingEl = document.getElementById('p09-stage-subheading');
  const stageLabelEl = document.getElementById('p09-stage-label');
  const stageControlsEl = document.getElementById('p09-stage-controls');
  const insightsEl = document.getElementById('p09-insights');
  const actionsEl = document.getElementById('p09-actions');
  const viewButtonsEl = document.getElementById('p09-views');

  let currentView = 'planner';

  const formatNumber = (value, digits) => {
    const maximum = typeof digits === 'number' ? digits : 1;
    const minimum = typeof digits === 'number' ? digits : 1;
    return Number(value).toLocaleString(undefined, {
      maximumFractionDigits: maximum,
      minimumFractionDigits: minimum
    });
  };

  const renderButtons = () => {
    const html = Object.entries(VIEWS).map(([key, meta]) => {
      const active = key === currentView;
      const classes = ['px-3', 'py-1.5', 'rounded-md', 'border', 'text-xs', 'font-medium', 'transition-colors'];
      if (active) {
        classes.push('bg-indigo-600', 'border-indigo-600', 'text-white', 'shadow-sm');
      } else {
        classes.push('bg-white', 'border-gray-300', 'text-gray-700', 'hover:border-indigo-400', 'hover:text-indigo-600');
      }
      return '<button type="button" class="' + classes.join(' ') + '" data-view="' + key + '">' + meta.label + '</button>';
    }).join('');
    viewButtonsEl.innerHTML = html;
    viewButtonsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentView = btn.getAttribute('data-view');
        renderButtons();
        update();
      });
    });
  };

  const updatePlannerView = () => {
    stageHeadingEl.textContent = VIEWS.planner.heading;
    stageSubheadingEl.textContent = VIEWS.planner.subheading;

    const budgetOptions = COMPUTE_BUDGETS.map((entry, index) => '<option value="' + index + '">' + entry.label + '</option>').join('');

    stageControlsEl.innerHTML = '' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Training compute</label>' +
        '<select id="p09-compute" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">' + budgetOptions + '</select>' +
        '<p class="text-[11px] text-indigo-800">Approximate end-to-end FLOPs across the whole run.</p>' +
      '</div>' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Tokens per parameter</label>' +
        '<input id="p09-ratio" type="range" min="10" max="30" value="20" step="1" class="w-full" />' +
        '<div class="flex items-baseline justify-between text-[11px] text-indigo-800">' +
          '<span>10</span>' +
          '<span id="p09-ratio-value">20</span>' +
          '<span>30</span>' +
        '</div>' +
        '<p class="text-[11px] text-indigo-800">Chinchilla suggests ~20 tokens per parameter for compute-optimal training.</p>' +
      '</div>' +
      '<div class="md:col-span-2 bg-indigo-900/5 border border-indigo-200 rounded-md p-3" id="p09-planner-results"></div>';

    const computeSelect = document.getElementById('p09-compute');
    const ratioSlider = document.getElementById('p09-ratio');
    const ratioValue = document.getElementById('p09-ratio-value');
    const resultsEl = document.getElementById('p09-planner-results');

    const render = () => {
      const budgetEntry = COMPUTE_BUDGETS[Number(computeSelect.value)] || COMPUTE_BUDGETS[0];
      const ratio = Number(ratioSlider.value);
      ratioValue.textContent = String(ratio);

      const compute = budgetEntry.value;
      const params = Math.sqrt(compute / (6 * ratio));
      const paramsB = params / 1e9;
      const tokens = ratio * params;
      const tokensB = tokens / 1e9;
      const tokensT = tokens / 1e12;

      stageLabelEl.textContent = formatNumber(paramsB, 1) + 'B params • ' + formatNumber(tokensT, 2) + 'T tokens';

      const referenceRatio = 20;
      const deviation = ((ratio - referenceRatio) / referenceRatio) * 100;
      let deviationText;
      if (deviation === 0) {
        deviationText = 'Matches the recommended ratio.';
      } else {
        const sign = deviation > 0 ? '+' : '';
        deviationText = sign + formatNumber(deviation, 0) + '% vs. the 20 tokens-per-parameter guideline.';
      }

      resultsEl.innerHTML = '' +
        '<div class="space-y-1 text-sm text-indigo-900">' +
          '<p><strong>Model size:</strong> ~' + formatNumber(paramsB, 1) + 'B parameters</p>' +
          '<p><strong>Training tokens:</strong> ~' + formatNumber(tokensT, 2) + 'T (' + formatNumber(tokensB, 1) + 'B tokens)</p>' +
          '<p><strong>Compute budget:</strong> ' + budgetEntry.label + '</p>' +
          '<p><strong>Ratio check:</strong> ' + deviationText + '</p>' +
        '</div>';
    };

    computeSelect.addEventListener('change', render);
    ratioSlider.addEventListener('input', render);
    render();
  };

  const updateDiagnosticsView = () => {
    stageHeadingEl.textContent = VIEWS.diagnostics.heading;
    stageSubheadingEl.textContent = VIEWS.diagnostics.subheading;

    const options = Object.entries(MODEL_DATA).map(([key, meta]) => '<option value="' + key + '">' + meta.name + '</option>').join('');

    stageControlsEl.innerHTML = '' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Model</label>' +
        '<select id="p09-model" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">' + options + '</select>' +
        '<p class="text-[11px] text-indigo-800">Token counts are approximate but align with public reports from the paper.</p>' +
      '</div>' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2" id="p09-model-details"></div>';

    const selectEl = document.getElementById('p09-model');
    const detailsEl = document.getElementById('p09-model-details');

    const render = () => {
      const data = MODEL_DATA[selectEl.value];
      if (!data) {
        stageLabelEl.textContent = '-';
        detailsEl.textContent = 'Unknown model';
        return;
      }
      const ratio = data.tokens / data.params;
      const recommendedTokens = data.params * 20;
      const coverage = data.tokens / recommendedTokens;
      const coveragePercent = coverage * 100;
      let status;
      if (coveragePercent >= 90) {
        status = 'On target';
      } else if (coveragePercent >= 50) {
        status = 'Partially trained';
      } else {
        status = 'Undertrained';
      }

      stageLabelEl.textContent = formatNumber(ratio, 1) + ' tokens per parameter';

      detailsEl.innerHTML = '' +
        '<p class="text-sm text-indigo-900"><strong>' + data.name + '</strong></p>' +
        '<p class="text-xs text-indigo-800">' + formatNumber(data.params / 1e9, 1) + 'B params • ' + formatNumber(data.tokens / 1e9, 1) + 'B tokens</p>' +
        '<p class="text-xs text-indigo-800">Recommended tokens at 20/token ratio: ' + formatNumber(recommendedTokens / 1e12, 2) + 'T</p>' +
        '<p class="text-xs text-indigo-800">Coverage: ' + formatNumber(coveragePercent, 0) + '% — ' + status + '</p>' +
        '<p class="text-xs text-indigo-800">' + data.notes + '</p>';
    };

    selectEl.addEventListener('change', render);
    render();
  };

  const updateBenchmarksView = () => {
    stageHeadingEl.textContent = VIEWS.benchmarks.heading;
    stageSubheadingEl.textContent = VIEWS.benchmarks.subheading;

    const options = Object.keys(BENCHMARKS).map(name => '<option value="' + name + '">' + name + '</option>').join('');

    stageControlsEl.innerHTML = '' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Benchmark</label>' +
        '<select id="p09-benchmark" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">' + options + '</select>' +
        '<p class="text-[11px] text-indigo-800">Scores pulled from the paper; higher is better unless noted.</p>' +
      '</div>' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2" id="p09-benchmark-details"></div>';

    const selectEl = document.getElementById('p09-benchmark');
    const detailsEl = document.getElementById('p09-benchmark-details');

    const render = () => {
      const data = BENCHMARKS[selectEl.value];
      if (!data) {
        stageLabelEl.textContent = '-';
        detailsEl.textContent = 'No data available';
        return;
      }
      const entries = Object.entries(data.values);
      const sorted = entries.sort((a, b) => data.higherIsBetter ? b[1] - a[1] : a[1] - b[1]);
      const winner = sorted[0];
      const runnerUp = sorted[1];
      const delta = winner && runnerUp ? Math.abs(winner[1] - runnerUp[1]) : 0;
      const winnerMeta = winner ? MODEL_DATA[winner[0]] : null;
      const winnerName = winnerMeta ? winnerMeta.name : winner ? winner[0] : '—';

      stageLabelEl.textContent = winnerName + ' leads by ' + formatNumber(delta, 1) + ' ' + data.metric;

      const header = '<div class="text-xs text-indigo-800"><p class="font-semibold">' + data.metric + '</p></div>';
      const rows = sorted.map(([key, value]) => {
        const meta = MODEL_DATA[key];
        const label = meta ? meta.name : key;
        return '<tr><td class="py-1 pr-3">' + label + '</td><td class="py-1 text-right">' + formatNumber(value, 1) + '</td></tr>';
      }).join('');

      detailsEl.innerHTML = header +
        '<table class="w-full text-xs text-left text-indigo-900">' +
          '<thead><tr><th class="py-1 pr-3">Model</th><th class="py-1 text-right">Score</th></tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>';
    };

    selectEl.addEventListener('change', render);
    render();
  };

  const update = () => {
    const view = VIEWS[currentView];
    if (!view) return;

    insightsEl.innerHTML = view.insights.map(text => '<p>' + text + '</p>').join('');
    actionsEl.innerHTML = view.actions.map(text => '<li>' + text + '</li>').join('');

    if (currentView === 'planner') {
      updatePlannerView();
    } else if (currentView === 'diagnostics') {
      updateDiagnosticsView();
    } else {
      updateBenchmarksView();
    }
  };

  renderButtons();
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
