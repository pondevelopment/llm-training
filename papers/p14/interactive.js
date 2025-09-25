const interactiveScript = () => {
  const root = document.getElementById('p14-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p14-scenario'));
  const exposureEl = document.getElementById('p14-metric-exposure');
  const capacityEl = document.getElementById('p14-metric-capacity');
  const priorityEl = document.getElementById('p14-metric-priority');
  const leversEl = document.getElementById('p14-levers');
  const contextLabelEl = document.getElementById('p14-context-label');
  const summaryEl = document.getElementById('p14-summary');
  const actionsEl = document.getElementById('p14-actions');

  const SCENARIOS = {
    resilient: {
      label: 'High exposure / High capacity',
      exposure: 88,
      capacity: 79,
      priority: 'Monitor',
      levers: [
        {
          title: 'Upskill focus',
          detail: 'Lean into AI augmentation, specialise workers into higher-value tasks, and capture productivity gains.'
        },
        {
          title: 'Financial supports',
          detail: 'Light-touch—workers have savings buffers but benefit from innovation stipends and internal mobility grants.'
        },
        {
          title: 'Mobility pathways',
          detail: 'Promote rotations and AI apprenticeship tracks to maintain adaptability.'
        }
      ],
      summary: 'These workers can absorb disruption. Use them as early adopters to prove AI ROI while monitoring for new failure modes.',
      actions: [
        'Co-design AI playbooks with frontline experts and capture best practices for other cohorts.',
        'Set up innovation bonuses tied to measurable productivity improvements.'
      ]
    },
    vulnerable: {
      label: 'High exposure / Low capacity',
      exposure: 85,
      capacity: 32,
      priority: 'Urgent',
      levers: [
        {
          title: 'Upskill focus',
          detail: 'Offer modular programs that bridge to adjacent roles (operations, compliance, customer success).'
        },
        {
          title: 'Financial supports',
          detail: 'Provide wage insurance, emergency savings matches, and childcare subsidies to lower transition friction.'
        },
        {
          title: 'Mobility pathways',
          detail: 'Map alternative roles in higher-capacity regions; negotiate remote or hybrid pathways when relocation is hard.'
        }
      ],
      summary: 'Clerical and administrative workers dominate this quadrant. Without targeted intervention, displacement could hit hardest here.',
      actions: [
        'Launch reskilling cohorts with wraparound services (stipends, coaching, tech access).',
        'Partner with local colleges and workforce boards to guarantee interviews for graduates.'
      ]
    },
    emerging: {
      label: 'Medium exposure / Medium capacity',
      exposure: 62,
      capacity: 55,
      priority: 'Build resilience',
      levers: [
        {
          title: 'Upskill focus',
          detail: 'Blend AI literacy with cross-functional skills (data hygiene, customer empathy, regulatory awareness).'
        },
        {
          title: 'Financial supports',
          detail: 'Offer matched savings and access to low-cost credit to grow buffers before exposure rises.'
        },
        {
          title: 'Mobility pathways',
          detail: 'Pilot talent marketplaces so workers can try on roles with higher adaptive capacity.'
        }
      ],
      summary: 'Prepare this bridge segment now so they do not slip into vulnerability as automation expands.',
      actions: [
        'Publish personalised readiness dashboards combining exposure, skills, and savings tips.',
        'Set quarterly reviews to reassess exposure and capacity metrics as AI pilots scale.'
      ]
    }
  };

  const setActive = (scenarioKey) => {
    scenarioButtons.forEach((btn) => {
      const isActive = btn.dataset.scenario === scenarioKey;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) {
        btn.classList.add('btn-accent');
        btn.classList.remove('bg-card', 'text-accent', 'border-subtle', 'hover:bg-subtle');
      } else {
        btn.classList.remove('btn-accent');
        btn.classList.add('bg-card', 'text-accent', 'border-subtle', 'hover:bg-subtle');
      }
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.resilient;
    setActive(scenarioKey);
    exposureEl.textContent = `${scenario.exposure}th`;
    capacityEl.textContent = `${scenario.capacity}th`;
    priorityEl.textContent = scenario.priority;
    contextLabelEl.textContent = scenario.label;
    leversEl.innerHTML = scenario.levers
      .map((lever) => `
        <div class="bg-card border border-subtle rounded-md p-3">
          <div class="text-xs font-semibold text-heading">${lever.title}</div>
          <p class="text-[11px] text-secondary mt-1">${lever.detail}</p>
        </div>
      `)
      .join('');
    summaryEl.textContent = scenario.summary;
    actionsEl.innerHTML = scenario.actions.map((item) => `<li>${item}</li>`).join('');
  };

  scenarioButtons.forEach((btn) => {
    btn.addEventListener('click', () => render(btn.dataset.scenario));
  });

  render('resilient');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper14Interactive = interactiveScript;
}