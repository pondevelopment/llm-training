const interactiveScript = () => {
  const functionTypeSelect = document.getElementById('q27-function-type');
  const inputDimSelect = document.getElementById('q27-input-dim');
  const outputDimSelect = document.getElementById('q27-output-dim');
  const modeRadios = document.querySelectorAll('input[name="q27-mode"]');
  const modeCards = document.querySelectorAll('.q27-mode-option');
  const output = document.getElementById('q27-output');
  const exampleBtn = document.getElementById('q27-example-btn');
  const modeIndicator = document.getElementById('q27-mode-indicator');
  const legend = document.getElementById('q27-legend');
  const explanation = document.getElementById('q27-explanation');
  const vectorControls = document.getElementById('q27-vector-controls');
  const applyButton = document.getElementById('q27-apply-play');
  const randomButton = document.getElementById('q27-apply-random');
  const applyOutput = document.getElementById('q27-apply-steps');
  const applyPreview = document.getElementById('q27-apply-preview');

  if (!functionTypeSelect || !inputDimSelect || !outputDimSelect || !output) {
    console.error('Required DOM elements not found for Question 27');
    if (output) {
      output.innerHTML = '<div class="panel panel-warning p-4 text-sm">Error: Could not initialize interactive components.</div>';
    }
    return;
  }

  const modeNames = {
    structure: 'Matrix structure',
    computation: 'Computation',
    backprop: 'Backprop flow'
  };

  const functionConfig = {
    linear: {
      name: 'Linear Transformation',
      description: 'Simple matrix multiplication with constant Jacobian',
      jacobianStructure: 'dense',
      complexity: 'O(mn)',
      sparsity: 0,
      properties: ['Constant Jacobian', 'Dense matrix', 'Straightforward computation']
    },
    softmax: {
      name: 'Softmax Function',
      description: 'Probability distribution with complex interdependencies',
      jacobianStructure: 'dense',
      complexity: 'O(n²)',
      sparsity: 0,
      properties: ['Non-diagonal dependencies', 'Sum constraint', 'Probability outputs']
    },
    attention: {
      name: 'Attention Mechanism',
      description: 'Complex function with query-key-value dependencies',
      jacobianStructure: 'block-structured',
      complexity: 'O(d·seq²)',
      sparsity: 0.3,
      properties: ['Sequence dependencies', 'Query-key similarity', 'Value transformations']
    },
    'layer-norm': {
      name: 'Layer Normalization',
      description: 'Normalization with mean and variance dependencies',
      jacobianStructure: 'dense',
      complexity: 'O(n²)',
      sparsity: 0,
      properties: ['Mean dependencies', 'Variance normalization', 'Scale/shift parameters']
    },
    'feed-forward': {
      name: 'Feed-Forward Network',
      description: 'Dense layers with ReLU activations',
      jacobianStructure: 'sparse',
      complexity: 'O(mn)',
      sparsity: 0.5,
      properties: ['ReLU sparsity', 'Weight matrices', 'Non-linear activations']
    }
  };

  const examples = [
    { functionType: 'attention', inputDim: '4', outputDim: '4', mode: 'structure', note: 'Attention structure' },
    { functionType: 'softmax', inputDim: '3', outputDim: '3', mode: 'computation', note: 'Softmax math' },
    { functionType: 'linear', inputDim: '3', outputDim: '4', mode: 'backprop', note: 'Linear backprop' },
    { functionType: 'feed-forward', inputDim: '4', outputDim: '3', mode: 'structure', note: 'FFN sparsity' }
  ];
  let exampleIndex = 0;
  let inputVector = [];
  let currentMatrix = [];
  let animationTimers = [];

  function calculateSparsity(matrix) {
    let zeros = 0;
    let total = 0;
    matrix.forEach((row) => {
      row.forEach((val) => {
        if (Math.abs(val) < 0.01) zeros += 1;
        total += 1;
      });
    });
    return total === 0 ? 0 : zeros / total;
  }

  function calculateFrobeniusNorm(matrix) {
    let sum = 0;
    matrix.forEach((row) => {
      row.forEach((val) => {
        sum += val * val;
    });
    });
    return Math.sqrt(sum);
  }

  function ensureInputVector(size) {
    if (size <= 0) {
      inputVector = [];
      return;
    }
    if (inputVector.length !== size) {
      inputVector = Array.from({ length: size }, (_, index) => (index === 0 ? 1 : 0));
    }
  }

  function renderVectorControls() {
    if (!vectorControls) return;
    vectorControls.innerHTML = '';
    if (!inputVector.length) {
      return;
    }
    inputVector.forEach((value, index) => {
      const wrapper = document.createElement('label');
      wrapper.className = 'flex flex-col gap-1 text-xs';
      wrapper.style.minWidth = '4.5rem';
      wrapper.innerHTML = `
        <span class="text-xs uppercase tracking-wide text-muted">x${index + 1}</span>
        <input type="number" step="0.1" min="-2" max="2" value="${value.toFixed(2)}" data-index="${index}" class="w-20 rounded-md border border-subtle bg-card px-2 py-1 text-sm" />
      `;
      const inputEl = wrapper.querySelector('input');
      inputEl.addEventListener('input', (event) => {
        const idx = Number(event.target.dataset.index);
        const parsed = parseFloat(event.target.value);
        inputVector[idx] = Number.isFinite(parsed) ? parsed : 0;
        stopAnimation();
        updateApplyHint();
      });
      vectorControls.appendChild(wrapper);
    });
  }

  function multiplyMatrixVector(matrix, vector) {
    if (!matrix.length || vector.length !== (matrix[0]?.length || 0)) {
      return [];
    }
    return matrix.map((row) => row.reduce((sum, val, idx) => sum + val * vector[idx], 0));
  }

  function updateApplyHint() {
    if (!applyOutput) return;
    if (applyButton) {
      applyButton.disabled = !currentMatrix.length || !inputVector.length;
    }
    if (randomButton) {
      randomButton.disabled = !inputVector.length;
    }
    if (!currentMatrix.length || !inputVector.length) {
      applyOutput.innerHTML = '';
      if (applyPreview) {
        applyPreview.innerHTML = '<span class="small-caption panel-muted">Choose dimensions and press “Animate J · x” to explore how inputs map to outputs.</span>';
      }
      return;
    }
    const preview = multiplyMatrixVector(currentMatrix, inputVector);
    const vectorLabel = inputVector.map((v, i) => `x${i + 1}=${v.toFixed(2)}`).join(', ');
    const outputLabel = preview.map((v, i) => `f${i + 1}=${v.toFixed(2)}`).join(', ');
    if (applyPreview) {
      applyPreview.innerHTML = `<span class="small-caption panel-muted">Current: ${vectorLabel}. Preview J · x ≈ ${outputLabel}. Press “Animate” to watch the breakdown.</span>`;
    }
  }

  function clearHighlights() {
    const grid = document.getElementById('q27-matrix-grid');
    if (!grid) return;
    grid.querySelectorAll('[data-highlight="true"]').forEach((el) => {
      const originalTransform = el.getAttribute('data-original-transform') || '';
      const originalShadow = el.getAttribute('data-original-shadow') || '';
      el.style.transform = originalTransform;
      el.style.boxShadow = originalShadow;
      el.removeAttribute('data-highlight');
    });
  }

  function highlightRow(rowIndex) {
    clearHighlights();
    if (rowIndex === null || rowIndex === undefined) return;
    const grid = document.getElementById('q27-matrix-grid');
    if (!grid) return;
    const rowCells = grid.querySelectorAll(`[data-row="${rowIndex}"]`);
    const rowHeader = grid.querySelector(`[data-row-header="${rowIndex}"]`);
    [...rowCells, rowHeader].forEach((el) => {
      if (!el) return;
      if (!el.hasAttribute('data-original-transform')) {
        el.setAttribute('data-original-transform', el.style.transform || '');
      }
      if (!el.hasAttribute('data-original-shadow')) {
        el.setAttribute('data-original-shadow', el.style.boxShadow || '');
      }
      el.style.transform = 'scale(1.05)';
      el.style.boxShadow = '0 0 0 2px rgba(56, 189, 248, 0.45)';
      el.setAttribute('data-highlight', 'true');
    });
  }

  function stopAnimation() {
    animationTimers.forEach((timer) => clearTimeout(timer));
    animationTimers = [];
    clearHighlights();
  }

  function runApplyAnimation() {
    if (!currentMatrix.length || !inputVector.length || !applyOutput) {
      return;
    }
    stopAnimation();
    applyOutput.innerHTML = '';

    const outputs = [];
    const stepDelay = 650;

    currentMatrix.forEach((row, rowIndex) => {
      const timer = setTimeout(() => {
        highlightRow(rowIndex);
        const contributions = row.map((val, colIndex) => ({
          colIndex,
          val,
          input: inputVector[colIndex],
          product: val * inputVector[colIndex]
        }));
        const sum = contributions.reduce((acc, entry) => acc + entry.product, 0);
        outputs[rowIndex] = sum;

        const stepCard = document.createElement('div');
        stepCard.className = 'panel panel-neutral-soft p-2 space-y-1';
        const heading = document.createElement('div');
        heading.className = 'flex items-center justify-between text-xs uppercase tracking-wide text-muted';
        heading.innerHTML = `<span>f${rowIndex + 1} contribution</span><span>${sum.toFixed(3)}</span>`;
        stepCard.appendChild(heading);

        contributions.forEach((entry) => {
          const line = document.createElement('div');
          line.className = 'flex items-center justify-between text-xs';
          line.innerHTML = `<span>x${entry.colIndex + 1} · ${entry.val.toFixed(2)}</span><span>${entry.input.toFixed(2)} → ${(entry.product).toFixed(3)}</span>`;
          stepCard.appendChild(line);
        });

        applyOutput.appendChild(stepCard);

        if (rowIndex === currentMatrix.length - 1) {
          const finalCard = document.createElement('div');
          finalCard.className = 'panel panel-info panel-emphasis p-3 space-y-1';
          finalCard.innerHTML = `
            <div class="text-xs uppercase tracking-wide">Resulting output vector</div>
            <div class="text-sm font-semibold">(${outputs.map((v) => v.toFixed(3)).join(', ')})</div>
            <p class="small-caption panel-muted">Each value is the dot product of a row in J with your chosen x.</p>
          `;
          applyOutput.appendChild(finalCard);
          const finishTimer = setTimeout(() => highlightRow(null), 200);
          animationTimers.push(finishTimer);
        }
      }, stepDelay * rowIndex);
      animationTimers.push(timer);
    });
  }

  function generateJacobianData(functionType, inputDim, outputDim) {
    const m = parseInt(outputDim, 10);
    const n = parseInt(inputDim, 10);
    const config = functionConfig[functionType];
    const jacobian = [];

    for (let i = 0; i < m; i += 1) {
      const row = [];
      for (let j = 0; j < n; j += 1) {
        let value = 0;
        switch (functionType) {
          case 'linear':
            value = (Math.random() - 0.5) * 2;
            break;
          case 'softmax':
            if (i === j) {
              const sI = Math.random() * 0.8 + 0.1;
              value = sI * (1 - sI);
            } else {
              const sI = Math.random() * 0.3 + 0.1;
              const sJ = Math.random() * 0.3 + 0.1;
              value = -sI * sJ;
            }
            break;
          case 'attention':
            if (Math.random() > config.sparsity) {
              value = (Math.random() - 0.5) * 1.5;
            }
            break;
          case 'layer-norm':
            value = (Math.random() - 0.5) * 0.8;
            break;
          case 'feed-forward':
            if (Math.random() > config.sparsity) {
              value = Math.random() * 2;
            }
            break;
          default:
            value = (Math.random() - 0.5) * 1.2;
        }
        row.push(value);
      }
      jacobian.push(row);
    }

    return {
      matrix: jacobian,
      dimensions: `${m}×${n}`,
      config,
      sparsity: calculateSparsity(jacobian),
      norm: calculateFrobeniusNorm(jacobian)
    };
  }

  function getCurrentMode() {
    const selected = document.querySelector('input[name="q27-mode"]:checked');
    return selected ? selected.value : 'structure';
  }

  function getCellVisualConfig(value, mode) {
    const baseCellStyle = 'min-width:0;border-radius:0.75rem;padding:0.55rem 0.35rem;text-align:center;font-family:var(--font-mono,\"JetBrains Mono\",\"Fira Code\",monospace);font-size:0.78rem;font-weight:600;display:flex;align-items:center;justify-content:center;transition:transform 0.15s ease, box-shadow 0.15s ease;';
    const baseBorder = 'border:1px solid rgba(148, 163, 184, 0.35);box-shadow:0 4px 10px -6px rgba(15, 23, 42, 0.45);';
    const absVal = Math.abs(value);
    if (absVal < 0.01) {
      return {
        style: `${baseCellStyle}${baseBorder}background: rgba(148, 163, 184, 0.18); color: rgba(148, 163, 184, 0.85);`,
        display: mode === 'structure' ? '·' : '0.00'
      };
    }

    const intensity = Math.min(absVal / 2, 1);
    if (value >= 0) {
      const alpha = 0.18 + intensity * 0.55;
      const textColor = intensity > 0.55 ? 'rgba(255, 255, 255, 0.92)' : 'rgba(12, 74, 110, 0.92)';
      return {
        style: `${baseCellStyle}${baseBorder}background: rgba(56, 189, 248, ${alpha}); color: ${textColor};`,
        display: mode === 'structure' ? '▲' : value.toFixed(2)
      };
    }

    const alpha = 0.18 + intensity * 0.55;
    const textColor = intensity > 0.55 ? 'rgba(255, 255, 255, 0.92)' : 'rgba(136, 19, 55, 0.92)';
    return {
      style: `${baseCellStyle}${baseBorder}background: rgba(244, 63, 94, ${alpha}); color: ${textColor};`,
      display: mode === 'structure' ? '▼' : value.toFixed(2)
    };
  }

  function updateModeVisuals() {
    const mode = getCurrentMode();
    if (modeIndicator) {
      modeIndicator.textContent = modeNames[mode];
    }

    modeCards.forEach((card) => {
      const radio = card.querySelector('input[name="q27-mode"]');
      const isActive = !!(radio && radio.checked);
      card.dataset.active = isActive ? 'true' : 'false';
      card.classList.toggle('panel-info', isActive);
      card.classList.toggle('panel-emphasis', isActive);
      card.classList.toggle('panel-neutral-soft', !isActive);
    });
  }

  const processAndDisplay = () => {
    try {
      const functionType = functionTypeSelect.value;
      const inputDim = inputDimSelect.value;
      const outputDim = outputDimSelect.value;
      const mode = getCurrentMode();

      updateModeVisuals();

      const jacobianData = generateJacobianData(functionType, inputDim, outputDim);
      const { matrix, config } = jacobianData;
      const modeLabel = modeNames[mode];

      const dimSummary = `${jacobianData.dimensions.split('×')[0]} outputs × ${jacobianData.dimensions.split('×')[1]} inputs`;
      currentMatrix = matrix;
      stopAnimation();
      ensureInputVector(matrix[0]?.length || 0);
      renderVectorControls();
      updateApplyHint();

      let html = `
        <div class="space-y-4">
          <div class="panel panel-neutral-soft q27-property-card">
            <h5 class="text-sm font-semibold text-heading">Jacobian snapshot</h5>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="space-y-1">
                <div class="text-xs uppercase tracking-wide text-muted">Function type</div>
                <div class="text-sm font-semibold">${config.name}</div>
                <p class="small-caption panel-muted">${config.properties.join(' · ')}</p>
              </div>
              <div class="space-y-1">
                <div class="text-xs uppercase tracking-wide text-muted">Matrix size</div>
                <div class="text-sm font-semibold">${jacobianData.dimensions}</div>
                <p class="small-caption panel-muted">${dimSummary}</p>
              </div>
              <div class="space-y-1">
                <div class="text-xs uppercase tracking-wide text-muted">Sparsity</div>
                <div class="text-sm font-semibold">${(jacobianData.sparsity * 100).toFixed(1)}%</div>
                <p class="small-caption panel-muted">% of near-zero entries</p>
              </div>
              <div class="space-y-1">
                <div class="text-xs uppercase tracking-wide text-muted">Frobenius norm</div>
                <div class="text-sm font-semibold">${jacobianData.norm.toFixed(3)}</div>
                <p class="small-caption panel-muted">Overall sensitivity scale</p>
              </div>
            </div>
          </div>

          <div class="panel panel-neutral q27-matrix-card">
            <div class="q27-matrix-card-head">
              <h5 class="text-sm font-semibold text-heading">Matrix visualization</h5>
              <span class="chip chip-neutral text-xs">${modeLabel}</span>
            </div>
            <div id="q27-matrix-grid" class="q27-matrix-wrapper" role="table" aria-label="Jacobian matrix heatmap" style="display:grid;grid-template-columns:repeat(${matrix[0]?.length + 1 || 1}, minmax(3.25rem, 1fr));gap:0.5rem;align-items:stretch;">
      `;

      const headerStyle = 'font-size:0.78rem;font-weight:600;letter-spacing:0.02em;color:rgba(94, 234, 212, 0.85);text-transform:uppercase;text-align:center;padding:0.4rem 0.2rem;border-radius:0.55rem;background:rgba(14, 165, 233, 0.12);border:1px solid rgba(14, 165, 233, 0.35);display:flex;align-items:center;justify-content:center;';
      const rowHeaderStyle = 'font-size:0.78rem;font-weight:600;color:rgba(196, 181, 253, 0.9);text-transform:uppercase;text-align:center;padding:0.4rem 0.2rem;border-radius:0.55rem;background:rgba(124, 58, 237, 0.16);border:1px solid rgba(168, 85, 247, 0.35);display:flex;align-items:center;justify-content:center;';

      const columnCount = matrix[0]?.length || 0;
      if (columnCount > 0) {
        html += `<div style="${headerStyle}">↱</div>`;
        for (let j = 0; j < columnCount; j += 1) {
          html += `<div style="${headerStyle}">x${j + 1}</div>`;
        }

        matrix.forEach((row, i) => {
          html += `<div data-row-header="${i}" style="${rowHeaderStyle}">f${i + 1}</div>`;
          row.forEach((val, j) => {
            const { style, display } = getCellVisualConfig(val, mode);
            const title = `∂f${i + 1}/∂x${j + 1} = ${val.toFixed(3)}`;
            html += `<div role="cell" data-row="${i}" data-col="${j}" title="${title}" style="${style}">${display}</div>`;
          });
        });
      } else {
        html += `<div style="grid-column: 1 / -1; ${headerStyle}">No matrix data</div>`;
      }

      html += `
            </div>
            <div class="q27-matrix-legend small-caption panel-muted">
              <span class="q27-legend-item"><span class="q27-legend-swatch q27-legend-swatch--positive"></span>Positive values</span>
              <span class="q27-legend-item"><span class="q27-legend-swatch q27-legend-swatch--negative"></span>Negative values</span>
              <span class="q27-legend-item"><span class="q27-legend-swatch q27-legend-swatch--zero"></span>Near zero (sparse)</span>
            </div>
          </div>
        </div>
      `;

    if (mode === 'structure') {
      html += `
          <div class="panel panel-info panel-neutral-soft q27-note">
            Structure view hides raw magnitudes so it is easier to spot relationships. ▲ marks a positive influence, ▼ marks a negative influence, and · shows near-zero coupling. Brightness tracks |J<sub>ij</sub>| while colour still encodes sign (teal = positive, rose = negative).
          </div>
        `;
      } else if (mode === 'computation') {
        const formulaByType = {
          linear: '$$ J = W $$',
          softmax: '$$ J_{ij} = s_i (\\delta_{ij} - s_j) $$',
          attention: '$$ J = \\frac{\\partial\\,\\operatorname{Attention}(Q,K,V)}{\\partial x} $$',
          'layer-norm': '$$ J = \\frac{\\partial\\,\\operatorname{LayerNorm}(x)}{\\partial x} $$',
          'feed-forward': "$$ J = \\operatorname{diag}(\\sigma'(Wx+b))\\,W $$"
        };
        const formula = formulaByType[functionType] || '';
        html += `
          <div class="panel panel-info panel-neutral-soft q27-note">
            <p class="small-caption panel-muted mb-2">Computation view formula</p>
            <div class="math-display">${formula}</div>
          </div>
        `;
      } else if (mode === 'backprop') {
        const m = matrix.length;
        const n = matrix[0]?.length || 0;
        let gy = Array.from({ length: m }, () => (Math.random() - 0.5) * 2);
        const gyNorm = Math.sqrt(gy.reduce((sum, v) => sum + v * v, 0)) || 1;
        gy = gy.map((v) => v / gyNorm);
        const gx = new Array(n).fill(0);
        for (let j = 0; j < n; j += 1) {
          let sum = 0;
          for (let i = 0; i < m; i += 1) {
            sum += matrix[i][j] * gy[i];
          }
          gx[j] = sum;
        }
        const maxAbs = Math.max(...gx.map((v) => Math.abs(v))) || 1;
        const bars = gx
          .map((v, j) => {
            const pct = Math.min(100, Math.abs(v) / maxAbs * 100).toFixed(1);
            const sign = v >= 0 ? 'positive' : 'negative';
            const style = `width:${pct}%;right:auto;left:0;`;
            return `
              <div class="q27-gradient-bar">
                <span class="q27-gradient-label">x${j + 1}</span>
                <div class="q27-gradient-track">
                  <div class="q27-gradient-fill" data-sign="${sign}" style="${style}"></div>
                  <span class="q27-gradient-value">${v.toFixed(3)}</span>
                </div>
              </div>
            `;
          })
          .join('');

        html += `
          <div class="panel panel-accent panel-neutral-soft q27-backprop-card">
            <p class="small-caption panel-muted">Backprop view: upstream gradient flows through the Jacobian transpose.</p>
            <div class="math-display">∂L/∂x = Jᵀ · ∂L/∂y</div>
            <div class="q27-gradient-stack">${bars}</div>
          </div>
        `;
      }

      output.innerHTML = html;

      if (legend) {
        const flattened = matrix.flatMap((row, i) => row.map((val, j) => ({ val: Math.abs(val), label: `∂f${i + 1}/∂x${j + 1}` })));
        flattened.sort((a, b) => b.val - a.val);
        const strongest = flattened[0] || { val: 0, label: 'n/a' };
        legend.innerHTML = `
          <span><strong>Function:</strong> ${config.name}</span>
          <span><strong>Dimensions:</strong> ${jacobianData.dimensions}</span>
          <span><strong>Sparsity:</strong> ${(jacobianData.sparsity * 100).toFixed(1)}%</span>
          <span><strong>Norm:</strong> ${jacobianData.norm.toFixed(3)}</span>
          <span><strong>Complexity:</strong> ${config.complexity}</span>
          <span><strong>Peak entry:</strong> ${strongest.label} ≈ ${strongest.val.toFixed(2)}</span>
          <span><strong>View:</strong> ${modeLabel}</span>
        `;
      }

      if (explanation) {
        const modeHints = {
          structure: 'Structure view hides raw magnitudes. ▲ cells indicate positive influence, ▼ mark negative influence, and · highlights near-zero couplings.',
          computation: 'Computation view reveals the exact partial derivatives so you can trace the largest contributors to downstream change.',
          backprop: 'Backprop view emphasises how upstream gradients reshape the inputs. Larger bars mean the parameter is more sensitive.'
        };
        explanation.innerHTML = `
          <div class="space-y-2">
            <p><strong>Function analysis:</strong> ${config.description}. This ${functionType} function has ${config.jacobianStructure} Jacobian structure with ${config.complexity} computational complexity.</p>
            <p><strong>Mode:</strong> ${modeLabel} — ${modeHints[mode] || 'Interact with the controls to see how structure and gradients change.'}</p>
          </div>
        `;
      }

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([output, legend, explanation]).catch(() => {});
      }
    } catch (error) {
      console.error('Error in processAndDisplay:', error);
      if (output) {
        output.innerHTML = '<div class="panel panel-warning p-4 text-sm">Error processing data. Please try again.</div>';
      }
    }
  };

  if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
      try {
        const example = examples[exampleIndex];
        functionTypeSelect.value = example.functionType;
        inputDimSelect.value = example.inputDim;
        outputDimSelect.value = example.outputDim;
        const modeRadio = document.querySelector(`input[name="q27-mode"][value="${example.mode}"]`);
        if (modeRadio) {
          modeRadio.checked = true;
        }
        processAndDisplay();
        exampleBtn.textContent = example.note;
        exampleBtn.title = `Example ${exampleIndex + 1}/${examples.length}: ${example.functionType}`;
        exampleIndex = (exampleIndex + 1) % examples.length;
      } catch (error) {
        console.error('Error in example cycling:', error);
      }
    });
  }

  if (applyButton) {
    applyButton.addEventListener('click', () => {
      runApplyAnimation();
    });
  }

  if (randomButton) {
    randomButton.addEventListener('click', () => {
      if (!inputVector.length) {
        return;
      }
      inputVector = inputVector.map(() => {
        const randomValue = (Math.random() * 2) - 1;
        return parseFloat(randomValue.toFixed(2));
      });
      renderVectorControls();
      updateApplyHint();
      stopAnimation();
    });
  }

  functionTypeSelect.addEventListener('change', processAndDisplay);
  inputDimSelect.addEventListener('change', processAndDisplay);
  outputDimSelect.addEventListener('change', processAndDisplay);
  modeRadios.forEach((radio) => {
    radio.addEventListener('change', processAndDisplay);
  });

  updateModeVisuals();
  processAndDisplay();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question27Interactive = interactiveScript;
}
