const interactiveScript = () => {
  if (window.MathJax?.typesetPromise) {
    const answerRoot = document.getElementById('question-answer');
    const formula = document.getElementById('q24-formula');
    const targets = formula ? [formula] : answerRoot ? [answerRoot] : [];
    if (targets.length) {
      window.MathJax.typesetPromise(targets).catch(() => {});
    }
  }

  const vectorsSelect = document.getElementById('q24-vectors-select');
  const applyScaling = document.getElementById('q24-apply-scaling');
  const applySoftmax = document.getElementById('q24-apply-softmax');
  const modeRadios = Array.from(document.querySelectorAll('input[name="q24-mode"]'));
  const modeCards = Array.from(document.querySelectorAll('.q24-mode-card'));
  const exampleBtn = document.getElementById('q24-example-btn');
  const modeIndicator = document.getElementById('q24-mode-indicator');
  const output = document.getElementById('q24-output');
  const legend = document.getElementById('q24-legend');
  const explanation = document.getElementById('q24-explanation');

  if (!vectorsSelect || !output) {
    console.error('Question 24 interactive could not initialise');
    if (output) {
      output.innerHTML = '<div class="panel panel-warning p-4">Unable to initialise the attention visualisation.</div>';
    }
    return;
  }

  const DIMENSIONS = [
    'Semantic category',
    'Emotional tone',
    'Concreteness',
    'Action relatedness'
  ];

  const EXAMPLES = [
    {
      vectors: '[0.8, 0.6, 0.2, 0.9]; [0.7, 0.5, 0.3, 0.8]',
      label: 'Similar meanings - high attention',
      title: '"king" → "queen" - royal roles share most traits.'
    },
    {
      vectors: '[0.9, 0.1, 0.8, 0.3]; [0.8, 0.2, 0.9, 0.2]',
      label: 'Related actions - strong similarity',
      title: '"running" → "jogging" - action verbs overlap across motion.'
    },
    {
      vectors: '[0.2, 0.1, 0.1, 0.8]; [0.1, 0.2, 0.8, 0.1]',
      label: 'Function vs concrete - low attention',
      title: '"the" → "elephant" - function words rarely align with nouns.'
    },
    {
      vectors: '[0.6, 0.9, 0.3, 0.2]; [0.5, -0.8, 0.2, 0.3]',
      label: 'Opposite emotions - negative attention',
      title: '"happy" → "sad" - emotional polarity flips the dot product.'
    },
    {
      vectors: '[0.4, 0.7, 0.8, 0.6]; [0.5, 0.6, 0.9, 0.7]',
      label: 'Speed concepts - high attention',
      title: '"quickly" → "fast" - shared semantics reinforce attention.'
    }
  ];

  const escapeHTML = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let exampleIndex = 0;

  const parseVectors = (source) => {
    try {
      const [qText, kText] = source.split(';').map((part) => part.trim());
      const Q = JSON.parse(qText);
      const K = JSON.parse(kText);
      if (Array.isArray(Q) && Array.isArray(K) && Q.length === K.length) {
        return { Q, K };
      }
    } catch (err) {
      console.warn('Falling back to default vectors', err);
    }
    return { Q: [0.8, 0.6, 0.2, 0.9], K: [0.7, 0.5, 0.3, 0.8] };
  };

  const dotProduct = (A, B) => A.reduce((sum, value, index) => sum + value * (B[index] ?? 0), 0);
  const magnitude = (vector) => Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  const cosineSimilarity = (A, B) => {
    const denom = magnitude(A) * magnitude(B);
    return denom === 0 ? 0 : dotProduct(A, B) / denom;
  };
  const softmaxSingle = (score, reference = [0, -1]) => {
    const expValues = [score, ...reference].map((value) => Math.exp(value));
    const total = expValues.reduce((acc, value) => acc + value, 0);
    return expValues[0] / total;
  };

  const wordPairLabel = (value) => {
    const map = {
      '[0.8, 0.6, 0.2, 0.9]; [0.7, 0.5, 0.3, 0.8]': '"king" → "queen"',
      '[0.9, 0.1, 0.8, 0.3]; [0.8, 0.2, 0.9, 0.2]': '"running" → "jogging"',
      '[0.2, 0.1, 0.1, 0.8]; [0.1, 0.2, 0.8, 0.1]': '"the" → "elephant"',
      '[0.6, 0.9, 0.3, 0.2]; [0.5, -0.8, 0.2, 0.3]': '"happy" → "sad"',
      '[0.4, 0.7, 0.8, 0.6]; [0.5, 0.6, 0.9, 0.7]': '"quickly" → "fast"',
      '[0.9, 0.2, 0.7, 0.4]; [0.3, 0.8, 0.2, 0.6]': '"doctor" → "patient"',
      '[0.5, 0.8, 0.1, 0.9]; [-0.4, -0.7, 0.2, -0.8]': '"hot" → "cold"',
      '[0.3, 0.4, 0.9, 0.5]; [0.2, 0.3, 0.8, 0.6]': '"writing" → "pencil"'
    };
    return map[value] || 'word pair';
  };

  const describeContribution = (value) => {
    if (value > 0.3) {
      return { badge: 'chip chip-success text-xs', label: 'Aligned', help: 'Strong positive contribution' };
    }
    if (value > 0) {
      return { badge: 'chip chip-info text-xs', label: 'Some overlap', help: 'Mild reinforcement' };
    }
    if (value > -0.3) {
      return { badge: 'chip chip-warning text-xs', label: 'Low overlap', help: 'Barely related traits' };
    }
    return { badge: 'chip chip-warning text-xs', label: 'Opposite', help: 'Traits pull attention apart' };
  };

  const classifyAttention = (score) => {
    if (score > 1.5) {
      return { badge: 'chip chip-success text-xs', heading: 'Strong attention', summary: 'Highly aligned semantics boost the attention weight.' };
    }
    if (score > 0.5) {
      return { badge: 'chip chip-info text-xs', heading: 'Moderate attention', summary: 'Meaning overlaps enough to share attention.' };
    }
    if (score > 0) {
      return { badge: 'chip chip-warning text-xs', heading: 'Weak attention', summary: 'Only a subtle link between tokens.' };
    }
    if (score === 0) {
      return { badge: 'chip chip-neutral text-xs', heading: 'No attention', summary: 'Vectors are orthogonal; no shared information.' };
    }
    return { badge: 'chip chip-warning text-xs', heading: 'Negative attention', summary: 'Opposing semantics dampen the attention weight.' };
  };

  const getMode = () => {
    const checked = modeRadios.find((radio) => radio.checked);
    return checked ? checked.value : 'calculation';
  };

  const computeState = () => {
    const vectorsText = vectorsSelect.value.trim();
    const useScaling = applyScaling ? applyScaling.checked : true;
    const useSoftmax = applySoftmax ? applySoftmax.checked : true;
    const { Q, K } = parseVectors(vectorsText);
    const rawScore = dotProduct(Q, K);
    const dimension = K.length || 1;
    const scaledScore = useScaling ? rawScore / Math.sqrt(dimension) : rawScore;
    const softmaxScore = useSoftmax ? softmaxSingle(scaledScore) : scaledScore;
    const cosine = cosineSimilarity(Q, K);
    const angle = Number.isFinite(cosine) ? Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI : NaN;
    const contributions = DIMENSIONS.map((dimensionName, index) => {
      const q = Q[index] ?? 0;
      const k = K[index] ?? 0;
      const value = q * k;
      return { dimensionName, q, k, value, descriptor: describeContribution(value) };
    });
    return {
      vectorsText,
      useScaling,
      useSoftmax,
      Q,
      K,
      rawScore,
      scaledScore,
      softmaxScore,
      finalScore: useSoftmax ? softmaxScore : scaledScore,
      dimension,
      contributions,
      cosine,
      angle
    };
  };

  const renderContributionList = (contributions) => contributions.map(({ dimensionName, q, k, value, descriptor }) => `
      <li class="q24-dimension">
        <div class="q24-dimension-head">
          <span>${dimensionName}</span>
          <span class="${descriptor.badge}">${descriptor.label}</span>
        </div>
        <div class="q24-dimension-body">
          <span class="font-mono text-xs">${q.toFixed(1)} × ${k.toFixed(1)} = ${value.toFixed(2)}</span>
          <span class="text-xs panel-muted">${descriptor.help}</span>
        </div>
      </li>
    `).join('');

  const renderCalculation = (state) => {
    const { Q, K, rawScore, scaledScore, useScaling, softmaxScore, useSoftmax, dimension, contributions, vectorsText } = state;
    const scalingFactor = Math.sqrt(dimension);
    const scalingBlock = useScaling
      ? `
        <div class="panel panel-warning p-3 space-y-1">
          <h5 class="font-medium">Scaling for stability</h5>
          <div class="font-mono text-sm">${rawScore.toFixed(3)} ÷ √${dimension} (${scalingFactor.toFixed(2)}) = ${scaledScore.toFixed(3)}</div>
          <p class="text-xs panel-muted">Keeps scores comparable across embedding dimensions.</p>
        </div>
      `
      : `
        <div class="panel panel-neutral-soft p-3 space-y-1 q24-disabled">
          <h5 class="font-medium">Scaling disabled</h5>
          <p class="text-sm">Score stays at ${rawScore.toFixed(3)}; high-dimensional vectors could dominate.</p>
        </div>
      `;
    const softmaxBlock = useSoftmax
      ? `
        <div class="panel panel-info p-3 space-y-1">
          <h5 class="font-medium">Softmax probability</h5>
          <div class="font-mono text-sm">Attention weight ≈ ${softmaxScore.toFixed(3)}</div>
          <p class="text-xs panel-muted">Softmax turns similarity into a probability shared across tokens.</p>
        </div>
      `
      : `
        <div class="panel panel-neutral-soft p-3 space-y-1 q24-disabled">
          <h5 class="font-medium">Softmax disabled</h5>
          <p class="text-sm">Unnormalised similarity remains ${scaledScore.toFixed(3)}.</p>
        </div>
      `;

    return `
      <div class="space-y-4">
        <div class="panel panel-info p-4 space-y-2">
          <h5 class="font-medium">Word pair analysis</h5>
          <div class="q24-grid-two">
            <div>
              <span class="text-xs panel-muted uppercase tracking-wide">Query vector (Q)</span>
              <div class="font-mono text-xs q24-code">[${Q.map((value) => value.toFixed(1)).join(', ')}]</div>
            </div>
            <div>
              <span class="text-xs panel-muted uppercase tracking-wide">Key vector (K)</span>
              <div class="font-mono text-xs q24-code">[${K.map((value) => value.toFixed(1)).join(', ')}]</div>
            </div>
          </div>
          <p class="text-xs panel-muted">Comparing ${wordPairLabel(vectorsText)} dimension by dimension suggests where attention flows.</p>
        </div>

        <div class="panel panel-success p-4 space-y-2">
          <h5 class="font-medium">Dimension contributions</h5>
          <ul class="q24-dimension-list">${renderContributionList(contributions)}</ul>
        </div>

        <div class="panel panel-accent p-4 space-y-1">
          <h5 class="font-medium">Dot product</h5>
          <div class="font-mono text-sm">${Q.map((value, index) => `(${value.toFixed(1)} × ${K[index].toFixed(1)})`).join(' + ')} = <strong>${rawScore.toFixed(3)}</strong></div>
          <p class="text-xs panel-muted">This raw score sets how strongly the query token attends to the key token.</p>
        </div>

        ${scalingBlock}
        ${softmaxBlock}
      </div>
    `;
  };

  const renderVisualisation = (state) => {
    const { Q, K, rawScore, scaledScore, softmaxScore, useSoftmax, contributions, cosine, angle, vectorsText } = state;
    const uid = `q24-${Math.random().toString(36).slice(2, 8)}`;
    const scale = 80;
    const qx = 120 + (Q[0] ?? 0) * scale;
    const qy = 120 - (Q[1] ?? 0) * scale;
    const kx = 120 + (K[0] ?? 0) * scale;
    const ky = 120 - (K[1] ?? 0) * scale;
    const angleMarkup = Number.isNaN(angle) || angle > 150
      ? ''
      : (() => {
          const arcRadius = 32;
          const qAngle = Math.atan2(-(Q[1] ?? 0), Q[0] ?? 0);
          const kAngle = Math.atan2(-(K[1] ?? 0), K[0] ?? 0);
          const start = Math.min(qAngle, kAngle);
          const end = Math.max(qAngle, kAngle);
          const startX = 120 + Math.cos(start) * arcRadius;
          const startY = 120 - Math.sin(start) * arcRadius;
          const endX = 120 + Math.cos(end) * arcRadius;
          const endY = 120 - Math.sin(end) * arcRadius;
          const mid = (start + end) / 2;
          const labelX = 120 + Math.cos(mid) * (arcRadius + 14);
          const labelY = 120 - Math.sin(mid) * (arcRadius + 14);
          return `
            <path d="M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 0 1 ${endX} ${endY}" stroke="var(--q24-angle)" stroke-width="2" fill="none"></path>
            <text x="${labelX}" y="${labelY}" fill="var(--q24-angle)" font-size="10" text-anchor="middle">${angle.toFixed(1)}°</text>
          `;
        })();

    return `
      <div class="space-y-4">
        <div class="panel panel-info p-3 text-center space-y-1">
          <h5 class="font-medium">Analysing ${wordPairLabel(vectorsText)}</h5>
          <p class="text-xs panel-muted">Vector direction, magnitude, and resulting attention strength.</p>
        </div>

        <div class="q24-metric-grid">
          <div class="panel panel-success q24-metric">
            <span class="q24-metric-value">${rawScore.toFixed(3)}</span>
            <span class="text-xs panel-muted">Dot product</span>
          </div>
          <div class="panel panel-accent q24-metric">
            <span class="q24-metric-value">${scaledScore.toFixed(3)}</span>
            <span class="text-xs panel-muted">Scaled score</span>
          </div>
          <div class="panel panel-warning q24-metric">
            <span class="q24-metric-value">${cosine.toFixed(3)}</span>
            <span class="text-xs panel-muted">Cosine similarity</span>
          </div>
          <div class="panel panel-neutral-soft q24-metric">
            <span class="q24-metric-value">${(useSoftmax ? softmaxScore : scaledScore).toFixed(3)}</span>
            <span class="text-xs panel-muted">Attention weight</span>
          </div>
        </div>

        <div class="panel panel-neutral-soft q24-plot-wrapper">
          <h5 class="font-medium">2D projection (first two dimensions)</h5>
          <div class="q24-plot">
            <svg width="240" height="240" viewBox="0 0 240 240">
              <defs>
                <pattern id="${uid}-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--q24-grid-line)" stroke-width="1"></path>
                </pattern>
                <marker id="${uid}-arrow-q" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--q24-query)"></polygon>
                </marker>
                <marker id="${uid}-arrow-k" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--q24-key)"></polygon>
                </marker>
              </defs>

              <rect width="240" height="240" fill="url(#${uid}-grid)"></rect>
              <line x1="120" y1="0" x2="120" y2="240" stroke="var(--q24-axis-line)" stroke-width="2"></line>
              <line x1="0" y1="120" x2="240" y2="120" stroke="var(--q24-axis-line)" stroke-width="2"></line>

              <line x1="120" y1="120" x2="${qx}" y2="${qy}" stroke="var(--q24-query)" stroke-width="3" marker-end="url(#${uid}-arrow-q)"></line>
              <circle cx="${qx}" cy="${qy}" r="4" fill="var(--q24-query)"></circle>
              <text x="${qx + 8}" y="${qy - 8}" fill="var(--q24-query)" font-size="12" font-weight="600">Q</text>

              <line x1="120" y1="120" x2="${kx}" y2="${ky}" stroke="var(--q24-key)" stroke-width="3" marker-end="url(#${uid}-arrow-k)"></line>
              <circle cx="${kx}" cy="${ky}" r="4" fill="var(--q24-key)"></circle>
              <text x="${kx + 8}" y="${ky + 14}" fill="var(--q24-key)" font-size="12" font-weight="600">K</text>

              ${angleMarkup}
            </svg>
            <div class="q24-axis-label q24-axis-label--x">Dimension 1</div>
            <div class="q24-axis-label q24-axis-label--y">Dimension 2</div>
          </div>
        </div>

        <div class="panel panel-info p-4 space-y-2">
          <h5 class="font-medium">Dimension alignment</h5>
          <ul class="q24-dimension-list">${renderContributionList(contributions)}</ul>
        </div>
      </div>
    `;
  };

  const updateLegend = (state) => {
    if (!legend) return;
    const pair = escapeHTML(wordPairLabel(state.vectorsText));
    const score = state.finalScore.toFixed(4);
    const scalingLabel = state.useScaling ? 'On' : 'Off';
    const softmaxLabel = state.useSoftmax ? 'On' : 'Off';
    legend.innerHTML = `
      <span class="q24-legend-pair">${pair}</span>
      <span class="q24-legend-piece">score <strong>${score}</strong></span>
      <span class="q24-legend-piece">scaling <strong>${scalingLabel}</strong></span>
      <span class="q24-legend-piece">softmax <strong>${softmaxLabel}</strong></span>
    `;
  };

  const updateExplanation = (state) => {
    if (!explanation) return;
    const attention = classifyAttention(state.rawScore);
    const scalingFactor = Math.sqrt(state.dimension);
    const scalingLine = state.useScaling
      ? `Scaling by √${state.dimension} = ${scalingFactor.toFixed(2)} keeps ${state.rawScore.toFixed(3)} stable at ${state.scaledScore.toFixed(3)}.`
      : `Without scaling the raw score ${state.rawScore.toFixed(3)} can grow in high dimensions.`;
    const softmaxLine = state.useSoftmax
      ? 'Softmax converts similarity into a probability shared with other tokens.'
      : 'Softmax is off, so this is an unnormalised similarity score.';

    explanation.innerHTML = `
      <div class="panel panel-neutral-soft p-3 space-y-1">
        <span class="${attention.badge}">${attention.heading}</span>
        <p>${attention.summary} In this example, ${wordPairLabel(state.vectorsText)} illustrate that behaviour.</p>
      </div>
      <p><strong>Scaling effect:</strong> ${scalingLine}</p>
      <p><strong>Softmax impact:</strong> ${softmaxLine}</p>
      <div class="panel panel-warning panel-emphasis text-xs p-3">
        <strong>💡 Language insight:</strong> Dot-product attention lets transformers discover relationships such as ${wordPairLabel(state.vectorsText).replace(/"/g, '')} without hand-crafted rules.
      </div>
    `;
  };

  const updateModeIndicator = () => {
    if (!modeIndicator) return;
    modeIndicator.textContent = getMode() === 'calculation' ? 'Step-by-step' : 'Vector plot';
  };

  const updateModeCards = () => {
    const mode = getMode();
    modeCards.forEach((card) => {
      if (card.dataset.mode === mode) {
        card.setAttribute('data-active', 'true');
      } else {
        card.removeAttribute('data-active');
      }
    });
  };

  const render = () => {
    const state = computeState();
    const mode = getMode();
    output.innerHTML = mode === 'calculation' ? renderCalculation(state) : renderVisualisation(state);
    updateLegend(state);
    updateExplanation(state);
  };

  vectorsSelect.addEventListener('change', render);
  applyScaling?.addEventListener('change', render);
  applySoftmax?.addEventListener('change', render);
  modeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateModeIndicator();
      updateModeCards();
      render();
    });
  });

  exampleBtn?.addEventListener('click', () => {
    const example = EXAMPLES[exampleIndex];
    vectorsSelect.value = example.vectors;
    exampleBtn.textContent = example.label;
    exampleBtn.title = example.title;
    exampleIndex = (exampleIndex + 1) % EXAMPLES.length;
    render();
  });

  updateModeIndicator();
  updateModeCards();
  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question24Interactive = interactiveScript;
}



