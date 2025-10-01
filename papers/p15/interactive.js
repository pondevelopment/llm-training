const interactiveScript = () => {
  const root = document.getElementById('p15-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p15-scenario'));
  const wageEl = document.getElementById('p15-metric-wage');
  const cpiEl = document.getElementById('p15-metric-cpi');
  const varietyEl = document.getElementById('p15-metric-variety');
  const leakEl = document.getElementById('p15-metric-leak');
  const leversEl = document.getElementById('p15-levers');
  const contextLabelEl = document.getElementById('p15-context-label');
  const summaryEl = document.getElementById('p15-summary');
  const actionsEl = document.getElementById('p15-actions');

  const ACTIVE_CLASSES = [
    'bg-indigo-600',
    'text-white',
    'border-indigo-600',
    'shadow-sm'
  ];

  const INACTIVE_CLASSES = [
    'bg-card',
    'text-secondary',
    'border-subtle',
    'hover:bg-subtle'
  ];

  const SUBTITLE_ACTIVE = ['text-white'];
  const SUBTITLE_INACTIVE = ['text-muted'];

  const SCENARIOS = {
    model1: {
      label: 'Model 1 - traded baseline',
      wage: '-1.2% real wage',
      cpi: 'Flat (trade cushions)',
      variety: 'Stable',
      leakage: 'Medium (usage fees)',
      levers: [
        {
          title: 'Skill intensity flip',
          detail: 'As AI gets cheaper the exporting sector becomes skill-intensive, so unskilled wages fall even before markups bite.'
        },
        {
          title: 'Usage markups',
          detail: 'With only per-unit fees, income leakage tracks the volume of AI calls and scales with export share.'
        }
      ],
      summary: 'Traded-goods logic isolates the substitution shock: unskilled wages fall when AI substitutes for them, yet CPI stays anchored by imports.',
      actions: [
        'Instrument sectoral wage data against AI input prices to detect intensity reversals early.',
        'Model vendor usage fees as tariff equivalents when comparing supplier options.'
      ]
    },
    model2: {
      label: 'Model 2 - non-traded CPI channel',
      wage: '-3.8% real wage',
      cpi: '+2.5% CPI',
      variety: 'Modest drop',
      leakage: 'High via usage fees',
      levers: [
        {
          title: 'Non-traded exposure',
          detail: 'AI expansion pulls labour out of non-tradables; scarcer local services spike prices and drag real wages for everyone.'
        },
        {
          title: 'Pass-through',
          detail: 'Firms pass usage markups into prices, so CPI absorbs both the competitive and monopoly components.'
        }
      ],
      summary: 'Once non-traded sectors matter, CPI pressure aligns the global and local harms—higher AI prices make workers even worse off.',
      actions: [
        'Stress-test inflation baskets to see where AI adoption reduces local service supply.',
        'Bundle CPI relief or VAT cuts with AI rollouts that raise usage intensity.'
      ]
    },
    model3: {
      label: 'Model 3 - adoption frontier',
      wage: '-4.5% real wage',
      cpi: '+1.0% CPI',
      variety: '-12% varieties',
      leakage: 'Very high (dual fees)',
      levers: [
        {
          title: 'Frontier binding',
          detail: 'Firms adopt only when usage and access fees sit on the frontier; displaced labour raises the outside option and tightens the bound.'
        },
        {
          title: 'Variety loss',
          detail: 'Access fees leak cash abroad and ration entry, shrinking the product menu even if unit costs fall.'
        }
      ],
      summary: 'Monopolists exploit two levers simultaneously. Without dual regulation, adoption occurs on the boundary with maximum leakage.',
      actions: [
        'Demand transparent reporting of fee ladders and effective prices per inference and per seat.',
        'Simulate adoption thresholds with labour shock scenarios before committing to vendor contracts.'
      ]
    },
    policy: {
      label: 'Policy mix - dual-fee cap',
      wage: '+1.8% real wage',
      cpi: '+0.3% CPI (managed)',
      variety: '+8% varieties',
      leakage: 'Low (rebated)',
      levers: [
        {
          title: 'Two-part discipline',
          detail: 'Coordinated caps or auctions on both usage and access fees keep the monopolist inside the adoption frontier.'
        },
        {
          title: 'Labour absorption',
          detail: 'Funded reskilling and public-service demand absorb displaced workers, preventing CPI spikes.'
        }
      ],
      summary: 'Regulating both levers and recycling fee revenue into labour programmes restores welfare gains and keeps variety onshore.',
      actions: [
        'Negotiate claw-back clauses that recycle access fees into domestic variety investments.',
        'Pair fee caps with sectoral hiring or training credits to keep non-traded supply elastic.'
      ]
    }
  };

  const setActive = (scenarioKey) => {
    scenarioButtons.forEach((btn) => {
      const isActive = btn.dataset.scenario === scenarioKey;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      if (isActive) {
        btn.classList.remove(...INACTIVE_CLASSES);
        btn.classList.add(...ACTIVE_CLASSES);
      } else {
        btn.classList.remove(...ACTIVE_CLASSES);
        btn.classList.add(...INACTIVE_CLASSES);
      }

      const subtitle = btn.querySelector('.p15-scenario-sub');
      if (subtitle) {
        if (isActive) {
          subtitle.classList.remove(...SUBTITLE_INACTIVE);
          subtitle.classList.add(...SUBTITLE_ACTIVE);
        } else {
          subtitle.classList.remove(...SUBTITLE_ACTIVE);
          subtitle.classList.add(...SUBTITLE_INACTIVE);
        }
      }
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.model1;
    setActive(scenarioKey);
    wageEl.textContent = scenario.wage;
    cpiEl.textContent = scenario.cpi;
    varietyEl.textContent = scenario.variety;
    leakEl.textContent = scenario.leakage;
    contextLabelEl.textContent = scenario.label;
    leversEl.innerHTML = scenario.levers
      .map((lever) => `
        <div class="panel panel-neutral-soft p-3 space-y-1 text-xs">
          <div class="font-semibold text-heading">${lever.title}</div>
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

  render('model1');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper15Interactive = interactiveScript;
}
