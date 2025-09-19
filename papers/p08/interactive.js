const interactiveScript = () => {
  const root = document.getElementById('p08-explorer');
  if (!root) return;

  const VIEWS = {
    adoption: {
      label: 'Adoption & trust snapshot',
      heading: 'How many voters already lean on chatbots?',
      subheading: 'Scale reported 2024 usage to your electorate size',
      insights: [
        'Of eligible UK voters, 13% used a chatbot for election research; that share already rivals radio and newspapers.',
        'Among chatbot users, 89% rated answers useful and 87% called them accurate, so adoption is unlikely to retreat on its own.'
      ],
      actions: [
        'Instrument your own assistant funnel with a similar sentiment pulse (useful vs accurate vs biased).',
        'Plan civic safeguards for tens of percent adoption rather than treating chatbot usage as fringe.'
      ]
    },
    knowledge: {
      label: 'Belief shifts vs. search',
      heading: 'Compare belief change after research',
      subheading: 'Likert deltas for true vs. false statements across topics',
      insights: [
        'Across climate, immigration, criminal justice, and COVID policy, chatbots matched search at lifting true beliefs and lowering misinformation.',
        'Net epistemic gain (true minus false agreement) stayed positive for every topic in both channels, suggesting guardrails generalise.'
      ],
      actions: [
        'Track pre/post belief surveys when deploying assistants on policy or compliance topics.',
        'Anchor evaluation to belief deltas rather than single-response accuracy alone.'
      ]
    },
    prompts: {
      label: 'Prompt stress tests',
      heading: 'Do persuasive prompts move the needle?',
      subheading: 'GPT-4o with neutral, persuasive, or sycophantic system messages',
      insights: [
        'Even when asked to agree with the user or push a random stance, GPT-4o delivered belief shifts statistically indistinguishable from baseline.',
        'Guardrails together with refusal behaviour limited both misinformation uptake and extremism shifts.'
      ],
      actions: [
        'Reuse these prompt templates in red/blue team drills to monitor drift over time.',
        'Document residual differences (even if small) and route them to policy/legal stakeholders.'
      ]
    }
  };

  const adoptionStats = {
    chatbotUserShare: 0.09,
    politicsShare: 0.32,
    voterShare: 0.13,
    perceivedUseful: 0.89,
    perceivedAccurate: 0.87,
    neutralGuardrail: 0.62
  };

  const beliefBase = { preTrue: 4.4, preFalse: 3.4 };
  const beliefTopics = {
    Aggregate: {
      convAI: { trueShift: 0.52, falseShift: -0.24 },
      search: { trueShift: 0.50, falseShift: -0.23 }
    },
    'Climate change': {
      convAI: { trueShift: 0.55, falseShift: -0.27 },
      search: { trueShift: 0.54, falseShift: -0.25 }
    },
    Immigration: {
      convAI: { trueShift: 0.48, falseShift: -0.21 },
      search: { trueShift: 0.47, falseShift: -0.20 }
    },
    'Criminal justice': {
      convAI: { trueShift: 0.50, falseShift: -0.22 },
      search: { trueShift: 0.49, falseShift: -0.21 }
    },
    'COVID policy': {
      convAI: { trueShift: 0.54, falseShift: -0.26 },
      search: { trueShift: 0.52, falseShift: -0.24 }
    }
  };

  const promptData = {
    neutral: { label: 'Neutral baseline', trueShift: 0.26, falseShift: -0.21 },
    persuasive: { label: 'Persuasive (random stance)', trueShift: 0.25, falseShift: -0.19 },
    sycophantic: { label: 'Sycophantic (mirror user)', trueShift: 0.24, falseShift: -0.18 }
  };

  const stageHeadingEl = document.getElementById('p08-stage-heading');
  const stageSubheadingEl = document.getElementById('p08-stage-subheading');
  const stageLabelEl = document.getElementById('p08-stage-label');
  const stageControlsEl = document.getElementById('p08-stage-controls');
  const insightsEl = document.getElementById('p08-insights');
  const actionsEl = document.getElementById('p08-actions');
  const viewButtonsEl = document.getElementById('p08-views');

  let currentView = 'adoption';

  const formatPercent = value => Math.round(value * 1000) / 10 + '%';
  const clampLikert = value => Math.min(7, Math.max(1, value));

  const renderButtons = () => {
    const html = Object.entries(VIEWS).map(([key, meta]) => {
      const active = key === currentView;
      const classes = ['px-3','py-1.5','rounded-md','border','text-xs','font-medium','transition-colors'];
      if (active) {
        classes.push('bg-indigo-600','border-indigo-600','text-white','shadow-sm');
      } else {
        classes.push('bg-white','border-gray-300','text-gray-700','hover:border-indigo-400','hover:text-indigo-600');
      }
      return `<button type="button" class="${classes.join(' ')}" data-view="${key}">${meta.label}</button>`;
    }).join('');
    viewButtonsEl.innerHTML = html;
    viewButtonsEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentView = btn.dataset.view;
        renderButtons();
        update();
      });
    });
  };

  const updateAdoptionView = () => {
    stageHeadingEl.textContent = VIEWS.adoption.heading;
    stageSubheadingEl.textContent = VIEWS.adoption.subheading;

    const controls = [];
    controls.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Eligible voters (millions)</label>' +
        '<input id="p08-electorate" type="range" min="10" max="60" step="1" value="47" class="w-full">' +
        '<p class="text-xs">Current value: <span class="font-mono" id="p08-electorate-label">47</span> million</p>' +
      '</div>'
    );
    controls.push(
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-1 text-[11px]" id="p08-adoption-stats"></div>'
    );
    stageControlsEl.innerHTML = controls.join('');

    const electorateSlider = document.getElementById('p08-electorate');
    const electorateLabel = document.getElementById('p08-electorate-label');
    const statsEl = document.getElementById('p08-adoption-stats');

    const formatMillions = (value) => `${(Math.round(value * 10) / 10).toFixed(1)}M`;

    const recalc = () => {
      const electorate = Number(electorateSlider.value);
      electorateLabel.textContent = electorate.toFixed(0);
      const chatbotUsers = electorate * adoptionStats.chatbotUserShare;
      const policyResearchers = chatbotUsers * adoptionStats.politicsShare;
      const votersUsing = electorate * adoptionStats.voterShare;
      stageLabelEl.textContent = `≈ ${votersUsing.toFixed(1)} million voters`;
      if (statsEl) {
        statsEl.innerHTML = `
          <p><strong>Usage breakdown (scaled):</strong></p>
          <p>Chatbot users among adults: ${formatPercent(adoptionStats.chatbotUserShare)} → ${formatMillions(chatbotUsers)}</p>
          <p>Political researchers among chatbot users: ${formatPercent(adoptionStats.politicsShare)} → ${formatMillions(policyResearchers)}</p>
          <p>Eligible voters using chatbots for politics: ${formatPercent(adoptionStats.voterShare)} → ${formatMillions(votersUsing)}</p>
          <p>Perceived useful / accurate: ${formatPercent(adoptionStats.perceivedUseful)} & ${formatPercent(adoptionStats.perceivedAccurate)}</p>
          <p>Perceived neutral guardrails: ${formatPercent(adoptionStats.neutralGuardrail)}</p>
        `;
      }
    };

    electorateSlider.addEventListener('input', recalc);
    recalc();
  };

  const updateKnowledgeView = () => {
    stageHeadingEl.textContent = VIEWS.knowledge.heading;
    stageSubheadingEl.textContent = VIEWS.knowledge.subheading;

    const topicOptions = Object.keys(beliefTopics).map(name => `<option value="${name}">${name}</option>`).join('');

    stageControlsEl.innerHTML = [
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Channel</label>' +
        '<select id="p08-channel" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">' +
          '<option value="convAI">Conversational AI</option>' +
          '<option value="search">Internet search</option>' +
        '</select>' +
        '<p class="text-[11px] text-indigo-800">Data reflects net belief change per topic.</p>' +
      '</div>',
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">Topic</label>' +
        `<select id="p08-topic" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">${topicOptions}</select>` +
        '<div id="p08-topic-details" class="text-[11px] space-y-1"></div>' +
      '</div>'
    ].join('');

    const channelSelect = document.getElementById('p08-channel');
    const topicSelect = document.getElementById('p08-topic');
    const detailsEl = document.getElementById('p08-topic-details');

    const render = () => {
      const topic = topicSelect.value;
      const channel = channelSelect.value;
      const deltas = beliefTopics[topic]?.[channel];
      if (!deltas) {
        stageLabelEl.textContent = '-';
        detailsEl.textContent = 'No data';
        return;
      }
      const postTrue = clampLikert(beliefBase.preTrue + deltas.trueShift);
      const postFalse = clampLikert(beliefBase.preFalse + deltas.falseShift);
      const net = postTrue - postFalse;
      stageLabelEl.textContent = `Net gap ≈ ${net.toFixed(2)} Likert pts`;
      detailsEl.innerHTML = `
        <p>Pre true belief: ${beliefBase.preTrue.toFixed(1)} -> Post: ${postTrue.toFixed(1)}</p>
        <p>Pre misinformation belief: ${beliefBase.preFalse.toFixed(1)} -> Post: ${postFalse.toFixed(1)}</p>
        <p>True shift: +${deltas.trueShift.toFixed(2)} | False shift: ${deltas.falseShift.toFixed(2)}</p>
      `;
    };

    channelSelect.addEventListener('change', render);
    topicSelect.addEventListener('change', render);
    render();
  };

  const updatePromptView = () => {
    stageHeadingEl.textContent = VIEWS.prompts.heading;
    stageSubheadingEl.textContent = VIEWS.prompts.subheading;

    const options = Object.entries(promptData).map(([key, meta]) => `<option value="${key}">${meta.label}</option>`).join('');

    stageControlsEl.innerHTML = [
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<label class="text-[11px] font-semibold text-indigo-700 uppercase">System prompt</label>' +
        `<select id="p08-prompt" class="w-full border border-indigo-200 rounded px-2 py-1 text-sm">${options}</select>` +
        '<p class="text-[11px] text-indigo-800">Prompts mirror the paper\'s persuasive and sycophantic treatments.</p>' +
      '</div>',
      '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2" id="p08-prompt-details"></div>'
    ].join('');

    const select = document.getElementById('p08-prompt');
    const detailsEl = document.getElementById('p08-prompt-details');

    const render = () => {
      const data = promptData[select.value];
      if (!data) {
        stageLabelEl.textContent = '-';
        detailsEl.textContent = 'No data';
        return;
      }
      const postTrue = clampLikert(beliefBase.preTrue + data.trueShift);
      const postFalse = clampLikert(beliefBase.preFalse + data.falseShift);
      const net = postTrue - postFalse;
      stageLabelEl.textContent = `Net gap ≈ ${net.toFixed(2)} Likert pts`;
      detailsEl.innerHTML = `
        <p class="text-xs">True belief shift: +${data.trueShift.toFixed(2)}</p>
        <p class="text-xs">False belief shift: ${data.falseShift.toFixed(2)}</p>
        <p class="text-xs">Post true: ${postTrue.toFixed(1)} | Post false: ${postFalse.toFixed(1)}</p>
      `;
    };

    select.addEventListener('change', render);
    render();
  };

  const update = () => {
    const view = VIEWS[currentView];
    if (!view) return;
    insightsEl.innerHTML = view.insights.map(text => `<p>${text}</p>`).join('');
    actionsEl.innerHTML = view.actions.map(text => `<li>${text}</li>`).join('');

    if (currentView === 'adoption') {
      updateAdoptionView();
    } else if (currentView === 'knowledge') {
      updateKnowledgeView();
    } else {
      updatePromptView();
    }
  };

  renderButtons();
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}



