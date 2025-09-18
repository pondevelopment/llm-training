
const interactiveScript = () => {
  const root = document.getElementById('p06-explorer');
  if (!root) return;

  const VIEWS = {
    step: {
      label: 'Step accuracy -> horizon length',
      heading: 'Step accuracy compounds',
      subheading: 'Estimate H_s from per-step accuracy (Proposition 1)',
      insights: [
        'With fixed per-step accuracy p the expected horizon H_s grows as ln(s)/ln(p); once p passes ~0.7, tiny gains explode the length of solvable tasks.',
        'This view mirrors Fig. 1 in the paper, showing why "diminishing returns" on per-step benchmarks can still justify scaling compute.'
      ],
      actions: [
        'Report both per-step accuracy and implied horizon length when justifying model upgrades.',
        'Pair this toy calculation with your own workflow\'s acceptable failure rate s.'
      ]
    },
    self: {
      label: 'Self-conditioning stress test',
      heading: 'Prior errors poison future turns',
      subheading: 'Turn-100 accuracy vs. injected error rate (Fig. 5)',
      insights: [
        'Even frontier models degrade as the context contains their past mistakes - distinct from pure long-context loss.',
        'Scaling mitigates long-context issues (0% error line) but not self-conditioning; accuracy falls sharply with injected errors.'
      ],
      actions: [
        'Inject synthetic error histories in QA to quantify self-conditioning before deployment.',
        'Consider context hygiene (e.g., pruning bad turns) or "thinking" models when resilience is critical.'
      ]
    },
    thinking: {
      label: 'Thinking tokens vs. plain answers',
      heading: 'Sequential test-time compute matters',
      subheading: 'Single-turn capacity with / without reasoning',
      insights: [
        'Without intermediate reasoning, even massive non-thinking models fail at chaining two steps.',
        'RL-trained thinking models (DeepSeek R1, GPT-5 Horizon) execute hundreds to 1000+ steps in one go.'
      ],
      actions: [
        'Budget latency and tokens for reasoning traces if your tasks need long single-turn execution.',
        'Use this comparison when selecting providers; open weights still lag API models on long-horizon execution.'
      ]
    }
  };

  const selfConditionData = {
    'Gemma3-27B': [
      { rate: 0.0, acc: 0.70 },
      { rate: 0.25, acc: 0.55 },
      { rate: 0.50, acc: 0.40 },
      { rate: 0.75, acc: 0.28 },
      { rate: 1.0, acc: 0.18 }
    ],
    'Qwen3-32B': [
      { rate: 0.0, acc: 0.80 },
      { rate: 0.25, acc: 0.68 },
      { rate: 0.50, acc: 0.56 },
      { rate: 0.75, acc: 0.42 },
      { rate: 1.0, acc: 0.30 }
    ],
    'Kimi-K2-1T': [
      { rate: 0.0, acc: 0.95 },
      { rate: 0.25, acc: 0.82 },
      { rate: 0.50, acc: 0.66 },
      { rate: 0.75, acc: 0.48 },
      { rate: 1.0, acc: 0.34 }
    ]
  };

  const thinkingData = {
    'DeepSeek-V3 (no thinking)': { plain: 2, thinking: 2 },
    'DeepSeek-R1 (thinking)': { plain: 2, thinking: 200 },
    'GPT-5 Horizon': { plain: 6, thinking: 1000 },
    'Claude-4 Sonnet': { plain: 4, thinking: 432 },
    'Gemini 2.5 Pro': { plain: 3, thinking: 160 },
    'Qwen3-32B (think)': { plain: 2, thinking: 120 }
  };

  const stageHeadingEl = document.getElementById('p06-stage-heading');
  const stageSubheadingEl = document.getElementById('p06-stage-subheading');
  const stageLabelEl = document.getElementById('p06-stage-label');
  const stageControlsEl = document.getElementById('p06-stage-controls');
  const insightsEl = document.getElementById('p06-insights');
  const actionsEl = document.getElementById('p06-actions');
  const viewButtonsEl = document.getElementById('p06-views');

  let currentView = 'step';

  const formatPercent = value => Math.round(value * 1000) / 10 + '%';

  const renderButtons = () => {
    const fragments = Object.entries(VIEWS).map(([key, meta]) => {
      const active = key === currentView;
      const classes = ['px-3','py-1.5','rounded-md','border','text-xs','font-medium','transition-colors'];
      if (active) {
        classes.push('bg-indigo-600','border-indigo-600','text-white','shadow-sm');
      } else {
        classes.push('bg-white','border-gray-300','text-gray-700','hover:border-indigo-400','hover:text-indigo-600');
      }
      const classStr = classes.join(' ');
      return '<button type="button" class="' + classStr + '" data-view="' + key + '">' + meta.label + '</button>';
    });
    viewButtonsEl.innerHTML = fragments.join('');

    Array.from(viewButtonsEl.querySelectorAll('button')).forEach(btn => {
      btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        renderButtons();
        update();
      });
    });
  };

  const interpolateAccuracy = (points, rate) => {
    if (!points || points.length === 0) return 0;
    if (rate <= points[0].rate) return points[0].acc;
    if (rate >= points[points.length - 1].rate) return points[points.length - 1].acc;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (rate >= a.rate && rate <= b.rate) {
        const t = (rate - a.rate) / (b.rate - a.rate);
        return a.acc + t * (b.acc - a.acc);
      }
    }
    return points[points.length - 1].acc;
  };

  const updateStepView = () => {
    stageHeadingEl.textContent = VIEWS.step.heading;
    stageSubheadingEl.textContent = VIEWS.step.subheading;

    const controlsHtml = [];
    controlsHtml.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Step accuracy (p)</label>' +
        '<input id="p06-step-accuracy" type="range" min="0.50" max="0.99" step="0.01" value="0.75" class="w-full">' +
        '<p class="text-xs"><span class="font-mono" id="p06-step-accuracy-label">0.75</span></p>' +
      '</div>'
    );
    controlsHtml.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Success threshold (s)</label>' +
        '<input id="p06-success-threshold" type="range" min="0.50" max="0.90" step="0.05" value="0.50" class="w-full">' +
        '<p class="text-xs"><span class="font-mono" id="p06-success-label">0.50</span></p>' +
      '</div>'
    );
    stageControlsEl.innerHTML = controlsHtml.join('');

    const accSlider = document.getElementById('p06-step-accuracy');
    const accLabel = document.getElementById('p06-step-accuracy-label');
    const successSlider = document.getElementById('p06-success-threshold');
    const successLabel = document.getElementById('p06-success-label');

    const recalc = () => {
      const p = parseFloat(accSlider.value);
      const s = parseFloat(successSlider.value);
      accLabel.textContent = p.toFixed(2);
      successLabel.textContent = s.toFixed(2);
      if (p >= 1 || p <= 0 || s <= 0 || s >= 1) {
        stageLabelEl.textContent = 'Invalid inputs';
        return;
      }
      const horizon = Math.floor(Math.log(s) / Math.log(p));
      stageLabelEl.textContent = 'Horizon length H_s ~= ' + (horizon > 0 ? horizon : 'Less than 1 step');
    };

    accSlider.addEventListener('input', recalc);
    successSlider.addEventListener('input', recalc);
    recalc();
  };

  const updateSelfView = () => {
    stageHeadingEl.textContent = VIEWS.self.heading;
    stageSubheadingEl.textContent = VIEWS.self.subheading;

    const options = Object.keys(selfConditionData).map(name => '<option value="' + name + '">' + name + '</option>');
    const controlsHtml = [];
    controlsHtml.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Model</label>' +
        '<select id="p06-self-model" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">' + options.join('') + '</select>' +
        '<p class="text-[11px] text-indigo-800">Accuracy sampled at turn 100.</p>' +
      '</div>'
    );
    controlsHtml.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Injected error rate</label>' +
        '<input id="p06-self-error" type="range" min="0" max="1" step="0.05" value="0" class="w-full">' +
        '<p class="text-xs">History error rate: <span class="font-mono" id="p06-self-error-label">0.00</span></p>' +
      '</div>'
    );
    stageControlsEl.innerHTML = controlsHtml.join('');

    const modelSelect = document.getElementById('p06-self-model');
    const errorSlider = document.getElementById('p06-self-error');
    const errorLabel = document.getElementById('p06-self-error-label');

    const recalc = () => {
      const model = modelSelect.value;
      const rate = parseFloat(errorSlider.value);
      errorLabel.textContent = rate.toFixed(2);
      const acc = interpolateAccuracy(selfConditionData[model], rate);
      stageLabelEl.textContent = 'Turn-100 accuracy ~= ' + formatPercent(acc);
    };

    modelSelect.addEventListener('change', recalc);
    errorSlider.addEventListener('input', recalc);
    recalc();
  };

  const updateThinkingView = () => {
    stageHeadingEl.textContent = VIEWS.thinking.heading;
    stageSubheadingEl.textContent = VIEWS.thinking.subheading;

    const options = Object.keys(thinkingData).map(name => '<option value="' + name + '">' + name + '</option>');
    const controlsHtml = [];
    controlsHtml.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Model</label>' +
        '<select id="p06-thinking-model" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">' + options.join('') + '</select>' +
        '<p class="text-[11px] text-indigo-800">Values approximate Fig. 7 (>=80% success).</p>' +
      '</div>' +
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2" id="p06-thinking-details"></div>'
    );
    stageControlsEl.innerHTML = controlsHtml.join('');

    const select = document.getElementById('p06-thinking-model');
    const detailsEl = document.getElementById('p06-thinking-details');

    const render = () => {
      const data = thinkingData[select.value];
      detailsEl.innerHTML = '<p class="text-xs"><strong>Plain answer:</strong> ' + data.plain + ' steps/turn</p>' +
                            '<p class="text-xs"><strong>Thinking enabled:</strong> ' + data.thinking + ' steps/turn</p>';
      stageLabelEl.textContent = 'Max steps with thinking ~= ' + data.thinking;
    };

    select.addEventListener('change', render);
    render();
  };

  const update = () => {
    const view = VIEWS[currentView];
    if (!view) return;
    stageLabelEl.textContent = '-';
    insightsEl.innerHTML = view.insights.map(text => '<p>' + text + '</p>').join('');
    actionsEl.innerHTML = view.actions.map(text => '<li>' + text + '</li>').join('');

    if (currentView === 'step') {
      updateStepView();
    } else if (currentView === 'self') {
      updateSelfView();
    } else {
      updateThinkingView();
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

