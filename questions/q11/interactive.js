const interactiveScript = () => {
  const sentences = {
    A: [
      "The scientist discovered a new species of butterfly in the Amazon rainforest.",
      "The company announced record profits for the third quarter.",
      "She walked into the busy restaurant and looked around.",
      "The weather forecast predicted heavy rain for tomorrow.",
      "The engineering team deployed a hotfix in the middle of the night.",
      "Space tourists floated around the cabin as Earth rose in the viewport."
    ],
    B: [
      "The colorful wings displayed intricate patterns never seen before.",
      "Machine learning algorithms require vast amounts of training data.",
      "The waiter approached their table with a friendly smile.",
      "Therefore, we decided to bring umbrellas to the picnic.",
      "The pager quieted down once the patch reached production.",
      "They captured a stunning photo of the blue planet."
    ]
  };

const basePairConfidence = {
    "0,0": 88,
    "0,1": 15,
    "0,2": 24,
    "0,3": 12,
    "0,4": 16,
    "0,5": 28,
    "1,0": 18,
    "1,1": 58,
    "1,2": 32,
    "1,3": 16,
    "1,4": 48,
    "1,5": 20,
    "2,0": 18,
    "2,1": 22,
    "2,2": 92,
    "2,3": 14,
    "2,4": 26,
    "2,5": 18,
    "3,0": 18,
    "3,1": 26,
    "3,2": 28,
    "3,3": 96,
    "3,4": 40,
    "3,5": 24,
    "4,0": 20,
    "4,1": 44,
    "4,2": 26,
    "4,3": 32,
    "4,4": 88,
    "4,5": 24,
    "5,0": 24,
    "5,1": 26,
    "5,2": 24,
    "5,3": 20,
    "5,4": 22,
    "5,5": 95
  };

  const configData = {
    strict: {
      name: 'Strict NSP Model',
      description: 'Requires strong semantic and contextual connection',
      threshold: 80,
      tone: 'rose'
    },
    balanced: {
      name: 'Balanced NSP Model',
      description: 'Considers both semantic meaning and contextual flow',
      threshold: 60,
      tone: 'indigo'
    },
    lenient: {
      name: 'Lenient NSP Model',
      description: 'Accepts loose thematic or topical connections',
      threshold: 40,
      tone: 'emerald'
    }
  };

  const toneVarMap = {
    rose: '--tone-rose-strong',
    indigo: '--tone-indigo-strong',
    emerald: '--tone-emerald-strong',
    amber: '--tone-amber-strong'
  };

  const getCssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback || '';
  const toneColor = (tone) => {
    const varName = toneVarMap[tone] || '--tone-indigo-strong';
    const value = getCssVar(varName);
    return value || getCssVar('--tone-indigo-strong', '#6366f1');
  };
  const toneSurface = (tone, amount = 16) => `color-mix(in srgb, ${toneColor(tone)} ${amount}%, var(--color-card))`;
  const toneBorder = (tone, amount = 36) => `color-mix(in srgb, ${toneColor(tone)} ${amount}%, var(--color-border-subtle) ${100 - amount}%)`;

  const sentenceA = document.getElementById('q11-sentence-a');
  const sentenceB = document.getElementById('q11-sentence-b');
  const output = document.getElementById('q11-output');
  const modelRadios = document.querySelectorAll('input[name="q11-model"]');
  const exampleBtn = document.getElementById('q11-example-btn');
  const modelIndicator = document.getElementById('q11-model-indicator');
  const legend = document.getElementById('q11-legend');
  const explanation = document.getElementById('q11-explanation');

  if (!sentenceA || !sentenceB || !output) {
    console.error('Required DOM elements not found for Question 11');
    return;
  }

const analysisMap = {
    "0,0": {
      semantic: 85,
      contextual: 78,
      reasoning: "Strong semantic connection: the second sentence expands on the butterfly the scientist just discovered."
    },
    "0,1": {
      semantic: 14,
      contextual: 10,
      reasoning: "No connection: a butterfly discovery in the rainforest and a note about machine learning data requirements describe unrelated topics."
    },
    "0,2": {
      semantic: 22,
      contextual: 16,
      reasoning: "No logical flow: fieldwork in the rainforest suddenly jumps to a restaurant scene with no bridge."
    },
    "0,3": {
      semantic: 12,
      contextual: 8,
      reasoning: "No connection: a butterfly discovery in the rainforest and a decision to grab umbrellas describe unrelated topics."
    },
    "0,4": {
      semantic: 16,
      contextual: 12,
      reasoning: "No connection: a butterfly discovery in the rainforest and pager noise settling after a production patch describe unrelated topics."
    },
    "0,5": {
      semantic: 30,
      contextual: 20,
      reasoning: "Loose imagery overlap: vivid wings and a blue planet are both visual, but the story jumps from Earth to orbit."
    },
    "1,0": {
      semantic: 18,
      contextual: 12,
      reasoning: "No connection: a corporate profits announcement and a detailed description of the butterfly's wings describe unrelated topics."
    },
    "1,1": {
      semantic: 50,
      contextual: 34,
      reasoning: "Weak thematic link: both mention business and tech, yet the second sentence shifts to generic ML data needs."
    },
    "1,2": {
      semantic: 28,
      contextual: 20,
      reasoning: "Service contexts differ: corporate finance news does not segue into restaurant staffing."
    },
    "1,3": {
      semantic: 14,
      contextual: 12,
      reasoning: "No connection: a corporate profits announcement and a decision to grab umbrellas describe unrelated topics."
    },
    "1,4": {
      semantic: 42,
      contextual: 32,
      reasoning: "Operations versus reporting: profits news does not explain why a pager quieted after a patch."
    },
    "1,5": {
      semantic: 18,
      contextual: 14,
      reasoning: "Topic jump: financial results give way to space tourism with no connective tissue."
    },
    "2,0": {
      semantic: 18,
      contextual: 12,
      reasoning: "Scene swap: entering a restaurant has nothing to do with butterfly research."
    },
    "2,1": {
      semantic: 22,
      contextual: 16,
      reasoning: "No connection: arriving at a busy restaurant and a note about machine learning data requirements describe unrelated topics."
    },
    "2,2": {
      semantic: 84,
      contextual: 90,
      reasoning: "Strong narrative flow: a waiter greeting naturally follows someone entering a restaurant."
    },
    "2,3": {
      semantic: 14,
      contextual: 10,
      reasoning: "No connection: arriving at a busy restaurant and a decision to grab umbrellas describe unrelated topics."
    },
    "2,4": {
      semantic: 24,
      contextual: 20,
      reasoning: "Workflow mismatch: a restaurant arrival is unrelated to pager alerts in production."
    },
    "2,5": {
      semantic: 18,
      contextual: 12,
      reasoning: "No connection: arriving at a busy restaurant and a photo of Earth taken from orbit describe unrelated topics."
    },
    "3,0": {
      semantic: 18,
      contextual: 12,
      reasoning: "No connection: a weather forecast warning about heavy rain and a detailed description of the butterfly's wings describe unrelated topics."
    },
    "3,1": {
      semantic: 26,
      contextual: 18,
      reasoning: "Discipline mismatch: a meteorology update rarely pivots into machine learning training requirements."
    },
    "3,2": {
      semantic: 26,
      contextual: 22,
      reasoning: "No connection: a weather forecast warning about heavy rain and a waiter greeting diners describe unrelated topics."
    },
    "3,3": {
      semantic: 80,
      contextual: 94,
      reasoning: "Direct consequence: deciding to take umbrellas is the natural response to the heavy rain forecast."
    },
    "3,4": {
      semantic: 34,
      contextual: 32,
      reasoning: "Moderate link: both sentences involve anticipating operational impact, but the pager story is a post-incident quiet period."
    },
    "3,5": {
      semantic: 22,
      contextual: 18,
      reasoning: "Topic leap: weather preparedness suddenly turns into space photography."
    },
    "4,0": {
      semantic: 20,
      contextual: 14,
      reasoning: "No connection: an overnight engineering hotfix incident and a detailed description of the butterfly's wings describe unrelated topics."
    },
    "4,1": {
      semantic: 38,
      contextual: 30,
      reasoning: "Loose connection: both mention engineers, yet ML data needs do not close an incident."
    },
    "4,2": {
      semantic: 26,
      contextual: 20,
      reasoning: "No connection: an overnight engineering hotfix incident and a waiter greeting diners describe unrelated topics."
    },
    "4,3": {
      semantic: 28,
      contextual: 24,
      reasoning: "Partial tie: teams may prep for storms, but umbrellas do not follow an emergency hotfix."
    },
    "4,4": {
      semantic: 80,
      contextual: 88,
      reasoning: "Operational follow-up: the quiet pager confirms the hotfix resolved the incident."
    },
    "4,5": {
      semantic: 22,
      contextual: 18,
      reasoning: "Topic jump: a production incident does not pivot into orbital sightseeing."
    },
    "5,0": {
      semantic: 26,
      contextual: 18,
      reasoning: "Imagery mismatch: rainforest wildlife and orbiting tourists are unrelated scenes."
    },
    "5,1": {
      semantic: 24,
      contextual: 18,
      reasoning: "No connection: an orbital tourism scene inside a spacecraft and a note about machine learning data requirements describe unrelated topics."
    },
    "5,2": {
      semantic: 24,
      contextual: 18,
      reasoning: "No connection: an orbital tourism scene inside a spacecraft and a waiter greeting diners describe unrelated topics."
    },
    "5,3": {
      semantic: 20,
      contextual: 16,
      reasoning: "No connection: an orbital tourism scene inside a spacecraft and a decision to grab umbrellas describe unrelated topics."
    },
    "5,4": {
      semantic: 22,
      contextual: 18,
      reasoning: "Weak tie: both involve technology, but zero-gravity tourism is disconnected from pager metrics."
    },
    "5,5": {
      semantic: 86,
      contextual: 92,
      reasoning: "Story continues: photographing Earth is a natural next moment for tourists floating in microgravity."
    }
  };

  const getCurrentModel = () => {
    const selectedRadio = document.querySelector('input[name="q11-model"]:checked');
    return selectedRadio ? selectedRadio.value : 'strict';
  };

  const getSelectedSentences = () => {
    const aIndex = sentenceA.selectedIndex;
    const bIndex = sentenceB.selectedIndex;
    return {
      textA: sentences.A[aIndex],
      textB: sentences.B[bIndex],
      indexA: aIndex,
      indexB: bIndex,
      key: `${aIndex},${bIndex}`
    };
  };

  const getClassificationResult = (modelType, key) => {
    const score = basePairConfidence[key];
    const config = configData[modelType] || configData.balanced;
    if (typeof score !== 'number') {
      return { isNext: false, confidence: 50 };
    }
    return { isNext: score >= config.threshold, confidence: score };
  };

  const getAllModelComparisons = (key) => {
    const score = basePairConfidence[key];
    return Object.entries(configData).map(([model, cfg]) => {
      const confidence = typeof score === 'number' ? score : 50;
      return {
        model,
        name: cfg.name.replace(' NSP Model', ''),
        threshold: cfg.threshold,
        tone: cfg.tone,
        isNext: typeof score === 'number' && score >= cfg.threshold,
        confidence
      };
    });
  };

  const analyzeConnection = (indexA, indexB) => {
    const key = `${indexA},${indexB}`;
    return analysisMap[key] || { semantic: 20, contextual: 15, reasoning: 'Analysis not available for this combination.' };
  };

  const updateModelVisuals = () => {
    modelRadios.forEach((radio) => {
      const card = radio.closest('.q11-option')?.querySelector('.q11-card');
      if (!card) return;
      card.dataset.active = radio.checked ? 'true' : 'false';
    });
  };

  const buildMetricBar = (tone, value, label, helper) => `
    <div class="panel panel-neutral-soft p-3 space-y-2">
      <div class="text-sm font-medium text-heading">${label}</div>
      <div class="q11-meter" style="--q11-meter-color: ${toneColor(tone)}; --q11-meter-width: ${Math.min(Math.max(value, 0), 100)}%;"></div>
      <div class="text-xs text-muted">${helper}</div>
    </div>
  `;

  const updateExplanation = (modelType, result, analysis) => {
    if (!explanation) return;
    const summaries = {
      strict: {
        title: 'Strict NSP Model',
        detail: 'Prioritises precision—only very clear continuations pass.'
      },
      balanced: {
        title: 'Balanced NSP Model',
        detail: 'Balances semantic similarity with discourse cues for general use.'
      },
      lenient: {
        title: 'Lenient NSP Model',
        detail: 'Maximises recall—keeps borderline pairs to avoid missing loose links.'
      }
    };
    const current = summaries[modelType] || summaries.balanced;
    const bullets = [
      `<strong>Decision:</strong> ${result.isNext ? 'IsNext (sequential)' : 'NotNext (random)' } at ${result.confidence}% confidence`,
      `<strong>Semantic score:</strong> ${analysis.semantic}%`,
      `<strong>Contextual flow:</strong> ${analysis.contextual}%`,
      `<strong>Why:</strong> ${analysis.reasoning}`
    ];
    explanation.innerHTML = `
      <div class="space-y-2">
        <p><strong>${current.title}:</strong> ${current.detail}</p>
        <ul class="list-disc list-inside space-y-1 text-sm">
          ${bullets.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  const renderLegend = () => {
    if (!legend) return;
    legend.innerHTML = `
      <div class="flex flex-wrap items-center justify-end gap-3 text-xs">
        <div class="flex items-center gap-1">
          <span class="q11-legend-dot q11-legend-dot--next"></span>
          <span>IsNext</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="q11-legend-dot q11-legend-dot--not"></span>
          <span>NotNext</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="q11-legend-dot" style="background:${toneColor('indigo')}"></span>
          <span>Semantic</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="q11-legend-dot" style="background:${toneColor('emerald')}"></span>
          <span>Contextual</span>
        </div>
      </div>
    `;
  };

  const processAndDisplay = () => {
    const selection = getSelectedSentences();
    const modelType = getCurrentModel();
    const config = configData[modelType];
    const result = getClassificationResult(modelType, selection.key);
    const analysis = analyzeConnection(selection.indexA, selection.indexB);

    if (modelIndicator) {
      modelIndicator.textContent = config.name;
      modelIndicator.style.backgroundColor = toneSurface(config.tone, 18);
      modelIndicator.style.color = toneColor(config.tone);
      modelIndicator.style.boxShadow = `0 0 0 1px ${toneBorder(config.tone, 42)}`;
    }

    const container = document.createElement('div');
    container.className = 'space-y-4';

    const classificationTone = result.isNext ? 'emerald' : 'rose';
    const classificationEl = document.createElement('div');
    classificationEl.className = 'q11-classification space-y-2';
    classificationEl.style.setProperty('--q11-accent-surface', toneSurface(classificationTone, 20));
    classificationEl.style.setProperty('--q11-accent-border', toneBorder(classificationTone, 46));
    classificationEl.style.setProperty('--q11-accent-color', toneColor(classificationTone));
    classificationEl.innerHTML = `
      <div class="flex items-center justify-center gap-2 text-lg font-semibold" style="color: var(--q11-accent-color)">
        <span>${result.isNext ? '✅ IsNext' : '❌ NotNext'}</span>
      </div>
      <div class="text-sm text-muted">Confidence ${result.confidence}% · Threshold ${config.threshold}%</div>
    `;
    container.appendChild(classificationEl);

    const comparisonCards = getAllModelComparisons(selection.key)
      .map((item) => `
        <div class="q11-compare-card" style="border-color:${toneBorder(item.tone, 34)};background:${toneSurface(item.tone, item.isNext ? 18 : 8)}">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-semibold" style="color:${toneColor(item.tone)}">${item.name}</span>
            <span class="chip ${item.isNext ? 'chip-success' : 'chip-warning'} text-xs">${item.isNext ? 'IsNext' : 'NotNext'}</span>
          </div>
          <div class="text-xs text-muted">${item.confidence}% vs ${item.threshold}% threshold</div>
        </div>
      `).join('');

    const comparisonEl = document.createElement('div');
    comparisonEl.className = 'panel panel-neutral-soft p-3 space-y-3';
    comparisonEl.innerHTML = `
      <div class="text-sm font-medium text-heading">📊 Model verdicts for this pair</div>
      <div class="grid gap-3 md:grid-cols-3">
        ${comparisonCards}
      </div>
    `;
    container.appendChild(comparisonEl);

    const sentenceEl = document.createElement('div');
    sentenceEl.className = 'grid gap-3 md:grid-cols-[1fr_auto_1fr] items-center';
    sentenceEl.innerHTML = `
      <div class="panel panel-info p-3 space-y-1">
        <div class="small-caption text-muted">Sentence A (Option ${selection.indexA + 1})</div>
        <div class="text-sm text-body">“${selection.textA}”</div>
      </div>
      <div class="flex flex-col items-center gap-1 text-xs text-muted">
        <span class="chip chip-neutral text-xs">Does B follow A?</span>
        <span class="text-heading text-lg">↓</span>
      </div>
      <div class="panel panel-accent p-3 space-y-1">
        <div class="small-caption text-muted">Sentence B (Option ${selection.indexB + 1})</div>
        <div class="text-sm text-body">“${selection.textB}”</div>
      </div>
    `;
    container.appendChild(sentenceEl);

    const metricsEl = document.createElement('div');
    metricsEl.className = 'grid gap-3 md:grid-cols-2';
    metricsEl.innerHTML = [
      buildMetricBar('indigo', analysis.semantic, '🔎 Semantic similarity', `${analysis.semantic}% word/topic overlap`),
      buildMetricBar('emerald', analysis.contextual, '🔗 Contextual flow', `${analysis.contextual}% discourse alignment`)
    ].join('');
    container.appendChild(metricsEl);

    const reasoningEl = document.createElement('div');
    reasoningEl.className = 'panel panel-neutral-soft p-3 text-sm space-y-1';
    reasoningEl.innerHTML = `
      <div class="font-medium text-heading">🧠 Classification reasoning</div>
      <div class="text-body">${analysis.reasoning}</div>
    `;
    container.appendChild(reasoningEl);

    output.innerHTML = '';
    output.appendChild(container);

    renderLegend();
    updateExplanation(modelType, result, analysis);

    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([output, legend, explanation]).catch(() => {});
    }
  };

  const interestingExamples = [
    { a: 0, b: 0, model: 'balanced', note: 'Perfect Coherent' },
    { a: 2, b: 2, model: 'balanced', note: 'Restaurant Story Continues' },
    { a: 3, b: 3, model: 'balanced', note: 'Rain Forecast Payoff' },
    { a: 4, b: 4, model: 'balanced', note: 'Hotfix -> Pager Quiet' },
    { a: 5, b: 5, model: 'balanced', note: 'Orbit Scene Follow-up' },
    { a: 1, b: 1, model: 'lenient', note: 'Profits vs ML Data Gap' },
    { a: 4, b: 1, model: 'lenient', note: 'Incident vs ML Topic Drift' },
    { a: 0, b: 2, model: 'strict', note: 'Nature -> Dining Jump' },
    { a: 2, b: 4, model: 'strict', note: 'Service vs Pager Clash' },
    { a: 3, b: 5, model: 'strict', note: 'Forecast to Space Leap' }
  ];
  let exampleIndex = 0;
  if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
      const example = interestingExamples[exampleIndex % interestingExamples.length];
      sentenceA.selectedIndex = example.a;
      sentenceB.selectedIndex = example.b;
      const targetRadio = document.querySelector(`input[name="q11-model"][value="${example.model}"]`);
      if (targetRadio) targetRadio.checked = true;
      updateModelVisuals();
      processAndDisplay();
      exampleIndex += 1;
      const nextExample = interestingExamples[exampleIndex % interestingExamples.length];
      exampleBtn.textContent = `Try: ${nextExample.note}`;
      exampleBtn.title = nextExample.note;
    });
  }

  sentenceA.addEventListener('change', processAndDisplay);
  sentenceB.addEventListener('change', processAndDisplay);
  modelRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateModelVisuals();
      processAndDisplay();
    });
  });

  updateModelVisuals();
  processAndDisplay();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question11Interactive = interactiveScript;
}





