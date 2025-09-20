const interactiveScript = () => {
  const root = document.getElementById('p12-lab');
  if (!root) return;

  const scenarioButtons = Array.from(root.querySelectorAll('.p12-scenario'));
  const centralEl = document.getElementById('p12-metric-central');
  const tacitEl = document.getElementById('p12-metric-tacit');
  const policyEl = document.getElementById('p12-metric-policy');
  const leversEl = document.getElementById('p12-levers');
  const contextLabelEl = document.getElementById('p12-context-label');
  const summaryEl = document.getElementById('p12-summary');
  const actionsEl = document.getElementById('p12-actions');

  const formatScore = (score) => `${score}`;

  const SCENARIOS = {
    legacy: {
      label: 'Pre-AI decentralised',
      centralisation: 42,
      tacitValue: 88,
      policyPressure: 'Low',
      levers: [
        {
          title: 'Tacit knowledge moat',
          detail: 'Frontline teams hold embodied know-how that resists codification.'
        },
        {
          title: 'Limited HQ bandwidth',
          detail: 'Central teams cannot process enough signals to micromanage regions.'
        },
        {
          title: 'Light-touch regulation',
          detail: 'Few guardrails force HQ transparency, but decentralisation persists by necessity.'
        }
      ],
      summary: 'Decision rights stay local because tacit expertise is sticky and headquarters lack the compute to script every scenario.',
      actions: [
        'Catalogue which workflows still rely on tacit or embodied knowledge.',
        'Invest in documentation and shared tooling before adopting central AI planners.'
      ]
    },
    central: {
      label: 'AI control tower',
      centralisation: 86,
      tacitValue: 34,
      policyPressure: 'Medium',
      levers: [
        {
          title: 'Codified playbooks',
          detail: 'TAI converts local routines into reusable digital assets owned by HQ.'
        },
        {
          title: 'Expanded planning capacity',
          detail: 'Large models simulate pricing, routing, and staffing across the enterprise in real time.'
        },
        {
          title: 'Ownership consolidation',
          detail: 'HQ controls the AI stack and data, internalising more surplus and decision rights.'
        }
      ],
      summary: 'Codification plus superior planning makes it rational to centralise; branches execute centrally scripted decisions while HQ accumulates bargaining power.',
      actions: [
        'Stand up an AI “control tower” and integrate feeds from all business units.',
        'Build escalation paths and transparency logs to sustain trust as HQ absorbs decisions.'
      ]
    },
    hybrid: {
      label: 'Guardrailed hybrid',
      centralisation: 65,
      tacitValue: 62,
      policyPressure: 'High',
      levers: [
        {
          title: 'Selective codification',
          detail: 'AI handles repeatable work but flags long-tail cases for local judgment.'
        },
        {
          title: 'Latency & compliance constraints',
          detail: 'Physical operations and licensing rules keep regional discretion in the loop.'
        },
        {
          title: 'Policy guardrails',
          detail: 'Transparency, antitrust risk, and fiduciary duties limit over-centralisation.'
        }
      ],
      summary: 'Central AI augments planning yet keeps local teams empowered on edge cases, aligning with regulatory expectations while capturing scale gains.',
      actions: [
        'Define RACI matrices that specify which AI scripts vs. which humans approve decisions.',
        'Instrument policy/compliance dashboards that monitor concentration and decision latency.'
      ]
    }
  };

  const setActiveButton = (scenarioKey) => {
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
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.legacy;
    setActiveButton(scenarioKey);
    centralEl.textContent = formatScore(scenario.centralisation);
    tacitEl.textContent = formatScore(scenario.tacitValue);
    policyEl.textContent = scenario.policyPressure;
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
    btn.addEventListener('click', () => {
      render(btn.dataset.scenario);
    });
  });

  render('legacy');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper12Interactive = interactiveScript;
}