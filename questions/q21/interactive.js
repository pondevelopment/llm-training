const interactiveScript = () => {
  const input = document.getElementById('q21-text-select');
  const output = document.getElementById('q21-output');
  const encodingRadios = document.querySelectorAll("input[name='q21-encoding']");
  const encodingIndicator = document.getElementById('q21-encoding-indicator');
  const legend = document.getElementById('q21-legend');
  const explanation = document.getElementById('q21-explanation');
  const answerRoot = document.getElementById('question-answer');
  const vizModeSelect = document.getElementById('q21-viz-mode');

  if (!input || !output) {
    console.error('Question 21 interactive: required DOM nodes are missing.');
    return;
  }

  const encodingTypes = {
    sinusoidal: {
      name: 'Sinusoidal encoding',
      description: 'Fixed mathematical patterns that create unique signatures for each position using sine and cosine functions.',
      accentClass: 'q21-encoding-card--success',
      chipClass: 'chip chip-success text-xs font-medium',
      color: 'var(--panel-success-border-strong)',
      generateEncoding: (position, dimension = 8) => {
        const encoding = [];
        for (let i = 0; i < dimension; i++) {
          const angle = position / Math.pow(10000, (2 * Math.floor(i / 2)) / dimension);
          encoding.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
        }
        return encoding;
      }
    },
    learned: {
      name: 'Learned embedding',
      description: 'Trainable position vectors that the model learns during training, optimised for the specific task.',
      accentClass: 'q21-encoding-card--accent',
      chipClass: 'chip chip-accent text-xs font-medium',
      color: 'var(--panel-accent-border-strong)',
      generateEncoding: (position, dimension = 8) => {
        const encoding = [];
        const seed = position * 42;
        for (let i = 0; i < dimension; i++) {
          const value = Math.sin(seed + i * 1.7) * 0.8 + Math.cos(seed * 0.3 + i) * 0.2;
          encoding.push(value);
        }
        return encoding;
      }
    },
    relative: {
      name: 'Relative encoding',
      description: 'Captures distance between positions rather than absolute locations, which is helpful for long contexts.',
      accentClass: 'q21-encoding-card--warning',
      chipClass: 'chip chip-warning text-xs font-medium',
      color: 'var(--panel-warning-border-strong)',
      generateEncoding: (position, dimension = 8, totalPositions = 5) => {
        const encoding = [];
        for (let i = 0; i < dimension; i++) {
          const center = Math.floor(totalPositions / 2);
          const distance = Math.abs(position - center);
          const value = Math.exp(-distance / 2) * Math.sin(i * Math.PI / 4 + distance);
          encoding.push(value);
        }
        return encoding;
      }
    }
  };

  const POSITIVE_FILL = 'var(--q21-positive-fill)';
  const NEGATIVE_FILL = 'var(--q21-negative-fill)';
  const BASELINE_COLOR = 'var(--q21-baseline)';
  const ZERO_BACKGROUND = 'var(--q21-zero-fill)';

  const defaultIndicatorClass = 'chip chip-neutral text-xs font-medium';

  const getCurrentEncoding = () => {
    const selectedRadio = document.querySelector("input[name='q21-encoding']:checked");
    return selectedRadio ? selectedRadio.value : 'sinusoidal';
  };

  const tokenizeText = (text) => text.trim().split(/\s+/).filter((token) => token.length > 0);

  const normalizeEncoding = (encoding) => {
    const max = Math.max(...encoding.map((value) => Math.abs(value)));
    return encoding.map((value) => value / (max || 1));
  };

  const heatBackground = (value) => {
    if (value === 0) {
      return ZERO_BACKGROUND;
    }
    const intensity = Math.min(100, Math.round(Math.abs(value) * 80));
    if (value > 0) {
      return 'color-mix(in srgb, ' + POSITIVE_FILL + ' ' + intensity + '%, transparent)';
    }
    return 'color-mix(in srgb, ' + NEGATIVE_FILL + ' ' + intensity + '%, transparent)';
  };

  const updateEncodingVisuals = () => {
    const selected = document.querySelector("input[name='q21-encoding']:checked");

    document.querySelectorAll('.q21-encoding-card').forEach((card) => {
      const radio = card.querySelector("input[name='q21-encoding']");
      const isActive = radio ? radio.checked : false;
      card.classList.toggle('q21-encoding-card--active', isActive);
      card.setAttribute('data-active', isActive ? 'true' : 'false');
      card.classList.remove('q21-encoding-card--success', 'q21-encoding-card--accent', 'q21-encoding-card--warning');
      if (isActive) {
        const accentClass = encodingTypes[radio.value] && encodingTypes[radio.value].accentClass;
        if (accentClass) {
          card.classList.add(accentClass);
        }
      }
    });

    if (encodingIndicator) {
      const encodingKey = selected ? selected.value : null;
      encodingIndicator.textContent = encodingKey && encodingTypes[encodingKey] ? encodingTypes[encodingKey].name : '';
      const chipClass = encodingKey && encodingTypes[encodingKey] ? encodingTypes[encodingKey].chipClass : null;
      encodingIndicator.className = chipClass || defaultIndicatorClass;
    }
  };

  const createBarVisualization = (tokens, encodingType) => {
    const container = document.createElement('div');
    container.className = 'space-y-4';

    const tokenDisplay = document.createElement('div');
    tokenDisplay.className = 'space-y-3';

    tokens.forEach((token, position) => {
      const encoding = encodingTypes[encodingType].generateEncoding(position, 8, tokens.length);
      const normalizedEncoding = normalizeEncoding(encoding);

      const tokenCard = document.createElement('div');
      tokenCard.className = 'panel panel-neutral-soft p-3 space-y-3';

      const header = document.createElement('div');
      header.className = 'flex flex-wrap items-center justify-between gap-2 text-sm';
      header.innerHTML =
        "<div class='flex items-center gap-2'>" +
          "<span class='font-medium text-heading'>\"" + token + "\"</span>" +
          "<span class='chip chip-info text-xs'>Position " + position + "</span>" +
        "</div>" +
        "<span class='small-caption text-muted'>8D encoding</span>";

      const encodingViz = document.createElement('div');
      encodingViz.className = 'flex gap-2';

      normalizedEncoding.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'flex-1 relative bg-card rounded overflow-hidden';
        bar.style.height = '40px';

        const baseline = document.createElement('div');
        baseline.className = 'absolute left-0 right-0';
        baseline.style.top = '50%';
        baseline.style.borderTop = '1px solid ' + BASELINE_COLOR;
        bar.appendChild(baseline);

        const fill = document.createElement('div');
        const magnitude = Math.abs(value);
        const halfHeightPct = magnitude * 50;
        fill.style.background = value >= 0 ? POSITIVE_FILL : NEGATIVE_FILL;
        fill.style.opacity = String(Math.max(0.25, magnitude));
        fill.style.height = String(halfHeightPct) + '%';
        fill.className = 'absolute left-0 right-0 transition-all duration-300';
        if (value >= 0) {
          fill.style.bottom = '50%';
          fill.style.borderTopLeftRadius = '4px';
          fill.style.borderTopRightRadius = '4px';
        } else {
          fill.style.top = '0';
          fill.style.bottom = '50%';
          fill.style.transform = 'translateY(' + (50 - halfHeightPct) + '%)';
          fill.style.borderBottomLeftRadius = '4px';
          fill.style.borderBottomRightRadius = '4px';
        }
        fill.title = 'Dim ' + index + ': ' + encoding[index].toFixed(3);
        bar.appendChild(fill);
        encodingViz.appendChild(bar);
      });

      const rawValues = document.createElement('div');
      rawValues.className = 'panel panel-neutral-soft text-xs font-mono p-2';
      const formattedValues = encoding.map((v) => v.toFixed(2)).join(', ');
      rawValues.textContent = '[' + formattedValues + ']';

      tokenCard.appendChild(header);
      tokenCard.appendChild(encodingViz);
      tokenCard.appendChild(rawValues);
      tokenDisplay.appendChild(tokenCard);
    });

    container.appendChild(tokenDisplay);

    const analysis = document.createElement('div');
    analysis.className = 'panel panel-info panel-emphasis p-3 mt-4 text-sm';

    let analysisText = '';
    if (encodingType === 'sinusoidal') {
      analysisText = '<strong>Sinusoidal pattern:</strong> Each position has a unique mathematical signature, so the model can interpolate positions it has never seen during training.';
    } else if (encodingType === 'learned') {
      analysisText = '<strong>Learned pattern:</strong> During training the model discovers which positional cues help most, producing embeddings tuned to the task distribution.';
    } else if (encodingType === 'relative') {
      analysisText = '<strong>Relative pattern:</strong> Encodings emphasise distance from nearby tokens, which keeps long sequences coherent when absolute position matters less than relative order.';
    }

    analysis.innerHTML = "<div class='text-body'>" + analysisText + '</div>';
    container.appendChild(analysis);

    return container;
  };

  const createHeatmapVisualization = (tokens, encodingType) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'overflow-x-auto';

    const grid = document.createElement('div');
    grid.className = 'inline-grid gap-px rounded border border-subtle bg-subtle';
    grid.style.gridTemplateColumns = '200px repeat(8, 28px)';

    const headerToken = document.createElement('div');
    headerToken.className = 'text-xs font-medium text-muted px-2 py-1 bg-card';
    headerToken.textContent = 'Token / Dim';
    grid.appendChild(headerToken);

    for (let d = 0; d < 8; d++) {
      const headerCell = document.createElement('div');
      headerCell.className = 'text-[10px] text-center text-muted px-1 py-1 bg-card';
      headerCell.textContent = String(d);
      grid.appendChild(headerCell);
    }

    tokens.forEach((token, position) => {
      const encoding = encodingTypes[encodingType].generateEncoding(position, 8, tokens.length);
      const norm = normalizeEncoding(encoding);

      const label = document.createElement('div');
      label.className = 'text-xs panel panel-neutral-soft px-2 py-1 truncate max-w-[200px]';
      label.textContent = '"' + token + '" (pos ' + position + ')';
      grid.appendChild(label);

      norm.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'w-7 h-7 rounded';
        cell.style.background = heatBackground(value);
        cell.title = 'Dim ' + index + ': ' + encoding[index].toFixed(3);
        grid.appendChild(cell);
      });
    });

    wrapper.appendChild(grid);
    return wrapper;
  };

  const createWaveVisualization = (tokens, encodingType) => {
    const container = document.createElement('div');
    container.className = 'space-y-3';

    tokens.forEach((token, position) => {
      const encoding = encodingTypes[encodingType].generateEncoding(position, 8, tokens.length);
      const norm = normalizeEncoding(encoding);

      const card = document.createElement('div');
      card.className = 'panel panel-neutral-soft p-3 space-y-3';

      const header = document.createElement('div');
      header.className = 'flex flex-wrap items-center justify-between gap-2';
      header.innerHTML =
        "<div class='flex items-center gap-2'>" +
          "<span class='font-medium text-heading'>\"" + token + "\"</span>" +
          "<span class='chip chip-info text-xs'>Position " + position + "</span>" +
        "</div>" +
        "<span class='small-caption text-muted'>8D wave</span>";

      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 320 80');
      svg.setAttribute('class', 'w-full h-20');

      const zero = document.createElementNS(svgNS, 'line');
      zero.setAttribute('x1', '0');
      zero.setAttribute('x2', '320');
      zero.setAttribute('y1', '40');
      zero.setAttribute('y2', '40');
      zero.setAttribute('stroke', BASELINE_COLOR);
      svg.appendChild(zero);

      const points = norm.map((value, index) => {
        const x = 20 + index * ((320 - 40) / 7);
        const y = 40 - value * 35;
        return x + ',' + y;
      }).join(' ');

      const poly = document.createElementNS(svgNS, 'polyline');
      poly.setAttribute('points', points);
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', encodingTypes[encodingType].color);
      poly.setAttribute('stroke-width', '2');
      svg.appendChild(poly);

      norm.forEach((value, index) => {
        const cx = 20 + index * ((320 - 40) / 7);
        const cy = 40 - value * 35;
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', String(cx));
        circle.setAttribute('cy', String(cy));
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', 'var(--color-heading)');
        circle.setAttribute('opacity', '0.6');
        circle.setAttribute('data-dimension', String(index));
        circle.setAttribute('title', 'Dim ' + index + ': ' + encoding[index].toFixed(3));
        svg.appendChild(circle);
      });

      card.appendChild(header);
      card.appendChild(svg);
      container.appendChild(card);
    });

    return container;
  };

  const createStatistics = (tokens, encodingType) => {
    const stats = document.createElement('div');
    stats.className = 'panel panel-neutral-soft grid grid-cols-2 md:grid-cols-4 gap-4 p-3 text-sm text-center';

    const maxLength = encodingType === 'sinusoidal' ? '&infin;' : String(tokens.length);
    const trainable = encodingType === 'learned' ? 'Yes' : 'No';

    stats.innerHTML =
      "<div class='space-y-1'>" +
        "<div class='text-2xl font-bold text-success'>" + tokens.length + "</div>" +
        "<div class='small-caption text-muted'>Tokens</div>" +
      "</div>" +
      "<div class='space-y-1'>" +
        "<div class='text-2xl font-bold text-info'>8</div>" +
        "<div class='small-caption text-muted'>Dimensions</div>" +
      "</div>" +
      "<div class='space-y-1'>" +
        "<div class='text-2xl font-bold text-warning'>" + maxLength + "</div>" +
        "<div class='small-caption text-muted'>Max length</div>" +
      "</div>" +
      "<div class='space-y-1'>" +
        "<div class='text-2xl font-bold text-accent'>" + trainable + "</div>" +
        "<div class='small-caption text-muted'>Trainable</div>" +
      "</div>";

    return stats;
  };

  const typesetMath = () => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      const scope = answerRoot || document.body;
      setTimeout(() => {
        window.MathJax.typesetPromise([scope]).catch(() => {});
      }, 0);
    }
  };

  const renderLegend = (mode) => {
    if (!legend) return;
    legend.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-wrap items-center gap-3 text-muted';

    if (mode === 'heatmap') {
      wrapper.innerHTML =
        "<span class='chip q21-chip-positive text-xs'>Positive</span>" +
        "<span class='chip q21-chip-neutral text-xs'>&asymp; 0</span>" +
        "<span class='chip q21-chip-negative text-xs'>Negative</span>" +
        "<span class='small-caption text-muted'>Hover cells for exact values.</span>";
    } else if (mode === 'wave') {
      wrapper.innerHTML =
        "<span class='small-caption text-muted'>Line connects normalised dimensions; the horizontal axis marks zero.</span>";
    } else {
      wrapper.innerHTML =
        "<span class='chip q21-chip-positive text-xs'>Positive</span>" +
        "<span class='chip q21-chip-negative text-xs'>Negative</span>" +
        "<span class='small-caption text-muted'>Bars grow away from the centre baseline.</span>";
    }

    legend.appendChild(wrapper);
  };

  const updateExplanation = (encodingType) => {
    if (!explanation) return;

    const summaries = {
      sinusoidal: "<strong>Sinusoidal encoding</strong> uses sine and cosine functions to create unique patterns for every position.<br>&bull; <strong>Pros:</strong> No training needed, extrapolates beyond training length, mathematically simple.<br>&bull; <strong>Cons:</strong> Fixed pattern may not capture task-specific order nuances.<br>&bull; <strong>Best for:</strong> General-purpose models and very long sequences.",
      learned: "<strong>Learned embeddings</strong> treat positions like vocabulary tokens with trainable vectors.<br>&bull; <strong>Pros:</strong> Task-optimised, can capture irregular positional signals.<br>&bull; <strong>Cons:</strong> Limited to training context window, adds parameters to learn.<br>&bull; <strong>Best for:</strong> Domains with distinctive ordering patterns.",
      relative: "<strong>Relative encoding</strong> focuses on the distance between positions instead of absolute indices.<br>&bull; <strong>Pros:</strong> Handles long documents gracefully and adapts to shifting spans.<br>&bull; <strong>Cons:</strong> Implementation is more complex, absolute anchors can be weaker.<br>&bull; <strong>Best for:</strong> Dialogue, code, or tasks where relative order drives meaning."
    };

    explanation.innerHTML = summaries[encodingType] || '';
  };

  const processAndDisplay = () => {
    const text = input.value.trim();
    const encodingType = getCurrentEncoding();
    const vizMode = vizModeSelect ? vizModeSelect.value : 'bars';

    output.innerHTML = '';
    if (legend) {
      legend.innerHTML = '';
    }

    updateEncodingVisuals();

    if (!text) {
      output.innerHTML = "<div class='panel panel-neutral-soft text-center py-8 text-muted'>Enter some text to see positional encodings.</div>";
      return;
    }

    const tokens = tokenizeText(text);

    if (tokens.length === 0) {
      output.innerHTML = "<div class='panel panel-neutral-soft text-center py-8 text-muted'>No valid tokens found. Try a different sentence.</div>";
      return;
    }

    let visualization;
    if (vizMode === 'heatmap') {
      visualization = createHeatmapVisualization(tokens, encodingType);
    } else if (vizMode === 'wave') {
      visualization = createWaveVisualization(tokens, encodingType);
    } else {
      visualization = createBarVisualization(tokens, encodingType);
    }
    output.appendChild(visualization);

    const statistics = createStatistics(tokens, encodingType);
    output.appendChild(statistics);

    renderLegend(vizMode);
    updateExplanation(encodingType);
    typesetMath();
  };

  input.addEventListener('change', processAndDisplay);
  encodingRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateEncodingVisuals();
      processAndDisplay();
    });
  });
  if (vizModeSelect) {
    vizModeSelect.addEventListener('change', processAndDisplay);
  }

  updateEncodingVisuals();
  processAndDisplay();
  typesetMath();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question21Interactive = interactiveScript;
}
