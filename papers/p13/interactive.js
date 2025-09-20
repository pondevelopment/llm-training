const interactiveScript = () => {
  const root = document.getElementById('p13-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p13-scenario'));
  const autonomyEl = document.getElementById('p13-metric-autonomy');
  const oversightEl = document.getElementById('p13-metric-oversight');
  const infraEl = document.getElementById('p13-metric-infra');
  const leversEl = document.getElementById('p13-levers');
  const contextLabelEl = document.getElementById('p13-context-label');
  const summaryEl = document.getElementById('p13-summary');
  const actionsEl = document.getElementById('p13-actions');

  const formatPercent = (value) => `${value}%`;
  const formatHours = (value) => `${value}h`;

  const SCENARIOS = {
    baseline: {
      label: 'Human-in-loop workflows',
      autonomy: 20,
      oversightHours: 35,
      infra: 'Foundational',
      levers: [
        {
          title: 'Agent role',
          detail: 'Agents draft, summarise, or recommend. Humans click every commitment button.'
        },
        {
          title: 'Control surface',
          detail: 'Logs and approvals live inside existing workflow tools; no specialised runtime monitoring.'
        },
        {
          title: 'Risk exposure',
          detail: 'Economic impact capped because humans veto transactions and escalate edge cases.'
        }
      ],
      summary: 'AI augments teams but humans remain accountable. Focus on accuracy, ergonomics, and building telemetry you can scale later.',
      actions: [
        'Instrument basic logging so you know what the proto-agent touched.',
        'Document escalation rules and thresholds before autonomy expands.'
      ]
    },
    pilot: {
      label: 'Agent pilot with guardrails',
      autonomy: 55,
      oversightHours: 12,
      infra: 'Structured',
      levers: [
        {
          title: 'Agent role',
          detail: 'Agents negotiate and execute bounded transactions inside sandboxed accounts.'
        },
        {
          title: 'Control surface',
          detail: 'Dedicated dashboards track objectives, reward metrics, and anomaly alerts in real time.'
        },
        {
          title: 'Risk exposure',
          detail: 'Financial limits, watchdog processes, and mandatory audits mitigate misaligned incentives.'
        }
      ],
      summary: 'Autonomy covers end-to-end tasks, but you still enforce caps, audits, and human override. Institutions level up alongside capability.',
      actions: [
        'Deploy runtime monitors that flag off-policy behaviour within minutes.',
        'Schedule independent audits to probe for hidden collusion or reward hacking.'
      ]
    },
    open: {
      label: 'Open agent marketplace',
      autonomy: 85,
      oversightHours: 4,
      infra: 'Advanced',
      levers: [
        {
          title: 'Agent role',
          detail: 'Agents source counterparties, sign contracts, and manage portfolios with minimal human review.'
        },
        {
          title: 'Control surface',
          detail: 'Identity registries, provenance tags, and programmable guardrails coordinate thousands of agents.'
        },
        {
          title: 'Risk exposure',
          detail: 'Systemic spillovers possible; regulators and platforms demand insurance, throttles, and kill switches.'
        }
      ],
      summary: 'At scale you treat agents as participants in markets. Success hinges on shared infrastructure, liability regimes, and fast-response controls.',
      actions: [
        'Join or build registries that certify agent capabilities and accountability chains.',
        'Model contagion scenarios and rehearse crisis responses for flash-crash style failures.'
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
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.baseline;
    setActive(scenarioKey);
    autonomyEl.textContent = formatPercent(scenario.autonomy);
    oversightEl.textContent = formatHours(scenario.oversightHours);
    infraEl.textContent = scenario.infra;
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

  render('baseline');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper13Interactive = interactiveScript;
}