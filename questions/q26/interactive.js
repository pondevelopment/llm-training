const interactiveScript = () => {
  const root = document.getElementById('q26-interactive-root');
  const scenarioSelect = document.getElementById('q26-scenario');
  const targetWordSelect = document.getElementById('q26-target-word');
  const contextSelect = document.getElementById('q26-context');
  const modeRadios = document.querySelectorAll('input[name="q26-mode"]');
  const output = document.getElementById('q26-output');
  const exampleBtn = document.getElementById('q26-example-btn');
  const modeIndicator = document.getElementById('q26-mode-indicator');
  const legend = document.getElementById('q26-legend');
  const explanation = document.getElementById('q26-explanation');

  if (!root || !scenarioSelect || !targetWordSelect || !contextSelect || !output) {
    console.error('Required DOM elements not found for Question 26');
    if (output) {
      output.innerHTML = '<div class="panel panel-warning p-4 text-danger">Error: Could not initialise Question 26 interactive components.</div>';
    }
    return;
  }

  const scenarioConfig = {
    'correct-prediction': {
      name: 'Correct Prediction',
      description: 'Model correctly predicts the target word, resulting in small gradients.',
      gradientMagnitude: 'small',
      loss: 0.1,
      confidence: 0.85
    },
    'wrong-prediction': {
      name: 'Wrong Prediction',
      description: 'Model incorrectly predicts the target word, resulting in large gradients.',
      gradientMagnitude: 'large',
      loss: 2.3,
      confidence: 0.15
    },
    'uncertain-prediction': {
      name: 'Uncertain Prediction',
      description: 'Model is unsure about prediction, resulting in medium gradients.',
      gradientMagnitude: 'medium',
      loss: 1.1,
      confidence: 0.45
    },
    'rare-word': {
      name: 'Rare Word Training',
      description: 'Infrequent word receives sparse but potentially large gradient updates.',
      gradientMagnitude: 'sparse',
      loss: 1.8,
      confidence: 0.25
    },
    'frequent-word': {
      name: 'Frequent Word Training',
      description: 'Common word receives regular, stabilised gradient updates.',
      gradientMagnitude: 'regular',
      loss: 0.6,
      confidence: 0.65
    }
  };

  const examples = [
    {
      scenario: 'wrong-prediction',
      targetWord: 'king',
      context: 'The [WORD] ruled the kingdom',
      mode: 'step-by-step',
      note: 'Wrong prediction example — large gradients'
    },
    {
      scenario: 'rare-word',
      targetWord: 'xylophone',
      context: 'The [WORD] makes lovely sounds',
      mode: 'visualization',
      note: 'Rare word training — sparse updates'
    },
    {
      scenario: 'correct-prediction',
      targetWord: 'beautiful',
      context: 'She is [WORD] and kind',
      mode: 'semantic-impact',
      note: 'Correct prediction — minimal updates'
    },
    {
      scenario: 'uncertain-prediction',
      targetWord: 'algorithm',
      context: 'The [WORD] is very complex',
      mode: 'step-by-step',
      note: 'Uncertain prediction — medium gradients'
    }
  ];

  const modeNames = {
    'step-by-step': 'Step-by-step',
    visualization: 'Visualization',
    'semantic-impact': 'Semantic impact'
  };

  let exampleIndex = 0;

  function generateGradientData(scenario) {
    const config = scenarioConfig[scenario] || scenarioConfig['uncertain-prediction'];
    if (!scenarioConfig[scenario]) {
      console.error('Scenario config not found for:', scenario, 'Available:', Object.keys(scenarioConfig));
    }

    const gradients = [];
    for (let i = 0; i < 8; i += 1) {
      let magnitude;
      switch (config.gradientMagnitude) {
        case 'large':
          magnitude = (Math.random() - 0.5) * 0.8;
          break;
        case 'medium':
          magnitude = (Math.random() - 0.5) * 0.4;
          break;
        case 'small':
          magnitude = (Math.random() - 0.5) * 0.1;
          break;
        case 'sparse':
          magnitude = Math.random() < 0.3 ? (Math.random() - 0.5) * 0.6 : 0;
          break;
        case 'regular':
          magnitude = (Math.random() - 0.5) * 0.3;
          break;
        default:
          magnitude = (Math.random() - 0.5) * 0.2;
      }
      gradients.push(magnitude);
    }

    return {
      gradients,
      loss: config.loss,
      confidence: config.confidence,
      embeddingDim: 768,
      config
    };
  }

  function getCurrentMode() {
    const selected = document.querySelector('input[name="q26-mode"]:checked');
    return selected ? selected.value : 'step-by-step';
  }

  function updateModeVisuals() {
    const mode = getCurrentMode();

    if (modeIndicator) {
      modeIndicator.textContent = modeNames[mode] || modeNames['step-by-step'];
    }

    document.querySelectorAll('.q26-mode-card').forEach((card) => {
      const radio = card.querySelector('input[name="q26-mode"]');
      if (!radio) return;

      if (radio.checked) {
        card.setAttribute('data-active', 'true');
        card.classList.add('question-strategy-active');
      } else {
        card.removeAttribute('data-active');
        card.classList.remove('question-strategy-active');
      }
    });
  }

  function renderStepByStep(targetWord, context, gradientData) {
    const contextWithWord = context.replace('[WORD]', targetWord);

    const rows = gradientData.gradients.map((grad, index) => {
      const magnitude = Math.abs(grad);
      const direction = grad > 0 ? 'Increase ↑' : grad < 0 ? 'Decrease ↓' : 'No change →';
      const magnitudeLabel = magnitude > 0.3 ? 'Large' : magnitude > 0.1 ? 'Medium' : magnitude > 0.01 ? 'Small' : 'Minimal';
      const badgeClass = magnitude > 0.3
        ? 'chip chip-warning text-xs'
        : magnitude > 0.1
          ? 'chip chip-info text-xs'
          : magnitude > 0.01
            ? 'chip chip-success text-xs'
            : 'chip chip-neutral text-xs';
      const valueClass = grad > 0 ? 'q26-value q26-value--positive' : grad < 0 ? 'q26-value q26-value--negative' : 'q26-value';

      return [
        '<tr>',
        '  <td>Dim ' + (index + 1) + '</td>',
        '  <td><span class="' + valueClass + '">' + grad.toFixed(4) + '</span></td>',
        '  <td><span class="' + badgeClass + '">' + magnitudeLabel + '</span></td>',
        '  <td>' + direction + '</td>',
        '</tr>'
      ].join('');
    }).join('');

    return [
      '<div class="space-y-4">',
      '  <div class="panel panel-neutral-soft q26-section">',
      '    <h5 class="q26-section-title">Training scenario setup</h5>',
      '    <dl class="q26-key-list">',
      '      <div><dt>Context</dt><dd>&ldquo;' + contextWithWord + '&rdquo;</dd></div>',
      '      <div><dt>Target word</dt><dd>&ldquo;' + targetWord + '&rdquo;</dd></div>',
      '      <div><dt>Scenario</dt><dd>' + gradientData.config.name + '</dd></div>',
      '      <div><dt>Prediction loss</dt><dd>' + gradientData.loss.toFixed(3) + '</dd></div>',
      '    </dl>',
      '  </div>',
      '  <div class="panel panel-info panel-emphasis q26-section">',
      '    <h5 class="q26-section-title">Chain rule computation</h5>',
      '    <div class="q26-step-stack">',
      '      <div class="q26-step-card">',
      '        <div class="q26-step-title">Step 1: ∂L/∂logits</div>',
      '        <p class="small-caption panel-muted">Loss gradient with respect to output predictions.</p>',
      '        <div class="q26-mono-block">predicted_probs − true_one_hot</div>',
      '        <div class="chip chip-info text-xs">≈ ' + (1 - gradientData.confidence).toFixed(3) + '</div>',
      '      </div>',
      '      <div class="q26-step-card">',
      '        <div class="q26-step-title">Step 2: ∂logits/∂hidden</div>',
      '        <p class="small-caption panel-muted">Output gradient with respect to hidden states.</p>',
      '        <div class="q26-mono-block">output_layer_weights</div>',
      '        <div class="chip chip-neutral text-xs">≈ W_out (768 × vocab_size)</div>',
      '      </div>',
      '      <div class="q26-step-card">',
      '        <div class="q26-step-title">Step 3: ∂hidden/∂embedding</div>',
      '        <p class="small-caption panel-muted">Hidden gradient with respect to embeddings.</p>',
      '        <div class="q26-mono-block">hidden_layer_weights</div>',
      '        <div class="chip chip-neutral text-xs">≈ W_hidden (model dependent)</div>',
      '      </div>',
      '      <div class="q26-step-summary">',
      '        <div class="q26-step-title">Final: ∂L/∂E</div>',
      '        <p class="small-caption panel-muted">Combine the gradients to update embeddings.</p>',
      '        <div class="q26-mono-block">(∂L/∂logits) × (∂logits/∂hidden) × (∂hidden/∂E)</div>',
      '        <div class="chip chip-warning text-xs">Magnitude: ' + gradientData.config.gradientMagnitude.toUpperCase() + '</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="panel panel-neutral-soft q26-section">',
      '    <h5 class="q26-section-title">Computed embedding gradients (first 8 dimensions)</h5>',
      '    <div class="q26-table-wrap">',
      '      <table class="q26-table">',
      '        <thead>',
      '          <tr>',
      '            <th scope="col">Dimension</th>',
      '            <th scope="col">Gradient value</th>',
      '            <th scope="col">Magnitude</th>',
      '            <th scope="col">Update direction</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody>' + rows + '</tbody>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderVisualization(targetWord, context, gradientData) {
    const contextWithWord = context.replace('[WORD]', targetWord);
    const maxGrad = Math.max.apply(null, gradientData.gradients.map(Math.abs).concat([0.0001]));

    const bars = gradientData.gradients.map((grad, index) => {
      const magnitude = Math.abs(grad);
      const percentage = Math.min(100, (magnitude / maxGrad) * 100);
      const fillClass = grad > 0
        ? 'q26-bar-fill q26-bar-fill--positive'
        : grad < 0
          ? 'q26-bar-fill q26-bar-fill--negative'
          : 'q26-bar-fill q26-bar-fill--neutral';
      const numberClass = grad > 0
        ? 'q26-bar-number q26-bar-number--positive'
        : grad < 0
          ? 'q26-bar-number q26-bar-number--negative'
          : 'q26-bar-number';

      return [
        '      <div class="q26-bar-row">',
        '        <span class="q26-bar-label">Dim ' + (index + 1) + '</span>',
        '        <div class="q26-bar-track">',
        '          <div class="' + fillClass + '" style="width: ' + percentage.toFixed(1) + '%"></div>',
        '        </div>',
        '        <span class="' + numberClass + '">' + grad.toFixed(3) + '</span>',
        '      </div>'
      ].join('');
    }).join('');

    return [
      '<div class="space-y-4">',
      '  <div class="panel panel-info q26-section">',
      '    <h5 class="q26-section-title">Gradient flow visualisation</h5>',
      '    <div class="q26-flow-grid">',
      '      <div class="q26-flow-card" data-tone="loss">',
      '        <div class="q26-flow-label">Loss</div>',
      '        <div class="q26-flow-metric">' + gradientData.loss.toFixed(2) + '</div>',
      '        <div class="small-caption">Cross-entropy</div>',
      '        <div class="q26-flow-hint">∂L/∂L = 1.0</div>',
      '      </div>',
      '      <div class="q26-flow-card" data-tone="output">',
      '        <div class="q26-flow-label">Output layer</div>',
      '        <div class="q26-flow-metric">Logits</div>',
      '        <div class="small-caption">Vocab sized</div>',
      '        <div class="q26-flow-hint">∂L/∂logits</div>',
      '      </div>',
      '      <div class="q26-flow-card" data-tone="hidden">',
      '        <div class="q26-flow-label">Hidden layer</div>',
      '        <div class="q26-flow-metric">h</div>',
      '        <div class="small-caption">768 dims</div>',
      '        <div class="q26-flow-hint">∂L/∂h</div>',
      '      </div>',
      '      <div class="q26-flow-card" data-tone="embedding">',
      '        <div class="q26-flow-label">Embeddings</div>',
      '        <div class="q26-flow-metric">E</div>',
      '        <div class="small-caption">&ldquo;' + targetWord + '&rdquo;</div>',
      '        <div class="q26-flow-hint">∂L/∂E</div>',
      '      </div>',
      '    </div>',
      '    <div class="q26-flow-note small-caption">Gradients travel backward: Loss ← Output ← Hidden ← Embeddings.</div>',
      '  </div>',
      '  <div class="panel panel-neutral-soft q26-section">',
      '    <h5 class="q26-section-title">Embedding gradient magnitudes</h5>',
      '    <div class="q26-bar-list">',
      bars,
      '    </div>',
      '    <div class="q26-bar-legend small-caption">',
      '      <span><span class="q26-legend-dot q26-legend-dot--positive"></span> Positive: increase values</span>',
      '      <span><span class="q26-legend-dot q26-legend-dot--negative"></span> Negative: decrease values</span>',
      '      <span><span class="q26-legend-dot q26-legend-dot--neutral"></span> Zero: no change</span>',
      '    </div>',
      '  </div>',
      '  <div class="panel panel-neutral-soft q26-section">',
      '    <h5 class="q26-section-title">Context snapshot</h5>',
      '    <p class="small-caption panel-muted">Current sentence: &ldquo;' + contextWithWord + '&rdquo;</p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderSemanticImpact(targetWord, context, gradientData) {
    const contextWithWord = context.replace('[WORD]', targetWord);
    const newConfidence = Math.min(0.95, gradientData.confidence + (1 - gradientData.confidence) * 0.1);

    const scenarios = {
      large: {
        title: 'Large gradients — major adjustment',
        description: 'The embedding shifts significantly to correct confident mistakes.',
        impact: 'High semantic change, fast learning'
      },
      medium: {
        title: 'Medium gradients — moderate adjustment',
        description: 'Embeddings adjust steadily as the model refines its understanding.',
        impact: 'Balanced semantic change'
      },
      small: {
        title: 'Small gradients — fine tuning',
        description: 'Embeddings make subtle refinements because predictions are already strong.',
        impact: 'Stable representations'
      },
      sparse: {
        title: 'Sparse gradients — irregular updates',
        description: 'Rare words update infrequently, but changes can be sizeable when they occur.',
        impact: 'Occasional but meaningful shifts'
      },
      regular: {
        title: 'Regular gradients — steady learning',
        description: 'Frequent words receive consistent updates, reinforcing reliable meanings.',
        impact: 'Predictable evolution'
      }
    };

    const scenario = scenarios[gradientData.config.gradientMagnitude] || scenarios.medium;

    return [
      '<div class="space-y-4">',
      '  <div class="panel panel-accent q26-section">',
      '    <h5 class="q26-section-title">Semantic impact analysis</h5>',
      '    <div class="q26-impact-grid">',
      '      <div class="q26-impact-card">',
      '        <h6 class="q26-impact-title">Before update</h6>',
      '        <ul class="q26-impact-list">',
      '          <li><strong>Context:</strong> &ldquo;' + contextWithWord + '&rdquo;</li>',
      '          <li><strong>Confidence:</strong> ' + (gradientData.confidence * 100).toFixed(1) + '%</li>',
      '          <li><strong>Status:</strong> ' + gradientData.config.name + '</li>',
      '        </ul>',
      '      </div>',
      '      <div class="q26-impact-arrow">',
      '        <span class="q26-impact-symbol">→</span>',
      '        <span class="small-caption">Gradient update (α = 0.001)</span>',
      '      </div>',
      '      <div class="q26-impact-card">',
      '        <h6 class="q26-impact-title">After update</h6>',
      '        <ul class="q26-impact-list">',
      '          <li><strong>Expected change:</strong> ' + gradientData.config.gradientMagnitude + ' adjustment</li>',
      '          <li><strong>New confidence:</strong> ' + (newConfidence * 100).toFixed(1) + '%</li>',
      '          <li><strong>Semantic shift:</strong> Improved context alignment</li>',
      '        </ul>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="panel panel-neutral-soft q26-section" data-tone="' + gradientData.config.gradientMagnitude + '">',
      '    <h5 class="q26-section-title">Learning dynamics</h5>',
      '    <div class="q26-learning-card">',
      '      <div class="q26-learning-title">' + scenario.title + '</div>',
      '      <p class="small-caption panel-muted">' + scenario.description + '</p>',
      '      <div class="chip chip-info text-xs">Impact: ' + scenario.impact + '</div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function updateExplanation(gradientData, mode) {
    if (!explanation) return;

    const config = gradientData.config;
    let modeDescription;
    let keyInsight;

    switch (mode) {
      case 'visualization':
        modeDescription = 'The visual view shows how error signals propagate backward across layers.';
        keyInsight = 'The path of the gradient reveals which stages contribute most to the update.';
        break;
      case 'semantic-impact':
        modeDescription = 'Semantic impact focuses on how gradient updates reshape word meaning.';
        keyInsight = 'Gradients guide embeddings toward representations that align with observed contexts.';
        break;
      default:
        modeDescription = 'Step-by-step traces the chain rule computation for the embedding update.';
        keyInsight = 'Each gradient component quantifies how much an embedding dimension should shift.';
        break;
    }

    let practicalImplication;
    switch (config.gradientMagnitude) {
      case 'large':
        practicalImplication = 'Large gradients indicate urgent corrections—common early in training or after confident mistakes.';
        break;
      case 'small':
        practicalImplication = 'Small gradients signal convergence: the model is close to the right answer and only needs refinement.';
        break;
      case 'sparse':
        practicalImplication = 'Sparse gradients reveal rarely seen words. Each update matters, so batching and accumulation help.';
        break;
      default:
        practicalImplication = 'Medium gradients capture steady progress: the model is learning but still has meaningful adjustments to make.';
        break;
    }

    explanation.innerHTML = [
      '<div class="space-y-3">',
      '  <p><strong>Analysis mode:</strong> ' + modeDescription + '</p>',
      '  <p><strong>Scenario insight:</strong> ' + config.description + '. The ' + config.gradientMagnitude + ' gradients drive ' + (config.gradientMagnitude === 'large' ? 'significant' : config.gradientMagnitude === 'small' ? 'minimal' : 'moderate') + ' changes to the "' + targetWordSelect.value + '" embedding.</p>',
      '  <p><strong>Key learning:</strong> ' + keyInsight + ' ' + practicalImplication + '</p>',
      '  <div class="bg-subtle border border-subtle rounded px-3 py-2 text-xs">',
      '    <strong>💡 Training insight:</strong> Embedding gradients are the primary mechanism by which language models learn word meanings. Repeated context exposure sculpts vectors so syntactic, semantic, and pragmatic properties align.',
      '  </div>',
      '</div>'
    ].join('');
  }

  const renderers = {
    'step-by-step': renderStepByStep,
    visualization: renderVisualization,
    'semantic-impact': renderSemanticImpact
  };

  const processAndDisplay = () => {
    const scenario = scenarioSelect.value;
    const targetWord = targetWordSelect.value;
    const context = contextSelect.value;
    const mode = getCurrentMode();

    updateModeVisuals();

    const gradientData = generateGradientData(scenario);
    const renderer = renderers[mode] || renderers['step-by-step'];
    output.innerHTML = renderer(targetWord, context, gradientData);

    if (legend) {
      const avgGradient = gradientData.gradients.reduce((sum, g) => sum + Math.abs(g), 0) / gradientData.gradients.length;
      legend.innerHTML = [
        'Target: &ldquo;' + targetWord + '&rdquo;',
        'Scenario: ' + gradientData.config.name,
        'Avg gradient: ' + avgGradient.toFixed(4),
        'Loss: ' + gradientData.loss.toFixed(3)
      ].join(' • ');
    }

    updateExplanation(gradientData, mode);

    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([output, legend, explanation]).catch(() => {});
    }
  };

  if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
      const example = examples[exampleIndex];
      scenarioSelect.value = example.scenario;
      targetWordSelect.value = example.targetWord;
      contextSelect.value = example.context;

      const modeRadio = document.querySelector('input[name="q26-mode"][value="' + example.mode + '"]');
      if (modeRadio) {
        modeRadio.checked = true;
      }

      processAndDisplay();

      exampleBtn.textContent = example.note;
      exampleBtn.title = 'Example ' + (exampleIndex + 1) + '/' + examples.length + ': ' + example.targetWord + ' in context';

      exampleIndex = (exampleIndex + 1) % examples.length;
    });
  }

  scenarioSelect.addEventListener('change', processAndDisplay);
  targetWordSelect.addEventListener('change', processAndDisplay);
  contextSelect.addEventListener('change', processAndDisplay);
  modeRadios.forEach((radio) => {
    radio.addEventListener('change', processAndDisplay);
  });

  updateModeVisuals();
  processAndDisplay();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question26Interactive = interactiveScript;
}
