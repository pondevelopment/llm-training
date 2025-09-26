const interactiveScript = () => {
  const inputValue = document.getElementById('q31-input-value');
  const weight1 = document.getElementById('q31-weight1');
  const weight2 = document.getElementById('q31-weight2');
  const target = document.getElementById('q31-target');
  const inputDisplay = document.getElementById('q31-input-display');
  const weight1Display = document.getElementById('q31-weight1-display');
  const weight2Display = document.getElementById('q31-weight2-display');
  const targetDisplay = document.getElementById('q31-target-display');
  const activationRadios = document.querySelectorAll('input[name="q31-activation"]');
  const forwardPass = document.getElementById('q31-forward-pass');
  const backwardPass = document.getElementById('q31-backward-pass');
  const gradients = document.getElementById('q31-gradients');
  const explanationContent = document.getElementById('q31-explanation-content');
  const example1Btn = document.getElementById('q31-example-1');
  const example2Btn = document.getElementById('q31-example-2');
  const example3Btn = document.getElementById('q31-example-3');

  if (!inputValue || !weight1 || !weight2 || !target || !forwardPass || !backwardPass || !gradients || !explanationContent) {
    console.error('Question 31 interactive: required DOM nodes not found.');
    return;
  }

  function typesetMath(root) {
    if (!root) return;
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      try {
        if (window.MathJax.typesetClear) {
          window.MathJax.typesetClear([root]);
        }
        window.MathJax.typesetPromise([root]);
      } catch (error) {
        console.warn('Question 31 MathJax typeset failed', error);
      }
    }
  }

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const activations = {
    sigmoid: {
      fn: (x) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))),
      derivative: (x) => {
        const clamped = Math.max(-500, Math.min(500, x));
        const s = 1 / (1 + Math.exp(-clamped));
        return s * (1 - s);
      },
      name: 'Sigmoid',
    },
    tanh: {
      fn: (x) => Math.tanh(x),
      derivative: (x) => 1 - Math.tanh(x) ** 2,
      name: 'Tanh',
    },
    relu: {
      fn: (x) => Math.max(0, x),
      derivative: (x) => (x > 0 ? 1 : 0),
      name: 'ReLU',
    },
  };

  function getCssVar(token, fallback) {
    const style = getComputedStyle(document.documentElement);
    const value = style.getPropertyValue(token);
    return value && value.trim() ? value.trim() : fallback;
  }

  function mixColor(tone, percentage, base = 'var(--color-card)') {
    const pct = Math.max(0, Math.min(100, percentage));
    const remainder = Math.max(0, 100 - pct);
    return `color-mix(in srgb, ${tone} ${pct}%, ${base} ${remainder}%)`;
  }

  function resetActivationStyles(container) {
    container.style.background = 'var(--color-card)';
    container.style.borderColor = 'var(--color-border-subtle)';
    container.style.boxShadow = 'none';
    container.style.color = '';
  }

  function applyActivationStyles(container, tone) {
    container.style.background = mixColor(tone, 14);
    container.style.borderColor = mixColor(tone, 34, 'var(--color-border-subtle)');
    container.style.boxShadow = '0 18px 36px -28px rgba(15, 23, 42, 0.55)';
    container.style.color = mixColor(tone, 60, 'var(--color-heading)');
  }

  const activationTones = {
    sigmoid: 'var(--tone-indigo-strong)',
    tanh: 'var(--tone-emerald-strong)',
    relu: 'var(--tone-amber-strong)',
  };

  function getCurrentActivation() {
    const selected = document.querySelector('input[name="q31-activation"]:checked');
    return selected ? selected.value : 'sigmoid';
  }

  function updateActivationVisuals() {
    activationRadios.forEach((radio) => {
      const container = radio.closest('.question-strategy');
      if (!container) return;
      const tone = activationTones[radio.value] || 'var(--accent-strong)';
      if (radio.checked) {
        container.classList.add('question-strategy-active');
        applyActivationStyles(container, tone);
      } else {
        container.classList.remove('question-strategy-active');
        resetActivationStyles(container);
      }
    });
  }

  function drawNetworkDiagram(values) {
    const diagram = document.getElementById('q31-network-diagram');
    if (!diagram) return;

    const { x, a1, y_pred, y_true, loss, dL_dw1, dL_dw2 } = values;
    diagram.innerHTML = '';

      const colors = {
    input: getCssVar('--tone-sky-strong', '#3b82f6'),
    hidden: getCssVar('--tone-purple-strong', '#8b5cf6'),
    output: getCssVar('--color-path-scaling-strong', '#ef4444'),
    target: getCssVar('--tone-emerald-strong', '#10b981'),
    gradientPositive: getCssVar('--tone-emerald-strong', '#10b981'),
    gradientCaution: getCssVar('--tone-amber-strong', '#f59e0b'),
    gradientNegative: getCssVar('--color-path-scaling-strong', '#ef4444'),
    label: getCssVar('--color-secondary', '#374151'),
    value: getCssVar('--color-heading', '#1f2937'),
    barBg: getCssVar('--color-border-subtle', '#e5e7eb'),
  };

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 180');

    const nodeRadius = 44;
    const innerRadius = 36;
    const connectionInset = nodeRadius + 8;
    const gradientLabelOffset = nodeRadius + 10;
    const gradientBarOffset = nodeRadius + 24;

    const nodes = [
      { x: 80, y: 90, label: 'Input', value: x.toFixed(2), color: colors.input },
      { x: 240, y: 90, label: 'Hidden', value: a1.toFixed(2), color: colors.hidden },
      { x: 400, y: 90, label: 'Prediction', value: y_pred.toFixed(2), color: colors.output },
      { x: 560, y: 90, label: 'Target', value: y_true.toFixed(2), color: colors.target },
    ];

        const connections = [
      { from: 0, to: 1, weight: parseFloat(weight1.value), gradient: dL_dw1, label: 'w₁' },
      { from: 1, to: 2, weight: parseFloat(weight2.value), gradient: dL_dw2, label: 'w₂' },
    ];

    connections.forEach((conn) => {
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      const connectionTone = toNode.color;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromNode.x + connectionInset);
      line.setAttribute('y1', fromNode.y);
      line.setAttribute('x2', toNode.x - connectionInset);
      line.setAttribute('y2', toNode.y);
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('stroke-linejoin', 'round');
      line.style.stroke = conn.weight >= 0 ? connectionTone : colors.gradientNegative;
      line.style.strokeWidth = `${Math.abs(conn.weight) * 2 + 2}`;
      line.style.opacity = '0.9';
      line.style.strokeDasharray = conn.weight >= 0 ? 'none' : '6,4';
      svg.appendChild(line);

      const weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      weightText.setAttribute('x', (fromNode.x + toNode.x) / 2);
      weightText.setAttribute('y', fromNode.y - (nodeRadius + 10));
      weightText.setAttribute('text-anchor', 'middle');
      weightText.setAttribute('font-size', '11');
      weightText.setAttribute('font-weight', '600');
      weightText.style.fill = mixColor(connectionTone, 30, 'var(--color-heading)');
      weightText.textContent = `${conn.label} = ${conn.weight.toFixed(2)}`;
      svg.appendChild(weightText);

      const gradientMagnitude = Math.abs(conn.gradient);
      const gradientTone = gradientMagnitude < 0.02
        ? colors.gradientPositive
        : gradientMagnitude < 0.08
          ? colors.gradientCaution
          : colors.gradientNegative;

      const gradText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      gradText.setAttribute('x', (fromNode.x + toNode.x) / 2);
      gradText.setAttribute('y', fromNode.y + gradientLabelOffset);
      gradText.setAttribute('text-anchor', 'middle');
      gradText.setAttribute('font-size', '10');
      gradText.setAttribute('font-weight', '600');
      gradText.style.fill = mixColor(gradientTone, 35, 'var(--color-heading)');
      gradText.textContent = `∇ = ${conn.gradient.toFixed(3)}`;
      svg.appendChild(gradText);

      const gradBarBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      gradBarBg.setAttribute('x', (fromNode.x + toNode.x) / 2 - 20);
      gradBarBg.setAttribute('y', fromNode.y + gradientBarOffset);
      gradBarBg.setAttribute('width', '40');
      gradBarBg.setAttribute('height', '4');
      gradBarBg.setAttribute('rx', '2');
      gradBarBg.style.fill = mixColor(gradientTone, 18, colors.barBg);
      gradBarBg.style.opacity = '0.8';
      svg.appendChild(gradBarBg);

      const gradBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      gradBar.setAttribute('x', (fromNode.x + toNode.x) / 2 - 20);
      gradBar.setAttribute('y', fromNode.y + gradientBarOffset);
      gradBar.setAttribute('width', `${Math.min(40, gradientMagnitude * 140)}`);
      gradBar.setAttribute('height', '4');
      gradBar.setAttribute('rx', '2');
      gradBar.style.fill = mixColor(gradientTone, 65, 'var(--color-heading)');
      gradBar.style.opacity = '0.95';
      svg.appendChild(gradBar);

      if (!prefersReducedMotion) {
        const forwardDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        forwardDot.setAttribute('r', '5');
        forwardDot.style.fill = connectionTone;
        forwardDot.style.opacity = '0.9';
        forwardDot.style.stroke = mixColor(connectionTone, 55, 'var(--color-heading)');
        forwardDot.style.strokeWidth = '1';
        const forwardPath = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        forwardPath.setAttribute('dur', '2s');
        forwardPath.setAttribute('repeatCount', 'indefinite');
        forwardPath.setAttribute('path', `M ${fromNode.x + connectionInset} ${fromNode.y} L ${toNode.x - connectionInset} ${toNode.y}`);
        forwardDot.appendChild(forwardPath);
        svg.appendChild(forwardDot);

        const backwardDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        backwardDot.setAttribute('r', '4');
        backwardDot.style.fill = gradientTone;
        backwardDot.style.opacity = '0.85';
        backwardDot.style.stroke = mixColor(gradientTone, 55, 'rgba(5, 10, 25, 0.7)');
        backwardDot.style.strokeWidth = '1';
        const backwardPath = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        backwardPath.setAttribute('dur', '2.6s');
        backwardPath.setAttribute('repeatCount', 'indefinite');
        backwardPath.setAttribute('begin', '0.6s');
        backwardPath.setAttribute('path', `M ${toNode.x - connectionInset} ${toNode.y - 4} L ${fromNode.x + connectionInset} ${fromNode.y - 4}`);
        backwardDot.appendChild(backwardPath);
        svg.appendChild(backwardDot);
      }
    });

    nodes.forEach((node) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', nodeRadius);
      circle.style.fill = mixColor(node.color, 18);
      circle.style.stroke = node.color;
      circle.style.strokeWidth = '3';
      circle.style.opacity = '0.5';
      svg.appendChild(circle);

      const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      innerCircle.setAttribute('cx', node.x);
      innerCircle.setAttribute('cy', node.y);
      innerCircle.setAttribute('r', innerRadius);
      innerCircle.style.fill = 'var(--color-card)';
      innerCircle.style.stroke = node.color;
      innerCircle.style.strokeWidth = '1';
      svg.appendChild(innerCircle);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', node.x);
      label.setAttribute('y', node.y - 14);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('font-weight', '600');
      label.style.fill = mixColor(node.color, 30, 'var(--color-heading)');
      label.textContent = node.label;
      svg.appendChild(label);

      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', node.x);
      valueText.setAttribute('y', node.y + 14);
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
      valueText.setAttribute('font-weight', '600');
      valueText.style.fill = colors.value;
      valueText.textContent = node.value;
      svg.appendChild(valueText);
    });

    const lossTone = loss > 0.1 ? colors.gradientNegative : colors.gradientPositive;

    const lossLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lossLine.setAttribute('x1', nodes[2].x + connectionInset);
    lossLine.setAttribute('y1', nodes[2].y);
    lossLine.setAttribute('x2', nodes[3].x - connectionInset);
    lossLine.setAttribute('y2', nodes[3].y);
    lossLine.style.stroke = lossTone;
    lossLine.style.strokeWidth = '2';
    lossLine.style.opacity = '0.6';
    lossLine.style.strokeDasharray = '8,4';
    svg.appendChild(lossLine);

    const lossBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    lossBox.setAttribute('x', (nodes[2].x + nodes[3].x) / 2 - 35);
    lossBox.setAttribute('y', nodes[2].y - (nodeRadius + 8));
    lossBox.setAttribute('width', '70');
    lossBox.setAttribute('height', '25');
    lossBox.setAttribute('rx', '6');
    lossBox.style.fill = mixColor(lossTone, 20);
    lossBox.style.stroke = mixColor(lossTone, 55, 'var(--color-border-subtle)');
    lossBox.style.strokeWidth = '1';
    svg.appendChild(lossBox);

    const lossText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lossText.setAttribute('x', (nodes[2].x + nodes[3].x) / 2);
    lossText.setAttribute('y', nodes[2].y - (nodeRadius - 4));
    lossText.setAttribute('text-anchor', 'middle');
    lossText.setAttribute('font-size', '11');
    lossText.setAttribute('font-weight', '600');
    lossText.style.fill = mixColor(lossTone, 35, 'var(--color-heading)');
    lossText.textContent = `Loss: ${loss.toFixed(3)}`;
    svg.appendChild(lossText);

    diagram.appendChild(svg);
  }

  function computeAndVisualize() {
    const x = parseFloat(inputValue.value);
    const w1 = parseFloat(weight1.value);
    const w2 = parseFloat(weight2.value);
    const yTrue = parseFloat(target.value);
    const activationType = getCurrentActivation();
    const activation = activations[activationType];

    inputDisplay.textContent = x.toFixed(1);
    weight1Display.textContent = w1.toFixed(1);
    weight2Display.textContent = w2.toFixed(1);
    targetDisplay.textContent = yTrue.toFixed(1);

    updateActivationVisuals();

    const z1 = w1 * x;
    const a1 = activation.fn(z1);
    const z2 = w2 * a1;
    const yPred = activation.fn(z2);
    const loss = 0.5 * (yPred - yTrue) ** 2;

    const forwardHTML = `
      <div class="q31-flow-row text-sm">
        <div class="panel panel-info panel-emphasis q31-flow-card stacked-card" aria-label="Input value">
          <div class="font-medium text-heading">Input</div>
          <div class="text-lg font-bold">${x.toFixed(3)}</div>
          <div class="text-xs panel-muted">x</div>
        </div>
        <div class="q31-flow-arrow">
          <span>&rarr;</span>
          <small>&times; w<sub>1</sub></small>
        </div>
        <div class="panel panel-success panel-emphasis q31-flow-card stacked-card" aria-label="First linear transform">
          <div class="font-medium text-heading">Linear 1</div>
          <div class="text-lg font-bold">${z1.toFixed(3)}</div>
          <div class="text-xs panel-muted">z<sub>1</sub> = ${w1.toFixed(1)} × ${x.toFixed(1)}</div>
        </div>
        <div class="q31-flow-arrow">
          <span>&rarr;</span>
          <small>${activationType}</small>
        </div>
        <div class="panel panel-accent panel-emphasis q31-flow-card stacked-card" aria-label="Hidden activation">
          <div class="font-medium text-heading">${activation.name}</div>
          <div class="text-lg font-bold">${a1.toFixed(3)}</div>
          <div class="text-xs panel-muted">a<sub>1</sub> = ${activationType}(z<sub>1</sub>)</div>
        </div>
        <div class="q31-flow-arrow">
          <span>&rarr;</span>
          <small>&times; w<sub>2</sub></small>
        </div>
        <div class="panel panel-warning panel-emphasis q31-flow-card stacked-card" aria-label="Second linear transform">
          <div class="font-medium text-heading">Linear 2</div>
          <div class="text-lg font-bold">${z2.toFixed(3)}</div>
          <div class="text-xs panel-muted">z<sub>2</sub> = ${w2.toFixed(1)} × ${a1.toFixed(3)}</div>
        </div>
        <div class="q31-flow-arrow">
          <span>&rarr;</span>
          <small>${activationType}</small>
        </div>
        <div class="panel panel-info panel-emphasis q31-flow-card stacked-card" aria-label="Prediction">
          <div class="font-medium text-heading">Prediction</div>
          <div class="text-lg font-bold">${yPred.toFixed(3)}</div>
          <div class="text-xs panel-muted">ŷ</div>
        </div>
      </div>
      <p class="text-xs text-muted mt-3">Loss L = 0.5 · (ŷ − y)<sup>2</sup> = ${loss.toFixed(4)}</p>
    `;
    forwardPass.innerHTML = forwardHTML;
    typesetMath(forwardPass);

    const dL_dyPred = yPred - yTrue;
    const dyPred_dz2 = activation.derivative(z2);
    const dz2_dw2 = a1;
    const dz2_da1 = w2;
    const da1_dz1 = activation.derivative(z1);
    const dz1_dw1 = x;

    const dL_dw2 = dL_dyPred * dyPred_dz2 * dz2_dw2;
    const dL_dw1 = dL_dyPred * dyPred_dz2 * dz2_da1 * da1_dz1 * dz1_dw1;

    const backwardHTML = `
      <div class="space-y-4">
        <div class="panel panel-warning panel-emphasis p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h6 class="font-semibold text-heading">Step 1 · Loss gradient</h6>
            <span class="text-2xl" aria-hidden="true">🎯</span>
          </div>
          <div class="panel panel-neutral-soft p-3 font-mono text-sm">
            ∂L/∂ŷ = ŷ − y = ${yPred.toFixed(3)} − ${yTrue.toFixed(3)} = <strong>${dL_dyPred.toFixed(4)}</strong>
          </div>
          <p class="text-xs panel-muted">
            ${Math.abs(dL_dyPred) > 0.1 ? '🔥 Strong error signal — the network must adjust aggressively.' : '✅ Small error signal — only minor tweaks are required.'}
          </p>
        </div>

        <div class="q31-chain-connector" aria-hidden="true">
          <span>⟲</span>
          <p class="text-xs text-muted">Chain rule pushes this signal backward.</p>
        </div>

        <div class="panel panel-accent panel-emphasis p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h6 class="font-semibold text-heading">Step 2 · Output weight w<sub>2</sub></h6>
            <span class="text-2xl" aria-hidden="true">⚡</span>
          </div>
          <div class="grid md:grid-cols-3 gap-2 text-sm font-mono">
            <div class="panel panel-neutral-soft p-3">∂ŷ/∂z<sub>2</sub> = ${activationType}'(z<sub>2</sub>) = <strong>${dyPred_dz2.toFixed(4)}</strong></div>
            <div class="panel panel-neutral-soft p-3">∂z<sub>2</sub>/∂w<sub>2</sub> = a<sub>1</sub> = <strong>${dz2_dw2.toFixed(4)}</strong></div>
            <div class="panel panel-neutral-soft p-3">∂L/∂w<sub>2</sub> = <strong>${dL_dw2.toFixed(4)}</strong></div>
          </div>
          <p class="text-xs panel-muted text-center">Multiply the loss signal by the activation slope and cached hidden activation.</p>
        </div>

        <div class="q31-chain-connector" aria-hidden="true">
          <span>⟲</span>
          <p class="text-xs text-muted">Continue chaining through the hidden layer.</p>
        </div>

        <div class="panel panel-info panel-emphasis p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h6 class="font-semibold text-heading">Step 3 · Hidden weight w<sub>1</sub></h6>
            <span class="text-2xl" aria-hidden="true">🪄</span>
          </div>
          <div class="grid md:grid-cols-5 gap-2 text-sm font-mono">
            <div class="panel panel-neutral-soft p-3">∂z<sub>2</sub>/∂a<sub>1</sub> = w<sub>2</sub> = <strong>${dz2_da1.toFixed(4)}</strong></div>
            <div class="panel panel-neutral-soft p-3">∂a<sub>1</sub>/∂z<sub>1</sub> = ${activationType}'(z<sub>1</sub>) = <strong>${da1_dz1.toFixed(4)}</strong></div>
            <div class="panel panel-neutral-soft p-3">∂z<sub>1</sub>/∂w<sub>1</sub> = x = <strong>${dz1_dw1.toFixed(4)}</strong></div>
            <div class="panel panel-neutral-soft p-3">∂L/∂ŷ = <strong>${dL_dyPred.toFixed(4)}</strong></div>
            <div class="panel panel-neutral-soft p-3">∂ŷ/∂z<sub>2</sub> = <strong>${dyPred_dz2.toFixed(4)}</strong></div>
          </div>
          <div class="panel panel-neutral-soft p-3 text-sm font-mono">
            ∂L/∂w<sub>1</sub> = ${dL_dyPred.toFixed(4)} × ${dyPred_dz2.toFixed(4)} × ${dz2_da1.toFixed(4)} × ${da1_dz1.toFixed(4)} × ${dz1_dw1.toFixed(4)} = <strong>${dL_dw1.toFixed(4)}</strong>
          </div>
          <p class="text-xs panel-muted">Earlier layers chain through more derivatives, so their gradients shrink or explode more easily.</p>
        </div>

        <div class="panel panel-neutral p-4 space-y-2">
          <h6 class="font-semibold text-heading">Chain rule summary</h6>
          <p class="text-sm panel-muted">Every gradient is the product of local slopes. Longer chains (w<sub>1</sub>) need more multiplications than later weights (w<sub>2</sub>).</p>
          <div class="panel panel-neutral-soft p-3 text-xs font-mono">
            $$\\frac{\\partial L}{\\partial w_2} = (\\hat{y} - y) \, f'(z_2) \, a_1$$<br>
            $$\\frac{\\partial L}{\\partial w_1} = (\\hat{y} - y) \, f'(z_2) \, w_2 \, f'(z_1) \, x$$
          </div>
        </div>
      </div>
    `;
    backwardPass.innerHTML = backwardHTML;
    typesetMath(backwardPass);

    const gradMagnitude = Math.sqrt(dL_dw1 ** 2 + dL_dw2 ** 2);
    const maxGrad = Math.max(Math.abs(dL_dw1), Math.abs(dL_dw2));
    const w1GradPercent = maxGrad > 0 ? (Math.abs(dL_dw1) / maxGrad) * 100 : 0;
    const w2GradPercent = maxGrad > 0 ? (Math.abs(dL_dw2) / maxGrad) * 100 : 0;

    const gradientHTML = `
      <div class="panel panel-info panel-emphasis q31-gradient-card" role="group" aria-label="Gradient for weight w1">
        <div class="font-medium text-heading">∂L/∂w<sub>1</sub></div>
        <div class="text-2xl font-bold">${dL_dw1.toFixed(4)}</div>
        <div class="q31-gradient-bar" aria-hidden="true">
          <div class="q31-gradient-fill" style="--q31-bar-fill:${w1GradPercent}%; --q31-bar-color: var(--tone-indigo-strong);"></div>
        </div>
        <div class="text-xs panel-muted">${(Math.abs(dL_dw1) / (maxGrad || 1) * 100).toFixed(1)}% of current max gradient</div>
        <span class="sr-only">Gradient magnitude for w1 is ${dL_dw1.toFixed(4)}</span>
      </div>
      <div class="panel panel-success panel-emphasis q31-gradient-card" role="group" aria-label="Gradient for weight w2">
        <div class="font-medium text-heading">∂L/∂w<sub>2</sub></div>
        <div class="text-2xl font-bold">${dL_dw2.toFixed(4)}</div>
        <div class="q31-gradient-bar" aria-hidden="true">
          <div class="q31-gradient-fill" style="--q31-bar-fill:${w2GradPercent}%; --q31-bar-color: var(--tone-emerald-strong);"></div>
        </div>
        <div class="text-xs panel-muted">${(Math.abs(dL_dw2) / (maxGrad || 1) * 100).toFixed(1)}% of current max gradient</div>
        <span class="sr-only">Gradient magnitude for w2 is ${dL_dw2.toFixed(4)}</span>
      </div>
      <div class="panel panel-accent panel-emphasis q31-gradient-card" role="group" aria-label="Overall gradient norm">
        <div class="font-medium text-heading">‖∇L‖</div>
        <div class="text-2xl font-bold">${gradMagnitude.toFixed(4)}</div>
        <div class="q31-gradient-bar" aria-hidden="true">
          <div class="q31-gradient-fill" style="--q31-bar-fill:${Math.min(100, gradMagnitude * 100)}%; --q31-bar-color: var(--tone-purple-strong);"></div>
        </div>
        <div class="text-xs panel-muted">√((∂L/∂w<sub>1</sub>)² + (∂L/∂w<sub>2</sub>)²)</div>
        <div class="flex items-center justify-center gap-1 text-xs text-heading">
          ${gradMagnitude < 0.01 ? '🪁' : gradMagnitude < 0.1 ? '🛰️' : '🚀'}
          <span>${gradMagnitude < 0.01 ? 'Weak' : gradMagnitude < 0.1 ? 'Moderate' : 'Strong'} learning signal</span>
        </div>
        <span class="sr-only">Gradient norm is ${gradMagnitude.toFixed(4)}</span>
      </div>
    `;
    gradients.innerHTML = gradientHTML;

    drawNetworkDiagram({
      x,
      a1,
      y_pred: yPred,
      y_true: yTrue,
      loss,
      dL_dw1,
      dL_dw2,
    });

    updateExplanation(activationType, dL_dw1, dL_dw2, loss);
  }

  function updateExplanation(activationType, gradW1, gradW2, loss) {
    if (!explanationContent) return;

    const gradMagnitude = Math.sqrt(gradW1 ** 2 + gradW2 ** 2);
    const w1Abs = Math.abs(gradW1);
    const w2Abs = Math.abs(gradW2);
    const chainLengthW1 = 5;
    const chainLengthW2 = 3;

    let explanationText = '';

    if (loss > 0.1) {
      const dominantWeight = w1Abs >= w2Abs ? 'w₁' : 'w₂';
      const dominantGrad = w1Abs >= w2Abs ? gradW1 : gradW2;
      const ratio = w1Abs >= w2Abs ? (w1Abs / Math.max(w2Abs, 1e-6)).toFixed(1) : (w2Abs / Math.max(w1Abs, 1e-6)).toFixed(1);
      explanationText += `
        <p><strong>🎯 Blame assignment:</strong> Loss ${loss.toFixed(3)} signals meaningful error. Weight <strong>${dominantWeight}</strong> carries the larger gradient (${dominantGrad.toFixed(4)}), so it will be updated about ${ratio}× more than the other weight.</p>
        <p class="mt-2"><strong>🛠 Focus:</strong> Backprop targets the parameter that contributed most to the mistake, accelerating recovery.</p>
      `;
    } else if (loss < 0.01) {
      explanationText += `
        <p><strong>✅ Low-error regime:</strong> Loss ${loss.toFixed(4)} keeps gradients tiny (w₁ ${gradW1.toFixed(4)}, w₂ ${gradW2.toFixed(4)}), so updates become gentle and stabilise learning.</p>
        <p class="mt-2"><strong>🤝 Balanced responsibility:</strong> Both weights share the load when the model is near the target.</p>
      `;
    } else {
      const leader = w1Abs >= w2Abs ? 'w₁' : 'w₂';
      const supporter = w1Abs >= w2Abs ? 'w₂' : 'w₁';
      explanationText += `
        <p><strong>⏱️ Moderate adjustment:</strong> With loss ${loss.toFixed(3)}, <strong>${leader}</strong> guides the update while ${supporter} fine-tunes support.</p>
        <p class="mt-2"><strong>⚖️ Steady progress:</strong> The gradient split keeps training stable without overreacting.</p>
      `;
    }

    explanationText += `
      <p class="mt-3"><strong>🪜 Chain rule impact:</strong> ∂L/∂w₁ traverses ${chainLengthW1} links versus ${chainLengthW2} for w₂, multiplying derivatives at each step.</p>
    `;

    if (gradMagnitude < 0.001) {
      explanationText += `
        <p class="mt-2"><strong>⚠️ Vanishing warning:</strong> ||∇|| = ${gradMagnitude.toFixed(6)} — a reminder that long chains can shrink gradients into silence.</p>
        <p class="mt-2"><strong>🔍 Why:</strong> Each ${activationType} derivative <em>in</em> the chain can be less than 1, compounding the shrinkage.</p>
      `;
    } else if (gradMagnitude > 1) {
      explanationText += `
        <p class="mt-2"><strong>🚀 Exploding alert:</strong> ||∇|| = ${gradMagnitude.toFixed(4)} — repeated multiplications can amplify signals dramatically.</p>
        <p class="mt-2"><strong>🧮 Effect:</strong> w₁'s longer chain multiplies more terms, so large derivatives propagate into huge updates.</p>
      `;
    } else {
      const flow = w1Abs < w2Abs * 0.1 ? 'weakening through the chain' : w1Abs > w2Abs * 10 ? 'amplifying aggressively' : 'flowing in balance';
      explanationText += `
        <p class="mt-2"><strong>🌊 Gradient flow:</strong> Through the ${chainLengthW1}-step path, gradients are ${flow}. Deep models need tricks (skip connections, careful init) to keep this flow healthy.</p>
      `;
    }

    if (activationType === 'sigmoid') {
      const sigmoidMaxDeriv = 0.25;
      const potentialShrinkage = Math.pow(sigmoidMaxDeriv, chainLengthW1 - 1) * 100;
      explanationText += `
        <div class="panel panel-info panel-emphasis p-3 text-sm mt-3 space-y-1">
          <strong>📘 Sigmoid &amp; vanishing gradients:</strong> The derivative caps at ${sigmoidMaxDeriv}, so w₁'s signal can shrink by up to ${potentialShrinkage.toFixed(1)}% across the chain. Deep nets rarely rely on sigmoid for this reason.
        </div>
      `;
    } else if (activationType === 'tanh') {
      explanationText += `
        <div class="panel panel-success panel-emphasis p-3 text-sm mt-3 space-y-1">
          <strong>🌱 Tanh advantage:</strong> Derivatives can reach 1.0 and outputs are zero-centred, keeping gradient flow stronger and reducing bias shifts.
        </div>
      `;
    } else if (activationType === 'relu') {
      explanationText += `
        <div class="panel panel-warning panel-emphasis p-3 text-sm mt-3 space-y-1">
          <strong>🔧 ReLU trade-off:</strong> Derivatives are either 0 or 1, so neurons either pass gradients cleanly or drop them entirely. Variants like Leaky ReLU keep a trickle alive.
        </div>
      `;
    }

    explanationText += `
      <div class="panel panel-warning panel-emphasis p-3 text-sm mt-3 space-y-1">
        <strong>💡 Practical takeaway:</strong> Backprop works because it routes loss information precisely, but deeper chains magnify stability issues. Regularisation, residual links, and activation choices all exist to keep these gradients useful.
      </div>
    `;

    if (activationType === 'relu' && loss > 0.05 && Math.abs(gradW1) === 0 && Math.abs(gradW2) === 0) {
      explanationText += `
        <div class="panel panel-warning panel-emphasis p-3 text-sm mt-3 space-y-1">
          <strong>🧊 ReLU dead zone:</strong> Both gradients are zero while loss = ${loss.toFixed(4)}. The neuron is inactive—nudge inputs or weights positive to revive learning.
        </div>
      `;
    }

    explanationContent.innerHTML = explanationText;
    typesetMath(explanationContent);
  }

  if (example1Btn) {
    example1Btn.addEventListener('click', () => {
      inputValue.value = 1.5;
      weight1.value = 2.0;
      weight2.value = 1.8;
      target.value = 0.1;
      computeAndVisualize();
    });
  }

  if (example2Btn) {
    example2Btn.addEventListener('click', () => {
      inputValue.value = 0.8;
      weight1.value = 0.6;
      weight2.value = 0.7;
      target.value = 0.75;
      computeAndVisualize();
    });
  }

  if (example3Btn) {
    example3Btn.addEventListener('click', () => {
      inputValue.value = 0.0;
      weight1.value = 0.5;
      weight2.value = 0.5;
      target.value = 0.5;
      computeAndVisualize();
    });
  }

  [inputValue, weight1, weight2, target].forEach((element) => {
    element.addEventListener('input', computeAndVisualize);
  });

  activationRadios.forEach((radio) => {
    radio.addEventListener('change', computeAndVisualize);
  });

  computeAndVisualize();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question31Interactive = interactiveScript;
}














