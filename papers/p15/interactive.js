const interactiveScript = () => {
  const root = document.getElementById('p15-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p15-scenario'));
  const wageEl = document.getElementById('p15-metric-wage');
  const varietyEl = document.getElementById('p15-metric-variety');
  const leakEl = document.getElementById('p15-metric-leak');
  const leversEl = document.getElementById('p15-levers');
  const contextLabelEl = document.getElementById('p15-context-label');
  const summaryEl = document.getElementById('p15-summary');
  const actionsEl = document.getElementById('p15-actions');

  const SCENARIOS = {
    bench: {
      label: 'Competitive benchmark',
      wage: '+2.5% real wage',
      variety: '+3% variety gain',
      leakage: 'Minimal',
      levers: [
        {
          title: 'Pricing environment',
          detail: 'Usage and access fees track marginal cost; productivity gains flow through to wages and consumers.'
        },
        {
          title: 'Labour dynamics',
          detail: 'Unskilled workers share in gains because displaced labour is reabsorbed at similar wages.'
        }
      ],
      summary: 'Efficient pricing plus absorption of displaced labour yields broad-based gains. Benchmark for what policy should aim to replicate.',
      actions: [
        'Monitor AI input markets to detect emerging markups or foreclosure.',
        'Invest in labour-market programmes that sustain reemployment speed.'
      ]
    },
    usage: {
      label: 'Usage fee markups',
      wage: '\u22123.5% real wage',
      variety: '+1.5% (muted)',
      leakage: 'High via usage fees',
      levers: [
        {
          title: 'Incidence',
          detail: 'Per-inference fees raise unit costs, firms pass through to prices, and unskilled workers face substitution and lower wages.'
        },
        {
          title: 'Policy lever',
          detail: 'Cap or index usage fees to proven productivity; encourage multi-sourcing and cost transparency.'
        }
      ],
      summary: 'Even with efficiency gains, monopolistic usage pricing pushes rents offshore and erodes real wages.',
      actions: [
        'Audit contracts for per-inference escalators and renegotiate volume tiers.',
        'Advocate competition remedies (interoperability, data portability) to reduce markup power.'
      ]
    },
    access: {
      label: 'Access fee markups',
      wage: '\u22122% real wage',
      variety: '\u22124% (variety loss)',
      leakage: 'High via access tolls',
      levers: [
        {
          title: 'Incidence',
          detail: 'Seat/platform fees ration entry; fewer firms adopt, variety shrinks, and labour absorption weakens.'
        },
        {
          title: 'Policy lever',
          detail: 'Treat access tolls like platform rents—enforce FRAND terms, prevent bundling, and support open alternatives.'
        }
      ],
      summary: 'Limiting access throttles competition downstream and worsens welfare despite higher productivity potential.',
      actions: [
        'Press regulators for access remedies (unbundling, mandatory APIs).',
        'Support open-source or public options to maintain competitive pressure.'
      ]
    }
  };

  const setActive = (scenarioKey) => {
    scenarioButtons.forEach((btn) => {
      const isActive = btn.dataset.scenario === scenarioKey;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) {
        btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
        btn.classList.remove('bg-white', 'text-indigo-700');
      } else {
        btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
        btn.classList.add('bg-white', 'text-indigo-700');
      }
      const subtitle = btn.querySelector('.p15-scenario-sub');
      if (subtitle) {
        if (isActive) {
          subtitle.classList.remove('text-slate-500');
          subtitle.classList.add('text-indigo-100');
        } else {
          subtitle.classList.remove('text-indigo-100');
          subtitle.classList.add('text-slate-500');
        }
      }
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.bench;
    setActive(scenarioKey);
    wageEl.textContent = scenario.wage;
    varietyEl.textContent = scenario.variety;
    leakEl.textContent = scenario.leakage;
    contextLabelEl.textContent = scenario.label;
    leversEl.innerHTML = scenario.levers
      .map((lever) => `
        <div class="bg-slate-50 border border-slate-200 rounded-md p-3">
          <div class="text-xs font-semibold text-slate-900">${lever.title}</div>
          <p class="text-[11px] text-slate-700 mt-1">${lever.detail}</p>
        </div>
      `)
      .join('');
    summaryEl.textContent = scenario.summary;
    actionsEl.innerHTML = scenario.actions.map((item) => `<li>${item}</li>`).join('');
  };

  scenarioButtons.forEach((btn) => {
    btn.addEventListener('click', () => render(btn.dataset.scenario));
  });

  render('bench');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper15Interactive = interactiveScript;
}