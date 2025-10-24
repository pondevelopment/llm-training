(function() {
  'use strict';

  const SCENARIOS = {
    'law-doc-review': {
      name: 'Law: AI Document Review',
      defending: {
        desc: 'Lawyers relinquish routine document screening to Kira/Luminance AI systems, restating that professional judgment on legal strategy cannot be automated.',
        mech: 'Adjusting claims (delegate data tasks) + Restating claims (preserve judgment work)'
      },
      creating: {
        desc: 'AI-identified patterns in contracts enable new proactive risk advisory services--reviewing 100% of supplier contracts instead of samples.',
        mech: 'Defining new domains (compliance → advisory pivot)'
      },
      negotiating: {
        desc: 'Legal technologists join client meetings to explain AI capabilities, gaining access to traditionally sacrosanct lawyer-client spaces.',
        mech: 'Boundary bridging (collaborate with technologists)'
      },
      coalescing: {
        desc: 'Firm creates "Principal" titles for data scientists and project managers, allowing non-lawyers into partnership decision-making.',
        mech: 'Redefining boundary exclusions (partnership reform)'
      },
      ties: [
        { from: 'Defending', to: 'Creating', type: 'opportunity', desc: 'Adjusted claims legitimating AI for data tasks enable expansion into advisory services combining AI insights with legal judgment.' },
        { from: 'Creating', to: 'Negotiating', type: 'necessity', desc: 'New risk advisory services require technologists to configure AI systems and interpret outputs--boundary bridging becomes necessary.' },
        { from: 'Negotiating', to: 'Coalescing', type: 'necessity', desc: "Technologists' central role in service delivery requires partnership reform--can't sustain collaboration if they lack authority." }
      ],
      outcome: {
        status: 'Maintained (reconfigured role)',
        services: 'Proactive contract risk analysis, training services based on dispute patterns, data-driven litigation strategy',
        orgChange: 'Data scientists and project managers gain partnership roles; flatter management structure; technologists authorize process changes'
      }
    },
    'accounting-audit': {
      name: 'Accounting: AI Audit Sampling',
      defending: {
        desc: 'Accountants delegate sample selection to InFlo/Mindbridge, emphasizing that interpreting risk patterns and making audit conclusions require professional expertise.',
        mech: 'Adjusting claims (AI handles "admin" work) + Restating claims (professional judgment essential)'
      },
      creating: {
        desc: 'AI enables 100% transaction review (vs. samples), allowing new business advisory services based on operational inefficiency patterns.',
        mech: 'Defining new domains (audit compliance → business consulting)'
      },
      negotiating: {
        desc: 'Data scientists with accounting/tech backgrounds join audit teams, providing first-level interpretation of AI-flagged risks.',
        mech: 'Boundary bridging (20% new hires as data scientists)'
      },
      coalescing: {
        desc: 'Partnership model evolves--technologists gain partner status based on client value delivered, not just traditional audit credentials.',
        mech: 'Redefining exclusions (non-accountant partners allowed)'
      },
      ties: [
        { from: 'Defending', to: 'Creating', type: 'opportunity', desc: 'Relinquishing sample selection creates time for consultancy work and positions AI as efficiency tool enabling higher-value services.' },
        { from: 'Creating', to: 'Negotiating', type: 'necessity', desc: 'Advisory services depend on robust data processes and AI configuration--requires technologist expertise at operational level.' },
        { from: 'Negotiating', to: 'Coalescing', type: 'necessity', desc: "Technologists' role in client delivery and revenue generation necessitates authority--partnership becomes necessary retention mechanism." }
      ],
      outcome: {
        status: 'Strengthened (expanded jurisdiction)',
        services: '100% audit coverage, real-time anomaly detection, operational efficiency consulting, predictive risk modeling',
        orgChange: 'Data scientists as partners; technologists manage audit processes; shift from hourly billing to value-based fees'
      }
    },
    'law-contract': {
      name: 'Law: Contract Review Automation',
      defending: {
        desc: 'Junior lawyers stop manual clause-by-clause review as LawGeex automates standard contract checking. Senior lawyers emphasize bespoke negotiation skills.',
        mech: 'Adjusting claims (automation for routine work) + Restating claims (complex negotiation irreplaceable)'
      },
      creating: {
        desc: 'Automated contract generation frees capacity for new services: pre-emptive contract audits, supplier risk scoring, real-time compliance checking.',
        mech: 'Defining new domains (reactive → proactive legal services)'
      },
      negotiating: {
        desc: 'Legal process managers and knowledge engineers become essential team members, designing contract templates and AI workflows.',
        mech: 'Boundary bridging (new roles: legal project manager, knowledge engineer)'
      },
      coalescing: {
        desc: 'Process managers gain authority to standardize lawyer workflows, challenging traditional professional autonomy over means and methods.',
        mech: 'Redefining exclusions (non-lawyers manage lawyer practices)'
      },
      ties: [
        { from: 'Defending', to: 'Creating', type: 'opportunity', desc: 'Time saved on routine contracts enables scaling into new service areas that were previously too resource-intensive.' },
        { from: 'Defending', to: 'Negotiating', type: 'necessity', desc: "Automation requires standardized processes and data formats--can't work if every lawyer has their own method." },
        { from: 'Negotiating', to: 'Coalescing', type: 'necessity', desc: "Process managers must have authority to enforce standards, otherwise collaboration fails and AI benefits don't materialize." }
      ],
      outcome: {
        status: 'Reconfigured (process-oriented)',
        services: 'Automated contract generation, portfolio risk analysis, continuous compliance monitoring, supplier relationship management',
        orgChange: 'Process managers authorize workflow changes; standardized practices replace individual lawyer autonomy; hybrid billing models'
      }
    },
    'accounting-advisory': {
      name: 'Accounting: Advisory Service Pivot',
      defending: {
        desc: 'Accountants frame AI-driven compliance work as "low-value" and reemphasize strategic business advisory as their core professional contribution.',
        mech: 'Adjusting claims (compliance devalued) + Restating claims (consultancy valued higher)'
      },
      creating: {
        desc: 'AI transaction analysis reveals business inefficiencies, enabling new consulting services that combine data insights with financial expertise.',
        mech: 'Defining new domains (compliance firm → advisory firm transformation)'
      },
      negotiating: {
        desc: 'Data analysts and innovation officers join partnership track, recognized as essential to delivering AI-enabled advisory services.',
        mech: 'Boundary bridging (technologists in senior management)'
      },
      coalescing: {
        desc: 'Traditional audit partner model challenged--new partners based on advisory revenue, not just audit client portfolios.',
        mech: 'Redefining exclusions (partnership criteria evolve beyond traditional metrics)'
      },
      ties: [
        { from: 'Defending', to: 'Creating', type: 'opportunity', desc: 'Framing compliance as automated creates legitimacy for pivoting firm identity toward higher-margin advisory work.' },
        { from: 'Creating', to: 'Negotiating', type: 'necessity', desc: 'Advisory services depend on AI insights--accountants lack data science skills, so collaboration becomes mandatory.' },
        { from: 'Negotiating', to: 'Coalescing', type: 'necessity', desc: 'If technologists generate significant advisory revenue but lack partnership path, they leave--retention requires structural change.' }
      ],
      outcome: {
        status: 'Elevated (high-value consulting)',
        services: 'Strategic financial planning, operational optimization consulting, predictive modeling, business intelligence dashboards',
        orgChange: 'Technologists as equity partners; advisory revenue overtakes compliance; innovation officers in executive roles'
      }
    }
  };

  function init() {
    const scenarioSelect = document.getElementById('p50-scenario');
    if (!scenarioSelect) {
      console.warn('P50 interactive elements not found, skipping initialization');
      return;
    }

    scenarioSelect.addEventListener('change', updateDisplay);
    updateDisplay();
  }

  function updateDisplay() {
    const scenarioSelect = document.getElementById('p50-scenario');
    if (!scenarioSelect) return;

    const scenarioKey = scenarioSelect.value;
    const scenario = SCENARIOS[scenarioKey];
    if (!scenario) return;

    const defendingDesc = document.getElementById('p50-defending-desc');
    const defendingMech = document.getElementById('p50-defending-mech');
    if (defendingDesc) defendingDesc.textContent = scenario.defending.desc;
    if (defendingMech) defendingMech.textContent = scenario.defending.mech;

    const creatingDesc = document.getElementById('p50-creating-desc');
    const creatingMech = document.getElementById('p50-creating-mech');
    if (creatingDesc) creatingDesc.textContent = scenario.creating.desc;
    if (creatingMech) creatingMech.textContent = scenario.creating.mech;

    const negotiatingDesc = document.getElementById('p50-negotiating-desc');
    const negotiatingMech = document.getElementById('p50-negotiating-mech');
    if (negotiatingDesc) negotiatingDesc.textContent = scenario.negotiating.desc;
    if (negotiatingMech) negotiatingMech.textContent = scenario.negotiating.mech;

    const coalescingDesc = document.getElementById('p50-coalescing-desc');
    const coalescingMech = document.getElementById('p50-coalescing-mech');
    if (coalescingDesc) coalescingDesc.textContent = scenario.coalescing.desc;
    if (coalescingMech) coalescingMech.textContent = scenario.coalescing.mech;

    const tiesContainer = document.getElementById('p50-ties');
    if (tiesContainer) {
      let tiesHTML = '';
      scenario.ties.forEach(tie => {
        const color = tie.type === 'opportunity' ? '#10b981' : '#f59e0b';
        const icon = tie.type === 'opportunity' ? '→' : '⇒';
        tiesHTML += '<div class="panel panel-neutral-soft p-3 space-y-1"><div class="flex items-center gap-2 text-xs font-semibold text-heading"><span style="color: ' + color + ';">' + icon + '</span><span>' + tie.from + ' ' + icon + ' ' + tie.to + '</span><span class="text-[11px] font-normal panel-muted">(' + tie.type + ' tie)</span></div><p class="text-xs text-body">' + tie.desc + '</p></div>';
      });
      tiesContainer.innerHTML = tiesHTML;
    }

    const statusEl = document.getElementById('p50-status');
    const servicesEl = document.getElementById('p50-services');
    const orgChangeEl = document.getElementById('p50-org-change');
    if (statusEl) statusEl.textContent = scenario.outcome.status;
    if (servicesEl) servicesEl.textContent = scenario.outcome.services;
    if (orgChangeEl) orgChangeEl.textContent = scenario.outcome.orgChange;
  }

  function interactiveScript() {
    setTimeout(function() { init(); }, 0);
  }

  interactiveScript.init = init;
  interactiveScript.updateDisplay = updateDisplay;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
