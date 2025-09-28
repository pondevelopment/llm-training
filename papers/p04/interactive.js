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
      helper: 'Legacy SemEval control set. Use it as the memorised ceiling before you stress the detector.',
      metricNote: 'F1 balances precision and recall on the familiar benchmark—treat drops on stress sets as evidence of brittleness.',
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
      helper: 'Fresh human annotations with tight negative controls. Checks whether the model keeps precision once familiar phrasing disappears.',
      metricNote: 'Another F1 score—drops here highlight generalisation gaps versus PunEval.',
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
      helper: 'Adversarial templates that look like classic puns even when the punchline is fake. Expect precision to nosedive if the model rubber-stamps the pattern.',
      metricNote: 'We surface F1 plus precision and recall so you can see how template bias drives the score.',
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
      helper: 'Takes real puns and corrupts the trigger word. Accuracy shows whether the model notices the meaning change or keeps guessing “pun”.',
      metricNote: 'Score is averaged across the six manipulations—scan the grid to spot which perturbations cause the collapse.',
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

  const PUNBREAK_LABELS = {
    pun: 'Original puns',
    punSyn: 'Pun word → synonym',
    altSyn: 'Alt word → synonym',
    homophone: 'Homophone swap',
    random: 'Random swap',
    randomSent: 'Random sentence'
  };

  const promptNotes = {
    best: "Uses the paper's best-performing prompt for each model—treat it as the optimistic run.",
    fewShot: "Definition plus worked examples; handy when you want a controllable baseline.",
    words: "Forces the model to name the pun pair so you can inspect its rationale for false positives.",
    wordsSenses: "Adds sense explanations on top of the pun pair; reveals when the model hallucinates meanings.",
    default: "Prompt styles toggle how much structure and rationale the model must provide."
  };

  const defaultDatasetHelper = 'Switch datasets to see how the paper stress-tests pun detectors beyond the legacy benchmark.';
  const defaultScoreNote = 'Metrics update live—watch F1, precision, recall, or accuracy to understand where reasoning breaks.';

  const datasetSelect = document.getElementById('p04-dataset');
  const promptSelect = document.getElementById('p04-prompt');
  const modelContainer = document.getElementById('p04-models');
  const scoreHeading = document.getElementById('p04-score-heading');
  const primaryMetric = document.getElementById('p04-primary-metric');
  const metricDetail = document.getElementById('p04-metric-detail');
  const observationsEl = document.getElementById('p04-observations');
  const actionsEl = document.getElementById('p04-actions');
  const datasetHelperEl = document.getElementById('p04-dataset-helper');
  const promptHelperEl = document.getElementById('p04-prompt-helper');
  const scoreHelperEl = document.getElementById('p04-score-helper');
  const conclusionEl = document.getElementById('p04-conclusion');
  const impactEl = document.getElementById('p04-impact');
  const IMPACT_PLACEHOLDER = 'Business impact shows here after you pick a slice.';

  const setConclusion = message => {
    if (conclusionEl) {
      conclusionEl.textContent = message;
    }
  };

  const setImpact = message => {
    if (impactEl) {
      impactEl.textContent = message || IMPACT_PLACEHOLDER;
    }
  };

  let currentModel = MODELS[0].id;

  const formatPercent = value => Math.round(value * 1000) / 10 + '%';

  const formatPoints = value => {
    const abs = Math.abs(value);
    if (abs === 0) return '0';
    const rounded = Math.round(abs * 10) / 10;
    return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  };

  const summarizeDrop = drop => {
    if (drop === null || drop === undefined) return '';
    if (drop === 0) return 'Matches the PunEval score.';
    const points = formatPoints(drop);
    return (drop < 0 ? 'Down ' : 'Up ') + points + ' pts vs PunEval.';
  };

  const impactFromDrop = drop => {
    if (drop === null || drop === undefined) return '';
    if (drop === 0) {
      return 'Business impact: behaves like baseline—keep current human review posture.';
    }
    const points = formatPoints(drop);
    if (drop < 0) {
      return 'Business impact: down ' + points + ' pts vs PunEval—keep humans in the loop and add targeted negatives.';
    }
    return 'Business impact: up ' + points + ' pts vs PunEval—validate the lift before relaxing oversight.';
  };

  const stripImpactPrefix = text => {
    if (!text) return '';
    const cleaned = text.replace('Business impact: ', '');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  const toSentenceCase = label => {
    if (!label) return '';
    return label.charAt(0).lower() + label.slice(1);
  };

  const formatMaybePercent = value => (typeof value === 'number' ? formatPercent(value) : 'N/A');

  const renderModels = () => {
    const fragments = MODELS.map(model => {
      const isActive = model.id === currentModel;
      const baseClass = 'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors';
      const stateClass = isActive
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
        : 'bg-card border-subtle text-secondary hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200';
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
    Object.keys(PUNBREAK_LABELS).forEach(key => {
      const value = metrics[key];
      const label = PUNBREAK_LABELS[key];
      rows.push(
        '<div class="bg-card border border-indigo-200 dark:border-indigo-500 rounded-md p-3">' +
          '<p class="text-[11px] font-semibold text-indigo-700 dark:text-indigo-200 uppercase">' + label + '</p>' +
          '<p class="text-sm text-indigo-900 dark:text-indigo-100 font-mono">' + formatMaybePercent(value) + '</p>' +
        '</div>'
      );
    });
    return '<div class="grid md:grid-cols-3 gap-2">' + rows.join('') + '</div>' +
      '<p class="text-[11px] text-indigo-800 dark:text-indigo-200">Only the “Original puns” column contains genuine puns; all others are altered non-puns.</p>';
  };

  const update = () => {
    const datasetKey = datasetSelect.value;
    const promptKey = promptSelect.value;
    const dataset = detectionScores[datasetKey];
    const modelInfo = MODELS.find(m => m.id === currentModel) || { label: currentModel };
    const modelLabel = modelInfo.label;
    const promptLabel = promptSelect.options[promptSelect.selectedIndex]?.textContent.trim() || 'the selected prompt';

    setConclusion('');
    setImpact(IMPACT_PLACEHOLDER);

    if (datasetHelperEl) {
      datasetHelperEl.textContent = dataset && dataset.helper ? dataset.helper : defaultDatasetHelper;
    }
    if (promptHelperEl) {
      promptHelperEl.textContent = promptNotes[promptKey] || promptNotes.default;
    }
    if (scoreHelperEl) {
      scoreHelperEl.textContent = dataset && dataset.metricNote ? dataset.metricNote : defaultScoreNote;
    }

    if (!dataset) {
      scoreHeading.textContent = '';
      primaryMetric.textContent = String.fromCharCode(0x2014);
      metricDetail.innerHTML = '';
      if (scoreHelperEl) {
        scoreHelperEl.textContent = defaultScoreNote;
      }
      setConclusion('Select a dataset to see the paper summary for that slice.');
      setImpact(IMPACT_PLACEHOLDER);
      return;
    }

    populateLists(datasetKey);

    scoreHeading.textContent = dataset.label + ' ' + String.fromCharCode(0x2022) + ' ' + modelLabel;

    if (datasetKey === 'punBreak') {
      const promptMetrics = dataset.prompts.best;
      const metrics = promptMetrics ? promptMetrics[currentModel] : null;
      if (!metrics) {
        primaryMetric.textContent = 'Not reported';
        metricDetail.innerHTML = '<p class="text-xs text-indigo-800 dark:text-indigo-200">Only best-run numbers are available for this dataset.</p>';
        if (scoreHelperEl) {
          scoreHelperEl.textContent = dataset.metricNote || defaultScoreNote;
        }
        setConclusion(modelLabel + ' has no reported accuracy for ' + promptLabel + ' on ' + dataset.label + '; the paper only shares best-run numbers.');
        setImpact('Business impact: gather your own evaluations before shipping—there is no guidance on how this combo handles disguised puns.');
        promptSelect.disabled = true;
        return;
      }

      const values = Object.entries(metrics).filter(([, value]) => typeof value === 'number');
      const avg = values.reduce((sum, [, value]) => sum + value, 0) / values.length;
      primaryMetric.textContent = formatPercent(avg) + ' avg accuracy';
      metricDetail.innerHTML = renderPunBreak(metrics);
      if (scoreHelperEl) {
        scoreHelperEl.textContent = dataset.metricNote || defaultScoreNote;
      }

      const [worstKey, worstValue] = values.reduce((min, entry) => (entry[1] < min[1] ? entry : min), values[0]);
      const worstLabel = PUNBREAK_LABELS[worstKey] || worstKey;
      const sentences = [
        modelLabel + ' averages ' + formatPercent(avg) + ' accuracy on ' + dataset.label + ' with ' + promptLabel + '.',
        toSentenceCase(worstLabel) + ' drops to ' + formatPercent(worstValue) + ', so bake that perturbation into QA.'
      ];
      setConclusion(sentences.join(' '));
      const dropSummary = summarizeDrop(drop);
      const punBreakImpact = 'Business impact: ' + toSentenceCase(worstLabel) + ' accuracy at ' + formatPercent(worstValue) + ' means disguised jokes can slip past automated review—add human spot checks or rerankers.' + (dropSummary ? ' ' + dropSummary : '');
      setImpact(punBreakImpact);
      promptSelect.disabled = true;
      return;
    }

    promptSelect.disabled = datasetKey === 'punnyPattern';

    const promptMetrics = dataset.prompts[promptKey] || dataset.prompts.best;
    const metricValue = promptMetrics && promptMetrics[currentModel];

    if (typeof metricValue !== 'number') {
      primaryMetric.textContent = 'Not reported';
      metricDetail.innerHTML = '<p class="text-xs text-indigo-800 dark:text-indigo-200">This prompt combination is not available in the paper.</p>';
      setConclusion(modelLabel + ' has no reported ' + dataset.metric.toLowerCase() + ' for ' + promptLabel + ' on ' + dataset.label + '.');
      setImpact('Business impact: collect bespoke evals before launch—this combo lacks evidence for production decisions.');
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
        '<div class="bg-card border border-indigo-200 dark:border-indigo-500 rounded-md p-3"><p class="text-[11px] font-semibold text-indigo-700 dark:text-indigo-200 uppercase">F1</p><p class="text-sm text-indigo-900 dark:text-indigo-100 font-mono">' + formatPercent(metricValue) + '</p></div>' +
        '<div class="bg-card border border-indigo-200 dark:border-indigo-500 rounded-md p-3"><p class="text-[11px] font-semibold text-indigo-700 dark:text-indigo-200 uppercase">Precision</p><p class="text-sm text-indigo-900 dark:text-indigo-100 font-mono">' + formatMaybePercent(dataset.precision && dataset.precision[currentModel]) + '</p></div>' +
        '<div class="bg-card border border-indigo-200 dark:border-indigo-500 rounded-md p-3"><p class="text-[11px] font-semibold text-indigo-700 dark:text-indigo-200 uppercase">Recall</p><p class="text-sm text-indigo-900 dark:text-indigo-100 font-mono">' + formatMaybePercent(dataset.recall && dataset.recall[currentModel]) + '</p></div>' +
      '</div>';
    }

    const deltaLine = drop !== null
      ? '<p class="text-[11px] text-indigo-800 dark:text-indigo-200">Drop vs. PunEval best: ' + (drop >= 0 ? '+' : '') + drop + ' points.</p>'
      : '';

    metricDetail.innerHTML = extra + deltaLine;

    const dropSentence = summarizeDrop(drop);

    if (datasetKey === 'punnyPattern') {
      const precisionValue = dataset.precision ? dataset.precision[currentModel] : null;
      const recallValue = dataset.recall ? dataset.recall[currentModel] : null;
      const sentences = [
        modelLabel + ' posts ' + formatPercent(metricValue) + ' F1 on ' + dataset.label + ' with ' + promptLabel + '.'
      ];
      if (typeof precisionValue === 'number' && typeof recallValue === 'number') {
        sentences.push('Precision falls to ' + formatPercent(precisionValue) + ' while recall stays at ' + formatPercent(recallValue) + '.');
      } else if (typeof precisionValue === 'number') {
        sentences.push('Precision settles at ' + formatPercent(precisionValue) + '.');
      }
      if (dropSentence) {
        sentences.push(dropSentence);
      } else {
        sentences.push('Template bias still lifts recall, so monitor the false positives.');
      }
      setConclusion(sentences.join(' '));
      const precisionText = typeof precisionValue === 'number' ? formatPercent(precisionValue) : 'N/A';
      const dropTail = impactFromDrop(drop);
      if (dropTail) {
        setImpact('Business impact: precision at ' + precisionText + ' means template-lookalike content will flood moderation and brand-review queues unless you add stronger negatives. ' + stripImpactPrefix(dropTail));
      } else {
        setImpact('Business impact: precision at ' + precisionText + ' means template-lookalike content will flood moderation and brand-review queues unless you add stronger negatives.');
      }
    } else if (datasetKey === 'nap') {
      const sentences = [
        modelLabel + ' scores ' + formatPercent(metricValue) + ' F1 on ' + dataset.label + ' with ' + promptLabel + '.'
      ];
      if (dropSentence) {
        sentences.push(dropSentence);
      } else {
        sentences.push('Fresh phrasing trims precision compared to the legacy set.');
      }
      setConclusion(sentences.join(' '));
      if (drop !== null && drop < 0) {
        setImpact('Business impact: down ' + formatPoints(drop) + ' pts vs PunEval—budget extra human QA for fresh marketing copy.');
      } else if (drop !== null && drop > 0) {
        setImpact('Business impact: up ' + formatPoints(drop) + ' pts vs PunEval—extend this prompt style after validating the lift.');
      } else {
        setImpact('Business impact: run fresh-copy audits before rollout; the paper does not quantify precision vs PunEval.');
      }
    } else {
      const sentences = [
        modelLabel + ' reaches ' + formatPercent(metricValue) + ' ' + dataset.metric + ' on ' + dataset.label + ' with ' + promptLabel + '.'
      ];
      if (datasetKey === 'punEval') {
        sentences.push('Use this as the baseline before stress tests.');
      } else if (dropSentence) {
        sentences.push(dropSentence);
      }
      setConclusion(sentences.join(' '));
      if (datasetKey === 'punEval') {
        setImpact('Business impact: treat this as a smoke test—ship only after the stress suites look healthy.');
      } else {
        const dropImpact = impactFromDrop(drop);
        setImpact(dropImpact || 'Business impact: monitor production telemetry to confirm the behaviour holds.');
      }
    }

    if (scoreHelperEl) {
      let note = dataset.metricNote || defaultScoreNote;
      if (drop !== null) {
        if (drop === 0) {
          note += ' Matches the PunEval best score.';
        } else if (drop > 0) {
          note += ' Compared with PunEval best, this combination improves by ' + formatPoints(drop) + ' points.';
        } else {
          note += ' Compared with PunEval best, this combination drops by ' + formatPoints(drop) + ' points.';
        }
      }
      scoreHelperEl.textContent = note;
    }
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






