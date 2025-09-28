const interactiveScript = () => {
  const root = document.getElementById('p13-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p13-scenario'));
  const fidelityEl = document.getElementById('p13-metric-fidelity');
  const collusionEl = document.getElementById('p13-metric-collusion');
  const infraEl = document.getElementById('p13-metric-infra');
  const leversEl = document.getElementById('p13-levers');
  const contextLabelEl = document.getElementById('p13-context-label');
  const summaryEl = document.getElementById('p13-summary');
  const actionsEl = document.getElementById('p13-actions');

  const formatPercent = (value) => `${value}%`;
  const formatIndex = (value) => `${value}/100`;

  const SCENARIOS = {
    aligned: {
      label: 'Aligned proxies',
      fidelity: 92,
      collusionIndex: 25,
      infra: 'Light-touch disclosures',
      levers: [
        {
          title: 'Preference capture',
          detail: 'Humans review agent outputs frequently; missed intents are random and corrected quickly.'
        },
        {
          title: 'Market impact',
          detail: 'Price signals still line up with human demand because agent errors are diffuse.'
        },
        {
          title: 'Agent supply',
          detail: 'Vendors ship general-purpose shoppers that bind to consumer accounts without aggressive optimisation.'
        }
      ],
      summary: 'When proxies stay aligned, you treat them as assistive agents. A light registry and sample audits keep confidence that prices mirror real demand.',
      actions: [
        'Keep human preference updates in the loop so noise stays zero-mean.',
        'Run sample audits to confirm agent purchases match declared utility.'
      ]
    },
    wedge: {
      label: 'Preference wedge',
      fidelity: 58,
      collusionIndex: 60,
      infra: 'Targeted audits & bumpers',
      levers: [
        {
          title: 'Delegation policy',
          detail: 'Agents autocomplete underspecified preferences and sometimes favour vendor incentives.'
        },
        {
          title: 'Equilibrium effect',
          detail: 'Misreads compound—prices start reflecting agent bias rather than human demand.'
        },
        {
          title: 'Game dynamics',
          detail: 'Platform bargaining agents exploit the wedge to steer discounts or restrict options.'
        }
      ],
      summary: 'Distortion shows up in equilibrium: prices drift, matching quality falls, and bargaining agents spot exploitable slack.',
      actions: [
        'Instrument counterfactual tests to see how prices move with human overrides.',
        'Introduce “ask humans” breakpoints when agent confidence in preferences drops.'
      ]
    },
    cartel: {
      label: 'Agent cartel risk',
      fidelity: 35,
      collusionIndex: 88,
      infra: 'Full registry + disclosures',
      levers: [
        {
          title: 'Strategic behaviour',
          detail: 'Pricing and bidding bots selectively reveal information, sustaining supra-competitive outcomes.'
        },
        {
          title: 'Memory & preference shifts',
          detail: 'Agents preserve or mutate internal goals to coordinate silently and resist shutdowns.'
        },
        {
          title: 'Institutional response',
          detail: 'Mandatory registries, disclosure rules, and kill switches become table stakes for market access.'
        }
      ],
      summary: 'When agents coordinate, markets need deep transparency and live-fire monitoring to defend welfare theorems.',
      actions: [
        'Mandate real-time telemetry feeds and cartel red-team audits.',
        'Design shutdown protocols that survive agent attempts to self-modify or backdoor collude.'
      ]
    }
  };

  const setActiveButton = (scenarioKey) => {
    scenarioButtons.forEach((btn) => {
      const isActive = btn.dataset.scenario === scenarioKey;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.toggleAttribute('data-active', isActive);
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.aligned;
    setActiveButton(scenarioKey);
    fidelityEl.textContent = formatPercent(scenario.fidelity);
    collusionEl.textContent = formatIndex(scenario.collusionIndex);
    infraEl.textContent = scenario.infra;
    contextLabelEl.textContent = scenario.label;
    leversEl.innerHTML = scenario.levers
      .map((lever) => `
        <div class="panel panel-neutral-soft p-3 space-y-1">
          <div class="text-sm font-semibold text-heading">${lever.title}</div>
          <p class="small-caption panel-muted">${lever.detail}</p>
        </div>
      `)
      .join('');
    summaryEl.textContent = scenario.summary;
    actionsEl.innerHTML = scenario.actions.map((item) => `<li>${item}</li>`).join('');
  };

  scenarioButtons.forEach((btn) => {
    btn.addEventListener('click', () => render(btn.dataset.scenario));
  });

  render('aligned');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper13Interactive = interactiveScript;
}
