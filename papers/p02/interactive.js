const interactiveScript = () => {
  const root = document.getElementById('p02-explorer');
  if (!root) return;

  const noveltyInput = document.getElementById('p02-novelty');
  const noveltyLabel = document.getElementById('p02-novelty-label');
  const temperatureInput = document.getElementById('p02-temperature');
  const temperatureLabel = document.getElementById('p02-temperature-label');

  const retrievalInput = document.getElementById('p02-retrieval');
  const rewardInput = document.getElementById('p02-reward');
  const gatingInput = document.getElementById('p02-gating');

  const riskLabel = document.getElementById('p02-risk-label');
  const riskBar = document.getElementById('p02-risk-bar');
  const riskNote = document.getElementById('p02-risk-note');
  const insightEl = document.getElementById('p02-insight');

  const scenarioSelect = document.getElementById('p02-scenario');
  const simSummaryEl = document.getElementById('p02-sim-summary');
  const simTableEl = document.getElementById('p02-sim-table');

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const scenarios = {
    support: {
      label: 'Customer support KB',
      description: 'Agents answer long-tail user questions with a knowledge base of FAQ snippets and troubleshooting guides.',
      prompts: [
        { name: '“How do I undo a workspace merge from last year?”', needsGrounding: true },
        { name: '“Can you explain why my webhook retries stopped after 5 attempts?”', needsGrounding: true },
        { name: '“Is there a way to import Zendesk macros?”', needsGrounding: false },
        { name: '“List every API change since v2.1”', needsGrounding: true },
        { name: '“Why are my invoices missing VAT?”', needsGrounding: true }
      ]
    },
    policy: {
      label: 'Policy & compliance',
      description: 'Risk teams query contractual clauses and regulatory memos. Missing evidence is high impact.',
      prompts: [
        { name: '“Does SOC 2 require customer breach notifications within 24h?”', needsGrounding: true },
        { name: '“Quote the clause that defines data retention for EU residents.”', needsGrounding: true },
        { name: '“Are subcontractors covered by our confidentiality policy?”', needsGrounding: true },
        { name: '“Summarise our HIPAA BA obligations.”', needsGrounding: true },
        { name: '“What is the maximum liability cap in our master agreement?”', needsGrounding: true }
      ]
    },
    creative: {
      label: 'Creative assistant',
      description: 'Generative ideation and storytelling tasks where hallucinations are acceptable unless the user expects facts.',
      prompts: [
        { name: '“Write a whimsical product description for holographic notebooks.”', needsGrounding: false },
        { name: '“Draft a bedtime story about a data center that learns to sing.”', needsGrounding: false },
        { name: '“Brainstorm taglines for a privacy-first analytics tool.”', needsGrounding: false },
        { name: '“Suggest plot twists for a sci-fi detective novel.”', needsGrounding: false },
        { name: '“Invent fictional awards our company could jokingly celebrate.”', needsGrounding: false }
      ]
    }
  };

  const formatPercent = value => `${Math.round(value * 100)}%`;

  const calculateRisk = () => {
    const novelty = Number(noveltyInput.value) / 100;
    const temperature = Number(temperatureInput.value);
    const retrieval = retrievalInput.checked;
    const reward = rewardInput.checked;
    const gating = gatingInput.checked;

    const noveltyContribution = novelty * 0.7;
    const temperatureContribution = clamp((temperature - 0.2) / 1.2, 0, 1) * 0.2;
    let risk = clamp(noveltyContribution + temperatureContribution, 0, 0.95);

    if (retrieval) {
      const reduction = 0.25 * (0.5 + novelty / 2);
      risk *= clamp(1 - reduction, 0.2, 1);
    }
    if (reward) {
      risk *= 0.75;
    }
    if (gating) {
      risk *= 0.7;
    }

    return clamp(risk, 0.01, 0.95);
  };

  const updateUI = () => {
    const noveltyVal = Number(noveltyInput.value);
    noveltyLabel.textContent = `${noveltyVal}%`;
    const tempVal = Number(temperatureInput.value);
    temperatureLabel.textContent = tempVal.toFixed(2);

    const risk = calculateRisk();
    riskLabel.textContent = formatPercent(risk);
    riskBar.style.width = `${Math.round(risk * 100)}%`;
    riskBar.classList.remove('bg-emerald-500', 'bg-amber-500', 'bg-rose-500');
    if (risk <= 0.25) {
      riskBar.classList.add('bg-emerald-500');
      riskNote.textContent = 'Risk is low: prompts stay on-manifold or mitigations are strong. Continue monitoring calibration drift.';
    } else if (risk <= 0.55) {
      riskBar.classList.add('bg-amber-500');
      riskNote.textContent = 'Moderate risk: combine retrieval with reward shaping or gating, and track residual hallucinations.';
    } else {
      riskBar.classList.add('bg-rose-500');
      riskNote.textContent = 'High risk of hallucination. Add grounding, tighten decoding, or fall back to human review.';
    }

    const mitigationBadges = [
      retrievalInput.checked ? 'Grounded via retrieval' : 'No retrieval evidence',
      rewardInput.checked ? 'Reward model discourages unsupported answers' : 'No reward shaping',
      gatingInput.checked ? 'Uncertainty gating enabled' : 'No gating'
    ];

    insightEl.innerHTML = `
      <h4 class="text-sm font-semibold text-orange-900 mb-2">Why this configuration behaves this way</h4>
      <ul class="text-sm text-orange-800 space-y-2">
      <li>Prompt novelty contributes ${Math.round((noveltyVal / 100) * 70)} points of hallucination pressure. Use novelty to unlock new use cases, but pair it with grounding or fine-tuning to stay factual.</li>
      <li>Temperature ${tempVal.toFixed(2)} adds ${Math.round(clamp((tempVal - 0.2) / 1.2, 0, 1) * 20)} points of randomness. Dial it up for richer phrasing; dial it down when accuracy is critical.</li>
        <li>Mitigations active: ${mitigationBadges.join(' • ')}.</li>
      </ul>
      <p class="text-xs text-orange-700 mt-2">The paper shows mitigations work best in concert: retrieval alters the candidate pool, reward shaping adjusts logits, and gating routes residual uncertainty.</p>
    `;

    runSimulation();
  };

  const runSimulation = () => {
    const scenario = scenarios[scenarioSelect.value] || scenarios.support;
    const risk = calculateRisk();
    const prompts = scenario.prompts;

    let groundedCount = 0;
    const rows = prompts.map((prompt, index) => {
      const mitigationMultiplier = retrievalInput.checked && prompt.needsGrounding ? 0.4 : 1;
      const effectiveRisk = clamp(risk * mitigationMultiplier, 0, 0.99);
      const hallucinated = Math.random() < effectiveRisk;
      if (!hallucinated) groundedCount += 1;

      const rowClass = hallucinated ? 'border border-rose-200 bg-rose-50' : 'border border-emerald-200 bg-emerald-50';
      const statusClass = hallucinated ? 'text-rose-600' : 'text-emerald-600';
      const statusLabel = hallucinated ? 'Hallucinated' : 'Grounded';
      const hint = hallucinated && prompt.needsGrounding
        ? 'Expand retrieval coverage or enforce tool use.'
        : hallucinated
          ? 'Use uncertainty gating or human escalation.'
          : 'Answer grounded in the retrieved evidence.';

      return `<div class="rounded-md px-3 py-2 text-xs text-gray-700 ${rowClass}">
        <div class="flex items-center justify-between gap-2">
          <span class="font-semibold text-sm">${index + 1}. ${prompt.name}</span>
          <span class="font-semibold ${statusClass}">${statusLabel}</span>
        </div>
        <p class="mt-1 text-[11px] text-gray-600">${hint}</p>
      </div>`;
    });

    const groundedRate = groundedCount / prompts.length;
    simSummaryEl.textContent = `${scenario.label}: grounded answers ${groundedCount}/${prompts.length} (${formatPercent(groundedRate)}). ${scenario.description}`;
    simTableEl.innerHTML = rows.join('');
  };

  noveltyInput.addEventListener('input', updateUI);
  temperatureInput.addEventListener('input', updateUI);
  [retrievalInput, rewardInput, gatingInput].forEach(input => {
    input.addEventListener('change', updateUI);
  });

  scenarioSelect.addEventListener('change', () => {
    runSimulation();
  });

  updateUI();
  runSimulation();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper02Interactive = interactiveScript;
}
