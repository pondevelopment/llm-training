
const interactiveScript = () => {
  const root = document.getElementById('p07-explorer');
  if (!root) return;

  const els = {
    buttons: document.getElementById('p07-mode-buttons'),
    controls: document.getElementById('p07-stage-controls'),
    metric: document.getElementById('p07-stage-metric'),
    heading: document.getElementById('p07-stage-heading'),
    subheading: document.getElementById('p07-stage-subheading'),
    insights: document.getElementById('p07-insights'),
    actions: document.getElementById('p07-actions')
  };

  if (!els.buttons || !els.controls || !els.metric || !els.heading || !els.subheading || !els.insights || !els.actions) {
    return;
  }

  // Keep the metric box width stable so layout doesn't shift when values change.
  els.metric.style.minWidth = '12rem';
  els.metric.style.flex = '0 0 auto';

  let metricWidthObserver = null;
  const syncMetricWidth = () => {
    const reference = els.controls.firstElementChild;
    if (!reference) return;
    const width = reference.getBoundingClientRect().width;
    if (Number.isFinite(width) && width > 0) {
      els.metric.style.width = width + 'px';
    }
  };

  const observeMetricWidth = () => {
    if (typeof ResizeObserver !== 'function') {
      syncMetricWidth();
      return;
    }
    if (metricWidthObserver) {
      metricWidthObserver.disconnect();
    }
    const reference = els.controls.firstElementChild;
    if (!reference) return;
    metricWidthObserver = new ResizeObserver(syncMetricWidth);
    metricWidthObserver.observe(reference);
    syncMetricWidth();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', syncMetricWidth);
  }

  const clamp01 = value => {
    if (Number.isNaN(value)) return 0;
    return Math.min(1, Math.max(0, value));
  };

  const formatPercent = value => {
    const safe = clamp01(value);
    return (Math.round(safe * 1000) / 10).toFixed(1) + '%';
  };

  const majorityProbability = (experts, accuracy) => {
    const n = Math.max(1, Math.floor(experts));
    const p = clamp01(accuracy);
    if (p === 0) return 0;
    if (p === 1) return 1;
    const threshold = Math.floor(n / 2) + 1;
    let prob = Math.pow(1 - p, n);
    let total = threshold === 0 ? prob : 0;
    for (let k = 0; k < n; k += 1) {
      const nextProb = prob * ((n - k) / (k + 1)) * (p / (1 - p));
      prob = nextProb;
      if (k + 1 >= threshold) {
        total += prob;
      }
    }
    return clamp01(total);
  };

  const selectionAccuracy = (experts, coverage, alpha) => {
    const diversityLift = 1 - Math.exp(-experts * 0.04);
    const routingBias = Math.pow(alpha, 2);
    const base = coverage;
    const gain = (1 - base) * diversityLift * routingBias;
    return clamp01(base + gain);
  };

  const generalisationAccuracy = (twoHopExamples, phrasingScale) => {
    const coverageGain = Math.min(1, twoHopExamples / 80000);
    const phrasingLift = 0.1 + (phrasingScale - 1) * 0.05;
    const accuracy = 0.1 + 0.45 * coverageGain * (0.6 + phrasingLift);
    return clamp01(accuracy);
  };

  const MODE_CONFIG = {
    denoise: {
      label: 'Skill denoising',
      heading: 'Majority vote beats noisy experts',
      subheading: 'Turn uncorrelated mistakes into reliable answers',
      defaults: { experts: 100, accuracy: 0.2 },
      insights: [
        'As the expert pool grows, uncorrelated mistakes cancel and greedy decoding recovers the shared signal.',
        'Matches the paper: 100 experts with only 20% coverage still reach well above 80% accuracy.'
      ],
      actions: [
        'Check whether annotation suppliers make independent errors before banking on denoising.',
        'Run temperature sweeps; if greedy decoding beats solo experts, you are in the denoising regime.'
      ],
      controls: [
        {
          key: 'experts',
          label: 'How many experts share data?',
          min: 1,
          max: 150,
          step: 1,
          helper: "More experts mean each person's random mistakes cancel out.",
          formatter: value => Math.round(value).toString()
        },
        {
          key: 'accuracy',
          label: 'Solo expert accuracy',
          min: 0.1,
          max: 0.9,
          step: 0.01,
          helper: 'Matches the coverage parameter c in the paper.',
          formatter: value => Number(value).toFixed(2)
        }
      ],
      compute: params => {
        const baseline = params.accuracy;
        const model = majorityProbability(params.experts, params.accuracy);
        const note = 'With ' + Math.round(params.experts) + ' experts hitting ' + formatPercent(baseline) + ' alone, greedy decoding climbs to ' + formatPercent(model) + '.';
        return { baseline, model, note };
      }
    },
    selection: {
      label: 'Skill selection',
      heading: 'Exposure favours the right specialist',
      subheading: 'Let the right expert answer more often',
      defaults: { experts: 60, alpha: 0.96, coverage: 0.1 },
      insights: [
        'Alpha controls how often specialists speak inside their lane; higher values mean the learner hears the right answer more frequently.',
        'Scaling the specialist pool widens coverage so the mixture can route to a domain expert for each input.'
      ],
      actions: [
        'Tag training data with domain metadata so routing signals survive fine-tuning.',
        'Balance annotation spend across distinct clusters; oversampling one domain will not unlock selection gains.'
      ],
      controls: [
        {
          key: 'experts',
          label: 'How many specialists?',
          min: 1,
          max: 120,
          step: 1,
          helper: 'More specialists cover more of the graph.',
          formatter: value => Math.round(value).toString()
        },
        {
          key: 'alpha',
          label: 'Share of time they speak in-lane',
          min: 0.6,
          max: 1,
          step: 0.01,
          helper: 'Higher alpha means specialists mostly write about what they know.',
          formatter: value => Number(value).toFixed(2)
        },
        {
          key: 'coverage',
          label: 'Expert correctness in their lane',
          min: 0.01,
          max: 0.3,
          step: 0.01,
          helper: 'Matches the shared coverage level c.',
          formatter: value => Number(value).toFixed(2)
        }
      ],
      compute: params => {
        const baseline = params.coverage;
        const model = selectionAccuracy(params.experts, params.coverage, params.alpha);
        const note = 'Routing lifts success to ' + formatPercent(model) + ' versus ' + formatPercent(baseline) + ' for any single expert.';
        return { baseline, model, note };
      }
    },
    generalise: {
      label: 'Skill generalisation',
      heading: 'Compose knowledge across experts',
      subheading: 'Combine experts to solve questions no one saw',
      defaults: { twoHop: 40000, phrasing: 3 },
      insights: [
        'Within-expertise two-hop scaffolds teach the format so cross-expertise questions become reachable.',
        'Paraphrase diversity nudges the learner toward reusable latent structure instead of rote memorisation.'
      ],
      actions: [
        'Generate synthetic multi-hop demonstrations before expecting cross-domain reasoning.',
        'Track both single-hop and multi-hop recall to expose compositional gaps.'
      ],
      controls: [
        {
          key: 'twoHop',
          label: 'Within-expertise two-hop scaffolds',
          min: 0,
          max: 80000,
          step: 2000,
          helper: 'Teaches the format before we test unseen combinations.',
          formatter: value => Number(value).toLocaleString()
        },
        {
          key: 'phrasing',
          label: 'Unique paraphrase templates',
          min: 1,
          max: 5,
          step: 1,
          helper: 'Varied wording nudges the model toward latent structure.',
          formatter: value => Math.round(value).toString()
        }
      ],
      compute: params => {
        const baseline = 0;
        const model = generalisationAccuracy(params.twoHop, params.phrasing);
        const note = 'No individual expert can answer these cross-cluster questions (≈0%), but with scaffolds the model reaches ' + formatPercent(model) + '.';
        return { baseline, model, note };
      }
    }
  };

  const state = {
    mode: 'denoise',
    params: Object.assign({}, MODE_CONFIG.denoise.defaults)
  };

  const renderInsights = config => {
    els.insights.innerHTML = config.insights.map(text => '<p class="panel-muted">' + text + '</p>').join('');
    els.actions.innerHTML = config.actions.map(text => '<li>' + text + '</li>').join('');
  };

  const renderMetric = result => {
    const delta = result.model - result.baseline;
    const deltaText = (delta >= 0 ? '+' : '') + (Math.round(delta * 1000) / 10).toFixed(1) + ' pts';
    const deltaClass = delta >= 0 ? 'text-success' : 'text-danger';
    const gauge = (value, label, fill) => {
      const safe = clamp01(value);
      const width = safe === 0 ? 0 : Math.max(4, Math.round(safe * 100));
      return '<div class="space-y-1">' +
        '<div class="flex items-center justify-between text-[11px] panel-muted"><span>' + label + '</span><span class="font-mono text-xs text-heading">' + formatPercent(safe) + '</span></div>' +
        '<div class="h-1.5 rounded-full bg-subtle overflow-hidden"><div class="h-full rounded-full" style="width:' + width + '%; background:' + fill + ';"></div></div>' +
        '</div>';
    };
    els.metric.innerHTML = '<div class="space-y-3">' +
      gauge(result.model, 'Mixture model', 'var(--tone-indigo-strong)') +
      gauge(result.baseline, 'Any single expert', 'var(--color-muted)') +
      '<p class="text-[11px] font-medium ' + deltaClass + '">Gap vs solo expert: ' + deltaText + '</p>' +
      '<p class="text-[11px] panel-muted">' + result.note + '</p>' +
      '</div>';
  };

  const createSlider = (config, value) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'panel panel-neutral-soft p-3 space-y-2';

    const label = document.createElement('label');
    label.className = 'flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-heading';
    label.setAttribute('for', 'p07-' + config.key);
    const labelText = document.createElement('span');
    labelText.textContent = config.label;
    label.appendChild(labelText);
    const valueLabel = document.createElement('span');
    valueLabel.className = 'font-mono text-xs text-info';
    valueLabel.textContent = config.formatter(value);
    valueLabel.dataset.valueLabel = config.key;
    label.appendChild(valueLabel);
    wrapper.appendChild(label);

    const input = document.createElement('input');
    input.type = 'range';
    input.id = 'p07-' + config.key;
    input.dataset.param = config.key;
    input.min = config.min;
    input.max = config.max;
    input.step = config.step;
    input.value = value;
    input.className = 'w-full';
    wrapper.appendChild(input);

    const helper = document.createElement('p');
    helper.className = 'text-[11px] panel-muted leading-snug';
    helper.textContent = config.helper;
    wrapper.appendChild(helper);

    return { wrapper, input, valueLabel };
  };

  const renderControls = config => {
    els.controls.innerHTML = '';
    const controlNodes = config.controls.map(ctrl => {
      const value = state.params[ctrl.key];
      const { wrapper, input, valueLabel } = createSlider(ctrl, value);
      els.controls.appendChild(wrapper);
      return { ctrl, input, valueLabel };
    });

    observeMetricWidth();

    controlNodes.forEach(({ ctrl, input, valueLabel }) => {
      input.addEventListener('input', () => {
        const numeric = Number(input.value);
        state.params[ctrl.key] = numeric;
        valueLabel.textContent = ctrl.formatter(numeric);
        updateMetric(config);
      });
    });
  };

  const updateMetric = config => {
    const result = config.compute(state.params);
    renderMetric(result);
  };

  const renderMode = () => {
    const config = MODE_CONFIG[state.mode];
    els.heading.textContent = config.heading;
    els.subheading.textContent = config.subheading;
    renderInsights(config);
    renderControls(config);
    updateMetric(config);
  };

  const renderButtons = () => {
    els.buttons.innerHTML = '';
    Object.keys(MODE_CONFIG).forEach(key => {
      const config = MODE_CONFIG[key];
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.mode = key;
      const active = state.mode === key;
      const baseClass = 'text-xs font-semibold';
      button.className = active
        ? baseClass + ' toggle-active'
        : baseClass + ' toggle-inactive';
      button.textContent = config.label;
      button.addEventListener('click', () => {
        if (state.mode === key) return;
        state.mode = key;
        state.params = Object.assign({}, MODE_CONFIG[key].defaults);
        renderButtons();
        renderMode();
      });
      els.buttons.appendChild(button);
    });
  };

  renderButtons();
  renderMode();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper07Interactive = interactiveScript;
}
