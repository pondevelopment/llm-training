const interactiveScript = () => {
  const exampleSelect = document.getElementById('q17-example-select');
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

  const output = document.getElementById('q17-output');
  const legend = document.getElementById('q17-legend');
  const explanation = document.getElementById('q17-explanation');
  const metrics = document.getElementById('q17-metrics');
  const indicator = document.getElementById('q17-architecture-indicator');
  const strategyCards = Array.from(document.querySelectorAll('#q17-architecture-options .question-strategy'));

  if (!exampleSelect || !output || !legend || !explanation || !metrics || !indicator) {
    return;
  }

  const examples = [
    { label: 'Pangram (short)', text: 'The quick brown fox jumps over the lazy dog' },
    { label: 'Long sentence (dependencies)', text: 'Machine translation has revolutionized how we communicate across language barriers in the modern digital world' },
    { label: 'Story fragment', text: 'When I was young, my grandmother told me stories that shaped my worldview' },
    { label: 'Research phrase', text: 'The research paper demonstrates significant improvements in neural network architectures' },
    { label: 'Project outcome', text: 'Despite the challenges, the team successfully completed the project on time' }
  ];

  examples.forEach((example, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = example.label;
    exampleSelect.append(option);
  });
  exampleSelect.value = '0';

  const architectureConfig = {
    seq2seq: {
      name: 'Traditional Seq2Seq',
      chipClass: 'chip-warning'
    },
    transformer: {
      name: 'Transformer',
      chipClass: 'chip-success'
    },
    comparison: {
      name: 'Side-by-side comparison',
      chipClass: 'chip-info'
    }
  };

  const architectureLegend = {
    seq2seq: [
      { label: 'Hidden state chain', tone: 'warning' },
      { label: 'Single context vector', tone: 'neutral' },
      { label: 'Step-by-step decoder', tone: 'accent' }
    ],
    transformer: [
      { label: 'Self-attention weights', tone: 'success' },
      { label: 'Feed-forward mixing', tone: 'info' },
      { label: 'Positional encoding', tone: 'accent' }
    ],
    comparison: [
      { label: 'Sequential vs parallel', tone: 'info' },
      { label: 'Context retention', tone: 'success' },
      { label: 'Compute cost', tone: 'warning' }
    ]
  };

  const toneToChip = {
    warning: 'chip-warning',
    success: 'chip-success',
    info: 'chip-info',
    accent: 'chip-accent',
    neutral: 'chip-neutral'
  };

  const escapeHtml = (value = '') => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const normalise = (values) => {
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    return values.map((value) => value / total);
  };

  const updateStrategyHighlight = () => {
    strategyCards.forEach((card) => {
      const input = card.querySelector('input[name="q17-architecture"]');
      if (!input) {
        return;
      }
      if (input.checked) {
        card.classList.add('question-strategy-active');
        card.setAttribute('data-active', 'true');
      } else {
        card.classList.remove('question-strategy-active');
        card.removeAttribute('data-active');
      }
    });
  };

  const buildSeq2SeqVisualization = (context) => {
    const { displayTokens, truncated, totalTokens } = context;
    const tokenFlow = displayTokens
      .map((token, index) => `
        <div class="flex items-center gap-1">
          <span class="chip chip-warning text-xs font-mono">${escapeHtml(token)}</span>
          <span class="small-caption text-muted">h<sub>${index + 1}</sub></span>
          ${index < displayTokens.length - 1 ? '<span class="text-muted text-xs">&rarr;</span>' : ''}
        </div>
      `)
      .join('');

    const truncatedChip = truncated
      ? `<span class="chip chip-neutral text-xs">+${totalTokens - displayTokens.length} more tokens</span>`
      : '';

    return `
      <div class="panel panel-warning panel-emphasis p-3 space-y-3">
        <h5 class="font-medium text-heading">&#128229; Encoder hidden-state flow</h5>
        <p class="small-caption text-muted">Each token updates the hidden state sequentially: h<sub>0</sub> &rarr; h<sub>1</sub> &rarr; &hellip; &rarr; h<sub>${totalTokens}</sub>.</p>
        <div class="flex flex-wrap items-center gap-2">${tokenFlow}</div>
        ${truncatedChip ? `<div class="flex flex-wrap gap-2">${truncatedChip}</div>` : ''}
        <div class="panel panel-neutral-soft p-3 text-xs rounded-md">
          <strong>Context bottleneck:</strong> all meaning is compressed into <code>h<sub>${totalTokens}</sub></code> before decoding.
        </div>
      </div>
      <div class="panel panel-warning p-3 space-y-3">
        <h5 class="font-medium text-heading">&#128228; Decoder steps</h5>
        <p class="small-caption text-muted">Outputs reuse the same context vector, so long-distance memories can fade.</p>
        <div class="flex flex-wrap items-center gap-2">
          <span class="chip chip-neutral text-xs font-mono">context h<sub>${totalTokens}</sub></span>
          <span class="text-muted text-xs">&rarr;</span>
          <span class="chip chip-warning text-xs font-mono">Output&nbsp;1</span>
          <span class="text-muted text-xs">&rarr;</span>
          <span class="chip chip-warning text-xs font-mono">Output&nbsp;2</span>
          <span class="text-muted text-xs">&rarr;</span>
          <span class="text-muted text-xs">&hellip;</span>
        </div>
      </div>
    `;
  };

  const computeAttentionRows = (tokens) => {
    return tokens.map((_, rowIndex) => {
      const weights = tokens.map((__, colIndex) => {
        const distance = Math.abs(rowIndex - colIndex);
        return 1 / (1 + distance);
      });
      return normalise(weights);
    });
  };

  const buildTransformerVisualization = (context) => {
    const { displayTokens, truncated, totalTokens } = context;
    const attentionRows = computeAttentionRows(displayTokens);

    const attentionLines = displayTokens
      .map((token, rowIndex) => {
        const row = attentionRows[rowIndex];
        const topTargets = row
          .map((value, index) => ({ value, index }))
          .sort((a, b) => b.value - a.value)
          .slice(0, Math.min(3, displayTokens.length))
          .map(({ value, index }) => `
            <span class="chip chip-neutral text-xs font-mono">${escapeHtml(displayTokens[index])} &middot; ${(value * 100).toFixed(0)}%</span>
          `)
          .join('');

        return `
          <div class="flex flex-wrap items-center gap-2">
            <span class="chip chip-success text-xs font-mono">${escapeHtml(token)}</span>
            <span class="text-muted text-xs">attends to</span>
            ${topTargets || '<span class="text-muted text-xs">no strong links</span>'}
          </div>
        `;
      })
      .join('');

    const positionalSamples = displayTokens.slice(0, 3)
      .map((token, index) => {
        const base = Math.max(1, totalTokens);
        const sinVal = Math.sin(index / base).toFixed(2);
        const cosVal = Math.cos(index / base).toFixed(2);
        return `
          <div class="flex items-center justify-between text-xs font-mono">
            <span>${escapeHtml(token)}</span>
            <span>sin=${sinVal}, cos=${cosVal}</span>
          </div>
        `;
      })
      .join('');

    const truncatedChip = truncated
      ? `<span class="chip chip-neutral text-xs">+${totalTokens - displayTokens.length} more tokens</span>`
      : '';

    return `
      <div class="panel panel-success panel-emphasis p-3 space-y-3">
        <h5 class="font-medium text-heading">&#128200; Self-attention snapshot</h5>
        <p class="small-caption text-muted">Every token can reference any other token in one parallel step.</p>
        <div class="space-y-2">${attentionLines}</div>
        ${truncatedChip ? `<div class="flex flex-wrap gap-2">${truncatedChip}</div>` : ''}
      </div>
      <div class="panel panel-neutral p-3 space-y-3">
        <h5 class="font-medium text-heading">&#128205; Positional signals</h5>
        <p class="small-caption text-muted">Sine and cosine patterns encode order so self-attention remains position aware.</p>
        <div class="panel panel-neutral-soft p-3 space-y-1 rounded-md">${positionalSamples}</div>
      </div>
    `;
  };

  const buildComparisonVisualization = (context) => {
    const { displayTokens, truncated, totalTokens } = context;
    const seqSteps = displayTokens
      .map((token, index) => `
        <li class="flex items-center gap-2">
          <span class="chip chip-warning text-xs font-mono">${escapeHtml(token)}</span>
          <span class="small-caption text-muted">h<sub>${index + 1}</sub></span>
        </li>
      `)
      .join('');

    const transformerSteps = displayTokens
      .map((token) => `
        <li class="flex items-center gap-2">
          <span class="chip chip-success text-xs font-mono">${escapeHtml(token)}</span>
          <span class="small-caption text-muted">attends across full context</span>
        </li>
      `)
      .join('');

    const truncatedChip = truncated
      ? `<span class="chip chip-neutral text-xs">+${totalTokens - displayTokens.length} more tokens</span>`
      : '';

    return `
      <div class="grid md:grid-cols-2 gap-3">
        <div class="panel panel-warning p-3 space-y-2">
          <h5 class="font-medium text-heading">Seq2Seq pipeline</h5>
          <ul class="space-y-1 text-xs">${seqSteps}</ul>
        </div>
        <div class="panel panel-success p-3 space-y-2">
          <h5 class="font-medium text-heading">Transformer pipeline</h5>
          <ul class="space-y-1 text-xs">${transformerSteps}</ul>
        </div>
      </div>
      ${truncatedChip ? `<div class="flex flex-wrap gap-2 mt-2">${truncatedChip}</div>` : ''}
      <div class="panel panel-accent p-3 text-xs">
        Transformers trade quadratic attention cost for a single parallel pass that keeps every token reachable during decoding.
      </div>
    `;
  };

  const renderVisualization = (architecture, context) => {
    if (architecture === 'seq2seq') {
      output.innerHTML = buildSeq2SeqVisualization(context);
    } else if (architecture === 'transformer') {
      output.innerHTML = buildTransformerVisualization(context);
    } else {
      output.innerHTML = buildComparisonVisualization(context);
    }
  };

  const renderLegend = (architecture) => {
    const legendItems = architectureLegend[architecture] || [];
    legend.className = 'flex flex-wrap gap-2 text-xs';
    legend.innerHTML = legendItems
      .map((item) => `<span class="chip ${toneToChip[item.tone] || 'chip-neutral'}">${item.label}</span>`)
      .join('');
  };

  const renderMetrics = (architecture, context) => {
    const tokenCount = Math.max(1, context.totalTokens);
    const seq2seqComplexity = `${tokenCount} &times; d`;
    const transformerComplexity = `${tokenCount}&sup2; &times; d`;

    const comparisonGrid = `
      <div class="grid md:grid-cols-2 gap-3">
        <div class="panel panel-warning p-3 space-y-1">
          <div class="small-caption text-muted">Seq2Seq</div>
          <div class="text-lg font-semibold text-heading">Parallel rounds: ${tokenCount}</div>
          <p class="small-caption text-muted">Compute: O(${seq2seqComplexity})</p>
          <p class="small-caption text-muted">Memory: O(${seq2seqComplexity})</p>
        </div>
        <div class="panel panel-success p-3 space-y-1">
          <div class="small-caption text-muted">Transformer</div>
          <div class="text-lg font-semibold text-heading">Parallel rounds: 1</div>
          <p class="small-caption text-muted">Compute: O(${transformerComplexity})</p>
          <p class="small-caption text-muted">Memory: O(${transformerComplexity})</p>
        </div>
      </div>
    `;

    let note = 'Compare the trade-offs between sequential bottlenecks and parallel attention.';
    if (architecture === 'seq2seq') {
      note = 'Sequential updates limit GPU utilisation and make long dependencies fragile.';
    } else if (architecture === 'transformer') {
      note = 'Quadratic attention cost buys full-context reasoning with massive parallelism.';
    }

    metrics.innerHTML = `${comparisonGrid}<p class="small-caption text-muted">${note}</p>`;
  };

  const renderExplanation = (architecture, length) => {
    const explanations = {
      seq2seq: `
        <div class="space-y-2">
          <strong class="text-heading">How RNN-based Seq2Seq works</strong>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Sequential constraint:</strong> Processes one token at a time, so your ${length}-token sequence needs ${length} passes.</li>
            <li><strong>Information decay:</strong> Early words fade as the hidden state is repeatedly overwritten.</li>
            <li><strong>Context bottleneck:</strong> Meaning is squeezed into a single vector before decoding.</li>
            <li><strong>Training cost:</strong> GPUs cannot parallelise the time axis, limiting throughput.</li>
          </ul>
          <p class="small-caption text-muted">Long sentences overload the context vector, so early facts are often forgotten.</p>
        </div>
      `,
      transformer: `
        <div class="space-y-2">
          <strong class="text-heading">Why transformers win</strong>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Parallel attention:</strong> All ${length} tokens interact in one layer step.</li>
            <li><strong>Direct references:</strong> Each position attends to any other token with learned weights.</li>
            <li><strong>Position aware:</strong> Sinusoidal or learned encodings inject order information.</li>
            <li><strong>Scales up:</strong> Works with very deep stacks and large batches on GPUs.</li>
          </ul>
          <p class="small-caption text-muted">Attention matrices grow with ${length}&sup2;, but the parallelism unlocks large model capacity.</p>
        </div>
      `,
      comparison: `
        <div class="space-y-2">
          <strong class="text-heading">Key trade-offs</strong>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>Context access:</strong> Seq2Seq relies on a single vector; transformers keep full context throughout.</li>
            <li><strong>Latency vs throughput:</strong> RNNs stream tokens, transformers amortise cost via parallel batches.</li>
            <li><strong>Compute profile:</strong> Transformers pay O(${length}&sup2;) per layer but align better with modern hardware.</li>
          </ul>
          <p class="small-caption text-muted">Pick Seq2Seq only when strict streaming or tight memory budgets dominate.</p>
        </div>
      `
    };

    explanation.innerHTML = explanations[architecture] || '';
  };

  const processInput = () => {
    const idx = parseInt(exampleSelect.value, 10) || 0;
    const text = examples[idx]?.text?.trim() || '';
    const selected = document.querySelector('input[name="q17-architecture"]:checked');

    if (!text || !selected) {
      return;
    }

    const architecture = selected.value;
    const config = architectureConfig[architecture];
    if (!config) {
      return;
    }

    const tokens = text.split(/\s+/).filter(Boolean);
    const displayTokens = tokens.slice(0, 12);
    const context = {
      tokens,
      displayTokens,
      totalTokens: tokens.length,
      truncated: tokens.length > displayTokens.length
    };

    indicator.textContent = config.name;
    indicator.className = `chip text-xs ${config.chipClass}`;

    updateStrategyHighlight();
    renderVisualization(architecture, context);
    renderLegend(architecture);
    renderMetrics(architecture, context);
    renderExplanation(architecture, tokens.length);

    window.MathJax?.typesetPromise?.([output]);
  };

  exampleSelect.addEventListener('change', processInput);
  document.querySelectorAll('input[name="q17-architecture"]').forEach((radio) => {
    radio.addEventListener('change', processInput);
  });

  updateStrategyHighlight();
  processInput();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question17Interactive = interactiveScript;
}