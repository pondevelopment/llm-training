const interactiveScript = () => {
  function typesetMath(root) {
    try {
      if (window.MathJax && MathJax.typesetPromise) {
        return MathJax.typesetPromise(root ? [root] : undefined).catch(() => {});
      }
    } catch (_) {}
    return Promise.resolve();
  }

  const distTypeSelect = document.getElementById('q29-dist-type');
  const pPeakSlider = document.getElementById('q29-p-peak');
  const pWidthSlider = document.getElementById('q29-p-width');
  const qPeakSlider = document.getElementById('q29-q-peak');
  const qWidthSlider = document.getElementById('q29-q-width');
  const pPeakVal = document.getElementById('q29-p-peak-val');
  const pWidthVal = document.getElementById('q29-p-width-val');
  const qPeakVal = document.getElementById('q29-q-peak-val');
  const qWidthVal = document.getElementById('q29-q-width-val');
  const scenarioSelect = document.getElementById('q29-scenario-select');
  const modeIndicator = document.getElementById('q29-mode-indicator');
  const legend = document.getElementById('q29-legend');
  const explanation = document.getElementById('q29-explanation');
  const output = document.getElementById('q29-output');
  const modeRadios = document.querySelectorAll('input[name="q29-mode"]');

  if (!distTypeSelect || !output || !pPeakSlider || !pWidthSlider || !qPeakSlider || !qWidthSlider) {
    if (output) {
      output.innerHTML = '<div class="panel panel-warning p-3 text-sm">Unable to initialise the interactive controls.</div>';
    }
    return;
  }

  const scenarios = {
    'teacher-student': {
      name: 'Teacher-Student Knowledge Distillation',
      description: 'Large teacher model (P) transfers knowledge to smaller student (Q).',
      pDefault: { peak: 5.0, width: 1.0 },
      qDefault: { peak: 4.8, width: 1.2 },
      context: 'Student tries to match the teacher\'s output distribution'
    },
    'rlhf-drift': {
      name: 'RLHF Policy Drift Prevention',
      description: 'Reference model (P) constrains fine-tuned policy (Q) during RLHF.',
      pDefault: { peak: 5.0, width: 1.0 },
      qDefault: { peak: 5.3, width: 0.9 },
      context: 'Policy should not drift too far from the reference model'
    },
    'fine-tuning': {
      name: 'Fine-tuning with Prior Regularisation',
      description: 'Prior distribution (P) regularises fine-tuned model (Q).',
      pDefault: { peak: 5.0, width: 1.5 },
      qDefault: { peak: 4.5, width: 1.0 },
      context: 'Model adapts to a new task while staying close to the prior'
    },
    custom: {
      name: 'Custom Distributions',
      description: 'Explore arbitrary probability distributions.',
      pDefault: { peak: 5.0, width: 1.0 },
      qDefault: { peak: 4.5, width: 1.2 },
      context: 'Free exploration of KL divergence behaviour'
    }
  };

  const quickScenarios = [
    {
      id: 'perfect-match',
      label: 'Perfect Match',
      summary: 'Student and teacher distributions align perfectly.',
      dist: 'teacher-student',
      mode: 'forward',
      p: { peak: 5.0, width: 1.0 },
      q: { peak: 5.0, width: 1.0 }
    },
    {
      id: 'student-underfits',
      label: 'Student Underfits',
      summary: 'Student lags behind the teacher with a lower peak and broader spread.',
      dist: 'teacher-student',
      mode: 'forward',
      p: { peak: 5.0, width: 1.0 },
      q: { peak: 4.5, width: 1.5 }
    },
    {
      id: 'policy-drift',
      label: 'Policy Drift',
      summary: 'Policy drifts away from the reference during RLHF updates.',
      dist: 'rlhf-drift',
      mode: 'forward',
      p: { peak: 5.0, width: 1.0 },
      q: { peak: 6.0, width: 0.8 }
    },
    {
      id: 'mode-collapse',
      label: 'Mode Collapse',
      summary: 'Reverse KL highlights mode-seeking behaviour during fine-tuning.',
      dist: 'fine-tuning',
      mode: 'reverse',
      p: { peak: 5.0, width: 2.0 },
      q: { peak: 4.0, width: 0.8 }
    }
  ];

  function normalize(values) {
    const sum = values.reduce((total, val) => total + val, 0);
    return values.map(val => val / (sum || 1));
  }

  function gaussian(x, mu, sigma) {
    return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
  }

  function calculateKL(P, Q, mode = 'forward') {
    const epsilon = 1e-10;
    if (mode === 'reverse') {
      let kl = 0;
      for (let i = 0; i < Q.length; i += 1) {
        if (Q[i] > epsilon) {
          kl += Q[i] * Math.log((Q[i] + epsilon) / (P[i] + epsilon));
        }
      }
      return kl;
    }
    if (mode === 'symmetric') {
      const M = P.map((p, idx) => 0.5 * (p + Q[idx]));
      return 0.5 * calculateKL(P, M, 'forward') + 0.5 * calculateKL(Q, M, 'forward');
    }
    let kl = 0;
    for (let i = 0; i < P.length; i += 1) {
      if (P[i] > epsilon) {
        kl += P[i] * Math.log((P[i] + epsilon) / (Q[i] + epsilon));
      }
    }
    return kl;
  }

  function getCurrentMode() {
    const checked = document.querySelector('input[name="q29-mode"]:checked');
    return checked ? checked.value : 'forward';
  }

  function updateSliderValues() {
    if (pPeakVal) pPeakVal.textContent = Number(pPeakSlider.value).toFixed(1);
    if (pWidthVal) pWidthVal.textContent = Number(pWidthSlider.value).toFixed(1);
    if (qPeakVal) qPeakVal.textContent = Number(qPeakSlider.value).toFixed(1);
    if (qWidthVal) qWidthVal.textContent = Number(qWidthSlider.value).toFixed(1);
  }

  const modeNames = {
    forward: 'Forward KL: D(P‖Q)',
    reverse: 'Reverse KL: D(Q‖P)',
    symmetric: 'Jensen-Shannon Divergence'
  };

  const modePanelMap = {
    forward: 'panel-info',
    reverse: 'panel-accent',
    symmetric: 'panel-success'
  };

  function updateModeVisuals() {
    const mode = getCurrentMode();
    if (modeIndicator) {
      modeIndicator.textContent = modeNames[mode];
    }
    document.querySelectorAll('.mode-card').forEach(card => {
      const input = card.querySelector('input[name="q29-mode"]');
      if (!input) return;
      card.classList.remove('panel-info', 'panel-accent', 'panel-success', 'panel-neutral-soft', 'panel-emphasis');
      if (input.checked) {
        card.classList.add(modePanelMap[input.value] || 'panel-info', 'panel-emphasis');
      } else {
        card.classList.add('panel-neutral-soft');
      }
    });
  }

  function applyScenario(key) {
    const scenario = scenarios[key];
    if (!scenario) return;
    pPeakSlider.value = scenario.pDefault.peak;
    pWidthSlider.value = scenario.pDefault.width;
    qPeakSlider.value = scenario.qDefault.peak;
    qWidthSlider.value = scenario.qDefault.width;
    updateSliderValues();
  }

  function buildDistributionBars(PNorm, QNorm) {
    const numBars = 25;
    const maxHeight = Math.max(Math.max(...PNorm), Math.max(...QNorm));
    const barColorP = 'var(--tone-sky-strong)';
    const barColorQ = 'var(--tone-purple-strong)';
    let bars = '';
    for (let i = 0; i < numBars; i += 1) {
      const xIndex = Math.min(PNorm.length - 1, Math.floor((i / numBars) * PNorm.length));
      const pHeight = maxHeight ? (PNorm[xIndex] / maxHeight) * 100 : 0;
      const qHeight = maxHeight ? (QNorm[xIndex] / maxHeight) * 100 : 0;
      bars += `
        <div class="relative flex-1" style="min-height:100px; display:flex; align-items:flex-end; justify-content:center;">
          <div style="position:absolute; inset:0; border-left:1px solid var(--color-border-subtle); border-right:1px solid var(--color-border-subtle); opacity:0.15;"></div>
          <div style="position:absolute; bottom:0; left:14%; width:32%; border-radius:0.4rem 0.4rem 0 0; background:${barColorP}; opacity:0.9; height:${pHeight}%" title="P: ${PNorm[xIndex].toFixed(4)}"></div>
          <div style="position:absolute; bottom:0; right:14%; width:32%; border-radius:0.4rem 0.4rem 0 0; background:${barColorQ}; opacity:0.85; height:${qHeight}%" title="Q: ${QNorm[xIndex].toFixed(4)}"></div>
        </div>
      `;
    }
    return bars;
  }

  function clearScenarioSelection() {
    if (scenarioSelect && scenarioSelect.value !== '') {
      scenarioSelect.value = '';
      scenarioSelect.title = 'Choose a preset scenario';
    }
  }

  function applyQuickScenario(preset) {
    distTypeSelect.value = preset.dist;
    applyScenario(preset.dist);
    pPeakSlider.value = preset.p.peak;
    pWidthSlider.value = preset.p.width;
    qPeakSlider.value = preset.q.peak;
    qWidthSlider.value = preset.q.width;
    const modeRadio = document.querySelector(`input[name="q29-mode"][value="${preset.mode}"]`);
    if (modeRadio) {
      modeRadio.checked = true;
    }
    if (scenarioSelect) {
      scenarioSelect.value = preset.id;
      scenarioSelect.title = `${preset.label}: ${preset.summary}`;
    }
    processAndDisplay();
  }

  const processAndDisplay = () => {
    try {
      const scenarioKey = distTypeSelect.value;
      const scenario = scenarios[scenarioKey];
      if (!scenario) return;

      const pPeak = Number(pPeakSlider.value);
      const pWidth = Number(pWidthSlider.value);
      const qPeak = Number(qPeakSlider.value);
      const qWidth = Number(qWidthSlider.value);
      const mode = getCurrentMode();

      updateModeVisuals();
      updateSliderValues();

      const P = [];
      const Q = [];
      for (let x = 0; x <= 10; x += 0.1) {
        P.push(gaussian(x, pPeak, pWidth));
        Q.push(gaussian(x, qPeak, qWidth));
      }
      const PNorm = normalize(P);
      const QNorm = normalize(Q);

      const klForward = calculateKL(PNorm, QNorm, 'forward');
      const klReverse = calculateKL(PNorm, QNorm, 'reverse');
      const jsDivergence = calculateKL(PNorm, QNorm, 'symmetric');
      const currentKL = mode === 'forward' ? klForward : mode === 'reverse' ? klReverse : jsDivergence;

      const barsHtml = buildDistributionBars(PNorm, QNorm);

      const html = `
        <div class="space-y-4 text-sm">
          <div class="panel panel-neutral-soft p-3 space-y-1">
            <div class="font-medium text-heading">${scenario.name}</div>
            <p class="text-muted">${scenario.description}</p>
            <div class="small-caption text-muted">${scenario.context}</div>
          </div>

          <div class="grid md:grid-cols-3 gap-3">
            <div class="panel panel-info p-3 text-center space-y-1">
              <div class="text-lg font-bold text-heading">${klForward.toFixed(4)}</div>
              <div class="small-caption text-muted">Forward KL · D(P‖Q)</div>
            </div>
            <div class="panel panel-accent p-3 text-center space-y-1">
              <div class="text-lg font-bold text-heading">${klReverse.toFixed(4)}</div>
              <div class="small-caption text-muted">Reverse KL · D(Q‖P)</div>
            </div>
            <div class="panel panel-success p-3 text-center space-y-1">
              <div class="text-lg font-bold text-heading">${jsDivergence.toFixed(4)}</div>
              <div class="small-caption text-muted">Jensen–Shannon · JS(P,Q)</div>
            </div>
          </div>

          <div class="panel panel-neutral p-4 space-y-3">
            <div class="flex items-center justify-between">
              <h5 class="font-medium text-heading">Distribution visualisation</h5>
              <span class="chip chip-neutral text-xs">Normalised probability mass</span>
            </div>
            <div class="flex items-end justify-between gap-1 h-32">${barsHtml}</div>
            <div class="flex justify-between text-xs text-muted px-1">
              <span>0</span>
              <span>2.5</span>
              <span>5.0</span>
              <span>7.5</span>
              <span>10</span>
            </div>
            <div class="grid md:grid-cols-3 gap-3 text-xs">
              <div class="panel panel-neutral-soft p-3 space-y-2">
                <div class="font-medium text-heading text-center">Legend</div>
                <div class="flex items-center justify-center gap-2">
                  <span style="display:inline-block;width:0.85rem;height:0.5rem;background:var(--tone-sky-strong);border-radius:0.2rem;opacity:0.85;"></span>
                  <span class="text-muted">P (target)</span>
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span style="display:inline-block;width:0.85rem;height:0.5rem;background:var(--tone-purple-strong);border-radius:0.2rem;opacity:0.85;"></span>
                  <span class="text-muted">Q (approximation)</span>
                </div>
              </div>
              <div class="panel panel-info p-3 text-center space-y-1">
                <div class="font-medium text-heading">Distribution P</div>
                <div>Peak µ = <span class="font-mono">${pPeak.toFixed(1)}</span></div>
                <div>Width σ = <span class="font-mono">${pWidth.toFixed(1)}</span></div>
                <div>Max mass = <span class="font-mono">${Math.max(...PNorm).toFixed(4)}</span></div>
              </div>
              <div class="panel panel-accent p-3 text-center space-y-1">
                <div class="font-medium text-heading">Distribution Q</div>
                <div>Peak µ = <span class="font-mono">${qPeak.toFixed(1)}</span></div>
                <div>Width σ = <span class="font-mono">${qWidth.toFixed(1)}</span></div>
                <div>Max mass = <span class="font-mono">${Math.max(...QNorm).toFixed(4)}</span></div>
              </div>
            </div>
          </div>

          <div class="panel ${modePanelMap[mode] || 'panel-info'} panel-emphasis p-4 text-center space-y-1">
            <div class="text-2xl font-bold text-heading">${currentKL.toFixed(6)}</div>
            <div class="small-caption text-muted">Current focus · ${modeNames[mode]}</div>
          </div>
        </div>
      `;

      output.innerHTML = html;
      typesetMath(output);

      if (legend) {
        legend.textContent = `Scenario: ${scenario.name} | P: μ=${pPeak.toFixed(1)}, σ=${pWidth.toFixed(1)} | Q: μ=${qPeak.toFixed(1)}, σ=${qWidth.toFixed(1)} | Mode: ${modeNames[mode]}`;
      }

      if (explanation) {
        let text = '';
        if (mode === 'forward') {
          text = `<strong>Forward KL D(P‖Q) = ${klForward.toFixed(4)}:</strong> Measures information lost when using Q to approximate P — ideal for knowledge distillation and maximum-likelihood training.`;
          if (klForward < 0.01) {
            text += ' Excellent match: the approximation captures the reference distribution.';
          } else if (klForward < 0.1) {
            text += ' Minor mismatch: monitor but generally acceptable.';
          } else {
            text += ' Significant divergence: the student is omitting important probability mass.';
          }
        } else if (mode === 'reverse') {
          text = `<strong>Reverse KL D(Q‖P) = ${klReverse.toFixed(4)}:</strong> Emphasises mode-seeking behaviour, commonly used in variational inference and GAN critics.`;
        } else {
          text = `<strong>Jensen-Shannon JS(P,Q) = ${jsDivergence.toFixed(4)}:</strong> Symmetric and bounded, giving a stable similarity score between the two distributions.`;
        }
        text += ` <strong>LLM context:</strong> In ${scenario.name.toLowerCase()}, this quantifies ${scenario.context.toLowerCase()}.`;
        explanation.innerHTML = text;
        typesetMath(explanation);
      }
    } catch (error) {
      console.error('Error in processAndDisplay:', error);
      output.innerHTML = '<div class="panel panel-warning p-3 text-sm">Error processing data. Please try again.</div>';
    }
  };

  if (scenarioSelect) {
    quickScenarios.forEach(preset => {
      let option = scenarioSelect.querySelector(`option[value="${preset.id}"]`);
      if (!option) {
        option = document.createElement('option');
        option.value = preset.id;
        scenarioSelect.appendChild(option);
      }
      option.textContent = preset.label;
      option.dataset.summary = preset.summary;
      option.title = `${preset.label}: ${preset.summary}`;
    });

    scenarioSelect.addEventListener('change', () => {
      const preset = quickScenarios.find(item => item.id === scenarioSelect.value);
      if (!preset) {
        scenarioSelect.title = 'Choose a preset scenario';
        processAndDisplay();
        return;
      }
      applyQuickScenario(preset);
    });

    scenarioSelect.title = 'Choose a preset scenario';
  }

  distTypeSelect.addEventListener('change', () => {
    applyScenario(distTypeSelect.value);
    clearScenarioSelection();
    processAndDisplay();
  });

  [pPeakSlider, pWidthSlider, qPeakSlider, qWidthSlider].forEach(slider => {
    slider.addEventListener('input', () => {
      clearScenarioSelection();
      processAndDisplay();
    });
  });

  modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      clearScenarioSelection();
      processAndDisplay();
    });
  });

  applyScenario(distTypeSelect.value);
  updateModeVisuals();
  processAndDisplay();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question29Interactive = interactiveScript;
}
