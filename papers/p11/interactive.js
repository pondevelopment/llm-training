const interactiveScript = () => {
  const root = document.getElementById('p11-lab');
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll('.p11-scenario-btn'));
  const truthEl = document.getElementById('p11-metric-truth');
  const misinfoEl = document.getElementById('p11-metric-misinfo');
  const polarEl = document.getElementById('p11-metric-polar');
  const channelGridEl = document.getElementById('p11-channel-grid');
  const channelLabelEl = document.getElementById('p11-channel-label');
  const summaryEl = document.getElementById('p11-summary');
  const actionsEl = document.getElementById('p11-actions');

  const formatPercent = (share) => `${(share * 100).toFixed(0)}%`;

  const SCENARIOS = {
    digital: {
      label: '2010s digital platforms',
      truthIndex: 94,
      misinfoShare: 0.34,
      polarisation: 0.32,
      channels: [
        {
          title: 'Processing & transmission',
          status: 'Algorithmic feeds speed discovery but still rely on human sourcing.',
          note: 'Platforms amplify reach yet the underlying reporting cadence stays human-paced.'
        },
        {
          title: 'Producer monetisation',
          status: 'Aggregators skim ad/data revenue yet still redirect clicks.',
          note: 'Investigative desks survive on a mix of ads, subscriptions, and limited platform deals.'
        },
        {
          title: 'Cost of misinformation',
          status: 'Content farms remain labour-intensive.',
          note: 'False narratives need staff or botnets, keeping marginal costs above zero.'
        },
        {
          title: 'Consumer screening',
          status: 'Readers use heuristics and brand cues.',
          note: 'Moderate skill; misinformation spreads but can be contained with fact-checking labels.'
        }
      ],
      summary: 'Digital platforms already distort incentives, yet investigative reporting remains viable because lies are still costly and some traffic flows back to publishers.',
      actions: [
        'Fund cross-platform fact-check collaborations to patch medium screening skill.',
        'Negotiate traffic guarantees or licensing so publisher revenue does not erode further.'
      ]
    },
    'ai-unregulated': {
      label: 'AI surge, weak guardrails',
      truthIndex: 65,
      misinfoShare: 0.55,
      polarisation: 0.61,
      channels: [
        {
          title: 'Processing & transmission',
          status: 'Generative answers collapse time-to-news.',
          note: 'Chat assistants recombine content instantly, sidelining source context.'
        },
        {
          title: 'Producer monetisation',
          status: 'Visit leakage becomes severe.',
          note: 'Users stay inside the platform interface, so ads/data no longer fund reporters.'
        },
        {
          title: 'Cost of misinformation',
          status: 'Marginal cost approaches zero.',
          note: 'Synthetic media and bots flood the ecosystem with persuasive falsehoods.'
        },
        {
          title: 'Consumer screening',
          status: 'Assistants miscalibrate trust.',
          note: 'Polished delivery increases credulity while disclosure of uncertainty stays weak.'
        }
      ],
      summary: 'Absent accountability, AI makes lying cheap, truthful supply unprofitable, and polarisation self-reinforcing despite unprecedented distribution efficiency.',
      actions: [
        'Tie AI launch gates to independent accuracy audits and provenance logging.',
        'Set liability so repeat misinformation triggers fines or ranked demotion that restore truthful payoffs.'
      ]
    },
    'ai-guarded': {
      label: 'AI with accountability',
      truthIndex: 108,
      misinfoShare: 0.27,
      polarisation: 0.34,
      channels: [
        {
          title: 'Processing & transmission',
          status: 'AI summarisation carries provenance.',
          note: 'Generated answers include source citations and freshness signals by default.'
        },
        {
          title: 'Producer monetisation',
          status: 'Licensing plus subsidies backstop investigations.',
          note: 'Revenue shares, micropayments, and public funds offset traffic lost to AI interfaces.'
        },
        {
          title: 'Cost of misinformation',
          status: 'Enforcement raises the price of deception.',
          note: 'Watermarking, takedown SLAs, and penalties keep synthetic falsehoods rare.'
        },
        {
          title: 'Consumer screening',
          status: 'AI copilots highlight reliability cues.',
          note: 'Users see credibility scores, counterpoints, and uncertainty prompts before sharing.'
        }
      ],
      summary: 'When accountability, licensing, and consumer tools move together, AI efficiencies boost truth supply instead of hollowing it out.',
      actions: [
        'Ship consumer co-pilots that surface reliability diagnostics next to generated claims.',
        'Pool platform and public funding to pay investigative outlets when AI answers reuse their work.'
      ]
    }
  };

  const setActiveButton = (scenarioKey) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.scenario === scenarioKey;
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.classList.toggle('toggle-active', isActive);
      button.classList.toggle('toggle-inactive', !isActive);
    });
  };

  const render = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.digital;
    setActiveButton(scenarioKey);
    truthEl.textContent = scenario.truthIndex.toString();
    misinfoEl.textContent = formatPercent(scenario.misinfoShare);
    polarEl.textContent = formatPercent(scenario.polarisation);
    channelLabelEl.textContent = scenario.label;
    channelGridEl.innerHTML = scenario.channels
      .map((channel) => `
        <article class="panel panel-neutral-soft p-3 space-y-2">
          <div class="text-xs font-semibold text-heading">${channel.title}</div>
          <p class="text-xs text-body">${channel.status}</p>
          <p class="text-xs panel-muted">${channel.note}</p>
        </article>
      `)
      .join('');
    summaryEl.textContent = scenario.summary;
    actionsEl.innerHTML = scenario.actions.map((item) => `<li>${item}</li>`).join('');
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      render(button.dataset.scenario);
    });
  });

  render('digital');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper11Interactive = interactiveScript;
}
