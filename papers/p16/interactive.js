const interactiveScript = () => {
  const root = document.getElementById('p16-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p16-scenario'));
  const coverageEl = document.getElementById('p16-metric-coverage');
  const productivityEl = document.getElementById('p16-metric-productivity');
  const bottleneckEl = document.getElementById('p16-metric-bottleneck');
  const leversEl = document.getElementById('p16-levers');
  const contextLabelEl = document.getElementById('p16-context-label');
  const summaryEl = document.getElementById('p16-summary');
  const actionsEl = document.getElementById('p16-actions');

  const SCENARIOS = {
    baseline: {
      label: 'Human-led lab',
      coverage: '20%',
      productivity: '~1.1× humans',
      bottleneck: 'Labs & talent',
      levers: [
        {
          title: 'Where AI helps',
          detail: 'Automates literature reviews, code snippets, and basic analytics, freeing scientists for design and interpretation.'
        },
        {
          title: 'What still limits progress',
          detail: 'Hands-on experiments, data quality, and specialist judgement dominate the timeline.'
        }
      ],
      summary: 'Low coverage keeps humans in the driver\'s seat. Investments should target near-term copilots and better tooling rather than massive automation.',
      actions: [
        'Catalog repetitive tasks suitable for copilots and measure time saved.',
        'Upgrade data management so AI assists don\'t struggle with messy inputs.'
      ]
    },
    cobotics: {
      label: 'Hybrid copilots',
      coverage: '55%',
      productivity: '3× on covered tasks',
      bottleneck: 'Bottlenecks shifting',
      levers: [
        {
          title: 'Where AI helps',
          detail: 'Designs experiments, drafts code, spots patterns in multimodal datasets, and accelerates simulation sweeps.'
        },
        {
          title: 'What still limits progress',
          detail: 'Physical lab throughput, regulatory reviews, and compute budgets start to dominate cycle time.'
        }
      ],
      summary: 'Balanced coverage means AI meaningfully boosts R&D but new bottlenecks appear. Monitor throughput and resource constraints closely.',
      actions: [
        'Automate lab workflows (robots, digital twins) so experiments keep pace with AI-generated hypotheses.',
        'Negotiate compute and data-sharing agreements before demand spikes.'
      ]
    },
    machine: {
      label: 'Machine-dominant',
      coverage: '85%',
      productivity: '10×+ on most tasks',
      bottleneck: 'External constraints',
      levers: [
        {
          title: 'Where AI helps',
          detail: 'Runs most ideation, modelling, and drafting work with superhuman accuracy and speed.'
        },
        {
          title: 'What still limits progress',
          detail: 'Physical validation capacity, safety/regulatory approvals, and strategic oversight become the gating factors.'
        }
      ],
      summary: 'Intelligence is abundant; complementary inputs determine progress. Organisations must shift investment toward bottleneck relief and governance.',
      actions: [
        'Expand automated labs, clinical infrastructure, or simulation environments to absorb AI output.',
        'Stand up oversight teams focused on safety, ethics, and strategic deployment of machine-generated discoveries.'
      ]
    }
  };

  const setActive = (scenarioKey) => {
    scenarioButtons.forEach((btn) => {
      const isActive = btn.dataset.scenario === scenarioKey;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.baseline;
    setActive(scenarioKey);
    coverageEl.textContent = scenario.coverage;
    productivityEl.textContent = scenario.productivity;
    bottleneckEl.textContent = scenario.bottleneck;
    contextLabelEl.textContent = scenario.label;
    leversEl.innerHTML = scenario.levers
      .map((lever) => `
        <div class="panel panel-neutral-soft p-3 text-xs space-y-1">
          <div class="font-semibold">${lever.title}</div>
          <p class="panel-muted">${lever.detail}</p>
        </div>
      `)
      .join('');
    summaryEl.textContent = scenario.summary;
    actionsEl.innerHTML = scenario.actions.map((item) => `<li>${item}</li>`).join('');
  };

  scenarioButtons.forEach((btn) => {
    btn.addEventListener('click', () => render(btn.dataset.scenario));
  });

  render('baseline');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper16Interactive = interactiveScript;
}
