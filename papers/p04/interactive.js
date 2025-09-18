const interactiveScript = () => {
  const root = document.getElementById('p04-explorer');
  if (!root) return;

  const MODELS = [
    { id: 'gpt4', label: 'GPT-4o' },
    { id: 'r1', label: 'DeepSeek R1' },
    { id: 'r1d', label: 'DeepSeek R1-D' },
    { id: 'gemini', label: 'Gemini 2.0' },
    { id: 'llama', label: 'Llama 3.3-70B' },
    { id: 'qwen', label: 'Qwen 2.5-72B' },
    { id: 'mistral', label: 'Mistral 3-24B' }
  ];

  const detectionScores = {
    punEval: {
      label: 'PunEval (legacy SemEval split)',
      metric: 'F1',
      prompts: {
        best: { gpt4: 0.93, r1: 0.913, r1d: 0.883, gemini: 0.906, llama: 0.872, qwen: 0.894, mistral: 0.845 },
        fewShot: { gpt4: 0.928, r1: 0.908, r1d: 0.87, gemini: 0.893, llama: 0.844, qwen: 0.872, mistral: 0.746 },
        words: { gpt4: 0.873, r1: 0.909, r1d: 0.868, gemini: 0.883, llama: 0.872, qwen: 0.868, mistral: 0.784 },
        wordsSenses: { gpt4: 0.889, r1: 0.913, r1d: 0.883, gemini: 0.891, llama: 0.864, qwen: 0.873, mistral: 0.749 }
      },
      observations: [
        'Legacy benchmark where most models score ≥0.87 F1 with rationale prompts.',
        'RoBERTa baseline hits 0.93 F1 here—evidence of pattern leakage in the dataset.'
      ],
      actions: [
        'Treat high PunEval F1 as an upper bound; use it as a reference when measuring drops elsewhere.',
        'Audit training data for overlap with SemEval-style pun templates before trusting numbers.'
      ]
    },
    nap: {
      label: 'NAP (new annotated puns & matched non-puns)',
      metric: 'F1',
      prompts: {
        best: { gpt4: 0.869, r1: 0.791, r1d: 0.798, gemini: 0.779, llama: 0.836, qwen: 0.811, mistral: 0.75 },
        fewShot: { gpt4: 0.81, r1: 0.766, r1d: 0.763, gemini: 0.749, llama: 0.81, qwen: 0.786, mistral: 0.695 },
        words: { gpt4: 0.869, r1: 0.777, r1d: 0.798, gemini: 0.762, llama: 0.834, qwen: 0.811, mistral: 0.69 },
        wordsSenses: { gpt4: 0.85, r1: 0.791, r1d: 0.787, gemini: 0.779, llama: 0.836, qwen: 0.807, mistral: 0.685 }
      },
      observations: [
        'Scores remain high but drop 4–10 F1 compared to PunEval—new wording removes memorized cues.',
        'Rationale prompts still help; GPT‑4o gains ≈6 F1 over few-shot when forced to name the pun pair.'
      ],
      actions: [
        'Add freshly written puns to evaluation pools—LLMs trained on internet jokes likely saw older corpora.',
        'Inspect rationale quality; hallucinated senses show up even when the final label is correct.'
      ]
    },
    punnyPattern: {
      label: 'PunnyPattern (template stress test)',
      metric: 'F1',
      prompts: {
        best: { gpt4: 0.831, r1: 0.811, r1d: 0.783, gemini: 0.769, llama: 0.81, qwen: 0.797, mistral: 0.774 }
      },
      precision: { gpt4: 0.797, r1: 0.695, r1d: 0.669, gemini: 0.667, llama: 0.715, qwen: 0.741, mistral: 0.721 },
      recall: { gpt4: 0.881, r1: 0.983, r1d: 0.948, gemini: 0.916, llama: 0.942, qwen: 0.875, mistral: 0.875 },
      observations: [
        'Precision collapses (−16 to −23 pts) even though recall stays high—models treat every template as a pun.',
        'DeepSeek R1 hits 98% recall but only 70% precision: bias toward “pun” predictions dominates.'
      ],
      actions: [
        'Score precision separately; high recall hides false positives on template-heavy data.',
        'Add template-matched negative examples to moderation/safety evaluations.'
      ]
    },
    punBreak: {
      label: 'PunBreak (word swap stress test)',
      metric: 'Accuracy',
      prompts: {
        best: {
          gpt4: { pun: 0.88, punSyn: 0.44, altSyn: 0.59, homophone: 0.33, random: 0.52, randomSent: 0.84 },
          r1: { pun: 0.90, punSyn: 0.46, altSyn: 0.55, homophone: 0.31, random: 0.50, randomSent: 0.86 },
          r1d: { pun: 0.88, punSyn: 0.42, altSyn: 0.54, homophone: 0.29, random: 0.49, randomSent: 0.85 },
          gemini: { pun: 0.82, punSyn: 0.38, altSyn: 0.52, homophone: 0.31, random: 0.45, randomSent: 0.81 },
          llama: { pun: 0.86, punSyn: 0.41, altSyn: 0.53, homophone: 0.32, random: 0.47, randomSent: 0.83 },
          qwen: { pun: 0.85, punSyn: 0.40, altSyn: 0.51, homophone: 0.30, random: 0.46, randomSent: 0.82 },
          mistral: { pun: 0.80, punSyn: 0.36, altSyn: 0.48, homophone: 0.28, random: 0.42, randomSent: 0.79 }
        }
      },
      observations: [
        'Replacing the pun word with a homophone or synonym fools every model (≤0.6 accuracy).',
        'Negative control sentences remain easy (>0.8 accuracy), confirming the bias stems from pun-like phrasing.'
      ],
      actions: [
        'Add ruined-pun negatives to evaluation sandboxes before deploying humor-sensitive features.',
        'Track accuracy separately for homophone and synonym attacks; those subsets surface the biggest gaps.'
      ]
    }
  };

  const datasetSelect = document.getElementById('p04-dataset');
  const promptSelect = document.getElementById('p04-prompt');
  const modelContainer = document.getElementById('p04-models');
  const scoreHeading = document.getElementById('p04-score-heading');
  const primaryMetric = document.getElementById('p04-primary-metric');
  const metricDetail = document.getElementById('p04-metric-detail');
  const observationsEl = document.getElementById('p04-observations');
  const actionsEl = document.getElementById('p04-actions');

  let currentModel = MODELS[0].id;

  const formatPercent = value => Math.round(value * 1000) / 10 + '%';

  const renderModels = () => {
    const fragments = MODELS.map(model => {
      const isActive = model.id === currentModel;
      const baseClass = 'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors';
      const stateClass = isActive
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
        : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600';
      return '<button type="button" class="' + baseClass + ' ' + stateClass + '" data-model="' + model.id + '">' + model.label + '</button>';
    });
    modelContainer.innerHTML = fragments.join('');
    Array.from(modelContainer.querySelectorAll('button')).forEach(btn => {
      btn.addEventListener('click', () => {
        currentModel = btn.dataset.model;
        renderModels();
        update();
      });
    });
  };

  const populateLists = datasetKey => {
    const dataset = detectionScores[datasetKey];
    observationsEl.innerHTML = (dataset.observations || []).map(item => '<p>' + item + '</p>').join('');
    actionsEl.innerHTML = (dataset.actions || []).map(item => '<li>' + item + '</li>').join('');
  };

  const renderPunBreak = metrics => {
    const rows = [];
    const labels = {
      pun: 'Original puns',
      punSyn: 'Pun word → synonym',
      altSyn: 'Alt word → synonym',
      homophone: 'Homophone swap',
      random: 'Random swap',
      randomSent: 'Random sentence'
    };
    Object.keys(labels).forEach(key => {
      const value = metrics[key];
      rows.push(
        '<div class="bg-white border border-indigo-200 rounded-md p-3">' +
          '<p class="text-[11px] font-semibold text-indigo-700 uppercase">' + labels[key] + '</p>' +
          '<p class="text-sm text-indigo-900 font-mono">' + formatPercent(value) + '</p>' +
        '</div>'
      );
    });
    return '<div class="grid md:grid-cols-3 gap-2">' + rows.join('') + '</div>' +
      '<p class="text-[11px] text-indigo-800">Only the “Original puns” column contains genuine puns; all others are altered non-puns.</p>';
  };

  const update = () => {
    const datasetKey = datasetSelect.value;
    const promptKey = promptSelect.value;
    const dataset = detectionScores[datasetKey];

    populateLists(datasetKey);

    if (!dataset) {
      scoreHeading.textContent = '';
      primaryMetric.textContent = '—';
      metricDetail.innerHTML = '';
      return;
    }

    scoreHeading.textContent = dataset.label + ' • ' + MODELS.find(m => m.id === currentModel).label;

    if (datasetKey === 'punBreak') {
      const promptMetrics = dataset.prompts.best;
      const metrics = promptMetrics ? promptMetrics[currentModel] : null;
      if (!metrics) {
        primaryMetric.textContent = 'Not reported';
        metricDetail.innerHTML = '<p class="text-xs text-indigo-800">Only best-run numbers are available for this dataset.</p>';
      } else {
        const avg = (metrics.pun + metrics.punSyn + metrics.altSyn + metrics.homophone + metrics.random + metrics.randomSent) / 6;
        primaryMetric.textContent = formatPercent(avg) + ' avg accuracy';
        metricDetail.innerHTML = renderPunBreak(metrics);
      }
      promptSelect.disabled = true;
      return;
    }

    promptSelect.disabled = datasetKey === 'punnyPattern';

    const promptMetrics = dataset.prompts[promptKey] || dataset.prompts.best;
    const metricValue = promptMetrics && promptMetrics[currentModel];

    if (typeof metricValue !== 'number') {
      primaryMetric.textContent = 'Not reported';
      metricDetail.innerHTML = '<p class="text-xs text-indigo-800">This prompt combination is not available in the paper.</p>';
      return;
    }

    const baseline = detectionScores.punEval.prompts.best[currentModel];
    const drop = datasetKey !== 'punEval' && typeof baseline === 'number'
      ? Math.round((metricValue - baseline) * 1000) / 10
      : null;

    if (dataset.metric === 'F1') {
      primaryMetric.textContent = formatPercent(metricValue) + ' F1';
    } else {
      primaryMetric.textContent = formatPercent(metricValue) + ' ' + dataset.metric.toLowerCase();
    }

    let extra = '';
    if (datasetKey === 'punnyPattern') {
      extra = '<div class="grid md:grid-cols-3 gap-2">' +
        '<div class="bg-white border border-indigo-200 rounded-md p-3"><p class="text-[11px] font-semibold text-indigo-700 uppercase">F1</p><p class="text-sm text-indigo-900 font-mono">' + formatPercent(metricValue) + '</p></div>' +
        '<div class="bg-white border border-indigo-200 rounded-md p-3"><p class="text-[11px] font-semibold text-indigo-700 uppercase">Precision</p><p class="text-sm text-indigo-900 font-mono">' + formatPercent(dataset.precision[currentModel]) + '</p></div>' +
        '<div class="bg-white border border-indigo-200 rounded-md p-3"><p class="text-[11px] font-semibold text-indigo-700 uppercase">Recall</p><p class="text-sm text-indigo-900 font-mono">' + formatPercent(dataset.recall[currentModel]) + '</p></div>' +
      '</div>';
    }

    const deltaLine = drop !== null
      ? '<p class="text-[11px] text-indigo-800">Drop vs. PunEval best: ' + (drop >= 0 ? '+' : '') + drop + ' points.</p>'
      : '';

    metricDetail.innerHTML = extra + deltaLine;
  };

  renderModels();
  datasetSelect.addEventListener('change', update);
  promptSelect.addEventListener('change', update);

  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
